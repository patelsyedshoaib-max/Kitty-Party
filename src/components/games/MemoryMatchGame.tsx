import React, { useState, useEffect } from 'react';
import { MEMORY_CARDS_DATA } from '../../data/gamesData';
import { sound, triggerHaptic } from '../../utils/audio';
import { Timer, RotateCcw, Trophy, Sparkles } from 'lucide-react';

interface CardItem {
  instanceId: number;
  cardId: string;
  symbol: string;
  label: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryMatchProps {
  onComplete: (score: number, winnerName?: string) => void;
  currentPlayerName: string;
}

export const MemoryMatchGame: React.FC<MemoryMatchProps> = ({ onComplete, currentPlayerName }) => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const initGame = () => {
    // Duplicate 8 cards to make 16 cards
    const deck: CardItem[] = [];
    MEMORY_CARDS_DATA.forEach((item, idx) => {
      deck.push({
        instanceId: idx * 2,
        cardId: item.id,
        symbol: item.symbol,
        label: item.label,
        isFlipped: false,
        isMatched: false,
      });
      deck.push({
        instanceId: idx * 2 + 1,
        cardId: item.id,
        symbol: item.symbol,
        label: item.label,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle
    deck.sort(() => Math.random() - 0.5);
    setCards(deck);
    setSelectedCards([]);
    setMoves(0);
    setMatchedPairs(0);
    setTimeElapsed(0);
    setIsGameOver(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  // Timer
  useEffect(() => {
    if (isGameOver) return;
    const timer = setInterval(() => {
      setTimeElapsed((t) => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isGameOver]);

  const handleCardClick = (instanceId: number) => {
    if (selectedCards.length === 2) return;
    const card = cards.find((c) => c.instanceId === instanceId);
    if (!card || card.isFlipped || card.isMatched) return;

    sound.playClick();
    triggerHaptic('light');

    // Flip card
    const nextCards = cards.map((c) =>
      c.instanceId === instanceId ? { ...c, isFlipped: true } : c
    );
    setCards(nextCards);

    const newSelected = [...selectedCards, instanceId];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setMoves((m) => m + 1);
      const card1 = cards.find((c) => c.instanceId === newSelected[0]);
      const card2 = card;

      if (card1 && card2 && card1.cardId === card2.cardId) {
        // Matched!
        setTimeout(() => {
          sound.playSuccess();
          triggerHaptic('success');
          setCards((prev) =>
            prev.map((c) =>
              c.cardId === card1.cardId ? { ...c, isMatched: true } : c
            )
          );
          setSelectedCards([]);
          setMatchedPairs((mp) => {
            const next = mp + 1;
            if (next === MEMORY_CARDS_DATA.length) {
              setIsGameOver(true);
              sound.playFanfare();
            }
            return next;
          });
        }, 500);
      } else {
        // Unmatched, flip back
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              newSelected.includes(c.instanceId) ? { ...c, isFlipped: false } : c
            )
          );
          setSelectedCards([]);
        }, 900);
      }
    }
  };

  const calculateFinalScore = () => {
    // Maximum 120 points, reduced for extra moves and slow time
    const timePenalty = Math.min(40, Math.floor(timeElapsed / 2));
    const movesPenalty = Math.max(0, (moves - 10) * 2);
    return Math.max(30, 120 - timePenalty - movesPenalty);
  };

  const handleFinish = () => {
    const finalScore = calculateFinalScore();
    onComplete(finalScore, currentPlayerName);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl border border-teal-200/50 dark:border-teal-900/30 shadow-xl">
      {/* Top HUD */}
      <div className="flex items-center justify-between pb-4 border-b border-teal-100 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-sm font-semibold text-teal-700 dark:text-teal-300">
            <Timer className="w-4 h-4" />
            <span className="font-mono tabular-nums">{timeElapsed}s</span>
          </div>
          <div className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            Moves: <span className="font-mono tabular-nums font-bold">{moves}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 px-3 py-1 rounded-full font-bold">
            Pairs: {matchedPairs}/{MEMORY_CARDS_DATA.length}
          </span>
          <button
            onClick={initGame}
            title="Reset board"
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid of 16 Cards */}
      <div className="grid grid-cols-4 gap-3 my-6">
        {cards.map((card) => {
          const isRevealed = card.isFlipped || card.isMatched;
          return (
            <button
              key={card.instanceId}
              onClick={() => handleCardClick(card.instanceId)}
              disabled={isRevealed || selectedCards.length === 2}
              className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-2 text-center transition-all duration-300 transform active:scale-95 cursor-pointer shadow-sm border ${
                card.isMatched
                  ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-400 dark:border-teal-700 opacity-90 scale-95'
                  : isRevealed
                  ? 'bg-gradient-to-tr from-teal-500 to-emerald-400 border-teal-300 text-white shadow-md'
                  : 'bg-gradient-to-tr from-slate-100 to-pink-50 dark:from-slate-800 dark:to-slate-800/60 border-pink-200/60 dark:border-slate-700 hover:border-pink-300 dark:hover:border-slate-600'
              }`}
            >
              {isRevealed ? (
                <>
                  <span className="text-3xl md:text-4xl filter drop-shadow select-none mb-1">
                    {card.symbol}
                  </span>
                  <span className="text-[10px] font-bold text-slate-800 dark:text-slate-100 truncate w-full px-1">
                    {card.label}
                  </span>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-pink-400/60 dark:text-slate-500">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                  <span className="text-[10px] uppercase font-bold tracking-wider mt-1">Kitty</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Victory modal / prompt */}
      {isGameOver && (
        <div className="p-6 bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-pink-500/10 border border-teal-300 dark:border-teal-700 rounded-2xl text-center">
          <Trophy className="w-12 h-12 text-amber-500 mx-auto mb-2 animate-bounce" />
          <h3 className="text-xl font-serif-display font-bold text-slate-800 dark:text-white">
            Memory Master! All Pairs Matched!
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
            Completed in <span className="font-bold text-teal-600">{timeElapsed} seconds</span> with <span className="font-bold">{moves} moves</span>!
          </p>
          <div className="text-2xl font-black text-amber-500 font-mono mb-4">
            +{calculateFinalScore()} Points Awarded!
          </div>
          <button
            onClick={handleFinish}
            className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg transition-all cursor-pointer"
          >
            Claim Score & Continue 🏆
          </button>
        </div>
      )}
    </div>
  );
};

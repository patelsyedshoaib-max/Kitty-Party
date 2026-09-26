import React, { useState, useEffect } from 'react';
import { GUESS_WORD_ITEMS, GuessWordItem } from '../../data/gamesData';
import { sound, triggerHaptic } from '../../utils/audio';
import { Lightbulb, Check, HelpCircle, ArrowRight, Sparkles } from 'lucide-react';

interface GuessWordProps {
  onComplete: (score: number, winnerName?: string) => void;
  currentPlayerName: string;
}

export const GuessWordGame: React.FC<GuessWordProps> = ({ onComplete, currentPlayerName }) => {
  const [items] = useState<GuessWordItem[]>(() => [...GUESS_WORD_ITEMS].sort(() => Math.random() - 0.5));
  const [itemIndex, setItemIndex] = useState(0);
  const [revealedClues, setRevealedClues] = useState(1);
  const [guessInput, setGuessInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [status, setStatus] = useState<'GUESSING' | 'CORRECT' | 'MISSED'>('GUESSING');
  const [score, setScore] = useState(0);

  const currentItem = items[itemIndex % items.length];

  // Reset when item changes
  useEffect(() => {
    setRevealedClues(1);
    setGuessInput('');
    setShowHint(false);
    setStatus('GUESSING');
  }, [itemIndex]);

  const revealNextClue = () => {
    if (revealedClues < 3) {
      sound.playClick();
      triggerHaptic('light');
      setRevealedClues((c) => c + 1);
    }
  };

  const getPointsForRound = () => {
    if (revealedClues === 1) return 100;
    if (revealedClues === 2) return 70;
    return 40;
  };

  const handleGuessSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanGuess = guessInput.trim().toUpperCase();
    const cleanAnswer = currentItem.word.toUpperCase();

    if (!cleanGuess) return;

    if (cleanGuess === cleanAnswer) {
      sound.playSuccess();
      triggerHaptic('success');
      const earned = getPointsForRound();
      setScore((s) => s + earned);
      setStatus('CORRECT');
    } else {
      sound.playBuzzer();
      triggerHaptic('warning');
      if (revealedClues < 3) {
        revealNextClue();
      }
    }
  };

  const handleNextWord = () => {
    if (itemIndex >= 2) {
      sound.playFanfare();
      onComplete(score, currentPlayerName);
    } else {
      setItemIndex((i) => i + 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl border border-purple-200/50 dark:border-purple-900/30 shadow-xl">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-purple-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <span className="text-sm font-bold text-purple-700 dark:text-purple-300">
            Word {itemIndex + 1} of 3
          </span>
          <span className="text-xs bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-full font-medium">
            {currentItem.category}
          </span>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-500 dark:text-slate-400">Total Score: </span>
          <span className="font-mono tabular-nums font-extrabold text-lg text-purple-600 dark:text-purple-400">
            {score} pts
          </span>
        </div>
      </div>

      {/* Clues Box */}
      <div className="my-6 space-y-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
          Progressive Clues (Solve with fewer clues for +100 pts)
        </div>

        {currentItem.clues.map((clue, idx) => {
          const isRevealed = idx < revealedClues;
          return (
            <div
              key={idx}
              className={`p-4 rounded-2xl transition-all duration-300 border ${
                isRevealed
                  ? 'bg-purple-50/70 dark:bg-purple-950/20 border-purple-200/80 dark:border-purple-800/40 text-slate-800 dark:text-slate-100 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 opacity-60'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  isRevealed ? 'bg-purple-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                }`}>
                  {idx + 1}
                </span>
                <p className="text-sm md:text-base font-medium leading-relaxed">
                  {isRevealed ? clue : '🔒 Clue locked. Reveal below or submit guess...'}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hint token */}
      {showHint ? (
        <div className="p-3 mb-5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 rounded-xl text-center">
          <span className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Letter Reveal: {currentItem.hints}
          </span>
        </div>
      ) : (
        <div className="flex justify-between items-center mb-5">
          {revealedClues < 3 ? (
            <button
              onClick={revealNextClue}
              className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 underline flex items-center gap-1 cursor-pointer"
            >
              Reveal Clue {revealedClues + 1} (Will reduce score to {revealedClues === 1 ? '70' : '40'} pts)
            </button>
          ) : <div />}
          <button
            onClick={() => {
              sound.playClick();
              setShowHint(true);
            }}
            className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 flex items-center gap-1 cursor-pointer ml-auto"
          >
            <HelpCircle className="w-3.5 h-3.5" /> Need a letter hint?
          </button>
        </div>
      )}

      {/* Input area */}
      {status === 'GUESSING' ? (
        <form onSubmit={handleGuessSubmit} className="flex gap-2">
          <input
            type="text"
            value={guessInput}
            onChange={(e) => setGuessInput(e.target.value)}
            placeholder="Type your guess here..."
            className="flex-1 px-4 py-3 rounded-xl border border-purple-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 uppercase tracking-wide"
            autoFocus
          />
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Guess
          </button>
        </form>
      ) : (
        <div className="p-6 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-center">
          <div className="text-3xl mb-1">🎉</div>
          <h4 className="text-xl font-bold text-emerald-800 dark:text-emerald-300">
            Correct! The word was "{currentItem.word}"
          </h4>
          <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium mb-4">
            +{getPointsForRound()} Points added to your scorecard!
          </p>
          <button
            onClick={handleNextWord}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow transition-all cursor-pointer inline-flex items-center gap-2"
          >
            {itemIndex >= 2 ? 'Complete Game' : 'Next Word'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

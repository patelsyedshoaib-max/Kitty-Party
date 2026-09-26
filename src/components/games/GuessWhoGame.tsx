import React, { useState } from 'react';
import { GUESS_WHO_ITEMS, GuessWhoItem } from '../../data/gamesData';
import { sound, triggerHaptic } from '../../utils/audio';
import { HelpCircle, Check, ArrowRight, UserCheck } from 'lucide-react';

interface GuessWhoProps {
  onComplete: (score: number, winnerName?: string) => void;
  currentPlayerName: string;
}

export const GuessWhoGame: React.FC<GuessWhoProps> = ({ onComplete, currentPlayerName }) => {
  const [items] = useState<GuessWhoItem[]>(() => [...GUESS_WHO_ITEMS].sort(() => Math.random() - 0.5));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealedClues, setRevealedClues] = useState(1);
  const [selectedGuess, setSelectedGuess] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const currentItem = items[currentIndex % items.length];

  // Options including correct answer + 3 random decoys
  const [options, setOptions] = useState<string[]>([]);

  React.useEffect(() => {
    const decoys = GUESS_WHO_ITEMS.filter((i) => i.name !== currentItem.name).map((i) => i.name);
    const shuffledDecoys = decoys.sort(() => Math.random() - 0.5).slice(0, 3);
    const combined = [currentItem.name, ...shuffledDecoys].sort(() => Math.random() - 0.5);
    setOptions(combined);
    setRevealedClues(1);
    setSelectedGuess(null);
    setIsAnswered(false);
  }, [currentIndex]);

  const handleRevealClue = () => {
    if (revealedClues < 3) {
      sound.playClick();
      triggerHaptic('light');
      setRevealedClues((c) => c + 1);
    }
  };

  const getPoints = () => {
    if (revealedClues === 1) return 100;
    if (revealedClues === 2) return 60;
    return 30;
  };

  const handleSelectOption = (name: string) => {
    if (isAnswered) return;
    setSelectedGuess(name);
    setIsAnswered(true);

    if (name === currentItem.name) {
      sound.playSuccess();
      triggerHaptic('success');
      setScore((s) => s + getPoints());
    } else {
      sound.playBuzzer();
      triggerHaptic('warning');
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 >= Math.min(3, items.length)) {
      sound.playFanfare();
      onComplete(score, currentPlayerName);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl border border-violet-200/50 dark:border-violet-900/30 shadow-xl">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-violet-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-violet-500" />
          <span className="text-sm font-bold text-violet-800 dark:text-violet-300">
            Mystery Profile {currentIndex + 1} of {Math.min(3, items.length)}
          </span>
          <span className="text-xs bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 px-2.5 py-0.5 rounded-full font-semibold">
            {currentItem.category}
          </span>
        </div>
        <div className="text-right">
          <span className="font-mono tabular-nums font-bold text-lg text-violet-600 dark:text-violet-400">
            {score} pts
          </span>
        </div>
      </div>

      {/* Clues */}
      <div className="my-6 space-y-3">
        <div className="flex justify-between items-center text-xs font-semibold uppercase text-slate-500">
          <span>Clues ({getPoints()} pts available)</span>
          {revealedClues < 3 && !isAnswered && (
            <button
              onClick={handleRevealClue}
              className="text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" /> Reveal Next Clue
            </button>
          )}
        </div>

        {currentItem.clues.map((clue, idx) => {
          const isRevealed = idx < revealedClues;
          return (
            <div
              key={idx}
              className={`p-4 rounded-2xl border transition-all ${
                isRevealed
                  ? 'bg-violet-50/70 dark:bg-violet-950/20 border-violet-200/80 dark:border-violet-800/40 text-slate-800 dark:text-slate-100'
                  : 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 opacity-60'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  isRevealed ? 'bg-violet-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                }`}>
                  {idx + 1}
                </span>
                <p className="text-sm md:text-base font-medium">
                  {isRevealed ? clue : 'Secret clue hidden...'}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Multiple Choice Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {options.map((opt, idx) => {
          let stateStyle = 'bg-white dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 hover:border-violet-300 text-slate-800 dark:text-slate-200';
          if (isAnswered) {
            if (opt === currentItem.name) {
              stateStyle = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold';
            } else if (opt === selectedGuess) {
              stateStyle = 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-800 dark:text-rose-300';
            } else {
              stateStyle = 'opacity-40 border-slate-200 dark:border-slate-800';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelectOption(opt)}
              disabled={isAnswered}
              className={`p-4 rounded-xl border text-left font-semibold text-sm transition-all transform active:scale-98 flex items-center justify-between cursor-pointer ${stateStyle}`}
            >
              <span>{opt}</span>
              {isAnswered && opt === currentItem.name && (
                <Check className="w-5 h-5 text-emerald-600 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Result feedback */}
      {isAnswered && (
        <div className="p-4 bg-violet-50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-900/40 rounded-xl flex items-center justify-between">
          <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300">
            {selectedGuess === currentItem.name ? (
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                🎉 Correct! You guessed {currentItem.name} (+{getPoints()} pts)
              </span>
            ) : (
              <span className="text-rose-600 dark:text-rose-400 font-bold">
                The mystery person was {currentItem.name}!
              </span>
            )}
          </p>
          <button
            onClick={handleNext}
            className="px-5 py-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold text-sm rounded-xl shadow cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            {currentIndex + 1 >= Math.min(3, items.length) ? 'Finish Game' : 'Next Identity'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

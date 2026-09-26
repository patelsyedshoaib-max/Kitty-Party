import React, { useState, useEffect } from 'react';
import { WORD_SCRAMBLE_ITEMS, WordScrambleItem } from '../../data/gamesData';
import { sound, triggerHaptic } from '../../utils/audio';
import { Shuffle, Delete, RotateCcw, Check, Sparkles, ArrowRight } from 'lucide-react';

interface WordScrambleProps {
  onComplete: (score: number, winnerName?: string) => void;
  currentPlayerName: string;
}

export const WordScrambleGame: React.FC<WordScrambleProps> = ({ onComplete, currentPlayerName }) => {
  const [items] = useState<WordScrambleItem[]>(() => [...WORD_SCRAMBLE_ITEMS].sort(() => Math.random() - 0.5));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [availableLetters, setAvailableLetters] = useState<{ char: string; originalIdx: number }[]>([]);
  const [selectedLetters, setSelectedLetters] = useState<{ char: string; originalIdx: number }[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);

  const currentItem = items[currentIndex % items.length];

  const initWord = () => {
    const letters = currentItem.answer.split('').sort(() => Math.random() - 0.5);
    setAvailableLetters(letters.map((char, idx) => ({ char, originalIdx: idx })));
    setSelectedLetters([]);
    setIsCorrect(false);
    setShowHint(false);
  };

  useEffect(() => {
    initWord();
  }, [currentIndex]);

  const handlePickLetter = (item: { char: string; originalIdx: number }) => {
    sound.playClick();
    triggerHaptic('light');

    setAvailableLetters((prev) => prev.filter((l) => l.originalIdx !== item.originalIdx));
    const nextSelected = [...selectedLetters, item];
    setSelectedLetters(nextSelected);

    // Check if fully formed
    const currentWord = nextSelected.map((l) => l.char).join('');
    if (currentWord === currentItem.answer) {
      sound.playSuccess();
      triggerHaptic('success');
      setIsCorrect(true);
      const earned = showHint ? 30 : 50;
      setScore((s) => s + earned);
    } else if (currentWord.length === currentItem.answer.length) {
      sound.playBuzzer();
      triggerHaptic('warning');
    }
  };

  const handleRemoveLetter = (item: { char: string; originalIdx: number }) => {
    sound.playClick();
    setSelectedLetters((prev) => prev.filter((l) => l.originalIdx !== item.originalIdx));
    setAvailableLetters((prev) => [...prev, item]);
  };

  const handleResetLetters = () => {
    sound.playClick();
    initWord();
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
    <div className="max-w-2xl mx-auto p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl border border-orange-200/50 dark:border-orange-900/30 shadow-xl text-center">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-orange-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Shuffle className="w-5 h-5 text-orange-500" />
          <span className="text-sm font-bold text-orange-800 dark:text-orange-300">
            Scramble {currentIndex + 1} of {Math.min(3, items.length)}
          </span>
          <span className="text-xs bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded-full font-semibold">
            {currentItem.category}
          </span>
        </div>
        <div className="text-right">
          <span className="font-mono tabular-nums font-bold text-lg text-orange-600 dark:text-orange-400">
            {score} pts
          </span>
        </div>
      </div>

      <div className="my-6">
        <h3 className="text-2xl font-serif-display font-bold text-slate-800 dark:text-white mb-2">
          Unscramble the Party Word
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Tap the letters to form the secret word!
        </p>
      </div>

      {/* Answer Slots */}
      <div className="flex items-center justify-center gap-2 min-h-[64px] mb-6 flex-wrap">
        {selectedLetters.map((l) => (
          <button
            key={l.originalIdx}
            onClick={() => handleRemoveLetter(l)}
            className="w-12 h-14 bg-gradient-to-tr from-pink-500 to-rose-600 text-white text-2xl font-black rounded-xl shadow-md border-2 border-pink-300 flex items-center justify-center transform active:scale-95 cursor-pointer"
          >
            {l.char}
          </button>
        ))}

        {/* Empty placeholder slots */}
        {Array.from({ length: Math.max(0, currentItem.answer.length - selectedLetters.length) }).map((_, idx) => (
          <div
            key={idx}
            className="w-12 h-14 rounded-xl border-2 border-dashed border-orange-300 dark:border-slate-700 bg-orange-50/50 dark:bg-slate-800/40 flex items-center justify-center text-slate-400 text-xl font-bold"
          >
            _
          </div>
        ))}
      </div>

      {/* Available Letters Pool */}
      <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
        {availableLetters.map((l) => (
          <button
            key={l.originalIdx}
            onClick={() => handlePickLetter(l)}
            className="w-12 h-14 bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-2xl font-black rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-orange-400 dark:hover:border-orange-500 flex items-center justify-center transform active:scale-90 hover:scale-105 transition-all cursor-pointer"
          >
            {l.char}
          </button>
        ))}
      </div>

      {/* Hint & Reset controls */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <button
          onClick={handleResetLetters}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>

        {!showHint ? (
          <button
            onClick={() => {
              sound.playClick();
              setShowHint(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 hover:bg-amber-100 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" /> Need Clue Hint (-20 pts)
          </button>
        ) : (
          <div className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 rounded-xl border border-amber-200">
            Hint: {currentItem.hint}
          </div>
        )}
      </div>

      {/* Correct celebration */}
      {isCorrect && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 rounded-2xl flex items-center justify-between">
          <div className="text-left">
            <h4 className="text-base font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
              <Check className="w-5 h-5 text-emerald-600" />
              Nailed It! Word: {currentItem.answer}
            </h4>
            <p className="text-xs text-emerald-600 dark:text-emerald-400">
              +{showHint ? 30 : 50} Points awarded!
            </p>
          </div>
          <button
            onClick={handleNext}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow cursor-pointer flex items-center gap-1.5"
          >
            {currentIndex + 1 >= Math.min(3, items.length) ? 'Complete Game' : 'Next Scramble'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

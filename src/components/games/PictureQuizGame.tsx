import React, { useState } from 'react';
import { PICTURE_QUIZ_ITEMS, PictureQuizItem } from '../../data/gamesData';
import { sound, triggerHaptic } from '../../utils/audio';
import { Image, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

interface PictureQuizProps {
  onComplete: (score: number, winnerName?: string) => void;
  currentPlayerName: string;
}

export const PictureQuizGame: React.FC<PictureQuizProps> = ({ onComplete, currentPlayerName }) => {
  const [items] = useState<PictureQuizItem[]>(() => [...PICTURE_QUIZ_ITEMS].sort(() => Math.random() - 0.5));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const currentItem = items[currentIndex % items.length];

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedIdx(idx);
    setIsAnswered(true);

    if (idx === currentItem.correctIndex) {
      sound.playSuccess();
      triggerHaptic('success');
      setScore((s) => s + 40);
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
      setSelectedIdx(null);
      setIsAnswered(false);
      setCurrentIndex((i) => i + 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl border border-rose-200/50 dark:border-rose-900/30 shadow-xl">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-rose-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Image className="w-5 h-5 text-rose-500" />
          <span className="text-sm font-bold text-rose-800 dark:text-rose-300">
            Picture Riddle {currentIndex + 1} of {Math.min(3, items.length)}
          </span>
        </div>
        <div className="text-right">
          <span className="font-mono tabular-nums font-bold text-lg text-rose-600 dark:text-rose-400">
            {score} pts
          </span>
        </div>
      </div>

      {/* Visual illustration banner */}
      <div className="my-6">
        <div
          className={`h-48 md:h-56 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-inner relative overflow-hidden bg-gradient-to-br ${currentItem.imageVisual.bgGradient}`}
        >
          <div className="text-6xl md:text-7xl mb-3 filter drop-shadow-lg select-none transform hover:scale-110 transition-transform">
            {currentItem.imageVisual.icon}
          </div>
          <p className="text-white/90 text-xs md:text-sm font-medium tracking-wide max-w-sm px-4 py-1.5 rounded-full bg-black/30 backdrop-blur-sm border border-white/10">
            {currentItem.imageVisual.caption}
          </p>
        </div>

        <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white mt-4 mb-2 text-center">
          {currentItem.question}
        </h3>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {currentItem.options.map((opt, idx) => {
          let stateStyle = 'bg-white dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 hover:border-rose-300 text-slate-800 dark:text-slate-200';
          if (isAnswered) {
            if (idx === currentItem.correctIndex) {
              stateStyle = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold';
            } else if (idx === selectedIdx) {
              stateStyle = 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-800 dark:text-rose-300';
            } else {
              stateStyle = 'opacity-40 border-slate-200 dark:border-slate-800';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={isAnswered}
              className={`p-4 rounded-xl border text-left font-semibold text-sm transition-all transform active:scale-98 flex items-center justify-between cursor-pointer ${stateStyle}`}
            >
              <span>{opt}</span>
              {isAnswered && idx === currentItem.correctIndex && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              )}
              {isAnswered && idx === selectedIdx && idx !== currentItem.correctIndex && (
                <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {isAnswered && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-xl flex items-center justify-between">
          <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300">
            <span className="font-bold">Fact:</span> {currentItem.explanation}
          </p>
          <button
            onClick={handleNext}
            className="px-5 py-2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-sm rounded-xl shadow cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            {currentIndex + 1 >= Math.min(3, items.length) ? 'Claim Points' : 'Next Riddle'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

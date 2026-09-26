import React, { useState, useEffect } from 'react';
import { EMOJI_QUIZ_ITEMS, EmojiQuizItem } from '../../data/gamesData';
import { sound, triggerHaptic } from '../../utils/audio';
import { Timer, CheckCircle, XCircle, ArrowRight, Sparkles } from 'lucide-react';

interface EmojiQuizProps {
  onComplete: (score: number, winnerName?: string) => void;
  currentPlayerName: string;
}

export const EmojiQuizGame: React.FC<EmojiQuizProps> = ({ onComplete, currentPlayerName }) => {
  const [questions] = useState<EmojiQuizItem[]>(() => [...EMOJI_QUIZ_ITEMS].sort(() => Math.random() - 0.5));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  const totalQuestions = Math.min(5, questions.length);
  const currentQ = questions[currentIndex];

  useEffect(() => {
    setTimeLeft(15);
    setSelectedOption(null);
    setIsAnswered(false);
  }, [currentIndex]);

  useEffect(() => {
    if (isAnswered) return;
    if (timeLeft <= 0) {
      sound.playBuzzer();
      triggerHaptic('warning');
      setIsAnswered(true);
      setStreak(0);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 4 && prev > 1) {
          sound.playTick();
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isAnswered]);

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === currentQ.correctIndex) {
      sound.playSuccess();
      triggerHaptic('success');
      const timeBonus = Math.floor(timeLeft * 2);
      const points = 30 + timeBonus + streak * 5;
      setScore((s) => s + points);
      setStreak((st) => st + 1);
    } else {
      sound.playBuzzer();
      triggerHaptic('warning');
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 >= totalQuestions) {
      sound.playFanfare();
      onComplete(score, currentPlayerName);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl border border-pink-200/50 dark:border-pink-900/30 shadow-xl">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-pink-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider font-bold bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 px-3 py-1 rounded-full">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
          {streak > 1 && (
            <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> {streak}x Streak!
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-sm font-semibold">
            <Timer className={`w-4 h-4 ${timeLeft <= 4 ? 'text-rose-500 animate-pulse' : 'text-slate-500'}`} />
            <span className={`font-mono font-bold ${timeLeft <= 4 ? 'text-rose-500' : 'text-slate-700 dark:text-slate-300'}`}>
              {timeLeft}s
            </span>
          </div>
          <span className="font-mono tabular-nums font-extrabold text-pink-600 dark:text-pink-400 text-base">
            {score} pts
          </span>
        </div>
      </div>

      {/* Main Emojis Card */}
      <div className="my-6 p-8 bg-gradient-to-b from-pink-50/60 to-purple-50/40 dark:from-slate-800/80 dark:to-slate-800/40 rounded-2xl border border-pink-100 dark:border-slate-700 text-center">
        <div className="text-5xl md:text-6xl tracking-widest mb-4 filter drop-shadow-sm select-none">
          {currentQ.emojis}
        </div>
        <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100">
          {currentQ.question}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Category: {currentQ.category}
        </p>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        {currentQ.options.map((opt, idx) => {
          let stateStyle = 'bg-slate-50 dark:bg-slate-800/60 hover:bg-pink-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200';
          if (isAnswered) {
            if (idx === currentQ.correctIndex) {
              stateStyle = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold';
            } else if (idx === selectedOption) {
              stateStyle = 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-800 dark:text-rose-300';
            } else {
              stateStyle = 'opacity-40 border-slate-200 dark:border-slate-800 text-slate-400';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelectOption(idx)}
              disabled={isAnswered}
              className={`p-4 rounded-xl border text-left font-medium transition-all transform active:scale-98 flex items-center justify-between cursor-pointer ${stateStyle}`}
            >
              <span>{opt}</span>
              {isAnswered && idx === currentQ.correctIndex && (
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              )}
              {isAnswered && idx === selectedOption && idx !== currentQ.correctIndex && (
                <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Answer feedback & continue */}
      {isAnswered && (
        <div className="p-4 bg-pink-50/70 dark:bg-pink-950/20 border border-pink-200 dark:border-pink-900/40 rounded-xl flex items-center justify-between">
          <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300">
            <span className="font-bold">Reveal:</span> {currentQ.explanation}
          </p>
          <button
            onClick={handleNext}
            className="px-5 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-sm rounded-xl shadow transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            {currentIndex + 1 >= totalQuestions ? 'View Final Score' : 'Next Question'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

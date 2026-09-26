import React, { useState, useEffect } from 'react';
import { RAPID_FIRE_QUESTIONS, RapidFireQuestion } from '../../data/gamesData';
import { sound, triggerHaptic } from '../../utils/audio';
import { Timer, Zap, CheckCircle2, RotateCcw, Award } from 'lucide-react';

interface RapidFireProps {
  onComplete: (score: number, winnerName?: string) => void;
  currentPlayerName: string;
  roundDuration?: number;
}

export const RapidFireGame: React.FC<RapidFireProps> = ({
  onComplete,
  currentPlayerName,
  roundDuration = 20,
}) => {
  const [questions] = useState<RapidFireQuestion[]>(() => {
    return [...RAPID_FIRE_QUESTIONS].sort(() => Math.random() - 0.5);
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(roundDuration);
  const [isActive, setIsActive] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);

  const currentQ = questions[currentIndex % questions.length];

  // Start round
  const startRound = () => {
    sound.playClick();
    triggerHaptic('medium');
    setIsActive(true);
    setTimeLeft(roundDuration);
  };

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 4 && prev > 1) {
            sound.playTick();
            triggerHaptic('light');
          }
          if (prev <= 1) {
            sound.playBuzzer();
            triggerHaptic('warning');
            setIsActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  const handleNext = (nailed: boolean) => {
    if (!isActive) return;
    if (nailed) {
      sound.playSuccess();
      triggerHaptic('success');
      setScore((s) => s + 20);
      setAnsweredCount((c) => c + 1);
    } else {
      sound.playClick();
    }
    setCurrentIndex((i) => i + 1);
  };

  const handleFinish = () => {
    sound.playFanfare();
    onComplete(score, currentPlayerName);
  };

  const progressPercent = (timeLeft / roundDuration) * 100;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl border border-pink-200/50 dark:border-pink-900/30 shadow-xl text-center">
      {/* Header Info */}
      <div className="flex items-center justify-between pb-4 border-b border-pink-100 dark:border-slate-800">
        <div className="flex items-center gap-2 text-sm text-pink-600 dark:text-pink-400 font-semibold">
          <Zap className="w-5 h-5 text-amber-500 animate-pulse" />
          <span>Rapid Fire Spotlight</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
          <Award className="w-4 h-4 text-pink-500" />
          <span className="font-mono tabular-nums font-bold text-lg text-pink-600 dark:text-pink-400">
            {score} pts
          </span>
        </div>
      </div>

      {!isActive && timeLeft === roundDuration && (
        <div className="py-12">
          <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-tr from-pink-500 to-amber-400 flex items-center justify-center text-4xl shadow-lg shadow-pink-500/20 animate-float-slow">
            ⚡
          </div>
          <h2 className="text-2xl font-serif-display font-bold text-slate-800 dark:text-white mb-2">
            Ready for Rapid Fire, {currentPlayerName}?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto text-sm mb-8 leading-relaxed">
            Answer the questions out loud as quickly as you can before the {roundDuration}-second buzzer strikes!
          </p>
          <button
            onClick={startRound}
            className="px-8 py-3.5 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-600 hover:to-amber-600 text-white font-bold rounded-2xl shadow-lg shadow-pink-500/25 transition-all transform hover:scale-105 active:scale-95 text-base cursor-pointer"
          >
            Start Rapid Fire Round 🚀
          </button>
        </div>
      )}

      {isActive && (
        <div className="py-6">
          {/* Timer Bar */}
          <div className="relative w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-6">
            <div
              className={`h-full transition-all duration-1000 rounded-full ${
                timeLeft <= 5 ? 'bg-rose-500 animate-pulse' : 'bg-gradient-to-r from-pink-500 to-amber-400'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-center gap-2 mb-4">
            <Timer className={`w-5 h-5 ${timeLeft <= 5 ? 'text-rose-500 animate-bounce' : 'text-pink-500'}`} />
            <span className={`text-2xl font-mono tabular-nums font-black ${timeLeft <= 5 ? 'text-rose-600' : 'text-slate-800 dark:text-white'}`}>
              00:{timeLeft.toString().padStart(2, '0')}
            </span>
          </div>

          <div className="mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-pink-500 bg-pink-50 dark:bg-pink-950/40 px-3 py-1 rounded-full border border-pink-200 dark:border-pink-800">
              {currentQ.category}
            </span>
          </div>

          <div className="min-h-[140px] flex items-center justify-center p-6 my-4 bg-gradient-to-b from-pink-50/50 to-purple-50/40 dark:from-slate-800/60 dark:to-slate-800/30 rounded-2xl border border-pink-100 dark:border-slate-800">
            <p className="text-xl md:text-2xl font-serif-display font-bold text-slate-800 dark:text-slate-100 leading-snug">
              "{currentQ.question}"
            </p>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <button
              onClick={() => handleNext(false)}
              className="py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Skip Question ⏭️
            </button>
            <button
              onClick={() => handleNext(true)}
              className="py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold hover:from-emerald-600 hover:to-teal-700 shadow-md shadow-emerald-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              Nailed It! (+20 pts)
            </button>
          </div>
        </div>
      )}

      {timeLeft === 0 && (
        <div className="py-8">
          <div className="text-5xl mb-4 animate-bounce">⏰</div>
          <h3 className="text-2xl font-serif-display font-bold text-slate-800 dark:text-white mb-2">
            Time's Up!
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
            {currentPlayerName} answered <span className="font-bold text-pink-600">{answeredCount}</span> rapid fire questions!
          </p>
          <div className="text-3xl font-black text-amber-500 mb-6 font-mono">
            +{score} Points Earned 🎉
          </div>
          <div className="flex justify-center gap-4">
            <button
              onClick={startRound}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Retry
            </button>
            <button
              onClick={handleFinish}
              className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-xl shadow-lg shadow-pink-500/20 hover:from-pink-600 hover:to-purple-700 transition-all cursor-pointer"
            >
              Claim Score & Continue 🏆
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

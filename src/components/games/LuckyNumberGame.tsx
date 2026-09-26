import React, { useState } from 'react';
import { sound, triggerHaptic } from '../../utils/audio';
import { Sparkles, Trophy, RotateCw, Dices } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LuckyNumberProps {
  onComplete: (score: number, winnerName?: string) => void;
  currentPlayerName: string;
}

export const LuckyNumberGame: React.FC<LuckyNumberProps> = ({ onComplete, currentPlayerName }) => {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [matches, setMatches] = useState<number[]>([]);
  const [isDone, setIsDone] = useState(false);

  const toggleNumber = (num: number) => {
    if (isDrawing || isDone) return;
    sound.playClick();
    triggerHaptic('light');

    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter((n) => n !== num));
    } else {
      if (selectedNumbers.length < 3) {
        setSelectedNumbers([...selectedNumbers, num]);
      }
    }
  };

  const handleRandomPick = () => {
    sound.playClick();
    const nums: number[] = [];
    while (nums.length < 3) {
      const r = Math.floor(1 + Math.random() * 30);
      if (!nums.includes(r)) nums.push(r);
    }
    setSelectedNumbers(nums);
  };

  const handleStartDraw = () => {
    if (selectedNumbers.length === 0) return;
    setIsDrawing(true);
    setDrawnNumbers([]);
    setMatches([]);
    setIsDone(false);

    sound.playClick();
    triggerHaptic('medium');

    const totalDraws = 6;
    const drawnList: number[] = [];

    // Draw one by one with delay
    let count = 0;
    const interval = setInterval(() => {
      let candidate = Math.floor(1 + Math.random() * 30);
      while (drawnList.includes(candidate)) {
        candidate = Math.floor(1 + Math.random() * 30);
      }
      drawnList.push(candidate);
      setDrawnNumbers([...drawnList]);

      // Sound
      sound.playWheelTick();
      triggerHaptic('light');

      count++;
      if (count >= totalDraws) {
        clearInterval(interval);
        setTimeout(() => {
          setIsDrawing(false);
          setIsDone(true);

          // Find matches
          const matched = selectedNumbers.filter((n) => drawnList.includes(n));
          setMatches(matched);

          if (matched.length > 0) {
            sound.playSuccess();
            triggerHaptic('success');
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#F59E0B', '#EC4899', '#8B5CF6'],
            });
          } else {
            sound.playFanfare();
          }
        }, 800);
      }
    }, 700);
  };

  const calculateScore = () => {
    if (matches.length === 3) return 150; // Jackpot!
    if (matches.length === 2) return 90;
    if (matches.length === 1) return 50;
    return 20; // Consolation party points
  };

  const handleFinish = () => {
    onComplete(calculateScore(), currentPlayerName);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl border border-amber-200/50 dark:border-amber-900/30 shadow-xl text-center">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-amber-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Dices className="w-5 h-5 text-amber-500" />
          <span className="text-sm font-bold text-amber-800 dark:text-amber-300">
            Lucky Number Tambola
          </span>
        </div>
        <div className="text-xs bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold px-3 py-1 rounded-full">
          Pick 3 Numbers
        </div>
      </div>

      <div className="my-6">
        <h3 className="text-2xl font-serif-display font-bold text-slate-800 dark:text-white mb-1">
          Pick Your Lucky Party Numbers
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Selected: <span className="font-bold text-amber-600">{selectedNumbers.length}/3</span>. The golden tumbler will draw 6 winning numbers!
        </p>
      </div>

      {/* Number Selection Grid (1-30) */}
      <div className="grid grid-cols-6 sm:grid-cols-10 gap-2 mb-6 max-w-lg mx-auto">
        {Array.from({ length: 30 }).map((_, idx) => {
          const num = idx + 1;
          const isSelected = selectedNumbers.includes(num);
          const isDrawn = drawnNumbers.includes(num);
          const isMatched = isDrawn && isSelected;

          return (
            <button
              key={num}
              onClick={() => toggleNumber(num)}
              disabled={isDrawing || isDone}
              className={`h-10 rounded-xl font-bold font-mono text-sm transition-all transform active:scale-90 flex items-center justify-center cursor-pointer border ${
                isMatched
                  ? 'bg-amber-400 text-slate-950 border-amber-500 ring-4 ring-amber-300 shadow-lg scale-110'
                  : isSelected
                  ? 'bg-pink-600 text-white border-pink-700 shadow-md scale-105'
                  : isDrawn
                  ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-300'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-pink-300'
              }`}
            >
              {num}
            </button>
          );
        })}
      </div>

      {/* Quick Buttons */}
      {!isDrawing && !isDone && (
        <div className="flex items-center justify-center gap-3 mb-6">
          <button
            onClick={handleRandomPick}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            🎲 Quick Random Pick
          </button>
          <button
            onClick={handleStartDraw}
            disabled={selectedNumbers.length === 0}
            className="px-6 py-2.5 bg-gradient-to-r from-amber-500 via-pink-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-bold text-sm rounded-xl shadow-md transition-all disabled:opacity-40 cursor-pointer"
          >
            Roll Golden Drum! 🎰
          </button>
        </div>
      )}

      {/* Drawn Balls Display */}
      {(isDrawing || isDone) && (
        <div className="p-6 bg-gradient-to-br from-amber-500/10 via-pink-500/10 to-purple-500/10 border border-amber-300 dark:border-amber-800 rounded-2xl mb-6">
          <div className="text-xs uppercase font-extrabold tracking-wider text-amber-700 dark:text-amber-400 mb-3 flex items-center justify-center gap-1.5">
            {isDrawing && <RotateCw className="w-4 h-4 animate-spin" />}
            {isDrawing ? 'Golden Drum Drawing Balls...' : 'Winning Balls Drawn:'}
          </div>

          <div className="flex items-center justify-center gap-2.5 flex-wrap">
            {drawnNumbers.map((num) => {
              const matched = selectedNumbers.includes(num);
              return (
                <div
                  key={num}
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-mono font-black text-lg shadow-md transform animate-bounce transition-transform ${
                    matched
                      ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-900 border-2 border-amber-200 ring-4 ring-amber-300/60'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700'
                  }`}
                  style={{ animationDuration: '0.6s' }}
                >
                  {num}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Result Card */}
      {isDone && (
        <div className="p-5 bg-white/90 dark:bg-slate-800/90 rounded-2xl border border-amber-300 dark:border-amber-700 shadow-md">
          <Trophy className="w-10 h-10 text-amber-500 mx-auto mb-1 animate-bounce" />
          <h4 className="text-xl font-bold text-slate-800 dark:text-white mb-1">
            {matches.length > 0 ? `Jackpot! You matched ${matches.length} numbers!` : 'Good Try! Participation points awarded!'}
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
            +{calculateScore()} Points added to your total kitty score!
          </p>
          <button
            onClick={handleFinish}
            className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-pink-600 hover:from-amber-600 hover:to-pink-700 text-white font-bold rounded-xl shadow cursor-pointer"
          >
            Claim Score & Check Leaderboard 🏆
          </button>
        </div>
      )}
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { WHEEL_SEGMENTS } from '../../data/gamesData';
import { sound, triggerHaptic } from '../../utils/audio';
import { Sparkles, Trophy, RotateCw, CheckCircle2 } from 'lucide-react';

interface SpinWheelProps {
  onComplete: (score: number, winnerName?: string) => void;
  currentPlayerName: string;
}

export const SpinWheelGame: React.FC<SpinWheelProps> = ({ onComplete, currentPlayerName }) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedDare, setSelectedDare] = useState<typeof WHEEL_SEGMENTS[0] | null>(null);
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const segmentsCount = WHEEL_SEGMENTS.length;
  const arcSize = (2 * Math.PI) / segmentsCount;

  // Draw wheel on canvas
  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const radius = width / 2 - 10;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.clearRect(0, 0, width, height);

    WHEEL_SEGMENTS.forEach((seg, idx) => {
      const angle = idx * arcSize;
      ctx.beginPath();
      ctx.fillStyle = seg.color;
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, angle, angle + arcSize);
      ctx.lineTo(centerX, centerY);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Draw text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle + arcSize / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.4)';
      ctx.shadowBlur = 3;
      ctx.fillText(seg.text, radius - 20, 4);
      ctx.restore();
    });

    // Draw outer golden ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 6;
    ctx.stroke();

    // Draw center hub
    ctx.beginPath();
    ctx.arc(centerX, centerY, 28, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.strokeStyle = '#EC4899';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Center jewel
    ctx.beginPath();
    ctx.arc(centerX, centerY, 14, 0, 2 * Math.PI);
    ctx.fillStyle = '#EC4899';
    ctx.fill();
  };

  useEffect(() => {
    drawWheel();
  }, []);

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSelectedDare(null);
    setChallengeCompleted(false);
    setIsTimerRunning(false);
    setTimerSeconds(30);

    sound.playClick();
    triggerHaptic('medium');

    // Pick random target
    const randomExtraDegrees = Math.floor(1800 + Math.random() * 1800);
    const newRotation = rotation + randomExtraDegrees;
    setRotation(newRotation);

    // Audio ticking simulation
    let tickCount = 0;
    const tickInterval = setInterval(() => {
      sound.playWheelTick();
      tickCount++;
      if (tickCount > 25) clearInterval(tickInterval);
    }, 140);

    setTimeout(() => {
      clearInterval(tickInterval);
      setIsSpinning(false);
      sound.playSuccess();
      triggerHaptic('success');

      // Calculate winning slice:
      // The pointer is at top (270 degrees or 3*PI/2)
      const normalizedAngle = (360 - (newRotation % 360) + 270) % 360;
      const index = Math.floor(normalizedAngle / (360 / segmentsCount)) % segmentsCount;
      const won = WHEEL_SEGMENTS[index];
      setSelectedDare(won);
    }, 4000);
  };

  // Timer countdown for dare
  useEffect(() => {
    let t: ReturnType<typeof setInterval>;
    if (isTimerRunning && timerSeconds > 0) {
      t = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 4 && prev > 1) sound.playTick();
          if (prev <= 1) {
            sound.playBuzzer();
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(t);
  }, [isTimerRunning, timerSeconds]);

  const handleDareComplete = () => {
    sound.playFanfare();
    triggerHaptic('success');
    setChallengeCompleted(true);
    setIsTimerRunning(false);
  };

  const handleFinish = () => {
    onComplete(50, currentPlayerName);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl border border-fuchsia-200/50 dark:border-fuchsia-900/30 shadow-xl text-center">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-fuchsia-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
          <span className="text-sm font-bold text-fuchsia-700 dark:text-fuchsia-300">
            Spin the Party Wheel
          </span>
        </div>
        <div className="text-xs bg-fuchsia-100 dark:bg-fuchsia-950/60 text-fuchsia-700 dark:text-fuchsia-300 font-bold px-3 py-1 rounded-full">
          Reward: 50 Star Points
        </div>
      </div>

      {/* Wheel Area */}
      <div className="relative my-8 flex items-center justify-center">
        {/* Top Pointer */}
        <div className="absolute top-0 z-20 transform -translate-y-2 filter drop-shadow-md">
          <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[24px] border-t-amber-400" />
        </div>

        {/* Canvas Wheel */}
        <div
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? 'transform 4s cubic-bezier(0.15, 0.9, 0.2, 1)' : 'none',
          }}
          className="rounded-full shadow-2xl overflow-hidden p-1 bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600"
        >
          <canvas
            ref={canvasRef}
            width={340}
            height={340}
            className="rounded-full max-w-[280px] sm:max-w-[340px] h-auto block"
          />
        </div>
      </div>

      {/* Controls */}
      <div className="mb-4">
        <button
          onClick={spin}
          disabled={isSpinning}
          className="px-8 py-3.5 bg-gradient-to-r from-fuchsia-600 via-pink-600 to-amber-500 hover:from-fuchsia-700 hover:to-amber-600 text-white font-extrabold rounded-2xl shadow-lg shadow-fuchsia-500/25 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer inline-flex items-center gap-2 text-base"
        >
          <RotateCw className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
          {isSpinning ? 'Spinning Wheel...' : `Spin for ${currentPlayerName}! 🎡`}
        </button>
      </div>

      {/* Selected Dare Popup / Modal Card */}
      {selectedDare && (
        <div className="mt-6 p-6 bg-gradient-to-b from-fuchsia-50/80 to-pink-50/60 dark:from-slate-800 dark:to-slate-800/80 border border-fuchsia-200 dark:border-fuchsia-900/60 rounded-2xl text-center shadow-lg">
          <div className="text-xs uppercase font-extrabold tracking-widest text-fuchsia-600 dark:text-fuchsia-400 mb-1">
            Party Challenge
          </div>
          <h3 className="text-xl md:text-2xl font-serif-display font-bold text-slate-900 dark:text-white mb-2">
            {selectedDare.text}
          </h3>
          <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 max-w-lg mx-auto mb-5 leading-relaxed bg-white/60 dark:bg-slate-900/50 p-4 rounded-xl border border-fuchsia-100 dark:border-slate-700">
            "{selectedDare.dare}"
          </p>

          {!challengeCompleted ? (
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-xl text-sm transition-colors cursor-pointer"
              >
                {isTimerRunning ? `Pause (${timerSeconds}s)` : `Start 30s Timer (${timerSeconds}s)`}
              </button>
              <button
                onClick={handleDareComplete}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                Done! Award +50 Stars 🌟
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                Challenge Accomplished! +50 Points Added
              </div>
              <button
                onClick={handleFinish}
                className="px-6 py-2.5 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-700 hover:to-purple-700 text-white font-bold rounded-xl shadow transition-all cursor-pointer"
              >
                Continue to Party Leaderboard 🏆
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

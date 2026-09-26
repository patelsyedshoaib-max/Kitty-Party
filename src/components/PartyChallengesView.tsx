import React, { useState } from 'react';
import { PARTY_DARES_LIST } from '../data/gamesData';
import { PartyDare } from '../types/party';
import { sound, triggerHaptic } from '../utils/audio';
import { Timer, CheckCircle, Sparkles, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PartyChallengesProps {
  onAwardDarePoints: (points: number, dareTitle: string) => void;
  players: { id: string; name: string; avatar: string }[];
}

export const PartyChallengesView: React.FC<PartyChallengesProps> = ({ onAwardDarePoints, players }) => {
  const [selectedDare, setSelectedDare] = useState<PartyDare | null>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>(players[0]?.id || '');
  const [timerSeconds, setTimerSeconds] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [completedDares, setCompletedDares] = useState<string[]>([]);

  const handleSelectDare = (dare: PartyDare) => {
    sound.playClick();
    triggerHaptic('light');
    setSelectedDare(dare);
    setTimerSeconds(dare.timeSeconds);
    setIsTimerRunning(false);
  };

  React.useEffect(() => {
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

  const handleComplete = () => {
    if (!selectedDare) return;
    sound.playSuccess();
    triggerHaptic('success');
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
    });
    setCompletedDares((prev) => [...prev, selectedDare.id]);
    onAwardDarePoints(selectedDare.pointsReward, selectedDare.title);
    setSelectedDare(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Section Header */}
      <div className="text-center mb-8">
        <span className="text-xs uppercase font-extrabold tracking-widest text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-950/60 px-3.5 py-1.5 rounded-full inline-block mb-2">
          Party Spotlight & Dares
        </span>
        <h2 className="text-3xl md:text-4xl font-serif-display font-extrabold text-slate-900 dark:text-white mb-3">
          Lighthearted Fun Challenges 💃
        </h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
          Safe, delightful and laugh-out-loud party activities for your gathering! Pick a challenge, start the timer, and shower the performer with star points.
        </p>
      </div>

      {/* Grid of Dares */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {PARTY_DARES_LIST.map((dare) => {
          const isDone = completedDares.includes(dare.id);
          return (
            <div
              key={dare.id}
              className={`p-5 rounded-3xl border transition-all duration-300 flex flex-col justify-between ${
                isDone
                  ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
                  : 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-pink-100 dark:border-pink-900/30 hover:border-pink-300 dark:hover:border-pink-700 hover:shadow-lg shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl filter drop-shadow">{dare.icon}</span>
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full">
                    +{dare.pointsReward} pts
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-800 dark:text-white mb-1.5">
                  {dare.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  {dare.instruction}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                  <Timer className="w-3.5 h-3.5" /> {dare.timeSeconds}s
                </span>
                <button
                  onClick={() => handleSelectDare(dare)}
                  disabled={isDone}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-xs rounded-xl shadow-sm transition-all transform active:scale-95 cursor-pointer disabled:opacity-40"
                >
                  {isDone ? 'Completed' : 'Perform Dare'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Dare Active Modal */}
      {selectedDare && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 max-w-lg w-full border border-pink-200 dark:border-pink-900 shadow-2xl text-center">
            <span className="text-5xl mb-3 block animate-bounce">{selectedDare.icon}</span>
            <span className="text-xs uppercase font-extrabold tracking-widest text-pink-600 dark:text-pink-400">
              Active Party Dare
            </span>
            <h3 className="text-2xl font-serif-display font-bold text-slate-900 dark:text-white mt-1 mb-3">
              {selectedDare.title}
            </h3>

            <p className="text-base text-slate-700 dark:text-slate-300 bg-pink-50 dark:bg-slate-800 p-4 rounded-2xl border border-pink-100 dark:border-slate-700 mb-6 leading-relaxed">
              "{selectedDare.instruction}"
            </p>

            {/* Performer Selector */}
            <div className="mb-6 flex items-center justify-center gap-2 text-xs">
              <span className="text-slate-500">Performer:</span>
              <select
                value={selectedPlayerId}
                onChange={(e) => setSelectedPlayerId(e.target.value)}
                className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold"
              >
                {players.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.avatar} {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Timer Display */}
            <div className="mb-6">
              <div className="text-4xl font-mono font-black text-pink-600 dark:text-pink-400 mb-2">
                00:{timerSeconds.toString().padStart(2, '0')}
              </div>
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
              >
                {isTimerRunning ? 'Pause Timer' : 'Start Countdown ⏱️'}
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedDare(null)}
                className="flex-1 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleComplete}
                className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/20 hover:from-emerald-600 hover:to-teal-700 cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Award +{selectedDare.pointsReward} pts!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

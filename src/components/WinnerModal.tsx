import React, { useEffect } from 'react';
import { Player } from '../types/party';
import { sound, triggerHaptic } from '../utils/audio';
import { Trophy, Crown, Sparkles, RotateCcw, Share2, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WinnerModalProps {
  players: Player[];
  roomName: string;
  onPlayAgain: () => void;
  onNewParty: () => void;
  onClose: () => void;
}

export const WinnerModal: React.FC<WinnerModalProps> = ({
  players,
  roomName,
  onPlayAgain,
  onNewParty,
  onClose,
}) => {
  const sorted = [...players].sort((a, b) => b.points - a.points);
  const winner = sorted[0];
  const second = sorted[1];
  const third = sorted[2];

  useEffect(() => {
    sound.playFanfare();
    triggerHaptic('success');

    // Confetti bursts
    const end = Date.now() + 3000;
    const colors = ['#EC4899', '#8B5CF6', '#F59E0B', '#10B981'];

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  const handleShare = () => {
    sound.playClick();
    const text = `🏆 GRAND WINNER of ${roomName}: ${winner?.name} with ${winner?.points} points! 👑 Queen of the Kitty Party! 🎉🥳`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      alert('Scorecard copied to clipboard! Share it with your friends on WhatsApp or Instagram!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-pink-300 dark:border-pink-900/60 shadow-2xl text-center relative overflow-hidden my-8">
        {/* Glow backdrop */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-pink-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

        {/* Generated Trophy Emblem */}
        <div className="relative mx-auto w-32 h-32 sm:w-36 sm:h-36 mb-4">
          <img
            src="/src/assets/images/kitty_party_trophy_1790430497651.jpg"
            alt="Kitty Party Grand Trophy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover rounded-3xl shadow-xl border-2 border-amber-300/80 animate-float-slow"
          />
          <div className="absolute -top-3 -right-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-white p-2 rounded-full shadow-lg">
            <Crown className="w-5 h-5" />
          </div>
        </div>

        <span className="text-xs uppercase font-extrabold tracking-widest text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/60 px-3.5 py-1 rounded-full border border-pink-200 dark:border-pink-800">
          Party Champion
        </span>

        <h2 className="text-3xl sm:text-4xl font-serif-display font-extrabold text-slate-900 dark:text-white mt-2 mb-1">
          {winner?.name} Wins! 👑
        </h2>

        <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
          Congratulations to the ultimate Kitty Party Queen of <span className="font-semibold">{roomName}</span>!
        </p>

        {/* Podium Highlights */}
        <div className="p-4 bg-gradient-to-br from-pink-50/70 to-purple-50/50 dark:from-slate-800/80 dark:to-slate-800/40 rounded-2xl border border-pink-100 dark:border-slate-700 mb-6">
          <div className="grid grid-cols-3 gap-2 text-center">
            {second && (
              <div className="p-2">
                <div className="text-xl mb-1">{second.avatar}</div>
                <div className="text-xs font-bold text-slate-800 dark:text-white truncate">
                  {second.name}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  {second.points} pts (2nd)
                </div>
              </div>
            )}

            {winner && (
              <div className="p-2 bg-amber-100/60 dark:bg-amber-950/40 rounded-xl border border-amber-300">
                <div className="text-2xl mb-1">{winner.avatar}</div>
                <div className="text-xs font-extrabold text-amber-900 dark:text-amber-200 truncate">
                  {winner.name}
                </div>
                <div className="text-[11px] font-black text-amber-600 dark:text-amber-400 font-mono">
                  {winner.points} pts (1st 👑)
                </div>
              </div>
            )}

            {third && (
              <div className="p-2">
                <div className="text-xl mb-1">{third.avatar}</div>
                <div className="text-xs font-bold text-slate-800 dark:text-white truncate">
                  {third.name}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  {third.points} pts (3rd)
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleShare}
            className="w-full py-3 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-600 hover:to-amber-600 text-white font-bold rounded-xl shadow-lg shadow-pink-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            <Share2 className="w-4 h-4" />
            Share Victory Scorecard
          </button>

          <div className="flex gap-2">
            <button
              onClick={onPlayAgain}
              className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Play Again
            </button>
            <button
              onClick={onNewParty}
              className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <PartyPopper className="w-3.5 h-3.5" />
              New Party Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

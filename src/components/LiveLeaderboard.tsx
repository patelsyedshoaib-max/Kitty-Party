import React, { useState } from 'react';
import { Player } from '../types/party';
import { Trophy, Medal, Crown, Share2, Check, Sparkles } from 'lucide-react';
import { sound, triggerHaptic } from '../utils/audio';

interface LiveLeaderboardProps {
  players: Player[];
  roomName: string;
}

export const LiveLeaderboard: React.FC<LiveLeaderboardProps> = ({ players, roomName }) => {
  const [copied, setCopied] = useState(false);

  // Sort players descending by points
  const sorted = [...players].sort((a, b) => b.points - a.points);
  const first = sorted[0];
  const second = sorted[1];
  const third = sorted[2];

  const handleShare = () => {
    sound.playClick();
    triggerHaptic('light');

    const topPlayer = sorted[0]?.name || 'Leader';
    const text = `🎉 Kitty Party Fun: ${roomName} Live Leaderboard!\n👑 1st Place: ${topPlayer} (${sorted[0]?.points || 0} pts)\n🥈 2nd Place: ${sorted[1]?.name || 'Player'} (${sorted[1]?.points || 0} pts)\nCome join our party game session! 💃🥳`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleWhatsAppShare = () => {
    sound.playClick();
    const topPlayer = sorted[0]?.name || 'Leader';
    const text = encodeURIComponent(`🎉 Kitty Party Fun: ${roomName} Live Leaderboard!\n👑 1st Place: ${topPlayer} (${sorted[0]?.points || 0} pts)\nJoin the fun now! 💃🥳`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-3 py-1 rounded-full inline-block mb-1">
            Real-Time Rankings
          </span>
          <h2 className="text-3xl font-serif-display font-extrabold text-slate-900 dark:text-white">
            Party Hall of Fame 🏆
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-pink-300 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4 text-pink-500" />}
            {copied ? 'Copied to Clipboard!' : 'Copy Scorecard'}
          </button>
          <button
            onClick={handleWhatsAppShare}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
          >
            💬 WhatsApp
          </button>
        </div>
      </div>

      {/* Podium for Top 3 */}
      {sorted.length >= 2 && (
        <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end max-w-lg mx-auto mb-10 pt-8">
          {/* 2nd Place */}
          {second && (
            <div className="flex flex-col items-center">
              <div className="relative mb-2">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-slate-200 to-slate-400 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center text-3xl shadow-md border-2 border-slate-300">
                  {second.avatar}
                </div>
                <div className="absolute -top-2 -right-1 bg-slate-300 text-slate-800 text-[10px] font-black px-1.5 py-0.5 rounded-full shadow">
                  #2
                </div>
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 truncate max-w-[90px] text-center">
                {second.name}
              </span>
              <span className="text-xs font-mono font-extrabold text-slate-600 dark:text-slate-400">
                {second.points} pts
              </span>
              {/* Pedestal */}
              <div className="w-full h-24 sm:h-28 bg-gradient-to-b from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 rounded-t-2xl mt-2 flex items-center justify-center text-slate-600 dark:text-slate-300 font-extrabold text-lg">
                2
              </div>
            </div>
          )}

          {/* 1st Place (Center, Tallest) */}
          {first && (
            <div className="flex flex-col items-center">
              <div className="relative mb-2">
                <Crown className="w-7 h-7 text-amber-400 absolute -top-6 left-1/2 transform -translate-x-1/2 filter drop-shadow animate-bounce" />
                <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-300 via-amber-400 to-yellow-500 flex items-center justify-center text-4xl shadow-xl border-4 border-amber-200 ring-4 ring-amber-300/40">
                  {first.avatar}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full shadow">
                  #1
                </div>
              </div>
              <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate max-w-[110px] text-center">
                {first.name}
              </span>
              <span className="text-sm font-mono font-black text-amber-500">
                {first.points} pts
              </span>
              {/* Pedestal */}
              <div className="w-full h-32 sm:h-36 bg-gradient-to-b from-amber-300 via-amber-400 to-yellow-500 rounded-t-2xl mt-2 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg">
                1
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {third && (
            <div className="flex flex-col items-center">
              <div className="relative mb-2">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-700 dark:from-amber-800 dark:to-amber-900 flex items-center justify-center text-3xl shadow-md border-2 border-amber-500">
                  {third.avatar}
                </div>
                <div className="absolute -top-2 -right-1 bg-amber-700 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full shadow">
                  #3
                </div>
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 truncate max-w-[90px] text-center">
                {third.name}
              </span>
              <span className="text-xs font-mono font-extrabold text-amber-700 dark:text-amber-400">
                {third.points} pts
              </span>
              {/* Pedestal */}
              <div className="w-full h-18 sm:h-20 bg-gradient-to-b from-amber-600/40 to-amber-700/60 dark:from-amber-900/60 dark:to-slate-800 rounded-t-2xl mt-2 flex items-center justify-center text-amber-800 dark:text-amber-200 font-extrabold text-base">
                3
              </div>
            </div>
          )}
        </div>
      )}

      {/* Detailed Table */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl border border-pink-100 dark:border-pink-900/30 overflow-hidden shadow-lg">
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 dark:text-white text-base flex items-center gap-2">
            <Trophy className="w-4 h-4 text-pink-500" />
            Full Leaderboard Roster
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            {players.length} Friends Playing
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {sorted.map((player, index) => {
            const rank = index + 1;
            return (
              <div
                key={player.id}
                className="p-4 flex items-center justify-between hover:bg-pink-50/40 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-7 text-center font-mono font-bold text-sm ${
                    rank === 1 ? 'text-amber-500 font-black' : rank === 2 ? 'text-slate-400' : rank === 3 ? 'text-amber-700' : 'text-slate-400'
                  }`}>
                    #{rank}
                  </span>

                  <div className="w-11 h-11 rounded-xl bg-pink-100 dark:bg-slate-800 flex items-center justify-center text-2xl shadow-sm border border-pink-200/50 dark:border-slate-700">
                    {player.avatar}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 dark:text-white text-sm">
                        {player.name}
                      </span>
                      {player.isHost && (
                        <span className="text-[10px] bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 px-2 py-0.5 rounded-full font-bold">
                          Host
                        </span>
                      )}
                      {player.isBot && (
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded font-medium">
                          Party Guest
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>{player.gamesPlayed} games played</span>
                      <span>·</span>
                      <span>{player.wins} rounds won</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono tabular-nums font-black text-lg text-pink-600 dark:text-pink-400">
                    {player.points} pts
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

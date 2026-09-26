import React from 'react';
import { Player, GameId } from '../types/party';
import { GAMES_CATALOG } from '../data/gamesData';
import { sound, triggerHaptic } from '../utils/audio';
import { Sparkles, Users, Crown, Play, PartyPopper, HelpCircle, Trophy, Shuffle } from 'lucide-react';

interface HomeLobbyProps {
  players: Player[];
  roomCode: string;
  roomName: string;
  currentPlayer: Player;
  onSelectGame: (gameId: GameId) => void;
  onOpenCreateJoin: (mode?: 'create' | 'join') => void;
  onOpenTutorial: () => void;
  onGoToLeaderboard: () => void;
}

export const HomeLobbyView: React.FC<HomeLobbyProps> = ({
  players,
  roomCode,
  roomName,
  currentPlayer,
  onSelectGame,
  onOpenCreateJoin,
  onOpenTutorial,
  onGoToLeaderboard,
}) => {
  const handleRandomGame = () => {
    sound.playClick();
    triggerHaptic('medium');
    const random = GAMES_CATALOG[Math.floor(Math.random() * GAMES_CATALOG.length)];
    onSelectGame(random.id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Hero Banner Section */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white shadow-2xl mb-12">
        {/* Decorative background glow & illustration */}
        <div className="absolute inset-0 opacity-25 mix-blend-overlay">
          <img
            src="/src/assets/images/kitty_party_hero_1790430480478.jpg"
            alt="Kitty Party Festive Atmosphere"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 px-6 py-12 sm:px-12 sm:py-16 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-white/20">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
            The Ultimate Gathering Playground
          </div>

          <h1 className="text-4xl sm:text-6xl font-serif-display font-extrabold tracking-tight leading-tight mb-3">
            KITTY PARTY FUN 🎉
          </h1>

          <p className="text-lg sm:text-xl font-medium text-pink-100 tracking-wide mb-8">
            Play • Laugh • Compete • Enjoy
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                sound.playClick();
                onOpenCreateJoin('create');
              }}
              className="px-6 py-3.5 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-slate-900 font-extrabold text-sm sm:text-base rounded-2xl shadow-xl shadow-amber-400/25 transition-all transform hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <PartyPopper className="w-5 h-5" />
              Start New Party
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onOpenCreateJoin('join');
              }}
              className="px-6 py-3.5 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold text-sm sm:text-base rounded-2xl border border-white/30 transition-all transform hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <Users className="w-5 h-5" />
              Join Game Room
            </button>

            <button
              onClick={handleRandomGame}
              className="px-4 py-3.5 bg-purple-900/40 hover:bg-purple-900/60 backdrop-blur-md text-white font-semibold text-xs sm:text-sm rounded-2xl border border-purple-400/30 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Shuffle className="w-4 h-4 text-amber-300" />
              Random Game
            </button>

            <button
              onClick={onOpenTutorial}
              className="px-3.5 py-3.5 text-pink-200 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
            >
              <HelpCircle className="w-4 h-4" />
              How to Play
            </button>
          </div>
        </div>

        {/* Floating party badge in corner */}
        <div className="hidden lg:block absolute bottom-6 right-8 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-left max-w-xs">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-pink-200">
              Active Room: {roomCode}
            </span>
          </div>
          <div className="text-sm font-bold truncate">{roomName}</div>
          <div className="text-xs text-pink-100/80 mt-0.5">{players.length} players connected</div>
        </div>
      </div>

      {/* Active Room & Players Bar */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl p-6 border border-pink-100 dark:border-pink-900/30 shadow-lg mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-pink-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg">👑</span>
              <h2 className="text-xl font-serif-display font-bold text-slate-800 dark:text-white">
                {roomName}
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Room Code: <span className="font-mono font-bold text-pink-600 dark:text-pink-400">{roomCode}</span> · Share this with friends nearby or on WhatsApp!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-slate-500 block">Leader</span>
              <span className="text-xs font-bold text-amber-500 font-mono">
                {players[0]?.name || 'Player'} ({players[0]?.points || 0} pts)
              </span>
            </div>
            <button
              onClick={onGoToLeaderboard}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1 cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5" />
              Podium
            </button>
          </div>
        </div>

        {/* Players Avatar Row */}
        <div className="mt-4 flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {players.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-2 p-2 px-3 rounded-2xl bg-pink-50/70 dark:bg-slate-800/80 border border-pink-100 dark:border-slate-700 shrink-0"
            >
              <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center text-xl shadow-xs">
                {p.avatar}
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                  <span>{p.name}</span>
                  {p.isHost && (
                    <span className="text-[9px] text-pink-600 font-black">👑</span>
                  )}
                </div>
                <div className="text-[10px] font-mono text-slate-500">
                  {p.points} pts
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={() => onOpenCreateJoin('join')}
            className="flex items-center gap-1.5 p-2 px-3.5 rounded-2xl border-2 border-dashed border-pink-300 dark:border-pink-800 text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-slate-800 text-xs font-bold shrink-0 transition-colors cursor-pointer"
          >
            <span>+</span> Invite Friend
          </button>
        </div>
      </div>

      {/* 10 Mini-Games Showcase Grid */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-950/60 px-3 py-1 rounded-full inline-block mb-1">
              Party Games Library
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif-display font-extrabold text-slate-900 dark:text-white">
              Pick Any Game to Play Now
            </h2>
          </div>
          <span className="text-xs text-slate-500">10 Playable Games</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {GAMES_CATALOG.map((game) => (
            <div
              key={game.id}
              className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl p-5 border border-pink-100 dark:border-pink-900/30 hover:border-pink-300 dark:hover:border-pink-700 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group transform hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-4xl filter drop-shadow group-hover:scale-110 transition-transform">
                    {game.icon}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/60 px-2 py-0.5 rounded-full border border-pink-200 dark:border-pink-800">
                    {game.badge}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">
                  {game.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2 mb-4">
                  {game.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500">
                  ⏱️ {game.estMinutes}
                </span>

                <button
                  onClick={() => {
                    sound.playClick();
                    triggerHaptic('medium');
                    onSelectGame(game.id);
                  }}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all transform active:scale-95 cursor-pointer flex items-center gap-1"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Play
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

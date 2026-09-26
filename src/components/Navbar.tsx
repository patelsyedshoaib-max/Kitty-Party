import React from 'react';
import { Volume2, VolumeX, Moon, Sun, Crown, Users } from 'lucide-react';
import { sound } from '../utils/audio';
import { ThemeMode } from '../utils/theme';

interface NavbarProps {
  currentTab: 'home' | 'games' | 'dares' | 'leaderboard' | 'host';
  onSelectTab: (tab: 'home' | 'games' | 'dares' | 'leaderboard' | 'host') => void;
  roomCode: string;
  roomName: string;
  theme: ThemeMode;
  onToggleTheme: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenCreateJoin: () => void;
  currentPlayerName: string;
  currentPlayerAvatar: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  roomCode,
  roomName,
  theme,
  onToggleTheme,
  isMuted,
  onToggleMute,
  onOpenCreateJoin,
  currentPlayerName,
  currentPlayerAvatar,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-pink-100 dark:border-pink-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark in display face */}
        <button
          onClick={() => onSelectTab('home')}
          className="text-xl sm:text-2xl font-serif-display font-extrabold tracking-tight bg-gradient-to-r from-pink-600 via-purple-600 to-amber-500 bg-clip-text text-transparent hover:opacity-90 transition-opacity cursor-pointer text-left whitespace-nowrap"
        >
          Kitty Party Fun 🎉
        </button>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600 dark:text-slate-300">
          <button
            onClick={() => onSelectTab('home')}
            className={`transition-colors hover:text-pink-600 dark:hover:text-pink-400 cursor-pointer ${
              currentTab === 'home' ? 'text-pink-600 dark:text-pink-400 font-bold' : ''
            }`}
          >
            Party Lobby
          </button>
          <button
            onClick={() => onSelectTab('games')}
            className={`transition-colors hover:text-pink-600 dark:hover:text-pink-400 cursor-pointer ${
              currentTab === 'games' ? 'text-pink-600 dark:text-pink-400 font-bold' : ''
            }`}
          >
            All 10 Games
          </button>
          <button
            onClick={() => onSelectTab('dares')}
            className={`transition-colors hover:text-pink-600 dark:hover:text-pink-400 cursor-pointer ${
              currentTab === 'dares' ? 'text-pink-600 dark:text-pink-400 font-bold' : ''
            }`}
          >
            Fun Dares 💃
          </button>
          <button
            onClick={() => onSelectTab('leaderboard')}
            className={`transition-colors hover:text-pink-600 dark:hover:text-pink-400 cursor-pointer ${
              currentTab === 'leaderboard' ? 'text-pink-600 dark:text-pink-400 font-bold' : ''
            }`}
          >
            Leaderboard 🏆
          </button>
          <button
            onClick={() => onSelectTab('host')}
            className={`transition-colors hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer flex items-center gap-1 ${
              currentTab === 'host' ? 'text-purple-600 dark:text-purple-400 font-bold' : ''
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-amber-500" />
            Host Console
          </button>
        </nav>

        {/* Zone 3: Primary actions & quick indicators */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sound Toggle */}
          <button
            onClick={onToggleMute}
            aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-emerald-500" />}
          </button>

          {/* Theme Dark/Light Toggle */}
          <button
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-600" />}
          </button>

          {/* Room Pill */}
          <button
            onClick={onOpenCreateJoin}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-50 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-800/60 text-xs font-mono font-bold text-pink-700 dark:text-pink-300 hover:bg-pink-100 transition-colors cursor-pointer"
            title="Click to Switch or Create Room"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{roomCode}</span>
          </button>

          {/* Player Avatar & Start/Join Action */}
          <button
            onClick={onOpenCreateJoin}
            className="px-3.5 py-1.5 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-600 hover:to-amber-600 text-white font-bold text-xs rounded-xl shadow-sm transition-all transform active:scale-95 cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <span>{currentPlayerAvatar}</span>
            <span className="max-w-[70px] sm:max-w-[100px] truncate">{currentPlayerName}</span>
          </button>
        </div>
      </div>

      {/* Mobile Subnavigation Row */}
      <div className="md:hidden flex items-center justify-around border-t border-pink-100 dark:border-slate-800 py-2 px-2 text-xs font-semibold bg-white/95 dark:bg-slate-900/95 overflow-x-auto scrollbar-none">
        <button
          onClick={() => onSelectTab('home')}
          className={`px-2.5 py-1 rounded-lg ${currentTab === 'home' ? 'bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300' : 'text-slate-600 dark:text-slate-400'}`}
        >
          Lobby
        </button>
        <button
          onClick={() => onSelectTab('games')}
          className={`px-2.5 py-1 rounded-lg ${currentTab === 'games' ? 'bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300' : 'text-slate-600 dark:text-slate-400'}`}
        >
          10 Games
        </button>
        <button
          onClick={() => onSelectTab('dares')}
          className={`px-2.5 py-1 rounded-lg ${currentTab === 'dares' ? 'bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300' : 'text-slate-600 dark:text-slate-400'}`}
        >
          Dares
        </button>
        <button
          onClick={() => onSelectTab('leaderboard')}
          className={`px-2.5 py-1 rounded-lg ${currentTab === 'leaderboard' ? 'bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300' : 'text-slate-600 dark:text-slate-400'}`}
        >
          Podium
        </button>
        <button
          onClick={() => onSelectTab('host')}
          className={`px-2.5 py-1 rounded-lg ${currentTab === 'host' ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300' : 'text-slate-600 dark:text-slate-400'}`}
        >
          Host
        </button>
      </div>
    </header>
  );
};

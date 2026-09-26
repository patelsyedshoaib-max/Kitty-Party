import React, { useState } from 'react';
import { Player, GameId, RoomSettings } from '../types/party';
import { GAMES_CATALOG } from '../data/gamesData';
import { sound, triggerHaptic } from '../utils/audio';
import { Crown, Play, Users, Plus, Trash2, Award, RotateCcw, Trophy, Settings } from 'lucide-react';

interface HostDashboardProps {
  players: Player[];
  activeGameId: GameId | null;
  settings: RoomSettings;
  onSelectGame: (gameId: GameId) => void;
  onUpdateSettings: (newSettings: RoomSettings) => void;
  onAddPlayer: (name: string, avatar: string) => void;
  onRemovePlayer: (playerId: string) => void;
  onAwardBonusPoints: (playerId: string, points: number) => void;
  onResetScores: () => void;
  onTriggerWinner: () => void;
}

export const HostDashboard: React.FC<HostDashboardProps> = ({
  players,
  activeGameId,
  settings,
  onSelectGame,
  onUpdateSettings,
  onAddPlayer,
  onRemovePlayer,
  onAwardBonusPoints,
  onResetScores,
  onTriggerWinner,
}) => {
  const [newPlayerName, setNewPlayerName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🌸');
  const [bonusPlayerId, setBonusPlayerId] = useState<string>(players[0]?.id || '');
  const [bonusAmount, setBonusAmount] = useState(25);

  const handleCreatePlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayerName.trim()) return;
    sound.playClick();
    triggerHaptic('light');
    onAddPlayer(newPlayerName.trim(), selectedAvatar);
    setNewPlayerName('');
  };

  const handleGiveBonus = () => {
    sound.playSuccess();
    triggerHaptic('success');
    onAwardBonusPoints(bonusPlayerId, bonusAmount);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-950/60 px-3.5 py-1 rounded-full inline-block mb-1">
            Host & Admin Console
          </span>
          <h2 className="text-3xl font-serif-display font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Crown className="w-7 h-7 text-amber-500" />
            Party Control Room
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (confirm('Are you sure you want to conclude the party and crown the winner?')) {
                onTriggerWinner();
              }
            }}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-pink-600 text-white font-bold text-xs rounded-xl shadow-md hover:from-amber-600 hover:to-pink-700 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Trophy className="w-4 h-4" />
            Crown Winner & End Party 🏆
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Game Launcher (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl p-6 border border-pink-100 dark:border-slate-800 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2">
                <Play className="w-5 h-5 text-pink-500" />
                Select & Launch Mini-Game
              </h3>
              <span className="text-xs text-slate-500">10 Party Games Available</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {GAMES_CATALOG.map((game) => {
                const isActive = activeGameId === game.id;
                return (
                  <button
                    key={game.id}
                    onClick={() => {
                      sound.playClick();
                      triggerHaptic('medium');
                      onSelectGame(game.id);
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all transform active:scale-98 flex items-start gap-3 cursor-pointer ${
                      isActive
                        ? 'bg-pink-50 dark:bg-pink-950/40 border-pink-500 ring-2 ring-pink-400/40'
                        : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-pink-300'
                    }`}
                  >
                    <span className="text-3xl filter drop-shadow select-none">{game.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-800 dark:text-white truncate">
                          {game.title}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {game.tagline}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Settings Panel */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl p-6 border border-pink-100 dark:border-slate-800 shadow-lg">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2 mb-4">
              <Settings className="w-4 h-4 text-purple-500" />
              Party Game Settings
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Default Timer Duration (Seconds)
                </label>
                <div className="flex gap-2">
                  {[15, 20, 30, 45].map((sec) => (
                    <button
                      key={sec}
                      onClick={() => onUpdateSettings({ ...settings, roundDuration: sec })}
                      className={`flex-1 py-2 text-xs font-mono font-bold rounded-xl border transition-all cursor-pointer ${
                        settings.roundDuration === sec
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {sec}s
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Difficulty Level
                </label>
                <div className="flex gap-2">
                  {(['easy', 'medium', 'spicy'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => onUpdateSettings({ ...settings, difficulty: lvl })}
                      className={`flex-1 py-2 text-xs font-bold capitalize rounded-xl border transition-all cursor-pointer ${
                        settings.difficulty === lvl
                          ? 'bg-pink-600 text-white border-pink-600'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Player Management & Manual Point Awards (1 col) */}
        <div className="space-y-6">
          {/* Quick Bonus Points Award */}
          <div className="bg-gradient-to-br from-amber-50 to-pink-50/50 dark:from-slate-800 dark:to-slate-800/80 rounded-3xl p-6 border border-amber-200 dark:border-amber-900/40 shadow-lg">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2 mb-3">
              <Award className="w-5 h-5 text-amber-500" />
              Award Host Bonus Stars ⭐
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
              Award instant points for hilarious answers, witty jokes, or dazzling outfits!
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">Select Player</label>
                <select
                  value={bonusPlayerId}
                  onChange={(e) => setBonusPlayerId(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white rounded-xl px-3 py-2 text-xs font-semibold"
                >
                  {players.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.avatar} {p.name} ({p.points} pts)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">Bonus Points</label>
                <div className="flex gap-2">
                  {[10, 25, 50].map((pts) => (
                    <button
                      key={pts}
                      type="button"
                      onClick={() => setBonusAmount(pts)}
                      className={`flex-1 py-1.5 text-xs font-mono font-bold rounded-xl border cursor-pointer ${
                        bonusAmount === pts
                          ? 'bg-amber-500 text-white border-amber-500'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200'
                      }`}
                    >
                      +{pts}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGiveBonus}
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white font-bold text-xs rounded-xl shadow cursor-pointer"
              >
                Award +{bonusAmount} Points! 🌟
              </button>
            </div>
          </div>

          {/* Manage Players Roster */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl p-6 border border-pink-100 dark:border-slate-800 shadow-lg">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center justify-between mb-3">
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4 text-pink-500" />
                Player Roster ({players.length})
              </span>
              <button
                onClick={() => {
                  if (confirm('Reset all player points to 0?')) onResetScores();
                }}
                className="text-[11px] text-rose-500 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
              >
                <RotateCcw className="w-3 h-3" /> Reset Scores
              </button>
            </h3>

            {/* Add Player Form */}
            <form onSubmit={handleCreatePlayer} className="flex gap-2 mb-4">
              <input
                type="text"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                placeholder="Friend's Name..."
                className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-pink-600 text-white text-xs font-bold rounded-xl hover:bg-pink-700 cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </form>

            {/* List */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {players.map((p) => (
                <div
                  key={p.id}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{p.avatar}</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {p.name}
                    </span>
                    {p.isHost && (
                      <span className="text-[9px] bg-pink-100 text-pink-600 px-1.5 py-0.5 rounded-full font-bold">
                        Host
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-pink-600 dark:text-pink-400">
                      {p.points} pts
                    </span>
                    {!p.isHost && (
                      <button
                        onClick={() => onRemovePlayer(p.id)}
                        className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { AVATAR_OPTIONS } from '../data/gamesData';
import { generateRoomCode } from '../utils/partyState';
import { sound, triggerHaptic } from '../utils/audio';
import { Sparkles, Users, PartyPopper, ArrowRight, X } from 'lucide-react';

interface CreateJoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRoom: (roomName: string, hostName: string, avatar: string, code: string) => void;
  onJoinRoom: (code: string, playerName: string, avatar: string) => void;
  initialMode?: 'create' | 'join';
}

export const CreateJoinModal: React.FC<CreateJoinModalProps> = ({
  isOpen,
  onClose,
  onCreateRoom,
  onJoinRoom,
  initialMode = 'create',
}) => {
  const [tab, setTab] = useState<'create' | 'join'>(initialMode);
  const [roomName, setRoomName] = useState("Pooja's Sparkle Kitty");
  const [nickname, setNickname] = useState('Party Diva');
  const [selectedAvatar, setSelectedAvatar] = useState('👑');
  const [joinCode, setJoinCode] = useState('');

  if (!isOpen) return null;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim() || !nickname.trim()) return;
    sound.playSuccess();
    triggerHaptic('success');
    const code = generateRoomCode();
    onCreateRoom(roomName.trim(), nickname.trim(), selectedAvatar, code);
    onClose();
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim() || !nickname.trim()) return;
    sound.playSuccess();
    triggerHaptic('success');
    onJoinRoom(joinCode.trim().toUpperCase(), nickname.trim(), selectedAvatar);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-pink-200 dark:border-pink-900/60 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setTab('create');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              tab === 'create'
                ? 'bg-white dark:bg-slate-700 text-pink-600 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <PartyPopper className="w-3.5 h-3.5" />
            Host New Party
          </button>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setTab('join');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              tab === 'join'
                ? 'bg-white dark:bg-slate-700 text-pink-600 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Join with Code
          </button>
        </div>

        {/* Avatar Picker */}
        <div className="mb-5">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-2">
            Choose Your Party Avatar
          </label>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {AVATAR_OPTIONS.map((item) => (
              <button
                key={item.emoji}
                type="button"
                onClick={() => {
                  sound.playClick();
                  setSelectedAvatar(item.emoji);
                }}
                className={`w-11 h-11 rounded-xl text-xl flex items-center justify-center shrink-0 transition-all cursor-pointer border ${
                  selectedAvatar === item.emoji
                    ? 'bg-pink-100 dark:bg-pink-950/60 border-pink-500 scale-110 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-pink-300'
                }`}
                title={item.label}
              >
                {item.emoji}
              </button>
            ))}
          </div>
        </div>

        {tab === 'create' ? (
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                Party / Kitty Name
              </label>
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="e.g. Sparkle Soirée, Chai & Gossip"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                Your Nickname
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="e.g. Pooja, Queen P"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 font-medium"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-600 hover:to-amber-600 text-white font-bold rounded-xl shadow-lg shadow-pink-500/25 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <Sparkles className="w-4 h-4" />
              Start Party & Create Code
            </button>
          </form>
        ) : (
          <form onSubmit={handleJoinSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                Party Room Code
              </label>
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="e.g. KITTY-7788"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 font-mono font-bold uppercase tracking-wider"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                Your Nickname
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="e.g. Simran, Ritu"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 font-medium"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg shadow-purple-500/25 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <ArrowRight className="w-4 h-4" />
              Join Party Room
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

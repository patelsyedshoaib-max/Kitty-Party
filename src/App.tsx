/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GameId, Player, RoomState, ChatMessage, RoomSettings } from './types/party';
import {
  loadSavedRoomState,
  saveRoomState,
  loadCurrentPlayerId,
  saveCurrentPlayerId,
  broadcastChatMessage,
} from './utils/partyState';
import { sound } from './utils/audio';
import { getInitialTheme, applyTheme, ThemeMode } from './utils/theme';
import { Navbar } from './components/Navbar';
import { HomeLobbyView } from './components/HomeLobbyView';
import { ActiveGameContainer } from './components/ActiveGameContainer';
import { PartyChallengesView } from './components/PartyChallengesView';
import { LiveLeaderboard } from './components/LiveLeaderboard';
import { HostDashboard } from './components/HostDashboard';
import { CreateJoinModal } from './components/CreateJoinModal';
import { TutorialModal } from './components/TutorialModal';
import { WinnerModal } from './components/WinnerModal';
import { ChatReactionsDrawer } from './components/ChatReactionsDrawer';
import { GAMES_CATALOG } from './data/gamesData';
import { Sparkles, Heart } from 'lucide-react';

export default function App() {
  // Theme & Sound
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);
  const [isMuted, setIsMuted] = useState<boolean>(() => sound.getMuted());

  // Room State
  const [roomState, setRoomState] = useState<RoomState>(loadSavedRoomState);
  const [currentPlayerId, setCurrentPlayerId] = useState<string>(loadCurrentPlayerId);

  // Active View & Modals
  const [currentTab, setCurrentTab] = useState<'home' | 'games' | 'dares' | 'leaderboard' | 'host'>('home');
  const [activeGameId, setActiveGameId] = useState<GameId | null>(null);
  const [isCreateJoinOpen, setIsCreateJoinOpen] = useState(false);
  const [createJoinMode, setCreateJoinMode] = useState<'create' | 'join'>('create');
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isWinnerModalOpen, setIsWinnerModalOpen] = useState(false);

  // Chat & Reactions
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      senderId: 'host-1',
      senderName: 'Pooja (Host)',
      senderAvatar: '👑',
      text: 'Welcome everyone to our Kitty Party! Ready for games? 🥳',
      timestamp: Date.now() - 100000,
    },
    {
      id: 'msg-2',
      senderId: 'bot-1',
      senderName: 'Neha',
      senderAvatar: '💃',
      text: 'I am so ready! Who wants to do Rapid Fire first? ⚡',
      timestamp: Date.now() - 50000,
    },
  ]);

  // Apply theme class on mount and change
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Save room state whenever it changes
  useEffect(() => {
    saveRoomState(roomState);
  }, [roomState]);

  // Save current player ID
  useEffect(() => {
    saveCurrentPlayerId(currentPlayerId);
  }, [currentPlayerId]);

  // Setup multi-tab BroadcastChannel listener
  useEffect(() => {
    if (typeof window === 'undefined' || !('BroadcastChannel' in window)) return;
    try {
      const channel = new BroadcastChannel('kitty_party_broadcast_channel');
      channel.onmessage = (event) => {
        if (event.data?.type === 'ROOM_UPDATE' && event.data?.state) {
          setRoomState(event.data.state);
        } else if (event.data?.type === 'CHAT_MESSAGE' && event.data?.message) {
          setChatMessages((prev) => [...prev, event.data.message]);
        }
      };
      return () => {
        channel.close();
      };
    } catch {}
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  };

  const toggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const currentPlayer =
    roomState.players.find((p) => p.id === currentPlayerId) ||
    roomState.players[0] || {
      id: 'temp-1',
      name: 'Guest Player',
      avatar: '👑',
      isHost: true,
      points: 0,
      gamesPlayed: 0,
      wins: 0,
      isReady: true,
    };

  // Handlers for game selection
  const handleSelectGame = (id: GameId) => {
    setActiveGameId(id);
    setCurrentTab('games');
  };

  const handleGameFinish = (earnedPoints: number, winnerName: string) => {
    setRoomState((prev) => {
      const updatedPlayers = prev.players.map((p) => {
        if (p.name === winnerName || p.id === currentPlayer.id) {
          return {
            ...p,
            points: p.points + earnedPoints,
            gamesPlayed: p.gamesPlayed + 1,
            wins: p.name === winnerName ? p.wins + 1 : p.wins,
          };
        }
        return p;
      });

      return {
        ...prev,
        players: updatedPlayers,
        gameHistory: [
          {
            gameId: activeGameId || 'rapid_fire',
            winnerName,
            pointsAwarded: earnedPoints,
            timestamp: Date.now(),
          },
          ...prev.gameHistory,
        ],
      };
    });
  };

  // Room Creation / Join
  const handleCreateRoom = (roomName: string, hostName: string, avatar: string, code: string) => {
    const newHostId = `player-${Date.now()}`;
    const newHost: Player = {
      id: newHostId,
      name: hostName,
      avatar,
      isHost: true,
      points: 0,
      gamesPlayed: 0,
      wins: 0,
      isReady: true,
    };

    // Pre-seed 3 bot friends so the room is immediately alive
    const seedGuests: Player[] = [
      { id: 'bot-1', name: 'Neha', avatar: '💃', isHost: false, points: 30, gamesPlayed: 1, wins: 0, isReady: true, isBot: true },
      { id: 'bot-2', name: 'Simran', avatar: '🌸', isHost: false, points: 40, gamesPlayed: 1, wins: 1, isReady: true, isBot: true },
      { id: 'bot-3', name: 'Anjali', avatar: '💎', isHost: false, points: 20, gamesPlayed: 1, wins: 0, isReady: true, isBot: true },
    ];

    setRoomState({
      code,
      name: roomName,
      hostId: newHostId,
      activeGameId: null,
      status: 'LOBBY',
      settings: {
        roundDuration: 25,
        soundEffects: true,
        allowBots: true,
        difficulty: 'medium',
      },
      players: [newHost, ...seedGuests],
      gameHistory: [],
    });

    setCurrentPlayerId(newHostId);
    setActiveGameId(null);
    setCurrentTab('home');
  };

  const handleJoinRoom = (code: string, playerName: string, avatar: string) => {
    const newPlayerId = `player-${Date.now()}`;
    const newPlayer: Player = {
      id: newPlayerId,
      name: playerName,
      avatar,
      isHost: false,
      points: 0,
      gamesPlayed: 0,
      wins: 0,
      isReady: true,
    };

    setRoomState((prev) => ({
      ...prev,
      code,
      players: [...prev.players.filter((p) => p.name !== playerName), newPlayer],
    }));

    setCurrentPlayerId(newPlayerId);
    setActiveGameId(null);
    setCurrentTab('home');
  };

  // Host Controls
  const handleUpdateSettings = (newSettings: RoomSettings) => {
    setRoomState((prev) => ({ ...prev, settings: newSettings }));
  };

  const handleAddPlayer = (name: string, avatar: string) => {
    const newPlayer: Player = {
      id: `player-${Date.now()}`,
      name,
      avatar,
      isHost: false,
      points: 0,
      gamesPlayed: 0,
      wins: 0,
      isReady: true,
    };
    setRoomState((prev) => ({ ...prev, players: [...prev.players, newPlayer] }));
  };

  const handleRemovePlayer = (playerId: string) => {
    setRoomState((prev) => ({
      ...prev,
      players: prev.players.filter((p) => p.id !== playerId),
    }));
  };

  const handleAwardBonusPoints = (playerId: string, points: number) => {
    setRoomState((prev) => ({
      ...prev,
      players: prev.players.map((p) =>
        p.id === playerId ? { ...p, points: p.points + points } : p
      ),
    }));
  };

  const handleResetScores = () => {
    setRoomState((prev) => ({
      ...prev,
      players: prev.players.map((p) => ({ ...p, points: 0, wins: 0, gamesPlayed: 0 })),
      gameHistory: [],
    }));
  };

  const handleAwardDarePoints = (points: number, dareTitle: string) => {
    setRoomState((prev) => ({
      ...prev,
      players: prev.players.map((p) =>
        p.id === currentPlayer.id ? { ...p, points: p.points + points } : p
      ),
      gameHistory: [
        {
          gameId: 'spin_wheel',
          winnerName: currentPlayer.name,
          pointsAwarded: points,
          timestamp: Date.now(),
        },
        ...prev.gameHistory,
      ],
    }));
  };

  // Chat
  const handleSendMessage = (text: string) => {
    const msg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentPlayer.id,
      senderName: currentPlayer.name,
      senderAvatar: currentPlayer.avatar,
      text,
      timestamp: Date.now(),
    };
    setChatMessages((prev) => [...prev, msg]);
    broadcastChatMessage(msg);
  };

  const handleSendReaction = (emoji: string) => {
    const msg: ChatMessage = {
      id: `reaction-${Date.now()}`,
      senderId: currentPlayer.id,
      senderName: currentPlayer.name,
      senderAvatar: currentPlayer.avatar,
      text: `${emoji} cheered!`,
      timestamp: Date.now(),
      type: 'reaction',
    };
    setChatMessages((prev) => [...prev, msg]);
    broadcastChatMessage(msg);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-purple-50/50 to-pink-50 dark:from-slate-950 dark:via-purple-950/20 dark:to-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      {/* Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          sound.playClick();
          setActiveGameId(null);
          setCurrentTab(tab);
        }}
        roomCode={roomState.code}
        roomName={roomState.name}
        theme={theme}
        onToggleTheme={toggleTheme}
        isMuted={isMuted}
        onToggleMute={toggleMute}
        onOpenCreateJoin={() => {
          setCreateJoinMode('create');
          setIsCreateJoinOpen(true);
        }}
        currentPlayerName={currentPlayer.name}
        currentPlayerAvatar={currentPlayer.avatar}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* If Active Game is Running */}
        {activeGameId ? (
          <ActiveGameContainer
            gameId={activeGameId}
            players={roomState.players}
            currentPlayer={currentPlayer}
            roundDuration={roomState.settings.roundDuration}
            onExitGame={() => setActiveGameId(null)}
            onGameFinish={handleGameFinish}
            onGoToLeaderboard={() => {
              setActiveGameId(null);
              setCurrentTab('leaderboard');
            }}
          />
        ) : (
          <>
            {currentTab === 'home' && (
              <HomeLobbyView
                players={roomState.players}
                roomCode={roomState.code}
                roomName={roomState.name}
                currentPlayer={currentPlayer}
                onSelectGame={handleSelectGame}
                onOpenCreateJoin={(mode) => {
                  setCreateJoinMode(mode || 'create');
                  setIsCreateJoinOpen(true);
                }}
                onOpenTutorial={() => setIsTutorialOpen(true)}
                onGoToLeaderboard={() => setCurrentTab('leaderboard')}
              />
            )}

            {currentTab === 'games' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <div className="text-center mb-8">
                  <span className="text-xs uppercase font-extrabold tracking-widest text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-950/60 px-3.5 py-1 rounded-full inline-block mb-2">
                    Party Games Library
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-serif-display font-extrabold text-slate-900 dark:text-white mb-2">
                    All 10 Interactive Mini-Games
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 max-w-lg mx-auto text-sm">
                    Select any game to start playing with your friends right away!
                  </p>
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
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3 mb-4">
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
                            handleSelectGame(game.id);
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all transform active:scale-95 cursor-pointer"
                        >
                          Launch Game
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentTab === 'dares' && (
              <PartyChallengesView
                onAwardDarePoints={handleAwardDarePoints}
                players={roomState.players}
              />
            )}

            {currentTab === 'leaderboard' && (
              <LiveLeaderboard
                players={roomState.players}
                roomName={roomState.name}
              />
            )}

            {currentTab === 'host' && (
              <HostDashboard
                players={roomState.players}
                activeGameId={activeGameId}
                settings={roomState.settings}
                onSelectGame={handleSelectGame}
                onUpdateSettings={handleUpdateSettings}
                onAddPlayer={handleAddPlayer}
                onRemovePlayer={handleRemovePlayer}
                onAwardBonusPoints={handleAwardBonusPoints}
                onResetScores={handleResetScores}
                onTriggerWinner={() => setIsWinnerModalOpen(true)}
              />
            )}
          </>
        )}
      </main>

      {/* Floating Chat & Reactions Drawer */}
      <ChatReactionsDrawer
        currentPlayer={currentPlayer}
        messages={chatMessages}
        onSendMessage={handleSendMessage}
        onSendReaction={handleSendReaction}
      />

      {/* Modals */}
      <CreateJoinModal
        isOpen={isCreateJoinOpen}
        initialMode={createJoinMode}
        onClose={() => setIsCreateJoinOpen(false)}
        onCreateRoom={handleCreateRoom}
        onJoinRoom={handleJoinRoom}
      />

      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
      />

      {isWinnerModalOpen && (
        <WinnerModal
          players={roomState.players}
          roomName={roomState.name}
          onPlayAgain={() => {
            setIsWinnerModalOpen(false);
            handleResetScores();
            setCurrentTab('home');
          }}
          onNewParty={() => {
            setIsWinnerModalOpen(false);
            setIsCreateJoinOpen(true);
            setCreateJoinMode('create');
          }}
          onClose={() => setIsWinnerModalOpen(false)}
        />
      )}

      {/* Clean Footer */}
      <footer className="mt-16 border-t border-pink-100 dark:border-pink-900/30 py-6 px-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 font-medium">
            <span>Kitty Party Fun</span>
            <span>·</span>
            <span>Play • Laugh • Compete • Enjoy</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <button
              onClick={() => setIsTutorialOpen(true)}
              className="hover:text-pink-600 transition-colors cursor-pointer"
            >
              How to Play
            </button>
            <button
              onClick={() => {
                setCreateJoinMode('create');
                setIsCreateJoinOpen(true);
              }}
              className="hover:text-pink-600 transition-colors cursor-pointer"
            >
              Host Party
            </button>
            <button
              onClick={() => setCurrentTab('leaderboard')}
              className="hover:text-pink-600 transition-colors cursor-pointer"
            >
              Podium
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

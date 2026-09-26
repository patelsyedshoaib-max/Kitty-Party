import { RoomState, Player, GameId, ChatMessage, RoomSettings } from '../types/party';
import { sound, triggerHaptic } from './audio';

const STORAGE_KEY = 'kitty_party_room_state_v1';
const CURRENT_PLAYER_KEY = 'kitty_party_current_player_v1';
const CHANNEL_NAME = 'kitty_party_broadcast_channel';

// Default initial state with vibrant sample room and bot party guests
export const INITIAL_ROOM_STATE: RoomState = {
  code: 'KITTY-7788',
  name: "Pooja's Sparkle Kitty",
  hostId: 'host-1',
  activeGameId: null,
  status: 'LOBBY',
  settings: {
    roundDuration: 25,
    soundEffects: true,
    allowBots: true,
    difficulty: 'medium',
  },
  players: [
    {
      id: 'host-1',
      name: 'Pooja (Host)',
      avatar: '👑',
      isHost: true,
      points: 120,
      gamesPlayed: 3,
      wins: 1,
      isReady: true,
    },
    {
      id: 'bot-1',
      name: 'Neha',
      avatar: '💃',
      isHost: false,
      points: 95,
      gamesPlayed: 3,
      wins: 1,
      isReady: true,
      isBot: true,
    },
    {
      id: 'bot-2',
      name: 'Simran',
      avatar: '🌸',
      isHost: false,
      points: 110,
      gamesPlayed: 3,
      wins: 1,
      isReady: true,
      isBot: true,
    },
    {
      id: 'bot-3',
      name: 'Anjali',
      avatar: '💎',
      isHost: false,
      points: 80,
      gamesPlayed: 3,
      wins: 0,
      isReady: true,
      isBot: true,
    },
  ],
  gameHistory: [
    { gameId: 'emoji_quiz', winnerName: 'Simran', pointsAwarded: 50, timestamp: Date.now() - 360000 },
    { gameId: 'rapid_fire', winnerName: 'Pooja (Host)', pointsAwarded: 40, timestamp: Date.now() - 240000 },
    { gameId: 'word_scramble', winnerName: 'Neha', pointsAwarded: 45, timestamp: Date.now() - 120000 },
  ],
};

// Singleton broadcast channel
let broadcastChannel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
  } catch {
    broadcastChannel = null;
  }
}

export function loadSavedRoomState(): RoomState {
  if (typeof window === 'undefined') return INITIAL_ROOM_STATE;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed && parsed.code && Array.isArray(parsed.players)) {
        return parsed;
      }
    }
  } catch {}
  return INITIAL_ROOM_STATE;
}

export function saveRoomState(state: RoomState) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: 'ROOM_UPDATE', state });
    }
  } catch {}
}

export function loadCurrentPlayerId(): string {
  if (typeof window === 'undefined') return 'host-1';
  try {
    const id = localStorage.getItem(CURRENT_PLAYER_KEY);
    if (id) return id;
  } catch {}
  return 'host-1';
}

export function saveCurrentPlayerId(id: string) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CURRENT_PLAYER_KEY, id);
  } catch {}
}

export function broadcastChatMessage(msg: ChatMessage) {
  if (broadcastChannel) {
    broadcastChannel.postMessage({ type: 'CHAT_MESSAGE', message: msg });
  }
}

export function generateRoomCode(): string {
  const letters = 'KITTY';
  const nums = Math.floor(1000 + Math.random() * 9000);
  return `${letters}-${nums}`;
}

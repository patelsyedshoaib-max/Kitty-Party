export type GameId =
  | 'rapid_fire'
  | 'guess_word'
  | 'emoji_quiz'
  | 'memory_match'
  | 'spin_wheel'
  | 'would_you_rather'
  | 'guess_who'
  | 'picture_quiz'
  | 'word_scramble'
  | 'lucky_number';

export interface Player {
  id: string;
  name: string;
  avatar: string;
  isHost: boolean;
  points: number;
  gamesPlayed: number;
  wins: number;
  isReady: boolean;
  isBot?: boolean;
}

export interface RoomSettings {
  roundDuration: number;
  soundEffects: boolean;
  allowBots: boolean;
  difficulty: 'easy' | 'medium' | 'spicy';
}

export interface RoomState {
  code: string;
  name: string;
  hostId: string;
  activeGameId: GameId | null;
  status: 'LOBBY' | 'PLAYING' | 'SUMMARY' | 'PARTY_WINNER';
  players: Player[];
  settings: RoomSettings;
  gameHistory: {
    gameId: GameId;
    winnerName: string;
    pointsAwarded: number;
    timestamp: number;
  }[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: number;
  type?: 'text' | 'reaction' | 'system';
}

export interface PartyDare {
  id: string;
  title: string;
  icon: string;
  instruction: string;
  category: 'dance' | 'acting' | 'comedy' | 'compliment' | 'challenge';
  timeSeconds: number;
  pointsReward: number;
}

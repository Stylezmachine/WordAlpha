export interface User {
  uid: string;
  email: string;
  displayName: string;
  avatar?: string;
  createdAt: string;
  lastActive: string;
  stats: UserStats;
  friends: string[];
  friendRequests: FriendRequest[];
}

export interface UserStats {
  totalGamesPlayed: number;
  gamesWon: number;
  wordsLearned: number;
  currentStreak: number;
  longestStreak: number;
  totalScore: number;
  averageScore: number;
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

export interface GameRoom {
  id: string;
  hostId: string;
  hostName: string;
  players: GamePlayer[];
  gameState: 'waiting' | 'playing' | 'finished';
  gameType: 'category-challenge';
  currentRound: number;
  maxRounds: number;
  currentLetter: string;
  categories: GameCategory[];
  rounds: GameRound[];
  createdAt: string;
  startedAt?: string;
  finishedAt?: string;
}

export interface GamePlayer {
  userId: string;
  displayName: string;
  avatar?: string;
  score: number;
  isReady: boolean;
  currentAnswers?: CategoryAnswers;
}

export interface GameCategory {
  id: string;
  name: string;
  description: string;
}

export interface CategoryAnswers {
  names: string;
  animals: string;
  places: string;
  things: string;
  submittedAt?: string;
}

export interface GameRound {
  roundNumber: number;
  letter: string;
  playerAnswers: {[userId: string]: CategoryAnswers};
  scores: {[userId: string]: number};
  startedAt: string;
  finishedAt?: string;
}

export interface FriendProfile {
  uid: string;
  displayName: string;
  avatar?: string;
  isOnline: boolean;
  lastActive: string;
  stats: UserStats;
}

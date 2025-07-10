export interface Player {
  id: number;
  name: string;
  score: number;
  rank: number;
}

export interface Prize {
  id: number;
  name: string;
  value: string;
  icon: React.ReactNode;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  color: string;
  picture?: string;
}

export interface LuckyDrawReward {
  title: string;
  picture: string;
  position: string;
}

export interface LuckyDrawResponse {
  id: string;
  eventId: string;
  drawDate: {
    _seconds: number;
    _nanoseconds: number;
  };
  maxEntries: number;
  maxTotalEntries: number;
  entryPriceCurrency: string;
  entryPriceTokens: number;
  numWinners: number;
  active: boolean;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  updatedAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  rewards: LuckyDrawReward[];
  participants: string[];
}

export interface Participant {
  id: string;
  name: string;
  picture?: string;
}

export type GameState = 'start' | 'ticker' | 'loading' | 'leaderboard' | 'error';
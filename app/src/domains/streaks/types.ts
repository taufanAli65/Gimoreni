export interface StreakLog {
  id: string;
  userId: string;
  date: string;
  didLog: boolean;
  createdAt: string;
}

export interface UserStreakInfo {
  id: string;
  currentStreak: number;
  longestStreak: number;
  lastLoggedDate: string | null;
}

export interface StreakData {
  user: UserStreakInfo;
  logs: StreakLog[];
}

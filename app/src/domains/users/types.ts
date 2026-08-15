import type { Role } from "../auth/types";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  role: Role;
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  lastLoggedDate: string | null;
  hasCompletedTutorial: boolean;
  allowance: number;
  balance: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserPayload {
  email: string;
  password?: string; // We'll generate a default one in the UI if not provided
  name: string;
  role?: Role;
  allowance?: number;
  balance?: number;
}

export interface UpdateUserPayload {
  name?: string;
  role?: Role;
  allowance?: number;
  balance?: number;
  isActive?: boolean;
}

export interface UpdateBalancePayload {
  amount: number;
  field: 'balance' | 'allowance';
  action: 'add' | 'subtract' | 'set';
}

export interface UpdateMePayload {
  name?: string;
  avatarUrl?: string | null;
  hasCompletedTutorial?: boolean;
}

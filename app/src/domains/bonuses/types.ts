export type BonusType = 'MONTHLY_COMPLETION' | 'STREAK_MILESTONE' | 'MANUAL';

export interface Bonus {
  id: string;
  userId: string;
  type: BonusType;
  amount: string; // from Prisma Decimal
  pointsBonus: number;
  description: string | null;
  month: number | null;
  year: number | null;
  isApplied: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    name: string;
    email: string;
  };
}

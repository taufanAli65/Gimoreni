export type QuestStatus = 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'EXPIRED';

export type RedemptionStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Quest {
  id: string;
  title: string;
  description: string;
  pointReward: number;
  status: QuestStatus;
  proofRequired: boolean;
  deadline: string | null;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    redemptions: number;
  };
}

export interface QuestRedemption {
  id: string;
  questId: string;
  userId: string;
  proofUrl: string | null;
  proofNote: string | null;
  status: RedemptionStatus;
  confirmedById: string | null;
  confirmedAt: string | null;
  rejectionNote: string | null;
  pointsAwarded: number | null;
  createdAt: string;
  updatedAt: string;
  
  // Relations that might be included depending on the endpoint
  quest?: {
    title: string;
    pointReward: number;
  };
  user?: {
    name: string;
    avatarUrl: string | null;
  };
}

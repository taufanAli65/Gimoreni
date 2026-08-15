import { z } from 'zod';
import { BonusType } from '@prisma/client';

export const createBonusSchema = z.object({
  body: z.object({
    userId: z.string().min(1, 'userId is required'),
    type: z.nativeEnum(BonusType),
    amount: z.number().min(0, 'Amount must be positive'),
    pointsBonus: z.number().int().min(0, 'Points bonus must be positive').optional().default(0),
    description: z.string().optional(),
    month: z.number().int().min(1).max(12).optional(),
    year: z.number().int().min(2000).optional(),
  }),
});

export const updateBonusSchema = z.object({
  body: z.object({
    type: z.nativeEnum(BonusType).optional(),
    amount: z.number().min(0).optional(),
    pointsBonus: z.number().int().min(0).optional(),
    description: z.string().optional(),
    month: z.number().int().min(1).max(12).optional(),
    year: z.number().int().min(2000).optional(),
  }),
});

export type CreateBonusDto = z.infer<typeof createBonusSchema>['body'];
export type UpdateBonusDto = z.infer<typeof updateBonusSchema>['body'];

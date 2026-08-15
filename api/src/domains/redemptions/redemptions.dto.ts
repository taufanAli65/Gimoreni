import { z } from 'zod';
import { RedemptionStatus } from '@prisma/client';

export const createRedemptionSchema = z.object({
  questId: z.string().min(1, 'Quest ID is required'),
  proofUrl: z.string().url('Invalid URL').optional().nullable(),
  proofNote: z.string().max(500, 'Note cannot exceed 500 characters').optional().nullable(),
});

export const rejectRedemptionSchema = z.object({
  rejectionNote: z.string().min(1, 'Rejection note is required').max(500),
});

export const redemptionFilterSchema = z.object({
  status: z.nativeEnum(RedemptionStatus).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export type CreateRedemptionDto = z.infer<typeof createRedemptionSchema>;
export type RejectRedemptionDto = z.infer<typeof rejectRedemptionSchema>;
export type RedemptionFilterDto = z.infer<typeof redemptionFilterSchema>;

import { z } from 'zod';
import { TransactionType } from '@prisma/client';

export const CreateTransactionDto = z.object({
  categoryId: z.string().min(1, 'Category ID is required'),
  type: z.nativeEnum(TransactionType),
  amount: z.number().positive('Amount must be positive'),
  description: z.string().optional(),
  date: z.string().datetime({ message: 'Date must be a valid ISO string' }), // Using datetime to enforce UTC ISO format
  receiptUrl: z.string().url('Must be a valid URL').optional().nullable(),
});

export type CreateTransactionInput = z.infer<typeof CreateTransactionDto>;

export const UpdateTransactionDto = CreateTransactionDto.partial();

export type UpdateTransactionInput = z.infer<typeof UpdateTransactionDto>;

export const TransactionFilterDto = z.object({
  userId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  type: z.nativeEnum(TransactionType).optional(),
  categoryId: z.string().optional(),
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('20'),
});

export type TransactionFilterInput = z.infer<typeof TransactionFilterDto>;

export const CalendarFilterDto = z.object({
  userId: z.string().optional(),
  month: z.string().regex(/^\d+$/).transform(Number).optional(),
  year: z.string().regex(/^\d+$/).transform(Number).optional(),
});

export type CalendarFilterInput = z.infer<typeof CalendarFilterDto>;

export const SummaryFilterDto = z.object({
  month: z.string().regex(/^\d+$/).transform(Number).optional(),
  year: z.string().regex(/^\d+$/).transform(Number).optional(),
});

export type SummaryFilterInput = z.infer<typeof SummaryFilterDto>;

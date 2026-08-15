import { z } from 'zod';
import { Role } from '../../shared/constants/roles';

export const createUserSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(1),
    role: z.nativeEnum(Role).optional().default(Role.USER),
    allowance: z.number().min(0).optional().default(0),
    balance: z.number().min(0).optional().default(0),
  }),
});

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    role: z.nativeEnum(Role).optional(),
    allowance: z.number().min(0).optional(),
    balance: z.number().min(0).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const updateBalanceSchema = z.object({
  body: z.object({
    amount: z.number().positive(),
    field: z.enum(['balance', 'allowance']),
    action: z.enum(['add', 'subtract', 'set']),
  }),
});

export const updateMeSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    avatarUrl: z.string().url().nullable().optional(),
    hasCompletedTutorial: z.boolean().optional(),
  }),
});

export type CreateUserDto = z.infer<typeof createUserSchema>['body'];
export type UpdateUserDto = z.infer<typeof updateUserSchema>['body'];
export type UpdateBalanceDto = z.infer<typeof updateBalanceSchema>['body'];
export type UpdateMeDto = z.infer<typeof updateMeSchema>['body'];

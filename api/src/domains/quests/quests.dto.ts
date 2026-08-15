import { z } from 'zod';
import { QuestStatus } from '@prisma/client';

export const createQuestSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().min(1, 'Description is required').max(500),
  pointReward: z.number().int().min(1, 'Point reward must be at least 1'),
  proofRequired: z.boolean().default(true),
  deadline: z.string().datetime().optional().nullable(),
});

export const updateQuestSchema = createQuestSchema.partial().extend({
  status: z.nativeEnum(QuestStatus).optional(),
});

export type CreateQuestDto = z.infer<typeof createQuestSchema>;
export type UpdateQuestDto = z.infer<typeof updateQuestSchema>;

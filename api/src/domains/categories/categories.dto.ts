import { z } from 'zod';
import { CategoryVisibility } from '@prisma/client';

export const CreateCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  icon: z.string().optional().nullable(),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Must be a valid hex color').optional().nullable(),
  visibility: z.nativeEnum(CategoryVisibility).optional(),
});

export type CreateCategoryDto = z.infer<typeof CreateCategorySchema>;

export const UpdateCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100).optional(),
  icon: z.string().optional().nullable(),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Must be a valid hex color').optional().nullable(),
  visibility: z.nativeEnum(CategoryVisibility).optional(),
  isActive: z.boolean().optional(),
});

export type UpdateCategoryDto = z.infer<typeof UpdateCategorySchema>;

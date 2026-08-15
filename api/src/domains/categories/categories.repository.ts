import { prisma } from '../../config/prisma';
import { Category, CategoryVisibility, Prisma } from '@prisma/client';
import { CreateCategoryDto, UpdateCategoryDto } from './categories.dto';

export class CategoriesRepository {
  async findMany(visibilityFilters: CategoryVisibility[]): Promise<Category[]> {
    return prisma.category.findMany({
      where: {
        isActive: true,
        visibility: {
          in: visibilityFilters,
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findById(id: string, visibilityFilters: CategoryVisibility[]): Promise<Category | null> {
    return prisma.category.findFirst({
      where: {
        id,
        isActive: true,
        visibility: {
          in: visibilityFilters,
        },
      },
    });
  }

  async create(data: CreateCategoryDto, createdById: string): Promise<Category> {
    return prisma.category.create({
      data: {
        ...data,
        createdById,
      },
    });
  }

  async update(id: string, data: UpdateCategoryDto): Promise<Category> {
    return prisma.category.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Category> {
    // We can do hard delete or soft delete. Let's do soft delete for safety, as transactions might depend on it.
    // Wait, requirement says "Delete a category (soft delete or hard delete)". Let's soft delete.
    return prisma.category.update({
      where: { id },
      data: { isActive: false },
    });
  }
}

export const categoriesRepository = new CategoriesRepository();

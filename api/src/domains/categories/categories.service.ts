import { Role, CategoryVisibility, Category } from '@prisma/client';
import { categoriesRepository } from './categories.repository';
import { CreateCategoryDto, UpdateCategoryDto } from './categories.dto';
import { AppError } from '../../shared/utils/AppError';

export class CategoriesService {
  private getVisibilityFilters(role: Role): CategoryVisibility[] {
    if (role === Role.ADMIN) {
      return [CategoryVisibility.ALL, CategoryVisibility.ADMIN_ONLY, CategoryVisibility.USER_ONLY];
    }
    return [CategoryVisibility.ALL, CategoryVisibility.USER_ONLY];
  }

  async getCategories(role: Role): Promise<Category[]> {
    const filters = this.getVisibilityFilters(role);
    return categoriesRepository.findMany(filters);
  }

  async getCategoryById(id: string, role: Role): Promise<Category> {
    const filters = this.getVisibilityFilters(role);
    const category = await categoriesRepository.findById(id, filters);
    
    if (!category) {
      throw new AppError(404, 'NOT_FOUND', 'Category not found');
    }
    
    return category;
  }

  async createCategory(data: CreateCategoryDto, userId: string, role: Role): Promise<Category> {
    if (role === Role.USER && data.visibility === CategoryVisibility.ADMIN_ONLY) {
      throw new AppError(403, 'FORBIDDEN', 'Users cannot create ADMIN_ONLY categories');
    }
    
    return categoriesRepository.create(data, userId);
  }

  async updateCategory(id: string, data: UpdateCategoryDto, userId: string, role: Role): Promise<Category> {
    const category = await categoriesRepository.findById(id, this.getVisibilityFilters(Role.ADMIN));
    
    if (!category) {
      throw new AppError(404, 'NOT_FOUND', 'Category not found');
    }
    
    // Only Admin or Creator can update
    if (role !== Role.ADMIN && category.createdById !== userId) {
      throw new AppError(403, 'FORBIDDEN', 'You do not have permission to update this category');
    }
    
    // Only Admin can change visibility
    if (data.visibility && data.visibility !== category.visibility && role !== Role.ADMIN) {
      throw new AppError(403, 'FORBIDDEN', 'Only admins can change category visibility');
    }
    
    return categoriesRepository.update(id, data);
  }

  async deleteCategory(id: string, role: Role): Promise<void> {
    if (role !== Role.ADMIN) {
      throw new AppError(403, 'FORBIDDEN', 'Only admins can delete categories');
    }
    
    const category = await categoriesRepository.findById(id, this.getVisibilityFilters(Role.ADMIN));
    
    if (!category) {
      throw new AppError(404, 'NOT_FOUND', 'Category not found');
    }
    
    await categoriesRepository.delete(id);
  }
}

export const categoriesService = new CategoriesService();

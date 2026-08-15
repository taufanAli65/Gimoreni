import { Request, Response, NextFunction } from 'express';
import { categoriesService } from './categories.service';
import { CreateCategorySchema, UpdateCategorySchema } from './categories.dto';

export class CategoriesController {
  async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await categoriesService.getCategories(req.user!.role);
      res.json({ success: true, data: categories });
    } catch (error) {
      next(error);
    }
  }

  async getCategoryById(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await categoriesService.getCategoryById(req.params.id as string, req.user!.role);
      res.json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  }

  async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const data = CreateCategorySchema.parse(req.body);
      const category = await categoriesService.createCategory(data, req.user!.sub, req.user!.role);
      res.status(201).json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  }

  async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const data = UpdateCategorySchema.parse(req.body);
      const category = await categoriesService.updateCategory(req.params.id as string, data, req.user!.sub, req.user!.role);
      res.json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  }

  async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      await categoriesService.deleteCategory(req.params.id as string, req.user!.role);
      res.json({ success: true, data: { success: true } });
    } catch (error) {
      next(error);
    }
  }
}

export const categoriesController = new CategoriesController();

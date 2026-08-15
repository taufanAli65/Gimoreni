import { Router } from 'express';
import { categoriesController } from './categories.controller';
import { authenticate, requireRole } from '../../shared/middleware/auth.middleware';

export const categoriesRouter = Router();

categoriesRouter.use(authenticate);

categoriesRouter.get('/', categoriesController.getCategories);
categoriesRouter.get('/:id', categoriesController.getCategoryById);
categoriesRouter.post('/', categoriesController.createCategory);
categoriesRouter.patch('/:id', categoriesController.updateCategory);
categoriesRouter.delete('/:id', requireRole('ADMIN'), categoriesController.deleteCategory);

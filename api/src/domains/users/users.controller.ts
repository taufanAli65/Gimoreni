import { Request, Response, NextFunction } from 'express';
import { usersService } from './users.service';
import { success } from '../../shared/utils/response.util';
import { createUserSchema, updateUserSchema, updateMeSchema, updateBalanceSchema } from './users.dto';

export class UsersController {
  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit } = req.pagination!;
      const { users, total } = await usersService.getAllUsers(page, limit);

      const totalPages = Math.ceil(total / limit);

      res.status(200).json(
        success(users, {
          page,
          limit,
          total,
          totalPages,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const user = await usersService.getUserById(id);
      res.status(200).json(success(user));
    } catch (error) {
      next(error);
    }
  }

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = createUserSchema.parse(req).body;
      const user = await usersService.createUser(validated);
      res.status(201).json(success(user));
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const validated = updateUserSchema.parse(req).body;
      const user = await usersService.updateUser(id, validated);
      res.status(200).json(success(user));
    } catch (error) {
      next(error);
    }
  }

  async softDeleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const requesterId = req.user!.sub;
      const user = await usersService.softDeleteUser(id, requesterId);
      res.status(200).json(success(user));
    } catch (error) {
      next(error);
    }
  }

  async updateMe(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.user!.sub;
      const validated = updateMeSchema.parse(req).body;
      const user = await usersService.updateMe(id, validated);
      res.status(200).json(success(user));
    } catch (error) {
      next(error);
    }
  }

  async updateBalance(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const validated = updateBalanceSchema.parse(req).body;
      const user = await usersService.updateBalance(id, validated);
      res.status(200).json(success(user));
    } catch (error) {
      next(error);
    }
  }
}

export const usersController = new UsersController();

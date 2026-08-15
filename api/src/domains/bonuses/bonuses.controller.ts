import { Request, Response, NextFunction } from 'express';
import { bonusesService } from './bonuses.service';
import { createBonusSchema, updateBonusSchema } from './bonuses.dto';
import { success } from '../../shared/utils/response.util';
import { AppError } from '../../shared/utils/AppError';
import { BonusType } from '@prisma/client';

export class BonusesController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, type } = req.query;
      const bonuses = await bonusesService.getAll({
        userId: userId as string,
        type: type as BonusType,
      });
      res.json(success(bonuses));
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const bonus = await bonusesService.getById(req.params.id);
      res.json(success(bonus));
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const parsedBody = createBonusSchema.safeParse({ body: req.body });
      if (!parsedBody.success) {
        throw new AppError(400, 'BAD_REQUEST', parsedBody.error.message);
      }

      const bonus = await bonusesService.create(parsedBody.data.body);
      res.status(201).json(success(bonus));
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const parsedBody = updateBonusSchema.safeParse({ body: req.body });
      if (!parsedBody.success) {
        throw new AppError(400, 'BAD_REQUEST', parsedBody.error.message);
      }

      const bonus = await bonusesService.update(req.params.id, parsedBody.data.body);
      res.json(success(bonus));
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await bonusesService.delete(req.params.id);
      res.json(success({ message: 'Bonus deleted successfully' }));
    } catch (error) {
      next(error);
    }
  }

  async apply(req: Request, res: Response, next: NextFunction) {
    try {
      const bonus = await bonusesService.applyBonus(req.params.id);
      res.json(success(bonus));
    } catch (error) {
      next(error);
    }
  }
}

export const bonusesController = new BonusesController();

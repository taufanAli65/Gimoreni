import { Request, Response, NextFunction } from 'express';
import { streaksService } from './streaks.service';
import { success } from '../../shared/utils/response.util';
import { AppError } from '../../shared/utils/AppError';

export class StreaksController {
  async getMyStreak(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new AppError(401, 'UNAUTHORIZED', 'Not authenticated');
      const data = await streaksService.getStreakData(req.user.sub);
      res.json(success(data));
    } catch (error) {
      next(error);
    }
  }

  async getUserStreak(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await streaksService.getStreakData(req.params.userId as string);
      res.json(success(data));
    } catch (error) {
      next(error);
    }
  }

  async checkStreaks(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await streaksService.runDailyCheck();
      res.json(success(result));
    } catch (error) {
      next(error);
    }
  }

  async sendReminders(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await streaksService.sendDailyReminders();
      res.json(success(result));
    } catch (error) {
      next(error);
    }
  }
}

export const streaksController = new StreaksController();

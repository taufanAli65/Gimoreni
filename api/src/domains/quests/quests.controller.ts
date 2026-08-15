import { Request, Response, NextFunction } from 'express';
import { questsService } from './quests.service';
import { createQuestSchema, updateQuestSchema } from './quests.dto';

export class QuestsController {
  async getQuests(req: Request, res: Response, next: NextFunction) {
    try {
      const quests = await questsService.getQuests(req.user!.role);
      res.json({ success: true, data: quests });
    } catch (error) {
      next(error);
    }
  }

  async getQuestById(req: Request, res: Response, next: NextFunction) {
    try {
      const quest = await questsService.getQuestById(req.params.id as string, req.user!.role);
      res.json({ success: true, data: quest });
    } catch (error) {
      next(error);
    }
  }

  async getActiveQuest(req: Request, res: Response, next: NextFunction) {
    try {
      const quest = await questsService.getActiveQuest();
      res.json({ success: true, data: quest });
    } catch (error) {
      next(error);
    }
  }

  async createQuest(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createQuestSchema.parse(req.body);
      const quest = await questsService.createQuest(data, req.user!.sub);
      res.status(201).json({ success: true, data: quest });
    } catch (error) {
      next(error);
    }
  }

  async updateQuest(req: Request, res: Response, next: NextFunction) {
    try {
      const data = updateQuestSchema.parse(req.body);
      const quest = await questsService.updateQuest(req.params.id as string, data);
      res.json({ success: true, data: quest });
    } catch (error) {
      next(error);
    }
  }

  async deleteQuest(req: Request, res: Response, next: NextFunction) {
    try {
      await questsService.deleteQuest(req.params.id as string);
      res.json({ success: true, data: { deleted: true } });
    } catch (error) {
      next(error);
    }
  }

  async publishQuest(req: Request, res: Response, next: NextFunction) {
    try {
      const quest = await questsService.publishQuest(req.params.id as string);
      res.json({ success: true, data: quest });
    } catch (error) {
      next(error);
    }
  }
}

export const questsController = new QuestsController();

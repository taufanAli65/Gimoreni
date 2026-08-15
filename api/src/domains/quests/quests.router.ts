import { Router } from 'express';
import { questsController } from './quests.controller';
import { authenticate, requireRole } from '../../shared/middleware/auth.middleware';

export const questsRouter = Router();

questsRouter.use(authenticate);

questsRouter.get('/active', questsController.getActiveQuest);
questsRouter.get('/', questsController.getQuests);
questsRouter.get('/:id', questsController.getQuestById);

questsRouter.post('/', requireRole('ADMIN'), questsController.createQuest);
questsRouter.patch('/:id', requireRole('ADMIN'), questsController.updateQuest);
questsRouter.delete('/:id', requireRole('ADMIN'), questsController.deleteQuest);

questsRouter.patch('/:id/publish', requireRole('ADMIN'), questsController.publishQuest);

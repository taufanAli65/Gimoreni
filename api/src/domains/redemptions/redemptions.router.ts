import { Router } from 'express';
import { redemptionsController } from './redemptions.controller';
import { authenticate, requireRole } from '../../shared/middleware/auth.middleware';

export const redemptionsRouter = Router();

redemptionsRouter.use(authenticate);

// Admin lists all, User lists own
redemptionsRouter.get('/', redemptionsController.getRedemptions);
redemptionsRouter.get('/:id', redemptionsController.getRedemptionById);

// Users submit redemptions
redemptionsRouter.post('/', redemptionsController.createRedemption);

// Admin approve/reject
redemptionsRouter.patch('/:id/approve', requireRole('ADMIN'), redemptionsController.approveRedemption);
redemptionsRouter.patch('/:id/reject', requireRole('ADMIN'), redemptionsController.rejectRedemption);

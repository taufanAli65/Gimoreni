import { Router } from 'express';
import { notificationsController } from './notifications.controller';
import { authenticate } from '../../shared/middleware/auth.middleware';

const router = Router();

// All notification routes require authentication
router.use(authenticate);

// Get own notifications
router.get(
  '/',
  notificationsController.getNotifications
);

// Mark all as read
router.patch('/read-all', notificationsController.markAllAsRead);

// Mark single as read
router.patch('/:id/read', notificationsController.markAsRead);

// Delete single notification
router.delete('/:id', notificationsController.deleteNotification);

export { router as notificationsRouter };

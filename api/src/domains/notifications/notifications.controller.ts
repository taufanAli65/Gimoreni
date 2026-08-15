import { Request, Response, NextFunction } from 'express';
import { notificationsService } from './notifications.service';
import { NotificationFilterDto } from './notifications.dto';

export class NotificationsController {
  async getNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit } = NotificationFilterDto.parse(req.query);
      
      // User is guaranteed to exist by authenticate middleware
      const userId = req.user!.sub;
      
      const result = await notificationsService.getNotifications(userId, page, limit);
      
      res.json({
        success: true,
        data: result.items,
        meta: result.meta,
      });
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.sub;
      const notificationId = req.params.id as string;
      
      const notification = await notificationsService.markAsRead(userId, notificationId);
      
      res.json({
        success: true,
        data: notification,
      });
    } catch (error) {
      next(error);
    }
  }

  async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.sub;
      
      const result = await notificationsService.markAllAsRead(userId);
      
      res.json({
        success: true,
        data: { updatedCount: result.count },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.sub;
      const notificationId = req.params.id as string;
      
      await notificationsService.deleteNotification(userId, notificationId);
      
      res.json({
        success: true,
        data: null,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const notificationsController = new NotificationsController();

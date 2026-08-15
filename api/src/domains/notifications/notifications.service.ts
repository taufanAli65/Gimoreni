import { notificationsRepository } from './notifications.repository';
import { AppError } from '../../shared/utils/AppError';

export class NotificationsService {
  async getNotifications(userId: string, page: number, limit: number) {
    const { items, total } = await notificationsRepository.findMany(userId, page, limit);

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async markAsRead(userId: string, notificationId: string) {
    const notification = await notificationsRepository.findById(notificationId);
    if (!notification) {
      throw new AppError(404, 'NOT_FOUND', 'Notification not found');
    }
    if (notification.userId !== userId) {
      throw new AppError(403, 'FORBIDDEN', 'You do not have permission to modify this notification');
    }

    return notificationsRepository.markAsRead(notificationId);
  }

  async markAllAsRead(userId: string) {
    return notificationsRepository.markAllAsRead(userId);
  }

  async deleteNotification(userId: string, notificationId: string) {
    const notification = await notificationsRepository.findById(notificationId);
    if (!notification) {
      throw new AppError(404, 'NOT_FOUND', 'Notification not found');
    }
    if (notification.userId !== userId) {
      throw new AppError(403, 'FORBIDDEN', 'You do not have permission to delete this notification');
    }

    return notificationsRepository.delete(notificationId);
  }
}

export const notificationsService = new NotificationsService();

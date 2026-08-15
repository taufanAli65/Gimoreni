import { PrismaClient } from '@prisma/client';
import { prisma } from '../../config/prisma';

export class NotificationsRepository {
  async findMany(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.notification.findMany({
        where: { userId },
        orderBy: [
          { isRead: 'asc' },
          { createdAt: 'desc' },
        ],
        skip,
        take: limit,
      }),
      prisma.notification.count({ where: { userId } }),
    ]);

    return { items, total };
  }

  async findById(id: string) {
    return prisma.notification.findUnique({
      where: { id },
    });
  }

  async markAsRead(id: string) {
    return prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  async delete(id: string) {
    return prisma.notification.delete({
      where: { id },
    });
  }

  // Exposed for use by other internal services (e.g., Quest Redemption, Bonuses, Streaks)
  async createNotification(
    userId: string,
    title: string,
    body: string,
    requiresAction: boolean = false,
    actionUrl: string | null = null,
    prismaClient: any = prisma
  ) {
    return prismaClient.notification.create({
      data: {
        userId,
        title,
        body,
        requiresAction,
        actionUrl,
      },
    });
  }
}

export const notificationsRepository = new NotificationsRepository();

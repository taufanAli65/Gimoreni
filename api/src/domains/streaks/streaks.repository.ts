import { prisma } from '../../config/prisma';

export class StreaksRepository {
  async getStreakData(userId: string) {
    // Get user info and current month logs
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        currentStreak: true,
        longestStreak: true,
        lastLoggedDate: true,
      },
    });

    if (!user) return null;

    // Get logs for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setUTCHours(0, 0, 0, 0);

    const logs = await prisma.streakLog.findMany({
      where: {
        userId,
        date: {
          gte: thirtyDaysAgo,
        },
      },
      orderBy: { date: 'asc' },
    });

    return { user, logs };
  }

  async getActiveUsers() {
    return prisma.user.findMany({
      where: { isActive: true },
      select: {
        id: true,
        currentStreak: true,
        longestStreak: true,
        lastLoggedDate: true,
      }
    });
  }

  async getStreakLog(userId: string, date: Date) {
    return prisma.streakLog.findUnique({
      where: {
        userId_date: {
          userId,
          date,
        },
      },
    });
  }

  async upsertStreakLog(userId: string, date: Date, didLog: boolean) {
    return prisma.streakLog.upsert({
      where: {
        userId_date: {
          userId,
          date,
        },
      },
      update: {
        didLog,
      },
      create: {
        userId,
        date,
        didLog,
      },
    });
  }

  async updateUserStreak(
    userId: string, 
    currentStreak: number, 
    longestStreak: number, 
    lastLoggedDate?: Date | null
  ) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        currentStreak,
        longestStreak,
        ...(lastLoggedDate !== undefined && { lastLoggedDate }),
      },
    });
  }
}

export const streaksRepository = new StreaksRepository();

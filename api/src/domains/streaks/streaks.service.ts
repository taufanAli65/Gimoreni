import { streaksRepository } from './streaks.repository';
import { prisma } from '../../config/prisma';
import { AppError } from '../../shared/utils/AppError';

export class StreaksService {
  async getStreakData(userId: string) {
    const data = await streaksRepository.getStreakData(userId);
    if (!data) {
      throw new AppError(404, 'NOT_FOUND', 'User not found');
    }
    return data;
  }

  async runDailyCheck() {
    const users = await streaksRepository.getActiveUsers();
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const now = new Date();
    const isPast23 = now.getUTCHours() >= 23;

    let processed = 0;

    for (const user of users) {
      const streakLog = await streaksRepository.getStreakLog(user.id, today);
      const didLog = streakLog?.didLog ?? false;

      let { currentStreak, longestStreak, lastLoggedDate } = user;
      let userUpdated = false;

      if (didLog) {
        // If they logged today but lastLoggedDate isn't today yet, increment streak.
        if (!lastLoggedDate || lastLoggedDate.getTime() !== today.getTime()) {
          // Check if they missed yesterday (handled by yesterday's CRON resetting it to 0).
          // If we want to be robust in case CRON missed a day, we could check if yesterday was logged, 
          // but relying on CRON is standard for now.
          currentStreak += 1;
          longestStreak = Math.max(longestStreak, currentStreak);
          lastLoggedDate = today;
          userUpdated = true;
        }
      } else {
        if (isPast23 && currentStreak > 0) {
          currentStreak = 0;
          userUpdated = true;
        }
      }

      await streaksRepository.upsertStreakLog(user.id, today, didLog);
      
      if (userUpdated) {
        await streaksRepository.updateUserStreak(user.id, currentStreak, longestStreak, lastLoggedDate);
      }
      processed++;
    }

    return { success: true, processed };
  }

  async sendDailyReminders() {
    const users = await streaksRepository.getActiveUsers();
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    let remindersSent = 0;

    for (const user of users) {
      if (!user.lastLoggedDate || user.lastLoggedDate.getTime() < today.getTime()) {
        await prisma.notification.create({
          data: {
            userId: user.id,
            title: 'Daily Reminder',
            body: "Don't forget to log your finances today! 🌿",
            requiresAction: false,
          },
        });
        remindersSent++;
      }
    }

    return { success: true, remindersSent };
  }
}

export const streaksService = new StreaksService();

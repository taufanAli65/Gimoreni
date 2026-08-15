import { bonusesRepository } from './bonuses.repository';
import { CreateBonusDto, UpdateBonusDto } from './bonuses.dto';
import { prisma } from '../../config/prisma';
import { BonusType } from '@prisma/client';
import { AppError } from '../../shared/utils/AppError';

export class BonusesService {
  async getAll(filters?: { userId?: string; type?: BonusType }) {
    return bonusesRepository.findAll(filters);
  }

  async getById(id: string) {
    const bonus = await bonusesRepository.findById(id);
    if (!bonus) {
      throw new AppError(404, 'NOT_FOUND', 'Bonus not found');
    }
    return bonus;
  }

  async create(data: CreateBonusDto) {
    if (data.type === BonusType.MONTHLY_COMPLETION) {
      if (!data.month || !data.year) {
        throw new AppError(400, 'BAD_REQUEST', 'Month and year are required for MONTHLY_COMPLETION bonuses');
      }
      const existing = await bonusesRepository.checkDuplicateMonthlyBonus(data.userId, data.month, data.year);
      if (existing) {
        throw new AppError(409, 'CONFLICT', 'A monthly completion bonus for this month already exists for the user');
      }
    }

    return bonusesRepository.create({
      userId: data.userId,
      type: data.type,
      amount: data.amount,
      pointsBonus: data.pointsBonus ?? 0,
      description: data.description,
      month: data.month,
      year: data.year,
      isApplied: false,
    });
  }

  async update(id: string, data: UpdateBonusDto) {
    const bonus = await this.getById(id);
    if (bonus.isApplied) {
      throw new AppError(409, 'CONFLICT', 'Cannot update an already applied bonus');
    }

    return bonusesRepository.update(id, data);
  }

  async delete(id: string) {
    const bonus = await this.getById(id);
    if (bonus.isApplied) {
      throw new AppError(409, 'CONFLICT', 'Cannot delete an already applied bonus');
    }

    return bonusesRepository.delete(id);
  }

  async applyBonus(id: string) {
    const bonus = await this.getById(id);
    if (bonus.isApplied) {
      throw new AppError(409, 'CONFLICT', 'Bonus has already been applied');
    }

    // Apply inside a transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Mark bonus as applied
      const updatedBonus = await tx.bonus.update({
        where: { id },
        data: { isApplied: true },
      });

      // 2. Update User balance and totalPoints
      const updatedUser = await tx.user.update({
        where: { id: bonus.userId },
        data: {
          balance: { increment: bonus.amount },
          totalPoints: { increment: bonus.pointsBonus },
        },
      });

      // 3. Create Notification
      let notificationTitle = 'You received a bonus! 🎉';
      let notificationBody = `You have been awarded $${Number(bonus.amount).toFixed(2)}`;
      
      if (bonus.pointsBonus > 0) {
         notificationBody += ` and ${bonus.pointsBonus} points`;
      }
      if (bonus.description) {
         notificationBody += ` for: ${bonus.description}`;
      } else if (bonus.type === BonusType.MONTHLY_COMPLETION) {
         notificationBody += ` for completing all logs in ${bonus.month}/${bonus.year}!`;
      }

      await tx.notification.create({
        data: {
          userId: bonus.userId,
          title: notificationTitle,
          body: notificationBody,
        },
      });

      return { updatedBonus, updatedUser };
    });

    return result.updatedBonus;
  }
}

export const bonusesService = new BonusesService();

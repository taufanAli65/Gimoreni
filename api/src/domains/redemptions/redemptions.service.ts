import { Role, RedemptionStatus, QuestStatus } from '@prisma/client';
import { redemptionsRepository } from './redemptions.repository';
import { CreateRedemptionDto, RedemptionFilterDto } from './redemptions.dto';
import { AppError } from '../../shared/utils/AppError';
import { prisma } from '../../config/prisma';

export class RedemptionsService {
  async getRedemptions(filters: RedemptionFilterDto, role: Role, userId: string) {
    return redemptionsRepository.findMany(filters, role, userId);
  }

  async getRedemptionById(id: string, role: Role, userId: string) {
    const redemption = await redemptionsRepository.findById(id, role, userId);
    
    if (!redemption) {
      throw new AppError(404, 'NOT_FOUND', 'Redemption not found');
    }
    
    return redemption;
  }

  async createRedemption(data: CreateRedemptionDto, userId: string) {
    const quest = await prisma.quest.findUnique({ where: { id: data.questId } });
    if (!quest) {
      throw new AppError(404, 'NOT_FOUND', 'Quest not found');
    }
    if (quest.status !== QuestStatus.ACTIVE) {
      throw new AppError(400, 'BAD_REQUEST', 'Quest is not active');
    }

    const existing = await redemptionsRepository.findByQuestAndUser(data.questId, userId);
    if (existing) {
      throw new AppError(409, 'CONFLICT', 'You have already submitted a redemption for this quest');
    }

    return redemptionsRepository.create({
      ...data,
      userId,
    });
  }

  async approveRedemption(id: string, adminId: string) {
    const redemption = await redemptionsRepository.findById(id, Role.ADMIN, adminId);
    if (!redemption) {
      throw new AppError(404, 'NOT_FOUND', 'Redemption not found');
    }
    if (redemption.status !== RedemptionStatus.PENDING) {
      throw new AppError(400, 'BAD_REQUEST', 'Only pending redemptions can be approved');
    }

    return prisma.$transaction(async (tx) => {
      const updatedRedemption = await tx.questRedemption.update({
        where: { id },
        data: {
          status: RedemptionStatus.APPROVED,
          confirmedAt: new Date(),
          confirmedById: adminId,
          pointsAwarded: redemption.quest.pointReward,
        }
      });

      await tx.user.update({
        where: { id: redemption.userId },
        data: {
          totalPoints: { increment: redemption.quest.pointReward }
        }
      });

      const remainingPending = await tx.questRedemption.count({
        where: {
          questId: redemption.questId,
          status: RedemptionStatus.PENDING,
          id: { not: id }
        }
      });

      if (remainingPending === 0) {
        await tx.quest.update({
          where: { id: redemption.questId },
          data: { status: QuestStatus.COMPLETED }
        });
      }

      await tx.notification.create({
        data: {
          userId: redemption.userId,
          title: 'Quest Approved!',
          body: `Your proof for "${redemption.quest.title}" was approved. You earned ${redemption.quest.pointReward} points!`
        }
      });

      return updatedRedemption;
    });
  }

  async rejectRedemption(id: string, rejectionNote: string, adminId: string) {
    const redemption = await redemptionsRepository.findById(id, Role.ADMIN, adminId);
    if (!redemption) {
      throw new AppError(404, 'NOT_FOUND', 'Redemption not found');
    }
    if (redemption.status !== RedemptionStatus.PENDING) {
      throw new AppError(400, 'BAD_REQUEST', 'Only pending redemptions can be rejected');
    }

    return prisma.$transaction(async (tx) => {
      const updatedRedemption = await tx.questRedemption.update({
        where: { id },
        data: {
          status: RedemptionStatus.REJECTED,
          confirmedAt: new Date(),
          confirmedById: adminId,
          rejectionNote,
        }
      });

      await tx.notification.create({
        data: {
          userId: redemption.userId,
          title: 'Quest Rejected',
          body: `Your proof for "${redemption.quest.title}" was rejected: ${rejectionNote}`
        }
      });

      return updatedRedemption;
    });
  }
}

export const redemptionsService = new RedemptionsService();

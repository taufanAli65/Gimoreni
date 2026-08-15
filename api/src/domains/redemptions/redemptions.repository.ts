import { prisma } from '../../config/prisma';
import { Prisma, Role, RedemptionStatus } from '@prisma/client';
import { RedemptionFilterDto } from './redemptions.dto';

export class RedemptionsRepository {
  async findMany(filters: RedemptionFilterDto, role: Role, userId: string) {
    const where: Prisma.QuestRedemptionWhereInput = {};
    
    if (role === Role.USER) {
      where.userId = userId;
    }
    
    if (filters.status) {
      where.status = filters.status;
    }

    const skip = (filters.page - 1) * filters.limit;
    
    const [redemptions, total] = await Promise.all([
      prisma.questRedemption.findMany({
        where,
        skip,
        take: filters.limit,
        orderBy: { createdAt: 'desc' },
        include: {
          quest: { select: { title: true, pointReward: true } },
          user: { select: { name: true, avatarUrl: true } }
        }
      }),
      prisma.questRedemption.count({ where })
    ]);

    return { redemptions, total, page: filters.page, limit: filters.limit };
  }

  async findById(id: string, role: Role, userId: string) {
    const where: Prisma.QuestRedemptionWhereUniqueInput = { id };
    
    const redemption = await prisma.questRedemption.findUnique({
      where,
      include: {
        quest: true,
        user: { select: { id: true, name: true, avatarUrl: true } }
      }
    });

    if (redemption && role === Role.USER && redemption.userId !== userId) {
      return null;
    }

    return redemption;
  }

  async findByQuestAndUser(questId: string, userId: string) {
    return prisma.questRedemption.findUnique({
      where: {
        questId_userId: { questId, userId }
      }
    });
  }

  async create(data: Prisma.QuestRedemptionUncheckedCreateInput) {
    return prisma.questRedemption.create({
      data,
    });
  }

  async update(id: string, data: Prisma.QuestRedemptionUncheckedUpdateInput) {
    return prisma.questRedemption.update({
      where: { id },
      data,
    });
  }
}

export const redemptionsRepository = new RedemptionsRepository();

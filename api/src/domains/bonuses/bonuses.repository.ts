import { prisma } from '../../config/prisma';
import { Prisma, BonusType } from '@prisma/client';

export class BonusesRepository {
  async findAll(filters?: { userId?: string; type?: BonusType }) {
    const where: Prisma.BonusWhereInput = {};
    
    if (filters?.userId) where.userId = filters.userId;
    if (filters?.type) where.type = filters.type;

    return prisma.bonus.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });
  }

  async findById(id: string) {
    return prisma.bonus.findUnique({
      where: { id },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });
  }

  async create(data: Prisma.BonusUncheckedCreateInput) {
    return prisma.bonus.create({
      data,
    });
  }

  async update(id: string, data: Prisma.BonusUncheckedUpdateInput) {
    return prisma.bonus.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.bonus.delete({
      where: { id },
    });
  }

  async checkDuplicateMonthlyBonus(userId: string, month: number, year: number) {
    return prisma.bonus.findFirst({
      where: {
        userId,
        type: BonusType.MONTHLY_COMPLETION,
        month,
        year,
      },
    });
  }
}

export const bonusesRepository = new BonusesRepository();

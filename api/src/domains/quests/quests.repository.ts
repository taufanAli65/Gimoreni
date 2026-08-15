import { prisma } from '../../config/prisma';
import { Prisma, QuestStatus, Role } from '@prisma/client';

export class QuestsRepository {
  async findMany(role: Role) {
    if (role === Role.USER) {
      return prisma.quest.findMany({
        where: { status: QuestStatus.ACTIVE },
        orderBy: { createdAt: 'desc' },
      });
    }

    return prisma.quest.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { redemptions: { where: { status: 'PENDING' } } }
        }
      }
    });
  }

  async findById(id: string) {
    return prisma.quest.findUnique({
      where: { id },
    });
  }

  async findActiveQuest() {
    return prisma.quest.findFirst({
      where: { status: QuestStatus.ACTIVE },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: Prisma.QuestUncheckedCreateInput) {
    return prisma.quest.create({
      data,
    });
  }

  async update(id: string, data: Prisma.QuestUpdateInput) {
    return prisma.quest.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.quest.delete({
      where: { id },
    });
  }
}

export const questsRepository = new QuestsRepository();

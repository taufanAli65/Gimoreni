import { Role, QuestStatus } from '@prisma/client';
import { questsRepository } from './quests.repository';
import { CreateQuestDto, UpdateQuestDto } from './quests.dto';
import { AppError } from '../../shared/utils/AppError';

export class QuestsService {
  async getQuests(role: Role) {
    return questsRepository.findMany(role);
  }

  async getQuestById(id: string, role: Role) {
    const quest = await questsRepository.findById(id);
    
    if (!quest) {
      throw new AppError(404, 'NOT_FOUND', 'Quest not found');
    }
    
    if (role === Role.USER && quest.status !== QuestStatus.ACTIVE) {
      throw new AppError(404, 'NOT_FOUND', 'Quest not found');
    }
    
    return quest;
  }

  async getActiveQuest() {
    return questsRepository.findActiveQuest();
  }

  async createQuest(data: CreateQuestDto, userId: string) {
    return questsRepository.create({
      ...data,
      createdById: userId,
    });
  }

  async updateQuest(id: string, data: UpdateQuestDto) {
    const quest = await questsRepository.findById(id);
    
    if (!quest) {
      throw new AppError(404, 'NOT_FOUND', 'Quest not found');
    }
    
    return questsRepository.update(id, data);
  }

  async deleteQuest(id: string) {
    const quest = await questsRepository.findById(id);
    
    if (!quest) {
      throw new AppError(404, 'NOT_FOUND', 'Quest not found');
    }
    
    await questsRepository.delete(id);
  }

  async publishQuest(id: string) {
    const quest = await questsRepository.findById(id);
    
    if (!quest) {
      throw new AppError(404, 'NOT_FOUND', 'Quest not found');
    }
    
    if (quest.status !== QuestStatus.DRAFT) {
      throw new AppError(400, 'BAD_REQUEST', 'Only DRAFT quests can be published');
    }
    
    return questsRepository.update(id, { status: QuestStatus.ACTIVE });
  }
}

export const questsService = new QuestsService();

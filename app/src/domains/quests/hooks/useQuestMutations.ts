import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../shared/lib/api';
import type { Quest } from '../types';

interface CreateQuestParams {
  title: string;
  description: string;
  pointReward: number;
  deadline?: string | null;
}

interface UpdateQuestParams extends Partial<CreateQuestParams> {
  id: string;
}

export const useQuestMutations = () => {
  const queryClient = useQueryClient();

  const createQuest = useMutation({
    mutationFn: async (data: CreateQuestParams) => {
      const res = await api.post<{ success: boolean; data: Quest }>('/quests', data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quests'] });
    },
  });

  const updateQuest = useMutation({
    mutationFn: async ({ id, ...data }: UpdateQuestParams) => {
      const res = await api.patch<{ success: boolean; data: Quest }>(`/quests/${id}`, data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quests'] });
    },
  });

  const deleteQuest = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/quests/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quests'] });
    },
  });

  const publishQuest = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.patch<{ success: boolean; data: Quest }>(`/quests/${id}/publish`);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quests'] });
      queryClient.invalidateQueries({ queryKey: ['active-quest'] });
    },
  });

  return {
    createQuest,
    updateQuest,
    deleteQuest,
    publishQuest,
  };
};

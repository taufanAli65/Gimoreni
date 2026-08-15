import { useQuery } from '@tanstack/react-query';
import { api } from '../../../shared/lib/api';
import type { Quest } from '../types';

export const useActiveQuest = () => {
  return useQuery({
    queryKey: ['active-quest'],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: Quest | null }>('/quests/active');
      return data.data;
    },
  });
};

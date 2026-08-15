import { useQuery } from '@tanstack/react-query';
import { api } from '../../../shared/lib/api';
import type { Quest } from '../types';

export const useQuests = () => {
  return useQuery({
    queryKey: ['quests'],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: Quest[] }>('/quests');
      return data.data;
    },
  });
};

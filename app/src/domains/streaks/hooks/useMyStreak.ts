import { useQuery } from '@tanstack/react-query';
import { api } from '../../../shared/lib/api';
import type { StreakData } from '../types';

export const useMyStreak = () => {
  return useQuery({
    queryKey: ['my-streak'],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: StreakData }>('/api/v1/streaks/me');
      return data.data;
    },
  });
};

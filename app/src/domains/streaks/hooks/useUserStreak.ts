import { useQuery } from '@tanstack/react-query';
import { api } from '../../../shared/lib/api';
import type { StreakData } from '../types';

export const useUserStreak = (userId: string) => {
  return useQuery({
    queryKey: ['user-streak', userId],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: StreakData }>(`/api/v1/streaks/${userId}`);
      return data.data;
    },
    enabled: !!userId,
  });
};

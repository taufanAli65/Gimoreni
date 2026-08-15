import { useQuery } from '@tanstack/react-query';
import { api } from '../../../shared/lib/api';
import type { Bonus, BonusType } from '../types';

interface GetBonusesParams {
  userId?: string;
  type?: BonusType;
}

export const useBonuses = (params?: GetBonusesParams) => {
  return useQuery({
    queryKey: ['bonuses', params],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: Bonus[] }>('/api/v1/bonuses', { params });
      return data.data;
    },
  });
};

export const useBonus = (id: string) => {
  return useQuery({
    queryKey: ['bonuses', id],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: Bonus }>(`/api/v1/bonuses/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
};

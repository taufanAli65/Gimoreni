import { useQuery } from '@tanstack/react-query';
import { api } from '../../../shared/lib/api';
import type { QuestRedemption, RedemptionStatus } from '../types';

interface UseRedemptionsOptions {
  status?: RedemptionStatus;
  page?: number;
  limit?: number;
}

interface RedemptionsResponse {
  success: boolean;
  data: QuestRedemption[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const useRedemptions = (options: UseRedemptionsOptions = {}) => {
  return useQuery({
    queryKey: ['redemptions', options],
    queryFn: async () => {
      const { data } = await api.get<RedemptionsResponse>('/redemptions', {
        params: options,
      });
      return data;
    },
  });
};

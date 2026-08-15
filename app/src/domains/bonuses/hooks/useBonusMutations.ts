import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../shared/lib/api';
import type { BonusType } from '../types';

interface CreateBonusDto {
  userId: string;
  type: BonusType;
  amount: number;
  pointsBonus?: number;
  description?: string;
  month?: number;
  year?: number;
}

interface UpdateBonusDto {
  type?: BonusType;
  amount?: number;
  pointsBonus?: number;
  description?: string;
  month?: number;
  year?: number;
}

export const useCreateBonus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateBonusDto) => {
      const res = await api.post('/api/v1/bonuses', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bonuses'] });
    },
  });
};

export const useUpdateBonus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateBonusDto }) => {
      const res = await api.patch(`/api/v1/bonuses/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bonuses'] });
    },
  });
};

export const useDeleteBonus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/api/v1/bonuses/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bonuses'] });
    },
  });
};

export const useApplyBonus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.post(`/api/v1/bonuses/${id}/apply`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bonuses'] });
      // Might want to invalidate user balance if there's a query for that
    },
  });
};

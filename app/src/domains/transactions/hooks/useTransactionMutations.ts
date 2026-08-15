import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../shared/lib/api';

export interface CreateTransactionPayload {
  categoryId: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  description?: string;
  date: string;
  receiptUrl?: string | null;
}

export const useTransactionMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (payload: CreateTransactionPayload) => {
      const { data } = await api.post('/transactions', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactions-calendar'] });
      queryClient.invalidateQueries({ queryKey: ['transactions-summary'] });
      queryClient.invalidateQueries({ queryKey: ['streaks'] }); // Streak is updated on create
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<CreateTransactionPayload> }) => {
      const { data } = await api.patch(`/transactions/${id}`, payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactions-summary'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/transactions/${id}`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactions-calendar'] });
      queryClient.invalidateQueries({ queryKey: ['transactions-summary'] });
      queryClient.invalidateQueries({ queryKey: ['streaks'] });
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
};

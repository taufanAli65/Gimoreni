import { useQuery } from '@tanstack/react-query';
import { api } from '../../../shared/lib/api';
import type { Transaction } from '../types';

export interface UseTransactionsParams {
  userId?: string;
  startDate?: string;
  endDate?: string;
  type?: 'INCOME' | 'EXPENSE';
  categoryId?: string;
  page?: number;
  limit?: number;
}

export const useTransactions = (params?: UseTransactionsParams) => {
  return useQuery({
    queryKey: ['transactions', params],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: Transaction[]; meta: any }>('/transactions', {
        params,
      });
      return { transactions: data.data, meta: data.meta };
    },
  });
};

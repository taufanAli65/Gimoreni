import { useQuery } from '@tanstack/react-query';
import { api } from '../../../shared/lib/api';
import type { TransactionSummary } from '../types';

export const useTransactionSummary = (month?: number, year?: number) => {
  return useQuery({
    queryKey: ['transactions-summary', month, year],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: TransactionSummary[] }>('/transactions/summary', {
        params: { month, year },
      });
      return data.data;
    },
  });
};

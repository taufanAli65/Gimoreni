import { useQuery } from '@tanstack/react-query';
import { api } from '../../../shared/lib/api';

export const useTransactionCalendar = (userId?: string, month?: number, year?: number) => {
  return useQuery({
    queryKey: ['transactions-calendar', userId, month, year],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: string[] }>('/transactions/calendar', {
        params: { userId, month, year },
      });
      return data.data; // Array of date strings like "2026-08-14"
    },
  });
};

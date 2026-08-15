import { useQuery } from '@tanstack/react-query';
import { api } from '../../../shared/lib/axios';
import type { Category } from '../types';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: Category[] }>('/categories');
      return data.data;
    },
  });
};

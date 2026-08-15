import { useQuery } from '@tanstack/react-query';
import { api } from '../../../shared/lib/api';

export const useGetUser = (id: string) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      const { data } = await api.get(`/users/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

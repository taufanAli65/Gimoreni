import { useQuery } from '@tanstack/react-query';
import { api } from '../../../shared/lib/api';
import type { NotificationsResponse } from '../types';
import { useAuth } from '../../../shared/hooks/useAuth';

export const useNotifications = (page = 1, limit = 20) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['notifications', page, limit],
    queryFn: async () => {
      const response = await api.get<{ data: NotificationsResponse['items']; meta: NotificationsResponse['meta'] }>('/notifications', {
        params: { page, limit }
      });
      return {
        items: response.data.data,
        meta: response.data.meta
      };
    },
    enabled: !!user,
    refetchInterval: 30000, // Poll every 30 seconds
  });
};

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../shared/lib/api';
import type { Notification } from '../types';

export const useNotificationMutations = () => {
  const queryClient = useQueryClient();

  const invalidateNotifications = () => {
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
  };

  const markAsRead = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.patch<{ data: Notification }>(`/notifications/${id}/read`);
      return response.data.data;
    },
    onSuccess: invalidateNotifications,
  });

  const markAllAsRead = useMutation({
    mutationFn: async () => {
      const response = await api.patch<{ data: { updatedCount: number } }>('/notifications/read-all');
      return response.data.data;
    },
    onSuccess: invalidateNotifications,
  });

  const deleteNotification = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/notifications/${id}`);
    },
    onSuccess: invalidateNotifications,
  });

  return {
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
};

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../shared/lib/api';
import type { UpdateMePayload } from '../types';

export const useUpdateMe = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateMePayload) => {
      const { data } = await api.patch('/users/me', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });
};

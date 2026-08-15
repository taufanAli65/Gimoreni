import { useQuery } from '@tanstack/react-query';
import { api } from '../../../shared/lib/api';
import type { UserProfile } from '../types';

/**
 * Fetches the full authenticated user profile including points,
 * balance, allowance, and streak info — not available in the auth token.
 */
export const useMe = () => {
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: UserProfile }>('/users/me');
      return data.data;
    },
  });
};

import { useQuery } from '@tanstack/react-query';
import { api, setAccessToken } from '../../../shared/lib/axios';
import type { User } from '../types';

export const useMe = (enabled = true) => {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      // First try to refresh the token directly on boot
      // This is because the token might be expired or absent from memory
      try {
        const refreshResponse = await api.post('/auth/refresh', {}, {
          // Tell axios interceptor to not retry this request on 401
          _retry: true 
        } as any);
        
        const accessToken = refreshResponse.data.data.accessToken;
        setAccessToken(accessToken);
        
        const { data } = await api.get<{ success: boolean; data: User }>('/auth/me');
        return { user: data.data, accessToken };
      } catch (err) {
        // If refresh fails, we are not logged in
        return null;
      }
    },
    enabled,
    retry: false,
    staleTime: Infinity,
  });
};

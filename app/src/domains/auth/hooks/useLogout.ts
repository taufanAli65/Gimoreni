import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../shared/lib/axios';
import { useAuth } from '../../../shared/hooks/useAuth';
import { toast } from 'sonner';

export const useLogout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await api.post('/auth/logout');
    },
    onSuccess: () => {
      logout();
      queryClient.clear();
      navigate('/login', { replace: true });
      toast.success('Logged out successfully');
    },
    onError: () => {
      // Even if API call fails, we still log them out locally
      logout();
      queryClient.clear();
      navigate('/login', { replace: true });
    }
  });
};

import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../shared/lib/axios';
import { useAuth } from '../../../shared/hooks/useAuth';
import type { AuthResponse } from '../types';
import { toast } from 'sonner';

interface LoginPayload {
  email: string;
  password: string;
}

export const useLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { data } = await api.post<{ success: boolean; data: AuthResponse }>('/auth/login', payload);
      return data.data;
    },
    onSuccess: (data) => {
      login(data.user, data.accessToken);
      
      // Redirect based on role
      if (data.user.role === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
      
      toast.success('Logged in successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error?.message || 'Login failed';
      toast.error(message);
    }
  });
};

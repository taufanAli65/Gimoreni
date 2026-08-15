import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../shared/hooks/useAuth';

export const UserRoutes = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  if (!user || user.role !== 'USER') {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};

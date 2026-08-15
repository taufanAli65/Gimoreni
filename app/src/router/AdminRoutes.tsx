import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../shared/hooks/useAuth';

export const AdminRoutes = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

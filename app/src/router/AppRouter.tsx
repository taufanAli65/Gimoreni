import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminRoutes } from './AdminRoutes';
import { UserRoutes } from './UserRoutes';
import { AdminLayout } from '../shared/components/layout/AdminLayout';
import { UserLayout } from '../shared/components/layout/UserLayout';

// Placeholder Pages
const Login = () => <div className="p-4">Login Page</div>;
const Home = () => <div className="p-4">User Home</div>;
const AdminDashboard = () => <div className="p-4">Admin Dashboard</div>;

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Admin Routes */}
        <Route element={<AdminRoutes />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            {/* More admin routes here */}
          </Route>
        </Route>

        {/* User Routes */}
        <Route element={<UserRoutes />}>
          <Route path="/" element={<UserLayout />}>
            <Route index element={<Home />} />
            {/* More user routes here */}
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

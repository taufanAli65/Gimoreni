import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminRoutes } from './AdminRoutes';
import { UserRoutes } from './UserRoutes';
import { AdminLayout } from '../shared/components/layout/AdminLayout';
import { UserLayout } from '../shared/components/layout/UserLayout';
import { LoginPage } from '../domains/auth/pages/LoginPage';
import { UsersPage } from '../pages/admin/UsersPage';
import { MiscPage } from '../pages/admin/MiscPage';
import { AddPage } from '../pages/user/AddPage';
import { CalendarPage } from '../pages/admin/CalendarPage';

// Placeholder Pages
const Home = () => <div className="p-4">User Home</div>;
const AdminDashboard = () => <div className="p-4">Admin Dashboard</div>;

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        {/* Admin Routes */}
        <Route element={<AdminRoutes />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="misc" element={<MiscPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            {/* More admin routes here */}
          </Route>
        </Route>

        {/* User Routes */}
        <Route element={<UserRoutes />}>
          <Route path="/" element={<UserLayout />}>
            <Route index element={<Home />} />
            <Route path="add" element={<AddPage />} />
            {/* More user routes here */}
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

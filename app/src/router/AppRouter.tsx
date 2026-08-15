import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminRoutes } from './AdminRoutes';
import { UserRoutes } from './UserRoutes';
import { AdminLayout } from '../shared/components/layout/AdminLayout';
import { UserLayout } from '../shared/components/layout/UserLayout';
import { LoginPage } from '../domains/auth/pages/LoginPage';
import { UsersPage } from '../pages/admin/UsersPage';
import { MiscPage } from '../pages/admin/MiscPage';
import { AddPage } from '../pages/user/AddPage';
import { SettingsPage } from '../pages/user/SettingsPage';
import { CalendarPage } from '../pages/admin/CalendarPage';
import { HomePage } from '../pages/user/HomePage';
import { QuestsPage } from '../pages/admin/QuestsPage';

import { DashboardPage } from '../pages/admin/DashboardPage';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Admin Routes */}
        <Route element={<AdminRoutes />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="misc" element={<MiscPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="quests" element={<QuestsPage />} />
            {/* More admin routes here */}
          </Route>
        </Route>

        {/* User Routes */}
        <Route element={<UserRoutes />}>
          <Route path="/" element={<UserLayout />}>
            <Route index element={<HomePage />} />
            <Route path="add" element={<AddPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};


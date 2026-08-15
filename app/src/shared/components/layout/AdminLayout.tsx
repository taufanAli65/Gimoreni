import { Outlet } from 'react-router-dom';
import { NotificationBell } from '../notifications/NotificationBell';

export const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-off-white text-forest flex">
      {/* Admin Sidebar could go here */}
      <div className="flex-1 p-8">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <NotificationBell />
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

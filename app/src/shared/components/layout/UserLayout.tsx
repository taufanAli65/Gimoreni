import { Outlet } from 'react-router-dom';
import { NotificationBell } from '../notifications/NotificationBell';

export const UserLayout = () => {
  return (
    <div className="min-h-screen bg-off-white text-forest">
      <header className="p-4 bg-forest text-white flex justify-between items-center">
        <h1 className="text-xl font-bold">Gimoreni</h1>
        <NotificationBell />
      </header>
      <main className="p-4">
        <Outlet />
      </main>
      {/* Bottom Navigation could go here */}
    </div>
  );
};

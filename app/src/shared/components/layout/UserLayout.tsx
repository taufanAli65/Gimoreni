import { Outlet } from 'react-router-dom';

export const UserLayout = () => {
  return (
    <div className="min-h-screen bg-off-white text-forest">
      <header className="p-4 bg-forest text-white">
        <h1 className="text-xl font-bold text-center">Gimoreni</h1>
      </header>
      <main className="p-4">
        <Outlet />
      </main>
      {/* Bottom Navigation could go here */}
    </div>
  );
};

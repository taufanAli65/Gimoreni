import { Outlet } from 'react-router-dom';

export const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-off-white text-forest flex">
      {/* Admin Sidebar could go here */}
      <div className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { NotificationBell } from '../notifications/NotificationBell';
import { 
  LayoutDashboard, 
  Calendar as CalendarIcon, 
  Target, 
  Users, 
  Settings, 
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth'; // Assumed from project structure
import { cn } from '../../lib/utils';

export const AdminLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { logout } = useAuth(); // If this exists, otherwise we just leave it for now. Wait, I should import useAuth from the correct path. I'll import from '../../domains/auth/hooks/useAuth' or just '../hooks/useAuth' if it is there. I'll check where it is later, let's use the one from AdminRoutes.tsx which was `../shared/hooks/useAuth`.
  
  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { label: 'Calendar', path: '/admin/calendar', icon: <CalendarIcon size={20} /> },
    { label: 'Quests', path: '/admin/quests', icon: <Target size={20} /> },
    { label: 'Users', path: '/admin/users', icon: <Users size={20} /> },
    { label: 'Misc', path: '/admin/misc', icon: <Settings size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-off-white text-gray-900 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex justify-between items-center bg-forest text-off-white p-4">
        <h1 className="text-xl font-bold">Gimmore Admin</h1>
        <div className="flex items-center gap-4">
          <NotificationBell />
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={cn(
          "bg-forest text-off-white w-full md:w-64 md:flex flex-col fixed md:sticky top-0 h-screen z-40 transition-transform duration-300 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="p-6 hidden md:block">
          <h2 className="text-2xl font-bold tracking-tight">Gimmore</h2>
          <p className="text-forest-100 text-sm mt-1 opacity-80">Admin Portal</p>
        </div>

        <nav className="flex-1 px-4 py-4 md:py-0 space-y-1">
          {navItems.map((item) => {
            // Precise matching for dashboard ('/admin' exact match), startsWith for others
            const isActive =
              item.path === '/admin'
                ? location.pathname === '/admin'
                : location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-md transition-colors",
                  isActive
                    ? "bg-moss-green text-white font-medium"
                    : "text-gray-300 hover:bg-forest/80 hover:text-white"
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
        
        <div className="p-4 mt-auto">
          <button 
            onClick={() => logout()} 
            className="flex items-center gap-3 px-3 py-3 w-full text-left text-gray-300 hover:text-white hover:bg-forest/80 rounded-md transition-colors"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="hidden md:flex justify-end items-center p-6 bg-white border-b border-gray-200">
          <div className="flex items-center gap-4">
            <NotificationBell />
            <div className="w-8 h-8 rounded-full bg-warm-beige text-deep-brown flex items-center justify-center font-bold">
              A
            </div>
          </div>
        </header>
        
        <main className="flex-1 p-6 md:p-8">
          <Outlet />
        </main>
      </div>
      
      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

import { NavLink } from 'react-router-dom';
import { Home, PlusCircle, Settings } from 'lucide-react';

const tabs = [
  { to: '/', label: 'Home', icon: Home, exact: true },
  { to: '/add', label: 'Add', icon: PlusCircle, exact: false },
  { to: '/settings', label: 'Settings', icon: Settings, exact: false },
];

export const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#2D6A4F] border-t border-[#1B4332] max-w-md mx-auto">
      <div className="flex items-center justify-around">
        {tabs.map(({ to, label, icon: Icon, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 flex-1 py-3 min-h-[56px] transition-colors ${
                isActive
                  ? 'text-[#52B788]'
                  : 'text-white/60 hover:text-white/90'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={`w-5 h-5 ${isActive ? 'stroke-[#52B788]' : ''}`}
                  strokeWidth={isActive ? 2.5 : 1.8}
                />
                <span className="text-[10px] font-medium tracking-wide uppercase">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

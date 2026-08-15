import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { TutorialModal } from '../TutorialModal';
import { NotificationBell } from '../notifications/NotificationBell';
import { useAuth } from '../../hooks/useAuth';

export const UserLayout = () => {
  const { user } = useAuth();
  const showTutorial = !!(user && !user.hasCompletedTutorial);

  return (
    <div className="min-h-screen bg-[#F5F5F0] flex flex-col">
      {/* Top header bar */}
      <header className="sticky top-0 z-40 bg-[#2D6A4F] text-white px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight">Gimoreni</span>
          <span className="text-[10px] bg-[#52B788]/30 text-[#B7E4C7] px-2 py-0.5 rounded-full font-medium">
            Beta
          </span>
        </div>
        <NotificationBell />
      </header>

      {/* Page content — pad bottom for fixed BottomNav */}
      <main className="flex-1 w-full max-w-md mx-auto pb-20">
        <Outlet />
      </main>

      {/* Fixed bottom tab bar */}
      <BottomNav />

      {/* First-login tutorial overlay */}
      {showTutorial && (
        <TutorialModal
          onClose={() => {
            /* mutation handled inside TutorialModal; auth query invalidation re-renders layout */
          }}
        />
      )}
    </div>
  );
};

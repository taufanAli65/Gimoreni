import { LogOut } from 'lucide-react';
import { ProfileSection } from './settings/ProfileSection';
import { StreakSection } from './settings/StreakSection';
import { BonusHistorySection } from './settings/BonusHistorySection';
import { useLogout } from '../../domains/auth/hooks/useLogout';

export const SettingsPage = () => {
  const logoutMutation = useLogout();

  return (
    <div className="px-4 pt-4 pb-4 space-y-4">
      <h1 className="text-lg font-bold text-[#2D6A4F]">Settings</h1>

      {/* Profile — avatar + name */}
      <ProfileSection />

      {/* Streak info */}
      <StreakSection />

      {/* Bonus history */}
      <BonusHistorySection />

      {/* Logout */}
      <button
        onClick={() => logoutMutation.mutate()}
        disabled={logoutMutation.isPending}
        className="w-full flex items-center justify-center gap-2 py-4 border border-red-200 text-red-500 rounded-xl font-semibold text-sm hover:bg-red-50 transition-colors disabled:opacity-50 min-h-[56px]"
      >
        <LogOut className="w-4 h-4" />
        {logoutMutation.isPending ? 'Logging out...' : 'Log Out'}
      </button>
    </div>
  );
};

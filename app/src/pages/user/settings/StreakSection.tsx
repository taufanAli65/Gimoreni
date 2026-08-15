import { Flame } from 'lucide-react';
import { useMe } from '../../../domains/users/hooks/useMe';

const formatDate = (iso: string | null | undefined) => {
  if (!iso) return 'Never';
  return new Date(iso).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const StreakSection = () => {
  const { data: profile, isLoading } = useMe();

  if (isLoading) {
    return <div className="h-20 bg-gray-100 rounded-xl animate-pulse" />;
  }

  const current = profile?.currentStreak ?? 0;
  const longest = profile?.longestStreak ?? 0;
  const lastLogged = profile?.lastLoggedDate;

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <h3 className="text-sm font-bold text-[#2D6A4F] mb-4 flex items-center gap-2">
        <Flame className={`w-4 h-4 ${current > 0 ? 'text-orange-500 fill-orange-500' : 'text-gray-400'}`} />
        Streak Info
      </h3>
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center">
          <p className={`text-2xl font-bold ${current > 0 ? 'text-orange-500' : 'text-gray-400'}`}>{current}</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wide mt-0.5">Current</p>
        </div>
        <div className="text-center border-x border-gray-100">
          <p className="text-2xl font-bold text-[#2D6A4F]">{longest}</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wide mt-0.5">Longest</p>
        </div>
        <div className="text-center">
          <p className="text-xs font-semibold text-gray-700 mt-1">{formatDate(lastLogged)}</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wide mt-0.5">Last Log</p>
        </div>
      </div>
    </div>
  );
};

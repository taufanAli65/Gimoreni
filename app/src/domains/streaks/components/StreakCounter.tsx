import { useMyStreak } from '../hooks/useMyStreak';
import { Flame } from 'lucide-react';

export const StreakCounter = () => {
  const { data, isLoading, isError } = useMyStreak();

  if (isLoading) return <div className="animate-pulse w-24 h-8 bg-gray-200 rounded-full"></div>;
  if (isError || !data) return null;

  const currentStreak = data.user.currentStreak;
  const isHot = currentStreak > 0; // If they have a streak, show it hot

  return (
    <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full font-medium border ${isHot ? 'bg-orange-50 border-orange-200 text-orange-600' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
      <Flame className={`w-5 h-5 ${isHot ? 'fill-orange-500 text-orange-500' : 'text-gray-400'}`} />
      <span className="text-sm">
        {currentStreak} {currentStreak === 1 ? 'Day' : 'Days'}
      </span>
    </div>
  );
};


import { useMyStreak } from '../hooks/useMyStreak';

export const StreakCalendar = () => {
  const { data, isLoading, isError } = useMyStreak();

  if (isLoading) return <div className="animate-pulse h-24 bg-gray-200 rounded-lg"></div>;
  if (isError || !data) return null;

  // Generate last 30 days
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (29 - i));
    return d;
  });

  const getLogStatus = (date: Date) => {
    const log = data.logs.find(l => {
      const logDate = new Date(l.date);
      return logDate.getUTCFullYear() === date.getUTCFullYear() &&
             logDate.getUTCMonth() === date.getUTCMonth() &&
             logDate.getUTCDate() === date.getUTCDate();
    });
    return log?.didLog ? 'logged' : 'missed';
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-sm font-medium text-gray-700 mb-3 flex justify-between">
        <span>30-Day Activity</span>
        <span className="text-gray-500 text-xs mt-0.5">Longest: {data.user.longestStreak}</span>
      </h3>
      <div className="flex flex-wrap gap-1.5 justify-end">
        {days.map((day, i) => {
          const status = getLogStatus(day);
          const isToday = day.getTime() === today.getTime();
          let bgClass = 'bg-gray-100';
          
          if (status === 'logged') {
            bgClass = 'bg-moss-green';
          } else if (day.getTime() < today.getTime()) {
            bgClass = 'bg-gray-200';
          }
          
          return (
            <div 
              key={i}
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-sm ${bgClass} ${isToday ? 'ring-1 ring-offset-1 ring-moss-green' : ''}`}
              title={day.toDateString()}
            />
          );
        })}
      </div>
    </div>
  );
};

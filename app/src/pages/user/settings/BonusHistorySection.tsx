import { useQuery } from '@tanstack/react-query';
import { api } from '../../../shared/lib/api';
import type { Bonus } from '../../../domains/bonuses/types';

const formatIDR = (v: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v);

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

const bonusLabel: Record<string, string> = {
  MONTHLY_COMPLETION: 'Monthly Completion',
  STREAK_MILESTONE: 'Streak Milestone',
  MANUAL: 'Manual',
};

const useMyBonuses = () =>
  useQuery({
    queryKey: ['bonuses', 'me'],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: Bonus[] }>('/bonuses');
      return data.data;
    },
  });

export const BonusHistorySection = () => {
  const { data: bonuses, isLoading } = useMyBonuses();

  if (isLoading) {
    return <div className="h-20 bg-gray-100 rounded-xl animate-pulse" />;
  }

  if (!bonuses?.length) {
    return (
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="text-sm font-bold text-[#2D6A4F] mb-3">Bonus History</h3>
        <p className="text-xs text-gray-400 text-center py-4">No bonuses or deductions yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <h3 className="text-sm font-bold text-[#2D6A4F] mb-4">Bonus History</h3>
      <div className="space-y-3">
        {bonuses.map((bonus) => {
          const amt = Number(bonus.amount);
          const isPositive = amt >= 0;
          return (
            <div key={bonus.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {bonusLabel[bonus.type] ?? bonus.type}
                </p>
                <p className="text-xs text-gray-400">{formatDate(bonus.createdAt)}</p>
                {bonus.description && (
                  <p className="text-xs text-gray-500 italic mt-0.5">{bonus.description}</p>
                )}
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${isPositive ? 'text-[#52B788]' : 'text-red-500'}`}>
                  {isPositive ? '+' : ''}{formatIDR(Math.abs(amt))}
                </p>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${bonus.isApplied ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                  {bonus.isApplied ? 'Applied' : 'Pending'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

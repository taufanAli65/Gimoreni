import { useState } from 'react';
import { Flame, Wallet, TrendingUp } from 'lucide-react';
import { useActiveQuest } from '../../domains/quests/hooks/useActiveQuest';
import { useRedemptions } from '../../domains/quests/hooks/useRedemptions';
import { useMyStreak } from '../../domains/streaks/hooks/useMyStreak';
import { useMe } from '../../domains/users/hooks/useMe';
import { QuestCard } from '../../domains/quests/components/QuestCard';
import { RedemptionForm } from '../../domains/quests/components/RedemptionForm';
import { ExpenseChart } from '../../shared/components/ExpenseChart';

const formatIDR = (v: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v);

export const HomePage = () => {
  const { data: profile, isLoading: profileLoading } = useMe();
  const { data: streakData } = useMyStreak();
  const { data: activeQuest, isLoading: questLoading } = useActiveQuest();
  const { data: myRedemptions, isLoading: redemptionsLoading } = useRedemptions();
  const [showRedemptionForm, setShowRedemptionForm] = useState(false);

  const currentStreak = streakData?.user.currentStreak ?? profile?.currentStreak ?? 0;
  const isHot = currentStreak > 0;

  const activeRedemption = myRedemptions?.data.find(
    (r) => activeQuest && r.questId === activeQuest.id
  );

  const month = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="px-4 pt-4 pb-2 space-y-4">
      {/* Streak + Points row */}
      <div className="flex gap-3">
        {/* Streak Card */}
        <div className={`flex-1 bg-white rounded-xl p-4 shadow-sm border flex items-center gap-3 ${isHot ? 'border-orange-200' : 'border-gray-100'}`}>
          <div className={`w-10 h-10 flex items-center justify-center rounded-full ${isHot ? 'bg-orange-100' : 'bg-gray-100'}`}>
            <Flame className={`w-5 h-5 ${isHot ? 'text-orange-500 fill-orange-500 animate-pulse' : 'text-gray-400'}`} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">Streak</p>
            <p className={`text-xl font-bold ${isHot ? 'text-orange-500' : 'text-gray-400'}`}>
              {currentStreak} <span className="text-xs font-normal">days</span>
            </p>
          </div>
        </div>

        {/* Points Card */}
        <div className="flex-1 bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#52B788]/15">
            <TrendingUp className="w-5 h-5 text-[#52B788]" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">Points</p>
            <p className="text-xl font-bold text-[#52B788]">
              {profileLoading ? '...' : (profile?.totalPoints ?? 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Balance & Allowance */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex gap-4">
        <div className="flex-1 flex items-center gap-3">
          <Wallet className="w-4 h-4 text-[#2D6A4F]" />
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-500">Balance</p>
            <p className="text-sm font-bold text-[#2D6A4F]">
              {profileLoading ? '...' : formatIDR(Number(profile?.balance ?? 0))}
            </p>
          </div>
        </div>
        <div className="w-px bg-gray-100" />
        <div className="flex-1 flex items-center gap-3">
          <div className="w-4 h-4 text-[#6B4226] font-bold text-sm flex items-center">Rp</div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-500">Allowance</p>
            <p className="text-sm font-bold text-[#6B4226]">
              {profileLoading ? '...' : formatIDR(Number(profile?.allowance ?? 0))}
            </p>
          </div>
        </div>
      </div>

      {/* Expense Chart */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h2 className="text-sm font-bold text-[#2D6A4F] mb-1">Expenses This Month</h2>
        <p className="text-xs text-gray-400 mb-3">{month}</p>
        <ExpenseChart />
      </div>

      {/* Quest Widget */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h2 className="text-sm font-bold text-[#2D6A4F] mb-3 flex items-center gap-2">
          🎯 Active Quest
        </h2>

        {questLoading || redemptionsLoading ? (
          <div className="text-center py-4 text-sm text-gray-400 animate-pulse">Loading quest...</div>
        ) : !activeQuest ? (
          <div className="text-center py-6 border border-dashed border-gray-200 rounded-lg">
            <p className="text-sm text-gray-400">No active quest right now.</p>
            <p className="text-xs text-gray-300 mt-1">Check back later!</p>
          </div>
        ) : (
          <div>
            <QuestCard quest={activeQuest} />

            {!activeRedemption && !showRedemptionForm && (
              <button
                onClick={() => setShowRedemptionForm(true)}
                className="mt-3 w-full py-3 bg-[#2D6A4F] text-white text-sm font-bold rounded-lg hover:bg-[#1B4332] transition-colors min-h-[44px]"
              >
                I completed this! Submit Proof
              </button>
            )}

            {showRedemptionForm && !activeRedemption && (
              <div className="mt-3">
                <RedemptionForm
                  quest={activeQuest}
                  onCancel={() => setShowRedemptionForm(false)}
                  onSuccess={() => setShowRedemptionForm(false)}
                />
              </div>
            )}

            {activeRedemption && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Your submission status:</p>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  activeRedemption.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  activeRedemption.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {activeRedemption.status}
                </span>
                {activeRedemption.status === 'REJECTED' && activeRedemption.rejectionNote && (
                  <p className="mt-2 text-xs text-red-500">
                    <strong>Reason:</strong> {activeRedemption.rejectionNote}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

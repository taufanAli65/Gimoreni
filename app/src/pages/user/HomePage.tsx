import { useState } from 'react';
import { useActiveQuest } from '../../domains/quests/hooks/useActiveQuest';
import { useRedemptions } from '../../domains/quests/hooks/useRedemptions';
import { QuestCard } from '../../domains/quests/components/QuestCard';
import { RedemptionForm } from '../../domains/quests/components/RedemptionForm';
import { StreakCounter } from '../../domains/streaks/components/StreakCounter';
import { StreakCalendar } from '../../domains/streaks/components/StreakCalendar';

export const HomePage = () => {
  const { data: activeQuest, isLoading: questLoading } = useActiveQuest();
  const { data: myRedemptions, isLoading: redemptionsLoading } = useRedemptions();
  const [showRedemptionForm, setShowRedemptionForm] = useState(false);

  // Find if user already submitted a redemption for the active quest
  const activeRedemption = myRedemptions?.data.find(
    (r) => activeQuest && r.questId === activeQuest.id
  );

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-8">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-deep-brown">Home</h1>
          <StreakCounter />
        </div>
        
        {/* Quest Widget */}
        <div className="bg-gradient-to-br from-moss-green/20 to-warm-beige/30 p-4 md:p-6 rounded-xl border border-moss-green/30 shadow-sm">
          <h2 className="text-xl font-bold text-forest-green mb-4 flex items-center gap-2">
            <span>🎯</span> Active Quest
          </h2>
          
          {questLoading || redemptionsLoading ? (
            <div className="text-center py-4 text-gray-500">Loading quest...</div>
          ) : !activeQuest ? (
            <div className="text-center py-6 bg-white/60 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500">No active quest right now. Check back later!</p>
            </div>
          ) : (
            <div>
              <QuestCard quest={activeQuest} />
              
              {!activeRedemption && !showRedemptionForm && (
                <button
                  onClick={() => setShowRedemptionForm(true)}
                  className="mt-4 w-full py-3 bg-forest-green text-white font-bold rounded-lg shadow-md hover:bg-forest-green/90 transition-colors"
                >
                  I completed this! Submit Proof
                </button>
              )}

              {showRedemptionForm && !activeRedemption && (
                <div className="mt-4">
                  <RedemptionForm 
                    quest={activeQuest} 
                    onCancel={() => setShowRedemptionForm(false)}
                    onSuccess={() => setShowRedemptionForm(false)}
                  />
                </div>
              )}

              {activeRedemption && (
                <div className="mt-4 p-4 bg-white/80 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-deep-brown mb-1">Your Submission</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full 
                      ${activeRedemption.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${activeRedemption.status === 'APPROVED' ? 'bg-green-100 text-green-800' : ''}
                      ${activeRedemption.status === 'REJECTED' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {activeRedemption.status}
                    </span>
                  </div>
                  {activeRedemption.status === 'REJECTED' && activeRedemption.rejectionNote && (
                    <p className="mt-2 text-sm text-red-600">
                      <strong>Reason:</strong> {activeRedemption.rejectionNote}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Streak Calendar Widget */}
      <div className="mb-8">
         <StreakCalendar />
      </div>

      {/* Other home page widgets will go here in future phases (e.g., recent transactions) */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h2 className="text-lg font-bold text-deep-brown mb-4">Recent Activity</h2>
        <p className="text-gray-500 text-sm">Your recent transactions and updates will appear here.</p>
      </div>
    </div>
  );
};

import { useState } from 'react';
import { useQuests } from '../../domains/quests/hooks/useQuests';
import { useQuestMutations } from '../../domains/quests/hooks/useQuestMutations';
import { useRedemptions } from '../../domains/quests/hooks/useRedemptions';
import { QuestCard } from '../../domains/quests/components/QuestCard';
import { QuestForm } from '../../domains/quests/components/QuestForm';
import { RedemptionReviewCard } from '../../domains/quests/components/RedemptionReviewCard';


export const QuestsPage = () => {
  const { data: quests, isLoading: questsLoading } = useQuests();
  const { data: redemptionsData, isLoading: redemptionsLoading } = useRedemptions({ status: 'PENDING' });
  const { createQuest, publishQuest, deleteQuest } = useQuestMutations();
  
  const [isCreating, setIsCreating] = useState(false);


  const handleCreateSubmit = (data: { title: string; description: string; pointReward: number; deadline?: string }) => {
    createQuest.mutate(data, {
      onSuccess: () => setIsCreating(false)
    });
  };

  const handlePublish = (id: string) => {
    if (window.confirm('Publish this quest? Users will be able to see it.')) {
      publishQuest.mutate(id);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this quest completely?')) {
      deleteQuest.mutate(id);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-deep-brown">Quest Management</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-forest-green text-white rounded-lg font-medium hover:bg-forest-green/90"
        >
          + New Quest
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-4 text-deep-brown border-b pb-2">All Quests</h2>
          
          {isCreating && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-semibold mb-4 text-forest-green">Create New Quest</h3>
              <QuestForm 
                onSubmit={handleCreateSubmit} 
                onCancel={() => setIsCreating(false)} 
                isLoading={createQuest.isPending}
              />
            </div>
          )}

          {questsLoading ? (
            <div>Loading quests...</div>
          ) : quests?.length === 0 ? (
            <p className="text-gray-500">No quests found. Create one above.</p>
          ) : (
            <div className="space-y-4">
              {quests?.map(quest => (
                <div key={quest.id} className="relative group">
                  <QuestCard quest={quest} isAdmin={true} />
                  
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white p-1 rounded shadow-sm">
                    {quest.status === 'DRAFT' && (
                      <button 
                        onClick={() => handlePublish(quest.id)}
                        className="text-xs bg-moss-green text-white px-2 py-1 rounded hover:bg-moss-green/90"
                      >
                        Publish
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(quest.id)}
                      className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4 text-deep-brown border-b pb-2">Pending Redemptions</h2>
          
          {redemptionsLoading ? (
            <div>Loading redemptions...</div>
          ) : redemptionsData?.data.length === 0 ? (
            <p className="text-gray-500">No pending redemptions to review.</p>
          ) : (
            <div className="space-y-4">
              {redemptionsData?.data.map(redemption => (
                <RedemptionReviewCard key={redemption.id} redemption={redemption} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

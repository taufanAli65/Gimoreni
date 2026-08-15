import { useState } from 'react';
import { PageHeader } from '../../shared/components/PageHeader';
import { DataTable } from '../../shared/components/DataTable';
import { StatusBadge } from '../../shared/components/StatusBadge';
import { useQuests } from '../../domains/quests/hooks/useQuests';
import { useQuestMutations } from '../../domains/quests/hooks/useQuestMutations';
import { useRedemptions } from '../../domains/quests/hooks/useRedemptions';
import { QuestForm } from '../../domains/quests/components/QuestForm';
import { RedemptionReviewCard } from '../../domains/quests/components/RedemptionReviewCard';
import { format } from 'date-fns';
import { Edit2, Trash2, Send } from 'lucide-react';
import { ConfirmDialog } from '../../shared/components/ConfirmDialog';

export const QuestsPage = () => {
  const { data: quests, isLoading: questsLoading } = useQuests();
  const { data: redemptionsData, isLoading: redemptionsLoading } = useRedemptions({ status: 'PENDING' });
  const { createQuest, publishQuest, deleteQuest } = useQuestMutations();
  
  const [isCreating, setIsCreating] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleCreateSubmit = (data: { title: string; description: string; pointReward: number; deadline?: string }) => {
    createQuest.mutate(data, {
      onSuccess: () => setIsCreating(false)
    });
  };

  const columns = [
    {
      key: 'title',
      header: 'Title',
      render: (item: any) => <span className="font-medium text-gray-900">{item.title}</span>,
    },
    {
      key: 'pointReward',
      header: 'Points',
      render: (item: any) => <span className="font-semibold text-moss-green">+{item.pointReward} pts</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: any) => (
        <StatusBadge variant={item.status.toLowerCase()}>{item.status}</StatusBadge>
      ),
    },
    {
      key: 'deadline',
      header: 'Deadline',
      render: (item: any) => (
        <span className="text-gray-500 text-sm">
          {item.deadline ? format(new Date(item.deadline), 'MMM d, yyyy') : 'No deadline'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: any) => (
        <div className="flex gap-2">
          {item.status === 'DRAFT' && (
            <button 
              onClick={() => {
                if (window.confirm('Publish this quest? Users will be able to see it.')) {
                  publishQuest.mutate(item.id);
                }
              }}
              className="p-1.5 text-moss-green hover:bg-moss-green/10 rounded-md transition-colors"
              title="Publish"
            >
              <Send size={16} />
            </button>
          )}
          <button 
            className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
            title="Edit"
          >
            <Edit2 size={16} />
          </button>
          <button 
            onClick={() => setDeleteId(item.id)}
            className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Quests Management" 
        subtitle="Manage available quests and review user redemptions."
        actions={
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 bg-forest text-white rounded-md font-medium hover:bg-forest/90 focus:ring-2 focus:ring-offset-2 focus:ring-forest transition-colors"
          >
            + New Quest
          </button>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Quest List</h2>
            </div>
            
            {isCreating && (
              <div className="p-6 bg-gray-50 border-b border-gray-200">
                <h3 className="font-medium mb-4 text-forest text-sm uppercase tracking-wider">Create New Quest</h3>
                <QuestForm 
                  onSubmit={handleCreateSubmit} 
                  onCancel={() => setIsCreating(false)} 
                  isLoading={createQuest.isPending}
                />
              </div>
            )}

            <div className="p-0">
              {questsLoading ? (
                <div className="p-8 text-center text-gray-500">Loading quests...</div>
              ) : (
                <DataTable 
                  data={quests || []} 
                  columns={columns} 
                  keyExtractor={(item: any) => item.id} 
                  emptyMessage="No quests found. Create one above."
                />
              )}
            </div>
          </div>
        </div>

        <div className="xl:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center justify-between">
                Pending Redemptions
                {(redemptionsData?.meta?.total || 0) > 0 && (
                  <span className="bg-warm-beige text-deep-brown text-xs font-bold px-2 py-1 rounded-full">
                    {redemptionsData?.meta?.total}
                  </span>
                )}
              </h2>
            </div>
            <div className="p-6 bg-gray-50/50 min-h-[400px]">
              {redemptionsLoading ? (
                <div className="text-center text-gray-500 py-8">Loading redemptions...</div>
              ) : redemptionsData?.data.length === 0 ? (
                <div className="text-center text-gray-500 py-8 bg-white border border-dashed border-gray-300 rounded-lg">
                  No pending redemptions.
                </div>
              ) : (
                <div className="space-y-4">
                  {redemptionsData?.data.map((redemption: any) => (
                    <RedemptionReviewCard key={redemption.id} redemption={redemption} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) deleteQuest.mutate(deleteId);
        }}
        title="Delete Quest"
        description="Are you sure you want to delete this quest? This action cannot be undone."
        isDanger={true}
        confirmText="Delete Quest"
      />
    </div>
  );
};

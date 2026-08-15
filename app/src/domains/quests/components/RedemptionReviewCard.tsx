import { useState } from 'react';
import type { QuestRedemption } from '../types';
import { useRedemptionMutations } from '../hooks/useRedemptionMutations';
import { format } from 'date-fns';

interface RedemptionReviewCardProps {
  redemption: QuestRedemption;
}

export const RedemptionReviewCard = ({ redemption }: RedemptionReviewCardProps) => {
  const [rejectionNote, setRejectionNote] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);
  const { approveRedemption, rejectRedemption } = useRedemptionMutations();

  const handleApprove = () => {
    if (window.confirm('Approve this redemption and award points?')) {
      approveRedemption.mutate(redemption.id);
    }
  };

  const handleReject = () => {
    if (!rejectionNote.trim()) {
      alert('Please provide a rejection note.');
      return;
    }
    rejectRedemption.mutate({ id: redemption.id, rejectionNote });
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 border border-gray-100 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg text-deep-brown">{redemption.quest?.title}</h3>
          <p className="text-sm text-gray-500">
            Submitted by: <span className="font-medium">{redemption.user?.name}</span>
          </p>
          <p className="text-xs text-gray-400">
            {format(new Date(redemption.createdAt), 'PPpp')}
          </p>
        </div>
        <div className="text-forest-green font-bold bg-moss-green/10 px-3 py-1 rounded-full">
          +{redemption.quest?.pointReward} pts
        </div>
      </div>

      {redemption.proofNote && (
        <div className="mb-4 bg-gray-50 p-3 rounded-md text-sm text-gray-700">
          <span className="font-semibold">Note:</span> {redemption.proofNote}
        </div>
      )}

      {redemption.proofUrl && (
        <div className="mb-4">
          <p className="text-sm font-semibold mb-2">Proof Image:</p>
          <a href={redemption.proofUrl} target="_blank" rel="noopener noreferrer">
            <img 
              src={redemption.proofUrl} 
              alt="Proof" 
              className="max-h-64 rounded-md object-contain border border-gray-200 cursor-pointer hover:opacity-90"
            />
          </a>
        </div>
      )}

      {redemption.status === 'PENDING' && !isRejecting && (
        <div className="flex gap-2 justify-end mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={() => setIsRejecting(true)}
            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 focus:outline-none"
            disabled={approveRedemption.isPending}
          >
            Reject...
          </button>
          <button
            onClick={handleApprove}
            className="px-4 py-2 text-sm font-medium text-white bg-forest-green rounded-md hover:bg-forest-green/90 focus:outline-none disabled:opacity-50"
            disabled={approveRedemption.isPending}
          >
            {approveRedemption.isPending ? 'Approving...' : 'Approve & Award Points'}
          </button>
        </div>
      )}

      {isRejecting && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Rejection *</label>
          <textarea
            rows={2}
            value={rejectionNote}
            onChange={(e) => setRejectionNote(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 mb-2 focus:outline-none focus:ring-1 focus:ring-red-500"
            placeholder="Why is this proof insufficient?"
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setIsRejecting(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none"
              disabled={rejectRedemption.isPending}
            >
              Cancel
            </button>
            <button
              onClick={handleReject}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none disabled:opacity-50"
              disabled={rejectRedemption.isPending || !rejectionNote.trim()}
            >
              {rejectRedemption.isPending ? 'Rejecting...' : 'Confirm Rejection'}
            </button>
          </div>
        </div>
      )}
      
      {redemption.status !== 'PENDING' && (
        <div className="mt-4 pt-4 border-t border-gray-100 text-sm">
          Status: <span className="font-semibold">{redemption.status}</span>
          {redemption.rejectionNote && (
            <p className="text-red-600 mt-1">Reason: {redemption.rejectionNote}</p>
          )}
        </div>
      )}
    </div>
  );
};

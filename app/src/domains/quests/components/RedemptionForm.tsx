import { useState } from 'react';
import type { Quest } from '../types';
import { useRedemptionMutations } from '../hooks/useRedemptionMutations';

interface RedemptionFormProps {
  quest: Quest;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const RedemptionForm = ({ quest, onSuccess, onCancel }: RedemptionFormProps) => {
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofNote, setProofNote] = useState('');
  const { submitRedemption } = useRedemptionMutations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quest.proofRequired && !proofFile) return;

    submitRedemption.mutate({
      questId: quest.id,
      proofFile: proofFile || undefined,
      proofNote: proofNote || undefined,
    }, {
      onSuccess: () => {
        if (onSuccess) onSuccess();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-lg border border-gray-100 shadow-sm mt-4">
      <h4 className="font-semibold text-deep-brown mb-2">Submit Proof for "{quest.title}"</h4>
      
      {quest.proofRequired && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Proof Image *</label>
          <input
            type="file"
            accept="image/*"
            required
            onChange={(e) => setProofFile(e.target.files?.[0] || null)}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-moss-green/10 file:text-forest-green hover:file:bg-moss-green/20"
          />
          <p className="text-xs text-gray-400 mt-1">Image will be compressed automatically.</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Note (Optional)</label>
        <textarea
          rows={2}
          value={proofNote}
          onChange={(e) => setProofNote(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-forest-green"
          placeholder="Any comments?"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none"
            disabled={submitRedemption.isPending}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-forest-green rounded-md hover:bg-forest-green/90 focus:outline-none disabled:opacity-50"
          disabled={submitRedemption.isPending || (quest.proofRequired && !proofFile)}
        >
          {submitRedemption.isPending ? 'Submitting...' : 'Submit Redemption'}
        </button>
      </div>
    </form>
  );
};

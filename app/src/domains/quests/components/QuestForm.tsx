import { useState } from 'react';
import type { Quest } from '../types';

interface QuestFormProps {
  initialData?: Quest;
  onSubmit: (data: { title: string; description: string; pointReward: number; deadline?: string }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const QuestForm = ({ initialData, onSubmit, onCancel, isLoading }: QuestFormProps) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [pointReward, setPointReward] = useState(initialData?.pointReward?.toString() || '');
  const [deadline, setDeadline] = useState(initialData?.deadline ? initialData.deadline.substring(0, 10) : '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      pointReward: parseInt(pointReward, 10) || 0,
      deadline: deadline ? new Date(deadline).toISOString() : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-forest-green"
          placeholder="e.g. Clean your room"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          required
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-forest-green"
          placeholder="Detailed instructions for the quest..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Points Reward</label>
          <input
            type="number"
            required
            min="1"
            value={pointReward}
            onChange={(e) => setPointReward(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-forest-green"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Deadline (Optional)</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-forest-green"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-forest-green rounded-md hover:bg-forest-green/90 focus:outline-none disabled:opacity-50"
          disabled={isLoading || !title || !description || !pointReward}
        >
          {isLoading ? 'Saving...' : (initialData ? 'Update Quest' : 'Create Quest')}
        </button>
      </div>
    </form>
  );
};

import React, { useState } from 'react';
import { useCreateBonus } from '../hooks/useBonusMutations';
import type { BonusType } from '../types';

export const BonusForm = () => {
  const [userId, setUserId] = useState('');
  const [type, setType] = useState<BonusType>('MANUAL');
  const [amount, setAmount] = useState('');
  const [pointsBonus, setPointsBonus] = useState('');
  const [description, setDescription] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  const { mutate: createBonus, isPending } = useCreateBonus();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createBonus({
      userId,
      type,
      amount: parseFloat(amount),
      pointsBonus: pointsBonus ? parseInt(pointsBonus) : 0,
      description: description || undefined,
      month: type === 'MONTHLY_COMPLETION' ? parseInt(month) : undefined,
      year: type === 'MONTHLY_COMPLETION' ? parseInt(year) : undefined,
    }, {
      onSuccess: () => {
        setUserId('');
        setAmount('');
        setPointsBonus('');
        setDescription('');
        setMonth('');
        setYear('');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Issue Bonus</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
          <input 
            type="text" 
            required 
            value={userId} 
            onChange={e => setUserId(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-moss-green focus:ring-moss-green sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select 
            value={type} 
            onChange={e => setType(e.target.value as BonusType)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-moss-green focus:ring-moss-green sm:text-sm"
          >
            <option value="MANUAL">Manual</option>
            <option value="MONTHLY_COMPLETION">Monthly Completion</option>
            <option value="STREAK_MILESTONE">Streak Milestone</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
          <input 
            type="number" 
            step="0.01" 
            required 
            value={amount} 
            onChange={e => setAmount(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-moss-green focus:ring-moss-green sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Points Bonus</label>
          <input 
            type="number" 
            value={pointsBonus} 
            onChange={e => setPointsBonus(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-moss-green focus:ring-moss-green sm:text-sm"
          />
        </div>

        {type === 'MONTHLY_COMPLETION' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Month (1-12)</label>
              <input 
                type="number" 
                min="1" max="12" 
                required 
                value={month} 
                onChange={e => setMonth(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-moss-green focus:ring-moss-green sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input 
                type="number" 
                required 
                value={year} 
                onChange={e => setYear(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-moss-green focus:ring-moss-green sm:text-sm"
              />
            </div>
          </>
        )}

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <input 
            type="text" 
            value={description} 
            onChange={e => setDescription(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-moss-green focus:ring-moss-green sm:text-sm"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          type="submit" 
          disabled={isPending}
          className="bg-moss-green hover:bg-forest-green text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 transition-colors"
        >
          {isPending ? 'Creating...' : 'Issue Bonus'}
        </button>
      </div>
    </form>
  );
};

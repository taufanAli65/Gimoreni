import React from 'react';
import type { Bonus } from '../types';
import { useApplyBonus, useDeleteBonus } from '../hooks/useBonusMutations';
import { Coins, CheckCircle, Trash2 } from 'lucide-react';

interface BonusCardProps {
  bonus: Bonus;
}

export const BonusCard: React.FC<BonusCardProps> = ({ bonus }) => {
  const { mutate: applyBonus, isPending: isApplying } = useApplyBonus();
  const { mutate: deleteBonus, isPending: isDeleting } = useDeleteBonus();

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
      <div className="flex flex-col">
        <span className="font-semibold text-gray-900">{bonus.type.replace('_', ' ')}</span>
        <span className="text-sm text-gray-500">
          User ID: <span className="font-mono">{bonus.userId}</span> {bonus.user ? `(${bonus.user.name})` : ''}
        </span>
        <span className="text-sm font-medium text-forest-green mt-1">
          +${Number(bonus.amount).toFixed(2)} {bonus.pointsBonus > 0 && `| +${bonus.pointsBonus} pts`}
        </span>
        {bonus.description && (
          <span className="text-xs text-gray-400 mt-1">{bonus.description}</span>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        {bonus.isApplied ? (
          <span className="flex items-center text-sm font-medium text-moss-green bg-moss-green/10 px-3 py-1 rounded-full">
            <CheckCircle className="w-4 h-4 mr-1" />
            Applied
          </span>
        ) : (
          <>
            <button
              onClick={() => applyBonus(bonus.id)}
              disabled={isApplying}
              className="flex items-center text-sm font-medium text-white bg-moss-green hover:bg-forest-green px-3 py-1.5 rounded-md disabled:opacity-50 transition-colors"
            >
              <Coins className="w-4 h-4 mr-1" />
              {isApplying ? 'Applying...' : 'Apply'}
            </button>
            <button
              onClick={() => deleteBonus(bonus.id)}
              disabled={isDeleting}
              className="text-red-500 hover:text-red-700 p-1.5 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

import type { Quest } from '../types';
import { format } from 'date-fns';

interface QuestCardProps {
  quest: Quest;
  onClick?: () => void;
  isAdmin?: boolean;
}

export const QuestCard = ({ quest, onClick, isAdmin }: QuestCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-200 text-gray-800';
      case 'ACTIVE': return 'bg-moss-green text-white';
      case 'COMPLETED': return 'bg-deep-brown text-white';
      case 'EXPIRED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow p-4 border border-gray-100 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg text-deep-brown">{quest.title}</h3>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(quest.status)}`}>
          {quest.status}
        </span>
      </div>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{quest.description}</p>
      
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center gap-1 text-forest-green font-semibold">
          <span>💎 {quest.pointReward} pts</span>
        </div>
        
        {quest.deadline && (
          <div className="text-gray-500">
            Due: {format(new Date(quest.deadline), 'MMM d, yyyy')}
          </div>
        )}
      </div>

      {isAdmin && quest._count !== undefined && (
        <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500 flex justify-between">
          <span>Pending redemptions:</span>
          <span className="font-semibold bg-gray-100 px-2 rounded-full">
            {quest._count.redemptions}
          </span>
        </div>
      )}
    </div>
  );
};

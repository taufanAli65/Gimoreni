import React, { useEffect, useState } from 'react';
import { Gift, X, ChevronRight } from 'lucide-react';
import type { Notification } from '../../../domains/notifications/types';
import { useNotificationMutations } from '../../../domains/notifications/hooks/useNotificationMutations';

interface InteractiveNotificationProps {
  notifications: Notification[];
}

export const InteractiveNotification: React.FC<InteractiveNotificationProps> = ({ notifications }) => {
  // Find the oldest unread interactive notification
  const activeNotification = notifications
    .filter(n => n.requiresAction && !n.isRead)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())[0];

  const { markAsRead } = useNotificationMutations();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (activeNotification) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [activeNotification]);

  if (!activeNotification || !isVisible) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    markAsRead.mutate(activeNotification.id);
  };

  const handleAction = () => {
    if (activeNotification.actionUrl) {
      window.location.href = activeNotification.actionUrl;
    }
    handleDismiss();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="relative p-6 text-center">
          <button 
            onClick={handleDismiss}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-1 transition-colors"
          >
            <X size={18} />
          </button>
          
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-4">
            <Gift size={32} />
          </div>
          
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {activeNotification.title}
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
            {activeNotification.body}
          </p>
          
          <div className="flex gap-3">
            <button 
              onClick={handleDismiss}
              className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Dismiss
            </button>
            <button 
              onClick={handleAction}
              className="flex-1 py-2.5 px-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium flex items-center justify-center gap-1 transition-colors shadow-lg shadow-green-600/20"
            >
              Claim <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

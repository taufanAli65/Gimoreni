import React, { useRef, useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import type { Notification } from '../../../domains/notifications/types';
import { NotificationItem } from './NotificationItem';
import { useNotificationMutations } from '../../../domains/notifications/hooks/useNotificationMutations';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  isLoading: boolean;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ 
  isOpen, 
  onClose, 
  notifications,
  isLoading 
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { markAllAsRead } = useNotificationMutations();

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 z-50 overflow-hidden"
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          Notifications
          {unreadCount > 0 && (
            <span className="bg-green-100 text-green-700 text-xs py-0.5 px-2 rounded-full">
              {unreadCount} new
            </span>
          )}
        </h3>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={() => markAllAsRead.mutate()}
              className="text-xs text-gray-500 hover:text-green-600 flex items-center gap-1"
            >
              <CheckCircle2 size={14} />
              Mark all read
            </button>
          )}
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500 flex flex-col items-center">
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-full mb-3">
              <CheckCircle2 size={24} className="text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">All caught up!</p>
            <p className="text-xs mt-1">No new notifications right now.</p>
          </div>
        ) : (
          <div>
            {notifications.map(notification => (
              <NotificationItem 
                key={notification.id} 
                notification={notification} 
                onClose={onClose}
              />
            ))}
          </div>
        )}
      </div>
      
      {notifications.length > 0 && (
        <div className="p-3 border-t border-gray-100 dark:border-gray-800 text-center">
          <button className="text-xs text-green-600 font-medium hover:text-green-700">
            View all notifications
          </button>
        </div>
      )}
    </div>
  );
};

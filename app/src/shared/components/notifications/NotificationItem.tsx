import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle2, Circle, Trash2 } from 'lucide-react';
import type { Notification } from '../../../domains/notifications/types';
import { useNotificationMutations } from '../../../domains/notifications/hooks/useNotificationMutations';

interface NotificationItemProps {
  notification: Notification;
  onClose?: () => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onClose }) => {
  const { markAsRead, deleteNotification } = useNotificationMutations();

  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!notification.isRead) {
      markAsRead.mutate(notification.id);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNotification.mutate(notification.id);
  };

  const handleClick = () => {
    if (!notification.isRead) {
      markAsRead.mutate(notification.id);
    }
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
    if (onClose) onClose();
  };

  return (
    <div
      onClick={handleClick}
      className={`p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group flex gap-3 ${
        notification.isRead ? 'opacity-70' : 'bg-green-50/30 dark:bg-green-900/10'
      }`}
    >
      <div className="flex-shrink-0 mt-1">
        <button
          onClick={handleMarkAsRead}
          className={`text-gray-400 hover:text-green-600 transition-colors`}
          title={notification.isRead ? 'Read' : 'Mark as read'}
        >
          {notification.isRead ? (
            <CheckCircle2 size={16} />
          ) : (
            <Circle size={16} className="text-green-500 fill-green-50" />
          )}
        </button>
      </div>
      
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${notification.isRead ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100'}`}>
          {notification.title}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
          {notification.body}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">
          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
        </p>
      </div>

      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleDelete}
          className="text-gray-400 hover:text-red-500 p-1"
          title="Delete notification"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

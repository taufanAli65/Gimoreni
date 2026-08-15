import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../../../domains/notifications/hooks/useNotifications';
import { NotificationDropdown } from './NotificationDropdown';
import { InteractiveNotification } from './InteractiveNotification';

export const NotificationBell: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { data, isLoading } = useNotifications(1, 10);
  
  const notifications = data?.items || [];
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <>
      <div className="relative inline-block">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsDropdownOpen(!isDropdownOpen);
          }}
          className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors focus:outline-none"
          aria-label="Notifications"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-gray-900">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
        
        <NotificationDropdown 
          isOpen={isDropdownOpen} 
          onClose={() => setIsDropdownOpen(false)} 
          notifications={notifications}
          isLoading={isLoading}
        />
      </div>
      
      {/* Interactive Modal for requiresAction notifications */}
      <InteractiveNotification notifications={notifications} />
    </>
  );
};

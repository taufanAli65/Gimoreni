import type { HTMLAttributes } from 'react';
import { cn } from '../lib/utils';

interface UserAvatarProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  avatarUrl?: string | null;
  size?: 'sm' | 'md' | 'lg';
}

export const UserAvatar = ({ name, avatarUrl, size = 'md', className, ...props }: UserAvatarProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-xl',
  };

  return (
    <div
      className={cn(
        'relative flex shrink-0 overflow-hidden rounded-full bg-warm-beige text-deep-brown font-semibold items-center justify-center',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name}
          className="aspect-square h-full w-full object-cover"
        />
      ) : (
        <span>{getInitials(name || 'User')}</span>
      )}
    </div>
  );
};

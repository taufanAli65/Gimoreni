import React from 'react';
import { cn } from '../../../shared/lib/utils';
import type { Category } from '../types';

interface CategoryBadgeProps {
  category: Category;
  className?: string;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, className }) => {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
        className
      )}
      style={{
        backgroundColor: category.color ? `${category.color}20` : '#f3f4f6',
        color: category.color || '#374151',
        border: `1px solid ${category.color ? `${category.color}40` : '#e5e7eb'}`,
      }}
    >
      {category.icon && <span>{category.icon}</span>}
      <span>{category.name}</span>
    </div>
  );
};

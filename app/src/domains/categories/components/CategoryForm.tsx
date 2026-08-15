import React, { useState, useEffect } from 'react';
import type { Category, CategoryVisibility } from '../types';
import { useAuth } from '../../../shared/hooks/useAuth';

interface CategoryFormProps {
  initialData?: Category;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({ initialData, onSubmit, isLoading }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [name, setName] = useState(initialData?.name || '');
  const [icon, setIcon] = useState(initialData?.icon || '');
  const [color, setColor] = useState(initialData?.color || '#52B788');
  const [visibility, setVisibility] = useState<CategoryVisibility>(
    initialData?.visibility || (isAdmin ? 'ALL' : 'ALL') // User can't set ADMIN_ONLY anyway
  );
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setIcon(initialData.icon || '');
      setColor(initialData.color || '#52B788');
      setVisibility(initialData.visibility);
      setIsActive(initialData.isActive);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const payload: any = {
      name,
      icon: icon || null,
      color: color || null,
    };

    if (isAdmin) {
      payload.visibility = visibility;
      if (initialData) {
        payload.isActive = isActive;
      }
    }

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-sm font-medium text-gray-700">Category Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#52B788]"
          placeholder="e.g. Food & Dining"
          required
        />
      </div>

      <div className="flex gap-4">
        <div className="flex flex-col gap-2 w-1/3">
          <label htmlFor="icon" className="text-sm font-medium text-gray-700">Icon (Emoji)</label>
          <input
            id="icon"
            type="text"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#52B788]"
            placeholder="🍔"
          />
        </div>

        <div className="flex flex-col gap-2 w-2/3">
          <label htmlFor="color" className="text-sm font-medium text-gray-700">Color (Hex)</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-9 w-9 rounded border border-gray-300 cursor-pointer"
            />
            <input
              id="color"
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#52B788] flex-1"
              placeholder="#52B788"
            />
          </div>
        </div>
      </div>

      {isAdmin && (
        <>
          <div className="flex flex-col gap-2">
            <label htmlFor="visibility" className="text-sm font-medium text-gray-700">Visibility</label>
            <select
              id="visibility"
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as CategoryVisibility)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#52B788] bg-white"
            >
              <option value="ALL">All (Everyone)</option>
              <option value="USER_ONLY">Users Only</option>
              <option value="ADMIN_ONLY">Admins Only</option>
            </select>
          </div>

          {initialData && (
            <div className="flex items-center gap-2 mt-2">
              <input
                id="isActive"
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded border-gray-300 text-[#52B788] focus:ring-[#52B788]"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active</label>
            </div>
          )}
        </>
      )}

      <div className="flex justify-end gap-2 mt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-[#2D6A4F] text-[#F5F5F0] rounded-md px-4 py-2 font-medium hover:bg-[#1f4a37] transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : initialData ? 'Update Category' : 'Create Category'}
        </button>
      </div>
    </form>
  );
};

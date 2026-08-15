import React, { useState } from 'react';
import { useCategories } from '../../domains/categories/hooks/useCategories';
import { useCreateCategory, useUpdateCategory, useDeleteCategory } from '../../domains/categories/hooks/useCategoryMutations';
import { CategoryForm } from '../../domains/categories/components/CategoryForm';
import { CategoryBadge } from '../../domains/categories/components/CategoryBadge';
import type { Category } from '../../domains/categories/types';

export const MiscPage = () => {
  const { data: categories, isLoading, error } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleSubmit = (data: any) => {
    if (editingCategory) {
      updateCategory.mutate(
        { id: editingCategory.id, payload: data },
        {
          onSuccess: () => setIsModalOpen(false),
        }
      );
    } else {
      createCategory.mutate(data, {
        onSuccess: () => setIsModalOpen(false),
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this category? Transactions may be affected.')) {
      deleteCategory.mutate(id);
    }
  };

  if (isLoading) return <div className="p-8 text-[#52B788] animate-pulse">Loading settings...</div>;
  if (error) return <div className="p-8 text-red-500">Error loading settings.</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center bg-[#2D6A4F] p-6 rounded-2xl shadow-lg text-[#F5F5F0]">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Misc Settings</h1>
          <p className="text-sm opacity-80 mt-1">Manage categories and other global settings.</p>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Categories</h2>
          <button
            onClick={handleOpenCreate}
            className="bg-[#52B788] hover:bg-[#40916c] transition-colors text-white px-4 py-2 rounded-xl font-medium shadow-sm active:scale-95 text-sm"
          >
            + Add Category
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50/50 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Visibility</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories?.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <CategoryBadge category={category} />
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-600 text-xs font-medium bg-gray-100 px-2 py-1 rounded-md">
                      {category.visibility}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${category.isActive ? 'text-[#52B788]' : 'text-red-500'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${category.isActive ? 'bg-[#52B788]' : 'bg-red-500'}`}></span>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(category)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors tooltip"
                        title="Edit Category"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        disabled={deleteCategory.isPending}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30"
                        title="Delete Category"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories?.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-6">
              <CategoryForm
                initialData={editingCategory || undefined}
                onSubmit={handleSubmit}
                isLoading={createCategory.isPending || updateCategory.isPending}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

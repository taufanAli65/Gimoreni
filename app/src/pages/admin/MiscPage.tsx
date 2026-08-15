import { useState } from 'react';
import { useCategories } from '../../domains/categories/hooks/useCategories';
import { useCreateCategory, useUpdateCategory, useDeleteCategory } from '../../domains/categories/hooks/useCategoryMutations';
import { CategoryForm } from '../../domains/categories/components/CategoryForm';
import { CategoryBadge } from '../../domains/categories/components/CategoryBadge';
import type { Category } from '../../domains/categories/types';
import { useBonuses } from '../../domains/bonuses/hooks/useBonuses';
import { BonusForm } from '../../domains/bonuses/components/BonusForm';
import { BonusCard } from '../../domains/bonuses/components/BonusCard';
import { PageHeader } from '../../shared/components/PageHeader';
import { DataTable } from '../../shared/components/DataTable';
import { StatusBadge } from '../../shared/components/StatusBadge';
import { ConfirmDialog } from '../../shared/components/ConfirmDialog';
import { Edit2, Trash2 } from 'lucide-react';

export const MiscPage = () => {
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: bonuses, isLoading: bonusesLoading } = useBonuses();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);

  const handleOpenCreateCategory = () => {
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleCategorySubmit = (data: any) => {
    if (editingCategory) {
      updateCategory.mutate(
        { id: editingCategory.id, payload: data },
        {
          onSuccess: () => setIsCategoryModalOpen(false),
        }
      );
    } else {
      createCategory.mutate(data, {
        onSuccess: () => setIsCategoryModalOpen(false),
      });
    }
  };

  const categoryColumns = [
    {
      key: 'category',
      header: 'Category',
      render: (item: any) => <CategoryBadge category={item} />,
    },
    {
      key: 'visibility',
      header: 'Visibility',
      render: (item: any) => (
        <span className="text-gray-600 text-xs font-medium bg-gray-100 px-2 py-1 rounded-md">
          {item.visibility}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: any) => (
        <StatusBadge variant={item.isActive ? 'active' : 'inactive'}>
          {item.isActive ? 'Active' : 'Inactive'}
        </StatusBadge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: any) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenEditCategory(item)}
            className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
            title="Edit Category"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => setDeleteCategoryId(item.id)}
            disabled={deleteCategory.isPending}
            className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors disabled:opacity-30"
            title="Delete Category"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-12 pb-12">
      <PageHeader 
        title="Misc Settings" 
        subtitle="Manage categories, bonuses, and global app settings." 
      />

      {/* Bonus Management */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">Bonus Management</h2>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-1">
            <BonusForm />
          </div>
          <div className="xl:col-span-2 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Bonuses</h3>
            {bonusesLoading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2].map(i => <div key={i} className="h-24 bg-gray-100 rounded-lg"></div>)}
              </div>
            ) : (
              <div className="space-y-4">
                {bonuses?.length === 0 && (
                  <div className="p-8 text-center text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm">
                    No bonuses issued yet.
                  </div>
                )}
                {bonuses?.map(bonus => (
                  <BonusCard key={bonus.id} bonus={bonus} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Category Management */}
      <section className="space-y-6">
        <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-4">
          <h2 className="text-xl font-bold text-gray-900">Category Management</h2>
          <button
            onClick={handleOpenCreateCategory}
            className="px-4 py-2 bg-forest text-white text-sm rounded-md font-medium hover:bg-forest/90 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-forest"
          >
            + Add Category
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {categoriesLoading ? (
            <div className="p-8 text-center text-gray-500 animate-pulse">Loading categories...</div>
          ) : (
            <DataTable 
              data={categories || []} 
              columns={categoryColumns} 
              keyExtractor={(item) => item.id}
              emptyMessage="No categories found."
            />
          )}
        </div>
      </section>

      {/* App Settings Placeholder */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">App Settings</h2>
        </div>
        <div className="bg-gray-50 border border-gray-200 border-dashed rounded-lg p-8 text-center text-gray-500">
          <p>Global application settings are reserved for future use.</p>
        </div>
      </section>

      {/* Category Edit Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h3>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-6">
              <CategoryForm
                initialData={editingCategory || undefined}
                onSubmit={handleCategorySubmit}
                isLoading={createCategory.isPending || updateCategory.isPending}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Category Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteCategoryId}
        onClose={() => setDeleteCategoryId(null)}
        onConfirm={() => {
          if (deleteCategoryId) deleteCategory.mutate(deleteCategoryId);
        }}
        title="Delete Category"
        description="Are you sure you want to delete this category? Transactions may be affected."
        isDanger={true}
        confirmText="Delete Category"
      />
    </div>
  );
};

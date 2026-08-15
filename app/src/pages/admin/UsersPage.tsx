import { useState } from 'react';
import { useGetUsers, useCreateUser, useDeleteUser, useUpdateBalance, useUpdateUser } from '../../domains/users/hooks/useUsers';
import type { CreateUserPayload, UpdateUserPayload } from '../../domains/users/types';
import { PageHeader } from '../../shared/components/PageHeader';
import { DataTable } from '../../shared/components/DataTable';
import { StatusBadge } from '../../shared/components/StatusBadge';
import { UserAvatar } from '../../shared/components/UserAvatar';
import { ConfirmDialog } from '../../shared/components/ConfirmDialog';
import { Edit2, Trash2, DollarSign } from 'lucide-react';

export const UsersPage = () => {
  const [page] = useState(1);
  const { data, isLoading } = useGetUsers(page, 100);
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const updateBalance = useUpdateBalance();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  const [createForm, setCreateForm] = useState<CreateUserPayload>({
    email: '',
    name: '',
    password: '',
    role: 'USER',
    allowance: 0,
    balance: 0,
  });

  const [editForm, setEditForm] = useState<UpdateUserPayload>({});

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createUser.mutate(createForm, {
      onSuccess: () => {
        setIsCreateModalOpen(false);
        setCreateForm({ email: '', name: '', password: '', role: 'USER', allowance: 0, balance: 0 });
      },
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editUserId) {
      updateUser.mutate({ id: editUserId, payload: editForm }, {
        onSuccess: () => {
          setIsEditModalOpen(false);
          setEditUserId(null);
        }
      });
    }
  };

  const openEditModal = (user: any) => {
    setEditUserId(user.id);
    setEditForm({ name: user.name, role: user.role, allowance: user.allowance });
    setIsEditModalOpen(true);
  };

  const handleAddBalance = (id: string) => {
    const amountStr = prompt('Enter amount to add to balance:');
    if (amountStr) {
      const amount = Number(amountStr);
      if (!isNaN(amount) && amount > 0) {
        updateBalance.mutate({ id, payload: { amount, field: 'balance', action: 'add' } });
      } else {
        alert('Please enter a valid positive number');
      }
    }
  };

  const users = data?.data || [];

  const columns = [
    {
      key: 'user',
      header: 'User',
      render: (item: any) => (
        <div className="flex items-center gap-3">
          <UserAvatar name={item.name} avatarUrl={item.avatarUrl} size="sm" />
          <div>
            <div className="font-semibold text-gray-900">{item.name}</div>
            <div className="text-xs text-gray-500">{item.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (item: any) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.role === 'ADMIN' ? 'bg-forest/10 text-forest' : 'bg-gray-100 text-gray-800'}`}>
          {item.role}
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
      key: 'balance',
      header: 'Balance',
      render: (item: any) => <span className="font-medium text-gray-900">${Number(item.balance).toFixed(2)}</span>,
    },
    {
      key: 'allowance',
      header: 'Allowance',
      render: (item: any) => <span className="text-gray-600">${Number(item.allowance).toFixed(2)}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: any) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleAddBalance(item.id)}
            className="p-1.5 text-moss-green hover:bg-moss-green/10 rounded-md transition-colors"
            title="Adjust Balance"
          >
            <DollarSign size={16} />
          </button>
          <button
            onClick={() => openEditModal(item)}
            className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
            title="Edit User"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => setDeleteUserId(item.id)}
            disabled={!item.isActive}
            className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors disabled:opacity-30"
            title="Disable User"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader 
        title="User Management" 
        subtitle="Manage platform users, roles, and balances."
        actions={
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-forest text-white rounded-md font-medium hover:bg-forest/90 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-forest"
          >
            + Add New User
          </button>
        }
      />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500 animate-pulse">Loading users...</div>
        ) : (
          <DataTable data={users} columns={columns} keyExtractor={(item: any) => item.id} />
        )}
      </div>

      {/* Create User Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Add New User</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  required
                  type="text"
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-forest focus:border-forest outline-none transition-all"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  required
                  type="email"
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-forest focus:border-forest outline-none transition-all"
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  required
                  type="password"
                  minLength={6}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-forest focus:border-forest outline-none transition-all"
                  value={createForm.password}
                  onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-forest focus:border-forest outline-none transition-all bg-white"
                  value={createForm.role}
                  onChange={(e) => setCreateForm({ ...createForm, role: e.target.value as any })}
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createUser.isPending}
                  className="px-4 py-2 text-sm font-medium text-white bg-forest rounded-md hover:bg-forest/90 focus:outline-none disabled:opacity-50"
                >
                  {createUser.isPending ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Edit User</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-forest focus:border-forest outline-none transition-all"
                  value={editForm.name || ''}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Allowance</label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-forest focus:border-forest outline-none transition-all"
                  value={editForm.allowance || 0}
                  onChange={(e) => setEditForm({ ...editForm, allowance: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-forest focus:border-forest outline-none transition-all bg-white"
                  value={editForm.role || 'USER'}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value as any })}
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateUser.isPending}
                  className="px-4 py-2 text-sm font-medium text-white bg-forest rounded-md hover:bg-forest/90 focus:outline-none disabled:opacity-50"
                >
                  {updateUser.isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteUserId}
        onClose={() => setDeleteUserId(null)}
        onConfirm={() => {
          if (deleteUserId) deleteUser.mutate(deleteUserId);
        }}
        title="Disable User"
        description="Are you sure you want to disable this user? They will not be able to log in."
        isDanger={true}
        confirmText="Disable User"
      />
    </div>
  );
};

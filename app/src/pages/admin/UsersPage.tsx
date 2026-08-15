import { useState } from 'react';
import { useGetUsers, useCreateUser, useDeleteUser, useUpdateBalance } from '../../domains/users/hooks/useUsers';
import type { CreateUserPayload } from '../../domains/users/types';

export const UsersPage = () => {
  const [page] = useState(1);
  const { data, isLoading, error } = useGetUsers(page, 20);
  const createUser = useCreateUser();
  const deleteUser = useDeleteUser();
  const updateBalance = useUpdateBalance();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState<CreateUserPayload>({
    email: '',
    name: '',
    password: '',
    role: 'USER',
    allowance: 0,
    balance: 0,
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createUser.mutate(createForm, {
      onSuccess: () => {
        setIsCreateModalOpen(false);
        setCreateForm({ email: '', name: '', password: '', role: 'USER', allowance: 0, balance: 0 });
      },
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to disable this user?')) {
      deleteUser.mutate(id);
    }
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

  if (isLoading) return <div className="p-8 text-[#52B788] animate-pulse">Loading users...</div>;
  if (error) return <div className="p-8 text-red-500">Error loading users.</div>;

  const users = data?.data || [];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center bg-[#2D6A4F] p-6 rounded-2xl shadow-lg text-[#F5F5F0]">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-sm opacity-80 mt-1">Manage platform users, roles, and balances.</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-[#52B788] hover:bg-[#40916c] transition-colors text-white px-6 py-2.5 rounded-xl font-medium shadow-sm active:scale-95"
        >
          + Add New User
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50/50 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Balance</th>
                <th className="px-6 py-4">Allowance</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user: any) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#D9BF9E]/30 text-[#6B4226] flex items-center justify-center font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${user.role === 'ADMIN' ? 'bg-[#2D6A4F]/10 text-[#2D6A4F]' : 'bg-blue-50 text-blue-600'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${user.isActive ? 'text-[#52B788]' : 'text-red-500'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-[#52B788]' : 'bg-red-500'}`}></span>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    Rp {Number(user.balance).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    Rp {Number(user.allowance).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleAddBalance(user.id)}
                        className="p-2 text-[#52B788] hover:bg-[#52B788]/10 rounded-lg transition-colors tooltip"
                        title="Add Balance"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        disabled={!user.isActive}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30"
                        title="Disable User"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
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
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#52B788] focus:border-transparent outline-none transition-all"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  required
                  type="email"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#52B788] focus:border-transparent outline-none transition-all"
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
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#52B788] focus:border-transparent outline-none transition-all"
                  value={createForm.password}
                  onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#52B788] focus:border-transparent outline-none transition-all bg-white"
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
                  className="px-5 py-2 text-gray-600 font-medium hover:bg-gray-50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createUser.isPending}
                  className="px-5 py-2 bg-[#2D6A4F] hover:bg-[#1b4332] text-white font-medium rounded-xl transition-colors disabled:opacity-50"
                >
                  {createUser.isPending ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

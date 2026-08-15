import React, { useState } from 'react';
import { useCategories } from '../../categories/hooks/useCategories';
import { useTransactionMutations } from '../hooks/useTransactionMutations';
import { ReceiptUpload } from './ReceiptUpload';
import { toast } from 'sonner';

export const TransactionForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { data: categories = [], isLoading: loadingCategories } = useCategories();
  const { createMutation } = useTransactionMutations();

  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryId) {
      toast.error('Please select a category');
      return;
    }

    if (!amount || Number(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    createMutation.mutate(
      {
        categoryId,
        type,
        amount: Number(amount),
        description,
        date: new Date(date).toISOString(), // send as ISO string
        receiptUrl,
      },
      {
        onSuccess: () => {
          toast.success('Transaction logged successfully!');
          // Reset form
          setAmount('');
          setDescription('');
          setReceiptUrl(null);
          // category and type stay same usually for quick multiple additions
          if (onSuccess) onSuccess();
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.error?.message || 'Failed to log transaction');
        }
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex rounded-md shadow-sm" role="group">
        <button
          type="button"
          onClick={() => setType('EXPENSE')}
          className={`px-4 py-2 text-sm font-medium border rounded-l-lg flex-1 ${type === 'EXPENSE'
              ? 'bg-[#2D6A4F] text-white border-[#2D6A4F]'
              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
        >
          Expense
        </button>
        <button
          type="button"
          onClick={() => setType('INCOME')}
          className={`px-4 py-2 text-sm font-medium border-t border-b border-r rounded-r-lg flex-1 ${type === 'INCOME'
              ? 'bg-[#2D6A4F] text-white border-[#2D6A4F]'
              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
        >
          Income
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">Rp</span>
          </div>
          <input
            type="number"
            required
            min="0"
            step="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="pl-10 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#52B788] focus:border-transparent"
            placeholder="0"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select
          required
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#52B788]"
          disabled={loadingCategories}
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.icon && `${cat.icon} `}{cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
        <input
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#52B788]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What was this for?"
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#52B788]"
        />
      </div>

      <ReceiptUpload onUploadSuccess={(url) => setReceiptUrl(url)} />

      <button
        type="submit"
        disabled={createMutation.isPending}
        className="w-full mt-4 bg-[#2D6A4F] text-white py-2 px-4 rounded hover:bg-[#1b4332] transition-colors disabled:opacity-50"
      >
        {createMutation.isPending ? 'Saving...' : 'Save Transaction'}
      </button>
    </form>
  );
};

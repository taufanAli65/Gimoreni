import { useQueryClient } from '@tanstack/react-query';
import { TransactionForm } from '../../domains/transactions/components/TransactionForm';
import { TransactionList } from '../../domains/transactions/components/TransactionList';
import { PlusCircle } from 'lucide-react';

export const AddPage = () => {
  const queryClient = useQueryClient();

  const handleSuccess = () => {
    // Invalidate today's transactions to show new entry immediately
    queryClient.invalidateQueries({ queryKey: ['transactions'] });
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="px-4 pt-4 pb-4 space-y-5">
      {/* Page title */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-[#2D6A4F] rounded-full flex items-center justify-center">
          <PlusCircle className="w-4 h-4 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-[#2D6A4F]">Add Transaction</h1>
          <p className="text-xs text-gray-400">{today}</p>
        </div>
      </div>

      {/* Transaction form */}
      <TransactionForm onSuccess={handleSuccess} />

      {/* Today's transactions */}
      <div>
        <h2 className="text-sm font-bold text-gray-700 mb-3">Today's Transactions</h2>
        <TransactionList
          filters={{
            startDate: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
            endDate: new Date(new Date().setHours(23, 59, 59, 999)).toISOString(),
            limit: 20,
          }}
        />
      </div>
    </div>
  );
};

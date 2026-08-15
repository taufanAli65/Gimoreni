import { useTransactions, type UseTransactionsParams } from '../hooks/useTransactions';
import { TransactionItem } from './TransactionItem';

export const TransactionList = ({ filters }: { filters?: UseTransactionsParams }) => {
  const { data, isLoading, error } = useTransactions(filters);

  if (isLoading) {
    return <div className="text-center py-4 text-gray-500">Loading transactions...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Failed to load transactions.</div>;
  }

  const transactions = data?.transactions || [];

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
        <p className="text-gray-500">No transactions found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {transactions.map(tx => (
        <TransactionItem key={tx.id} transaction={tx} />
      ))}
    </div>
  );
};

import { TransactionForm } from '../../domains/transactions/components/TransactionForm';
import { TransactionList } from '../../domains/transactions/components/TransactionList';

export const AddPage = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Add Transaction</h1>
        <p className="text-sm text-gray-500">Log a new income or expense</p>
      </div>
      
      <TransactionForm />

      <div className="pt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h2>
        <TransactionList filters={{ limit: 5 }} />
      </div>
    </div>
  );
};

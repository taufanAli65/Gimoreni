import type { Transaction } from '../types';

export const TransactionItem = ({ transaction }: { transaction: Transaction }) => {
  const isIncome = transaction.type === 'INCOME';
  const amountStr = Number(transaction.amount).toLocaleString('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  });

  const dateStr = new Date(transaction.date).toLocaleDateString('id-ID', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-100 mb-2 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <div 
          className="w-10 h-10 flex items-center justify-center rounded-full text-lg"
          style={{ backgroundColor: transaction.category.color ? `${transaction.category.color}20` : '#f3f4f6' }}
        >
          {transaction.category.icon || '💸'}
        </div>
        
        <div>
          <h4 className="text-sm font-semibold text-gray-800">
            {transaction.category.name}
          </h4>
          <p className="text-xs text-gray-500">
            {dateStr} {transaction.description ? `• ${transaction.description}` : ''}
          </p>
        </div>
      </div>
      
      <div className={`font-semibold ${isIncome ? 'text-[#52B788]' : 'text-gray-800'}`}>
        {isIncome ? '+' : '-'}{amountStr}
      </div>
    </div>
  );
};

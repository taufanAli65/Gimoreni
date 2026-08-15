import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTransactions } from '../../domains/transactions/hooks/useTransactions';

const COLORS = [
  '#2D6A4F', '#52B788', '#6B4226', '#D9BF9E', '#74C69D',
  '#40916C', '#95D5B2', '#B7E4C7', '#1B4332', '#D8F3DC',
];

const formatIDR = (value: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);

export const ExpenseChart = () => {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();

  const { data, isLoading } = useTransactions({ type: 'EXPENSE', startDate, endDate, limit: 200 });

  const chartData = useMemo(() => {
    if (!data?.transactions) return [];
    const grouped: Record<string, number> = {};
    for (const tx of data.transactions) {
      const key = tx.category.name;
      grouped[key] = (grouped[key] || 0) + Number(tx.amount);
    }
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40 text-sm text-gray-400 animate-pulse">
        Loading chart...
      </div>
    );
  }

  if (!chartData.length) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-center">
        <span className="text-3xl mb-2">📊</span>
        <p className="text-sm text-gray-500">No expenses recorded this month yet.</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="45%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={3}
          dataKey="value"
        >
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => [formatIDR(value), 'Amount']}
          contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

import { useMemo } from 'react';
import { PageHeader } from '../../shared/components/PageHeader';
import { StatCard } from '../../shared/components/StatCard';
import { DataTable } from '../../shared/components/DataTable';
import { StatusBadge } from '../../shared/components/StatusBadge';
import { UserAvatar } from '../../shared/components/UserAvatar';
import { useGetUsers } from '../../domains/users/hooks/useUsers';
import { useTransactionSummary } from '../../domains/transactions/hooks/useTransactionSummary';
import { useTransactions } from '../../domains/transactions/hooks/useTransactions';
import { useRedemptions } from '../../domains/quests/hooks/useRedemptions';
import { startOfMonth, endOfMonth, format } from 'date-fns';
import { Users, CreditCard, Gift } from 'lucide-react';

export const DashboardPage = () => {
  const now = new Date();
  
  // Queries
  const { data: usersData, isLoading: loadingUsers } = useGetUsers(1, 100);
  const { data: summaryData, isLoading: loadingSummary } = useTransactionSummary();
  const { data: transactionsData, isLoading: loadingTransactions } = useTransactions({
    startDate: startOfMonth(now).toISOString(),
    endDate: endOfMonth(now).toISOString(),
    limit: 1, // We only need meta.total
  });
  const { data: redemptionsData, isLoading: loadingRedemptions } = useRedemptions({
    status: 'PENDING',
    limit: 1, // We only need meta.total
  });

  const isLoading = loadingUsers || loadingSummary || loadingTransactions || loadingRedemptions;

  // Merge users with their transaction summaries
  const mergedData = useMemo(() => {
    if (!usersData?.data || !summaryData) return [];
    
    return usersData.data.map((user: any) => {
      const summary = summaryData.find((s) => s.userId === user.id) || {
        totalIncome: 0,
        totalExpense: 0,
        missedDays: 0,
      };
      
      return {
        ...user,
        thisMonthIncome: summary.totalIncome,
        thisMonthExpense: summary.totalExpense,
        missedDays: summary.missedDays,
      };
    });
  }, [usersData, summaryData]);

  const columns = [
    {
      key: 'name',
      header: 'User',
      render: (item: any) => (
        <div className="flex items-center gap-3">
          <UserAvatar name={item.name} avatarUrl={item.avatarUrl} size="sm" />
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">{item.name}</span>
            <span className="text-xs text-gray-500">{item.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'thisMonthIncome',
      header: 'Income (This Month)',
      render: (item: any) => (
        <span className="text-moss-green font-medium">+${Number(item.thisMonthIncome).toFixed(2)}</span>
      ),
    },
    {
      key: 'thisMonthExpense',
      header: 'Expense (This Month)',
      render: (item: any) => (
        <span className="text-deep-brown font-medium">-${Number(item.thisMonthExpense).toFixed(2)}</span>
      ),
    },
    {
      key: 'balance',
      header: 'Current Balance',
      render: (item: any) => <span className="font-semibold">${Number(item.balance).toFixed(2)}</span>,
    },
    {
      key: 'allowance',
      header: 'Monthly Allowance',
      render: (item: any) => <span>${Number(item.allowance).toFixed(2)}</span>,
    },
    {
      key: 'missedDays',
      header: 'Missed Days',
      render: (item: any) => {
        if (item.missedDays > 0) {
          return <StatusBadge variant="rejected">{item.missedDays} Days</StatusBadge>;
        }
        return <span className="text-gray-500">0</span>;
      },
    },
  ];

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading dashboard data...</div>;
  }

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Dashboard" 
        subtitle={`Overview for ${format(now, 'MMMM yyyy')}`} 
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Users"
          value={usersData?.meta?.total || 0}
          icon={<Users size={24} />}
        />
        <StatCard
          title="Transactions This Month"
          value={transactionsData?.meta?.total || 0}
          icon={<CreditCard size={24} />}
        />
        <StatCard
          title="Pending Redemptions"
          value={redemptionsData?.meta?.total || 0}
          icon={<Gift size={24} />}
          description={(redemptionsData?.meta?.total || 0) > 0 ? 'Requires attention' : 'All caught up!'}
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">User Summary</h2>
          <p className="text-sm text-gray-500 mt-1">Financial snapshot for the current month.</p>
        </div>
        <div className="p-0">
          <DataTable 
            data={mergedData} 
            columns={columns} 
            keyExtractor={(item: any) => item.id} 
          />
        </div>
      </div>
    </div>
  );
};

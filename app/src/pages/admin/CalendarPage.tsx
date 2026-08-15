import { useState } from 'react';
import { PageHeader } from '../../shared/components/PageHeader';
import { useGetUsers } from '../../domains/users/hooks/useUsers';
import { useTransactionCalendar } from '../../domains/transactions/hooks/useTransactionCalendar';
import { useTransactions } from '../../domains/transactions/hooks/useTransactions';
import { startOfMonth, endOfMonth, getDaysInMonth, format, getDay, addDays } from 'date-fns';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  const { data: usersData } = useGetUsers(1, 100);
  const { data: calendarDates } = useTransactionCalendar(
    selectedUserId || undefined,
    month,
    year
  );

  const { data: dayTransactionsData, isLoading: loadingDayTransactions } = useTransactions({
    userId: selectedUserId || undefined,
    startDate: selectedDay ? selectedDay.toISOString() : undefined,
    endDate: selectedDay ? selectedDay.toISOString() : undefined,
  });

  const nextMonth = () => setCurrentDate(addDays(endOfMonth(currentDate), 1));
  const prevMonth = () => setCurrentDate(addDays(startOfMonth(currentDate), -1));

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getDay(startOfMonth(currentDate));

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    return new Date(year, month - 1, day);
  });

  const paddingDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  return (
    <div className="space-y-8 pb-12 relative">
      <PageHeader
        title="Transaction Calendar"
        subtitle="View logged transactions by day."
        actions={
          <div className="flex items-center gap-4">
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-forest focus:border-forest block w-full p-2.5"
            >
              <option value="">All Users</option>
              {usersData?.data.map((user: any) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
        }
      />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Calendar Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={prevMonth}
              className="p-2 rounded-md hover:bg-gray-100 text-gray-600 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 rounded-md hover:bg-gray-100 text-gray-600 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 auto-rows-[120px] bg-gray-200 gap-[1px]">
          {paddingDays.map((_, index) => (
            <div key={`padding-${index}`} className="bg-gray-50/50" />
          ))}

          {daysArray.map((date) => {
            const dateStr = format(date, 'yyyy-MM-dd');
            const isActive = calendarDates?.includes(dateStr);
            const isToday = format(new Date(), 'yyyy-MM-dd') === dateStr;

            return (
              <div
                key={dateStr}
                onClick={() => setSelectedDay(date)}
                className={`bg-white p-2 relative hover:bg-gray-50 cursor-pointer transition-colors flex flex-col items-center justify-center`}
              >
                <span className={`text-sm font-medium w-8 h-8 flex items-center justify-center rounded-full ${isToday ? 'bg-forest text-white' : 'text-gray-700'}`}>
                  {format(date, 'd')}
                </span>
                {isActive && (
                  <div className="mt-2 w-3 h-3 rounded-full bg-moss-green shadow-sm" title="Transactions exist" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Transaction Slide-in Panel / Modal */}
      {selectedDay && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/20" onClick={() => setSelectedDay(null)}>
          <div 
            className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform animate-in slide-in-from-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                {format(selectedDay, 'MMMM d, yyyy')}
              </h3>
              <button 
                onClick={() => setSelectedDay(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {loadingDayTransactions ? (
                <div className="text-center text-gray-500 py-8">Loading transactions...</div>
              ) : dayTransactionsData?.transactions.length === 0 ? (
                <div className="text-center text-gray-500 py-8">No transactions logged for this day.</div>
              ) : (
                dayTransactionsData?.transactions.map((tx: any) => (
                  <div key={tx.id} className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{tx.category.name}</p>
                      <p className="text-sm text-gray-500">{tx.description || 'No description'}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${tx.type === 'INCOME' ? 'text-moss-green' : 'text-deep-brown'}`}>
                        {tx.type === 'INCOME' ? '+' : '-'}${Number(tx.amount).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

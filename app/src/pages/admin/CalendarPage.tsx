import { useState } from 'react';
import { useTransactionSummary } from '../../domains/transactions/hooks/useTransactionSummary';
import { useTransactionCalendar } from '../../domains/transactions/hooks/useTransactionCalendar';

export const CalendarPage = () => {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(undefined);

  const { data: summaryData, isLoading: loadingSummary } = useTransactionSummary(month, year);
  const { data: calendarDates, isLoading: loadingCalendar } = useTransactionCalendar(selectedUserId, month, year);

  const daysInMonth = new Date(year, month, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    // Format YYYY-MM-DD
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Transaction Dashboard</h1>
          <p className="text-sm text-gray-500">Monitor user activity and financial summaries</p>
        </div>
        
        <div className="flex gap-4">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="rounded-md border border-gray-300 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#52B788]"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
          <input 
            type="number" 
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-24 rounded-md border border-gray-300 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#52B788]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-1 lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">User Monthly Summary</h2>
          {loadingSummary ? (
            <div className="text-center py-4 text-gray-500">Loading summary...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-2 font-medium text-gray-600">User</th>
                    <th className="py-2 font-medium text-gray-600">Income</th>
                    <th className="py-2 font-medium text-gray-600">Expense</th>
                    <th className="py-2 font-medium text-gray-600">Missed Days</th>
                    <th className="py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {summaryData?.map(row => (
                    <tr key={row.userId} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 text-sm font-medium">{row.userName}</td>
                      <td className="py-3 text-sm text-[#52B788]">
                        Rp {row.totalIncome.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 text-sm text-red-500">
                        Rp {row.totalExpense.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 text-sm">{row.missedDays}</td>
                      <td className="py-3 text-sm text-right">
                        <button 
                          onClick={() => setSelectedUserId(row.userId)}
                          className={`text-xs px-2 py-1 rounded ${
                            selectedUserId === row.userId 
                              ? 'bg-[#2D6A4F] text-white' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          View Calendar
                        </button>
                      </td>
                    </tr>
                  ))}
                  {summaryData?.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-gray-500">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="col-span-1 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Activity Calendar</h2>
            {selectedUserId && (
              <button 
                onClick={() => setSelectedUserId(undefined)}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Clear filter
              </button>
            )}
          </div>
          
          <div className="text-xs text-gray-500 mb-4">
            {selectedUserId ? 'Showing activity for selected user.' : 'Showing all users activity.'}
          </div>

          {loadingCalendar ? (
            <div className="text-center py-4 text-gray-500">Loading calendar...</div>
          ) : (
            <div className="grid grid-cols-7 gap-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <div key={i} className="text-center text-xs font-medium text-gray-500 pb-2">
                  {d}
                </div>
              ))}
              
              {/* Padding for first day of month */}
              {Array.from({ length: new Date(year, month - 1, 1).getDay() }).map((_, i) => (
                <div key={`empty-${i}`} className="h-8"></div>
              ))}
              
              {daysArray.map((dateStr) => {
                const day = parseInt(dateStr.split('-')[2]);
                const isActive = calendarDates?.includes(dateStr);
                
                return (
                  <div 
                    key={dateStr}
                    title={dateStr}
                    className={`h-8 flex items-center justify-center rounded-sm text-xs cursor-default
                      ${isActive 
                        ? 'bg-[#52B788] text-white font-semibold' 
                        : 'bg-gray-50 text-gray-400 border border-gray-100'
                      }
                    `}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          )}
          
          <div className="mt-6 flex items-center gap-2 text-xs text-gray-600">
            <div className="w-3 h-3 bg-[#52B788] rounded-sm"></div> Logged
            <div className="w-3 h-3 bg-gray-50 border border-gray-200 rounded-sm ml-3"></div> Missed
          </div>
        </div>
      </div>
    </div>
  );
};

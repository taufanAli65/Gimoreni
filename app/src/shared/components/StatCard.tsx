import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
}

export const StatCard = ({ title, value, icon, description }: StatCardProps) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 flex items-center">
      <div className="bg-off-white p-3 rounded-full mr-4 text-forest">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
      </div>
    </div>
  );
};

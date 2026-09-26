import React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  iconName: string;
  colorType: 'blue' | 'emerald' | 'amber';
  description?: string;
}

export function StatCard({ title, value, iconName, colorType, description }: StatCardProps) {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-700">{title}</h3>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorMap[colorType]}`}>
            <span className="material-symbols-outlined text-xl">{iconName}</span>
          </div>
        </div>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
      {description && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <span className="text-sm text-gray-500">{description}</span>
        </div>
      )}
    </div>
  );
}

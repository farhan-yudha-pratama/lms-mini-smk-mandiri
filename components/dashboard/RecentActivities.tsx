import React from 'react';
import { ActivityLog } from '@/modules/dashboard/dashboard.service';

interface RecentActivitiesProps {
  activities: ActivityLog[];
}

export function RecentActivities({ activities }: RecentActivitiesProps) {
  if (!activities || activities.length === 0) {
    return (
      <div className="mt-8 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
          <h3 className="font-semibold text-gray-800">Aktivitas Terbaru</h3>
        </div>
        <div className="p-6 text-center text-gray-500 py-12">
          <span className="material-symbols-outlined text-4xl mb-3 text-gray-300">inbox</span>
          <p>Belum ada data aktivitas untuk ditampilkan.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
        <h3 className="font-semibold text-gray-800">Aktivitas Terbaru</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {activities.map((activity) => (
          <div key={activity.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 hover:bg-gray-50/50 transition-colors">
            <div>
              <p className="text-gray-800 font-medium text-sm">
                {activity.userName}
              </p>
              <p className="text-gray-600 text-sm">
                {activity.action}
              </p>
            </div>
            <div className="text-gray-500 text-xs flex items-center gap-1 sm:self-start">
              <span className="material-symbols-outlined text-[14px]">schedule</span>
              {new Date(activity.createdAt).toLocaleString('id-ID', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

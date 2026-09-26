import React from 'react';
import { getDashboardStats, getRecentActivities } from '@/modules/dashboard/dashboard.service';
import { StatCard } from './StatCard';
import { RecentActivities } from './RecentActivities';

export async function DashboardContent({ userId, role, classId }: { userId: string, role: string, classId?: string | null }) {
  const [stats, activities] = await Promise.all([
    getDashboardStats(userId, role, classId),
    getRecentActivities(userId, role, classId),
  ]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Total Pengguna" 
          value={stats.totalUsers} 
          iconName="group" 
          colorType="blue" 
          description={role === 'SUPERADMIN' ? 'Seluruh pengguna terdaftar' : 'Murid di kelas Anda'} 
        />
        <StatCard 
          title="Total Materi" 
          value={stats.totalMaterials} 
          iconName="library_books" 
          colorType="emerald" 
          description="Total halaman materi tersedia" 
        />
        <StatCard 
          title="Aktivitas Hari Ini" 
          value={stats.todayActivities} 
          iconName="trending_up" 
          colorType="amber" 
          description="Log aktivitas terekam hari ini" 
        />
      </div>

      <RecentActivities activities={activities} />
    </>
  );
}

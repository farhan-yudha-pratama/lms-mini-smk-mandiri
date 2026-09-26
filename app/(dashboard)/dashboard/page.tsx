import { getSession } from '@/lib/session';
import { Suspense } from 'react';
import { DashboardContent } from '@/components/dashboard/DashboardContent';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';

export default async function DashboardPage() {
  const session = await getSession();
  const isSuperAdmin = session?.role === 'SUPERADMIN';
  const role = session?.role || 'MURID';
  const userId = session?.userId || '';
  const classId = session?.classId;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Overview
        </h1>
        <p className="text-gray-500 mt-1">
          {isSuperAdmin 
            ? 'Selamat datang di panel kontrol utama Superadmin.'
            : 'Selamat datang di dashboard pengajar.'}
        </p>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent userId={userId} role={role} classId={classId} />
      </Suspense>
    </div>
  );
}

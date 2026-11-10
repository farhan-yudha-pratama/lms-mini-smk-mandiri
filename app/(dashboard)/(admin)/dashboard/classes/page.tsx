import { getAllClasses } from '@/modules/class/class.service';
import ClassListClient from './ClassListClient';
import { getSession } from '@/lib/session';
import { hasPermission } from '@/lib/permissions';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ClassesPage() {
  const session = await getSession();
  if (!session || !hasPermission(session, 'CLASSES_MANAGE')) {
    redirect('/dashboard');
  }

  const classes = await getAllClasses();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Kelas</h1>
        <p className="text-sm text-gray-500 mt-1">Kelola rombongan belajar, pantau kuota (maks 32 murid), dan atur kode bergabung.</p>
      </div>

      <ClassListClient initialClasses={classes} />
    </div>
  );
}

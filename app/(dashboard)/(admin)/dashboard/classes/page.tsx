import { getAllClasses } from '@/modules/class/class.service';
import ClassListClient from './ClassListClient';

export const dynamic = 'force-dynamic';

export default async function ClassesPage() {
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

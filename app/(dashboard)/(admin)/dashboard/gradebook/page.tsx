import { getSession } from '@/lib/session';
import { db } from '@/prisma/db';
import { getAllClasses } from '@/modules/class/class.service';
import GradebookClient from './GradebookClient';

export const dynamic = 'force-dynamic';

export default async function GradebookPage() {
  const session = await getSession();
  
  // Get all classes and courses for filters
  const classes = await getAllClasses();
  const courses = await db.orm.public.Course.all();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Buku Nilai (Gradebook)</h1>
        <p className="text-gray-500 text-sm">
          Pantau rekap nilai kuis dan tugas mandiri seluruh siswa dalam format matriks spreadsheet per kelas dan mata pelajaran.
        </p>
      </div>

      <GradebookClient classes={classes} courses={courses} />
    </div>
  );
}

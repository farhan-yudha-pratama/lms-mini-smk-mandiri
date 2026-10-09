import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { getStudentDetailedProgress } from '@/app/actions/student-progress';
import ProgressClient from './ProgressClient';

export const metadata = {
  title: 'Progress Belajar - Siswa',
};

export default async function StudentProgressPage() {
  const session = await getSession();
  
  if (!session || session.role !== 'MURID') {
    redirect('/login');
  }

  const progressData = await getStudentDetailedProgress();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-5xl font-black uppercase text-black drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
          Progress Belajar
        </h1>
        <p className="text-sm md:text-base font-bold text-gray-800 bg-white border-2 border-black p-2 shadow-[2px_2px_0px_0px_#000] max-w-3xl inline-block">
          Lacak perkembangan belajar Anda. Lihat materi yang sudah terbuka, yang masih terkunci, dan kuis yang belum diselesaikan.
        </p>
      </div>

      <ProgressClient data={progressData} />
    </div>
  );
}

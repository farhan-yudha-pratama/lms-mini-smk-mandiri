import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { getStudentTasks } from '@/modules/quiz-assignment/quiz-assignment.service';
import TaskListClient from './TaskListClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Tugas & Kuis | EduBrutal',
};

export default async function TugasPage() {
  const session = await getSession();
  if (!session || session.role !== 'MURID') {
    redirect('/login');
  }

  const tasks = await getStudentTasks(session.userId);

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_#000]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[#092328] text-[#8BBB92] font-mono font-bold uppercase text-xs px-2.5 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                Asesmen Belajar
              </span>
              <span className="bg-[#2A835F] text-white font-mono font-bold uppercase text-xs px-2.5 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping"></span>
                Real-Time Live
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-black uppercase tracking-tight leading-tight">
              Tugas & Kuis
            </h1>
            <p className="mt-2 font-bold text-black/80 text-sm max-w-2xl">
              Daftar evaluasi dan kuis mandiri yang ditugaskan kepada Anda. Terhubung langsung dengan live update dari guru.
            </p>
          </div>
        </div>
      </div>

      <TaskListClient initialTasks={tasks} studentId={session.userId} />
    </div>
  );
}

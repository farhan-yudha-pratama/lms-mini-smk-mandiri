import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { db } from '@/prisma/db';
import StudentDashboardShell from '@/components/student/StudentDashboardShell';
import Link from 'next/link';
import RaporClient from './RaporClient';

export default async function RaporPage() {
  const session = await getSession();
  if (!session) redirect('/auth/login');

  const { userId, role } = session;
  if (role !== 'MURID') redirect('/dashboard');

  const user = await db.orm.public.User.where({ id: userId }).first();
  if (!user) redirect('/auth/login');

  let className = 'Tanpa Kelas';
  if (user.classId) {
    const classroom = await db.orm.public.Classroom.where({ id: user.classId }).first();
    if (classroom) className = classroom.name;
  }

  const records = await db.orm.public.QuizCompletionRecord.where({ studentId: userId }).all();
  records.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());

  return (
    <StudentDashboardShell userName={user.name} userClass={className}>
      <header className="flex justify-between items-end mb-8 md:mb-12">
        <div>
          <div className="bg-black text-[#8BBB92] font-mono font-bold text-xs md:text-sm px-3 py-1 inline-block border-2 border-black mb-3">
            EVALUASI DIRI
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter drop-shadow-[4px_4px_0px_#000]">
            Rapor & Riwayat Kuis
          </h1>
        </div>
        <Link href="/" className="hidden md:flex items-center gap-2 bg-white text-black font-black uppercase border-4 border-black px-4 py-2 shadow-[4px_4px_0px_0px_#000] hover:translate-y-1 hover:shadow-none transition-all">
          <span className="material-symbols-outlined">arrow_back</span>
          Dashboard
        </Link>
      </header>

      <RaporClient records={records as any} currentStudentId={userId} />
    </StudentDashboardShell>
  );
}

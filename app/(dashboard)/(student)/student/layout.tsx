import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import StudentDashboardShell from '@/components/student/StudentDashboardShell';
import { db } from '@/prisma/db';

export default async function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  
  if (!session || session.role !== 'MURID') {
    redirect('/login');
  }

  // Fetch student's class name
  const student = await db.orm.public.User.where({ id: session.userId }).first();
  let className = 'Siswa Aktif';
  if (student?.classId) {
    const classroom = await db.orm.public.Classroom.where({ id: student.classId }).first();
    if (classroom) {
      className = classroom.name;
    }
  }

  return (
    <StudentDashboardShell 
      userName={session.name || student?.name || 'Siswa'} 
      userClass={className} 
    >
      {children}
    </StudentDashboardShell>
  );
}

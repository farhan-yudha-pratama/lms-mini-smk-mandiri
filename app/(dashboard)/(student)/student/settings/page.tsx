import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { db } from '@/prisma/db';
import StudentSettingsView from '@/components/student/StudentSettingsView';

export const metadata = {
  title: 'Pengaturan Akun - Siswa',
};

export default async function StudentSettingsPage() {
  const session = await getSession();

  if (!session || session.role !== 'MURID') {
    redirect('/login');
  }

  const user = await db.orm.public.User.where({ id: session.userId }).first();

  let className = 'Siswa Aktif';
  if (user?.classId) {
    const classroom = await db.orm.public.Classroom.where({ id: user.classId }).first();
    if (classroom) {
      className = classroom.name;
    }
  }

  return (
    <StudentSettingsView
      user={{
        id: session.userId,
        name: user?.name || session.name || 'Siswa',
        email: user?.email || session.email || '',
        role: 'MURID',
        className,
      }}
    />
  );
}

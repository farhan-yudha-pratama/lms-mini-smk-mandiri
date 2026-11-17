import { getStudents } from '@/app/actions/student-access';
import { getScopedClasses, resolveTeacherScope } from '@/modules/course/teacher-scope.service';
import { getSession } from '@/lib/session';
import { hasAnyPermission } from '@/lib/permissions';
import { redirect } from 'next/navigation';
import StudentAccessTable from './components/StudentAccessTable';
import { StudentRow } from './types';

export const metadata = {
  title: 'Manajemen Akses Siswa',
};

export default async function StudentAccessPage() {
  const session = await getSession();
  if (!session || !hasAnyPermission(session, ['STUDENT_ACCESS_MANAGE', 'STUDENT_ACCESS_VIEW'])) {
    redirect('/dashboard');
  }

  const scope = await resolveTeacherScope(session);

  const [rawStudents, rawClasses] = await Promise.all([
    getStudents(),
    getScopedClasses(scope),
  ]);
  
  const classesMap = new Map(rawClasses.map(c => [c.id, c.name]));
  
  const students: StudentRow[] = rawStudents.map(s => ({
    id: s.id,
    name: s.name,
    email: s.email,
    isActive: s.isActive,
    classId: s.classId,
    className: s.classId ? classesMap.get(s.classId) || '-' : '-',
    stats: s.stats
  }));

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Akses Materi Siswa</h1>
          <p className="text-gray-500 mt-1">Kelola dan pantau hak akses halaman untuk setiap siswa.</p>
        </div>
      </div>

      {!scope.isUnrestricted && (scope.allowedCourseIds.size === 0 || scope.allowedClassIds.size === 0) && (
        <div className="bg-amber-50 border border-amber-300 text-amber-900 rounded-xl p-4 flex items-start gap-3 text-xs sm:text-sm">
          <span className="material-symbols-outlined text-amber-600 text-xl shrink-0">warning</span>
          <div>
            <p className="font-bold text-amber-950">Penugasan Kelas Belum Lengkap</p>
            <p className="mt-0.5">Anda belum ditugaskan ke kelas atau mata pelajaran mana pun. Hubungi administrator untuk mengatur penugasan Anda.</p>
          </div>
        </div>
      )}
      
      <StudentAccessTable students={students} classes={rawClasses} />
    </div>
  );
}

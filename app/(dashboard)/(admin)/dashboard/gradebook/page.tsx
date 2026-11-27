import { getSession } from '@/lib/session';
import { hasAnyPermission, hasPermission } from '@/lib/permissions';
import { redirect } from 'next/navigation';
import { getScopedClasses, getScopedCourses, resolveTeacherScope } from '@/modules/course/teacher-scope.service';
import GradebookClient from './GradebookClient';

export const dynamic = 'force-dynamic';

export default async function GradebookPage({
  searchParams,
}: {
  searchParams: Promise<{ classId?: string; courseId?: string }>;
}) {
  const session = await getSession();
  if (!session || !hasAnyPermission(session, ['GRADEBOOK_VIEW', 'GRADEBOOK_CONFIG', 'QUIZZES_GRADE'])) {
    redirect('/dashboard');
  }

  const [{ classId, courseId }, scope] = await Promise.all([
    searchParams,
    resolveTeacherScope(session),
  ]);
  const [classes, courses] = await Promise.all([
    getScopedClasses(scope),
    getScopedCourses(scope),
  ]);
  const canConfigure = hasPermission(session, 'GRADEBOOK_CONFIG');

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Buku Nilai (Gradebook)</h1>
        <p className="text-gray-500 text-sm">
          Pantau rekap nilai kuis dan tugas mandiri seluruh siswa dalam format matriks spreadsheet per kelas dan mata pelajaran.
        </p>
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

      <GradebookClient
        classes={classes}
        courses={courses}
        initialClassId={classId}
        initialCourseId={courseId}
        canConfigure={canConfigure}
      />
    </div>
  );
}

import { getSession } from '@/lib/session';
import { hasPermission } from '@/lib/permissions';
import { redirect } from 'next/navigation';
import { db } from '@/prisma/db';
import { getScopedClasses, getScopedCourses, resolveTeacherScope } from '@/modules/course/teacher-scope.service';
import { getQuizArchives } from '@/modules/quiz-completion/quiz-completion.service';
import QuizArchivesClient from './QuizArchivesClient';

export const dynamic = 'force-dynamic';

export default async function QuizArchivesPage() {
  const session = await getSession();
  if (!session || !hasPermission(session, 'ARCHIVES_VIEW')) {
    redirect('/dashboard');
  }

  const scope = await resolveTeacherScope(session);

  const [classes, courses, rawCategories, initialArchives] = await Promise.all([
    getScopedClasses(scope),
    getScopedCourses(scope),
    db.orm.public.MaterialCategory.where({ isActive: true }).all(),
    getQuizArchives({ page: 1, limit: 50, scope }),
  ]);

  const categories = scope.isUnrestricted
    ? rawCategories
    : rawCategories.filter(c => c.courseId && scope.allowedCourseIds.has(c.courseId));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Buku Arsip Kuis & Tugas</h1>
        <p className="text-gray-500 text-sm">
          Arsip resmi permanen (*audit trail*) riwayat penyelesaian kuis dan tugas mandiri seluruh siswa di sekolah.
        </p>
      </div>

      <QuizArchivesClient
        classes={classes}
        courses={courses}
        categories={categories}
        initialArchives={initialArchives}
      />
    </div>
  );
}

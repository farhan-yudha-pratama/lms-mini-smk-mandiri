import { getReportFilterPackages } from '@/modules/quiz/quiz.service';
import { getQuizReports, getUnfinishedStudentsReport } from '@/modules/quiz-report/quiz-report.service';
import { getScopedClasses, getScopedCourses, resolveTeacherScope } from '@/modules/course/teacher-scope.service';
import QuizReportView from '@/components/quiz-report/QuizReportView';
import { getSession } from '@/lib/session';
import { hasAnyPermission, hasPermission } from '@/lib/permissions';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function QuizReportsPage() {
  const session = await getSession();
  if (!session || !hasAnyPermission(session, ['REPORTS_VIEW', 'REPORTS_UNFINISHED_VIEW', 'QUIZZES_GRADE'])) {
    redirect('/dashboard');
  }

  const role = session.role || 'MURID';
  const scope = await resolveTeacherScope(session);

  const [
    packagesResult,
    classesResult,
    reportsResult,
    unfinishedResult,
    coursesResult
  ] = await Promise.allSettled([
    getReportFilterPackages(scope),
    getScopedClasses(scope),
    getQuizReports({ page: 1, limit: 50, scope }),
    getUnfinishedStudentsReport({ page: 1, limit: 50, sortBy: 'UNOPENED_DESC', filterMode: 'ALL', scope }),
    getScopedCourses(scope),
  ]);

  for (const [label, res] of [
    ['packages', packagesResult],
    ['classes', classesResult],
    ['reports', reportsResult],
    ['unfinished', unfinishedResult],
    ['courses', coursesResult],
  ] as const) {
    if (res.status === 'rejected') {
      console.error(`[QuizReportsPage] Failed loading ${label}:`, res.reason);
    }
  }

  const availablePackages = packagesResult.status === 'fulfilled' ? packagesResult.value : [];
  const classes = classesResult.status === 'fulfilled' ? classesResult.value : [];
  const initialReports = reportsResult.status === 'fulfilled' ? reportsResult.value : undefined;
  const initialUnfinishedReports = unfinishedResult.status === 'fulfilled' ? unfinishedResult.value : undefined;
  const courses = coursesResult.status === 'fulfilled' ? coursesResult.value : [];

  let missingClassBanner: string | null = null;
  if (!scope.isUnrestricted) {
    if (scope.allowedCourseIds.size === 0) {
      missingClassBanner = 'Anda belum ditugaskan sebagai pengampu mata pelajaran mana pun. Hubungi administrator untuk penugasan mata pelajaran dan kelas.';
    } else if (scope.allowedClassIds.size === 0) {
      missingClassBanner = 'Anda belum ditugaskan ke kelas mana pun pada mata pelajaran yang Anda ampu. Hubungi administrator untuk mengatur kelas ajar Anda di menu Mata Pelajaran.';
    } else if (scope.coursesMissingClassAssignment.length > 0) {
      const missingNames = courses
        .filter((c) => scope.coursesMissingClassAssignment.includes(c.id))
        .map((c) => c.name)
        .join(', ');
      missingClassBanner = `Sebagian mata pelajaran yang Anda ampu belum memiliki penugasan kelas (${missingNames || 'tertentu'}). Siswa pada mapel tersebut belum akan tampil sebelum kelas diatur.`;
    }
  }

  const canFilterCourse = scope.isUnrestricted || courses.length > 1;
  const canGrade = hasPermission(session, 'QUIZZES_GRADE');
  const canReset = hasAnyPermission(session, ['QUIZZES_GRADE', 'QUIZZES_MANAGE']);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Laporan Belajar & Kuis Murid</h1>
        <p className="text-gray-500 text-sm">
          Pantau rekap nilai kuis, review manual jawaban essay, dan monitor siswa yang belum membuka materi atau menyelesaikan kuis.
        </p>
      </div>

      <QuizReportView
        packages={availablePackages}
        classes={classes}
        courses={courses}
        role={role}
        canFilterCourse={canFilterCourse}
        canGrade={canGrade}
        canReset={canReset}
        missingClassBanner={missingClassBanner}
        initialReports={initialReports}
        initialUnfinishedReports={initialUnfinishedReports}
      />
    </div>
  );
}

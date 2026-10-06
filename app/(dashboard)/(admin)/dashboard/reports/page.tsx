import { getQuizzesWithPageStatus } from '@/modules/quiz/quiz.service';
import { getAllClasses } from '@/modules/class/class.service';
import { getQuizReports, getUnfinishedStudentsReport } from '@/modules/quiz-report/quiz-report.service';
import QuizReportView from '@/components/quiz-report/QuizReportView';
import { getSession } from '@/lib/session';
import { db } from '@/prisma/db';

export const dynamic = 'force-dynamic';

export default async function QuizReportsPage() {
  const session = await getSession();
  const role = session?.role || 'MURID';
  const teacherId = role === 'GURU' ? session?.userId : undefined;

  const [allPages, classes, initialReports, initialUnfinishedReports, courses] = await Promise.all([
    getQuizzesWithPageStatus(teacherId),
    getAllClasses(),
    getQuizReports({ page: 1, limit: 50, teacherId }),
    getUnfinishedStudentsReport({ page: 1, limit: 50, sortBy: 'UNOPENED_DESC', filterMode: 'ALL', teacherId }),
    db.orm.public.Course.all()
  ]);

  const availablePackages = allPages
    .filter(p => p.hasQuizPackage)
    .map(p => ({
      id: p.quizPackage!.id,
      title: p.quizPackage!.title,
      pageTitle: p.title,
      categoryName: p.categoryName
    }));

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
        initialReports={initialReports}
        initialUnfinishedReports={initialUnfinishedReports}
      />
    </div>
  );
}

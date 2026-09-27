import { getQuizzesWithPageStatus } from '@/modules/quiz/quiz.service';
import { getAllClasses } from '@/modules/class/class.service';
import { getQuizReports } from '@/modules/quiz-report/quiz-report.service';
import QuizReportView from '@/components/quiz-report/QuizReportView';

export const dynamic = 'force-dynamic';

export default async function QuizReportsPage() {
  const [allPages, classes, initialReports] = await Promise.all([
    getQuizzesWithPageStatus(),
    getAllClasses(),
    getQuizReports({ page: 1, limit: 50 }),
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
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Laporan Nilai Kuis</h1>
        <p className="text-gray-500 text-sm">
          Pantau skor dan riwayat pengerjaan kuis murid terbaru yang dikelompokkan berdasarkan kelas dengan dukungan filter dan paginasi.
        </p>
      </div>

      <QuizReportView 
        packages={availablePackages} 
        classes={classes} 
        initialReports={initialReports}
      />
    </div>
  );
}

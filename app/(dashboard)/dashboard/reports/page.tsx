import { getQuizzesWithPageStatus } from '@/modules/quiz/quiz.service';
import { getAllClasses } from '@/modules/class/class.service';
import QuizReportView from '@/components/quiz-report/QuizReportView';

export const dynamic = 'force-dynamic';

export default async function QuizReportsPage() {
  const allPages = await getQuizzesWithPageStatus();
  const availablePackages = allPages.filter(p => p.hasQuizPackage).map(p => ({
    id: p.quizPackage!.id,
    title: p.quizPackage!.title,
    pageTitle: p.title,
    categoryName: p.categoryName
  }));

  const classes = await getAllClasses();

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Laporan Nilai Kuis</h1>
        <p className="text-gray-500 text-sm">Pantau skor, peringkat (leaderboard), dan riwayat pengerjaan murid secara spesifik untuk setiap Halaman per Kelas.</p>
      </div>

      <QuizReportView packages={availablePackages} classes={classes} />
    </div>
  );
}

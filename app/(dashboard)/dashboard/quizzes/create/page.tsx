import { getQuizzesWithPageStatus } from '@/modules/quiz/quiz.service';
import QuizPackageForm from '@/components/quiz/QuizPackageForm';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function CreateQuizPage({ searchParams }: { searchParams: Promise<{ pageId?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const defaultPageId = resolvedSearchParams.pageId;

  // Get all pages to populate dropdown, we only want pages without quizzes
  const allPages = await getQuizzesWithPageStatus();
  const availablePages = allPages.filter(p => !p.hasQuizPackage || p.id === defaultPageId);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href="/dashboard/quizzes" className="text-blue-600 hover:underline text-sm mb-2 inline-block">
          &larr; Kembali ke Daftar Kuis
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Buat Paket Kuis Baru</h1>
      </div>

      <QuizPackageForm 
        pages={availablePages} 
        defaultPageId={defaultPageId}
      />
    </div>
  );
}



import { getQuizzesWithPageStatus } from '@/modules/quiz/quiz.service';
import QuizListTable from './QuizListTable';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function QuizzesPage() {
  const pages = await getQuizzesWithPageStatus();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Paket Kuis</h1>
          <p className="text-gray-500 text-sm mt-1">
            Kelola Paket Kuis (assessment) untuk setiap halaman materi, diurutkan dan dikelompokkan berdasarkan Kategori Materi.
          </p>
        </div>
        <Link
          href="/dashboard/quizzes/create"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-xs"
        >
          <span className="material-symbols-outlined text-base">add</span>
          <span>Buat Paket Kuis</span>
        </Link>
      </div>

      <QuizListTable pages={pages} />
    </div>
  );
}



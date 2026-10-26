import { getSession } from '@/lib/session';
import { db } from '@/prisma/db';
import { getAllClasses } from '@/modules/class/class.service';
import { getQuizArchives } from '@/modules/quiz-completion/quiz-completion.service';
import QuizArchivesClient from './QuizArchivesClient';

export const dynamic = 'force-dynamic';

export default async function QuizArchivesPage() {
  const session = await getSession();

  const [classes, courses, categories, initialArchives] = await Promise.all([
    getAllClasses(),
    db.orm.public.Course.all(),
    db.orm.public.MaterialCategory.where({ isActive: true }).all(),
    getQuizArchives({ page: 1, limit: 50 })
  ]);

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

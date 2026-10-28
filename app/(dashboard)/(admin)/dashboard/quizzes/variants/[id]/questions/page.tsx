import { getQuizVariantById } from '@/modules/quiz/quiz.service';
import { getQuestionsByQuizVariantId } from '@/modules/quiz/question.service';
import QuestionBank from '@/components/quiz/QuestionBank';
import AntiCheatManager from '@/components/quiz/AntiCheatManager';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/prisma/db';

export const dynamic = 'force-dynamic';

export default async function ManageQuestionsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const variant = await getQuizVariantById(resolvedParams.id);
  if (!variant) return notFound();

  const questions = await getQuestionsByQuizVariantId(resolvedParams.id);
  
  const antiCheatRow = await db.orm.public.QuizAntiCheatConfig.where({ quizVariantId: resolvedParams.id }).first();
  const antiCheatConfig = antiCheatRow || {
    enableFullscreen: true,
    preventTabSwitch: true,
    preventCopyPaste: true
  };

  // Ambil data rangkuman Summary AI dari halaman modul kuis
  const pkg = await db.orm.public.QuizPackage.where({ id: variant.quizPackageId }).first();
  let defaultSummaryText = '';
  let pageTitle = '';
  let pageId = '';
  let summariesCount = 0;

  if (pkg?.pageId) {
    pageId = pkg.pageId;
    const page = await db.orm.public.Page.where({ id: pkg.pageId }).first();
    pageTitle = page?.title || '';

    const summaries = await db.orm.public.PageSummary.where({ pageId: pkg.pageId }).all();
    summaries.sort((a: any, b: any) => a.orderIndex - b.orderIndex);
    summariesCount = summaries.length;

    if (summaries.length > 0) {
      defaultSummaryText = summaries
        .map((s: any) => `[${s.title}]\n${s.content}`)
        .join('\n\n');
    }
  }

  // Cek apakah varian sudah pernah dikerjakan oleh murid
  const attempts = await db.orm.public.QuizAttempt.where({ quizVariantId: resolvedParams.id }).all();
  const hasStudentAttempts = attempts.length > 0;

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link 
            href={`/dashboard/quizzes/${variant.quizPackageId}/edit`} 
            className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium mb-1.5 inline-flex items-center gap-1 group transition-colors"
          >
            <span className="material-symbols-outlined text-sm transition-transform group-hover:-translate-x-0.5">arrow_back</span>
            <span>Kembali ke Paket Kuis</span>
          </Link>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Kelola Soal: {variant.name}</h1>
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
              variant.isActive !== false
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}>
              {variant.isActive !== false ? 'Aktif' : 'Disuspend'}
            </span>
          </div>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
            Atur perlindungan ujian dan daftar butir pertanyaan untuk varian kuis ini.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs p-4 sm:p-6">
        <AntiCheatManager 
          quizVariantId={variant.id} 
          initialConfig={antiCheatConfig} 
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs p-4 sm:p-6">
        <QuestionBank 
          quizVariantId={variant.id} 
          variantName={variant.name}
          initialQuestions={questions} 
          initialSummaryText={defaultSummaryText}
          hasStudentAttempts={hasStudentAttempts}
          hasAiSummary={summariesCount > 0}
          summariesCount={summariesCount}
          pageTitle={pageTitle}
          pageId={pageId}
        />
      </div>
    </div>
  );
}

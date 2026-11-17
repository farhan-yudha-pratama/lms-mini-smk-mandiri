import { db } from '@/prisma/db';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import ReviewClient from './ReviewClient';
import { getSession } from '@/lib/session';
import { hasAnyPermission } from '@/lib/permissions';
import { resolveTeacherScope } from '@/modules/course/teacher-scope.service';
import { assertCanAccessAttempt } from '@/modules/quiz-report/quiz-report.service';

export const dynamic = 'force-dynamic';

export default async function ReviewEssayPage({ params }: { params: Promise<{ attemptId: string }> | { attemptId: string } }) {
  const session = await getSession();
  if (!session || !hasAnyPermission(session, ['QUIZZES_GRADE', 'GRADEBOOK_VIEW'])) {
    redirect('/dashboard');
  }

  const resolvedParams = await Promise.resolve(params);
  const scope = await resolveTeacherScope(session);
  try {
    await assertCanAccessAttempt(scope, resolvedParams.attemptId);
  } catch {
    redirect('/dashboard/gradebook');
  }

  const attempt = await db.orm.public.QuizAttempt.where({ id: resolvedParams.attemptId }).first();
  if (!attempt) redirect('/dashboard/gradebook');

  const student = await db.orm.public.User.where({ id: attempt.studentId }).first();
  const variant = await db.orm.public.QuizVariant.where({ id: attempt.quizVariantId }).first();
  const pkg = await db.orm.public.QuizPackage.where({ id: variant!.quizPackageId }).first();
  
  const rawQuestions = await db.orm.public.Question.where({ quizVariantId: variant!.id }).all();
  const answers = await db.orm.public.StudentAnswer.where({ quizAttemptId: attempt.id }).all();

  const essayQuestions = rawQuestions.filter(q => q.questionType === 'ESSAY' || q.questionType === 'CODE_CHALLENGE').map(q => {
    const ans = answers.find(a => a.questionId === q.id);
    return {
      id: q.id,
      text: q.questionText,
      questionType: q.questionType,
      codeLanguage: q.codeLanguage,
      maxPoints: q.points,
      answerId: ans?.id || null,
      answerText: ans?.essayAnswer || '',
      currentPoints: ans?.pointsEarned || 0,
      feedback: ans?.essayFeedback || ''
    };
  });

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/gradebook" className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Periksa Jawaban Essay</h1>
          <p className="text-gray-500 text-sm">Siswa: <strong>{student?.name}</strong> &bull; Kuis: <strong>{pkg?.title}</strong></p>
        </div>
      </div>

      <ReviewClient attemptId={attempt.id} essays={essayQuestions} />
    </div>
  );
}

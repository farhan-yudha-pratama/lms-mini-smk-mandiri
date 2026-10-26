import { db } from '@/prisma/db';
import { getSession } from '@/lib/session';
import { notFound, redirect } from 'next/navigation';
import CodePreviewClient from './CodePreviewClient';

export const dynamic = 'force-dynamic';

export default async function CodePreviewPage({ params }: { params: Promise<{ answerId: string }> }) {
  const { answerId } = await params;
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  const answer = await db.orm.public.StudentAnswer.where({ id: answerId }).first();
  if (!answer) {
    notFound();
  }

  const attempt = await db.orm.public.QuizAttempt.where({ id: answer.quizAttemptId }).first();
  if (!attempt) {
    notFound();
  }

  // Hak akses: Superadmin & Guru dapat melihat jawaban siapa saja. Murid hanya dapat melihat jawaban sendiri.
  if (session.role === 'MURID' && attempt.studentId !== session.userId) {
    redirect('/student/riwayat-nilai');
  }

  const student = await db.orm.public.User.where({ id: attempt.studentId }).first();
  const question = await db.orm.public.Question.where({ id: answer.questionId }).first();
  const variant = await db.orm.public.QuizVariant.where({ id: attempt.quizVariantId }).first();
  const pkg = variant ? await db.orm.public.QuizPackage.where({ id: variant.quizPackageId }).first() : null;

  return (
    <CodePreviewClient
      code={answer.essayAnswer || ''}
      language={question?.codeLanguage || 'html'}
      studentName={student?.name || 'Siswa'}
      studentEmail={student?.email || ''}
      quizTitle={pkg?.title || 'Kuis Coding'}
      questionText={question?.questionText || 'Soal Coding'}
      maxPoints={question?.points || 0}
      pointsEarned={answer.pointsEarned}
      feedback={answer.essayFeedback}
      userRole={session.role}
    />
  );
}

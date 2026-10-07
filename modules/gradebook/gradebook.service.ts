import { db } from '@/prisma/db';

export interface GradebookMatrixResponse {
  students: {
    id: string;
    name: string;
    email: string;
  }[];
  quizzes: {
    id: string;
    title: string;
    isStandalone: boolean;
  }[];
  matrix: Record<string, Record<string, {
    score: number | null;
    status: string | null;
    attemptId: string | null;
    needsReview: boolean;
  }>>;
}

export async function getGradebookMatrix(classId: string, courseId: string): Promise<GradebookMatrixResponse> {
  // 1. Get all students in the class
  const students = await db.orm.public.User.where({ classId, role: 'MURID' }).all();
  if (!students.length) {
    return { students: [], quizzes: [], matrix: {} };
  }
  const studentIds = new Set(students.map(s => s.id));

  // 2. Get all quizzes for this course
  const allPackages = await db.orm.public.QuizPackage.where({ courseId }).all();
  // Filter active/non-hidden if needed, or return all since it's admin view
  
  // Sort quizzes (maybe by creation date or order)
  const quizzes = allPackages.map(p => ({
    id: p.id,
    title: p.title,
    isStandalone: !p.pageId
  }));

  const packageIds = new Set(quizzes.map(q => q.id));

  // 3. Get all variants for these packages
  const variants = await db.orm.public.QuizVariant.all();
  const variantMap = new Map<string, string>(); // variantId -> packageId
  for (const v of variants) {
    if (packageIds.has(v.quizPackageId)) {
      variantMap.set(v.id, v.quizPackageId);
    }
  }

  const targetVariantIds = new Set(variantMap.keys());

  // 4. Get attempts for these students and variants
  const allAttempts = await db.orm.public.QuizAttempt.all();
  const relevantAttempts = allAttempts.filter(a => 
    studentIds.has(a.studentId) && targetVariantIds.has(a.quizVariantId)
  );

  // 5. Get questions to determine if they need review
  const allQuestions = await db.orm.public.Question.all();
  const variantEssayMap = new Map<string, boolean>();
  for (const q of allQuestions) {
    if (q.questionType === 'ESSAY') {
      variantEssayMap.set(q.quizVariantId, true);
    }
  }

  // 6. Build matrix
  // matrix[studentId][quizPackageId] = { score, status }
  const matrix: Record<string, Record<string, any>> = {};

  for (const student of students) {
    matrix[student.id] = {};
    for (const pkg of quizzes) {
      matrix[student.id][pkg.id] = {
        score: null,
        status: null,
        attemptId: null,
        needsReview: false
      };
    }
  }

  for (const attempt of relevantAttempts) {
    const pkgId = variantMap.get(attempt.quizVariantId);
    if (!pkgId || !matrix[attempt.studentId]) continue;

    const hasEssay = variantEssayMap.get(attempt.quizVariantId) || false;
    const needsReview = hasEssay && attempt.status === 'COMPLETED';

    matrix[attempt.studentId][pkgId] = {
      score: attempt.score,
      status: attempt.status,
      attemptId: attempt.id,
      needsReview
    };
  }

  return {
    students: students.map(s => ({ id: s.id, name: s.name, email: s.email })),
    quizzes,
    matrix
  };
}

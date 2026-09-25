import { db } from '@/prisma/db';

export async function getLeaderboardByPackageAndClass(packageId: string, classId: string) {
  // 1. Get all students in the class
  const students = await db.orm.public.User.where({ classId, role: 'MURID' }).all();

  // 2. Get variants for the package to filter attempts
  const variants = await db.orm.public.QuizVariant.where({ quizPackageId: packageId }).all();
  const variantIds = variants.map(v => v.id);

  // 3. Get all assignments for this class in this package
  const assignments = await db.orm.public.QuizAssignment.where({ quizPackageId: packageId }).all();

  // 4. Get attempts
  const attempts = await db.orm.public.QuizAttempt.all();
  const relevantAttempts = attempts.filter(a => variantIds.includes(a.quizVariantId));

  const results = students.map(student => {
    const attempt = relevantAttempts.find(a => a.studentId === student.id);
    const assignment = assignments.find(a => a.studentId === student.id);
    
    return {
      id: student.id,
      name: student.name,
      email: student.email,
      attemptId: attempt?.id || null,
      status: attempt?.status || 'NOT_STARTED',
      score: attempt?.score || 0,
      finishedAt: attempt?.finishedAt || null,
      assignedVariantId: assignment?.quizVariantId || null,
    };
  });

  // Sorting logic
  results.sort((a, b) => {
    // 1. If both are completed/graded, sort by score
    const aIsDone = a.status === 'COMPLETED' || a.status === 'GRADED';
    const bIsDone = b.status === 'COMPLETED' || b.status === 'GRADED';

    if (aIsDone && bIsDone) {
      if (b.score !== a.score) return b.score - a.score; // Highest score first
      // If score is same, the one who finished earlier wins
      const timeA = a.finishedAt ? new Date(a.finishedAt).getTime() : 0;
      const timeB = b.finishedAt ? new Date(b.finishedAt).getTime() : 0;
      return timeA - timeB;
    }
    
    if (aIsDone) return -1;
    if (bIsDone) return 1;

    // 2. If IN_PROGRESS, they come next
    if (a.status === 'IN_PROGRESS' && b.status !== 'IN_PROGRESS') return -1;
    if (b.status === 'IN_PROGRESS' && a.status !== 'IN_PROGRESS') return 1;

    // 3. Rest (NOT_STARTED) at the bottom, sort by name alphabetically
    return a.name.localeCompare(b.name);
  });

  // Calculate statistics
  const completedStudents = results.filter(r => r.status === 'COMPLETED' || r.status === 'GRADED');
  const sumScores = completedStudents.reduce((acc, curr) => acc + curr.score, 0);
  const averageScore = completedStudents.length > 0 ? (sumScores / completedStudents.length) : 0;

  return {
    leaderboard: results,
    stats: {
      totalStudents: students.length,
      completedCount: completedStudents.length,
      averageScore: Math.round(averageScore * 100) / 100, // round to 2 decimals
    }
  };
}

export async function resetQuizAttempt(studentId: string, packageId: string) {
  // Find variants
  const variants = await db.orm.public.QuizVariant.where({ quizPackageId: packageId }).all();
  const variantIds = variants.map(v => v.id);

  // Find attempt for this student matching those variants
  const attempts = await db.orm.public.QuizAttempt.where({ studentId }).all();
  const targetAttempt = attempts.find(a => variantIds.includes(a.quizVariantId));

  if (!targetAttempt) {
    throw new Error('Tidak ada riwayat kuis untuk di-reset');
  }

  // Delete all student answers associated with this attempt first (because no cascade delete setup)
  const answers = await db.orm.public.StudentAnswer.where({ quizAttemptId: targetAttempt.id }).all();
  for (const ans of answers) {
    await db.orm.public.StudentAnswer.where({ id: ans.id }).delete();
  }

  // Delete the attempt
  await db.orm.public.QuizAttempt.where({ id: targetAttempt.id }).delete();
  
  return true;
}

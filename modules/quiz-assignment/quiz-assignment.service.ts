import { db } from '@/prisma/db';
import { randomUUID } from 'crypto';

// Get all assignments for a class and package
export async function getAssignmentsByPackageAndClass(packageId: string, classId: string) {
  // 1. Get all students in the class
  const students = await db.orm.public.User.where({ classId, role: 'MURID' }).all();

  // 2. Get assignments for this package
  const assignments = await db.orm.public.QuizAssignment.where({ quizPackageId: packageId }).all();

  // 3. Get attempts to check locking
  const attempts = await db.orm.public.QuizAttempt.all();
  // To optimize in Prisma 8, we fetch all for this package's variants.
  const variants = await db.orm.public.QuizVariant.where({ quizPackageId: packageId }).all();
  const variantIds = variants.map(v => v.id);

  const relevantAttempts = attempts.filter(a => variantIds.includes(a.quizVariantId));

  // Merge Data
  return students.map(student => {
    const assignment = assignments.find(a => a.studentId === student.id);
    const assignedVariant = assignment ? variants.find(v => v.id === assignment.quizVariantId) : null;
    const attempt = relevantAttempts.find(a => a.studentId === student.id);

    return {
      student,
      assignment: assignment ? { ...assignment, variant: assignedVariant } : null,
      isLocked: !!attempt, // True if they have already started/finished an attempt
      attemptStatus: attempt?.status || 'NOT_STARTED'
    };
  });
}

// Assign manually
export async function assignManual(packageId: string, variantId: string, studentIds: string[]) {
  // Only assign to students who haven't attempted the quiz yet
  const attempts = await db.orm.public.QuizAttempt.all();
  const variants = await db.orm.public.QuizVariant.where({ quizPackageId: packageId }).all();
  const variantIds = variants.map(v => v.id);
  const relevantAttempts = attempts.filter(a => variantIds.includes(a.quizVariantId));

  const lockedStudentIds = relevantAttempts.map(a => a.studentId);
  const validStudentIds = studentIds.filter(id => !lockedStudentIds.includes(id));

  // Fetch existing assignments
  const existingAssignments = await db.orm.public.QuizAssignment.where({ quizPackageId: packageId }).all();

  // We should do bulk upsert, but in basic ORM we can delete existing and create new
  for (const studentId of validStudentIds) {
    const existing = existingAssignments.find(a => a.studentId === studentId);
    if (existing) {
      await db.orm.public.QuizAssignment.where({ id: existing.id }).update({
        quizVariantId: variantId,
        assignedAt: new Date().toISOString()
      });
    } else {
      await db.orm.public.QuizAssignment.create({
        id: randomUUID(),
        quizPackageId: packageId,
        quizVariantId: variantId,
        studentId,
        assignedAt: new Date().toISOString()
      });
    }
  }

  return validStudentIds.length;
}

// Round-Robin Distribution
export async function distributeRandomlyByClass(packageId: string, classId: string) {
  const studentsData = await getAssignmentsByPackageAndClass(packageId, classId);
  
  // Filter out locked students
  const unlockedStudents = studentsData.filter(s => !s.isLocked).map(s => s.student.id);
  if (unlockedStudents.length === 0) return 0;

  const variants = await db.orm.public.QuizVariant.where({ quizPackageId: packageId }).all();
  if (variants.length === 0) throw new Error('Tidak ada varian kuis yang tersedia untuk paket ini');

  // Shuffle students
  const shuffledStudents = [...unlockedStudents].sort(() => Math.random() - 0.5);
  // Shuffle variants
  const shuffledVariants = [...variants].sort(() => Math.random() - 0.5);

  const existingAssignments = await db.orm.public.QuizAssignment.where({ quizPackageId: packageId }).all();

  let assignedCount = 0;
  for (let i = 0; i < shuffledStudents.length; i++) {
    const studentId = shuffledStudents[i];
    // Round-robin selection of variant
    const variantId = shuffledVariants[i % shuffledVariants.length].id;

    const existing = existingAssignments.find(a => a.studentId === studentId);
    if (existing) {
      await db.orm.public.QuizAssignment.where({ id: existing.id }).update({
        quizVariantId: variantId,
        assignedAt: new Date().toISOString()
      });
    } else {
      await db.orm.public.QuizAssignment.create({
        id: randomUUID(),
        quizPackageId: packageId,
        quizVariantId: variantId,
        studentId,
        assignedAt: new Date().toISOString()
      });
    }
    assignedCount++;
  }

  return assignedCount;
}

import { db } from '@/prisma/db';
import { randomUUID } from 'crypto';
import { getUnlockedPageIdsForStudent } from '@/modules/student-access/student-access.service';

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
  const targetVariant = await db.orm.public.QuizVariant.where({ id: variantId }).first();
  if (!targetVariant || targetVariant.isActive === false) {
    throw new Error('Tidak dapat menugaskan varian yang sedang disuspend. Silakan pilih varian yang aktif.');
  }

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

  // ponytail: Dispatch real-time quiz assignment event
  try {
    const pkg = await db.orm.public.QuizPackage.where({ id: packageId }).first();
    let pageSlug: string | null = null;
    if (pkg?.pageId) {
      const page = await db.orm.public.Page.where({ id: pkg.pageId }).first();
      pageSlug = page?.slug || null;
    }
    const { emitQuizAssigned } = await import('@/lib/socket/emitter');
    emitQuizAssigned({
      packageId,
      pageSlug,
      studentIds: validStudentIds,
      assignedAt: new Date().toISOString()
    });
  } catch (socketErr) {
    console.error('Socket emit error in assignManual:', socketErr);
  }

  return validStudentIds.length;
}

// Round-Robin Distribution
export async function distributeRandomlyByClass(packageId: string, classId: string) {
  const studentsData = await getAssignmentsByPackageAndClass(packageId, classId);
  
  // Filter out locked students
  const unlockedStudents = studentsData.filter(s => !s.isLocked).map(s => s.student.id);
  if (unlockedStudents.length === 0) return 0;

  const allVariants = await db.orm.public.QuizVariant.where({ quizPackageId: packageId }).all();
  const variants = allVariants.filter(v => v.isActive !== false);
  if (variants.length === 0) throw new Error('Tidak ada varian kuis yang aktif untuk paket ini. Silakan aktifkan minimal satu varian terlebih dahulu.');

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

  // ponytail: Dispatch real-time quiz assignment event for class
  try {
    const pkg = await db.orm.public.QuizPackage.where({ id: packageId }).first();
    let pageSlug: string | null = null;
    if (pkg?.pageId) {
      const page = await db.orm.public.Page.where({ id: pkg.pageId }).first();
      pageSlug = page?.slug || null;
    }
    const { emitQuizAssigned } = await import('@/lib/socket/emitter');
    emitQuizAssigned({
      packageId,
      pageSlug,
      studentIds: unlockedStudents,
      classId,
      assignedAt: new Date().toISOString()
    });
  } catch (socketErr) {
    console.error('Socket emit error in distributeRandomlyByClass:', socketErr);
  }

  return assignedCount;
}

export interface StudentTaskItem {
  assignment: any;
  pkg: any;
  attempt: any | null;
  status: 'IN_PROGRESS' | 'READY' | 'LOCKED' | 'COMPLETED' | 'GRADED';
  courseName: string;
  courseSlug: string | null;
  page: any | null;
  isLinkedToMaterial: boolean;
}

/**
 * Mengambil seluruh tugas & kuis aktif yang ditugaskan kepada siswa tertentu.
 * Memvalidasi batas waktu dan keterbukaan halaman materi berurutan.
 */
export async function getStudentTasks(studentId: string): Promise<StudentTaskItem[]> {
  const assignments = await db.orm.public.QuizAssignment.where({ studentId }).all();
  if (assignments.length === 0) return [];

  const unlockedPageIds = await getUnlockedPageIdsForStudent(studentId);

  const packageIds = assignments.map(a => a.quizPackageId);
  const allPackages = await db.orm.public.QuizPackage.all();
  const packages = allPackages.filter(p => packageIds.includes(p.id));
  const pkgMap = new Map(packages.map(p => [p.id, p]));

  const allAttempts = await db.orm.public.QuizAttempt.where({ studentId }).all();
  const attemptMap = new Map(allAttempts.map(a => [a.quizVariantId, a]));

  const courseIds = packages.map(p => p.courseId).filter(Boolean) as string[];
  const allCourses = courseIds.length > 0 ? await db.orm.public.Course.all() : [];
  const courses = allCourses.filter(c => courseIds.includes(c.id));
  const courseMap = new Map(courses.map((c: any) => [c.id, c.name]));
  const courseSlugMap = new Map(courses.map((c: any) => [c.id, c.slug]));

  const pageIds = packages.map(p => p.pageId).filter(Boolean) as string[];
  const allPages = pageIds.length > 0 ? await db.orm.public.Page.all() : [];
  const pages = allPages.filter(p => pageIds.includes(p.id));
  const pageMap = new Map(pages.map((p: any) => [p.id, p]));

  const now = new Date();

  const tasks: StudentTaskItem[] = assignments.map(a => {
    const pkg = pkgMap.get(a.quizPackageId);
    if (!pkg || !pkg.isActive || pkg.isHidden) return null;

    // Filter halaman materi: jika kuis terikat pada halaman tertentu,
    // sembunyikan jika halamannya belum terbuka untuk murid ini.
    if (pkg.pageId && !unlockedPageIds.has(pkg.pageId)) {
      return null;
    }

    const attempt = attemptMap.get(a.quizVariantId) || null;
    
    let status: 'IN_PROGRESS' | 'READY' | 'LOCKED' | 'COMPLETED' | 'GRADED' = 'READY';
    if (pkg.openAt && now < new Date(pkg.openAt)) status = 'LOCKED';
    if (pkg.closeAt && now > new Date(pkg.closeAt)) {
      if (!attempt || attempt.status === 'IN_PROGRESS') {
        return null; // EXPIRED & NO_ATTEMPT -> HILANG DARI TAMPILAN
      }
    }

    if (attempt) {
      status = attempt.status as any;
    }

    const courseName = pkg.courseId ? courseMap.get(pkg.courseId) || 'Kuis Mandiri' : 'Kuis Mandiri';
    const courseSlug = pkg.courseId ? courseSlugMap.get(pkg.courseId) || null : null;
    const page = pkg.pageId ? pageMap.get(pkg.pageId) || null : null;

    return {
      assignment: a,
      pkg,
      attempt,
      status,
      courseName,
      courseSlug,
      page,
      isLinkedToMaterial: Boolean(pkg.pageId && page),
    };
  }).filter(Boolean) as StudentTaskItem[];

  tasks.sort((a, b) => {
    const order: Record<string, number> = { 'IN_PROGRESS': 1, 'READY': 2, 'LOCKED': 3, 'COMPLETED': 4, 'GRADED': 5 };
    return (order[a.status] || 99) - (order[b.status] || 99);
  });

  return tasks;
}

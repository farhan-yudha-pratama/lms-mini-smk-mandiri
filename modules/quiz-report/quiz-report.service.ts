import { db } from '@/prisma/db';

export interface QuizReportItem {
  id: string;
  attemptId: string | null;
  studentId: string;
  studentName: string;
  studentEmail: string;
  classId: string | null;
  className: string;
  packageId: string;
  packageTitle: string;
  pageTitle: string;
  categoryName: string;
  passingScore: number;
  score: number | null;
  status: 'COMPLETED' | 'GRADED' | 'IN_PROGRESS' | 'NOT_STARTED';
  startedAt: string | null;
  finishedAt: string | null;
  assignedVariantId: string | null;
  isPassed: boolean;
}

export interface QuizReportsResponse {
  items: QuizReportItem[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
  stats: {
    totalRecords: number;
    completedCount: number;
    inProgressCount: number;
    notStartedCount: number;
    passedCount: number;
    averageScore: number;
  };
}

export async function getQuizReports(params: {
  classId?: string;
  packageId?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<QuizReportsResponse> {
  const { classId, packageId, search, page = 1, limit = 50 } = params;

  // 1. Fetch reference collections
  const [classrooms, categories, pages, quizPackages, quizVariants, allStudents] = await Promise.all([
    db.orm.public.Classroom.all(),
    db.orm.public.MaterialCategory.all(),
    db.orm.public.Page.all(),
    db.orm.public.QuizPackage.all(),
    db.orm.public.QuizVariant.all(),
    db.orm.public.User.where({ role: 'MURID' }).all(),
  ]);

  // Lookup dictionaries
  const classMap = new Map(classrooms.map(c => [c.id, c.name]));
  const categoryMap = new Map(categories.map(c => [c.id, c.name]));
  const pageMap = new Map(pages.map(p => [p.id, p]));
  const packageMap = new Map(quizPackages.map(pkg => [pkg.id, pkg]));
  const variantMap = new Map(quizVariants.map(v => [v.id, v]));
  const studentMap = new Map(allStudents.map(s => [s.id, s]));

  // Filter students if classId provided
  let targetStudents = allStudents;
  if (classId) {
    targetStudents = targetStudents.filter(s => s.classId === classId);
  }
  const targetStudentIds = new Set(targetStudents.map(s => s.id));

  // Filter variants if packageId provided
  let targetVariants = quizVariants;
  if (packageId) {
    targetVariants = targetVariants.filter(v => v.quizPackageId === packageId);
  }
  const targetVariantIds = new Set(targetVariants.map(v => v.id));

  // 2. Fetch attempts
  const allAttempts = await db.orm.public.QuizAttempt.all();
  const relevantAttempts = allAttempts.filter(a => {
    return targetStudentIds.has(a.studentId) && targetVariantIds.has(a.quizVariantId);
  });

  let reportItems: QuizReportItem[] = [];

  // CASE 1: Both classId and packageId are specified -> show all students in that class for that package
  if (classId && packageId) {
    const pkg = packageMap.get(packageId);
    const pageObj = pkg ? pageMap.get(pkg.pageId) : null;
    const catName = pageObj ? (categoryMap.get(pageObj.categoryId) || 'Umum') : 'Umum';
    const pkgTitle = pkg ? pkg.title : 'Kuis';
    const pageTitle = pageObj ? pageObj.title : pkgTitle;
    const passingScore = pkg?.passingScore || 70;
    const className = classMap.get(classId) || 'Kelas Tidak Diketahui';

    const assignments = await db.orm.public.QuizAssignment.where({ quizPackageId: packageId }).all();

    reportItems = targetStudents.map(student => {
      const attempt = relevantAttempts.find(a => a.studentId === student.id);
      const assignment = assignments.find(a => a.studentId === student.id);
      const score = attempt?.score ?? null;
      const isPassed = score !== null && score >= passingScore;

      return {
        id: attempt?.id || `unstarted-${student.id}-${packageId}`,
        attemptId: attempt?.id || null,
        studentId: student.id,
        studentName: student.name,
        studentEmail: student.email,
        classId: student.classId,
        className,
        packageId,
        packageTitle: pkgTitle,
        pageTitle,
        categoryName: catName,
        passingScore,
        score,
        status: (attempt?.status || 'NOT_STARTED') as any,
        startedAt: attempt?.startedAt || null,
        finishedAt: attempt?.finishedAt || null,
        assignedVariantId: assignment?.quizVariantId || null,
        isPassed,
      };
    });
  } else {
    // CASE 2: General view (All classes and/or all packages, or only one filter active)
    // Map all relevant attempts into report items
    reportItems = relevantAttempts.map(attempt => {
      const student = studentMap.get(attempt.studentId);
      const variant = variantMap.get(attempt.quizVariantId);
      const pkg = variant ? packageMap.get(variant.quizPackageId) : null;
      const pageObj = pkg ? pageMap.get(pkg.pageId) : null;
      const catName = pageObj ? (categoryMap.get(pageObj.categoryId) || 'Umum') : 'Umum';
      const className = (student?.classId && classMap.get(student.classId)) || 'Tanpa Kelas';
      const passingScore = pkg?.passingScore || 70;
      const score = attempt.score ?? null;
      const isPassed = score !== null && score >= passingScore;

      return {
        id: attempt.id,
        attemptId: attempt.id,
        studentId: attempt.studentId,
        studentName: student?.name || 'Murid Tidak Dikenal',
        studentEmail: student?.email || '-',
        classId: student?.classId || null,
        className,
        packageId: pkg?.id || '',
        packageTitle: pkg?.title || 'Kuis',
        pageTitle: pageObj?.title || pkg?.title || 'Halaman Kuis',
        categoryName: catName,
        passingScore,
        score,
        status: attempt.status as any,
        startedAt: attempt.startedAt || null,
        finishedAt: attempt.finishedAt || null,
        assignedVariantId: attempt.quizVariantId,
        isPassed,
      };
    });
  }

  // 3. Search query filter
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    reportItems = reportItems.filter(item => 
      item.studentName.toLowerCase().includes(q) ||
      item.studentEmail.toLowerCase().includes(q) ||
      item.className.toLowerCase().includes(q) ||
      item.pageTitle.toLowerCase().includes(q)
    );
  }

  // 4. SORTING:
  // "awalnya untuk ambil data terbaru tetapi berdasarkan kelasnya terlebih dahulu"
  // Rule:
  // A. Kelas (Classroom Name A-Z)
  // B. Data Terbaru (finishedAt / startedAt DESC)
  // C. Nilai Tertinggi
  // D. Nama Murid (A-Z)
  reportItems.sort((a, b) => {
    // A. Kelas terlebih dahulu
    const classA = a.className || 'ZZZ';
    const classB = b.className || 'ZZZ';
    const classComp = classA.localeCompare(classB);
    if (classComp !== 0) return classComp;

    // B. Data terbaru dalam kelas tersebut
    const timeA = a.finishedAt ? new Date(a.finishedAt).getTime() : (a.startedAt ? new Date(a.startedAt).getTime() : 0);
    const timeB = b.finishedAt ? new Date(b.finishedAt).getTime() : (b.startedAt ? new Date(b.startedAt).getTime() : 0);
    if (timeB !== timeA) {
      return timeB - timeA; // Paling baru terlebih dahulu
    }

    // C. Status penyelesaian (Selesai > Sedang Mengerjakan > Belum Mulai)
    const statusWeight: Record<string, number> = { COMPLETED: 1, GRADED: 1, IN_PROGRESS: 2, NOT_STARTED: 3 };
    const weightA = statusWeight[a.status] || 99;
    const weightB = statusWeight[b.status] || 99;
    if (weightA !== weightB) {
      return weightA - weightB;
    }

    // D. Skor lebih tinggi
    if ((b.score ?? -1) !== (a.score ?? -1)) {
      return (b.score ?? -1) - (a.score ?? -1);
    }

    // E. Nama murid alfabetis
    return a.studentName.localeCompare(b.studentName);
  });

  // 5. Statistics calculation across all matching items
  const totalRecords = reportItems.length;
  const completedItems = reportItems.filter(r => r.status === 'COMPLETED' || r.status === 'GRADED');
  const inProgressCount = reportItems.filter(r => r.status === 'IN_PROGRESS').length;
  const notStartedCount = reportItems.filter(r => r.status === 'NOT_STARTED').length;
  const passedCount = completedItems.filter(r => r.isPassed).length;

  const totalScore = completedItems.reduce((acc, curr) => acc + (curr.score || 0), 0);
  const averageScore = completedItems.length > 0 
    ? Math.round((totalScore / completedItems.length) * 10) / 10 
    : 0;

  // 6. Pagination (Default 50 data)
  const safeLimit = Math.max(1, limit || 50);
  const totalPages = Math.ceil(totalRecords / safeLimit) || 1;
  const safePage = Math.min(Math.max(1, page || 1), totalPages);
  const startIndex = (safePage - 1) * safeLimit;
  const paginatedItems = reportItems.slice(startIndex, startIndex + safeLimit);

  return {
    items: paginatedItems,
    pagination: {
      page: safePage,
      limit: safeLimit,
      totalItems: totalRecords,
      totalPages,
    },
    stats: {
      totalRecords,
      completedCount: completedItems.length,
      inProgressCount,
      notStartedCount,
      passedCount,
      averageScore,
    },
  };
}

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
    const aIsDone = a.status === 'COMPLETED' || a.status === 'GRADED';
    const bIsDone = b.status === 'COMPLETED' || b.status === 'GRADED';

    if (aIsDone && bIsDone) {
      if (b.score !== a.score) return b.score - a.score;
      const timeA = a.finishedAt ? new Date(a.finishedAt).getTime() : 0;
      const timeB = b.finishedAt ? new Date(b.finishedAt).getTime() : 0;
      return timeA - timeB;
    }
    
    if (aIsDone) return -1;
    if (bIsDone) return 1;

    if (a.status === 'IN_PROGRESS' && b.status !== 'IN_PROGRESS') return -1;
    if (b.status === 'IN_PROGRESS' && a.status !== 'IN_PROGRESS') return 1;

    return a.name.localeCompare(b.name);
  });

  const completedStudents = results.filter(r => r.status === 'COMPLETED' || r.status === 'GRADED');
  const sumScores = completedStudents.reduce((acc, curr) => acc + curr.score, 0);
  const averageScore = completedStudents.length > 0 ? (sumScores / completedStudents.length) : 0;

  return {
    leaderboard: results,
    stats: {
      totalStudents: students.length,
      completedCount: completedStudents.length,
      averageScore: Math.round(averageScore * 100) / 100,
    }
  };
}

export async function resetQuizAttempt(studentId: string, packageId: string, attemptId?: string) {
  let targetAttempt: any = null;

  if (attemptId) {
    targetAttempt = await db.orm.public.QuizAttempt.where({ id: attemptId }).first();
  }

  if (!targetAttempt) {
    const variants = await db.orm.public.QuizVariant.where({ quizPackageId: packageId }).all();
    const variantIds = variants.map(v => v.id);
    const attempts = await db.orm.public.QuizAttempt.where({ studentId }).all();
    targetAttempt = attempts.find(a => variantIds.includes(a.quizVariantId));
  }

  if (!targetAttempt) {
    throw new Error('Tidak ada riwayat kuis untuk di-reset');
  }

  // Delete all student answers associated with this attempt
  const answers = await db.orm.public.StudentAnswer.where({ quizAttemptId: targetAttempt.id }).all();
  for (const ans of answers) {
    await db.orm.public.StudentAnswer.where({ id: ans.id }).delete();
  }

  // Delete the attempt
  await db.orm.public.QuizAttempt.where({ id: targetAttempt.id }).delete();
  
  return true;
}

import { db } from '@/prisma/db';
import { randomUUID } from 'crypto';

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
  courseName: string;
  passingScore: number;
  score: number | null;
  status: 'COMPLETED' | 'GRADED' | 'IN_PROGRESS' | 'NOT_STARTED';
  startedAt: string | null;
  finishedAt: string | null;
  assignedVariantId: string | null;
  isPassed: boolean;
  hasEssay: boolean;
  needsReview: boolean;
  essayCount: number;
  totalQuestions: number;
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
    pendingReviewCount: number;
    essayQuizCount: number;
  };
}

export async function getQuizReports(params: {
  classId?: string;
  packageId?: string;
  courseId?: string;
  search?: string;
  page?: number;
  limit?: number;
  reviewFilter?: 'ALL' | 'NEED_REVIEW' | 'HAS_ESSAY' | 'GRADED' | 'NO_ESSAY';
  teacherId?: string;
}): Promise<QuizReportsResponse> {
  const { classId, packageId, courseId, search, page = 1, limit = 50, reviewFilter = 'ALL', teacherId } = params;

  // 1. Fetch reference collections including questions for essay detection
  const [classrooms, categories, pages, quizPackages, quizVariants, allStudents, allQuestions, courses, allStudentCourses] = await Promise.all([
    db.orm.public.Classroom.all(),
    db.orm.public.MaterialCategory.all(),
    db.orm.public.Page.all(),
    db.orm.public.QuizPackage.all(),
    db.orm.public.QuizVariant.all(),
    db.orm.public.User.where({ role: 'MURID' }).all(),
    db.orm.public.Question.all(),
    db.orm.public.Course.all(),
    db.orm.public.CourseStudent.all(),
  ]);

  // Lookup dictionaries
  const classMap = new Map(classrooms.map(c => [c.id, c.name]));
  const categoryMap = new Map(categories.map(c => [c.id, c]));
  const pageMap = new Map(pages.map(p => [p.id, p]));
  const packageMap = new Map(quizPackages.map(pkg => [pkg.id, pkg]));
  const variantMap = new Map(quizVariants.map(v => [v.id, v]));
  const studentMap = new Map(allStudents.map(s => [s.id, s]));
  const courseMap = new Map(courses.map(c => [c.id, c.name]));

  // Variant stats map: total questions and essay question count
  const variantQuestionMap = new Map<string, { total: number; essayCount: number }>();
  for (const q of allQuestions) {
    const cur = variantQuestionMap.get(q.quizVariantId) || { total: 0, essayCount: 0 };
    cur.total += 1;
    if (q.questionType === 'ESSAY') {
      cur.essayCount += 1;
    }
    variantQuestionMap.set(q.quizVariantId, cur);
  }

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

  // Teacher Filter
  if (teacherId) {
    const teacherCourses = await db.orm.public.CourseTeacher.where({ teacherId }).all();
    const validCourseIds = new Set(teacherCourses.map(c => c.courseId));
    
    // valid categories
    const validCategoryIds = new Set(
      categories.filter(c => c.courseId && validCourseIds.has(c.courseId)).map(c => c.id)
    );

    // valid pages
    const validPageIds = new Set(
      pages.filter(p => validCategoryIds.has(p.categoryId)).map(p => p.id)
    );

    // valid packages
    const validPackageIds = new Set(
      quizPackages.filter(p => p.pageId && validPageIds.has(p.pageId)).map(p => p.id)
    );

    targetVariants = targetVariants.filter(v => validPackageIds.has(v.quizPackageId));
  }

  // Course Filter (For Superadmin)
  if (courseId) {
    const validCategoryIds = new Set(
      categories.filter(c => c.courseId === courseId).map(c => c.id)
    );
    const validPageIds = new Set(
      pages.filter(p => validCategoryIds.has(p.categoryId)).map(p => p.id)
    );
    const validPackageIds = new Set(
      quizPackages.filter(p => p.pageId && validPageIds.has(p.pageId)).map(p => p.id)
    );
    targetVariants = targetVariants.filter(v => validPackageIds.has(v.quizPackageId));
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
    const cat = pageObj ? categoryMap.get(pageObj.categoryId) : null;
    const catName = cat ? cat.name : 'Umum';
    const courseId = cat?.courseId || null;
    const courseName = courseId ? (courseMap.get(courseId) || 'Tanpa Mata Pelajaran') : 'Tanpa Mata Pelajaran';
    const pkgTitle = pkg ? pkg.title : 'Kuis';
    const pageTitle = pageObj ? pageObj.title : pkgTitle;
    const passingScore = pkg?.passingScore || 70;
    const className = classMap.get(classId) || 'Kelas Tidak Diketahui';

    const assignments = await db.orm.public.QuizAssignment.where({ quizPackageId: packageId }).all();

    // Filter students by course enrollment
    const enrolledStudentIds = new Set(
      courseId 
        ? allStudentCourses.filter(cs => cs.courseId === courseId).map(cs => cs.studentId)
        : targetStudents.map(s => s.id) // If no course, everyone is enrolled
    );
    const validStudents = targetStudents.filter(s => enrolledStudentIds.has(s.id));

    reportItems = validStudents.map(student => {
      const attempt = relevantAttempts.find(a => a.studentId === student.id);
      const assignment = assignments.find(a => a.studentId === student.id);
      const score = attempt?.score ?? null;
      const isPassed = score !== null && score >= passingScore;

      const variantId = attempt?.quizVariantId || assignment?.quizVariantId || null;
      const variantInfo = variantId ? variantQuestionMap.get(variantId) : null;
      const essayCount = variantInfo?.essayCount || 0;
      const hasEssay = essayCount > 0;
      const totalQuestions = variantInfo?.total || 0;
      // Needs review if attempt is COMPLETED (or submitted) and has essay questions that need grading
      const needsReview = hasEssay && attempt?.status === 'COMPLETED';

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
        courseName,
        passingScore,
        score,
        status: (attempt?.status || 'NOT_STARTED') as any,
        startedAt: attempt?.startedAt || null,
        finishedAt: attempt?.finishedAt || null,
        assignedVariantId: variantId,
        isPassed,
        hasEssay,
        needsReview,
        essayCount,
        totalQuestions,
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
      const cat = pageObj ? categoryMap.get(pageObj.categoryId) : null;
      const catName = cat ? cat.name : 'Umum';
      const courseName = cat?.courseId ? (courseMap.get(cat.courseId) || 'Tanpa Mata Pelajaran') : 'Tanpa Mata Pelajaran';
      const className = (student?.classId && classMap.get(student.classId)) || 'Tanpa Kelas';
      const passingScore = pkg?.passingScore || 70;
      const score = attempt.score ?? null;
      const isPassed = score !== null && score >= passingScore;

      const variantInfo = attempt.quizVariantId ? variantQuestionMap.get(attempt.quizVariantId) : null;
      const essayCount = variantInfo?.essayCount || 0;
      const hasEssay = essayCount > 0;
      const totalQuestions = variantInfo?.total || 0;
      const needsReview = hasEssay && attempt.status === 'COMPLETED';

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
        courseName,
        passingScore,
        score,
        status: attempt.status as any,
        startedAt: attempt.startedAt || null,
        finishedAt: attempt.finishedAt || null,
        assignedVariantId: attempt.quizVariantId,
        isPassed,
        hasEssay,
        needsReview,
        essayCount,
        totalQuestions,
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

  // 4. Review / Essay filter
  if (reviewFilter === 'NEED_REVIEW') {
    reportItems = reportItems.filter(item => item.needsReview);
  } else if (reviewFilter === 'HAS_ESSAY') {
    reportItems = reportItems.filter(item => item.hasEssay);
  } else if (reviewFilter === 'GRADED') {
    reportItems = reportItems.filter(item => item.status === 'GRADED');
  } else if (reviewFilter === 'NO_ESSAY') {
    reportItems = reportItems.filter(item => !item.hasEssay);
  }

  // 5. SORTING:
  // Rule:
  // A. Kelas (Classroom Name A-Z)
  // B. Butuh Review Essay lebih dulu jika ada
  // C. Data Terbaru (finishedAt / startedAt DESC)
  // D. Nilai Tertinggi
  // E. Nama Murid (A-Z)
  reportItems.sort((a, b) => {
    // A. Kelas terlebih dahulu
    const classA = a.className || 'ZZZ';
    const classB = b.className || 'ZZZ';
    const classComp = classA.localeCompare(classB);
    if (classComp !== 0) return classComp;

    // B. Prioritaskan yang perlu review essay
    if (a.needsReview && !b.needsReview) return -1;
    if (!a.needsReview && b.needsReview) return 1;

    // C. Data terbaru dalam kelas tersebut
    const timeA = a.finishedAt ? new Date(a.finishedAt).getTime() : (a.startedAt ? new Date(a.startedAt).getTime() : 0);
    const timeB = b.finishedAt ? new Date(b.finishedAt).getTime() : (b.startedAt ? new Date(b.startedAt).getTime() : 0);
    if (timeB !== timeA) {
      return timeB - timeA;
    }

    // D. Status penyelesaian (Selesai > Sedang Mengerjakan > Belum Mulai)
    const statusWeight: Record<string, number> = { COMPLETED: 1, GRADED: 1, IN_PROGRESS: 2, NOT_STARTED: 3 };
    const weightA = statusWeight[a.status] || 99;
    const weightB = statusWeight[b.status] || 99;
    if (weightA !== weightB) {
      return weightA - weightB;
    }

    // E. Skor lebih tinggi
    if ((b.score ?? -1) !== (a.score ?? -1)) {
      return (b.score ?? -1) - (a.score ?? -1);
    }

    // F. Nama murid alfabetis
    return a.studentName.localeCompare(b.studentName);
  });

  // 6. Statistics calculation across all matching items
  const totalRecords = reportItems.length;
  const completedItems = reportItems.filter(r => r.status === 'COMPLETED' || r.status === 'GRADED');
  const inProgressCount = reportItems.filter(r => r.status === 'IN_PROGRESS').length;
  const notStartedCount = reportItems.filter(r => r.status === 'NOT_STARTED').length;
  const passedCount = completedItems.filter(r => r.isPassed).length;
  const pendingReviewCount = reportItems.filter(r => r.needsReview).length;
  const essayQuizCount = reportItems.filter(r => r.hasEssay).length;

  const totalScore = completedItems.reduce((acc, curr) => acc + (curr.score || 0), 0);
  const averageScore = completedItems.length > 0 
    ? Math.round((totalScore / completedItems.length) * 10) / 10 
    : 0;

  // 7. Pagination (Default 50 data)
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
      pendingReviewCount,
      essayQuizCount,
    },
  };
}

export async function getLeaderboardByPackageAndClass(packageId: string, classId: string) {
  const pkg = await db.orm.public.QuizPackage.where({ id: packageId }).first();
  const page = pkg ? await db.orm.public.Page.where({ id: pkg.pageId }).first() : null;
  const category = page ? await db.orm.public.MaterialCategory.where({ id: page.categoryId }).first() : null;
  const courseId = category?.courseId || null;

  const students = await db.orm.public.User.where({ classId, role: 'MURID' }).all();
  const studentCourses = courseId ? await db.orm.public.CourseStudent.where({ courseId }).all() : [];
  const enrolledStudentIds = new Set(
    courseId 
      ? studentCourses.map(cs => cs.studentId)
      : students.map(s => s.id)
  );
  
  const validStudents = students.filter(s => enrolledStudentIds.has(s.id));

  const variants = await db.orm.public.QuizVariant.where({ quizPackageId: packageId }).all();
  const variantIds = variants.map(v => v.id);
  const assignments = await db.orm.public.QuizAssignment.where({ quizPackageId: packageId }).all();
  const attempts = await db.orm.public.QuizAttempt.all();
  const relevantAttempts = attempts.filter(a => variantIds.includes(a.quizVariantId));

  const results = validStudents.map(student => {
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
      totalStudents: validStudents.length,
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

  const answers = await db.orm.public.StudentAnswer.where({ quizAttemptId: targetAttempt.id }).all();
  const previousScore = targetAttempt.score;
  const previousStatus = targetAttempt.status;
  const answerCount = answers.length;

  for (const ans of answers) {
    await db.orm.public.StudentAnswer.where({ id: ans.id }).delete();
  }

  await db.orm.public.QuizAttempt.where({ id: targetAttempt.id }).delete();
  
  return { attemptId: targetAttempt.id, studentId, previousScore, previousStatus, answerCount };
}

export async function getQuizAttemptDetail(attemptId: string) {
  const attempt = await db.orm.public.QuizAttempt.where({ id: attemptId }).first();
  if (!attempt) throw new Error('Riwayat kuis tidak ditemukan');

  const [student, variant, classrooms] = await Promise.all([
    db.orm.public.User.where({ id: attempt.studentId }).first(),
    db.orm.public.QuizVariant.where({ id: attempt.quizVariantId }).first(),
    db.orm.public.Classroom.all(),
  ]);

  if (!variant) throw new Error('Varian kuis tidak ditemukan');

  const [pkg, rawQuestions, rawOptions, rawAnswers] = await Promise.all([
    db.orm.public.QuizPackage.where({ id: variant.quizPackageId }).first(),
    db.orm.public.Question.where({ quizVariantId: variant.id }).all(),
    db.orm.public.QuestionOption.all(),
    db.orm.public.StudentAnswer.where({ quizAttemptId: attemptId }).all(),
  ]);

  let pageTitle = pkg?.title || 'Kuis';
  let categoryName = 'Umum';
  if (pkg?.pageId) {
    const page = await db.orm.public.Page.where({ id: pkg.pageId }).first();
    if (page) {
      pageTitle = page.title;
      const cat = await db.orm.public.MaterialCategory.where({ id: page.categoryId }).first();
      if (cat) categoryName = cat.name;
    }
  }

  const className = classrooms.find(c => c.id === student?.classId)?.name || 'Tanpa Kelas';

  const questions = rawQuestions.sort((a, b) => a.orderIndex - b.orderIndex).map(q => {
    const studentAns = rawAnswers.find(a => a.questionId === q.id);
    const options = rawOptions
      .filter(o => o.questionId === q.id)
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map(o => ({
        id: o.id,
        optionText: o.optionText,
        isCorrect: Boolean(o.isCorrect)
      }));

    return {
      id: q.id,
      questionText: q.questionText,
      questionType: q.questionType,
      points: Number(q.points) || 1,
      options,
      studentAnswer: studentAns ? {
        id: studentAns.id,
        selectedOptionId: studentAns.selectedOptionId,
        essayAnswer: studentAns.essayAnswer,
        isCorrect: studentAns.isCorrect,
        pointsEarned: Number(studentAns.pointsEarned) || 0
      } : null
    };
  });

  const totalMaxPoints = questions.reduce((sum, q) => sum + q.points, 0);
  const totalEarnedPoints = questions.reduce((sum, q) => sum + (q.studentAnswer?.pointsEarned || 0), 0);
  const essayQuestions = questions.filter(q => q.questionType === 'ESSAY');
  const hasEssay = essayQuestions.length > 0;
  const needsReview = hasEssay && attempt.status === 'COMPLETED';

  return {
    attempt: {
      id: attempt.id,
      score: attempt.score,
      status: attempt.status,
      startedAt: attempt.startedAt,
      finishedAt: attempt.finishedAt,
    },
    student: {
      id: student?.id || attempt.studentId,
      name: student?.name || 'Murid Tidak Dikenal',
      email: student?.email || '-',
      className,
    },
    package: {
      id: pkg?.id || variant.quizPackageId,
      title: pkg?.title || 'Kuis',
      pageTitle,
      categoryName,
      passingScore: pkg?.passingScore || 70,
    },
    variant: {
      id: variant.id,
      name: variant.name,
    },
    questions,
    totalMaxPoints,
    totalEarnedPoints,
    hasEssay,
    needsReview,
  };
}

export async function gradeQuizAttempt(
  attemptId: string, 
  essayGrades: { questionId: string; pointsEarned: number }[]
) {
  const attempt = await db.orm.public.QuizAttempt.where({ id: attemptId }).first();
  if (!attempt) throw new Error('Attempt tidak ditemukan');

  const variant = await db.orm.public.QuizVariant.where({ id: attempt.quizVariantId }).first();
  if (!variant) throw new Error('Variant kuis tidak ditemukan');
  const pkg = await db.orm.public.QuizPackage.where({ id: variant.quizPackageId }).first();

  const questions = await db.orm.public.Question.where({ quizVariantId: variant.id }).all();
  const questionMap = new Map(questions.map(q => [q.id, q]));

  // Update or insert StudentAnswer for each graded essay question
  const existingAnswers = await db.orm.public.StudentAnswer.where({ quizAttemptId: attemptId }).all();

  for (const grade of essayGrades) {
    const q = questionMap.get(grade.questionId);
    if (!q || q.questionType !== 'ESSAY') continue;

    const clampedPoints = Math.max(0, Math.min(q.points, Number(grade.pointsEarned) || 0));
    const ans = existingAnswers.find(a => a.questionId === grade.questionId);

    if (ans) {
      await db.orm.public.StudentAnswer.where({ id: ans.id }).update({
        pointsEarned: clampedPoints,
        isCorrect: clampedPoints > 0
      });
    } else {
      await db.orm.public.StudentAnswer.create({
        id: randomUUID(),
        quizAttemptId: attemptId,
        questionId: grade.questionId,
        selectedOptionId: null,
        essayAnswer: null,
        isCorrect: clampedPoints > 0,
        pointsEarned: clampedPoints
      });
    }
  }

  // Refetch all answers to calculate new score
  const updatedAnswers = await db.orm.public.StudentAnswer.where({ quizAttemptId: attemptId }).all();
  
  let totalEarned = 0;
  let totalPossible = 0;

  for (const q of questions) {
    totalPossible += q.points;
    const ans = updatedAnswers.find(a => a.questionId === q.id);
    if (ans) {
      totalEarned += (ans.pointsEarned || 0);
    }
  }

  const finalScore = totalPossible > 0 ? (totalEarned / totalPossible) * 100 : 0;
  const roundedScore = Math.round(finalScore * 100) / 100;

  // Update QuizAttempt to GRADED and new score
  await db.orm.public.QuizAttempt.where({ id: attemptId }).update({
    score: roundedScore,
    status: 'GRADED'
  });

  // Prerequisite Unlocking Logic
  const passed = roundedScore >= (pkg?.passingScore || 70);
  
  // Previous score
  const beforeScore = attempt.score;

  if (passed && pkg?.pageId) {
    // 1. Mark CURRENT page as COMPLETED
    const currentPageAccess = await db.orm.public.PageAccess.where({
      pageId: pkg.pageId,
      studentId: attempt.studentId
    }).first();

    if (currentPageAccess) {
      if (currentPageAccess.status !== 'COMPLETED') {
        await db.orm.public.PageAccess.where({ id: currentPageAccess.id }).update({
          status: 'COMPLETED',
          completedAt: new Date().toISOString()
        });
      }
    } else {
      await db.orm.public.PageAccess.create({
        id: randomUUID(),
        pageId: pkg.pageId,
        studentId: attempt.studentId,
        status: 'COMPLETED',
        unlockedAt: new Date().toISOString(),
        completedAt: new Date().toISOString()
      });
    }

    // 2. Unlock next pages based on PageSequence
    const sequences = await db.orm.public.PageSequence.where({ prerequisitePageId: pkg.pageId }).all();
    for (const seq of sequences) {
      const existingAccess = await db.orm.public.PageAccess.where({ 
        pageId: seq.pageId, 
        studentId: attempt.studentId 
      }).first();

      if (existingAccess) {
        if (existingAccess.status === 'LOCKED') {
          await db.orm.public.PageAccess.where({ id: existingAccess.id }).update({
            status: 'UNLOCKED',
            unlockedAt: new Date().toISOString()
          });
        }
      } else {
        await db.orm.public.PageAccess.create({
          id: randomUUID(),
          pageId: seq.pageId,
          studentId: attempt.studentId,
          status: 'UNLOCKED',
          unlockedAt: new Date().toISOString()
        });
      }
    }
  }

  return {
    success: true,
    score: roundedScore,
    isPassed: passed,
    status: 'GRADED' as const,
    beforeScore,
    gradedCount: essayGrades.length,
    studentId: attempt.studentId
  };
}

export interface UnfinishedStudentItem {
  studentId: string;
  studentName: string;
  studentEmail: string;
  classId: string | null;
  className: string;
  totalPublishedPages: number;
  openedPageCount: number;
  unopenedPageCount: number;
  unopenedPagePercent: number;
  totalActiveQuizzes: number;
  completedQuizCount: number;
  uncompletedQuizCount: number;
  uncompletedQuizPercent: number;
  unopenedPagesSummary: { id: string; title: string; categoryName: string; orderIndex: number }[];
  uncompletedQuizzesSummary: { packageId: string; title: string; pageTitle: string; categoryName: string; passingScore: number }[];
}

export interface UnfinishedStudentsResponse {
  items: UnfinishedStudentItem[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
  stats: {
    totalStudents: number;
    studentsWithIncompleteQuiz: number;
    studentsWithLockedPages: number;
    totalAllPages: number;
    totalAllQuizzes: number;
  };
}

export async function getUnfinishedStudentsReport(params: {
  classId?: string;
  packageId?: string;
  courseId?: string;
  filterMode?: 'ALL' | 'QUIZ_ONLY' | 'PAGE_ONLY';
  sortBy?: 'UNOPENED_DESC' | 'UNOPENED_ASC' | 'UNCOMPLETED_QUIZ_DESC' | 'NAME_ASC' | 'NAME_DESC';
  search?: string;
  page?: number;
  limit?: number;
  teacherId?: string;
}): Promise<UnfinishedStudentsResponse> {
  const {
    classId,
    packageId,
    courseId,
    filterMode = 'ALL',
    sortBy = 'UNOPENED_DESC',
    search,
    page = 1,
    limit = 50,
    teacherId
  } = params;

  // 1. Fetch collections in parallel
  const [
    allStudents,
    classrooms,
    allCategories,
    allPages,
    sequences,
    allPageAccesses,
    allPackages,
    allVariants,
    allAttempts,
    allStudentCourses,
    allCourseTeachers
  ] = await Promise.all([
    db.orm.public.User.where({ role: 'MURID' }).all(),
    db.orm.public.Classroom.all(),
    db.orm.public.MaterialCategory.where({ isActive: true }).all(),
    db.orm.public.Page.where({ isPublished: true }).all(),
    db.orm.public.PageSequence.all(),
    db.orm.public.PageAccess.all(),
    db.orm.public.QuizPackage.where({ isActive: true }).all(),
    db.orm.public.QuizVariant.all(),
    db.orm.public.QuizAttempt.all(),
    db.orm.public.CourseStudent.all(),
    db.orm.public.CourseTeacher.all(),
  ]);

  // Lookup maps
  const classMap = new Map(classrooms.map(c => [c.id, c.name]));
  const categoryMap = new Map(allCategories.map(c => [c.id, c.name]));
  const pageMap = new Map(allPages.map(p => [p.id, p]));

  // Teacher & Course Filter
  let validCategoryIds = new Set(allCategories.map(c => c.id));
  if (teacherId) {
    const teacherCourseIds = new Set(allCourseTeachers.filter(t => t.teacherId === teacherId).map(t => t.courseId));
    validCategoryIds = new Set(allCategories.filter(c => c.courseId && teacherCourseIds.has(c.courseId)).map(c => c.id));
  }
  if (courseId) {
    // If courseId is provided, intersect with validCategoryIds
    validCategoryIds = new Set(
      allCategories.filter(c => c.courseId === courseId && validCategoryIds.has(c.id)).map(c => c.id)
    );
  }
  const filteredPages = allPages.filter(p => validCategoryIds.has(p.categoryId));
  const filteredPageIds = new Set(filteredPages.map(p => p.id));
  const filteredPackages = allPackages.filter(p => p.pageId && filteredPageIds.has(p.pageId));

  // Active quiz packages (filter by packageId if specified)
  const targetPackages = packageId 
    ? filteredPackages.filter(p => p.id === packageId)
    : filteredPackages;

  // Filter students by class if specified
  let targetStudents = allStudents;
  if (classId) {
    targetStudents = targetStudents.filter(s => s.classId === classId);
  }

  // Pre-index data for fast lookups
  const accessByStudent = new Map<string, typeof allPageAccesses>();
  for (const acc of allPageAccesses) {
    const list = accessByStudent.get(acc.studentId) || [];
    list.push(acc);
    accessByStudent.set(acc.studentId, list);
  }

  const attemptsByStudent = new Map<string, typeof allAttempts>();
  for (const att of allAttempts) {
    const list = attemptsByStudent.get(att.studentId) || [];
    list.push(att);
    attemptsByStudent.set(att.studentId, list);
  }

  const packageVariantsMap = new Map<string, string[]>();
  for (const v of allVariants) {
    const list = packageVariantsMap.get(v.quizPackageId) || [];
    list.push(v.id);
    packageVariantsMap.set(v.quizPackageId, list);
  }

  const pageQuizPackageMap = new Map<string, typeof allPackages[0]>();
  for (const pkg of allPackages) {
    pageQuizPackageMap.set(pkg.pageId, pkg);
  }

  // Compute for each student
  const studentReports: UnfinishedStudentItem[] = targetStudents.map(student => {
    const studentAccesses = accessByStudent.get(student.id) || [];
    const studentAttempts = attemptsByStudent.get(student.id) || [];

    // Filter pages and packages by student's courses
    const studentCourseIds = allStudentCourses.filter(cs => cs.studentId === student.id).map(cs => cs.courseId);
    const studentCategories = allCategories.filter(c => c.courseId && studentCourseIds.includes(c.courseId));
    const studentCategoryIds = new Set(studentCategories.map(c => c.id));
    const studentPages = filteredPages.filter(p => studentCategoryIds.has(p.categoryId));
    const studentPageIds = new Set(studentPages.map(p => p.id));
    const studentPackages = targetPackages.filter(pkg => pkg.pageId && studentPageIds.has(pkg.pageId));

    // Helper: is page unlocked for this student?
    const isPageUnlocked = (p: typeof filteredPages[0]): boolean => {
      const explicit = studentAccesses.find(a => a.pageId === p.id);
      if (explicit && (explicit.status === 'UNLOCKED' || explicit.status === 'COMPLETED')) return true;
      if (explicit && explicit.status === 'LOCKED') return false;

      const seq = sequences.find(s => s.pageId === p.id);
      if (!seq || !seq.prerequisitePageId) return true; // No prerequisite

      const prereqPkg = pageQuizPackageMap.get(seq.prerequisitePageId);
      if (prereqPkg) {
        const variantIds = packageVariantsMap.get(prereqPkg.id) || [];
        const passedAttempt = studentAttempts.find(
          a => variantIds.includes(a.quizVariantId) && 
               (a.status === 'COMPLETED' || a.status === 'GRADED') && 
               (a.score ?? 0) >= seq.minQuizScore
        );
        return Boolean(passedAttempt);
      } else {
        const prereqAcc = studentAccesses.find(a => a.pageId === seq.prerequisitePageId);
        return prereqAcc?.status === 'COMPLETED';
      }
    };

    // Calculate Page Access status
    const unopenedPagesSummary: { id: string; title: string; categoryName: string; orderIndex: number }[] = [];
    let openedPageCount = 0;

    for (const p of studentPages) {
      if (isPageUnlocked(p)) {
        openedPageCount++;
      } else {
        unopenedPagesSummary.push({
          id: p.id,
          title: p.title,
          categoryName: categoryMap.get(p.categoryId) || 'Umum',
          orderIndex: p.orderIndex,
        });
      }
    }

    unopenedPagesSummary.sort((a, b) => a.orderIndex - b.orderIndex);

    const totalPublishedPages = studentPages.length;
    const unopenedPageCount = unopenedPagesSummary.length;

    // Calculate Quiz Completion status
    const uncompletedQuizzesSummary: { packageId: string; title: string; pageTitle: string; categoryName: string; passingScore: number }[] = [];
    let completedQuizCount = 0;

    for (const pkg of studentPackages) {
      const vIds = packageVariantsMap.get(pkg.id) || [];
      const attempt = studentAttempts.find(a => vIds.includes(a.quizVariantId));
      const isDone = attempt && (attempt.status === 'COMPLETED' || attempt.status === 'GRADED');

      if (isDone) {
        completedQuizCount++;
      } else {
        const pageObj = pageMap.get(pkg.pageId);
        uncompletedQuizzesSummary.push({
          packageId: pkg.id,
          title: pkg.title,
          pageTitle: pageObj?.title || pkg.title,
          categoryName: pageObj ? (categoryMap.get(pageObj.categoryId) || 'Umum') : 'Umum',
          passingScore: pkg.passingScore,
        });
      }
    }

    const totalActiveQuizzes = studentPackages.length;
    const uncompletedQuizCount = totalActiveQuizzes - completedQuizCount;

    return {
      studentId: student.id,
      studentName: student.name,
      studentEmail: student.email,
      classId: student.classId,
      className: (student.classId && classMap.get(student.classId)) || 'Tanpa Kelas',
      totalPublishedPages,
      openedPageCount,
      unopenedPageCount,
      unopenedPagePercent: totalPublishedPages > 0 ? Math.round((unopenedPageCount / totalPublishedPages) * 100) : 0,
      totalActiveQuizzes,
      completedQuizCount,
      uncompletedQuizCount,
      uncompletedQuizPercent: totalActiveQuizzes > 0 ? Math.round((uncompletedQuizCount / totalActiveQuizzes) * 100) : 0,
      unopenedPagesSummary,
      uncompletedQuizzesSummary,
    };
  });

  // Filter Mode:
  let filteredItems = studentReports;
  if (filterMode === 'QUIZ_ONLY') {
    filteredItems = filteredItems.filter(item => item.uncompletedQuizCount > 0);
  } else if (filterMode === 'PAGE_ONLY') {
    filteredItems = filteredItems.filter(item => item.unopenedPageCount > 0);
  } else {
    filteredItems = filteredItems.filter(item => item.uncompletedQuizCount > 0 || item.unopenedPageCount > 0);
  }

  // Search filter
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    filteredItems = filteredItems.filter(item => 
      item.studentName.toLowerCase().includes(q) ||
      item.studentEmail.toLowerCase().includes(q) ||
      item.className.toLowerCase().includes(q)
    );
  }

  // Sorting
  filteredItems.sort((a, b) => {
    if (sortBy === 'UNOPENED_DESC') {
      if (b.unopenedPageCount !== a.unopenedPageCount) {
        return b.unopenedPageCount - a.unopenedPageCount;
      }
      if (b.uncompletedQuizCount !== a.uncompletedQuizCount) {
        return b.uncompletedQuizCount - a.uncompletedQuizCount;
      }
      return a.studentName.localeCompare(b.studentName);
    }

    if (sortBy === 'UNOPENED_ASC') {
      if (a.unopenedPageCount !== b.unopenedPageCount) {
        return a.unopenedPageCount - b.unopenedPageCount;
      }
      return a.studentName.localeCompare(b.studentName);
    }

    if (sortBy === 'UNCOMPLETED_QUIZ_DESC') {
      if (b.uncompletedQuizCount !== a.uncompletedQuizCount) {
        return b.uncompletedQuizCount - a.uncompletedQuizCount;
      }
      if (b.unopenedPageCount !== a.unopenedPageCount) {
        return b.unopenedPageCount - a.unopenedPageCount;
      }
      return a.studentName.localeCompare(b.studentName);
    }

    if (sortBy === 'NAME_DESC') {
      return b.studentName.localeCompare(a.studentName);
    }

    // Default NAME_ASC
    return a.studentName.localeCompare(b.studentName);
  });

  // Overall Stats across targetStudents
  const studentsWithIncompleteQuiz = studentReports.filter(s => s.uncompletedQuizCount > 0).length;
  const studentsWithLockedPages = studentReports.filter(s => s.unopenedPageCount > 0).length;

  // Pagination
  const totalItems = filteredItems.length;
  const safeLimit = Math.max(1, limit || 50);
  const totalPages = Math.ceil(totalItems / safeLimit) || 1;
  const safePage = Math.min(Math.max(1, page || 1), totalPages);
  const startIndex = (safePage - 1) * safeLimit;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + safeLimit);

  return {
    items: paginatedItems,
    pagination: {
      page: safePage,
      limit: safeLimit,
      totalItems,
      totalPages,
    },
    stats: {
      totalStudents: targetStudents.length,
      studentsWithIncompleteQuiz,
      studentsWithLockedPages,
      totalAllPages: allPages.length,
      totalAllQuizzes: targetPackages.length,
    },
  };
}

export interface TaskRecapItem {
  packageId: string;
  packageTitle: string;
  pageTitle: string;
  categoryName: string;
  courseName: string;
  orderIndex: number; // page.orderIndex for sorting
  passingScore: number;
  stats: {
    totalStudents: number;
    completedCount: number;
    needReviewCount: number;
    averageScore: number;
  };
  studentAttempts: QuizReportItem[];
}

export interface TaskRecapResponse {
  items: TaskRecapItem[];
}

export async function getTaskRecapList(params: {
  classId?: string;
  courseId?: string;
  teacherId?: string;
}): Promise<TaskRecapResponse> {
  const { classId, courseId, teacherId } = params;

  // We can leverage the existing getQuizReports logic which already handles all the joining and formatting.
  // We just fetch all attempts for the specified class, then group them by package.
  const baseData = await getQuizReports({
    classId,
    courseId,
    teacherId,
    limit: 10000, // Fetch all for grouping
    page: 1
  });

  const allPackages = await db.orm.public.QuizPackage.all();
  const allPages = await db.orm.public.Page.all();
  const allCategories = await db.orm.public.MaterialCategory.all();
  const courses = await db.orm.public.Course.all();

  const packageMap = new Map(allPackages.map(p => [p.id, p]));
  const pageMap = new Map(allPages.map(p => [p.id, p]));
  const catMap = new Map(allCategories.map(c => [c.id, c]));
  const courseMap = new Map(courses.map(c => [c.id, c.name]));

  // Find all active packages
  const activePackages = allPackages.filter(p => p.isActive);
  
  // Create a map to group student attempts by packageId
  const attemptsByPackage = new Map<string, QuizReportItem[]>();
  for (const item of baseData.items) {
    if (!item.packageId) continue;
    const list = attemptsByPackage.get(item.packageId) || [];
    list.push(item);
    attemptsByPackage.set(item.packageId, list);
  }

  const items: TaskRecapItem[] = [];

  for (const pkg of activePackages) {
    const page = pageMap.get(pkg.pageId);
    if (!page) continue;
    const category = catMap.get(page.categoryId);
    const catName = category?.name || 'Umum';
    const courseName = category?.courseId ? (courseMap.get(category.courseId) || 'Tanpa Mata Pelajaran') : 'Tanpa Mata Pelajaran';

    const attempts = attemptsByPackage.get(pkg.id) || [];
    
    // Because baseData limits total records by students * variants,
    // if a student hasn't started, getQuizReports still returns 'NOT_STARTED' records for them!
    // So 'attempts' naturally contains all students in the class.

    const completedAttempts = attempts.filter(a => a.status === 'COMPLETED' || a.status === 'GRADED');
    const needReviewCount = attempts.filter(a => a.needsReview).length;
    
    const sumScore = completedAttempts.reduce((acc, a) => acc + (a.score || 0), 0);
    const avg = completedAttempts.length > 0 ? Math.round((sumScore / completedAttempts.length) * 10) / 10 : 0;

    items.push({
      packageId: pkg.id,
      packageTitle: pkg.title,
      pageTitle: page.title,
      categoryName: catName,
      courseName,
      orderIndex: (category?.orderIndex || 0) * 1000 + page.orderIndex,
      passingScore: pkg.passingScore,
      stats: {
        totalStudents: attempts.length,
        completedCount: completedAttempts.length,
        needReviewCount,
        averageScore: avg
      },
      studentAttempts: attempts.sort((a, b) => a.studentName.localeCompare(b.studentName))
    });
  }

  // Sort tasks primarily by category and then by page order
  items.sort((a, b) => a.orderIndex - b.orderIndex);

  return { items };
}

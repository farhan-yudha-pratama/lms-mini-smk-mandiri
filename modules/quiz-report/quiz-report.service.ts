import { db } from '@/prisma/db';
import { randomUUID } from 'crypto';
import {
  isClassAllowedForCourse,
  isPackageAllowedForScope,
  resolvePackageCourseIds,
  type TeacherScope,
} from '@/modules/course/teacher-scope.service';
import { canEditGroupForScope, isGroupVisibleToScope } from '@/modules/quiz-group/quiz-group.service';

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
  isGroupTask?: boolean;
  groupId?: string | null;
  groupName?: string | null;
  groupBaseScore?: number | null;
  scoreOverride?: number | null;
  submitterName?: string | null;
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

export async function assertCanAccessAttempt(scope: TeacherScope, attemptId: string) {
  if (scope.isUnrestricted) return;

  const attempt = await db.orm.public.QuizAttempt.where({ id: attemptId }).first();
  if (!attempt) throw new Error('Riwayat kuis tidak ditemukan');

  if ((attempt as any).groupId) {
    const group = await db.orm.public.ClassGroup.where({ id: (attempt as any).groupId }).first();
    if (!group || !isGroupVisibleToScope(group, scope) || !isClassAllowedForCourse(scope, group.courseId, group.classroomId)) {
      throw new Error('FORBIDDEN');
    }
    return;
  }

  const [student, variant] = await Promise.all([
    db.orm.public.User.where({ id: attempt.studentId }).first(),
    db.orm.public.QuizVariant.where({ id: attempt.quizVariantId }).first(),
  ]);
  if (!variant) throw new Error('Varian kuis tidak ditemukan');

  const pkg = await db.orm.public.QuizPackage.where({ id: variant.quizPackageId }).first();
  if (!pkg) throw new Error('Paket kuis tidak ditemukan');

  const [pages, categories] = await Promise.all([
    pkg.pageId ? db.orm.public.Page.where({ id: pkg.pageId }).all() : Promise.resolve([]),
    db.orm.public.MaterialCategory.all(),
  ]);
  const pageMap = new Map(pages.map(p => [p.id, p]));
  const categoryMap = new Map(categories.map(c => [c.id, c]));

  const { candidateCourseIds } = resolvePackageCourseIds(pkg, pageMap, categoryMap);
  const allowed = candidateCourseIds.some(cId => isClassAllowedForCourse(scope, cId, student?.classId));
  if (!allowed) {
    throw new Error('FORBIDDEN');
  }
}

export async function assertCanAccessStudentPackage(scope: TeacherScope, studentId: string, packageId: string) {
  if (scope.isUnrestricted) return;

  const [student, pkg] = await Promise.all([
    db.orm.public.User.where({ id: studentId }).first(),
    db.orm.public.QuizPackage.where({ id: packageId }).first(),
  ]);
  if (!pkg) throw new Error('Paket kuis tidak ditemukan');

  const [pages, categories] = await Promise.all([
    pkg.pageId ? db.orm.public.Page.where({ id: pkg.pageId }).all() : Promise.resolve([]),
    db.orm.public.MaterialCategory.all(),
  ]);
  const pageMap = new Map(pages.map(p => [p.id, p]));
  const categoryMap = new Map(categories.map(c => [c.id, c]));

  const { candidateCourseIds } = resolvePackageCourseIds(pkg, pageMap, categoryMap);
  const allowed = candidateCourseIds.some(cId => isClassAllowedForCourse(scope, cId, student?.classId));
  if (!allowed) {
    throw new Error('FORBIDDEN');
  }
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
  scope?: TeacherScope;
}): Promise<QuizReportsResponse> {
  const { classId, packageId, courseId, search, page = 1, limit = 50, reviewFilter = 'ALL', teacherId, scope } = params;

  // 1. Fetch reference collections including questions and class groups
  const [classrooms, categories, pages, quizPackages, quizVariants, allStudents, allQuestions, courses, allStudentCourses, allAnswers, allClassGroups, allGroupMembers] = await Promise.all([
    db.orm.public.Classroom.all(),
    db.orm.public.MaterialCategory.all(),
    db.orm.public.Page.all(),
    db.orm.public.QuizPackage.all(),
    db.orm.public.QuizVariant.all(),
    db.orm.public.User.where({ role: 'MURID' }).all(),
    db.orm.public.Question.all(),
    db.orm.public.Course.all(),
    db.orm.public.CourseStudent.all(),
    db.orm.public.StudentAnswer.all(),
    db.orm.public.ClassGroup.all(),
    db.orm.public.ClassGroupMember.all(),
  ]);

  const classGroupMap = new Map(allClassGroups.map(g => [g.id, g]));
  const groupMembersByGroup = new Map<string, typeof allGroupMembers>();
  for (const gm of allGroupMembers) {
    if (!groupMembersByGroup.has(gm.groupId)) groupMembersByGroup.set(gm.groupId, []);
    groupMembersByGroup.get(gm.groupId)!.push(gm);
  }

  // Lookup dictionaries
  const classMap = new Map(classrooms.map(c => [c.id, c.name]));
  const categoryMap = new Map(categories.map(c => [c.id, c]));
  const pageMap = new Map(pages.map(p => [p.id, p]));
  const packageMap = new Map(quizPackages.map(pkg => [pkg.id, pkg]));
  const variantMap = new Map(quizVariants.map(v => [v.id, v]));
  const studentMap = new Map(allStudents.map(s => [s.id, s]));
  const courseMap = new Map(courses.map(c => [c.id, c.name]));

  const isManualReview = (q: any) =>
    q.questionType === 'ESSAY' ||
    (q.questionType === 'CODE_CHALLENGE' && q.codeLanguage?.toLowerCase() !== 'sql' && !(q.codeLanguage?.toLowerCase() === 'php' && Boolean(q.testCases)));

  // Variant stats map: total questions and essay question count
  const variantQuestionMap = new Map<string, { total: number; essayCount: number }>();
  for (const q of allQuestions) {
    const cur = variantQuestionMap.get(q.quizVariantId) || { total: 0, essayCount: 0 };
    cur.total += 1;
    if (isManualReview(q)) {
      cur.essayCount += 1;
    }
    variantQuestionMap.set(q.quizVariantId, cur);
  }

  // Variant essay questions map
  const variantEssayMap = new Map<string, string[]>();
  for (const q of allQuestions) {
    if (isManualReview(q)) {
      if (!variantEssayMap.has(q.quizVariantId)) {
        variantEssayMap.set(q.quizVariantId, []);
      }
      variantEssayMap.get(q.quizVariantId)!.push(q.id);
    }
  }

  // Attempt answers map: attemptId -> answers
  const attemptAnswerMap = new Map<string, any[]>();
  for (const ans of allAnswers) {
    if (!attemptAnswerMap.has(ans.quizAttemptId)) {
      attemptAnswerMap.set(ans.quizAttemptId, []);
    }
    attemptAnswerMap.get(ans.quizAttemptId)!.push(ans);
  }

  // Filter students if classId provided (and enforce scope class boundary)
  let targetStudents = allStudents;
  if (scope && !scope.isUnrestricted) {
    targetStudents = targetStudents.filter(s => s.classId && scope.allowedClassIds.has(s.classId));
  }
  if (classId) {
    targetStudents = targetStudents.filter(s => s.classId === classId);
  }
  const targetStudentIds = new Set(targetStudents.map(s => s.id));

  // Filter variants if packageId provided
  let targetVariants = quizVariants;
  if (packageId) {
    targetVariants = targetVariants.filter(v => v.quizPackageId === packageId);
  }

  // Teacher / Scope Filter (includes both page-linked AND standalone course packages)
  if (scope && !scope.isUnrestricted) {
    const validPackageIds = new Set(
      quizPackages
        .filter(p => isPackageAllowedForScope(scope, p, pageMap, categoryMap))
        .map(p => p.id)
    );
    targetVariants = targetVariants.filter(v => validPackageIds.has(v.quizPackageId));
  } else if (teacherId) {
    const teacherCourses = await db.orm.public.CourseTeacher.where({ teacherId }).all();
    const validCourseIds = new Set(teacherCourses.map(c => c.courseId));
    const validPackageIds = new Set(
      quizPackages
        .filter(p => {
          const { candidateCourseIds } = resolvePackageCourseIds(p, pageMap, categoryMap);
          return candidateCourseIds.some(cId => validCourseIds.has(cId));
        })
        .map(p => p.id)
    );
    targetVariants = targetVariants.filter(v => validPackageIds.has(v.quizPackageId));
  }

  // Course Filter
  if (courseId) {
    const validPackageIds = new Set(
      quizPackages
        .filter(p => {
          const { candidateCourseIds } = resolvePackageCourseIds(p, pageMap, categoryMap);
          return candidateCourseIds.includes(courseId);
        })
        .map(p => p.id)
    );
    targetVariants = targetVariants.filter(v => validPackageIds.has(v.quizPackageId));
  }

  const targetVariantIds = new Set(targetVariants.map(v => v.id));

  // 2. Fetch attempts
  const allAttempts = await db.orm.public.QuizAttempt.all();
  const relevantAttempts = allAttempts.filter(a => {
    if (!targetVariantIds.has(a.quizVariantId)) return false;

    const aGroupId = (a as any).groupId as string | null;
    if (aGroupId) {
      const group = classGroupMap.get(aGroupId);
      if (!group) return false;
      if (scope && !isGroupVisibleToScope(group, scope)) return false;
      if (classId && group.classroomId !== classId) return false;
      const gMembers = groupMembersByGroup.get(group.id) || [];
      const hasTargetMember = gMembers.some(m => targetStudentIds.has(m.studentId));
      if (!hasTargetMember && !targetStudentIds.has(a.studentId)) return false;
      if (scope && !scope.isUnrestricted) {
        return isClassAllowedForCourse(scope, group.courseId, group.classroomId);
      }
      return true;
    }

    if (!targetStudentIds.has(a.studentId)) return false;
    if (scope && !scope.isUnrestricted) {
      const student = studentMap.get(a.studentId);
      const variant = variantMap.get(a.quizVariantId);
      const pkg = variant ? packageMap.get(variant.quizPackageId) : null;
      if (!pkg || !student?.classId) return false;
      const { candidateCourseIds } = resolvePackageCourseIds(pkg, pageMap, categoryMap);
      return candidateCourseIds.some(cId => isClassAllowedForCourse(scope, cId, student.classId));
    }
    return true;
  });

  // ponytail: Auto-sync setiap status 'GRADED' yang lulus KKM menjadi 'COMPLETED' (Sukses)
  for (const a of relevantAttempts) {
    if (a.status === 'GRADED') {
      const v = variantMap.get(a.quizVariantId);
      const p = v ? packageMap.get(v.quizPackageId) : null;
      const passing = p?.passingScore || 70;
      if (a.score !== null && a.score !== undefined && a.score >= passing) {
        a.status = 'COMPLETED';
        db.orm.public.QuizAttempt.where({ id: a.id }).update({
          status: 'COMPLETED',
          finishedAt: a.finishedAt || new Date().toISOString()
        }).catch(err => console.error('Failed to auto-update attempt status:', err));

        if (p?.pageId) {
          db.orm.public.PageAccess.where({ pageId: p.pageId, studentId: a.studentId }).update({
            status: 'COMPLETED',
            completedAt: new Date().toISOString()
          }).catch(() => {});
        }

        import('@/modules/quiz-completion/quiz-completion.service')
          .then(({ recordQuizCompletion }) => recordQuizCompletion(a.id))
          .catch(() => {});
      }
    }
  }

  let reportItems: QuizReportItem[] = [];

  // CASE 1: Both classId and packageId are specified -> show all students in that class for that package
  if (classId && packageId) {
    const pkg = packageMap.get(packageId);
    const pageObj = pkg?.pageId ? pageMap.get(pkg.pageId) : null;
    const cat = pageObj ? categoryMap.get(pageObj.categoryId) : null;
    const catName = cat ? cat.name : (pkg && !pkg.pageId ? 'Tugas Mandiri' : 'Umum');
    const resolvedCourses = pkg ? resolvePackageCourseIds(pkg, pageMap, categoryMap) : { primaryCourseId: null, candidateCourseIds: [] };
    const resolvedCourseId = resolvedCourses.primaryCourseId;
    const courseName = resolvedCourseId ? (courseMap.get(resolvedCourseId) || 'Tanpa Mata Pelajaran') : 'Tanpa Mata Pelajaran';
    const pkgTitle = pkg ? pkg.title : 'Kuis';
    const pageTitle = pageObj ? pageObj.title : pkgTitle;
    const passingScore = pkg?.passingScore || 70;
    const className = classMap.get(classId) || 'Kelas Tidak Diketahui';

    const canAccessClassAndPackage =
      !scope ||
      scope.isUnrestricted ||
      (Boolean(pkg) && resolvedCourses.candidateCourseIds.some(cId => isClassAllowedForCourse(scope, cId, classId)));

    if (!canAccessClassAndPackage || !pkg) {
      reportItems = [];
    } else if ((pkg as any).assignmentMode === 'GROUP') {
      const visibleGroups = allClassGroups
        .filter(
          g =>
            g.quizPackageId === packageId &&
            g.classroomId === classId &&
            (!scope || isGroupVisibleToScope(g, scope))
        )
        .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

      reportItems = [];
      for (const group of visibleGroups) {
        const attempt = relevantAttempts.find(a => (a as any).groupId === group.id) || null;
        const members = groupMembersByGroup.get(group.id) || [];
        const variantId = attempt?.quizVariantId || group.quizVariantId || null;
        const variantInfo = variantId ? variantQuestionMap.get(variantId) : null;
        const essayCount = variantInfo?.essayCount || 0;
        const hasEssay = essayCount > 0;
        const totalQuestions = variantInfo?.total || 0;

        let needsReview = false;
        if (hasEssay && attempt && attempt.status !== 'IN_PROGRESS' && attempt.status !== 'GRADED') {
          const attemptAnswers = attemptAnswerMap.get(attempt.id) || [];
          const variantEssayIds = variantId ? (variantEssayMap.get(variantId) || []) : [];
          needsReview = variantEssayIds.some(qId => {
            const ans = attemptAnswers.find(a => a.questionId === qId);
            return !ans || ans.isCorrect === null;
          });
        }

        const submitterName = attempt ? (studentMap.get(attempt.studentId)?.name || 'Siswa') : null;
        const baseScore = attempt?.score ?? null;

        for (const member of members) {
          const student = studentMap.get(member.studentId);
          if (!student) continue;
          const effectiveScore = member.scoreOverride ?? baseScore;
          const isPassed = effectiveScore !== null && effectiveScore >= passingScore;

          reportItems.push({
            id: `${group.id}:${student.id}`,
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
            score: effectiveScore,
            status: (attempt?.status || 'NOT_STARTED') as any,
            startedAt: attempt?.startedAt || null,
            finishedAt: attempt?.finishedAt || null,
            assignedVariantId: variantId,
            isPassed,
            hasEssay,
            needsReview,
            essayCount,
            totalQuestions,
            isGroupTask: true,
            groupId: group.id,
            groupName: group.name,
            groupBaseScore: baseScore,
            scoreOverride: member.scoreOverride ?? null,
            submitterName,
          });
        }
      }
    } else {
      const assignments = await db.orm.public.QuizAssignment.where({ quizPackageId: packageId }).all();
      const attemptStudentIds = new Set(relevantAttempts.map(a => a.studentId));

      // Filter students by course enrollment (tetap tampilkan jika sudah punya attempt)
      const enrolledStudentIds = new Set(
        resolvedCourseId
          ? allStudentCourses.filter(cs => cs.courseId === resolvedCourseId).map(cs => cs.studentId)
          : targetStudents.map(s => s.id)
      );
      const validStudents = targetStudents.filter(
        s => enrolledStudentIds.has(s.id) || attemptStudentIds.has(s.id)
      );

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
      let needsReview = false;
      if (hasEssay && attempt && attempt.status !== 'IN_PROGRESS' && attempt.status !== 'GRADED') {
        const attemptAnswers = attemptAnswerMap.get(attempt.id) || [];
        const variantEssayIds = variantId ? (variantEssayMap.get(variantId) || []) : [];
        needsReview = variantEssayIds.some(qId => {
          const ans = attemptAnswers.find(a => a.questionId === qId);
          return !ans || ans.isCorrect === null;
        });
      }

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
    }
  } else {
    // CASE 2: General view (All classes and/or all packages, or only one filter active)
    // Map all relevant attempts into report items (expand group attempts to each member)
    reportItems = [];
    for (const attempt of relevantAttempts) {
      const variant = variantMap.get(attempt.quizVariantId);
      const pkg = variant ? packageMap.get(variant.quizPackageId) : null;
      const pageObj = pkg?.pageId ? pageMap.get(pkg.pageId) : null;
      const cat = pageObj ? categoryMap.get(pageObj.categoryId) : null;
      const catName = cat ? cat.name : (pkg && !pkg.pageId ? 'Tugas Mandiri' : 'Umum');
      const cId = cat?.courseId || pkg?.courseId || null;
      const courseName = cId ? (courseMap.get(cId) || 'Tanpa Mata Pelajaran') : 'Tanpa Mata Pelajaran';
      const passingScore = pkg?.passingScore || 70;

      const variantInfo = attempt.quizVariantId ? variantQuestionMap.get(attempt.quizVariantId) : null;
      const essayCount = variantInfo?.essayCount || 0;
      const hasEssay = essayCount > 0;
      const totalQuestions = variantInfo?.total || 0;
      let needsReview = false;
      if (hasEssay && attempt.status !== 'IN_PROGRESS' && attempt.status !== 'GRADED') {
        const attemptAnswers = attemptAnswerMap.get(attempt.id) || [];
        const variantEssayIds = attempt.quizVariantId ? (variantEssayMap.get(attempt.quizVariantId) || []) : [];
        needsReview = variantEssayIds.some(qId => {
          const ans = attemptAnswers.find(a => a.questionId === qId);
          return !ans || ans.isCorrect === null;
        });
      }

      const aGroupId = (attempt as any).groupId as string | null;
      if (aGroupId) {
        const group = classGroupMap.get(aGroupId);
        if (!group || (scope && !isGroupVisibleToScope(group, scope))) continue;
        const members = groupMembersByGroup.get(group.id) || [];
        const submitterName = studentMap.get(attempt.studentId)?.name || 'Siswa';
        const baseScore = attempt.score ?? null;

        for (const member of members) {
          const student = studentMap.get(member.studentId);
          if (!student) continue;
          const className = (student.classId && classMap.get(student.classId)) || 'Tanpa Kelas';
          const effectiveScore = member.scoreOverride ?? baseScore;
          const isPassed = effectiveScore !== null && effectiveScore >= passingScore;

          reportItems.push({
            id: `${attempt.id}:${student.id}`,
            attemptId: attempt.id,
            studentId: student.id,
            studentName: student.name,
            studentEmail: student.email,
            classId: student.classId || null,
            className,
            packageId: pkg?.id || '',
            packageTitle: pkg?.title || 'Kuis',
            pageTitle: pageObj?.title || pkg?.title || 'Halaman Kuis',
            categoryName: catName,
            courseName,
            passingScore,
            score: effectiveScore,
            status: attempt.status as any,
            startedAt: attempt.startedAt || null,
            finishedAt: attempt.finishedAt || null,
            assignedVariantId: attempt.quizVariantId,
            isPassed,
            hasEssay,
            needsReview,
            essayCount,
            totalQuestions,
            isGroupTask: true,
            groupId: group.id,
            groupName: group.name,
            groupBaseScore: baseScore,
            scoreOverride: member.scoreOverride ?? null,
            submitterName,
          });
        }
        continue;
      }

      const student = studentMap.get(attempt.studentId);
      const className = (student?.classId && classMap.get(student.classId)) || 'Tanpa Kelas';
      const score = attempt.score ?? null;
      const isPassed = score !== null && score >= passingScore;

      reportItems.push({
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
      });
    }
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

  // 5. SORTING (Opsi 1: Global Activity Feed - Real-time First):
  // Rule:
  // 1. Prioritaskan yang butuh review essay (needsReview) agar segera dikoreksi guru
  // 2. Waktu Terbaru Global (finishedAt / startedAt DESC) - Siswa yang baru submit/mulai muncul paling atas
  // 3. Status penyelesaian (Selesai/Graded > Sedang Mengerjakan > Belum Mulai)
  // 4. Skor lebih tinggi
  // 5. Kelas alfabetis (A-Z)
  // 6. Nama murid alfabetis (A-Z)
  reportItems.sort((a, b) => {
    // 1. Prioritaskan yang perlu review essay
    if (a.needsReview && !b.needsReview) return -1;
    if (!a.needsReview && b.needsReview) return 1;

    // 2. Data aktivitas terbaru secara global (DESC - Selesai atau Mulai)
    const timeA = a.finishedAt ? new Date(a.finishedAt).getTime() : (a.startedAt ? new Date(a.startedAt).getTime() : 0);
    const timeB = b.finishedAt ? new Date(b.finishedAt).getTime() : (b.startedAt ? new Date(b.startedAt).getTime() : 0);
    if (timeB !== timeA) {
      return timeB - timeA;
    }

    // 3. Status penyelesaian (Selesai / Dinilai > Sedang Mengerjakan > Belum Mulai)
    const statusWeight: Record<string, number> = { COMPLETED: 1, GRADED: 1, IN_PROGRESS: 2, NOT_STARTED: 3 };
    const weightA = statusWeight[a.status] || 99;
    const weightB = statusWeight[b.status] || 99;
    if (weightA !== weightB) {
      return weightA - weightB;
    }

    // 4. Skor lebih tinggi
    if ((b.score ?? -1) !== (a.score ?? -1)) {
      return (b.score ?? -1) - (a.score ?? -1);
    }

    // 5. Kelas alfabetis (A-Z)
    const classA = a.className || 'ZZZ';
    const classB = b.className || 'ZZZ';
    const classComp = classA.localeCompare(classB);
    if (classComp !== 0) return classComp;

    // 6. Nama murid alfabetis (A-Z)
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
  const page = (pkg && pkg.pageId) ? await db.orm.public.Page.where({ id: pkg.pageId }).first() : null;
  const category = page ? await db.orm.public.MaterialCategory.where({ id: page.categoryId }).first() : null;
  const courseId = category?.courseId || pkg?.courseId || null;

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

export async function completeQuizAttempt(attemptId: string) {
  const attempt = await db.orm.public.QuizAttempt.where({ id: attemptId }).first();
  if (!attempt) throw new Error('Attempt tidak ditemukan');

  const variant = await db.orm.public.QuizVariant.where({ id: attempt.quizVariantId }).first();
  if (!variant) throw new Error('Variant kuis tidak ditemukan');

  const pkg = await db.orm.public.QuizPackage.where({ id: variant.quizPackageId }).first();
  const passingScore = pkg?.passingScore || 70;
  const score = attempt.score ?? 0;

  if (score < passingScore) {
    throw new Error(`Kuis belum memenuhi KKM (${score} < ${passingScore}). Tidak dapat diselesaikan.`);
  }

  // Update status attempt menjadi COMPLETED
  await db.orm.public.QuizAttempt.where({ id: attemptId }).update({
    status: 'COMPLETED',
    finishedAt: attempt.finishedAt || new Date().toISOString()
  });

  // Pastikan akses halaman materi selesai dan buka materi prasyarat berikutnya jika ada
  if (pkg?.pageId) {
    const targetStudentIds = [attempt.studentId];
    if ((attempt as any).groupId) {
      const members = await db.orm.public.ClassGroupMember.where({ groupId: (attempt as any).groupId }).all();
      for (const m of members) {
        if (!targetStudentIds.includes(m.studentId)) targetStudentIds.push(m.studentId);
      }
    }
    const sequences = await db.orm.public.PageSequence.where({ prerequisitePageId: pkg.pageId }).all();
    for (const targetSid of targetStudentIds) {
      const currentPageAccess = await db.orm.public.PageAccess.where({
        pageId: pkg.pageId,
        studentId: targetSid
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
          studentId: targetSid,
          status: 'COMPLETED',
          unlockedAt: new Date().toISOString(),
          completedAt: new Date().toISOString()
        });
      }

      for (const seq of sequences) {
        const existingAccess = await db.orm.public.PageAccess.where({
          pageId: seq.pageId,
          studentId: targetSid
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
            studentId: targetSid,
            status: 'UNLOCKED',
            unlockedAt: new Date().toISOString()
          });
        }
      }
    }
  }

  // Catat arsip permanen ke QuizCompletionRecord & update StudentScoreSummary
  try {
    const { recordQuizCompletion } = await import('@/modules/quiz-completion/quiz-completion.service');
    await recordQuizCompletion(attemptId);
  } catch (err) {
    console.error('Gagal mencatat arsip kuis otomatis:', err);
  }

  // ponytail: Dispatch WebSocket event
  try {
    const student = await db.orm.public.User.where({ id: attempt.studentId }).first();
    const classroom = student?.classId ? await db.orm.public.Classroom.where({ id: student.classId }).first() : null;
    const { emitQuizCompleted } = await import('@/lib/socket/emitter');
    emitQuizCompleted({
      attemptId,
      studentId: attempt.studentId,
      studentName: student?.name || 'Siswa',
      quizTitle: pkg?.title || 'Kuis',
      score,
      isPassed: score >= passingScore,
      needsReview: false,
      classId: student?.classId || null,
      className: classroom?.name || null,
      completedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('Socket emit error in completeQuizAttempt:', err);
  }

  return {
    attemptId,
    studentId: attempt.studentId,
    packageId: variant.quizPackageId,
    score,
    passingScore
  };
}

export interface BulkResetParams {
  classId?: string;
  packageId?: string;
  courseId?: string;
  targetMode: 'FAILED_KKM' | 'IN_PROGRESS' | 'ALL';
  teacherId?: string;
  scope?: TeacherScope;
}

export interface BulkResetTarget {
  attemptId: string;
  studentId: string;
  studentName: string;
  className: string;
  packageId: string;
  quizTitle: string;
  score: number | null;
  passingScore: number;
  status: string;
  attempt: any;
}

async function executeSingleReset(targetAttempt: any, studentId: string, packageId: string) {
  const answers = await db.orm.public.StudentAnswer.where({ quizAttemptId: targetAttempt.id }).all();
  for (const ans of answers) {
    await db.orm.public.StudentAnswer.where({ id: ans.id }).delete();
  }

  await db.orm.public.QuizAttempt.where({ id: targetAttempt.id }).delete();
  const activationLogs = await db.orm.public.AuditLog.where({ action: 'QUIZ_ACTIVATED', details: targetAttempt.id }).all();
  for (const log of activationLogs) {
    await db.orm.public.AuditLog.where({ id: log.id }).delete();
  }

  // Bersihkan arsip permanen, override anggota kelompok, dan reset status akses materi
  const affectedStudentIds = [studentId];
  if ((targetAttempt as any).groupId) {
    const groupMembers = await db.orm.public.ClassGroupMember.where({ groupId: (targetAttempt as any).groupId }).all();
    for (const gm of groupMembers) {
      if (gm.scoreOverride !== null && gm.scoreOverride !== undefined) {
        await db.orm.public.ClassGroupMember.where({ id: gm.id }).update({ scoreOverride: null });
      }
      if (!affectedStudentIds.includes(gm.studentId)) {
        affectedStudentIds.push(gm.studentId);
      }
    }
  }

  const pkg = await db.orm.public.QuizPackage.where({ id: packageId }).first();
  let pageSlug: string | null = null;

  if (pkg?.pageId) {
    const page = await db.orm.public.Page.where({ id: pkg.pageId }).first();
    if (page) {
      pageSlug = page.slug;
      const sequences = await db.orm.public.PageSequence.where({ prerequisitePageId: pkg.pageId }).all();

      for (const sid of affectedStudentIds) {
        const records = await db.orm.public.QuizCompletionRecord.where({
          studentId: sid,
          pageSlug: page.slug
        }).all();
        for (const r of records) {
          await db.orm.public.QuizCompletionRecord.where({ id: r.id }).delete();
        }

        const thisAccess = await db.orm.public.PageAccess.where({
          pageId: pkg.pageId,
          studentId: sid
        }).first();
        if (thisAccess) {
          await db.orm.public.PageAccess.where({ id: thisAccess.id }).update({
            status: 'UNLOCKED',
            completedAt: null
          });
        }

        for (const seq of sequences) {
          const dependentAccess = await db.orm.public.PageAccess.where({
            pageId: seq.pageId,
            studentId: sid
          }).first();
          if (dependentAccess && dependentAccess.status !== 'LOCKED') {
            await db.orm.public.PageAccess.where({ id: dependentAccess.id }).update({
              status: 'LOCKED',
              unlockedAt: null,
              completedAt: null
            });
          }
        }
      }
    }
  }

  // Hapus juga QuizCompletionRecord jika ada berdasarkan sourceId target attempt
  const recordsBySource = await db.orm.public.QuizCompletionRecord.where({
    sourceId: targetAttempt.id
  }).all();
  for (const r of recordsBySource) {
    await db.orm.public.QuizCompletionRecord.where({ id: r.id }).delete();
  }

  // ponytail: Dispatch real-time WebSocket reset event untuk seluruh anggota terkait
  try {
    const { emitQuizReset } = await import('@/lib/socket/emitter');
    for (const sid of affectedStudentIds) {
      emitQuizReset({
        studentId: sid,
        packageId,
        pageSlug,
        resetAt: new Date().toISOString()
      });
    }
  } catch (socketErr) {
    console.error('Socket emit error in executeSingleReset:', socketErr);
  }
}

async function findBulkResetTargets(params: BulkResetParams): Promise<{
  targets: BulkResetTarget[];
  classLabel: string;
  packageLabel: string;
  modeLabel: string;
}> {
  if (!params.classId && !params.packageId) {
    throw new Error('Harap pilih minimal salah satu filter (Kelas atau Materi) untuk melakukan reset massal.');
  }

  const [classrooms, allPackages, allVariants, allStudents, allAttempts, pages, categories] = await Promise.all([
    db.orm.public.Classroom.all(),
    db.orm.public.QuizPackage.all(),
    db.orm.public.QuizVariant.all(),
    db.orm.public.User.where({ role: 'MURID' }).all(),
    db.orm.public.QuizAttempt.all(),
    db.orm.public.Page.all(),
    db.orm.public.MaterialCategory.all(),
  ]);

  const classMap = new Map(classrooms.map(c => [c.id, c.name]));
  const studentMap = new Map(allStudents.map(s => [s.id, s]));
  const packageMap = new Map(allPackages.map(p => [p.id, p]));
  const variantMap = new Map(allVariants.map(v => [v.id, v]));
  const pageMap = new Map(pages.map(p => [p.id, p]));
  const categoryMap = new Map(categories.map(c => [c.id, c]));

  // Filter Target Packages
  let targetPackages = allPackages;
  if (params.packageId) {
    targetPackages = targetPackages.filter(p => p.id === params.packageId);
  }
  if (params.scope && !params.scope.isUnrestricted) {
    targetPackages = targetPackages.filter(p => isPackageAllowedForScope(params.scope!, p, pageMap, categoryMap));
  } else if (params.teacherId) {
    const teacherCourses = await db.orm.public.CourseTeacher.where({ teacherId: params.teacherId }).all();
    const validCourseIds = new Set(teacherCourses.map(c => c.courseId));
    targetPackages = targetPackages.filter(p => {
      const { candidateCourseIds } = resolvePackageCourseIds(p, pageMap, categoryMap);
      return candidateCourseIds.some(cId => validCourseIds.has(cId));
    });
  }

  const targetPackageIds = new Set(targetPackages.map(p => p.id));
  const targetVariants = allVariants.filter(v => targetPackageIds.has(v.quizPackageId));
  const targetVariantIds = new Set(targetVariants.map(v => v.id));

  // Filter Target Students
  let targetStudents = allStudents;
  if (params.scope && !params.scope.isUnrestricted) {
    targetStudents = targetStudents.filter(s => s.classId && params.scope!.allowedClassIds.has(s.classId));
  }
  if (params.classId) {
    targetStudents = targetStudents.filter(s => s.classId === params.classId);
  }
  const targetStudentIds = new Set(targetStudents.map(s => s.id));

  // Filter Attempts (per-course class boundary check)
  const relevantAttempts = allAttempts.filter(a => {
    if (!targetStudentIds.has(a.studentId) || !targetVariantIds.has(a.quizVariantId)) return false;
    if (params.scope && !params.scope.isUnrestricted) {
      const student = studentMap.get(a.studentId);
      const variant = variantMap.get(a.quizVariantId);
      const pkg = variant ? packageMap.get(variant.quizPackageId) : null;
      if (!pkg || !student?.classId) return false;
      const { candidateCourseIds } = resolvePackageCourseIds(pkg, pageMap, categoryMap);
      return candidateCourseIds.some(cId => isClassAllowedForCourse(params.scope!, cId, student.classId));
    }
    return true;
  });

  const targets: BulkResetTarget[] = [];
  for (const attempt of relevantAttempts) {
    const variant = variantMap.get(attempt.quizVariantId);
    if (!variant) continue;
    const pkg = packageMap.get(variant.quizPackageId);
    if (!pkg) continue;
    const student = studentMap.get(attempt.studentId);
    if (!student) continue;

    const passingScore = pkg.passingScore || 70;
    const score = attempt.score;

    let matches = false;
    if (params.targetMode === 'FAILED_KKM') {
      matches = score !== null && score !== undefined && score < passingScore;
    } else if (params.targetMode === 'IN_PROGRESS') {
      matches = attempt.status === 'IN_PROGRESS';
    } else if (params.targetMode === 'ALL') {
      matches = true;
    }

    if (matches) {
      targets.push({
        attemptId: attempt.id,
        studentId: student.id,
        studentName: student.name,
        className: student.classId ? (classMap.get(student.classId) || 'Tanpa Kelas') : 'Tanpa Kelas',
        packageId: pkg.id,
        quizTitle: pkg.title,
        score,
        passingScore,
        status: attempt.status,
        attempt
      });
    }
  }

  const classLabel = params.classId ? (classMap.get(params.classId) || 'Kelas Terpilih') : 'Semua Kelas';
  const packageLabel = params.packageId ? (packageMap.get(params.packageId)?.title || 'Materi Terpilih') : 'Semua Materi';
  const modeLabel = params.targetMode === 'FAILED_KKM' 
    ? 'Hanya Nilai < KKM' 
    : params.targetMode === 'IN_PROGRESS' 
    ? 'Hanya Sesi Sedang Berjalan' 
    : 'Semua Siswa';

  return { targets, classLabel, packageLabel, modeLabel };
}

export async function previewBulkResetQuizAttempts(params: BulkResetParams) {
  const { targets, classLabel, packageLabel, modeLabel } = await findBulkResetTargets(params);
  return {
    count: targets.length,
    classLabel,
    packageLabel,
    modeLabel,
    sampleStudents: targets.slice(0, 20).map(t => ({
      attemptId: t.attemptId,
      studentName: t.studentName,
      className: t.className,
      quizTitle: t.quizTitle,
      score: t.score,
      passingScore: t.passingScore,
      status: t.status
    }))
  };
}

export async function bulkResetQuizAttempts(params: BulkResetParams) {
  const { targets, classLabel, packageLabel, modeLabel } = await findBulkResetTargets(params);

  for (const t of targets) {
    await executeSingleReset(t.attempt, t.studentId, t.packageId);
  }

  return {
    success: true,
    count: targets.length,
    classLabel,
    packageLabel,
    modeLabel
  };
}

export async function resetQuizAttempt(studentId: string, packageId: string, attemptId?: string) {
  let targetAttempt: any = null;

  if (attemptId) {
    targetAttempt = await db.orm.public.QuizAttempt.where({ id: attemptId }).first();
    if (targetAttempt && targetAttempt.studentId !== studentId) {
      const attemptGroupId = (targetAttempt as any).groupId as string | null;
      const isMember = attemptGroupId
        ? Boolean(await db.orm.public.ClassGroupMember.where({ groupId: attemptGroupId, studentId }).first())
        : false;
      if (!isMember) {
        targetAttempt = null;
      }
    }
  }

  if (!targetAttempt) {
    const variants = await db.orm.public.QuizVariant.where({ quizPackageId: packageId }).all();
    const variantIds = variants.map(v => v.id);
    const attempts = await db.orm.public.QuizAttempt.where({ studentId }).all();
    targetAttempt = attempts.find(a => variantIds.includes(a.quizVariantId));

    if (!targetAttempt) {
      const memberships = await db.orm.public.ClassGroupMember.where({ studentId }).all();
      for (const m of memberships) {
        const group = await db.orm.public.ClassGroup.where({ id: m.groupId }).first();
        if (group && group.quizPackageId === packageId) {
          const groupAttempt = await db.orm.public.QuizAttempt.where({ groupId: group.id }).first();
          if (groupAttempt) {
            targetAttempt = groupAttempt;
            break;
          }
        }
      }
    }
  }

  if (!targetAttempt) {
    throw new Error('Tidak ada riwayat kuis untuk di-reset');
  }

  const previousScore = targetAttempt.score;
  const previousStatus = targetAttempt.status;
  const answerCount = (await db.orm.public.StudentAnswer.where({ quizAttemptId: targetAttempt.id }).all()).length;

  await executeSingleReset(targetAttempt, studentId, packageId);

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

  // Get feedback authors
  const authorIds = Array.from(new Set(rawAnswers.map(a => a.feedbackAuthorId).filter(Boolean))) as string[];
  const authors = (
    await Promise.all(authorIds.map(id => db.orm.public.User.where({ id }).first()))
  ).filter((u): u is NonNullable<typeof u> => Boolean(u));
  const authorMap = new Map(authors.map(u => [u.id, u]));

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

    const author = studentAns?.feedbackAuthorId ? authorMap.get(studentAns.feedbackAuthorId) : null;

    return {
      id: q.id,
      questionText: q.questionText,
      questionType: q.questionType,
      codeLanguage: q.codeLanguage,
      testCases: (q as any).testCases,
      points: Number(q.points) || 1,
      options,
      studentAnswer: studentAns ? {
        id: studentAns.id,
        selectedOptionId: studentAns.selectedOptionId,
        essayAnswer: studentAns.essayAnswer,
        isCorrect: studentAns.isCorrect,
        pointsEarned: Number(studentAns.pointsEarned) || 0,
        essayFeedback: studentAns.essayFeedback || null,
        feedbackAuthorId: studentAns.feedbackAuthorId || null,
        feedbackAuthorName: author?.name || (studentAns.essayFeedback ? 'Guru / Pengajar' : null),
        feedbackAuthorRole: author?.role || (studentAns.essayFeedback ? 'GURU' : null),
        feedbackAt: studentAns.feedbackAt || null,
      } : null
    };
  });

  const totalMaxPoints = questions.reduce((sum, q) => sum + q.points, 0);
  const totalEarnedPoints = questions.reduce((sum, q) => sum + (q.studentAnswer?.pointsEarned || 0), 0);
  const essayQuestions = questions.filter(q =>
    q.questionType === 'ESSAY' ||
    (q.questionType === 'CODE_CHALLENGE' && q.codeLanguage?.toLowerCase() !== 'sql' && !(q.codeLanguage?.toLowerCase() === 'php' && Boolean(q.testCases)))
  );
  const hasEssay = essayQuestions.length > 0;
  const hasUngradedEssay = essayQuestions.some(q => !q.studentAnswer || q.studentAnswer.isCorrect === null);
  const needsReview = hasEssay && attempt.status !== 'IN_PROGRESS' && attempt.status !== 'GRADED' && hasUngradedEssay;

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
  essayGrades: { questionId: string; pointsEarned: number; feedback?: string }[],
  graderId?: string
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
    if (!q || (q.questionType !== 'ESSAY' && q.questionType !== 'CODE_CHALLENGE')) continue;

    const clampedPoints = Math.max(0, Math.min(q.points, Number(grade.pointsEarned) || 0));
    const ans = existingAnswers.find(a => a.questionId === grade.questionId);
    const feedbackText = grade.feedback !== undefined ? grade.feedback.trim() || null : (ans?.essayFeedback || null);
    const feedbackAuthorId = feedbackText ? (graderId || ans?.feedbackAuthorId || null) : null;
    const feedbackAt = feedbackText 
      ? (feedbackText !== ans?.essayFeedback ? new Date().toISOString() : ans?.feedbackAt || new Date().toISOString()) 
      : null;

    if (ans) {
      await db.orm.public.StudentAnswer.where({ id: ans.id }).update({
        pointsEarned: clampedPoints,
        isCorrect: clampedPoints > 0,
        essayFeedback: feedbackText,
        feedbackAuthorId,
        feedbackAt
      });
    } else {
      await db.orm.public.StudentAnswer.create({
        id: randomUUID(),
        quizAttemptId: attemptId,
        questionId: grade.questionId,
        selectedOptionId: null,
        essayAnswer: null,
        isCorrect: clampedPoints > 0,
        pointsEarned: clampedPoints,
        essayFeedback: feedbackText,
        feedbackAuthorId,
        feedbackAt
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
  const passed = roundedScore >= (pkg?.passingScore || 70);
  const targetStatus = passed ? 'COMPLETED' : 'GRADED';

  // Update QuizAttempt: jika lulus KKM otomatis COMPLETED (Sukses), jika tidak tetap GRADED
  await db.orm.public.QuizAttempt.where({ id: attemptId }).update({
    score: roundedScore,
    status: targetStatus,
    finishedAt: attempt.finishedAt || new Date().toISOString()
  });

  // Catat arsip permanen kelulusan jika lulus KKM
  if (passed) {
    try {
      const { recordQuizCompletion } = await import('@/modules/quiz-completion/quiz-completion.service');
      await recordQuizCompletion(attemptId);
    } catch (err) {
      console.error('Gagal mencatat arsip kuis otomatis:', err);
    }
  }

  // Previous score
  const beforeScore = attempt.score;

  if (passed && pkg?.pageId) {
    const targetStudentIds = [attempt.studentId];
    if ((attempt as any).groupId) {
      const members = await db.orm.public.ClassGroupMember.where({ groupId: (attempt as any).groupId }).all();
      for (const m of members) {
        if (!targetStudentIds.includes(m.studentId)) targetStudentIds.push(m.studentId);
      }
    }
    const sequences = await db.orm.public.PageSequence.where({ prerequisitePageId: pkg.pageId }).all();

    for (const targetSid of targetStudentIds) {
      const currentPageAccess = await db.orm.public.PageAccess.where({
        pageId: pkg.pageId,
        studentId: targetSid
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
          studentId: targetSid,
          status: 'COMPLETED',
          unlockedAt: new Date().toISOString(),
          completedAt: new Date().toISOString()
        });
      }

      for (const seq of sequences) {
        const existingAccess = await db.orm.public.PageAccess.where({ 
          pageId: seq.pageId, 
          studentId: targetSid 
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
            studentId: targetSid,
            status: 'UNLOCKED',
            unlockedAt: new Date().toISOString()
          });
        }
      }
    }
  }

  // ponytail: Dispatch WebSocket event
  try {
    const student = await db.orm.public.User.where({ id: attempt.studentId }).first();
    const classroom = student?.classId ? await db.orm.public.Classroom.where({ id: student.classId }).first() : null;
    const { emitQuizCompleted, emitQuizGraded } = await import('@/lib/socket/emitter');
    emitQuizCompleted({
      attemptId,
      studentId: attempt.studentId,
      studentName: student?.name || 'Siswa',
      quizTitle: pkg?.title || 'Kuis',
      score: roundedScore,
      isPassed: passed,
      needsReview: false,
      classId: student?.classId || null,
      className: classroom?.name || null,
      completedAt: new Date().toISOString()
    });

    const page = pkg?.pageId ? await db.orm.public.Page.where({ id: pkg.pageId }).first() : null;
    const gradedStudentIds = [attempt.studentId];
    if ((attempt as any).groupId) {
      const members = await db.orm.public.ClassGroupMember.where({ groupId: (attempt as any).groupId }).all();
      for (const m of members) {
        if (!gradedStudentIds.includes(m.studentId)) gradedStudentIds.push(m.studentId);
      }
    }
    for (const sid of gradedStudentIds) {
      emitQuizGraded({
        studentId: sid,
        attemptId,
        packageId: pkg?.id,
        pageSlug: page?.slug || null,
        score: roundedScore,
        isPassed: passed,
        gradedAt: new Date().toISOString()
      });
    }
  } catch (err) {
    console.error('Socket emit error in gradeQuizAttempt:', err);
  }

  return {
    success: true,
    score: roundedScore,
    isPassed: passed,
    status: targetStatus,
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
  scope?: TeacherScope;
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
    teacherId,
    scope
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
  const categoryObjMap = new Map(allCategories.map(c => [c.id, c]));
  const pageMap = new Map(allPages.map(p => [p.id, p]));

  // Teacher & Course Filter (supports both page-linked AND standalone courseId packages)
  let validCourseIds: Set<string> | null = null;
  if (scope && !scope.isUnrestricted) {
    validCourseIds = new Set(scope.allowedCourseIds);
  } else if (teacherId) {
    validCourseIds = new Set(allCourseTeachers.filter(t => t.teacherId === teacherId).map(t => t.courseId));
  }
  if (courseId) {
    validCourseIds = validCourseIds
      ? new Set(validCourseIds.has(courseId) ? [courseId] : [])
      : new Set([courseId]);
  }

  const validCategoryIds = new Set(
    allCategories
      .filter(c => !validCourseIds || (c.courseId && validCourseIds.has(c.courseId)))
      .map(c => c.id)
  );
  const filteredPages = allPages.filter(p => validCategoryIds.has(p.categoryId));
  const filteredPageIds = new Set(filteredPages.map(p => p.id));
  const filteredPackages = allPackages.filter(p => {
    if (p.pageId && filteredPageIds.has(p.pageId)) return true;
    if (!p.pageId && p.courseId && (!validCourseIds || validCourseIds.has(p.courseId))) return true;
    return false;
  });

  // Active quiz packages (filter by packageId if specified)
  const targetPackages = packageId 
    ? filteredPackages.filter(p => p.id === packageId)
    : filteredPackages;

  // Filter students by class & teacher class scope
  let targetStudents = allStudents;
  if (scope && !scope.isUnrestricted) {
    targetStudents = targetStudents.filter(s => s.classId && scope.allowedClassIds.has(s.classId));
  }
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
    if (pkg.pageId) {
      pageQuizPackageMap.set(pkg.pageId, pkg);
    }
  }

  // Compute for each student
  const studentReports: UnfinishedStudentItem[] = targetStudents.map(student => {
    const studentAccesses = accessByStudent.get(student.id) || [];
    const studentAttempts = attemptsByStudent.get(student.id) || [];

    // Filter pages and packages by student's courses (and teacher's class assignment for each course)
    const studentCourseIds = allStudentCourses
      .filter(cs => cs.studentId === student.id)
      .map(cs => cs.courseId)
      .filter(cId => !scope || scope.isUnrestricted || isClassAllowedForCourse(scope, cId, student.classId));
    const studentCourseIdSet = new Set(studentCourseIds);
    const studentCategories = allCategories.filter(c => c.courseId && studentCourseIdSet.has(c.courseId));
    const studentCategoryIds = new Set(studentCategories.map(c => c.id));
    const studentPages = filteredPages.filter(p => studentCategoryIds.has(p.categoryId));
    const studentPageIds = new Set(studentPages.map(p => p.id));
    const studentPackages = targetPackages.filter(pkg => {
      if (pkg.pageId && studentPageIds.has(pkg.pageId)) return true;
      if (!pkg.pageId) {
        const { candidateCourseIds } = resolvePackageCourseIds(pkg, pageMap, categoryObjMap);
        return candidateCourseIds.some(cId => studentCourseIdSet.has(cId));
      }
      return false;
    });

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
        const pageObj = pkg.pageId ? pageMap.get(pkg.pageId) : null;
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
  scope?: TeacherScope;
}): Promise<TaskRecapResponse> {
  const { classId, courseId, teacherId, scope } = params;

  // Fetch all data we need in parallel
  const [allPackages, allPages, allCategories, courses, allAttempts, allStudents, allStudentCourses, allVariants, allQuestions, allAnswers] = await Promise.all([
    db.orm.public.QuizPackage.all(),
    db.orm.public.Page.all(),
    db.orm.public.MaterialCategory.all(),
    db.orm.public.Course.all(),
    db.orm.public.QuizAttempt.all(),
    db.orm.public.User.where({ role: 'MURID' }).all(),
    db.orm.public.CourseStudent.all(),
    db.orm.public.QuizVariant.all(),
    db.orm.public.Question.all(),
    db.orm.public.StudentAnswer.all(),
  ]);

  const packageMap = new Map(allPackages.map(p => [p.id, p]));
  const pageMap = new Map(allPages.map(p => [p.id, p]));
  const catMap = new Map(allCategories.map(c => [c.id, c]));
  const courseMap = new Map(courses.map(c => [c.id, c.name]));

  const isManualReview = (q: any) =>
    q.questionType === 'ESSAY' ||
    (q.questionType === 'CODE_CHALLENGE' && q.codeLanguage?.toLowerCase() !== 'sql' && !(q.codeLanguage?.toLowerCase() === 'php' && Boolean(q.testCases)));

  const variantQuestionMap = new Map<string, { total: number; essayCount: number; essayQuestionIds: string[] }>();
  for (const q of allQuestions) {
    const cur = variantQuestionMap.get(q.quizVariantId) || { total: 0, essayCount: 0, essayQuestionIds: [] };
    cur.total += 1;
    if (isManualReview(q)) {
      cur.essayCount += 1;
      cur.essayQuestionIds.push(q.id);
    }
    variantQuestionMap.set(q.quizVariantId, cur);
  }

  const attemptAnswerMap = new Map<string, any[]>();
  for (const ans of allAnswers) {
    const list = attemptAnswerMap.get(ans.quizAttemptId) || [];
    list.push(ans);
    attemptAnswerMap.set(ans.quizAttemptId, list);
  }

  // Build classMap from all classrooms
  const allClassrooms = await db.orm.public.Classroom.all();
  const classMap = new Map(allClassrooms.map(c => [c.id, c.name]));
  const variantsByPackage = new Map<string, string[]>(); // packageId -> variantIds
  for (const v of allVariants) {
    const list = variantsByPackage.get(v.quizPackageId) || [];
    list.push(v.id);
    variantsByPackage.set(v.quizPackageId, list);
  }

  // Build attempt lookup: studentId+packageId -> attempt
  const attemptLookup = new Map<string, typeof allAttempts[0]>();
  for (const a of allAttempts) {
    const variant = allVariants.find(v => v.id === a.quizVariantId);
    if (!variant) continue;
    const key = `${a.studentId}:${variant.quizPackageId}`;
    // Keep latest attempt (prefer COMPLETED/GRADED over IN_PROGRESS)
    const existing = attemptLookup.get(key);
    if (!existing || a.status === 'COMPLETED' || a.status === 'GRADED') {
      attemptLookup.set(key, a);
    }
  }

  // Filter students
  let targetStudents = allStudents;
  if (scope && !scope.isUnrestricted) {
    targetStudents = targetStudents.filter(s => s.classId && scope.allowedClassIds.has(s.classId));
  }
  if (classId) {
    targetStudents = targetStudents.filter(s => s.classId === classId);
  }

  // Teacher / Scope filter: includes both page-linked AND standalone packages
  let validCourseIds: Set<string> | null = null;
  if (scope && !scope.isUnrestricted) {
    validCourseIds = new Set(scope.allowedCourseIds);
  } else if (teacherId) {
    const teacherCourses = await db.orm.public.CourseTeacher.where({ teacherId }).all();
    validCourseIds = new Set(teacherCourses.map(c => c.courseId));
  }

  const activePackages = allPackages.filter(p => {
    if (!p.isActive) return false;
    const { candidateCourseIds } = resolvePackageCourseIds(p, pageMap, catMap);
    if (validCourseIds && !candidateCourseIds.some(cId => validCourseIds!.has(cId))) return false;
    if (courseId && !candidateCourseIds.includes(courseId)) return false;
    return true;
  });

  const items: TaskRecapItem[] = [];

  for (const pkg of activePackages) {
    const page = pkg.pageId ? pageMap.get(pkg.pageId) : null;
    if (pkg.pageId && !page) continue;
    const category = page ? catMap.get(page.categoryId) : null;
    const catName = category?.name || (!pkg.pageId ? 'Tugas Mandiri' : 'Umum');
    const { primaryCourseId, candidateCourseIds } = resolvePackageCourseIds(pkg, pageMap, catMap);
    const cId = primaryCourseId;
    const courseName = cId ? (courseMap.get(cId) || 'Tanpa Mata Pelajaran') : 'Tanpa Mata Pelajaran';
    const passingScore = pkg.passingScore || 70;

    // Filter students by course enrollment & teacher's per-course class assignment
    const enrolledStudentIds = cId
      ? new Set(allStudentCourses.filter(cs => cs.courseId === cId).map(cs => cs.studentId))
      : null;

    const pkgStudents = targetStudents.filter(s => {
      if (scope && !scope.isUnrestricted) {
        const classAllowed = candidateCourseIds.some(cid => isClassAllowedForCourse(scope, cid, s.classId));
        if (!classAllowed) return false;
      }
      if (enrolledStudentIds && !enrolledStudentIds.has(s.id)) {
        return Boolean(attemptLookup.get(`${s.id}:${pkg.id}`));
      }
      return true;
    });

    // Build student attempt list — cross-reference ALL pkgStudents with attempts
    const studentAttempts: QuizReportItem[] = pkgStudents.map(student => {
      const key = `${student.id}:${pkg.id}`;
      const attempt = attemptLookup.get(key);
      const score = attempt?.score ?? null;
      const isPassed = score !== null && score >= passingScore;
      const variantInfo = attempt?.quizVariantId ? variantQuestionMap.get(attempt.quizVariantId) : null;
      const essayCount = variantInfo?.essayCount || 0;
      const hasEssay = essayCount > 0;
      const totalQuestions = variantInfo?.total || 0;
      let needsReview = false;
      if (hasEssay && attempt && attempt.status !== 'IN_PROGRESS' && attempt.status !== 'GRADED') {
        const attemptAnswers = attemptAnswerMap.get(attempt.id) || [];
        needsReview = (variantInfo?.essayQuestionIds || []).some(qId => {
          const ans = attemptAnswers.find(a => a.questionId === qId);
          return !ans || ans.isCorrect === null;
        });
      }

      return {
        id: attempt?.id || `unstarted-${student.id}-${pkg.id}`,
        attemptId: attempt?.id || null,
        studentId: student.id,
        studentName: student.name,
        studentEmail: student.email,
        classId: student.classId || null,
        className: student.classId ? (classMap.get(student.classId) || 'Tanpa Kelas') : 'Tanpa Kelas',
        packageId: pkg.id,
        packageTitle: pkg.title,
        pageTitle: page?.title || pkg.title,
        categoryName: catName,
        courseName,
        passingScore,
        score,
        status: (attempt?.status || 'NOT_STARTED') as any,
        startedAt: attempt?.startedAt || null,
        finishedAt: attempt?.finishedAt || null,
        assignedVariantId: attempt?.quizVariantId || null,
        isPassed,
        hasEssay,
        needsReview,
        essayCount,
        totalQuestions,
      };
    });

    const completedAttempts = studentAttempts.filter(a => a.status === 'COMPLETED' || a.status === 'GRADED');
    const needReviewCount = studentAttempts.filter(a => a.needsReview).length;
    const sumScore = completedAttempts.reduce((acc, a) => acc + (a.score || 0), 0);
    const avg = completedAttempts.length > 0 ? Math.round((sumScore / completedAttempts.length) * 10) / 10 : 0;

    items.push({
      packageId: pkg.id,
      packageTitle: pkg.title,
      pageTitle: page?.title || pkg.title,
      categoryName: catName,
      courseName,
      orderIndex: (category?.orderIndex || 0) * 1000 + (page?.orderIndex || 999),
      passingScore,
      stats: {
        totalStudents: studentAttempts.length,
        completedCount: completedAttempts.length,
        needReviewCount,
        averageScore: avg,
      },
      studentAttempts: studentAttempts.sort((a, b) => a.studentName.localeCompare(b.studentName)),
    });
  }

  items.sort((a, b) => a.orderIndex - b.orderIndex);
  return { items };
}

/**
 * Penyesuaian (override) nilai individu anggota kelompok oleh Guru di Laporan.
 */
export async function overrideGroupMemberScore(
  groupId: string,
  studentId: string,
  scoreOverride: number | null,
  scope: TeacherScope
) {
  const group = await db.orm.public.ClassGroup.where({ id: groupId }).first();
  if (!group) throw new Error('Kelompok tidak ditemukan');

  if (!scope.isUnrestricted) {
    if (!canEditGroupForScope(group, scope) || !isClassAllowedForCourse(scope, group.courseId, group.classroomId)) {
      throw new Error('FORBIDDEN');
    }
  }

  const member = await db.orm.public.ClassGroupMember.where({ groupId, studentId }).first();
  if (!member) throw new Error('Siswa bukan anggota kelompok ini');

  const sanitizedScore =
    scoreOverride === null || scoreOverride === undefined
      ? null
      : Math.max(0, Math.min(100, Math.round(Number(scoreOverride) * 100) / 100));

  await db.orm.public.ClassGroupMember.where({ id: member.id }).update({
    scoreOverride: sanitizedScore,
  });

  const attempt = await db.orm.public.QuizAttempt.where({ groupId }).first();
  if (attempt && (attempt.status === 'COMPLETED' || attempt.status === 'GRADED')) {
    try {
      const { recordGroupQuizCompletion } = await import('@/modules/quiz-completion/quiz-completion.service');
      await recordGroupQuizCompletion(attempt.id);
    } catch (err) {
      console.error('[overrideGroupMemberScore] Failed syncing QuizCompletionRecord:', err);
    }

    try {
      const pkg = await db.orm.public.QuizPackage.where({ id: group.quizPackageId }).first();
      const page = pkg?.pageId ? await db.orm.public.Page.where({ id: pkg.pageId }).first() : null;
      const effective = sanitizedScore ?? attempt.score ?? 0;
      const { emitQuizGraded } = await import('@/lib/socket/emitter');
      emitQuizGraded({
        studentId,
        attemptId: attempt.id,
        packageId: group.quizPackageId,
        pageSlug: page?.slug || null,
        score: effective,
        isPassed: effective >= (pkg?.passingScore || 70),
        gradedAt: new Date().toISOString(),
      });
    } catch {}
  }

  return { groupId, studentId, scoreOverride: sanitizedScore };
}

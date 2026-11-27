import { randomUUID } from 'crypto';
import { db } from '@/prisma/db';
import { resolvePackageCourseIds } from '@/modules/course/teacher-scope.service';

export type SelectionMode = 'ALL' | 'CUSTOM';

export interface GradebookSelectionRule {
  mode: SelectionMode;
  selectedQuizIds: Set<string>;
}

export type GradebookSelectionMap = Map<string, GradebookSelectionRule>;

export function selectionKey(classroomId: string, courseId: string): string {
  return `${classroomId}:${courseId}`;
}

export async function loadGradebookSelectionMap(
  classroomId?: string,
  courseId?: string
): Promise<GradebookSelectionMap> {
  const whereClause: { classroomId?: string; courseId?: string } = {};
  if (classroomId) whereClause.classroomId = classroomId;
  if (courseId) whereClause.courseId = courseId;

  const hasFilter = Object.keys(whereClause).length > 0;
  const [configs, selectedRows] = await Promise.all([
    hasFilter
      ? db.orm.public.GradebookClassConfig.where(whereClause).all()
      : db.orm.public.GradebookClassConfig.all(),
    hasFilter
      ? db.orm.public.GradebookSelectedQuiz.where(whereClause).all()
      : db.orm.public.GradebookSelectedQuiz.all(),
  ]);

  const map: GradebookSelectionMap = new Map();
  const configIdToKey = new Map<string, string>();

  for (const cfg of configs) {
    const key = selectionKey(cfg.classroomId, cfg.courseId);
    configIdToKey.set(cfg.id, key);
    map.set(key, {
      mode: cfg.mode === 'CUSTOM' ? 'CUSTOM' : 'ALL',
      selectedQuizIds: new Set<string>(),
    });
  }

  for (const row of selectedRows) {
    const key = configIdToKey.get(row.configId) || selectionKey(row.classroomId, row.courseId);
    const rule = map.get(key);
    if (rule) {
      rule.selectedQuizIds.add(row.quizPackageId);
    }
  }

  return map;
}

export function isPackageIncludedInSelection(
  selectionMap: GradebookSelectionMap,
  classroomId: string | null | undefined,
  courseId: string | null | undefined,
  quizPackageId: string | null | undefined
): boolean {
  if (!classroomId || !courseId || !quizPackageId) return true;
  const rule = selectionMap.get(selectionKey(classroomId, courseId));
  if (!rule || rule.mode === 'ALL') return true;
  return rule.selectedQuizIds.has(quizPackageId);
}

export interface EnrichedCoursePackage<T = any> {
  pkg: T;
  assignmentMode: string;
  categoryName: string | null;
  categoryOrderIndex: number;
  pageOrderIndex: number;
}

export function getCandidatePackagesForCourse<
  T extends { id: string; title: string; courseId?: string | null; pageId?: string | null; assignmentMode?: string }
>(
  allPackages: T[],
  pageMap: Map<string, { id: string; categoryId: string; orderIndex: number }>,
  categoryMap: Map<string, { id: string; name: string; courseId?: string | null; orderIndex: number }>,
  courseId: string,
  assignedDiscussionIds: Set<string>,
  gradedDiscussionIds?: Set<string>
): EnrichedCoursePackage<T>[] {
  const candidates: EnrichedCoursePackage<T>[] = [];

  for (const pkg of allPackages) {
    const { candidateCourseIds } = resolvePackageCourseIds(pkg, pageMap, categoryMap);
    if (!candidateCourseIds.includes(courseId)) continue;

    const assignmentMode = pkg.assignmentMode || 'INDIVIDUAL';
    if (assignmentMode === 'DISCUSSION') {
      const hasAssignment = assignedDiscussionIds.has(pkg.id);
      const hasGrade = gradedDiscussionIds ? gradedDiscussionIds.has(pkg.id) : false;
      if (!hasAssignment && !hasGrade) continue;
    }

    const page = pkg.pageId ? pageMap.get(pkg.pageId) : undefined;
    const cat = page ? categoryMap.get(page.categoryId) : undefined;

    candidates.push({
      pkg,
      assignmentMode,
      categoryName: cat?.name || null,
      categoryOrderIndex: cat?.orderIndex ?? 999999,
      pageOrderIndex: page?.orderIndex ?? 999999,
    });
  }

  return candidates.sort((a, b) => {
    if (a.categoryOrderIndex !== b.categoryOrderIndex) return a.categoryOrderIndex - b.categoryOrderIndex;
    const catCmp = (a.categoryName || '').localeCompare(b.categoryName || '');
    if (catCmp !== 0) return catCmp;
    if (a.pageOrderIndex !== b.pageOrderIndex) return a.pageOrderIndex - b.pageOrderIndex;
    return a.pkg.title.localeCompare(b.pkg.title);
  });
}

export async function getEffectivePackagesForClassCourse(classId: string, courseId: string) {
  const [allPackages, pages, categories, discussionAssignments, discussionGrades, selectionMap] = await Promise.all([
    db.orm.public.QuizPackage.all(),
    db.orm.public.Page.all(),
    db.orm.public.MaterialCategory.all(),
    db.orm.public.DiscussionClassAssignment.where({ classroomId: classId }).all(),
    db.orm.public.DiscussionGrade.where({ classroomId: classId }).all(),
    loadGradebookSelectionMap(classId, courseId),
  ]);

  const pageMap = new Map(pages.map(p => [p.id, p]));
  const categoryMap = new Map(categories.map(c => [c.id, c]));
  const assignedDiscussionIds = new Set(discussionAssignments.map(a => a.quizPackageId));
  const gradedDiscussionIds = new Set(
    discussionGrades.filter(g => g.score !== null && g.score !== undefined).map(g => g.quizPackageId)
  );

  const candidateEntries = getCandidatePackagesForCourse(
    allPackages,
    pageMap,
    categoryMap,
    courseId,
    assignedDiscussionIds,
    gradedDiscussionIds
  );

  const rule = selectionMap.get(selectionKey(classId, courseId));
  const mode: SelectionMode = rule?.mode === 'CUSTOM' ? 'CUSTOM' : 'ALL';
  const selectedIds = rule ? rule.selectedQuizIds : new Set<string>();

  const includedEntries =
    mode === 'CUSTOM'
      ? candidateEntries.filter(entry => selectedIds.has(entry.pkg.id))
      : candidateEntries;

  return {
    mode,
    selectedQuizIds: Array.from(selectedIds),
    allCandidatePackages: candidateEntries.map(e => e.pkg),
    candidateEntries,
    includedPackages: includedEntries.map(e => e.pkg),
    includedEntries,
  };
}

export async function saveGradebookClassConfig(params: {
  classId: string;
  courseId: string;
  mode: SelectionMode;
  selectedQuizIds: string[];
  updatedById?: string;
}) {
  const { classId, courseId, mode, selectedQuizIds, updatedById } = params;
  const uniqueRequestedIds = Array.from(new Set(selectedQuizIds));

  const [classroom, course, allPackages, pages, categories] = await Promise.all([
    db.orm.public.Classroom.where({ id: classId }).first(),
    db.orm.public.Course.where({ id: courseId }).first(),
    db.orm.public.QuizPackage.all(),
    db.orm.public.Page.all(),
    db.orm.public.MaterialCategory.all(),
  ]);

  if (!classroom) throw new Error('Kelas tidak ditemukan.');
  if (!course) throw new Error('Mata pelajaran tidak ditemukan.');

  const pageMap = new Map(pages.map(p => [p.id, p]));
  const categoryMap = new Map(categories.map(c => [c.id, c]));
  const validCoursePackageIds = new Set(
    allPackages
      .filter(pkg => resolvePackageCourseIds(pkg, pageMap, categoryMap).candidateCourseIds.includes(courseId))
      .map(pkg => pkg.id)
  );

  if (mode === 'CUSTOM') {
    const invalidIds = uniqueRequestedIds.filter(id => !validCoursePackageIds.has(id));
    if (invalidIds.length > 0) {
      throw new Error('Sebagian kuis yang dipilih bukan bagian dari mata pelajaran ini.');
    }
  }

  let config = await db.orm.public.GradebookClassConfig.where({
    classroomId: classId,
    courseId,
  }).first();

  if (config) {
    await db.orm.public.GradebookClassConfig.where({ id: config.id }).update({
      mode,
      updatedById: updatedById || null,
    });
  } else {
    config = await db.orm.public.GradebookClassConfig.create({
      id: randomUUID(),
      classroomId: classId,
      courseId,
      mode,
      updatedById: updatedById || null,
    });
  }

  const existingSelections = await db.orm.public.GradebookSelectedQuiz.where({ configId: config.id }).all();
  const targetSet = mode === 'CUSTOM' ? new Set(uniqueRequestedIds) : new Set<string>();
  const existingSet = new Set(existingSelections.map(row => row.quizPackageId));

  for (const row of existingSelections) {
    if (!targetSet.has(row.quizPackageId)) {
      await db.orm.public.GradebookSelectedQuiz.where({ id: row.id }).delete();
    }
  }

  for (const pkgId of targetSet) {
    if (!existingSet.has(pkgId)) {
      await db.orm.public.GradebookSelectedQuiz.create({
        id: randomUUID(),
        configId: config.id,
        classroomId: classId,
        courseId,
        quizPackageId: pkgId,
      });
    }
  }

  // Opsi A: Sinkronkan ulang StudentScoreSummary untuk seluruh murid di kelas agar /rapor konsisten
  const students = await db.orm.public.User.where({ classId, role: 'MURID' }).all();
  if (students.length > 0) {
    const { updateStudentScoreSummary } = await import('@/modules/quiz-completion/quiz-completion.service');
    for (const s of students) {
      await updateStudentScoreSummary(s.id);
    }
  }

  return {
    configId: config.id,
    mode,
    selectedQuizIds: Array.from(targetSet),
  };
}

export async function getOtherClassesConfigSummary(
  courseId: string,
  excludeClassId: string,
  allowedClassIds?: Set<string>
) {
  const [classrooms, configs, selectedRows] = await Promise.all([
    db.orm.public.Classroom.all(),
    db.orm.public.GradebookClassConfig.where({ courseId }).all(),
    db.orm.public.GradebookSelectedQuiz.where({ courseId }).all(),
  ]);

  const configByClass = new Map(configs.map(c => [c.classroomId, c]));
  const countByConfig = new Map<string, number>();
  for (const row of selectedRows) {
    countByConfig.set(row.configId, (countByConfig.get(row.configId) || 0) + 1);
  }

  return classrooms
    .filter(c => c.id !== excludeClassId && c.isActive && (!allowedClassIds || allowedClassIds.has(c.id)))
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(c => {
      const cfg = configByClass.get(c.id);
      const mode: SelectionMode = cfg?.mode === 'CUSTOM' ? 'CUSTOM' : 'ALL';
      return {
        classId: c.id,
        className: c.name,
        mode,
        selectedCount: cfg && mode === 'CUSTOM' ? (countByConfig.get(cfg.id) || 0) : 0,
      };
    });
}

export async function copyGradebookClassConfig(params: {
  sourceClassId: string;
  targetClassId: string;
  courseId: string;
  updatedById?: string;
}) {
  const { sourceClassId, targetClassId, courseId, updatedById } = params;
  if (sourceClassId === targetClassId) {
    throw new Error('Kelas sumber dan kelas tujuan tidak boleh sama.');
  }

  const sourceConfig = await db.orm.public.GradebookClassConfig.where({
    classroomId: sourceClassId,
    courseId,
  }).first();

  if (!sourceConfig || sourceConfig.mode === 'ALL') {
    return await saveGradebookClassConfig({
      classId: targetClassId,
      courseId,
      mode: 'ALL',
      selectedQuizIds: [],
      updatedById,
    });
  }

  const [sourceRows, targetEffective] = await Promise.all([
    db.orm.public.GradebookSelectedQuiz.where({ configId: sourceConfig.id }).all(),
    getEffectivePackagesForClassCourse(targetClassId, courseId),
  ]);

  // Pastikan hanya menyalin kuis yang valid di kelas tujuan (mis. DISCUSSION yang ter-assign di target)
  const targetCandidateIds = new Set(targetEffective.allCandidatePackages.map(p => p.id));
  const copiedIds = sourceRows
    .map(r => r.quizPackageId)
    .filter(id => targetCandidateIds.has(id));

  return await saveGradebookClassConfig({
    classId: targetClassId,
    courseId,
    mode: 'CUSTOM',
    selectedQuizIds: copiedIds,
    updatedById,
  });
}

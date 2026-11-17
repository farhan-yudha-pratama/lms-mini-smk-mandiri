import { db } from '@/prisma/db';
import { randomUUID } from 'crypto';
import { resolvePackageCourseIds, type TeacherScope } from '@/modules/course/teacher-scope.service';
import { assertTeacherCanAccessQuizAssignment } from '@/modules/quiz-assignment/quiz-assignment.service';

export interface ClassGroupDTO {
  id: string;
  quizPackageId: string;
  classroomId: string;
  courseId: string;
  createdByTeacherId: string;
  creatorName: string;
  isOwnedByCurrentUser: boolean;
  canEdit: boolean;
  name: string;
  taskNote: string | null;
  quizVariantId: string | null;
  variantName: string | null;
  isShared: boolean;
  ruleMode: 'RANDOM_COUNT' | 'RANDOM_SIZE' | 'MANUAL';
  ruleValue: number | null;
  hasAttempt: boolean;
  attemptStatus: string;
  attemptScore: number | null;
  members: Array<{
    id: string;
    studentId: string;
    studentName: string;
    studentEmail: string;
    scoreOverride: number | null;
  }>;
}

export interface GroupSetupData {
  groups: ClassGroupDTO[];
  enrolledStudents: Array<{ id: string; name: string; email: string }>;
  unassignedStudents: Array<{ id: string; name: string; email: string }>;
  copySources: Array<{ sourcePackageId: string; title: string; groupCount: number }>;
  isClassShared: boolean;
}

function shuffleArray<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

async function resolveGroupPackageContext(packageId: string) {
  const pkg = await db.orm.public.QuizPackage.where({ id: packageId }).first();
  if (!pkg) throw new Error('Paket kuis tidak ditemukan');

  const [pages, categories] = await Promise.all([
    pkg.pageId ? db.orm.public.Page.where({ id: pkg.pageId }).all() : Promise.resolve([]),
    pkg.pageId ? db.orm.public.MaterialCategory.all() : Promise.resolve([]),
  ]);
  const { primaryCourseId, candidateCourseIds } = resolvePackageCourseIds(
    pkg,
    new Map(pages.map(p => [p.id, p])),
    new Map(categories.map(c => [c.id, c]))
  );
  if (!primaryCourseId) {
    throw new Error('Paket kuis belum terhubung ke mata pelajaran.');
  }
  return { pkg, primaryCourseId, candidateCourseIds };
}

export function isGroupVisibleToScope(
  group: { createdByTeacherId: string; isShared: boolean },
  scope: TeacherScope
): boolean {
  if (scope.isUnrestricted) return true;
  return group.createdByTeacherId === scope.userId || group.isShared === true;
}

export function canEditGroupForScope(
  group: { createdByTeacherId: string; isShared: boolean },
  scope: TeacherScope
): boolean {
  if (scope.isUnrestricted) return true;
  return group.createdByTeacherId === scope.userId || group.isShared === true;
}

async function emitGroupTasksUpdated(packageId: string, classId: string, studentIds: string[]) {
  if (studentIds.length === 0) return;
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
      studentIds,
      classId,
      assignedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[quiz-group] Socket emit error:', err);
  }
}

export async function getGroupSetupData(
  packageId: string,
  classId: string,
  scope: TeacherScope
): Promise<GroupSetupData> {
  const { primaryCourseId, candidateCourseIds } = await resolveGroupPackageContext(packageId);

  const [
    classStudents,
    courseEnrollments,
    allPackageGroups,
    allClassGroupsForClass,
    allMembers,
    variants,
    allAttempts,
    allUsers,
    allPackages,
    allCategories,
    allPages,
  ] = await Promise.all([
    db.orm.public.User.where({ classId, role: 'MURID' }).all(),
    db.orm.public.CourseStudent.all(),
    db.orm.public.ClassGroup.where({ quizPackageId: packageId, classroomId: classId }).all(),
    db.orm.public.ClassGroup.where({ classroomId: classId }).all(),
    db.orm.public.ClassGroupMember.all(),
    db.orm.public.QuizVariant.where({ quizPackageId: packageId }).all(),
    db.orm.public.QuizAttempt.all(),
    db.orm.public.User.all(),
    db.orm.public.QuizPackage.all(),
    db.orm.public.MaterialCategory.all(),
    db.orm.public.Page.all(),
  ]);

  const courseSet = new Set(candidateCourseIds);
  const enrolledIds = new Set(
    courseEnrollments.filter(e => courseSet.has(e.courseId)).map(e => e.studentId)
  );
  const enrolledStudents = classStudents
    .filter(s => enrolledIds.has(s.id) && s.isActive !== false)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(s => ({ id: s.id, name: s.name, email: s.email }));

  const userMap = new Map(allUsers.map(u => [u.id, u]));
  const variantMap = new Map(variants.map(v => [v.id, v]));
  const attemptByGroupId = new Map<string, any>();
  for (const att of allAttempts) {
    if (att.groupId) attemptByGroupId.set(att.groupId, att);
  }

  const visibleGroups = allPackageGroups
    .filter(g => isGroupVisibleToScope(g, scope))
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

  const assignedInVisible = new Set<string>();
  const groups: ClassGroupDTO[] = visibleGroups.map(g => {
    const members = allMembers
      .filter(m => m.groupId === g.id)
      .map(m => {
        assignedInVisible.add(m.studentId);
        const stu = userMap.get(m.studentId);
        return {
          id: m.id,
          studentId: m.studentId,
          studentName: stu?.name || 'Siswa',
          studentEmail: stu?.email || '',
          scoreOverride: m.scoreOverride ?? null,
        };
      })
      .sort((a, b) => a.studentName.localeCompare(b.studentName));

    const attempt = attemptByGroupId.get(g.id) || null;
    const creator = userMap.get(g.createdByTeacherId);
    const variant = g.quizVariantId ? variantMap.get(g.quizVariantId) : null;

    return {
      id: g.id,
      quizPackageId: g.quizPackageId,
      classroomId: g.classroomId,
      courseId: g.courseId,
      createdByTeacherId: g.createdByTeacherId,
      creatorName: creator?.name || 'Guru',
      isOwnedByCurrentUser: g.createdByTeacherId === scope.userId,
      canEdit: canEditGroupForScope(g, scope),
      name: g.name,
      taskNote: g.taskNote || null,
      quizVariantId: g.quizVariantId || null,
      variantName: variant?.name || null,
      isShared: Boolean(g.isShared),
      ruleMode: g.ruleMode as any,
      ruleValue: g.ruleValue ?? null,
      hasAttempt: Boolean(attempt),
      attemptStatus: attempt?.status || 'NOT_STARTED',
      attemptScore: attempt?.score ?? null,
      members,
    };
  });

  const unassignedStudents = enrolledStudents.filter(s => !assignedInVisible.has(s.id));

  // Sumber tugas lain di mapel & kelas yang sama untuk "Salin Kelompok"
  const pageMap = new Map(allPages.map(p => [p.id, p]));
  const catMap = new Map(allCategories.map(c => [c.id, c]));
  const pkgMap = new Map(allPackages.map(p => [p.id, p]));

  const sourceGroupCountMap = new Map<string, number>();
  for (const g of allClassGroupsForClass) {
    if (g.quizPackageId === packageId) continue;
    if (!isGroupVisibleToScope(g, scope)) continue;
    const srcPkg = pkgMap.get(g.quizPackageId);
    if (!srcPkg) continue;
    const { primaryCourseId: srcCourseId } = resolvePackageCourseIds(srcPkg, pageMap, catMap);
    if (srcCourseId !== primaryCourseId) continue;
    sourceGroupCountMap.set(g.quizPackageId, (sourceGroupCountMap.get(g.quizPackageId) || 0) + 1);
  }

  const copySources = Array.from(sourceGroupCountMap.entries())
    .map(([sourcePackageId, groupCount]) => ({
      sourcePackageId,
      title: pkgMap.get(sourcePackageId)?.title || 'Tugas',
      groupCount,
    }))
    .sort((a, b) => a.title.localeCompare(b.title));

  const ownGroups = groups.filter(g => g.isOwnedByCurrentUser);
  const isClassShared = ownGroups.length > 0 ? ownGroups.every(g => g.isShared) : groups.some(g => g.isShared);

  return {
    groups,
    enrolledStudents,
    unassignedStudents,
    copySources,
    isClassShared,
  };
}

export async function generateRandomGroups(
  params: {
    packageId: string;
    classId: string;
    mode: 'RANDOM_COUNT' | 'RANDOM_SIZE';
    value: number;
    isShared: boolean;
    assignVariantStrategy: 'ROUND_ROBIN' | 'SINGLE';
    defaultVariantId?: string | null;
  },
  scope: TeacherScope
) {
  await assertTeacherCanAccessQuizAssignment(scope, params.packageId, { classId: params.classId });
  const { pkg, primaryCourseId, candidateCourseIds } = await resolveGroupPackageContext(params.packageId);

  if ((pkg as any).assignmentMode !== 'GROUP') {
    throw new Error('Aktifkan mode Tugas Kelompok pada tab Pengaturan & Jadwal terlebih dahulu.');
  }

  const [classStudents, courseEnrollments, existingGroups, variants, attempts] = await Promise.all([
    db.orm.public.User.where({ classId: params.classId, role: 'MURID' }).all(),
    db.orm.public.CourseStudent.all(),
    db.orm.public.ClassGroup.where({ quizPackageId: params.packageId, classroomId: params.classId }).all(),
    db.orm.public.QuizVariant.where({ quizPackageId: params.packageId }).all(),
    db.orm.public.QuizAttempt.all(),
  ]);

  const activeVariants = variants.filter(v => v.isActive !== false);
  let selectedSingleVariantId: string | null = null;
  if (params.assignVariantStrategy === 'SINGLE' && params.defaultVariantId) {
    const found = activeVariants.find(v => v.id === params.defaultVariantId);
    if (!found) throw new Error('Varian tugas yang dipilih tidak aktif atau tidak ditemukan.');
    selectedSingleVariantId = found.id;
  }

  const courseSet = new Set(candidateCourseIds);
  const enrolledIds = new Set(courseEnrollments.filter(e => courseSet.has(e.courseId)).map(e => e.studentId));
  const candidateStudents = classStudents.filter(s => enrolledIds.has(s.id) && s.isActive !== false);

  if (candidateStudents.length === 0) {
    throw new Error('Belum ada siswa aktif di kelas ini yang tergabung ke mata pelajaran ini.');
  }

  const attemptGroupIds = new Set(attempts.filter(a => a.groupId).map(a => a.groupId!));
  const ownGroups = existingGroups.filter(g => scope.isUnrestricted || g.createdByTeacherId === scope.userId);

  if (ownGroups.some(g => attemptGroupIds.has(g.id))) {
    throw new Error('Sebagian kelompok sudah mulai mengerjakan tugas. Reset pengerjaan di Laporan sebelum mengacak ulang.');
  }

  // Hapus kelompok lama milik pembuat saat ini untuk package + class ini
  for (const oldGroup of ownGroups) {
    const oldMembers = await db.orm.public.ClassGroupMember.where({ groupId: oldGroup.id }).all();
    for (const m of oldMembers) {
      await db.orm.public.ClassGroupMember.where({ id: m.id }).delete();
    }
    await db.orm.public.ClassGroup.where({ id: oldGroup.id }).delete();
  }

  // Jika mode sharing diaktifkan, kecualikan siswa yang sudah berada di kelompok SHARED guru lain
  let pool = candidateStudents;
  if (params.isShared && !scope.isUnrestricted) {
    const otherSharedGroupIds = new Set(
      existingGroups.filter(g => g.createdByTeacherId !== scope.userId && g.isShared).map(g => g.id)
    );
    if (otherSharedGroupIds.size > 0) {
      const allMembers = await db.orm.public.ClassGroupMember.all();
      const takenStudentIds = new Set(
        allMembers.filter(m => otherSharedGroupIds.has(m.groupId)).map(m => m.studentId)
      );
      pool = candidateStudents.filter(s => !takenStudentIds.has(s.id));
      if (pool.length === 0) {
        throw new Error('Seluruh siswa di kelas ini sudah masuk ke kelompok sharing guru lain.');
      }
    }
  }

  const shuffled = shuffleArray(pool);
  const groupCount =
    params.mode === 'RANDOM_COUNT'
      ? Math.max(1, Math.min(params.value, shuffled.length))
      : Math.max(1, Math.ceil(shuffled.length / Math.max(1, params.value)));

  const buckets: Array<typeof shuffled> = Array.from({ length: groupCount }, () => []);
  shuffled.forEach((student, idx) => {
    buckets[idx % groupCount].push(student);
  });

  const nowIso = new Date().toISOString();
  const createdGroupIds: string[] = [];

  for (let i = 0; i < buckets.length; i++) {
    const variantId =
      params.assignVariantStrategy === 'SINGLE'
        ? selectedSingleVariantId || activeVariants[0]?.id || null
        : activeVariants.length > 0
          ? activeVariants[i % activeVariants.length].id
          : null;

    const groupId = randomUUID();
    await db.orm.public.ClassGroup.create({
      id: groupId,
      quizPackageId: params.packageId,
      classroomId: params.classId,
      courseId: primaryCourseId,
      createdByTeacherId: scope.userId,
      name: `Kelompok ${i + 1}`,
      taskNote: null,
      quizVariantId: variantId,
      isShared: params.isShared,
      ruleMode: params.mode,
      ruleValue: params.value,
      createdAt: nowIso,
    });

    for (const stu of buckets[i]) {
      await db.orm.public.ClassGroupMember.create({
        id: randomUUID(),
        groupId,
        studentId: stu.id,
        scoreOverride: null,
        createdAt: nowIso,
      });
    }
    createdGroupIds.push(groupId);
  }

  await emitGroupTasksUpdated(
    params.packageId,
    params.classId,
    pool.map(s => s.id)
  );

  return { groupCount: createdGroupIds.length, studentCount: pool.length };
}

export async function upsertManualGroup(
  params: {
    packageId: string;
    classId: string;
    groupId?: string;
    name: string;
    taskNote?: string | null;
    quizVariantId?: string | null;
    studentIds: string[];
    isShared: boolean;
  },
  scope: TeacherScope
) {
  await assertTeacherCanAccessQuizAssignment(scope, params.packageId, { classId: params.classId });
  const { pkg, primaryCourseId, candidateCourseIds } = await resolveGroupPackageContext(params.packageId);

  if ((pkg as any).assignmentMode !== 'GROUP') {
    throw new Error('Aktifkan mode Tugas Kelompok pada tab Pengaturan & Jadwal terlebih dahulu.');
  }

  const uniqueStudentIds = Array.from(new Set(params.studentIds));
  if (uniqueStudentIds.length > 0) {
    const [enrollments, classStudents] = await Promise.all([
      db.orm.public.CourseStudent.all(),
      db.orm.public.User.where({ classId: params.classId, role: 'MURID' }).all(),
    ]);
    const classStudentSet = new Set(classStudents.map(s => s.id));
    const courseSet = new Set(candidateCourseIds);
    const enrolledSet = new Set(enrollments.filter(e => courseSet.has(e.courseId)).map(e => e.studentId));
    for (const sId of uniqueStudentIds) {
      if (!classStudentSet.has(sId) || !enrolledSet.has(sId)) {
        throw new Error('Terdapat siswa yang bukan anggota kelas atau belum terdaftar di mata pelajaran ini.');
      }
    }
  }

  if (params.quizVariantId) {
    const variant = await db.orm.public.QuizVariant.where({ id: params.quizVariantId }).first();
    if (!variant || variant.quizPackageId !== params.packageId || variant.isActive === false) {
      throw new Error('Varian tugas tidak valid atau sedang nonaktif.');
    }
  }

  // Pastikan siswa tidak rangkap kelompok di kelompok yang visible bagi guru ini
  const existingGroups = await db.orm.public.ClassGroup.where({
    quizPackageId: params.packageId,
    classroomId: params.classId,
  }).all();

  const otherVisibleGroupIds = new Set(
    existingGroups
      .filter(g => g.id !== params.groupId && isGroupVisibleToScope(g, scope))
      .map(g => g.id)
  );
  if (otherVisibleGroupIds.size > 0 && uniqueStudentIds.length > 0) {
    const allMembers = await db.orm.public.ClassGroupMember.all();
    const conflict = allMembers.find(
      m => otherVisibleGroupIds.has(m.groupId) && uniqueStudentIds.includes(m.studentId)
    );
    if (conflict) {
      throw new Error('Sebagian siswa sudah tergabung di kelompok lain. Pindahkan/keluarkan terlebih dahulu.');
    }
  }

  const nowIso = new Date().toISOString();
  let targetGroupId = params.groupId;
  let affectedStudentIds = [...uniqueStudentIds];

  if (targetGroupId) {
    const existing = await db.orm.public.ClassGroup.where({ id: targetGroupId }).first();
    if (!existing || existing.quizPackageId !== params.packageId || existing.classroomId !== params.classId) {
      throw new Error('Kelompok tidak ditemukan.');
    }
    if (!canEditGroupForScope(existing, scope)) {
      throw new Error('Anda tidak memiliki izin mengubah kelompok ini.');
    }

    const attempt = await db.orm.public.QuizAttempt.where({ groupId: existing.id }).first();
    if (attempt) {
      if (attempt.quizVariantId !== (params.quizVariantId || existing.quizVariantId)) {
        throw new Error('Kelompok sudah mulai mengerjakan tugas; varian soal tidak dapat diganti.');
      }
      if (attempt.status === 'COMPLETED' || attempt.status === 'GRADED') {
        throw new Error('Kelompok sudah menyelesaikan tugas; daftar anggota tidak dapat diubah.');
      }
    }

    await db.orm.public.ClassGroup.where({ id: existing.id }).update({
      name: params.name,
      taskNote: params.taskNote || null,
      quizVariantId: params.quizVariantId || null,
      isShared: params.isShared,
    });

    const currentMembers = await db.orm.public.ClassGroupMember.where({ groupId: existing.id }).all();
    const currentSet = new Set(currentMembers.map(m => m.studentId));
    affectedStudentIds = Array.from(new Set([...affectedStudentIds, ...currentMembers.map(m => m.studentId)]));

    for (const m of currentMembers) {
      if (!uniqueStudentIds.includes(m.studentId)) {
        await db.orm.public.ClassGroupMember.where({ id: m.id }).delete();
      }
    }
    for (const sId of uniqueStudentIds) {
      if (!currentSet.has(sId)) {
        await db.orm.public.ClassGroupMember.create({
          id: randomUUID(),
          groupId: existing.id,
          studentId: sId,
          scoreOverride: null,
          createdAt: nowIso,
        });
      }
    }
  } else {
    targetGroupId = randomUUID();
    await db.orm.public.ClassGroup.create({
      id: targetGroupId,
      quizPackageId: params.packageId,
      classroomId: params.classId,
      courseId: primaryCourseId,
      createdByTeacherId: scope.userId,
      name: params.name,
      taskNote: params.taskNote || null,
      quizVariantId: params.quizVariantId || null,
      isShared: params.isShared,
      ruleMode: 'MANUAL',
      ruleValue: null,
      createdAt: nowIso,
    });
    for (const sId of uniqueStudentIds) {
      await db.orm.public.ClassGroupMember.create({
        id: randomUUID(),
        groupId: targetGroupId,
        studentId: sId,
        scoreOverride: null,
        createdAt: nowIso,
      });
    }
  }

  await emitGroupTasksUpdated(params.packageId, params.classId, affectedStudentIds);
  return { groupId: targetGroupId };
}

export async function moveGroupMember(
  params: { packageId: string; classId: string; studentId: string; targetGroupId: string },
  scope: TeacherScope
) {
  await assertTeacherCanAccessQuizAssignment(scope, params.packageId, { classId: params.classId });

  const targetGroup = await db.orm.public.ClassGroup.where({ id: params.targetGroupId }).first();
  if (!targetGroup || targetGroup.quizPackageId !== params.packageId || targetGroup.classroomId !== params.classId) {
    throw new Error('Kelompok tujuan tidak ditemukan.');
  }
  if (!canEditGroupForScope(targetGroup, scope)) {
    throw new Error('Anda tidak memiliki izin mengubah kelompok tujuan.');
  }

  const targetAttempt = await db.orm.public.QuizAttempt.where({ groupId: targetGroup.id }).first();
  if (targetAttempt && (targetAttempt.status === 'COMPLETED' || targetAttempt.status === 'GRADED')) {
    throw new Error('Kelompok tujuan sudah menyelesaikan tugas.');
  }

  const allGroups = await db.orm.public.ClassGroup.where({
    quizPackageId: params.packageId,
    classroomId: params.classId,
  }).all();

  const visibleIds = new Set(allGroups.filter(g => isGroupVisibleToScope(g, scope)).map(g => g.id));
  const memberRows = await db.orm.public.ClassGroupMember.where({ studentId: params.studentId }).all();
  const currentInScope = memberRows.filter(m => visibleIds.has(m.groupId));

  for (const row of currentInScope) {
    if (row.groupId === targetGroup.id) continue;
    const srcGroup = allGroups.find(g => g.id === row.groupId);
    if (srcGroup && !canEditGroupForScope(srcGroup, scope)) {
      throw new Error('Anda tidak memiliki izin memindahkan anggota dari kelompok asal.');
    }
    const srcAttempt = await db.orm.public.QuizAttempt.where({ groupId: row.groupId }).first();
    if (srcAttempt && (srcAttempt.status === 'COMPLETED' || srcAttempt.status === 'GRADED')) {
      throw new Error('Kelompok asal sudah menyelesaikan tugas sehingga anggota tidak dapat dipindahkan.');
    }
    await db.orm.public.ClassGroupMember.where({ id: row.id }).delete();
  }

  if (!currentInScope.some(r => r.groupId === targetGroup.id)) {
    await db.orm.public.ClassGroupMember.create({
      id: randomUUID(),
      groupId: targetGroup.id,
      studentId: params.studentId,
      scoreOverride: null,
      createdAt: new Date().toISOString(),
    });
  }

  await emitGroupTasksUpdated(params.packageId, params.classId, [params.studentId]);
  return { success: true };
}

export async function deleteClassGroup(groupId: string, scope: TeacherScope) {
  const group = await db.orm.public.ClassGroup.where({ id: groupId }).first();
  if (!group) throw new Error('Kelompok tidak ditemukan.');

  await assertTeacherCanAccessQuizAssignment(scope, group.quizPackageId, { classId: group.classroomId });
  if (!canEditGroupForScope(group, scope)) {
    throw new Error('Anda tidak memiliki izin menghapus kelompok ini.');
  }

  const attempt = await db.orm.public.QuizAttempt.where({ groupId: group.id }).first();
  if (attempt) {
    throw new Error('Kelompok sudah memiliki pengerjaan tugas. Reset di Laporan terlebih dahulu sebelum menghapus.');
  }

  const members = await db.orm.public.ClassGroupMember.where({ groupId: group.id }).all();
  for (const m of members) {
    await db.orm.public.ClassGroupMember.where({ id: m.id }).delete();
  }
  await db.orm.public.ClassGroup.where({ id: group.id }).delete();

  await emitGroupTasksUpdated(
    group.quizPackageId,
    group.classroomId,
    members.map(m => m.studentId)
  );
  return { success: true };
}

export async function setPackageClassGroupsSharing(
  params: { packageId: string; classId: string; isShared: boolean },
  scope: TeacherScope
) {
  await assertTeacherCanAccessQuizAssignment(scope, params.packageId, { classId: params.classId });
  const groups = await db.orm.public.ClassGroup.where({
    quizPackageId: params.packageId,
    classroomId: params.classId,
  }).all();

  const editable = groups.filter(g => scope.isUnrestricted || g.createdByTeacherId === scope.userId);
  for (const g of editable) {
    await db.orm.public.ClassGroup.where({ id: g.id }).update({ isShared: params.isShared });
  }
  return { updatedCount: editable.length };
}

export async function copyGroupsFromPackage(
  params: { targetPackageId: string; sourcePackageId: string; classId: string; isShared: boolean },
  scope: TeacherScope
) {
  await assertTeacherCanAccessQuizAssignment(scope, params.targetPackageId, { classId: params.classId });
  const { pkg: targetPkg, primaryCourseId } = await resolveGroupPackageContext(params.targetPackageId);
  if ((targetPkg as any).assignmentMode !== 'GROUP') {
    throw new Error('Aktifkan mode Tugas Kelompok pada pengaturan paket tujuan terlebih dahulu.');
  }

  const [sourceGroups, targetGroups, allMembers, targetVariants, sourceVariants, attempts] = await Promise.all([
    db.orm.public.ClassGroup.where({ quizPackageId: params.sourcePackageId, classroomId: params.classId }).all(),
    db.orm.public.ClassGroup.where({ quizPackageId: params.targetPackageId, classroomId: params.classId }).all(),
    db.orm.public.ClassGroupMember.all(),
    db.orm.public.QuizVariant.where({ quizPackageId: params.targetPackageId }).all(),
    db.orm.public.QuizVariant.where({ quizPackageId: params.sourcePackageId }).all(),
    db.orm.public.QuizAttempt.all(),
  ]);

  const visibleSources = sourceGroups
    .filter(g => isGroupVisibleToScope(g, scope))
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
  if (visibleSources.length === 0) {
    throw new Error('Tidak ada kelompok yang dapat disalin dari tugas sumber tersebut.');
  }

  const attemptGroupIds = new Set(attempts.filter(a => a.groupId).map(a => a.groupId!));
  const ownTargets = targetGroups.filter(g => scope.isUnrestricted || g.createdByTeacherId === scope.userId);
  if (ownTargets.some(g => attemptGroupIds.has(g.id))) {
    throw new Error('Kelompok pada tugas ini sudah memiliki pengerjaan. Reset di Laporan sebelum menyalin ulang.');
  }

  for (const g of ownTargets) {
    const members = allMembers.filter(m => m.groupId === g.id);
    for (const m of members) {
      await db.orm.public.ClassGroupMember.where({ id: m.id }).delete();
    }
    await db.orm.public.ClassGroup.where({ id: g.id }).delete();
  }

  const activeTargetVariants = targetVariants.filter(v => v.isActive !== false);
  const srcVariantNameMap = new Map(sourceVariants.map(v => [v.id, v.name]));
  const nowIso = new Date().toISOString();
  const affectedStudents: string[] = [];

  for (let i = 0; i < visibleSources.length; i++) {
    const src = visibleSources[i];
    const srcVariantName = src.quizVariantId ? srcVariantNameMap.get(src.quizVariantId) : null;
    const matchedTargetVariant =
      (srcVariantName && activeTargetVariants.find(v => v.name.toLowerCase() === srcVariantName.toLowerCase())) ||
      activeTargetVariants[i % Math.max(1, activeTargetVariants.length)] ||
      null;

    const newGroupId = randomUUID();
    await db.orm.public.ClassGroup.create({
      id: newGroupId,
      quizPackageId: params.targetPackageId,
      classroomId: params.classId,
      courseId: primaryCourseId,
      createdByTeacherId: scope.userId,
      name: src.name,
      taskNote: src.taskNote || null,
      quizVariantId: matchedTargetVariant?.id || null,
      isShared: params.isShared,
      ruleMode: src.ruleMode as any,
      ruleValue: src.ruleValue ?? null,
      createdAt: nowIso,
    });

    const srcMembers = allMembers.filter(m => m.groupId === src.id);
    for (const m of srcMembers) {
      await db.orm.public.ClassGroupMember.create({
        id: randomUUID(),
        groupId: newGroupId,
        studentId: m.studentId,
        scoreOverride: null,
        createdAt: nowIso,
      });
      affectedStudents.push(m.studentId);
    }
  }

  await emitGroupTasksUpdated(params.targetPackageId, params.classId, affectedStudents);
  return { copiedGroups: visibleSources.length, copiedMembers: affectedStudents.length };
}

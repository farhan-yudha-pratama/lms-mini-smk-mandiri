'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireAnyPermission } from '@/lib/permissions-server';
import { resolveTeacherScope } from '@/modules/course/teacher-scope.service';
import { assertTeacherCanAccessQuizAssignment } from '@/modules/quiz-assignment/quiz-assignment.service';
import {
  copyGroupsFromPackage,
  deleteClassGroup,
  generateRandomGroups,
  getGroupSetupData,
  moveGroupMember,
  setPackageClassGroupsSharing,
  upsertManualGroup,
} from './quiz-group.service';
import {
  copyGroupsSchema,
  generateRandomGroupsSchema,
  moveGroupMemberSchema,
  toggleGroupSharingSchema,
  upsertGroupSchema,
} from './quiz-group.schema';

export async function getGroupSetupAction(packageId: string, classId: string) {
  try {
    const session = await requireAnyPermission(['QUIZZES_VIEW', 'QUIZZES_MANAGE', 'QUIZZES_UPDATE', 'QUIZZES_CREATE']);
    const scope = await resolveTeacherScope(session);
    await assertTeacherCanAccessQuizAssignment(scope, packageId, { classId });

    const data = await getGroupSetupData(packageId, classId, scope);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error && error.message === 'FORBIDDEN'
        ? 'Anda tidak memiliki akses ke kelas ini'
        : error instanceof Error ? error.message : 'Gagal memuat data kelompok',
    };
  }
}

export async function generateRandomGroupsAction(input: z.input<typeof generateRandomGroupsSchema>) {
  try {
    const session = await requireAnyPermission(['QUIZZES_MANAGE', 'QUIZZES_UPDATE', 'QUIZZES_CREATE']);
    const scope = await resolveTeacherScope(session);
    const parsed = generateRandomGroupsSchema.parse(input);
    const result = await generateRandomGroups(parsed, scope);
    revalidatePath(`/dashboard/quizzes/${parsed.packageId}/edit`);
    return { success: true, ...result };
  } catch (error) {
    if (error instanceof z.ZodError) return { success: false, message: error.issues[0].message };
    return { success: false, message: error instanceof Error ? error.message : 'Gagal mengacak kelompok' };
  }
}

export async function upsertManualGroupAction(input: z.input<typeof upsertGroupSchema>) {
  try {
    const session = await requireAnyPermission(['QUIZZES_MANAGE', 'QUIZZES_UPDATE', 'QUIZZES_CREATE']);
    const scope = await resolveTeacherScope(session);
    const parsed = upsertGroupSchema.parse(input);
    const result = await upsertManualGroup(parsed, scope);
    revalidatePath(`/dashboard/quizzes/${parsed.packageId}/edit`);
    return { success: true, ...result };
  } catch (error) {
    if (error instanceof z.ZodError) return { success: false, message: error.issues[0].message };
    return { success: false, message: error instanceof Error ? error.message : 'Gagal menyimpan kelompok' };
  }
}

export async function moveGroupMemberAction(input: z.input<typeof moveGroupMemberSchema>) {
  try {
    const session = await requireAnyPermission(['QUIZZES_MANAGE', 'QUIZZES_UPDATE', 'QUIZZES_CREATE']);
    const scope = await resolveTeacherScope(session);
    const parsed = moveGroupMemberSchema.parse(input);
    await moveGroupMember(parsed, scope);
    revalidatePath(`/dashboard/quizzes/${parsed.packageId}/edit`);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) return { success: false, message: error.issues[0].message };
    return { success: false, message: error instanceof Error ? error.message : 'Gagal memindahkan anggota' };
  }
}

export async function deleteClassGroupAction(groupId: string, packageId: string) {
  try {
    const session = await requireAnyPermission(['QUIZZES_MANAGE', 'QUIZZES_UPDATE', 'QUIZZES_CREATE']);
    const scope = await resolveTeacherScope(session);
    await deleteClassGroup(groupId, scope);
    revalidatePath(`/dashboard/quizzes/${packageId}/edit`);
    return { success: true };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Gagal menghapus kelompok' };
  }
}

export async function toggleGroupSharingAction(input: z.input<typeof toggleGroupSharingSchema>) {
  try {
    const session = await requireAnyPermission(['QUIZZES_MANAGE', 'QUIZZES_UPDATE', 'QUIZZES_CREATE']);
    const scope = await resolveTeacherScope(session);
    const parsed = toggleGroupSharingSchema.parse(input);
    const result = await setPackageClassGroupsSharing(parsed, scope);
    revalidatePath(`/dashboard/quizzes/${parsed.packageId}/edit`);
    return { success: true, ...result };
  } catch (error) {
    if (error instanceof z.ZodError) return { success: false, message: error.issues[0].message };
    return { success: false, message: error instanceof Error ? error.message : 'Gagal mengubah status berbagi kelompok' };
  }
}

export async function copyGroupsFromPackageAction(input: z.input<typeof copyGroupsSchema>) {
  try {
    const session = await requireAnyPermission(['QUIZZES_MANAGE', 'QUIZZES_UPDATE', 'QUIZZES_CREATE']);
    const scope = await resolveTeacherScope(session);
    const parsed = copyGroupsSchema.parse(input);
    const result = await copyGroupsFromPackage(parsed, scope);
    revalidatePath(`/dashboard/quizzes/${parsed.targetPackageId}/edit`);
    return { success: true, ...result };
  } catch (error) {
    if (error instanceof z.ZodError) return { success: false, message: error.issues[0].message };
    return { success: false, message: error instanceof Error ? error.message : 'Gagal menyalin kelompok' };
  }
}

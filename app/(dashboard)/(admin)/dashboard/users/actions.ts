'use server';

import { getSession } from '@/lib/session';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { ActionResponse, Role } from './types';
import { BulkUserActionSchema, BulkChangeRoleSchema, BulkToggleActiveSchema, EditUserNameSchema } from './modules/user.schema';
import { userService } from './modules/user.service';

/**
 * Validasi otorisasi Superadmin.
 * Dilempar sebagai error jika gagal, dan ditangkap oleh blok try-catch di setiap action.
 */
async function requireSuperAdmin() {
  const session = await getSession();
  if (!session || session.role !== 'SUPERADMIN') {
    throw new Error('UNAUTHORIZED');
  }
}

/**
 * Helper untuk format error handling berbahasa Indonesia.
 */
function handleActionError(error: unknown): ActionResponse {
  if (error instanceof Error && error.message === 'UNAUTHORIZED') {
    return { success: false, error: 'Akses ditolak. Sesi Anda telah berakhir atau Anda tidak memiliki izin sebagai Admin.' };
  }
  
  if (error instanceof Error) {
    console.error('[User Action Error]:', error);
    return { success: false, error: error.message || 'Mohon maaf, terjadi kesalahan pada server saat memproses data pengguna.' };
  }

  return { success: false, error: 'Terjadi kesalahan sistem yang tidak diketahui.' };
}

export async function bulkResetPassword(userIds: string[]): Promise<ActionResponse> {
  try {
    await requireSuperAdmin();
    
    // Validasi Input
    const validatedData = BulkUserActionSchema.parse({ userIds });
    
    // Proses Logika
    const hashedPassword = await bcrypt.hash('password', 10);
    await userService.bulkUpdatePassword(validatedData.userIds, hashedPassword);
    
    revalidatePath('/dashboard/users');
    return { success: true, message: 'Kata sandi berhasil diatur ulang menjadi standar.' };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function bulkChangeRole(userIds: string[], newRole: Role): Promise<ActionResponse> {
  try {
    await requireSuperAdmin();
    
    // Validasi Input
    const validatedData = BulkChangeRoleSchema.parse({ userIds, newRole });
    
    // Proses Logika
    await userService.bulkUpdateRole(validatedData.userIds, validatedData.newRole);

    revalidatePath('/dashboard/users');
    return { success: true, message: `Role pengguna berhasil diubah menjadi ${newRole}.` };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function bulkToggleActive(userIds: string[], isActive: boolean): Promise<ActionResponse> {
  try {
    await requireSuperAdmin();
    
    // Validasi Input
    const validatedData = BulkToggleActiveSchema.parse({ userIds, isActive });
    
    // Proses Logika
    await userService.bulkUpdateActiveStatus(validatedData.userIds, validatedData.isActive);

    // Jika akun dimatikan, otomatis revoke sesi aktif di database
    if (!validatedData.isActive) {
      await userService.bulkRevokeSessions(validatedData.userIds);
    }

    // ponytail: Dispatch WebSocket events untuk real-time sync & auto-kick
    try {
      const { emitUserStatusChanged, emitUserRevoked } = await import('@/lib/socket/emitter');
      emitUserStatusChanged({
        userIds: validatedData.userIds,
        isActive: validatedData.isActive,
        updatedAt: new Date().toISOString()
      });

      if (!validatedData.isActive) {
        emitUserRevoked({
          userIds: validatedData.userIds,
          reason: 'DEACTIVATED',
          revokedAt: new Date().toISOString()
        });
      }
    } catch (socketErr) {
      console.error('Socket emit error in bulkToggleActive:', socketErr);
    }

    revalidatePath('/dashboard/users');
    return { success: true, message: `Status pengguna berhasil di${isActive ? 'aktifkan' : 'nonaktifkan'}.` };
  } catch (error) {
    return handleActionError(error);
  }
}

/**
 * Helper untuk mengubah string menjadi Title Case.
 */
function toTitleCase(str: string): string {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
  ).replace(/\s+/g, ' ').trim();
}

export async function editUserNameAction(userId: string, newName: string): Promise<ActionResponse> {
  try {
    await requireSuperAdmin();
    
    // Validasi Input
    const validatedData = EditUserNameSchema.parse({ userId, newName });
    const formattedName = toTitleCase(validatedData.newName);
    
    // Proses Logika
    await userService.updateUserName(validatedData.userId, formattedName);

    revalidatePath('/dashboard/users');
    return { success: true, message: 'Nama pengguna berhasil diperbarui.' };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function bulkDeleteUsersAction(userIds: string[]): Promise<ActionResponse> {
  try {
    await requireSuperAdmin();
    
    // Validasi Input
    const validatedData = BulkUserActionSchema.parse({ userIds });
    
    // Proses Logika
    await userService.bulkDeleteUsers(validatedData.userIds);

    // ponytail: Dispatch WebSocket event auto-kick pengguna yang dihapus
    try {
      const { emitUserRevoked } = await import('@/lib/socket/emitter');
      emitUserRevoked({
        userIds: validatedData.userIds,
        reason: 'DELETED',
        revokedAt: new Date().toISOString()
      });
    } catch (socketErr) {
      console.error('Socket emit error in bulkDeleteUsersAction:', socketErr);
    }

    revalidatePath('/dashboard/users');
    return { success: true, message: 'Pengguna berhasil dihapus.' };
  } catch (error) {
    console.error('[User Action Error - Delete]:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Pengguna tidak dapat dihapus karena masih memiliki relasi data aktif.' 
    };
  }
}

export async function bulkRevokeUserTokenAction(userIds: string[]): Promise<ActionResponse> {
  try {
    await requireSuperAdmin();
    
    // Validasi Input
    const validatedData = BulkUserActionSchema.parse({ userIds });
    
    // Proses Logika
    await userService.bulkRevokeSessions(validatedData.userIds);

    // ponytail: Dispatch WebSocket event auto-kick sesi pengguna
    try {
      const { emitUserRevoked } = await import('@/lib/socket/emitter');
      emitUserRevoked({
        userIds: validatedData.userIds,
        reason: 'REVOKED',
        revokedAt: new Date().toISOString()
      });
    } catch (socketErr) {
      console.error('Socket emit error in bulkRevokeUserTokenAction:', socketErr);
    }

    revalidatePath('/dashboard/users');
    return { success: true, message: 'Token pengguna berhasil di-revoke secara paksa.' };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function getUserQuizHistoryDetailsAction(userId: string) {
  try {
    await requireSuperAdmin();
    const data = await userService.getUserQuizDetails(userId);
    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Gagal mengambil riwayat kuis pengguna' 
    };
  }
}

export async function clearUserQuizHistoryAction(userId: string): Promise<ActionResponse> {
  try {
    await requireSuperAdmin();
    const result = await userService.clearUserQuizHistory(userId);
    revalidatePath('/dashboard/users');
    revalidatePath('/dashboard/gradebook');
    revalidatePath('/dashboard/archives');
    return { 
      success: true, 
      message: `Berhasil membersihkan ${result.clearedAttempts} riwayat kuis, ${result.clearedAssignments} penugasan, dan ${result.clearedCompletions} arsip nilai.` 
    };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Gagal membersihkan riwayat kuis pengguna' 
    };
  }
}

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
  
  // Zod error atau pesan general (opsional: tangkap ZodError terpisah)
  if (error instanceof Error) {
    // Hindari membocorkan pesan DB spesifik, gunakan fallback
    console.error('[User Action Error]:', error);
    return { success: false, error: 'Mohon maaf, terjadi kesalahan pada server saat memproses data pengguna. Silakan coba beberapa saat lagi.' };
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

    revalidatePath('/dashboard/users');
    return { success: true, message: 'Pengguna berhasil dihapus.' };
  } catch (error) {
    console.error('[User Action Error - Delete]:', error);
    return { 
      success: false, 
      error: 'Pengguna tidak dapat dihapus karena masih memiliki relasi data aktif di sistem (misal: riwayat kuis).' 
    };
  }
}

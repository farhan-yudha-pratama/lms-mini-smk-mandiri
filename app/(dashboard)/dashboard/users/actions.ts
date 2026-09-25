'use server';

import { getSession } from '@/lib/session';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { ActionResponse, Role } from './types';
import { BulkUserActionSchema, BulkChangeRoleSchema, BulkToggleActiveSchema } from './modules/user.schema';
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

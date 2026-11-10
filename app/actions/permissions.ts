'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { requirePermission } from '@/lib/permissions-server';
import { permissionService } from '@/modules/permission/permission.service';
import { logAudit } from '@/lib/audit';
import { emitUserPermissionsUpdated } from '@/lib/socket/emitter';
import { db } from '@/prisma/db';

export type ActionResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
};

const UpdatePermissionsSchema = z.object({
  userId: z.string().min(1, 'ID Pengguna wajib diisi.'),
  permissionCodes: z.array(z.string()),
});

/**
 * Server Action: Mengambil data permission pengguna dan katalog lengkap.
 */
export async function getUserPermissionsAction(
  userId: string
): Promise<ActionResponse<{ permissions: string[]; catalog: any[] }>> {
  try {
    await requirePermission('USERS_MANAGE');

    const [permissions, catalog] = await Promise.all([
      permissionService.getUserPermissions(userId),
      permissionService.getPermissionsCatalog(),
    ]);

    return {
      success: true,
      message: 'Berhasil memuat data hak akses.',
      data: { permissions, catalog },
    };
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return { success: false, message: 'Anda tidak memiliki wewenang untuk melihat hak akses pengguna.' };
    }
    console.error('[getUserPermissionsAction error]:', error);
    return { success: false, message: error.message || 'Gagal memuat hak akses pengguna.' };
  }
}

/**
 * Server Action: Menyimpan dan memperbarui hak akses pengguna.
 * ponytail: Sekali panggil memicu pembaruan DB, revalidasi cache, jejak audit, dan broadcast WebSocket instan.
 */
export async function updateUserPermissionsAction(
  rawInput: { userId: string; permissionCodes: string[] }
): Promise<ActionResponse<{ permissions: string[] }>> {
  try {
    const callerSession = await requirePermission('USERS_MANAGE');

    const parsed = UpdatePermissionsSchema.safeParse(rawInput);
    if (!parsed.success) {
      return {
        success: false,
        message: 'Data permohonan hak akses tidak valid.',
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    const { userId, permissionCodes } = parsed.data;

    const targetUser = await db.orm.public.User.where({ id: userId }).first();
    if (!targetUser) {
      return { success: false, message: 'Pengguna yang dituju tidak ditemukan.' };
    }

    // Jika target user adalah SUPERADMIN, hak akses tidak perlu diubah karena sudah wildcard penuh
    if (targetUser.role === 'SUPERADMIN') {
      return {
        success: false,
        message: 'Pengguna berstatus Superadmin otomatis memiliki seluruh hak akses sistem dan tidak dapat dibatasi.',
      };
    }

    const updatedPermissions = await permissionService.updateUserPermissions(userId, permissionCodes);

    // 1. Audit Trail
    await logAudit({
      action: 'UPDATE_USER_PERMISSIONS',
      message: `${callerSession.name || 'Admin'} memperbarui hak akses pengguna ${targetUser.name} (${updatedPermissions.length} hak akses diberikan)`,
      meta: {
        targetUserId: userId,
        targetEmail: targetUser.email,
        targetRole: targetUser.role,
        grantedCount: updatedPermissions.length,
        permissions: updatedPermissions,
      },
    });

    // 2. Real-time WebSocket Broadcast
    emitUserPermissionsUpdated({
      userId,
      permissionCodes: updatedPermissions,
      updatedAt: new Date().toISOString(),
    });

    // 3. Revalidate Admin Pages
    revalidatePath('/dashboard/users');
    revalidatePath('/dashboard/permissions');
    revalidatePath('/dashboard');

    return {
      success: true,
      message: `Hak akses untuk ${targetUser.name} berhasil diperbarui.`,
      data: { permissions: updatedPermissions },
    };
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return { success: false, message: 'Akses ditolak: Anda tidak memiliki wewenang untuk mengubah hak akses.' };
    }
    console.error('[updateUserPermissionsAction error]:', error);
    return { success: false, message: error.message || 'Terjadi kesalahan sistem saat memperbarui hak akses.' };
  }
}

const PackageFormSchema = z.object({
  name: z.string().min(3, 'Nama paket minimal 3 karakter.').max(100, 'Nama paket maksimal 100 karakter.'),
  category: z.string().default('Umum'),
  badge: z.string().default('Custom'),
  description: z.string().optional(),
  permissions: z.array(z.string()).min(1, 'Pilih setidaknya 1 hak akses untuk paket ini.'),
});

/**
 * Server Action: Mengambil daftar seluruh paket permission dari database.
 */
export async function getPermissionPackagesAction(): Promise<ActionResponse<any[]>> {
  try {
    await requirePermission('USERS_MANAGE');
    const packages = await permissionService.getAllPackages();
    return {
      success: true,
      message: 'Berhasil memuat paket permission.',
      data: packages,
    };
  } catch (error: any) {
    return { success: false, message: error.message || 'Gagal memuat paket permission.' };
  }
}

/**
 * Server Action: Membuat paket permission baru.
 */
export async function createPermissionPackageAction(
  rawInput: z.infer<typeof PackageFormSchema>
): Promise<ActionResponse<any>> {
  try {
    const callerSession = await requirePermission('USERS_MANAGE');
    const parsed = PackageFormSchema.safeParse(rawInput);
    if (!parsed.success) {
      return {
        success: false,
        message: 'Data paket tidak valid.',
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    const created = await permissionService.createPackage(parsed.data);

    await logAudit({
      action: 'CREATE_PERMISSION_PACKAGE',
      message: `${callerSession.name || 'Admin'} membuat paket permission baru: "${created.name}" (${created.permissions.length} izin)`,
      meta: {
        packageId: created.id,
        packageName: created.name,
        category: created.category,
        permissionsCount: created.permissions.length,
      },
    });

    revalidatePath('/dashboard/permissions');
    return {
      success: true,
      message: `Paket permission "${created.name}" berhasil dibuat.`,
      data: created,
    };
  } catch (error: any) {
    console.error('[createPermissionPackageAction error]:', error);
    return { success: false, message: error.message || 'Gagal membuat paket permission.' };
  }
}

/**
 * Server Action: Memperbarui paket permission.
 */
export async function updatePermissionPackageAction(
  id: string,
  rawInput: z.infer<typeof PackageFormSchema>
): Promise<ActionResponse<any>> {
  try {
    const callerSession = await requirePermission('USERS_MANAGE');
    const parsed = PackageFormSchema.safeParse(rawInput);
    if (!parsed.success) {
      return {
        success: false,
        message: 'Data paket tidak valid.',
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    const updated = await permissionService.updatePackage(id, parsed.data);

    await logAudit({
      action: 'UPDATE_PERMISSION_PACKAGE',
      message: `${callerSession.name || 'Admin'} memperbarui paket permission: "${updated.name}"`,
      meta: {
        packageId: id,
        packageName: updated.name,
        category: updated.category,
        permissionsCount: updated.permissions.length,
      },
    });

    revalidatePath('/dashboard/permissions');
    return {
      success: true,
      message: `Paket permission "${updated.name}" berhasil diperbarui.`,
      data: updated,
    };
  } catch (error: any) {
    console.error('[updatePermissionPackageAction error]:', error);
    return { success: false, message: error.message || 'Gagal memperbarui paket permission.' };
  }
}

/**
 * Server Action: Menghapus paket permission custom.
 */
export async function deletePermissionPackageAction(id: string): Promise<ActionResponse<{ id: string }>> {
  try {
    const callerSession = await requirePermission('USERS_MANAGE');
    const deleted = await permissionService.deletePackage(id);

    await logAudit({
      action: 'DELETE_PERMISSION_PACKAGE',
      message: `${callerSession.name || 'Admin'} menghapus paket permission: "${deleted.name}"`,
      meta: {
        packageId: id,
        packageName: deleted.name,
      },
    });

    revalidatePath('/dashboard/permissions');
    return {
      success: true,
      message: `Paket permission "${deleted.name}" berhasil dihapus.`,
      data: { id },
    };
  } catch (error: any) {
    console.error('[deletePermissionPackageAction error]:', error);
    return { success: false, message: error.message || 'Gagal menghapus paket permission.' };
  }
}

/**
 * Server Action: Menugaskan paket langsung ke pengguna.
 */
export async function applyPackageToUserAction(
  userId: string,
  packageId: string
): Promise<ActionResponse<{ permissions: string[] }>> {
  try {
    const packages = await permissionService.getAllPackages();
    const targetPkg = packages.find((p) => p.id === packageId);
    if (!targetPkg) {
      return { success: false, message: 'Paket permission yang dipilih tidak ditemukan.' };
    }

    return await updateUserPermissionsAction({
      userId,
      permissionCodes: targetPkg.permissions,
    });
  } catch (error: any) {
    return { success: false, message: error.message || 'Gagal menerapkan paket pada pengguna.' };
  }
}

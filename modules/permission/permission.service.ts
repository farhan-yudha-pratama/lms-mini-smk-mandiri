// modules/permission/permission.service.ts
import { db } from '@/prisma/db';
import crypto from 'crypto';
import { ALL_PERMISSION_CODES, type PermissionCode } from '@/lib/permissions';

export interface UserPermissionDetail {
  userId: string;
  role: string;
  permissions: string[];
}

export const permissionService = {
  /**
   * Mengambil seluruh katalog permission dari database, dikelompokkan berdasarkan kategori.
   */
  async getPermissionsCatalog() {
    const permissions = await db.orm.public.Permission.all();
    return permissions.sort((a, b) => a.category.localeCompare(b.category) || a.code.localeCompare(b.code));
  },

  /**
   * Mengambil kode permission aktif milik user tertentu.
   */
  async getUserPermissions(userId: string): Promise<string[]> {
    const user = await db.orm.public.User.where({ id: userId }).first();
    if (!user) {
      throw new Error('Pengguna tidak ditemukan.');
    }

    if (user.role === 'SUPERADMIN') {
      return [...ALL_PERMISSION_CODES];
    }

    const userPerms = await db.orm.public.UserPermission.where({ userId }).all();
    if (userPerms.length === 0) {
      return [];
    }

    const allPerms = await db.orm.public.Permission.all();
    const permMap = new Map(allPerms.map((p) => [p.id, p.code]));

    return userPerms
      .map((up) => permMap.get(up.permissionId))
      .filter((code): code is string => Boolean(code));
  },

  /**
   * Memperbarui daftar hak akses (permissions) untuk seorang pengguna.
   */
  async updateUserPermissions(userId: string, requestedCodes: string[]): Promise<string[]> {
    const user = await db.orm.public.User.where({ id: userId }).first();
    if (!user) {
      throw new Error('Pengguna tidak ditemukan.');
    }

    const allPerms = await db.orm.public.Permission.all();
    const permCodeToId = new Map(allPerms.map((p) => [p.code, p.id]));

    // Hapus seluruh permission lama untuk user ini
    const existing = await db.orm.public.UserPermission.where({ userId }).all();
    for (const up of existing) {
      await db.orm.public.UserPermission.where({ id: up.id }).delete();
    }

    // Insert permission baru yang valid
    const validCodes: string[] = [];
    for (const code of requestedCodes) {
      const permId = permCodeToId.get(code);
      if (permId) {
        await db.orm.public.UserPermission.create({
          id: crypto.randomUUID(),
          userId,
          permissionId: permId,
          createdAt: new Date().toISOString(),
        });
        validCodes.push(code);
      }
    }

    return validCodes;
  },

  /**
   * Mengambil seluruh pengguna guru & admin beserta daftar permission aktif masing-masing.
   */
  async getUsersWithPermissions() {
    const users = await db.orm.public.User.all();
    const targetUsers = users.filter((u) => u.role !== 'MURID');
    const allUserPerms = await db.orm.public.UserPermission.all();
    const allPerms = await db.orm.public.Permission.all();
    const permMap = new Map(allPerms.map((p) => [p.id, p.code]));

    const userPermsMap = new Map<string, string[]>();
    for (const up of allUserPerms) {
      const code = permMap.get(up.permissionId);
      if (code) {
        const list = userPermsMap.get(up.userId) || [];
        list.push(code);
        userPermsMap.set(up.userId, list);
      }
    }

    return targetUsers.map((user) => {
      const permissions =
        user.role === 'SUPERADMIN'
          ? [...ALL_PERMISSION_CODES]
          : userPermsMap.get(user.id) || [];

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: new Date(user.createdAt).toISOString(),
        permissions,
      };
    });
  },

  /**
   * Mengambil seluruh paket preset permission dari database.
   */
  async getAllPackages() {
    const rawPackages = await db.orm.public.PermissionPackage.all();
    return rawPackages
      .map((pkg) => {
        let permissions: string[] = [];
        try {
          permissions = JSON.parse(pkg.permissions);
        } catch (e) {
          permissions = [];
        }
        return {
          id: pkg.id,
          name: pkg.name,
          category: pkg.category,
          badge: pkg.badge,
          description: pkg.description || '',
          permissions,
          isSystem: pkg.isSystem,
          createdAt: new Date(pkg.createdAt).toISOString(),
          updatedAt: new Date(pkg.updatedAt).toISOString(),
        };
      })
      .sort((a, b) => (b.isSystem ? 1 : 0) - (a.isSystem ? 1 : 0) || a.name.localeCompare(b.name));
  },

  /**
   * Membuat paket permission baru.
   */
  async createPackage(data: {
    name: string;
    category?: string;
    badge?: string;
    description?: string;
    permissions: string[];
  }) {
    const existing = await db.orm.public.PermissionPackage.where({ name: data.name.trim() }).first();
    if (existing) {
      throw new Error(`Paket dengan nama "${data.name}" sudah ada.`);
    }

    const id = crypto.randomUUID();
    const created = await db.orm.public.PermissionPackage.create({
      id,
      name: data.name.trim(),
      category: data.category?.trim() || 'Umum',
      badge: data.badge?.trim() || 'Custom',
      description: data.description?.trim() || null,
      permissions: JSON.stringify(data.permissions || []),
      isSystem: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return {
      ...created,
      permissions: data.permissions || [],
    };
  },

  /**
   * Memperbarui paket permission yang ada.
   */
  async updatePackage(
    id: string,
    data: {
      name: string;
      category?: string;
      badge?: string;
      description?: string;
      permissions: string[];
    }
  ) {
    const pkg = await db.orm.public.PermissionPackage.where({ id }).first();
    if (!pkg) {
      throw new Error('Paket permission tidak ditemukan.');
    }

    if (data.name.trim() !== pkg.name) {
      const duplicate = await db.orm.public.PermissionPackage.where({ name: data.name.trim() }).first();
      if (duplicate && duplicate.id !== id) {
        throw new Error(`Paket dengan nama "${data.name}" sudah digunakan.`);
      }
    }

    await db.orm.public.PermissionPackage.where({ id }).update({
      name: data.name.trim(),
      category: data.category?.trim() || pkg.category,
      badge: data.badge?.trim() || pkg.badge,
      description: data.description !== undefined ? data.description.trim() || null : pkg.description,
      permissions: JSON.stringify(data.permissions),
      updatedAt: new Date().toISOString(),
    });

    return {
      id,
      name: data.name.trim(),
      category: data.category?.trim() || pkg.category,
      badge: data.badge?.trim() || pkg.badge,
      description: data.description?.trim() || '',
      permissions: data.permissions,
      isSystem: pkg.isSystem,
    };
  },

  /**
   * Menghapus paket permission.
   */
  async deletePackage(id: string) {
    const pkg = await db.orm.public.PermissionPackage.where({ id }).first();
    if (!pkg) {
      throw new Error('Paket permission tidak ditemukan.');
    }
    if (pkg.isSystem) {
      throw new Error('Paket bawaan sistem tidak dapat dihapus.');
    }

    await db.orm.public.PermissionPackage.where({ id }).delete();
    return { id, name: pkg.name };
  },
};

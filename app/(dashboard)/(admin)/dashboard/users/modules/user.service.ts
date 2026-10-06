import { db } from '@/prisma/db';
import { Role } from '../types';

export const userService = {
  /**
   * Mengambil semua pengguna dari database.
   */
  async getAllUsers() {
    return await db.orm.public.User.all();
  },

  /**
   * Reset kata sandi pengguna secara massal (paralel).
   */
  async bulkUpdatePassword(userIds: string[], hashedPassword: string) {
    await Promise.all(
      userIds.map(id =>
        db.orm.public.User.where({ id }).update({ password: hashedPassword })
      )
    );
  },

  /**
   * Ubah role pengguna secara massal (paralel).
   */
  async bulkUpdateRole(userIds: string[], newRole: Role) {
    await Promise.all(
      userIds.map(id =>
        db.orm.public.User.where({ id }).update({ role: newRole })
      )
    );
  },

  /**
   * Ubah status aktif pengguna secara massal (paralel).
   */
  async bulkUpdateActiveStatus(userIds: string[], isActive: boolean) {
    await Promise.all(
      userIds.map(id =>
        db.orm.public.User.where({ id }).update({ isActive })
      )
    );
  },

  /**
   * Mengubah nama pengguna.
   */
  async updateUserName(userId: string, newName: string) {
    await db.orm.public.User.where({ id: userId }).update({ name: newName });
  },

  /**
   * Menghapus pengguna secara massal (hard delete).
   * Hanya akan berhasil jika tidak ada relasi di tabel lain (cascade tidak diatur by default).
   */
  async bulkDeleteUsers(userIds: string[]) {
    await Promise.all(
      userIds.map(async (id) => {
        // Hapus metadata/log yang tidak kritikal (aman untuk di-hard delete)
        await db.orm.public.Session.where({ userId: id }).delete();
        await db.orm.public.AuditLog.where({ userId: id }).delete();
        
        // Hapus data pengguna
        await db.orm.public.User.where({ id }).delete();
      })
    );
  },

  /**
   * Menghapus sesi / me-revoke token pengguna secara paksa.
   */
  async bulkRevokeSessions(userIds: string[]) {
    await Promise.all(
      userIds.map(id =>
        db.orm.public.Session.where({ userId: id }).delete()
      )
    );
  }
};

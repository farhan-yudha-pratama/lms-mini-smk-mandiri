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
  }
};

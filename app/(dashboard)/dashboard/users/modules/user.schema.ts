import { z } from 'zod';
import { Role } from '../types';

export const BulkUserActionSchema = z.object({
  userIds: z.array(z.string()).min(1, 'Mohon pastikan Anda telah memilih setidaknya satu pengguna.'),
});

export const BulkChangeRoleSchema = BulkUserActionSchema.extend({
  newRole: z.enum(['SUPERADMIN', 'GURU', 'MURID'] as const, {
    message: 'Role yang dipilih tidak valid.',
  }),
});

export const BulkToggleActiveSchema = BulkUserActionSchema.extend({
  isActive: z.boolean({
    message: 'Status aktif tidak boleh kosong dan harus berupa boolean.',
  }),
});

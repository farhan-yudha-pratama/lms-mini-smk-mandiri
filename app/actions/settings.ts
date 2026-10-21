'use server';

import { getSession } from '@/lib/session';
import { changePasswordService } from '@/modules/auth/service';
import { changePasswordSchema, ChangePasswordInput } from '@/modules/auth/schemas';

export type ChangePasswordResult = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function changePasswordAction(data: ChangePasswordInput): Promise<ChangePasswordResult> {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return { success: false, message: 'Sesi telah berakhir, silakan login kembali' };
    }

    const validated = changePasswordSchema.safeParse(data);
    if (!validated.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of validated.error.issues) {
        const path = issue.path[0] ? String(issue.path[0]) : 'general';
        if (!fieldErrors[path]) fieldErrors[path] = [];
        fieldErrors[path].push(issue.message);
      }
      return {
        success: false,
        message: validated.error.issues[0]?.message || 'Input tidak valid',
        errors: fieldErrors,
      };
    }

    return await changePasswordService(session.userId, validated.data);
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Terjadi kesalahan sistem saat memperbarui password',
    };
  }
}

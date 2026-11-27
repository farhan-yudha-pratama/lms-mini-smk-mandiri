'use server';

import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/session';
import { changePasswordService } from '@/modules/auth/service';
import {
  cancelEmailChangeService,
  type PendingEmailChangeInfo,
  requestEmailChangeService,
  verifyEmailChangeOtpService,
} from '@/modules/auth/email-change.service';
import {
  type ActionResponse,
  changePasswordSchema,
  type ChangePasswordInput,
  requestEmailChangeSchema,
  type RequestEmailChangeInput,
  verifyEmailChangeOtpSchema,
  type VerifyEmailChangeOtpInput,
} from '@/modules/auth/schemas';

export type ChangePasswordResult = ActionResponse;

function formatZodErrors(issues: { path: PropertyKey[]; message: string }[]): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};
  for (const issue of issues) {
    const path = issue.path[0] ? String(issue.path[0]) : 'general';
    if (!fieldErrors[path]) fieldErrors[path] = [];
    fieldErrors[path].push(issue.message);
  }
  return fieldErrors;
}

export async function changePasswordAction(data: ChangePasswordInput): Promise<ChangePasswordResult> {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return { success: false, message: 'Sesi telah berakhir, silakan login kembali' };
    }

    const validated = changePasswordSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        message: validated.error.issues[0]?.message || 'Input tidak valid',
        errors: formatZodErrors(validated.error.issues),
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

export async function requestEmailChangeAction(
  data: RequestEmailChangeInput
): Promise<ActionResponse<PendingEmailChangeInfo>> {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return { success: false, message: 'Sesi telah berakhir, silakan login kembali' };
    }

    const validated = requestEmailChangeSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        message: validated.error.issues[0]?.message || 'Input tidak valid',
        errors: formatZodErrors(validated.error.issues),
      };
    }

    const result = await requestEmailChangeService(session.userId, validated.data);
    if (result.success) {
      revalidatePath('/dashboard/settings');
      revalidatePath('/student/settings');
    }
    return result;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Terjadi kesalahan saat mengirim kode OTP',
    };
  }
}

export async function verifyEmailChangeOtpAction(
  data: VerifyEmailChangeOtpInput
): Promise<ActionResponse<{ email: string; emailChangeCount: number; emailChangedAt: string }>> {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return { success: false, message: 'Sesi telah berakhir, silakan login kembali' };
    }

    const validated = verifyEmailChangeOtpSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        message: validated.error.issues[0]?.message || 'Kode OTP tidak valid',
        errors: formatZodErrors(validated.error.issues),
      };
    }

    const result = await verifyEmailChangeOtpService(session.userId, session, validated.data);
    if (result.success) {
      revalidatePath('/dashboard/settings');
      revalidatePath('/student/settings');
    }
    return result;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Terjadi kesalahan saat memverifikasi OTP',
    };
  }
}

export async function cancelEmailChangeAction(): Promise<ActionResponse> {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return { success: false, message: 'Sesi telah berakhir, silakan login kembali' };
    }

    const result = await cancelEmailChangeService(session.userId);
    revalidatePath('/dashboard/settings');
    revalidatePath('/student/settings');
    return result;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Gagal membatalkan permintaan perubahan email',
    };
  }
}

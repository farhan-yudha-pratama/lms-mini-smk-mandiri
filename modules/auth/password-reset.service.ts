import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { db } from '@/prisma/db';
import { logAudit } from '@/lib/audit';
import { sendPasswordResetMail } from '@/lib/mailer';
import type { ActionResponse, ResetPasswordInput } from './schemas';

const RESET_TTL_MS = 30 * 60 * 1000; // 30 menit
const REQUEST_COOLDOWN_MS = 60 * 1000; // 60 detik

function hashResetToken(rawToken: string): string {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}

export async function requestPasswordResetService(email: string): Promise<ActionResponse> {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await db.orm.public.User.where({ email: normalizedEmail }).first();

  if (!user) {
    return {
      success: false,
      message: 'Email tidak ditemukan',
      errors: { email: ['Email tidak ditemukan'] },
    };
  }

  if (!user.isActive) {
    return {
      success: false,
      message: 'Akun Anda dinonaktifkan. Hubungi Administrator.',
      errors: { email: ['Akun Anda dinonaktifkan'] },
    };
  }

  // Superadmin dikecualikan dari kewajiban verifikasi email sebelumnya
  if (user.role !== 'SUPERADMIN' && !user.emailChangedAt) {
    return {
      success: false,
      message: 'Email belum diverifikasi. Silakan verifikasi email di Pengaturan Akun atau hubungi Guru/Admin.',
      errors: { email: ['Email belum diverifikasi'] },
    };
  }

  const existingTokens = await db.orm.public.PasswordResetToken.where({ userId: user.id }).all();
  const latestPending = existingTokens
    .filter((t) => !t.usedAt)
    .sort((a, b) => new Date(String(b.createdAt)).getTime() - new Date(String(a.createdAt)).getTime())[0];

  if (latestPending) {
    const elapsedMs = Date.now() - new Date(String(latestPending.createdAt)).getTime();
    if (elapsedMs < REQUEST_COOLDOWN_MS) {
      const waitSeconds = Math.ceil((REQUEST_COOLDOWN_MS - elapsedMs) / 1000);
      return {
        success: false,
        message: `Tunggu ${waitSeconds} detik sebelum meminta tautan reset baru.`,
      };
    }
  }

  for (const old of existingTokens) {
    if (!old.usedAt) {
      await db.orm.public.PasswordResetToken.where({ id: old.id }).delete();
    }
  }

  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashResetToken(rawToken);
  const expiresAt = new Date(Date.now() + RESET_TTL_MS).toISOString();

  const created = await db.orm.public.PasswordResetToken.create({
    userId: user.id,
    tokenHash,
    expiresAt,
  });

  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/+$/, '');
  const resetUrl = `${baseUrl}/reset-password?token=${encodeURIComponent(rawToken)}`;

  try {
    await sendPasswordResetMail({
      to: user.email,
      userName: user.name,
      resetUrl,
      expiresInMinutes: 30,
    });
  } catch (error) {
    await db.orm.public.PasswordResetToken.where({ id: created.id }).delete();
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Gagal mengirim email reset kata sandi melalui SMTP.',
    };
  }

  await logAudit({
    action: 'REQUEST_PASSWORD_RESET',
    userId: user.id,
    message: `${user.name} (${user.role}) meminta tautan reset kata sandi untuk ${user.email}.`,
    meta: { email: user.email },
  });

  return {
    success: true,
    message: `Tautan reset kata sandi telah dikirim ke ${user.email}. Tautan berlaku selama 30 menit.`,
  };
}

export async function validatePasswordResetTokenService(rawToken: string): Promise<
  | { valid: true; userId: string; email: string; tokenId: string }
  | { valid: false; reason: string }
> {
  const trimmed = rawToken.trim();
  if (!trimmed) {
    return { valid: false, reason: 'Tautan reset kata sandi tidak ditemukan atau tidak valid.' };
  }

  const tokenHash = hashResetToken(trimmed);
  const record = await db.orm.public.PasswordResetToken.where({ tokenHash }).first();

  if (!record) {
    return { valid: false, reason: 'Tautan reset kata sandi tidak valid.' };
  }

  if (record.usedAt) {
    return {
      valid: false,
      reason: 'Tautan reset kata sandi sudah pernah digunakan dan tidak dapat diakses lagi.',
    };
  }

  if (new Date(String(record.expiresAt)).getTime() <= Date.now()) {
    return {
      valid: false,
      reason: 'Tautan reset kata sandi telah kedaluwarsa (melebihi 30 menit). Silakan ajukan permintaan baru.',
    };
  }

  const user = await db.orm.public.User.where({ id: record.userId }).first();
  if (!user || !user.isActive) {
    return { valid: false, reason: 'Akun tidak ditemukan atau sudah dinonaktifkan.' };
  }

  return {
    valid: true,
    userId: user.id,
    email: user.email,
    tokenId: record.id,
  };
}

export async function resetPasswordWithTokenService(input: ResetPasswordInput): Promise<ActionResponse> {
  const check = await validatePasswordResetTokenService(input.token);
  if (!check.valid) {
    return { success: false, message: check.reason };
  }

  const hashedPassword = await bcrypt.hash(input.newPassword, 10);
  const nowIso = new Date().toISOString();

  await db.orm.public.User.where({ id: check.userId }).update({
    password: hashedPassword,
    failedLoginAttempts: 0,
    lockedUntil: null,
  });

  await db.orm.public.PasswordResetToken.where({ id: check.tokenId }).update({
    usedAt: nowIso,
  });

  // Cabut seluruh sesi lama agar pengguna login ulang dengan kata sandi baru
  await db.orm.public.Session.where({ userId: check.userId }).delete();

  await logAudit({
    action: 'RESET_PASSWORD_SELF',
    userId: check.userId,
    message: `Pengguna (${check.email}) berhasil mengatur ulang kata sandi melalui tautan Lupa Password.`,
    meta: { email: check.email },
  });

  return {
    success: true,
    message: 'Kata sandi berhasil diperbarui. Tautan ini sudah tidak berlaku lagi.',
  };
}

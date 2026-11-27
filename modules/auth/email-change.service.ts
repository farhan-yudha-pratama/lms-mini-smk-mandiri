import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { db } from '@/prisma/db';
import { setToken, type SessionPayload } from '@/lib/session';
import { logAudit } from '@/lib/audit';
import { sendEmailChangeOtpMail, verifyEmailDomainMx } from '@/lib/mailer';
import type { ActionResponse, RequestEmailChangeInput, VerifyEmailChangeOtpInput } from './schemas';

const OTP_TTL_MS = 10 * 60 * 1000; // 10 menit
const RESEND_COOLDOWN_MS = 60 * 1000; // 60 detik
const MAX_OTP_ATTEMPTS = 5;
const MAX_EMAIL_CHANGES = 1;

export interface PendingEmailChangeInfo {
  newEmail: string;
  expiresAt: string;
  createdAt: string;
}

export function canUserChangeEmail(role: string, emailChangeCount: number): boolean {
  if (role === 'SUPERADMIN') return true;
  return emailChangeCount < MAX_EMAIL_CHANGES;
}

function hashOtp(otp: string, salt: string): string {
  return crypto.createHmac('sha256', salt).update(otp).digest('hex');
}

function parseVerificationList<T extends { usedAt: string | null; expiresAt: string; attempts: number; createdAt: string }>(
  records: T[]
) {
  return records
    .filter((r) => !r.usedAt)
    .sort((a, b) => new Date(String(b.createdAt)).getTime() - new Date(String(a.createdAt)).getTime());
}

export async function getPendingEmailChangeService(userId: string): Promise<PendingEmailChangeInfo | null> {
  const records = await db.orm.public.EmailChangeVerification.where({ userId }).all();
  const active = parseVerificationList(
    records.map((r) => ({
      newEmail: r.newEmail,
      usedAt: r.usedAt ? String(r.usedAt) : null,
      expiresAt: String(r.expiresAt),
      attempts: r.attempts,
      createdAt: String(r.createdAt),
    }))
  ).find((r) => new Date(r.expiresAt).getTime() > Date.now() && r.attempts < MAX_OTP_ATTEMPTS);

  if (!active) return null;

  return {
    newEmail: active.newEmail,
    expiresAt: active.expiresAt,
    createdAt: active.createdAt,
  };
}

export async function requestEmailChangeService(
  userId: string,
  input: RequestEmailChangeInput
): Promise<ActionResponse<PendingEmailChangeInfo>> {
  const user = await db.orm.public.User.where({ id: userId }).first();
  if (!user) {
    return { success: false, message: 'Pengguna tidak ditemukan' };
  }

  if (!canUserChangeEmail(user.role, user.emailChangeCount)) {
    return {
      success: false,
      message: 'Batas perubahan email (1 kali) untuk akun Anda sudah digunakan',
    };
  }

  const isValidPassword = await bcrypt.compare(input.currentPassword, user.password);
  if (!isValidPassword) {
    return {
      success: false,
      message: 'Password saat ini salah',
      errors: { currentPassword: ['Password saat ini salah'] },
    };
  }

  const newEmail = input.newEmail.trim().toLowerCase();
  if (newEmail === user.email.toLowerCase()) {
    return {
      success: false,
      message: 'Email baru tidak boleh sama dengan email saat ini',
      errors: { newEmail: ['Email baru harus berbeda dari email saat ini'] },
    };
  }

  const existingUser = await db.orm.public.User.where({ email: newEmail }).first();
  if (existingUser && existingUser.id !== userId) {
    return {
      success: false,
      message: 'Alamat email tersebut sudah digunakan oleh akun lain',
      errors: { newEmail: ['Email sudah terdaftar pada akun lain'] },
    };
  }

  const hasValidMx = await verifyEmailDomainMx(newEmail);
  if (!hasValidMx) {
    return {
      success: false,
      message: 'Domain email tidak valid atau tidak memiliki server penerima email aktif',
      errors: { newEmail: ['Domain email tidak ditemukan atau tidak menerima email'] },
    };
  }

  const existingVerifications = await db.orm.public.EmailChangeVerification.where({ userId }).all();
  const latestPending = parseVerificationList(
    existingVerifications.map((r) => ({
      id: r.id,
      usedAt: r.usedAt ? String(r.usedAt) : null,
      expiresAt: String(r.expiresAt),
      attempts: r.attempts,
      createdAt: String(r.createdAt),
    }))
  )[0];

  if (latestPending) {
    const elapsedMs = Date.now() - new Date(latestPending.createdAt).getTime();
    if (elapsedMs < RESEND_COOLDOWN_MS) {
      const waitSeconds = Math.ceil((RESEND_COOLDOWN_MS - elapsedMs) / 1000);
      return {
        success: false,
        message: `Tunggu ${waitSeconds} detik sebelum mengirim ulang kode OTP`,
      };
    }
  }

  // Bersihkan OTP pending lama agar hanya 1 OTP aktif per user
  for (const old of existingVerifications) {
    if (!old.usedAt) {
      await db.orm.public.EmailChangeVerification.where({ id: old.id }).delete();
    }
  }

  const otpCode = String(crypto.randomInt(100000, 1000000));
  const otpSalt = crypto.randomBytes(16).toString('hex');
  const otpHash = hashOtp(otpCode, otpSalt);
  const expiresAt = new Date(Date.now() + OTP_TTL_MS).toISOString();

  const created = await db.orm.public.EmailChangeVerification.create({
    userId: user.id,
    newEmail,
    otpHash,
    otpSalt,
    attempts: 0,
    expiresAt,
  });

  try {
    await sendEmailChangeOtpMail({
      to: newEmail,
      userName: user.name,
      otpCode,
      expiresInMinutes: 10,
    });
  } catch (error) {
    await db.orm.public.EmailChangeVerification.where({ id: created.id }).delete();
    const detail = error instanceof Error ? error.message : 'Gagal mengirim email OTP melalui SMTP';
    return {
      success: false,
      message: detail,
    };
  }

  await logAudit({
    action: 'REQUEST_EMAIL_CHANGE',
    message: `${user.name} (${user.role}) meminta kode OTP untuk mengganti email ke ${newEmail}.`,
    meta: { oldEmail: user.email, newEmail },
  });

  return {
    success: true,
    message: `Kode OTP telah dikirim ke ${newEmail}. Periksa kotak masuk atau folder spam.`,
    data: {
      newEmail,
      expiresAt,
      createdAt: String(created.createdAt),
    } satisfies PendingEmailChangeInfo,
  };
}

export async function verifyEmailChangeOtpService(
  userId: string,
  session: SessionPayload,
  input: VerifyEmailChangeOtpInput
): Promise<ActionResponse<{ email: string; emailChangeCount: number; emailChangedAt: string }>> {
  const user = await db.orm.public.User.where({ id: userId }).first();
  if (!user) {
    return { success: false, message: 'Pengguna tidak ditemukan' };
  }

  if (!canUserChangeEmail(user.role, user.emailChangeCount)) {
    return {
      success: false,
      message: 'Batas perubahan email (1 kali) untuk akun Anda sudah digunakan',
    };
  }

  const verifications = await db.orm.public.EmailChangeVerification.where({ userId }).all();
  const latest = parseVerificationList(
    verifications.map((r) => ({
      id: r.id,
      newEmail: r.newEmail,
      otpHash: r.otpHash,
      otpSalt: r.otpSalt,
      usedAt: r.usedAt ? String(r.usedAt) : null,
      expiresAt: String(r.expiresAt),
      attempts: r.attempts,
      createdAt: String(r.createdAt),
    }))
  )[0];

  if (!latest) {
    return {
      success: false,
      message: 'Tidak ada permintaan verifikasi email yang aktif. Silakan minta kode OTP baru.',
    };
  }

  if (new Date(latest.expiresAt).getTime() <= Date.now()) {
    return {
      success: false,
      message: 'Kode OTP sudah kedaluwarsa. Silakan kirim ulang kode OTP baru.',
    };
  }

  if (latest.attempts >= MAX_OTP_ATTEMPTS) {
    return {
      success: false,
      message: 'Batas percobaan OTP telah habis. Silakan kirim ulang kode OTP baru.',
    };
  }

  const expectedBuf = Buffer.from(latest.otpHash, 'hex');
  const actualBuf = Buffer.from(hashOtp(input.otp.trim(), latest.otpSalt), 'hex');
  const isMatch = expectedBuf.length === actualBuf.length && crypto.timingSafeEqual(expectedBuf, actualBuf);

  if (!isMatch) {
    const nextAttempts = latest.attempts + 1;
    await db.orm.public.EmailChangeVerification.where({ id: latest.id }).update({
      attempts: nextAttempts,
    });
    const remaining = MAX_OTP_ATTEMPTS - nextAttempts;
    return {
      success: false,
      message:
        remaining > 0
          ? `Kode OTP salah. Sisa percobaan: ${remaining} kali.`
          : 'Kode OTP salah dan batas percobaan habis. Silakan kirim ulang kode OTP baru.',
      errors: { otp: ['Kode OTP tidak sesuai'] },
    };
  }

  const existingUser = await db.orm.public.User.where({ email: latest.newEmail }).first();
  if (existingUser && existingUser.id !== userId) {
    return {
      success: false,
      message: 'Email ini baru saja digunakan oleh akun lain',
    };
  }

  const nowIso = new Date().toISOString();
  const nextCount = user.emailChangeCount + 1;
  const oldEmail = user.email;

  await db.orm.public.User.where({ id: userId }).update({
    email: latest.newEmail,
    emailChangeCount: nextCount,
    emailChangedAt: nowIso,
  });

  await db.orm.public.EmailChangeVerification.where({ id: latest.id }).update({
    usedAt: nowIso,
  });

  // Sinkronkan email di JWT cookie agar getSession() tidak menolak sesi aktif
  await setToken({
    userId: user.id,
    email: latest.newEmail,
    role: user.role,
    name: user.name,
    classId: user.classId,
    sessionId: session.sessionId,
  });

  await logAudit({
    action: 'CHANGE_EMAIL',
    message: `${user.name} (${user.role}) berhasil mengganti email dari ${oldEmail} menjadi ${latest.newEmail}.`,
    meta: { oldEmail, newEmail: latest.newEmail, emailChangeCount: nextCount },
  });

  return {
    success: true,
    message: 'Email berhasil diverifikasi dan diperbarui.',
    data: {
      email: latest.newEmail,
      emailChangeCount: nextCount,
      emailChangedAt: nowIso,
    },
  };
}

export async function cancelEmailChangeService(userId: string): Promise<ActionResponse> {
  const verifications = await db.orm.public.EmailChangeVerification.where({ userId }).all();
  for (const v of verifications) {
    if (!v.usedAt) {
      await db.orm.public.EmailChangeVerification.where({ id: v.id }).delete();
    }
  }
  return { success: true, message: 'Permintaan perubahan email dibatalkan.' };
}

export async function getSettingsProfileService(userId: string) {
  const user = await db.orm.public.User.where({ id: userId }).first();
  if (!user) return null;

  let className = 'Siswa Aktif';
  if (user.classId) {
    const classroom = await db.orm.public.Classroom.where({ id: user.classId }).first();
    if (classroom) className = classroom.name;
  }

  const pendingEmailChange = await getPendingEmailChangeService(user.id);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      className,
      emailChangeCount: user.emailChangeCount,
      emailChangedAt: user.emailChangedAt ? String(user.emailChangedAt) : null,
    },
    pendingEmailChange,
  };
}

import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { db } from '../prisma/db';
import { forgotPasswordSchema, resetPasswordSchema } from '../modules/auth/schemas';
import {
  requestPasswordResetService,
  resetPasswordWithTokenService,
  validatePasswordResetTokenService,
} from '../modules/auth/password-reset.service';

function hashToken(raw: string): string {
  return crypto.createHash('sha256').update(raw).digest('hex');
}

async function runTests() {
  console.log('=== TEST SUITE: FORGOT PASSWORD & SINGLE-USE RESET TOKEN ===\n');
  let passed = 0;
  let total = 0;

  function assert(label: string, condition: boolean, detail = '') {
    total++;
    if (condition) {
      passed++;
      console.log(`[PASS] ${label}`);
    } else {
      console.error(`[FAIL] ${label} ${detail ? `(${detail})` : ''}`);
    }
  }

  // 1. Zod Schemas
  assert('1.1 Valid forgotPasswordSchema passes', forgotPasswordSchema.safeParse({ email: 'User@Gmail.com' }).success);
  assert('1.2 Invalid email rejected by forgotPasswordSchema', !forgotPasswordSchema.safeParse({ email: 'bad-email' }).success);
  assert(
    '1.3 Valid resetPasswordSchema passes',
    resetPasswordSchema.safeParse({ token: 'abc', newPassword: 'password123', confirmPassword: 'password123' }).success
  );
  assert(
    '1.4 Mismatched confirmPassword rejected',
    !resetPasswordSchema.safeParse({ token: 'abc', newPassword: 'password123', confirmPassword: 'password456' }).success
  );

  // 2. DB & Service Flow
  const runId = crypto.randomUUID().slice(0, 8);
  const oldPass = 'OldPass123!';
  const newPass = 'NewPass456!';
  const oldHash = await bcrypt.hash(oldPass, 10);

  const unverifiedStudent = await db.orm.public.User.create({
    name: 'Siswa Belum Verifikasi',
    email: `unverified-${runId}@gmail.com`,
    password: oldHash,
    role: 'MURID',
    isActive: true,
    failedLoginAttempts: 0,
  });

  const inactiveUser = await db.orm.public.User.create({
    name: 'Guru Nonaktif',
    email: `inactive-${runId}@gmail.com`,
    password: oldHash,
    role: 'GURU',
    isActive: false,
    emailChangeCount: 1,
    emailChangedAt: new Date().toISOString(),
    failedLoginAttempts: 0,
  });

  const verifiedUser = await db.orm.public.User.create({
    name: 'Guru Terverifikasi',
    email: `verified-${runId}@gmail.com`,
    password: oldHash,
    role: 'GURU',
    isActive: true,
    emailChangeCount: 1,
    emailChangedAt: new Date().toISOString(),
    failedLoginAttempts: 3,
  });

  const superAdmin = await db.orm.public.User.create({
    name: 'Superadmin Uji',
    email: `superadmin-${runId}@gmail.com`,
    password: oldHash,
    role: 'SUPERADMIN',
    isActive: true,
    failedLoginAttempts: 0,
  });

  try {
    const notFoundRes = await requestPasswordResetService(`tidak-ada-${runId}@gmail.com`);
    assert('2.1 Unknown email returns "Email tidak ditemukan"', !notFoundRes.success && notFoundRes.message === 'Email tidak ditemukan');

    const unverifiedRes = await requestPasswordResetService(unverifiedStudent.email);
    assert('2.2 Unverified MURID rejected with "Email belum diverifikasi"', !unverifiedRes.success && unverifiedRes.message.startsWith('Email belum diverifikasi'));

    const inactiveRes = await requestPasswordResetService(inactiveUser.email);
    assert('2.3 Inactive user rejected', !inactiveRes.success && inactiveRes.message.includes('dinonaktifkan'));

    // Pastikan SUPERADMIN tanpa emailChangedAt tidak ditolak oleh cek verifikasi email (gagalnya hanya jika SMTP belum diset di .env)
    const superAdminRes = await requestPasswordResetService(superAdmin.email);
    assert(
      '2.4 SUPERADMIN excluded from emailChangedAt check',
      !superAdminRes.message.startsWith('Email belum diverifikasi'),
      superAdminRes.message
    );

    // Simulasikan token reset tersimpan untuk verifiedUser + sesi lama aktif
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenRecord = await db.orm.public.PasswordResetToken.create({
      userId: verifiedUser.id,
      tokenHash: hashToken(rawToken),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    });

    await db.orm.public.Session.create({
      userId: verifiedUser.id,
      expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
    });

    const invalidCheck = await validatePasswordResetTokenService('token-ngawur-123');
    assert('2.5 Random token rejected', !invalidCheck.valid);

    // Uji kedaluwarsa
    await db.orm.public.PasswordResetToken.where({ id: tokenRecord.id }).update({
      expiresAt: new Date(Date.now() - 1000).toISOString(),
    });
    const expiredCheck = await validatePasswordResetTokenService(rawToken);
    assert('2.6 Expired token rejected', !expiredCheck.valid && expiredCheck.reason.includes('kedaluwarsa'));

    // Pulihkan expiresAt dan validasi token
    await db.orm.public.PasswordResetToken.where({ id: tokenRecord.id }).update({
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    });
    const validCheck = await validatePasswordResetTokenService(rawToken);
    assert('2.7 Valid token passes validation', validCheck.valid && validCheck.email === verifiedUser.email);

    // Reset password
    const resetRes = await resetPasswordWithTokenService({
      token: rawToken,
      newPassword: newPass,
      confirmPassword: newPass,
    });
    assert('2.8 resetPasswordWithTokenService succeeds', resetRes.success);

    const updatedUser = await db.orm.public.User.where({ id: verifiedUser.id }).first();
    const passMatches = updatedUser ? await bcrypt.compare(newPass, updatedUser.password) : false;
    assert('2.9 User password updated in DB & failedLoginAttempts reset', passMatches && updatedUser?.failedLoginAttempts === 0);

    const remainingSessions = await db.orm.public.Session.where({ userId: verifiedUser.id }).all();
    assert('2.10 All old sessions revoked after password reset', remainingSessions.length === 0);

    // Pastikan link tidak bisa diakses atau dipakai lagi setelah sukses
    const reuseCheck = await validatePasswordResetTokenService(rawToken);
    assert('2.11 Used link cannot be accessed again (validate returns false)', !reuseCheck.valid && reuseCheck.reason.includes('sudah pernah digunakan'));

    const reuseSubmit = await resetPasswordWithTokenService({
      token: rawToken,
      newPassword: 'AnotherPass789!',
      confirmPassword: 'AnotherPass789!',
    });
    assert('2.12 Used token cannot be re-submitted', !reuseSubmit.success);
  } finally {
    await db.orm.public.AuditLog.where({ userId: verifiedUser.id }).delete();
    await db.orm.public.AuditLog.where({ userId: superAdmin.id }).delete();
    await db.orm.public.PasswordResetToken.where({ userId: verifiedUser.id }).delete();
    await db.orm.public.PasswordResetToken.where({ userId: superAdmin.id }).delete();
    await db.orm.public.Session.where({ userId: verifiedUser.id }).delete();
    await db.orm.public.User.where({ id: unverifiedStudent.id }).delete();
    await db.orm.public.User.where({ id: inactiveUser.id }).delete();
    await db.orm.public.User.where({ id: verifiedUser.id }).delete();
    await db.orm.public.User.where({ id: superAdmin.id }).delete();
  }

  console.log(`\n=== HASIL: ${passed}/${total} TEST LULUS ===`);
  if (passed !== total) {
    process.exitCode = 1;
  }
}

runTests().catch((err) => {
  console.error('Test runner error:', err);
  process.exit(1);
});

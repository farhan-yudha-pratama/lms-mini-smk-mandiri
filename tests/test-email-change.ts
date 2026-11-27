import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { db } from '../prisma/db';
import { verifyEmailDomainMx } from '../lib/mailer';
import { requestEmailChangeSchema, verifyEmailChangeOtpSchema } from '../modules/auth/schemas';
import {
  canUserChangeEmail,
  getPendingEmailChangeService,
  requestEmailChangeService,
  verifyEmailChangeOtpService,
} from '../modules/auth/email-change.service';

function hashOtp(otp: string, salt: string): string {
  return crypto.createHmac('sha256', salt).update(otp).digest('hex');
}

async function runTests() {
  console.log('=== TEST SUITE: EMAIL CHANGE + OTP VERIFICATION ===\n');
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
  assert('1.1 Valid requestEmailChangeSchema passes', requestEmailChangeSchema.safeParse({ newEmail: 'Test.User@Gmail.com', currentPassword: 'secret' }).success);
  assert('1.2 Invalid email rejected by schema', !requestEmailChangeSchema.safeParse({ newEmail: 'not-an-email', currentPassword: 'secret' }).success);
  assert('1.3 Empty password rejected by schema', !requestEmailChangeSchema.safeParse({ newEmail: 'a@gmail.com', currentPassword: '' }).success);
  assert('1.4 Valid 6-digit OTP passes schema', verifyEmailChangeOtpSchema.safeParse({ otp: '048291' }).success);
  assert('1.5 Non-6-digit OTP rejected by schema', !verifyEmailChangeOtpSchema.safeParse({ otp: '12345' }).success && !verifyEmailChangeOtpSchema.safeParse({ otp: '12ab56' }).success);

  // 2. Role Quota Logic
  assert('2.1 GURU allowed at count 0, blocked at count 1', canUserChangeEmail('GURU', 0) && !canUserChangeEmail('GURU', 1));
  assert('2.2 MURID allowed at count 0, blocked at count 1', canUserChangeEmail('MURID', 0) && !canUserChangeEmail('MURID', 1));
  assert('2.3 SUPERADMIN unlimited even at count >= 1', canUserChangeEmail('SUPERADMIN', 0) && canUserChangeEmail('SUPERADMIN', 5));

  // 3. DNS MX Check
  const gmailMx = await verifyEmailDomainMx('someone@gmail.com');
  assert('3.1 Gmail domain has valid MX record', gmailMx);
  const invalidMx = await verifyEmailDomainMx('someone@nonexistent-domain-xyz-999999.invalid');
  assert('3.2 Fake/nonexistent domain rejected by MX check', !invalidMx);

  // 4. DB + Service Flow
  const runId = crypto.randomUUID().slice(0, 8);
  const passwordPlain = 'Password123!';
  const passwordHash = await bcrypt.hash(passwordPlain, 10);

  const guruEmail = `guru-test-${runId}@gmail.com`;
  const guruNewEmail = `guru-new-${runId}@gmail.com`;
  const otherEmail = `other-test-${runId}@gmail.com`;

  const guruUser = await db.orm.public.User.create({
    name: 'Guru Uji Email',
    email: guruEmail,
    password: passwordHash,
    role: 'GURU',
    isActive: true,
    failedLoginAttempts: 0,
  });

  const otherUser = await db.orm.public.User.create({
    name: 'User Lain',
    email: otherEmail,
    password: passwordHash,
    role: 'MURID',
    isActive: true,
    failedLoginAttempts: 0,
  });

  const sessionId = crypto.randomUUID();
  const fakeSession = {
    userId: guruUser.id,
    email: guruEmail,
    role: 'GURU',
    sessionId,
    name: guruUser.name,
  };

  try {
    const wrongPassRes = await requestEmailChangeService(guruUser.id, {
      newEmail: guruNewEmail,
      currentPassword: 'wrong-password',
    });
    assert('4.1 Wrong current password rejected', !wrongPassRes.success);

    const sameEmailRes = await requestEmailChangeService(guruUser.id, {
      newEmail: guruEmail,
      currentPassword: passwordPlain,
    });
    assert('4.2 Same email rejected', !sameEmailRes.success);

    const dupEmailRes = await requestEmailChangeService(guruUser.id, {
      newEmail: otherEmail,
      currentPassword: passwordPlain,
    });
    assert('4.3 Duplicate email used by another user rejected', !dupEmailRes.success);

    const fakeDomainRes = await requestEmailChangeService(guruUser.id, {
      newEmail: `user@nonexistent-domain-xyz-${runId}.invalid`,
      currentPassword: passwordPlain,
    });
    assert('4.4 Nonexistent domain rejected before SMTP', !fakeDomainRes.success);

    // Simulasikan OTP tersimpan (tanpa perlu kredensial SMTP real di test runner)
    const salt = crypto.randomBytes(16).toString('hex');
    const otpCode = '654321';
    const verification = await db.orm.public.EmailChangeVerification.create({
      userId: guruUser.id,
      newEmail: guruNewEmail,
      otpHash: hashOtp(otpCode, salt),
      otpSalt: salt,
      attempts: 0,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    });

    const pending = await getPendingEmailChangeService(guruUser.id);
    assert('4.5 Pending email change retrieved cleanly', pending?.newEmail === guruNewEmail);

    const wrongOtpRes = await verifyEmailChangeOtpService(guruUser.id, fakeSession, { otp: '000000' });
    assert('4.6 Wrong OTP rejected and increments attempts', !wrongOtpRes.success && wrongOtpRes.message.includes('Sisa percobaan: 4'));

    // Set attempts ke 4 lalu salah sekali lagi -> 5 -> terkunci
    await db.orm.public.EmailChangeVerification.where({ id: verification.id }).update({ attempts: 4 });
    const fifthWrongRes = await verifyEmailChangeOtpService(guruUser.id, fakeSession, { otp: '000000' });
    assert('4.7 Fifth wrong OTP exhausts attempts', !fifthWrongRes.success && fifthWrongRes.message.includes('habis'));

    // Reset attempts ke 0 & uji kedaluwarsa
    await db.orm.public.EmailChangeVerification.where({ id: verification.id }).update({
      attempts: 0,
      expiresAt: new Date(Date.now() - 1000).toISOString(),
    });
    const expiredRes = await verifyEmailChangeOtpService(guruUser.id, fakeSession, { otp: otpCode });
    assert('4.8 Expired OTP rejected', !expiredRes.success && expiredRes.message.includes('kedaluwarsa'));

    // Pulihkan expiresAt & uji verifikasi sukses (Catatan: setToken di luar Next request scope bisa gagal cookieStore; kita verifikasi error/sukses)
    await db.orm.public.EmailChangeVerification.where({ id: verification.id }).update({
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    });

    let verifyThrewCookies = false;
    try {
      const okRes = await verifyEmailChangeOtpService(guruUser.id, fakeSession, { otp: otpCode });
      assert('4.9 Valid OTP updates email & increments emailChangeCount', okRes.success);
    } catch (err) {
      // Di luar Next.js request context, cookies() dari next/headers melempar error setelah DB sudah terupdate
      verifyThrewCookies = err instanceof Error && err.message.includes('cookies');
      assert('4.9 Valid OTP updated DB (cookies() expected outside Next request)', verifyThrewCookies, String(err));
    }

    const updatedGuru = await db.orm.public.User.where({ id: guruUser.id }).first();
    assert(
      '4.10 User DB updated: email changed and emailChangeCount === 1',
      updatedGuru?.email === guruNewEmail && updatedGuru?.emailChangeCount === 1 && Boolean(updatedGuru?.emailChangedAt)
    );

    const secondAttemptRes = await requestEmailChangeService(guruUser.id, {
      newEmail: `guru-second-${runId}@gmail.com`,
      currentPassword: passwordPlain,
    });
    assert('4.11 Second email change blocked for GURU (1x quota)', !secondAttemptRes.success);
  } finally {
    await db.orm.public.EmailChangeVerification.where({ userId: guruUser.id }).delete();
    await db.orm.public.User.where({ id: guruUser.id }).delete();
    await db.orm.public.User.where({ id: otherUser.id }).delete();
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

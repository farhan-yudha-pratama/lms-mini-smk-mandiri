import { db } from '@/prisma/db';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { setToken } from '@/lib/session';
import { LoginInput, RegisterInput } from './schemas';

export async function loginService(data: LoginInput) {
  // Find user
  const user = await db.orm.public.User
    .where({ email: data.email })
    .first();

  if (!user) {
    return { success: false, message: 'Email atau password salah' };
  }

  // Check if active
  if (!user.isActive) {
    return { success: false, message: 'Akun Anda dinonaktifkan' };
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(data.password, user.password);

  if (!isValidPassword) {
    return { success: false, message: 'Email atau password salah' };
  }

  // 1. Hapus semua sesi lama (Kunci Single Device)
  await db.orm.public.Session.where({ userId: user.id }).delete();

  // 2. Buat sesi baru
  const sessionId = crypto.randomUUID();
  await db.orm.public.Session.create({
    id: sessionId,
    userId: user.id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  });

  // Generate JWT and set cookie
  await setToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    classId: user.classId,
    sessionId: sessionId,
  });

  return { 
    success: true, 
    message: 'Login berhasil', 
    data: { role: user.role } 
  };
}

export async function registerService(data: RegisterInput) {
  // Check if email already exists
  const existingUser = await db.orm.public.User
    .where({ email: data.email })
    .first();

  if (existingUser) {
    return { success: false, message: 'Email sudah terdaftar' };
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // Create user
  const newUser = await db.orm.public.User.create({
    name: data.name,
    email: data.email,
    password: hashedPassword,
    role: 'MURID', // default role
    isActive: true,
    failedLoginAttempts: 0
  });

  // Generate tokens
  const refreshToken = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  const newSession = await db.orm.public.Session.create({
    userId: newUser.id,
    refreshToken,
    expiresAt,
  });

  // Set cookies
  await setToken({
    userId: newUser.id,
    email: newUser.email,
    role: newUser.role,
    name: newUser.name,
    classId: newUser.classId || null,
    sessionId: newSession.id,
  });
  
  const { setRefreshToken } = await import('@/lib/session');
  await setRefreshToken(refreshToken);

  return {
    success: true,
    message: 'Registrasi berhasil',
    data: { role: newUser.role }
  };
}

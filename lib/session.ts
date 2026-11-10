import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { cache } from 'react';

const secretKey = process.env.JWT_SECRET || 'super-secret-key-development';
const key = new TextEncoder().encode(secretKey);

// Custom payload interface
export interface SessionPayload {
  userId: string;
  email: string;
  role: string;
  sessionId: string;
  name?: string;
  classId?: string | null;
  permissions?: string[];
  [key: string]: any;
}

export async function encrypt(payload: SessionPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d') // 1 week
    .sign(key);
}

export async function decrypt(input: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });
    return payload as SessionPayload;
  } catch (error) {
    return null;
  }
}

export async function setToken(payload: SessionPayload) {
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const session = await encrypt(payload);

  const cookieStore = await cookies();
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expires,
    sameSite: 'lax',
    path: '/',
  });
}

export const getSession = cache(async (): Promise<SessionPayload | null> => {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  if (!session) return null;

  const payload = await decrypt(session);
  if (!payload || !payload.sessionId) return null;

  try {
    const { db } = await import('@/prisma/db');

    // Cek apakah sesi ini masih ada di database (belum di-revoke atau ditimpa device lain)
    const sessionRecord = await db.orm.public.Session.where({ id: payload.sessionId }).first();
    if (!sessionRecord) {
      return null;
    }

    const user = await db.orm.public.User.where({ id: payload.userId }).first();

    // Jika user tidak ada atau tidak aktif, tolak sesi
    if (!user || !user.isActive) {
      return null;
    }

    // Jika terjadi perubahan role atau email di database, tolak sesi lama
    if (user.role !== payload.role || user.email !== payload.email) {
      return null;
    }

    // Ambil daftar permission aktif secara real-time dari database
    let permissions: string[] = [];
    if (user.role === 'SUPERADMIN') {
      const { ALL_PERMISSION_CODES } = await import('@/lib/permissions');
      permissions = [...ALL_PERMISSION_CODES];
    } else {
      const userPerms = await db.orm.public.UserPermission.where({ userId: user.id }).all();
      if (userPerms.length > 0) {
        const allPerms = await db.orm.public.Permission.all();
        const permMap = new Map(allPerms.map((p) => [p.id, p.code]));
        permissions = userPerms
          .map((up) => permMap.get(up.permissionId))
          .filter((code): code is string => Boolean(code));
      }
    }

    return {
      ...payload,
      name: user.name,
      classId: user.classId,
      permissions,
    };
  } catch (error) {
    console.error('Session validation error:', error);
    return null;
  }
});

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
  cookieStore.delete('refreshToken');
}

export async function setRefreshToken(token: string) {
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  const cookieStore = await cookies();
  cookieStore.set('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expires,
    sameSite: 'lax',
    path: '/',
  });
}

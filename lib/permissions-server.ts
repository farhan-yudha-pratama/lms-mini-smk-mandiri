// lib/permissions-server.ts
import { getSession, type SessionPayload } from '@/lib/session';
import { hasPermission, hasAnyPermission, type PermissionCode } from './permissions';

/**
 * Guard otorisasi Server-side untuk Server Actions & Server Components.
 * Melempar error 'UNAUTHORIZED' jika belum login, atau 'FORBIDDEN' jika tidak memiliki izin.
 */
export async function requirePermission(permission: PermissionCode | string): Promise<SessionPayload> {
  const session = await getSession();
  if (!session || !session.userId) {
    throw new Error('UNAUTHORIZED');
  }

  if (!hasPermission(session, permission)) {
    throw new Error('FORBIDDEN');
  }

  return session;
}

export async function requireAnyPermission(permissions: (PermissionCode | string)[]): Promise<SessionPayload> {
  const session = await getSession();
  if (!session || !session.userId) {
    throw new Error('UNAUTHORIZED');
  }

  if (!hasAnyPermission(session, permissions)) {
    throw new Error('FORBIDDEN');
  }

  return session;
}

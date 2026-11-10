'use client';

import { hasPermission, hasAnyPermission, PermissionCode } from '@/lib/permissions';

interface PermissionGateProps {
  user: { role?: string; permissions?: string[] } | null | undefined;
  permission?: PermissionCode | PermissionCode[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Komponen deklaratif untuk membatasi elemen UI berdasarkan hak akses (permission).
 */
export default function PermissionGate({
  user,
  permission,
  fallback = null,
  children,
}: PermissionGateProps) {
  if (!permission) return <>{children}</>;

  const allowed = Array.isArray(permission)
    ? hasAnyPermission(user, permission)
    : hasPermission(user, permission);

  if (!allowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

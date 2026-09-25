'use server';

import { getSession } from '@/lib/session';

export async function getUserSession() {
  const session = await getSession();
  if (!session) return null;
  return {
    userId: session.userId as string,
    email: session.email as string,
    role: session.role as string,
    name: (session.name as string) || session.email.split('@')[0],
    classId: session.classId as string | null,
  };
}

export async function logoutAction() {
  const { deleteSession } = await import('@/lib/session');
  await deleteSession();
}

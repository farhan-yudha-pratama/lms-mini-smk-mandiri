import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { db } from '@/prisma/db';
import AdminSettingsView from '@/components/dashboard/AdminSettingsView';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const session = await getSession();

  if (!session || (session.role !== 'SUPERADMIN' && session.role !== 'GURU')) {
    redirect('/login');
  }

  const user = await db.orm.public.User.where({ id: session.userId }).first();

  if (!user) {
    redirect('/login');
  }

  return (
    <AdminSettingsView
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }}
    />
  );
}

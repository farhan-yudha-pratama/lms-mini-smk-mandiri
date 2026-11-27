import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { getSettingsProfileService } from '@/modules/auth/email-change.service';
import AdminSettingsView from '@/components/dashboard/AdminSettingsView';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const session = await getSession();

  if (!session || (session.role !== 'SUPERADMIN' && session.role !== 'GURU')) {
    redirect('/login');
  }

  const profile = await getSettingsProfileService(session.userId);
  if (!profile) {
    redirect('/login');
  }

  return (
    <AdminSettingsView
      user={{
        id: profile.user.id,
        name: profile.user.name,
        email: profile.user.email,
        role: profile.user.role,
        emailChangeCount: profile.user.emailChangeCount,
        emailChangedAt: profile.user.emailChangedAt,
      }}
      pendingEmailChange={profile.pendingEmailChange}
    />
  );
}

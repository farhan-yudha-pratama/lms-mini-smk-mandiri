import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { getSettingsProfileService } from '@/modules/auth/email-change.service';
import StudentSettingsView from '@/components/student/StudentSettingsView';

export const metadata = {
  title: 'Pengaturan Akun - Siswa',
};

export default async function StudentSettingsPage() {
  const session = await getSession();

  if (!session || session.role !== 'MURID') {
    redirect('/login');
  }

  const profile = await getSettingsProfileService(session.userId);
  if (!profile) {
    redirect('/login');
  }

  return (
    <StudentSettingsView
      user={{
        id: profile.user.id,
        name: profile.user.name,
        email: profile.user.email,
        role: 'MURID',
        className: profile.user.className,
        emailChangeCount: profile.user.emailChangeCount,
        emailChangedAt: profile.user.emailChangedAt,
      }}
      pendingEmailChange={profile.pendingEmailChange}
    />
  );
}

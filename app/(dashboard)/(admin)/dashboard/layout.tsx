import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import DashboardShell from '@/components/DashboardShell';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  
  if (!session || (session.role !== 'SUPERADMIN' && session.role !== 'GURU')) {
    redirect('/login');
  }

  return <DashboardShell>{children}</DashboardShell>;
}

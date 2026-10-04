import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function SummariesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  
  if (!session || session.role !== 'SUPERADMIN') {
    redirect('/unauthorized');
  }

  return <>{children}</>;
}

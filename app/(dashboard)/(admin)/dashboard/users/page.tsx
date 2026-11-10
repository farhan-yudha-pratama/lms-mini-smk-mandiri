import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { userService } from './modules/user.service';
import UsersView from './components/UsersView';
import { UserRow } from './types';
import { hasPermission } from '@/lib/permissions';

export default async function UsersPage() {
  const session = await getSession();
  
  if (!session || !hasPermission(session, 'USERS_MANAGE')) {
    redirect('/dashboard');
  }

  // Fetch all users using the service layer
  const rawUsers = await userService.getAllUsers();
  
  // Mapping raw data to strongly typed UserRow
  const initialUsers: UserRow[] = rawUsers.map((user) => ({
    id: user.id as string,
    name: user.name as string,
    email: user.email as string,
    role: user.role as 'SUPERADMIN' | 'GURU' | 'MURID',
    isActive: user.isActive as boolean,
    createdAt: new Date(user.createdAt as string | Date).toISOString()
  }));

  return <UsersView initialUsers={initialUsers} />;
}

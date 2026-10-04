import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { userService } from './modules/user.service';
import UsersView from './components/UsersView';
import { UserRow } from './types';

export default async function UsersPage() {
  const session = await getSession();
  
  if (!session || session.role !== 'SUPERADMIN') {
    redirect('/dashboard');
  }

  // Fetch all users using the service layer
  const rawUsers = await userService.getAllUsers();
  
  // Mapping raw data to strongly typed UserRow
  // Removed `any` casting by relying on the service return type 
  // (Assuming db.orm.public.User.all() returns an array of user objects)
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

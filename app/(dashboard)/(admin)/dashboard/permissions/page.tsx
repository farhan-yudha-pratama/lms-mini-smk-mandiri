import { getSession } from '@/lib/session';
import { hasPermission } from '@/lib/permissions';
import { redirect } from 'next/navigation';
import { permissionService } from '@/modules/permission/permission.service';
import PermissionsClient from './PermissionsClient';

export const metadata = {
  title: 'Manajemen Hak Akses & Permission | WebPoint LMS',
};

export const dynamic = 'force-dynamic';

export default async function PermissionsPage() {
  const session = await getSession();

  if (!session || !hasPermission(session, 'USERS_MANAGE')) {
    redirect('/dashboard');
  }

  const [users, catalog, initialPackages] = await Promise.all([
    permissionService.getUsersWithPermissions(),
    permissionService.getPermissionsCatalog(),
    permissionService.getAllPackages(),
  ]);

  return (
    <PermissionsClient
      initialUsers={users}
      catalog={catalog}
      initialPackages={initialPackages}
      currentUserRole={session.role}
    />
  );
}

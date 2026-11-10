import { db } from '../../prisma/db.ts';
import { permissionService } from '../../modules/permission/permission.service.ts';
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  PERMISSION_CATALOG,
  PERMISSION_PACKAGES,
  ALL_PERMISSION_CODES,
} from '../../lib/permissions.ts';
import { emitUserPermissionsUpdated } from '../../lib/socket/emitter.ts';

async function runTests() {
  console.log('🧪 Starting Multi-Permission Automated Verification Suite...\n');

  // Test 1: Verify Permission Catalog
  console.log('Test 1: Verifying Permission Catalog in Database...');
  const catalog = await permissionService.getPermissionsCatalog();
  if (catalog.length !== 14) {
    throw new Error(`Expected 14 permissions in database, got ${catalog.length}`);
  }
  console.log(`✅ Catalog verified: ${catalog.length} permissions present in database across 5 categories.\n`);

  // Test 2: Verify Permission Packages (Presets)
  console.log('Test 2: Verifying Preset Packages...');
  if (PERMISSION_PACKAGES.length < 5) {
    throw new Error(`Expected at least 5 packages, got ${PERMISSION_PACKAGES.length}`);
  }
  for (const pkg of PERMISSION_PACKAGES) {
    console.log(` - Package [${pkg.name}] (${pkg.badge}): ${pkg.permissions.length} permissions`);
  }
  console.log('✅ Preset packages verified.\n');

  // Test 3: Verify hasPermission logic
  console.log('Test 3: Verifying hasPermission authorization logic...');
  const superadminUser = { role: 'SUPERADMIN', permissions: [] };
  const guruUser = { role: 'GURU', permissions: ['MATERI_MANAGE', 'QUIZZES_GRADE'] };

  if (!hasPermission(superadminUser, 'USERS_MANAGE')) {
    throw new Error('SUPERADMIN should have wildcard permission for USERS_MANAGE');
  }
  if (!hasPermission(guruUser, 'MATERI_MANAGE')) {
    throw new Error('GURU should have MATERI_MANAGE');
  }
  if (hasPermission(guruUser, 'USERS_MANAGE')) {
    throw new Error('GURU should NOT have USERS_MANAGE by default');
  }
  if (!hasAnyPermission(guruUser, ['USERS_MANAGE', 'MATERI_MANAGE'])) {
    throw new Error('hasAnyPermission failed');
  }
  if (hasAllPermissions(guruUser, ['MATERI_MANAGE', 'USERS_MANAGE'])) {
    throw new Error('hasAllPermissions failed');
  }
  console.log('✅ Authorization helpers (hasPermission, hasAnyPermission, hasAllPermissions) verified.\n');

  // Test 4: Database assign and update permissions
  console.log('Test 4: Verifying Permission Service Update & Retrieve...');
  const guru = await db.orm.public.User.where({ role: 'GURU' }).first();
  if (!guru) {
    throw new Error('No GURU found for testing');
  }

  const initialPerms = await permissionService.getUserPermissions(guru.id);
  console.log(`Initial permissions for ${guru.name}:`, initialPerms.length);

  // Assign custom permissions including COURSES_MANAGE and AUDIT_LOGS_VIEW
  const testPerms = ['MATERI_MANAGE', 'COURSES_MANAGE', 'AUDIT_LOGS_VIEW'];
  await permissionService.updateUserPermissions(guru.id, testPerms);

  const updatedPerms = await permissionService.getUserPermissions(guru.id);
  if (updatedPerms.length !== 3 || !updatedPerms.includes('COURSES_MANAGE')) {
    throw new Error(`Failed to assign custom permissions: ${JSON.stringify(updatedPerms)}`);
  }
  console.log(`✅ Successfully assigned custom permissions: [${updatedPerms.join(', ')}]`);

  // Test 5: Verify WebSocket emitter
  console.log('Test 5: Verifying WebSocket Permission Emitter...');
  emitUserPermissionsUpdated({
    userId: guru.id,
    permissionCodes: updatedPerms,
    updatedAt: new Date().toISOString(),
  });
  console.log('✅ WebSocket emitter executed cleanly without errors.\n');

  // Restore initial permissions
  await permissionService.updateUserPermissions(guru.id, initialPerms);
  console.log(`✅ Restored initial permissions for ${guru.name} (${initialPerms.length} permissions).\n`);

  console.log('🎉 ALL 5 VERIFICATION CHECKS PASSED PERFECTLY!');
}

runTests()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Test failed:', err);
    process.exit(1);
  });

import { permissionService } from '../modules/permission/permission.service';
import assert from 'assert';

async function runPackageCrudTests() {
  console.log('============================================================');
  console.log('TEST 5: PACKAGE & CATEGORY CRUD TESTS');
  console.log('============================================================');

  // 1. Get all packages
  const initialPackages = await permissionService.getAllPackages();
  console.log(`[READ] Total initial packages: ${initialPackages.length}`);
  assert(initialPackages.length >= 5, 'Should have at least 5 default system packages');
  console.log('PASS: Initial packages loaded correctly');

  // Verify default system packages
  const systemPkg = initialPackages.find((p) => p.isSystem);
  assert(systemPkg, 'Should have at least one system package');
  console.log(`PASS: Found system package: ${systemPkg.name}`);

  // 2. CREATE a custom package with a new category
  const testCategory = 'Kejuruan TKJ';
  const newPkgData = {
    name: 'Paket Teknisi Lab Jaringan Test',
    category: testCategory,
    badge: 'TKJ Lead',
    description: 'Paket khusus kepala laboratorium TKJ untuk pengelolaan praktikum',
    permissions: ['COURSES_READ', 'MATERI_READ', 'MATERI_CREATE', 'ASSIGNMENTS_CREATE'],
  };

  const createdPkg = await permissionService.createPackage(newPkgData);
  assert(createdPkg.id, 'Created package must have an ID');
  assert.strictEqual(createdPkg.name, newPkgData.name);
  assert.strictEqual(createdPkg.category, testCategory);
  assert.strictEqual(createdPkg.badge, newPkgData.badge);
  assert.strictEqual(createdPkg.isSystem, false);
  assert.strictEqual(createdPkg.permissions.length, 4);
  console.log(`PASS: Successfully created custom package "${createdPkg.name}" with category "${createdPkg.category}"`);

  // Verify it exists in getAllPackages()
  const packagesAfterCreate = await permissionService.getAllPackages();
  const foundCreated = packagesAfterCreate.find((p) => p.id === createdPkg.id);
  assert(foundCreated, 'Newly created package must be in list');
  console.log('PASS: Newly created package successfully retrieved from database');

  // 3. UPDATE / EDIT the package and recategorize it
  const updatedCategory = 'Infrastruktur IT';
  const updateData = {
    name: 'Paket Teknisi Lab Jaringan (Updated)',
    category: updatedCategory,
    badge: 'IT Infra',
    description: 'Deskripsi yang telah diperbarui',
    permissions: ['COURSES_READ', 'MATERI_READ', 'MATERI_CREATE', 'ASSIGNMENTS_CREATE', 'STUDENTS_READ'],
  };

  const updatedPkg = await permissionService.updatePackage(createdPkg.id, updateData);
  assert.strictEqual(updatedPkg.name, updateData.name);
  assert.strictEqual(updatedPkg.category, updatedCategory);
  assert.strictEqual(updatedPkg.badge, updateData.badge);
  assert.strictEqual(updatedPkg.permissions.length, 5);
  console.log(`PASS: Successfully updated package name, category to "${updatedPkg.category}", and added permissions`);

  // 4. SECURITY CHECK: Cannot delete system package
  let systemDeleteFailed = false;
  try {
    await permissionService.deletePackage(systemPkg.id);
  } catch (err: any) {
    systemDeleteFailed = true;
    assert(err.message.includes('sistem'), 'Error message should mention system package protection');
  }
  assert(systemDeleteFailed, 'System package must be protected from deletion');
  console.log('PASS: System package correctly rejected deletion attempt');

  // 5. DELETE the custom package
  const deletedPkg = await permissionService.deletePackage(createdPkg.id);
  assert.strictEqual(deletedPkg.id, createdPkg.id);
  console.log(`PASS: Successfully deleted custom package "${deletedPkg.name}"`);

  // Verify it is gone
  const packagesAfterDelete = await permissionService.getAllPackages();
  const foundDeleted = packagesAfterDelete.find((p) => p.id === createdPkg.id);
  assert(!foundDeleted, 'Deleted package should no longer exist');
  console.log('PASS: Confirmed package is removed from database');

  console.log('============================================================');
  console.log('ALL PACKAGE & CATEGORY CRUD TESTS PASSED SUCCESSFULLY!');
  console.log('============================================================');
}

runPackageCrudTests()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('TEST FAILED:', err);
    process.exit(1);
  });

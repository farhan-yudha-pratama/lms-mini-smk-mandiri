// scripts/test-unit-permissions.ts
import {
  PERMISSION_CATALOG,
  PERMISSION_CATEGORIES,
  PERMISSION_PACKAGES,
  ALL_PERMISSION_CODES,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  type PermissionCode,
  type PermissionCategory,
} from '../lib/permissions';

async function runUnitTests() {
  console.log('========================================================================');
  console.log('  UNIT TEST SUITE: MULTI-PERMISSION CATALOG, ENGINE & LOGIC             ');
  console.log('========================================================================\n');

  let passed = 0;
  let total = 0;

  function assert(label: string, condition: boolean, detail = '') {
    total++;
    if (condition) {
      passed++;
      console.log(`[PASS] ✅ ${label}`);
    } else {
      console.error(`[FAIL] ❌ ${label} - Detail: ${detail}`);
    }
  }

  // -------------------------------------------------------------
  // TEST GROUP 1: CATALOG INTEGRITY & CATEGORIES
  // -------------------------------------------------------------
  console.log('--- 1. Katalog & Integritas Kategori Permission ---');

  assert(
    '1.1 Total izin operasional tepat 74 item (Granular CRUD + Modul)',
    PERMISSION_CATALOG.length === 74,
    `Diharapkan 74 izin, ditemukan: ${PERMISSION_CATALOG.length}`
  );

  assert(
    '1.2 Kategori permission tepat 8 kelompok',
    PERMISSION_CATEGORIES.length === 8,
    `Diharapkan 8 kategori, ditemukan: ${PERMISSION_CATEGORIES.length}`
  );

  const expectedCategories: PermissionCategory[] = [
    'Manajemen Pengguna & Akun',
    'Rombel, Kelas & Kurikulum',
    'Konten & Modul Pembelajaran',
    'Ringkasan & Asisten AI',
    'Asesmen, Kuis & Bank Soal',
    'Penilaian & Buku Nilai',
    'Monitoring Siswa & Proyek',
    'Arsip, Laporan & Keamanan Sistem',
  ];
  const categoriesMatch = expectedCategories.every((c) => PERMISSION_CATEGORIES.includes(c));
  assert('1.3 Seluruh nama 8 kategori baku tersedia', categoriesMatch);

  // Verifikasi setiap permission memiliki struktur lengkap & valid
  let allCatalogValid = true;
  const seenCodes = new Set<string>();
  let duplicateCode = '';

  for (const item of PERMISSION_CATALOG) {
    if (!item.code || !item.name || !item.category || !item.description) {
      allCatalogValid = false;
      break;
    }
    if (seenCodes.has(item.code)) {
      duplicateCode = item.code;
      break;
    }
    seenCodes.add(item.code);
    if (!PERMISSION_CATEGORIES.includes(item.category)) {
      allCatalogValid = false;
      break;
    }
  }
  assert('1.4 Setiap entri katalog memiliki code, name, category valid & deskripsi', allCatalogValid);
  assert('1.5 Tidak ada duplikasi kode permission dalam katalog', duplicateCode === '', `Duplikasi: ${duplicateCode}`);

  assert(
    '1.6 ALL_PERMISSION_CODES sinkron 1:1 dengan PERMISSION_CATALOG',
    ALL_PERMISSION_CODES.length === PERMISSION_CATALOG.length &&
    ALL_PERMISSION_CODES.every((c) => seenCodes.has(c))
  );

  // -------------------------------------------------------------
  // TEST GROUP 2: PRESET PACKAGES (BUNDLES)
  // -------------------------------------------------------------
  console.log('\n--- 2. Integritas Paket Presets (Bundles) ---');

  assert(
    '2.1 Tersedia minimal 5 paket preset standar',
    PERMISSION_PACKAGES.length === 5,
    `Ditemukan: ${PERMISSION_PACKAGES.length}`
  );

  const expectedPackageIds = [
    'guru_standar',
    'koordinator_kurikulum',
    'asisten_penilai',
    'wali_kelas',
    'administrator_penuh',
  ];
  const allPackagesExist = expectedPackageIds.every((id) =>
    PERMISSION_PACKAGES.some((pkg) => pkg.id === id)
  );
  assert('2.2 ID paket preset baku lengkap tersedia', allPackagesExist);

  // Cek apakah seluruh kode izin dalam paket valid (tidak ada typo/kode fiktif)
  let allPackageCodesValid = true;
  for (const pkg of PERMISSION_PACKAGES) {
    for (const code of pkg.permissions) {
      if (!seenCodes.has(code)) {
        allPackageCodesValid = false;
        console.error(`Invalid code "${code}" in package "${pkg.id}"`);
      }
    }
  }
  assert('2.3 Seluruh permission dalam paket preset terdaftar resmi di katalog', allPackageCodesValid);

  const fullAdminPkg = PERMISSION_PACKAGES.find((p) => p.id === 'administrator_penuh');
  assert(
    '2.4 Paket Administrator Penuh memuat seluruh 74 izin',
    fullAdminPkg !== undefined && fullAdminPkg.permissions.length === 74
  );

  const guruStandarPkg = PERMISSION_PACKAGES.find((p) => p.id === 'guru_standar');
  assert(
    '2.5 Paket Guru Standar mencakup hak esensial pengajaran',
    guruStandarPkg !== undefined &&
    guruStandarPkg.permissions.includes('MATERI_MANAGE') &&
    guruStandarPkg.permissions.includes('QUIZZES_MANAGE') &&
    guruStandarPkg.permissions.includes('GRADEBOOK_VIEW') &&
    !guruStandarPkg.permissions.includes('USERS_MANAGE')
  );

  const kurikulumPkg = PERMISSION_PACKAGES.find((p) => p.id === 'koordinator_kurikulum');
  assert(
    '2.6 Paket Koordinator Kurikulum mencakup CLASSES_MANAGE dan COURSES_MANAGE',
    kurikulumPkg !== undefined &&
    kurikulumPkg.permissions.includes('CLASSES_MANAGE') &&
    kurikulumPkg.permissions.includes('COURSES_MANAGE')
  );

  // -------------------------------------------------------------
  // TEST GROUP 3: AUTHORIZATION ENGINE - hasPermission (Single)
  // -------------------------------------------------------------
  console.log('\n--- 3. Authorization Engine: hasPermission (Single Check) ---');

  const superadminUser = { role: 'SUPERADMIN', permissions: [] };
  const guruDenganIzin = {
    role: 'GURU',
    permissions: ['MATERI_MANAGE', 'QUIZZES_GRADE', 'GRADEBOOK_VIEW'],
  };
  const guruPolos = { role: 'GURU', permissions: [] };
  const muridUser = { role: 'MURID', permissions: ['MATERI_MANAGE'] };

  assert(
    '3.1 SUPERADMIN selalu lolos (Wildcard *) untuk permission terdaftar',
    hasPermission(superadminUser, 'USERS_MANAGE') &&
    hasPermission(superadminUser, 'CLASSES_MANAGE') &&
    hasPermission(superadminUser, 'SETTINGS_MANAGE')
  );

  assert(
    '3.2 SUPERADMIN selalu lolos (Wildcard *) bahkan jika array permissions kosong',
    hasPermission({ role: 'SUPERADMIN' }, 'REPORTS_VIEW')
  );

  assert(
    '3.3 GURU lolos jika memiliki permission eksplisit',
    hasPermission(guruDenganIzin, 'MATERI_MANAGE') &&
    hasPermission(guruDenganIzin, 'QUIZZES_GRADE') &&
    hasPermission(guruDenganIzin, 'GRADEBOOK_VIEW')
  );

  assert(
    '3.4 GURU ditolak jika tidak memiliki permission yang diminta',
    !hasPermission(guruDenganIzin, 'USERS_MANAGE') &&
    !hasPermission(guruDenganIzin, 'COURSES_MANAGE') &&
    !hasPermission(guruDenganIzin, 'SETTINGS_MANAGE')
  );

  assert(
    '3.5 GURU dengan permissions kosong ditolak untuk semua hak akses admin',
    !hasPermission(guruPolos, 'MATERI_MANAGE') && !hasPermission(guruPolos, 'USERS_MANAGE')
  );

  assert(
    '3.6 User MURID selalu ditolak untuk hak operasional',
    !hasPermission(muridUser, 'MATERI_MANAGE')
  );

  assert(
    '3.7 Objek user null atau undefined ditolak secara aman',
    !hasPermission(null, 'MATERI_MANAGE') && !hasPermission(undefined, 'MATERI_MANAGE')
  );

  // -------------------------------------------------------------
  // TEST GROUP 4: AUTHORIZATION ENGINE - hasAnyPermission (OR Logic)
  // -------------------------------------------------------------
  console.log('\n--- 4. Authorization Engine: hasAnyPermission (OR Check) ---');

  assert(
    '4.1 SUPERADMIN selalu lolos hasAnyPermission',
    hasAnyPermission(superadminUser, ['USERS_MANAGE', 'NON_EXISTENT' as any])
  );

  assert(
    '4.2 GURU lolos jika memiliki SALAH SATU permission yang diminta',
    hasAnyPermission(guruDenganIzin, ['COURSES_MANAGE', 'MATERI_MANAGE']) &&
    hasAnyPermission(guruDenganIzin, ['NON_EXISTENT' as any, 'GRADEBOOK_VIEW'])
  );

  assert(
    '4.3 GURU ditolak jika TIDAK MEMILIKI SATUPUN dari daftar permission',
    !hasAnyPermission(guruDenganIzin, ['USERS_MANAGE', 'COURSES_MANAGE', 'SETTINGS_MANAGE'])
  );

  assert(
    '4.4 Daftar permission kosong pada query mengembalikan false secara aman',
    !hasAnyPermission(guruDenganIzin, [])
  );

  // -------------------------------------------------------------
  // TEST GROUP 5: AUTHORIZATION ENGINE - hasAllPermissions (AND Logic)
  // -------------------------------------------------------------
  console.log('\n--- 5. Authorization Engine: hasAllPermissions (AND Check) ---');

  assert(
    '5.1 SUPERADMIN selalu lolos hasAllPermissions',
    hasAllPermissions(superadminUser, ['USERS_MANAGE', 'SETTINGS_MANAGE', 'MATERI_MANAGE'])
  );

  assert(
    '5.2 GURU lolos jika memiliki SELURUH permission yang diminta',
    hasAllPermissions(guruDenganIzin, ['MATERI_MANAGE', 'QUIZZES_GRADE'])
  );

  assert(
    '5.3 GURU ditolak jika hanya memiliki SEBAGIAN permission yang diminta',
    !hasAllPermissions(guruDenganIzin, ['MATERI_MANAGE', 'USERS_MANAGE'])
  );

  assert(
    '5.4 Daftar permission kosong pada query mengembalikan false secara aman',
    !hasAllPermissions(guruDenganIzin, [])
  );

  // -------------------------------------------------------------
  // TEST GROUP 6: SIDEBAR NAVIGATION FILTER LOGIC SIMULATION
  // -------------------------------------------------------------
  console.log('\n--- 6. Simulasi Filter Menu Sidebar (DashboardSidebar.tsx) ---');

  interface MenuItem {
    label: string;
    href: string;
    permission?: PermissionCode | PermissionCode[];
    rolesOnly?: string[];
  }

  const ALL_MENU_ITEMS: MenuItem[] = [
    { label: 'Overview', href: '/dashboard' },
    { label: 'Manajemen Pengguna', href: '/dashboard/users', permission: 'USERS_MANAGE' },
    { label: 'Manajemen Permission', href: '/dashboard/permissions', permission: 'USERS_MANAGE' },
    { label: 'Manajemen Kelas', href: '/dashboard/classes', permission: 'CLASSES_MANAGE' },
    { label: 'Mata Pelajaran', href: '/dashboard/courses', permission: 'COURSES_MANAGE' },
    { label: 'Mapel Saya', href: '/dashboard/my-courses', rolesOnly: ['GURU'], permission: 'MATERI_MANAGE' },
    { label: 'Kelola Materi', href: '/dashboard/materi', permission: 'MATERI_MANAGE' },
    { label: 'Pengaturan', href: '/dashboard/settings', permission: 'SETTINGS_MANAGE' },
  ];

  function filterMenus(user: any) {
    return ALL_MENU_ITEMS.filter((item) => {
      if (!user) return false;
      if (user.role === 'SUPERADMIN') return true;
      if (item.rolesOnly && !item.rolesOnly.includes(user.role)) return false;
      if (!item.permission) return true;
      if (Array.isArray(item.permission)) return hasAnyPermission(user, item.permission);
      return hasPermission(user, item.permission);
    });
  }

  const superAdminMenus = filterMenus(superadminUser);
  assert(
    '6.1 SUPERADMIN melihat seluruh menu navigasi',
    superAdminMenus.length === ALL_MENU_ITEMS.length
  );

  const guruMenusDefault = filterMenus(guruDenganIzin);
  const hasUserManagement = guruMenusDefault.some((m) => m.href === '/dashboard/users');
  const hasPermissionManagement = guruMenusDefault.some((m) => m.href === '/dashboard/permissions');
  const hasMateriManagement = guruMenusDefault.some((m) => m.href === '/dashboard/materi');
  const hasMapelSaya = guruMenusDefault.some((m) => m.href === '/dashboard/my-courses');

  assert('6.2 Guru standar TIDAK melihat menu Manajemen Pengguna', !hasUserManagement);
  assert('6.3 Guru standar TIDAK melihat menu Manajemen Permission', !hasPermissionManagement);
  assert('6.4 Guru standar melihat menu Kelola Materi', hasMateriManagement);
  assert('6.5 Guru standar melihat menu Mapel Saya', hasMapelSaya);

  const guruKoordinator = {
    role: 'GURU',
    permissions: ['USERS_MANAGE', 'MATERI_MANAGE'],
  };
  const guruKoordinatorMenus = filterMenus(guruKoordinator);
  assert(
    '6.6 Guru yang diberi wewenang USERS_MANAGE langsung melihat menu Manajemen Permission & Pengguna',
    guruKoordinatorMenus.some((m) => m.href === '/dashboard/permissions') &&
    guruKoordinatorMenus.some((m) => m.href === '/dashboard/users')
  );

  // -------------------------------------------------------------
  // RINGKASAN AKHIR
  // -------------------------------------------------------------
  console.log('\n========================================================================');
  console.log(`  HASIL UNIT TEST: ${passed} / ${total} BERHASIL (Passed: ${((passed / total) * 100).toFixed(1)}%)`);
  console.log('========================================================================\n');

  if (passed !== total) {
    throw new Error(`Ada ${total - passed} pengujian unit yang gagal!`);
  }
}

runUnitTests()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Unit test suite encountered fatal error:', err);
    process.exit(1);
  });

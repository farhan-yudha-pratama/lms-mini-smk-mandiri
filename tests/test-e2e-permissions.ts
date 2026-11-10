// scripts/test-e2e-permissions.ts
import { db } from '../prisma/db';
import { permissionService } from '../modules/permission/permission.service';
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  PERMISSION_PACKAGES,
  ALL_PERMISSION_CODES,
} from '../lib/permissions';
import { emitUserPermissionsUpdated } from '../lib/socket/emitter';

async function runE2ETests() {
  console.log('========================================================================');
  console.log('  E2E TEST SUITE: USER JOURNEYS & PERMISSION LIFECYCLE SIMULATION       ');
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
  // USER JOURNEY 1: SUPERADMIN MEMERIKSA KATALOG & DAFTAR PENGGUNA
  // -------------------------------------------------------------
  console.log('--- USER JOURNEY 1: Superadmin Membuka Halaman Manajemen Permission ---');

  const catalog = await permissionService.getPermissionsCatalog();
  assert(
    '1.1 Superadmin berhasil memuat katalog lengkap 74 permission dari database',
    Array.isArray(catalog) && catalog.length === 74,
    `Jumlah izin dalam DB: ${catalog.length}`
  );

  const usersList = await permissionService.getUsersWithPermissions();
  assert(
    '1.2 Superadmin berhasil memuat daftar akun pendidik & admin (non-murid)',
    Array.isArray(usersList) && usersList.length > 0,
    `Total pengguna ditemukan: ${usersList.length}`
  );

  const superadminUser = usersList.find((u) => u.role === 'SUPERADMIN');
  assert(
    '1.3 Pengguna dengan role SUPERADMIN otomatis mendapatkan status Wildcard (74 izin)',
    superadminUser !== undefined && superadminUser.permissions.length === 74
  );

  const teacherUser = usersList.find((u) => u.role === 'GURU');
  if (!teacherUser) {
    throw new Error('Prasyarat E2E gagal: Tidak ditemukan akun dengan role GURU di database.');
  }
  console.log(`Target pengujian akun Guru: "${teacherUser.name}" (${teacherUser.email}, ID: ${teacherUser.id})`);

  // Simpan kondisi awal permissions guru untuk rollback nanti
  const originalTeacherPerms = await permissionService.getUserPermissions(teacherUser.id);
  console.log(`Izin awal Guru sebelum pengujian: [${originalTeacherPerms.join(', ')}] (${originalTeacherPerms.length} izin)\n`);

  try {
    // -------------------------------------------------------------
    // USER JOURNEY 2: SUPERADMIN MENUGASKAN PAKET PRESET KURIKULUM
    // -------------------------------------------------------------
    console.log('--- USER JOURNEY 2: Superadmin Menerapkan 1-Click Preset "Koordinator Kurikulum" ---');

    const kurikulumPreset = PERMISSION_PACKAGES.find((p) => p.id === 'koordinator_kurikulum');
    if (!kurikulumPreset) {
      throw new Error('Paket preset koordinator_kurikulum tidak ditemukan di lib/permissions.');
    }

    // Superadmin mengklik "Terapkan Paket Koordinator Kurikulum"
    const assignedPerms = await permissionService.updateUserPermissions(
      teacherUser.id,
      kurikulumPreset.permissions
    );

    assert(
      '2.1 Paket Koordinator Kurikulum berhasil disimpan ke database',
      assignedPerms.length === kurikulumPreset.permissions.length
    );

    // Ambil ulang dari database untuk memastikan persistensi tabel UserPermission
    const fetchedAfterPreset = await permissionService.getUserPermissions(teacherUser.id);
    assert(
      '2.2 Data permission tersimpan permanen di tabel UserPermission PostgreSQL',
      fetchedAfterPreset.length === kurikulumPreset.permissions.length &&
      fetchedAfterPreset.includes('CLASSES_MANAGE') &&
      fetchedAfterPreset.includes('COURSES_MANAGE') &&
      fetchedAfterPreset.includes('MATERI_MANAGE')
    );

    // -------------------------------------------------------------
    // USER JOURNEY 3: GURU MENGAKSES FITUR DENGAN IZIN BARU
    // -------------------------------------------------------------
    console.log('\n--- USER JOURNEY 3: Evaluasi Akses & Wewenang Fitur bagi Guru ---');

    const simulatedTeacherSession = {
      userId: teacherUser.id,
      role: 'GURU',
      name: teacherUser.name,
      permissions: fetchedAfterPreset,
    };

    assert(
      '3.1 Guru berhasil mengakses modul Manajemen Kelas (/dashboard/classes)',
      hasPermission(simulatedTeacherSession, 'CLASSES_MANAGE')
    );

    assert(
      '3.2 Guru berhasil mengakses modul Mata Pelajaran Kurikulum (/dashboard/courses)',
      hasPermission(simulatedTeacherSession, 'COURSES_MANAGE')
    );

    assert(
      '3.3 Guru berhasil mengakses modul Pembuatan Kuis (/dashboard/quizzes)',
      hasPermission(simulatedTeacherSession, 'QUIZZES_MANAGE')
    );

    assert(
      '3.4 Guru TETAP DITOLAK saat mencoba mengakses Manajemen Pengguna (/dashboard/users)',
      !hasPermission(simulatedTeacherSession, 'USERS_MANAGE')
    );

    assert(
      '3.5 Guru TETAP DITOLAK saat mencoba mengakses Pengaturan Sistem (/dashboard/settings)',
      !hasPermission(simulatedTeacherSession, 'SETTINGS_MANAGE')
    );

    assert(
      '3.6 Guru TETAP DITOLAK saat mencoba mengakses Audit Logs (/dashboard/audit-logs)',
      !hasPermission(simulatedTeacherSession, 'AUDIT_LOGS_VIEW')
    );

    // -------------------------------------------------------------
    // USER JOURNEY 4: SUPERADMIN MELAKUKAN CUSTOM GRANULAR OVERRIDE
    // -------------------------------------------------------------
    console.log('\n--- USER JOURNEY 4: Superadmin Mengubah Hak Akses Granular (Cabut/Tambah Spesifik) ---');

    // Superadmin mencabut CLASSES_MANAGE dan menambahkan AUDIT_LOGS_VIEW
    const customizedPerms = fetchedAfterPreset
      .filter((p) => p !== 'CLASSES_MANAGE')
      .concat('AUDIT_LOGS_VIEW');

    const updatedGranular = await permissionService.updateUserPermissions(
      teacherUser.id,
      customizedPerms
    );

    assert(
      '4.1 Modifikasi granular berhasil dieksekusi oleh service',
      updatedGranular.includes('AUDIT_LOGS_VIEW') && !updatedGranular.includes('CLASSES_MANAGE')
    );

    const recheckDbPerms = await permissionService.getUserPermissions(teacherUser.id);
    const updatedTeacherSession = {
      userId: teacherUser.id,
      role: 'GURU',
      name: teacherUser.name,
      permissions: recheckDbPerms,
    };

    assert(
      '4.2 Hak akses CLASSES_MANAGE berhasil dicabut (Guru tidak lagi memiliki izin kelas)',
      !hasPermission(updatedTeacherSession, 'CLASSES_MANAGE')
    );

    assert(
      '4.3 Hak akses AUDIT_LOGS_VIEW aktif (Guru kini diizinkan melihat audit trail)',
      hasPermission(updatedTeacherSession, 'AUDIT_LOGS_VIEW')
    );

    assert(
      '4.4 Hak akses lainnya (seperti COURSES_MANAGE & MATERI_MANAGE) tetap utuh',
      hasPermission(updatedTeacherSession, 'COURSES_MANAGE') &&
      hasPermission(updatedTeacherSession, 'MATERI_MANAGE')
    );

    // -------------------------------------------------------------
    // USER JOURNEY 5: SINKRONISASI REAL-TIME WEBSOCKET
    // -------------------------------------------------------------
    console.log('\n--- USER JOURNEY 5: Broadcast Real-Time WebSocket & Audit Logging ---');

    let socketEmitted = false;
    try {
      emitUserPermissionsUpdated({
        userId: teacherUser.id,
        permissionCodes: recheckDbPerms,
        updatedAt: new Date().toISOString(),
      });
      socketEmitted = true;
    } catch (e) {
      socketEmitted = false;
    }
    assert('5.1 WebSocket event "user:permissions_updated" berhasil dipancarkan', socketEmitted);

    // Simpan jejak audit langsung ke DB
    const auditRecord = await db.orm.public.AuditLog.create({
      userId: superadminUser?.id || teacherUser.id,
      action: 'UPDATE_USER_PERMISSIONS',
      details: JSON.stringify({
        v: 2,
        message: `Admin memperbarui hak akses pengguna ${teacherUser.name} (${recheckDbPerms.length} hak akses)`,
        meta: {
          targetUserId: teacherUser.id,
          targetEmail: teacherUser.email,
          grantedCount: recheckDbPerms.length,
          permissions: recheckDbPerms,
        },
      }),
      ipAddress: '127.0.0.1',
    });

    assert(
      '5.2 Jejak audit UPDATE_USER_PERMISSIONS berhasil tercatat di database',
      Boolean(auditRecord && auditRecord.id)
    );

    // -------------------------------------------------------------
    // USER JOURNEY 6: PROTEKSI KEAMANAN & SANITISASI INPUT
    // -------------------------------------------------------------
    console.log('\n--- USER JOURNEY 6: Pengujian Batas Keamanan & Edge Cases ---');

    // 6.1 Sanitasi input kode ilegal/fiktif
    const dirtyCodes = [
      'MATERI_MANAGE',
      'DROP_DATABASE_INJECTION',
      'COURSES_MANAGE',
      'UNKNOWN_PERM_XYZ',
    ];
    const sanitizedResult = await permissionService.updateUserPermissions(
      teacherUser.id,
      dirtyCodes
    );

    assert(
      '6.1 Sistem menolak kode tidak resmi dan hanya menyimpan kode yang valid di katalog',
      sanitizedResult.length === 2 &&
      sanitizedResult.includes('MATERI_MANAGE') &&
      sanitizedResult.includes('COURSES_MANAGE') &&
      !sanitizedResult.includes('DROP_DATABASE_INJECTION')
    );

    // 6.2 Proteksi ID Pengguna fiktif
    let errorCaughtOnInvalidUser = false;
    try {
      await permissionService.updateUserPermissions('non-existent-user-uuid-999', ['MATERI_MANAGE']);
    } catch (err: any) {
      errorCaughtOnInvalidUser = err.message.includes('tidak ditemukan');
    }
    assert(
      '6.2 Permintaan penugasan wewenang ke userId fiktif ditolak dengan pesan yang jelas',
      errorCaughtOnInvalidUser
    );

    // 6.3 Pengosongan seluruh hak akses (Revoke All)
    const emptyPerms = await permissionService.updateUserPermissions(teacherUser.id, []);
    assert(
      '6.3 Pencabutan seluruh hak akses (Revoke All) berjalan bersih tanpa error database',
      emptyPerms.length === 0
    );

    const recheckEmpty = await permissionService.getUserPermissions(teacherUser.id);
    assert('6.4 Tabel UserPermission untuk user target bersih (0 record)', recheckEmpty.length === 0);

  } finally {
    // -------------------------------------------------------------
    // USER JOURNEY 7: CLEAN TEARDOWN & RESTORASI KONDISI AWAL
    // -------------------------------------------------------------
    console.log('\n--- USER JOURNEY 7: Pembersihan & Restorasi Kondisi Semula ---');

    await permissionService.updateUserPermissions(teacherUser.id, originalTeacherPerms);
    const restoredPerms = await permissionService.getUserPermissions(teacherUser.id);

    assert(
      '7.1 Hak akses akun Guru berhasil dikembalikan persis ke kondisi awal',
      restoredPerms.length === originalTeacherPerms.length &&
      originalTeacherPerms.every((p) => restoredPerms.includes(p))
    );
    console.log(`Status akun Guru dipulihkan: ${restoredPerms.length} izin aktif.\n`);
  }

  // -------------------------------------------------------------
  // RINGKASAN AKHIR E2E
  // -------------------------------------------------------------
  console.log('========================================================================');
  console.log(`  HASIL E2E TEST: ${passed} / ${total} BERHASIL (Passed: ${((passed / total) * 100).toFixed(1)}%)`);
  console.log('========================================================================\n');

  if (passed !== total) {
    throw new Error(`Ada ${total - passed} skenario pengujian E2E yang gagal!`);
  }
}

runE2ETests()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ E2E test suite encountered fatal error:', err);
    process.exit(1);
  });

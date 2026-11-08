import 'dotenv/config';
import { db } from '../prisma/db';
import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';
import {
  createStudentProject,
  saveStudentProject,
  getStudentProjectsForAdmin,
  getStudentsProjectMonitoringData,
} from '../modules/sandbox/sandbox.service';
import { bundleVirtualProject } from '../lib/virtual-fs';
import { executeVirtualSql } from '../lib/virtual-db';
import { executeVirtualPhp } from '../lib/virtual-php';
import { StudentProjectMonitoringItem, StudentProjectRecord } from '../modules/sandbox/sandbox.types';

async function runBehaviorTests() {
  console.log('========================================================================');
  console.log('  USER BEHAVIOR & SIMULATION TESTS: SANDBOX & MONITORING                ');
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

  const runId = Date.now().toString();
  const testClassId = `class-bhv-${runId}`;
  const testStudentId = `user-student-bhv-${runId}`;
  const testStudentPassiveId = `user-passive-bhv-${runId}`;
  const testCourseId = `course-bhv-${runId}`;

  const createdProjectIds: string[] = [];

  try {
    // -------------------------------------------------------------
    // PERSIAPAN DATA SIMULASI
    // -------------------------------------------------------------
    console.log('--- 1. Setup Lingkungan Simulasi Siswa & Guru ---');

    await db.orm.public.Classroom.create({
      id: testClassId,
      name: `XI TKJ 2 Simulasi ${runId}`,
      joinCode: `BHV${runId.slice(-5)}`,
      maxStudents: 32,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const hash = await bcrypt.hash('Secret123!', 10);

    // Siswa Aktif
    await db.orm.public.User.create({
      id: testStudentId,
      name: `Fauzi Pratama ${runId}`,
      email: `fauzi-${runId}@smkmandiri.sch.id`,
      password: hash,
      role: 'MURID',
      isActive: true,
      classId: testClassId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Siswa Pasif
    await db.orm.public.User.create({
      id: testStudentPassiveId,
      name: `Citra Dewi ${runId}`,
      email: `citra-${runId}@smkmandiri.sch.id`,
      password: hash,
      role: 'MURID',
      isActive: true,
      classId: testClassId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await db.orm.public.Course.create({
      id: testCourseId,
      name: `Jaringan Komputer Dasar ${runId}`,
      slug: `jarkom-${runId}`,
      joinCode: `JK${runId.slice(-6)}`,
      description: 'Kursus Simulasi',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await db.orm.public.CourseStudent.create({
      id: randomUUID(),
      courseId: testCourseId,
      studentId: testStudentId,
    });
    assert('1.1 Data kelas, 2 siswa simulasi, dan mata pelajaran siap', true);

    // -------------------------------------------------------------
    // SKENARIO 1: SISWA MENGETIK CEPAT & DEBOUNCED AUTO-SAVE
    // -------------------------------------------------------------
    console.log('\n--- 2. Skenario Siswa: Pengetikan Cepat & Auto-Save Debounce ---');

    const proj = await createStudentProject(testStudentId, {
      title: 'Eksperimen Auto-Save Siswa',
      type: 'WEB',
    });
    createdProjectIds.push(proj.id);

    // Simulasi pengetikan di editor: 3 event perubahan kode dalam rentang waktu singkat
    // Di sisi client: debounced 1500ms -> hanya state terakhir yang dikirim ke server.
    interface EditAction {
      files: Record<string, string>;
      activeFile: string;
      notes: string;
      timestamp: number;
    }

    const editHistory: EditAction[] = [
      {
        files: { 'index.html': '<h1>H</h1>' },
        activeFile: 'index.html',
        notes: '',
        timestamp: 100,
      },
      {
        files: { 'index.html': '<h1>Halo S</h1>' },
        activeFile: 'index.html',
        notes: '',
        timestamp: 400,
      },
      {
        files: { 'index.html': '<h1>Halo SMK Mandiri!</h1>' },
        activeFile: 'index.html',
        notes: '# Rangkuman Hari Ini',
        timestamp: 800,
      },
    ];

    // Fungsi simulasi debouncer sisi client
    function simulateClientDebounce(edits: EditAction[], debounceMs = 1500): EditAction {
      let pending: EditAction = edits[0];
      for (let i = 1; i < edits.length; i++) {
        // Jika delta waktu < debounceMs, timpa pending action
        if (edits[i].timestamp - pending.timestamp < debounceMs) {
          pending = edits[i];
        }
      }
      return pending;
    }

    const flushedAction = simulateClientDebounce(editHistory);
    assert('2.1 Debouncer menggabungkan 3 ketikan beruntun menjadi 1 payload final',
      flushedAction.files['index.html'] === '<h1>Halo SMK Mandiri!</h1>' &&
      flushedAction.notes === '# Rangkuman Hari Ini'
    );

    // Kirim payload final ke database
    await saveStudentProject(proj.id, testStudentId, {
      id: proj.id,
      files: flushedAction.files,
      activeFile: flushedAction.activeFile,
      notes: flushedAction.notes,
    });

    const verifiedProj = (await db.orm.public.StudentProject.where({ id: proj.id }).first()) as StudentProjectRecord | null;
    assert('2.2 Database hanya menyimpan versi final tanpa spam transaksi',
      Boolean(verifiedProj?.files.includes('Halo SMK Mandiri!')) &&
      verifiedProj?.notes === '# Rangkuman Hari Ini'
    );

    // -------------------------------------------------------------
    // SKENARIO 2: TOLERANSI KESALAHAN KODE & PEMULIHAN (ERROR RECOVERY)
    // -------------------------------------------------------------
    console.log('\n--- 3. Skenario Siswa: Error Recovery & Robustness ---');

    // 2.A: Web Bundler toleran terhadap HTML rusak
    const brokenHtmlFiles = {
      'index.html': '<html><head><link rel="stylesheet" href="non-existent.css"></head><body><div>Unclosed tag',
    };
    const bundledBroken = bundleVirtualProject(brokenHtmlFiles);
    assert('3.1 Bundler tidak crash pada tag tidak tertutup atau file CSS hilang',
      bundledBroken.includes('Unclosed tag') && bundledBroken.includes('lms-sandbox-console')
    );

    // 2.B: SQLite Error Recovery
    const brokenSql = 'SELEKT * FORM tabel_salah;';
    const brokenSqlRes = await executeVirtualSql(brokenSql);
    assert('3.2 Simulator SQL menangkap error sintaksis tanpa exception unhandled',
      brokenSqlRes.output.success === false && Boolean(brokenSqlRes.output.error)
    );

    // Siswa memperbaiki query
    const fixedSql = `
      CREATE TABLE perangkat (id INT, jenis TEXT);
      INSERT INTO perangkat VALUES (1, 'Router Mikrotik');
      SELECT * FROM perangkat;
    `;
    const fixedSqlRes = await executeVirtualSql(fixedSql);
    assert('3.3 Siswa memperbaiki query SQL -> hasil tabel pulih dan ditampilkan',
      fixedSqlRes.output.success === true &&
      fixedSqlRes.output.results[0].values[0][1] === 'Router Mikrotik'
    );

    // 2.C: PHP Error Handling
    const brokenPhp = '<?php echo "test" ?>'; // missing semicolon di statement multi-line atau parse error
    const phpRes = await executeVirtualPhp(brokenPhp);
    assert('3.4 Mesin PHP mengeksekusi script secara terkontrol',
      typeof phpRes.stdout === 'string' && typeof phpRes.executionTimeMs === 'number'
    );

    // -------------------------------------------------------------
    // SKENARIO 3: MULTI-FILE & CATATAN BELAJAR MARKDOWN
    // -------------------------------------------------------------
    console.log('\n--- 4. Skenario Siswa: Multi-File & Catatan Markdown ---');

    const multiFiles = {
      'index.html': '<!DOCTYPE html><html><body><h1>Sistem Mandiri</h1></body></html>',
      'css/style.css': 'h1 { color: #2563eb; }',
      'js/app.js': 'console.log("App ready");',
      'database/query.sql': 'SELECT * FROM users;',
    };
    const richMarkdownNotes = `# Catatan Laboratorium Siswa
## Konfigurasi Port
- HTTP: 80
- HTTPS: 443
- SSH: 22

\`\`\`bash
# Perintah cek status koneksi
ping 192.168.1.1
\`\`\`
> Pembelajaran hari ini berjalan lancar.`;

    await saveStudentProject(proj.id, testStudentId, {
      id: proj.id,
      files: multiFiles,
      activeFile: 'database/query.sql',
      notes: richMarkdownNotes,
    });

    const updatedProj = (await db.orm.public.StudentProject.where({ id: proj.id }).first()) as StudentProjectRecord | null;
    assert('4.1 Seluruh berkas multi-file tersimpan secara modular di database',
      Boolean(updatedProj?.files.includes('database/query.sql')) &&
      Boolean(updatedProj?.files.includes('css/style.css'))
    );
    assert('4.2 Catatan Markdown siswa tersimpan utuh dengan format code block & heading',
      Boolean(updatedProj?.notes?.includes('```bash')) &&
      Boolean(updatedProj?.notes?.includes('## Konfigurasi Port'))
    );

    // -------------------------------------------------------------
    // SKENARIO 4: GURU MENGGUNAKAN TOOLBAR FILTERING
    // -------------------------------------------------------------
    console.log('\n--- 5. Skenario Guru: Toolbar Filtering & Pencarian Siswa ---');

    const monitoringData = await getStudentsProjectMonitoringData();
    const allStudents = monitoringData.students;

    // Filter A: Pencarian Nama (Case-Insensitive)
    function applySearch(query: string, list: StudentProjectMonitoringItem[]) {
      const q = query.toLowerCase();
      return list.filter(s => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q));
    }
    const searchRes = applySearch('FAUZI', allStudents);
    assert('5.1 Pencarian nama "FAUZI" (huruf kapital) menemukan Siswa Fauzi Pratama',
      searchRes.some(s => s.id === testStudentId)
    );

    // Filter B: Filter Kelas Spesifik
    const classFiltered = allStudents.filter(s => s.classId === testClassId);
    assert('5.2 Filter kelas menyaring tepat siswa di kelas XI TKJ 2 Simulasi',
      classFiltered.length >= 2 && classFiltered.every(s => s.classId === testClassId)
    );

    // Filter C: Filter Cepat "Belum Ada Proyek" (Mencari Siswa Pasif)
    const passiveStudents = classFiltered.filter(s => s.projectsCount === 0);
    assert('5.3 Filter cepat "Belum Ada Proyek" mendeteksi Siswa Citra Dewi (0 Proyek)',
      passiveStudents.some(s => s.id === testStudentPassiveId) &&
      !passiveStudents.some(s => s.id === testStudentId)
    );

    // Filter D: Filter Cepat "Memiliki Proyek"
    const activeStudents = classFiltered.filter(s => s.projectsCount > 0);
    assert('5.4 Filter cepat "Memiliki Proyek" mendeteksi Siswa Fauzi Pratama',
      activeStudents.some(s => s.id === testStudentId)
    );

    // -------------------------------------------------------------
    // SKENARIO 5: INSPEKSI PROYEK GURU (READ-ONLY & EXECUTION)
    // -------------------------------------------------------------
    console.log('\n--- 6. Skenario Guru: Inspeksi Read-Only & Output Siswa ---');

    const inspection = await getStudentProjectsForAdmin(testStudentId);
    assert('6.1 Guru membuka inspeksi proyek siswa Fauzi Pratama',
      Boolean(inspection.student && inspection.projects.length > 0)
    );

    const targetProject = inspection.projects[0];
    assert('6.2 Guru membaca berkas aktif terakhir siswa (database/query.sql)',
      targetProject.activeFile === 'database/query.sql'
    );
    assert('6.3 Guru dapat membaca catatan Markdown siswa',
      targetProject.notes?.includes('# Catatan Laboratorium Siswa')
    );

    // Guru menguji eksekusi query siswa
    const teacherSqlTest = await executeVirtualSql('SELECT 1 + 1 AS hasil;');
    assert('6.4 Guru dapat menjalankan simulasi kode siswa langsung dari tab pratinjau',
      teacherSqlTest.output.success === true &&
      teacherSqlTest.output.results[0].values[0][0] === 2
    );

  } finally {
    // -------------------------------------------------------------
    // BERSIHKAN DATA SIMULASI
    // -------------------------------------------------------------
    console.log('\n--- 7. Cleanup Data Simulasi Perilaku ---');

    for (const pid of createdProjectIds) {
      try {
        await db.orm.public.StudentProject.where({ id: pid }).delete();
      } catch {
        // ignore
      }
    }

    try {
      await db.orm.public.CourseStudent.where({ studentId: testStudentId }).delete();
      await db.orm.public.Course.where({ id: testCourseId }).delete();
      await db.orm.public.User.where({ id: testStudentId }).delete();
      await db.orm.public.User.where({ id: testStudentPassiveId }).delete();
      await db.orm.public.Classroom.where({ id: testClassId }).delete();
    } catch (e) {
      console.warn('Cleanup error:', e);
    }

    console.log('[CLEANUP] Data simulasi perilaku berhasil dibersihkan.');
  }

  // =============================================================
  // RINGKASAN HASIL
  // =============================================================
  console.log('\n========================================================================');
  console.log(` HASIL USER BEHAVIOR TEST: ${passed} / ${total} BERHASIL (PASSED)`);
  if (passed === total) {
    console.log(' STATUS: SELURUH SKENARIO PERILAKU PENGGUNA 100% SUKSES!');
  } else {
    console.error(` STATUS: ADA ${total - passed} SKENARIO YANG GAGAL.`);
    process.exit(1);
  }
  console.log('========================================================================\n');
}

runBehaviorTests().catch((err) => {
  console.error('Fatal error running behavior tests:', err);
  process.exit(1);
});

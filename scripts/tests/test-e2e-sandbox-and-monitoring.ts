import 'dotenv/config';
import { db } from '../prisma/db';
import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';
import {
  createStudentProject,
  saveStudentProject,
  duplicateStudentProject,
  deleteStudentProject,
  getStudentProjectById,
  getStudentsProjectMonitoringData,
  getStudentProjectsForAdmin,
} from '../modules/sandbox/sandbox.service';

async function runEndToEndTests() {
  console.log('========================================================================');
  console.log('  E2E INTEGRATION TEST: STUDENT SANDBOX & ADMIN MONITORING              ');
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

  // Identitas entitas pengujian unik
  const runId = Date.now().toString();
  const testClassId = `class-e2e-${runId}`;
  const testTeacherId = `user-guru-e2e-${runId}`;
  const testStudentAId = `user-murid-a-${runId}`;
  const testStudentBId = `user-murid-b-${runId}`;
  const testCourseWebId = `course-web-${runId}`;
  const testCourseSqlId = `course-sql-${runId}`;
  const testCategoryId = `cat-e2e-${runId}`;
  const testPageId = `page-e2e-${runId}`;

  const createdProjectIds: string[] = [];

  try {
    // -------------------------------------------------------------
    // TAHAP 1: SETUP DATA DUMMY DI DATABASE RIIL
    // -------------------------------------------------------------
    console.log('--- 1. Setup Kelas, Mata Pelajaran, & Pengguna (Prisma 8) ---');

    // 1.1 Buat Kelas
    await db.orm.public.Classroom.create({
      id: testClassId,
      name: `XII RPL E2E ${runId}`,
      joinCode: `E2E${runId.slice(-5)}`,
      maxStudents: 36,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    assert('1.1 Kelas testing berhasil dibuat di database', true);

    const defaultPassword = await bcrypt.hash('Password123!', 10);

    // 1.2 Buat Guru
    await db.orm.public.User.create({
      id: testTeacherId,
      name: `Guru Pembimbing E2E ${runId}`,
      email: `guru-e2e-${runId}@smkmandiri.sch.id`,
      password: defaultPassword,
      role: 'GURU',
      isActive: true,
      classId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // 1.3 Buat Siswa A (Aktif Banyak Proyek)
    await db.orm.public.User.create({
      id: testStudentAId,
      name: `Ahmad Siswa Aktif E2E ${runId}`,
      email: `siswa-a-${runId}@smkmandiri.sch.id`,
      password: defaultPassword,
      role: 'MURID',
      isActive: true,
      classId: testClassId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // 1.4 Buat Siswa B (Pasif / Belum Ada Proyek)
    await db.orm.public.User.create({
      id: testStudentBId,
      name: `Budi Siswa Pasif E2E ${runId}`,
      email: `siswa-b-${runId}@smkmandiri.sch.id`,
      password: defaultPassword,
      role: 'MURID',
      isActive: true,
      classId: testClassId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    assert('1.2 Pengguna Guru, Siswa A, dan Siswa B berhasil dibuat', true);

    // 1.5 Buat Course & Relasi Guru / Siswa
    await db.orm.public.Course.create({
      id: testCourseWebId,
      name: `Pemrograman Web Dasar E2E ${runId}`,
      slug: `web-dasar-e2e-${runId}`,
      joinCode: `WEB${runId.slice(-6)}`,
      description: 'Latihan E2E Web',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await db.orm.public.Course.create({
      id: testCourseSqlId,
      name: `Basis Data Relasional E2E ${runId}`,
      slug: `basis-data-e2e-${runId}`,
      joinCode: `SQL${runId.slice(-6)}`,
      description: 'Latihan E2E SQL',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Hubungkan Guru ke Course Web
    await db.orm.public.CourseTeacher.create({
      id: randomUUID(),
      courseId: testCourseWebId,
      teacherId: testTeacherId,
    });

    // Daftarkan Siswa A ke Course Web
    await db.orm.public.CourseStudent.create({
      id: randomUUID(),
      courseId: testCourseWebId,
      studentId: testStudentAId,
    });

    // 1.6 Buat Kategori Materi & Halaman
    await db.orm.public.MaterialCategory.create({
      id: testCategoryId,
      courseId: testCourseWebId,
      name: 'HTML & CSS Dasar',
      slug: `html-css-e2e-${runId}`,
      orderIndex: 1,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await db.orm.public.Page.create({
      id: testPageId,
      categoryId: testCategoryId,
      title: 'Pengenalan Tag Div dan CSS Flexbox',
      slug: `tag-div-flexbox-${runId}`,
      orderIndex: 1,
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    assert('1.3 Struktur kurikulum mata pelajaran dan materi berhasil terhubung', true);

    // -------------------------------------------------------------
    // TAHAP 2: SIKLUS HIDUP PROYEK SISWA A (CRUD & AUTO-SAVE)
    // -------------------------------------------------------------
    console.log('\n--- 2. Siklus Hidup Proyek Siswa (CRUD, Templates, & Auto-Save) ---');

    // 2.1 Buat Proyek Web Terhubung Materi
    const projWeb = await createStudentProject(testStudentAId, {
      title: 'Proyek Portofolio Siswa',
      type: 'WEB',
      courseId: testCourseWebId,
      pageId: testPageId,
      description: 'Tugas portofolio mandiri dengan HTML & CSS',
    });
    createdProjectIds.push(projWeb.id);
    assert('2.1 Siswa A berhasil membuat proyek WEB terhubung materi', Boolean(projWeb && projWeb.id));
    assert('2.2 Berkas template default index.html terinisialisasi', projWeb.files.includes('index.html'));
    assert('2.3 ActiveFile otomatis mengarah ke index.html', projWeb.activeFile === 'index.html');

    // 2.2 Buat Proyek SQL Bebas (Mandiri Tanpa Materi)
    const projSql = await createStudentProject(testStudentAId, {
      title: 'Latihan Query DDL Perpustakaan',
      type: 'SQL',
    });
    createdProjectIds.push(projSql.id);
    assert('2.4 Siswa A berhasil membuat proyek SQL mandiri', projSql.type === 'SQL');
    assert('2.5 Berkas template SQL memuat query.sql', projSql.files.includes('query.sql'));

    // 2.3 Simpan Perubahan Kode & Catatan Siswa (Simulasi Debounced Auto-Save)
    const updatedWebFiles = {
      'index.html': '<!DOCTYPE html><html><body><h1>Portofolio Ahmad</h1></body></html>',
      'css/style.css': 'body { background: #f0fdf4; font-family: sans-serif; }',
      'js/main.js': 'console.log("Portofolio dimuat!");',
    };
    const updatedNotes = '# Catatan Tugas Portofolio\n- Sudah selesai membuat layout kartu siswa.';

    const saveResult = await saveStudentProject(projWeb.id, testStudentAId, {
      id: projWeb.id,
      files: updatedWebFiles,
      activeFile: 'css/style.css',
      notes: updatedNotes,
    });
    assert('2.6 Auto-save / Manual save berhasil dieksekusi', saveResult.success === true);

    // Ambil ulang proyek dan verifikasi data
    const fetchedWeb = await getStudentProjectById(projWeb.id, testStudentAId);
    assert('2.7 Data berkas tersimpan dan aktifFile berganti ke css/style.css',
      fetchedWeb?.activeFile === 'css/style.css' && fetchedWeb?.files.includes('Portofolio Ahmad')
    );
    assert('2.8 Catatan Markdown siswa tersimpan di database',
      fetchedWeb?.notes === updatedNotes
    );
    assert('2.9 Metadata courseName dan pageTitle terpetakan dengan benar',
      fetchedWeb?.courseName?.includes('Pemrograman Web Dasar') &&
      fetchedWeb?.pageTitle?.includes('Pengenalan Tag Div')
    );

    // 2.4 Duplikasi Proyek
    const duplicatedProj = await duplicateStudentProject(projWeb.id, testStudentAId);
    createdProjectIds.push(duplicatedProj.id);
    assert('2.10 Proyek berhasil diduplikasi dengan judul berakhiran (Salinan)',
      duplicatedProj.title === 'Proyek Portofolio Siswa (Salinan)'
    );
    assert('2.11 Berkas dan catatan proyek hasil duplikasi identik dengan aslinya',
      duplicatedProj.files === fetchedWeb?.files && duplicatedProj.notes === fetchedWeb?.notes
    );

    // -------------------------------------------------------------
    // TAHAP 3: ROW-LEVEL SECURITY (RLS) & ISOLASI ANTAR SISWA
    // -------------------------------------------------------------
    console.log('\n--- 3. Row-Level Security (RLS) & Isolasi Privasi Siswa ---');

    // 3.1 Siswa B mencoba membaca proyek milik Siswa A
    const unauthorizedRead = await getStudentProjectById(projWeb.id, testStudentBId);
    assert('3.1 Siswa B ditolak membaca proyek Siswa A (mengembalikan null)', unauthorizedRead === null);

    // 3.2 Siswa B mencoba menyimpan/mengedit proyek milik Siswa A
    let saveBlocked = false;
    try {
      await saveStudentProject(projWeb.id, testStudentBId, {
        id: projWeb.id,
        files: { 'index.html': 'HACKED' },
      });
    } catch {
      saveBlocked = true;
    }
    assert('3.2 Siswa B ditolak menyimpan/mengubah berkas milik Siswa A (melempar error)', saveBlocked);

    // 3.3 Siswa B mencoba menghapus proyek milik Siswa A
    let deleteBlocked = false;
    try {
      await deleteStudentProject(projWeb.id, testStudentBId);
    } catch {
      deleteBlocked = true;
    }
    assert('3.3 Siswa B ditolak menghapus proyek milik Siswa A (melempar error)', deleteBlocked);

    // 3.4 Siswa A menghapus proyek salinannya sendiri
    const deleteSuccess = await deleteStudentProject(duplicatedProj.id, testStudentAId);
    assert('3.4 Siswa A berhasil menghapus proyek miliknya sendiri', deleteSuccess === true);

    // -------------------------------------------------------------
    // TAHAP 4: MONITORING PROYEK ADMIN & GURU
    // -------------------------------------------------------------
    console.log('\n--- 4. Rekap Monitoring Proyek Siswa (Admin & Guru) ---');

    // 4.1 Superadmin memanggil rekap data seluruh sistem
    const adminData = await getStudentsProjectMonitoringData();
    assert('4.1 Admin monitoring berhasil mengambil data seluruh siswa', adminData.students.length >= 2);

    const studentARow = adminData.students.find(s => s.id === testStudentAId);
    const studentBRow = adminData.students.find(s => s.id === testStudentBId);

    assert('4.2 Siswa A terdeteksi memiliki proyek (projectsCount >= 2)',
      Boolean(studentARow && studentARow.projectsCount >= 2)
    );
    assert('4.3 Tipe sandbox Siswa A terpetakan (WEB & SQL)',
      Boolean(studentARow && studentARow.projectTypes.includes('WEB') && studentARow.projectTypes.includes('SQL'))
    );
    assert('4.4 Siswa B terdeteksi sebagai siswa pasif (projectsCount === 0)',
      Boolean(studentBRow && studentBRow.projectsCount === 0)
    );
    assert('4.5 Statistik rekap akurat (totalStudents, studentsWithProjects, studentsWithoutProjects)',
      adminData.stats.totalStudents >= 2 &&
      adminData.stats.studentsWithProjects >= 1 &&
      adminData.stats.studentsWithoutProjects >= 1
    );

    // 4.2 Guru memanggil rekap data (dengan teacherId)
    const teacherData = await getStudentsProjectMonitoringData(testTeacherId);
    const teacherCourseIds = teacherData.courses.map(c => c.id);
    assert('4.6 Filter guru menyaring hanya mata pelajaran yang diajar (Course Web)',
      teacherCourseIds.includes(testCourseWebId) && !teacherCourseIds.includes(testCourseSqlId)
    );

    // 4.3 Inspeksi Detail Proyek Siswa A oleh Guru
    const studentAInspection = await getStudentProjectsForAdmin(testStudentAId);
    assert('4.4 Data profil Siswa A terambil lengkap (nama, email, kelas, mapel)',
      studentAInspection.student?.name.includes('Ahmad Siswa Aktif') &&
      studentAInspection.student?.className.includes('XII RPL E2E')
    );
    assert('4.5 Seluruh proyek Siswa A terdaftar dengan informasi materi',
      studentAInspection.projects.length >= 2 &&
      studentAInspection.projects.some(p => p.courseName?.includes('Pemrograman Web Dasar'))
    );

    // 4.4 Inspeksi Detail Siswa B (Belum Ada Proyek)
    const studentBInspection = await getStudentProjectsForAdmin(testStudentBId);
    assert('4.6 Siswa B mengembalikan daftar proyek kosong (projects: [])',
      studentBInspection.projects.length === 0
    );

  } finally {
    // -------------------------------------------------------------
    // TAHAP 5: CLEANUP JAMINAN DATABASE BERSIH
    // -------------------------------------------------------------
    console.log('\n--- 5. Pembersihan Data Pengujian (Database Cleanup) ---');

    // 5.1 Hapus seluruh proyek testing
    for (const pid of createdProjectIds) {
      try {
        await db.orm.public.StudentProject.where({ id: pid }).delete();
      } catch {
        // ignore
      }
    }

    // 5.2 Hapus relasi course & page
    try {
      await db.orm.public.CourseStudent.where({ studentId: testStudentAId }).delete();
      await db.orm.public.CourseStudent.where({ studentId: testStudentBId }).delete();
      await db.orm.public.CourseTeacher.where({ teacherId: testTeacherId }).delete();
      await db.orm.public.Page.where({ id: testPageId }).delete();
      await db.orm.public.MaterialCategory.where({ id: testCategoryId }).delete();
      await db.orm.public.Course.where({ id: testCourseWebId }).delete();
      await db.orm.public.Course.where({ id: testCourseSqlId }).delete();
    } catch (e) {
      console.warn('Pembersihan relasi kurikulum:', e);
    }

    // 5.3 Hapus akun pengguna testing
    try {
      await db.orm.public.User.where({ id: testStudentAId }).delete();
      await db.orm.public.User.where({ id: testStudentBId }).delete();
      await db.orm.public.User.where({ id: testTeacherId }).delete();
    } catch (e) {
      console.warn('Pembersihan pengguna:', e);
    }

    // 5.4 Hapus kelas testing
    try {
      await db.orm.public.Classroom.where({ id: testClassId }).delete();
    } catch (e) {
      console.warn('Pembersihan kelas:', e);
    }

    console.log('[CLEANUP] Seluruh data testing berhasil dibersihkan dari database.');
  }

  // =============================================================
  // RINGKASAN HASIL
  // =============================================================
  console.log('\n========================================================================');
  console.log(` HASIL E2E INTEGRATION TEST: ${passed} / ${total} BERHASIL (PASSED)`);
  if (passed === total) {
    console.log(' STATUS: INTEGRASI END-TO-END 100% SUKSES MEMENUHI SPESIFIKASI!');
  } else {
    console.error(` STATUS: ADA ${total - passed} PENGUJIAN INTEGRASI YANG GAGAL.`);
    process.exit(1);
  }
  console.log('========================================================================\n');
}

runEndToEndTests().catch((err) => {
  console.error('Fatal error running E2E integration tests:', err);
  process.exit(1);
});

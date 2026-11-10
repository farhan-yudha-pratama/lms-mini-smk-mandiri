import pg from 'pg';
import crypto from 'crypto';

const PERMISSIONS = [
  // 1. Manajemen Pengguna & Rombel
  {
    code: 'USERS_MANAGE',
    name: 'Kelola Pengguna',
    category: 'Manajemen Pengguna & Rombel',
    description: 'Mereset kata sandi, mengubah status aktif/nonaktif, dan mengelola profil guru serta siswa.'
  },
  {
    code: 'CLASSES_MANAGE',
    name: 'Kelola Rombel / Kelas',
    category: 'Manajemen Pengguna & Rombel',
    description: 'Menambah rombongan belajar baru, mengatur kuota murid (maks 32), dan membuat kode bergabung.'
  },

  // 2. Kurikulum & Materi Pembelajaran
  {
    code: 'COURSES_MANAGE',
    name: 'Kelola Mata Pelajaran',
    category: 'Kurikulum & Pembelajaran',
    description: 'Membuat mata pelajaran kurikulum master, mengubah deskripsi, dan menugaskan guru pengampu.'
  },
  {
    code: 'MATERI_MANAGE',
    name: 'Kelola Modul & Materi',
    category: 'Kurikulum & Pembelajaran',
    description: 'Membuat silabus, menulis konten materi pembelajaran, menyusun urutan bab, dan menerbitkan materi.'
  },

  // 3. Asesmen, Kuis & Evaluasi
  {
    code: 'QUIZZES_MANAGE',
    name: 'Kelola Paket Kuis',
    category: 'Asesmen & Kuis',
    description: 'Membuat paket soal (Pilihan Ganda, Essay, Code Challenge) dan mengatur konfigurasi anti-cheat.'
  },
  {
    code: 'QUIZZES_GRADE',
    name: 'Penilaian Kuis & Essay',
    category: 'Asesmen & Kuis',
    description: 'Menilai manual jawaban essay siswa, memberikan umpan balik, dan mengevaluasi tantangan kode.'
  },
  {
    code: 'ARCHIVES_VIEW',
    name: 'Akses Arsip Kuis',
    category: 'Asesmen & Kuis',
    description: 'Membuka dan melihat kembali rekaman arsip kuis yang telah lampau.'
  },

  // 4. Buku Nilai, Akses & Proyek Siswa
  {
    code: 'GRADEBOOK_VIEW',
    name: 'Buku Nilai (Matrix Gradebook)',
    category: 'Buku Nilai & Monitoring Siswa',
    description: 'Melihat rekap nilai siswa berbasis matriks spreadsheet serta mengekspor data nilai rapor.'
  },
  {
    code: 'STUDENT_ACCESS_MANAGE',
    name: 'Kelola Kunci Akses Siswa',
    category: 'Buku Nilai & Monitoring Siswa',
    description: 'Membuka kunci materi secara manual, melakukan bypass prasyarat kuis, dan whitelist murid.'
  },
  {
    code: 'STUDENT_PROJECTS_VIEW',
    name: 'Review Proyek Siswa (Sandbox)',
    category: 'Buku Nilai & Monitoring Siswa',
    description: 'Menginspeksi dan mencoba eksekusi proyek coding in-browser IDE milik murid.'
  },
  {
    code: 'SUMMARIES_MANAGE',
    name: 'Kelola Ringkasan & AI Summary',
    category: 'Buku Nilai & Monitoring Siswa',
    description: 'Menghasilkan rangkuman otomatis berbantuan AI dan mengelola catatan intisari materi.'
  },
  {
    code: 'REPORTS_VIEW',
    name: 'Laporan Belajar & Analitik',
    category: 'Buku Nilai & Monitoring Siswa',
    description: 'Melihat statistik kelulusan kuis, analitik waktu pengerjaan, dan grafik ketercapaian kelas.'
  },

  // 5. Sistem & Keamanan
  {
    code: 'AUDIT_LOGS_VIEW',
    name: 'Audit Log & Keamanan',
    category: 'Sistem & Keamanan',
    description: 'Menginspeksi jejak audit aktivitas pengguna, riwayat keamanan, dan pembersihan log sistem.'
  },
  {
    code: 'SETTINGS_MANAGE',
    name: 'Pengaturan Sistem',
    category: 'Sistem & Keamanan',
    description: 'Mengubah konfigurasi sistem dan preferensi institusi SMK Mandiri.'
  }
];

// Default permissions for GURU
const DEFAULT_GURU_PERMISSION_CODES = [
  'CLASSES_MANAGE',
  'MATERI_MANAGE',
  'QUIZZES_MANAGE',
  'QUIZZES_GRADE',
  'GRADEBOOK_VIEW',
  'STUDENT_ACCESS_MANAGE',
  'STUDENT_PROJECTS_VIEW',
  'ARCHIVES_VIEW',
  'REPORTS_VIEW'
];

async function main() {
  const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  console.log('1. Creating tables in PostgreSQL...');

  // Create table permission
  await client.query(`
    CREATE TABLE IF NOT EXISTS "permission" (
      "id" TEXT PRIMARY KEY,
      "code" TEXT NOT NULL UNIQUE,
      "name" TEXT NOT NULL,
      "category" TEXT NOT NULL,
      "description" TEXT,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  // Create table userPermission
  await client.query(`
    CREATE TABLE IF NOT EXISTS "userPermission" (
      "id" TEXT PRIMARY KEY,
      "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
      "permissionId" TEXT NOT NULL REFERENCES "permission"("id") ON DELETE CASCADE,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      CONSTRAINT "userPermission_userId_permissionId_key" UNIQUE ("userId", "permissionId")
    );
  `);

  // Create indices
  await client.query(`
    CREATE INDEX IF NOT EXISTS "userPermission_userId_idx" ON "userPermission"("userId");
    CREATE INDEX IF NOT EXISTS "userPermission_permissionId_idx" ON "userPermission"("permissionId");
    CREATE INDEX IF NOT EXISTS "permission_category_idx" ON "permission"("category");
  `);

  console.log('2. Seeding standard permissions catalog...');
  for (const perm of PERMISSIONS) {
    const existing = await client.query('SELECT id FROM "permission" WHERE code = $1', [perm.code]);
    if (existing.rows.length === 0) {
      await client.query(
        'INSERT INTO "permission" ("id", "code", "name", "category", "description") VALUES ($1, $2, $3, $4, $5)',
        [crypto.randomUUID(), perm.code, perm.name, perm.category, perm.description]
      );
      console.log(`Inserted permission: [${perm.category}] ${perm.code} - ${perm.name}`);
    } else {
      await client.query(
        'UPDATE "permission" SET "name" = $1, "category" = $2, "description" = $3 WHERE "code" = $4',
        [perm.name, perm.category, perm.description, perm.code]
      );
    }
  }

  console.log('3. Assigning default permissions to existing GURU users...');
  const teachers = await client.query(`SELECT id, name FROM "user" WHERE role = 'GURU'`);
  const permRows = await client.query(`SELECT id, code FROM "permission" WHERE code = ANY($1)`, [DEFAULT_GURU_PERMISSION_CODES]);
  const permMap = new Map(permRows.rows.map(r => [r.code, r.id]));

  for (const teacher of teachers.rows) {
    let assigned = 0;
    for (const code of DEFAULT_GURU_PERMISSION_CODES) {
      const permId = permMap.get(code);
      if (permId) {
        const check = await client.query(
          `SELECT id FROM "userPermission" WHERE "userId" = $1 AND "permissionId" = $2`,
          [teacher.id, permId]
        );
        if (check.rows.length === 0) {
          await client.query(
            `INSERT INTO "userPermission" ("id", "userId", "permissionId") VALUES ($1, $2, $3)`,
            [crypto.randomUUID(), teacher.id, permId]
          );
          assigned++;
        }
      }
    }
    console.log(`Teacher ${teacher.name} assigned ${assigned} new permissions.`);
  }

  console.log('Database migration & seeding completed successfully!');
  await client.end();
}

main().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});

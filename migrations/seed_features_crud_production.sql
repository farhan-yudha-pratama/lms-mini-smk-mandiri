-- =========================================================================
-- PRODUCTION SEED: FITUR & PERMISSION CRUD GRANULAR LMS SMK MANDIRI
-- Deskripsi: Kumpulan seluruh nama fitur CRUD pada folder
--            app/(dashboard)/(admin)/dashboard untuk database production.
-- Sifat: Idempoten (Aman dijalankan berulang kali tanpa duplikasi data)
-- Tabel: "permission" & "permissionPackage"
-- =========================================================================

-- 1. KATEGORI: MANAJEMEN PENGGUNA & AKUN
INSERT INTO "permission" ("id", "code", "name", "category", "description", "createdAt")
VALUES
  (gen_random_uuid()::text, 'USERS_VIEW', 'Lihat Daftar Pengguna', 'Manajemen Pengguna & Akun', 'Membaca daftar pengguna, filter role, memantau status aktif, dan mencari profil siswa/guru.', NOW()),
  (gen_random_uuid()::text, 'USERS_CREATE', 'Tambah Pengguna Baru', 'Manajemen Pengguna & Akun', 'Mendaftarkan akun siswa atau guru baru ke dalam sistem LMS.', NOW()),
  (gen_random_uuid()::text, 'USERS_UPDATE_NAME', 'Edit Nama Pengguna', 'Manajemen Pengguna & Akun', 'Mengubah nama lengkap dan identitas akun pengguna.', NOW()),
  (gen_random_uuid()::text, 'USERS_UPDATE_ROLE', 'Ubah Role Pengguna', 'Manajemen Pengguna & Akun', 'Mengubah hak peran pengguna antara Superadmin, Guru, dan Murid secara perorangan atau massal.', NOW()),
  (gen_random_uuid()::text, 'USERS_TOGGLE_ACTIVE', 'Aktifkan/Nonaktifkan Pengguna', 'Manajemen Pengguna & Akun', 'Mengubah status akun aktif atau membekukan akun pengguna bermasalah.', NOW()),
  (gen_random_uuid()::text, 'USERS_RESET_PASSWORD', 'Reset Kata Sandi Pengguna', 'Manajemen Pengguna & Akun', 'Mengatur ulang kata sandi pengguna ke password standar institusi secara massal.', NOW()),
  (gen_random_uuid()::text, 'USERS_REVOKE_TOKEN', 'Cabut Sesi Aktif Pengguna', 'Manajemen Pengguna & Akun', 'Memutus paksa sesi login JWT aktif pengguna secara real-time via WebSocket.', NOW()),
  (gen_random_uuid()::text, 'USERS_DELETE', 'Hapus Akun Pengguna', 'Manajemen Pengguna & Akun', 'Menghapus akun pengguna dari database secara permanen atau massal.', NOW()),
  (gen_random_uuid()::text, 'USERS_QUIZ_HISTORY_CLEAR', 'Bersihkan Riwayat Kuis Pengguna', 'Manajemen Pengguna & Akun', 'Menghapus arsip rekam jejak pengerjaan kuis individual pengguna untuk keperluan reset nilai.', NOW()),
  (gen_random_uuid()::text, 'USERS_MANAGE', 'Kelola Pengguna Penuh', 'Manajemen Pengguna & Akun', 'Wewenang komprehensif mengelola profil, kata sandi, status akun, dan sesi login pengguna.', NOW())
ON CONFLICT ("code") DO UPDATE SET
  "name" = EXCLUDED."name",
  "category" = EXCLUDED."category",
  "description" = EXCLUDED."description";

-- 2. KATEGORI: ROMBEL, KELAS & KURIKULUM
INSERT INTO "permission" ("id", "code", "name", "category", "description", "createdAt")
VALUES
  (gen_random_uuid()::text, 'CLASSES_VIEW', 'Lihat Daftar Rombel Kelas', 'Rombel, Kelas & Kurikulum', 'Memantau seluruh rombongan belajar, wali kelas, jumlah murid terdaftar, dan kuota siswa.', NOW()),
  (gen_random_uuid()::text, 'CLASSES_CREATE', 'Buat Rombel Kelas Baru', 'Rombel, Kelas & Kurikulum', 'Menambah rombongan belajar baru dan menghasilkan kode gabung (join code) otomatis.', NOW()),
  (gen_random_uuid()::text, 'CLASSES_UPDATE', 'Ubah Info Rombel Kelas', 'Rombel, Kelas & Kurikulum', 'Mengedit nama kelas, batas kuota siswa, status aktif, dan memperbarui kode gabung kelas.', NOW()),
  (gen_random_uuid()::text, 'CLASSES_DELETE', 'Hapus Rombel Kelas', 'Rombel, Kelas & Kurikulum', 'Menghapus rombongan belajar yang sudah tidak aktif dari sistem.', NOW()),
  (gen_random_uuid()::text, 'CLASSES_KICK_STUDENT', 'Keluarkan Siswa dari Kelas', 'Rombel, Kelas & Kurikulum', 'Mengeluarkan siswa dari keanggotaan rombel kelas tertentu.', NOW()),
  (gen_random_uuid()::text, 'CLASSES_MANAGE', 'Kelola Rombel / Kelas Penuh', 'Rombel, Kelas & Kurikulum', 'Wewenang komprehensif membuat kelas, mengubah kapasitas, dan mengatur kode gabung murid.', NOW()),
  (gen_random_uuid()::text, 'COURSES_VIEW', 'Lihat Mata Pelajaran Kurikulum', 'Rombel, Kelas & Kurikulum', 'Membaca daftar mata pelajaran kurikulum master institusi dan silabusnya.', NOW()),
  (gen_random_uuid()::text, 'COURSES_CREATE', 'Buat Mata Pelajaran Baru', 'Rombel, Kelas & Kurikulum', 'Menambahkan mata pelajaran kurikulum master baru lengkap dengan kode akses dan deskripsi.', NOW()),
  (gen_random_uuid()::text, 'COURSES_UPDATE', 'Ubah Info Mata Pelajaran', 'Rombel, Kelas & Kurikulum', 'Mengedit nama, slug, deskripsi, dan status keaktifan mata pelajaran kurikulum.', NOW()),
  (gen_random_uuid()::text, 'COURSES_DELETE', 'Hapus Mata Pelajaran', 'Rombel, Kelas & Kurikulum', 'Menghapus mata pelajaran kurikulum dari sistem sekolah.', NOW()),
  (gen_random_uuid()::text, 'COURSES_ASSIGN_TEACHER', 'Tugaskan Guru Pengampu', 'Rombel, Kelas & Kurikulum', 'Menugaskan atau mencabut guru pengampu pada mata pelajaran kurikulum.', NOW()),
  (gen_random_uuid()::text, 'COURSES_ASSIGN_CATEGORY', 'Hubungkan Bab Silabus ke Mapel', 'Rombel, Kelas & Kurikulum', 'Menghubungkan atau melepas bab kategori materi pembelajaran dengan mata pelajaran kurikulum.', NOW()),
  (gen_random_uuid()::text, 'COURSES_MANAGE', 'Kelola Mata Pelajaran Penuh', 'Rombel, Kelas & Kurikulum', 'Wewenang komprehensif membuat mapel, penugasan guru pengampu, dan konfigurasi kurikulum.', NOW())
ON CONFLICT ("code") DO UPDATE SET
  "name" = EXCLUDED."name",
  "category" = EXCLUDED."category",
  "description" = EXCLUDED."description";

-- 3. KATEGORI: KONTEN & MODUL PEMBELAJARAN
INSERT INTO "permission" ("id", "code", "name", "category", "description", "createdAt")
VALUES
  (gen_random_uuid()::text, 'MATERI_VIEW', 'Lihat Silabus & Modul Materi', 'Konten & Modul Pembelajaran', 'Membaca daftar bab materi, silabus, dan seluruh halaman modul pembelajaran interaktif.', NOW()),
  (gen_random_uuid()::text, 'MATERI_CATEGORY_CREATE', 'Buat Bab Silabus Baru', 'Konten & Modul Pembelajaran', 'Menambahkan bab materi pembelajaran baru ke dalam kurikulum.', NOW()),
  (gen_random_uuid()::text, 'MATERI_CATEGORY_UPDATE', 'Ubah Bab Silabus', 'Konten & Modul Pembelajaran', 'Mengedit judul, slug deskripsi, dan status aktif bab silabus materi.', NOW()),
  (gen_random_uuid()::text, 'MATERI_CATEGORY_REORDER', 'Atur Urutan Bab Silabus', 'Konten & Modul Pembelajaran', 'Mengubah tata urutan susunan bab pembelajaran dalam kurikulum.', NOW()),
  (gen_random_uuid()::text, 'MATERI_CATEGORY_DELETE', 'Hapus Bab Silabus', 'Konten & Modul Pembelajaran', 'Menghapus bab materi pembelajaran dari silabus.', NOW()),
  (gen_random_uuid()::text, 'MATERI_PAGE_CREATE', 'Tulis Halaman Modul Materi', 'Konten & Modul Pembelajaran', 'Membuat halaman modul materi baru dengan editor konten dan penentuan KKM kelulusan.', NOW()),
  (gen_random_uuid()::text, 'MATERI_PAGE_UPDATE', 'Ubah Halaman Modul Materi', 'Konten & Modul Pembelajaran', 'Mengedit isi konten pembelajaran, status terbit (publish), dan aturan prasyarat halaman.', NOW()),
  (gen_random_uuid()::text, 'MATERI_PAGE_REORDER', 'Atur Urutan Langkah Modul', 'Konten & Modul Pembelajaran', 'Mengubah nomor urut langkah modul pembelajaran pada suatu bab materi.', NOW()),
  (gen_random_uuid()::text, 'MATERI_PAGE_DELETE', 'Hapus Halaman Modul Materi', 'Konten & Modul Pembelajaran', 'Menghapus modul materi pembelajaran beserta data prasyarat keterkaitannya.', NOW()),
  (gen_random_uuid()::text, 'MATERI_MANAGE', 'Kelola Modul & Materi Penuh', 'Konten & Modul Pembelajaran', 'Wewenang komprehensif mengelola seluruh silabus, bab, dan konten materi pembelajaran.', NOW())
ON CONFLICT ("code") DO UPDATE SET
  "name" = EXCLUDED."name",
  "category" = EXCLUDED."category",
  "description" = EXCLUDED."description";

-- 4. KATEGORI: RINGKASAN & ASISTEN AI
INSERT INTO "permission" ("id", "code", "name", "category", "description", "createdAt")
VALUES
  (gen_random_uuid()::text, 'SUMMARIES_VIEW', 'Lihat Intisari & Ringkasan Materi', 'Ringkasan & Asisten AI', 'Membaca daftar intisari dan rangkuman poin-poin materi pembelajaran.', NOW()),
  (gen_random_uuid()::text, 'SUMMARIES_CREATE', 'Tulis Ringkasan Materi', 'Ringkasan & Asisten AI', 'Membuat catatan intisari rangkuman materi pembelajaran secara manual.', NOW()),
  (gen_random_uuid()::text, 'SUMMARIES_UPDATE', 'Ubah Ringkasan Materi', 'Ringkasan & Asisten AI', 'Mengedit isi intisari rangkuman materi pembelajaran.', NOW()),
  (gen_random_uuid()::text, 'SUMMARIES_DELETE', 'Hapus Ringkasan Materi', 'Ringkasan & Asisten AI', 'Menghapus catatan ringkasan materi pembelajaran.', NOW()),
  (gen_random_uuid()::text, 'SUMMARIES_AI_GENERATE', 'Buat Ringkasan Otomatis AI', 'Ringkasan & Asisten AI', 'Menghasilkan rangkuman materi cerdas secara otomatis menggunakan AI prompt builder.', NOW()),
  (gen_random_uuid()::text, 'AI_QUIZ_GENERATE', 'Buat Soal Kuis Otomatis AI', 'Ringkasan & Asisten AI', 'Menghasilkan paket butir soal kuis (MCQ & Essay) secara cerdas menggunakan kecerdasan buatan.', NOW()),
  (gen_random_uuid()::text, 'AI_QUIZ_IMPORT', 'Impor Butir Soal AI', 'Ringkasan & Asisten AI', 'Mengimpor butir-butir soal hasil AI format JSON langsung ke bank soal paket kuis.', NOW()),
  (gen_random_uuid()::text, 'SUMMARIES_MANAGE', 'Kelola Ringkasan & AI Penuh', 'Ringkasan & Asisten AI', 'Wewenang komprehensif menghasilkan ringkasan AI dan mengimpor butir kuis berbantuan AI.', NOW())
ON CONFLICT ("code") DO UPDATE SET
  "name" = EXCLUDED."name",
  "category" = EXCLUDED."category",
  "description" = EXCLUDED."description";

-- 5. KATEGORI: ASESMEN, KUIS & BANK SOAL
INSERT INTO "permission" ("id", "code", "name", "category", "description", "createdAt")
VALUES
  (gen_random_uuid()::text, 'QUIZZES_VIEW', 'Lihat Paket Kuis & Bank Soal', 'Asesmen, Kuis & Bank Soal', 'Membaca daftar paket kuis, variasi ujian, dan butir-butir soal.', NOW()),
  (gen_random_uuid()::text, 'QUIZZES_CREATE', 'Buat Paket Kuis Baru', 'Asesmen, Kuis & Bank Soal', 'Menambah paket kuis baru dengan passing score KKM, durasi pengerjaan, dan jadwal buka/tutup.', NOW()),
  (gen_random_uuid()::text, 'QUIZZES_UPDATE', 'Ubah Paket Kuis', 'Asesmen, Kuis & Bank Soal', 'Mengedit parameter kuis, passing score, batas waktu, dan opsi acak soal (shuffle).', NOW()),
  (gen_random_uuid()::text, 'QUIZZES_DELETE', 'Hapus / Arsipkan Paket Kuis', 'Asesmen, Kuis & Bank Soal', 'Menghapus atau mengarsipkan paket kuis dari bank ujian aktif.', NOW()),
  (gen_random_uuid()::text, 'QUIZZES_VARIANT_MANAGE', 'Kelola Varian Soal Kuis', 'Asesmen, Kuis & Bank Soal', 'Menambah, mengedit nama, mengubah status aktif, dan menghapus varian soal (Varian A/B/C).', NOW()),
  (gen_random_uuid()::text, 'QUIZZES_ANTICHEAT_CONFIG', 'Konfigurasi Proteksi Anti-Cheat', 'Asesmen, Kuis & Bank Soal', 'Mengatur proteksi ujian: kunci fullscreen, larangan ganti tab, dan blokir salin-tempel.', NOW()),
  (gen_random_uuid()::text, 'QUESTIONS_CREATE', 'Tambah Butir Soal', 'Asesmen, Kuis & Bank Soal', 'Menambahkan butir soal baru (Pilihan Ganda, Essay, atau Coding Challenge) ke varian kuis.', NOW()),
  (gen_random_uuid()::text, 'QUESTIONS_UPDATE', 'Ubah Butir Soal', 'Asesmen, Kuis & Bank Soal', 'Mengedit teks pertanyaan, opsi pilihan jawaban, kunci jawaban benar, bobot skor, dan rubrik essay.', NOW()),
  (gen_random_uuid()::text, 'QUESTIONS_REORDER', 'Atur Urutan Butir Soal', 'Asesmen, Kuis & Bank Soal', 'Mengubah urutan nomor butir soal dalam varian kuis.', NOW()),
  (gen_random_uuid()::text, 'QUESTIONS_DELETE', 'Hapus Butir Soal', 'Asesmen, Kuis & Bank Soal', 'Menghapus butir pertanyaan kuis dari bank soal.', NOW()),
  (gen_random_uuid()::text, 'QUIZZES_MANAGE', 'Kelola Paket Kuis Penuh', 'Asesmen, Kuis & Bank Soal', 'Wewenang komprehensif mengelola paket soal, bank butir pertanyaan, dan sistem anti-cheat.', NOW())
ON CONFLICT ("code") DO UPDATE SET
  "name" = EXCLUDED."name",
  "category" = EXCLUDED."category",
  "description" = EXCLUDED."description";

-- 6. KATEGORI: PENILAIAN & BUKU NILAI
INSERT INTO "permission" ("id", "code", "name", "category", "description", "createdAt")
VALUES
  (gen_random_uuid()::text, 'GRADEBOOK_VIEW', 'Akses Buku Nilai Matriks', 'Penilaian & Buku Nilai', 'Melihat rekapitulasi nilai siswa berbasis matriks spreadsheet dengan status ketuntasan KKM.', NOW()),
  (gen_random_uuid()::text, 'GRADEBOOK_EXPORT', 'Ekspor Buku Nilai Excel', 'Penilaian & Buku Nilai', 'Mengunduh dan mengekspor rekap buku nilai ke format file spreadsheet Excel.', NOW()),
  (gen_random_uuid()::text, 'QUIZZES_GRADE', 'Koreksi & Nilai Essay Siswa', 'Penilaian & Buku Nilai', 'Memeriksa jawaban essay, memasukkan skor manual, dan memberi catatan umpan balik instruktur.', NOW())
ON CONFLICT ("code") DO UPDATE SET
  "name" = EXCLUDED."name",
  "category" = EXCLUDED."category",
  "description" = EXCLUDED."description";

-- 7. KATEGORI: MONITORING SISWA & PROYEK
INSERT INTO "permission" ("id", "code", "name", "category", "description", "createdAt")
VALUES
  (gen_random_uuid()::text, 'STUDENT_ACCESS_VIEW', 'Pantau Status Akses Siswa', 'Monitoring Siswa & Proyek', 'Memantau keterbukaan materi belajar siswa (LOCKED, UNLOCKED, COMPLETED).', NOW()),
  (gen_random_uuid()::text, 'STUDENT_ACCESS_UPDATE', 'Buka / Kunci Akses Siswa Manual', 'Monitoring Siswa & Proyek', 'Mengubah status gembok modul materi siswa secara perorangan atau massal.', NOW()),
  (gen_random_uuid()::text, 'STUDENT_ACCESS_BYPASS', 'Bypass Kunci Bab Materi', 'Monitoring Siswa & Proyek', 'Membuka paksa seluruh materi dalam satu bab dan memberikan nilai 100 otomatis.', NOW()),
  (gen_random_uuid()::text, 'STUDENT_ACCESS_MANAGE', 'Kelola Kunci Akses Siswa Penuh', 'Monitoring Siswa & Proyek', 'Wewenang komprehensif membuka/mengunci materi belajar dan membypass kuis murid.', NOW()),
  (gen_random_uuid()::text, 'STUDENT_PROJECTS_VIEW', 'Pantau Proyek Coding Siswa', 'Monitoring Siswa & Proyek', 'Melihat daftar proyek pemrograman murid SMK (Web, PHP-WASM, SQLite, Fullstack).', NOW()),
  (gen_random_uuid()::text, 'STUDENT_PROJECTS_INSPECT', 'Inspeksi Kode & Live Sandbox', 'Monitoring Siswa & Proyek', 'Membuka in-browser IDE untuk menginspeksi file kode, console log, dan hasil eksekusi siswa.', NOW())
ON CONFLICT ("code") DO UPDATE SET
  "name" = EXCLUDED."name",
  "category" = EXCLUDED."category",
  "description" = EXCLUDED."description";

-- 8. KATEGORI: ARSIP, LAPORAN & KEAMANAN SISTEM
INSERT INTO "permission" ("id", "code", "name", "category", "description", "createdAt")
VALUES
  (gen_random_uuid()::text, 'ARCHIVES_VIEW', 'Buka Buku Arsip Kuis', 'Arsip, Laporan & Keamanan Sistem', 'Menelusuri rekaman permanen (audit trail) penyelesaian tugas & kuis siswa.', NOW()),
  (gen_random_uuid()::text, 'ARCHIVES_SYNC', 'Sinkronisasi Data Arsip', 'Arsip, Laporan & Keamanan Sistem', 'Rekonsiliasi data arsip completion record kuis dengan data nilai terkini.', NOW()),
  (gen_random_uuid()::text, 'REPORTS_VIEW', 'Lihat Laporan & Analisis Statistik', 'Arsip, Laporan & Keamanan Sistem', 'Memantau statistik ketuntasan belajar, grafik kelulusan, dan analitik durasi belajar.', NOW()),
  (gen_random_uuid()::text, 'REPORTS_UNFINISHED_VIEW', 'Monitoring Siswa Belum Tuntas', 'Arsip, Laporan & Keamanan Sistem', 'Memantau siswa yang belum membuka materi atau belum menuntaskan ujian.', NOW()),
  (gen_random_uuid()::text, 'REPORTS_EXPORT', 'Ekspor Laporan Analitik', 'Arsip, Laporan & Keamanan Sistem', 'Mengunduh berkas laporan hasil evaluasi belajar siswa.', NOW()),
  (gen_random_uuid()::text, 'PERMISSIONS_VIEW', 'Lihat Matriks Hak Akses', 'Arsip, Laporan & Keamanan Sistem', 'Membuka halaman manajemen permission, katalog wewenang, dan paket preset guru.', NOW()),
  (gen_random_uuid()::text, 'PERMISSIONS_UPDATE', 'Atur Hak Akses Pengguna', 'Arsip, Laporan & Keamanan Sistem', 'Menugaskan paket preset 1-klik atau mengubah izin granular per-pengguna.', NOW()),
  (gen_random_uuid()::text, 'PERMISSIONS_REVOKE_ALL', 'Cabut Seluruh Hak Akses', 'Arsip, Laporan & Keamanan Sistem', 'Mengosongkan hak akses wewenang pengguna tertentu.', NOW()),
  (gen_random_uuid()::text, 'AUDIT_LOGS_VIEW', 'Lihat Linimasa Jejak Audit', 'Arsip, Laporan & Keamanan Sistem', 'Membaca catatan aktivitas operasional dan keamanan sistem seluruh admin/staf.', NOW()),
  (gen_random_uuid()::text, 'AUDIT_LOGS_CLEANUP', 'Pembersihan Log Audit Lama', 'Arsip, Laporan & Keamanan Sistem', 'Menghapus jejak audit usang yang melampaui batas hari retensi.', NOW()),
  (gen_random_uuid()::text, 'SETTINGS_VIEW', 'Lihat Pengaturan Sistem', 'Arsip, Laporan & Keamanan Sistem', 'Membuka halaman preferensi institusi dan keamanan akun.', NOW()),
  (gen_random_uuid()::text, 'SETTINGS_UPDATE', 'Ubah Pengaturan & Kata Sandi', 'Arsip, Laporan & Keamanan Sistem', 'Memperbarui kata sandi profil atau mengubah preferensi institusi SMK Mandiri.', NOW()),
  (gen_random_uuid()::text, 'SETTINGS_MANAGE', 'Kelola Pengaturan Sistem Penuh', 'Arsip, Laporan & Keamanan Sistem', 'Wewenang komprehensif mengubah konfigurasi dan pengaturan institusi SMK Mandiri.', NOW())
ON CONFLICT ("code") DO UPDATE SET
  "name" = EXCLUDED."name",
  "category" = EXCLUDED."category",
  "description" = EXCLUDED."description";

-- 9. TABEL DAN SEED PAKET PRESET PERMISSION
CREATE TABLE IF NOT EXISTS "permissionPackage" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL UNIQUE,
  "category" TEXT NOT NULL DEFAULT 'Umum',
  "badge" TEXT NOT NULL DEFAULT 'Custom',
  "description" TEXT,
  "permissions" TEXT NOT NULL,
  "isSystem" BOOLEAN NOT NULL DEFAULT FALSE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO "permissionPackage" ("id", "name", "category", "badge", "description", "permissions", "isSystem", "updatedAt")
VALUES
  ('guru_standar', 'Paket Guru Standar', 'Pengajaran', 'Guru Reguler', 'Hak akses pengajaran harian: materi, kuis, penilaian, buku nilai, dan monitoring murid.', '["MATERI_MANAGE","MATERI_VIEW","MATERI_PAGE_CREATE","MATERI_PAGE_UPDATE","QUIZZES_MANAGE","QUIZZES_VIEW","QUIZZES_CREATE","QUIZZES_UPDATE","QUESTIONS_CREATE","QUESTIONS_UPDATE","QUIZZES_GRADE","GRADEBOOK_VIEW","STUDENT_ACCESS_MANAGE","STUDENT_ACCESS_VIEW","STUDENT_PROJECTS_VIEW","ARCHIVES_VIEW","REPORTS_VIEW"]', true, NOW()),
  ('koordinator_kurikulum', 'Paket Koordinator Kurikulum', 'Kurikulum', 'Kurikulum & Kajur', 'Hak akses guru standar ditambah wewenang membuat mata pelajaran master dan manajemen kelas.', '["CLASSES_MANAGE","CLASSES_VIEW","CLASSES_CREATE","CLASSES_UPDATE","COURSES_MANAGE","COURSES_VIEW","COURSES_CREATE","COURSES_UPDATE","COURSES_ASSIGN_TEACHER","COURSES_ASSIGN_CATEGORY","MATERI_MANAGE","MATERI_VIEW","MATERI_CATEGORY_CREATE","MATERI_CATEGORY_UPDATE","MATERI_PAGE_CREATE","MATERI_PAGE_UPDATE","QUIZZES_MANAGE","QUIZZES_VIEW","QUIZZES_GRADE","GRADEBOOK_VIEW","STUDENT_ACCESS_MANAGE","STUDENT_PROJECTS_VIEW","SUMMARIES_MANAGE","SUMMARIES_VIEW","SUMMARIES_AI_GENERATE","AI_QUIZ_GENERATE","ARCHIVES_VIEW","REPORTS_VIEW"]', true, NOW()),
  ('asisten_penilai', 'Paket Asisten Penilai / Asesor', 'Asesmen', 'Korektor / Asesor', 'Fokus pada pemeriksaan dan penilaian hasil kuis essay, review kode tantangan, dan buku nilai.', '["QUIZZES_VIEW","QUIZZES_GRADE","STUDENT_PROJECTS_VIEW","STUDENT_PROJECTS_INSPECT","GRADEBOOK_VIEW","GRADEBOOK_EXPORT","ARCHIVES_VIEW"]', true, NOW()),
  ('wali_kelas', 'Paket Wali Kelas', 'Kesiswaan', 'Wali Kelas', 'Monitoring komprehensif perkembangan belajar dan nilai siswa di kelas asuhannya.', '["CLASSES_MANAGE","CLASSES_VIEW","GRADEBOOK_VIEW","GRADEBOOK_EXPORT","STUDENT_ACCESS_MANAGE","STUDENT_ACCESS_VIEW","REPORTS_VIEW","REPORTS_UNFINISHED_VIEW","ARCHIVES_VIEW"]', true, NOW()),
  ('administrator_penuh', 'Paket Administrator Penuh', 'Administrasi', 'Full Access', 'Seluruh hak akses operasional LMS tanpa batasan.', '["USERS_VIEW","USERS_CREATE","USERS_UPDATE_NAME","USERS_UPDATE_ROLE","USERS_TOGGLE_ACTIVE","USERS_RESET_PASSWORD","USERS_REVOKE_TOKEN","USERS_DELETE","USERS_QUIZ_HISTORY_CLEAR","USERS_MANAGE","CLASSES_VIEW","CLASSES_CREATE","CLASSES_UPDATE","CLASSES_DELETE","CLASSES_KICK_STUDENT","CLASSES_MANAGE","COURSES_VIEW","COURSES_CREATE","COURSES_UPDATE","COURSES_DELETE","COURSES_ASSIGN_TEACHER","COURSES_ASSIGN_CATEGORY","COURSES_MANAGE","MATERI_VIEW","MATERI_CATEGORY_CREATE","MATERI_CATEGORY_UPDATE","MATERI_PAGE_CREATE","MATERI_PAGE_UPDATE","MATERI_PAGE_REORDER","MATERI_PAGE_DELETE","MATERI_MANAGE","SUMMARIES_VIEW","SUMMARIES_CREATE","SUMMARIES_UPDATE","SUMMARIES_DELETE","SUMMARIES_AI_GENERATE","AI_QUIZ_GENERATE","AI_QUIZ_IMPORT","SUMMARIES_MANAGE","QUIZZES_VIEW","QUIZZES_CREATE","QUIZZES_UPDATE","QUIZZES_DELETE","QUIZZES_VARIANT_MANAGE","QUIZZES_ANTICHEAT_CONFIG","QUESTIONS_CREATE","QUESTIONS_UPDATE","QUESTIONS_REORDER","QUESTIONS_DELETE","QUIZZES_MANAGE","GRADEBOOK_VIEW","GRADEBOOK_EXPORT","QUIZZES_GRADE","STUDENT_ACCESS_VIEW","STUDENT_ACCESS_UPDATE","STUDENT_ACCESS_BYPASS","STUDENT_ACCESS_MANAGE","STUDENT_PROJECTS_VIEW","STUDENT_PROJECTS_INSPECT","ARCHIVES_VIEW","ARCHIVES_SYNC","REPORTS_VIEW","REPORTS_UNFINISHED_VIEW","REPORTS_EXPORT","PERMISSIONS_VIEW","PERMISSIONS_UPDATE","PERMISSIONS_REVOKE_ALL","AUDIT_LOGS_VIEW","AUDIT_LOGS_CLEANUP","SETTINGS_VIEW","SETTINGS_UPDATE","SETTINGS_MANAGE"]', true, NOW())
ON CONFLICT ("name") DO UPDATE SET
  "category" = EXCLUDED."category",
  "badge" = EXCLUDED."badge",
  "description" = EXCLUDED."description",
  "permissions" = EXCLUDED."permissions",
  "isSystem" = EXCLUDED."isSystem",
  "updatedAt" = NOW();

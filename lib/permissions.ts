// lib/permissions.ts

export type PermissionCode =
  // 1. Manajemen Pengguna & Akun
  | 'USERS_VIEW'
  | 'USERS_CREATE'
  | 'USERS_UPDATE_NAME'
  | 'USERS_UPDATE_ROLE'
  | 'USERS_TOGGLE_ACTIVE'
  | 'USERS_RESET_PASSWORD'
  | 'USERS_REVOKE_TOKEN'
  | 'USERS_DELETE'
  | 'USERS_QUIZ_HISTORY_CLEAR'
  | 'USERS_MANAGE'
  // 2. Rombel, Kelas & Kurikulum
  | 'CLASSES_VIEW'
  | 'CLASSES_CREATE'
  | 'CLASSES_UPDATE'
  | 'CLASSES_DELETE'
  | 'CLASSES_KICK_STUDENT'
  | 'CLASSES_MANAGE'
  | 'COURSES_VIEW'
  | 'COURSES_CREATE'
  | 'COURSES_UPDATE'
  | 'COURSES_DELETE'
  | 'COURSES_ASSIGN_TEACHER'
  | 'COURSES_ASSIGN_CATEGORY'
  | 'COURSES_MANAGE'
  // 3. Konten & Modul Pembelajaran
  | 'MATERI_VIEW'
  | 'MATERI_CATEGORY_CREATE'
  | 'MATERI_CATEGORY_UPDATE'
  | 'MATERI_CATEGORY_REORDER'
  | 'MATERI_CATEGORY_DELETE'
  | 'MATERI_PAGE_CREATE'
  | 'MATERI_PAGE_UPDATE'
  | 'MATERI_PAGE_REORDER'
  | 'MATERI_PAGE_DELETE'
  | 'MATERI_MANAGE'
  // 4. Ringkasan & Asisten AI
  | 'SUMMARIES_VIEW'
  | 'SUMMARIES_CREATE'
  | 'SUMMARIES_UPDATE'
  | 'SUMMARIES_DELETE'
  | 'SUMMARIES_AI_GENERATE'
  | 'AI_QUIZ_GENERATE'
  | 'AI_QUIZ_IMPORT'
  | 'SUMMARIES_MANAGE'
  // 5. Asesmen, Kuis & Bank Soal
  | 'QUIZZES_VIEW'
  | 'QUIZZES_CREATE'
  | 'QUIZZES_UPDATE'
  | 'QUIZZES_DELETE'
  | 'QUIZZES_VARIANT_MANAGE'
  | 'QUIZZES_ANTICHEAT_CONFIG'
  | 'QUESTIONS_CREATE'
  | 'QUESTIONS_UPDATE'
  | 'QUESTIONS_REORDER'
  | 'QUESTIONS_DELETE'
  | 'QUIZZES_MANAGE'
  // 6. Penilaian & Buku Nilai
  | 'GRADEBOOK_VIEW'
  | 'GRADEBOOK_EXPORT'
  | 'QUIZZES_GRADE'
  // 7. Monitoring Siswa & Proyek
  | 'STUDENT_ACCESS_VIEW'
  | 'STUDENT_ACCESS_UPDATE'
  | 'STUDENT_ACCESS_BYPASS'
  | 'STUDENT_ACCESS_MANAGE'
  | 'STUDENT_PROJECTS_VIEW'
  | 'STUDENT_PROJECTS_INSPECT'
  // 8. Arsip, Laporan & Keamanan Sistem
  | 'ARCHIVES_VIEW'
  | 'ARCHIVES_SYNC'
  | 'REPORTS_VIEW'
  | 'REPORTS_UNFINISHED_VIEW'
  | 'REPORTS_EXPORT'
  | 'PERMISSIONS_VIEW'
  | 'PERMISSIONS_UPDATE'
  | 'PERMISSIONS_REVOKE_ALL'
  | 'AUDIT_LOGS_VIEW'
  | 'AUDIT_LOGS_CLEANUP'
  | 'SETTINGS_VIEW'
  | 'SETTINGS_UPDATE'
  | 'SETTINGS_MANAGE';

export interface PermissionDefinition {
  code: PermissionCode;
  name: string;
  category: string;
  description: string;
}

export interface PermissionPackage {
  id: string;
  name: string;
  badge: string;
  description: string;
  permissions: PermissionCode[];
}

export const PERMISSION_CATEGORIES = [
  'Manajemen Pengguna & Akun',
  'Rombel, Kelas & Kurikulum',
  'Konten & Modul Pembelajaran',
  'Ringkasan & Asisten AI',
  'Asesmen, Kuis & Bank Soal',
  'Penilaian & Buku Nilai',
  'Monitoring Siswa & Proyek',
  'Arsip, Laporan & Keamanan Sistem',
] as const;

export type PermissionCategory = (typeof PERMISSION_CATEGORIES)[number];

export const PERMISSION_CATALOG: PermissionDefinition[] = [
  // 1. MANAJEMEN PENGGUNA & AKUN
  {
    code: 'USERS_VIEW',
    name: 'Lihat Daftar Pengguna',
    category: 'Manajemen Pengguna & Akun',
    description: 'Membaca daftar pengguna, filter role, memantau status aktif, dan mencari profil siswa/guru.',
  },
  {
    code: 'USERS_CREATE',
    name: 'Tambah Pengguna Baru',
    category: 'Manajemen Pengguna & Akun',
    description: 'Mendaftarkan akun siswa atau guru baru ke dalam sistem LMS.',
  },
  {
    code: 'USERS_UPDATE_NAME',
    name: 'Edit Nama Pengguna',
    category: 'Manajemen Pengguna & Akun',
    description: 'Mengubah nama lengkap dan identitas akun pengguna.',
  },
  {
    code: 'USERS_UPDATE_ROLE',
    name: 'Ubah Role Pengguna',
    category: 'Manajemen Pengguna & Akun',
    description: 'Mengubah hak peran pengguna antara Superadmin, Guru, dan Murid secara perorangan atau massal.',
  },
  {
    code: 'USERS_TOGGLE_ACTIVE',
    name: 'Aktifkan/Nonaktifkan Pengguna',
    category: 'Manajemen Pengguna & Akun',
    description: 'Mengubah status akun aktif atau membekukan akun pengguna bermasalah.',
  },
  {
    code: 'USERS_RESET_PASSWORD',
    name: 'Reset Kata Sandi Pengguna',
    category: 'Manajemen Pengguna & Akun',
    description: 'Mengatur ulang kata sandi pengguna ke password standar institusi secara massal.',
  },
  {
    code: 'USERS_REVOKE_TOKEN',
    name: 'Cabut Sesi Aktif Pengguna',
    category: 'Manajemen Pengguna & Akun',
    description: 'Memutus paksa sesi login JWT aktif pengguna secara real-time via WebSocket.',
  },
  {
    code: 'USERS_DELETE',
    name: 'Hapus Akun Pengguna',
    category: 'Manajemen Pengguna & Akun',
    description: 'Menghapus akun pengguna dari database secara permanen atau massal.',
  },
  {
    code: 'USERS_QUIZ_HISTORY_CLEAR',
    name: 'Bersihkan Riwayat Kuis Pengguna',
    category: 'Manajemen Pengguna & Akun',
    description: 'Menghapus arsip rekam jejak pengerjaan kuis individual pengguna untuk keperluan reset nilai.',
  },
  {
    code: 'USERS_MANAGE',
    name: 'Kelola Pengguna Penuh',
    category: 'Manajemen Pengguna & Akun',
    description: 'Wewenang komprehensif mengelola profil, kata sandi, status akun, dan sesi login pengguna.',
  },

  // 2. ROMBEL, KELAS & KURIKULUM
  {
    code: 'CLASSES_VIEW',
    name: 'Lihat Daftar Rombel Kelas',
    category: 'Rombel, Kelas & Kurikulum',
    description: 'Memantau seluruh rombongan belajar, wali kelas, jumlah murid terdaftar, dan kuota siswa.',
  },
  {
    code: 'CLASSES_CREATE',
    name: 'Buat Rombel Kelas Baru',
    category: 'Rombel, Kelas & Kurikulum',
    description: 'Menambah rombongan belajar baru dan menghasilkan kode gabung (join code) otomatis.',
  },
  {
    code: 'CLASSES_UPDATE',
    name: 'Ubah Info Rombel Kelas',
    category: 'Rombel, Kelas & Kurikulum',
    description: 'Mengedit nama kelas, batas kuota siswa, status aktif, dan memperbarui kode gabung kelas.',
  },
  {
    code: 'CLASSES_DELETE',
    name: 'Hapus Rombel Kelas',
    category: 'Rombel, Kelas & Kurikulum',
    description: 'Menghapus rombongan belajar yang sudah tidak aktif dari sistem.',
  },
  {
    code: 'CLASSES_KICK_STUDENT',
    name: 'Keluarkan Siswa dari Kelas',
    category: 'Rombel, Kelas & Kurikulum',
    description: 'Mengeluarkan siswa dari keanggotaan rombel kelas tertentu.',
  },
  {
    code: 'CLASSES_MANAGE',
    name: 'Kelola Rombel / Kelas Penuh',
    category: 'Rombel, Kelas & Kurikulum',
    description: 'Wewenang komprehensif membuat kelas, mengubah kapasitas, dan mengatur kode gabung murid.',
  },
  {
    code: 'COURSES_VIEW',
    name: 'Lihat Mata Pelajaran Kurikulum',
    category: 'Rombel, Kelas & Kurikulum',
    description: 'Membaca daftar mata pelajaran kurikulum master institusi dan silabusnya.',
  },
  {
    code: 'COURSES_CREATE',
    name: 'Buat Mata Pelajaran Baru',
    category: 'Rombel, Kelas & Kurikulum',
    description: 'Menambahkan mata pelajaran kurikulum master baru lengkap dengan kode akses dan deskripsi.',
  },
  {
    code: 'COURSES_UPDATE',
    name: 'Ubah Info Mata Pelajaran',
    category: 'Rombel, Kelas & Kurikulum',
    description: 'Mengedit nama, slug, deskripsi, dan status keaktifan mata pelajaran kurikulum.',
  },
  {
    code: 'COURSES_DELETE',
    name: 'Hapus Mata Pelajaran',
    category: 'Rombel, Kelas & Kurikulum',
    description: 'Menghapus mata pelajaran kurikulum dari sistem sekolah.',
  },
  {
    code: 'COURSES_ASSIGN_TEACHER',
    name: 'Tugaskan Guru Pengampu',
    category: 'Rombel, Kelas & Kurikulum',
    description: 'Menugaskan atau mencabut guru pengampu pada mata pelajaran kurikulum.',
  },
  {
    code: 'COURSES_ASSIGN_CATEGORY',
    name: 'Hubungkan Bab Silabus ke Mapel',
    category: 'Rombel, Kelas & Kurikulum',
    description: 'Menghubungkan atau melepas bab kategori materi pembelajaran dengan mata pelajaran kurikulum.',
  },
  {
    code: 'COURSES_MANAGE',
    name: 'Kelola Mata Pelajaran Penuh',
    category: 'Rombel, Kelas & Kurikulum',
    description: 'Wewenang komprehensif membuat mapel, penugasan guru pengampu, dan konfigurasi kurikulum.',
  },

  // 3. KONTEN & MODUL PEMBELAJARAN
  {
    code: 'MATERI_VIEW',
    name: 'Lihat Silabus & Modul Materi',
    category: 'Konten & Modul Pembelajaran',
    description: 'Membaca daftar bab materi, silabus, dan seluruh halaman modul pembelajaran interaktif.',
  },
  {
    code: 'MATERI_CATEGORY_CREATE',
    name: 'Buat Bab Silabus Baru',
    category: 'Konten & Modul Pembelajaran',
    description: 'Menambahkan bab materi pembelajaran baru ke dalam kurikulum.',
  },
  {
    code: 'MATERI_CATEGORY_UPDATE',
    name: 'Ubah Bab Silabus',
    category: 'Konten & Modul Pembelajaran',
    description: 'Mengedit judul, slug deskripsi, dan status aktif bab silabus materi.',
  },
  {
    code: 'MATERI_CATEGORY_REORDER',
    name: 'Atur Urutan Bab Silabus',
    category: 'Konten & Modul Pembelajaran',
    description: 'Mengubah tata urutan susunan bab pembelajaran dalam kurikulum.',
  },
  {
    code: 'MATERI_CATEGORY_DELETE',
    name: 'Hapus Bab Silabus',
    category: 'Konten & Modul Pembelajaran',
    description: 'Menghapus bab materi pembelajaran dari silabus.',
  },
  {
    code: 'MATERI_PAGE_CREATE',
    name: 'Tulis Halaman Modul Materi',
    category: 'Konten & Modul Pembelajaran',
    description: 'Membuat halaman modul materi baru dengan editor konten dan penentuan KKM kelulusan.',
  },
  {
    code: 'MATERI_PAGE_UPDATE',
    name: 'Ubah Halaman Modul Materi',
    category: 'Konten & Modul Pembelajaran',
    description: 'Mengedit isi konten pembelajaran, status terbit (publish), dan aturan prasyarat halaman.',
  },
  {
    code: 'MATERI_PAGE_REORDER',
    name: 'Atur Urutan Langkah Modul',
    category: 'Konten & Modul Pembelajaran',
    description: 'Mengubah nomor urut langkah modul pembelajaran pada suatu bab materi.',
  },
  {
    code: 'MATERI_PAGE_DELETE',
    name: 'Hapus Halaman Modul Materi',
    category: 'Konten & Modul Pembelajaran',
    description: 'Menghapus modul materi pembelajaran beserta data prasyarat keterkaitannya.',
  },
  {
    code: 'MATERI_MANAGE',
    name: 'Kelola Modul & Materi Penuh',
    category: 'Konten & Modul Pembelajaran',
    description: 'Wewenang komprehensif mengelola seluruh silabus, bab, dan konten materi pembelajaran.',
  },

  // 4. RINGKASAN & ASISTEN AI
  {
    code: 'SUMMARIES_VIEW',
    name: 'Lihat Intisari & Ringkasan Materi',
    category: 'Ringkasan & Asisten AI',
    description: 'Membaca daftar intisari dan rangkuman poin-poin materi pembelajaran.',
  },
  {
    code: 'SUMMARIES_CREATE',
    name: 'Tulis Ringkasan Materi',
    category: 'Ringkasan & Asisten AI',
    description: 'Membuat catatan intisari rangkuman materi pembelajaran secara manual.',
  },
  {
    code: 'SUMMARIES_UPDATE',
    name: 'Ubah Ringkasan Materi',
    category: 'Ringkasan & Asisten AI',
    description: 'Mengedit isi intisari rangkuman materi pembelajaran.',
  },
  {
    code: 'SUMMARIES_DELETE',
    name: 'Hapus Ringkasan Materi',
    category: 'Ringkasan & Asisten AI',
    description: 'Menghapus catatan ringkasan materi pembelajaran.',
  },
  {
    code: 'SUMMARIES_AI_GENERATE',
    name: 'Buat Ringkasan Otomatis AI',
    category: 'Ringkasan & Asisten AI',
    description: 'Menghasilkan rangkuman materi cerdas secara otomatis menggunakan AI prompt builder.',
  },
  {
    code: 'AI_QUIZ_GENERATE',
    name: 'Buat Soal Kuis Otomatis AI',
    category: 'Ringkasan & Asisten AI',
    description: 'Menghasilkan paket butir soal kuis (MCQ & Essay) secara cerdas menggunakan kecerdasan buatan.',
  },
  {
    code: 'AI_QUIZ_IMPORT',
    name: 'Impor Butir Soal AI',
    category: 'Ringkasan & Asisten AI',
    description: 'Mengimpor butir-butir soal hasil AI format JSON langsung ke bank soal paket kuis.',
  },
  {
    code: 'SUMMARIES_MANAGE',
    name: 'Kelola Ringkasan & AI Penuh',
    category: 'Ringkasan & Asisten AI',
    description: 'Wewenang komprehensif menghasilkan ringkasan AI dan mengimpor butir kuis berbantuan AI.',
  },

  // 5. ASESMEN, KUIS & BANK SOAL
  {
    code: 'QUIZZES_VIEW',
    name: 'Lihat Paket Kuis & Bank Soal',
    category: 'Asesmen, Kuis & Bank Soal',
    description: 'Membaca daftar paket kuis, variasi ujian, dan butir-butir soal.',
  },
  {
    code: 'QUIZZES_CREATE',
    name: 'Buat Paket Kuis Baru',
    category: 'Asesmen, Kuis & Bank Soal',
    description: 'Menambah paket kuis baru dengan passing score KKM, durasi pengerjaan, dan jadwal buka/tutup.',
  },
  {
    code: 'QUIZZES_UPDATE',
    name: 'Ubah Paket Kuis',
    category: 'Asesmen, Kuis & Bank Soal',
    description: 'Mengedit parameter kuis, passing score, batas waktu, dan opsi acak soal (shuffle).',
  },
  {
    code: 'QUIZZES_DELETE',
    name: 'Hapus / Arsipkan Paket Kuis',
    category: 'Asesmen, Kuis & Bank Soal',
    description: 'Menghapus atau mengarsipkan paket kuis dari bank ujian aktif.',
  },
  {
    code: 'QUIZZES_VARIANT_MANAGE',
    name: 'Kelola Varian Soal Kuis',
    category: 'Asesmen, Kuis & Bank Soal',
    description: 'Menambah, mengedit nama, mengubah status aktif, dan menghapus varian soal (Varian A/B/C).',
  },
  {
    code: 'QUIZZES_ANTICHEAT_CONFIG',
    name: 'Konfigurasi Proteksi Anti-Cheat',
    category: 'Asesmen, Kuis & Bank Soal',
    description: 'Mengatur proteksi ujian: kunci fullscreen, larangan ganti tab, dan blokir salin-tempel.',
  },
  {
    code: 'QUESTIONS_CREATE',
    name: 'Tambah Butir Soal',
    category: 'Asesmen, Kuis & Bank Soal',
    description: 'Menambahkan butir soal baru (Pilihan Ganda, Essay, atau Coding Challenge) ke varian kuis.',
  },
  {
    code: 'QUESTIONS_UPDATE',
    name: 'Ubah Butir Soal',
    category: 'Asesmen, Kuis & Bank Soal',
    description: 'Mengedit teks pertanyaan, opsi pilihan jawaban, kunci jawaban benar, bobot skor, dan rubrik essay.',
  },
  {
    code: 'QUESTIONS_REORDER',
    name: 'Atur Urutan Butir Soal',
    category: 'Asesmen, Kuis & Bank Soal',
    description: 'Mengubah urutan nomor butir soal dalam varian kuis.',
  },
  {
    code: 'QUESTIONS_DELETE',
    name: 'Hapus Butir Soal',
    category: 'Asesmen, Kuis & Bank Soal',
    description: 'Menghapus butir pertanyaan kuis dari bank soal.',
  },
  {
    code: 'QUIZZES_MANAGE',
    name: 'Kelola Paket Kuis Penuh',
    category: 'Asesmen, Kuis & Bank Soal',
    description: 'Wewenang komprehensif mengelola paket soal, bank butir pertanyaan, dan sistem anti-cheat.',
  },

  // 6. PENILAIAN & BUKU NILAI
  {
    code: 'GRADEBOOK_VIEW',
    name: 'Akses Buku Nilai Matriks',
    category: 'Penilaian & Buku Nilai',
    description: 'Melihat rekapitulasi nilai siswa berbasis matriks spreadsheet dengan status ketuntasan KKM.',
  },
  {
    code: 'GRADEBOOK_EXPORT',
    name: 'Ekspor Buku Nilai Excel',
    category: 'Penilaian & Buku Nilai',
    description: 'Mengunduh dan mengekspor rekap buku nilai ke format file spreadsheet Excel.',
  },
  {
    code: 'QUIZZES_GRADE',
    name: 'Koreksi & Nilai Essay Siswa',
    category: 'Penilaian & Buku Nilai',
    description: 'Memeriksa jawaban essay, memasukkan skor manual, dan memberi catatan umpan balik instruktur.',
  },

  // 7. MONITORING SISWA & PROYEK
  {
    code: 'STUDENT_ACCESS_VIEW',
    name: 'Pantau Status Akses Siswa',
    category: 'Monitoring Siswa & Proyek',
    description: 'Memantau keterbukaan materi belajar siswa (LOCKED, UNLOCKED, COMPLETED).',
  },
  {
    code: 'STUDENT_ACCESS_UPDATE',
    name: 'Buka / Kunci Akses Siswa Manual',
    category: 'Monitoring Siswa & Proyek',
    description: 'Mengubah status gembok modul materi siswa secara perorangan atau massal.',
  },
  {
    code: 'STUDENT_ACCESS_BYPASS',
    name: 'Bypass Kunci Bab Materi',
    category: 'Monitoring Siswa & Proyek',
    description: 'Membuka paksa seluruh materi dalam satu bab dan memberikan nilai 100 otomatis.',
  },
  {
    code: 'STUDENT_ACCESS_MANAGE',
    name: 'Kelola Kunci Akses Siswa Penuh',
    category: 'Monitoring Siswa & Proyek',
    description: 'Wewenang komprehensif membuka/mengunci materi belajar dan membypass kuis murid.',
  },
  {
    code: 'STUDENT_PROJECTS_VIEW',
    name: 'Pantau Proyek Coding Siswa',
    category: 'Monitoring Siswa & Proyek',
    description: 'Melihat daftar proyek pemrograman murid SMK (Web, PHP-WASM, SQLite, Fullstack).',
  },
  {
    code: 'STUDENT_PROJECTS_INSPECT',
    name: 'Inspeksi Kode & Live Sandbox',
    category: 'Monitoring Siswa & Proyek',
    description: 'Membuka in-browser IDE untuk menginspeksi file kode, console log, dan hasil eksekusi siswa.',
  },

  // 8. ARSIP, LAPORAN & KEAMANAN SISTEM
  {
    code: 'ARCHIVES_VIEW',
    name: 'Buka Buku Arsip Kuis',
    category: 'Arsip, Laporan & Keamanan Sistem',
    description: 'Menelusuri rekaman permanen (audit trail) penyelesaian tugas & kuis siswa.',
  },
  {
    code: 'ARCHIVES_SYNC',
    name: 'Sinkronisasi Data Arsip',
    category: 'Arsip, Laporan & Keamanan Sistem',
    description: 'Rekonsiliasi data arsip completion record kuis dengan data nilai terkini.',
  },
  {
    code: 'REPORTS_VIEW',
    name: 'Lihat Laporan & Analisis Statistik',
    category: 'Arsip, Laporan & Keamanan Sistem',
    description: 'Memantau statistik ketuntasan belajar, grafik kelulusan, dan analitik durasi belajar.',
  },
  {
    code: 'REPORTS_UNFINISHED_VIEW',
    name: 'Monitoring Siswa Belum Tuntas',
    category: 'Arsip, Laporan & Keamanan Sistem',
    description: 'Memantau siswa yang belum membuka materi atau belum menuntaskan ujian.',
  },
  {
    code: 'REPORTS_EXPORT',
    name: 'Ekspor Laporan Analitik',
    category: 'Arsip, Laporan & Keamanan Sistem',
    description: 'Mengunduh berkas laporan hasil evaluasi belajar siswa.',
  },
  {
    code: 'PERMISSIONS_VIEW',
    name: 'Lihat Matriks Hak Akses',
    category: 'Arsip, Laporan & Keamanan Sistem',
    description: 'Membuka halaman manajemen permission, katalog wewenang, dan paket preset guru.',
  },
  {
    code: 'PERMISSIONS_UPDATE',
    name: 'Atur Hak Akses Pengguna',
    category: 'Arsip, Laporan & Keamanan Sistem',
    description: 'Menugaskan paket preset 1-klik atau mengubah izin granular per-pengguna.',
  },
  {
    code: 'PERMISSIONS_REVOKE_ALL',
    name: 'Cabut Seluruh Hak Akses',
    category: 'Arsip, Laporan & Keamanan Sistem',
    description: 'Mengosongkan hak akses wewenang pengguna tertentu.',
  },
  {
    code: 'AUDIT_LOGS_VIEW',
    name: 'Lihat Linimasa Jejak Audit',
    category: 'Arsip, Laporan & Keamanan Sistem',
    description: 'Membaca catatan aktivitas operasional dan keamanan sistem seluruh admin/staf.',
  },
  {
    code: 'AUDIT_LOGS_CLEANUP',
    name: 'Pembersihan Log Audit Lama',
    category: 'Arsip, Laporan & Keamanan Sistem',
    description: 'Menghapus jejak audit usang yang melampaui batas hari retensi.',
  },
  {
    code: 'SETTINGS_VIEW',
    name: 'Lihat Pengaturan Sistem',
    category: 'Arsip, Laporan & Keamanan Sistem',
    description: 'Membuka halaman preferensi institusi dan keamanan akun.',
  },
  {
    code: 'SETTINGS_UPDATE',
    name: 'Ubah Pengaturan & Kata Sandi',
    category: 'Arsip, Laporan & Keamanan Sistem',
    description: 'Memperbarui kata sandi profil atau mengubah preferensi institusi SMK Mandiri.',
  },
  {
    code: 'SETTINGS_MANAGE',
    name: 'Kelola Pengaturan Sistem Penuh',
    category: 'Arsip, Laporan & Keamanan Sistem',
    description: 'Wewenang komprehensif mengubah konfigurasi dan pengaturan institusi SMK Mandiri.',
  },
];

export const ALL_PERMISSION_CODES: PermissionCode[] = PERMISSION_CATALOG.map((p) => p.code);

/**
 * Paket Presets Permission untuk memudahkan penugasan cepat (1-klik).
 */
export const PERMISSION_PACKAGES: PermissionPackage[] = [
  {
    id: 'guru_standar',
    name: 'Paket Guru Standar',
    badge: 'Guru Reguler',
    description: 'Hak akses pengajaran harian: materi, kuis, penilaian, buku nilai, dan monitoring murid.',
    permissions: [
      'MATERI_MANAGE',
      'MATERI_VIEW',
      'MATERI_PAGE_CREATE',
      'MATERI_PAGE_UPDATE',
      'QUIZZES_MANAGE',
      'QUIZZES_VIEW',
      'QUIZZES_CREATE',
      'QUIZZES_UPDATE',
      'QUESTIONS_CREATE',
      'QUESTIONS_UPDATE',
      'QUIZZES_GRADE',
      'GRADEBOOK_VIEW',
      'STUDENT_ACCESS_MANAGE',
      'STUDENT_ACCESS_VIEW',
      'STUDENT_PROJECTS_VIEW',
      'ARCHIVES_VIEW',
      'REPORTS_VIEW',
    ],
  },
  {
    id: 'koordinator_kurikulum',
    name: 'Paket Koordinator Kurikulum',
    badge: 'Kurikulum & Kajur',
    description: 'Hak akses guru standar ditambah wewenang membuat mata pelajaran master dan manajemen kelas.',
    permissions: [
      'CLASSES_MANAGE',
      'CLASSES_VIEW',
      'CLASSES_CREATE',
      'CLASSES_UPDATE',
      'COURSES_MANAGE',
      'COURSES_VIEW',
      'COURSES_CREATE',
      'COURSES_UPDATE',
      'COURSES_ASSIGN_TEACHER',
      'COURSES_ASSIGN_CATEGORY',
      'MATERI_MANAGE',
      'MATERI_VIEW',
      'MATERI_CATEGORY_CREATE',
      'MATERI_CATEGORY_UPDATE',
      'MATERI_PAGE_CREATE',
      'MATERI_PAGE_UPDATE',
      'QUIZZES_MANAGE',
      'QUIZZES_VIEW',
      'QUIZZES_GRADE',
      'GRADEBOOK_VIEW',
      'STUDENT_ACCESS_MANAGE',
      'STUDENT_PROJECTS_VIEW',
      'SUMMARIES_MANAGE',
      'SUMMARIES_VIEW',
      'SUMMARIES_AI_GENERATE',
      'AI_QUIZ_GENERATE',
      'ARCHIVES_VIEW',
      'REPORTS_VIEW',
    ],
  },
  {
    id: 'asisten_penilai',
    name: 'Paket Asisten Penilai / Asesor',
    badge: 'Korektor / Asesor',
    description: 'Fokus pada pemeriksaan dan penilaian hasil kuis essay, review kode tantangan, dan buku nilai.',
    permissions: [
      'QUIZZES_VIEW',
      'QUIZZES_GRADE',
      'STUDENT_PROJECTS_VIEW',
      'STUDENT_PROJECTS_INSPECT',
      'GRADEBOOK_VIEW',
      'GRADEBOOK_EXPORT',
      'ARCHIVES_VIEW',
    ],
  },
  {
    id: 'wali_kelas',
    name: 'Paket Wali Kelas',
    badge: 'Wali Kelas',
    description: 'Monitoring komprehensif perkembangan belajar dan nilai siswa di kelas asuhannya.',
    permissions: [
      'CLASSES_MANAGE',
      'CLASSES_VIEW',
      'GRADEBOOK_VIEW',
      'GRADEBOOK_EXPORT',
      'STUDENT_ACCESS_MANAGE',
      'STUDENT_ACCESS_VIEW',
      'REPORTS_VIEW',
      'REPORTS_UNFINISHED_VIEW',
      'ARCHIVES_VIEW',
    ],
  },
  {
    id: 'administrator_penuh',
    name: 'Paket Administrator Penuh',
    badge: 'Full Access',
    description: 'Seluruh hak akses operasional LMS tanpa batasan.',
    permissions: [...ALL_PERMISSION_CODES],
  },
];

/**
 * Cek apakah user atau session memiliki permission tertentu.
 * SUPERADMIN selalu memiliki semua permission (Wildcard '*').
 */
export function hasPermission(
  userOrSession: { role?: string; permissions?: string[] } | null | undefined,
  permission: PermissionCode | string
): boolean {
  if (!userOrSession) return false;
  if (userOrSession.role === 'SUPERADMIN') return true;
  if (userOrSession.role === 'MURID') return false;
  if (!userOrSession.permissions || !Array.isArray(userOrSession.permissions)) return false;
  return userOrSession.permissions.includes(permission);
}

/**
 * Cek apakah user atau session memiliki setidaknya satu dari daftar permission.
 */
export function hasAnyPermission(
  userOrSession: { role?: string; permissions?: string[] } | null | undefined,
  permissions: (PermissionCode | string)[]
): boolean {
  if (!userOrSession) return false;
  if (userOrSession.role === 'SUPERADMIN') return true;
  if (userOrSession.role === 'MURID') return false;
  if (!permissions || permissions.length === 0) return false;
  if (!userOrSession.permissions || !Array.isArray(userOrSession.permissions)) return false;
  return permissions.some((p) => userOrSession.permissions!.includes(p));
}

/**
 * Cek apakah user atau session memiliki seluruh permission yang diminta.
 */
export function hasAllPermissions(
  userOrSession: { role?: string; permissions?: string[] } | null | undefined,
  permissions: (PermissionCode | string)[]
): boolean {
  if (!userOrSession) return false;
  if (userOrSession.role === 'SUPERADMIN') return true;
  if (userOrSession.role === 'MURID') return false;
  if (!permissions || permissions.length === 0) return false;
  if (!userOrSession.permissions || !Array.isArray(userOrSession.permissions)) return false;
  return permissions.every((p) => userOrSession.permissions!.includes(p));
}

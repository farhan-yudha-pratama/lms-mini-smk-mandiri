# 📄 Product Requirements Document (PRD) — WebPoint LMS
# Version: 1.0.0
# Feature: Pengayaan Assessment (Kuis/Tugas), Code Challenge, & Rekapitulasi Nilai

> **Status**: `DRAFT` | **Tanggal Dibuat**: 2026-10-07 | **Author**: WebPoint Team
> **Dokumen ini adalah addendum dan revisi** dari spesifikasi sebelumnya. Baca [`PRD.md`](./PRD.md) sebagai dokumen dasar sebelum membaca dokumen ini.

---

## 1. Executive Summary

Sistem LMS akan diperbarui secara arsitektural terkait manajemen **Kuis dan Tugas (Assessment)**. Jika sebelumnya Kuis hanya melekat kaku pada halaman materi (Page), kini ekosistem `QuizPackage` akan diekspansi menjadi modul Assessment yang lebih fleksibel.

Perubahan utama meliputi:
1. **Fleksibilitas Relasi**: Paket Kuis/Tugas **wajib terikat pada Mata Pelajaran (Course)**, dan **opsional terikat pada Materi (Page)**. Ini memungkinkan pembuatan Ujian Tengah Semester (UTS), Tugas Mandiri, maupun Kuis Akhir Modul.
2. **Variasi Soal Baru**: Ekosistem Kuis akan mendukung soal **Pilihan Ganda**, **Essay**, dan ke depannya **Code Challenge** (Interactive Sandbox).
3. **Pembaruan Dashboard Murid**: Murid dapat melihat daftar kuis/tugas yang sedang terbuka, yang masih terkunci (berdasarkan waktu atau progres), serta tugas yang sengaja disembunyikan.
4. **Pembaruan Dashboard Admin/Guru**: CMS manajemen Kuis/Tugas, serta fitur **Rekap Nilai (Gradebook)** untuk memantau performa murid secara komprehensif.

---

## 2. Latar Belakang & Motivasi

Sistem e-learning teknikal memerlukan metode asesmen yang beragam. Kelemahan sistem sebelumnya:
- **Terkunci ke Materi**: Kuis hanya bisa eksis di dalam `Page`. Guru tidak bisa membuat tugas mandiri level *Course*.
- **Tipe Soal Terbatas**: Hanya mendukung Pilihan Ganda. Keahlian coding (HTML/CSS/JS/SQL/PHP) tidak bisa diuji secara praktik.
- **Minimnya Visibilitas**: Guru tidak memiliki halaman "Rekap Nilai" tersentralisasi untuk melihat keseluruhan nilai dari semua kuis/tugas yang dikerjakan murid.

---

## 3. Cakupan Fitur (Scope)

### 3.1. Fitur yang TERMASUK dalam v1.0.0
- ✅ Perluasan Schema DB untuk `QuizPackage` (relasi Course & Page opsional, visibility settings).
- ✅ Penambahan tipe soal **Essay** (dengan fitur Manual Grading oleh Guru).
- ✅ Pembaruan halaman **Progress Belajar & Dashboard Murid** untuk menampilkan Kuis Terbuka, Terkunci (Logo Kunci), dan Hidden.
- ✅ CMS Guru: Manajemen **Pembuatan Kuis/Tugas** di tingkat Course maupun Page.
- ✅ CMS Guru: Halaman **Rekap Nilai Siswa** (Gradebook).
- 🔄 **Code Challenge Sandbox** (Direncanakan sebagai iterasi lanjutan di dalam struktur varian soal baru).

### 3.2. Fitur yang TIDAK TERMASUK dalam v1.0.0 (Backlog)
- ❌ AI Auto-Grading untuk Essay
- ❌ Leaderboard / Gamifikasi

---

## 4. Desain Produk: Dashboard Murid

Murid akan mengakses Kuis/Tugas melalui halaman Dashboard & Progress Belajar.

### 4.1. Visualisasi Kuis/Tugas
Kuis dan Tugas yang berada di dalam Mata Pelajaran akan diklasifikasikan ke dalam 3 status visibilitas utama di layar murid:
1. **Terbuka (Available)**: Kuis dapat langsung diklik dan dikerjakan.
2. **Terkunci (Locked)**: Kuis ditampilkan tetapi tidak bisa diakses (ditandai dengan **Logo Kunci 🔒**). Ini terjadi jika:
   - Waktu buka (`openAt`) belum tiba.
   - Prasyarat materi belum diselesaikan.
3. **Disembunyikan (Hidden)**: Kuis tidak ditampilkan sama sekali di dashboard murid (diatur secara eksplisit oleh guru).

---

## 5. Desain Produk: Dashboard Admin / Guru

### 5.1. Manajemen Kuis & Tugas (CMS)
- Guru dapat membuat `QuizPackage`.
- Mewajibkan pemilihan **Mata Pelajaran (Course)**.
- Opsional memilih **Materi (Page)** jika ini adalah kuis akhir materi.
- Pengaturan waktu pengerjaan (Timer), `openAt`, `closeAt`, dan `isHidden`.
- Membuat variasi soal (Multiple Choice, Essay).

### 5.2. Rekap Nilai Siswa (Gradebook)
- Tampilan tabel (Spreadsheet-like) di Dashboard Admin.
- Kolom: Daftar Nama Murid, Baris: Daftar Kuis/Tugas dalam satu Mata Pelajaran.
- Sel tabel menampilkan nilai kuis.
- Guru dapat mengklik sel untuk melihat detail pengerjaan murid atau memberikan penilaian manual pada soal tipe **Essay**.

---

## 6. Spesifikasi Database (Pembaruan Schema)

Kita tidak membuat tabel `Assignment` baru, melainkan melakukan *upgrade* pada ekosistem `QuizPackage` yang sudah ada agar terintegrasi lebih natural dengan arsitektur LMS.

### 6.1. Perubahan Entitas Utama (DBML)

```dbml
// Mengganti QuestionType lama dengan yang lebih kaya
Enum QuestionType {
  PILIHAN_GANDA
  ESSAY
  CODE_CHALLENGE  // Untuk fase selanjutnya
}

Table QuizPackage {
  id               String   [pk]
  courseId         String   [note: 'FK -> Course (WAJIB)']
  pageId           String   [null, note: 'FK -> Page (OPSIONAL). Ubah dari @unique menjadi relasi biasa/opsional']
  title            String
  description      String   [null]
  passingScore     Float    [default: 70.0]
  timeLimit        Int      [null, note: 'Batas menit pengerjaan']
  shuffleQuestions Boolean  [default: false]
  isActive         Boolean  [default: true]
  
  // Fitur Visibility & Waktu baru
  isHidden         Boolean  [default: false, note: 'Jika true, tidak muncul sama sekali di murid']
  openAt           DateTime [null, note: 'Bisa dikerjakan mulai kapan. Jika belum waktunya = Terkunci (Logo Kunci)']
  closeAt          DateTime [null, note: 'Deadline (Batas akhir pengerjaan)']
}

// Table Question akan menampung properti tambahan
Table Question {
  id               String   [pk]
  quizVariantId    String
  questionType     QuestionType
  questionText     String
  points           Float
  orderIndex       Int
  
  // Khusus Code Challenge (Nullable)
  codeLanguage     String   [null, note: 'html, css, js, sql']
  codeBoilerplate  String   [null]
  testCasesJson    String   [null]
}

// Tabel StudentAnswer dimodifikasi untuk menampung tipe essay/code
Table StudentAnswer {
  id               String   [pk]
  quizAttemptId    String
  questionId       String
  selectedOptionId String   [null, note: 'Pilihan Ganda']
  
  // Jawaban tipe lain
  essayAnswer      String   [null, note: 'Teks jawaban essay/kode']
  essayFeedback    String   [null, note: 'Komentar/nilai manual dari Guru']
  
  isCorrect        Boolean  [null]
  pointsEarned     Float    [default: 0]
}
```

---

## 7. Rencana Implementasi (Fase Pengerjaan)

### Fase 8: Student Dashboard & Progress (✅ SELESAI di v0.5.x)
1. Perbarui route `app/page.tsx` sebagai RSC utama untuk murid. (Selesai)
2. Buat Server Action `getStudentDetailedProgress` di `app/actions/student-progress.ts`. (Selesai)
3. Implementasi halaman Progress Belajar (`/student/progress`) yang memuat daftar materi terkunci dan status kuis. (Selesai)
4. Styling menggunakan panduan **Neo Brutalism**. (Selesai)

### Fase 9: Refactor Ekosistem QuizPackage (Backend & CMS)
1. Perbarui `contract.prisma` (tambah `courseId` ke `QuizPackage`, jadikan `pageId` opsional, hapus unique pada `pageId`, tambah `isHidden`, `openAt`, `closeAt`, `QuestionType.ESSAY`, `QuestionType.CODE_CHALLENGE`).
2. Tulis migrasi Prisma.
3. Perbarui UI Admin untuk Form Buat/Edit Kuis agar mendukung form Course, Page (opsional), pengaturan Waktu & Visibility.
4. Sesuaikan `getStudentDetailedProgress` di sisi murid agar merefleksikan filter `openAt`, `closeAt`, dan `isHidden` (menampilkan logo 🔒 untuk kuis terkunci waktu).

### Fase 10: Tipe Soal Essay & Rekap Nilai
1. Tambahkan form pembuatan soal tipe Essay di CMS Guru.
2. Buat halaman **Rekap Nilai (Gradebook)** di CMS Admin/Guru yang memetakan murid vs kuis pada suatu mapel.
3. Sediakan antarmuka "Penilaian Manual" untuk soal tipe Essay bagi Guru.
4. Perbarui antarmuka pengerjaan kuis murid agar bisa merender *textarea* untuk soal Essay.

### Fase 11: Code Challenge Engine (Frontend & Pelaksanaan) - *Tahap Mendatang*
1. Instalasi `@monaco-editor/react`.
2. Integrasi Sandbox Runner (HTML/CSS/JS/SQL in-browser execution).
3. Pembuatan soal Coding dari CMS Guru.
4. Pelaksanaan kuis Coding oleh murid.

---

## 8. User Stories

### US-01: Murid Melihat Asesmen Terjadwal di Dashboard
**Sebagai** Murid, **saya ingin** melihat kuis dan tugas yang diberikan dalam suatu mapel, **sehingga** saya tahu jadwal pengerjaannya.
- [ ] Menampilkan Kuis Tugas Mandiri (tanpa materi) di daftar progres/dashboard.
- [ ] Kuis dengan `openAt` di masa depan ditampilkan dengan visual redup dan **Logo Kunci 🔒**.
- [ ] Kuis tersembunyi (`isHidden = true`) tidak dibocorkan di halaman murid.

### US-02: Guru Membuat Tugas Mandiri
**Sebagai** Guru, **saya ingin** membuat Kuis tanpa harus terikat ke satu materi tertentu.
- [ ] Form pembuatan kuis mewajibkan Mapel, tapi memberikan kebebasan mengosongkan Materi.
- [ ] Guru bisa menetapkan waktu buka dan tutup kuis.
- [ ] Guru bisa menyembunyikan kuis saat sedang dirancang.

### US-03: Guru Melakukan Rekap Nilai
**Sebagai** Guru, **saya ingin** melihat tabel rekapitulasi nilai seluruh murid di suatu mapel.
- [ ] Terdapat halaman Gradebook.
- [ ] Tabel memuat Nilai Total per kuis per murid.
- [ ] Terdapat indikator jika ada soal Essay yang belum dinilai (membutuhkan aksi manual).

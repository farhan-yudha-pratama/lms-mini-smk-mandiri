# 📝 Todo List — Assessment & Rekap Nilai (v1.0.0)

> **Dokumen ini diturunkan dari `PRD_v1.0.0.md` yang telah diperbarui**.
> Fokus rilis ini adalah memperluas fungsionalitas `QuizPackage` menjadi sistem asesmen yang fleksibel (bisa di level Mapel/Course maupun Materi/Page), penambahan soal Essay, dan pembuatan halaman Rekap Nilai (Gradebook).

---

## ✅ FASE 8 — Student Dashboard & Progress (SELESAI di v0.5.x)
- [x] **8.1** Perbarui route `app/page.tsx` sebagai RSC utama untuk murid.
- [x] **8.2** Buat Server Action `getStudentDetailedProgress` di `app/actions/student-progress.ts`.
- [x] **8.3** Implementasi halaman Progress Belajar (`/student/progress`) yang memuat daftar materi terkunci dan status kuis.
- [x] **8.4** Styling menggunakan panduan **Neo Brutalism**.

---

## 🚀 FASE 9 — Refactor Ekosistem QuizPackage (Backend & CMS)

### 9.1 Database & Schema (`contract.prisma`)
- [ ] **9.1.1** Tambahkan field `courseId String` pada model `QuizPackage` (FK wajib ke tabel `Course`).
- [ ] **9.1.2** Ubah field `pageId` pada model `QuizPackage` menjadi opsional (`pageId String?`) dan **hapus** konstrain `@unique` pada field ini (jika ada, atau sesuaikan agar relasinya menjadi one-to-many opsional).
- [ ] **9.1.3** Tambahkan field visibilitas di `QuizPackage`:
  - `isHidden Boolean @default(false)`
  - `openAt TimestamptzString?`
  - `closeAt TimestamptzString?`
- [ ] **9.1.4** Perbarui enum `QuestionType` (jika menggunakan enum Prisma) atau validasi Zod untuk mendukung `ESSAY` dan `CODE_CHALLENGE`.
- [ ] **9.1.5** Tambahkan field baru di model `StudentAnswer` untuk mengakomodasi tipe soal baru:
  - `essayAnswer String?`
  - `essayFeedback String?`
- [ ] **9.1.6** Jalankan `npm run contract:emit` untuk menghasilkan ulang Prisma Client.
- [ ] **9.1.7** Buat file migrasi SQL manual di folder `prisma/migrations/` dan terapkan ke database.

### 9.2 Pembaruan Service Layer & Server Action
- [ ] **9.2.1** Perbarui service pembuatan dan pengambilan Kuis di `modules/quiz/` (atau direktori yang relevan) agar selalu mewajibkan `courseId`.
- [ ] **9.2.2** Perbarui Server Action `getStudentDetailedProgress` di `app/actions/student-progress.ts`:
  - Masukkan daftar Kuis Mandiri (kuis yang `pageId` = null) ke dalam struktur kembalian data per Mapel.
  - Implementasikan logika visibilitas: Kuis tidak dikembalikan ke murid jika `isHidden = true`.
  - Jika `openAt` berada di masa depan, kembalikan kuis dengan status khusus (misal: `TIME_LOCKED`) agar UI menampilkan Logo Kunci 🔒.
- [ ] **9.2.3** Perbarui logika Validasi Akses di `QuizEngine` agar menolak murid mengerjakan jika:
  - `isHidden = true`
  - Waktu sekarang kurang dari `openAt`
  - Waktu sekarang lebih dari `closeAt`

### 9.3 Pembaruan UI CMS Admin (Pembuatan Kuis)
- [ ] **9.3.1** Perbarui form Pembuatan / Edit Kuis di halaman Admin (`app/(dashboard)/(admin)/dashboard/quizzes/...`).
- [ ] **9.3.2** Tambahkan dropdown "Pilih Mata Pelajaran" (Wajib).
- [ ] **9.3.3** Tambahkan dropdown "Pilih Materi Spesifik" (Opsional - disabled/kosong secara default).
- [ ] **9.3.4** Tambahkan pengaturan Waktu dan Visibilitas:
  - Toggle "Sembunyikan dari Murid (Draft Mode)".
  - Input Tanggal/Waktu Buka Kuis (`openAt`).
  - Input Tanggal/Waktu Tutup Kuis / Deadline (`closeAt`).

---

## 📝 FASE 10 — Tipe Soal Essay & Rekap Nilai

### 10.1 Manajemen Soal Essay (CMS Admin)
- [ ] **10.1.1** Perbarui UI Form Tambah/Edit Soal. Sediakan opsi tipe soal: "Pilihan Ganda" dan "Essay".
- [ ] **10.1.2** Jika Guru memilih "Essay", sembunyikan form pembuatan Opsi Jawaban (A, B, C, D).
- [ ] **10.1.3** Perbarui logika Server Action penyimpanan soal agar mengakomodasi tipe `ESSAY` tanpa memvalidasi keberadaan opsi jawaban.

### 10.2 Pengerjaan Kuis oleh Murid
- [ ] **10.2.1** Perbarui komponen `QuizEngineClient` (atau client form pengerjaan soal murid).
- [ ] **10.2.2** Jika tipe soal adalah `ESSAY`, render komponen `<textarea>` sebagai input pengganti radio button pilihan ganda.
- [ ] **10.2.3** Perbarui logika submit kuis agar menampung `essayAnswer` ke payload.
- [ ] **10.2.4** Status `QuizAttempt` mungkin belum langsung `COMPLETED` jika ada essay (bisa langsung `COMPLETED` tapi nilai essay masih 0, atau tambahkan status `NEEDS_GRADING`). Tentukan dan terapkan logika penanganan skor parsial (auto-grade bagian PG saja).

### 10.3 Halaman Rekap Nilai (Gradebook)
- [ ] **10.3.1** Buat route baru `app/(dashboard)/(admin)/dashboard/rekap-nilai/page.tsx` untuk fitur Gradebook.
- [ ] **10.3.2** Buat filter "Pilih Mata Pelajaran" dan "Pilih Kelas/Grup" di bagian atas halaman.
- [ ] **10.3.3** Implementasikan layout Tabel Data (Matriks):
  - **Baris (Rows)**: Daftar nama murid (siswa).
  - **Kolom (Columns)**: Daftar semua kuis (baik kuis materi maupun kuis mandiri) dalam mapel tersebut.
  - **Sel (Cells)**: Menampilkan Skor (`attempt.score`) tertinggi / terakhir dari murid tersebut pada kuis terkait.
- [ ] **10.3.4** Berikan indikator visual khusus pada sel (misal: warna oranye atau icon 📝) jika kuis tersebut memiliki jawaban Essay yang belum dinilai oleh Guru.

### 10.4 UI Penilaian Manual Essay
- [ ] **10.4.1** Buat interaksi klik pada sel di tabel Gradebook untuk membuka modal / panel riwayat pengerjaan murid.
- [ ] **10.4.2** Di dalam panel tersebut, tampilkan jawaban `essayAnswer` yang ditulis murid.
- [ ] **10.4.3** Sediakan input `pointsEarned` (misal 0-100) dan input `essayFeedback` untuk Guru memberikan nilai.
- [ ] **10.4.4** Buat Server Action `gradeEssayAction(answerId, points, feedback)` yang akan:
  - Mengupdate data tabel `StudentAnswer`.
  - Mengkalkulasi ulang total skor `QuizAttempt` (menambahkan skor essay ke skor PG yang sudah ada).
  - Me-*revalidate* path Gradebook agar nilai baru tampil.

---

## 💻 FASE 11 — Code Challenge Engine (Tahap Mendatang)

> Kumpulan task ini akan dikerjakan pada siklus sprint berikutnya (setelah Fase 10 selesai sepenuhnya dan divalidasi).

- [ ] **11.1.1** Instalasi `@monaco-editor/react` (Client-side lazy load).
- [ ] **11.1.2** Pembuatan UI CMS Admin untuk menginput *Boilerplate Code* dan *Test Cases JSON* pada pembuatan soal tipe `CODE_CHALLENGE`.
- [ ] **11.1.3** Pembuatan *Sandbox Environment* (Worker / iFrame) untuk mengeksekusi kode HTML/CSS/JS di browser murid.
- [ ] **11.1.4** Eksekusi test case secara auto-grading tanpa intervensi server (murid bisa menekan "Uji Kode" sebelum Submit Kuis).
- [ ] **11.1.5** Penyimpanan kode akhir ke dalam `essayAnswer` (atau kolom kode khusus) untuk dievaluasi total.

---

## 📈 Progress Tracker

| Fase | Persentase Selesai | Catatan Tambahan |
|---|---|---|
| Fase 8 (Dashboard & Progress) | 100% | ✅ Selesai di v0.5.x |
| Fase 9 (Refactor QuizPackage) | 0% | Mulai modifikasi `contract.prisma` |
| Fase 10 (Essay & Gradebook) | 0% | Bergantung pada penyelesaian Fase 9 |
| Fase 11 (Code Challenge) | 0% | Backlog |

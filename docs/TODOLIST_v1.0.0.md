# ✅ TODOLIST IMPLEMENTASI — WebPoint LMS v1.0.0
# Feature: Student Dashboard & Standalone Assessment Engine

> **Referensi**: [`PRD_v1.0.0.md`](./PRD_v1.0.0.md) | [`ARCHITECTURE.md`](./ARCHITECTURE.md) | [`ERD_LMS.md`](./ERD_LMS.md)
> **Keterangan Status**: `[ ]` Belum dikerjakan · `[~]` Sedang dikerjakan · `[x]` Selesai

---

## 🗂️ FASE 1 — Fondasi Database (Schema & Migration)

> **Prinsip**: Jangan tulis satu baris kode UI pun sebelum schema database selesai dan termigrasi.

### 1.1 Update `prisma/contract.prisma`
- [ ] **1.1.1** Tambahkan `enum AssignmentStatus` (`DRAFT`, `PUBLISHED`, `CLOSED`)
- [ ] **1.1.2** Tambahkan `enum AssignmentQuestionType` (`MULTIPLE_CHOICE`, `ESSAY`, `CODE_CHALLENGE`)
- [ ] **1.1.3** Tambahkan `enum AssignmentAttemptStatus` (`IN_PROGRESS`, `SUBMITTED`, `GRADED`)
- [ ] **1.1.4** Tambahkan `enum CodeLanguage` (`html`, `css`, `javascript`, `sql`)
- [ ] **1.1.5** Tambahkan model `Assignment` (id, createdByUserId, title, description, status, passingScore, timeLimitMinutes, questionsToShow, shuffleQuestions, openAt, closeAt, createdAt, updatedAt)
- [ ] **1.1.6** Tambahkan model `AssignmentTarget` (id, assignmentId, classroomId?, studentId?) + unique constraint
- [ ] **1.1.7** Tambahkan model `AssignmentQuestion` (id, assignmentId, questionType, questionText, points, orderIndex, createdAt, updatedAt)
- [ ] **1.1.8** Tambahkan model `AssignmentOption` (id, questionId, optionText, isCorrect, orderIndex)
- [ ] **1.1.9** Tambahkan model `CodeChallenge` (id, questionId @unique, language, boilerplateCode?, solutionCode?, setupScript?, testCasesJson, createdAt, updatedAt)
- [ ] **1.1.10** Tambahkan model `AssignmentAttempt` (id, assignmentId, studentId, status, questionsSnapshot, totalScore?, startedAt, submittedAt?, gradedAt?) + unique `[assignmentId, studentId]`
- [ ] **1.1.11** Tambahkan model `AssignmentAnswer` (id, attemptId, questionId, selectedOptionId?, essayAnswer?, essayFeedback?, submittedCode?, testResultsJson?, passedTestCount?, totalTestCount?, isCorrect?, pointsEarned) + unique `[attemptId, questionId]`
- [ ] **1.1.12** Definisikan semua relasi antar model baru di `contract.prisma`
- [ ] **1.1.13** Definisikan relasi `User` → `Assignment[]` (sebagai pembuat) di model `User`
- [ ] **1.1.14** Tambahkan `enum HistorySourceType` (`MATERIAL_QUIZ`, `ASSIGNMENT`)
- [ ] **1.1.15** Tambahkan model `StudentScoreSummary` (id, studentId @unique, classroomId?, classroomName?, totalMaterialQuizCompleted, totalMaterialQuizPassed, averageMaterialQuizScore?, totalAssignmentCompleted, totalAssignmentPassed, averageAssignmentScore?, overallAverageScore?, totalPointsEarned, totalMaterialCompleted, lastActivityAt?, updatedAt) — **1 row per murid**
- [ ] **1.1.16** Tambahkan model `QuizCompletionRecord` (id, studentId, studentName, studentEmail, classroomId?, classroomName?, sourceType, sourceId, sourceTitle, categoryName?, pageTitle?, pageSlug?, score, passingScore, isPassed, totalQuestions, correctAnswers, essayCount, timeTakenSeconds?, completedAt, createdAt) — **IMMUTABLE log**
- [ ] **1.1.17** Tambahkan relasi balik `scoreSummary`, `completionRecords` di model `User` dan `Classroom` di `contract.prisma`

### 1.2 Migrasi Database
- [ ] **1.2.1** Jalankan `npm run contract:emit` untuk generate Prisma Client dari schema baru
- [ ] **1.2.2** Buat file SQL migrasi di folder `migrations/` (sesuai pola yang sudah ada)
- [ ] **1.2.3** Verifikasi semua tabel baru terbentuk dengan benar di database
- [ ] **1.2.4** Verifikasi semua constraint (unique, FK) teraplikasikan dengan benar

---

## 🗂️ FASE 2 — Service Layer & Business Logic (`modules/`)

> **Prinsip**: Semua logika bisnis wajib berada di `modules/`, bukan di Server Actions atau komponen UI.

### 2.1 `modules/assignment/`
- [ ] **2.1.1** Buat file `modules/assignment/schemas.ts` — definisi Zod schema untuk:
  - `createAssignmentSchema` (validasi form buat tugas)
  - `updateAssignmentSchema` (validasi form edit tugas)
  - `addQuestionSchema` (validasi form tambah soal)
  - `addCodeChallengeSchema` (validasi form tambah soal coding)
  - `targetAssignmentSchema` (validasi penugasan ke kelas/murid)
- [ ] **2.1.2** Buat file `modules/assignment/queries.ts` — fungsi read-only (query Prisma):
  - `getAssignmentsByCreator(userId)` — list tugas milik Guru
  - `getAssignmentById(id)` — detail tugas + soal + opsi + code challenge
  - `getAssignmentsForStudent(studentId)` — tugas yang ditugaskan ke murid ini (via `AssignmentTarget` → Classroom atau langsung studentId)
  - `getAssignmentAttempt(assignmentId, studentId)` — cek attempt yang sudah ada
- [ ] **2.1.3** Buat file `modules/assignment/mutations.ts` — fungsi write (insert/update):
  - `createAssignment(data, userId)` — buat tugas baru dengan status DRAFT
  - `updateAssignment(id, data)` — update detail tugas
  - `deleteAssignment(id)` — hapus tugas (hanya jika masih DRAFT)
  - `publishAssignment(id)` — ubah status ke PUBLISHED
  - `closeAssignment(id)` — ubah status ke CLOSED
  - `addQuestionToAssignment(assignmentId, data)` — tambah soal ke bank soal
  - `updateQuestion(questionId, data)` — edit soal
  - `deleteQuestion(questionId)` — hapus soal dari bank
  - `addOptionsToQuestion(questionId, options[])` — tambah opsi PG
  - `upsertCodeChallenge(questionId, data)` — buat/update detail soal coding
  - `assignToTarget(assignmentId, targets[])` — tugaskan ke kelas/murid

### 2.2 `modules/assignment-engine/`
- [ ] **2.2.1** Buat file `modules/assignment-engine/attempt.ts`:
  - `startAttempt(assignmentId, studentId)` — buat `AssignmentAttempt` baru, jalankan randomisasi soal, simpan `questionsSnapshot` (JSON array of question IDs)
  - `getOrCreateAttempt(assignmentId, studentId)` — jika sudah ada attempt yang IN_PROGRESS, kembalikan attempt yang ada (resume support)
  - `submitAttempt(attemptId)` — ubah status ke SUBMITTED, hitung skor otomatis (PG + Code Challenge), simpan `totalScore`
  - `autoGradeAttempt(attemptId)` — fungsi kalkulasi skor dari semua jawaban yang sudah auto-graded
- [ ] **2.2.2** Buat file `modules/assignment-engine/answer.ts`:
  - `saveMultipleChoiceAnswer(attemptId, questionId, selectedOptionId)` — simpan jawaban PG, cek `isCorrect`, hitung `pointsEarned`
  - `saveEssayAnswer(attemptId, questionId, essayText)` — simpan draft jawaban essay
  - `saveCodeAnswer(attemptId, questionId, code, testResults)` — simpan kode + hasil test case + hitung poin dari `passedTestCount / totalTestCount * points`
  - `gradeEssayAnswer(answerId, pointsEarned, feedback, guruId)` — Guru menilai essay manual
- [ ] **2.2.3** Buat file `modules/assignment-engine/randomizer.ts`:
  - `pickRandomQuestions(allQuestionIds, count)` — algoritma Fisher-Yates shuffle, ambil N soal dari pool

### 2.3 `modules/dashboard/`
- [ ] **2.3.1** Buat file `modules/dashboard/student-summary.ts`:
  - `getStudentDashboardData(studentId)` — satu fungsi agregasi yang mengambil semua data dashboard murid secara efisien:
    - Summary counts (materi aktif, kuis pending, tugas pending)
    - Daftar halaman `UNLOCKED` / `LOCKED` yang perlu dikerjakan
    - Daftar `Assignment` aktif yang belum selesai
  - *Catatan: Gunakan Prisma `include` dan `select` secara optimal untuk menghindari N+1 queries*

### 2.4 `modules/score-tracker/` ⭐ Tambahan v1.0.0
- [ ] **2.4.1** Buat file `modules/score-tracker/completion-recorder.ts`:
  - `recordMaterialQuizCompletion(quizAttemptId)` — dipanggil setelah `QuizAttempt` berstatus `COMPLETED`/`GRADED`:
    - Ambil data snapshot: nama murid, email, kelas, judul kuis, kategori, halaman
    - INSERT satu baris baru ke `QuizCompletionRecord` (tidak pernah UPDATE)
    - Panggil `updateScoreSummary(studentId)` setelahnya
  - `recordAssignmentCompletion(attemptId)` — dipanggil setelah `AssignmentAttempt` berstatus `GRADED`:
    - Ambil data snapshot: nama murid, email, kelas, judul tugas, total soal, skor
    - INSERT satu baris baru ke `QuizCompletionRecord`
    - Panggil `updateScoreSummary(studentId)` setelahnya

- [ ] **2.4.2** Buat file `modules/score-tracker/score-summary.ts`:
  - `upsertScoreSummary(studentId)` — fungsi utama yang di-trigger setiap ada asesmen selesai:
    - Query semua `QuizCompletionRecord` milik `studentId`
    - Hitung ulang semua statistik (average, count, totalPoints, dll.) dari data aktual
    - `UPSERT` (update jika ada, insert jika belum ada) ke tabel `StudentScoreSummary`
    - Update `lastActivityAt` dengan timestamp sekarang
    - *Catatan: Hitung dari `QuizCompletionRecord` sebagai sumber kebenaran, bukan dari tabel quiz asli*

- [ ] **2.4.3** Buat file `modules/score-tracker/queries.ts`:
  - `getScoreSummaryByStudent(studentId)` — ambil satu row summary murid
  - `getCompletionHistory(studentId, options?)` — ambil riwayat lengkap dengan filter (sourceType, dateRange, isPassed) dan pagination
  - `getCompletionHistoryByClass(classroomId, options?)` — riwayat seluruh murid dalam satu kelas (untuk Guru/Superadmin)

---

## 🗂️ FASE 3 — Server Actions (`app/actions/`)

> Berfungsi sebagai jembatan antara Client Components dan Service Layer. Wajib validasi Zod di sini.

- [ ] **3.1** Buat `app/actions/assignment.ts`:
  - `createAssignmentAction(formData)` → validasi → `createAssignment()`
  - `updateAssignmentAction(id, formData)` → validasi → `updateAssignment()`
  - `deleteAssignmentAction(id)` → `deleteAssignment()`
  - `publishAssignmentAction(id)` → `publishAssignment()`
  - `addQuestionAction(assignmentId, formData)` → validasi → `addQuestionToAssignment()`
  - `updateQuestionAction(questionId, formData)` → validasi → `updateQuestion()`
  - `deleteQuestionAction(questionId)` → `deleteQuestion()`
  - `upsertCodeChallengeAction(questionId, formData)` → validasi → `upsertCodeChallenge()`
  - `assignTargetAction(assignmentId, targets)` → validasi → `assignToTarget()`

- [ ] **3.2** Buat `app/actions/assignment-attempt.ts`:
  - `startAttemptAction(assignmentId)` → auth check → `startAttempt()`
  - `saveAnswerAction(attemptId, questionId, payload)` → validasi → `save*Answer()`
  - `submitAttemptAction(attemptId)` → `submitAttempt()`
  - `gradeEssayAction(answerId, points, feedback)` → auth check GURU → `gradeEssayAnswer()`

---

## 🗂️ FASE 4 — Halaman Guru (Dashboard Admin/Guru)

> Styling mengikuti panduan **Clean & Minimalist Modernism** dari [`DESIGN_ADMIN.md`](./DESIGN_ADMIN.md).

### 4.1 Halaman Manajemen Tugas (CMS Guru)
- [ ] **4.1.1** Buat route `app/(dashboard)/guru/tugas/page.tsx` (RSC):
  - Tabel daftar semua tugas milik Guru (judul, status badge, jumlah soal, jumlah target, aksi)
  - Tombol "Buat Tugas Baru"
  - Filter berdasarkan status (DRAFT / PUBLISHED / CLOSED)

- [ ] **4.1.2** Buat route `app/(dashboard)/guru/tugas/baru/page.tsx`:
  - Form langkah 1: Detail Tugas (judul, deskripsi, batas waktu, passing score, tanggal buka/tutup)
  - Menggunakan `react-hook-form` + Zod untuk validasi client-side
  - Submit → `createAssignmentAction()` → redirect ke halaman detail tugas

- [ ] **4.1.3** Buat route `app/(dashboard)/guru/tugas/[assignmentId]/page.tsx` (RSC):
  - Tampilkan detail tugas + status
  - Tombol ubah status (Publish / Close)
  - Tombol edit detail tugas
  - Daftar soal dalam bank (dengan urutan, tipe, poin, aksi edit/hapus)
  - Tombol "Tambah Soal"
  - Daftar target penugasan (kelas/murid) dengan aksi tambah/hapus

- [ ] **4.1.4** Buat komponen `components/assignment/QuestionFormModal.tsx` (Client Component):
  - Modal form dengan tab untuk memilih tipe soal: Pilihan Ganda | Essay | Code Challenge
  - **Tab Pilihan Ganda**: Input soal + form dinamis untuk tambah/hapus pilihan + toggle kunci jawaban
  - **Tab Essay**: Input soal + input poin maksimal
  - **Tab Code Challenge**: Input soal, select bahasa, textarea boilerplate code, textarea setup script, form test cases (tambah/hapus, toggle hidden)
  - Submit → `addQuestionAction()` / `updateQuestionAction()`

- [ ] **4.1.5** Buat komponen `components/assignment/TargetAssignmentPanel.tsx` (Client Component):
  - Dropdown/search untuk pilih Classroom atau murid individual
  - Daftar target yang sudah ditambahkan + tombol hapus
  - Submit → `assignTargetAction()`

### 4.2 Halaman Penilaian Essay (Grading)
- [ ] **4.2.1** Buat route `app/(dashboard)/guru/tugas/[assignmentId]/grading/page.tsx` (RSC):
  - Tabel daftar murid yang sudah submit + jumlah essay yang belum dinilai
  - Filter: Semua | Menunggu Penilaian | Selesai Dinilai

- [ ] **4.2.2** Buat route `app/(dashboard)/guru/tugas/[assignmentId]/grading/[attemptId]/page.tsx` (RSC):
  - Tampilkan semua soal dan jawaban murid ini
  - Soal PG & Code Challenge: tampilkan hasil otomatis (read-only)
  - Soal Essay: tampilkan jawaban murid + form input poin (0 - max poin) + textarea feedback Guru
  - Tombol "Simpan Penilaian" → `gradeEssayAction()`
  - Setelah semua essay dinilai, status attempt otomatis berubah ke `GRADED`

---

## 🗂️ FASE 5 — Halaman Murid (Student-Facing Pages)

> Styling mengikuti panduan **Tactile Neo Brutalism** dari [`DESIGN.md`](./DESIGN.md).

### 5.1 Student Dashboard
- [ ] **5.1.1** Buat route `app/(dashboard)/murid/page.tsx` (RSC):
  - Panggil `getStudentDashboardData(studentId)` dari service layer
  - Render komponen-komponen berikut

- [ ] **5.1.2** Buat komponen `components/dashboard/SummaryWidget.tsx`:
  - 3 kartu statistik: Materi Aktif, Kuis Menunggu, Tugas Pending
  - Progress bar: persentase materi selesai
  - Styling Neo Brutalism: border hitam tebal, hard drop shadow, warna Jade/Teal

- [ ] **5.1.3** Buat komponen `components/dashboard/MaterialProgressList.tsx`:
  - Daftar halaman yang perlu dikerjakan
  - Tampilkan status: 🔒 (LOCKED + alasan prasyarat) / 🔓 (UNLOCKED)
  - Tombol navigasi langsung ke halaman materi (untuk yang UNLOCKED)

- [ ] **5.1.4** Buat komponen `components/dashboard/ActiveAssignmentList.tsx`:
  - Daftar tugas yang aktif dan ditugaskan ke murid ini
  - Tampilkan judul, deadline, status attempt (Belum Mulai / Sedang Dikerjakan / Menunggu Nilai / Selesai)
  - Tombol "Mulai" / "Lanjutkan" / "Lihat Hasil"

### 5.2 Halaman Pengerjaan Tugas
- [ ] **5.2.1** Buat route `app/(dashboard)/murid/tugas/[assignmentId]/page.tsx` (RSC):
  - Halaman intro: judul, deskripsi, info (jumlah soal, batas waktu, passing score, deadline)
  - Tombol "Mulai Sekarang" → `startAttemptAction()` → redirect ke halaman pengerjaan
  - Jika sudah ada attempt IN_PROGRESS → tampilkan tombol "Lanjutkan"
  - Jika sudah SUBMITTED/GRADED → redirect ke halaman hasil

- [ ] **5.2.2** Buat route `app/(dashboard)/murid/tugas/[assignmentId]/kerjakan/page.tsx` (Client Component utama):
  - Fetch soal sesuai `questionsSnapshot` pada attempt murid ini
  - Render komponen timer countdown (`react-countdown-circle-timer` atau custom)
  - Render navigasi soal (nomor soal, indikator status: belum dijawab/sudah dijawab)
  - Auto-submit saat timer habis via `submitAttemptAction()`

- [ ] **5.2.3** Buat komponen `components/quiz-attempt/MultipleChoiceQuestion.tsx` (Client Component):
  - Tampilkan teks soal + opsi pilihan
  - Handle state seleksi pilihan
  - Debounce save ke server: `saveAnswerAction()` saat murid memilih

- [ ] **5.2.4** Buat komponen `components/quiz-attempt/EssayQuestion.tsx` (Client Component):
  - Tampilkan teks soal + textarea jawaban
  - Debounce auto-save tiap 5 detik: `saveAnswerAction()`
  - Indikator "Tersimpan" / "Menyimpan..."

- [ ] **5.2.5** Buat komponen `components/code-challenge/CodeChallengeQuestion.tsx` (Client Component, Lazy Loaded):
  - Tampilkan problem statement (render Markdown)
  - Render Monaco Editor dengan bahasa dan boilerplate yang sesuai
  - Panel test case (tab: visible test cases + output console)
  - Tombol "▶ Jalankan & Uji" → trigger code runner
  - Tampilkan hasil: badge ✅/❌ per test case, output aktual vs expected
  - Tombol "Submit Jawaban Ini" → `saveCodeAnswerAction()` → simpan kode + hasil tes terakhir

### 5.3 Halaman Hasil Tugas
- [ ] **5.3.1** Buat route `app/(dashboard)/murid/tugas/[assignmentId]/hasil/page.tsx` (RSC):
  - Tampilkan total skor dan status lulus/tidak lulus (vs passingScore)
  - Breakdown per soal: tipe, soal, jawaban murid, status, poin diperoleh
  - Untuk soal Essay yang belum dinilai: tampilkan badge "Menunggu Penilaian Guru"
  - Untuk soal Code Challenge: tampilkan kode yang disubmit (read-only Monaco) + ringkasan test case
  - Untuk Essay yang sudah dinilai: tampilkan feedback Guru

---

## 🗂️ FASE 6 — Code Runner Engine (`modules/code-runner/`)

> Dipisahkan sebagai modul tersendiri agar mudah ditest dan dikembangkan secara independen.

### 6.1 Setup & Konfigurasi
- [ ] **6.1.1** Install library: `npm install @monaco-editor/react`
- [ ] **6.1.2** Install library: `npm install sql.js`
- [ ] **6.1.3** Copy file `sql-wasm.wasm` ke folder `public/wasm/sql-wasm.wasm`
- [ ] **6.1.4** Tambahkan konfigurasi `headers` di `next.config.ts` untuk WASM file (MIME type `application/wasm`)
- [ ] **6.1.5** Buat wrapper `React.lazy()` + `Suspense` untuk Monaco Editor agar tidak di-bundle di initial load

### 6.2 HTML & CSS Runner
- [ ] **6.2.1** Buat `modules/code-runner/html-css-runner.ts`:
  - Fungsi `buildIframeSrcDoc(htmlCode, cssCode)` → generate string HTML dokumen lengkap
  - Fungsi `evaluateHtmlTestCase(iframe, testCase)` → evaluasi DOM via `iframe.contentDocument.querySelector()`
    - Contoh assertion: `{ type: 'element-exists', selector: 'h1' }`, `{ type: 'text-content', selector: 'h1', expected: 'Hello' }`, `{ type: 'style', selector: '.box', property: 'color', expected: 'red' }`
  - Return format: `{ passed: boolean, actualOutput: string, error?: string }`

### 6.3 JavaScript Runner
- [ ] **6.3.1** Buat file `public/sandbox/js-sandbox.html` — halaman HTML statis yang berfungsi sebagai sandbox `<iframe>` terisolasi:
  - Berjalan di origin berbeda (served dari `/sandbox/js-sandbox.html`)
  - Listen pesan `postMessage` dari halaman utama
  - Eksekusi kode murid menggunakan `eval()` atau `new Function()` dalam blok try-catch
  - Kirim balik hasil via `postMessage`
  - Implementasi timeout: gunakan `setTimeout` untuk deteksi infinite loop (max 5 detik)
- [ ] **6.3.2** Buat `modules/code-runner/js-runner.ts`:
  - Fungsi `runJavaScriptCode(code, testCase)` → inject kode + test runner ke sandbox iframe via `postMessage`
  - Promise-based dengan timeout 5 detik
  - Return format: `{ passed: boolean, actualOutput: string, error?: string }`

### 6.4 SQL Runner
- [ ] **6.4.1** Buat `modules/code-runner/sql-runner.ts`:
  - Fungsi `runSqlCode(setupScript, studentQuery, testCase)`:
    - Inisialisasi database `sql.js` in-memory
    - Jalankan `setupScript` (CREATE TABLE + INSERT)
    - Jalankan query murid
    - Bandingkan result set dengan `testCase.expectedOutput` (normalize JSON comparison)
  - Return format: `{ passed: boolean, actualOutput: string, rows: any[][], error?: string }`
  - *Catatan: Karena sql.js berjalan di main thread, pertimbangkan jalankan di Web Worker agar tidak memblokir UI*

### 6.5 Web Worker untuk sql.js (Opsional tapi Direkomendasikan)
- [ ] **6.5.1** Buat `public/workers/sql-worker.js` — Web Worker yang memuat sql.js WASM dan mengeksekusi query
- [ ] **6.5.2** Update `sql-runner.ts` untuk berkomunikasi dengan worker via `postMessage`

---

## 🗂️ FASE 7 — Komponen UI Code Editor (`components/code-challenge/`)

- [ ] **7.1** Buat `components/code-challenge/MonacoEditorWrapper.tsx` (Client Component, Lazy):
  - Wrapper di atas `@monaco-editor/react`
  - Props: `language`, `value`, `onChange`, `readOnly`, `height`
  - Theme: sesuaikan warna dengan Neo Brutalism (dark theme dengan aksen Jade)
  - Tambahkan loading skeleton saat Monaco belum selesai load

- [ ] **7.2** Buat `components/code-challenge/TestCasePanel.tsx` (Client Component):
  - Daftar test case yang visible (dari `testCasesJson` dengan `isHidden: false`)
  - Tiap test case: label, deskripsi, status ikon (⏳/✅/❌), output aktual setelah dijalankan
  - Info agregat: "X dari Y test case lulus"
  - Tombol "▶ Jalankan & Uji"

- [ ] **7.3** Buat `components/code-challenge/OutputConsole.tsx` (Client Component):
  - Panel console log output dari kode yang dijalankan
  - Styled seperti terminal (dark background, monospace font)
  - Tampilkan error dengan warna merah

- [ ] **7.4** Buat `components/code-challenge/HtmlCssPreview.tsx` (Client Component):
  - Khusus untuk soal HTML/CSS: panel preview live di samping editor
  - Update preview setiap kali kode berubah (debounce 1 detik)
  - Render dalam `<iframe>` dengan `sandbox="allow-scripts"`

---

## 🗂️ FASE 8A — Riwayat Kuis Murid & API Pihak Ketiga ⭐ Tambahan v1.0.0

> Data dari `StudentScoreSummary` dan `QuizCompletionRecord` diekspos ke dua arah: (1) halaman Murid sebagai bukti pengerjaan, (2) API Route untuk dikonsumsi sistem luar.

### 8A.1 Halaman Riwayat Murid (Student-Facing)
- [ ] **8A.1.1** Buat route `app/(dashboard)/murid/riwayat/page.tsx` (RSC):
  - Summary card nilai gabungan (overallAverageScore, totalPointsEarned)
  - Progress bar: materi selesai vs total materi aktif
  - Tabel riwayat `QuizCompletionRecord` murid sendiri dengan kolom:
    - Tanggal & Waktu pengerjaan
    - Jenis (badge: 📖 Kuis Materi / 📝 Tugas Mandiri)
    - Nama kuis / tugas
    - Skor & KKM
    - Status lulus (✅ / ❌)
    - Durasi pengerjaan
  - Filter: Semua | Kuis Materi | Tugas Mandiri | Lulus | Tidak Lulus
  - Fitur: Sort berdasarkan tanggal (terbaru/terlama)
  - Fitur: Pagination (10 data per halaman)

- [ ] **8A.1.2** Buat route `app/(dashboard)/murid/riwayat/[recordId]/page.tsx` (RSC):
  - Halaman detail satu record sebagai **bukti pengerjaan**:
    - Header: Nama murid, email, kelas, tanggal pengerjaan
    - Nama kuis / tugas, kategori (jika kuis materi), skor, KKM, status lulus
    - Breakdown: total soal, jawaban benar, jumlah essay, durasi
    - Badge: "✅ LULUS" atau "❌ TIDAK LULUS" (styling mencolok Neo Brutalism)
  - Tombol: "Cetak / Download PDF" *(opsional, bisa pakai `window.print()` dengan CSS print media query)*

### 8A.2 Halaman Rekapitulasi Nilai (Guru & Superadmin)
- [ ] **8A.2.1** Buat route `app/(dashboard)/guru/rekapitulasi/page.tsx` (RSC):
  - Tabel daftar murid dalam kelas Guru tersebut + statistik ringkas masing-masing
  - Kolom: Nama murid, Kelas, Rata-rata Kuis Materi, Rata-rata Tugas, Overall Average, Total Pengerjaan, Terakhir Aktif
  - Data bersumber dari `StudentScoreSummary` (satu query, tanpa JOIN berat)
  - Tombol: Export ke CSV

- [ ] **8A.2.2** Buat route `app/(dashboard)/guru/rekapitulasi/[studentId]/page.tsx` (RSC):
  - Detail riwayat lengkap satu murid — tampilkan semua `QuizCompletionRecord` milik murid tersebut
  - Guru bisa lihat detail breakdown per kuis/tugas

### 8A.3 API Route untuk Pihak Ketiga (`app/api/v1/`)
- [ ] **8A.3.1** Buat `app/api/v1/students/[studentId]/summary/route.ts` (GET):
  - Endpoint: `GET /api/v1/students/:studentId/summary`
  - Auth: API Key via header `X-API-Key` (validasi dari environment variable atau tabel konfigurasi)
  - Response JSON:
    ```json
    {
      "studentId": "...",
      "studentName": "...",
      "classroom": "XI RPL 2",
      "summary": {
        "overallAverageScore": 82.5,
        "totalPointsEarned": 450,
        "totalMaterialCompleted": 12,
        "totalMaterialQuizCompleted": 10,
        "totalMaterialQuizPassed": 8,
        "averageMaterialQuizScore": 78.0,
        "totalAssignmentCompleted": 3,
        "totalAssignmentPassed": 3,
        "averageAssignmentScore": 91.0,
        "lastActivityAt": "2026-09-29T07:00:00.000Z"
      }
    }
    ```
  - Data diambil dari `StudentScoreSummary` — satu SELECT, tanpa JOIN

- [ ] **8A.3.2** Buat `app/api/v1/students/[studentId]/history/route.ts` (GET):
  - Endpoint: `GET /api/v1/students/:studentId/history?page=1&limit=20&sourceType=MATERIAL_QUIZ`
  - Auth: API Key via header `X-API-Key`
  - Response JSON:
    ```json
    {
      "studentId": "...",
      "total": 15,
      "page": 1,
      "limit": 20,
      "data": [
        {
          "id": "...",
          "sourceType": "MATERIAL_QUIZ",
          "sourceTitle": "Kuis: Tag Dasar HTML",
          "categoryName": "HTML",
          "pageTitle": "Tag Dasar HTML",
          "score": 85,
          "passingScore": 70,
          "isPassed": true,
          "totalQuestions": 10,
          "correctAnswers": 8,
          "timeTakenSeconds": 420,
          "completedAt": "2026-09-20T10:00:00.000Z"
        }
      ]
    }
    ```
  - Data diambil dari `QuizCompletionRecord` dengan filter & pagination

- [ ] **8A.3.3** Buat `app/api/v1/classrooms/[classroomId]/summary/route.ts` (GET):
  - Endpoint: `GET /api/v1/classrooms/:classroomId/summary`
  - Auth: API Key via header `X-API-Key`
  - Response: Daftar `StudentScoreSummary` untuk semua murid dalam satu kelas
  - Berguna untuk integrasi dengan sistem rapor atau aplikasi monitoring sekolah

- [ ] **8A.3.4** Buat middleware/utilitas validasi API Key di `lib/api-auth.ts`:
  - Fungsi `validateApiKey(request)` — baca header `X-API-Key`, bandingkan dengan `process.env.EXTERNAL_API_KEY`
  - Return `{ valid: boolean, error?: string }`
  - Wajib dipanggil di awal setiap API Route eksternal

---

## 🗂️ FASE 8 — Integrasi & Polish

- [ ] **8.1** Pastikan middleware Next.js sudah melindungi semua route baru:
  - `/murid/*` → hanya role `MURID`
  - `/guru/tugas/*` → hanya role `GURU` atau `SUPERADMIN`
  - `/guru/tugas/*/grading/*` → hanya role `GURU` atau `SUPERADMIN`

- [ ] **8.2** Tambahkan item navigasi di sidebar Guru (`DashboardSidebar.tsx`):
  - Link "Tugas Mandiri" → `/guru/tugas`
  - Link "Penilaian Essay" → (badge count menunggu penilaian)

- [ ] **8.3** Tambahkan item navigasi di sidebar Murid:
  - Link "Dashboard" → `/murid`
  - Link "Tugas Saya" → `/murid/tugas` (daftar semua tugas)
  - Link "Nilai Saya" → (Fase berikutnya)

- [ ] **8.4** Error handling & edge cases:
  - [ ] Jika murid mencoba akses tugas yang belum `PUBLISHED` → redirect + pesan error
  - [ ] Jika murid mencoba akses tugas setelah `closeAt` → redirect + pesan "Tugas telah ditutup"
  - [ ] Jika attempt sudah `SUBMITTED`, cegah murid membuka halaman pengerjaan kembali
  - [ ] Jika `timeLimitMinutes` null, sembunyikan timer
  - [ ] Loading state untuk semua Server Actions (gunakan `useFormStatus` atau `useTransition`)

- [ ] **8.5** Optimasi performa:
  - [ ] Monaco Editor hanya di-load saat route pengerjaan Code Challenge dibuka (lazy load)
  - [ ] `sql.js` WASM di-load secara lazy hanya saat dibutuhkan
  - [ ] Dashboard murid menggunakan RSC + Prisma langsung (zero client-side fetch untuk initial load)

---

## 🗂️ FASE 9 — Testing & Validasi (KERJAKAN TERAKHIR)

> Fase ini dikerjakan setelah semua implementasi selesai dan sudah bisa dijalankan secara end-to-end.

### 9.1 Testing Manual (Checklist QA)
- [ ] **9.1.1** Alur Guru: Buat tugas → Tambah soal PG → Publish → Tugaskan ke kelas
- [ ] **9.1.2** Alur Guru: Buat tugas → Tambah soal Essay → Publish → Tugaskan ke murid spesifik
- [ ] **9.1.3** Alur Guru: Buat tugas → Tambah soal Code Challenge (HTML) → Tambah test case → Publish
- [ ] **9.1.4** Alur Guru: Buat tugas → Tambah soal Code Challenge (JavaScript) → Tambah test case → Publish
- [ ] **9.1.5** Alur Guru: Buat tugas → Tambah soal Code Challenge (SQL) → Tambah setup script + test case → Publish
- [ ] **9.1.6** Alur Murid: Login → Lihat dashboard → Lihat tugas aktif → Mulai tugas
- [ ] **9.1.7** Alur Murid: Jawab soal PG → Jawab essay → Kerjakan code challenge → Submit
- [ ] **9.1.8** Alur Murid: Refresh halaman saat sedang mengerjakan → soal tetap sama (snapshot konsisten)
- [ ] **9.1.9** Alur Murid: Biarkan timer habis → auto-submit terjadi
- [ ] **9.1.10** Alur Guru: Buka halaman grading → Nilai essay → Lihat skor akhir murid berubah
- [ ] **9.1.11** Alur Murid: Lihat hasil tugas → Breakdown per soal → Feedback essay tampil

### 9.2 Testing Code Runner (Sandbox)
- [ ] **9.2.1** HTML Runner: Test case "ada elemen `<h1>`" → lulus jika ada, gagal jika tidak
- [ ] **9.2.2** HTML Runner: Test case "teks `<h1>` adalah 'Hello World'" → lulus/gagal dengan tepat
- [ ] **9.2.3** CSS Runner: Test case "elemen `.box` memiliki `background-color` merah" → evaluasi style computed
- [ ] **9.2.4** JS Runner: Test case fungsi penjumlahan `add(2, 3)` → expected `5`
- [ ] **9.2.5** JS Runner: Kode dengan infinite loop → auto-timeout setelah 5 detik tanpa crash browser
- [ ] **9.2.6** JS Runner: Kode dengan `console.log` → output muncul di OutputConsole
- [ ] **9.2.7** SQL Runner: Query `SELECT * FROM users` dengan setup script yang membuat tabel → result set sesuai
- [ ] **9.2.8** SQL Runner: Query yang salah syntax → tampilkan pesan error SQL yang informatif
- [ ] **9.2.9** SQL Runner: Query berbahaya (`DROP TABLE`) → hanya berjalan di memory, tidak mempengaruhi database utama

### 9.3 Testing Keamanan & Aksesibilitas
- [ ] **9.3.1** Murid B tidak bisa melihat/submit jawaban untuk attempt Murid A (auth check di action)
- [ ] **9.3.2** Murid tidak bisa melihat `solutionCode` dan detail hidden test case via network request
- [ ] **9.3.3** Guru non-pembuat tidak bisa mengedit tugas milik Guru lain (ownership check)
- [ ] **9.3.4** Kode JS yang mencoba `window.parent.location = 'evil.com'` di sandbox → tidak berpengaruh ke halaman utama
- [ ] **9.3.5** Semua form input divalidasi via Zod di Server Action (tidak hanya client-side)

---

## 📊 Progress Tracker

| Fase | Jumlah Task | Selesai | Persentase |
|---|---|---|---|
| Fase 1 — Database | 17 | 0 | 0% |
| Fase 2 — Service Layer | 22 | 0 | 0% |
| Fase 3 — Server Actions | 12 | 0 | 0% |
| Fase 4 — Halaman Guru | 9 | 0 | 0% |
| Fase 5 — Halaman Murid | 12 | 0 | 0% |
| Fase 6 — Code Runner Engine | 11 | 0 | 0% |
| Fase 7 — Komponen UI Editor | 4 | 0 | 0% |
| Fase 8A — Riwayat & API ⭐ | 8 | 0 | 0% |
| Fase 8 — Integrasi & Polish | 13 | 0 | 0% |
| Fase 9 — Testing (TERAKHIR) | 20 | 0 | 0% |
| **TOTAL** | **128** | **0** | **0%** |

---

> 💡 **Tip**: Update tanda `[ ]` → `[x]` setiap kali task selesai, dan `[~]` saat sedang dikerjakan untuk memudahkan tracking progres tim.

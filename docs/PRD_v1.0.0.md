# 📄 Product Requirements Document (PRD) — WebPoint LMS
# Version: 1.0.0
# Feature: Student Dashboard & Standalone Assessment Engine (Tugas Mandiri + Code Challenge)

> **Status**: `DRAFT` | **Tanggal Dibuat**: 2026-09-29 | **Author**: WebPoint Team
> **Dokumen ini adalah addendum** dari spesifikasi awal proyek. Baca [`PRD.md`](./PRD.md) sebagai dokumen dasar sebelum membaca dokumen ini.

---

## 1. Executive Summary

Dokumen ini mendefinisikan dua fitur besar yang akan ditambahkan ke dalam WebPoint LMS:

1. **Student Dashboard** — Halaman utama murid yang menampilkan ringkasan status pembelajaran (materi terkunci, materi dibuka, kuis menunggu, dan tugas baru).
2. **Standalone Assessment Engine** — Sistem tugas mandiri (*Tugas Mandiri*) yang **tidak terikat materi** tertentu. Tugas ini dapat berisi soal **Pilihan Ganda**, **Essay**, maupun tantangan **Coding Interactive** (mirip LeetCode / CodeWars) yang mencakup HTML, CSS, JavaScript (DOM & Logic), SQL, dan PHP.

---

## 2. Latar Belakang & Motivasi

Sistem LMS awal dirancang dengan model pembelajaran berbasis materi sekuensial (halaman -> kuis -> halaman berikutnya). Namun terdapat **kebutuhan pedagogis yang belum terpenuhi**:

- **Murid tidak memiliki halaman "rumah"** yang memberi gambaran holistik tentang kemajuan belajar mereka.
- **Guru membutuhkan alat asesmen fleksibel** yang dapat digunakan untuk menguji kompetensi murid di luar alur materi baku, misalnya: ujian tengah semester, tugas proyek, atau latihan coding mandiri.
- **Kompetensi coding praktis** (menulis HTML yang valid, membuat query SQL, manipulasi DOM dengan JavaScript, dan pemrograman PHP) sangat sulit diukur hanya melalui soal pilihan ganda. Diperlukan *sandbox* yang dapat menjalankan kode secara langsung dan memverifikasi hasilnya (*auto-grading*).

---

## 3. Target Pengguna (User Personas)

| Persona | Peran | Kebutuhan Utama |
|---|---|---|
| **Budi** | Murid | Tahu langkah belajar berikutnya, melihat tugas yang diberikan |
| **Pak Andi** | Guru | Buat soal coding yang dikoreksi otomatis, pantau nilai murid |
| **Superadmin** | Sistem | Manajemen seluruh tugas, penugasan ke kelas/murid tertentu |

---

## 4. Cakupan Fitur (Scope)

### 4.1. Fitur yang TERMASUK dalam v1.0.0
- ✅ Halaman **Student Dashboard** (ringkasan progres, materi terkunci, kuis & tugas pending)
- ✅ Manajemen **Tugas Mandiri (Assignment)** oleh Guru (CRUD, penugasan ke kelas/murid)
- ✅ Tipe soal **Pilihan Ganda** (auto-grading)
- ✅ Tipe soal **Essay** (manual grading oleh Guru)
- ✅ Tipe soal **Code Challenge** dengan *live code editor* dan *auto-grading* berbasis test case
- ✅ **Randomisasi soal** per murid dari bank soal (setiap murid bisa mendapat soal berbeda)
- ✅ **Batas waktu pengerjaan** per Tugas
- ✅ Halaman **Hasil & Laporan** untuk murid (score, jawaban benar, feedback)
- ✅ Halaman **Penilaian Essay** untuk Guru
- ✅ **ERD baru** mendukung semua entitas di atas

### 4.2. Fitur yang TIDAK TERMASUK dalam v1.0.0 (Backlog)
- ❌ AI Auto-Grading untuk Essay
- ❌ Code Challenge tipe PHP server-side execution (PHP butuh sandbox container terpisah)
- ❌ Leaderboard / Gamifikasi
- ❌ Kolaborasi real-time antar murid

---

## 5. Desain Produk: Student Dashboard

### 5.1. Gambaran Visual & Layout
Dashboard murid mengikuti panduan desain **Tactile Neo Brutalism** (lihat [`DESIGN.md`](./DESIGN.md)).

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER: Selamat Datang, [Nama Murid] 👋  |  [Logout]       │
├───────────────────┬─────────────────────────────────────────┤
│                   │  ┌──────────┐ ┌──────────┐ ┌──────────┐│
│  SIDEBAR          │  │  Materi  │ │  Kuis    │ │  Tugas   ││
│  ─────────        │  │  Aktif   │ │ Menunggu │ │ Pending  ││
│  - Dashboard ←    │  │  12/25   │ │    3     │ │    2     ││
│  - Materi         │  └──────────┘ └──────────┘ └──────────┘│
│  - Tugas Saya     │                                         │
│  - Nilai Saya     │  MATERI YANG PERLU DISELESAIKAN         │
│                   │  ┌──────────────────────────────────┐   │
│                   │  │ 🔒 [CSS] Flexbox Layout    ──→    │   │
│                   │  │    Prasyarat: Selesaikan CSS Basic│   │
│                   │  ├──────────────────────────────────┤   │
│                   │  │ 🔓 [JS] Pengenalan DOM     ──→    │   │
│                   │  │    Status: UNLOCKED, Belum dibaca │   │
│                   │  └──────────────────────────────────┘   │
│                   │                                         │
│                   │  TUGAS AKTIF                            │
│                   │  ┌──────────────────────────────────┐   │
│                   │  │ 📝 Tugas 1: HTML Dasar      [Mulai]│  │
│                   │  │    Deadline: 5 Okt 2026           │   │
│                   │  ├──────────────────────────────────┤   │
│                   │  │ 💻 Tugas 2: DOM Challenge   [Mulai]│  │
│                   │  │    Deadline: 10 Okt 2026          │   │
│                   │  └──────────────────────────────────┘   │
└───────────────────┴─────────────────────────────────────────┘
```

### 5.2. Widget Summary Cards
| Widget | Data yang Ditampilkan | Sumber Data |
|---|---|---|
| **Materi Aktif** | Total halaman `UNLOCKED` / total halaman | Tabel `PageAccess` |
| **Kuis Menunggu** | Halaman dengan status `UNLOCKED` yang memiliki kuis belum dikerjakan | `QuizAssignment` + `QuizAttempt` |
| **Tugas Pending** | Tugas yang diassign ke murid dan belum dikerjakan atau belum dinilai | `AssignmentSubmission` |
| **Progres Belajar** | Progress bar persentase `COMPLETED` dari total halaman | `PageAccess` |

### 5.3. Daftar Materi yang Perlu Diselesaikan
- Daftar halaman dengan status `LOCKED` atau `UNLOCKED` (belum selesai)
- Menampilkan label kategori, judul halaman, alasan kenapa terkunci (prasyarat apa yang belum selesai), dan tombol langsung menuju halaman tersebut.

### 5.4. Daftar Tugas Aktif
- Daftar semua `Assignment` yang ditugaskan ke murid, belum dikerjakan, atau belum selesai dinilai.
- Menampilkan judul tugas, deadline, tipe soal dominan (icon coding/essay/pilgan), dan status (Belum Mulai / Sedang Dikerjakan / Menunggu Penilaian / Selesai).

---

## 6. Desain Produk: Standalone Assessment Engine

### 6.1. Konsep Inti
*Tugas Mandiri (Assignment)* adalah **paket penilaian independen** yang dibuat oleh Guru dan ditugaskan ke satu atau lebih kelas/murid. Tugas ini:
- **TIDAK terikat** ke halaman materi manapun.
- Dapat berisi **campuran** soal dari berbagai tipe.
- Mendukung **randomisasi** soal dari bank soal, sehingga murid A bisa mendapat soal yang berbeda dari murid B, meski dari paket tugas yang sama.

### 6.2. Tipe Soal yang Didukung

#### 6.2.1. Tipe A: Pilihan Ganda (`MULTIPLE_CHOICE`)
- Sama persis dengan kuis pada materi, auto-graded saat submit.
- Mendukung shuffle pilihan jawaban per murid.

#### 6.2.2. Tipe B: Essay (`ESSAY`)
- Murid mengetik jawaban dalam *text area*.
- Dinilai secara **manual** oleh Guru via halaman *Grading Dashboard*.
- Guru dapat memberikan nilai poin dan komentar/feedback.

#### 6.2.3. Tipe C: Code Challenge (`CODE_CHALLENGE`) ⭐ Fitur Baru
Ini adalah tipe soal yang paling kompleks. Murid dihadapkan pada sebuah **problem coding** dan harus menuliskan solusi dalam editor kode *in-browser*.

Mendukung **5 bahasa/domain**:
| Kode | Domain | Fokus Kompetensi |
|---|---|---|
| `html` | HTML | Menulis markup yang valid & semantik |
| `css` | CSS | Styling dan layout (Flexbox, Grid, dsb) |
| `javascript` | JavaScript (Vanilla) | Manipulasi DOM, logika, algoritma |
| `sql` | SQL / Database | Query SELECT, JOIN, INSERT, subquery |
| `php` | PHP | *(Fase 2 — Diundur karena butuh server-side sandbox)* |

**Mekanisme Kerja Code Challenge:**
1. Guru mendefinisikan **Problem Statement** (deskripsi, contoh input/output, aturan).
2. Guru mendefinisikan **Test Cases** tersembunyi (input dan *expected output* yang digunakan untuk penilaian otomatis).
3. Guru mendefinisikan **Boilerplate Code** (kode awal yang sudah disiapkan untuk murid, misalnya fungsi yang sudah ditentukan *signature*-nya).
4. Murid membuka editor, membaca problem, menulis kode, lalu menekan **"Jalankan & Uji"**.
5. Sistem menjalankan kode murid terhadap *test cases* dan menampilkan berapa test case yang lulus (`3/5 passed`).
6. Murid dapat mencoba berkali-kali sampai waktu habis.
7. Saat submit, sistem menyimpan kode terakhir dan nilai dari test case terakhir.

### 6.3. Alur Pengerjaan Tugas oleh Murid

```
[Dashboard] → Klik "Mulai" Tugas
     ↓
[Halaman Intro Tugas]
  - Judul & deskripsi tugas
  - Tipe soal, jumlah soal, batas waktu, passing score
  - Tombol "Mulai Sekarang" (timer dimulai)
     ↓
[Halaman Pengerjaan] (Timer Countdown berjalan)
  - Tampilan per soal (Navigasi antar soal)
  - Tipe A: UI pilihan ganda
  - Tipe B: Text area essay
  - Tipe C: Code Editor (Monaco Editor)
     ↓
[Submit / Waktu Habis]
     ↓
[Halaman Hasil]
  - Skor otomatis (Pilihan Ganda + Code Challenge)
  - Status Essay: "Menunggu Penilaian Guru"
  - Breakdown per soal
```

### 6.4. Alur Manajemen Tugas oleh Guru

```
[Dashboard Guru] → "Buat Tugas Baru"
     ↓
[Form Pengaturan Tugas]
  - Nama Tugas, Deskripsi
  - Batas Waktu (menit), Passing Score
  - Metode Randomisasi: Ambil N soal dari Pool (atau tampilkan semua)
  - Tanggal Buka & Deadline
     ↓
[Bank Soal Tugas] → Tambah Soal
  - Pilih tipe: Pilihan Ganda / Essay / Code Challenge
  - Form sesuai tipe soal
  - Atur bobot poin per soal
     ↓
[Penugasan] → Tugaskan ke Kelas atau Murid Tertentu
     ↓
[Simpan & Publish]
```

---

## 7. Rekomendasi Library & Teknologi

### 7.1. Code Editor In-Browser

#### ✅ Rekomendasi Utama: **Monaco Editor** (via `@monaco-editor/react`)
Monaco adalah editor yang sama yang digunakan oleh **VS Code**. Ini adalah pilihan terbaik untuk proyek ini karena:
- **Kualitas Developer Experience (DX)** terbaik: *syntax highlighting*, *autocompletion*, *IntelliSense*.
- **Mendukung banyak bahasa**: HTML, CSS, JavaScript, SQL secara native.
- Tersedia sebagai React component siap pakai: `@monaco-editor/react`.
- *Bundle size* besar (~2-4MB), namun dapat di-*lazy load* sehingga tidak membebani halaman lain.

```bash
npm install @monaco-editor/react
```

#### Alternatif Ringan: **CodeMirror 6** (via `@uiw/react-codemirror`)
- *Bundle size* jauh lebih kecil (~200KB).
- Cocok jika performa/kecepatan loading menjadi prioritas di atas fitur editor.
- Kurang kaya fitur dibanding Monaco untuk pengalaman coding (tidak ada IntelliSense).

**Keputusan**: Gunakan **Monaco Editor** untuk v1.0.0 dengan *lazy loading* menggunakan `React.lazy()` dan `Suspense`. Prioritas pengalaman murid yang menyerupai IDE nyata.

---

### 7.2. Eksekusi Kode (Code Execution Engine)

Ini adalah bagian **paling kritis dan paling sensitif** dari seluruh sistem. Menjalankan kode dari pengguna asing di server kita langsung adalah **risiko keamanan ekstrem** (Code Injection, DoS, dll).

Berikut strategi per domain bahasa:

#### A. HTML & CSS: Client-Side Sandbox (`iframe` + `srcDoc`)
- **Tidak butuh server** sama sekali.
- Kode HTML/CSS murid di-*inject* langsung ke dalam `<iframe>` menggunakan atribut `srcDoc`.
- Untuk validasi (Test Case), kita menggunakan `iframe.contentDocument.querySelector()` untuk memeriksa elemen yang dihasilkan sesuai ekspektasi (misalnya: "apakah ada elemen `<h1>` dengan teks 'Hello World'?").
- Aman karena `iframe` memiliki *origin isolation* dari halaman utama.

```typescript
// Contoh: Eksekusi HTML/CSS di iframe
<iframe
  srcDoc={`<html><head><style>${cssCode}</style></head><body>${htmlCode}</body></html>`}
  sandbox="allow-scripts" // Batasi apa yang boleh dijalankan
/>
```

#### B. JavaScript: Client-Side Sandbox (`iframe` + `postMessage`)
- Kode JavaScript murid dijalankan di dalam **`<iframe>` yang terisolasi** (origin terpisah).
- Komunikasi antara halaman utama dan `<iframe>` menggunakan `postMessage` API yang aman.
- **Test Cases** berupa script JavaScript yang menjalankan fungsi murid dengan berbagai input dan memeriksa output-nya.
- Tambahkan batas waktu eksekusi (`setTimeout` untuk deteksi *infinite loop*).

#### C. SQL: Server-Side Sandbox dengan Database In-Memory
- **Library Utama: `sql.js`** — ini adalah **SQLite yang dikompilasi ke WebAssembly (WASM)**.
- Berjalan sepenuhnya di **browser murid (Client-Side)**, tanpa panggilan ke server apapun.
- Guru mendefinisikan **schema SQL** (CREATE TABLE + INSERT) sebagai *setup script*.
- Kode SQL murid dijalankan terhadap *in-memory database* SQLite via `sql.js`.
- Test case berupa query SQL yang hasil-nya dibandingkan dengan *expected result set*.

```bash
npm install sql.js
```

> **Catatan Penting SQL.js**: File WASM (`sql-wasm.wasm`) perlu di-*serve* dari folder `public/`. Perlu konfigurasi khusus di `next.config.ts` untuk `headers` dan `asyncWebAssembly`.

**Ringkasan Strategi Eksekusi:**

| Domain | Strategi Eksekusi | Server Diperlukan? | Keamanan |
|---|---|---|---|
| HTML | `<iframe srcDoc>` | ❌ Tidak | ✅ Tinggi (iframe sandbox) |
| CSS | `<iframe srcDoc>` | ❌ Tidak | ✅ Tinggi (iframe sandbox) |
| JavaScript | `<iframe>` + `postMessage` | ❌ Tidak | ✅ Tinggi (iframe sandbox) |
| SQL | `sql.js` (SQLite WASM) | ❌ Tidak | ✅ Tinggi (browser-only) |
| PHP | Docker Container / Judge0 API | ✅ Ya (Fase 2) | ⚠️ Butuh isolasi ketat |

---

### 7.3. Library Pendukung Lainnya

| Kebutuhan | Library | Alasan |
|---|---|---|
| Validasi Form Guru | `zod` + `react-hook-form` | Sudah ada di stack |
| Timer Countdown | `react-countdown-circle-timer` | Visual timer menarik |
| Rich Text Problem Statement | `@tiptap/react` | WYSIWYG editor untuk Guru saat deskripsi soal |
| Diff / Perbandingan Output | `diff` (npm package) | Membandingkan output SQL atau HTML |
| Syntax Highlighting Preview | `@monaco-editor/react` (read-only) | Tampilkan kode solusi murid saat grading |

---

## 8. Spesifikasi ERD Tambahan (v1.0.0 Additions)

Berikut adalah tabel-tabel **baru** yang perlu ditambahkan ke `contract.prisma`. Tabel-tabel lama dari [`ERD_LMS.md`](./ERD_LMS.md) tidak diubah.

### 8.1. Diagram Konseptual Tabel Baru

```
Assignment ──────────── AssignmentQuestion (Pool Soal)
    │                          │
    │                    ┌─────┴──────────────────────┐
    │                    │                            │
    │               QuizOptionAQ              CodeChallenge
    │             (pilihan ganda)           (problem + testcases)
    │
    ├──── AssignmentTarget (ditugaskan ke Classroom/User)
    │
    └──── AssignmentAttempt (percobaan murid)
                │
          AssignmentAnswer (jawaban per soal)
```

### 8.2. Definisi Tabel Baru (DBML Format)

```dbml
// ================================
// ENUM BARU (Tambahan)
// ================================

Enum AssignmentQuestionType {
  MULTIPLE_CHOICE  // Pilihan Ganda
  ESSAY            // Essay / Uraian
  CODE_CHALLENGE   // Tantangan Coding
}

Enum CodeLanguage {
  html
  css
  javascript
  sql
  // php (Fase 2)
}

Enum AssignmentStatus {
  DRAFT            // Sedang dibuat Guru, belum dipublish
  PUBLISHED        // Aktif, murid bisa mengerjakan
  CLOSED           // Ditutup, tidak bisa dikerjakan lagi
}

Enum AssignmentAttemptStatus {
  IN_PROGRESS      // Murid sedang mengerjakan
  SUBMITTED        // Murid sudah submit
  GRADED           // Semua soal sudah dinilai (termasuk essay)
}

// ================================
// TABEL: Assignment
// Paket tugas mandiri yang dibuat oleh Guru
// ================================

Table Assignment {
  id              String    [pk, note: 'UUID']
  createdByUserId String    [note: 'FK → User (GURU yang membuat)']
  title           String    [note: 'Contoh: Tugas 1 - HTML Dasar']
  description     String    [null, note: 'Deskripsi umum tugas (Rich Text / Markdown)']
  status          AssignmentStatus [default: 'DRAFT']
  passingScore    Float     [default: 70.0, note: 'KKM / Minimum passing score (%)']
  timeLimitMinutes Int      [null, note: 'Batas waktu pengerjaan dalam menit. NULL = tanpa batas']
  questionsToShow Int       [null, note: 'Jumlah soal yang ditampilkan per murid dari pool. NULL = tampilkan semua']
  shuffleQuestions Boolean  [default: true, note: 'Acak urutan soal yang ditampilkan ke murid']
  openAt          DateTime  [null, note: 'Waktu tugas mulai bisa dikerjakan. NULL = langsung aktif saat PUBLISHED']
  closeAt         DateTime  [null, note: 'Deadline pengerjaan. NULL = tidak ada deadline']
  createdAt       DateTime  [default: `now()`]
  updatedAt       DateTime
}

// ================================
// TABEL: AssignmentTarget
// Mendefinisikan SIAPA yang mendapat tugas ini.
// Bisa ke seluruh kelas ATAU ke murid tertentu.
// ================================

Table AssignmentTarget {
  id            String    [pk, note: 'UUID']
  assignmentId  String    [note: 'FK → Assignment']
  classroomId   String    [null, note: 'FK → Classroom. Jika diisi, semua murid di kelas ini mendapat tugas']
  studentId     String    [null, note: 'FK → User (MURID). Jika diisi, hanya murid ini yang mendapat tugas']

  Note: 'CHECK: classroomId atau studentId harus diisi (tidak boleh keduanya null). Unique constraint: [assignmentId, classroomId] atau [assignmentId, studentId]'
}

// ================================
// TABEL: AssignmentQuestion
// Bank soal untuk sebuah tugas. Guru bisa menambahkan
// banyak soal ke bank ini. Murid akan mendapat subset
// (sesuai questionsToShow) yang diacak secara random.
// ================================

Table AssignmentQuestion {
  id              String                  [pk, note: 'UUID']
  assignmentId    String                  [note: 'FK → Assignment']
  questionType    AssignmentQuestionType  [note: 'MULTIPLE_CHOICE | ESSAY | CODE_CHALLENGE']
  questionText    String                  [note: 'Teks soal / problem statement (Markdown)']
  points          Float                   [default: 10.0, note: 'Bobot poin soal ini']
  orderIndex      Int                     [note: 'Urutan soal dalam bank (untuk tampilan default)']
  createdAt       DateTime                [default: `now()`]
  updatedAt       DateTime

  Note: 'Satu row ini mewakili satu soal. Detail per tipe disimpan di tabel relasi (AssignmentOption untuk PG, CodeChallenge untuk Coding)'
}

// ================================
// TABEL: AssignmentOption
// Pilihan jawaban untuk soal tipe MULTIPLE_CHOICE.
// Relasi ke AssignmentQuestion.
// ================================

Table AssignmentOption {
  id            String    [pk, note: 'UUID']
  questionId    String    [note: 'FK → AssignmentQuestion']
  optionText    String    [note: 'Teks pilihan jawaban']
  isCorrect     Boolean   [default: false, note: 'Tandai kunci jawaban']
  orderIndex    Int       [note: 'Urutan opsi']
}

// ================================
// TABEL: CodeChallenge
// Detail teknis untuk soal tipe CODE_CHALLENGE.
// One-to-One dengan AssignmentQuestion.
// ================================

Table CodeChallenge {
  id                  String        [pk, note: 'UUID']
  questionId          String        [unique, note: 'FK → AssignmentQuestion (1-to-1)']
  language            CodeLanguage  [note: 'Bahasa yang digunakan: html, css, javascript, sql']
  boilerplateCode     String        [null, note: 'Kode awal / template yang sudah ada di editor murid']
  solutionCode        String        [null, note: 'Kode solusi referensi Guru (tidak tampil ke murid)']
  setupScript         String        [null, note: 'Untuk SQL: script CREATE TABLE + INSERT data awal. Untuk JS: setup environment/mock']
  testCasesJson       String        [note: 'JSON Array berisi test cases. Format: [{id, description, input, expectedOutput, isHidden}]']
  createdAt           DateTime      [default: `now()`]
  updatedAt           DateTime

  Note: 'testCasesJson menyimpan array test case. isHidden=true berarti murid tidak bisa lihat detail test case ini (seperti LeetCode hidden tests)'
}

// ================================
// TABEL: AssignmentAttempt
// Satu percobaan pengerjaan tugas oleh satu murid.
// Seorang murid hanya bisa punya SATU attempt per Assignment.
// ================================

Table AssignmentAttempt {
  id              String                  [pk, note: 'UUID']
  assignmentId    String                  [note: 'FK → Assignment']
  studentId       String                  [note: 'FK → User (MURID)']
  status          AssignmentAttemptStatus [default: 'IN_PROGRESS']
  questionsSnapshot String               [note: 'JSON Array berisi ID soal yang dipilih secara random untuk murid ini. Disimpan agar konsisten jika murid refresh halaman.']
  totalScore      Float                   [null, note: 'Total skor akhir (dihitung setelah semua jawaban dinilai)']
  startedAt       DateTime                [default: `now()`]
  submittedAt     DateTime                [null]
  gradedAt        DateTime                [null, note: 'Waktu semua soal (termasuk essay) selesai dinilai']

  Note: 'Unique constraint pada [assignmentId, studentId]'
}

// ================================
// TABEL: AssignmentAnswer
// Jawaban murid untuk setiap soal dalam attempt-nya.
// ================================

Table AssignmentAnswer {
  id                    String    [pk, note: 'UUID']
  attemptId             String    [note: 'FK → AssignmentAttempt']
  questionId            String    [note: 'FK → AssignmentQuestion']

  // Untuk tipe MULTIPLE_CHOICE
  selectedOptionId      String    [null, note: 'FK → AssignmentOption']

  // Untuk tipe ESSAY
  essayAnswer           String    [null, note: 'Jawaban essay murid (plain text atau Markdown)']
  essayFeedback         String    [null, note: 'Komentar/feedback dari Guru']

  // Untuk tipe CODE_CHALLENGE
  submittedCode         String    [null, note: 'Kode terakhir yang disubmit murid']
  testResultsJson       String    [null, note: 'JSON hasil run test cases terakhir: [{id, passed, actualOutput}]']
  passedTestCount       Int       [null, note: 'Jumlah test case yang lulus']
  totalTestCount        Int       [null, note: 'Total test case yang ada']

  // Penilaian
  isCorrect             Boolean   [null, note: 'Untuk PG: otomatis. Untuk Essay: null sampai dinilai Guru']
  pointsEarned          Float     [default: 0, note: 'Poin yang diperoleh untuk soal ini']

  Note: 'Unique constraint pada [attemptId, questionId]'
}
```

### 8.3. Relasi Antar Tabel Baru

```dbml
// Relasi
Ref: Assignment.createdByUserId > User.id
Ref: AssignmentTarget.assignmentId > Assignment.id
Ref: AssignmentTarget.classroomId > Classroom.id
Ref: AssignmentTarget.studentId > User.id

Ref: AssignmentQuestion.assignmentId > Assignment.id
Ref: AssignmentOption.questionId > AssignmentQuestion.id

Ref: CodeChallenge.questionId - AssignmentQuestion.id  // One-to-One

Ref: AssignmentAttempt.assignmentId > Assignment.id
Ref: AssignmentAttempt.studentId > User.id

Ref: AssignmentAnswer.attemptId > AssignmentAttempt.id
Ref: AssignmentAnswer.questionId > AssignmentQuestion.id
Ref: AssignmentAnswer.selectedOptionId > AssignmentOption.id
```

---

## 9. User Stories & Acceptance Criteria

### US-01: Murid melihat Dashboard
**Sebagai** seorang Murid, **saya ingin** melihat halaman dashboard yang merangkum semua aktivitas belajar saya, **sehingga** saya tahu apa yang harus dikerjakan berikutnya.

**Acceptance Criteria:**
- [ ] Dashboard menampilkan nama dan kelas saya.
- [ ] Widget summary menampilkan jumlah materi aktif, kuis pending, dan tugas pending dengan data akurat dari database.
- [ ] Daftar materi yang perlu diselesaikan terurut dari yang paling mungkin dikerjakan sekarang (UNLOCKED) ke yang masih terkunci (LOCKED).
- [ ] Daftar tugas aktif menampilkan deadline dan status masing-masing.
- [ ] Halaman dashboard dapat diakses dalam waktu < 2 detik (memanfaatkan RSC dan direct Prisma query).

### US-02: Guru membuat Tugas Mandiri
**Sebagai** Guru, **saya ingin** membuat sebuah tugas mandiri dengan soal campuran, **sehingga** murid bisa berlatih koding secara praktikal.

**Acceptance Criteria:**
- [ ] Guru dapat membuat tugas dengan judul, deskripsi, batas waktu, dan passing score.
- [ ] Guru dapat menambahkan soal tipe Pilihan Ganda dengan minimal 2 pilihan dan tepat 1 jawaban benar.
- [ ] Guru dapat menambahkan soal tipe Essay.
- [ ] Guru dapat menambahkan soal tipe Code Challenge dengan memilih bahasa (html/css/javascript/sql).
- [ ] Guru dapat menambahkan minimal 1 test case (visible) dan opsional beberapa test case tersembunyi.
- [ ] Guru dapat menetapkan tugas ke satu atau lebih kelas, atau ke murid tertentu.
- [ ] Guru dapat mem-preview tampilan soal sebelum publish.

### US-03: Murid mengerjakan Code Challenge
**Sebagai** Murid, **saya ingin** menulis kode langsung di browser dan mendapat umpan balik instan, **sehingga** saya tahu apakah solusi saya sudah benar.

**Acceptance Criteria:**
- [ ] Editor kode (Monaco) tampil dengan boilerplate code yang sudah disiapkan Guru.
- [ ] Tombol "Jalankan & Uji" menjalankan kode terhadap test cases yang visible.
- [ ] Hasil setiap test case (✅ Lulus / ❌ Gagal) ditampilkan beserta output aktual.
- [ ] Untuk test case tersembunyi, ditampilkan hanya jumlah yang lulus (tanpa detail).
- [ ] Murid dapat mengulang percobaan berkali-kali sebelum submit.
- [ ] Saat submit, kode terakhir dan hasil tes tersimpan.
- [ ] Jika waktu habis, sistem otomatis submit jawaban terakhir yang ada.

### US-04: Guru menilai Essay
**Sebagai** Guru, **saya ingin** melihat dan menilai jawaban essay murid, **sehingga** skor akhir tugas murid dapat ditentukan.

**Acceptance Criteria:**
- [ ] Terdapat halaman khusus di dashboard Guru untuk melihat daftar jawaban essay yang menunggu penilaian.
- [ ] Guru dapat melihat jawaban essay murid dan memberikan poin (0 - poin maksimal soal) dan komentar.
- [ ] Setelah semua essay dinilai, status `AssignmentAttempt` berubah menjadi `GRADED`.
- [ ] Murid dapat melihat poin dan komentar dari Guru di halaman hasil tugas mereka.

---

## 10. Rencana Implementasi (Fase Pengerjaan)

Berdasarkan **Fase 1-7** yang sudah ada di [`PRD.md`](./PRD.md), fitur-fitur v1.0.0 ini dimasukkan ke dalam fase baru:

### Fase 8: Student Dashboard
1. Buat route `app/(dashboard)/murid/page.tsx` sebagai RSC.
2. Buat Server Action / query Prisma untuk fetch semua data summary dashboard dalam satu fungsi optimal (hindari N+1 queries, gunakan `include`).
3. Implementasi komponen Widget Summary, Daftar Materi, dan Daftar Tugas Aktif.
4. Styling menggunakan panduan **Neo Brutalism** dari [`DESIGN.md`](./DESIGN.md).

### Fase 9: Assignment CRUD (Backend & CMS Guru)
1. Tambahkan model baru ke `contract.prisma` dan buat file migrasi.
2. Buat Server Actions di `app/actions/assignment.ts`.
3. Buat Service Layer di `modules/assignment/` untuk logika pembuatan dan randomisasi soal.
4. Buat halaman CMS Guru: Daftar Tugas, Form Buat/Edit Tugas, Form Tambah Soal.

### Fase 10: Code Challenge Engine (Frontend)
1. Install dan konfigurasi `@monaco-editor/react` dengan *lazy loading*.
2. Buat `modules/code-runner/` berisi utilitas:
   - `htmlCssRunner.ts` — Logika injeksi ke `<iframe srcDoc>` dan evaluasi DOM.
   - `jsRunner.ts` — Logika komunikasi `postMessage` ke sandboxed `<iframe>`.
   - `sqlRunner.ts` — Integrasi `sql.js` untuk eksekusi query SQLite in-browser.
3. Buat komponen `components/code-challenge/` (`CodeEditor.tsx`, `TestCasePanel.tsx`, `OutputConsole.tsx`).

### Fase 11: Assignment Execution (Pengerjaan Murid)
1. Buat route `app/(dashboard)/murid/tugas/[assignmentId]/page.tsx`.
2. Logika pengambilan soal random dan penyimpanan `questionsSnapshot` saat attempt dibuat.
3. Integrasi Code Challenge Engine ke dalam halaman pengerjaan.
4. Implementasi timer countdown.
5. Logika auto-submit saat waktu habis.

### Fase 12: Grading & Laporan
1. Halaman penilaian essay untuk Guru.
2. Halaman hasil tugas untuk Murid (breakdown per soal).
3. Update Widget Dashboard murid secara real-time (atau saat halaman di-refresh) setelah tugas dinilai.

---

## 11. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Infinite loop di kode JS murid membekukan browser | Tinggi | Jalankan kode di dalam `Worker` atau `iframe` dengan timeout `postMessage` max 5 detik |
| Kode SQL murid yang kompleks membebani WASM thread | Sedang | Set kuota waktu eksekusi di `sql.js` |
| `sql.js` WASM file size besar (±1MB) | Rendah | Lazy load hanya saat halaman Code Challenge dibuka |
| Monaco Editor tidak support di browser lama | Rendah | Tampilkan pesan "Gunakan browser modern (Chrome/Firefox terbaru)" |
| Murid curang dengan melihat kode murid lain | Sedang | Randomisasi soal mempersulit contek. Test case tersembunyi mencegah hardcoding jawaban |

---

## 12. Glosarium

| Istilah | Definisi |
|---|---|
| **Assignment** | Paket tugas mandiri yang tidak terikat ke materi |
| **Bank Soal** | Kumpulan soal dalam satu Assignment |
| **questionsSnapshot** | Rekaman ID soal yang dipilih secara acak untuk murid, disimpan agar konsisten |
| **Boilerplate Code** | Kode template awal yang disediakan Guru di editor murid |
| **Test Case** | Pasangan input-output yang digunakan untuk memverifikasi kebenaran kode murid |
| **Hidden Test Case** | Test case yang tidak ditampilkan ke murid, mencegah hardcoding jawaban |
| **Auto-Grading** | Penilaian otomatis oleh sistem tanpa intervensi Guru |
| **Manual Grading** | Penilaian yang harus dilakukan Guru secara manual (untuk Essay) |
| **Code Sandbox** | Lingkungan terisolasi di mana kode murid dijalankan secara aman |

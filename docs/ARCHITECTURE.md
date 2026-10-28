# 🏗️ Architecture & Technical Standards — WebPoint LMS

Dokumen ini mendefinisikan arsitektur teknis menyeluruh, standar rekayasa perangkat lunak, dan pola desain yang diimplementasikan dalam **WebPoint LMS (LMS Mini SMK Mandiri)**.

---

## 1. Executive Overview & System Purpose

**WebPoint LMS** adalah Learning Management System (LMS) modern, modular, dan berperforma tinggi yang dirancang khusus untuk pembelajaran teknis di lingkungan Sekolah Menengah Kejuruan (SMK), khususnya program keahlian Rekayasa Perangkat Lunak (RPL) dan Teknik Komputer & Jaringan (TKJ).

Sistem ini dirancang untuk menyelesaikan tantangan pedagogis spesifik:
1. **Penyajian Materi Bertahap (Sequential Learning)**: Materi disajikan dalam urutan terstruktur dengan *prerequisite unlocking* (siswa harus lulus asesmen materi sebelumnya untuk membuka materi berikutnya).
2. **Asesmen Multidimensi**: Mendukung soal **Pilihan Ganda**, **Essay** (dengan rubrik penilaian manual oleh guru), serta **Code Challenge** interaktif berbasis in-browser IDE multi-file.
3. **Integritas Ujian (Anti-Cheat Engine)**: Pengawasan ujian otomatis meliputi pembatasan layar penuh (*fullscreen*), proteksi pindah tab/jendela (*visibility detection*), dan pemblokiran salin-tempel/inspeksi elemen.
4. **Sentralisasi Nilai & Histori Terarsip**: Rekapitulasi nilai guru (*Gradebook*) berbasis matriks spreadsheet serta tabel agregasi terdenormalisasi untuk performa tinggi.
5. **AI-Assisted Pedagogical Tools**: Pembuatan draf kuis dan rangkuman otomatis menggunakan LLM dengan distribusi tingkat kesulitan (Easy, Medium, Hard/HOTS).
6. **Dual-Theme Design Architecture**: Pemisahan identitas visual antara antarmuka siswa/publik (*Tactile Neo Brutalism*) dan antarmuka manajemen guru/admin (*Clean Minimalist Modernism*).

---

## 2. Core Tech Stack & Dependencies

| Lapisan / Komponen | Teknologi | Versi / Keterangan |
| :--- | :--- | :--- |
| **Framework Aplikasi** | Next.js (App Router) | `16.2.12` (React Server Components, Server Actions) |
| **UI Library** | React & React DOM | `19.2.4` |
| **Bahasa Pemrograman** | TypeScript | `^5.0.0` (Strict Mode diaktifkan) |
| **Database** | PostgreSQL | 15 / 16 |
| **Database ORM** | Prisma 8 (Contract-driven) | `@prisma/orm-postgres` (`8.0.0-rc.11`), `@prisma/cli-engine` |
| **Styling & CSS** | Tailwind CSS v4 | `@tailwindcss/postcss` (`^4.0.0`) |
| **Code Editor** | Monaco Editor | `@monaco-editor/react` (`^4.7.0`) |
| **In-Browser Sandbox** | Virtual File System (Custom) | Bundler client-side untuk HTML/CSS/JS dalam sandboxed iframe |
| **Autentikasi & Sesi** | Stateless/Stateful Hybrid JWT | `jose` (`^6.2.12`), `bcryptjs` (`^3.0.3`) via HttpOnly Cookies |
| **Validasi Skema** | Zod | `zod` (`^4.6.5`) untuk Form & API payload validation |
| **File Processing** | SheetJS (xlsx) | `xlsx` (`^0.18.5`) untuk bulk import/export soal kuis |
| **Markdown & Syntax** | React Markdown & Syntax Highlighting | `react-markdown` (`^10.1.0`), `react-syntax-highlighter` |
| **AI Integration** | OpenAI-Compatible API / 9Router | `ai` (`^7.0.107`), `@ai-sdk/openai` (`^4.0.71`), endpoint 9Router |
| **Containerization** | Docker & Docker Compose | Multi-stage build (`node:22-alpine`), isolated network |

---

## 3. Dual-Theme Design Architecture

WebPoint LMS mengadopsi prinsip desain yang terpisah secara tegas antara antarmuka Murid dan antarmuka Guru/Admin:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        WEBPOINT LMS UI STRATEGY                        │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
         ┌─────────────────────────┴─────────────────────────┐
         ▼                                                   ▼
┌─────────────────────────────────┐         ┌─────────────────────────────────┐
│     STUDENT & PUBLIC REALM      │         │       ADMIN & TEACHER CMS       │
│     "Tactile Neo Brutalism"     │         │  "Clean & Minimalist Modernism" │
├─────────────────────────────────┤         ├─────────────────────────────────┤
│ • Canvas: #EAF4ED (Pale Mint)   │         │ • Background: bg-gray-50        │
│ • Primary: #2A835F (Jade Green) │         │ • Cards: bg-white rounded-xl    │
│ • Deep Pine: #12544F            │         │ • Borders: border-gray-200      │
│ • Dark Accent: #092328          │         │ • Collapsible Sidebar (w-64/20) │
│ • Heavy Ink: border-4 border-0  │         │ • Soft typography & subtle icons│
│ • Hard offset drop-shadows      │         │ • Function over Form            │
│ • Zero-blur policy              │         │ • High data-density views       │
│ • Physical push button physics  │         │ • Spreadsheet-like gradebooks   │
│ (Lihat: docs/DESIGN.md)         │         │ (Lihat: docs/DESIGN_ADMIN.md)   │
└─────────────────────────────────┘         └─────────────────────────────────┘
```

1. **Tactile Neo Brutalism (Halaman Murid, Course, Public)**:
   - Diterapkan pada Landing Page, Halaman Materi Pembelajaran (`/course/*`), Kuis Engine Modal, dan Dashboard Murid (`/student/*`).
   - Menghadirkan *gamified*, *tangible*, dan *playful environment* yang membangkitkan fokus dan keterlibatan siswa SMK.
   - Karakteristik: Tanpa blur (`no-backdrop-blur`), sudut kaku (`rounded-none`), bayangan keras (`shadow-[4px_4px_0px_0px_#000]`), border hitam solid `border-4 border-black`.

2. **Clean & Minimalist Modernism (CMS Guru & Superadmin)**:
   - Diterapkan pada `/dashboard/*` (Kuis, Rekap Nilai, Pengguna, Kelas, Materi, Audit Log, Arsip).
   - Menghadirkan lingkungan kerja cepat, bebas distraksi visual, dan efisien untuk analisis data serta penilaian.
   - Karakteristik: Ruang kosong luas, kartu `rounded-xl`, garis pemisah halus `border-gray-200`, sidebar responsif (*collapsible* ke mode ikon atau *mobile drawer*).

---

## 4. Comprehensive Directory & File Structure

```text
/
├── app/                                 # Next.js App Router (Presentation & Controllers)
│   ├── (auth)/                          # Route Group: Autentikasi Pengguna
│   │   ├── login/                       # Halaman login & action
│   │   └── register/                    # Halaman pendaftaran & action
│   ├── (dashboard)/                     # Route Group: Ruang Kerja Pengguna
│   │   ├── (admin)/dashboard/           # Area CMS khusus SUPERADMIN & GURU
│   │   │   ├── layout.tsx               # Admin layout shell (memblokir Murid)
│   │   │   ├── page.tsx                 # Overview analitik & quick action
│   │   │   ├── archives/                # Histori penyelesaian kuis (QuizCompletionRecord)
│   │   │   ├── audit-logs/              # Log audit sistem & pelacakan aktivitas
│   │   │   ├── classes/                 # Manajemen kelas & kode join
│   │   │   ├── courses/                 # Manajemen mata pelajaran & assignment guru
│   │   │   ├── gradebook/               # Rekapitulasi nilai (Matriks siswa x kuis)
│   │   │   │   └── review/[attemptId]/  # Halaman review & penilaian essay/code challenge
│   │   │   ├── materi/                  # CMS Silabus: Kategori materi & urutan
│   │   │   │   └── [categoryId]/pages/  # CMS Halaman materi & prasyarat kelulusan
│   │   │   ├── my-courses/              # Mata pelajaran yang diampu guru saat ini
│   │   │   ├── quizzes/                 # Bank kuis & paket asesmen
│   │   │   │   ├── create/              # Pembuatan kuis (terikat Course atau Page)
│   │   │   │   ├── [id]/edit/           # Editor parameter paket kuis
│   │   │   │   └── variants/[id]/questions/ # Editor soal kuis & konfigurasi Anti-Cheat
│   │   │   ├── reports/                 # Laporan analitik performa kelas & ekspor
│   │   │   ├── settings/                # Pengaturan institusi & profil pengajar
│   │   │   ├── student-access/          # Monitoring & bypass progres materi siswa
│   │   │   │   └── [studentId]/         # Rincian status buka/kunci materi per siswa
│   │   │   ├── summaries/               # Rangkuman materi & AI Generator
│   │   │   │   └── [pageId]/            # Editor rangkuman & generator kuis/AI
│   │   │   └── users/                   # Manajemen akun, reset password, & riwayat siswa
│   │   └── (student)/student/           # Area khusus MURID
│   │       ├── layout.tsx               # Student shell (StudentDashboardShell)
│   │       ├── materi/                  # Indeks seluruh modul & progress belajar
│   │       ├── progress/                # Ringkasan ketercapaian silabus & asesmen
│   │       ├── riwayat-nilai/           # Arsip nilai & feedback guru yang diterima
│   │       ├── settings/                # Pengaturan profil murid
│   │       └── tugas/                   # Daftar tugas mandiri & kuis yang aktif
│   ├── actions/                         # Sentralisasi Server Actions (Cross-cutting)
│   │   ├── access.ts                    # Mutasi izin akses materi
│   │   ├── course.ts                    # Mutasi CRUD & enroll mata pelajaran
│   │   ├── essay-grading.ts             # Penilaian manual essay & feedback
│   │   ├── gradebook.ts                 # Query agregasi data rekap nilai
│   │   ├── materi.ts                    # Mutasi silabus kategori & halaman
│   │   ├── pages.ts                     # CRUD halaman materi
│   │   ├── settings.ts                  # Mutasi pengaturan profil
│   │   ├── student-access.ts            # Akses kontrol per siswa
│   │   ├── student-courses.ts           # Pendaftaran kelas & kursus siswa
│   │   ├── student-progress.ts          # Sinkronisasi status kelulusan materi
│   │   ├── student-quiz-answers.ts      # Pengambilan jawaban siswa
│   │   ├── summary.ts                   # Mutasi data rangkuman materi
│   │   └── syllabus.ts                  # Pengurutan silabus kurikulum
│   ├── actions.ts                       # Root server actions (Session, Auth check, Logout)
│   ├── api/test/                        # Diagnostic API endpoint
│   ├── code-preview/[answerId]/         # In-browser Code Reviewer untuk guru & murid
│   ├── course/                          # Halaman Pembelajaran Siswa (Materi Interaktif)
│   │   ├── layout.tsx                   # Layout materi dengan sidebar dinamis & progress
│   │   ├── [courseSlug]/                # Index halaman mata pelajaran
│   │   │   └── [pageSlug]/              # Dynamic reader materi pembelajaran
│   │   ├── ddpk-tkj/                    # Jalur materi statis: Dasar-dasar Program Keahlian TKJ
│   │   ├── kik/                         # Jalur materi statis: Komputer & Jaringan Komunikasi
│   │   └── pemrograman-web-dasar/       # Jalur materi statis: Web Dasar (HTML, CSS, JS, PHP, SQL)
│   ├── join-class/                      # Halaman aktivasi kelas bagi murid baru
│   ├── rapor/                           # Rapor nilai komprehensif murid
│   ├── unauthorized/                    # Tampilan 403 / akses ditolak
│   ├── globals.css                      # Tailwind v4 import & custom styles
│   ├── layout.tsx                       # Root layout (Space Grotesk & Inter font)
│   └── page.tsx                         # Landing page utama (Neo Brutalism)
│
├── components/                          # Reusable UI Component Library
│   ├── AccessGuard.tsx                  # Conditional render berbasis Role pengguna
│   ├── CodeBlock.tsx                    # Syntax highlighter dengan tombol Copy & Terminal style
│   ├── DashboardShell.tsx               # Wrapper layout admin modern
│   ├── DashboardSidebar.tsx             # Collapsible modern sidebar guru/admin
│   ├── Headbar.tsx                      # Top bar navigasi publik/siswa
│   ├── MarkdownContent.tsx              # Renderer markdown materi
│   ├── Sidebar.tsx                      # Sidebar navigasi materi pembelajaran
│   ├── dashboard/                       # Komponen spesifik dashboard admin/guru
│   │   ├── AdminSettingsView.tsx        # View pengaturan admin
│   │   ├── DashboardContent.tsx         # Quick metrics & widget agregasi
│   │   ├── DashboardSkeleton.tsx        # Loading skeleton placeholder
│   │   ├── RecentActivities.tsx         # Feed aktivitas & pengerjaan kuis terbaru
│   │   ├── StatCard.tsx                 # Kartu ringkasan angka statistik
│   │   └── StudentSidebar.tsx           # Navigasi samping khusus murid
│   ├── quiz/                            # Komponen manajemen kuis CMS
│   │   ├── AdminModal.tsx               # Modal popup serbaguna admin
│   │   ├── AntiCheatManager.tsx         # Form switch konfigurasi anti-cheat per varian
│   │   ├── CodeAnswerPreview.tsx        # Embed cuplikan jawaban coding
│   │   ├── QuestionBank.tsx             # Pengelola bank soal & tipe pertanyaan
│   │   ├── QuizAssignmentView.tsx       # Alokasi kuis ke kelas/siswa tertentu
│   │   ├── QuizPackageForm.tsx          # Form meta paket kuis (timer, passing grade)
│   │   └── VariantList.tsx              # Manajemen varian soal kuis
│   ├── quiz-engine/                     # Runtime pengerjaan kuis siswa
│   │   ├── CodeChallengeModal.tsx       # IDE coding browser (Monaco + Preview + Console)
│   │   ├── FileExplorer.tsx             # Tree explorer multi-file virtual proyek
│   │   ├── QuizEngineModal.tsx          # Container modal ujian dengan Anti-Cheat runtime
│   │   ├── QuizModal.tsx                # Tampilan pengerjaan Pilihan Ganda & Essay
│   │   └── QuizTrigger.tsx              # Tombol pemicu kuis di akhir halaman materi
│   ├── quiz-report/                     # Komponen visualisasi laporan
│   │   ├── QuizReportView.tsx           # Rangkuman distribusi nilai & persentase kelulusan
│   │   ├── TaskRecapView.tsx            # Rekap tugas mandiri
│   │   └── UnfinishedStudentsView.tsx   # Daftar murid yang belum menuntaskan tugas
│   └── student/                         # Komponen spesifik antarmuka murid
│       ├── JoinCourseForm.tsx           # Modal input kode mata pelajaran
│       ├── StudentDashboardClient.tsx   # Dashboard interaktif progres belajar murid
│       ├── StudentDashboardShell.tsx    # Shell pembungkus halaman siswa
│       └── StudentSettingsView.tsx      # Manajemen profil & password siswa
│
├── docs/                                # Technical Documentation & Requirements
│   ├── ARCHITECTURE.md                  # Dokumen arsitektur teknis sistem ini
│   ├── DESIGN.md                        # Desain sistem Tactile Neo Brutalism (Siswa)
│   ├── DESIGN_ADMIN.md                  # Desain sistem Clean Modernism (Admin/Guru)
│   ├── ERD_LMS.md                       # Diagram relasi entitas database (DBML)
│   ├── PRD.md / PRD_v1.0.0.md           # Product Requirement Documents
│   └── materi/                          # Raw markdown materi modul pembelajaran
│
├── lib/                                 # Core Infrastructure & Shared Utilities
│   ├── audit.ts                         # Engine pencatat Audit Log terstruktur (v2 JSON)
│   ├── audit-context.ts                 # Context metadata untuk pelacakan transaksi
│   ├── audit-messages.ts                # Kamus format pesan aktivitas pengguna
│   ├── session.ts                       # Manajemen JWT (jose), validasi DB, & cookies
│   ├── user-helpers.ts                  # Helper utilitas format profil & identitas
│   └── virtual-fs.ts                    # In-memory Virtual File System & HTML Bundler
│
├── migrations/                          # Prisma database migrations & snapshots
│
├── modules/                             # Domain-Driven Service Layer (Business Logic)
│   ├── ai-quiz/                         # Generator kuis otomatis bertenaga LLM
│   ├── auth/                            # Logika pendaftaran, verifikasi sandi, & login
│   ├── class/                           # Manajemen kelas, alokasi kapasitas, & join code
│   ├── course/                          # Manajemen mata pelajaran & relasi guru/murid
│   ├── dashboard/                       # Agregasi data analitik berkecepatan tinggi
│   ├── gradebook/                       # Kalkulasi matriks rekap nilai siswa
│   ├── quiz/                            # Manajemen paket, varian, & bank soal
│   ├── quiz-assignment/                 # Alokasi paket kuis ke siswa
│   ├── quiz-completion/                 # Idempotent recorder hasil ujian & score cache
│   ├── quiz-engine/                     # Core orchestrator pengerjaan kuis siswa
│   ├── quiz-report/                     # Analisis item soal & rekap kelulusan
│   ├── student-access/                  # Mesin sequensial prasyarat & perizinan halaman
│   └── summary/                         # Generator rangkuman materi & intisari AI
│
├── prisma/                              # Prisma 8 Engine & Database Contract
│   ├── contract.prisma                  # Kontrak skema Prisma 8
│   ├── contract.json                    # Serialized JSON contract hasil emit
│   ├── contract.d.ts                    # TypeScript typings hasil emit
│   └── db.ts                            # Runtime client instansiasi Prisma 8
│
├── public/                              # Aset statis publik (gambar, audio demo, icons)
├── scripts/                             # Script pemeliharaan & seeding data
│   ├── seed-course.ts                   # Inisialisasi mata pelajaran & relasi pengajar
│   ├── test-cleanup.ts                  # Verifikasi penghapusan log audit lawas
│   └── test-delete.ts                   # Pengujian integritas delete audit
├── Dockerfile                           # Multi-stage production container build
├── docker-compose.yaml                  # Konfigurasi container app & PostgreSQL
├── next.config.ts                       # Konfigurasi Next.js 16 compiler & caching
├── prisma.config.ts                     # Konfigurasi CLI Prisma 8
└── proxy.ts                             # Next.js Edge proxy untuk route guard & RBAC
```

---

## 5. Architectural Patterns & Separation of Concerns

WebPoint LMS mengadopsi pola **Layered Hexagonal / Clean Architecture** yang disesuaikan secara ergonomis untuk Next.js App Router:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                              │
│   • React Server Components (RSC) for zero-waterfall server rendering  │
│   • Client Components ('use client') for UI interactivity & Monaco IDE │
│   • Next.js Server Actions ('use server') as Type-Safe RPC Handlers    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       APPLICATION CONTROLLER                           │
│   • Input parsing & Zod schema validation                              │
│   • Identity & RBAC verification via getSession()                      │
│   • StandardActionResponse envelope formatting                         │
│   • Audit log triggering via logAudit()                                │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                         DOMAIN SERVICE LAYER                           │
│   • Pure business rules (modules/*/*.service.ts)                       │
│   • Assessment grading logic & score calculation                       │
│   • Prerequisite checks & sequential unlocking rules                   │
│   • AI prompt orchestration & JSON schema extraction                   │
│   • Idempotent completion archiving & rollup calculations              │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                          DATA ACCESS LAYER                             │
│   • Prisma 8 Contract API: db.orm.public.<Model>                       │
│   • Managed PostgreSQL transactions & constraints                      │
└────────────────────────────────────────────────────────────────────────┘
```

### Standard Action Response Envelope

Semua mutasi Server Actions mengembalikan format terstandarisasi untuk menjamin kepastian parsing pada sisi klien:

```typescript
export type ActionResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>; // Error detail dari Zod
};
```

---

## 6. Key Subsystems & Technical Implementation

### 6.1. Authentication, Sessions & Security (RBAC)

1. **Role-Based Access Control (RBAC)**:
   - `SUPERADMIN`: Hak akses tak terbatas (manajemen institusi, guru, audit logs, pembersihan data).
   - `GURU`: Manajemen kurikulum, pembuatan kuis/tugas, penilaian essay & review kode, visualisasi rekap nilai kelas.
   - `MURID`: Pembacaan materi terbuka, pengerjaan kuis/tugas mandiri, akses laporan nilai pribadi.

2. **Session Validation Pipeline**:
   - Token disimpan dalam cookie `session` berstatus `HttpOnly`, `Secure` (di production), `SameSite=Lax`.
   - **Database-Backed Session Check**: Setiap kali `getSession()` dieksekusi di Server Component/Action, token didekripsi (`jose`), kemudian dicocokkan dengan tabel `Session` di database. Jika akun diblokir (`isActive: false`), peran diubah, atau sesi di-revoke dari perangkat lain, sesi seketika menjadi tidak valid.
   - **Anti Brute-Force**: Model `User` mencatat `failedLoginAttempts`. Melebihi ambang batas akan mengunci akun sementara via `lockedUntil`.

3. **Edge Route Protection (`proxy.ts`)**:
   - Menghadang request ke area terproteksi sebelum menyentuh Next.js tree.
   - Mengalihkan siswa yang belum terdaftar di kelas manapun ke `/join-class`.
   - Mencegah akses lintas role (misal `MURID` mengakses `/dashboard`).

---

### 6.2. Multi-Tenant Course & Classroom Organization

```
┌────────────────────────────────────────────────────────────────────────┐
│                           INSTITUTION MODEL                            │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
         ┌──────────────────────────┴─────────────────────────┐
         ▼                                                    ▼
┌──────────────────┐                                 ┌──────────────────┐
│    Classroom     │ (Contoh: XI RPL 1)              │      Course      │ (Contoh: Web Dasar)
│  • joinCode      │                                 │  • joinCode      │
│  • maxStudents   │                                 │  • coverImage    │
└────────┬─────────┘                                 └────────┬─────────┘
         │                                                    │
         ▼                                    ┌───────────────┴───────────────┐
┌──────────────────┐                          ▼                               ▼
│   User (MURID)   │ ◄──────────────── ┌───────────────┐               ┌───────────────┐
└──────────────────┘                   │ CourseStudent │               │ CourseTeacher │
                                       └───────────────┘               └───────────────┘
                                                                               ▲
                                                                               │
                                                                       ┌───────┴───────┐
                                                                       │  User (GURU)  │
                                                                       └───────────────┘
```

- Murid memiliki **satu kelas utama** (`Classroom`) untuk pengelompokan rapor dan absen.
- Murid dapat bergabung ke **banyak mata pelajaran** (`Course`) menggunakan kode join spesifik mata pelajaran.
- Guru ditugaskan mengampu mata pelajaran tertentu via tabel penghubung `CourseTeacher`.

---

### 6.3. Assessment Engine & Anti-Cheat Subsystem

Ekosistem penilaian pada `QuizPackage` dirancang fleksibel untuk kebutuhan ulangan harian, tugas mandiri, hingga ujian akhir:

1. **Fleksibilitas Relasi Asesmen**:
   - `courseId` (Wajib): Setiap asesmen berada di bawah naungan mata pelajaran.
   - `pageId` (Opsional): Jika terisi, kuis berfungsi sebagai syarat kelulusan materi akhir bab. Jika kosong, kuis berfungsi sebagai **Tugas Mandiri / UTS / UAS**.

2. **3 Tipe Pertanyaan (`QuestionType`)**:
   - `PILIHAN_GANDA`: Auto-graded oleh sistem secara instan saat kuis diselesaikan.
   - `ESSAY`: Jawaban naratif yang dinilai manual oleh guru dengan feedback kualitatif.
   - `CODE_CHALLENGE`: Soal coding praktis interaktif multi-file.

3. **Anti-Cheat Enforcement (`QuizAntiCheatConfig`)**:
   Dikonfigurasi per varian kuis (`QuizVariant`) dengan tiga lapis pertahanan:
   - **Mode Layar Penuh (`enableFullscreen`)**: Memanfaatkan Fullscreen API lintas browser (`requestFullscreen`). Siswa diwajibkan masuk mode layar penuh sebelum soal dibuka.
   - **Deteksi Pindah Tab & Blur (`preventTabSwitch`)**: Memonitor `visibilitychange` dan `window.onblur`. Jika siswa beralih tab, meminimalkan browser, atau membuka aplikasi lain, ujian langsung dihentikan dan diberikan **skor 0 otomatis**.
   - **Pemblokiran Interaksi Curang (`preventCopyPaste`)**: Memblokir klik kanan (`contextmenu`), pemblokiran shortcut keyboard (`Ctrl+C`, `Ctrl+V`, `Ctrl+U`, `F12`, `Ctrl+Shift+I`).

4. **In-Browser IDE & Sandboxed Code Challenge**:
   - **Virtual File System (`lib/virtual-fs.ts`)**: Mengelola struktur file virtual siswa (`Record<string, string>`) di browser tanpa menyentuh disk fisik server.
   - **Monaco Editor (`@monaco-editor/react`)**: Editor kode tingkat industri dengan syntax highlighting dan autocomplete untuk HTML, CSS, JavaScript, JSON, dan PHP.
   - **Client-Side Bundler**: Mem-bundle HTML, CSS internal (`<style data-source="...">`), dan JS internal ke dalam satu data blob yang dijalankan di dalam `<iframe>` ber-atribut `sandbox="allow-scripts"`.
   - **Console Interceptor**: Menyuntikkan runtime listener ke dalam iframe untuk menangkap `console.log`, `console.info`, `console.warn`, dan `console.error` yang kemudian direfleksikan ke panel Console Viewer di editor.
   - **Reviewer Kode Guru (`app/code-preview/[answerId]/`)**: Guru dapat meninjau kode siswa, mengubah ukuran viewport simulasi (Desktop, Tablet, Mobile), menguji interaktivitas, membaca log konsol, dan memberikan nilai serta umpan balik.

---

### 6.4. Sequential Progression & Prerequisite Logic

Materi tidak dapat diakses secara acak. Logika pembukaan materi beroperasi sebagai berikut:

```
[Materi A: Pengenalan HTML] ──► [Kuis Materi A (KKM: 70)] 
                                         │
                                         ▼ (Lulus: Score >= 70)
                               [PageSequence Terpenuhi]
                                         │
                                         ▼
                            [Materi B: Tag Dasar Terbuka!]
```

1. Hubungan prasyarat diatur dalam tabel `PageSequence` (`pageId`, `prerequisitePageId`, `minQuizScore`).
2. Siswa memiliki status akses halaman pada tabel `PageAccess` (`LOCKED`, `UNLOCKED`, `COMPLETED`).
3. Saat kuis diselesaikan dan mencapai KKM (`score >= passingScore`), fungsi `recordQuizCompletion` dan `unlockNextPages` akan otomatis mengubah status materi menjadi `COMPLETED` dan membuka kunci materi penerusnya.
4. Guru/Admin memiliki otoritas untuk me-*override* status akses siswa secara individual maupun massal via modul `student-access`.

---

### 6.5. High-Performance Denormalization & Historical Archives

Untuk menghindari query `JOIN` yang berat saat menampilkan riwayat atau rapor kelas:

1. **`QuizCompletionRecord` (Tabel Imutabel)**:
   - Setiap kali siswa menuntaskan kuis atau tugas, satu baris rekaman permanen dimasukkan (`INSERT`).
   - Menyimpan *snapshot* nama siswa, email, nama kelas, judul kuis, nama bab, nilai, status kelulusan, dan waktu pengerjaan.
   - Data historis ini tetap valid dan tidak berubah meskipun akun siswa atau kuis terkait diedit atau dihapus di kemudian hari.

2. **`StudentScoreSummary` (Tabel Cache Agregasi)**:
   - Menyimpan satu baris per siswa berisi: total kuis diselesaikan, total kuis lulus, rata-rata nilai materi, rata-rata tugas mandiri, total poin, dan waktu aktivitas terakhir.
   - Diperbarui secara otomatis setiap kali ada nilai baru atau revisi penilaian essay oleh guru. Menjadikan query dashboard siswa dan pelaporan hanya membutuhkan **satu query baris tunggal**.

---

### 6.6. AI Integration & Pedagogical Automation

Modul `modules/ai-quiz` dan `modules/summary` mengotomatisasi pekerjaan administratif pengajar:

1. **AI Quiz Generation (`ai.service.ts`)**:
   - Guru memilih materi rujukan, jumlah soal, dan distribusi kesulitan: contoh 50% Mudah, 30% Sedang, 20% HOTS (Sulit).
   - Prompt sistem menginstruksikan LLM untuk menghasilkan format JSON tervalidasi skema Zod (`aiMultipleChoiceSchema` atau `aiEssaySchema`).
   - Menghasilkan draf soal yang dapat diedit langsung oleh guru sebelum diterbitkan ke bank soal.

2. **AI Summary Extraction**:
   - Membaca teks materi pembelajaran dan menyusun rangkuman komprehensif.
   - Jika materi melebihi 3000 kata, model secara adaptif membagi konten menjadi **Rangkuman Rinci** dan **Intisari Poin Kunci**.

---

### 6.7. Comprehensive Audit Logging Subsystem

Semua operasi krusial pada sistem dicatat ke dalam tabel `AuditLog`:

1. **Struktur Data Log (Versi 2)**:
   ```json
   {
     "v": 2,
     "message": "Guru Fulan memperbarui nilai essay siswa Ahmad",
     "meta": {
       "attemptId": "uuid-xxx",
       "pointsEarned": 85,
       "questionId": "uuid-yyy"
     }
   }
   ```
2. **Kategori Aktivitas yang Dicatat**:
   - Perubahan struktur materi (kategori, urutan, publikasi).
   - Penilaian kuis manual & feedback essay.
   - Bypass perizinan buka materi siswa.
   - Ekspor rekap nilai & laporan kelas.
   - Pembersihan otomatis arsip log audit yang telah berusia lebih dari 30 hari.

---

## 7. Database Entity Relationships (Prisma Contract Schema)

```mermaid
erDiagram
    Classroom ||--o{ User : "contains"
    Classroom ||--o{ StudentScoreSummary : "cached for"
    Classroom ||--o{ QuizCompletionRecord : "historical"

    User ||--o{ Session : "has"
    User ||--o{ AuditLog : "triggers"
    User ||--o{ QuizAttempt : "attempts"
    User ||--o{ PageAccess : "accesses"
    User ||--o{ QuizAssignment : "assigned"
    User ||--o| StudentScoreSummary : "owns"
    User ||--o{ QuizCompletionRecord : "recorded"
    User ||--o{ CourseTeacher : "teaches"
    User ||--o{ CourseStudent : "enrolled"

    Course ||--o{ MaterialCategory : "organizes"
    Course ||--o{ QuizPackage : "contains"
    Course ||--o{ CourseTeacher : "assigned teachers"
    Course ||--o{ CourseStudent : "enrolled students"

    MaterialCategory ||--o{ Page : "has pages"

    Page ||--o{ PageSummary : "contains summaries"
    Page ||--o| QuizPackage : "optional quiz"
    Page ||--o{ PageAccess : "student progress"
    Page ||--o| PageSequence : "unlock requirement"
    Page ||--o{ PageSequence : "is prerequisite for"

    QuizPackage ||--o{ QuizVariant : "has variants"
    QuizPackage ||--o{ QuizAssignment : "distributed via"

    QuizVariant ||--o| QuizAntiCheatConfig : "protected by"
    QuizVariant ||--o{ Question : "contains"
    QuizVariant ||--o{ QuizAttempt : "attempted on"

    Question ||--o{ QuestionOption : "multiple choice options"
    Question ||--o{ StudentAnswer : "answered by"

    QuizAttempt ||--o{ StudentAnswer : "includes"
    QuestionOption ||--o{ StudentAnswer : "selected option"
```

---

## 8. Deployment, Containerization & Infrastructure

Aplikasi disiapkan untuk deployment mandiri berbasis Docker pada Virtual Private Server (VPS) institusi:

### A. Multi-Stage Dockerfile Lifecycle
1. **Stage 1 (`deps`)**: Node 22 Alpine, instalasi dependensi via `npm install` dengan dependensi OS native (`openssl`, `libc6-compat`).
2. **Stage 2 (`builder`)**: Menjalankan `npx prisma contract emit` untuk men-generate kode typescript kontrak, disusul `npm run build` Next.js.
3. **Stage 3 (`runner`)**: Image production minimal hanya membawa artefak `.next`, node_modules produksi, dan file migrasi Prisma, dijalankan di port 3001.

### B. Konfigurasi Lingkungan (`.env`)
```bash
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/webpoint_lms?schema=public"

# Keamanan Sesi
JWT_SECRET="kunci-rahasia-jwt-produksi-minimal-32-karakter"

# Integrasi AI
ENABLE_AI_FEATURES="true"
NINEROUTER_API_KEY="nr-xxxxxxxxxxxxxxxxxxxx"
NINEROUTER_BASE_URL="https://api.9router.com/v1"
```

### C. Alur Migrasi Database Prisma 8
```bash
# 1. Mengubah skema kontrak
# Edit prisma/contract.prisma

# 2. Emit file kontrak TypeScript dan JSON
npm run contract:emit

# 3. Jalankan migrasi database
npx prisma db migrate
```

---

## 9. Code Quality & Contribution Standards

1. **Strict Type Safety**: Dilarang menggunakan `any` tanpa alasan arsitektural yang jelas. Gunakan `unknown` dengan type-guarding atau definisi interface eksplisit.
2. **Separation of UI and Business Logic**: Semua logika database query kompleks dan kalkulasi nilai dilarang ditulis di dalam file `page.tsx` atau komponen view; pisahkan ke dalam `modules/{feature}/{feature}.service.ts`.
3. **Design System Adherence**: 
   - Halaman publik & murid wajib merujuk ke token `docs/DESIGN.md` (*Tactile Neo Brutalism*).
   - Halaman admin/guru wajib merujuk ke token `docs/DESIGN_ADMIN.md` (*Clean Minimalist*).
4. **Idempotency in Mutations**: Seluruh server actions pencatatan hasil kuis wajib mengimplementasikan pengecekan idempotensi untuk mencegah duplikasi nilai saat koneksi internet siswa tidak stabil.

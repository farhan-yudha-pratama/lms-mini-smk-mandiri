# 🏗️ Architecture & Technical Standards - WebPoint LMS

Dokumen ini mendefinisikan arsitektur teknis, standar penulisan kode, dan pola desain yang digunakan dalam pengembangan WebPoint LMS.

---

## 1. Tech Stack & Environment
- **Framework Utama**: Next.js 16 (App Router).
- **Bahasa**: TypeScript (Strict Mode).
- **Database**: PostgreSQL.
- **ORM**: Prisma 8 (`@prisma/orm-postgres`).
- **Styling**: Tailwind CSS v4.
- **Authentication**: Custom JWT (menggunakan `jose` dan `bcryptjs`) disimpan pada HttpOnly Secure Cookies.
- **Validation**: Zod (untuk validasi input form dan payload API).
- **AI**: Vercel AI SDK (`ai`, `@ai-sdk/openai`).

---

## 2. Directory & Module Structure
Struktur direktori dipisahkan secara modular untuk memisahkan UI, logika bisnis, dan utilitas.

```text
/
├── app/                  # Next.js App Router
│   ├── (arsitektur-web)/ # Route group materi
│   ├── (auth)/           # Route group untuk halaman Login & Register
│   ├── (bootstrap)/      # Route group materi
│   ├── (css)/            # Route group materi
│   ├── (dashboard)/      # Route group untuk layout Dashboard
│   ├── (database)/       # Route group materi
│   ├── (html)/           # Route group materi
│   ├── (js)/             # Route group materi
│   ├── (php)/            # Route group materi
│   ├── actions/          # Server Actions (access.ts, materi.ts, dll)
│   ├── globals.css       # Tailwind base styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Halaman utama (Landing Page)
├── components/           # Reusable UI components
│   ├── quiz/             # Komponen kuis (engine & report)
│   ├── AccessGuard.tsx   # Guard komponen berbasis role
│   ├── CodeBlock.tsx     # Komponen syntax highlighter materi
│   ├── DashboardShell.tsx# Komponen layout dashboard
│   ├── DashboardSidebar.tsx # Sidebar khusus dashboard
│   ├── Headbar.tsx       # Komponen navigasi atas
│   └── Sidebar.tsx       # Komponen navigasi samping
├── docs/                 # Dokumentasi (ARCHITECTURE.md, ERD_LMS.md, dll)
├── lib/                  # Konfigurasi library & utilitas umum
│   ├── session.ts        # Utilitas manajemen JWT & Cookie
│   └── user-helpers.ts   # Helper data user
├── migrations/           # File migrasi database
├── modules/              # Business Logic (Service Layer untuk LMS)
│   ├── ai-quiz/          # Generator kuis berbasis AI
│   ├── auth/             # Logika verifikasi dan JWT
│   ├── class/            # Manajemen kelas
│   ├── quiz/             # Logika validasi dan assignment kuis
│   ├── quiz-engine/      # Core logic pengerjaan kuis
│   ├── quiz-report/      # Laporan nilai
│   └── summary/          # Ekstraksi dan pembuatan rangkuman
├── prisma/               # Schema dan konfigurasi Prisma
│   ├── contract.prisma   # Definisi model database LMS
│   └── db.ts             # Instansiasi Prisma client
└── public/               # Asset statis
```

---

## 3. Separation of Concerns & Design Patterns
Kita menggunakan variasi **Service Pattern** untuk memisahkan antara *UI Layer* dan *Business Logic*.

1. **Controller / Handler Layer** (`app/actions/` atau Page Components):
   - Server Actions (`app/actions/*.ts`).
   - Bertugas memvalidasi input, dan memanggil Service Layer.
2. **Service Layer** (`modules/`):
   - Tempat *Business Logic* berada (contoh `modules/quiz-engine/`).
   - Tidak berurusan langsung dengan HTTP Request/Response secara mentah, namun menerima parameter fungsi.
3. **Data Access Layer** (via `Prisma`):
   - Digunakan di dalam Service Layer. Query langsung ke database (`db.user.findUnique()`).

---

## 4. Data Validation & Security Standards

### A. Data Validation (Zod)
- Semua input dari klien (Form Data / JSON) **WAJIB** divalidasi menggunakan Zod sebelum diproses.
- Schema diletakkan berdekatan dengan fitur atau di dalam folder `modules/{feature}/schemas.ts`.

### B. Security Standards
- **XSS Prevention**: Menggunakan default sanitization React.
- **Token Security**: JWT **tidak pernah** dikembalikan ke body response. Token langsung di-set ke Header sebagai `Set-Cookie` dengan opsi: `HttpOnly`, `Secure` (di production), `SameSite=Lax/Strict`, dan `Path=/`.
- **Password Hashing**: Menggunakan `bcryptjs` dengan *salt rounds* minimal 10.

---

## 5. Standardized Response & Error Handling
Baik Server Actions maupun API Routes harus mengembalikan struktur data yang konsisten.

### A. Standard Action Response
Server actions selalu mereturn object standar:
```typescript
type ActionResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>; // Untuk validasi error dari Zod
};
```

### B. Error Handling
- Jangan membocorkan error database (contoh: Prisma constraint error) ke klien.
- Tangkap error di try-catch pada Service/Action layer dan kembalikan pesan *user-friendly* (contoh: "Email sudah digunakan").

---

## 6. State Management & Data Fetching Strategy

### Server Components vs Client Components
- **Default**: Gunakan **React Server Components (RSC)** untuk melakukan fetching data secara langsung dari database menggunakan Prisma (tanpa fetch/API). Ini membuat aplikasi sangat cepat dan SEO friendly.
-Gunakan `"use client"` **hanya** ketika membutuhkan interaktivitas (onClick, useState, form handling, hooks).

### Client State
- State lokal form menggunakan `useState` atau React Hook Form.
- Jika ada state global (misal status sidebar toggle), gunakan `Zustand` atau React `Context`.

---

## 7. Authentication & Authorization Flow

1. **Login Action**: Menerima kredensial, verifikasi hash, *generate* JWT, pasang ke HttpOnly Cookie.
2. **Middleware (`middleware.ts`)**:
   - Berjalan sebelum request mencapai halaman/API.
   - Mengambil cookie JWT, memverifikasi *signature*.
   - Mengekstrak isi payload (Role: `MURID`, dll).
   - **Route Guarding**: Jika payload role adalah `MURID` mencoba mengakses `/dashboard/guru`, Middleware akan me-redirect (HTTP 307) ke `/unauthorized` atau halaman home.

---

## 8. Database Strategy (Migration & Seeding)

- **Perubahan Skema**: Karena menggunakan Prisma 8, skema didefinisikan dalam `prisma/contract.prisma`. Perubahan perlu diikuti dengan `npm run contract:emit` (atau sejenisnya) dan migrasi diletakkan di dalam folder root `migrations/`.
- **Seeding Data**: 
  - File seeding bisa berupa script `.ts` (seperti `scratch_db.ts`) atau raw SQL (seperti `seed_materi.sql`).
  - Digunakan untuk mendaftarkan akun SUPERADMIN atau untuk inisialisasi data materi dan kategori (seperti HTML, CSS) di lingkungan baru.

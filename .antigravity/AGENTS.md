# AI Agent Directives & Context — WebPoint LMS

## 1. Role & Identity (Persona & Standar Kualitas)
Kamu adalah **Principal Fullstack Engineer** (Next.js 16 + React 19 + TypeScript) sekaligus **Database & LMS Architect** berpengalaman tinggi.
Fokus utamamu adalah menghasilkan kode yang bersih (*clean code*), *type-safe*, berperforma tinggi, aman, dan mudah dirawat. Setiap solusi teknis harus mematuhi arsitektur modular yang sudah ada dan tidak merusak konvensi sistem.

---

## 2. Context Pointers (Single Source of Truth)
Sebelum menulis kode atau membuat keputusan arsitektur, kamu **WAJIB** membaca dan merujuk pada dokumen-dokumen berikut:
- **`docs/ARCHITECTURE.md`**: Arsitektur teknis lengkap, Service Layer, standar respon, anti-cheat, in-browser IDE, dan alur data.
- **`docs/PRD.md` & `docs/PRD_v1.0.0.md`**: Persyaratan produk, alur bisnis, asesmen (Pilihan Ganda, Essay, Code Challenge), dan peran (Superadmin, Guru, Murid).
- **`docs/DESIGN.md`**: Panduan desain UI/UX **Tactile Neo Brutalism** (khusus Halaman Publik, Pembelajaran `/course/*`, dan Dashboard Murid `/student/*`).
- **`docs/DESIGN_ADMIN.md`**: Panduan desain UI/UX **Clean & Minimalist Modernism** (khusus CMS `/dashboard/*` Guru & Superadmin).
- **`docs/ERD_LMS.md`**: Rancangan relasi database konseptual (DBML).
- **`prisma/contract.prisma`**: **Source of Truth** skema database aktual (Prisma 8). Dilarang mengasumsikan nama tabel atau kolom di luar file ini.

---

## 3. Framework & Toolchain Runtime Rules

### A. Next.js 16 & React 19 Rules
- **Server Components Pertama**: Gunakan React Server Components (RSC) secara default untuk *data fetching* langsung dari database (tanpa fetch HTTP overhead).
- **Directives `"use client"`**: Gunakan hanya pada komponen interaktif daun (*leaf components*) seperti modal, Monaco editor, canvas preview, atau form controls.
- **Server Actions**: Letakkan Server Actions di `app/actions/*.ts` atau berdekatan dengan fitur (`*.action.ts`), selalu awali dengan `'use server'`.
- **Response Format**: Selalu kembalikan amplop standar `ActionResponse<T>`:
  ```typescript
  export type ActionResponse<T = unknown> = {
    success: boolean;
    message: string;
    data?: T;
    errors?: Record<string, string[]>;
  };
  ```

### B. Prisma 8 Contract Workflow & Syntax
> [!IMPORTANT]
> Proyek ini menggunakan **Prisma 8 Contract-Driven ORM** (`@prisma/orm-postgres`), **BUKAN** Prisma Client v4/v5 konvensional (`prisma.user.findMany`).

1. **Sintaks Query Prisma 8**:
   - Ambil data semua: `await db.orm.public.ModelName.all();`
   - Ambil data bersyarat: `await db.orm.public.ModelName.where({ field: value }).all();`
   - Ambil satu baris: `await db.orm.public.ModelName.where({ field: value }).first();`
   - Buat rekaman: `await db.orm.public.ModelName.create({ ... });`
   - Update rekaman: `await db.orm.public.ModelName.where({ id }).update({ ... });`
   - Hapus rekaman: `await db.orm.public.ModelName.where({ id }).delete();`
2. **Alur Modifikasi Skema**:
   - Edit skema di `prisma/contract.prisma`.
   - Jalankan `npm run contract:emit` untuk meregenerasi `prisma/contract.d.ts` dan `prisma/contract.json`.
   - Jalankan migrasi database via `npx prisma db migrate`.

### C. In-Browser IDE & Virtual File System (`lib/virtual-fs.ts`)
- Fitur `CODE_CHALLENGE` mengandalkan Virtual File System berbasis memori (`VirtualProjectFiles = Record<string, string>`).
- Selalu gunakan helper `parseProjectFiles()`, `serializeProjectFiles()`, dan `bundleVirtualProject()` saat memanipulasi jawaban atau inisialisasi kode tantangan.
- Jangan pernah menyimpan file proyek virtual siswa langsung ke disk fisik server.

---

## 4. UI/UX Dual-Theme Policy (Aturan Estetika Mutlak)

Dilarang keras mencampuradukkan gaya visual kedua domain:
1. **Area Murid & Materi Pembelajaran (`/`, `/course/*`, `/student/*`)**:
   - Wajib mematuhi **Tactile Neo Brutalism** ([docs/DESIGN.md](file:///d:/Kerja/mandiri/lms-mini-smk-mandiri/docs/DESIGN.md)).
   - Border tebal hitam (`border-4 border-black`), offset hard shadows (`shadow-[4px_4px_0px_0px_#000]`), tombol push fisik (`hover:translate-x-[2px] active:translate-x-[4px] active:shadow-none`), canvas `#EAF4ED`, tanpa ambient blur (*zero-blur policy*).
2. **Area Guru & Superadmin (`/dashboard/*`)**:
   - Wajib mematuhi **Clean & Minimalist Modernism** ([docs/DESIGN_ADMIN.md](file:///d:/Kerja/mandiri/lms-mini-smk-mandiri/docs/DESIGN_ADMIN.md)).
   - Kanvas `bg-gray-50`, kartu putih bertepi tumpul halus (`bg-white rounded-xl border border-gray-200 shadow-sm`), collapsible sidebar responsif, dan kepadatan data tinggi untuk kemudahan review & rekapitulasi nilai.

---

## 5. Security, RBAC & Audit Standards

1. **Active Database Session Validation**:
   - Selalu gunakan `getSession()` dari `@/lib/session` untuk mengekstrak identitas pengguna.
   - Sesi di-check secara *real-time* ke tabel database `Session` untuk mendeteksi penonaktifan akun (`isActive`), perubahan peran, atau *remote logout*.
2. **Input Validation**:
   - Setiap payload Server Actions dan API Route **wajib** divalidasi menggunakan skema **Zod** sebelum dieksekusi.
3. **Audit Trail**:
   - Setiap mutasi data penting (pembuatan/penghapusan modul, penilaian manual essay, bypass akses materi, ekspor laporan) **wajib** mencatat log aktivitas menggunakan:
     ```typescript
     import { logAudit } from "@/lib/audit";
     await logAudit({
       action: "GRADE_ESSAY",
       message: `Guru menilai essay siswa ${studentName}`,
       meta: { attemptId, pointsEarned }
     });
     ```
4. **Anti-Cheat Enforcement**:
   - Jangan pernah melemahkan atau membypass logika anti-cheat di `QuizEngineModal` tanpa permintaan eksplisit pengguna. Pastikan event `fullscreenchange`, `visibilitychange`, dan `window.onblur` tetap terjaga integritasnya.

---

## 6. Operational Guardrails (Batasan & Larangan Mutlak)
- **TIDAK BOLEH** menghapus atau merombak konfigurasi inti (`package.json`, `tsconfig.json`, `next.config.ts`, `prisma.config.ts`, `Dockerfile`) tanpa persetujuan eksplisit.
- **TIDAK BOLEH** menjalankan perintah destruktif seperti `rm -rf`, `drop database`, atau `prisma db push --force-reset`.
- **TIDAK BOLEH** menulis query database langsung di dalam komponen UI atau file `page.tsx`. Semua logika database wajib berada di `modules/{domain}/*.service.ts`.
- **TIDAK BOLEH** mengembalikan token JWT di body JSON atau menyimpannya di `localStorage`. Token hanya boleh berada di HttpOnly Secure Cookie.

---

## 7. Procedural Workflow (SOP Pembuatan & Perbaikan Fitur)
1. **Analisis Konteks**: Baca dokumen rujukan di `docs/` dan periksa skema di `prisma/contract.prisma`.
2. **Rancang Solusi**: Definisikan tipe Zod, kontrak fungsi service, dan komponen UI yang terdampak.
3. **Validasi Skema**: Jika butuh model/kolom baru, tawarkan perubahan skema kontrak ke User terlebih dahulu.
4. **Implementasi Domain Service**: Tulis fungsi murni di `modules/{domain}/`.
5. **Implementasi Controller/Actions**: Buat Server Actions dengan validasi Zod dan amplop `ActionResponse`.
6. **Implementasi UI**: Gunakan komponen React Server/Client dengan tema yang tepat (Neo Brutalism vs Modern Minimalist).
7. **Verifikasi & Format Komunikasi**: Pastikan TypeScript bebas error dan berikan referensi tautan file absolut yang dapat diklik (contoh: `[service.ts](file:///absolute/path/to/service.ts)`).

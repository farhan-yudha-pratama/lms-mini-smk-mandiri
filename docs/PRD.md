# 📄 Product Requirements Document (PRD) - WebPoint LMS

## 1. Overview
WebPoint adalah project web materi pembelajaran yang diekspansi menjadi Mini Learning Management System (LMS). LMS ini memfasilitasi pengelolaan materi secara sekuensial, kuis terintegrasi per halaman materi, pembatasan akses, dan manajemen pengguna dengan sistem multi-role.

## 2. Tujuan
Tujuan ekspansi project ini adalah membangun sistem pembelajaran yang terstruktur, di mana kemajuan siswa dapat dilacak, materi dikendalikan aksesnya secara logis (berdasarkan prasyarat), dan memiliki dasar arsitektur yang siap diintegrasikan dengan AI (untuk *generate* bank soal otomatis).

## 3. Sistem Autentikasi (Authentication System)
- **Metode**: JSON Web Token (JWT).
- **Mekanisme Penyimpanan**: **HttpOnly Secure Cookie**.
  - Token JWT diset dan dikirimkan menggunakan cookie.
  - `HttpOnly`: Mencegah script dari sisi klien (JavaScript/XSS) untuk mengakses token JWT, memberikan tingkat keamanan yang jauh lebih baik dibandingkan menyimpan token di `localStorage`.
  - `Secure`: Cookie hanya akan dikirimkan melalui koneksi yang dienkripsi (HTTPS). Pada environment *development*, Next.js biasanya otomatis mengatur ini.
  - `SameSite=Strict` / `Lax`: Untuk mencegah celah serangan Cross-Site Request Forgery (CSRF).
- **Cakupan Fitur Auth**:
  - Login
  - Register (bisa dibatasi hanya untuk pendaftaran murid).
  - Logout (menghapus cookie secara aman).
  - *Catatan: Fitur "Forget Password" ditiadakan/tidak dimasukkan dalam cakupan scope ini.*
- **Role-Based Access Control (RBAC)**: Pengecekan authorization akan dilakukan melalui Middleware Next.js untuk memverifikasi JWT dan role secara terpusat sebelum *request* mencapai *route* atau API tertentu.

## 4. Multi-Role System
Sistem LMS ini membedakan pengguna menjadi 3 (tiga) tingkatan akses utama:

### 👑 SUPERADMIN
- **Manajemen Pengguna**: Membuat, mengedit, dan menonaktifkan pengguna (semua role).
- **Akses Global**: Memiliki akses ke semua materi, kuis, dan data sistem.
- **Override Limitasi**: Mampu membuka paksa (unlock) atau mengunci materi tertentu untuk murid tertentu jika diperlukan secara administratif.

### 👨‍🏫 GURU
- **Manajemen Materi**: 
  - Membuat kategori mata pelajaran/materi (contoh: HTML, CSS, JavaScript).
  - Mengelola halaman materi (termasuk mengatur *slug* URL, urutan, status *draft/publish*).
  - Mengelola prasyarat (*prerequisites*) halaman materi (alur belajar sekuensial).
  - Mengelola ringkasan halaman materi per section yang disiapkan untuk *generate* soal oleh AI di kemudian hari.
- **Manajemen Evaluasi**: 
  - Membuat kuis per halaman materi beserta parameternya (KKM/Passing score, waktu pengerjaan).
  - Membuat dan mengelola butir soal (Pilihan Ganda dan Essay).
  - Memberikan penilaian pada jawaban Essay yang disubmit oleh murid.
- **Monitoring**: Melihat perkembangan progres belajar dan rekapitulasi nilai para murid.

### 🎓 MURID
- **Akses Belajar**: 
  - Login untuk mengakses sistem.
  - Membuka halaman materi yang berstatus `UNLOCKED`.
  - Membaca halaman materi dan mengerjakan kuis (sebagai prasyarat halaman selanjutnya).
  - Tidak dapat mengakses halaman dengan status `LOCKED`.
- **Evaluasi Diri**: 
  - Melihat riwayat hasil kuis dan poin yang didapatkan.
  - Mengetahui status penyelesaian (Progress) dari materi yang sedang dipelajari.

## 5. Fitur - Fitur Inti (Core Features)

### 5.1. Sequential Learning (Pembelajaran Berurutan)
- **Konsep**: Murid dipaksa untuk menyelesaikan pembelajaran secara bertahap.
- **Mekanisme**:
  - Halaman B menetapkan Halaman A sebagai `prerequisite`.
  - Saat pertama mendaftar, hanya halaman yang tidak memiliki `prerequisite` yang berstatus `UNLOCKED`.
  - Setelah murid membaca Halaman A, mengerjakan kuis, dan mendapatkan nilai $\ge$ *passing score*, sistem akan secara otomatis merubah status Halaman B menjadi `UNLOCKED` untuk murid tersebut.
  - Halaman A akan ditandai sebagai `COMPLETED`.

### 5.2. Material Management by Pages
- Materi tidak hanya disimpan mentah-mentah di satu field panjang database, melainkan dirancang berdasarkan **Halaman (Pages)** yang dikelompokkan dalam **Kategori (Category)**.
- Setiap halaman diakses melalui kombinasi *slug* URL.
  - Contoh: `/materi/html/tag-dasar-html`

### 5.3. Assessment System (Kuis terintegrasi)
- **Satu Kuis per Halaman**: Setiap halaman materi bisa dilengkapi maksimal 1 kuis untuk validasi kompetensi.
- **Tipe Pertanyaan**: Pilihan Ganda (penilaian instan by sistem) dan Essay (menunggu penilaian dari Guru).
- **Time Limit & Passing Score**: Guru dapat menentukan seberapa ketat kuis tersebut.

### 5.4. AI-Ready Summaries (Rangkuman Materi AI)
- Guru dapat memecah sebuah halaman materi panjang menjadi ringkasan-ringkasan pendek per topik (section).
- Data ini secara spesifik disimpan di tabel terpisah (`page_summaries`) agar di iterasi pengembangan berikutnya, sebuah AI LLM dapat disuapi ringkasan tersebut dan diminta men-*generate* soal (Pilihan Ganda/Essay) yang *contextually accurate*.

## 6. Stack Teknologi Utama
- **Framework Frontend & Backend**: Next.js (App Router) - Fullstack.
- **Database ORM**: Prisma.
- **Database System**: PostgreSQL (atau dialek SQL lainnya yang dikonfigurasi).
- **Auth Toolkit**: Custom JWT (menggunakan library `jose` atau `jsonwebtoken`) + Next.js `cookies()`.
- **UI Styling**: Tailwind CSS.

## 7. Fase / Timeline Implementasi Sistem
1. **Fase 1: Infrastruktur Database & Skema**
   - Setup Prisma schema, relasi ERD 11 tabel. (✅ Selesai)
2. **Fase 2: Core Authentication System**
   - Registrasi, Login, Middleware JWT dengan HttpOnly Secure Cookie.
3. **Fase 3: CMS Guru & Superadmin (Material Dashboard)**
   - CRUD Kategori Materi, Halaman, Rangkuman materi, dan Konfigurasi Prasyarat Halaman.
4. **Fase 4: Quiz Engine Engine**
   - Form pembuatan soal, *Assessment interface* untuk murid, kalkulasi skor.
5. **Fase 5: Sequential Learning Engine**
   - Logika status halaman (LOCKED, UNLOCKED, COMPLETED) dan transisi otomatis berdasar hasil kuis.
6. **Fase 6: Analytics & Report (Progress murid & Grading essay).**
7. **Fase 7: Integrasi AI untuk bank soal berbasis *page summaries*.**

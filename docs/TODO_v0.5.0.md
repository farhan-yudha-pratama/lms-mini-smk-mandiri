# 📝 Todo List & Implementation Sequence - v0.5.0
**Target**: Membangun Ekosistem Student Dashboard (WebPoint LMS)

Dokumen ini merinci langkah-langkah implementasi teknis untuk memenuhi spesifikasi pada `PRD_v0.5.0.md`.

---

## Fase 1: Persiapan Server Actions & Query Layer
Fase ini berfokus pada penyiapan endpoint backend (Next.js Server Actions) untuk menarik dan memanipulasi data yang dibutuhkan UI.

- [ ] **1.1. Action: `getStudentScoreSummary`**
  - **Lokasi:** `app/actions/student.ts` (atau `modules/student/`)
  - **Fungsi:** Mengambil data metrik agregasi dari tabel `StudentScoreSummary` berdasarkan `userId` yang sedang login.
- [ ] **1.2. Action: `getRecentQuizActivities`**
  - **Lokasi:** `app/actions/student.ts`
  - **Fungsi:** Mengambil 5 baris terakhir dari tabel `QuizCompletionRecord` untuk `userId` bersangkutan. Diurutkan berdasarkan `completedAt` DESC.
- [ ] **1.3. Action: `getStudentEnrolledCourses`**
  - **Lokasi:** `app/actions/course.ts`
  - **Fungsi:** Menarik daftar `Course` dari relasi `CourseStudent` milik `userId` yang sedang login.
- [ ] **1.4. Action: `joinCourseByCode` (Mutasi)**
  - **Lokasi:** `app/actions/course.ts`
  - **Fungsi:** Menerima input `joinCode`. Validasi Zod. Mencari `Course` terkait. Mengecek apakah murid sudah tergabung. Jika belum, lakukan *insert* ke tabel `CourseStudent`. Kembalikan standar ActionResponse (success/error).

---

## Fase 2: Pembangunan Student Dashboard (`app/page.tsx`)
Fase ini berfokus merangkai UI komponen bergaya Neo Brutalism di halaman beranda.

- [ ] **2.1. Komponen `ScoreMetricsWidget`**
  - Mengambil data dari `getStudentScoreSummary`.
  - UI: 3 Kotak *Card* metrik besar berborder hitam tebal (Total Poin, Rata-rata Kuis, Materi Selesai).
- [ ] **2.2. Komponen `JoinCourseForm` (Client Component)**
  - Form input text (uppercase style) + Submit Button (efek tombol *tactile push*).
  - Terintegrasi dengan Server Action `joinCourseByCode` menggunakan `useTransition` atau React `useActionState` (sebelumnya `useFormState`) untuk status loading dan error.
- [ ] **2.3. Komponen `EnrolledCoursesList`**
  - Menampilkan daftar `Course`.
  - UI: Tiap mapel adalah sebuah kartu (Card) dengan judul tebal, deskripsi, dan tombol CTA "Lihat Silabus" (mengarah ke `/course/[slug]`).
- [ ] **2.4. Komponen `RecentActivityList`**
  - Menampilkan list hasil kuis (`getRecentQuizActivities`).
  - Label indikator "LULUS" (Mint) / "GAGAL" (Dark Teal/Red).
- [ ] **2.5. Integrasi `app/page.tsx`**
  - Rangkai semua komponen di atas ke dalam layout utama `page.tsx` (yang berjalan sebagai RSC - React Server Component).

---

## Fase 3: Pembangunan Course Syllabus / Welcome Page (`app/course/[course-slug]/page.tsx`)
Fase ini berfokus pada visualisasi *Sequential Learning* (peta jalan).

- [ ] **3.1. Action: `getCourseSyllabusWithProgress`**
  - **Fungsi Query Kompleks:** Mengambil data satu `Course` (by slug), di-JOIN (include) dengan `MaterialCategory` (diurutkan by `orderIndex`), lalu di-JOIN dengan `Page` (diurutkan by `orderIndex`). Untuk setiap `Page`, tarik juga data `PageAccess` untuk *user* yang bersangkutan guna mendapatkan status `LOCKED`, `UNLOCKED`, atau `COMPLETED`.
- [ ] **3.2. UI: Course Header**
  - Komponen Hero bergaya Brutalism yang menampilkan Nama Mapel raksasa (*font-black text-6xl*).
- [ ] **3.3. UI: Category & Material List (Accordion/List)**
  - *Render* loop `MaterialCategory`.
  - Di dalam kategori, *render* loop `Page`.
- [ ] **3.4. UI: Page Status Indicator**
  - Modifikasi tampilan *list item* `Page` berdasarkan status:
    - **COMPLETED**: Teks biasa, ikon centang tebal, tombol CTA abu-abu.
    - **UNLOCKED**: Border `border-4 border-black`, background putih, tombol CTA hijau `bg-[#2A835F]`.
    - **LOCKED**: Opacity 50% (abu-abu pudar), kursor *not-allowed*, ikon gembok hitam.

---

## Fase 4: Pembangunan Halaman Laporan Rapor (`app/rapor/page.tsx`)
Fase ini melengkapi visibilitas nilai bagi murid.

- [ ] **4.1. Action: `getAllQuizCompletionRecords`**
  - Menarik seluruh data `QuizCompletionRecord` milik murid.
- [ ] **4.2. Logic: Data Grouping Utility**
  - Buat fungsi pembantu (*helper*) TypeScript untuk mengelompokkan (Group-By) data *flat* dari `getAllQuizCompletionRecords` menjadi *Nested Object/Map*: `Map<CourseName, Map<CategoryName, Array<Record>>>`. (Catatan: karena `categoryName` dan `pageTitle` sudah tersimpan di tabel *record*, pengelompokan bisa langsung diproses di *memory/backend*).
- [ ] **4.3. UI: Halaman `/rapor` (Report Card Layout)**
  - Header halaman: "RAPOR KUIS".
  - Layout Nested Accordion: 
    - Klik nama Mapel -> Expand Kategori.
    - Klik Kategori -> Expand Daftar Kuis beserta detail Skor Kelulusan & Waktu.
- [ ] **4.4. Tambahkan Navigasi Sidebar/Topnav**
  - Pastikan tautan ke halaman `/rapor` tersedia di navigasi (Sidebar/Navbar) murid.

---

## Fase 5: QA & Finalisasi
- [ ] **5.1. Testing Flow**: Daftar mapel via kode -> Lihat Silabus -> Baca materi yang UNLOCKED -> Kerjakan Kuis -> Lihat status materi berikutnya menjadi UNLOCKED -> Lihat Rapor.
- [ ] **5.2. Pengecekan Desain UI**: Pastikan tidak ada bayangan *blur* (harus solid `offset-shadow`), sudut tumpul yang tidak disengaja, dan warna harus mematuhi palet Neo Brutalism.

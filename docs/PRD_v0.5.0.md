# 📄 Product Requirements Document (PRD) - v0.5.0
**Fokus Rilis:** Student Experience, Dashboard, Course Syllabus, & Laporan Nilai

## 1. Overview Rilis v0.5.0
Rilis versi 0.5.0 ini sepenuhnya berfokus pada penyempurnaan antarmuka dan pengalaman pengguna (User Experience) bagi **Murid (Student)**. Sistem akan menyediakan portal yang utuh agar murid dapat mendaftar/bergabung ke mata pelajaran, melihat peta jalan (silabus) pembelajaran, membaca materi, hingga memantau riwayat evaluasi (kuis) mereka secara mendetail. Seluruh antarmuka publik/murid akan menggunakan sistem desain **Tactile Neo Brutalism**.

## 2. Tujuan Rilis
1. Mengubah `app/page.tsx` menjadi *Home Dashboard* interaktif yang memusatkan metrik belajar murid.
2. Memfasilitasi alur *Sequential Learning* secara visual (agar murid tahu materi mana yang terbuka dan mana yang terkunci).
3. Memberikan transparansi historis hasil belajar melalui fitur rapor/riwayat kuis yang terstruktur.

---

## 3. Spesifikasi Fitur Utama (Core Features)

### 3.1. Student Home Dashboard (`app/page.tsx`)
Berfungsi sebagai beranda utama setelah murid login.
- **Widget Metrik Belajar**: Menampilkan statistik global dari `StudentScoreSummary` (Total Poin, Rata-rata Skor Kuis, Total Materi Selesai).
- **Form Join Course**: Form input mencolok bagi murid untuk memasukkan `joinCode` unik agar tergabung ke dalam `Course` (mata pelajaran) baru.
- **Daftar Mata Pelajaran Aktif (My Courses)**: Menampilkan kartu-kartu mata pelajaran yang sedang diikuti. Terdapat tombol CTA "Lihat Silabus / Lanjut Belajar".
- **Aktivitas Kuis Terakhir**: Menampilkan 3-5 rekam jejak penyelesaian kuis terakhir bersumber dari `QuizCompletionRecord`.

### 3.2. Course Syllabus / Welcome Page (`app/course/[course-slug]`)
Berfungsi sebagai halaman daftar isi (roadmap) sebelum murid memasuki ruang kelas (materi).
- **Course Header**: Menampilkan judul mapel, deskripsi singkat, dan banner/cover.
- **Daftar Kategori & Materi**: Menampilkan list seluruh materi yang dikelompokkan berdasarkan `MaterialCategory`.
- **Indikator Aksesibilitas (Sequential Visualizer)**:
  - 🟢 **COMPLETED**: Materi sudah diselesaikan dan kuis lulus.
  - 🔓 **UNLOCKED**: Materi bisa diakses saat ini (prasyarat telah terpenuhi). Dapat diklik untuk masuk ke materi.
  - 🔒 **LOCKED**: Materi belum bisa diakses. Ditampilkan memudar (grayscale/disabled).
- *Catatan Arsitektur*: Halaman ini me-*query* relasi dari `Course` -> `MaterialCategory` -> `Page` beserta `PageAccess` spesifik untuk murid yang sedang login.

### 3.3. Halaman Laporan Nilai / Rapor (`app/rapor`)
Berfungsi sebagai halaman rekapitulasi nilai mendetail.
- **Hierarki Data**: Data riwayat kuis dikelompokkan *(grouping)* dengan struktur akordion: **Mata Pelajaran > Kategori Materi > Hasil Kuis per Halaman**.
- **Detail Kuis**: Menampilkan nama materi, skor kelulusan (skor murid vs KKM), label Lulus/Gagal, durasi pengerjaan, dan tanggal penyelesaian.
- *Catatan Arsitektur*: Menggunakan data dari `QuizCompletionRecord` yang merupakan data *immutable* (tidak berubah).

### 3.4. Ruang Kelas Pembelajaran / Material Reader (`app/(materi)/...`)
*(Optimalisasi struktur yang sudah ada)*
- Pembaca materi menggunakan layout *Neo Brutalism*.
- Tombol aksi yang merujuk ke komponen Quiz Engine saat murid mencapai akhir bacaan.
- **AccessGuard Terintegrasi**: Memblokir akses langsung via URL jika `PageAccess` masih `LOCKED`.

---

## 4. Requirement UI/UX (Tactile Neo Brutalism)
- **Border & Shadow**: Gunakan border tebal (`border-4 border-black`) dan bayangan solid/harsh offset (`shadow-[4px_4px_0px_0px_#000]`). Tidak ada elemen *blur*.
- **Interaksi Tombol**: Tombol harus mensimulasikan penekanan fisik (translasi kordinat *x,y* pada *hover/active* yang menutup jarak shadow).
- **Tipografi**: Gunakan font berskala tebal (*font-black*) dan kapital untuk *heading* dan elemen call-to-action (CTA).
- **Warna Utama**: Canvas *Pale Mint* (`#EAF4ED`), *Vibrant Jade* (`#2A835F`), dan *Deep Forest Teal* (`#092328`).

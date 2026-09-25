# Design System: Admin & Guru Dashboard

Berbeda dengan antarmuka (_interface_) untuk Murid atau halaman publik yang menggunakan pendekatan **Tactile Neo Brutalism**, dasbor (dashboard) untuk Superadmin dan Guru dikembangkan menggunakan filosofi **Clean & Minimalist Modernism**.

Tujuan utama dari desain ini adalah **Fungsi di atas Bentuk** (Function over Form). Administrator dan Pengajar membutuhkan lingkungan yang rapi, minim distraksi visual, dan fokus pada penyajian data secara cepat dan efisien.

---

## 1. Prinsip Desain (Design Principles)

1. **Clarity (Kejelasan)**
   Penggunaan ruang kosong (white space) yang melimpah untuk memisahkan antar komponen. Tidak ada garis tebal yang tumpang tindih atau bayangan solid yang memecah konsentrasi.
   
2. **Hierarchy (Hierarki Visual)**
   Penggunaan tipografi berskala untuk membedakan antara judul (header), teks utama (body), dan keterangan (caption/sub-text). Warna ikon juga digunakan sebagai pemancing visual yang membedakan antar konteks widget.

3. **Responsiveness (Fleksibilitas Skala)**
   Sistem harus dapat beradaptasi dari layar monitor Ultrawide (Desktop) hingga layar vertikal sempit pada ponsel (Mobile). 

---

## 2. Palet Warna (Color Palette)

Palet warna yang digunakan adalah turunan dari sistem warna dasar Tailwind CSS, berfokus pada varian _Grayscale_ untuk kerangka utama dan warna _Accent_ (aksen) ringan untuk indikator.

### Base & Backgrounds
- **Background Utama**: `bg-gray-50` (`#f9fafb`) - Memberikan kontras yang sangat lembut untuk membedakan dengan kanvas kartu (card).
- **Background Kartu / Container**: `bg-white` (`#ffffff`) - Bersih, murni, dan netral.
- **Border / Pembatas**: `border-gray-200` (`#e5e7eb`) - Garis pemisah yang tipis dan halus.

### Typography (Teks)
- **Teks Heading / Label Penting**: `text-gray-900` (`#111827`) - Hitam pekat modern, nyaman dibaca.
- **Teks Sub-heading / Paragraf**: `text-gray-700` (`#374151`)
- **Teks Mute / Keterangan**: `text-gray-500` (`#6b7280`)

### Accents (Aksen Warna per Kategori)
Pada widget dan logo digunakan kombinasi background warna pudar (opacity rendah) dengan warna teks pekat:
- **Blue (Pengguna / Sistem)**: `bg-blue-50` dengan ikon `text-blue-600`.
- **Emerald (Buku / Materi)**: `bg-emerald-50` dengan ikon `text-emerald-600`.
- **Amber (Aktivitas / Tren)**: `bg-amber-50` dengan ikon `text-amber-600`.
- **Red (Aksi Destruktif / Logout)**: `text-red-600` dengan efek *hover* `bg-red-50`.

---

## 3. Komponen Utama UI/UX

### A. Collapsible Sidebar (Bilah Navigasi Samping)
- **State PC / Desktop**:
  - **Expanded (w-64)**: Sidebar lebar penuh menampilkan Ikon beserta Teks Menu.
  - **Collapsed (w-20)**: Sidebar menyempit hanya menampilkan Ikon, berfungsi melebarkan area kanvas kerja (workspace) ketika admin butuh layar luas.
- **State Mobile (HP)**:
  - Sidebar tersembunyi sepenuhnya di sisi kiri (`-translate-x-full`). 
  - Hanya akan muncul ketika di-trigger oleh tombol **Hamburger Menu**.
  - Saat muncul, background hitam dengan opasitas 50% (`bg-black/50`) menyelimuti sisa layar sebagai pembatas fokus.
- **Interaksi Navigasi**: Menu yang sedang aktif (Active State) ditandai dengan background pudar dan warna teks dominan (misal: `bg-blue-50 text-blue-700`).

### B. Top Header (Bilah Atas)
- Memiliki ketinggian yang sama dan presisi dengan area atas sidebar (`h-16`).
- **Sticky / Fixed Position**: Header akan terus menempel di langit-langit ketika halaman di-scroll ke bawah.
- **User Profile**: Terdapat elemen profil di sebelah kanan yang berisi Inisial bundar (`rounded-full`), Nama Lengkap, dan Status Role. Di layar *mobile*, tulisan Nama dan Role dihilangkan demi menghemat tempat, menyisakan hanya avatar Inisial.

### C. Cards & Widgets (Kartu Konten)
Kartu-kartu ringkasan (Widget) dirancang menggunakan kontainer:
- `bg-white` untuk warna dasar.
- `rounded-xl` sudut tumpul elegan, sangat bertolak belakang dengan desain *Neo Brutalism* (sudut runcing tanpa radius).
- `border border-gray-200` memberikan batas halus pengganti *border-4 black*.
- `shadow-sm` memberikan bayangan elevasi modern, memisahkan objek utama dengan *background* situs yang berwarna abu-abu terang.

---

## 4. Tipografi (Typography)

Sistem huruf memanfaatkan _font_ bawaan *sans-serif* yang ramah di layar modern (Inter / Roboto / System UI). 
Tidak ada penggunaan kapital besar ekstrim (UPPERCASE) dengan _letter-spacing_ yang padat layaknya gaya brutalism, digantikan dengan perbandingan tebal-tipis huruf (_font-weight_) seperti:
- `font-bold` atau `font-semibold` untuk nama entri dan angka statistik.
- Teks biasa berjalan di skala `text-sm` (14px) hingga `text-base` (16px).

---

## 5. Ringkasan Kelas Tailwind yang Sering Digunakan
Sebagai panduan koding di masa depan, saat Anda akan menambah halaman ke dalam dashboard ini, ikuti struktur formasi utilitas Tailwind berikut:
- **Card**: `className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"`
- **Primary Button**: `className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 transition-colors"`
- **Outline/Secondary Button**: `className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg px-4 py-2 transition-colors"`
- **Section Title**: `className="text-lg font-semibold text-gray-900 mb-4"`

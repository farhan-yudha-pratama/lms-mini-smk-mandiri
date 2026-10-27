---
name: lms-materi
description: >
  Standarisasi pembuatan dan perbaikan materi pembelajaran LMS SMK Mandiri.
  Mengubah materi teknis menjadi ramah orang awam (bahasa manusia, analogi konkret,
  studi kasus nyata, simulasi/visual interaktif) dan menerapkan desain Tactile Neo Brutalism
  sesuai docs/DESIGN.md. Aktifkan saat user mengirim materi, meminta perbaikan konten modul,
  atau mengetik "/lms-materi", "materi", "buat materi", "rapikan materi".
---

# Skill: LMS Materi EduBrutal (Tactile Neo-Brutalism Learning Engine)

Skill ini digunakan untuk menyusun, merombak, atau memoles halaman materi pembelajaran pada LMS SMK Mandiri. Tujuannya adalah membuat materi teknis yang rumit menjadi **mudah dipahami orang awam/siswa pemula (anti-brainrot/anti-bosan)** dengan tampilan antarmuka **Tactile Neo Brutalism UI** yang interaktif, visual, dan responsif.

---

## 1. Prinsip Pedagogi & Gaya Bahasa (Human-Friendly First)

Setiap materi yang masuk **DILARANG KERAS** hanya menyalin definisi kaku dari buku teks. Wajib diolah dengan aturan:

1. **Bahasa Manusia, Bukan Buku Teks:**
   - Jelaskan konsep seperti seorang kakak tingkat atau mentor yang sedang mengobrol santai dengan adik kelasnya.
   - Hindari kalimat berbelit-belit (*wall of text*). Gunakan kalimat pendek, tegas, dan padat makna.
   - Jika ada istilah teknis mutlak (misal: *binary*, *interrupt*, *RAM*), langsung beri arti fungsionalnya dalam tanda kurung atau kotak catatan.

2. **Wajib Memiliki Analogi Nyata (Real-World Analogy):**
   - Gunakan perumpamaan benda/kejadian yang dialami siswa setiap hari:
     - 📱 *Smartphone & Aplikasi (TikTok, WA, MLBB)*
     - 🎸 *Gitar fisik (Hardware) vs Kunci Lagu/Chord (Software) vs Musisi (Brainware)*
     - 📖 *Buku tulis kosong (Hardware) vs Tulisan ilmu di dalamnya (Software)*
     - 🍳 *Kompor & wajan (Hardware) vs Resep rahasia (Software) vs Koki (Brainware)*
     - 🧠 *Tubuh & otot (Hardware) vs Pikiran & akal (Software)*

3. **Studi Kasus Konkret (Case Study):**
   - Sertakan minimal satu studi kasus alur nyata (misal: *"Apa yang terjadi saat kamera HP mengambil foto?"*, *"Bagaimana GoFood/ShopeeFood memproses pesananmu?"*, *"Alur pengetikan huruf di keyboard"*).

4. **Tabel Komparasi Head-to-Head:**
   - Jika membandingkan dua konsep (misal: *Hardware vs Software*, *Frontend vs Backend*), tampilkan dalam tabel atau kartu bersanding yang membandingkan: wujud, penyebab rusak, cara perbaikan, dan ketergantungan.

---

## 2. Standar Desain UI (docs/DESIGN.md Compliance)

Halaman materi wajib tunduk 100% pada **Tactile Neo Brutalism UI**:

### A. Palet Warna Resmi
- **Canvas / Latar Halaman:** `#EAF4ED` (Pale Mint Canvas)
- **Soft Accent / Mint:** `#8BBB92` (Soft Sage Mint Green)
- **Primary / Active Accent:** `#2A835F` (Vibrant Jade Green)
- **Secondary / Deep Pine:** `#12544F` (Deep Emerald Pine Teal)
- **Base Neutral / Dark Accent:** `#092328` (Deep Forest Teal)
- **Border / Stroke / Shadow:** `#000000` (Solid Black)
- **Card Highlight / Container:** `#FFFFFF` (Pure White)

### B. Aturan Absolut Styling
- **Zero-Blur Policy:** DILARANG menggunakan `blur-*`, `backdrop-blur`, atau bayangan kabur.
- **Heavy Ink Borders:** 
  - Kartu & section utama: `border-4 border-black`
  - Sub-elemen, tombol kecil, & badge: `border-2 border-black` atau `border-3 border-black`
- **Sudut Persegi Tegas:** Sudut wajib siku-siku (`rounded-none`).
- **Tactile Hard Drop Shadows:**
  - Panel besar & Hero: `shadow-[8px_8px_0px_0px_#000]`
  - Kartu bento / sub-panel: `shadow-[4px_4px_0px_0px_#000]` atau `shadow-[6px_6px_0px_0px_#000]`
  - Tombol kecil & badge: `shadow-[2px_2px_0px_0px_#000]`
- **Push Button Physics (Fisika Tekan Nyata):**
  Setiap tombol interaktif wajib memiliki animasi tekan mekanik:
  ```css
  hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000]
  active:translate-x-[4px] active:translate-y-[4px] active:shadow-none
  transition-all cursor-pointer
  ```
- **Live System Ticker:**
  Sertakan running ribbon di bawah navbar:
  `bg-[#2A835F] border-b-4 border-black text-white font-mono` dengan pemisah `■ ● ★ ▲`.

---

## 3. Struktur Blok Halaman Materi (Page Architecture)

Setiap file materi di `app/course/.../page.tsx` harus memiliki struktur blok berikut:

```
[Headbar]
[Live System Ticker Ribbon]
[Sidebar courseSlug="..."]
<main>
  1. Hero Banner (Judul punchy + emblem box miring "-rotate-2 hover:rotate-0")
  2. Topik 1 (Definisi Bahasa Manusia + Analogi + Inspektor/Simulator Interaktif)
  3. Topik 2 (Mekanisme/Fungsi Kerja + Kartu Angka 01-04 + Studi Kasus Berurutan)
  4. Topik 3 (Hubungan/Komparasi + Tabel Head-to-Head + Laboratorium Uji Hilang)
  5. 3-Card Bento Row (Hardware / Software / Brainware atau 3 Rangkuman Emas)
  6. Evaluasi Pembelajaran (<QuizTrigger pageSlug="..." />)
  7. Tactile Footer (Tombol kembali ke silabus + Version Stamps)
</main>
```

---

## 4. Responsivitas Mobile (Mobile-First Checklist)

- Gunakan `w-full` dengan padding `p-4 sm:p-6 md:p-8`.
- Setiap grid wajib stack di layar ponsel: `grid-cols-1 md:grid-cols-2` atau `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`.
- Tabel wajib dibungkus `<div className="overflow-x-auto">`.
- Tipografi judul harus fleksibel: `text-2xl sm:text-4xl md:text-5xl`.
- Tombol interaktif cukup besar untuk disentuh jari (*touch target* minimal 40px tinggi).

---

## 5. Cara Eksekusi Saat Menerima Perintah

Saat user memberikan materi atau memanggil skill ini:
1. **Analisis Materi User:** Bedah materi mentah menjadi 3 sub-topik inti yang saling berkesinambungan.
2. **Terapkan Analogi & Kasus Nyata:** Rancang studi kasus interaktif minimal 1 buah (menggunakan state React `useState`).
3. **Generate Kode Lengkap:** Langsung tulis kode React Next.js yang sudah terintegrasi rapi dengan komponen `@/components/Headbar`, `@/components/Sidebar`, dan `@/components/quiz-engine/QuizTrigger`.
4. **Verifikasi DESIGN.md:** Pastikan palet warna, border 4px hitam, hard shadow, dan zero-blur sudah teraplikasikan secara ketat.

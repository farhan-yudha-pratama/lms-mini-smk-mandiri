---
name: lms-materi
description: >
  Standarisasi pembuatan dan perbaikan materi pembelajaran LMS SMK Mandiri.
  Mengubah materi teknis menjadi ramah siswa SMK (to-the-point, analogi konkret 1 detik,
  studi kasus lapangan TKJ/RPL, anti-wall-of-text, 3-5 menit paham, max 300 baris JSX)
  dan menerapkan desain Tactile Neo Brutalism sesuai docs/DESIGN.md & docs/DESIGN_MATERI.md.
  Aktifkan saat user mengirim materi, meminta perbaikan/improve konten modul,
  atau mengetik "/lms-materi", "materi", "buat materi", "rapikan materi".
---

# Skill: LMS Materi EduBrutal (Tactile Neo-Brutalism Learning Engine)

Skill ini digunakan untuk **membuat baru** atau **merombak/meng-improve** halaman materi pembelajaran di LMS SMK Mandiri (`app/course/.../page.tsx`).

Tujuannya adalah menyajikan materi teknis yang **langsung ke inti (to-the-point)**, **anti-bosan/anti-wall-of-text**, dan selesai dibaca dalam **3–5 menit**, dengan antarmuka **Tactile Neo Brutalism** yang 100% konsisten.

---

## 1. Aturan Mutlak Konten (Sesuai `docs/DESIGN_MATERI.md`)

Setiap materi yang diproses **WAJIB** mematuhi batasan berikut:

1. **Batas Panjang Kode:** Ideal 150 – 250 baris JSX (Maksimal 300 baris). Jangan pernah membuat halaman di atas 400 baris.
2. **Waktu Baca Siswa:** Selesai dalam 3 – 5 menit.
3. **Paragraf Sangat Pendek:** Maksimal 1 – 2 kalimat (di bawah 35 kata). Dilarang membuat paragraf panjang.
4. **Analogi 1 Detik Nyata (Bukan Abstrak):**
   - Kaitkan dengan skenario nyata siswa SMK (khususnya lab komputer, jaringan TKJ, coding RPL, atau smartphone).
   - *Contoh analogi:* Komputer lab lemot, antrean flashdisk kena virus di lab, WiFi sekolah lelet, dsb.
5. **Anti-Pattern (DILARANG KERAS):**
   - ❌ Jangan membuang kartu untuk membandingkan definisi akademis/buku teks vs definisi praktis (langsung pakai penjelasan praktis!).
   - ❌ Jangan membuat kalimat pengantar klise ("Dalam era modern serba digital saat ini...").
   - ❌ Jangan membuat tombol interaktif fiktif / `useState` buatan yang hanya menukar kalimat paragraf.
   - ❌ Jangan gunakan jargon tinggi tanpa fungsi nyata (misal: "fotodioda foton simultan" untuk materi dasar).

---

## 2. Struktur 5 Blok Halaman Materi (Standard Blueprint)

Setiap file `app/course/.../page.tsx` **HARUS** mengikuti urutan 5 blok ini:

```
[Headbar]
[Live System Ticker Ribbon] (bg-[#2A835F] border-b-4 border-black font-mono)
[Sidebar courseSlug="..."]
<main>
  1. BLOK 1: HERO PUNCHY BANNER
     - Badge durasi baca (DURASI 3 MENIT BACA) + Badge modul
     - Judul tegas, besar, uppercase
     - 1 Kalimat Tagline: Fungsi alat/konsep ini di dunia kerja nyata
     - Rotated Emblem Box (-rotate-2 hover:rotate-0)

  2. BLOK 2: ANALOGI 1 DETIK (bg-[#8BBB92] border-4 border-black)
     - 1 Masalah konkret harian (lab/komputer) & solusi cepatnya

  3. BLOK 3: ANATOMI / 3 PILAR KUNCI (bg-white border-4 border-black)
     - 3 Kartu bernomor (01 // THINKING, 02 // DOING, 03 // SELLING atau TAHAP 01-03)
     - Setiap kartu: Judul + Penjelasan 1 kalimat + Kotak Fokus/Output

  4. BLOK 4: KASUS LAPANGAN & TABEL HEAD-TO-HEAD
     - Box Masalah Lapangan Singkat (misal: kasus di lab sekolah)
     - Tabel Komparasi Tegas: "Siswa Pasif (Konsumen)" vs "Siswa Berjiwa KIK/Solutif (Inovator)"

  5. BLOK 5: RANGKUMAN 3 BENTO & EVALUASI KUIS
     - 3 Kartu Bento Golden Takeaway (Ingat 01, Ingat 02, Ingat 03)
     - Callout Kuis Evaluasi (bg-[#092328] / bg-[#12544F])
     - <QuizTrigger pageSlug="..." />
     - Tactile Footer Navigation (Kembali ke Silabus & Lanjut ke Bab Berikutnya)
</main>
```

---

## 3. Standar Styling Tactile Neo Brutalism (`docs/DESIGN.md`)

- **Palet Warna:**
  - Canvas: `#EAF4ED` (dengan dot pattern `radial-gradient(#000000 1px, transparent 1px) 24px`)
  - Soft Mint: `#8BBB92`
  - Vibrant Jade: `#2A835F`
  - Deep Pine: `#12544F`
  - Deep Forest Teal: `#092328`
  - Ink & Shadow: `#000000`
  - Card Fill: `#FFFFFF`
- **Zero-Blur Policy:** DILARANG menggunakan blur atau shadow halus Tailwind (`shadow-lg`, `blur-*`).
- **Heavy Ink Borders:** `border-4 border-black` untuk section/kartu, `border-2 border-black` untuk badge/sub-elemen.
- **Hard Offset Shadows:** `shadow-[8px_8px_0px_0px_#000]`, `shadow-[4px_4px_0px_0px_#000]`, `shadow-[2px_2px_0px_0px_#000]`.
- **Sudut Persegi:** Selalu `rounded-none`.
- **Tactile Push Physics:**
  ```css
  hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000]
  active:translate-x-[4px] active:translate-y-[4px] active:shadow-none
  transition-all cursor-pointer
  ```

---

## 4. Alur Kerja Eksekusi (Workflow Saat Dipanggil)

Saat diminta membuat baru, merapikan, atau meng-improve materi:

1. **Bedah Inti Materi:**
   - Ekstrak konsep menjadi 1 kalimat fungsi nyata + 1 analogi konkret (lab/komputer) + 3 poin/langkah kunci.
2. **Terapkan Blueprint 5 Blok:**
   - Susun kode langsung menggunakan boilerplate 5 blok di atas.
3. **Pangkas Wording Berlebih (Ponytail):**
   - Hapus kata-kata pengantar panjang, ubah paragraf jadi poin kartu/tabel head-to-head.
   - Pastikan panjang file tetap di rentang **150 – 250 baris** (maksimal 300 baris).
4. **Verifikasi Teknis:**
   - Pastikan path `Headbar`, `Sidebar`, dan `<QuizTrigger pageSlug="..." />` sesuai.
   - Jalankan `npx tsc --noEmit` untuk memastikan tidak ada kesalahan TypeScript.

# PANDUAN STANDAR DESAIN & PENULISAN MATERI LMS SMK MANDIRI
> **File Acuan:** `docs/DESIGN_MATERI.md`  
> **Turunan Dari:** `docs/DESIGN.md` (Tactile Neo Brutalism UI) & `.agents/skills/lms-materi/SKILL.md`  
> **Sasaran Pengguna:** Pembuat materi modul, Guru Pengampu, Pengembang Konten Pembelajaran.

---

## 1. Realita Siswa SMK & Filosofi Belajar

Siswa SMK memiliki karakteristik belajar yang sangat spesifik dan berbeda dengan mahasiswa akademis:
- **Attention Span Pendek (3–5 Menit):** Siswa akan langsung bosan dan *skip* materi jika dalam 10 detik pertama mereka tidak paham tujuannya apa.
- **Alergi "Wall of Text":** Teks berupa paragraf panjang tanpa jeda visual dianggap sebagai beban pikiran (*cognitive overload*).
- **Pragmatis & Visual (Hands-On):** Siswa SMK lebih cepat paham jika melihat:
  1. *Fungsi nyatanya untuk apa di dunia kerja?*
  2. *Contoh barang fisiknya apa (analogi 1 detik)?*
  3. *Kalau salah langkah / lupa, akibat fatalnya apa?*
- **Kenyamanan Membaca (Whitespace):** Desain yang terlalu padat atau dijejali banyak elemen kecil membuat halaman terasa ramai dan melelahkan dibaca. Berikan ruang bernapas (*breathing room*) yang lega.
- **Mobile First / Layar Kecil:** Lebih dari 70% siswa membaca materi melalui smartphone mereka di sela-sela jam praktik atau perjalanan.

> [!IMPORTANT]
> **Prinsip Utama: "To-the-Point, Lega, Visual, & Actionable"**  
> Dilarang bertele-tele, dilarang menulis sejarah panjang tanpa faedah praktis, dan jangan buat halaman terasa sesak. Langsung ke inti kegunaan, anatomi fungsi, dan contoh nyata!

---

## 2. Batasan Teknis & Volume Konten (Content Constraints)

Setiap halaman materi di `app/course/.../page.tsx` wajib mematuhi metrik berikut:

| Parameter | Standar Ideal | Batas Maksimum | Catatan |
| :--- | :--- | :--- | :--- |
| **Waktu Baca Siswa** | 3 Menit | 5 Menit | Jika lebih dari 5 menit, pecah materi jadi 2 bab terpisah. |
| **Panjang Baris Kode JSX** | 180 – 260 baris | 300 baris | Halaman di atas 350 baris dipastikan terlalu bertele-tele. |
| **Panjang Paragraf Narasi** | 1 – 2 kalimat | 3 kalimat (Maks. 30 kata) | Gunakan kartu terpisah jika ada poin baru. |
| **Spacing Jeda Vertikal** | `space-y-12 md:space-y-16` | - | Memberikan kelonggaran visual agar tidak terasa penuh sesak. |
| **Padding Kartu Utama** | `p-6 md:p-12` | - | Kartu wajib lega, bukan kotak sempit yang dijejali teks. |
| **Rasio Visual vs Teks** | 70% Visual / Kartu | 30% Narasi Teks | Gunakan box model, icon besar (60-80px), dan badge tegas. |
| **Jumlah Poin per Subtopik** | 2 – 3 Poin Kunci | 4 Poin Kunci | Siswa SMK hanya mengingat 3 hal penting dalam 1 bab. |
| **Interaktivitas / Simulator** | 1 Fitur Simpel | 2 Fitur | Cukup toggle visual / stepper simpel, hindari state rumit. |

---

## 3. Blueprint Arsitektur Halaman Materi (Standard 5-Block Blueprint)

Setiap materi yang dibuat **HARUS** mengikuti 5 blok hierarki terstruktur berikut:

```
[1. Hero Raksasa Immersif]    --> Banner Hitam Pekat + Watermark Ikon + Judul Raksasa + Tombol Aksi
        ↓
[2. Analogi 1 Detik]          --> Split Box Asimetris: Masalah Nyata + Kertas Bon/Barang Fisik + Ikon 80px
        ↓
[3. Anatomi / Perintah Inti]  --> Kartu Horizontal Lebar atau Grid 2-Kolom Lapang (Bukan Kolom Sempit)
        ↓
[4. DDL vs DML / Komparasi]   --> 2 Kartu Berdampingan (Wadah vs Isi) + Kotak Bahaya Maut Tanpa WHERE
        ↓
[5. Kuis & Footer Navigasi]   --> Komponen <QuizTrigger /> + Tombol Bolak-Balik Halaman
```

### Detail Spesifikasi Tiap Blok:

#### Blok 1: Hero Raksasa Hitam Immersif (Giant Immersive Black Hero)
- **Tampilan Visual:**
  - Latar belakang hitam pekat: `bg-black border-4 border-black p-6 md:p-12 shadow-neo-xl text-center relative overflow-hidden text-white`.
  - Badge Kategori di pojok kiri atas: `absolute top-0 left-0 bg-white text-black font-black px-4 py-1 border-b-4 border-r-4 border-black shadow-neo-sm z-20 uppercase`.
  - Watermark Ikon Raksasa di latar belakang: `<span className="material-symbols-outlined text-[150px] md:text-[250px] text-white opacity-20 transform rotate-12">terminal</span>`.
  - Judul Raksasa Tegas: `text-4xl sm:text-5xl md:text-7xl font-black text-mint-soft tracking-tighter uppercase mb-4 md:mb-6`.
  - Tagline Inset Putih: `text-base md:text-xl font-bold text-black bg-white inline-block px-4 py-2 md:px-6 md:py-3 border-4 border-black mb-8 md:mb-10 shadow-neo-md uppercase tracking-tight`.
  - Tombol Aksi / Simulator Interaktif Besar: `bg-jade-vibrant text-white font-black text-xl md:text-3xl px-8 py-5 md:px-12 md:py-6 border-4 border-white shadow-neo-lg hover:-translate-y-2 hover:-translate-x-2 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all uppercase tracking-widest flex items-center gap-4 mx-auto`.
- **Aturan Header:**
  - Jarak atas standar adalah `pt-[88px]`.
  - **Dilarang memasang ticker ribbon berjalan** di halaman materi karena menyita ruang vertikal layar dan membuat halaman terasa penuh/bising.

#### Blok 2: Analogi 1 Detik (Split Box Asimetris)
- Mengaitkan konsep abstrak ke barang fisik yang disentuh siswa setiap hari.
- Gunakan struktur split:
  - **Sisi Kiri (2/3 lebar):** Teks pengantar 1 kalimat + Box penjelasan analogi (`bg-canvas border-4 border-black p-6 shadow-neo-md`).
  - **Sisi Kanan (1/3 lebar):** Box hitam berotasi halus (`bg-black border-4 border-black shadow-neo-md p-6 text-white flex flex-col items-center justify-center -rotate-2 hover:rotate-0`) dengan ikon berukuran besar `text-[80px]` dan teks label ringkas.

#### Blok 3: Anatomi / Perintah Inti (Kartu Horizontal Lebar)
- Hindari memaksakan grid 3 kolom sempit bertumpuk teks. Gunakan kartu horizontal lebar:
  - Sisi kiri: Blok kode syntax monospace (`w-full md:w-1/2 bg-black text-mint-soft font-mono p-4 border-2 border-black text-base md:text-lg`).
  - Sisi kanan: Penjelasan fungsi dan tujuan praktis dalam 1–2 kalimat singkat.
- Hover effect halus: `hover:translate-x-2 transition-transform`.

#### Blok 4: Komparasi Lapang & Kotak Bahaya Maut
- **Komparasi 2 Kolom (Wadah vs Isi):**
  - Menggunakan `grid grid-cols-1 md:grid-cols-2 gap-8`.
  - Tiap kolom memiliki header dengan ikon Material Symbols 5xl, chip kategori, penjelasan 1 kalimat, dan contoh syntax monospaced.
- **Kotak Peringatan Bahaya Maut (Red Warning Banner):**
  - Menggunakan latar merah tebal: `bg-[#FF0000] border-4 border-black p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center shadow-neo-lg transform -rotate-1 hover:rotate-0 transition-transform`.
  - Ikon warning animasi bounce: `<span className="material-symbols-outlined text-white text-[80px] font-black animate-bounce">warning</span>`.
  - Kotak putih inset untuk penjelasan konsekuensi nyata bila perintah salah dijalankan (misal: *update/delete tanpa WHERE*).

#### Blok 5: Evaluasi Kuis & Footer Navigasi Modul
- Komponen Evaluasi Langsung: `<QuizTrigger pageSlug="slug-halaman" />`.
- **Footer Navigasi (Wajib Ada):**
  - Tombol Mundur (Kembali ke Bab Sebelumnya): `bg-canvas text-black font-black uppercase text-sm md:text-lg px-4 py-3 md:px-6 md:py-4 border-4 border-black shadow-neo-md...`.
  - Tombol Maju (Lanjut ke Bab Berikutnya): `bg-white text-black font-black uppercase text-sm md:text-lg px-4 py-3 md:px-6 md:py-4 border-4 border-black shadow-neo-md...`.

---

## 4. Standar Desain Visual Tactile Neo Brutalism (`docs/DESIGN.md`)

Setiap halaman materi wajib menggunakan token Tailwind yang telah terdefinisi di `@theme` (`app/globals.css`):

### A. Palet Token Warna Resmi
```css
/* Color Tokens */
bg-canvas        /* #EAF4ED: Latar utama dengan dot matrix */
bg-mint-soft     /* #8BBB92: Kartu aksen sekunder / highlight lembut */
bg-jade-vibrant  /* #2A835F: Tombol aksi utama / status aktif */
bg-pine-deep     /* #12544F: Kontainer gelap medium / badge nomor */
bg-forest-teal   /* #092328: Aksen header / badge nomor gelap */
bg-black         /* #000000: Banner hero pekat & outline */
bg-white         /* #FFFFFF: Latar kartu konten & inset teks */
```

### B. Shadow & Border Tokens
```css
/* Hard Drop Shadows (Zero-Blur) */
shadow-neo-sm    /* 2px 2px 0px 0px #000 (Badge, micro button) */
shadow-neo-md    /* 4px 4px 0px 0px #000 (Kartu standar, input) */
shadow-neo-lg    /* 6px 6px 0px 0px #000 (Tombol hero, banner warning) */
shadow-neo-xl    /* 8px 8px 0px 0px #000 (Hero container utama) */

/* Borders */
border-4 border-black  /* Wajib untuk semua kontainer kartu, hero, dan tombol utama */
border-2 border-black  /* Untuk badge kecil, syntax snippet, atau divider */
```

### C. Aturan Absolut Styling (Zero Exception)
1. **Zero-Blur Policy:** Dilarang keras memakai `backdrop-blur`, `filter blur`, atau `shadow-lg` bawaan Tailwind yang berpendar halus.
2. **Sudut Tegas:** Selalu `rounded-none`. Tidak boleh menggunakan `rounded-xl`, `rounded-2xl`, atau rounded pills.
3. **Tactile Push Physics pada Tombol & Kartu:**
   ```css
   hover:-translate-y-1 hover:-translate-x-1 hover:shadow-neo-lg
   active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
   transition-all cursor-pointer
   ```

---

## 5. Pola Anti-Pattern & Pantangan Keras (Do's and Don'ts)

| ❌ DILARANG KERAS (Anti-Pattern) | ✅ STANDAR BENAR (Best Practice) |
| :--- | :--- |
| **Memasang Ticker Ribbon di atas konten materi:** Membuat ruang vertikal sempit dan visual berisik. | **Hapus ticker ribbon pada halaman materi:** Biarkan header bernapas bebas dengan `pt-[88px]`. |
| **Grid 3 Kolom Padat Teks:** Menjejalkan 3 kolom sempit berisi teks panjang yang membuat halaman terlihat penuh dan melelahkan. | **Gunakan 2 Kolom atau Kartu Horizontal Lebar:** Format horizontal split lebih enak di-scan dan ramah ponsel. |
| **Spasi Antar Bagian Terlalu Rapat (`space-y-6`):** Menjadikan halaman tampak seperti wall of text raksasa. | **Spasi Lega (`space-y-12 md:space-y-16`):** Memberikan jeda mata (*whitespace*) yang nyaman bagi siswa. |
| **Menulis Definisi Buku Teks vs Definisi Praktis bersanding:** Membuang 2 kartu hanya untuk membedakan gaya bahasa. | **Langsung tulis penjelasan praktisnya:** Siswa SMK butuh kegunaan nyata, bukan hafalan teori. |
| **State React Rumit untuk Switcher Teks:** Membuat tab-tab tersembunyi yang menyusahkan siswa saat scanning materi. | **Buka semua kartu dalam layout terbuka:** Siswa bisa langsung membaca alur dari atas ke bawah tanpa klik sana-sini. |
| **File JSX Mencapai 400 – 600 Baris:** Terlalu banyak subtopik yang dijejalkan ke dalam 1 URL. | **Maksimal 200 – 280 Baris:** Fokus pada 1 konsep esensial yang selesai dipahami dalam 3–5 menit. |

---

## 6. Official Battle-Tested Code Template (`page.tsx`)

Gunakan boilerplate standar berikut saat membuat atau merapikan materi modul:

```tsx
"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import QuizTrigger from '@/components/quiz-engine/QuizTrigger';
import { useState } from 'react';

export default function MateriStandardPage() {
  const [isReady, setIsReady] = useState(false);

  return (
    <>
      <Headbar
        links={[
          { label: 'Materi', href: '/course/[courseSlug]/[pageSlug]', isActive: true },
        ]}
      />

      <div className="flex pt-[88px] min-h-screen">
        <Sidebar courseSlug="[courseSlug]" />

        <main
          className="md:ml-[280px] w-full p-4 md:p-10 bg-canvas relative"
          style={{
            backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        >
          <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">

            {/* BLOK 1: HERO SECTION IMMERSIF */}
            <section className="bg-black border-4 border-black p-6 md:p-12 shadow-neo-xl text-center relative overflow-hidden text-white">
              <div className="absolute top-0 left-0 bg-white text-black font-black px-4 py-1 border-b-4 border-r-4 border-black shadow-neo-sm z-20 uppercase">
                [KATEGORI / MODUL 0X]
              </div>
              <div className="absolute -top-10 -right-10 z-0">
                <span className="material-symbols-outlined text-[150px] md:text-[250px] text-white opacity-20 transform rotate-12">
                  [ICON_NAME]
                </span>
              </div>

              <div className="relative z-10 pt-8">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-mint-soft tracking-tighter uppercase mb-4 md:mb-6">
                  [JUDUL MATERI SINGKAT]
                </h1>
                <p className="text-base md:text-xl font-bold text-black bg-white inline-block px-4 py-2 md:px-6 md:py-3 border-4 border-black mb-8 md:mb-10 shadow-neo-md uppercase tracking-tight">
                  [1 KALIMAT ACTIONABLE: FUNGSI UTAMA DI DUNIA KERJA]
                </p>
                <div>
                  <button
                    onClick={() => setIsReady(!isReady)}
                    className="bg-jade-vibrant text-white font-black text-xl md:text-3xl px-8 py-5 md:px-12 md:py-6 border-4 border-white shadow-neo-lg hover:-translate-y-2 hover:-translate-x-2 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all uppercase tracking-widest flex items-center gap-4 mx-auto"
                  >
                    {isReady ? (
                      <><span>Sudah Aktif!</span> <span className="material-symbols-outlined font-black text-4xl animate-bounce">check_circle</span></>
                    ) : (
                      <><span>[TOMBOL SIMULATOR / AKSI]</span> <span className="material-symbols-outlined font-black text-4xl">play_circle</span></>
                    )}
                  </button>
                </div>
              </div>
            </section>

            {/* BLOK 2: ANALOGI 1 DETIK (SPLIT BOX) */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12 rotate-1 hover:rotate-0 transition-transform">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-forest-teal text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">01</span>
                [JUDUL ANALOGI KONKRET]
              </h2>

              <div className="flex flex-col lg:flex-row gap-8 items-stretch">
                <div className="flex-1 space-y-6">
                  <p className="text-lg md:text-xl font-bold text-forest-teal leading-relaxed">
                    [KONDISI SEHARI-HARI YANG DIHADAPI SISWA / MASALAH NYATA].
                  </p>
                  <div className="bg-canvas border-4 border-black p-6 shadow-neo-md">
                    <h3 className="text-xl font-black uppercase mb-2">Analogi Benda Nyata:</h3>
                    <p className="font-bold text-black text-lg">
                      [JELASKAN KORELASI BENDA FISIK DENGAN KONSEP TEKNIS INI DALAM 1-2 KALIMAT].
                    </p>
                  </div>
                </div>

                <div className="lg:w-1/3 bg-black border-4 border-black shadow-neo-md p-6 text-white flex flex-col items-center justify-center -rotate-2 hover:rotate-0 transition-transform">
                  <span className="material-symbols-outlined text-[80px] text-mint-soft mb-4">[ANALOGY_ICON]</span>
                  <p className="font-black uppercase text-center text-xl">[NAMA BENDA]</p>
                </div>
              </div>
            </section>

            {/* BLOK 3: PERINTAH INTI / ANATOMI (KARTU HORIZONTAL LEBAR) */}
            <section className="bg-mint-soft border-4 border-black shadow-neo-xl p-6 md:p-12 -rotate-1 hover:rotate-0 transition-transform">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-black text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">02</span>
                [LANGKAH / PERINTAH KUNCI]
              </h2>

              <div className="space-y-6">
                {[
                  { code: 'PERINTAH_CONTOH_1;', title: '1. Tindakan Pertama', desc: 'Penjelasan aksi 1 kalimat to-the-point.' },
                  { code: 'PERINTAH_CONTOH_2;', title: '2. Tindakan Kedua', desc: 'Penjelasan aksi 1 kalimat to-the-point.' },
                ].map((item, idx) => (
                  <div key={idx} className="bg-white border-4 border-black p-6 shadow-neo-md flex flex-col md:flex-row items-center gap-6 hover:translate-x-2 transition-transform">
                    <div className="w-full md:w-1/2 bg-black text-mint-soft font-mono p-4 border-2 border-black text-base md:text-lg">
                      {item.code}
                    </div>
                    <div className="w-full md:w-1/2">
                      <h3 className="text-xl md:text-2xl font-black uppercase text-black mb-1">{item.title}</h3>
                      <p className="font-bold text-gray-700">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* BLOK 4: KOMPARASI & KOTAK BAHAYA MAUT */}
            <section className="bg-canvas border-4 border-black shadow-neo-xl p-6 md:p-12">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-pine-deep text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">03</span>
                [KASUS / KOMPARASI NYATA]
              </h2>

              {/* Kotak Bahaya Maut */}
              <div className="bg-[#FF0000] border-4 border-black p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center shadow-neo-lg transform -rotate-1 hover:rotate-0 transition-transform">
                <span className="material-symbols-outlined text-white text-[80px] font-black drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] animate-bounce">warning</span>
                <div className="text-white">
                  <h3 className="text-2xl md:text-4xl font-black uppercase mb-2 text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] tracking-tight">
                    [PERINGATAN KESALAHAN FATAL]
                  </h3>
                  <div className="bg-white text-black border-4 border-black p-4 mt-2 text-base md:text-lg font-bold shadow-neo-sm">
                    [PENJELASAN AKIBAT BURUK JIKA SALAH LANGKAH & CARA MENGHINDARINYA DALAM 1-2 KALIMAT].
                  </div>
                </div>
              </div>
            </section>

            {/* BLOK 5: EVALUASI KUIS */}
            <QuizTrigger pageSlug="[pageSlug]" />

            {/* FOOTER NAVIGASI (PREVIOUS / NEXT) */}
            <div className="flex flex-col sm:flex-row justify-between items-center pt-8 gap-4">
              <a
                href="/course/[courseSlug]/[prevSlug]"
                className="bg-canvas text-black font-black uppercase text-sm md:text-lg px-4 py-3 md:px-6 md:py-4 border-4 border-black shadow-neo-md hover:-translate-y-1 hover:-translate-x-1 hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                <span className="material-symbols-outlined font-black">arrow_back</span> [JUDUL BAB SEBELUMNYA]
              </a>
              <a
                href="/course/[courseSlug]/[nextSlug]"
                className="bg-white text-black font-black uppercase text-sm md:text-lg px-4 py-3 md:px-6 md:py-4 border-4 border-black shadow-neo-md hover:-translate-y-1 hover:-translate-x-1 hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2 w-full sm:w-auto justify-center text-center"
              >
                Lanjut ke: [JUDUL BAB BERIKUTNYA] <span className="material-symbols-outlined font-black">arrow_forward</span>
              </a>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}
```

---

## 7. Checklist Kurasi Kualitas Materi (Self-Audit Sebelum Publish)

Sebelum sebuah halaman materi disetujui untuk siswa SMK Mandiri, verifikasi 6 poin wajib berikut:

- [ ] **1. Apakah siswa paham dalam 30 detik pertama?** Ada analogi konkret dan tagline fungsi kerja nyata di Hero raksasa.
- [ ] **2. Apakah bebas dari Wall-of-Text?** Tidak ada paragraf yang melebihi 2–3 kalimat atau 30 kata.
- [ ] **3. Apakah tata letak terasa lega (banyak *whitespace*)?** Menggunakan `space-y-12 md:space-y-16`, padding kartu `p-6 md:p-12`, dan **tanpa ticker ribbon** yang menyita layar.
- [ ] **4. Apakah layout kartu tidak berjejalan?** Menggunakan kartu split horizontal lebar atau 2 kolom lapang, bukan grid 3 kolom sempit bertumpuk teks.
- [ ] **5. Apakah panjang baris file JSX di bawah 300 baris?** Terfokus pada 1 capaian pembelajaran spesifik.
- [ ] **6. Apakah 100% mematuhi Tactile Neo Brutalism?** Border 4px solid hitam, shadow tegas tanpa blur (`shadow-neo-*`), `rounded-none`, dan token warna sesuai `@theme`.

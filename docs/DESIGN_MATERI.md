# PANDUAN STANDAR DESAIN & PENULISAN MATERI LMS SMK MANDIRI
> **File Acuan:** `docs/DESIGN_MATERI.md`  
> **Turunan Dari:** `docs/DESIGN.md` (Tactile Neo Brutalism UI) & `.agents/skills/lms-materi/SKILL.md`  
> **Sasaran Pengguna:** Pembuat materi modul, Guru Pengampu, Pengembang Konten Pembelajaran.

---

## 1. Realita Siswa SMK & Filosofi Belajar

Siswa SMK memiliki karakteristik belajar yang sangat spesifik dan berbeda dengan mahasiswa akademis:
- **Attention Span Pendek (3–5 Menit):** Siswa akan langsung bosan dan *skip* materi jika dalam 10 detik pertama mereka tidak paham tujuannya apa.
- **Alergi "Wall of Text":** Teks berupa paragraf panjang tanpa jeda visual dianggap sebagai "beban pikiran" (*cognitive overload*).
- **Pragmatis (Hands-On):** Siswa SMK lebih cepat paham jika melihat:
  1. *Fungsi nyatanya untuk apa?*
  2. *Contoh barang fisiknya apa?*
  3. *Kalau rusak atau salah langkah, akibatnya apa?*
- **Mobile First / Layar Kecil:** Lebih dari 70% siswa membaca materi melalui smartphone mereka di sela-sela jam istirahat atau praktik lab.

> [!IMPORTANT]
> **Prinsip Utama: "To-the-Point, Visual, & Actionable"**  
> Dilarang bertele-tele, dilarang bercerita panjang tentang sejarah kuno, dan jangan sajikan perdebatan teoritis akademis. Langsung ke inti kegunaan, anatomi fungsi, dan contoh nyata!

---

## 2. Batasan Teknis & Volume Konten (Content Constraints)

Setiap halaman materi di `app/course/.../page.tsx` wajib mematuhi metrik berikut:

| Parameter | Standar Ideal | Batas Maksimum | Catatan |
| :--- | :--- | :--- | :--- |
| **Waktu Baca Siswa** | 3 Menit | 5 Menit | Jika lebih dari 5 menit, pecah materi jadi 2 halaman. |
| **Panjang Baris Kode JSX** | 150 – 250 baris | 300 baris | Halaman di atas 400 baris dipastikan terlalu bertele-tele. |
| **Panjang Paragraf Narasi** | 1 – 2 kalimat | 3 kalimat (Maks. 35 kata) | Gunakan bullet list atau kartu jika poin lebih dari dua. |
| **Rasio Visual vs Teks** | 65% Visual / Kartu | 35% Narasi Teks | Gunakan box model, diagram blok, tabel, dan badge. |
| **Jumlah Poin per Subtopik** | 3 Poin Kunci | 4 Poin Kunci | Siswa SMK hanya mengingat 3 hal penting dalam 1 bab. |
| **Interaktivitas / Simulator** | 1 Fitur Simpel | 2 Fitur | Cukup toggle/stepper simpel, hindari state bercabang rumit. |

---

## 3. Formula Struktur Halaman Materi (Standard 5-Block Blueprint)

Setiap materi yang dibuat **HARUS** mengikuti 5 blok terstruktur berikut dari atas ke bawah:

```
[1. Hero Punchy Banner]       --> Judul singkat + 1 Tagline Fungsi Nyata
        ↓
[2. Analogi 1 Detik]          --> Perumpamaan konkret benda fisik sehari-hari
        ↓
[3. Anatomi / Cara Kerja]     --> 3-4 Kartu bernomor (01, 02, 03) atau Diagram Visual
        ↓
[4. Komparasi / Troubleshooting] --> Tabel Head-to-Head atau Kartu "Masalah vs Solusi"
        ↓
[5. Evaluasi & Quiz]          --> Komponen <QuizTrigger /> langsung setelah materi
```

### Detail Spesifikasi Tiap Blok:

#### Blok 1: Hero Punchy Banner
- **Wajib Ada:**
  - Badge kategori modul (`bg-[#092328] text-white`).
  - Judul materi yang tegas dan singkat (`text-3xl sm:text-5xl font-black uppercase`).
  - 1 kalimat *Tagline* yang menjawab: *"Apa fungsi alat/konsep ini di dunia kerja nyata?"*.
  - Emblem Box miring (`-rotate-2 hover:rotate-0`).
- **Dilarang:** Kalimat pengantar klise (contoh: *"Dalam era digitalisasi global saat ini..."*).

#### Blok 2: Analogi 1 Detik (Real-World Analogy)
- Mengaitkan konsep abstrak ke barang fisik yang disentuh siswa setiap hari.
- **Daftar Analogi Terverifikasi:**
  - *Hardware vs Software vs Brainware* $\rightarrow$ Gitar Fisik vs Not Balok / Lagu vs Gitaris.
  - *HTML vs CSS vs JavaScript* $\rightarrow$ Rangka Rumah vs Cat & Dekorasi vs Kelistrikan/Pintu Otomatis.
  - *Frontend vs Backend vs Database* $\rightarrow$ Pelayan Meja vs Koki Dapur vs Lemari Stok Bahan.
  - *Port & IP Address* $\rightarrow$ Nomor Kamar Hotel vs Alamat Gedung Hotel.
  - *RAM vs Storage (SSD/Harddisk)* $\rightarrow$ Meja Kerja Praktik (cepat tapi sempit) vs Gudang Arsip (luas tapi harus diambil).

#### Blok 3: Anatomi / Cara Kerja Inti (Maksimal 3-4 Langkah)
- Pecah mekanisme kerja menjadi kartu bernomor urut `01`, `02`, `03`.
- Gunakan badge angka tebal (`font-black text-xl border-2 border-black`).
- Setiap langkah hanya berisi: **Aksi** $\rightarrow$ **Penjelasan Singkat (1 kalimat)** $\rightarrow$ **Hasil/Status**.

#### Blok 4: Tabel Komparasi Head-to-Head / Troubleshooting Praktik
- Anak SMK belajar lebih cepat dari perbandingan tegas atau masalah lapangan.
- Gunakan tabel brutalist atau 2 kartu bersanding:
  - Kolom A: Konsep 1 (misal: *Web Statis*) vs Kolom B: Konsep 2 (misal: *Web Dinamis*).
  - Atau: **Gejala Rusak / Error** $\rightarrow$ **Penyebab** $\rightarrow$ **Langkah Perbaikan Lapangan**.

#### Blok 5: Evaluasi & Rangkuman Emas
- 3 kartu ringkasan cepat (`3-Card Bento Row`).
- Langsung sambung ke komponen kuis evaluasi: `<QuizTrigger pageSlug="nama-slug-materi" />`.

---

## 4. Standar Desain Visual Tactile Neo Brutalism (docs/DESIGN.md)

Halaman materi wajib tunduk 100% pada aturan visual antarmuka:

### A. Palet Warna Resmi
```css
/* Tokens */
--canvas: #EAF4ED;       /* Latar utama halaman */
--mint-soft: #8BBB92;    /* Aksen lembut / badge sekunder */
--jade-vibrant: #2A835F; /* Tombol aktif / badge sukses / primary */
--pine-deep: #12544F;    /* Header / kontras gelap medium */
--forest-teal: #092328;  /* Teks gelap / kontainer emblem */
--black: #000000;        /* Garis stroke tinta dan bayangan */
--white: #FFFFFF;        /* Kontainer kartu & highlight */
```

### B. Aturan Absolut Styling (Zero Exception)
1. **Zero-Blur Policy:** Dilarang keras memakai `backdrop-blur`, `filter blur`, atau `shadow-lg` bawaan Tailwind yang berpendar halus.
2. **Heavy Ink Borders:**
   - Panel utama / Kartu: `border-4 border-black`
   - Sub-elemen / Badge / Input: `border-2 border-black`
3. **Hard Offset Shadows:**
   - Hero / Kontainer Utama: `shadow-[8px_8px_0px_0px_#000]`
   - Kartu Standar: `shadow-[4px_4px_0px_0px_#000]`
   - Badge / Micro-button: `shadow-[2px_2px_0px_0px_#000]`
4. **Sudut Tegas:** Selalu `rounded-none`. Tidak boleh menggunakan `rounded-xl`, `rounded-2xl`, atau kapsul bulat (kecuali avatar lingkaran eksplisit).
5. **Tactile Push Physics pada Elemen Interaktif:**
   ```css
   hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000]
   active:translate-x-[4px] active:translate-y-[4px] active:shadow-none
   transition-all cursor-pointer
   ```

---

## 5. Pola Anti-Pattern & Pantangan Keras (Do's and Don'ts)

| ❌ DILARANG KERAS (Anti-Pattern) | ✅ STANDAR BENAR (Best Practice) |
| :--- | :--- |
| **Menulis Definisi Buku Teks vs Definisi Praktis bersanding:** Menghabiskan 2 kartu hanya untuk membedakan gaya bahasa. | **Langsung tulis penjelasan praktisnya:** Siswa tidak butuh membaca definisi kaku yang membingungkan. |
| **Paragraf Pembuka Lebih dari 4 Baris:** Menulis sejarah panjang sebelum masuk ke topik inti. | **Langsung ke topik & analogi:** 1 kalimat fungsi utama + 1 analogi visual barang nyata. |
| **State React Berlebihan untuk Switcher Teks Sederhana:** Membuat 3 tab hanya untuk menampilkan 3 kalimat bergantian. | **Buka semua kartu dalam bentuk Grid:** Siswa bisa langsung *scanning* tanpa harus klik sana-sini di HP. |
| **Jargon Teknis Abstrak Tanpa Penjelasan Fungsional:** Contoh: *"Fotodioda mengonversi partikel foton secara simultan"*. | **Bahasa Lapangan / Bahasa Manusia:** Contoh: *"Sensor kamera menangkap cahaya lalu diubah jadi sinyal digital"*. |
| **File JSX Mencapai 500 – 800 Baris:** Terlalu banyak sub-modul yang dipaksakan masuk ke satu URL. | **Maksimal 200 – 300 Baris:** Materi terfokus pada 1 capaian pembelajaran spesifik. |

---

## 6. Official Code Scaffold / Template Siap Pakai (`page.tsx`)

Gunakan boilerplate standar berikut saat membuat halaman materi baru:

```tsx
"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import QuizTrigger from '@/components/quiz-engine/QuizTrigger';
import Link from 'next/link';

export default function MateriStandardPage() {
  return (
    <>
      <Headbar
        links={[
          { label: 'Silabus', href: '/course/[courseSlug]', isActive: false },
          { label: 'Materi', href: '/course/[courseSlug]/[pageSlug]', isActive: true },
        ]}
      />

      {/* TICKER RIBBON */}
      <div className="fixed top-[64px] left-0 w-full z-40 bg-[#2A835F] border-b-4 border-black py-1.5 px-4 overflow-hidden select-none">
        <div className="flex items-center gap-4 text-xs font-black uppercase text-white font-mono tracking-wider">
          <span>■ MODUL: [NAMA_MODUL]</span>
          <span>● KELAS [X/XI/XII] SMK</span>
          <span className="bg-black text-[#8BBB92] px-2 py-0.5 border border-black shadow-[2px_2px_0px_0px_#000]">
            ★ [TOPIK_UTAMA]
          </span>
        </div>
      </div>

      <div
        className="flex pt-[104px] min-h-screen bg-[#EAF4ED] text-black font-sans"
        style={{
          backgroundImage: 'radial-gradient(#000000 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      >
        <Sidebar courseSlug="[courseSlug]" />

        <main className="md:ml-[280px] w-full p-4 sm:p-6 md:p-8 relative">
          <div className="max-w-5xl mx-auto space-y-8 md:space-y-10">

            {/* BLOK 1: HERO SECTION */}
            <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-6 sm:p-8 relative">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#092328] text-white text-xs font-black uppercase px-2.5 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                      MATERI [NOMOR]
                    </span>
                    <span className="bg-[#8BBB92] text-black text-xs font-black uppercase px-2.5 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                      DURASI 3 MENIT
                    </span>
                  </div>
                  <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black">
                    [JUDUL MATERI SINGKAT]
                  </h1>
                  <p className="text-sm sm:text-base font-bold text-gray-800 leading-snug">
                    [1 KALIMAT JELAS MENGENAI FUNGSI ALAT / KONSEP INI DI DUNIA KERJA]
                  </p>
                </div>
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-[#092328] border-4 border-black shadow-[6px_6px_0px_0px_#000] transform -rotate-2 flex flex-col items-center justify-center text-white shrink-0">
                  <span className="material-symbols-outlined text-4xl text-[#8BBB92]">build</span>
                  <span className="text-[10px] font-mono font-black mt-1 uppercase">PRAKTIK</span>
                </div>
              </div>
            </section>

            {/* BLOK 2: ANALOGI 1 DETIK */}
            <section className="bg-[#8BBB92] border-4 border-black shadow-[6px_6px_0px_0px_#000] p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <span className="text-3xl shrink-0">💡</span>
                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-black uppercase text-black">
                    Analogi Sederhana: [PERUMPAMAAN BENDA SEHARI-HARI]
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-black leading-relaxed">
                    [JELASKAN HUBUNGAN BENDA FISIK DENGAN KONSEP TEKNIS INI DALAM MAKSIMAL 2 KALIMAT].
                  </p>
                </div>
              </div>
            </section>

            {/* BLOK 3: CARA KERJA / 3 POIN UTAMA */}
            <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-6 space-y-5">
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black border-b-4 border-black pb-3 flex items-center gap-2">
                <span className="bg-[#2A835F] text-white px-2 py-0.5 border-2 border-black text-sm">INTI</span>
                3 Langkah / Komponen Kunci
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { no: '01', title: '[KOMPONEN / TAHAP 1]', desc: '[PENJELASAN 1 KALIMAT LANGSUNG ACTIONABLE]' },
                  { no: '02', title: '[KOMPONEN / TAHAP 2]', desc: '[PENJELASAN 1 KALIMAT LANGSUNG ACTIONABLE]' },
                  { no: '03', title: '[KOMPONEN / TAHAP 3]', desc: '[PENJELASAN 1 KALIMAT LANGSUNG ACTIONABLE]' },
                ].map((item, idx) => (
                  <div key={idx} className="bg-[#EAF4ED] border-3 border-black p-4 space-y-2 shadow-[3px_3px_0px_0px_#000]">
                    <span className="font-mono text-xs font-black bg-[#092328] text-[#8BBB92] px-2 py-0.5 border border-black inline-block">
                      {item.no}
                    </span>
                    <h4 className="font-black text-sm uppercase text-black">{item.title}</h4>
                    <p className="text-xs font-bold text-gray-700 leading-normal">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* BLOK 4: KOMPARASI / PANDUAN LAPANGAN */}
            <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-6 space-y-4">
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black border-b-4 border-black pb-3">
                Perbandingan Praktis (Head-to-Head)
              </h2>
              <div className="overflow-x-auto border-3 border-black">
                <table className="w-full text-left border-collapse text-xs sm:text-sm font-bold">
                  <thead>
                    <tr className="bg-[#092328] text-white border-b-3 border-black">
                      <th className="p-3 border-r-2 border-black">Aspek</th>
                      <th className="p-3 border-r-2 border-black bg-[#2A835F]">[Kategori A]</th>
                      <th className="p-3">[Kategori B]</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-black bg-[#FAF8F5]">
                    <tr>
                      <td className="p-3 font-black bg-white border-r-2 border-black">Fungsi Utama</td>
                      <td className="p-3 border-r-2 border-black">[Fungsi A Singkat]</td>
                      <td className="p-3">[Fungsi B Singkat]</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-black bg-white border-r-2 border-black">Contoh Nyata</td>
                      <td className="p-3 border-r-2 border-black">[Contoh A Sehari-hari]</td>
                      <td className="p-3">[Contoh B Sehari-hari]</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* BLOK 5: EVALUASI & QUIZ */}
            <section className="space-y-4">
              <div className="bg-[#12544F] border-4 border-black shadow-[6px_6px_0px_0px_#000] p-6 text-white text-center space-y-2">
                <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight">
                  Sudah Paham Inti Materinya?
                </h3>
                <p className="text-xs sm:text-sm text-gray-200 font-bold max-w-lg mx-auto">
                  Uji pemahamanmu sekarang melalui kuis interaktif di bawah ini untuk mendapatkan nilai modul!
                </p>
              </div>

              <QuizTrigger pageSlug="[pageSlug]" />
            </section>

          </div>
        </main>
      </div>
    </>
  );
}
```

---

## 7. Checklist Kurasi Kualitas Materi (Self-Audit Sebelum Publish)

Sebelum sebuah halaman materi disetujui untuk siswa SMK Mandiri, verifikasi 5 poin wajib berikut:

- [ ] **1. Apakah siswa paham dalam 30 detik pertama?** Ada analogi konkret dan tagline fungsi kerja nyata di Hero.
- [ ] **2. Apakah bebas dari Wall-of-Text?** Tidak ada paragraf yang melebihi 3 kalimat atau 35 kata.
- [ ] **3. Apakah panjang baris file JSX di bawah 300 baris?** Jika lebih, pangkas teks berlebih atau bagi menjadi modul berikutnya.
- [ ] **4. Apakah ramah layar smartphone?** Seluruh grid berformat `grid-cols-1 md:grid-cols-2/3`, tombol mudah ditekan, dan tabel dibungkus `overflow-x-auto`.
- [ ] **5. Apakah 100% mematuhi Tactile Neo Brutalism?** Border tebal 4px hitam, shadow tegas tanpa blur, `rounded-none`, dan warna palet token sesuai `docs/DESIGN.md`.

# 📘 Ringkasan Materi Belajar CSS — WebPoint 11 RPL 2

> Dokumen ini merangkum seluruh materi CSS untuk siswa, mulai dari konsep fundamental hingga tata letak modern (Flexbox/Grid) yang digunakan dalam template Portfolio.

---

## Daftar Isi

**Bagian 1: Fundamental CSS**
1. [Pengenalan & Filosofi CSS](#1-pengenalan--filosofi-css)
2. [Tiga Jalur Memanggil CSS](#2-tiga-jalur-memanggil-css)
3. [Anatomi Sintaks & Dasar Selector](#3-anatomi-sintaks--dasar-selector)
4. [Hirarki & Kasta CSS (Specificity)](#4-hirarki--kasta-css-specificity)
5. [Mengenal Satuan Ukuran (CSS Units)](#5-mengenal-satuan-ukuran-css-units)

**Bagian 2: Visual & Tampilan Dasar**
6. [Tipografi & Web Fonts](#6-tipografi--web-fonts)
7. [Warna & Latar Belakang](#7-warna--latar-belakang)
8. [Sifat Tampilan (Display)](#8-sifat-tampilan-display)

**Bagian 3: Dimensi & Tata Letak**
9. [Rahasia Terbesar: The Box Model](#9-rahasia-terbesar-the-box-model)
10. [Modern Layout 1: Flexbox](#10-modern-layout-1-flexbox)
11. [Modern Layout 2: CSS Grid](#11-modern-layout-2-css-grid)

**Bagian 4: Posisi Mutlak & Sihir Visual**
12. [Mengendalikan Koordinat & Z-Index](#12-mengendalikan-koordinat--z-index)
13. [Elemen Gaib (Pseudo-elements)](#13-elemen-gaib-pseudo-elements)
14. [Interaksi Form & Animasi (Pseudo-classes)](#14-interaksi-form--animasi-pseudo-classes)

**Bagian 5: Level Lanjut**
15. [CSS Variables & Responsive Design](#15-css-variables--responsive-design)

---

## 1. Pengenalan & Filosofi CSS

### CSS Ibarat Desain Interior dan Cat Rumah
Jika HTML adalah susunan batu bata, pondasi, dan tiang (kerangka), maka **CSS (Cascading Style Sheets)** adalah cat tembok, wallpaper, lampu hias, dan tirai jendelanya. Tanpa CSS, halaman web (seperti Facebook atau YouTube) hanya akan berupa teks hitam putih yang berjejer kaku dari atas ke bawah.

**Fungsi Utama CSS:**
1. Mengubah warna, ukuran, dan jenis huruf.
2. Mengatur tata letak (membuat kotak bersebelahan atau tumpuk).
3. Memberikan efek animasi dan interaksi (misal: tombol berubah warna saat disentuh).
4. Membuat web responsif (tampilannya menyesuaikan ukuran layar HP vs Laptop).

---

## 2. Tiga Jalur Memanggil CSS

Agar desain CSS bisa berfungsi di HTML, kita harus menghubungkannya. Ada 3 cara:

### 1. Inline CSS (Di dalam tag HTML)
Ditulis langsung di dalam tag menggunakan atribut `style`. **Hanya gunakan untuk keadaan darurat!**
```html
<h1 style="color: red; font-size: 20px;">Teks Merah</h1>
```

### 2. Internal CSS (Di dalam tag `<head>`)
Ditulis di dalam tag `<style>` pada bagian `<head>` dokumen HTML.
```html
<style>
  h1 { color: blue; }
</style>
```

### 3. External CSS (File Terpisah) — 🔥 Paling Direkomendasikan
Semua kode desain disimpan dalam file berakhiran `.css` (contoh: `style.css`), lalu dipanggil di HTML menggunakan tag `<link>`. Cara ini membuat kode HTML menjadi sangat bersih.
```html
<!-- Ditaruh di dalam <head> HTML -->
<link rel="stylesheet" href="style.css">
```

---

## 3. Anatomi Sintaks & Dasar Selector

Setiap blok CSS terdiri dari 3 bagian: **Selector** (Siapa yang mau didandani?), **Property** (Apa yang mau diubah?), dan **Value** (Nilainya apa?).

```css
/* Selector */
h1 {
    /* Property  :  Value; */
    color        :  blue;
    font-size    :  24px;
}
```

### Tiga Selector Paling Dasar:
1. **Tag Selector:** Menargetkan semua tag HTML tersebut. (Contoh: `p { ... }` akan mengubah *semua* paragraf).
2. **Class Selector (`.`):** Menargetkan elemen yang memiliki atribut `class`. Sangat fleksibel karena satu class bisa dipakai berkali-kali. (Contoh: `.btn { ... }`).
3. **ID Selector (`#`):** Menargetkan satu elemen spesifik yang memiliki atribut `id`. Tidak boleh ada dua elemen dengan ID yang sama. (Contoh: `#navbar { ... }`).

---

## 4. Hirarki & Kasta CSS (Specificity)

Pernah menulis kode CSS tapi tidak ada perubahan di layar? Kemungkinan kodemu "kalah kasta". CSS memiliki aturan siapa yang paling kuat jika ada konflik.

**Urutan Kasta dari yang terkuat hingga terlemah:**
1. Inline Style (`style="..."` di HTML) 🥇
2. ID Selector (`#nama`) 🥈
3. Class Selector (`.nama`) 🥉
4. Tag Selector (`h1`, `p`)

**Aturan Kedua (Cascading):** Jika kastanya sama, maka kode yang ditulis **paling bawah/terakhir** yang akan menang!

---

## 5. Mengenal Satuan Ukuran (CSS Units)

Di CSS, ada banyak cara mengukur panjang, lebar, atau besaran font:

| Satuan | Kepanjangan | Penjelasan |
|---|---|---|
| `px` | Pixels | Satuan mutlak/tetap. 16px akan selalu sebesar itu di layar mana pun. |
| `%` | Persen | Relatif terhadap wadahnya. `width: 50%` berarti elemen mengambil setengah lebar wadahnya. |
| `rem` | Root EM | Satuan untuk teks modern. `1rem` = ukuran teks standar browser (biasanya 16px). Lebih ramah untuk aksesibilitas dan *zoom*. |
| `vh` / `vw`| Viewport Height/Width | Persentase dari ukuran layar fisik. `100vh` berarti tingginya persis 100% menutupi layar monitor (sering dipakai untuk Hero Section). |

---

## 6. Tipografi & Web Fonts

CSS bisa mengubah wajah tulisan menggunakan kombinasi properti berikut:

```css
p {
    font-family: 'Outfit', sans-serif; /* Jenis huruf */
    font-size: 1.2rem;                 /* Besaran huruf */
    font-weight: 700;                  /* Ketebalan (400 normal, 700 bold) */
    text-align: center;                /* Rata tengah (left, right, justify) */
    line-height: 1.6;                  /* Jarak antar baris (spasi) */
    text-decoration: none;             /* Menghilangkan garis bawah pada link */
}
```

> 💡 **Google Fonts:** Di HTML, kamu sering melihat `<link href="...fonts.googleapis.com...">`. Itu adalah cara meminjam font keren dari Google agar bisa dipakai di `font-family` CSS.

---

## 7. Warna & Latar Belakang

Ada beberapa cara memanggil warna di CSS:

1. **Nama Warna (Keyword):** `red`, `blue`, `transparent`
2. **Kode Hex (Hexadecimal):** `#000000` (Hitam), `#FFFFFF` (Putih), `#3b82f6` (Biru Terang). Paling sering dipakai desainer!
3. **RGB / RGBA:** `rgba(0, 0, 0, 0.5)` (Warna hitam dengan transparansi 50%).

```css
.kotak {
    color: #1f2937;              /* Warna teks */
    background-color: #ffffff;     /* Warna latar belakang */
}
```

---

## 8. Sifat Tampilan (Display)

Setiap elemen HTML punya sifat bawaan bagaimana mereka menempati ruang. Properti `display` bisa mengubah sifat ini.

- `display: block;` : Elemen mengambil satu baris penuh. Memaksa elemen selanjutnya turun ke bawah (Contoh bawaan: `<div>`, `<h1>`, `<p>`).
- `display: inline;` : Elemen hanya selebar isinya dan bersebelahan (Contoh bawaan: `<span>`, `<a>`). Aturan *Width* dan *Height* **TIDAK** berlaku di sini!
- `display: inline-block;` : Gabungan keduanya. Bersebelahan seperti *inline*, tapi bisa diatur lebar dan tingginya seperti *block*. (Sering dipakai untuk mendesain tombol).
- `display: none;` : Menyembunyikan elemen seolah-olah dihapus dari layar.

---

## 9. Rahasia Terbesar: The Box Model

Semua elemen di website pada dasarnya adalah **KOTAK**. CSS Box Model mengatur ruang di dalam dan di luar kotak tersebut.

1. **Content:** Isi kotaknya (teks atau gambar).
2. **Padding:** Ruang kosong di *dalam* kotak (antara isi konten dan batas/garis).
3. **Border:** Garis pembatas luar kotak. (Gunakan `border-radius: 8px;` untuk membuat sudut kotak melengkung).
4. **Margin:** Jarak kosong di *luar* kotak (jarak untuk mendorong kotak lain agar tidak menempel).

### CSS Reset Wajib!
Seringkali padding membuat ukuran kotak melar menjadi rusak. Gunakan kode "Sapu Jagat" ini di baris paling atas file CSS kamu agar ukuran kotak tetap stabil walau ditambah padding:
```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box; 
}
```

---

## 10. Modern Layout 1: Flexbox

**Flexbox (Flexible Box)** adalah keajaiban CSS modern. Digunakan untuk merapikan elemen berjejer ke samping (kolom) atau ke bawah (baris) secara otomatis, tanpa perlu repot menghitung lebar pixel.

Syarat utama: Kamu harus mengubah sifat wadah besarnya (Parent) menjadi `display: flex;`.

```css
.wadah {
    display: flex;
    justify-content: space-between; /* Mengatur jarak horizontal */
    align-items: center;            /* Mengatur perataan vertikal ke tengah */
    gap: 20px;                      /* Memberi jarak antar elemen di dalamnya */
}
```
*Flexbox sangat sering digunakan untuk membuat Menu Navigasi (Navbar).*

---

## 11. Modern Layout 2: CSS Grid

Jika Flexbox ibarat menata rel kereta api (1 dimensi), maka **CSS Grid** ibarat menyusun papan catur (2 dimensi: punya baris dan kolom sekaligus). Sangat cocok untuk membuat Galeri Foto atau Daftar Proyek.

```css
.projects-grid {
    display: grid;
    /* Membuat kolom otomatis yang lebarnya minimal 300px */
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}
```
Kode ajaib di atas memastikan bahwa jika layar laptop luas, kartu proyek berjejer 3 atau 4 ke samping. Tapi jika di layar HP yang sempit, kartu otomatis tumpuk 1 ke bawah!

---

## 12. Mengendalikan Koordinat & Z-Index

Properti `position` melepaskan elemen dari hukum alam HTML.
- `position: static;` : Posisi normal/bawaan.
- `position: relative;` : Bergeser dari posisi aslinya menggunakan properti `top`, `bottom`, `left`, `right`.
- `position: absolute;` : Mengambang bebas tanpa batas. Sangat berbahaya kalau tidak dikendalikan! Dia akan berpatokan pada elemen induk terdekat yang memiliki posisi `relative`.
- `position: sticky;` : Gabungan normal dan fix. Elemen akan menempel di layar saat kamu nge-scroll ke bawah (Sangat berguna untuk Navbar).

### Apa itu Z-Index?
Jika ada dua elemen bertumpuk, siapa yang ada di atas? Properti `z-index` (seperti lapisan kue) menentukan tingkat kedalamannya. Semakin besar angkanya, semakin di depan.
```css
nav {
    position: sticky;
    top: 0;
    z-index: 100; /* Pastikan navbar tidak pernah tertimpa elemen lain saat di-scroll */
}
```

---

## 13. Elemen Gaib (Pseudo-elements)

Terkadang kita butuh membuat bentuk atau garis hiasan tanpa harus mengotori HTML dengan kode `<div>` kosong. Kita bisa menciptakan "elemen gaib" dari CSS menggunakan `::before` (Sebelum) dan `::after` (Sesudah).

```css
.timeline::after {
    content: ''; /* Wajib ada, walau kosong! */
    position: absolute;
    width: 2px;
    background: gray;
}
```
Trik ini sangat populer untuk membuat garis vertikal pada riwayat pekerjaan (Timeline) atau hiasan peluru (bullets) khusus pada list.

---

## 14. Interaksi Form & Animasi (Pseudo-classes)

Kamu bisa memberikan CSS khusus ketika elemen sedang berada dalam *keadaan tertentu* menggunakan Pseudo-classes (dimulai dengan titik dua `:`).

- `:hover` -> Saat kursor mouse melayang di atas elemen.
- `:focus` -> Saat elemen input teks diklik dan sedang diketik.

### Memperhalus Interaksi
Agar warna tidak berubah kaku seketika saat di-hover, tambahkan `transition`.
Untuk efek seperti mengangkat atau memutar, gunakan `transform`.

```css
.btn {
    background-color: blue;
    transition: all 0.3s ease; /* Semua perubahan butuh waktu 0.3 detik */
}

.btn:hover {
    background-color: darkblue;
    transform: translateY(-5px); /* Elemen terangkat ke atas 5 pixel */
}
```

---

## 15. CSS Variables & Responsive Design

### CSS Variables (Custom Properties)
Bayangkan kamu punya 50 elemen berwarna biru di website. Jika klien minta diubah jadi merah, kamu harus mencari 50 baris kode! Dengan Variabel CSS (disimpan di `:root`), kamu cukup mengubah 1 baris saja.

```css
:root {
    --warna-utama: #3b82f6; /* Definisikan variabel */
}

h1 { color: var(--warna-utama); } /* Panggil variabelnya */
button { background-color: var(--warna-utama); }
```

### Media Queries (@media)
Inilah inti dari **Responsive Web Design**. Kita bisa menyuruh browser, *"Tolong pakai CSS ini HANYA JIKA ukuran layarnya kurang dari 768px (ukuran Tablet/HP)!"*

```css
/* Tampilan Default (Desktop) */
.nav-links { display: flex; }

/* Tampilan Layar Sempit (Mobile) */
@media (max-width: 768px) {
    .nav-links {
        display: none; /* Sembunyikan menu di HP agar tidak berantakan */
    }
}
```

---
*Materi ini disusun untuk mendampingi pemahaman Template Portofolio HTML & CSS.*

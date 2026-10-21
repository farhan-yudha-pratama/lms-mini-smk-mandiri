# 📘 Ringkasan Materi Belajar HTML — WebPoint 11 RPL 2

> Dokumen ini merangkum seluruh konten materi yang tersedia di aplikasi WebPoint, mulai dari pengenalan HTML hingga project database MySQL.

---

## Daftar Isi

1. [Pengenalan HTML](#1-pengenalan-html)
2. [Elemen & Tag HTML](#2-elemen--tag-html)
3. [Heading & Paragraf](#3-heading--paragraf)
4. [Link & Gambar](#4-link--gambar)
5. [List & Tabel](#5-list--tabel)
6. [Form HTML](#6-form-html)
7. [Multimedia & Embed](#7-multimedia--embed)
8. [Semantic HTML](#8-semantic-html)
9. [Meta, HEAD & SEO](#9-meta-head--seo)

---

## 1. Pengenalan HTML

### HTML Ibarat Rangka Bangunan

Bayangkan kamu sedang membangun sebuah **Rumah**. Sebelum rumah itu dicat atau dipasangi listrik, kamu harus membangun pondasi, dinding bata, dan tiang-tiang penyangganya.

**HTML (HyperText Markup Language)** adalah kerangka atau struktur dari sebuah halaman web. Tanpa HTML, tidak akan ada teks, gambar, atau elemen apapun yang bisa ditampilkan di browser.

| Konsep | Penjelasan |
|--------|-----------|
| **Struktur Utama** | HTML menentukan di mana judul, paragraf, dan gambar ditempatkan. |
| **Bahasa Web** | Semua browser (Chrome, Firefox, dll) membaca HTML untuk menampilkan halaman. |
| **Bukan Programming** | HTML adalah bahasa "Markup", bukan bahasa pemrograman karena tidak punya logika. |

> 💡 **Analogi:** "HTML adalah pondasinya, CSS adalah desain/catnya, dan JavaScript adalah listrik/air yang membuatnya hidup."

---

### Anatomi Elemen HTML

Contoh struktur dasar: `<p class="teks">Halo!</p>`

| Bagian | Contoh | Penjelasan |
|--------|--------|-----------|
| **Tag Pembuka** | `<p>` | Digunakan untuk memulai sebuah elemen. Ditulis dengan menggunakan kurung sudut (angle brackets). |
| **Atribut** | `class="teks"` | Memberikan informasi tambahan pada sebuah elemen HTML. Selalu diletakkan di dalam tag pembuka dan biasanya berbentuk `name="value"`. |
| **Tag Penutup** | `</p>` | Menandakan akhir dari sebuah elemen. Sama seperti tag pembuka namun ditambahkan garis miring (slash) di depan nama tag-nya. |

> "Setiap elemen di layar browser kamu pada dasarnya dibangun dengan kotak-kotak elemen HTML ini!"

---

### Struktur Dasar Wajib HTML5

Setiap kali kamu membuat file HTML baru, kamu harus selalu menuliskan kerangka dasarnya. Tanpa kerangka ini, browser bisa salah membaca isi website kamu.

```html
<!DOCTYPE html>
<html lang="id">
<head>
    <title>Halaman Pertamaku</title>
</head>
<body>
    <!-- Isi website ditaruh di sini -->
</body>
</html>
```

| Tag/Atribut | Fungsi |
|-------------|--------|
| `<!DOCTYPE html>` | Baris paling atas yang **wajib** ada. Ini memberitahu browser, "Hei, ini adalah file HTML versi 5 (terbaru)!" |
| `<html lang="id">` | Membungkus seluruh halaman. Atribut `lang="id"` memberitahu Google dan Browser bahwa website ini menggunakan bahasa Indonesia. (Gunakan `en` untuk bahasa Inggris). |

---

## 2. Elemen & Tag HTML

### Apa Beda Elemen dan Tag?

| Istilah | Penjelasan |
|---------|-----------|
| **Tag HTML** | Tag adalah penanda yang diapit oleh kurung sudut `< >`. Tag memberi tahu browser jenis konten apa yang ada di dalamnya. Ada tag pembuka (contoh: `<p>`) dan tag penutup (contoh: `</p>`). |
| **Elemen HTML** | Elemen adalah keseluruhan blok dari awal tag pembuka, konten di dalamnya, hingga akhir tag penutup. Satu elemen adalah satu komponen utuh di halaman. |

**Contoh:** `<h1>Judul Artikel</h1>` adalah satu ELEMEN utuh!

---

### Block vs Inline Element

Secara umum, elemen di HTML terbagi menjadi dua sifat utama saat dirender oleh browser:

#### 1. Block-Level Element
Elemen ini selalu memulai baris baru dan akan mengambil lebar (width) maksimal secara otomatis.

```html
<div>Ini adalah blok pertama</div>
<p>Ini adalah blok kedua (di baris baru)</p>
```

**Contoh Tag:** `<div>`, `<p>`, `<h1>`–`<h6>`, `<ul>`, `<ol>`, `<li>`, `<form>`, dll.

#### 2. Inline Element
Elemen ini **tidak** memulai baris baru dan hanya mengambil ruang selebar konten di dalamnya saja.

```html
<span>Teks Satu</span> dan <span>Teks Dua</span> berada di baris yang sama.
```

**Contoh Tag:** `<span>`, `<a>`, `<strong>`, `<em>`, `<img>`, `<button>`, dll.

---

### Void / Empty Elements (Tag Tunggal)

Elemen yang berdiri sendiri (tidak punya tag penutup) disebut **Void Elements** atau elemen kosong.

| Tag | Nama | Fungsi |
|-----|------|--------|
| `<br>` | Break | Memaksa pindah baris (enter). |
| `<hr>` | Horizontal Rule | Membuat garis lurus mendatar. |
| `<img>` | Image | Menampilkan gambar (membutuhkan atribut `src`). |

---

### Atribut Identitas: `class` dan `id`

Halaman web biasanya memiliki puluhan paragraf atau kotak. Bagaimana cara kita memberikan warna atau memodifikasi satu kotak spesifik tanpa mempengaruhi kotak yang lain? Kita menggunakan atribut **Identitas**.

| Atribut | Aturan Main | Analogi |
|---------|-------------|---------|
| `id="nama"` | Hanya boleh ada **SATU** di seluruh halaman (Unik). Tidak boleh ada elemen lain yang menggunakan ID yang sama. | Seperti Nomor KTP atau NISN. |
| `class="nama"` | Boleh digunakan berkali-kali oleh elemen yang berbeda. | Seperti Seragam Sekolah. Semua siswa kelas 11 RPL bisa memakai class `seragam-rpl`. |

**Contoh Penggunaan:**
```html
<h1 id="judul-utama">Selamat Datang</h1>
<p class="teks-tebal">Paragraf pertama.</p>
<p class="teks-tebal">Paragraf kedua juga memakai desain yang sama.</p>
```
> 💡 **Fungsi Utama:** Nantinya, CSS dan JavaScript akan menggunakan `id` dan `class` ini untuk mencari elemen mana yang ingin diberi warna atau diberi animasi!

---

## 3. Heading & Paragraf

### Heading (Judul Tulisan)

Tag Heading digunakan untuk membuat judul atau sub-judul. Dalam HTML, terdapat **6 tingkatan** heading, mulai dari `<h1>` hingga `<h6>`.

- `<h1>` adalah judul paling penting (ukuran terbesar).
- `<h6>` adalah yang paling tidak penting (ukuran terkecil).

```html
<h1>Ini Heading 1</h1>
<h2>Ini Heading 2</h2>
<h3>Ini Heading 3</h3>
<h4>Ini Heading 4</h4>
<h5>Ini Heading 5</h5>
<h6>Ini Heading 6</h6>
```

> ⚠️ **Penting Untuk SEO!** Gunakan heading dengan berurutan. Jangan gunakan `<h1>` hanya untuk memperbesar tulisan. Idealnya, hanya ada **satu** `<h1>` dalam setiap halaman.

---

### Paragraf & Formatting

Tag `<p>` mendefinisikan sebuah paragraf. Browser secara otomatis menambahkan spasi di atas dan di bawah paragraf.

```html
<p>Ini adalah paragraf pertama saya.</p>
<p>Paragraf kedua otomatis berada di bawah.</p>
```

Format teks inline menggunakan: `<b>` (bold), `<i>` (italic), `<u>` (underline).

```html
<p>Teks ini <b>Tebal</b>, yang ini <i>Miring</i>, dan ini <u>Garis Bawah</u>.</p>
```

---

### Pindah Baris & Garis Pembatas

| Tag | Fungsi |
|-----|--------|
| `<br>` | Turun baris tanpa membuat paragraf baru. |
| `<hr>` | Membuat garis mendatar pembatas antar topik. |

```html
<p>Baris satu <br> Baris dua <br> Baris tiga</p>

<p>Cerita Bab 1</p>
<hr>
<p>Cerita Bab 2</p>
```

---

### Modifikasi Tampilan Cepat (Inline CSS)

Meskipun biasanya warna dan desain diatur di file terpisah (CSS), HTML mengizinkan kita melakukan desain "dadakan" langsung di dalam tag menggunakan atribut **`style`**.

```html
<p style="color: red; font-size: 20px;">Teks ini berwarna merah dan besar.</p>
<span style="background-color: yellow;">Teks dengan stabilo kuning</span>
```
> ⚠️ **Catatan:** Penggunaan `style` di HTML (Inline CSS) biasanya hanya digunakan untuk kasus darurat atau spesifik. Desainer web profesional selalu meletakkan desainnya di file CSS terpisah agar kode HTML tetap bersih!

---

## 4. Link & Gambar

### Tautan (Link) Menggunakan `<a>`

Tag `<a>` (singkatan dari *Anchor*) digunakan untuk membuat sebuah tautan atau *hyperlink*. Membutuhkan atribut wajib **`href`** yang berisi alamat URL tujuan.

#### 1. Link ke Website Lain (External Link)

```html
<a href="https://www.google.com">Buka Google</a>
```

#### 2. Link ke Halaman Sendiri (Internal Link)

```html
<a href="/tentang-kami">Ke Halaman Tentang Kami</a>
<a href="kontak.html">Hubungi Kami</a>
```

#### 3. Membuka Link di Tab Baru

Gunakan atribut **`target="_blank"`**:

```html
<a href="https://www.wikipedia.org" target="_blank">Buka Wikipedia di Tab Baru</a>
```

#### 4. Link Meloncat di Halaman yang Sama (Anchor Link)

Pernahkah kamu mengklik menu di sebuah website, lalu halamannya otomatis *scroll* ke bawah secara mulus? Itu disebut **Anchor Link**.

Caranya adalah dengan menghubungkan nilai `href` dengan `id` dari elemen tujuan menggunakan tanda pagar (`#`).

```html
<!-- Tombol yang diklik -->
<a href="#bagian-kontak">Pergi ke Bawah</a>

<p>... banyak konten panjang di sini ...</p>

<!-- Tujuan tempat mendarat -->
<section id="bagian-kontak">
    <h2>Hubungi Kami</h2>
</section>
```

---

### Gambar (Images) Menggunakan `<img>`

Tag `<img>` adalah **elemen tunggal (void element)** — tidak memiliki tag penutup.

**Atribut Wajib:**

| Atribut | Fungsi |
|---------|--------|
| `src=""` | *Source*. Berisi alamat atau lokasi file gambar. |
| `alt=""` | *Alternative Text*. Teks pengganti jika gambar gagal dimuat. Penting untuk **SEO** dan aksesibilitas. |

```html
<img src="kucing.jpg" alt="Foto Anak Kucing Lucu">
<img src="https://example.com/logo.png" alt="Logo Perusahaan" width="200" height="100">
```

---

### Gambar Sebagai Tautan (Clickable Image)

Masukkan tag `<img>` ke dalam tag `<a>`:

```html
<a href="https://www.youtube.com" target="_blank">
  <img src="logo-youtube.png" alt="Buka YouTube">
</a>
```

---

### Mengenal Tag `<svg>` (Scalable Vector Graphics)

Selain menggunakan `<img>` untuk memasukkan foto (JPG/PNG), HTML modern sering menggunakan **SVG** untuk menampilkan logo atau ikon.

SVG adalah gambar yang dibuat menggunakan *kode matematika*, bukan kumpulan pixel. Kelebihannya: gambar SVG tidak akan pernah pecah (blur) meskipun di-zoom sebesar apapun!

```html
<!-- Contoh kode SVG untuk membuat sebuah lingkaran -->
<svg width="100" height="100">
  <circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" />
</svg>
```
> 💡 **Info:** Dalam template modern, ikon seperti logo Instagram atau GitHub biasanya berupa barisan kode `<svg>` dan `<path>` yang panjang. Kamu tidak perlu menghafalnya, karena ikon ini biasanya di-copy paste langsung dari situs penyedia ikon (seperti *FontAwesome* atau *FeatherIcons*).

---

## 5. List & Tabel

### Membuat Daftar (Lists)

Setiap item daftar harus dibungkus dengan tag `<li>` (List Item).

#### Unordered List `<ul>` — Daftar tanpa urutan

```html
<ul>
  <li>Apel</li>
  <li>Jeruk</li>
  <li>Mangga</li>
</ul>
```

#### Ordered List `<ol>` — Daftar berurutan

```html
<ol>
  <li>Panaskan air</li>
  <li>Masukkan mi</li>
  <li>Tiriskan mi</li>
</ol>
```

---

### Membuat Tabel (Tables)

| Tag | Fungsi |
|-----|--------|
| `<table>` | Wadah utama tabel |
| `<tr>` | Table Row (Membuat baris mendatar) |
| `<th>` | Table Header (Kolom judul, tebal & tengah) |
| `<td>` | Table Data (Isi sel di dalam kolom) |

```html
<table border="1">
  <tr>
    <th>Nama</th>
    <th>Kelas</th>
    <th>Nilai</th>
  </tr>
  <tr>
    <td>Andi</td>
    <td>11 RPL 1</td>
    <td>85</td>
  </tr>
  <tr>
    <td>Budi</td>
    <td>11 RPL 2</td>
    <td>90</td>
  </tr>
</table>
```

---

### Menggabungkan Sel (Colspan & Rowspan)

| Atribut | Fungsi |
|---------|--------|
| `colspan="N"` | Menggabungkan **kolom** (melebar ke samping). |
| `rowspan="N"` | Menggabungkan **baris** (memanjang ke bawah). |

```html
<table border="1">
  <tr>
    <th colspan="2">Daftar Piket (Gabung 2 Kolom)</th>
  </tr>
  <tr>
    <td rowspan="2">Senin (Gabung 2 Baris)</td>
    <td>Andi</td>
  </tr>
  <tr>
    <td>Budi</td>
  </tr>
</table>
```

---

### Tabel Semantik Lanjutan (Advanced)

| Tag | Fungsi |
|-----|--------|
| `<thead>` | Membungkus baris kepala (header) tabel. |
| `<tbody>` | Membungkus badan/konten utama tabel. |
| `<tfoot>` | Membungkus baris kaki tabel (hasil/total). |

---

## 6. Form HTML

### Struktur Tag `<form>`

Semua input dari pengguna harus dibungkus di dalam tag `<form>`.

| Atribut | Penjelasan |
|---------|-----------|
| `action="..."` | URL tujuan pengiriman data saat tombol submit ditekan. |
| `method="..."` | **GET** (data via URL, tidak aman) atau **POST** (data di balik layar, lebih aman). |

```html
<form action="/proses-login.php" method="POST">
  <!-- Isi input ditaruh di sini -->
</form>
```

---

### Mengenal Input & Label

Tag `<input>` membuat kolom masukan. Bentuknya ditentukan oleh atribut **`type=""`**.

#### Input Text & Password

```html
<label for="username">Username:</label>
<input type="text" id="username" name="username">

<label for="pwd">Password:</label>
<input type="password" id="pwd" name="pwd">
```

#### Radio & Checkbox

- **Radio:** Pilih salah satu opsi saja.
- **Checkbox:** Boleh pilih banyak opsi.

```html
<input type="radio" id="pria" name="gender">
<label for="pria">Pria</label>
<input type="radio" id="wanita" name="gender">
<label for="wanita">Wanita</label>

<input type="checkbox" id="setuju">
<label for="setuju">Saya setuju dengan syarat</label>
```

---

### Dropdown, Pesan & Tombol

#### Dropdown (Select)

```html
<select name="kelas">
  <option value="11rpl1">11 RPL 1</option>
  <option value="11rpl2">11 RPL 2</option>
</select>
```

#### Pesan Panjang (Textarea)

```html
<textarea name="pesan" rows="4"></textarea>
```

#### Tombol Submit

```html
<input type="submit" value="Kirim Data">
<!-- ATAU -->
<button type="submit">Kirim Data</button>
```

---

## 7. Multimedia & Embed

### HTML Video & Audio

Di HTML5, kita menggunakan tag native `<video>` dan `<audio>` — tidak perlu plugin eksternal. Keduanya membutuhkan atribut **`controls`** agar tombol Play/Pause muncul.

#### Tag `<audio>`

```html
<audio controls>
  <source src="lagu.mp3" type="audio/mpeg">
  Browser kamu tidak support audio.
</audio>
```

#### Tag `<video>`

```html
<video width="320" height="240" controls>
  <source src="film.mp4" type="video/mp4">
  Browser kamu tidak support video.
</video>
```

> 💡 **Atribut Autoplay & Loop:** Tambahkan `autoplay loop muted` untuk memutar otomatis dan mengulang. Browser modern mewajibkan `muted` agar autoplay bisa berfungsi.

---

### Embed Konten dengan `<iframe>`

**Inline Frame** (`<iframe>`) membuat "jendela kecil" untuk menampilkan halaman web lain.

| Atribut | Fungsi |
|---------|--------|
| `src="..."` | URL sumber yang akan dimuat. |
| `title="..."` | Deskripsi singkat tentang isi iframe (penting untuk aksesibilitas & SEO). |

```html
<iframe
  src="https://id.wikipedia.org/"
  title="Wikipedia Indonesia"
  width="100%"
  height="300">
</iframe>
```

> ⚠️ Tidak semua website mengizinkan halamannya di-embed ke dalam iframe (faktor keamanan XSS/Clickjacking).

---

## 8. Semantic HTML

### Wadah Generik: `<div>` & `<span>`

Dua tag ini disebut **Non-Semantic** — tidak memiliki makna khusus tentang apa isi kontennya.

| Tag | Sifat | Analogi |
|-----|-------|---------|
| `<div>` | Block-level | Kotak besar untuk mengelompokkan isi halaman |
| `<span>` | Inline-level | Menyorot (highlight) kata tertentu di dalam teks |

```html
<div>
  <h2>Judul Artikel</h2>
  <p>Isi artikel di dalam kotak div.</p>
</div>

<p>Ini teks biasa, dan <span style="color:red">ini merah</span>.</p>
```

---

### Mengenal Tag Semantic HTML5

HTML5 menyediakan tag **Semantic** yang nama tag-nya menjelaskan "Apa isi konten di dalamnya" (solusi dari masalah "Div Soup").

| Tag | Fungsi |
|-----|--------|
| `<header>` | Bagian kepala (atas) halaman web atau artikel. |
| `<nav>` | *Navigation* — membungkus sekumpulan link menu. |
| `<main>` | Konten utama dokumen. Hanya boleh ada **satu** per halaman! |
| `<article>` | Konten independen yang bisa berdiri sendiri (post blog, berita, komentar). |
| `<section>` | Mengelompokkan konten berkaitan dalam satu tema (seperti bab dalam buku). |
| `<aside>` | Konten di "samping" (iklan, widget, link terkait). |
| `<footer>` | Bagian kaki/bawah dokumen (hak cipta, kontak, media sosial). |

#### Contoh Struktur Modern:

```html
<body>
  <header>
    <nav>Menu</nav>
  </header>

  <main>
    <section>
      <article>Isi Berita</article>
    </section>
    <aside>Iklan</aside>
  </main>

  <footer>Hak Cipta</footer>
</body>
```

---

### Mengapa Harus Pakai Semantic HTML?

1. **Ramah Mesin Pencari (SEO):** Google memprioritaskan teks di dalam tag `<header>` atau `<article>` daripada tag generik `<div>`.

2. **Aksesibilitas (Tunanetra):** Software pembaca layar (Screen Reader) menggunakan tag semantic untuk memandu pengguna melompat antar menu navigasi dan konten.

3. **Kode Mudah Dibaca:** Kode yang rapi dengan `<nav>`, `<section>`, dan `<footer>` jauh lebih mudah dipahami programmer lain daripada ratusan `<div>` bertumpuk.

---

## 9. Meta, HEAD & SEO

### Anatomi Tag `<head>`

Elemen `<head>` merupakan "otak" dari dokumen HTML. Konten di dalamnya tidak tampil langsung di halaman web, tetapi berfungsi untuk menyimpan metadata, memanggil file CSS eksternal, dan menginstruksikan browser cara merender halaman.

#### Title, Link & Favicon

| Elemen | Penjelasan |
|--------|-----------|
| **Title** | Judul yang tampil di Tab Browser dan hasil pencarian Google. Maks. 60 karakter. |
| **Link Rel="Stylesheet"** | Menghubungkan file CSS eksternal. |
| **Favicon** | Ikon/logo kecil berukuran 32x32 pixel di samping judul tab browser. |

```html
<head>
  <title>Belajar HTML - EduBrutal</title>
  <link rel="stylesheet" href="style.css">
  <link rel="icon" href="/favicon.png">
</head>
```

---

### Meta Tag Wajib (Sistem)

#### Meta Charset (Encoding)

```html
<meta charset="UTF-8">
```

Mengizinkan browser membaca semua alfabet di bumi, huruf Arab, Kanji, hingga Emoji 🚀 tanpa ada yang error.

#### Meta Viewport (Mobile)

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

- `width=device-width`: Memaksa lebar website mengikuti lebar fisik layar.
- `initial-scale=1.0`: Mengatur tingkat zoom bawaan ke angka 1.

---

### Meta Tag Tingkat Lanjut (SEO & Sosmed)

#### 1. SEO Standar (Google)

```html
<meta name="description" content="Tutorial HTML terlengkap. Belajar ngoding web dari nol sampai bisa.">
<meta name="author" content="Tim EduBrutal">
<meta name="keywords" content="html, belajar web, rpl, coding">
```

`description` adalah paragraf abu-abu di bawah judul hasil pencarian Google. Usahakan 150–160 karakter.

#### 2. Open Graph (Facebook & WhatsApp)

```html
<meta property="og:type" content="website">
<meta property="og:title" content="WebPoint HTML">
<meta property="og:description" content="Belajar HTML paling seru.">
<meta property="og:url" content="https://edubrutal.com/html">
<meta property="og:image" content="https://edubrutal.com/thumbnail-sosmed.png">
```

#### 3. Twitter Cards

```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="WebPoint HTML">
<meta name="twitter:image" content="https://edubrutal.com/thumbnail-twitter.png">
```

---

*Dokumen ini dihasilkan dari konten materi aplikasi WebPoint, 11 RPL 2.*

# 🐘 Modul Pembelajaran: Pemrograman Web Dinamis (PHP & MySQL)

> Modul ini adalah tahap akhir bagi siswa kelas 11/12 RPL untuk menyatukan ilmu **HTML, CSS, JS**, dan **Database**. Target utama modul ini adalah mengubah fitur "Buku Tamu" yang sebelumnya memakai *Local Storage* (menyimpan di browser), menjadi sistem nyata yang menyimpan ke *Database MySQL*.

---

## 📌 Daftar Isi
**Bagian 1: Pengantar & Aturan Main PHP**
1. [Apa itu PHP & Peranannya di Server](#1-apa-itu-php--peranannya-di-server)
2. [Aturan "Pulau PHP di Tengah Lautan HTML"](#2-aturan-pulau-php-di-tengah-lautan-html)
3. [Sintaks Dasar PHP (Transisi dari JavaScript)](#3-sintaks-dasar-php-transisi-dari-javascript)

**Bagian 2: Jaring Pengaman Pemula & Debugging**
4. [Misteri Layar Putih & Membaca Pesan Error](#4-misteri-layar-putih--membaca-pesan-error)
5. [Teknik Debugging (Detektif Kode)](#5-teknik-debugging-detektif-kode)
6. [Jurus *Hard Refresh* Anti-Frustrasi](#6-jurus-hard-refresh-anti-frustrasi)

**Bagian 3: Interaksi Data & Form**
7. [Menangkap Data Klien: `$_GET` vs `$_POST`](#7-menangkap-data-klien-_get-vs-_post)
8. [Jebakan Batman: "Undefined Array Key"](#8-jebakan-batman-undefined-array-key)

**Bagian 4: Integrasi & Proyek Akhir (Buku Tamu)**
9. [Membangun Jembatan ke MySQL](#9-membangun-jembatan-ke-mysql)
10. [Eksekusi Proyek CRUD (Buku Tamu Dinamis)](#10-eksekusi-proyek-crud-buku-tamu-dinamis)

---

## Bagian 1: Pengantar & Aturan Main PHP

### 1. Apa itu PHP & Peranannya di Server
Jika HTML adalah kerangka dan CSS adalah baju, maka PHP adalah **Koki di Dapur Restoran**.
Tugas PHP adalah menerima pesanan dari pengguna (lewat form HTML), mengambil bahan dari kulkas (MySQL), mengolah bahan tersebut, dan menyajikannya kembali ke layar dalam bentuk HTML matang.
*   **Ingat!** Kode PHP **tidak akan terlihat** oleh pengunjung web meskipun mereka menekan *View Page Source* di browser. Kode PHP dieksekusi secara rahasia di dalam Web Server (XAMPP).

### 2. Aturan "Pulau PHP di Tengah Lautan HTML"
Syarat utama menjalankan PHP: **Nama file wajib berakhiran `.php`**, (contoh: `index.php`), BUKAN lagi `.html`! Tapi tenang saja, file `.php` tetap bisa membaca kode HTML biasa.

**Analogi Pulau:**
Bayangkan file `index.php` kamu adalah sebuah lautan luas yang isinya HTML. Kamu bisa membuat pulau-pulau kecil khusus untuk mengeksekusi PHP menggunakan tag `<?php` dan `?>`.
```php
<h1>Selamat Datang di Portofolio Saya!</h1> <!-- Ini lautan HTML biasa -->

<?php 
    // Ini pulau PHP! Kamu tidak bisa mengetik HTML sembarangan di sini.
    echo "<h2>Halo, ini dicetak dari PHP!</h2>"; 
?>

<p>Kembali lagi ke lautan HTML.</p>
```

### 3. Sintaks Dasar PHP (Transisi dari JavaScript)
Karena kamu sudah menguasai JavaScript (JS), belajar PHP akan sangat mudah.
*   **Variabel:** Di JS pakai `let nama`. Di PHP **wajib** pakai tanda Dolar `$nama`.
*   **Mencetak ke Layar:** Di JS pakai `document.write`. Di PHP pakai `echo`.
*   **Menggabung Kata:** Di JS pakai plus `+`. Di PHP pakai titik `.`.
*   **Wajib Titik Koma:** PHP itu sangat cerewet! Lupa titik koma (`;`) di akhir baris akan menyebabkan webmu mati total!

---

## Bagian 2: Jaring Pengaman Pemula & Debugging

### 4. Misteri Layar Putih & Membaca Pesan Error
Seringkali layarmu tiba-tiba blank putih total (*White Screen of Death*). Jangan panik! Komputermu tidak rusak. Itu artinya ada kode PHP yang cacat (biasanya kurang tutup kurung `}` atau titik koma `;`).

**Cara Membaca Error:**
Jika layar memunculkan tulisan merah: *"Parse error: syntax error... in index.php on line 25"*.
Tugasmu adalah buka kodemu, lihat baris 25, dan perhatikan baik-baik. Biasanya kesalahannya ada di baris 25, **ATAU satu baris di atasnya (baris 24)** yang lupa diberi titik koma.

### 5. Teknik Debugging (Detektif Kode)
Saat *coding*, data dari form seringkali gagal masuk ke database dan tidak ada pesan error sama sekali. Sebagai *programmer*, kamu harus menjadi detektif menggunakan jurus **Debugging**.

Gunakan perintah `var_dump()` atau `print_r()` dipadukan dengan `die()`.
*   `var_dump($_POST);` ➡️ Berfungsi untuk "Membongkar" secara paksa isi tas data yang dikirim user. Kamu bisa melihat apakah datanya kosong atau terisi.
*   `die();` ➡️ Berfungsi untuk menghentikan eksekusi kode di baris itu juga. Mencegah PHP memproses kode yang salah lebih jauh.

```php
// CONTOH DEBUGGING:
var_dump($_POST); // "Bongkar isinya di layar sekarang!"
die();            // "Berhenti! Jangan proses kode ke bawah dulu!"
```

### 6. Jurus *Hard Refresh* Anti-Frustrasi
Kamu sudah mengubah warna CSS atau teks PHP, sudah di-`Save`, tapi saat di-*refresh* di Chrome tidak ada perubahan? Itu karena browser mengingat versi lama (*Cache*).
**Solusi:** Tekan tombol `Ctrl + F5` (atau `Ctrl + Shift + R`) di keyboard untuk memaksa browser membuang ingatan lama dan mengambil versi kode yang paling baru!

---

## Bagian 3: Interaksi Data & Form

### 7. Menangkap Data Klien: `$_GET` vs `$_POST`
PHP menyediakan tas khusus (*Superglobals*) untuk menampung kiriman data dari HTML.
*   **`$_GET`:** Mengambil data yang menempel terang-terangan di URL (misal: `?kategori=buku`). Cocok untuk pencarian/filter.
*   **`$_POST`:** Mengambil data secara rahasia dari `<form method="POST">`. Cocok untuk *Login* atau Buku Tamu.

### 8. Jebakan Batman: "Undefined Array Key"
Ini adalah *error* nomor 1 terbanyak! Terjadi karena ketidakcocokan antara HTML dan PHP.
```html
<!-- Jika di HTML kamu pakai name="nama_lengkap" -->
<input type="text" name="nama_lengkap">
```
```php
// Maka di PHP KAMU WAJIB menangkap dengan nama yang SAMA PERSIS!
$nama_user = $_POST['nama_lengkap']; 

// Jika kamu mengetik $_POST['nama'], PHP akan berteriak "Undefined Array Key!" (Kunci tidak ditemukan!)
```

---

## Bagian 4: Integrasi & Proyek Akhir (Buku Tamu)

### 9. Membangun Jembatan ke MySQL
Sebelum CRUD, PHP harus izin masuk ke MySQL menggunakan fungsi `mysqli_connect`.
Buat file khusus `koneksi.php`:
```php
<?php
// Rumus: mysqli_connect('server', 'username', 'password', 'nama_database');
$koneksi = mysqli_connect('localhost', 'root', '', 'db_portofolio');

// Mengecek jembatan (Debugging sederhana)
if (!$koneksi) {
    die("Aduh! Koneksi Database Gagal!");
}
?>
```

### 10. Eksekusi Proyek CRUD (Buku Tamu Dinamis)
Ubah form HTML statis milikmu agar terhubung dengan PHP!

#### A. CREATE (Menyimpan Pesan Baru)
```php
<?php
include 'koneksi.php'; // Panggil jembatannya

if(isset($_POST['tombol_kirim'])) {
    $nama  = $_POST['nama'];
    $pesan = $_POST['pesan'];

    // Mencegah input kosong (Keamanan Dasar)
    if($nama != "" && $pesan != "") {
        // Query Simpan
        mysqli_query($koneksi, "INSERT INTO buku_tamu (nama, pesan) VALUES ('$nama', '$pesan')");
        // Lemparkan pengunjung kembali ke halaman depan
        header("Location: index.php");
    }
}
?>
```

#### B. READ (Menampilkan Pesan dari MySQL ke Layar HTML)
Bagian ini kita letakkan di dalam file `index.php` (di area pulau HTML tempat kotak pesan berada).
```php
<div class="wadah-pesan">
    <?php
    include 'koneksi.php';
    // Minta PHP mengambil seluruh data pesan, diurutkan dari yang terbaru (DESC)
    $ambil_data = mysqli_query($koneksi, "SELECT * FROM buku_tamu ORDER BY id DESC");
    
    // Looping / Ulangi terus menerus selama masih ada pesan di laci database!
    while($tamu = mysqli_fetch_assoc($ambil_data)) {
    ?>
        <!-- Kita tutup dulu pulau PHP-nya, agar kita bisa mengetik pulau HTML -->
        <div class="kotak-pesan">
            <h4> <?php echo $tamu['nama']; ?> </h4>
            <p> <?php echo $tamu['pesan']; ?> </p>
            <a href="hapus.php?id=<?php echo $tamu['id']; ?>">Hapus</a>
        </div>
    <?php 
    } // Buka pulau PHP lagi untuk menutup kurung kurawal looping!
    ?>
</div>
```

#### C. DELETE (Menghapus Pesan)
Buat file `hapus.php` terpisah. Perhatikan bahwa tombol hapus di atas mengirimkan `id` lewat URL (`?id=...`), jadi kita menangkapnya dengan `$_GET`.
```php
<?php
include 'koneksi.php';

// Tangkap ID dari URL
$id_target = $_GET['id'];

// Query Hapus
mysqli_query($koneksi, "DELETE FROM buku_tamu WHERE id = '$id_target'");

// Lemparkan kembali ke beranda
header("Location: index.php");
?>
```

---
*🎉 Selamat! Dengan selesainya modul Buku Tamu ini, kamu resmi menjadi seorang Fullstack Web Developer pemula!*

# 🌐 Modul Pembelajaran: Arsitektur Aplikasi Web & Server Lokal

> Modul ini disusun untuk menjembatani pemahaman siswa kelas 11/12 RPL dari dunia **Frontend** (Tampilan Antarmuka) menuju dunia **Backend** (Logika Server & Database). Sebelum mulai *coding* PHP atau MySQL, sangat penting untuk memahami "Bagaimana cara kerja Internet?".

---

## Daftar Isi
1. [Arsitektur Aplikasi Web (Frontend vs Backend)](#1-arsitektur-aplikasi-web-frontend-vs-backend)
2. [Siklus Request & Response](#2-siklus-request--response)
3. [Web Statis vs Web Dinamis](#3-web-statis-vs-web-dinamis)
4. [Anatomi URL (Alamat Web)](#4-anatomi-url-alamat-web)
5. [Mengenal Web Server & Apache](#5-mengenal-web-server--apache)
6. [Metode Komunikasi HTTP (Kata Kerja Web)](#6-metode-komunikasi-http-kata-kerja-web)
7. [Konsep Port & Kode Status HTTP](#7-konsep-port--kode-status-http)
8. [Localhost & Pengenalan XAMPP](#8-localhost--pengenalan-xampp)

---

## 1. Arsitektur Aplikasi Web (Frontend vs Backend)

Aplikasi web modern dibagi menjadi dua wilayah kekuasaan yang bekerja sama. Untuk memahaminya, kita bisa menggunakan **Analogi Restoran**.

### A. Frontend (Klien / Sisi Pengguna)
Ini adalah apa yang kamu lihat, klik, dan interaksikan di layar komputermu.
*   **Analogi Restoran:** Area ruang makan, meja, kursi, desain interior, dan *Buku Menu*. Tempat di mana pelanggan duduk dan melihat-lihat.
*   **Peralatan (Bahasa):** HTML (Kerangka), CSS (Desain), JavaScript (Interaksi tombol & animasi).
*   **Sifat:** Kode Frontend akan diunduh dan diproses (di-render) secara langsung oleh **Browser** (Google Chrome, Firefox) di laptop masing-masing pengguna.

### B. Backend (Server / Sisi Peladen)
Ini adalah "Dapur" yang bekerja di belakang layar. Kamu tidak bisa melihat kodenya secara langsung.
*   **Analogi Restoran:** Dapur tempat koki bekerja. Koki akan melihat pesanan dari buku menu, mengecek bahan di kulkas (Database), memasaknya (Logika), dan mengembalikannya ke pelanggan sebagai hidangan matang (HTML jadi).
*   **Peralatan (Bahasa):** PHP, Python, Node.js (sebagai Koki/Logika), dan MySQL/MariaDB (sebagai Kulkas/Database).
*   **Sifat:** Kode Backend berjalan di sebuah mesin komputer canggih dari jarak jauh (Server), bukan di laptop pengguna.

---

## 2. Siklus Request & Response

Bagaimana Frontend dan Backend berkomunikasi? Mereka menggunakan siklus **Request (Permintaan)** dan **Response (Tanggapan)**.

1.  **Request (Pesan):** Saat kamu mengetik `www.instagram.com` dan menekan Enter, Browsermu sedang mengirimkan *Request* ke Server Instagram yang ada di Amerika. "Hai Server, tolong dong berikan halaman berandaku!"
2.  **Pemrosesan:** Server Instagram menerimanya. Koki (Backend) langsung mengecek Database: "Siapa ini yang minta? Oh si Budi. Mari ambilkan daftar foto teman-teman Budi."
3.  **Response (Hidangan):** Setelah data fotonya siap, Server merakitnya menjadi kode HTML/CSS/JS, lalu mengirimkan *Response* kembali ke komputermu. Barulah gambarnya muncul di layarmu.

---

## 3. Web Statis vs Web Dinamis

Mengapa kita harus repot-repot belajar Backend/PHP padahal pakai HTML saja web sudah bisa tampil?

*   **Web Statis (Hanya HTML/CSS):** 
    Ibarat **Brosur Cetak**. Isinya akan selalu sama bagi siapapun yang melihatnya. Jika ingin mengubah foto atau teks, si programmer harus membongkar dan mengedit file `.html`-nya secara manual.
*   **Web Dinamis (Menggunakan PHP & Database):** 
    Ibarat **Papan Pengumuman Digital**. Halamannya (file `.php`) mungkin cuma ada satu, tapi isinya bisa berubah-ubah secara ajaib (dinamis) tergantung data apa yang ditarik dari database. Contoh: Halaman `profil.php` akan menampilkan foto yang berbeda jika yang login adalah Budi atau Andi.

---

## 4. Anatomi URL (Alamat Web)

Saat belajar Backend, kamu akan sering "melempar" data melalui URL. Mari kita bedah struktur alamat web:

`https://www.tokosepatu.com/produk/katalog.php?kategori=sneakers&ukuran=42`

1.  **`https://` (Protokol):** Aturan komunikasi (S = *Secure*/Aman).
2.  **`www.tokosepatu.com` (Domain):** Nama alias untuk alamat server (agar kita tidak perlu menghafal angka IP). Di komputer sendiri ini akan bernama `localhost`.
3.  **`/produk/katalog.php` (Path/Direktori):** Jalur folder dan nama file yang sedang diakses di dalam komputer server.
4.  **`?kategori=sneakers&ukuran=42` (Query String):** Parameter data rahasia/tambahan yang dikirimkan ke server. (Ini akan sangat penting saat kamu belajar variabel `$_GET` di PHP!).

---

## 5. Mengenal Web Server & Apache

Pernahkah kamu membuat file `index.html`, lalu di-klik ganda (double-click), dan file itu langsung terbuka sempurna di Chrome? 

**Mengapa file `index.php` tidak bisa di-klik ganda seperti itu?**
Browser (seperti Chrome) itu sangat bodoh dalam hal logika. Browser **TIDAK BISA** membaca kode PHP, dan browser **TIDAK TAHU** cara menghubungkan diri ke Database MySQL. 

**Solusinya: Kita butuh Web Server!**
Web Server adalah sebuah *software* (aplikasi penjaga pintu) yang bertugas mendengarkan Request dari browser. Jika ada file PHP yang diminta, Web Server tidak langsung memberikannya ke browser. Web Server akan menyuruh "Mesin PHP" untuk mengolahnya terlebih dahulu, mengambil data dari Database, mengubah hasil jadinya menjadi HTML biasa, barulah HTML matang tersebut dikirimkan ke browser.

> 💡 **Apache** adalah salah satu *software* Web Server yang paling terkenal dan banyak digunakan di dunia.

---

## 6. Metode Komunikasi HTTP (Kata Kerja Web)

Di HTML dasar, kita membuat `<form>` untuk mengirim data. Dalam arsitektur web modern yang standar, Web Server dan Klien berkomunikasi menggunakan *Metode HTTP* yang sejalan dengan prinsip **CRUD** (*Create, Read, Update, Delete*):

1.  **GET (Read / Meminta Data)**
    *   Tugasnya murni "meminta" data dari server untuk ditampilkan.
    *   Data kueri dikirim secara terang-terangan dan menempel di URL (contoh: `?cari=sepatu`). 
    *   *Kapan digunakan?* Untuk pencarian Google, membuka halaman profil, melihat produk. (Jangan pernah pakai GET untuk *password*!).
2.  **POST (Create / Mengirim Data Baru)**
    *   Tugasnya mengirim data baru ke server secara rahasia (lewat "jalur belakang", tidak terlihat di URL). 
    *   *Kapan digunakan?* Mengirim form pendaftaran, *Login*, atau memposting pesan baru di Buku Tamu.
3.  **PUT / PATCH (Update / Memperbarui Data)**
    *   Instruksi khusus kepada server untuk mengedit/menimpa data yang sudah ada di database. 
    *   *(PUT biasanya menimpa seluruh data, PATCH hanya mengubah sebagian).*
    *   *Kapan digunakan?* Mengganti foto profil atau mengedit isi postingan.
4.  **DELETE (Delete / Menghapus Data)**
    *   Instruksi tegas ke server untuk menghapus sebuah rekaman data di database.

---

## 7. Konsep Port & Kode Status HTTP

### A. Apa itu Port?
Setiap komputer punya Alamat IP (ibarat "Alamat Gedung"). Tapi di gedung itu ada banyak pintu. **Port** adalah "Nomor Pintu" tempat aplikasi mengizinkan data masuk.
*   Port **80** atau **443**: Pintu masuk standar untuk Web Server (Apache).
*   Port **3306**: Pintu masuk standar untuk Database (MySQL).
> *Catatan: Jika Apache kamu gagal menyala (error), biasanya karena Port 80 sedang ditutup atau dibajak oleh aplikasi lain (seperti Skype atau VMware).*

### B. Kode Status HTTP (HTTP Status Code)
Saat server merespons, dia selalu mengirimkan kode rahasia 3 digit ke browser untuk memberitahu statusnya:
*   **`200 OK`**: Pesanan berhasil diproses! Semua lancar.
*   **`404 Not Found`**: File/Halaman yang kamu minta tidak ada (Mungkin salah nama file, salah folder, atau sudah dihapus).
*   **`500 Internal Server Error`**: File-nya ada, tapi koki di dapur melakukan kesalahan! (Artinya ada kode PHP kamu yang *error* / *typo*).

---

## 8. Localhost & Pengenalan XAMPP

Untuk belajar Backend, kita butuh Web Server (Apache), Database (MySQL), dan penerjemah PHP. Apakah kita harus menyewa server mahal di Amerika? Tidak! 

Kita bisa **menyulap laptop kita sendiri menjadi sebuah Server Mini** menggunakan aplikasi bernama **XAMPP**.
*(X = OS Apapun, A = Apache, M = MySQL/MariaDB, P = PHP, P = Perl).*

### Apa itu Localhost?
*   `localhost` adalah nama alias untuk laptopmu sendiri. Alamat IP aslinya selalu `127.0.0.1`.
*   Saat XAMPP dinyalakan, laptopmu bertugas menjadi **Server** (yang melayani), dan Browser Chrome di laptopmu bertugas menjadi **Klien** (yang meminta pesanan).

### Aturan Main XAMPP (`htdocs`)
Jika kamu menggunakan XAMPP, kamu **TIDAK BOLEH** menaruh file tugasmu sembarangan (seperti di Desktop atau My Documents). Web Server Apache "buta" dan hanya mau melirik satu folder khusus.

Folder suci itu bernama: `C:\xampp\htdocs\`

**Cara Kerjanya:**
1. Nyalakan `Apache` dan `MySQL` di XAMPP Control Panel.
2. Buat folder di dalam htdocs, misal: `C:\xampp\htdocs\tugas_web`.
3. Taruh file `index.php` kamu di dalam folder tersebut.
4. Buka browser, lalu ketik URL: `localhost/tugas_web/index.php`. 
*(Tadaaa! Kode PHP-mu berhasil diterjemahkan oleh Web Server lokal!)*

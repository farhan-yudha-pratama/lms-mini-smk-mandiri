# 🗄️ Modul Pembelajaran: Database (SQL)

> Modul ini dirancang dengan alur *Zero to Hero* untuk siswa RPL. Dimulai dari pengenalan teori dasar, perancangan (*blueprint*), hingga eksekusi proyek sistem database sungguhan (Laundry & Sistem Bebas).

---

## 📌 Daftar Isi
**Bagian 1: Pengantar & Teori Fundamental**
1. [Menyeberang ke Database (Konsep Dasar)](#1-menyeberang-ke-database-konsep-dasar)
2. [Database Secara Teknis & Lanskap Modern](#2-database-secara-teknis--lanskap-modern)

**Bagian 2: Arsitektur & Perancangan (Blueprint)**
3. [Merancang ERD (Entity Relationship Diagram)](#3-merancang-erd-entity-relationship-diagram)
4. [Memahami Konsep Relasi Antar Tabel](#4-memahami-konsep-relasi-antar-tabel)

**Bagian 3: Eksekusi Teknis (Bahasa SQL & Tabel)**
5. [Anatomi Tabel, Tipe Data & Jebakan Pemula](#5-anatomi-tabel-tipe-data--jebakan-pemula)
6. [Bahasa SQL Dasar (DDL & DML)](#6-bahasa-sql-dasar-ddl--dml)

**Bagian 4: Pengolahan Data Lanjutan**
7. [Manipulasi SQL Mandiri (Advanced Query)](#7-manipulasi-sql-mandiri-advanced-query)
8. [Penyatuan Data (JOIN) & Matematika Bisnis](#8-penyatuan-data-join--matematika-bisnis)

**Bagian 5: Ujian Praktik & Tantangan Mandiri**
9. [Project Praktik: Sistem Laundry](#9-project-praktik-sistem-laundry)
10. [Ujian Akhir Arsitek Database](#10-ujian-akhir-arsitek-database)

---

## Bagian 1: Pengantar & Teori Fundamental

### 1. Menyeberang ke Database (Konsep Dasar)
Di materi JavaScript, kamu menggunakan `Local Storage` untuk menyimpan data Buku Tamu. Kekurangannya? Data itu hanya tersimpan di laptopmu sendiri. Jika temanmu membuka webmu, dia tidak bisa melihat pesannya.
Solusinya adalah **Database**: Sebuah wadah terpusat yang bisa diakses oleh siapa saja.

**Analogi Kehidupan Nyata:**
*   **Database:** Lemari Arsip besar di ruang TU Sekolah.
*   **Tabel:** Laci-laci spesifik di dalam lemari (Misal: Laci Data Siswa, Laci Data Guru).
*   **Kolom (Field):** Kategori informasi di dalam map (Misal: NISN, Nama, Alamat). Memanjang dari atas ke bawah.
*   **Baris (Record):** Satu kartu biodata utuh milik satu orang siswa. Mendatar dari kiri ke kanan.

### 2. Database Secara Teknis & Lanskap Modern
Secara teknis, database adalah sekumpulan data digital yang terstruktur. 
Ada 3 era penyimpanan: *File-Based* (menyimpan di Excel/TXT), *Server-Based* (disimpan di server khusus), dan *Cloud-Based* (disimpan di internet).

**SQL vs NoSQL:**
*   **SQL (Relational):** Data berbentuk tabel kaku. Harus punya skema awal. Sangat kuat untuk data yang saling berhubungan (Contoh: MySQL, PostgreSQL).
*   **NoSQL (Non-Relational):** Data berbentuk dokumen fleksibel (seperti format JSON). Tidak punya baris/kolom baku. (Contoh: MongoDB).

> 💡 **Era Database Modern AI:** Saat ini muncul inovasi seperti *In-Memory DB* (sangat cepat untuk *cache*), *Time-Series DB* (untuk data saham/cuaca), dan **Vector Database** (digunakan untuk melatih AI seperti ChatGPT agar punya ingatan masa lalu!).

---

## Bagian 2: Arsitektur & Perancangan (Blueprint)

### 3. Merancang ERD (Entity Relationship Diagram)
Sebelum menulis kode, seorang Arsitek Database wajib menggambar cetak biru (*blueprint*) bernama ERD.
*   **Entitas (Persegi Panjang):** Objek utama (Misal: `Pelanggan`, `Barang`). Akan menjadi Tabel.
*   **Atribut (Oval):** Rincian objek (Misal: `Nama`, `Alamat`). Akan menjadi Kolom.
*   **Relasi (Belah Ketupat):** Kata kerja penghubung (Misal: Pelanggan *[Membeli]* Barang).

**Praktik Modern:** Alih-alih menggambar di kertas, industri modern menggunakan alat visual seperti **dbdiagram.io**. Dengan mengetik kode pendek (DBML), denah database yang indah akan langsung tergambar otomatis!

### 4. Memahami Konsep Relasi Antar Tabel
Mengapa tabel harus dipisah lalu dihubungkan (Relasi)? Agar tidak ada data ganda (*Redudansi*).
*   **Jenis Relasi:** *One-to-One* (1:1), *One-to-Many* (1:N - paling umum), dan *Many-to-Many* (N:M).
*   **Pengikat Logika:** Kita menghubungkan tabel dengan "menitipkan" kunci. Kunci di tabel asal disebut `PRIMARY KEY`, saat dititipkan ke tabel lain, namanya berubah menjadi `FOREIGN KEY` (Kunci Tamu).

---

## Bagian 3: Eksekusi Teknis (Bahasa SQL & Tabel)

### 5. Anatomi Tabel, Tipe Data & Jebakan Pemula
Setiap tabel memiliki aturan baku yang tidak boleh dilanggar.

**A. Aturan Mutlak Tabel**
1.  **PRIMARY KEY:** Syarat wajib tiap tabel! Atribut unik yang tidak boleh kembar (seperti KTP/NISN).
2.  **AUTO_INCREMENT (A-I):** Fitur ajaib agar ID bertambah sendiri (1, 2, 3...) saat ada data masuk tanpa perlu kita ketik manual.

**B. Tipe Data Terpopuler & Jebakan Pemula**
*   `INT`: Hanya untuk angka murni (Harga, Stok).
*   `VARCHAR`: Teks pendek (Nama, Judul).
*   `TEXT`: Teks sangat panjang (Isi Artikel, Pesan).
*   `TIMESTAMP`: Penanda waktu otomatis kapan data masuk.
> ⚠️ **JEBAKAN NOMOR HP:** Jangan pernah gunakan `INT` untuk Nomor Telepon/WA! Angka `0` di depan akan dibuang komputer. Karena nomor HP tidak dipakai untuk rumus matematika, selalu gunakan `VARCHAR`!

**C. Konsep `NULL`**
`NULL` artinya "Data benar-benar belum diisi". Ini berbeda dengan angka Nol (`0`) atau teks kosong (`""`).

### 6. Bahasa SQL Dasar (DDL & DML)
SQL adalah bahasa universal untuk memerintah database. SQL itu *case-insensitive* (huruf besar/kecil tidak masalah), tapi **WAJIB** diakhiri titik koma (`;`).

**1. DDL (Data Definition Language):** Perintah khusus untuk "Membangun Wadah".
*   `CREATE DATABASE db_toko;` (Membuat lemari).
*   `CREATE TABLE siswa (...);` (Membuat laci tabel).
*   `DROP TABLE siswa;` (Menghancurkan tabel secara permanen!).

**2. DML (Data Manipulation Language) / CRUD:** Perintah untuk "Mengelola Isi/Data".
*   *Create:* `INSERT INTO siswa (nama) VALUES ('Budi');`
*   *Read:* `SELECT * FROM siswa;`
*   *Update:* `UPDATE siswa SET nama='Andi' WHERE id=1;`
*   *Delete:* `DELETE FROM siswa WHERE id=1;`

> 🛑 **TIPS ANTI-FRUSTRASI UNTUK PEMULA:**
> 1. Jika hurufnya Teks (`VARCHAR`/`TEXT`), kamu **WAJIB** memakaikan tanda kutip tunggal: `'Teks'`. Kalau angka (`INT`), tidak usah.
> 2. Jangan pernah lakukan `UPDATE` atau `DELETE` tanpa tambahan perintah `WHERE`! Jika lupa, seluruh isi databasemu akan berubah atau terhapus semua!
> 3. Setelah mengetik perintah di Terminal, selalu intip hasilnya secara visual di GUI **phpMyAdmin** agar kamu percaya kodenya benar-benar bekerja.

---

## Bagian 4: Pengolahan Data Lanjutan

### 7. Manipulasi SQL Mandiri (Advanced Query)
Setelah lancar CRUD dasar, saatnya menyortir data layaknya profesional:
*   **Multi-Insert:** Menginput banyak data sekaligus. `INSERT INTO tabel (kolom) VALUES ('A'), ('B'), ('C');`
*   **Pencarian (LIKE):** `SELECT * FROM siswa WHERE nama LIKE '%Budi%';` (Mencari semua nama yang mengandung kata budi).
*   **Kombinasi Logika:** Menggunakan `AND` dan `OR` di dalam klausa `WHERE`.
*   **Mengurutkan & Membatasi:**
    *   `ORDER BY id DESC` (Mengurutkan dari yang terbaru ke terlama).
    *   `LIMIT 5` (Hanya tampilkan 5 data teratas - PENTING untuk membuat sistem *Pagination*/Halaman 1, 2, 3).

### 8. Penyatuan Data (JOIN) & Matematika Bisnis
Saat kamu menggunakan *Foreign Key* (misal: menyimpan ID Kelas `11` di tabel Siswa), layar hanya akan menampilkan angka "11". Manusia tidak mengerti angka itu.

*   **INNER JOIN:** Perintah ajaib untuk menggabungkan tabel `Siswa` dan tabel `Kelas`, sehingga angka "11" bisa diterjemahkan menjadi teks "Rekayasa Perangkat Lunak 2" di layar.
*   **Fungsi Agregasi (Matematika Database):**
    *   `COUNT(id)`: Untuk menghitung total baris (Misal: Berapa jumlah orderan hari ini?).
    *   `SUM(harga)`: Untuk menjumlahkan nilai angka (Misal: Berapa total omzet / pendapatan toko hari ini?).

---

## Bagian 5: Ujian Praktik & Tantangan Mandiri

### 9. Project Praktik: Sistem Laundry
Implementasi nyata merancang sistem bisnis Laundry dari nol!
1.  **Desain Visual:** Buat skema tabel menggunakan DBML di dbdiagram.io.
2.  **Pembuatan Wadah (DDL):** Buka terminal MySQL, buat tabel `paket` (jenis cucian) dan tabel `transaksi`. Jangan lupa atur *Foreign Key*.
3.  **Pengisian Data (DML):** Lakukan simulasi pelanggan memasukkan cucian.
4.  **Laporan Bisnis:** Gunakan kombinasi perintah `JOIN` dan `SUM()` untuk membuat laporan total omzet laundry bulan ini!

### 10. Ujian Akhir Arsitek Database
Tantangan kelulusan (Pilih temamu sendiri: Rental PS, Bengkel, Toko Buku, dll).
*   **Syarat Kelulusan:**
    1. Harus merancang ERD logis minimal 2 tabel berelasi (*One-to-Many*).
    2. Tabel wajib memiliki *Primary Key* dengan *Auto Increment*.
    3. Mampu mendemonstrasikan proses CRUD penuh.
    4. Mampu menampilkan laporan data yang sudah digabungkan menggunakan perintah `JOIN`.

Selamat! Jika kamu berhasil melewati ujian akhir ini, kamu sudah resmi memiliki logika berpikir seorang **Backend Engineer & Arsitek Database**! 🚀

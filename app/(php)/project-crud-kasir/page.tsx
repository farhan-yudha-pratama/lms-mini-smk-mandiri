"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import CodeBlock from '@/components/CodeBlock';
import { useState } from 'react';

export default function ProjectCrudKasirPage() {
  const [activeStep, setActiveStep] = useState(1);

  // Copy states
  const [isCopied, setIsCopied] = useState<Record<number, boolean>>({});

  const copyToClipboard = async (text: string, stepNum: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(prev => ({ ...prev, [stepNum]: true }));
      setTimeout(() => setIsCopied(prev => ({ ...prev, [stepNum]: false })), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  /* ====================================================
     STEP 1: SQL
  ==================================================== */
  const codeStep1 = `CREATE DATABASE db_kasir;
USE db_kasir;

CREATE TABLE transaksi (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    nama_barang VARCHAR(100) NOT NULL,
    harga INT(11) NOT NULL,
    jumlah INT(11) NOT NULL,
    total_harga INT(11) NOT NULL,
    waktu TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;

  /* ====================================================
     STEP 2: KONEKSI.PHP
  ==================================================== */
  const codeStep2 = `<?php
$host = "localhost";
$user = "root";
$pass = "";
$db   = "db_kasir";

$koneksi = mysqli_connect($host, $user, $pass, $db);

if (!$koneksi) {
    die("Koneksi Database Gagal: " . mysqli_connect_error());
}
?>`;

  /* ====================================================
     STEP 3: STYLE.CSS
  ==================================================== */
  const codeStep3 = `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    background-color: #EAF4ED;
    font-family: 'Space Grotesk', sans-serif;
    padding: 40px 20px;
}

.container {
    max-width: 900px;
    margin: 0 auto;
}

/* Header */
.header {
    background-color: #092328;
    color: white;
    padding: 30px;
    border: 4px solid #000;
    box-shadow: 8px 8px 0px 0px #000;
    text-transform: uppercase;
    text-align: center;
    margin-bottom: 40px;
}

.header h1 { color: #8BBB92; font-weight: 900; }

/* Form Kasir */
.kasir-card {
    background-color: #2A835F;
    border: 4px solid #000;
    box-shadow: 6px 6px 0px 0px #000;
    padding: 30px;
    margin-bottom: 40px;
}

.kasir-card h2 {
    color: white;
    text-transform: uppercase;
    margin-bottom: 20px;
    font-weight: 900;
    border-bottom: 4px solid #000;
    padding-bottom: 10px;
}

.form-group {
    margin-bottom: 20px;
}

label {
    display: block;
    font-weight: 900;
    text-transform: uppercase;
    margin-bottom: 8px;
    color: white;
}

input {
    width: 100%;
    padding: 15px;
    border: 4px solid #000;
    background-color: #fff;
    font-family: inherit;
    font-size: 1.1rem;
    font-weight: bold;
    outline: none;
}

input:focus {
    background-color: #EAF4ED;
    box-shadow: 4px 4px 0px 0px #092328;
}

.btn-primary {
    background-color: #092328;
    color: white;
    padding: 15px 30px;
    border: 4px solid #000;
    box-shadow: 4px 4px 0px 0px #000;
    font-weight: 900;
    font-size: 1.1rem;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s ease;
    width: 100%;
    margin-top: 10px;
}

.btn-primary:hover {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0px 0px #000;
    background-color: #12544F;
}

.btn-primary:active {
    transform: translate(4px, 4px);
    box-shadow: none;
}

/* Tabel Transaksi */
.table-card {
    background-color: #FFFFFF;
    border: 4px solid #000;
    box-shadow: 6px 6px 0px 0px #000;
    padding: 30px;
    overflow-x: auto;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 15px;
}

th, td {
    border: 4px solid #000;
    padding: 15px;
    text-align: center;
    font-weight: bold;
}

th {
    background-color: #8BBB92;
    text-transform: uppercase;
    font-weight: 900;
    color: #000;
}

tr:nth-child(even) td {
    background-color: #EAF4ED;
}

/* Tombol Aksi */
.aksi-btn {
    display: flex;
    gap: 10px;
    justify-content: center;
}

.btn-edit, .btn-hapus {
    padding: 8px 15px;
    border: 4px solid #000;
    box-shadow: 4px 4px 0px 0px #000;
    font-weight: 900;
    text-transform: uppercase;
    text-decoration: none;
    transition: all 0.2s ease;
}

.btn-edit { background-color: #FACC15; color: #000; }
.btn-hapus { background-color: #FF4757; color: white; }

.btn-edit:hover, .btn-hapus:hover {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0px 0px #000;
}

.total-badge {
    background-color: #092328;
    color: #8BBB92;
    padding: 5px 10px;
    border: 2px solid #000;
}`;

  /* ====================================================
     STEP 4: INDEX.PHP (READ & UI)
  ==================================================== */
  const codeStep4 = `<?php include 'koneksi.php'; ?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistem Kasir Brutal</title>
    <link rel="stylesheet" href="style.css">
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700;900&display=swap" rel="stylesheet">
</head>
<body>

<div class="container">
    
    <header class="header">
        <h1>SISTEM KASIR MINI</h1>
        <p>Kelola Transaksi dengan Cepat & Akurat</p>
    </header>

    <!-- FORM INPUT BARANG -->
    <div class="kasir-card">
        <h2>+ Tambah Transaksi Baru</h2>
        <form action="proses_simpan.php" method="POST">
            <div class="form-group">
                <label>Nama Barang</label>
                <input type="text" name="nama_barang" placeholder="Contoh: Kopi Susu" required>
            </div>
            <div class="form-group">
                <label>Harga Satuan (Rp)</label>
                <input type="number" name="harga" placeholder="15000" required>
            </div>
            <div class="form-group">
                <label>Jumlah Beli</label>
                <input type="number" name="jumlah" placeholder="2" required>
            </div>
            <button type="submit" name="simpan" class="btn-primary">PROSES TRANSAKSI</button>
        </form>
    </div>

    <!-- TABEL DATA TRANSAKSI -->
    <div class="table-card">
        <h2>Riwayat Penjualan</h2>
        <table>
            <thead>
                <tr>
                    <th>No</th>
                    <th>Nama Barang</th>
                    <th>Harga</th>
                    <th>Qty</th>
                    <th>Total Harga</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
                <?php
                $no = 1;
                $query = mysqli_query($koneksi, "SELECT * FROM transaksi ORDER BY id DESC");
                while($data = mysqli_fetch_assoc($query)) {
                ?>
                <tr>
                    <td><?php echo $no++; ?></td>
                    <td><?php echo htmlspecialchars($data['nama_barang']); ?></td>
                    <td>Rp <?php echo number_format($data['harga'], 0, ',', '.'); ?></td>
                    <td><?php echo $data['jumlah']; ?></td>
                    <td><span class="total-badge">Rp <?php echo number_format($data['total_harga'], 0, ',', '.'); ?></span></td>
                    <td>
                        <div class="aksi-btn">
                            <a href="edit.php?id=<?php echo $data['id']; ?>" class="btn-edit">Edit</a>
                            <a href="hapus.php?id=<?php echo $data['id']; ?>" class="btn-hapus">Hapus</a>
                        </div>
                    </td>
                </tr>
                <?php } ?>
            </tbody>
        </table>
    </div>
</div>

</body>
</html>`;

  /* ====================================================
     STEP 5: PROSES_SIMPAN.PHP (CREATE)
  ==================================================== */
  const codeStep5 = `<?php
include 'koneksi.php';

if (isset($_POST['simpan'])) {
    $nama_barang = $_POST['nama_barang'];
    $harga       = $_POST['harga'];
    $jumlah      = $_POST['jumlah'];

    // PHP menghitung total otomatis
    $total_harga = $harga * $jumlah;

    // Simpan ke database
    $query = "INSERT INTO transaksi (nama_barang, harga, jumlah, total_harga) 
              VALUES ('$nama_barang', '$harga', '$jumlah', '$total_harga')";
    
    mysqli_query($koneksi, $query);

    // Kembali ke index
    header("Location: index.php");
}
?>`;

  /* ====================================================
     STEP 6: EDIT.PHP (UPDATE UI)
  ==================================================== */
  const codeStep6 = `<?php
include 'koneksi.php';
$id = $_GET['id'];
$query = mysqli_query($koneksi, "SELECT * FROM transaksi WHERE id='$id'");
$data = mysqli_fetch_assoc($query);
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Edit Transaksi Kasir</title>
    <link rel="stylesheet" href="style.css">
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700;900&display=swap" rel="stylesheet">
</head>
<body>

<div class="container">
    <div class="kasir-card" style="background-color: #12544F;">
        <h2>✏️ Edit Data Transaksi</h2>
        <form action="proses_edit.php" method="POST">
            <!-- ID Tersembunyi -->
            <input type="hidden" name="id" value="<?php echo $data['id']; ?>">
            
            <div class="form-group">
                <label>Nama Barang</label>
                <input type="text" name="nama_barang" value="<?php echo htmlspecialchars($data['nama_barang']); ?>" required>
            </div>
            <div class="form-group">
                <label>Harga Satuan (Rp)</label>
                <input type="number" name="harga" value="<?php echo $data['harga']; ?>" required>
            </div>
            <div class="form-group">
                <label>Jumlah Beli</label>
                <input type="number" name="jumlah" value="<?php echo $data['jumlah']; ?>" required>
            </div>
            <button type="submit" name="edit" class="btn-primary" style="background-color: #FACC15; color: #000;">SIMPAN PERUBAHAN</button>
            <a href="index.php" style="display: block; text-align: center; color: white; margin-top: 20px; font-weight: bold; text-decoration: none;">&laquo; Batal & Kembali</a>
        </form>
    </div>
</div>

</body>
</html>`;

  /* ====================================================
     STEP 7: PROSES_EDIT.PHP (UPDATE LOGIC)
  ==================================================== */
  const codeStep7 = `<?php
include 'koneksi.php';

if (isset($_POST['edit'])) {
    $id          = $_POST['id'];
    $nama_barang = $_POST['nama_barang'];
    $harga       = $_POST['harga'];
    $jumlah      = $_POST['jumlah'];

    // Hitung ulang total harga
    $total_harga = $harga * $jumlah;

    // Update data di tabel
    $query = "UPDATE transaksi SET 
                nama_barang = '$nama_barang', 
                harga = '$harga', 
                jumlah = '$jumlah', 
                total_harga = '$total_harga' 
              WHERE id = '$id'";
    
    mysqli_query($koneksi, $query);

    // Kembali ke index
    header("Location: index.php");
}
?>`;

  /* ====================================================
     STEP 8: HAPUS.PHP (DELETE)
  ==================================================== */
  const codeStep8 = `<?php
include 'koneksi.php';

// Menangkap id dari URL
if (isset($_GET['id'])) {
    $id = $_GET['id'];
    
    // Eksekusi query hapus
    mysqli_query($koneksi, "DELETE FROM transaksi WHERE id='$id'");
}

header("Location: index.php");
?>`;

  const stepsData = [
    { num: 1, title: 'SQL DB', code: codeStep1, lang: 'sql', color: 'bg-black text-white', desc: 'Jalankan perintah ini di tab SQL phpMyAdmin untuk membuat struktur database kasir.' },
    { num: 2, title: 'koneksi.php', code: codeStep2, lang: 'php', color: 'bg-[#2A835F] text-white', desc: 'Jembatan penghubung aplikasi PHP ke database MySQL.' },
    { num: 3, title: 'style.css', code: codeStep3, lang: 'css', color: 'bg-[#092328] text-white', desc: 'Gaya desain Neo Brutalism yang keren untuk tampilan kasir.' },
    { num: 4, title: 'index.php', code: codeStep4, lang: 'php', color: 'bg-[#8BBB92] text-black', desc: '[READ] Halaman utama. Berisi form kasir dan tabel riwayat transaksi.' },
    { num: 5, title: 'proses_simpan.php', code: codeStep5, lang: 'php', color: 'bg-[#12544F] text-white', desc: '[CREATE] Mesin PHP penghitung total harga dan penyimpan data.' },
    { num: 6, title: 'edit.php', code: codeStep6, lang: 'php', color: 'bg-[#FACC15] text-black', desc: '[UPDATE] Form khusus untuk mengedit atau meralat data transaksi.' },
    { num: 7, title: 'proses_edit.php', code: codeStep7, lang: 'php', color: 'bg-[#3b82f6] text-white', desc: '[UPDATE] Skrip eksekutor untuk memperbarui data.' },
    { num: 8, title: 'hapus.php', code: codeStep8, lang: 'php', color: 'bg-[#FF4757] text-white', desc: '[DELETE] Sang pencabut nyawa dari riwayat transaksi yang batal.' },
  ];

  return (
    <>
      <Headbar
        links={[
          { label: 'Proyek Akhir', href: '/project-crud-kasir', isActive: true },
          { label: 'Kumpulkan Karya', href: '/project-crud-kasir/kumpulkan', isActive: false }
        ]}
      />

      <div className="flex pt-[88px] min-h-screen">
        <Sidebar />

        <main className="md:ml-[280px] w-full p-4 md:p-10 bg-canvas relative" style={{ backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div className="max-w-6xl mx-auto space-y-12">

            {/* Header Section */}
            <section className="bg-black border-4 border-black p-6 md:p-12 shadow-neo-xl relative text-white">
              <div className="absolute top-0 left-0 bg-[#FFD700] text-black font-black px-4 py-1 border-b-4 border-r-4 border-black shadow-neo-sm z-20 uppercase">
                Final Project PHP
              </div>
              <div className="pt-8">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-[#FFD700] tracking-tighter uppercase mb-4 drop-shadow-[4px_4px_0px_rgba(255,255,255,0.2)]">
                  Kasir <br className="hidden md:block" /> Neo Brutalism
                </h1>
                <p className="text-base md:text-xl font-bold text-black bg-white inline-block px-4 py-2 md:px-6 md:py-3 border-4 border-black mb-6 shadow-neo-md uppercase tracking-tight">
                  Sistem Full CRUD PHP + MySQL
                </p>
                <p className="text-lg font-bold text-gray-300 max-w-3xl">
                  Mari kita buat aplikasi Kasir yang memproses penjumlahan otomatis. Ikuti 8 langkah C-R-U-D di bawah ini secara berurutan, *copy-paste* kodenya, dan lihat mesin kasirmu hidup!
                </p>
              </div>
            </section>

            {/* Stepper Navigation */}
            <div className="flex flex-wrap gap-3 border-b-4 border-black pb-4">
              {stepsData.map((s) => (
                <button
                  key={s.num}
                  onClick={() => setActiveStep(s.num)}
                  className={`
                    font-black uppercase px-4 py-2 border-4 border-black transition-all text-sm md:text-base
                    ${activeStep === s.num ? `shadow-none translate-y-1 translate-x-1 ${s.color}` : 'bg-white text-black shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_#000]'}
                  `}
                >
                  <span className="opacity-50 mr-1">#{s.num}</span> {s.title}
                </button>
              ))}
            </div>

            {/* Render Active Step Content */}
            {stepsData.map((s) => (
              activeStep === s.num && (
                <section key={s.num} className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-10 animate-in fade-in zoom-in duration-300">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 border-b-4 border-black pb-6">
                    <div>
                      <h2 className="text-2xl md:text-4xl font-black uppercase mb-2">{s.num}. {s.title}</h2>
                      <p className="font-bold text-gray-700">{s.desc}</p>
                    </div>
                    <button 
                      onClick={() => copyToClipboard(s.code, s.num)}
                      className="bg-[#092328] text-[#8BBB92] font-black uppercase px-6 py-3 border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 hover:-translate-x-1 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2 flex-shrink-0"
                    >
                      <span className="material-symbols-outlined">{isCopied[s.num] ? 'check' : 'content_copy'}</span>
                      <span className="hidden sm:inline">{isCopied[s.num] ? 'Disalin!' : 'Copy Code'}</span>
                    </button>
                  </div>
                  <div className={`border-4 border-black text-left ${s.lang === 'css' || (s.lang === 'php' && s.code.length > 500) ? 'h-[500px] overflow-y-auto' : ''}`}>
                    <CodeBlock language={s.lang} code={s.code} />
                  </div>
                </section>
              )
            ))}

            {/* Navigation Footer */}
            <div className="flex justify-between items-center border-t-4 border-black pt-8">
              <button 
                onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
                disabled={activeStep === 1}
                className="bg-black text-white font-black uppercase px-6 py-3 border-4 border-black shadow-[4px_4px_0px_0px_#000] disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed hover:-translate-y-1 hover:-translate-x-1 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
              >
                &laquo; Mundur
              </button>
              
              {activeStep < 8 ? (
                <button 
                  onClick={() => setActiveStep(prev => Math.min(8, prev + 1))}
                  className="bg-[#FFD700] text-black font-black uppercase px-6 py-3 border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 hover:-translate-x-1 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                >
                  Selanjutnya &raquo;
                </button>
              ) : (
                <a href="/project-crud-kasir/kumpulkan" className="bg-[#2A835F] text-white font-black uppercase px-6 py-3 border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:-translate-y-1 hover:-translate-x-1 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all text-center">
                  Selesai!
                </a>
              )}
            </div>

          </div>
        </main>
      </div>
    </>
  );
}

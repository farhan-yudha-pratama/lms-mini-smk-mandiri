"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import CodeBlock from '@/components/CodeBlock';
import { useState } from 'react';

export default function ProjectLaundryPage() {
  const [activeStep, setActiveStep] = useState(1);

  // Copy states
  const [isCopiedStep1Html, setIsCopiedStep1Html] = useState(false);
  const [isCopiedStep2Css, setIsCopiedStep2Css] = useState(false);
  const [isCopiedStep3Js, setIsCopiedStep3Js] = useState(false);
  const [isCopiedFull, setIsCopiedFull] = useState(false);
  const [showFullCode, setShowFullCode] = useState(false);

  /* ====================================================
     STEP 1: HTML BOILERPLATE
  ==================================================== */
  const step1Html = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LaundryKu - Aplikasi Manajemen Laundry</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <!-- ===== HEADER ===== -->
    <header class="app-header">
        <h1>🧺 LaundryKu</h1>
        <p>Kelola pesanan laundry dengan mudah dan cepat!</p>
    </header>

    <main class="app-main">

        <!-- ===== FORMULIR TAMBAH / EDIT PESANAN ===== -->
        <section class="card form-card">
            <h2 id="judul-form">✏️ Tambah Pesanan Baru</h2>

            <form id="form-laundry">
                <!-- Input tersembunyi untuk menyimpan ID saat mengedit -->
                <input type="hidden" id="edit-id" value="">

                <div class="form-group">
                    <label for="nama-pelanggan">Nama Pelanggan:</label>
                    <input type="text" id="nama-pelanggan" placeholder="Contoh: Budi Santoso" required>
                </div>

                <div class="form-group">
                    <label for="berat-kg">Berat Cucian (kg):</label>
                    <input type="number" id="berat-kg" placeholder="Contoh: 3" min="1" required>
                </div>

                <div class="form-group">
                    <label for="status-cuci">Status:</label>
                    <select id="status-cuci">
                        <option value="Antri">🕐 Antri</option>
                        <option value="Proses">⚙️ Proses</option>
                        <option value="Selesai">✅ Selesai</option>
                    </select>
                </div>

                <div class="form-actions">
                    <button type="submit" class="btn btn-primary" id="btn-simpan">
                        + Tambah Pesanan
                    </button>
                    <button type="button" class="btn btn-secondary" id="btn-batal" onclick="batalEdit()">
                        Batal
                    </button>
                </div>
            </form>
        </section>

        <!-- ===== RINGKASAN STATISTIK ===== -->
        <section class="stats-grid">
            <div class="stat-card stat-total">
                <span class="stat-angka" id="total-pesanan">0</span>
                <span class="stat-label">Total Pesanan</span>
            </div>
            <div class="stat-card stat-antri">
                <span class="stat-angka" id="total-antri">0</span>
                <span class="stat-label">🕐 Antri</span>
            </div>
            <div class="stat-card stat-proses">
                <span class="stat-angka" id="total-proses">0</span>
                <span class="stat-label">⚙️ Diproses</span>
            </div>
            <div class="stat-card stat-selesai">
                <span class="stat-angka" id="total-selesai">0</span>
                <span class="stat-label">✅ Selesai</span>
            </div>
        </section>

        <!-- ===== TABEL DAFTAR PESANAN ===== -->
        <section class="card table-card">
            <div class="table-header">
                <h2>📋 Daftar Pesanan</h2>
                <button class="btn btn-danger-outline" onclick="hapusSemua()">
                    🗑️ Hapus Semua
                </button>
            </div>
            <div id="wadah-pesanan">
                <!-- Kartu pesanan akan dicetak oleh JavaScript di sini -->
                <div class="empty-state">
                    <p>📭 Belum ada pesanan. Tambahkan pesanan pertama di atas!</p>
                </div>
            </div>
        </section>

    </main>

    <script src="script.js"></script>
</body>
</html>`;

  /* ====================================================
     STEP 2: CSS
  ==================================================== */
  const step2Css = `/* =====================================
   RESET & VARIABEL WARNA
===================================== */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --hitam: #000000;
    --putih: #ffffff;
    --hijau-primer: #2A835F;
    --hijau-terang: #4ade80;
    --krem: #fffacd;
    --merah: #ff4757;
    --biru: #3b82f6;
    --kuning: #facc15;
    --abu: #f0f4f8;
}

body {
    background-color: #EAF4ED;
    font-family: 'Courier New', Courier, monospace;
    min-height: 100vh;
}

/* =====================================
   HEADER UTAMA
===================================== */
.app-header {
    background-color: var(--hitam);
    color: var(--putih);
    text-align: center;
    padding: 30px 20px;
    border-bottom: 4px solid var(--hijau-terang);
    box-shadow: 0 4px 0 var(--hijau-terang);
}

.app-header h1 {
    font-size: 2.5rem;
    text-transform: uppercase;
    letter-spacing: 3px;
    margin-bottom: 8px;
}

.app-header p {
    color: var(--hijau-terang);
    font-weight: bold;
}

/* =====================================
   LAYOUT UTAMA
===================================== */
.app-main {
    max-width: 900px;
    margin: 30px auto;
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    gap: 25px;
}

/* =====================================
   KARTU / KOTAK
===================================== */
.card {
    background-color: var(--putih);
    border: 4px solid var(--hitam);
    box-shadow: 8px 8px 0px var(--hitam);
    padding: 25px;
}

.card h2 {
    font-size: 1.3rem;
    text-transform: uppercase;
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 3px solid var(--hitam);
}

/* =====================================
   FORM GAYA
===================================== */
.form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 15px;
}

.form-group label {
    font-weight: 900;
    text-transform: uppercase;
    font-size: 0.8rem;
    letter-spacing: 1px;
}

.form-group input,
.form-group select {
    padding: 12px;
    border: 3px solid var(--hitam);
    font-family: inherit;
    font-weight: bold;
    font-size: 1rem;
    background-color: var(--abu);
    transition: all 0.2s;
}

.form-group input:focus,
.form-group select:focus {
    outline: none;
    background-color: var(--krem);
    box-shadow: 4px 4px 0px var(--hitam);
}

.form-actions {
    display: flex;
    gap: 10px;
    margin-top: 5px;
}

/* =====================================
   TOMBOL-TOMBOL
===================================== */
.btn {
    padding: 12px 20px;
    font-family: inherit;
    font-weight: 900;
    font-size: 0.9rem;
    text-transform: uppercase;
    border: 3px solid var(--hitam);
    cursor: pointer;
    transition: all 0.15s;
    letter-spacing: 1px;
}

.btn:hover {
    transform: translate(-2px, -2px);
    box-shadow: 4px 4px 0px var(--hitam);
}

.btn:active {
    transform: translate(2px, 2px);
    box-shadow: none;
}

.btn-primary {
    background-color: var(--hijau-primer);
    color: var(--putih);
    box-shadow: 4px 4px 0px var(--hitam);
    flex: 1;
}

.btn-secondary {
    background-color: var(--putih);
    color: var(--hitam);
}

.btn-danger-outline {
    background-color: transparent;
    color: var(--merah);
    border-color: var(--merah);
    font-size: 0.8rem;
    padding: 8px 14px;
}

.btn-danger-outline:hover {
    background-color: var(--merah);
    color: var(--putih);
    box-shadow: 3px 3px 0px var(--hitam);
}

/* =====================================
   STATISTIK
===================================== */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
}

@media (min-width: 500px) {
    .stats-grid {
        grid-template-columns: repeat(4, 1fr);
    }
}

.stat-card {
    border: 4px solid var(--hitam);
    padding: 20px 15px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    transition: transform 0.2s;
}

.stat-card:hover {
    transform: translate(-2px, -2px);
}

.stat-total  { background-color: var(--hitam); color: var(--putih); box-shadow: 5px 5px 0px var(--hijau-terang); }
.stat-antri  { background-color: var(--krem);  color: var(--hitam); box-shadow: 5px 5px 0px var(--hitam); }
.stat-proses { background-color: var(--biru);  color: var(--putih); box-shadow: 5px 5px 0px var(--hitam); }
.stat-selesai{ background-color: var(--hijau-primer); color: var(--putih); box-shadow: 5px 5px 0px var(--hitam); }

.stat-angka {
    font-size: 2.5rem;
    font-weight: 900;
}

.stat-label {
    font-size: 0.75rem;
    font-weight: bold;
    text-transform: uppercase;
}

/* =====================================
   HEADER TABEL & KARTU PESANAN
===================================== */
.table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 3px solid var(--hitam);
}

.table-header h2 {
    margin: 0;
    padding: 0;
    border: none;
}

.kartu-pesanan {
    background-color: var(--abu);
    border: 3px solid var(--hitam);
    padding: 15px;
    margin-bottom: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    box-shadow: 4px 4px 0px var(--hitam);
    transition: all 0.2s;
}

.kartu-pesanan:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0px var(--hitam);
}

.info-pesanan { flex: 1; min-width: 150px; }
.nama-pelanggan-kartu {
    font-size: 1.1rem;
    font-weight: 900;
    text-transform: uppercase;
    margin-bottom: 4px;
}
.detail-pesanan {
    font-size: 0.85rem;
    font-weight: bold;
    color: #555;
}

.badge-status {
    padding: 5px 12px;
    border: 2px solid var(--hitam);
    font-weight: 900;
    font-size: 0.8rem;
    white-space: nowrap;
}

.badge-Antri   { background-color: var(--krem);          color: var(--hitam); }
.badge-Proses  { background-color: var(--biru);           color: var(--putih); }
.badge-Selesai { background-color: var(--hijau-terang);   color: var(--hitam); }

.aksi-pesanan { display: flex; gap: 8px; }
.btn-edit   { background-color: var(--kuning); color: var(--hitam); padding: 7px 14px; }
.btn-hapus  { background-color: var(--merah);  color: var(--putih); padding: 7px 14px; }

/* =====================================
   EMPTY STATE & LAINNYA
===================================== */
.empty-state {
    text-align: center;
    padding: 40px;
    color: #888;
    font-weight: bold;
    border: 3px dashed #ccc;
}`;

  /* ====================================================
     STEP 3: JS
  ==================================================== */
  const step3Js = `// =============================================
//   LaundryKu - Aplikasi CRUD Local Storage
// =============================================

// 1. AMBIL ELEMEN DOM
const formLaundry      = document.getElementById('form-laundry');
const inputEditId      = document.getElementById('edit-id');
const inputNama        = document.getElementById('nama-pelanggan');
const inputBerat       = document.getElementById('berat-kg');
const inputStatus      = document.getElementById('status-cuci');
const btnSimpan        = document.getElementById('btn-simpan');
const judulForm        = document.getElementById('judul-form');
const wadahPesanan     = document.getElementById('wadah-pesanan');

// Elemen statistik
const elTotalPesanan   = document.getElementById('total-pesanan');
const elTotalAntri     = document.getElementById('total-antri');
const elTotalProses    = document.getElementById('total-proses');
const elTotalSelesai   = document.getElementById('total-selesai');

// =============================================
// [READ] 2. AMBIL DATA DARI LOCALSTORAGE
// =============================================
// Jika 'datalaundry' di gudang kosong, mulai dengan Array kosong []
let daftarPesanan = JSON.parse(localStorage.getItem('dataLaundry')) || [];

// =============================================
// 3. FUNGSI SIMPAN KE LOCALSTORAGE
// =============================================
function simpanKeGudang() {
    localStorage.setItem('dataLaundry', JSON.stringify(daftarPesanan));
}

// =============================================
// 4. FUNGSI RENDER (Menggambar Ulang Layar)
// =============================================
function renderPesanan() {
    // Hitung harga: Rp 5.000 per kg
    const HARGA_PER_KG = 5000;
    
    // --- Update Statistik ---
    elTotalPesanan.textContent = daftarPesanan.length;
    elTotalAntri.textContent   = daftarPesanan.filter(p => p.status === 'Antri').length;
    elTotalProses.textContent  = daftarPesanan.filter(p => p.status === 'Proses').length;
    elTotalSelesai.textContent = daftarPesanan.filter(p => p.status === 'Selesai').length;
    
    // --- Kosongkan Wadah ---
    wadahPesanan.innerHTML = "";
    
    // --- Tampilkan Empty State Jika Kosong ---
    if (daftarPesanan.length === 0) {
        wadahPesanan.innerHTML = \`
            <div class="empty-state">
                <p>📭 Belum ada pesanan. Tambahkan pesanan pertama di atas!</p>
            </div>
        \`;
        return; // Hentikan fungsi di sini
    }
    
    // --- Perulangan: Cetak Setiap Kartu Pesanan ---
    for (let i = 0; i < daftarPesanan.length; i++) {
        let p = daftarPesanan[i];
        let totalHarga = p.berat * HARGA_PER_KG;
        let hargaFormatted = totalHarga.toLocaleString('id-ID');
        
        wadahPesanan.innerHTML += \`
            <div class="kartu-pesanan">
                <div class="info-pesanan">
                    <div class="nama-pelanggan-kartu">\${p.nama}</div>
                    <div class="detail-pesanan">
                        ⚖️ \${p.berat} kg &nbsp;|&nbsp; 💰 Rp \${hargaFormatted}
                    </div>
                </div>
                <span class="badge-status badge-\${p.status}">\${p.status}</span>
                <div class="aksi-pesanan">
                    <button class="btn btn-edit" onclick="mulaiEdit(\${p.id})">✏️ Edit</button>
                    <button class="btn btn-hapus" onclick="hapusPesanan(\${p.id})">🗑️ Hapus</button>
                </div>
            </div>
        \`;
    }
}

// Panggil render pertama kali saat web dibuka
renderPesanan();

// =============================================
// [CREATE] 5. LOGIKA SAAT FORM DIKIRIM
// =============================================
formLaundry.addEventListener('submit', function(event) {
    event.preventDefault(); // Cegah halaman reload
    
    const idYangDiedit = inputEditId.value;
    
    // Cek: apakah ini mode EDIT atau mode TAMBAH BARU?
    if (idYangDiedit !== "") {
        // --- MODE UPDATE ---
        // Ubah parseInt agar ID cocok dengan yang tersimpan (number)
        const idTarget = parseInt(idYangDiedit);
        
        // Temukan index pesanan yang ingin diubah
        const index = daftarPesanan.findIndex(p => p.id === idTarget);
        
        // Timpa data pada index tersebut dengan data baru dari form
        daftarPesanan[index].nama   = inputNama.value;
        daftarPesanan[index].berat  = parseInt(inputBerat.value);
        daftarPesanan[index].status = inputStatus.value;
        
        batalEdit(); // Kembalikan form ke mode normal
        
    } else {
        // --- MODE CREATE (Tambah Baru) ---
        let pesananBaru = {
            id: Date.now(), // Waktu sekarang (milidetik) sebagai ID unik
            nama: inputNama.value,
            berat: parseInt(inputBerat.value),
            status: inputStatus.value
        };
        
        daftarPesanan.push(pesananBaru); // Masukkan ke Array
        formLaundry.reset(); // Kosongkan form
    }
    
    simpanKeGudang(); // Simpan ke Gudang (Local Storage)
    renderPesanan();  // Gambar ulang layar
});

// =============================================
// [UPDATE] 6. FUNGSI MULAI MODE EDIT
// =============================================
window.mulaiEdit = function(idTarget) {
    // Temukan data pesanan yang mau diedit berdasarkan ID
    const pesanan = daftarPesanan.find(p => p.id === idTarget);
    
    if (pesanan) {
        // Isi form dengan data pesanan yang dipilih
        inputEditId.value   = pesanan.id;
        inputNama.value     = pesanan.nama;
        inputBerat.value    = pesanan.berat;
        inputStatus.value   = pesanan.status;
        
        // Ubah tampilan judul dan tombol form
        judulForm.textContent  = "✏️ Mode Edit Pesanan";
        btnSimpan.textContent  = "💾 Simpan Perubahan";
        
        // Scroll halaman ke atas agar form terlihat
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

// =============================================
// FUNGSI BATAL EDIT
// =============================================
window.batalEdit = function() {
    // Kembalikan form ke keadaan semula
    inputEditId.value      = "";
    formLaundry.reset();
    judulForm.textContent  = "✏️ Tambah Pesanan Baru";
    btnSimpan.textContent  = "+ Tambah Pesanan";
};

// =============================================
// [DELETE] 7. FUNGSI HAPUS SATU PESANAN
// =============================================
window.hapusPesanan = function(idTarget) {
    // Konfirmasi sebelum hapus
    const yakin = confirm("Yakin ingin menghapus pesanan ini?");
    if (!yakin) return;
    
    // Saring Array: biarkan semua KECUALI yang ID-nya sama dengan target
    daftarPesanan = daftarPesanan.filter(p => p.id !== idTarget);
    
    simpanKeGudang();
    renderPesanan();
};

// =============================================
// [DELETE ALL] 8. FUNGSI HAPUS SEMUA
// =============================================
window.hapusSemua = function() {
    const yakin = confirm("PERINGATAN: Ini akan menghapus SEMUA pesanan! Lanjutkan?");
    if (!yakin) return;
    
    daftarPesanan = []; // Kosongkan array
    simpanKeGudang();
    renderPesanan();
};`;

  /* ====================================================
     FULL COMBINED CODE (untuk Copy Semua)
  ==================================================== */
  const fullCode = `<!-- ==================== index.html ==================== -->\n${step1Html}\n\n\n/* ==================== style.css ==================== */\n${step2Css}\n\n\n// ==================== script.js ====================\n${step3Js}`;

  const steps = [
    { id: 1, label: 'HTML', icon: 'html', color: 'bg-black text-white', badgeColor: 'bg-jade-vibrant text-black' },
    { id: 2, label: 'CSS', icon: 'css', color: 'bg-pine-deep text-white', badgeColor: 'bg-mint-soft text-black' },
    { id: 3, label: 'JavaScript', icon: 'javascript', color: 'bg-jade-vibrant text-black', badgeColor: 'bg-black text-white' },
  ];

  return (
    <>
      <Headbar
        links={[
          { label: 'Project JS', href: '/project-3-js', isActive: true },
        ]}
      />

      <div className="flex pt-[88px] min-h-screen">
        <Sidebar />

        <main className="md:ml-[280px] w-full p-4 md:p-10 bg-canvas relative" style={{ backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">

            {/* ===== HERO SECTION ===== */}
            <section className="bg-black text-white border-4 border-black p-6 md:p-12 shadow-[8px_8px_0px_rgba(45,212,191,1)] relative overflow-hidden">
              <div className="absolute top-0 left-0 bg-jade-vibrant text-black font-black px-4 py-1 border-b-4 border-r-4 border-black">
                PROJECT FINAL JS
              </div>
              <div className="absolute bottom-4 right-4 opacity-10">
                <span className="material-symbols-outlined text-[140px]">local_laundry_service</span>
              </div>
              <div className="relative z-10 mt-6">
                <div className="flex items-center gap-4 mb-4 flex-wrap">
                  <span className="bg-jade-vibrant text-black font-black uppercase text-xs px-3 py-1 border-2 border-white tracking-widest">CRUD + LocalStorage</span>
                  <span className="bg-white text-black font-black uppercase text-xs px-3 py-1 border-2 border-white tracking-widest">Step by Step</span>
                  <span className="bg-pine-deep text-white font-black uppercase text-xs px-3 py-1 border-2 border-white tracking-widest">3 File</span>
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter uppercase mb-4 drop-shadow-[2px_2px_0px_rgba(45,212,191,0.5)]">
                  🧺 LaundryKu
                </h1>
                <p className="text-lg md:text-xl font-bold text-gray-300 max-w-2xl leading-relaxed mb-8">
                  Membangun Aplikasi Manajemen Laundry <strong className="text-jade-vibrant">dari Nol</strong> menggunakan HTML, CSS, dan JavaScript murni dengan sistem penyimpanan permanen berbasis <strong className="text-mint-soft">Local Storage</strong>!
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="bg-white text-black border-4 border-white px-5 py-3 font-black uppercase text-sm tracking-widest flex items-center gap-2">
                    <span className="material-symbols-outlined text-jade-vibrant">add_circle</span> Create
                  </div>
                  <div className="bg-jade-vibrant text-black border-4 border-jade-vibrant px-5 py-3 font-black uppercase text-sm tracking-widest flex items-center gap-2">
                    <span className="material-symbols-outlined">visibility</span> Read
                  </div>
                  <div className="bg-pine-deep text-white border-4 border-pine-deep px-5 py-3 font-black uppercase text-sm tracking-widest flex items-center gap-2">
                    <span className="material-symbols-outlined">edit</span> Update
                  </div>
                  <div className="bg-black text-white border-4 border-white px-5 py-3 font-black uppercase text-sm tracking-widest flex items-center gap-2">
                    <span className="material-symbols-outlined text-red-400">delete</span> Delete
                  </div>
                </div>
              </div>
            </section>

            {/* ===== FITUR HIGHLIGHT ===== */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-10">
              <h2 className="text-2xl md:text-4xl font-black uppercase mb-8 border-b-4 border-black pb-4 tracking-tighter">
                🎯 Apa yang Akan Kita Bangun?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { icon: 'add_circle', color: 'bg-jade-vibrant text-black', title: 'Tambah Pesanan (Create)', desc: 'Form dengan input nama, berat cucian, dan status. Data langsung tersimpan ke Local Storage.' },
                  { icon: 'visibility', color: 'bg-black text-white', title: 'Tampilkan Daftar (Read)', desc: 'Semua pesanan ditampilkan dalam bentuk kartu yang rapi. Harga dihitung otomatis (Rp 5.000/kg)!' },
                  { icon: 'edit', color: 'bg-pine-deep text-white', title: 'Edit Pesanan (Update)', desc: 'Tombol Edit mengisi form secara otomatis. Setelah simpan, kartu langsung diperbarui tanpa refresh!' },
                  { icon: 'delete', color: 'bg-white text-black border-4 border-black', title: 'Hapus Pesanan (Delete)', desc: 'Hapus satu pesanan atau semua sekaligus, lengkap dengan dialog konfirmasi agar tidak salah hapus.' },
                  { icon: 'bar_chart', color: 'bg-mint-soft text-black', title: 'Dashboard Statistik (Bonus!)', desc: 'Kartu statistik yang selalu diperbarui: Total, Antri, Proses, dan Selesai secara real-time.' },
                  { icon: 'sd_storage', color: 'bg-jade-vibrant text-black', title: 'Penyimpanan Permanen (Bonus!)', desc: 'Data tidak hilang meski halaman ditutup! Begitu browser dibuka kembali, semua pesanan masih ada.' },
                ].map((f, idx) => (
                  <div key={idx} className="flex gap-4 items-start border-4 border-black p-5 shadow-neo-sm hover:-translate-y-1 hover:shadow-neo-md transition-all">
                    <span className={`${f.color} w-12 h-12 flex-shrink-0 flex items-center justify-center border-4 border-black`}>
                      <span className="material-symbols-outlined">{f.icon}</span>
                    </span>
                    <div>
                      <h3 className="font-black uppercase text-sm tracking-widest mb-1">{f.title}</h3>
                      <p className="text-sm font-bold text-gray-700 leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ===== STEP BY STEP ===== */}
            <section className="bg-canvas border-4 border-black shadow-neo-xl p-6 md:p-10">
              <h2 className="text-2xl md:text-4xl font-black uppercase mb-2 border-b-4 border-black pb-4 tracking-tighter flex items-center gap-3">
                <span className="material-symbols-outlined text-jade-vibrant text-4xl">checklist</span>
                Panduan Langkah demi Langkah
              </h2>
              <p className="font-bold text-gray-700 mb-8">Ikuti urutan ini dengan seksama. Buat 3 file terpisah di dalam 1 folder yang sama.</p>

              {/* Step Tabs */}
              <div className="flex gap-3 mb-0 flex-wrap">
                {steps.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveStep(s.id)}
                    className={`px-5 py-3 font-black uppercase tracking-widest border-4 border-black text-sm flex items-center gap-2 transition-all ${
                      activeStep === s.id
                        ? `${s.color} shadow-none translate-x-[2px] translate-y-[2px]`
                        : 'bg-white text-black shadow-neo-sm hover:-translate-y-1 hover:shadow-neo-md'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">{s.icon}</span>
                    Langkah {s.id}: {s.label}
                  </button>
                ))}
              </div>

              {/* Step 1: HTML */}
              {activeStep === 1 && (
                <div className="border-4 border-t-0 border-black bg-white p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-start gap-4 mb-6">
                    <div className="flex-1">
                      <h3 className="text-2xl font-black uppercase mb-2 flex items-center gap-2">
                        <span className="bg-black text-white px-3 py-1 text-sm">LANGKAH 1</span> Buat File HTML
                      </h3>
                      <p className="font-bold text-gray-700 leading-relaxed">Buat file bernama <code className="bg-gray-200 px-1 border border-black">index.html</code>. File ini adalah "rangka" aplikasimu. Perhatikan elemen-elemen penting:</p>
                    </div>
                  </div>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                    {[
                      { icon: 'article', label: 'Form Pesanan', desc: 'Ada input tersembunyi (hidden) untuk ID saat mode Edit.' },
                      { icon: 'bar_chart', label: 'Kartu Statistik', desc: '4 kotak angka yang datanya diisi oleh JavaScript secara otomatis.' },
                      { icon: 'view_list', label: 'Wadah Daftar', desc: 'Hanya div kosong #wadah-pesanan — JS yang akan mengisinya!' },
                      { icon: 'code', label: 'Link ke script.js', desc: 'Tag script HARUS diletakkan paling bawah, sebelum </body>.' },
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 bg-canvas border-2 border-black p-3">
                        <span className="material-symbols-outlined text-jade-vibrant mt-1">{item.icon}</span>
                        <div>
                          <span className="font-black uppercase text-xs tracking-widest block">{item.label}</span>
                          <span className="text-sm font-bold text-gray-600">{item.desc}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="relative">
                    <div className="bg-black text-white border-4 border-black border-b-0 p-3 flex justify-between items-center">
                      <span className="font-black tracking-widest uppercase flex items-center gap-2">
                        <span className="material-symbols-outlined text-jade-vibrant">html</span> index.html
                      </span>
                      <button
                        onClick={() => { navigator.clipboard.writeText(step1Html); setIsCopiedStep1Html(true); setTimeout(() => setIsCopiedStep1Html(false), 2000); }}
                        className="bg-jade-vibrant text-black px-3 py-2 font-black uppercase border-2 border-white hover:-translate-y-1 transition-all flex items-center gap-2 text-sm"
                      >
                        <span className="material-symbols-outlined text-xl">{isCopiedStep1Html ? 'check' : 'content_copy'}</span>
                        {isCopiedStep1Html ? 'Tersalin!' : 'Copy'}
                      </button>
                    </div>
                    <div className="border-4 border-black shadow-neo-lg bg-black">
                      <CodeBlock language="html" code={step1Html} />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: CSS */}
              {activeStep === 2 && (
                <div className="border-4 border-t-0 border-black bg-white p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-start gap-4 mb-6">
                    <div className="flex-1">
                      <h3 className="text-2xl font-black uppercase mb-2 flex items-center gap-2">
                        <span className="bg-pine-deep text-white px-3 py-1 text-sm">LANGKAH 2</span> Buat File CSS
                      </h3>
                      <p className="font-bold text-gray-700 leading-relaxed">Buat file bernama <code className="bg-gray-200 px-1 border border-black">style.css</code> di folder yang sama. CSS ini memakai gaya <strong>Neo-Brutalism</strong> yang tegas dan modern.</p>
                    </div>
                  </div>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                    {[
                      { icon: 'palette', label: 'Variabel Warna', desc: 'Semua warna disimpan di :root untuk kemudahan konsistensi.' },
                      { icon: 'shadow', label: 'Box Shadow', desc: 'Efek shadow tegas khas Neo-Brutalism pada setiap kartu.' },
                      { icon: 'badge', label: 'Badge Status', desc: 'Warna badge berbeda otomatis berdasarkan class (Antri, Proses, Selesai).' },
                      { icon: 'grid_view', label: 'Grid Statistik', desc: 'Responsive 2 kolom di mobile, 4 kolom di desktop.' },
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 bg-canvas border-2 border-black p-3">
                        <span className="material-symbols-outlined text-pine-deep mt-1">{item.icon}</span>
                        <div>
                          <span className="font-black uppercase text-xs tracking-widest block">{item.label}</span>
                          <span className="text-sm font-bold text-gray-600">{item.desc}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="relative">
                    <div className="bg-pine-deep text-white border-4 border-black border-b-0 p-3 flex justify-between items-center">
                      <span className="font-black tracking-widest uppercase flex items-center gap-2">
                        <span className="material-symbols-outlined text-mint-soft">css</span> style.css
                      </span>
                      <button
                        onClick={() => { navigator.clipboard.writeText(step2Css); setIsCopiedStep2Css(true); setTimeout(() => setIsCopiedStep2Css(false), 2000); }}
                        className="bg-white text-black px-3 py-2 font-black uppercase border-2 border-black hover:-translate-y-1 transition-all flex items-center gap-2 text-sm"
                      >
                        <span className="material-symbols-outlined text-xl">{isCopiedStep2Css ? 'check' : 'content_copy'}</span>
                        {isCopiedStep2Css ? 'Tersalin!' : 'Copy'}
                      </button>
                    </div>
                    <div className="border-4 border-black shadow-[6px_6px_0px_rgba(255,255,255,1)] bg-black">
                      <CodeBlock language="css" code={step2Css} />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: JS */}
              {activeStep === 3 && (
                <div className="border-4 border-t-0 border-black bg-white p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-start gap-4 mb-6">
                    <div className="flex-1">
                      <h3 className="text-2xl font-black uppercase mb-2 flex items-center gap-2">
                        <span className="bg-jade-vibrant text-black px-3 py-1 text-sm">LANGKAH 3</span> Buat File JavaScript
                      </h3>
                      <p className="font-bold text-gray-700 leading-relaxed">Buat file bernama <code className="bg-gray-200 px-1 border border-black">script.js</code>. Ini adalah otak aplikasi. Perhatikan baik-baik alur logikanya!</p>
                    </div>
                  </div>
                  {/* CRUD Flow Diagram */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                    {[
                      { label: 'Create', color: 'bg-jade-vibrant text-black', desc: 'Kirim form → buat object baru → push ke Array → simpan ke LS → render.' },
                      { label: 'Read', color: 'bg-black text-white', desc: 'Ambil data dari LS saat web dibuka → panggil renderPesanan().' },
                      { label: 'Update', color: 'bg-pine-deep text-white', desc: 'Klik Edit → isi form → submit → findIndex → timpa data → simpan → render.' },
                      { label: 'Delete', color: 'bg-white text-black border-4 border-black', desc: 'Klik Hapus → filter Array (singkirkan ID target) → simpan → render.' },
                    ].map((c, i) => (
                      <div key={i} className={`${c.color} border-4 border-black p-4 shadow-neo-sm`}>
                        <span className="font-black uppercase text-xs tracking-widest block mb-2">{c.label}</span>
                        <span className="text-xs font-bold leading-relaxed opacity-90">{c.desc}</span>
                      </div>
                    ))}
                  </div>
                  <div className="relative">
                    <div className="bg-jade-vibrant text-black border-4 border-black border-b-0 p-3 flex justify-between items-center">
                      <span className="font-black tracking-widest uppercase flex items-center gap-2">
                        <span className="material-symbols-outlined">javascript</span> script.js
                      </span>
                      <button
                        onClick={() => { navigator.clipboard.writeText(step3Js); setIsCopiedStep3Js(true); setTimeout(() => setIsCopiedStep3Js(false), 2000); }}
                        className="bg-black text-white px-3 py-2 font-black uppercase border-2 border-black hover:-translate-y-1 transition-all flex items-center gap-2 text-sm"
                      >
                        <span className="material-symbols-outlined text-xl">{isCopiedStep3Js ? 'check' : 'content_copy'}</span>
                        {isCopiedStep3Js ? 'Tersalin!' : 'Copy'}
                      </button>
                    </div>
                    <div className="border-4 border-black shadow-[6px_6px_0px_rgba(45,212,191,1)] bg-black">
                      <CodeBlock language="javascript" code={step3Js} />
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* ===== FULL CODE (COPY SEMUA) ===== */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-10">
              <h2 className="text-2xl md:text-4xl font-black uppercase mb-4 border-b-4 border-black pb-4 tracking-tighter flex items-center gap-3">
                <span className="material-symbols-outlined text-jade-vibrant text-4xl">rocket_launch</span>
                Mau Langsung Coba? Copy Semuanya!
              </h2>
              <p className="font-bold text-gray-700 mb-8 leading-relaxed">
                Jika kamu sudah memahami konsepnya dan ingin langsung mencoba, gunakan tombol di bawah ini untuk menyalin semua kode sekaligus. Ingat: pisahkan menjadi 3 file terpisah (<code className="bg-gray-200 px-1">index.html</code>, <code className="bg-gray-200 px-1">style.css</code>, <code className="bg-gray-200 px-1">script.js</code>) dalam <strong>satu folder yang sama</strong>!
              </p>

              <div className="mb-6 relative">
                <div className="bg-black text-white border-4 border-black border-b-0 p-3 md:p-4 flex justify-between items-center w-full shadow-neo-sm">
                  <div className="flex gap-2">
                    <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white"></div>
                    <div className="w-4 h-4 rounded-full bg-yellow-400 border-2 border-white"></div>
                    <div className="w-4 h-4 rounded-full bg-green-400 border-2 border-white"></div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowFullCode(!showFullCode)}
                      className="bg-pine-deep text-white px-3 py-2 md:px-4 text-sm md:text-base font-black uppercase tracking-widest border-2 border-white hover:-translate-y-1 hover:shadow-[4px_4px_0px_rgba(255,255,255,1)] transition-all flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-xl">{showFullCode ? 'visibility_off' : 'visibility'}</span>
                      <span className="hidden sm:inline">{showFullCode ? 'Sembunyikan' : 'Lihat Semua'}</span>
                    </button>
                    <button
                      onClick={() => { navigator.clipboard.writeText(fullCode); setIsCopiedFull(true); setTimeout(() => setIsCopiedFull(false), 2000); }}
                      className="bg-jade-vibrant text-black px-3 py-2 md:px-4 text-sm md:text-base font-black uppercase tracking-widest border-2 border-black hover:-translate-y-1 hover:shadow-neo-sm transition-all flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-xl">{isCopiedFull ? 'check' : 'content_copy'}</span>
                      {isCopiedFull ? 'Tersalin!' : 'Copy Semua'}
                    </button>
                  </div>
                </div>
                <div id="code-section-full" className="border-4 border-black shadow-neo-lg bg-black transition-all relative">
                  <CodeBlock language="html" code={showFullCode ? fullCode : step1Html.slice(0, 300) + '\n...'} />
                  {!showFullCode && (
                    <div
                      onClick={() => setShowFullCode(true)}
                      className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90 flex items-end justify-center pb-6 md:pb-12 cursor-pointer hover:to-black/100 transition-all"
                    >
                      <button className="bg-jade-vibrant text-black border-4 border-black px-4 py-3 md:px-8 md:py-4 font-black uppercase tracking-widest flex items-center gap-2 hover:-translate-y-2 hover:shadow-[4px_4px_0px_rgba(255,255,255,1)] transition-all text-sm md:text-base">
                        <span className="material-symbols-outlined text-2xl">expand_more</span>
                        Tampilkan Semua Kode
                        <span className="material-symbols-outlined text-2xl">expand_more</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Footer */}
            <div className="mt-8 mb-8 flex flex-col md:flex-row justify-between items-center gap-4 border-t-4 border-black pt-8">
              <p className="font-black text-sm md:text-base uppercase tracking-widest text-forest-teal bg-white border-4 border-black px-4 py-2 shadow-neo-sm text-center md:text-left">
                © 2026 FARHAN YUDHA PRATAMA
              </p>
              <div className="bg-jade-vibrant text-black font-black uppercase text-sm md:text-base px-6 py-3 border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] flex items-center gap-2">
                <span className="material-symbols-outlined">emoji_events</span>
                Selamat! Kamu Sudah Selesai Belajar JS! 🎉
              </div>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}

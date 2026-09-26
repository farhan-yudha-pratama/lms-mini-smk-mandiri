"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import CodeBlock from '@/components/CodeBlock';
import { useState } from 'react';

export default function CrudLocalStoragePage() {
  const [isStarted, setIsStarted] = useState(false);
  
  // States for Section 2 (Praktik CRUD)
  const [isCopiedHtml, setIsCopiedHtml] = useState(false);
  const [isCopiedCss, setIsCopiedCss] = useState(false);
  const [isCopiedJs, setIsCopiedJs] = useState(false);

  /* ================== KODE UNTUK SECTION 2 (PRAKTIK) ================== */
  const htmlCode = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Buku Tamu Permanen</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="kontainer">
        <h2>Buku Tamu 📖</h2>
        <p>Modul interaktif: Data pesan akan direkam secara persisten pada local storage browser.</p>
        
        <form class="contact-form">
            <input type="text" id="input-nama" placeholder="Siapa namamu?" required />
            <textarea id="input-pesan" placeholder="Deskripsi entri..." required></textarea>
            <button type="submit" class="btn">Kirim Pesan</button>
        </form>

        <hr>

        <h3>Daftar Pesan:</h3>
        <!-- Container target DOM untuk injeksi data -->
        <div id="wadah-pesan"></div>
    </div>
    
    <script src="script.js"></script>
</body>
</html>`;

  const cssCode = `/* Reset Dasar */
body {
    background-color: #EAF4ED;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding-top: 50px;
    min-height: 100vh;
    font-family: 'Courier New', Courier, monospace;
    margin: 0;
}

/* Desain Brutalism untuk Kontainer Utama */
.kontainer {
    background-color: white;
    padding: 30px;
    border: 4px solid black;
    box-shadow: 8px 8px 0px black;
    width: 350px;
    margin-bottom: 50px;
}

h2, h3 {
    text-transform: uppercase;
}

hr {
    border: 2px solid black;
    margin: 20px 0;
}

/* Layout Form */
.contact-form {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

input, textarea {
    padding: 10px;
    border: 3px solid black;
    font-family: inherit;
    font-weight: bold;
}

textarea {
    resize: none;
    height: 60px;
}

/* Tombol Kirim */
.btn {
    background-color: #092328;
    color: white;
    font-weight: bold;
    padding: 12px;
    border: 3px solid black;
    box-shadow: 4px 4px 0px black;
    cursor: pointer;
    text-transform: uppercase;
}

.btn:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0px black;
}

/* =========================================
   Gaya untuk elemen yang diciptakan oleh JS 
   ========================================= */
.kartu-pesan {
    background-color: #fffacd; /* Kuning pucat */
    border: 3px solid black;
    padding: 15px;
    margin-bottom: 15px;
    box-shadow: 4px 4px 0px black;
}

.nama-tamu {
    color: #2A835F;
    font-size: 18px;
    font-weight: 900;
    text-transform: uppercase;
    border-bottom: 2px solid black;
    padding-bottom: 5px;
    margin-bottom: 10px;
    display: inline-block;
}

.teks-pesan {
    font-weight: bold;
    margin: 0 0 15px 0;
}

.btn-hapus {
    background-color: #ff4757; /* Merah */
    color: white;
    font-weight: bold;
    padding: 5px 10px;
    border: 2px solid black;
    cursor: pointer;
    font-size: 12px;
}

.btn-hapus:hover {
    background-color: black;
}`;

  const jsCode = `// 1. Inisialisasi Elemen Referensi DOM
const formBukuTamu = document.querySelector('.contact-form');
const inputNama = document.getElementById('input-nama');
const inputPesan = document.getElementById('input-pesan');
const wadahPesan = document.getElementById('wadah-pesan');

// [READ] 2. Ekstraksi Data dari Local Storage
// Fallback ke array kosong jika data tidak ditemukan (null)
let daftarTamu = JSON.parse(localStorage.getItem('dataTamu')) || [];

// 3. Deklarasi Fungsi Render UI
function renderPesan() {
    wadahPesan.innerHTML = ""; // Reset state innerHTML mencegah duplikasi data
    
    // Eksekusi iterasi pada array data
    for (let i = 0; i < daftarTamu.length; i++) {
        let tamu = daftarTamu[i]; // Menyimpan referensi objek data pada iterasi ke-i
        
        // Injeksi elemen DOM menggunakan Template Literal
        wadahPesan.innerHTML += \`
            <div class="kartu-pesan">
                <span class="nama-tamu">\${tamu.nama}</span>
                <p class="teks-pesan">"\${tamu.pesan}"</p>
                <button class="btn-hapus" onclick="hapusPesan(\${tamu.id})">HAPUS</button>
            </div>
        \`;
    }
}

// Eksekusi awal fungsi render pada siklus muat halaman
renderPesan(); 

// [CREATE] 4. Event Handler Pengiriman Form
formBukuTamu.addEventListener('submit', function(event) {
    event.preventDefault(); // Mencegah default behavior pengiriman form
    
    // Konstruksi Objek Data Baru
    let pesanBaru = {
        id: Date.now(), // Menggunakan timestamp sebagai unique identifier
        nama: inputNama.value,
        pesan: inputPesan.value
    };
    
    // === TRANSAKSI DATA ===
    daftarTamu.push(pesanBaru); // A. Injeksi objek baru ke array memori
    localStorage.setItem('dataTamu', JSON.stringify(daftarTamu)); // B. Serialisasi array dan komit ke Local Storage
    
    renderPesan(); // C. Panggil fungsi render untuk sinkronisasi UI
    formBukuTamu.reset(); // D. Reset input form
});

// [DELETE] 5. Fungsi Penghapusan Entri
// Ekspos fungsi ke global scope untuk eksekusi inline HTML
window.hapusPesan = function(idTarget) {
    // Menggunakan fungsi filter: Pertahankan data dengan id yang tidak ekuivalen
    daftarTamu = daftarTamu.filter(function(tamu) {
        return tamu.id !== idTarget;
    });
    
    localStorage.setItem('dataTamu', JSON.stringify(daftarTamu)); // Komit pembaruan state ke Local Storage
    renderPesan(); // Sinkronisasi UI
};`;


  return (
    <>
      <Headbar
        links={[
          { label: 'Materi JS', href: '/crud-localstorage', isActive: true },
        ]}
      />

      <div className="flex pt-[88px] min-h-screen">
        <Sidebar />

        <main className="md:ml-[280px] w-full p-4 md:p-10 bg-canvas relative" style={{ backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">

            {/* Header & Hero Section */}
            <section className="bg-white border-4 border-black p-6 md:p-12 shadow-[8px_8px_0px_rgba(42,131,95,1)] text-center relative overflow-hidden transform rotate-1 hover:rotate-0 transition-transform">
              <div className="absolute top-0 left-0 bg-black text-white font-black px-4 py-1 border-b-4 border-r-4 border-black shadow-neo-sm z-20">
                MODUL 5
              </div>
              <div className="absolute top-2 md:top-4 left-2 md:left-4">
                <span className="material-symbols-outlined text-6xl md:text-[80px] opacity-10 text-black">database</span>
              </div>
              <div className="absolute bottom-2 md:bottom-4 right-2 md:right-4">
                <span className="material-symbols-outlined text-6xl md:text-[80px] opacity-10 text-black">inventory_2</span>
              </div>
              <div className="relative z-10">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-black tracking-tighter uppercase mt-6 mb-4 md:mb-6 drop-shadow-[2px_2px_0px_rgba(42,131,95,0.4)]">
                  Konsep Integrasi Data
                </h1>
                <p className="text-base md:text-xl font-bold text-white bg-black inline-block px-4 py-2 md:px-6 md:py-3 border-4 border-black mb-6 md:mb-8 shadow-neo-md uppercase tracking-tight">
                  Menyimpan Data Secara Permanen (CRUD & Local Storage)
                </p>
                <div>
                  <button
                    onClick={() => setIsStarted(!isStarted)}
                    className="bg-jade-vibrant text-black font-black text-lg md:text-2xl px-6 py-4 md:px-10 md:py-5 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] md:hover:shadow-[14px_14px_0px_0px_rgba(0,0,0,1)] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all uppercase tracking-widest cursor-pointer"
                  >
                    {isStarted ? "MEMULAI MODUL PENYIMPANAN DATA... 📡" : "MULAI BELAJAR SEKARANG"}
                  </button>
                </div>
              </div>
            </section>

            {/* Section 1: Teori Dasar */}
            <section className="bg-canvas border-4 border-black shadow-neo-xl p-6 md:p-12">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-mint-soft text-black w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">1</span>
                Mekanisme Penyimpanan Data
              </h2>

              <p className="text-lg md:text-xl font-bold text-forest-teal leading-relaxed mb-8 bg-white p-6 border-4 border-black shadow-neo-sm">
                Skrip JavaScript murni mengeksekusi data pada <em>volatile memory</em> (RAM). Hal ini mengakibatkan lenyapnya seluruh <em>state</em> data ketika halaman web direkayasa ulang (refresh/reload). Untuk membangun aplikasi nyata yang memiliki kapabilitas retensi data, kita memerlukan implementasi mekanisme <strong>Penyimpanan Data Persisten</strong> serta arsitektur <strong>CRUD</strong>!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Object */}
                <div className="bg-black text-white border-4 border-black p-6 shadow-neo-md hover:-translate-y-2 transition-transform">
                  <h3 className="text-2xl font-black uppercase mb-3 text-jade-vibrant tracking-widest flex items-center gap-2">
                    <span className="material-symbols-outlined">data_object</span> Object
                  </h3>
                  <p className="text-base font-bold text-gray-200">
                    Struktur data terorganisasi yang digunakan untuk merepresentasikan entitas kompleks, mengandalkan pemetaan berpasangan antara Kunci (Key) dan Nilai (Value). Diinisialisasi melalui kurung kurawal <code className="bg-white text-black px-1">{"{ }"}</code>. Konstruksi ini sangat optimal untuk manajemen representasi data formulir.
                  </p>
                  <code className="block bg-pine-deep p-2 mt-3 font-bold border-2 border-white text-sm">
                    {"{ nama: 'Budi', pesan: 'Halo' }"}
                  </code>
                </div>

                {/* Local Storage */}
                <div className="bg-pine-deep text-white border-4 border-black p-6 shadow-neo-md hover:-translate-y-2 transition-transform">
                  <h3 className="text-2xl font-black uppercase mb-3 text-mint-soft tracking-widest flex items-center gap-2">
                    <span className="material-symbols-outlined">sd_storage</span> Local Storage
                  </h3>
                  <p className="text-base font-bold text-gray-200">
                    API penyimpanan web (Web Storage API) terintegrasi pada klien (<em>browser</em>). Data yang disisipkan ke dalam Local Storage direkam secara persisten dan tidak memiliki kadaluarsa siklus hidup, menjamin retensi data pasca-penutupan sesi browser.
                  </p>
                </div>

                {/* JSON */}
                <div className="bg-jade-vibrant text-black border-4 border-black p-6 shadow-neo-md hover:-translate-y-2 transition-transform">
                  <h3 className="text-2xl font-black uppercase mb-3 tracking-widest flex items-center gap-2">
                    <span className="material-symbols-outlined">text_format</span> Konsep JSON
                  </h3>
                  <p className="text-base font-bold text-gray-900">
                    <em>Local Storage</em> memiliki konvensi ketat: arsitekturnya hanya memvalidasi penyimpanan berbasis tipe <em>string</em> murni. Sehingga, kita memerlukan mekanisme serialisasi objek.
                  </p>
                  <ul className="text-base font-bold mt-2 space-y-1">
                    <li><code className="bg-white px-1">JSON.stringify</code>: Serialisasi struktur objek ke dalam representasi string JSON.</li>
                    <li><code className="bg-white px-1">JSON.parse</code>: Deserialisasi representasi string JSON kembali ke format objek.</li>
                  </ul>
                </div>

                {/* CRUD */}
                <div className="bg-white text-black border-4 border-black p-6 shadow-[6px_6px_0px_rgba(45,212,191,1)] hover:-translate-y-2 transition-transform">
                  <h3 className="text-2xl font-black uppercase mb-3 text-forest-teal tracking-widest flex items-center gap-2">
                    <span className="material-symbols-outlined">autorenew</span> Pola CRUD
                  </h3>
                  <p className="text-base font-bold text-gray-700 mb-2">Standar arsitektural pengelolaan data presisten, mendefinisikan empat operasi fundamental dalam manipulasi <em>database</em> sistem:</p>
                  <ul className="text-base font-black italic space-y-1 bg-canvas p-3 border-2 border-black">
                    <li><span className="text-pine-deep">C</span>reate (Membuat Data)</li>
                    <li><span className="text-pine-deep">R</span>ead (Membaca/Menampilkan Data)</li>
                    <li><span className="text-pine-deep">U</span>pdate (Mengubah Data)</li>
                    <li><span className="text-pine-deep">D</span>elete (Menghapus Data)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 2: Praktik Buku Tamu Permanen */}
            <section className="bg-pine-deep border-4 border-black shadow-neo-xl p-6 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-black rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"></div>
              
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter relative z-10 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                <span className="bg-white text-black w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] flex-shrink-0 text-2xl md:text-4xl">2</span>
                Implementasi: Aplikasi Buku Tamu
              </h2>

              <div className="bg-black text-white border-4 border-black p-6 md:p-8 mb-10 shadow-[6px_6px_0px_rgba(42,131,95,1)] relative z-10">
                <p className="text-xl font-bold text-jade-vibrant mb-4 uppercase tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined text-jade-vibrant text-3xl">build</span> Tujuan Implementasi:
                </p>
                <p className="text-lg font-bold leading-relaxed mb-4">
                  Kita akan merekonstruksi arsitektur "Form Kontak" sebelumnya dan mengekspansinya menjadi <strong>Aplikasi Buku Tamu Persisten</strong>. Tiap entri pengiriman akan dikomit langsung ke <em>Local Storage</em> dan dirender ke dalam DOM secara seketika. Manipulasi data yang terintegrasi ini menjamin keamanan <em>state</em> informasi meskipun siklus halaman (page reload) direset!
                </p>
                <p className="text-lg font-bold leading-relaxed bg-white text-black p-4 border-l-4 border-jade-vibrant">
                  Implementasi operasional mengadopsi tiga modul CRUD: <em>Read</em> (Ekstraksi data pasca-muat awal), <em>Create</em> (Injeksi state objek baru ke <em>storage</em>), dan <em>Delete</em> (Terminasi referensi objek berdasarkan ID). Silakan salin instruksi konfigurasi di bawah untuk evaluasi analitik!
                </p>
              </div>

              <div className="space-y-12 relative z-10">
                
                {/* HTML Block */}
                <div className="relative">
                    <div className="bg-white text-black border-4 border-black border-b-0 p-3 md:p-4 flex justify-between items-center w-full shadow-neo-sm">
                        <div className="flex gap-2">
                            <span className="font-black tracking-widest uppercase flex items-center gap-2">
                              <span className="material-symbols-outlined text-jade-vibrant">html</span>
                              index.html
                            </span>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(htmlCode);
                                    setIsCopiedHtml(true);
                                    setTimeout(() => setIsCopiedHtml(false), 2000);
                                }}
                                className="bg-black text-white px-3 py-2 md:px-4 text-sm md:text-base font-black uppercase tracking-widest border-2 border-black hover:-translate-y-1 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-xl">
                                    {isCopiedHtml ? 'check' : 'content_copy'}
                                </span>
                                {isCopiedHtml ? 'Tersalin!' : 'Copy'}
                            </button>
                        </div>
                    </div>
                    <div className="border-4 border-black shadow-[6px_6px_0px_rgba(255,255,255,1)] bg-black transition-all relative">
                        <CodeBlock language="html" code={htmlCode} />
                    </div>
                </div>

                {/* CSS Block */}
                <div className="relative">
                    <div className="bg-mint-canvas text-black border-4 border-black border-b-0 p-3 md:p-4 flex justify-between items-center w-full shadow-neo-sm">
                        <div className="flex gap-2">
                            <span className="font-black tracking-widest uppercase flex items-center gap-2">
                              <span className="material-symbols-outlined text-pine-deep">css</span>
                              style.css
                            </span>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(cssCode);
                                    setIsCopiedCss(true);
                                    setTimeout(() => setIsCopiedCss(false), 2000);
                                }}
                                className="bg-pine-deep text-white px-3 py-2 md:px-4 text-sm md:text-base font-black uppercase tracking-widest border-2 border-black hover:-translate-y-1 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-xl">
                                    {isCopiedCss ? 'check' : 'content_copy'}
                                </span>
                                {isCopiedCss ? 'Tersalin!' : 'Copy'}
                            </button>
                        </div>
                    </div>
                    <div className="border-4 border-black shadow-[6px_6px_0px_rgba(139,187,146,1)] bg-black transition-all relative">
                        <CodeBlock language="css" code={cssCode} />
                    </div>
                </div>

                {/* JS Block */}
                <div className="relative">
                    <div className="bg-jade-vibrant text-black border-4 border-black border-b-0 p-3 md:p-4 flex justify-between items-center w-full shadow-neo-sm">
                        <div className="flex gap-2">
                            <span className="font-black tracking-widest uppercase flex items-center gap-2">
                              <span className="material-symbols-outlined text-black">javascript</span>
                              script.js
                            </span>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(jsCode);
                                    setIsCopiedJs(true);
                                    setTimeout(() => setIsCopiedJs(false), 2000);
                                }}
                                className="bg-black text-white px-3 py-2 md:px-4 text-sm md:text-base font-black uppercase tracking-widest border-2 border-black hover:-translate-y-1 hover:shadow-neo-sm transition-all flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-xl">
                                    {isCopiedJs ? 'check' : 'content_copy'}
                                </span>
                                {isCopiedJs ? 'Tersalin!' : 'Copy'}
                            </button>
                        </div>
                    </div>
                    <div className="border-4 border-black shadow-[6px_6px_0px_rgba(45,212,191,1)] bg-black transition-all relative">
                        <CodeBlock language="javascript" code={jsCode} />
                    </div>
                </div>

              </div>

            </section>

            {/* Footer / Penutup */}
            <div className="mt-16 mb-8 flex flex-col md:flex-row justify-between items-center gap-4 border-t-4 border-black pt-8">
              <p className="font-black text-sm md:text-base uppercase tracking-widest text-forest-teal bg-white border-4 border-black px-4 py-2 shadow-neo-sm text-center md:text-left">
                © 2026 FARHAN YUDHA PRATAMA
              </p>
              <button className="bg-black text-white font-black uppercase text-sm md:text-base px-6 py-3 border-4 border-black shadow-[4px_4px_0px_rgba(45,212,191,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_rgba(45,212,191,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all flex items-center gap-2">
                Selesai Belajar JS! <span className="material-symbols-outlined">done_all</span>
              </button>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}

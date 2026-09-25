"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import CodeBlock from '@/components/CodeBlock';
import { useState } from 'react';

export default function LogikaKeputusanPage() {
  const [isStarted, setIsStarted] = useState(false);
  
  // States for Section 2 (Dark Mode)
  const [isCopiedHtmlDark, setIsCopiedHtmlDark] = useState(false);
  const [isCopiedCssDark, setIsCopiedCssDark] = useState(false);
  const [isCopiedJsDark, setIsCopiedJsDark] = useState(false);

  // States for Section 3 (Form Validasi)
  const [isCopiedHtmlForm, setIsCopiedHtmlForm] = useState(false);
  const [isCopiedCssForm, setIsCopiedCssForm] = useState(false);
  const [isCopiedJsForm, setIsCopiedJsForm] = useState(false);

  /* ================== KODE UNTUK SECTION 2 (DARK MODE) ================== */
  const htmlDarkMode = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Website Mode Gelap</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="kontainer">
        <h1 id="judul">Selamat Datang! 🌞</h1>
        <p>Website ini sangat cerah. Apakah matamu silau? Coba ubah temanya!</p>
        <button id="btn-tema" class="btn">🌙 Mode Gelap</button>
    </div>
    
    <!-- Memanggil Script JS -->
    <script src="script.js"></script>
</body>
</html>`;

  const cssDarkMode = `/* 1. VARIABEL WARNA (Default: Terang) */
:root {
    --bg-color: #f0f4f8;
    --text-color: #333333;
    --box-bg: #ffffff;
}

/* 2. OVERRIDE WARNA SAAT MODE GELAP AKTIF */
body.dark-mode {
    --bg-color: #121212;
    --text-color: #ffffff;
    --box-bg: #1e1e1e;
}

/* 3. STYLING ELEMEN (Menerapkan Variabel) */
body {
    background-color: var(--bg-color);
    color: var(--text-color);
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    font-family: Arial, sans-serif;
    margin: 0;
    transition: background-color 0.3s, color 0.3s; /* Efek transisi halus */
}

.kontainer {
    background-color: var(--box-bg);
    padding: 40px;
    border: 4px solid #000;
    box-shadow: 8px 8px 0px #000;
    text-align: center;
    transition: background-color 0.3s;
}

.btn {
    background-color: #2A835F;
    color: white;
    font-weight: bold;
    padding: 12px 24px;
    border: 4px solid black;
    box-shadow: 4px 4px 0px black;
    cursor: pointer;
    font-size: 16px;
    margin-top: 20px;
}

.btn:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0px black;
}`;

  const jsDarkMode = `// 1. Seleksi DOM untuk tombol toggle dan elemen target (body)
const tombolTema = document.getElementById('btn-tema');
const judul = document.getElementById('judul');
const bodyWebsite = document.body; // Referensi statis ke elemen body

// 2. Registrasi Event Listener bertipe 'click'
tombolTema.addEventListener('click', function(event) {
    
    // Percabangan If-Else: Evaluasi apakah 'dark-mode' eksis di struktur classList
    if (bodyWebsite.classList.contains('dark-mode')) {
        // Jika kondisi true (Mode Gelap saat ini aktif):
        // 1. Hapus 'dark-mode' untuk kembali ke representasi default (Terang)
        bodyWebsite.classList.remove('dark-mode');
        // 2. Modifikasi state UI ke mode gelap
        tombolTema.textContent = "🌙 Mode Gelap";
        judul.textContent = "Selamat Datang! 🌞";
        
    } else {
        // Jika kondisi false (Mode Terang saat ini aktif):
        // 1. Terapkan 'dark-mode' pada hierarki body
        bodyWebsite.classList.add('dark-mode');
        // 2. Modifikasi state UI ke mode terang
        tombolTema.textContent = "☀️ Mode Terang";
        judul.textContent = "Mode Malam Aktif 🌙";
    }
    
});`;

  /* ================== KODE UNTUK SECTION 3 (FORM VALIDASI) ================== */
  const htmlFormValidasi = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Validasi Kontak</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="kontainer">
        <h2>Kirim Pesan Rahasia 🕵️</h2>
        <!-- Ini adalah form kita -->
        <form class="contact-form">
            <input type="text" id="input-nama" placeholder="Siapa namamu?" />
            <textarea id="input-pesan" placeholder="Tulis pesan rahasiamu di sini..."></textarea>
            <button type="submit" class="btn">Kirim Pesan!</button>
        </form>
    </div>
    
    <script src="script.js"></script>
</body>
</html>`;

  const cssFormValidasi = `/* Reset dasar */
body {
    background-color: #ffe4e1;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    font-family: 'Courier New', Courier, monospace;
    margin: 0;
}

.kontainer {
    background-color: white;
    padding: 30px;
    border: 4px solid black;
    box-shadow: 8px 8px 0px black;
    text-align: center;
    width: 300px;
}

/* Mengatur tata letak form agar berbaris ke bawah */
.contact-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-top: 20px;
}

input, textarea {
    padding: 10px;
    border: 4px solid black;
    font-family: inherit;
    font-size: 14px;
    font-weight: bold;
}

textarea {
    resize: none;
    height: 80px;
}

input:focus, textarea:focus {
    outline: none;
    background-color: #eaf4ed;
}

.btn {
    background-color: #092328;
    color: white;
    font-weight: bold;
    padding: 12px;
    border: 4px solid black;
    box-shadow: 4px 4px 0px black;
    cursor: pointer;
    font-size: 16px;
    text-transform: uppercase;
}

.btn:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0px black;
}`;

  const jsFormValidasi = `// 1. Mencari elemen form dan input-inputnya
const formKontak = document.querySelector('.contact-form');
const inputNama = document.getElementById('input-nama');
const inputPesan = document.getElementById('input-pesan');

// 2. Registrasi Event Listener 'submit' pada blok form
formKontak.addEventListener('submit', function(event) {
    
    // Mencegah default behavior pengiriman form (refresh halaman)
    event.preventDefault(); 
    
    // Logika Evaluasi OR (||): Cek jika input nama ATAU input pesan bernilai string kosong
    if (inputNama.value === "" || inputPesan.value === "") {
        // Blokir proses pengiriman dan tampilkan alert error
        alert("Peringatan: Field Nama dan Pesan wajib diisi penuh.");
    } else {
        // Jika kedua input lolos validasi (memiliki nilai)
        alert(\`Transmisi data sukses dari: \${inputNama.value}\`);
        
        // Mereset nilai elemen input form ke state awal
        formKontak.reset(); 
    }
});`;


  return (
    <>
      <Headbar
        links={[
          { label: 'Materi JS', href: '/logika-keputusan', isActive: true },
        ]}
      />

      <div className="flex pt-[88px] min-h-screen">
        <Sidebar />

        <main className="md:ml-[280px] w-full p-4 md:p-10 bg-canvas relative" style={{ backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">

            {/* Header & Hero Section */}
            <section className="bg-pine-deep text-white border-4 border-black p-6 md:p-12 shadow-neo-xl text-center relative overflow-hidden transform -rotate-1 hover:rotate-0 transition-transform">
              <div className="absolute top-0 left-0 bg-jade-vibrant text-black font-black px-4 py-1 border-b-4 border-r-4 border-black shadow-neo-sm z-20">
                MODUL 3
              </div>
              <div className="absolute top-2 md:top-4 left-2 md:left-4">
                <span className="material-symbols-outlined text-6xl md:text-[80px] opacity-20 text-white">alt_route</span>
              </div>
              <div className="absolute bottom-2 md:bottom-4 right-2 md:right-4">
                <span className="material-symbols-outlined text-6xl md:text-[80px] opacity-20 text-white">rule</span>
              </div>
              <div className="relative z-10">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tighter uppercase mt-6 mb-4 md:mb-6 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                  Logika Keputusan
                </h1>
                <p className="text-base md:text-xl font-bold text-black bg-mint-soft inline-block px-4 py-2 md:px-6 md:py-3 border-4 border-black mb-6 md:mb-8 shadow-neo-md uppercase tracking-tight">
                  Implementasi Pengambilan Keputusan Kondisional pada Interaksi Web
                </p>
                <div>
                  <button
                    onClick={() => setIsStarted(!isStarted)}
                    className="bg-white text-black font-black text-lg md:text-2xl px-6 py-4 md:px-10 md:py-5 border-4 border-black shadow-[6px_6px_0px_0px_rgba(45,212,191,1)] md:shadow-[10px_10px_0px_0px_rgba(45,212,191,1)] hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[12px_12px_0px_0px_rgba(45,212,191,1)] md:hover:shadow-[14px_14px_0px_0px_rgba(45,212,191,1)] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all uppercase tracking-widest cursor-pointer"
                  >
                    {isStarted ? "MEMULAI MODUL LOGIKA KEPUTUSAN..." : "MULAI BELAJAR SEKARANG"}
                  </button>
                </div>
              </div>
            </section>

            {/* Section 1: Teori Logika Dasar */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-mint-soft text-black w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">1</span>
                Pengambilan Keputusan (Conditionals)
              </h2>

              <p className="text-lg md:text-xl font-bold text-forest-teal leading-relaxed mb-8 bg-mint-canvas p-6 border-4 border-black shadow-neo-sm">
                Tanpa logika kondisional, sebuah aplikasi web hanya akan mengeksekusi instruksi secara linier dan statis. Menggunakan <strong>Conditionals</strong> (Pengkondisian), JavaScript mampu mengevaluasi <em>state</em> secara dinamis: <em>"Jika (if) kondisi A bernilai true, eksekusi blok kode X; Jika kondisi A bernilai false (else), eksekusi blok kode Y."</em>
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Boolean */}
                <div className="bg-black text-white border-4 border-black p-6 shadow-neo-md hover:-translate-y-2 transition-transform">
                  <h3 className="text-2xl font-black uppercase mb-3 text-jade-vibrant tracking-widest flex items-center gap-2">
                    <span className="material-symbols-outlined">toggle_on</span> Tipe Data Boolean
                  </h3>
                  <p className="text-base font-bold text-gray-200">Tipe data fundamental yang hanya merepresentasikan dua nilai kebenaran mutlak (<em>Truth Value</em>): <code className="bg-white text-black px-1">true</code> (benar) atau <code className="bg-white text-black px-1">false</code> (salah). Tipe ini digunakan sebagai parameter kalkulasi logika Aljabar Boolean di komputasi mesin.</p>
                </div>

                {/* Operator Pembanding */}
                <div className="bg-pine-deep text-white border-4 border-black p-6 shadow-neo-md hover:-translate-y-2 transition-transform">
                  <h3 className="text-2xl font-black uppercase mb-3 text-mint-soft tracking-widest flex items-center gap-2">
                    <span className="material-symbols-outlined">balance</span> Operator Relasional
                  </h3>
                  <ul className="text-base font-bold text-gray-200 space-y-2">
                    <li><code className="bg-black px-1 text-jade-vibrant">===</code> : Identik (<em>Strict Equality</em> - nilai & tipe data sama).</li>
                    <li><code className="bg-black px-1 text-red-400">!==</code> : Tidak Identik (<em>Strict Inequality</em>).</li>
                    <li><code className="bg-black px-1">{">"}</code> / <code className="bg-black px-1">{"<"}</code> : Lebih besar / lebih kecil secara matematis.</li>
                  </ul>
                </div>

                {/* Operator Logika */}
                <div className="bg-jade-vibrant text-black border-4 border-black p-6 shadow-neo-md hover:-translate-y-2 transition-transform">
                  <h3 className="text-2xl font-black uppercase mb-3 tracking-widest flex items-center gap-2">
                    <span className="material-symbols-outlined">hub</span> Operator Logika
                  </h3>
                  <ul className="text-base font-bold space-y-2">
                    <li><code className="bg-white px-1">&&</code> (Logical AND) : Evaluasi bernilai true jika <strong>semua</strong> operan bernilai true.</li>
                    <li><code className="bg-white px-1">||</code> (Logical OR) : Evaluasi bernilai true jika <strong>minimal satu</strong> operan bernilai true.</li>
                  </ul>
                </div>

                {/* If-Else */}
                <div className="bg-white text-black border-4 border-black p-6 shadow-[6px_6px_0px_rgba(45,212,191,1)] hover:-translate-y-2 transition-transform">
                  <h3 className="text-2xl font-black uppercase mb-3 text-forest-teal tracking-widest flex items-center gap-2">
                    <span className="material-symbols-outlined">alt_route</span> If-Else Statement
                  </h3>
                  <p className="text-base font-bold text-gray-700">Sintaks fundamental untuk percabangan (<em>branching</em>):</p>
                  <div className="bg-canvas p-3 border-2 border-black mt-2 font-black italic text-sm">
                    if (kondisiEvaluasi === true) {"{"} blokEksekusiA(); {"}"} else {"{"} blokEksekusiB(); {"}"}
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Praktik Dark Mode */}
            <section className="bg-canvas border-4 border-black shadow-neo-xl p-6 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-black rounded-full mix-blend-multiply filter blur-3xl opacity-10 pointer-events-none"></div>
              
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter relative z-10">
                <span className="bg-black text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">2</span>
                Implementasi A: Fitur Dark Mode (Toggle)
              </h2>

              <div className="bg-white border-4 border-black p-6 md:p-8 mb-10 shadow-neo-md relative z-10">
                <p className="text-xl font-bold text-forest-teal mb-4 uppercase tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined text-jade-vibrant text-3xl">dark_mode</span> Tujuan Implementasi:
                </p>
                <p className="text-lg font-bold leading-relaxed">
                  Mengembangkan fitur peralihan tema visual (<strong>Dark/Light Mode Toggle</strong>). Saat diinisiasi melalui interaksi klik, skrip JavaScript akan mengevaluasi kelas state aktif pada elemen body. Algoritma kondisional akan membalik (toggle) representasi visual dari Mode Terang menjadi Mode Gelap, atau sebaliknya.
                </p>
                <p className="text-lg font-bold leading-relaxed mt-4 bg-mint-canvas p-4 border-l-4 border-black">
                  Silakan salin instruksi blok kode terpadu di bawah ini ke dalam proyek Anda (misal: di VS Code) untuk menganalisis mekanisme pergantian <em>state</em> ini secara komprehensif.
                </p>
              </div>

              <div className="space-y-12 relative z-10">
                
                {/* HTML Block (Dark Mode) */}
                <div className="relative">
                    <div className="bg-black text-white border-4 border-black border-b-0 p-3 md:p-4 flex justify-between items-center w-full shadow-neo-sm">
                        <div className="flex gap-2">
                            <span className="font-black tracking-widest uppercase flex items-center gap-2">
                              <span className="material-symbols-outlined text-jade-vibrant">html</span>
                              index.html
                            </span>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(htmlDarkMode);
                                    setIsCopiedHtmlDark(true);
                                    setTimeout(() => setIsCopiedHtmlDark(false), 2000);
                                }}
                                className="bg-mint-soft text-black px-3 py-2 md:px-4 text-sm md:text-base font-black uppercase tracking-widest border-2 border-white hover:-translate-y-1 hover:shadow-neo-sm transition-all flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-xl">
                                    {isCopiedHtmlDark ? 'check' : 'content_copy'}
                                </span>
                                {isCopiedHtmlDark ? 'Tersalin!' : 'Copy'}
                            </button>
                        </div>
                    </div>
                    <div className="border-4 border-black shadow-neo-lg bg-black transition-all relative">
                        <CodeBlock language="html" code={htmlDarkMode} />
                    </div>
                </div>

                {/* CSS Block (Dark Mode) */}
                <div className="relative">
                    <div className="bg-pine-deep text-white border-4 border-black border-b-0 p-3 md:p-4 flex justify-between items-center w-full shadow-neo-sm">
                        <div className="flex gap-2">
                            <span className="font-black tracking-widest uppercase flex items-center gap-2">
                              <span className="material-symbols-outlined text-mint-soft">css</span>
                              style.css
                            </span>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(cssDarkMode);
                                    setIsCopiedCssDark(true);
                                    setTimeout(() => setIsCopiedCssDark(false), 2000);
                                }}
                                className="bg-white text-black px-3 py-2 md:px-4 text-sm md:text-base font-black uppercase tracking-widest border-2 border-black hover:-translate-y-1 hover:shadow-[4px_4px_0px_rgba(255,255,255,1)] transition-all flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-xl">
                                    {isCopiedCssDark ? 'check' : 'content_copy'}
                                </span>
                                {isCopiedCssDark ? 'Tersalin!' : 'Copy'}
                            </button>
                        </div>
                    </div>
                    <div className="border-4 border-black shadow-[6px_6px_0px_rgba(255,255,255,1)] bg-black transition-all relative">
                        <CodeBlock language="css" code={cssDarkMode} />
                    </div>
                </div>

                {/* JS Block (Dark Mode) */}
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
                                    navigator.clipboard.writeText(jsDarkMode);
                                    setIsCopiedJsDark(true);
                                    setTimeout(() => setIsCopiedJsDark(false), 2000);
                                }}
                                className="bg-black text-white px-3 py-2 md:px-4 text-sm md:text-base font-black uppercase tracking-widest border-2 border-black hover:-translate-y-1 hover:shadow-neo-sm transition-all flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-xl">
                                    {isCopiedJsDark ? 'check' : 'content_copy'}
                                </span>
                                {isCopiedJsDark ? 'Tersalin!' : 'Copy'}
                            </button>
                        </div>
                    </div>
                    <div className="border-4 border-black shadow-[6px_6px_0px_rgba(45,212,191,1)] bg-black transition-all relative">
                        <CodeBlock language="javascript" code={jsDarkMode} />
                    </div>
                </div>

              </div>

            </section>

            {/* Section 3: Praktik Form Validasi */}
            <section className="bg-pine-deep text-white border-4 border-black shadow-neo-xl p-6 md:p-12 relative overflow-hidden">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white uppercase mb-8 md:mb-10 border-b-4 border-white pb-4 flex items-center gap-3 md:gap-4 tracking-tighter relative z-10 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                <span className="bg-white text-black w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] flex-shrink-0 text-2xl md:text-4xl">3</span>
                Implementasi B: Validasi Form Kontak
              </h2>

              <div className="bg-black text-white border-4 border-white p-6 md:p-8 mb-10 shadow-[6px_6px_0px_rgba(45,212,191,1)] relative z-10">
                <p className="text-xl font-bold text-mint-soft mb-4 uppercase tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined text-mint-soft text-3xl">security</span> Tujuan Implementasi:
                </p>
                <p className="text-lg font-bold leading-relaxed text-gray-200">
                  Data pada form input tidak boleh ditransmisikan dalam struktur state <em>null</em> (string kosong). Anda akan menerapkan Event Listener tipe <code>'submit'</code> pada modul formulir yang dikombinasikan dengan gerbang logika <strong>OR (||)</strong>. Algoritma kondisional ini melakukan validasi: <em>"Jika karakter panjang input nama adalah 0 ATAU isi field pesan adalah 0, cegah eksekusi pengiriman dan instansiasikan parameter alert pencegahan."</em>
                </p>
                <p className="text-lg font-bold leading-relaxed mt-4 bg-forest-teal text-white p-4 border-l-4 border-mint-soft">
                  Sebagaimana desain arsitektur sebelumnya, silakan salin instruksi konfigurasi ini guna mengimplementasikan modul mekanisme pencegahan <em>Client-Side Validation</em> secara mandiri!
                </p>
              </div>

              <div className="space-y-12 relative z-10">
                
                {/* HTML Block (Form Validasi) */}
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
                                    navigator.clipboard.writeText(htmlFormValidasi);
                                    setIsCopiedHtmlForm(true);
                                    setTimeout(() => setIsCopiedHtmlForm(false), 2000);
                                }}
                                className="bg-black text-white px-3 py-2 md:px-4 text-sm md:text-base font-black uppercase tracking-widest border-2 border-black hover:-translate-y-1 hover:shadow-neo-sm transition-all flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-xl">
                                    {isCopiedHtmlForm ? 'check' : 'content_copy'}
                                </span>
                                {isCopiedHtmlForm ? 'Tersalin!' : 'Copy'}
                            </button>
                        </div>
                    </div>
                    <div className="border-4 border-black shadow-[6px_6px_0px_rgba(255,255,255,1)] bg-black transition-all relative">
                        <CodeBlock language="html" code={htmlFormValidasi} />
                    </div>
                </div>

                {/* CSS Block (Form Validasi) */}
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
                                    navigator.clipboard.writeText(cssFormValidasi);
                                    setIsCopiedCssForm(true);
                                    setTimeout(() => setIsCopiedCssForm(false), 2000);
                                }}
                                className="bg-pine-deep text-white px-3 py-2 md:px-4 text-sm md:text-base font-black uppercase tracking-widest border-2 border-black hover:-translate-y-1 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-xl">
                                    {isCopiedCssForm ? 'check' : 'content_copy'}
                                </span>
                                {isCopiedCssForm ? 'Tersalin!' : 'Copy'}
                            </button>
                        </div>
                    </div>
                    <div className="border-4 border-black shadow-[6px_6px_0px_rgba(139,187,146,1)] bg-black transition-all relative">
                        <CodeBlock language="css" code={cssFormValidasi} />
                    </div>
                </div>

                {/* JS Block (Form Validasi) */}
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
                                    navigator.clipboard.writeText(jsFormValidasi);
                                    setIsCopiedJsForm(true);
                                    setTimeout(() => setIsCopiedJsForm(false), 2000);
                                }}
                                className="bg-black text-white px-3 py-2 md:px-4 text-sm md:text-base font-black uppercase tracking-widest border-2 border-black hover:-translate-y-1 hover:shadow-neo-sm transition-all flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-xl">
                                    {isCopiedJsForm ? 'check' : 'content_copy'}
                                </span>
                                {isCopiedJsForm ? 'Tersalin!' : 'Copy'}
                            </button>
                        </div>
                    </div>
                    <div className="border-4 border-black shadow-[6px_6px_0px_rgba(45,212,191,1)] bg-black transition-all relative">
                        <CodeBlock language="javascript" code={jsFormValidasi} />
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
                Lanjut ke Modul 4 <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}

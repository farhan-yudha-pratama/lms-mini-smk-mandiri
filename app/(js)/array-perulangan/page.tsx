"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import CodeBlock from '@/components/CodeBlock';
import { useState } from 'react';

export default function ArrayPerulanganPage() {
  const [isStarted, setIsStarted] = useState(false);
  
  // States for Section 2 (Praktik Array & Loop)
  const [isCopiedHtml, setIsCopiedHtml] = useState(false);
  const [isCopiedCss, setIsCopiedCss] = useState(false);
  const [isCopiedJs, setIsCopiedJs] = useState(false);

  /* ================== KODE UNTUK SECTION 2 (PRAKTIK) ================== */
  const htmlCode = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daftar Kemampuan</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="kontainer">
        <h2>🛠️ Keahlian Superku</h2>
        <p>Elemen list di bawah ini tidak di-hardcode pada HTML, melainkan di-generate secara dinamis menggunakan JavaScript.</p>
        
        <!-- CONTAINER KOSONG: Target injeksi DOM untuk elemen <li> -->
        <ul class="skill-list" id="daftar-kemampuan"></ul>
        
    </div>
    
    <script src="script.js"></script>
</body>
</html>`;

  const cssCode = `/* Reset dasar */
body {
    background-color: #fce4ec; /* Pink muda */
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    font-family: 'Courier New', Courier, monospace;
    margin: 0;
}

/* Kotak Kontainer Bergaya Brutalism */
.kontainer {
    background-color: white;
    padding: 30px;
    border: 4px solid black;
    box-shadow: 8px 8px 0px black;
    width: 350px;
}

h2 {
    text-transform: uppercase;
    border-bottom: 4px solid black;
    padding-bottom: 10px;
    margin-top: 0;
}

/* Mematikan titik default pada list (ul) */
.skill-list {
    list-style-type: none;
    padding: 0;
    margin-top: 20px;
}

/* Gaya Brutalism untuk setiap butir list (li) */
.skill-list li {
    background-color: #EAF4ED;
    border: 3px solid black;
    margin-bottom: 10px;
    padding: 10px 15px;
    font-weight: bold;
    box-shadow: 4px 4px 0px black;
    transform: rotate(-1deg); /* Sengaja dibuat miring sedikit */
    transition: all 0.2s;
}

/* Gaya untuk elemen genap agar warnanya beda dan miring kebalik */
.skill-list li:nth-child(even) {
    background-color: #fffacd;
    transform: rotate(1deg);
}

/* Animasi saat dihover */
.skill-list li:hover {
    transform: scale(1.05);
    background-color: #2A835F;
    color: white;
}`;

  const jsCode = `// 1. Struktur Data Array: Mendeklarasikan kumpulan nilai
// Notasi bracket [] merepresentasikan inisialisasi tipe data Array
const dataKemampuan = [
    "HTML5 & CSS3", 
    "JavaScript Dasar", 
    "Desain UI/UX", 
    "Kerja Tim", 
    "Problem Solving",
    "Pantang Menyerah" // Kamu bisa tambah terus di sini!
];

// 2. Seleksi DOM: Mengambil elemen referensi target
const tempatKemampuan = document.getElementById('daftar-kemampuan');
tempatKemampuan.innerHTML = ""; // Mereset state awal struktur internal HTML

// 3. Iterasi / Perulangan (For Loop)
// Sintaks: for(inisialisasi index; kondisi limitasi; increment)
for (let i = 0; i < dataKemampuan.length; i++) {
    
    // Mengekstrak indeks ke-i dari Array dan mengonstruksinya ke dalam format tag <li>
    // Operator += melakukan konkatenasi (menambahkan) string ke struktur eksisting tanpa menimpa
    tempatKemampuan.innerHTML += \`<li>\${dataKemampuan[i]}</li>\`;
    
}`;


  return (
    <>
      <Headbar
        links={[
          { label: 'Materi JS', href: '/array-perulangan', isActive: true },
        ]}
      />

      <div className="flex pt-[88px] min-h-screen">
        <Sidebar />

        <main className="md:ml-[280px] w-full p-4 md:p-10 bg-canvas relative" style={{ backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">

            {/* Header & Hero Section */}
            <section className="bg-black text-white border-4 border-black p-6 md:p-12 shadow-[8px_8px_0px_rgba(45,212,191,1)] text-center relative overflow-hidden transform rotate-1 hover:rotate-0 transition-transform">
              <div className="absolute top-0 left-0 bg-white text-black font-black px-4 py-1 border-b-4 border-r-4 border-black shadow-neo-sm z-20">
                MODUL 4
              </div>
              <div className="absolute top-2 md:top-4 left-2 md:left-4">
                <span className="material-symbols-outlined text-6xl md:text-[80px] opacity-20 text-white">data_array</span>
              </div>
              <div className="absolute bottom-2 md:bottom-4 right-2 md:right-4">
                <span className="material-symbols-outlined text-6xl md:text-[80px] opacity-20 text-white">all_inclusive</span>
              </div>
              <div className="relative z-10">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tighter uppercase mt-6 mb-4 md:mb-6 drop-shadow-[2px_2px_0px_rgba(255,255,255,0.2)]">
                  Array & Perulangan
                </h1>
                <p className="text-base md:text-xl font-bold text-black bg-jade-vibrant inline-block px-4 py-2 md:px-6 md:py-3 border-4 border-black mb-6 md:mb-8 shadow-neo-md uppercase tracking-tight">
                  Otomatisasi Manipulasi Data Skala Besar dengan Komputasi Iteratif
                </p>
                <div>
                  <button
                    onClick={() => setIsStarted(!isStarted)}
                    className="bg-white text-black font-black text-lg md:text-2xl px-6 py-4 md:px-10 md:py-5 border-4 border-black shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] md:shadow-[10px_10px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] md:hover:shadow-[14px_14px_0px_0px_rgba(255,255,255,1)] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all uppercase tracking-widest cursor-pointer"
                  >
                    {isStarted ? "MEMULAI MODUL ARRAY & PERULANGAN..." : "MULAI BELAJAR SEKARANG"}
                  </button>
                </div>
              </div>
            </section>

            {/* Section 1: Teori Dasar */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-mint-soft text-black w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">1</span>
                Otomatisasi Pengolahan Data
              </h2>

              <p className="text-lg md:text-xl font-bold text-forest-teal leading-relaxed mb-8 bg-mint-canvas p-6 border-4 border-black shadow-neo-sm">
                Mendeklarasikan elemen tag <code className="bg-white text-black px-1 border-2 border-black">&lt;li&gt;</code> di struktur HTML secara repetitif untuk komputasi skala besar sangat tidak efisien (hardcoding). Pendekatan <em>engineering</em> yang optimal mendelegasikan beban tersebut pada eksekusi <strong>JavaScript</strong> yang dinamis melalui integrasi <strong>Array</strong> dan metode iteratif <strong>For Loop</strong>.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Array */}
                <div className="bg-pine-deep text-white border-4 border-black p-6 shadow-[6px_6px_0px_rgba(45,212,191,1)] hover:-translate-y-2 transition-transform flex flex-col relative">
                  <div className="absolute top-4 right-4 text-jade-vibrant opacity-30">
                    <span className="material-symbols-outlined text-7xl">data_array</span>
                  </div>
                  <h3 className="text-2xl font-black uppercase mb-3 tracking-widest text-mint-soft z-10 border-b-2 border-mint-soft pb-2 inline-block self-start">Array</h3>
                  <p className="text-sm font-black mb-2 uppercase tracking-wider text-gray-300 z-10">Struktur Koleksi Data</p>
                  <p className="text-base font-bold z-10 leading-relaxed text-gray-100">
                    Sebuah primitif variabel tunggal hanya dapat menampung satu representasi data. Berbeda dengan <strong>Array</strong>, yang dirancang sebagai objek terstruktur untuk mengumpulkan, mengorganisasi, dan menyimpan multiple-data dalam satu referensi memori. Array ditandai dengan sintaks <em>bracket</em> <code className="bg-white text-black px-1">{"[ ]"}</code>.
                  </p>
                  <div className="mt-4 bg-black p-4 border-2 border-white z-10">
                    <p className="text-jade-vibrant font-black uppercase text-sm mb-1 flex items-center gap-1"><span className="material-symbols-outlined text-base">warning</span> ATURAN EMAS:</p>
                    <p className="font-bold text-sm text-gray-300">Perhitungan kalkulasi urutan (<em>Zero-based Indexing</em>) selalu diinisiasi dari representasi angka <strong>NOL (0)</strong>!</p>
                  </div>
                </div>

                {/* Perulangan */}
                <div className="bg-jade-vibrant text-black border-4 border-black p-6 shadow-[6px_6px_0px_rgba(255,255,255,1)] hover:-translate-y-2 transition-transform flex flex-col relative">
                  <div className="absolute top-4 right-4 text-black opacity-20">
                    <span className="material-symbols-outlined text-7xl">all_inclusive</span>
                  </div>
                  <h3 className="text-2xl font-black uppercase mb-3 tracking-widest text-black z-10 border-b-2 border-black pb-2 inline-block self-start">For Loop</h3>
                  <p className="text-sm font-black mb-2 uppercase tracking-wider text-forest-teal z-10">Algoritma Iteratif (Looping)</p>
                  <p className="text-base font-bold z-10 leading-relaxed text-gray-900">
                    Sebuah algoritma kontrol alur perulangan. Alih-alih mereduplikasi baris kode secara manual (redundansi statis), mesin kompilator JavaScript akan mengeksekusi iterasi pada blok kode spesifik secara konstan dan berulang hingga parameter limitasi terminasinya (<em>condition state</em>) mencapai status <em>false</em>.
                  </p>
                  <div className="mt-4 z-10 border-l-4 border-black pl-3 py-1">
                    <p className="font-bold italic text-sm text-gray-800">for(let i = 0; i &lt; 100; i++) // Menginisialisasi index 0, eksekusi jika index kurang dari 100, increment per putaran.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Praktik Array & Perulangan */}
            <section className="bg-canvas border-4 border-black shadow-neo-xl p-6 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-pine-deep rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"></div>
              
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter relative z-10">
                <span className="bg-jade-vibrant text-black w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">2</span>
                Implementasi: Render Koleksi List Dinamis
              </h2>

              <div className="bg-white border-4 border-black p-6 md:p-8 mb-10 shadow-neo-md relative z-10">
                <p className="text-xl font-bold text-forest-teal mb-4 uppercase tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined text-jade-vibrant text-3xl">build</span> Tujuan Implementasi:
                </p>
                <p className="text-lg font-bold leading-relaxed">
                  Kita akan merekonstruksi modul <em>list</em> di dalam hirarki HTML <strong>tanpa</strong> mendefinisikan <em>hardcode</em> tag <code className="bg-gray-200 px-1 border border-black">&lt;li&gt;</code>. Kita cukup mereservasi <em>parent container</em> <code className="bg-gray-200 px-1 border border-black">&lt;ul&gt;</code>, lalu mengonfigurasi mesin iterasi <strong>For Loop</strong> untuk merender dan menginjeksikan data <strong>Array</strong> secara otomatis.
                </p>
                <p className="text-lg font-bold leading-relaxed mt-4 bg-mint-canvas p-4 border-l-4 border-black">
                  Silakan salin instruksi dari ketiga bahasa secara komprehensif ke <em>workspace</em> Anda guna menganalisis fungsionalitas otomatisasi dom-injection pada <em>browser engine</em>.
                </p>
              </div>

              <div className="space-y-12 relative z-10">
                
                {/* HTML Block */}
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
                                    navigator.clipboard.writeText(htmlCode);
                                    setIsCopiedHtml(true);
                                    setTimeout(() => setIsCopiedHtml(false), 2000);
                                }}
                                className="bg-mint-soft text-black px-3 py-2 md:px-4 text-sm md:text-base font-black uppercase tracking-widest border-2 border-white hover:-translate-y-1 hover:shadow-neo-sm transition-all flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-xl">
                                    {isCopiedHtml ? 'check' : 'content_copy'}
                                </span>
                                {isCopiedHtml ? 'Tersalin!' : 'Copy'}
                            </button>
                        </div>
                    </div>
                    <div className="border-4 border-black shadow-neo-lg bg-black transition-all relative">
                        <CodeBlock language="html" code={htmlCode} />
                    </div>
                </div>

                {/* CSS Block */}
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
                                    navigator.clipboard.writeText(cssCode);
                                    setIsCopiedCss(true);
                                    setTimeout(() => setIsCopiedCss(false), 2000);
                                }}
                                className="bg-white text-black px-3 py-2 md:px-4 text-sm md:text-base font-black uppercase tracking-widest border-2 border-black hover:-translate-y-1 hover:shadow-[4px_4px_0px_rgba(255,255,255,1)] transition-all flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-xl">
                                    {isCopiedCss ? 'check' : 'content_copy'}
                                </span>
                                {isCopiedCss ? 'Tersalin!' : 'Copy'}
                            </button>
                        </div>
                    </div>
                    <div className="border-4 border-black shadow-[6px_6px_0px_rgba(255,255,255,1)] bg-black transition-all relative">
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

                <div className="bg-white text-black border-4 border-black p-6 md:p-8 shadow-[4px_4px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row gap-6 items-center">
                  <span className="material-symbols-outlined text-[60px] md:text-[80px] text-jade-vibrant">auto_awesome</span>
                  <div>
                    <h4 className="text-2xl font-black uppercase mb-2 tracking-widest">Analisis Operator Penugasan (+=)</h4>
                    <p className="text-lg font-bold leading-relaxed">
                      Dalam sintaks JavaScript, parameter <code>+=</code> <em>(Addition Assignment)</em> pada variabel modifikasi <code>innerHTML</code> menginstruksikan sistem melakukan proses append (menambahkan entri di posisi terakhir). Apabila dieksekusi dengan operator substitusi murni <code>=</code>, setiap siklus iterasi akan <strong>menghapus dan menimpa <em>(overwrite)</em></strong> struktur data sebelumnya. Hal ini akan menyebabkan hanya iterasi data final yang akan divisualisasikan oleh render DOM!
                    </p>
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
                Lanjut ke Modul 5 <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}

"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import CodeBlock from '@/components/CodeBlock';

export default function ResponsiveDesignPage() {
  return (
    <>
      <Headbar
        links={[
          { label: 'Materi', href: '/responsive-design', isActive: true },
          { label: 'Soal Teori', href: '/responsive-design/soal', isActive: false }
        ]}
      />

      <div className="flex pt-[88px] min-h-screen">
        <Sidebar />

        <main className="md:ml-[280px] w-full p-4 md:p-10 bg-canvas relative" style={{ backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">

            <section className="bg-white border-4 border-black p-6 md:p-12 shadow-neo-xl text-center relative overflow-hidden transform rotate-1 hover:rotate-0 transition-transform">
              <div className="absolute top-0 left-0 bg-jade-vibrant text-white font-black px-4 py-1 border-b-4 border-r-4 border-black shadow-neo-sm z-20">
                MATERI 15
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-black tracking-tighter uppercase mt-6 mb-4 md:mb-6">
                Variabel & Responsif
              </h1>
              <p className="text-base md:text-xl font-bold text-white bg-forest-teal inline-block px-4 py-2 md:px-6 md:py-3 border-4 border-black mb-4 md:mb-6 shadow-neo-md uppercase tracking-tight">
                Pendekatan fundamental dalam mengelola proyek berskala besar dan memastikan antarmuka adaptif di berbagai perangkat.
              </p>
            </section>

            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12">
              
              {/* CSS Variables */}
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="material-symbols-outlined text-4xl md:text-5xl text-white bg-pine-deep p-2 border-4 border-black shadow-neo-sm flex-shrink-0">data_object</span>
                CSS Variables
              </h2>

              <div className="flex flex-col xl:flex-row gap-8 lg:gap-10 mb-16 items-stretch">
                <div className="xl:w-1/2 space-y-8">
                  <p className="font-bold text-forest-teal text-lg md:text-xl leading-relaxed bg-mint-canvas p-4 border-4 border-black shadow-neo-sm">
                    Dalam proyek skala besar, nilai seperti kode warna (hex) digunakan berulang kali. Mengganti nilai tersebut satu per satu secara manual sangat tidak efisien dan rentan terhadap kesalahan (*human error*).
                  </p>
                  
                  <div className="bg-jade-vibrant text-white border-4 border-black p-6 shadow-neo-md relative hover:-translate-y-2 hover:shadow-neo-lg transition-transform">
                    <span className="material-symbols-outlined absolute -top-4 -right-4 text-4xl bg-black text-mint-soft rounded-full border-4 border-black p-1">lightbulb</span>
                    <h3 className="font-black text-2xl mb-3 uppercase tracking-tight drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">Variabel CSS (Custom Properties)</h3>
                    <p className="font-bold text-lg leading-relaxed">Dengan mendeklarasikan Variabel CSS (umumnya pada pseudo-class <code className="bg-white text-black px-2 py-1 font-black shadow-[2px_2px_0px_rgba(0,0,0,1)] mt-1 inline-block">:root</code>), Anda mendefinisikan <em>single source of truth</em>. Mengubah nilai pada variabel sentral tersebut akan secara otomatis merefleksikan perubahan ke seluruh elemen yang memanggilnya.</p>
                  </div>

                  <ul className="space-y-6">
                    <li className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-canvas border-4 border-black p-4 shadow-neo-sm hover:translate-x-2 transition-transform">
                      <span className="bg-black text-white px-3 py-1 border-4 border-white shadow-[2px_2px_0px_rgba(0,0,0,1)] font-black text-xl uppercase tracking-widest flex-shrink-0">--nama</span>
                      <div>
                        <p className="font-bold text-forest-teal text-base">Deklarasi variabel selalu diawali dengan dua tanda hubung. Contoh: <code className="bg-white text-black px-1 font-black uppercase tracking-widest">--warna-utama</code></p>
                      </div>
                    </li>
                    <li className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-canvas border-4 border-black p-4 shadow-neo-sm hover:translate-x-2 transition-transform">
                      <span className="bg-black text-white px-3 py-1 border-4 border-white shadow-[2px_2px_0px_rgba(0,0,0,1)] font-black text-xl uppercase tracking-widest flex-shrink-0">var()</span>
                      <div>
                        <p className="font-bold text-forest-teal text-base">Gunakan fungsi <code className="bg-white text-black px-1 font-black tracking-widest">var(--nama-variabel)</code> untuk memanggil nilai variabel tersebut ke dalam properti CSS.</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="xl:w-1/2 w-full flex flex-col bg-black border-4 border-black p-1 shadow-neo-lg transform -rotate-1 hover:rotate-0 transition-transform">
                   <div className="bg-mint-soft border-b-4 border-black p-3 font-black uppercase text-center text-black">Implementasi Variabel</div>
                  <div className="flex-grow p-1">
                    <CodeBlock 
                      language="css" 
                      code={`/* 1. Deklarasi di akar dokumen */
:root {
  --warna-utama: #3b82f6; 
  --warna-teks: #1e1e1e;
}

/* 2. Panggil di mana saja! */
h1 { 
  color: var(--warna-utama); 
}

button { 
  background-color: var(--warna-utama);
  color: white;
}`} 
                    />
                  </div>
                </div>
              </div>

              {/* Responsive Design & Media Queries */}
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter mt-16">
                <span className="material-symbols-outlined text-4xl md:text-5xl text-white bg-black p-2 border-4 border-black shadow-neo-sm flex-shrink-0">devices</span>
                Responsive Design
              </h2>

              <div className="flex flex-col xl:flex-row gap-8 lg:gap-10 items-stretch">
                <div className="xl:w-1/2 space-y-8">
                  <p className="font-bold text-forest-teal text-lg md:text-xl leading-relaxed">
                    Aksesibilitas antarmuka di berbagai ukuran resolusi layar—mulai dari monitor desktop ultra lebar hingga perangkat seluler—merupakan tantangan utama yang diselesaikan oleh prinsip <strong className="text-black uppercase">Responsive Web Design</strong>.
                  </p>
                  
                  <div className="bg-pine-deep text-white border-4 border-black p-6 shadow-neo-md relative hover:-translate-y-2 hover:shadow-neo-lg transition-transform">
                    <span className="material-symbols-outlined absolute -top-4 -right-4 text-4xl bg-mint-soft rounded-full border-4 border-black p-1 text-black">smartphone</span>
                    <h3 className="font-black text-2xl mb-3 text-mint-soft tracking-widest uppercase">Media Queries</h3>
                    <p className="font-bold text-lg text-white/90">Media Queries <strong className="bg-white text-black px-2 uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)]">@media</strong> memungkinkan penerapan blok kode CSS secara kondisional (bersyarat) berdasarkan kriteria parameter perangkat keras, seperti resolusi lebar maksimum atau minimum *viewport* layar.</p>
                  </div>

                  <div className="bg-canvas border-4 border-black p-6 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-neo-sm transition-transform">
                    <p className="font-black text-sm md:text-base uppercase mb-4 text-black tracking-widest text-center border-b-4 border-black pb-2">🎯 Skenario Implementasi Nyata</p>
                    <p className="font-bold text-forest-teal text-base md:text-lg text-center leading-relaxed">
                      Pada layar beresolusi tinggi, elemen navigasi dirender secara horizontal. Namun pada layar perangkat seluler, navigasi tersebut disembunyikan menggunakan <strong className="bg-white text-black px-1">display: none</strong> untuk mencegah layout terdistorsi, lalu posisinya digantikan oleh komponen <em>Hamburger Menu</em>.
                    </p>
                  </div>
                </div>

                <div className="xl:w-1/2 w-full flex flex-col bg-black border-4 border-black p-1 shadow-neo-lg transform rotate-1 hover:rotate-0 transition-transform">
                  <div className="bg-mint-soft border-b-4 border-black p-3 font-black uppercase text-center text-black">Sintaks Media Query</div>
                  <div className="flex-grow p-1">
                    <CodeBlock 
                      language="css" 
                      code={`/* Tampilan Bawaan (Desktop) */
.nav-links { 
  display: flex; 
  gap: 20px;
}

/* Penyesuaian untuk Layar Seluler */
/* Blok ini dieksekusi bila resolusi viewport <= 768px */
@media (max-width: 768px) {
  
  .nav-links {
    /* Menyembunyikan menu horizontal */
    /* Untuk menjaga integritas tata letak di layar sempit */
    display: none; 
  }
  
}`} 
                    />
                  </div>
                </div>
              </div>

              {/* Desktop First vs Mobile First */}
              <div className="bg-canvas text-black border-4 border-black p-6 md:p-12 shadow-neo-xl relative mt-16 flex flex-col xl:flex-row-reverse gap-10 items-stretch transform -rotate-1 hover:rotate-0 transition-transform">
                <div className="xl:w-1/2 space-y-8">
                  <h3 className="text-2xl md:text-4xl font-black uppercase flex items-center gap-3 tracking-tighter text-black">
                    <span className="material-symbols-outlined text-4xl md:text-5xl bg-white p-2 border-4 border-black shadow-neo-sm">mobile_friendly</span>
                    Mobile-First Approach
                  </h3>
                  <p className="font-bold text-lg md:text-xl text-forest-teal leading-relaxed">
                    Terdapat dua pola pendekatan arsitektur utama dalam mendesain responsivitas web: <strong className="text-black uppercase">Desktop-First</strong> dan <strong className="text-jade-vibrant uppercase underline decoration-2">Mobile-First</strong>.
                  </p>
                  <ul className="space-y-6">
                    <li className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white border-4 border-black p-4 shadow-neo-sm hover:translate-x-2 transition-transform">
                      <span className="bg-canvas p-2 border-4 border-black text-2xl flex-shrink-0">💻</span>
                      <div>
                        <strong className="block text-xl uppercase font-black text-black tracking-widest mb-1">Desktop First (max-width)</strong>
                        <p className="font-bold text-forest-teal text-base">Menuliskan gaya dasar (default) untuk layar beresolusi besar (PC), kemudian menggunakan media query kondisional <code className="bg-mint-canvas px-1 font-black text-black border-2 border-black">max-width</code> untuk memangkas dan menyesuaikan tata letak pada layar seluler.</p>
                      </div>
                    </li>
                    <li className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white border-4 border-black p-4 shadow-neo-sm hover:translate-x-2 transition-transform">
                      <span className="bg-canvas p-2 border-4 border-black text-2xl flex-shrink-0">📱</span>
                      <div>
                        <strong className="block text-xl uppercase font-black text-black tracking-widest mb-1">Mobile First (min-width)</strong>
                        <p className="font-bold text-forest-teal text-base">Menuliskan gaya dasar (default) untuk antarmuka seluler terlebih dahulu, kemudian secara progresif menggunakan media query kondisional <code className="bg-mint-canvas px-1 font-black text-black border-2 border-black">min-width</code> untuk menyempurnakan tata letak pada layar besar. <strong className="text-jade-vibrant uppercase">Ini merupakan standar arsitektur industri modern.</strong></p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="xl:w-1/2 w-full flex flex-col bg-black border-4 border-black p-1 shadow-neo-md">
                   <div className="bg-mint-soft border-b-4 border-black p-3 font-black uppercase text-center text-black">Perbedaan Pendekatan CSS</div>
                  <div className="flex-grow p-1">
                    <CodeBlock 
                      language="css" 
                      code={`/* ❌ PENDEKATAN DESKTOP-FIRST (Legacy) */
/* Mengandalkan max-width */
.kotak { width: 1000px; } /* Default PC */

@media (max-width: 768px) {
  /* Gaya ditimpa bila viewport lebih sempit */
  .kotak { width: 100%; } 
}


/* ✅ PENDEKATAN MOBILE-FIRST (Direkomendasikan) */
/* Mengandalkan min-width */
.kotak { width: 100%; } /* Default HP */

@media (min-width: 768px) {
  /* Tata letak ditingkatkan (progressive) bila viewport lebih lebar */
  .kotak { width: 1000px; } 
}`} 
                    />
                  </div>
                </div>
              </div>

              {/* Calc Function */}
              <div className="bg-jade-vibrant border-4 border-black p-6 md:p-12 shadow-neo-xl mt-16 flex flex-col xl:flex-row gap-10 items-stretch text-white transform rotate-1 hover:rotate-0 transition-transform">
                <div className="xl:w-1/2 space-y-8">
                  <h3 className="text-2xl md:text-4xl font-black uppercase flex items-center gap-3 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] text-white">
                    <span className="material-symbols-outlined text-4xl md:text-5xl bg-black text-white p-2 rounded-none border-4 border-white shadow-[2px_2px_0px_rgba(255,255,255,1)]">calculate</span>
                    Fungsi Kalkulasi: calc()
                  </h3>
                  <p className="font-bold text-lg md:text-xl leading-relaxed bg-black p-4 border-4 border-white shadow-[4px_4px_0px_rgba(255,255,255,1)] text-white">
                    CSS memiliki kemampuan kalkulasi bawaan yang memungkinkan eksekusi perhitungan matematis dinamis langsung di dalam properti gaya melalui fungsi <code className="bg-white text-black px-2 py-1 uppercase tracking-widest font-black">calc()</code>. Fungsionalitas algoritmik ini sangat bermanfaat ketika dipadukan dengan Variabel CSS.
                  </p>
                  <div className="font-bold text-black text-base md:text-lg leading-relaxed mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white p-4 border-4 border-black shadow-neo-sm hover:-translate-y-1 transition-transform">
                    <span className="material-symbols-outlined text-5xl text-jade-vibrant drop-shadow-[1px_1px_0px_rgba(0,0,0,1)]">info</span>
                    <p><strong className="uppercase tracking-widest text-xl block mb-1">Contoh Kasus:</strong> Merancang area tinggi utama (Hero Section) agar memenuhi tepat sisa ketinggian layar (<code>100vh</code>), setelah dikurangi dimensi statis komponen Navbar (misalnya <code>80px</code>) guna menghindari resiko kemunculan efek <em>scroll</em> berlebih. Persamaannya ditulis sebagai: <code>calc(100vh - 80px)</code>.</p>
                  </div>
                </div>
                <div className="xl:w-1/2 w-full flex flex-col bg-black border-4 border-black p-1 shadow-neo-md">
                   <div className="bg-mint-soft border-b-4 border-black p-3 font-black uppercase text-center text-black">Matematika Dalam CSS</div>
                  <div className="flex-grow p-1">
                    <CodeBlock 
                      language="css" 
                      code={`/* KALKULASI DIMENSI DINAMIS */
.hero-section {
  /* Ketinggian viewport (100vh) dikurangi dimensi absolut header */
  /* Sintaksis mengharuskan adanya whitespace (spasi) pada operator */
  height: calc(100vh - 80px);
}

/* Integrasi Fleksibel Bersama Variabel CSS */
:root {
  --lebar-sidebar: 280px;
}

.konten-utama {
  /* Lebar maksimum (100%) dikurangi dimensi konstan panel sidebar */
  width: calc(100% - var(--lebar-sidebar));
}`} 
                    />
                  </div>
                </div>
              </div>

            </section>

            {/* Footer / Penutup */}
            <footer className="bg-pine-deep border-4 border-black p-8 md:p-12 shadow-neo-xl text-center relative hover:-translate-y-1 transition-transform">
              <span className="material-symbols-outlined absolute -top-4 -right-4 md:-top-6 md:-right-6 text-5xl md:text-6xl text-white bg-jade-vibrant rounded-none border-4 border-black p-3 shadow-neo-md hover:scale-110 transition-transform cursor-pointer">verified</span>
              <p className="text-2xl md:text-4xl font-black text-white uppercase leading-relaxed max-w-4xl mx-auto drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] tracking-tight">
                "Penguasaan atas metodologi Variabel CSS dan arsitektur kondisional Media Query (Mobile-First) merupakan syarat mutlak dalam standarisasi pengembangan UI frontend industri."
              </p>
            </footer>

            <div className="mt-16 mb-8 flex flex-col md:flex-row justify-between items-center gap-4 border-t-4 border-black pt-8">
              <p className="font-black text-sm md:text-base uppercase tracking-widest text-forest-teal bg-white border-4 border-black px-4 py-2 shadow-neo-sm text-center md:text-left">
                © 2026 FARHAN YUDHA PRATAMA
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

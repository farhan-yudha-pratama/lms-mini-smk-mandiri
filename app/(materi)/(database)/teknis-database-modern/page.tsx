"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import { useState } from 'react';

export default function TeknisDatabasePage() {
  const [isExplored, setIsExplored] = useState(false);

  return (
    <>
      <Headbar
        links={[
          { label: 'Materi', href: '/teknis-database-modern', isActive: true },
          { label: 'Kuis Singkat', href: '/teknis-database-modern/kuis', isActive: false }
        ]}
      />

      <div className="flex pt-[88px] min-h-screen">
        <Sidebar />

        <main className="md:ml-[280px] w-full p-4 md:p-10 bg-canvas relative" style={{ backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">

            {/* Header & Hero Section */}
            <section className="bg-pine-deep border-4 border-black p-6 md:p-12 shadow-neo-xl text-center relative overflow-hidden text-white">
              <div className="absolute top-0 left-0 bg-white text-black font-black px-4 py-1 border-b-4 border-r-4 border-black shadow-neo-sm z-20 uppercase">
                Database 02
              </div>
              <div className="absolute -bottom-10 -left-10 z-0">
                <span className="material-symbols-outlined text-[150px] md:text-[250px] text-white opacity-10 transform -rotate-12">storage</span>
              </div>
              
              <div className="relative z-10 pt-8">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tighter uppercase mb-4 md:mb-6 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  Mengenal Jenis-Jenis <br className="hidden md:block" /> Database Modern
                </h1>
                <p className="text-base md:text-xl font-bold text-black bg-mint-soft inline-block px-4 py-2 md:px-6 md:py-3 border-4 border-black mb-8 md:mb-10 shadow-neo-md uppercase tracking-tight">
                  Mulai dari SQL, NoSQL, hingga Database AI.
                </p>
                <div>
                  <button
                    onClick={() => setIsExplored(!isExplored)}
                    className="bg-white text-black font-black text-xl md:text-3xl px-8 py-5 md:px-12 md:py-6 border-4 border-black shadow-neo-lg hover:-translate-y-2 hover:-translate-x-2 hover:shadow-neo-xl active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all uppercase tracking-widest flex items-center gap-4 mx-auto"
                  >
                    {isExplored ? (
                      <><span>Memuat Lingkungan...</span> <span className="material-symbols-outlined font-black text-4xl animate-spin">radar</span></>
                    ) : (
                      <><span>Inisialisasi Analisis</span> <span className="material-symbols-outlined font-black text-4xl">travel_explore</span></>
                    )}
                  </button>
                </div>
              </div>
            </section>

            {/* Section 1: Evolusi Penyimpanan */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-forest-teal text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">01</span>
                Perkembangan Tempat Penyimpanan Data
              </h2>

              <p className="text-lg md:text-xl font-bold text-forest-teal mb-8">
                Seiring berjalannya waktu, cara kita menyimpan data terus berkembang menjadi lebih baik, aman, dan canggih:
              </p>

              <div className="flex flex-col md:flex-row gap-6 items-stretch">
                {/* Era 1 */}
                <div className="flex-1 bg-canvas border-4 border-black p-6 shadow-neo-md hover:-translate-y-2 hover:shadow-neo-lg transition-transform group flex flex-col">
                  <div className="w-16 h-16 bg-white border-4 border-black flex items-center justify-center rounded-none mb-4 shadow-neo-sm group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-4xl text-black font-black">description</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-black uppercase mb-3">1. File-Based</h3>
                  <div className="mt-auto">
                    <span className="bg-black text-white text-xs font-black uppercase px-2 py-1 mb-2 inline-block">Sistem Terdahulu</span>
                    <p className="text-base font-bold text-forest-teal">Menyimpan data secara manual di dalam file teks (seperti file Excel/CSV). Cara ini tidak aman, rawan terhapus, dan macet jika dibuka oleh banyak orang sekaligus.</p>
                  </div>
                </div>

                {/* Era 2 */}
                <div className="flex-1 bg-mint-soft border-4 border-black p-6 shadow-neo-md hover:-translate-y-2 hover:shadow-neo-lg transition-transform group flex flex-col transform md:-translate-y-4">
                  <div className="w-16 h-16 bg-forest-teal border-4 border-black flex items-center justify-center rounded-none mb-4 shadow-neo-sm group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-4xl text-white font-black">dns</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-black uppercase mb-3">2. Server-Based</h3>
                  <div className="mt-auto">
                    <span className="bg-black text-white text-xs font-black uppercase px-2 py-1 mb-2 inline-block">Standar Industri</span>
                    <p className="text-base font-bold text-forest-teal">Data disimpan secara terpusat di satu komputer <em>server</em> yang kuat. Sistem ini memakai program khusus agar data lebih rapi, aman, dan bebas macet.</p>
                  </div>
                </div>

                {/* Era 3 */}
                <div className="flex-1 bg-jade-vibrant border-4 border-black p-6 shadow-neo-md hover:-translate-y-2 hover:shadow-neo-lg transition-transform group flex flex-col">
                  <div className="w-16 h-16 bg-white border-4 border-black flex items-center justify-center rounded-none mb-4 shadow-neo-sm group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-4xl text-black font-black">cloud</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-white uppercase mb-3 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">3. Cloud-Based</h3>
                  <div className="mt-auto">
                    <span className="bg-white text-black text-xs font-black uppercase px-2 py-1 mb-2 inline-block">Gaya Modern</span>
                    <p className="text-base font-bold text-white">Menyimpan data di <em>server</em> internet (seperti Google Cloud atau AWS). Perusahaan cukup sewa layanannya, dan <em>server</em> bisa diperbesar otomatis jika pengunjung meledak.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: SQL vs NoSQL */}
            <section className="bg-canvas border-4 border-black shadow-neo-xl p-6 md:p-12 rotate-1 hover:rotate-0 transition-transform">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-black text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">02</span>
                Perbandingan: SQL vs NoSQL
              </h2>

              <div className="flex flex-col lg:flex-row gap-0 border-4 border-black shadow-neo-lg">
                {/* SQL Side */}
                <div className="flex-1 bg-white p-8 border-b-4 lg:border-b-0 lg:border-r-4 border-black">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-forest-teal">SQL</h3>
                    <span className="bg-jade-vibrant text-white font-black uppercase px-3 py-1 border-2 border-black rotate-3">Tabel (Relational)</span>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-jade-vibrant font-black">table</span>
                      <p className="font-bold text-lg text-black">Menyimpan data dengan bentuk <strong>tabel yang ketat dan rapi</strong> (punya baris dan kolom yang pasti).</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-jade-vibrant font-black">schema</span>
                      <p className="font-bold text-lg text-black"><strong>Aturannya sangat kaku.</strong> Jika kolom meminta 'Angka', maka kamu sama sekali tidak bisa memasukkan huruf.</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-jade-vibrant font-black">account_tree</span>
                      <p className="font-bold text-lg text-black">Sangat cocok untuk data <strong>transaksi keuangan</strong>, seperti sistem perbankan atau aplikasi kasir minimarket.</p>
                    </li>
                  </ul>
                  <div className="mt-8 pt-6 border-t-4 border-black border-dashed">
                    <p className="text-sm font-black uppercase text-gray-500 mb-2">Contoh Populer:</p>
                    <div className="flex gap-2">
                      <span className="bg-mint-soft text-black px-3 py-1 border-2 border-black font-bold">MySQL</span>
                      <span className="bg-mint-soft text-black px-3 py-1 border-2 border-black font-bold">PostgreSQL</span>
                    </div>
                  </div>
                </div>

                {/* VS Badge */}
                <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-black text-white font-black text-2xl border-4 border-white items-center justify-center z-10 rotate-12 shadow-neo-md">
                  VS
                </div>

                {/* NoSQL Side */}
                <div className="flex-1 bg-pine-deep p-8 text-white">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white">NoSQL</h3>
                    <span className="bg-black text-white font-black uppercase px-3 py-1 border-2 border-white -rotate-3">Bebas (Non-Relational)</span>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-mint-soft font-black">data_object</span>
                      <p className="font-bold text-lg text-white">Menyimpan data dalam bentuk <strong>dokumen / file</strong> (seperti format JSON) tanpa menggunakan tabel.</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-mint-soft font-black">shape_line</span>
                      <p className="font-bold text-lg text-white"><strong>Aturannya sangat bebas.</strong> Setiap data boleh punya isian (kolom) yang berbeda-beda sesuka hati.</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-mint-soft font-black">speed</span>
                      <p className="font-bold text-lg text-white">Sangat cocok untuk menyimpan <strong>data yang sangat besar</strong> (Big Data) seperti catatan aktivitas (<em>log</em>) media sosial.</p>
                    </li>
                  </ul>
                  <div className="mt-8 pt-6 border-t-4 border-white border-dashed">
                    <p className="text-sm font-black uppercase text-gray-300 mb-2">Contoh Populer:</p>
                    <div className="flex gap-2">
                      <span className="bg-white text-black px-3 py-1 border-2 border-black font-bold">MongoDB</span>
                      <span className="bg-white text-black px-3 py-1 border-2 border-black font-bold">Firebase</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Era Modern AI */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-mint-soft text-black w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">03</span>
                Jenis Database Khusus (Modern)
              </h2>

              <p className="text-lg md:text-xl font-bold text-forest-teal mb-8">
                Selain tabel (SQL) dan dokumen (NoSQL), di era modern saat ini juga ada jenis database yang dibuat khusus untuk menyelesaikan tugas-tugas canggih tertentu:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border-4 border-black p-6 bg-canvas hover:bg-mint-soft transition-colors group">
                  <span className="material-symbols-outlined text-5xl text-black mb-4 group-hover:animate-spin">memory</span>
                  <h3 className="text-xl font-black uppercase mb-2">In-Memory DB</h3>
                  <p className="font-bold text-black text-sm">Menyimpan data sementara di dalam memori RAM agar bisa dibaca dengan kecepatan sangat tinggi. Biasanya dipakai untuk fitur keranjang belanja atau <em>high-score</em> di *game*.</p>
                  <p className="text-xs font-black bg-white border-2 border-black px-2 py-1 inline-block mt-4">Contoh: Redis</p>
                </div>

                <div className="border-4 border-black p-6 bg-canvas hover:bg-jade-vibrant hover:text-white transition-colors group">
                  <span className="material-symbols-outlined text-5xl text-black group-hover:text-white mb-4 group-hover:-translate-y-2 transition-transform">monitoring</span>
                  <h3 className="text-xl font-black uppercase mb-2">Time-Series DB</h3>
                  <p className="font-bold text-black group-hover:text-white text-sm">Sangat jago mencatat data yang berubah terus setiap menit/detik. Contohnya grafik harga saham, suhu cuaca dari sensor, atau pantauan mesin pintar (IoT).</p>
                  <p className="text-xs font-black bg-white text-black border-2 border-black px-2 py-1 inline-block mt-4">Contoh: InfluxDB</p>
                </div>

                <div className="border-4 border-black p-6 bg-canvas hover:bg-black hover:text-white transition-colors group">
                  <span className="material-symbols-outlined text-5xl text-black group-hover:text-mint-soft mb-4 group-hover:scale-110 transition-transform">smart_toy</span>
                  <h3 className="text-xl font-black uppercase mb-2">Vector Database</h3>
                  <p className="font-bold text-black group-hover:text-white text-sm">Database super pintar yang digunakan di era <em>Artificial Intelligence</em> (AI). Dirancang agar mesin seperti ChatGPT bisa "memahami makna" kalimat layaknya manusia.</p>
                  <p className="text-xs font-black bg-white text-black border-2 border-black px-2 py-1 inline-block mt-4">Contoh: Pinecone</p>
                </div>
              </div>

              {/* Callout Info */}
              <div className="mt-10 bg-[#FFD700] border-4 border-black p-6 flex flex-col md:flex-row items-center gap-6 text-black shadow-neo-md -rotate-1 hover:rotate-0 transition-transform">
                <span className="material-symbols-outlined text-6xl text-black animate-pulse">tips_and_updates</span>
                <div className="text-center md:text-left">
                  <h4 className="font-black text-2xl uppercase mb-2">Yang Paling Wajib Dipelajari: SQL</h4>
                  <p className="font-bold text-black text-lg">Meskipun banyak pilihan canggih, menguasai <strong>SQL (Tabel)</strong> adalah pondasi wajib yang selalu ditanyakan saat melamar pekerjaan di dunia IT. Jangan melompat ke materi AI sebelum paham tabel!</p>
                </div>
              </div>
            </section>
            
            {/* Footer Nav */}
            <div className="flex justify-between items-center pt-8">
              <a href="/konsep-database" className="bg-canvas text-black font-black uppercase text-sm md:text-lg px-4 py-3 md:px-6 md:py-4 border-4 border-black shadow-neo-md hover:-translate-y-1 hover:-translate-x-1 hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2">
                <span className="material-symbols-outlined font-black">arrow_back</span> Kembali
              </a>
              <a href="/erd-database" className="bg-white text-black font-black uppercase text-sm md:text-lg px-4 py-3 md:px-6 md:py-4 border-4 border-black shadow-neo-md hover:-translate-y-1 hover:-translate-x-1 hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2">
                Lanjut ke: Merancang ERD <span className="material-symbols-outlined font-black">arrow_forward</span>
              </a>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}

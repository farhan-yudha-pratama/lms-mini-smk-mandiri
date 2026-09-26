"use client";

import Link from 'next/link';
import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import QuizTrigger from '@/components/quiz-engine/QuizTrigger';

export default function LocalhostXamppPage() {
  return (
    <>
      <Headbar
        links={[
          { label: 'Materi', href: '/localhost-pengenalan-xampp', isActive: true },
        ]}
      />

      <div className="flex pt-[88px] min-h-screen">
        <Sidebar />

        <main className="md:ml-[280px] w-full p-4 md:p-10 bg-canvas relative" style={{ backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div className="max-w-5xl mx-auto font-sans">
            {/* Hero Section */}
            <section className="mb-12 border-4 border-black bg-white shadow-[8px_8px_0px_0px_#000] p-6 md:p-12 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-jade-vibrant text-white font-black uppercase tracking-tight border-4 border-black px-4 py-2 rotate-3 shadow-[4px_4px_0px_0px_#000]">
                Materi Pokok 4
              </div>

              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-black mb-6 mt-8">
                Localhost <span className="text-pine-deep">& XAMPP</span>
              </h1>

              <p className="text-lg md:text-xl font-bold text-black max-w-4xl leading-relaxed border-l-8 border-pine-deep pl-6 bg-mint-canvas p-4 border-4 border-black shadow-[4px_4px_0px_0px_#000]">
                Untuk melakukan pengembangan dan pengujian sistem berbasis PHP dan MySQL, <em>deployment</em> ke server produksi aktual (<em>production environment</em>) tidak diperlukan. Lingkungan pengembangan dapat disimulasikan secara mandiri (<em>local environment</em>) menggunakan bundel <em>software</em> infrastruktur server terintegrasi seperti <strong>XAMPP</strong>.
              </p>
            </section>

            {/* Grid: XAMPP & Localhost */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12">

              {/* XAMPP Breakdown */}
              <div className="border-4 border-black bg-[#FF8C00] text-black shadow-[8px_8px_0px_0px_#000] p-6 md:p-8 hover:-translate-y-2 transition-transform duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-white text-black p-3 border-4 border-black shadow-[4px_4px_0px_0px_#000]">
                    <span className="material-symbols-outlined text-4xl">extension</span>
                  </div>
                  <h2 className="text-3xl font-black uppercase tracking-tight text-white">Terminologi XAMPP</h2>
                </div>

                <p className="font-bold text-lg mb-6 bg-white p-4 border-4 border-black shadow-[4px_4px_0px_0px_#000]">
                  XAMPP merupakan tumpukan <em>software</em> (<em>solution stack</em>) terintegrasi yang berfungsi menyediakan <em>environment backend</em> siap pakai. Akronim ini merepresentasikan komponen:
                </p>

                <div className="flex flex-col space-y-3 font-black text-xl uppercase">
                  <div className="flex bg-white border-4 border-black shadow-[4px_4px_0px_0px_#000]">
                    <div className="bg-black text-white w-12 flex items-center justify-center border-r-4 border-black">X</div>
                    <div className="p-3">Cross-Platform <span className="text-xs normal-case block font-bold text-gray-600">(Kompatibilitas lintas OS: Windows, Mac, Linux)</span></div>
                  </div>
                  <div className="flex bg-white border-4 border-black shadow-[4px_4px_0px_0px_#000]">
                    <div className="bg-pine-deep text-white w-12 flex items-center justify-center border-r-4 border-black">A</div>
                    <div className="p-3 text-pine-deep">Apache <span className="text-xs normal-case block font-bold text-gray-600">(Web Server)</span></div>
                  </div>
                  <div className="flex bg-white border-4 border-black shadow-[4px_4px_0px_0px_#000]">
                    <div className="bg-[#4479A1] text-white w-12 flex items-center justify-center border-r-4 border-black">M</div>
                    <div className="p-3 text-[#4479A1]">MySQL / MariaDB <span className="text-xs normal-case block font-bold text-gray-600">(Database)</span></div>
                  </div>
                  <div className="flex bg-white border-4 border-black shadow-[4px_4px_0px_0px_#000]">
                    <div className="bg-[#777BB4] text-white w-12 flex items-center justify-center border-r-4 border-black">P</div>
                    <div className="p-3 text-[#777BB4]">PHP <span className="text-xs normal-case block font-bold text-gray-600">(Bahasa Logika Backend)</span></div>
                  </div>
                  <div className="flex bg-white border-4 border-black shadow-[4px_4px_0px_0px_#000]">
                    <div className="bg-black text-white w-12 flex items-center justify-center border-r-4 border-black">P</div>
                    <div className="p-3 text-black">Perl <span className="text-xs normal-case block font-bold text-gray-600">(Bahasa pemrograman lain)</span></div>
                  </div>
                </div>
              </div>

              {/* Localhost Breakdown */}
              <div className="border-4 border-black bg-pine-deep text-white shadow-[8px_8px_0px_0px_#000] p-6 md:p-8 hover:-translate-y-2 transition-transform duration-300 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-white text-black p-3 border-4 border-black shadow-[4px_4px_0px_0px_#000]">
                      <span className="material-symbols-outlined text-4xl">home</span>
                    </div>
                    <h2 className="text-3xl font-black uppercase tracking-tight text-mint-soft">Terminologi Localhost (Loopback)</h2>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-forest-teal border-4 border-black p-5 shadow-[4px_4px_0px_0px_#000]">
                      <h3 className="font-black text-2xl mb-2 text-jade-vibrant uppercase">127.0.0.1</h3>
                      <p className="font-bold">
                        Secara konseptual, <code>localhost</code> adalah nama <em>host</em> (alias) yang merepresentasikan komputer yang sedang dioperasikan oleh pengguna. Secara teknis, nama ini diresolusi (<em>routing</em>) ke antarmuka jaringan <em>loopback address</em> standar IPv4, yakni <code>127.0.0.1</code>.
                      </p>
                    </div>

                    <div className="bg-white text-black border-4 border-black p-5 shadow-[4px_4px_0px_0px_#000]">
                      <h3 className="font-black text-xl mb-2 uppercase flex items-center gap-2">
                        <span className="material-symbols-outlined">theater_comedy</span> Arsitektur Klien-Server Internal
                      </h3>
                      <p className="font-bold">
                        Melalui inisiasi modul XAMPP, komputer pengguna beroperasi di bawah simulasi arsitektur jaringan <em>Client-Server</em> terpadu:<br /><br />
                        1. Berperan sebagai <strong>Server (Host)</strong> via <em>daemon</em> (seperti Apache/MySQL).<br />
                        2. Berperan ganda sebagai <strong>Klien (Endpoint)</strong> via <em>Web Browser</em>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Aturan Main htdocs */}
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-6 md:p-10 mb-12">
              <h2 className="text-3xl font-black text-black uppercase tracking-tight mb-8 flex items-center gap-4">
                <span className="material-symbols-outlined text-5xl bg-red-600 text-white p-2 border-4 border-black shadow-[4px_4px_0px_0px_#000]">warning</span>
                Struktur Direktori Web Root (htdocs)
              </h2>

              <div className="bg-[#ffdddd] border-l-8 border-red-600 p-6 mb-8 border-y-4 border-r-4 border-black font-bold text-lg text-black">
                Pada <em>environment</em> XAMPP, <em>source code</em> proyek (file <code>.php</code> dsb.) <strong>TIDAK DAPAT</strong> diletakkan di direktori acak pada disk lokal (seperti Desktop). Modul Apache dikonfigurasi secara absolut untuk mengeksekusi layanan <em>serving</em> file hanya dari satu indeks direktori <em>root</em> publik!
              </div>

              <div className="text-center mb-10">
                <p className="font-bold text-black uppercase mb-2">Direktori <em>Document Root</em> tersebut adalah:</p>
                <div className="inline-block bg-black text-white font-mono font-black text-2xl md:text-4xl px-6 py-4 border-4 border-pine-deep shadow-[6px_6px_0px_0px_#2A835F] -rotate-1 hover:rotate-0 transition-transform cursor-crosshair">
                  C:\xampp\htdocs\
                </div>
              </div>

              <h3 className="text-2xl font-black text-black uppercase mb-6">Prosedur Eksekusi Skrip pada Localhost:</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-canvas border-4 border-black p-4 relative pt-8 shadow-[4px_4px_0px_0px_#000]">
                  <div className="absolute -top-3 -left-3 bg-black text-white font-black w-8 h-8 flex items-center justify-center border-2 border-white">1</div>
                  <p className="font-bold text-black">Inisialisasi antarmuka XAMPP Control Panel, lalu eksekusi (<strong>START</strong>) <em>daemon module</em> Apache dan MySQL.</p>
                </div>
                <div className="bg-mint-soft border-4 border-black p-4 relative pt-8 shadow-[4px_4px_0px_0px_#000]">
                  <div className="absolute -top-3 -left-3 bg-black text-white font-black w-8 h-8 flex items-center justify-center border-2 border-white">2</div>
                  <p className="font-bold text-black">Konstruksi sub-direktori <em>project</em> di dalam hierarki <em>Document Root</em>. Contoh: <br /><code className="break-all mt-1 inline-block bg-white px-1 border border-black text-sm">C:\xampp\htdocs\tugas_web</code></p>
                </div>
                <div className="bg-jade-vibrant text-white border-4 border-black p-4 relative pt-8 shadow-[4px_4px_0px_0px_#000]">
                  <div className="absolute -top-3 -left-3 bg-white text-black font-black w-8 h-8 flex items-center justify-center border-2 border-black">3</div>
                  <p className="font-bold">Implementasikan logika <em>source code</em> dan simpan file indeks hierarki dengan nama <code>index.php</code> pada <em>project root</em> tersebut.</p>
                </div>
                <div className="bg-forest-teal text-white border-4 border-black p-4 relative pt-8 shadow-[4px_4px_0px_0px_#000]">
                  <div className="absolute -top-3 -left-3 bg-white text-black font-black w-8 h-8 flex items-center justify-center border-2 border-black">4</div>
                  <p className="font-bold">Inisiasi <em>HTTP Request</em> via peramban klien menggunakan rute <em>endpoint</em> URI: <br /><code className="text-jade-vibrant bg-black px-1 mt-2 inline-block border border-white">localhost/tugas_web/</code></p>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col md:flex-row justify-between gap-6 mt-12">
              <Link
                href="/konsep-port-kode-status-http"
                className="bg-white border-4 border-black py-4 px-6 font-black uppercase tracking-tight text-black flex items-center justify-center gap-3 shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
              >
                <span className="material-symbols-outlined font-black">arrow_back</span>
                Sebelumnya: Port & Status HTTP
              </Link>
              <Link
                href="/"
                className="bg-black border-4 border-black py-4 px-6 font-black uppercase tracking-tight text-white flex items-center justify-center gap-3 shadow-[4px_4px_0px_0px_#8BBB92] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#8BBB92] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
              >
                Selesai! Kembali ke Beranda
                <span className="material-symbols-outlined font-black">home</span>
              </Link>
            </div>

            <QuizTrigger pageSlug="localhost-pengenalan-xampp" />

          </div>
        </main>
      </div>
    </>
  );
}

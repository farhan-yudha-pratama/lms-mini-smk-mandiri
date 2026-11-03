"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import CodeBlock from '@/components/CodeBlock';
import QuizTrigger from '@/components/quiz-engine/QuizTrigger';
import Link from 'next/link';

export default function VariabelCppPage() {
  const sampleCode = `void setup() {
  Serial.begin(9600); // Mulai komunikasi serial (1x jalan)
}

void loop() {
  float suhu = 29.5;       // Variabel desimal baca sensor
  bool kipasNyala = true;  // Status relay saklar ON/OFF
  delay(1000);             // Berulang tiap 1 detik
}`;

  return (
    <>
      <Headbar
        links={[
          { label: 'Dashboard', href: '/', isActive: false },
          { label: 'Materi KIK', href: '/course/kik', isActive: false },
          { label: 'Praktek C++', href: '/course/kik/variabel', isActive: true },
        ]}
      />

      {/* LIVE SYSTEM TICKER */}
      <div className="fixed top-[64px] left-0 w-full z-40 bg-[#2A835F] border-b-4 border-black py-1.5 px-3 md:px-4 overflow-hidden select-none">
        <div className="flex items-center gap-4 md:gap-6 whitespace-nowrap text-[11px] md:text-xs font-black uppercase text-white font-mono tracking-wider">
          <span className="flex items-center gap-1.5 md:gap-2">
            <span className="text-[#8BBB92]">■</span> MATERI 04: LOGIKA C++ &amp; VARIABEL
          </span>
          <span className="flex items-center gap-1.5 md:gap-2">
            <span className="text-white">●</span> KIK &amp; IOT KELAS 10
          </span>
          <span className="flex items-center gap-1.5 md:gap-2 bg-black text-[#8BBB92] px-2 py-0.5 border border-black shadow-[2px_2px_0px_0px_#000]">
            ★ STRUKTUR SETUP, LOOP &amp; TIPE DATA
          </span>
          <span className="flex items-center gap-1.5 md:gap-2">
            <span className="text-[#8BBB92]">▲</span> SMK MANDIRI
          </span>
        </div>
      </div>

      <div
        className="flex pt-[104px] min-h-screen bg-[#EAF4ED] text-black font-sans"
        style={{
          backgroundImage: 'radial-gradient(#000000 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      >
        <Sidebar courseSlug="kik" />

        <main className="md:ml-[280px] w-full p-4 sm:p-6 md:p-8 relative">
          <div className="max-w-5xl mx-auto space-y-8 md:space-y-10">

            {/* ============================================================== */}
            {/* BLOK 1: HERO PUNCHY BANNER */}
            {/* ============================================================== */}
            <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-6 sm:p-8 relative overflow-hidden">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-[#092328] text-white text-xs font-black uppercase px-2.5 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                      MATERI 04 • KIK &amp; IOT
                    </span>
                    <span className="bg-[#8BBB92] text-black text-xs font-black uppercase px-2.5 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                      DURASI 3 MENIT BACA
                    </span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-black leading-tight">
                    Logika C++ &amp; <span className="bg-[#8BBB92] px-2 border-4 border-black inline-block shadow-[4px_4px_0px_0px_#000] transform -rotate-1">Variabel IoT</span>
                  </h1>

                  <p className="text-sm sm:text-base md:text-lg font-bold text-gray-800 leading-snug">
                    Menanamkan instruksi logika ke mikrokontroler agar perangkat IoT tahu kapan harus membaca sensor dan menyalakan aktuator.
                  </p>
                </div>

                {/* Rotated Emblem Box */}
                <div className="w-28 h-28 sm:w-36 sm:h-36 bg-[#092328] border-4 border-black shadow-[6px_6px_0px_0px_#000] transform -rotate-2 hover:rotate-0 transition-transform duration-200 flex flex-col items-center justify-center text-center p-3 shrink-0 self-center lg:self-auto">
                  <span className="bg-[#8BBB92] text-black font-black text-[10px] sm:text-xs uppercase px-2 py-0.5 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                    KODING IOT
                  </span>
                  <span className="material-symbols-outlined text-4xl sm:text-5xl text-[#8BBB92] my-1">
                    code_blocks
                  </span>
                  <span className="text-[10px] font-mono font-black text-white uppercase tracking-wider">
                    C++ EMBEDDED
                  </span>
                </div>
              </div>
            </section>

            {/* ============================================================== */}
            {/* BLOK 2: ANALOGI 1 DETIK */}
            {/* ============================================================== */}
            <section className="bg-[#8BBB92] border-4 border-black shadow-[6px_6px_0px_0px_#000] p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <span className="text-3xl sm:text-4xl shrink-0">📦</span>
                <div className="space-y-1.5">
                  <h3 className="text-base sm:text-lg font-black uppercase text-black">
                    Analogi 1 Detik: Kotak Berlabel di Rak Komponen Lab
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-black leading-relaxed">
                    <strong>Variabel seperti kotak plastik di lab:</strong> Nama kotak adalah <em>Label</em> (<code>suhuRuangan</code>), ukuran kotak adalah <em>Tipe Data</em> (<code>float</code> untuk angka desimal), dan isinya adalah <em>Nilai Sensor</em> (<code>29.5</code>).<br className="hidden sm:block" />
                    Lupa titik koma (<code>;</code>) ibarat lupa menutup kotak — semua barang tumpah dan compiler menolak bekerja!
                  </p>
                </div>
              </div>
            </section>

            {/* ============================================================== */}
            {/* BLOK 3: 3 ATURAN WAJIB STRUKTUR C++ ARDUINO */}
            {/* ============================================================== */}
            <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-5 sm:p-8 space-y-6">
              <div className="border-b-4 border-black pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="bg-[#092328] text-[#8BBB92] font-mono text-xs font-black uppercase px-2 py-0.5 border border-black inline-block mb-1">
                    ANATOMI KODE
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
                    3 Aturan Pokok Kode C++ IoT
                  </h2>
                </div>
                <span className="bg-[#2A835F] text-white text-xs font-black uppercase px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] self-start sm:self-auto">
                  Sintaks Dasar
                </span>
              </div>

              {/* Cuplikan Kode Kompak */}
              <div className="border-4 border-black shadow-[4px_4px_0px_0px_#000]">
                <div className="bg-black text-white px-3 py-1.5 font-mono text-xs font-black uppercase flex items-center justify-between border-b-2 border-black">
                  <span>Struktur_Standar_IoT.ino</span>
                  <span className="text-[#8BBB92]">Arduino / ESP32</span>
                </div>
                <CodeBlock code={sampleCode} language="cpp" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Aturan 1 */}
                <div className="bg-[#EAF4ED] border-4 border-black p-4 space-y-2 shadow-[4px_4px_0px_0px_#000] flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="font-mono text-xs font-black bg-[#092328] text-[#8BBB92] px-2 py-0.5 border border-black inline-block">
                      01 // DUA FUNGSI
                    </span>
                    <h3 className="text-base font-black uppercase text-black">setup() &amp; loop()</h3>
                    <p className="text-xs font-bold text-gray-800 leading-snug">
                      <code>setup()</code> jalan <strong>1x</strong> untuk inisialisasi pin; <code>loop()</code> jalan <strong>berulang terus</strong> membaca sensor.
                    </p>
                  </div>
                </div>

                {/* Aturan 2 */}
                <div className="bg-[#EAF4ED] border-4 border-black p-4 space-y-2 shadow-[4px_4px_0px_0px_#000] flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="font-mono text-xs font-black bg-[#2A835F] text-white px-2 py-0.5 border border-black inline-block">
                      02 // TITIK KOMA
                    </span>
                    <h3 className="text-base font-black uppercase text-black">Wajib Akhiri (;)</h3>
                    <p className="text-xs font-bold text-gray-800 leading-snug">
                      Hampir <strong>90% error pemula</strong> terjadi karena lupa titik koma di akhir setiap baris instruksi.
                    </p>
                  </div>
                </div>

                {/* Aturan 3 */}
                <div className="bg-[#EAF4ED] border-4 border-black p-4 space-y-2 shadow-[4px_4px_0px_0px_#000] flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="font-mono text-xs font-black bg-[#12544F] text-white px-2 py-0.5 border border-black inline-block">
                      03 // KAPITAL
                    </span>
                    <h3 className="text-base font-black uppercase text-black">Case Sensitive</h3>
                    <p className="text-xs font-bold text-gray-800 leading-snug">
                      Huruf besar dan kecil berbeda mutlak. Variabel <code>suhu</code> dan <code>Suhu</code> adalah dua hal yang berbeda.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* ============================================================== */}
            {/* BLOK 4: TABEL TIPE DATA & KOMPARASI ERROR LAPANGAN */}
            {/* ============================================================== */}
            <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-5 sm:p-8 space-y-6">
              <div className="border-b-4 border-black pb-3">
                <span className="bg-[#092328] text-[#8BBB92] font-mono text-xs font-black uppercase px-2 py-0.5 border border-black inline-block mb-1">
                  PANDUAN PRAKTIK
                </span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
                  4 Tipe Data Utama IoT &amp; Perbandingan Kesalahan
                </h2>
              </div>

              {/* Ringkasan Tipe Data */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-[#EAF4ED] border-3 border-black p-3 space-y-1 shadow-[2px_2px_0px_0px_#000]">
                  <span className="font-mono text-xs font-black bg-[#092328] text-[#8BBB92] px-2 py-0.5 inline-block">int</span>
                  <p className="text-xs font-black uppercase">Bilangan Bulat</p>
                  <p className="text-[11px] font-bold text-gray-600">Nomor Pin: <code>13</code></p>
                </div>
                <div className="bg-[#EAF4ED] border-3 border-black p-3 space-y-1 shadow-[2px_2px_0px_0px_#000]">
                  <span className="font-mono text-xs font-black bg-[#2A835F] text-white px-2 py-0.5 inline-block">float</span>
                  <p className="text-xs font-black uppercase">Desimal Sensor</p>
                  <p className="text-[11px] font-bold text-gray-600">Suhu: <code>36.5</code></p>
                </div>
                <div className="bg-[#EAF4ED] border-3 border-black p-3 space-y-1 shadow-[2px_2px_0px_0px_#000]">
                  <span className="font-mono text-xs font-black bg-[#12544F] text-white px-2 py-0.5 inline-block">bool</span>
                  <p className="text-xs font-black uppercase">Kondisi Saklar</p>
                  <p className="text-[11px] font-bold text-gray-600">Status: <code>true/false</code></p>
                </div>
                <div className="bg-[#EAF4ED] border-3 border-black p-3 space-y-1 shadow-[2px_2px_0px_0px_#000]">
                  <span className="font-mono text-xs font-black bg-black text-white px-2 py-0.5 inline-block">String</span>
                  <p className="text-xs font-black uppercase">Teks Pesan</p>
                  <p className="text-[11px] font-bold text-gray-600">Notif: <code>&quot;Awas Api!&quot;</code></p>
                </div>
              </div>

              {/* Tabel Head-to-Head */}
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-black uppercase text-black">
                  Perbandingan: Programmer Pemula vs Standar Teknisi IoT
                </h3>
                <div className="overflow-x-auto border-4 border-black shadow-[4px_4px_0px_0px_#000]">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm font-bold min-w-[500px]">
                    <thead>
                      <tr className="bg-[#092328] text-white border-b-3 border-black font-black uppercase">
                        <th className="p-3 border-r-2 border-black w-1/4">Parameter</th>
                        <th className="p-3 border-r-2 border-black w-3/8 text-gray-300">Kebiasaan Salah (Pemula)</th>
                        <th className="p-3 bg-[#2A835F] text-white w-3/8">Standar Benar (Teknisi IoT)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-black bg-[#FAF8F5]">
                      <tr>
                        <td className="p-3 font-black bg-white border-r-2 border-black uppercase text-gray-700">1. Penamaan Variabel</td>
                        <td className="p-3 border-r-2 border-black text-gray-600">Pakai satu huruf tanpa arti: <code>int x;</code> atau diawali angka: <code>int 1pin;</code> ❌</td>
                        <td className="p-3 font-black text-black bg-[#EAF4ED]">Deskriptif &amp; berformat camelCase: <code>int pinRelay;</code> ✔️</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-black bg-white border-r-2 border-black uppercase text-gray-700">2. Pemilihan Tipe Data</td>
                        <td className="p-3 border-r-2 border-black text-gray-600">Simpan suhu desimal di <code>int</code> sehingga angka koma terpotong hilang.</td>
                        <td className="p-3 font-black text-black bg-[#EAF4ED]">Gunakan <code>float</code> agar akurasi sensor suhu tidak meleset.</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-black bg-white border-r-2 border-black uppercase text-gray-700">3. Menghadapi Error</td>
                        <td className="p-3 border-r-2 border-black text-gray-600">Panik dan menghapus seluruh kodingan dari awal.</td>
                        <td className="p-3 font-black text-black bg-[#EAF4ED]">Cek nomor baris di pesan compiler untuk menambahkan <code>;</code> yang tertinggal.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* ============================================================== */}
            {/* BLOK 5: RANGKUMAN 3 BENTO & EVALUASI KUIS */}
            {/* ============================================================== */}
            <section className="space-y-6">
              {/* 3-Card Bento Takeaway */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#12544F] text-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_#000]">
                  <span className="bg-[#8BBB92] text-black font-black text-[11px] uppercase px-2 py-0.5 border border-black inline-block mb-2">
                    INGAT 01
                  </span>
                  <p className="text-xs sm:text-sm font-bold leading-snug">
                    <code>setup()</code> jalan 1x saat alat dinyalakan; <code>loop()</code> berulang terus membaca sensor.
                  </p>
                </div>

                <div className="bg-[#2A835F] text-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_#000]">
                  <span className="bg-[#092328] text-white font-black text-[11px] uppercase px-2 py-0.5 border border-black inline-block mb-2">
                    INGAT 02
                  </span>
                  <p className="text-xs sm:text-sm font-bold leading-snug">
                    Setiap baris instruksi <strong>wajib diakhiri titik koma (;)</strong> agar compiler tidak error.
                  </p>
                </div>

                <div className="bg-white text-black border-4 border-black p-4 shadow-[4px_4px_0px_0px_#000]">
                  <span className="bg-[#8BBB92] text-black font-black text-[11px] uppercase px-2 py-0.5 border border-black inline-block mb-2">
                    INGAT 03
                  </span>
                  <p className="text-xs sm:text-sm font-bold leading-snug">
                    Pilih tipe data yang tepat: <code>int</code> (pin), <code>float</code> (sensor), dan <code>bool</code> (relay).
                  </p>
                </div>
              </div>

              {/* Callout Kuis Evaluasi */}
              <div className="bg-[#092328] border-4 border-black shadow-[6px_6px_0px_0px_#000] p-6 text-white text-center space-y-2">
                <div className="inline-block bg-[#8BBB92] text-black font-black text-xs uppercase px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                  EVALUASI PEMBELAJARAN
                </div>
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
                  Uji Pemahaman: Sintaks, Variabel &amp; Tipe Data C++
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 font-bold max-w-lg mx-auto leading-relaxed">
                  Uji pemahaman sintaks dasar dan tipe data C++ kamu melalui kuis evaluasi resmi di bawah ini!
                </p>
              </div>

              {/* Quiz Trigger */}
              <QuizTrigger pageSlug="variabel" />
            </section>

            {/* ============================================================== */}
            {/* TACTILE NAVIGATION & FOOTER */}
            {/* ============================================================== */}
            <nav className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t-4 border-black">
              <Link
                href="/course/kik/apa-itu-iot"
                className="w-full sm:w-auto bg-white text-black font-black uppercase text-xs sm:text-sm px-6 py-3.5 border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                <span>Materi Sebelumnya: Apa Itu IoT?</span>
              </Link>

              <Link
                href="/course/kik/percabangan"
                className="w-full sm:w-auto bg-[#2A835F] text-white font-black uppercase text-xs sm:text-sm px-6 py-3.5 border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer ml-auto"
              >
                <span>Materi Berikutnya: Percabangan C++</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </Link>
            </nav>

            <div className="flex flex-col sm:flex-row justify-between items-center text-[11px] font-mono font-black uppercase tracking-wider text-black border-t-4 border-black pt-4 pb-8 gap-2">
              <span>MATA PELAJARAN: KIK &amp; IOT - PRAKTIK C++</span>
              <span>SMK MANDIRI © 2026 • STANDAR TACTILE NEO BRUTALISM</span>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}

"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import CodeBlock from '@/components/CodeBlock';
import QuizTrigger from '@/components/quiz-engine/QuizTrigger';
import Link from 'next/link';

export default function LoopingCppPage() {
  const sampleLoop = `void setup() {
  Serial.begin(9600);

  // Nyalakan LED Chaser 5 kali berurutan
  for (int i = 1; i <= 5; i++) {
    Serial.print("Putaran LED ke-");
    Serial.println(i);
    delay(200);
  }
}

void loop() {
  // void loop() adalah Infinite Loop bawaan Arduino!
}`;

  return (
    <>
      <Headbar
        links={[
          { label: 'Dashboard', href: '/', isActive: false },
          { label: 'Materi KIK', href: '/course/kik', isActive: false },
          { label: 'Looping C++', href: '/course/kik/looping', isActive: true },
        ]}
      />

      {/* LIVE SYSTEM TICKER */}
      <div className="fixed top-[64px] left-0 w-full z-40 bg-[#2A835F] border-b-4 border-black py-1.5 px-3 md:px-4 overflow-hidden select-none">
        <div className="flex items-center gap-4 md:gap-6 whitespace-nowrap text-[11px] md:text-xs font-black uppercase text-white font-mono tracking-wider">
          <span className="flex items-center gap-1.5"><span className="text-[#8BBB92]">■</span> MATERI 06: LOOPING C++</span>
          <span className="flex items-center gap-1.5"><span className="text-white">●</span> KIK &amp; IOT KELAS 10</span>
          <span className="flex items-center gap-1.5 bg-black text-[#8BBB92] px-2 py-0.5 border border-black shadow-[2px_2px_0px_0px_#000]">★ OTOMATISASI KODE: FOR, WHILE &amp; DO-WHILE</span>
          <span className="flex items-center gap-1.5"><span className="text-[#8BBB92]">▲</span> SMK MANDIRI</span>
        </div>
      </div>

      <div
        className="flex pt-[104px] min-h-screen bg-[#EAF4ED] text-black font-sans"
        style={{ backgroundImage: 'radial-gradient(#000000 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      >
        <Sidebar courseSlug="kik" />

        <main className="md:ml-[280px] w-full p-4 sm:p-6 md:p-8 relative">
          <div className="max-w-5xl mx-auto space-y-8 md:space-y-10">

            {/* BLOK 1: HERO PUNCHY BANNER */}
            <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-6 sm:p-8 relative overflow-hidden">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-[#092328] text-white text-xs font-black uppercase px-2.5 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000]">MATERI 06 • KIK &amp; IOT</span>
                    <span className="bg-[#8BBB92] text-black text-xs font-black uppercase px-2.5 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000]">DURASI 3 MENIT BACA</span>
                  </div>
                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-black leading-tight">
                    Menguasai Looping: <span className="bg-[#8BBB92] px-2 border-4 border-black inline-block shadow-[4px_4px_0px_0px_#000] transform -rotate-1">Otomatisasi C++</span>
                  </h1>
                  <p className="text-sm sm:text-base md:text-lg font-bold text-gray-800 leading-snug">
                    Tulis perintah sekali, biarkan mikrokontroler mengeksekusi ribuan iterasi: running LED lab, scanning 40 PC, hingga monitoring sensor tanpa henti.
                  </p>
                </div>

                <div className="w-28 h-28 sm:w-36 sm:h-36 bg-[#092328] border-4 border-black shadow-[6px_6px_0px_0px_#000] transform -rotate-2 hover:rotate-0 transition-transform duration-200 flex flex-col items-center justify-center text-center p-3 shrink-0 self-center lg:self-auto">
                  <span className="bg-[#8BBB92] text-black font-black text-[10px] sm:text-xs uppercase px-2 py-0.5 border-2 border-black shadow-[2px_2px_0px_0px_#000]">KONTROL</span>
                  <span className="material-symbols-outlined text-4xl sm:text-5xl text-[#8BBB92] my-1">repeat</span>
                  <span className="text-[10px] font-mono font-black text-white uppercase tracking-wider">LOOPING</span>
                </div>
              </div>
            </section>

            {/* BLOK 2: ANALOGI 1 DETIK & 3 PILAR LOOP */}
            <section className="bg-[#8BBB92] border-4 border-black shadow-[6px_6px_0px_0px_#000] p-5 sm:p-6 space-y-4">
              <div className="flex items-start gap-4">
                <span className="text-3xl sm:text-4xl shrink-0">⚡</span>
                <div className="space-y-1.5">
                  <h3 className="text-base sm:text-lg font-black uppercase text-black">Analogi 1 Detik: Hukuman Papan Tulis vs Looping Komputer</h3>
                  <p className="text-xs sm:text-sm font-bold text-black leading-relaxed">
                    Menulis 1.000x kalimat hukuman di papan tulis bikin tangan keram dan lelah berjam-jam. Di pemrograman, kamu cukup tulis 3 baris kode <strong>Looping</strong>, dan komputer mengeksekusinya dalam hitungan milidetik!
                  </p>
                </div>
              </div>

              {/* 3 Pilar Anatomi Loop */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t-2 border-black text-xs font-bold text-black">
                <div className="bg-white border-2 border-black p-2.5 shadow-[2px_2px_0px_0px_#000]">
                  <span className="bg-[#092328] text-[#8BBB92] px-1.5 py-0.5 font-mono text-[10px] uppercase font-black">1. AWAL</span>
                  <p className="mt-1 font-mono font-black">int i = 0;</p>
                  <p className="text-[11px] text-gray-700">Titik start putaran dimulai.</p>
                </div>
                <div className="bg-white border-2 border-black p-2.5 shadow-[2px_2px_0px_0px_#000]">
                  <span className="bg-[#2A835F] text-white px-1.5 py-0.5 font-mono text-[10px] uppercase font-black">2. SYARAT</span>
                  <p className="mt-1 font-mono font-black">i &lt; 10;</p>
                  <p className="text-[11px] text-gray-700">Loop jalan selama bernilai TRUE.</p>
                </div>
                <div className="bg-white border-2 border-black p-2.5 shadow-[2px_2px_0px_0px_#000]">
                  <span className="bg-[#12544F] text-white px-1.5 py-0.5 font-mono text-[10px] uppercase font-black">3. PENGUBAH</span>
                  <p className="mt-1 font-mono font-black">i++</p>
                  <p className="text-[11px] text-gray-700">Langkah agar batas tercapai.</p>
                </div>
              </div>
            </section>

            {/* BLOK 3: 3 SENJATA PERULANGAN C++ */}
            <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-5 sm:p-8 space-y-6">
              <div className="border-b-4 border-black pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="bg-[#092328] text-[#8BBB92] font-mono text-xs font-black uppercase px-2 py-0.5 border border-black inline-block mb-1">STRUKTUR ITERASI</span>
                  <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">3 Senjata Perulangan C++</h2>
                </div>
                <span className="bg-[#2A835F] text-white text-xs font-black uppercase px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] self-start sm:self-auto">Sintaks C++</span>
              </div>

              {/* Cuplikan Kode Kompak */}
              <div className="border-4 border-black shadow-[4px_4px_0px_0px_#000]">
                <div className="bg-black text-white px-3 py-1.5 font-mono text-xs font-black uppercase flex items-center justify-between border-b-2 border-black">
                  <span>Looping_Arduino.ino</span>
                  <span className="text-[#8BBB92]">for (awal; batas; langkah) &#123; &#125;</span>
                </div>
                <CodeBlock code={sampleLoop} language="cpp" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. FOR LOOP */}
                <div className="bg-[#EAF4ED] border-4 border-black p-4 space-y-2 shadow-[4px_4px_0px_0px_#000] flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="font-mono text-xs font-black bg-[#092328] text-[#8BBB92] px-2 py-0.5 border border-black inline-block">01 // BATAS PASTI</span>
                    <h3 className="text-base font-black uppercase text-black">For Loop</h3>
                    <p className="text-xs font-bold text-gray-800 leading-snug">Dipakai saat jumlah putaran sudah diketahui pasti (cth: kedip 5 LED, baca 10 data array).</p>
                  </div>
                  <div className="bg-white border-2 border-black p-2 font-mono text-[11px] font-bold text-black shadow-[2px_2px_0px_0px_#000]">
                    <code>for (int i=0; i&lt;5; i++) &#123;...&#125;</code>
                  </div>
                </div>

                {/* 2. WHILE LOOP */}
                <div className="bg-[#EAF4ED] border-4 border-black p-4 space-y-2 shadow-[4px_4px_0px_0px_#000] flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="font-mono text-xs font-black bg-[#2A835F] text-white px-2 py-0.5 border border-black inline-block">02 // KONDISI DINAMIS</span>
                    <h3 className="text-base font-black uppercase text-black">While Loop</h3>
                    <p className="text-xs font-bold text-gray-800 leading-snug">Cek kondisi dulu sebelum aksi. Cocok untuk menunggu input sensor/suhu sampai titik stabil.</p>
                  </div>
                  <div className="bg-white border-2 border-black p-2 font-mono text-[11px] font-bold text-black shadow-[2px_2px_0px_0px_#000]">
                    <code>while (suhu &lt; 30) &#123; panas(); &#125;</code>
                  </div>
                </div>

                {/* 3. DO-WHILE LOOP */}
                <div className="bg-[#EAF4ED] border-4 border-black p-4 space-y-2 shadow-[4px_4px_0px_0px_#000] flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="font-mono text-xs font-black bg-[#12544F] text-white px-2 py-0.5 border border-black inline-block">03 // MINIMAL 1X</span>
                    <h3 className="text-base font-black uppercase text-black">Do - While</h3>
                    <p className="text-xs font-bold text-gray-800 leading-snug">Jalankan aksi minimal 1 kali dulu, evaluasi kondisi baru dilakukan di akhir kurung kurawal.</p>
                  </div>
                  <div className="bg-white border-2 border-black p-2 font-mono text-[11px] font-bold text-black shadow-[2px_2px_0px_0px_#000]">
                    <code>do &#123; baca(); &#125; while (error);</code>
                  </div>
                </div>
              </div>
            </section>

            {/* BLOK 4: KONTROL LANJUTAN & CEGAH KIAMAT KODE */}
            <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-5 sm:p-8 space-y-6">
              <div className="border-b-4 border-black pb-3">
                <span className="bg-[#092328] text-[#8BBB92] font-mono text-xs font-black uppercase px-2 py-0.5 border border-black inline-block mb-1">KONTROL &amp; KEAMANAN</span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">Break, Continue &amp; Cegah Infinite Loop</h2>
              </div>

              {/* 2 Senjata Rem Darurat */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border-3 border-black p-4 bg-[#FAF8F5]">
                  <span className="bg-black text-[#8BBB92] font-mono text-xs font-black px-2 py-0.5 uppercase">🛑 Keyword BREAK;</span>
                  <p className="text-xs font-bold text-gray-800 mt-2 leading-relaxed">
                    Memaksa <strong>keluar dan menghentikan total</strong> perulangan seketika tanpa menunggu syarat batas selesai (cth: tombol darurat ditekan saat loop berjalan).
                  </p>
                </div>
                <div className="border-3 border-black p-4 bg-[#FAF8F5]">
                  <span className="bg-black text-white font-mono text-xs font-black px-2 py-0.5 uppercase">⏭️ Keyword CONTINUE;</span>
                  <p className="text-xs font-bold text-gray-800 mt-2 leading-relaxed">
                    <strong>Melewati (skip) sisa baris kode</strong> pada putaran aktif saat ini, dan langsung melompat ke awal putaran nomor berikutnya.
                  </p>
                </div>
              </div>

              {/* Tabel Head-to-Head Karakteristik Perulangan */}
              <div className="overflow-x-auto border-4 border-black shadow-[4px_4px_0px_0px_#000]">
                <table className="w-full text-left border-collapse text-xs sm:text-sm font-bold min-w-[500px]">
                  <thead>
                    <tr className="bg-[#092328] text-white border-b-3 border-black font-black uppercase">
                      <th className="p-3 border-r-2 border-black w-1/4">Tipe Loop</th>
                      <th className="p-3 border-r-2 border-black w-3/8 text-gray-300">Pengecekan Syarat</th>
                      <th className="p-3 bg-[#2A835F] text-white w-3/8">Risiko Infinite Loop</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-black bg-[#FAF8F5]">
                    <tr>
                      <td className="p-3 font-black bg-white border-r-2 border-black uppercase text-gray-700">For Loop</td>
                      <td className="p-3 border-r-2 border-black text-gray-700">Di awal; batas dan kenaikan <code>i++</code> rapi dalam 1 baris.</td>
                      <td className="p-3 font-black text-black bg-[#EAF4ED]">Rendah (karena modifier tercatat jelas di header).</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-black bg-white border-r-2 border-black uppercase text-gray-700">While Loop</td>
                      <td className="p-3 border-r-2 border-black text-gray-700">Di awal; jika kondisi awal FALSE, kode tidak jalan sama sekali.</td>
                      <td className="p-3 font-black text-black bg-[#EAF4ED]">Tinggi bila lupa menambah variabel pengubah di badan kode.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-black bg-white border-r-2 border-black uppercase text-gray-700">Do-While</td>
                      <td className="p-3 border-r-2 border-black text-gray-700">Di akhir; kode terjamin dieksekusi minimal 1 kali.</td>
                      <td className="p-3 font-black text-black bg-[#EAF4ED]">Tinggi jika kondisi berhenti tidak pernah tercapai.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* BLOK 5: RANGKUMAN 3 BENTO & EVALUASI KUIS */}
            <section className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#12544F] text-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_#000]">
                  <span className="bg-[#8BBB92] text-black font-black text-[11px] uppercase px-2 py-0.5 border border-black inline-block mb-2">INGAT 01</span>
                  <p className="text-xs sm:text-sm font-bold leading-snug">
                    Setiap loop wajib punya 3 pilar: <strong>Inisialisasi</strong>, <strong>Syarat Batas</strong>, dan <strong>Modifier (i++)</strong>.
                  </p>
                </div>

                <div className="bg-[#2A835F] text-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_#000]">
                  <span className="bg-[#092328] text-white font-black text-[11px] uppercase px-2 py-0.5 border border-black inline-block mb-2">INGAT 02</span>
                  <p className="text-xs sm:text-sm font-bold leading-snug">
                    Gunakan <code>for</code> saat jumlah putaran pasti; gunakan <code>while</code> saat menunggu perubahan status sensor.
                  </p>
                </div>

                <div className="bg-white text-black border-4 border-black p-4 shadow-[4px_4px_0px_0px_#000]">
                  <span className="bg-[#8BBB92] text-black font-black text-[11px] uppercase px-2 py-0.5 border border-black inline-block mb-2">INGAT 03</span>
                  <p className="text-xs sm:text-sm font-bold leading-snug">
                    Gunakan keyword <code>break;</code> untuk rem darurat, dan pastikan nilai modifier tidak menimbulkan infinite loop.
                  </p>
                </div>
              </div>

              {/* Callout Kuis Evaluasi */}
              <div className="bg-[#092328] border-4 border-black shadow-[6px_6px_0px_0px_#000] p-6 text-white text-center space-y-2">
                <div className="inline-block bg-[#8BBB92] text-black font-black text-xs uppercase px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000]">EVALUASI PEMBELAJARAN</div>
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">Uji Pemahaman: Looping C++</h3>
                <p className="text-xs sm:text-sm text-gray-300 font-bold max-w-lg mx-auto leading-relaxed">
                  Buktikan kemampuanmu mengotomatisasi kode dan mencegah kiamat infinite loop melalui kuis evaluasi resmi di bawah ini!
                </p>
              </div>

              {/* Quiz Trigger */}
              <QuizTrigger pageSlug="looping" />
            </section>

            {/* TACTILE NAVIGATION & FOOTER */}
            <nav className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t-4 border-black">
              <Link
                href="/course/kik/percabangan"
                className="w-full sm:w-auto bg-white text-black font-black uppercase text-xs sm:text-sm px-6 py-3.5 border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                <span>Materi Sebelumnya: Percabangan C++</span>
              </Link>

              <Link
                href="/course/kik/fungsi"
                className="w-full sm:w-auto bg-[#2A835F] text-white font-black uppercase text-xs sm:text-sm px-6 py-3.5 border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Materi Berikutnya: Function C++</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </Link>
            </nav>

            <div className="flex flex-col sm:flex-row justify-between items-center text-[11px] font-mono font-black uppercase tracking-wider text-black border-t-4 border-black pt-4 pb-8 gap-2">
              <span>MATA PELAJARAN: KIK &amp; IOT - LOOPING C++</span>
              <span>SMK MANDIRI © 2026 • STANDAR TACTILE NEO BRUTALISM</span>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}

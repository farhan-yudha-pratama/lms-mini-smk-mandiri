"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import CodeBlock from '@/components/CodeBlock';
import QuizTrigger from '@/components/quiz-engine/QuizTrigger';
import Link from 'next/link';

export default function PercabanganCppPage() {
  const sampleIfElse = `void loop() {
  int suhu = 38; // Bacaan sensor suhu lab (°C)

  if (suhu >= 40) {
    Serial.println("STATUS: KRITIS! Kipas MAX + Alarm");
  } else if (suhu >= 30) {
    Serial.println("STATUS: Waspada, Kipas Pelan");
  } else {
    Serial.println("STATUS: Suhu Aman & Normal");
  }
  delay(1000);
}`;

  return (
    <>
      <Headbar
        links={[
          { label: 'Dashboard', href: '/', isActive: false },
          { label: 'Materi KIK', href: '/course/kik', isActive: false },
          { label: 'Percabangan C++', href: '/course/kik/percabangan', isActive: true },
        ]}
      />

      {/* LIVE SYSTEM TICKER */}
      <div className="fixed top-[64px] left-0 w-full z-40 bg-[#2A835F] border-b-4 border-black py-1.5 px-3 md:px-4 overflow-hidden select-none">
        <div className="flex items-center gap-4 md:gap-6 whitespace-nowrap text-[11px] md:text-xs font-black uppercase text-white font-mono tracking-wider">
          <span className="flex items-center gap-1.5"><span className="text-[#8BBB92]">■</span> MATERI 05: LOGIKA PERCABANGAN</span>
          <span className="flex items-center gap-1.5"><span className="text-white">●</span> KIK &amp; IOT KELAS 10</span>
          <span className="flex items-center gap-1.5 bg-black text-[#8BBB92] px-2 py-0.5 border border-black shadow-[2px_2px_0px_0px_#000]">★ LOGIKA KEPUTUSAN: STRUKTUR IF &amp; ELSE</span>
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
                    <span className="bg-[#092328] text-white text-xs font-black uppercase px-2.5 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000]">MATERI 05 • KIK &amp; IOT</span>
                    <span className="bg-[#8BBB92] text-black text-xs font-black uppercase px-2.5 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000]">DURASI 3 MENIT BACA</span>
                  </div>
                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-black leading-tight">
                    Pengambil Keputusan: <span className="bg-[#8BBB92] px-2 border-4 border-black inline-block shadow-[4px_4px_0px_0px_#000] transform -rotate-1">Struktur IF &amp; ELSE</span>
                  </h1>
                  <p className="text-sm sm:text-base md:text-lg font-bold text-gray-800 leading-snug">
                    Ajari komputermu memilih jalurnya sendiri: membaca sensor lab, menyalakan kipas saat server overheat, atau membuka palang otomatis RFID.
                  </p>
                </div>

                <div className="w-28 h-28 sm:w-36 sm:h-36 bg-[#092328] border-4 border-black shadow-[6px_6px_0px_0px_#000] transform -rotate-2 hover:rotate-0 transition-transform duration-200 flex flex-col items-center justify-center text-center p-3 shrink-0 self-center lg:self-auto">
                  <span className="bg-[#8BBB92] text-black font-black text-[10px] sm:text-xs uppercase px-2 py-0.5 border-2 border-black shadow-[2px_2px_0px_0px_#000]">LOGIKA</span>
                  <span className="material-symbols-outlined text-4xl sm:text-5xl text-[#8BBB92] my-1">alt_route</span>
                  <span className="text-[10px] font-mono font-black text-white uppercase tracking-wider">IF-ELSE</span>
                </div>
              </div>
            </section>

            {/* BLOK 2: ANALOGI 1 DETIK */}
            <section className="bg-[#8BBB92] border-4 border-black shadow-[6px_6px_0px_0px_#000] p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <span className="text-3xl sm:text-4xl shrink-0">🚦</span>
                <div className="space-y-1.5">
                  <h3 className="text-base sm:text-lg font-black uppercase text-black">Analogi 1 Detik: Palang Pintu Lab &amp; Kipas Server</h3>
                  <p className="text-xs sm:text-sm font-bold text-black leading-relaxed">
                    <strong>Tanpa Percabangan:</strong> Komputer seperti robot buta yang berjalan lurus menabrak dinding tanpa pertimbangan.<br className="hidden sm:block" />
                    <strong>Dengan Percabangan (IF-ELSE):</strong> Komputer mengecek kondisi: <em>JIKA (IF) kartu RFID terdaftar &rarr; palang dibuka</em>; <em>SELAIN ITU (ELSE) &rarr; buzzer bunyi &apos;Ditolak!&apos;</em>. Komputer hanya mengevaluasi apakah kondisi bernilai <strong>TRUE</strong> atau <strong>FALSE</strong>.
                  </p>
                </div>
              </div>
            </section>

            {/* BLOK 3: 3 KONSTRUKSI IF-ELSE C++ */}
            <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-5 sm:p-8 space-y-6">
              <div className="border-b-4 border-black pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="bg-[#092328] text-[#8BBB92] font-mono text-xs font-black uppercase px-2 py-0.5 border border-black inline-block mb-1">ANATOMI KEPUTUSAN</span>
                  <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">3 Pola Percabangan IF-ELSE</h2>
                </div>
                <span className="bg-[#2A835F] text-white text-xs font-black uppercase px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] self-start sm:self-auto">Sintaks C++</span>
              </div>

              {/* Cuplikan Kode Kompak */}
              <div className="border-4 border-black shadow-[4px_4px_0px_0px_#000]">
                <div className="bg-black text-white px-3 py-1.5 font-mono text-xs font-black uppercase flex items-center justify-between border-b-2 border-black">
                  <span>Kontrol_Suhu_Lab.ino</span>
                  <span className="text-[#8BBB92]">Syarat di () &amp; Aksi di &#123; &#125;</span>
                </div>
                <CodeBlock code={sampleIfElse} language="cpp" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. IF Tunggal */}
                <div className="bg-[#EAF4ED] border-4 border-black p-4 space-y-2 shadow-[4px_4px_0px_0px_#000] flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="font-mono text-xs font-black bg-[#092328] text-[#8BBB92] px-2 py-0.5 border border-black inline-block">01 // SATU PILIHAN</span>
                    <h3 className="text-base font-black uppercase text-black">IF Tunggal</h3>
                    <p className="text-xs font-bold text-gray-800 leading-snug">Hanya bertindak jika syarat benar (TRUE). Jika bernilai FALSE, kode diabaikan begitu saja.</p>
                  </div>
                  <div className="bg-white border-2 border-black p-2 font-mono text-[11px] font-bold text-black shadow-[2px_2px_0px_0px_#000]">
                    <code>if (suhu &gt; 35) &#123; kipasON(); &#125;</code>
                  </div>
                </div>

                {/* 2. IF-ELSE */}
                <div className="bg-[#EAF4ED] border-4 border-black p-4 space-y-2 shadow-[4px_4px_0px_0px_#000] flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="font-mono text-xs font-black bg-[#2A835F] text-white px-2 py-0.5 border border-black inline-block">02 // DUA JALUR</span>
                    <h3 className="text-base font-black uppercase text-black">IF - ELSE</h3>
                    <p className="text-xs font-bold text-gray-800 leading-snug">Memiliki aksi cadangan (ELSE). Jika syarat utama gagal, otomatis mengeksekusi pilihan kedua.</p>
                  </div>
                  <div className="bg-white border-2 border-black p-2 font-mono text-[11px] font-bold text-black shadow-[2px_2px_0px_0px_#000]">
                    <code>if (kartu) &#123; buka(); &#125; else &#123; tolak(); &#125;</code>
                  </div>
                </div>

                {/* 3. IF - ELSE IF - ELSE */}
                <div className="bg-[#EAF4ED] border-4 border-black p-4 space-y-2 shadow-[4px_4px_0px_0px_#000] flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="font-mono text-xs font-black bg-[#12544F] text-white px-2 py-0.5 border border-black inline-block">03 // BERTINGKAT</span>
                    <h3 className="text-base font-black uppercase text-black">IF - ELSE IF</h3>
                    <p className="text-xs font-bold text-gray-800 leading-snug">Menguji rentang nilai bertahap (kritis, waspada, aman) secara berurutan dari atas ke bawah.</p>
                  </div>
                  <div className="bg-white border-2 border-black p-2 font-mono text-[11px] font-bold text-black shadow-[2px_2px_0px_0px_#000]">
                    <code>else if (suhu &gt; 30) &#123; waspada(); &#125;</code>
                  </div>
                </div>
              </div>
            </section>

            {/* BLOK 4: OPERATOR & PANDUAN LOGIKA */}
            <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-5 sm:p-8 space-y-6">
              <div className="border-b-4 border-black pb-3">
                <span className="bg-[#092328] text-[#8BBB92] font-mono text-xs font-black uppercase px-2 py-0.5 border border-black inline-block mb-1">KOMPARASI OPERATOR</span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">Operator Penentu Keputusan C++</h2>
              </div>

              {/* Tabel Operator Pembanding */}
              <div className="overflow-x-auto border-3 border-black">
                <table className="w-full text-left border-collapse text-xs sm:text-sm font-bold min-w-[480px]">
                  <thead>
                    <tr className="bg-[#092328] text-white border-b-2 border-black font-black uppercase">
                      <th className="p-2.5 border-r border-black w-1/4">Operator</th>
                      <th className="p-2.5 border-r border-black w-2/5">Fungsi Lapangan</th>
                      <th className="p-2.5 w-1/3">Contoh C++</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y border-black bg-[#FAF8F5]">
                    <tr>
                      <td className="p-2.5 font-mono font-black border-r border-black">== dan !=</td>
                      <td className="p-2.5 border-r border-black text-gray-700">Memeriksa nilai persis sama / tidak sama</td>
                      <td className="p-2.5 font-mono text-black"><code>if (rfid == &quot;ADMIN&quot;)</code></td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-black border-r border-black">&gt;= dan &lt;=</td>
                      <td className="p-2.5 border-r border-black text-gray-700">Ambang batas batas sensor terukur</td>
                      <td className="p-2.5 font-mono text-black"><code>if (suhu &gt;= 38.5)</code></td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-black border-r border-black">&amp;&amp; (AND)</td>
                      <td className="p-2.5 border-r border-black text-gray-700">Semua syarat WAJIB terpenuhi (TRUE)</td>
                      <td className="p-2.5 font-mono text-black"><code>if (suhu &gt; 35 &amp;&amp; adaAsap)</code></td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-black border-r border-black">|| (OR)</td>
                      <td className="p-2.5 border-r border-black text-gray-700">CUKUP SALAH SATU syarat terpenuhi</td>
                      <td className="p-2.5 font-mono text-black"><code>if (darurat || sensorApi)</code></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Tabel Komparasi Pola IF-ELSE */}
              <div className="overflow-x-auto border-4 border-black shadow-[4px_4px_0px_0px_#000]">
                <table className="w-full text-left border-collapse text-xs sm:text-sm font-bold min-w-[500px]">
                  <thead>
                    <tr className="bg-[#092328] text-white border-b-3 border-black font-black uppercase">
                      <th className="p-3 border-r-2 border-black w-1/4">Bentuk Struktur</th>
                      <th className="p-3 border-r-2 border-black w-3/8 text-gray-300">Kapan Digunakan?</th>
                      <th className="p-3 bg-[#2A835F] text-white w-3/8">Hasil Keputusan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-black bg-[#FAF8F5]">
                    <tr>
                      <td className="p-3 font-black bg-white border-r-2 border-black uppercase text-gray-700">IF Tunggal</td>
                      <td className="p-3 border-r-2 border-black text-gray-700">Hanya perlu aksi saat ada pemicu (misal: tombol alarm ditekan).</td>
                      <td className="p-3 font-black text-black bg-[#EAF4ED]">1 Aksi opsional atau tidak sama sekali.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-black bg-white border-r-2 border-black uppercase text-gray-700">IF - ELSE</td>
                      <td className="p-3 border-r-2 border-black text-gray-700">Dua pilihan saling berlawanan (Benar / Salah, Buka / Tutup).</td>
                      <td className="p-3 font-black text-black bg-[#EAF4ED]">Pasti memilih tepat 1 dari 2 jalur.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-black bg-white border-r-2 border-black uppercase text-gray-700">IF - ELSE IF</td>
                      <td className="p-3 border-r-2 border-black text-gray-700">Rentang skor, level suhu bertingkat, atau multi-kategori status.</td>
                      <td className="p-3 font-black text-black bg-[#EAF4ED]">Mengeksekusi cabang pertama yang cocok.</td>
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
                    Syarat di dalam <code>if (...)</code> selalu dievaluasi menjadi nilai kebenaran <strong>true</strong> atau <strong>false</strong>.
                  </p>
                </div>

                <div className="bg-[#2A835F] text-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_#000]">
                  <span className="bg-[#092328] text-white font-black text-[11px] uppercase px-2 py-0.5 border border-black inline-block mb-2">INGAT 02</span>
                  <p className="text-xs sm:text-sm font-bold leading-snug">
                    Gunakan <code>&amp;&amp;</code> saat semua syarat wajib lolos; gunakan <code>||</code> bila cukup salah satu syarat saja.
                  </p>
                </div>

                <div className="bg-white text-black border-4 border-black p-4 shadow-[4px_4px_0px_0px_#000]">
                  <span className="bg-[#8BBB92] text-black font-black text-[11px] uppercase px-2 py-0.5 border border-black inline-block mb-2">INGAT 03</span>
                  <p className="text-xs sm:text-sm font-bold leading-snug">
                    Pada <code>else if</code> bertingkat, susun syarat dari kondisi paling ketat/kritis di paling atas agar tidak terlewati.
                  </p>
                </div>
              </div>

              {/* Callout Kuis Evaluasi */}
              <div className="bg-[#092328] border-4 border-black shadow-[6px_6px_0px_0px_#000] p-6 text-white text-center space-y-2">
                <div className="inline-block bg-[#8BBB92] text-black font-black text-xs uppercase px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000]">EVALUASI PEMBELAJARAN</div>
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">Uji Pemahaman: Logika Percabangan IF-ELSE</h3>
                <p className="text-xs sm:text-sm text-gray-300 font-bold max-w-lg mx-auto leading-relaxed">
                  Buktikan kemampuan logikamu dalam merancang struktur keputusan IF, ELSE, dan ELSE IF melalui kuis di bawah ini!
                </p>
              </div>

              {/* Quiz Trigger */}
              <QuizTrigger pageSlug="percabangan" />
            </section>

            {/* TACTILE NAVIGATION & FOOTER */}
            <nav className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t-4 border-black">
              <Link
                href="/course/kik/variabel"
                className="w-full sm:w-auto bg-white text-black font-black uppercase text-xs sm:text-sm px-6 py-3.5 border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                <span>Materi Sebelumnya: Variabel C++</span>
              </Link>

              <Link
                href="/course/kik/looping"
                className="w-full sm:w-auto bg-[#2A835F] text-white font-black uppercase text-xs sm:text-sm px-6 py-3.5 border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Materi Berikutnya: Looping C++</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </Link>
            </nav>

            <div className="flex flex-col sm:flex-row justify-between items-center text-[11px] font-mono font-black uppercase tracking-wider text-black border-t-4 border-black pt-4 pb-8 gap-2">
              <span>MATA PELAJARAN: KIK &amp; IOT - PERCABANGAN IF-ELSE C++</span>
              <span>SMK MANDIRI © 2026 • STANDAR TACTILE NEO BRUTALISM</span>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}

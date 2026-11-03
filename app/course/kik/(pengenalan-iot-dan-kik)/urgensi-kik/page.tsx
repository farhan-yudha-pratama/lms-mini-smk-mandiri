"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import QuizTrigger from '@/components/quiz-engine/QuizTrigger';
import Link from 'next/link';

export default function UrgensiKikPage() {
  return (
    <>
      <Headbar
        links={[
          { label: 'Dashboard', href: '/', isActive: false },
          { label: 'Materi KIK', href: '/course/kik', isActive: false },
          { label: 'Urgensi KIK', href: '/course/kik/urgensi-kik', isActive: true },
        ]}
      />

      {/* LIVE SYSTEM TICKER */}
      <div className="fixed top-[64px] left-0 w-full z-40 bg-[#2A835F] border-b-4 border-black py-1.5 px-3 md:px-4 overflow-hidden select-none">
        <div className="flex items-center gap-4 md:gap-6 whitespace-nowrap text-[11px] md:text-xs font-black uppercase text-white font-mono tracking-wider">
          <span className="flex items-center gap-1.5 md:gap-2">
            <span className="text-[#8BBB92]">■</span> MATERI 02: URGENSI KIK
          </span>
          <span className="flex items-center gap-1.5 md:gap-2">
            <span className="text-white">●</span> KIK &amp; IOT KELAS 10
          </span>
          <span className="flex items-center gap-1.5 md:gap-2 bg-black text-[#8BBB92] px-2 py-0.5 border border-black shadow-[2px_2px_0px_0px_#000]">
            ★ MENGAPA IOT WAJIB PUNYA KIK?
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
                      MATERI 02 • KIK &amp; IOT
                    </span>
                    <span className="bg-[#8BBB92] text-black text-xs font-black uppercase px-2.5 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                      DURASI 3 MENIT BACA
                    </span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-black leading-tight">
                    Kenapa Harus <span className="bg-[#8BBB92] px-2 border-4 border-black inline-block shadow-[4px_4px_0px_0px_#000] transform -rotate-1">KIK di Era IoT?</span>
                  </h1>

                  <p className="text-sm sm:text-base md:text-lg font-bold text-gray-800 leading-snug">
                    Skill teknis merakit komponen dan koding tanpa jiwa KIK hanyalah mainan hobi yang berujung berdebu di gudang sekolah.
                  </p>
                </div>

                {/* Rotated Emblem Box */}
                <div className="w-28 h-28 sm:w-36 sm:h-36 bg-[#092328] border-4 border-black shadow-[6px_6px_0px_0px_#000] transform -rotate-2 hover:rotate-0 transition-transform duration-200 flex flex-col items-center justify-center text-center p-3 shrink-0 self-center lg:self-auto">
                  <span className="bg-[#8BBB92] text-black font-black text-[10px] sm:text-xs uppercase px-2 py-0.5 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                    URGENSI
                  </span>
                  <span className="material-symbols-outlined text-4xl sm:text-5xl text-[#8BBB92] my-1">
                    rocket_launch
                  </span>
                  <span className="text-[10px] font-mono font-black text-white uppercase tracking-wider">
                    KIK ERA IOT
                  </span>
                </div>
              </div>
            </section>

            {/* ============================================================== */}
            {/* BLOK 2: ANALOGI 1 DETIK */}
            {/* ============================================================== */}
            <section className="bg-[#8BBB92] border-4 border-black shadow-[6px_6px_0px_0px_#000] p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <span className="text-3xl sm:text-4xl shrink-0">🏎️</span>
                <div className="space-y-1.5">
                  <h3 className="text-base sm:text-lg font-black uppercase text-black">
                    Analogi 1 Detik: Mobil Balap Kencang Tanpa Sopir &amp; Peta
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-black leading-relaxed">
                    <strong>Jago Koding &amp; Rakit Kabel Murni:</strong> Seperti membangun mobil balap bermesin turbo — cepat dan keren secara fisik, tapi diam di garasi karena tidak ada yang tahu harus dibawa ke mana.<br className="hidden sm:block" />
                    <strong>KIK adalah Sopir &amp; Peta:</strong> Menentukan siapa penumpangnya, rute mana yang harus ditempuh, dan bagaimana cara memenangkan hadiah pialanya!
                  </p>
                </div>
              </div>
            </section>

            {/* ============================================================== */}
            {/* BLOK 3: 3 ALASAN UTAMA IOT WAJIB MEMILIKI KIK */}
            {/* ============================================================== */}
            <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-5 sm:p-8 space-y-6">
              <div className="border-b-4 border-black pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="bg-[#092328] text-[#8BBB92] font-mono text-xs font-black uppercase px-2 py-0.5 border border-black inline-block mb-1">
                    TITIK TEMU SKILL
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
                    3 Alasan Krusial Mempelajari KIK
                  </h2>
                </div>
                <span className="bg-[#2A835F] text-white text-xs font-black uppercase px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] self-start sm:self-auto">
                  Nilai Jual Nyata
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
                {/* Alasan 1 */}
                <div className="bg-[#EAF4ED] border-4 border-black p-5 space-y-3 shadow-[4px_4px_0px_0px_#000] flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-black bg-[#092328] text-[#8BBB92] px-2 py-0.5 border border-black">
                        01 // BUKAN SEKADAR HOBI
                      </span>
                      <span className="material-symbols-outlined text-2xl text-[#092328]">
                        precision_manufacturing
                      </span>
                    </div>
                    <h3 className="text-xl font-black uppercase text-black tracking-tight">
                      Solusi Industri
                    </h3>
                    <p className="text-xs sm:text-sm font-bold text-gray-800 leading-snug">
                      Merakit mikrokontroler di lab itu biasa. Tapi merakit alat IoT yang menyelesaikan masalah pabrik/sekolah adalah nilai industri sesungguhnya.
                    </p>
                  </div>
                  <div className="bg-white border-2 border-black p-2.5 text-xs font-bold text-black shadow-[2px_2px_0px_0px_#000]">
                    <span className="font-black text-[#092328] uppercase block mb-0.5">Target:</span>
                    Alat dipakai orang lain, bukan disimpan di rak lab.
                  </div>
                </div>

                {/* Alasan 2 */}
                <div className="bg-[#EAF4ED] border-4 border-black p-5 space-y-3 shadow-[4px_4px_0px_0px_#000] flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-black bg-[#2A835F] text-white px-2 py-0.5 border border-black">
                        02 // DARI KONSUMEN JADI KREATOR
                      </span>
                      <span className="material-symbols-outlined text-2xl text-[#2A835F]">
                        terminal
                      </span>
                    </div>
                    <h3 className="text-xl font-black uppercase text-black tracking-tight">
                      Pembuat Sistem
                    </h3>
                    <p className="text-xs sm:text-sm font-bold text-gray-800 leading-snug">
                      Jangan habiskan masa muda hanya menjadi penikmat TikTok atau game. KIK mengubah anak SMK menjadi kreator yang menciptakan sistem digital.
                    </p>
                  </div>
                  <div className="bg-white border-2 border-black p-2.5 text-xs font-bold text-black shadow-[2px_2px_0px_0px_#000]">
                    <span className="font-black text-[#2A835F] uppercase block mb-0.5">Target:</span>
                    Pindah dari kursi penonton ke kursi pencipta.
                  </div>
                </div>

                {/* Alasan 3 */}
                <div className="bg-[#EAF4ED] border-4 border-black p-5 space-y-3 shadow-[4px_4px_0px_0px_#000] flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-black bg-[#12544F] text-white px-2 py-0.5 border border-black">
                        03 // KEMANDIRIAN FINANSIAL
                      </span>
                      <span className="material-symbols-outlined text-2xl text-[#12544F]">
                        payments
                      </span>
                    </div>
                    <h3 className="text-xl font-black uppercase text-black tracking-tight">
                      Peluang Bisnis
                    </h3>
                    <p className="text-xs sm:text-sm font-bold text-gray-800 leading-snug">
                      Kombinasi IoT dan KIK membuka jalan untuk jasa instalasi jaringan cerdas, servis IoT rumahan, hingga rintisan startup teknologi lokal.
                    </p>
                  </div>
                  <div className="bg-white border-2 border-black p-2.5 text-xs font-bold text-black shadow-[2px_2px_0px_0px_#000]">
                    <span className="font-black text-[#12544F] uppercase block mb-0.5">Target:</span>
                    Menghasilkan uang sebelum lulus sekolah.
                  </div>
                </div>
              </div>
            </section>

            {/* ============================================================== */}
            {/* BLOK 4: KASUS LAPANGAN TKJ & RPL & TABEL HEAD-TO-HEAD */}
            {/* ============================================================== */}
            <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-5 sm:p-8 space-y-6">
              <div className="border-b-4 border-black pb-3">
                <span className="bg-[#092328] text-[#8BBB92] font-mono text-xs font-black uppercase px-2 py-0.5 border border-black inline-block mb-1">
                  KASUS LAPANGAN LAB
                </span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
                  Studi Kasus: Server Lab Komputer Overheat Saat Libur
                </h2>
              </div>

              {/* Box Masalah Singkat */}
              <div className="bg-[#FFF4E5] border-4 border-black p-4 sm:p-5 shadow-[4px_4px_0px_0px_#000] flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-500 text-black border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_#000]">
                  <span className="material-symbols-outlined text-2xl font-black">thermostat</span>
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs sm:text-sm font-black uppercase text-black">Masalah Nyata di Ruang Server Sekolah:</h4>
                  <p className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                    AC ruang server mati mendadak di akhir pekan. Server database ujian sekolah overheat dan mati total karena tidak ada yang tahu.
                  </p>
                </div>
              </div>

              {/* Tabel Head-to-Head */}
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-black uppercase text-black">
                  Perbandingan Solusi: Teknisi Biasa vs Teknisi Inovator KIK
                </h3>
                <div className="overflow-x-auto border-4 border-black shadow-[4px_4px_0px_0px_#000]">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm font-bold min-w-[500px]">
                    <thead>
                      <tr className="bg-[#092328] text-white border-b-3 border-black font-black uppercase">
                        <th className="p-3 border-r-2 border-black w-1/4">Tahapan</th>
                        <th className="p-3 border-r-2 border-black w-3/8 text-gray-300">Teknisi Biasa (Tanpa KIK)</th>
                        <th className="p-3 bg-[#2A835F] text-white w-3/8">Teknisi Inovator KIK (TKJ &amp; RPL)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-black bg-[#FAF8F5]">
                      <tr>
                        <td className="p-3 font-black bg-white border-r-2 border-black uppercase text-gray-700">1. Respon Insiden</td>
                        <td className="p-3 border-r-2 border-black text-gray-600">Baru tahu server mati pada hari Senin saat guru ingin input nilai. Panik dan saling menyalahkan.</td>
                        <td className="p-3 font-black text-black bg-[#EAF4ED]">Peka memasang sensor suhu IoT (DHT22 + ESP32) yang otomatis kirim peringatan ke bot Telegram jika suhu &gt; 30°C. (<em>Kreativitas</em>)</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-black bg-white border-r-2 border-black uppercase text-gray-700">2. Solusi Eksekusi</td>
                        <td className="p-3 border-r-2 border-black text-gray-600">Cuma menyalakan AC kembali secara manual dan berharap server tidak rusak.</td>
                        <td className="p-3 font-black text-black bg-[#EAF4ED]">Merangkai saklar relay IoT yang otomatis menghidupkan kipas cadangan dan mematikan PC non-esensial. (<em>Inovasi</em>)</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-black bg-white border-r-2 border-black uppercase text-gray-700">3. Dampak Finansial</td>
                        <td className="p-3 border-r-2 border-black text-gray-600">Sekolah rugi jutaan rupiah untuk servis hardware server yang rusak akibat panas.</td>
                        <td className="p-3 font-black text-black bg-[#EAF4ED]">Alat dipakai resmi di semua lab, hemat biaya pemeliharaan sekolah, dan siswa dapat komisi proyek. (<em>Kewirausahaan</em>)</td>
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
                    <strong>Hardware + Koding</strong> tanpa KIK hanya akan berakhir menjadi tumpukan barang rongsokan di lab.
                  </p>
                </div>

                <div className="bg-[#2A835F] text-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_#000]">
                  <span className="bg-[#092328] text-white font-black text-[11px] uppercase px-2 py-0.5 border border-black inline-block mb-2">
                    INGAT 02
                  </span>
                  <p className="text-xs sm:text-sm font-bold leading-snug">
                    <strong>IoT + KIK</strong> menghasilkan produk yang memecahkan masalah nyata dan bernilai bisnis tinggi.
                  </p>
                </div>

                <div className="bg-white text-black border-4 border-black p-4 shadow-[4px_4px_0px_0px_#000]">
                  <span className="bg-[#8BBB92] text-black font-black text-[11px] uppercase px-2 py-0.5 border border-black inline-block mb-2">
                    INGAT 03
                  </span>
                  <p className="text-xs sm:text-sm font-bold leading-snug">
                    <strong>Peluang Sukses</strong> dimulai dari kepekaanmu melihat apa yang sering rusak atau lelet di sekitarmu.
                  </p>
                </div>
              </div>

              {/* Callout Kuis Evaluasi */}
              <div className="bg-[#092328] border-4 border-black shadow-[6px_6px_0px_0px_#000] p-6 text-white text-center space-y-2">
                <div className="inline-block bg-[#8BBB92] text-black font-black text-xs uppercase px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                  EVALUASI PEMBELAJARAN
                </div>
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
                  Uji Pemahaman Materi: Urgensi KIK
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 font-bold max-w-lg mx-auto leading-relaxed">
                  Buktikan kamu memahami mengapa keahlian IoT wajib dipadukan dengan KIK melalui kuis interaktif di bawah ini!
                </p>
              </div>

              {/* Quiz Trigger */}
              <QuizTrigger pageSlug="urgensi-kik" />
            </section>

            {/* ============================================================== */}
            {/* TACTILE NAVIGATION & FOOTER */}
            {/* ============================================================== */}
            <nav className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t-4 border-black">
              <Link
                href="/course/kik/apa-itu-kik"
                className="w-full sm:w-auto bg-white text-black font-black uppercase text-xs sm:text-sm px-6 py-3.5 border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                <span>Materi Sebelumnya: Apa Itu KIK?</span>
              </Link>

              <Link
                href="/course/kik/apa-itu-iot"
                className="w-full sm:w-auto bg-[#2A835F] text-white font-black uppercase text-xs sm:text-sm px-6 py-3.5 border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer ml-auto"
              >
                <span>Materi Selanjutnya: Apa Itu IoT?</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </Link>
            </nav>

            <div className="flex flex-col sm:flex-row justify-between items-center text-[11px] font-mono font-black uppercase tracking-wider text-black border-t-4 border-black pt-4 pb-8 gap-2">
              <span>MATA PELAJARAN: KIK &amp; IOT</span>
              <span>SMK MANDIRI © 2026 • STANDAR TACTILE NEO BRUTALISM</span>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}

"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import QuizTrigger from '@/components/quiz-engine/QuizTrigger';
import Link from 'next/link';

export default function ApaItuKikPage() {
  return (
    <>
      <Headbar
        links={[
          { label: 'Dashboard', href: '/', isActive: false },
          { label: 'Materi KIK', href: '/course/kik', isActive: false },
          { label: 'Apa Itu KIK?', href: '/course/kik/apa-itu-kik', isActive: true },
        ]}
      />

      {/* LIVE SYSTEM TICKER */}
      <div className="fixed top-[64px] left-0 w-full z-40 bg-[#2A835F] border-b-4 border-black py-1.5 px-3 md:px-4 overflow-hidden select-none">
        <div className="flex items-center gap-4 md:gap-6 whitespace-nowrap text-[11px] md:text-xs font-black uppercase text-white font-mono tracking-wider">
          <span className="flex items-center gap-1.5 md:gap-2">
            <span className="text-[#8BBB92]">■</span> MATERI 01: APA ITU KIK?
          </span>
          <span className="flex items-center gap-1.5 md:gap-2">
            <span className="text-white">●</span> KIK &amp; IOT KELAS 10
          </span>
          <span className="flex items-center gap-1.5 md:gap-2 bg-black text-[#8BBB92] px-2 py-0.5 border border-black shadow-[2px_2px_0px_0px_#000]">
            ★ 3 PILAR: THINKING, DOING, SELLING
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
                      MATERI 01 • KIK &amp; IOT
                    </span>
                    <span className="bg-[#8BBB92] text-black text-xs font-black uppercase px-2.5 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                      DURASI 3 MENIT BACA
                    </span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-black leading-tight">
                    Apa Itu <span className="bg-[#8BBB92] px-2 border-4 border-black inline-block shadow-[4px_4px_0px_0px_#000] transform -rotate-1">KIK?</span>
                  </h1>

                  <p className="text-sm sm:text-base md:text-lg font-bold text-gray-800 leading-snug">
                    Senjata rahasia anak SMK untuk mengubah masalah harian di sekolah &amp; industri menjadi <strong>alat nyata, solusi praktis, dan peluang penghasilan mandiri</strong>.
                  </p>
                </div>

                {/* Rotated Emblem Box */}
                <div className="w-28 h-28 sm:w-36 sm:h-36 bg-[#092328] border-4 border-black shadow-[6px_6px_0px_0px_#000] transform -rotate-2 hover:rotate-0 transition-transform duration-200 flex flex-col items-center justify-center text-center p-3 shrink-0 self-center lg:self-auto">
                  <span className="bg-[#8BBB92] text-black font-black text-[10px] sm:text-xs uppercase px-2 py-0.5 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                    MINDSET
                  </span>
                  <span className="material-symbols-outlined text-4xl sm:text-5xl text-[#8BBB92] my-1">
                    psychology
                  </span>
                  <span className="text-[10px] font-mono font-black text-white uppercase tracking-wider">
                    KIK SMK
                  </span>
                </div>
              </div>
            </section>

            {/* ============================================================== */}
            {/* BLOK 2: ANALOGI 1 DETIK */}
            {/* ============================================================== */}
            <section className="bg-[#8BBB92] border-4 border-black shadow-[6px_6px_0px_0px_#000] p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <span className="text-3xl sm:text-4xl shrink-0">💻</span>
                <div className="space-y-1.5">
                  <h3 className="text-base sm:text-lg font-black uppercase text-black">
                    Analogi 1 Detik: Komputer Lab Mendadak Lemot &amp; Hang
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-black leading-relaxed">
                    <strong>Siswa Pasif (Cuma Pengguna):</strong> Mengeluh <em>&quot;Pak, PC-nya lelet!&quot;</em>, gebrak meja, lalu pasrah main HP sampai jam praktik selesai.<br className="hidden sm:block" />
                    <strong>Siswa TKJ / RPL Berjiwa KIK:</strong> Melacak proses liar di Task Manager (<em>Kreativitas</em>), menulis script otomatis pembersih cache &amp; malware (<em>Inovasi</em>), lalu membuka jasa optimasi laptop untuk teman &amp; guru (<em>Kewirausahaan</em>).
                  </p>
                </div>
              </div>
            </section>

            {/* ============================================================== */}
            {/* BLOK 3: 3 PILAR UTAMA KIK (THE 3 POWERS) */}
            {/* ============================================================== */}
            <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-5 sm:p-8 space-y-6">
              <div className="border-b-4 border-black pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="bg-[#092328] text-[#8BBB92] font-mono text-xs font-black uppercase px-2 py-0.5 border border-black inline-block mb-1">
                    FORMULA SUKSES
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
                    Tiga Pilar Utama KIK
                  </h2>
                </div>
                <span className="bg-[#2A835F] text-white text-xs font-black uppercase px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] self-start sm:self-auto">
                  Siklus Eksekusi
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
                {/* Pilar 1: Kreativitas */}
                <div className="bg-[#EAF4ED] border-4 border-black p-5 space-y-3 shadow-[4px_4px_0px_0px_#000] flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-black bg-[#092328] text-[#8BBB92] px-2 py-0.5 border border-black">
                        01 // THINKING
                      </span>
                      <span className="material-symbols-outlined text-2xl text-[#092328]">
                        lightbulb
                      </span>
                    </div>
                    <h3 className="text-xl font-black uppercase text-black tracking-tight">
                      Kreativitas
                    </h3>
                    <p className="text-xs sm:text-sm font-bold text-gray-800 leading-snug">
                      Kepekaan menemukan celah masalah di sekitar dan memikirkan alternatif cara baru untuk menyelesaikannya.
                    </p>
                  </div>
                  <div className="bg-white border-2 border-black p-2.5 text-xs font-bold text-black shadow-[2px_2px_0px_0px_#000]">
                    <span className="font-black text-[#092328] uppercase block mb-0.5">Fokus:</span>
                    Melihat masalah yang diabaikan orang lain.
                  </div>
                </div>

                {/* Pilar 2: Inovasi */}
                <div className="bg-[#EAF4ED] border-4 border-black p-5 space-y-3 shadow-[4px_4px_0px_0px_#000] flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-black bg-[#2A835F] text-white px-2 py-0.5 border border-black">
                        02 // DOING
                      </span>
                      <span className="material-symbols-outlined text-2xl text-[#2A835F]">
                        handyman
                      </span>
                    </div>
                    <h3 className="text-xl font-black uppercase text-black tracking-tight">
                      Inovasi
                    </h3>
                    <p className="text-xs sm:text-sm font-bold text-gray-800 leading-snug">
                      Tindakan fisik merakit alat, menulis kodingan, atau memodifikasi sistem yang sudah ada agar terbukti bekerja.
                    </p>
                  </div>
                  <div className="bg-white border-2 border-black p-2.5 text-xs font-bold text-black shadow-[2px_2px_0px_0px_#000]">
                    <span className="font-black text-[#2A835F] uppercase block mb-0.5">Fokus:</span>
                    Mewujudkan ide menjadi prototipe nyata.
                  </div>
                </div>

                {/* Pilar 3: Kewirausahaan */}
                <div className="bg-[#EAF4ED] border-4 border-black p-5 space-y-3 shadow-[4px_4px_0px_0px_#000] flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-black bg-[#12544F] text-white px-2 py-0.5 border border-black">
                        03 // SELLING
                      </span>
                      <span className="material-symbols-outlined text-2xl text-[#12544F]">
                        storefront
                      </span>
                    </div>
                    <h3 className="text-xl font-black uppercase text-black tracking-tight">
                      Kewirausahaan
                    </h3>
                    <p className="text-xs sm:text-sm font-bold text-gray-800 leading-snug">
                      Kemampuan membawa produk ke masyarakat luas sehingga memberi manfaat nyata dan menghasilkan nilai finansial.
                    </p>
                  </div>
                  <div className="bg-white border-2 border-black p-2.5 text-xs font-bold text-black shadow-[2px_2px_0px_0px_#000]">
                    <span className="font-black text-[#12544F] uppercase block mb-0.5">Fokus:</span>
                    Menjual solusi agar berkelanjutan (cuan).
                  </div>
                </div>
              </div>
            </section>

            {/* ============================================================== */}
            {/* BLOK 4: STUDI KASUS NYATA & TABEL HEAD-TO-HEAD */}
            {/* ============================================================== */}
            <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-5 sm:p-8 space-y-6">
              <div className="border-b-4 border-black pb-3">
                <span className="bg-[#092328] text-[#8BBB92] font-mono text-xs font-black uppercase px-2 py-0.5 border border-black inline-block mb-1">
                  KASUS LAPANGAN TKJ &amp; RPL
                </span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
                  Studi Kasus: Antrean Flashdisk &amp; Virus di Lab Komputer
                </h2>
              </div>

              {/* Box Masalah Singkat */}
              <div className="bg-[#FFF4E5] border-4 border-black p-4 sm:p-5 shadow-[4px_4px_0px_0px_#000] flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-500 text-black border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_#000]">
                  <span className="material-symbols-outlined text-2xl font-black">usb</span>
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs sm:text-sm font-black uppercase text-black">Masalah Nyata di Lab Komputer:</h4>
                  <p className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                    Tiap selesai jam praktik, 36 siswa antre berebut colok flashdisk ke PC guru untuk kumpul tugas. Akibatnya: file tugas rawan kena virus shortcut, hilang, dan buang waktu 20 menit.
                  </p>
                </div>
              </div>

              {/* Tabel Head-to-Head */}
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-black uppercase text-black">
                  Perbandingan Respon: Siswa Pasif vs Siswa KIK (TKJ &amp; RPL)
                </h3>
                <div className="overflow-x-auto border-4 border-black shadow-[4px_4px_0px_0px_#000]">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm font-bold min-w-[500px]">
                    <thead>
                      <tr className="bg-[#092328] text-white border-b-3 border-black font-black uppercase">
                        <th className="p-3 border-r-2 border-black w-1/4">Tahapan</th>
                        <th className="p-3 border-r-2 border-black w-3/8 text-gray-300">Siswa Pasif (Konsumen)</th>
                        <th className="p-3 bg-[#2A835F] text-white w-3/8">Siswa KIK (Inovator TKJ/RPL)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-black bg-[#FAF8F5]">
                      <tr>
                        <td className="p-3 font-black bg-white border-r-2 border-black uppercase text-gray-700">1. Saat Masalah Muncul</td>
                        <td className="p-3 border-r-2 border-black text-gray-600">Pasrah antre, mengeluh panik saat flashdisk terkena virus shortcut.</td>
                        <td className="p-3 font-black text-black bg-[#EAF4ED]">Sadar semua PC lab terhubung kabel LAN &amp; WiFi lokal, tak perlu colok flashdisk fisik. (<em>Kreativitas</em>)</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-black bg-white border-r-2 border-black uppercase text-gray-700">2. Langkah Eksekusi</td>
                        <td className="p-3 border-r-2 border-black text-gray-600">Menyalahkan komputer lab yang lambat dan banyak virusnya.</td>
                        <td className="p-3 font-black text-black bg-[#EAF4ED]">Anak RPL buat web portal kumpul tugas lokal, atau anak TKJ aktifkan shared network drive server. (<em>Inovasi</em>)</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-black bg-white border-r-2 border-black uppercase text-gray-700">3. Dampak Akhir</td>
                        <td className="p-3 border-r-2 border-black text-gray-600">Masalah berulang tiap minggu, file tugas sering corrupt/hilang.</td>
                        <td className="p-3 font-black text-black bg-[#EAF4ED]">Sistem dipakai permanen se-sekolah, kumpul tugas 1 menit beres, siswa dapat portofolio &amp; reward. (<em>Kewirausahaan</em>)</td>
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
                    <strong>Kreativitas</strong> melahirkan ide dari pengamatan tajam masalah harian.
                  </p>
                </div>

                <div className="bg-[#2A835F] text-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_#000]">
                  <span className="bg-[#092328] text-white font-black text-[11px] uppercase px-2 py-0.5 border border-black inline-block mb-2">
                    INGAT 02
                  </span>
                  <p className="text-xs sm:text-sm font-bold leading-snug">
                    <strong>Inovasi</strong> mengeksekusi ide menjadi wujud prototipe fisik yang berfungsi.
                  </p>
                </div>

                <div className="bg-white text-black border-4 border-black p-4 shadow-[4px_4px_0px_0px_#000]">
                  <span className="bg-[#8BBB92] text-black font-black text-[11px] uppercase px-2 py-0.5 border border-black inline-block mb-2">
                    INGAT 03
                  </span>
                  <p className="text-xs sm:text-sm font-bold leading-snug">
                    <strong>Kewirausahaan</strong> membuat solusi dapat dijual dan memberi dampak berkelanjutan.
                  </p>
                </div>
              </div>

              {/* Callout Kuis Evaluasi */}
              <div className="bg-[#092328] border-4 border-black shadow-[6px_6px_0px_0px_#000] p-6 text-white text-center space-y-2">
                <div className="inline-block bg-[#8BBB92] text-black font-black text-xs uppercase px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                  EVALUASI PEMBELAJARAN
                </div>
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
                  Uji Pemahaman Materi: Apa Itu KIK?
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 font-bold max-w-lg mx-auto leading-relaxed">
                  Buktikan kamu sudah menguasai konsep 3 pilar KIK melalui kuis interaktif di bawah ini!
                </p>
              </div>

              {/* Quiz Trigger */}
              <QuizTrigger pageSlug="apa-itu-kik" />
            </section>

            {/* ============================================================== */}
            {/* TACTILE NAVIGATION & FOOTER */}
            {/* ============================================================== */}
            <nav className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t-4 border-black">
              <Link
                href="/course/kik"
                className="w-full sm:w-auto bg-white text-black font-black uppercase text-xs sm:text-sm px-6 py-3.5 border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                <span>Kembali ke Silabus KIK</span>
              </Link>

              <Link
                href="/course/kik/urgensi-kik"
                className="w-full sm:w-auto bg-[#2A835F] text-white font-black uppercase text-xs sm:text-sm px-6 py-3.5 border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer ml-auto"
              >
                <span>Materi Selanjutnya: Urgensi KIK</span>
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

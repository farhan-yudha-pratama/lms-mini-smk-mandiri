"use client";

import Link from 'next/link';
import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import QuizTrigger from '@/components/quiz-engine/QuizTrigger';

export default function FrontendVsBackendPage() {
  return (
    <>
      <Headbar
        links={[
          { label: 'Materi', href: '/arsitektur-aplikasi-web-frontend-vs-backend', isActive: true },
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
                Frontend <span className="text-jade-vibrant">VS</span> Backend
              </h1>

              <p className="text-lg md:text-xl font-bold text-black max-w-3xl leading-relaxed border-l-8 border-jade-vibrant pl-6 bg-mint-canvas p-4 border-4 border-black shadow-[4px_4px_0px_0px_#000]">
                Aplikasi web modern ibarat sebuah restoran besar. Ada area ruang makan tempat tamu menikmati hidangan, dan ada dapur yang sibuk menyiapkan makanan di belakang layar. Mari kita bedah bagaimana keduanya bekerja sama!
              </p>
            </section>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12">

              {/* Frontend Panel */}
              <div className="border-4 border-black bg-mint-soft shadow-[8px_8px_0px_0px_#000] p-6 md:p-8 transition-transform duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-black text-white p-4 border-4 border-black shadow-[4px_4px_0px_0px_#000]">
                    <span className="material-symbols-outlined text-4xl">storefront</span>
                  </div>
                  <h2 className="text-3xl font-black uppercase tracking-tight text-black">A. Frontend</h2>
                </div>

                <div className="bg-white border-4 border-black p-5 mb-6 shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all cursor-default">
                  <h3 className="text-xl font-black uppercase tracking-tight text-jade-vibrant mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined">restaurant</span>
                    Analogi Restoran
                  </h3>
                  <p className="font-bold text-black text-lg">
                    Ini adalah area ruang makan, meja, kursi, desain interior, dan buku menu. Tempat di mana pelanggan (kamu/pengguna) duduk, melihat-lihat, dan berinteraksi.
                  </p>
                </div>

                <div className="bg-white border-4 border-black p-5 mb-6 shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all cursor-default">
                  <h3 className="text-xl font-black uppercase tracking-tight text-pine-deep mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined">terminal</span>
                    Peralatan (Bahasa)
                  </h3>
                  <div className="flex flex-wrap gap-3 mt-3">
                    <span className="bg-[#E44D26] text-white font-black px-4 py-2 border-4 border-black shadow-[2px_2px_0px_0px_#000]">HTML (Kerangka)</span>
                    <span className="bg-[#2965F1] text-white font-black px-4 py-2 border-4 border-black shadow-[2px_2px_0px_0px_#000]">CSS (Desain)</span>
                    <span className="bg-[#F0DB4F] text-black font-black px-4 py-2 border-4 border-black shadow-[2px_2px_0px_0px_#000]">JS (Interaksi)</span>
                  </div>
                </div>

                <div className="bg-white border-4 border-black p-5 shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all cursor-default">
                  <h3 className="text-xl font-black uppercase tracking-tight text-forest-teal mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined">psychology</span>
                    Sifat Utama
                  </h3>
                  <p className="font-bold text-black text-lg">
                    Kode Frontend akan diunduh dan diproses (di-render) secara langsung oleh <strong className="text-jade-vibrant">Browser</strong> (Google Chrome, Firefox, Safari) di laptop atau HP kamu. Ini adalah "wajah" dari aplikasi web!
                  </p>
                </div>
              </div>

              {/* Backend Panel */}
              <div className="border-4 border-black bg-pine-deep shadow-[8px_8px_0px_0px_#000] p-6 md:p-8 transition-transform duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-white text-black p-4 border-4 border-black shadow-[4px_4px_0px_0px_#000]">
                    <span className="material-symbols-outlined text-4xl">kitchen</span>
                  </div>
                  <h2 className="text-3xl font-black uppercase tracking-tight text-white">B. Backend</h2>
                </div>

                <div className="bg-white border-4 border-black p-5 mb-6 shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all cursor-default">
                  <h3 className="text-xl font-black uppercase tracking-tight text-jade-vibrant mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined">local_dining</span>
                    Analogi Restoran
                  </h3>
                  <p className="font-bold text-black text-lg">
                    Ini adalah <strong>Dapur</strong> tempat koki bekerja. Koki akan melihat pesanan, mengecek bahan di kulkas (Database), memasaknya (Logika), dan mengembalikannya sebagai hidangan matang!
                  </p>
                </div>

                <div className="bg-white border-4 border-black p-5 mb-6 shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all cursor-default">
                  <h3 className="text-xl font-black uppercase tracking-tight text-pine-deep mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined">dns</span>
                    Peralatan (Bahasa)
                  </h3>
                  <div className="flex flex-wrap gap-3 mt-3">
                    <span className="bg-[#777BB4] text-white font-black px-4 py-2 border-4 border-black shadow-[2px_2px_0px_0px_#000]">PHP / Node.js (Logika)</span>
                    <span className="bg-[#4479A1] text-white font-black px-4 py-2 border-4 border-black shadow-[2px_2px_0px_0px_#000]">MySQL (Database)</span>
                    <span className="bg-[#092328] text-white font-black px-4 py-2 border-4 border-black shadow-[2px_2px_0px_0px_#000]">Server</span>
                  </div>
                </div>

                <div className="bg-white border-4 border-black p-5 shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all cursor-default">
                  <h3 className="text-xl font-black uppercase tracking-tight text-forest-teal mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined">cloud_sync</span>
                    Sifat Utama
                  </h3>
                  <p className="font-bold text-black text-lg">
                    Kode Backend berjalan di sebuah mesin komputer canggih dari jarak jauh (disebut <strong className="text-pine-deep">Server</strong>). Kode ini <strong>TIDAK</strong> berjalan di laptop pengguna, sehingga kerahasiaan data terjamin.
                  </p>
                </div>
              </div>

            </div>

            {/* Kesimpulan Section */}
            <div className="bg-jade-vibrant border-4 border-black shadow-[8px_8px_0px_0px_#000] p-8 mb-12">
              <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined text-4xl bg-black p-2 border-2 border-black shadow-[2px_2px_0px_0px_#fff]">handshake</span>
                Kerjasama Tim yang Sempurna
              </h2>
              <div className="bg-white border-4 border-black p-6 md:p-8 shadow-[4px_4px_0px_0px_#000]">
                <p className="text-xl font-black text-black mb-6 border-b-4 border-black pb-4">
                  Aplikasi web yang luar biasa membutuhkan Frontend dan Backend yang saling berkomunikasi dengan baik!
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-mint-canvas border-4 border-black p-5 shadow-[4px_4px_0px_0px_#000]">
                    <div className="font-black uppercase text-xl text-black mb-2">Peran Frontend:</div>
                    <p className="font-bold text-black text-lg">Menampilkan data dengan cantik dan mengumpulkan input/klik dari pengguna.</p>
                  </div>
                  <div className="bg-canvas border-4 border-black p-5 shadow-[4px_4px_0px_0px_#000]">
                    <div className="font-black uppercase text-xl text-black mb-2">Peran Backend:</div>
                    <p className="font-bold text-black text-lg">Memproses input tersebut, mengecek keamanan, dan menyimpannya secara permanen di Database.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col md:flex-row justify-between gap-6 mt-12">
              <Link
                href="/"
                className="bg-white border-4 border-black py-4 px-6 font-black uppercase tracking-tight text-black flex items-center justify-center gap-3 shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
              >
                <span className="material-symbols-outlined font-black">arrow_back</span>
                Kembali ke Home
              </Link>
              <Link
                href="/siklus-request--response"
                className="bg-pine-deep border-4 border-black py-4 px-6 font-black uppercase tracking-tight text-white flex items-center justify-center gap-3 shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
              >
                Selanjutnya: Request & Response
                <span className="material-symbols-outlined font-black">arrow_forward</span>
              </Link>
            </div>

            <QuizTrigger pageSlug="arsitektur-aplikasi-web-frontend-vs-backend" />

          </div>
        </main>
      </div>
    </>
  );
}

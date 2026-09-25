"use client";

import Link from 'next/link';
import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import QuizTrigger from '@/components/quiz-engine/QuizTrigger';

export default function SiklusRequestResponsePage() {
  return (
    <>
      <Headbar
        links={[
          { label: 'Materi', href: '/siklus-request-response', isActive: true },
        ]}
      />

      <div className="flex pt-[88px] min-h-screen">
        <Sidebar />

        <main className="md:ml-[280px] w-full p-4 md:p-10 bg-canvas relative" style={{ backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div className="max-w-5xl mx-auto font-sans">
            {/* Hero Section */}
            <section className="mb-12 border-4 border-black bg-white shadow-[8px_8px_0px_0px_#000] p-6 md:p-12 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-pine-deep text-white font-black uppercase tracking-tight border-4 border-black px-4 py-2 -rotate-2 shadow-[4px_4px_0px_0px_#000]">
                Materi Pokok 4
              </div>

              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-black mb-6 mt-8">
                Request <span className="text-pine-deep">&</span> Response
              </h1>

              <p className="text-lg md:text-xl font-bold text-black max-w-3xl leading-relaxed border-l-8 border-pine-deep pl-6 bg-mint-soft p-4 border-4 border-black shadow-[4px_4px_0px_0px_#000]">
                Bagaimana cara komputermu (Frontend) dan server di ujung dunia sana (Backend) bisa saling ngobrol? Mereka menggunakan sebuah siklus tanpa henti yang disebut <strong>Request</strong> (Permintaan) dan <strong>Response</strong> (Tanggapan).
              </p>
            </section>

            {/* Main Content: 3 Steps */}
            <div className="space-y-8 mb-12">

              {/* Step 1: Request */}
              <div className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_#000] p-6 md:p-8 relative hover:-translate-y-1 transition-transform duration-300">
                <div className="absolute -left-4 -top-4 bg-jade-vibrant text-white w-12 h-12 flex items-center justify-center font-black text-2xl border-4 border-black shadow-[4px_4px_0px_0px_#000]">
                  1
                </div>
                <div className="flex items-center gap-4 mb-6 ml-6">
                  <div className="bg-black text-white p-3 border-4 border-black shadow-[4px_4px_0px_0px_#000]">
                    <span className="material-symbols-outlined text-3xl">send</span>
                  </div>
                  <h2 className="text-3xl font-black uppercase tracking-tight text-black">Request (Pesan)</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ml-0 md:ml-6">
                  <div className="bg-canvas border-4 border-black p-5 shadow-[4px_4px_0px_0px_#000]">
                    <h3 className="text-xl font-black uppercase tracking-tight text-black mb-2 flex items-center gap-2">
                      <span className="material-symbols-outlined">computer</span> Apa yang terjadi?
                    </h3>
                    <p className="font-bold text-black">
                      Saat kamu mengetik <code>www.instagram.com</code> dan menekan Enter, browsermu sedang mengirimkan <em>Request</em> (pesanan) ke Server Instagram.
                    </p>
                  </div>
                  <div className="bg-mint-soft border-4 border-black p-5 shadow-[4px_4px_0px_0px_#000]">
                    <h3 className="text-xl font-black uppercase tracking-tight text-black mb-2 flex items-center gap-2">
                      <span className="material-symbols-outlined">restaurant_menu</span> Analogi Restoran
                    </h3>
                    <p className="font-bold text-black text-lg italic">
                      "Hai pelayan, tolong pesankan Nasi Goreng Spesial untuk meja nomor 5!"
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2: Pemrosesan */}
              <div className="border-4 border-black bg-pine-deep shadow-[8px_8px_0px_0px_#000] p-6 md:p-8 relative hover:-translate-y-1 transition-transform duration-300">
                <div className="absolute -left-4 -top-4 bg-white text-black w-12 h-12 flex items-center justify-center font-black text-2xl border-4 border-black shadow-[4px_4px_0px_0px_#000]">
                  2
                </div>
                <div className="flex items-center gap-4 mb-6 ml-6">
                  <div className="bg-white text-black p-3 border-4 border-black shadow-[4px_4px_0px_0px_#000]">
                    <span className="material-symbols-outlined text-3xl">memory</span>
                  </div>
                  <h2 className="text-3xl font-black uppercase tracking-tight text-white">Pemrosesan (Dapur Server)</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ml-0 md:ml-6">
                  <div className="bg-forest-teal border-4 border-black p-5 shadow-[4px_4px_0px_0px_#000]">
                    <h3 className="text-xl font-black uppercase tracking-tight text-white mb-2 flex items-center gap-2">
                      <span className="material-symbols-outlined">dns</span> Apa yang terjadi?
                    </h3>
                    <p className="font-bold text-white">
                      Server menerima <em>Request</em> tersebut. Koki (Backend) langsung mengecek Database (Kulkas): "Siapa ini yang minta? Oh si Budi. Mari ambilkan daftar foto teman-teman Budi dari database."
                    </p>
                  </div>
                  <div className="bg-white border-4 border-black p-5 shadow-[4px_4px_0px_0px_#000]">
                    <h3 className="text-xl font-black uppercase tracking-tight text-black mb-2 flex items-center gap-2">
                      <span className="material-symbols-outlined">kitchen</span> Analogi Restoran
                    </h3>
                    <p className="font-bold text-black text-lg italic">
                      Koki membaca kertas pesanan, mengambil telur dan nasi dari kulkas (Database), lalu memasaknya (Logika Backend).
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3: Response */}
              <div className="border-4 border-black bg-jade-vibrant shadow-[8px_8px_0px_0px_#000] p-6 md:p-8 relative hover:-translate-y-1 transition-transform duration-300">
                <div className="absolute -left-4 -top-4 bg-black text-white w-12 h-12 flex items-center justify-center font-black text-2xl border-4 border-black shadow-[4px_4px_0px_0px_#000]">
                  3
                </div>
                <div className="flex items-center gap-4 mb-6 ml-6">
                  <div className="bg-white text-black p-3 border-4 border-black shadow-[4px_4px_0px_0px_#000]">
                    <span className="material-symbols-outlined text-3xl">mark_email_read</span>
                  </div>
                  <h2 className="text-3xl font-black uppercase tracking-tight text-white">Response (Tanggapan)</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ml-0 md:ml-6">
                  <div className="bg-mint-canvas border-4 border-black p-5 shadow-[4px_4px_0px_0px_#000]">
                    <h3 className="text-xl font-black uppercase tracking-tight text-black mb-2 flex items-center gap-2">
                      <span className="material-symbols-outlined">download</span> Apa yang terjadi?
                    </h3>
                    <p className="font-bold text-black">
                      Setelah data siap, Server merakitnya menjadi kode HTML/CSS/JS, lalu mengirimkan <em>Response</em> kembali ke komputermu melalui internet. Barulah halaman web muncul di layarmu.
                    </p>
                  </div>
                  <div className="bg-white border-4 border-black p-5 shadow-[4px_4px_0px_0px_#000]">
                    <h3 className="text-xl font-black uppercase tracking-tight text-black mb-2 flex items-center gap-2">
                      <span className="material-symbols-outlined">room_service</span> Analogi Restoran
                    </h3>
                    <p className="font-bold text-black text-lg italic">
                      Pelayan mengantarkan Nasi Goreng Spesial yang sudah matang dan siap santap ke mejamu. Selamat menikmati!
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Visualisasi Ringkas */}
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-8 mb-12">
              <h2 className="text-2xl font-black text-black uppercase tracking-tight mb-8 text-center">
                Rangkuman Siklus Super Cepat
              </h2>

              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                {/* Client Box */}
                <div className="bg-canvas border-4 border-black p-6 w-full md:w-1/3 text-center shadow-[4px_4px_0px_0px_#000]">
                  <span className="material-symbols-outlined text-6xl text-black mb-2">laptop_mac</span>
                  <h3 className="font-black uppercase text-xl text-black">Client / Browser</h3>
                  <p className="font-bold text-sm mt-2 text-black">Kirim Request</p>
                </div>

                {/* Arrows */}
                <div className="flex md:flex-col justify-center items-center gap-4">
                  <div className="bg-jade-vibrant text-white font-black px-4 py-2 border-4 border-black flex items-center gap-2 shadow-[2px_2px_0px_0px_#000]">
                    <span>REQUEST</span>
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </div>
                  <div className="bg-pine-deep text-white font-black px-4 py-2 border-4 border-black flex items-center gap-2 shadow-[2px_2px_0px_0px_#000]">
                    <span className="material-symbols-outlined">arrow_back</span>
                    <span>RESPONSE</span>
                  </div>
                </div>

                {/* Server Box */}
                <div className="bg-forest-teal border-4 border-black p-6 w-full md:w-1/3 text-center shadow-[4px_4px_0px_0px_#000]">
                  <span className="material-symbols-outlined text-6xl text-white mb-2">dns</span>
                  <h3 className="font-black uppercase text-xl text-white">Server / Backend</h3>
                  <p className="font-bold text-sm mt-2 text-white">Olah Data & Database</p>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col md:flex-row justify-between gap-6 mt-12">
              <Link
                href="/arsitektur-aplikasi-web-frontend-vs-backend"
                className="bg-white border-4 border-black py-4 px-6 font-black uppercase tracking-tight text-black flex items-center justify-center gap-3 shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
              >
                <span className="material-symbols-outlined font-black">arrow_back</span>
                Sebelumnya: Frontend vs Backend
              </Link>
              <Link
                href="/web-statis-vs-web-dinamis"
                className="bg-mint-soft border-4 border-black py-4 px-6 font-black uppercase tracking-tight text-black flex items-center justify-center gap-3 shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
              >
                Selanjutnya: Web Statis vs Dinamis
                <span className="material-symbols-outlined font-black">arrow_forward</span>
              </Link>
            </div>

            <QuizTrigger pageSlug="siklus-request-response" />

          </div>
        </main>
      </div>
    </>
  );
}

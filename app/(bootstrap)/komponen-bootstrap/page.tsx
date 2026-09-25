"use client";

import Headbar from '@/components/Headbar';
import QuizTrigger from '@/components/quiz-engine/QuizTrigger';
import Sidebar from '@/components/Sidebar';
import { useState } from 'react';

export default function KomponenBootstrapPage() {
  const [isStarted, setIsStarted] = useState(false);

  return (
    <>
      <Headbar
        links={[
          { label: 'Materi', href: '/komponen-bootstrap', isActive: true },
          { label: 'Praktek', href: '#', isActive: false }
        ]}
      />

      <div className="flex pt-[88px] min-h-screen">
        <Sidebar />

        <main className="md:ml-[280px] w-full p-4 md:p-10 bg-canvas relative" style={{ backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">

            {/* Header & Hero Section */}
            <section className="bg-white border-4 border-black p-6 md:p-12 shadow-neo-xl text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 bg-jade-vibrant text-white font-black px-4 py-1 border-b-4 border-r-4 border-black shadow-neo-sm z-20">
                MATERI BOOTSTRAP 04
              </div>
              <div className="absolute top-2 md:top-4 left-2 md:left-4 z-0">
                <span className="material-symbols-outlined text-6xl md:text-[100px] text-black opacity-10">extension</span>
              </div>
              <div className="absolute bottom-2 md:bottom-4 right-2 md:right-4 z-0">
                <span className="material-symbols-outlined text-6xl md:text-[100px] text-black opacity-10">widgets</span>
              </div>
              <div className="relative z-10 pt-4">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-black tracking-tighter uppercase mb-4 md:mb-6">
                  Komponen Ajaib <br className="hidden md:block" /> Siap Pakai
                </h1>
                <p className="text-base md:text-xl font-bold text-white bg-black inline-block px-4 py-2 md:px-6 md:py-3 border-4 border-black mb-8 md:mb-10 shadow-neo-md uppercase tracking-tight">
                  Perabotan IKEA yang siap di-Copy-Paste!
                </p>
                <div>
                  <button
                    onClick={() => setIsStarted(!isStarted)}
                    className="bg-jade-vibrant text-white font-black text-xl md:text-3xl px-8 py-5 md:px-12 md:py-6 border-4 border-black shadow-neo-lg hover:-translate-y-2 hover:-translate-x-2 hover:shadow-neo-xl active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all uppercase tracking-widest flex items-center gap-4 mx-auto"
                  >
                    {isStarted ? (
                      <><span>Gas Terus!</span> <span className="material-symbols-outlined font-black text-4xl animate-spin">sync</span></>
                    ) : (
                      <><span>Mulai Materi</span> <span className="material-symbols-outlined font-black text-4xl">bolt</span></>
                    )}
                  </button>
                </div>
              </div>
            </section>

            {/* Section 1: Warna Bawaan */}
            <section className="bg-mint-canvas border-4 border-black shadow-neo-xl p-6 md:p-12 rotate-1 hover:rotate-0 transition-transform">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 tracking-tighter flex items-center gap-4">
                <span className="bg-white text-black w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">A</span>
                Warna Sakti Bootstrap
              </h2>

              <div className="mb-8 p-6 md:p-8 bg-white border-4 border-black shadow-neo-md hover:-translate-y-2 transition-transform">
                <p className="text-lg md:text-xl font-bold text-forest-teal leading-relaxed">
                  Bootstrap sudah menyiapkan palet warna sakti bawaan. Kamu tinggal tambahkan awalan <code className="bg-mint-soft px-2 py-1 text-black border-2 border-black inline-block mb-1">text-</code> untuk merubah warna tulisan, atau awalan <code className="bg-mint-soft px-2 py-1 text-black border-2 border-black inline-block mb-1">bg-</code> untuk warna latar belakang.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
                <div className="bg-[#0d6efd] text-white p-6 border-4 border-black font-black text-center shadow-neo-md group hover:-translate-y-2 transition-transform">
                  <span className="text-xl md:text-2xl uppercase tracking-widest group-hover:scale-110 inline-block transition-transform">primary</span>
                  <hr className="border-black border-2 my-2 opacity-50" />
                  <span className="text-sm font-bold opacity-90">Biru (Utama)</span>
                </div>
                <div className="bg-[#198754] text-white p-6 border-4 border-black font-black text-center shadow-neo-md group hover:-translate-y-2 transition-transform">
                  <span className="text-xl md:text-2xl uppercase tracking-widest group-hover:scale-110 inline-block transition-transform">success</span>
                  <hr className="border-black border-2 my-2 opacity-50" />
                  <span className="text-sm font-bold opacity-90">Hijau (Berhasil)</span>
                </div>
                <div className="bg-[#dc3545] text-white p-6 border-4 border-black font-black text-center shadow-neo-md group hover:-translate-y-2 transition-transform">
                  <span className="text-xl md:text-2xl uppercase tracking-widest group-hover:scale-110 inline-block transition-transform">danger</span>
                  <hr className="border-black border-2 my-2 opacity-50" />
                  <span className="text-sm font-bold opacity-90">Merah (Hapus/Error)</span>
                </div>
                <div className="bg-[#ffc107] text-black p-6 border-4 border-black font-black text-center shadow-neo-md group hover:-translate-y-2 transition-transform">
                  <span className="text-xl md:text-2xl uppercase tracking-widest group-hover:scale-110 inline-block transition-transform">warning</span>
                  <hr className="border-black border-2 my-2 opacity-50" />
                  <span className="text-sm font-bold opacity-90">Kuning (Peringatan)</span>
                </div>
                <div className="bg-[#212529] text-white p-6 border-4 border-black font-black text-center shadow-neo-md group hover:-translate-y-2 transition-transform">
                  <span className="text-xl md:text-2xl uppercase tracking-widest group-hover:scale-110 inline-block transition-transform">dark</span>
                  <hr className="border-black border-2 my-2 opacity-50" />
                  <span className="text-sm font-bold opacity-90">Hitam Gelap</span>
                </div>
              </div>
            </section>

            {/* Section 2: Tombol */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12 transform -rotate-1 hover:rotate-0 transition-transform">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 tracking-tighter flex items-center gap-4">
                <span className="bg-jade-vibrant text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">B</span>
                Tombol Instan (Buttons)
              </h2>

              <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
                <div className="flex-1 bg-mint-canvas border-4 border-black p-6 shadow-neo-md">
                  <p className="text-lg md:text-xl font-bold text-forest-teal leading-relaxed">
                    Tidak perlu lagi menulis kode CSS panjang untuk sekadar mempercantik tombol! Cukup tambahkan awalan <em>class</em> <code className="bg-white border-2 border-black px-2">btn</code> lalu diikuti palet warna <code className="bg-white border-2 border-black px-2">btn-primary</code>.
                  </p>
                </div>
              </div>

              <div className="flex flex-col xl:flex-row gap-8 items-stretch">
                {/* Visual Demo */}
                <div className="flex-1 flex flex-col gap-4 border-4 border-black p-6 bg-canvas shadow-neo-md justify-center items-center">
                  <div className="flex gap-4">
                    <button className="bg-[#0d6efd] text-white font-bold py-2 px-6 rounded-md hover:bg-blue-700 transition-colors shadow-sm">Simpan Data</button>
                    <button className="bg-[#dc3545] text-white font-bold py-2 px-6 rounded-md hover:bg-red-700 transition-colors shadow-sm">Hapus Data</button>
                  </div>
                  <p className="mt-6 font-black text-gray-500 uppercase tracking-widest text-sm border-t-2 border-gray-300 pt-2 text-center">Demo Hasil Tombol <br />Bawaan Bootstrap</p>
                </div>

                {/* Code Block Visual */}
                <div className="w-full xl:w-3/5 border-4 border-black shadow-neo-lg bg-black flex flex-col group hover:-translate-y-2 hover:-translate-x-2 transition-transform min-w-0">
                  <div className="w-full h-12 border-b-4 border-black bg-mint-canvas flex items-center px-4 gap-3 flex-shrink-0">
                    <div className="w-5 h-5 rounded-none bg-white border-4 border-black"></div>
                    <div className="w-5 h-5 rounded-full bg-black border-2 border-black"></div>
                    <span className="ml-2 font-black uppercase text-sm tracking-widest text-white bg-pine-deep px-3 py-1 border-2 border-black shadow-neo-sm">Kode Tombol HTML</span>
                  </div>
                  <div className="p-4 md:p-6 relative flex-grow bg-black overflow-x-auto">
                    <pre className="font-mono text-sm md:text-base whitespace-pre-wrap leading-relaxed relative z-10 font-bold">
                      <span className="text-gray-400">&lt;</span><span className="text-white">button</span> <span className="text-mint-soft">class</span><span className="text-gray-400">=</span><span className="text-jade-vibrant">"btn btn-primary"</span><span className="text-gray-400">&gt;</span><br />
                      <span className="text-white pl-4">Simpan Data</span><br />
                      <span className="text-gray-400">&lt;/</span><span className="text-white">button</span><span className="text-gray-400">&gt;</span><br /><br />
                      <span className="text-gray-400">&lt;</span><span className="text-white">button</span> <span className="text-mint-soft">class</span><span className="text-gray-400">=</span><span className="text-jade-vibrant">"btn btn-danger"</span><span className="text-gray-400">&gt;</span><br />
                      <span className="text-white pl-4">Hapus Data</span><br />
                      <span className="text-gray-400">&lt;/</span><span className="text-white">button</span><span className="text-gray-400">&gt;</span>
                    </pre>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Kartu (Cards) */}
            <section className="bg-pine-deep border-4 border-black shadow-neo-xl p-6 md:p-12 text-white">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white uppercase mb-8 md:mb-10 border-b-4 border-white pb-4 tracking-tighter flex items-center gap-4 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                <span className="bg-black text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl drop-shadow-none">C</span>
                Kartu Keren (Cards)
              </h2>

              <div className="mb-8 p-6 md:p-8 bg-black border-4 border-black shadow-neo-md hover:-translate-y-2 transition-transform">
                <p className="text-lg md:text-xl font-bold text-gray-300 leading-relaxed">
                  Ingin membuat kotak elegan yang isinya foto, judul, dan tombol (seperti profil Instagram, produk Shopee, atau daftar berita)? Bootstrap menyebutnya <strong>Card</strong>! Sangat cocok untuk mendesain galeri karya atau produk.
                </p>
              </div>

              <div className="flex flex-col xl:flex-row gap-8 items-stretch">
                {/* Visual Card Example (Mimicking Bootstrap Card) */}
                <div className="flex-1 flex justify-center items-center bg-canvas border-4 border-black p-8 shadow-neo-lg group hover:bg-mint-canvas transition-colors">
                  <div className="w-full max-w-[18rem] border-2 border-gray-300 rounded-md overflow-hidden bg-white shadow-lg group-hover:-translate-y-2 transition-transform duration-300">
                    <div className="bg-gray-400 h-40 w-full flex items-center justify-center text-white font-bold text-xl uppercase tracking-widest">
                      <span className="material-symbols-outlined text-5xl opacity-50">image</span>
                    </div>
                    <div className="p-4 text-black">
                      <h5 className="text-xl font-bold mb-2">Judul Produk</h5>
                      <p className="text-gray-600 mb-4 text-sm leading-relaxed">Ini adalah deskripsi singkat tentang produk atau portofolio tersebut.</p>
                      <button className="bg-[#0d6efd] text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition-colors w-full">Beli Sekarang</button>
                    </div>
                  </div>
                </div>

                {/* Code Block Visual */}
                <div className="w-full xl:w-3/5 border-4 border-black shadow-neo-lg bg-black flex flex-col group hover:-translate-y-2 hover:-translate-x-2 transition-transform min-w-0">
                  <div className="w-full h-12 border-b-4 border-black bg-white flex items-center px-4 gap-3 flex-shrink-0 text-black">
                    <span className="material-symbols-outlined">code</span>
                    <span className="font-black uppercase tracking-widest text-sm">Kode Pembuat Card</span>
                  </div>
                  <div className="p-4 md:p-6 relative flex-grow bg-black overflow-x-auto">
                    <pre className="font-mono text-xs md:text-sm whitespace-pre-wrap leading-relaxed relative z-10 font-bold">
                      <span className="text-gray-400">&lt;</span><span className="text-white">div</span> <span className="text-mint-soft">class</span><span className="text-gray-400">=</span><span className="text-jade-vibrant">"card"</span> <span className="text-white">style</span><span className="text-gray-400">=</span><span className="text-jade-vibrant">"width: 18rem;"</span><span className="text-gray-400">&gt;</span><br />
                      <span className="text-gray-400 pl-4">&lt;</span><span className="text-white">img</span> <span className="text-mint-soft">src</span><span className="text-gray-400">=</span><span className="text-jade-vibrant">"foto.jpg"</span> <span className="text-mint-soft">class</span><span className="text-gray-400">=</span><span className="text-jade-vibrant">"card-img-top"</span><span className="text-gray-400">&gt;</span><br />
                      <span className="text-gray-400 pl-4">&lt;</span><span className="text-white">div</span> <span className="text-mint-soft">class</span><span className="text-gray-400">=</span><span className="text-jade-vibrant">"card-body"</span><span className="text-gray-400">&gt;</span><br />

                      <span className="text-gray-400 pl-8">&lt;</span><span className="text-white">h5</span> <span className="text-mint-soft">class</span><span className="text-gray-400">=</span><span className="text-jade-vibrant">"card-title"</span><span className="text-gray-400">&gt;</span><span className="text-white">Judul Produk</span><span className="text-gray-400">&lt;/</span><span className="text-white">h5</span><span className="text-gray-400">&gt;</span><br />

                      <span className="text-gray-400 pl-8">&lt;</span><span className="text-white">p</span> <span className="text-mint-soft">class</span><span className="text-gray-400">=</span><span className="text-jade-vibrant">"card-text"</span><span className="text-gray-400">&gt;</span><br />
                      <span className="text-white pl-12">Ini adalah deskripsi singkat.</span><br />
                      <span className="text-gray-400 pl-8">&lt;/</span><span className="text-white">p</span><span className="text-gray-400">&gt;</span><br />

                      <span className="text-gray-400 pl-8">&lt;</span><span className="text-white">a</span> <span className="text-mint-soft">href</span><span className="text-gray-400">=</span><span className="text-jade-vibrant">"#"</span> <span className="text-mint-soft">class</span><span className="text-gray-400">=</span><span className="text-jade-vibrant">"btn btn-primary"</span><span className="text-gray-400">&gt;</span><br />
                      <span className="text-white pl-12">Beli Sekarang</span><br />
                      <span className="text-gray-400 pl-8">&lt;/</span><span className="text-white">a</span><span className="text-gray-400">&gt;</span><br />

                      <span className="text-gray-400 pl-4">&lt;/</span><span className="text-white">div</span><span className="text-gray-400">&gt;</span><br />
                      <span className="text-gray-400">&lt;/</span><span className="text-white">div</span><span className="text-gray-400">&gt;</span>
                    </pre>
                  </div>
                </div>
              </div>
            </section>

            <QuizTrigger pageSlug="komponen-bootstrap" />

          </div>
        </main>
      </div>
    </>
  );
}

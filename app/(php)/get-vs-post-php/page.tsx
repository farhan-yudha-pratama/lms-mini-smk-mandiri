"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import CodeBlock from '@/components/CodeBlock';
import { useState } from 'react';

export default function GetVsPostPage() {
  const [activeTab, setActiveTab] = useState<'GET' | 'POST'>('GET');

  return (
    <>
      <Headbar
        links={[
          { label: 'Materi', href: '/get-vs-post-php', isActive: true },
          { label: 'Latihan Form', href: '/get-vs-post-php/latihan', isActive: false }
        ]}
      />

      <div className="flex pt-[88px] min-h-screen">
        <Sidebar />

        <main className="md:ml-[280px] w-full p-4 md:p-10 bg-canvas relative" style={{ backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">

            {/* Header & Hero Section */}
            <section className="bg-black border-4 border-black p-6 md:p-12 shadow-neo-xl text-center relative overflow-hidden text-white">
              <div className="absolute top-0 left-0 bg-[#2965F1] text-white font-black px-4 py-1 border-b-4 border-r-4 border-black shadow-neo-sm z-20 uppercase">
                PHP Dinamis 07
              </div>
              <div className="absolute -bottom-10 -left-10 z-0">
                <span className="material-symbols-outlined text-[150px] md:text-[250px] text-white opacity-20 transform -rotate-12">move_up</span>
              </div>
              <div className="absolute -top-10 -right-10 z-0">
                <span className="material-symbols-outlined text-[150px] md:text-[250px] text-white opacity-20 transform rotate-12">lock</span>
              </div>
              
              <div className="relative z-10 pt-8">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-[#FFD700] tracking-tighter uppercase mb-4 md:mb-6 drop-shadow-[4px_4px_0px_rgba(255,255,255,0.2)]">
                  Metode Pengiriman: <br className="hidden md:block" /> $_GET vs $_POST
                </h1>
                <p className="text-base md:text-xl font-bold text-black bg-white inline-block px-4 py-2 md:px-6 md:py-3 border-4 border-black mb-8 shadow-neo-md uppercase tracking-tight">
                  Bagaimana PHP menerima data dari Form HTML?
                </p>
              </div>
            </section>

            {/* Section 1: Konsep Superglobals */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12 rotate-1 hover:rotate-0 transition-transform">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-[#FF0000] text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">01</span>
                Dua Cara Mengirim Data
              </h2>

              <p className="text-lg md:text-xl font-bold text-gray-700 leading-relaxed mb-6">
                Saat kamu mengisi Form HTML dan menekan tombol "Submit", data tersebut akan dikirimkan ke PHP menggunakan sebuah variabel khusus bawaan PHP (disebut <strong>Superglobals</strong>).
              </p>

              <p className="text-lg font-bold text-black bg-mint-soft border-4 border-black p-4 shadow-neo-sm">
                Kamu harus memberitahu PHP cara yang <strong>TEPAT</strong> untuk mengambil data tersebut, yaitu antara menggunakan metode GET atau POST.
              </p>
            </section>

            {/* Section 2: Interactive Comparison $_GET vs $_POST */}
            <section className="bg-pine-deep border-4 border-black shadow-neo-xl p-6 md:p-12 -rotate-1 hover:rotate-0 transition-transform text-white">
              <div className="flex justify-center mb-8">
                <div className="bg-black border-4 border-black flex shadow-[8px_8px_0px_0px_#000]">
                  <button 
                    onClick={() => setActiveTab('GET')}
                    className={`font-black text-xl md:text-3xl uppercase px-8 py-4 transition-colors ${activeTab === 'GET' ? 'bg-[#FFD700] text-black' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                  >
                    $_GET
                  </button>
                  <button 
                    onClick={() => setActiveTab('POST')}
                    className={`font-black text-xl md:text-3xl uppercase px-8 py-4 transition-colors ${activeTab === 'POST' ? 'bg-[#FF0000] text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                  >
                    $_POST
                  </button>
                </div>
              </div>

              {/* Konten $_GET */}
              {activeTab === 'GET' && (
                <div className="bg-canvas text-black border-4 border-black shadow-[8px_8px_0px_0px_#FFD700] p-6 md:p-12 animate-in fade-in zoom-in duration-300">
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="flex-1 space-y-6">
                      <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-6xl text-[#FFD700]">visibility</span>
                        <h3 className="text-3xl md:text-5xl font-black uppercase text-black">Tas Transparan</h3>
                      </div>
                      <p className="text-lg font-bold leading-relaxed">
                        Metode <code className="bg-[#FFD700] px-2 py-1 border-2 border-black">$_GET</code> digunakan untuk mengirim data dengan cara <strong>menempelkannya langsung di ujung *Address Bar* (URL)</strong> browser.
                      </p>
                      
                      {/* URL Bar Visual */}
                      <div className="bg-white border-4 border-black shadow-neo-sm overflow-hidden mt-6">
                        <div className="bg-gray-200 border-b-4 border-black p-2 flex items-center gap-2">
                          <span className="material-symbols-outlined">lock</span>
                          <span className="font-mono text-sm break-all">
                            www.tokomu.com/cari<span className="bg-[#FFD700] font-black">?kategori=buku</span>
                          </span>
                        </div>
                        <div className="p-4 bg-gray-50 text-sm font-bold text-gray-600">
                          Semua orang di sebelahmu bisa melihat dengan jelas kalau kamu sedang mencari "buku"!
                        </div>
                      </div>
                    </div>

                    <div className="md:w-1/3 space-y-4 w-full">
                      <div className="bg-white border-4 border-black p-4 text-center">
                        <span className="material-symbols-outlined text-4xl text-forest-teal mb-2">check_circle</span>
                        <h4 className="font-black uppercase mb-1">Cocok Untuk</h4>
                        <p className="font-bold text-sm">Fitur Pencarian (Search), Filter Barang, Nomor Halaman.</p>
                      </div>
                      <div className="bg-black text-white border-4 border-black p-4 text-center">
                        <span className="material-symbols-outlined text-4xl text-[#FF0000] mb-2">cancel</span>
                        <h4 className="font-black uppercase mb-1">Dilarang Untuk</h4>
                        <p className="font-bold text-sm text-gray-300">Password, Data KTP, Data Sensitif. (Karena kelihatan di URL!)</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Konten $_POST */}
              {activeTab === 'POST' && (
                <div className="bg-canvas text-black border-4 border-black shadow-[8px_8px_0px_0px_#FF0000] p-6 md:p-12 animate-in fade-in zoom-in duration-300">
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="flex-1 space-y-6">
                      <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-6xl text-[#FF0000]">lock</span>
                        <h3 className="text-3xl md:text-5xl font-black uppercase text-black">Koper Rahasia</h3>
                      </div>
                      <p className="text-lg font-bold leading-relaxed">
                        Metode <code className="bg-[#FF0000] text-white px-2 py-1 border-2 border-black">$_POST</code> digunakan untuk mengirim data <strong>secara rahasia di balik layar</strong>. Data ini tidak akan terlihat sama sekali di baris URL browsermu!
                      </p>
                      
                      {/* URL Bar Visual */}
                      <div className="bg-white border-4 border-black shadow-neo-sm overflow-hidden mt-6">
                        <div className="bg-gray-200 border-b-4 border-black p-2 flex items-center gap-2">
                          <span className="material-symbols-outlined text-green-600">lock</span>
                          <span className="font-mono text-sm break-all">
                            www.tokomu.com/login
                          </span>
                        </div>
                        <div className="p-4 bg-gray-50 text-sm font-bold text-[#FF0000]">
                          Teks URL bersih! Tapi di balik layar, <em>Username</em> dan <em>Password</em>-mu sedang dikirim dengan aman menggunakan koper berlapis baja.
                        </div>
                      </div>
                    </div>

                    <div className="md:w-1/3 space-y-4 w-full">
                      <div className="bg-white border-4 border-black p-4 text-center">
                        <span className="material-symbols-outlined text-4xl text-forest-teal mb-2">check_circle</span>
                        <h4 className="font-black uppercase mb-1">Cocok Untuk</h4>
                        <p className="font-bold text-sm">Form Login, Form Registrasi, Input Buku Tamu, Input Pembayaran.</p>
                      </div>
                      <div className="bg-black text-white border-4 border-black p-4 text-center">
                        <span className="material-symbols-outlined text-4xl text-[#FF0000] mb-2">cancel</span>
                        <h4 className="font-black uppercase mb-1">Kekurangan</h4>
                        <p className="font-bold text-sm text-gray-300">Halamannya tidak bisa di-<em>Bookmark</em> atau dibagikan linknya ke teman.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>
            
            {/* Section 3: Latihan Praktik */}
            <section className="bg-canvas border-4 border-black shadow-neo-xl p-6 md:p-12 rotate-1 hover:rotate-0 transition-transform">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-jade-vibrant text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">03</span>
                Latihan Praktik
              </h2>

              <p className="text-lg md:text-xl font-bold text-forest-teal mb-6">
                Mari kita buat 2 jenis form berbeda untuk melihat langsung perbedaan URL-nya!
              </p>

              <div className="w-full mb-6 text-left">
                <CodeBlock 
                  language="html"
                  code={`<!-- 1. Form menggunakan GET -->
<form method="GET" action="proses.php">
  <input type="text" name="cari_barang" placeholder="Cari barang...">
  <button type="submit">Cari (GET)</button>
</form>

<br>

<!-- 2. Form menggunakan POST -->
<form method="POST" action="proses.php">
  <input type="password" name="password_rahasia" placeholder="Password kamu...">
  <button type="submit">Kirim (POST)</button>
</form>`}
                />
              </div>

              <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000] flex flex-col gap-4 text-black text-left">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#FFD700] shrink-0 border-4 border-black flex items-center justify-center font-black text-xl">1</div>
                  <div>
                    <h3 className="text-lg md:text-xl font-black uppercase mb-1">Coba Tombol GET</h3>
                    <p className="font-bold text-gray-700">Ketik sesuatu dan klik tombol Cari (GET). Perhatikan URL di bagian atas browsermu, tulisan yang kamu ketik akan muncul di sana (contoh: <code>?cari_barang=buku</code>).</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#FF0000] text-white shrink-0 border-4 border-black flex items-center justify-center font-black text-xl">2</div>
                  <div>
                    <h3 className="text-lg md:text-xl font-black uppercase mb-1">Coba Tombol POST</h3>
                    <p className="font-bold text-gray-700">Kembali ke halaman form, lalu ketik password di kotak kedua dan klik Kirim (POST). Perhatikan URL-nya, datamu disembunyikan dan URL tetap bersih!</p>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Footer Nav */}
            <div className="flex flex-col sm:flex-row justify-between items-center pt-8 gap-4">
              <a href="/hard-refresh-browser" className="bg-canvas text-black font-black uppercase text-sm md:text-lg px-4 py-3 md:px-6 md:py-4 border-4 border-black shadow-neo-md hover:-translate-y-1 hover:-translate-x-1 hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2 w-full sm:w-auto justify-center">
                <span className="material-symbols-outlined font-black">arrow_back</span> Jurus Refresh
              </a>
              <a href="/undefined-array-key" className="bg-[#2965F1] text-white font-black uppercase text-sm md:text-lg px-4 py-3 md:px-6 md:py-4 border-4 border-black shadow-neo-md hover:-translate-y-1 hover:-translate-x-1 hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2 w-full sm:w-auto justify-center text-center">
                Lanjut ke: Undefined Array Key <span className="material-symbols-outlined font-black">arrow_forward</span>
              </a>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}

"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import CodeBlock from '@/components/CodeBlock';

export default function WarnaBackgroundPage() {
  return (
    <>
      <Headbar
        links={[
          { label: 'Materi', href: '/warna-background', isActive: true },
          { label: 'Soal Teori', href: '/warna-background/soal', isActive: false }
        ]}
      />

      <div className="flex pt-[88px] min-h-screen">
        <Sidebar />

        <main className="md:ml-[280px] w-full p-4 md:p-10 bg-canvas relative" style={{ backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">

            <section className="bg-white border-4 border-black p-6 md:p-12 shadow-neo-xl text-center relative overflow-hidden transform rotate-1 hover:rotate-0 transition-transform">
              <div className="absolute top-0 left-0 bg-jade-vibrant text-white font-black px-4 py-1 border-b-4 border-r-4 border-black shadow-neo-sm z-20">
                MATERI 07
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-black tracking-tighter uppercase mt-6 mb-4 md:mb-6">
                Warna & Background
              </h1>
              <p className="text-base md:text-xl font-bold text-white bg-forest-teal inline-block px-4 py-2 md:px-6 md:py-3 border-4 border-black mb-4 md:mb-6 shadow-neo-md uppercase tracking-tight">
                Dunia visual website tidak akan lengkap tanpa kombinasi warna yang menarik dan harmonis!
              </p>
            </section>

            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-12 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="material-symbols-outlined text-4xl md:text-5xl text-white bg-pine-deep p-2 border-4 border-black shadow-neo-sm flex-shrink-0">palette</span>
                3 Cara Eksekusi Mewarnai
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
                {/* Nama Warna */}
                <div className="bg-canvas border-4 border-black shadow-neo-md hover:-translate-y-2 hover:shadow-neo-lg transition-transform p-6 md:p-8 flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-red-500 border-4 border-black rounded-none shadow-[4px_4px_0px_rgba(0,0,0,1)] mb-6 transform rotate-6"></div>
                  <h3 className="text-xl md:text-2xl font-black uppercase mb-4 tracking-widest text-black">Nama (Keyword)</h3>
                  <p className="font-bold text-forest-teal text-base flex-1">Metode paling dasar namun terbatas. Menggunakan nama warna dalam bahasa Inggris seperti <code className="bg-white px-2 border-2 border-black text-black font-black uppercase tracking-widest">red</code>, <code className="bg-white px-2 border-2 border-black text-black font-black uppercase tracking-widest">blue</code>, <code className="bg-white px-2 border-2 border-black text-black font-black uppercase tracking-widest">green</code>.</p>
                </div>
                
                {/* Kode Hex */}
                <div className="bg-pine-deep text-white border-4 border-black shadow-neo-md hover:-translate-y-2 hover:shadow-neo-lg transition-transform p-6 md:p-8 flex flex-col items-center text-center relative overflow-hidden">
                  <span className="absolute top-0 right-0 bg-jade-vibrant text-black text-xs font-black px-2 py-1 border-b-4 border-l-4 border-black shadow-neo-sm">PRO CHOICE</span>
                  <div className="w-20 h-20 bg-[#3b82f6] border-4 border-white rounded-none shadow-[4px_4px_0px_rgba(255,255,255,1)] mb-6 transform -rotate-3"></div>
                  <h3 className="text-xl md:text-2xl font-black uppercase mb-4 tracking-widest text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">Kode Hex</h3>
                  <p className="font-bold text-mint-soft text-base flex-1">Standar yang paling banyak digunakan di industri! Menggunakan kombinasi 6 digit kode alfanumerik. Contoh: <code className="bg-black px-2 py-1 border-2 border-white text-jade-vibrant font-black tracking-widest">#3b82f6</code></p>
                </div>

                {/* RGBA */}
                <div className="bg-canvas border-4 border-black shadow-neo-md hover:-translate-y-2 hover:shadow-neo-lg transition-transform p-6 md:p-8 flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-[rgba(0,0,0,0.5)] border-4 border-black rounded-none shadow-[4px_4px_0px_rgba(0,0,0,1)] mb-6 relative overflow-hidden transform rotate-3">
                    {/* Fake transparency grid */}
                    <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDAwIj48L3JlY3Q+CjxyZWN0IHg9IjQiIHk9IjQiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiMwMDAiPjwvcmVjdD4KPC9zdmc+')]"></div>
                  </div>
                  <h3 className="text-xl md:text-2xl font-black uppercase mb-4 tracking-widest text-black">RGBA (Transparan)</h3>
                  <p className="font-bold text-forest-teal text-base flex-1">Warna yang mendukung transparansi (Alpha). Memungkinkan kita mengatur tingkat opasitas suatu elemen dengan fleksibel.</p>
                </div>
              </div>

              {/* Code Application */}
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-stretch bg-white border-4 border-black p-6 md:p-10 shadow-neo-md transform rotate-1 hover:rotate-0 transition-transform mt-16">
                <div className="lg:w-1/2 space-y-6">
                  <h3 className="text-2xl md:text-3xl font-black uppercase flex items-center gap-3 border-b-4 border-black pb-3 tracking-tighter">
                    <span className="material-symbols-outlined text-black bg-mint-soft p-2 border-4 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] text-3xl md:text-4xl">format_paint</span>
                    Teks vs Latar (Background)
                  </h3>
                  <p className="text-lg font-bold text-forest-teal leading-relaxed bg-mint-canvas p-4 border-4 border-black shadow-neo-sm">
                    Penting! Pastikan kamu memahami perbedaan fungsi antara properti <code className="bg-white text-black px-2 py-1 font-black border-2 border-black uppercase tracking-widest">color</code> dan <code className="bg-white text-black px-2 py-1 font-black border-2 border-black uppercase tracking-widest">background-color</code>!
                  </p>
                  <ul className="space-y-4 font-bold text-base md:text-lg">
                    <li className="flex gap-3 bg-canvas border-4 border-black p-4 shadow-neo-sm hover:translate-x-2 transition-transform">
                      <span className="text-2xl">✒️</span> 
                      <div><code className="bg-white px-2 py-1 border-2 border-black text-black font-black uppercase">color</code>: Digunakan khusus untuk merubah warna teks atau tulisan pada elemen.</div>
                    </li>
                    <li className="flex gap-3 bg-pine-deep text-white border-4 border-black p-4 shadow-neo-sm hover:translate-x-2 transition-transform">
                      <span className="text-2xl">🧱</span> 
                      <div><code className="bg-black px-2 py-1 border-2 border-white text-jade-vibrant font-black uppercase">background-color</code>: Digunakan untuk mengisi warna latar belakang sebuah elemen atau wadah kontainer.</div>
                    </li>
                  </ul>
                </div>
                <div className="lg:w-1/2 w-full flex flex-col bg-black border-4 border-black p-1 shadow-neo-lg transform -rotate-1 hover:rotate-0 transition-transform">
                   <div className="bg-mint-soft border-b-4 border-black p-3 font-black uppercase text-center text-black tracking-widest">Mewarnai Wadah</div>
                  <div className="flex-grow p-1">
                    <CodeBlock 
                      language="css" 
                      code={`.kotak-konten {
  /* Teks dicat berwarna abu-abu gelap elegan (Hex) */
  color: #1f2937;              
  
  /* Latar belakang lantai dicat blok warna putih mutlak (Hex) */
  background-color: #ffffff;     
}`} 
                    />
                  </div>
                </div>
              </div>

              {/* Background Image */}
              <div className="bg-jade-vibrant border-4 border-black p-6 md:p-12 shadow-neo-xl mt-16 flex flex-col xl:flex-row gap-10 items-stretch transform -rotate-1 hover:rotate-0 transition-transform">
                <div className="xl:w-1/2 space-y-8">
                  <h3 className="text-2xl md:text-4xl font-black uppercase flex items-center gap-3 drop-shadow-[2px_2px_0px_rgba(255,255,255,1)] text-black tracking-tighter">
                    <span className="material-symbols-outlined text-4xl md:text-5xl bg-black text-white p-2 rounded-none border-4 border-white shadow-[2px_2px_0px_rgba(255,255,255,1)]">image</span>
                    Latar Belakang Visual Gambar
                  </h3>
                  <p className="font-bold text-lg md:text-xl leading-relaxed bg-white text-black p-4 border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                    Selain warna solid, kamu juga dapat menggunakan gambar atau foto sebagai latar belakang elemen dengan properti <code className="bg-mint-canvas text-black px-2 py-1 font-black border-2 border-black uppercase tracking-widest inline-block mt-2 sm:mt-0">background-image</code>.
                  </p>
                  <div className="font-bold text-black text-base md:text-lg leading-relaxed mb-4 flex items-start gap-4 bg-mint-soft p-4 border-4 border-black shadow-neo-sm">
                    <span className="text-3xl md:text-4xl flex-shrink-0 mt-1">⚠️</span> 
                    <p><strong>Catatan Penting:</strong> Gunakan juga <code className="bg-white text-black px-2 py-1 border-2 border-black">background-size: cover</code> agar gambar tersebut dapat menutupi seluruh area elemen secara responsif tanpa terdistorsi atau berulang!</p>
                  </div>
                </div>
                <div className="xl:w-1/2 w-full flex flex-col bg-black border-4 border-black p-1 shadow-[6px_6px_0px_rgba(255,255,255,1)]">
                   <div className="bg-mint-soft border-b-4 border-black p-3 font-black uppercase text-center text-black tracking-widest">Implementasi Background Image</div>
                  <div className="flex-grow p-1">
                    <CodeBlock 
                      language="css" 
                      code={`.hero-banner {
  /* Tentukan lokasi (path) file gambar */
  background-image: url('assets/pemandangan.jpg');
  
  /* Agar gambar menutupi area secara responsif */
  background-size: cover;
  
  /* Posisikan gambar di tengah area */
  background-position: center;
  
  /* Mencegah gambar diulang (tiled) */
  background-repeat: no-repeat;
}`} 
                    />
                  </div>
                </div>
              </div>

              {/* Gradient */}
              <div className="bg-pine-deep border-4 border-black p-6 md:p-12 shadow-neo-xl mt-16 flex flex-col xl:flex-row gap-10 items-stretch transform rotate-1 hover:rotate-0 transition-transform text-white">
                <div className="xl:w-1/2 w-full flex flex-col bg-black border-4 border-white p-1 shadow-[6px_6px_0px_rgba(255,255,255,1)] order-2 xl:order-1">
                   <div className="bg-mint-soft border-b-4 border-white p-3 font-black uppercase text-center text-black tracking-widest">Aksi Linear Gradient</div>
                  <div className="flex-grow p-1">
                    <CodeBlock 
                      language="css" 
                      code={`.layar-gradasi {
  /* Aliran warna mengalir deras vertikal (Atas ke Bawah) */
  background: linear-gradient(to bottom, #10B981, #064E3B);
  
  /* Atau jika ingin aliran menyamping horizontal (Kiri ke Kanan) */
  /* background: linear-gradient(to right, ...); */
}`} 
                    />
                  </div>
                </div>
                <div className="xl:w-1/2 space-y-8 order-1 xl:order-2">
                  <h3 className="text-2xl md:text-4xl font-black uppercase flex items-center gap-3 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] text-jade-vibrant tracking-tighter">
                    <span className="material-symbols-outlined text-4xl md:text-5xl bg-black text-white p-2 rounded-none border-4 border-white shadow-[2px_2px_0px_rgba(255,255,255,1)]">gradient</span>
                    Gradasi Modern (Gradient)
                  </h3>
                  <p className="font-bold text-lg md:text-xl leading-relaxed bg-black p-4 border-4 border-white shadow-[4px_4px_0px_rgba(255,255,255,1)]">
                    Desain web modern (Modern Web) sering menggunakan perpaduan warna yang disebut <strong className="text-jade-vibrant uppercase underline decoration-2">Gradient</strong> untuk membuat tampilan lebih hidup dan dinamis!
                  </p>
                  <p className="font-bold text-mint-soft text-base md:text-lg leading-relaxed">
                    CSS memiliki fungsi bawaan <code className="bg-black px-2 py-1 font-black text-white border-2 border-white tracking-widest uppercase">linear-gradient()</code> untuk mencampurkan dua warna (atau lebih) dengan transisi perpindahan yang halus.
                  </p>
                  {/* Brutalist visualizer for gradient */}
                  <div className="h-20 w-full border-4 border-white shadow-[6px_6px_0px_rgba(0,0,0,1)] relative flex items-center justify-center font-black uppercase tracking-widest text-black text-xl" style={{ background: 'linear-gradient(to right, #10B981, #D1FAE5)' }}>
                    DEMONSTRASI GRADASI
                  </div>
                </div>
              </div>

            </section>

            {/* Footer / Penutup */}
            <footer className="bg-jade-vibrant border-4 border-black p-8 md:p-12 shadow-neo-xl text-center relative hover:-translate-y-1 transition-transform">
              <span className="material-symbols-outlined absolute -top-4 -right-4 md:-top-6 md:-right-6 text-5xl md:text-6xl text-white bg-black rounded-none border-4 border-white p-3 shadow-[4px_4px_0px_rgba(255,255,255,1)] hover:scale-110 transition-transform cursor-pointer">imagesmode</span>
              <p className="text-2xl md:text-4xl font-black text-black uppercase leading-relaxed max-w-4xl mx-auto drop-shadow-[2px_2px_0px_rgba(255,255,255,1)] tracking-tight">
                "Pahami properti dasarnya dan mulailah mewarnai desain website-mu dengan kombinasi warna Hexadesimal, RGBA, dan juga gradien (Gradient)!"
              </p>
            </footer>

            <div className="mt-16 mb-8 flex flex-col md:flex-row justify-between items-center gap-4 border-t-4 border-black pt-8">
              <p className="font-black text-sm md:text-base uppercase tracking-widest text-forest-teal bg-white border-4 border-black px-4 py-2 shadow-neo-sm text-center md:text-left">
                © 2026 FARHAN YUDHA PRATAMA
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

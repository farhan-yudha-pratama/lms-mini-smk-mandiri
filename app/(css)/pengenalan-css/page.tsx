"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import CodeBlock from '@/components/CodeBlock';
import { useState } from 'react';

export default function PengenalanCSSPage() {
  const [isStarted, setIsStarted] = useState(false);

  return (
    <>
      <Headbar
        links={[
          { label: 'Materi', href: '/pengenalan-css', isActive: true },
          { label: 'Soal Teori', href: '/pengenalan-css/soal', isActive: false }
        ]}
      />

      <div className="flex pt-[88px] min-h-screen">
        <Sidebar />

        <main className="md:ml-[280px] w-full p-4 md:p-10 bg-canvas relative" style={{ backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">

            {/* Header & Hero Section */}
            <section className="bg-pine-deep text-white border-4 border-black p-6 md:p-12 shadow-neo-xl text-center relative overflow-hidden transform -rotate-1 hover:rotate-0 transition-transform">
              <div className="absolute top-0 left-0 bg-jade-vibrant text-white font-black px-4 py-1 border-b-4 border-r-4 border-black shadow-neo-sm z-20">
                MATERI 01
              </div>
              <div className="absolute top-2 md:top-4 left-2 md:left-4">
                <span className="material-symbols-outlined text-6xl md:text-[80px] opacity-20">brush</span>
              </div>
              <div className="absolute bottom-2 md:bottom-4 right-2 md:right-4">
                <span className="material-symbols-outlined text-6xl md:text-[80px] opacity-20">format_paint</span>
              </div>
              <div className="relative z-10">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tighter uppercase mt-6 mb-4 md:mb-6 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                  Pengenalan CSS
                </h1>
                <p className="text-base md:text-xl font-bold text-black bg-mint-soft inline-block px-4 py-2 md:px-6 md:py-3 border-4 border-black mb-6 md:mb-8 shadow-neo-md uppercase tracking-tight">
                  Mewarnai dan mendandani kerangka HTML agar tampil lebih cantik dan responsif!
                </p>
                <div>
                  <button
                    onClick={() => setIsStarted(!isStarted)}
                    className="bg-jade-vibrant text-white font-black text-lg md:text-2xl px-6 py-4 md:px-10 md:py-5 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] md:hover:shadow-[14px_14px_0px_0px_rgba(0,0,0,1)] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all uppercase tracking-widest cursor-pointer"
                  >
                    {isStarted ? "SEDANG BELAJAR... 🔥" : "MULAI BELAJAR SEKARANG"}
                  </button>
                </div>
              </div>
            </section>

            {/* Section 1: Analogi */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-mint-soft text-black w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">1</span>
                CSS Ibarat Desain Interior
              </h2>

              <div className="flex flex-col md:flex-row gap-8 lg:gap-10 mb-10 md:mb-12 items-stretch">
                <div className="md:w-2/3">
                  <p className="text-lg md:text-xl font-bold text-forest-teal leading-relaxed bg-mint-canvas p-6 border-4 border-black shadow-neo-sm hover:-translate-y-1 transition-transform">
                    Jika <strong className="bg-white px-2 py-1 border-2 border-black text-black uppercase tracking-widest shadow-[2px_2px_0px_rgba(0,0,0,1)]">HTML</strong> adalah susunan batu bata, pondasi, dan tiang bangunan (kerangka), maka <strong className="bg-jade-vibrant text-white px-2 py-1 border-2 border-black uppercase tracking-widest shadow-[2px_2px_0px_rgba(0,0,0,1)]">CSS</strong> adalah cat tembok, wallpaper, lampu hias, dan tirai jendelanya. Tanpa CSS, halaman web (seperti Facebook atau YouTube) hanya akan berupa rentetan teks hitam putih yang berjejer kaku dari atas ke bawah.
                  </p>
                </div>
                <div className="md:w-1/3 border-4 border-black shadow-neo-md rotate-2 hover:rotate-0 transition-transform flex items-center justify-center bg-white p-4 h-auto min-h-[200px]">
                  <img 
                    src="/pengenalan-css/image1.jpg" 
                    alt="Analogi Rumah" 
                    className="w-full h-full object-cover border-4 border-black shadow-neo-sm" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-canvas border-4 border-black p-6 shadow-neo-sm hover:-translate-y-2 hover:shadow-neo-md transition-transform flex flex-col items-center text-center">
                  <span className="material-symbols-outlined text-5xl text-jade-vibrant mb-4 bg-white rounded-full p-3 border-4 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">format_color_text</span>
                  <h3 className="text-xl font-black text-black uppercase mb-3 tracking-widest">Tampilan</h3>
                  <p className="text-base font-bold text-forest-teal">Mengubah warna cerah, ukuran, dan jenis huruf keren.</p>
                </div>
                <div className="bg-pine-deep border-4 border-black p-6 shadow-neo-sm hover:-translate-y-2 hover:shadow-neo-md transition-transform flex flex-col items-center text-center">
                  <span className="material-symbols-outlined text-5xl text-white mb-4 bg-black rounded-full p-3 border-4 border-white shadow-[2px_2px_0px_rgba(255,255,255,1)]">view_quilt</span>
                  <h3 className="text-xl font-black text-white uppercase mb-3 tracking-widest">Tata Letak</h3>
                  <p className="text-base font-bold text-mint-soft">Mengatur letak elemen presisi (sebelahan atau tumpuk).</p>
                </div>
                <div className="bg-jade-vibrant border-4 border-black p-6 shadow-neo-sm hover:-translate-y-2 hover:shadow-neo-md transition-transform flex flex-col items-center text-center">
                  <span className="material-symbols-outlined text-5xl text-black mb-4 bg-mint-soft rounded-full p-3 border-4 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">animation</span>
                  <h3 className="text-xl font-black text-black uppercase mb-3 tracking-widest">Animasi</h3>
                  <p className="text-base font-bold text-black">Memberikan efek interaktif memukau (seperti *hover*).</p>
                </div>
                <div className="bg-white border-4 border-black p-6 shadow-neo-sm hover:-translate-y-2 hover:shadow-neo-md transition-transform flex flex-col items-center text-center">
                  <span className="material-symbols-outlined text-5xl text-black mb-4 bg-canvas rounded-full p-3 border-4 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">devices</span>
                  <h3 className="text-xl font-black text-black uppercase mb-3 tracking-widest">Responsif</h3>
                  <p className="text-base font-bold text-forest-teal">Menyesuaikan desain otomatis di HP, Tablet, & Laptop.</p>
                </div>
              </div>
            </section>

            {/* Section 2: Pemisahan Tugas */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-black text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">2</span>
                Kenapa Harus Dipisah?
              </h2>

              <div className="flex flex-col xl:flex-row gap-10 mb-10 items-stretch">
                <div className="xl:w-3/5 space-y-6">
                  <p className="text-lg md:text-xl font-bold text-forest-teal leading-relaxed bg-white border-4 border-black p-5 shadow-neo-sm">
                    Dulu (sebelum CSS diciptakan oleh Håkon Wium Lie), developer harus capek menuliskan gaya visual langsung di dalam setiap baris tag HTML. Bayangkan jika kamu punya 100 halaman, dan ingin mengubah warna judul dari biru ke merah. Kamu harus mengedit 100 file HTML satu per satu secara manual!
                  </p>
                  <p className="text-lg md:text-xl font-bold text-forest-teal leading-relaxed bg-white border-4 border-black p-5 shadow-neo-sm">
                    Dengan CSS, kita menerapkan prinsip sakti <strong className="bg-pine-deep text-white px-2 py-1 border-2 border-black uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)]">Separation of Concerns</strong> (Pemisahan Tugas). HTML murni mengurus <strong className="text-black uppercase underline decoration-4 decoration-jade-vibrant">Struktur</strong>, sementara CSS murni mengurus <strong className="text-black uppercase underline decoration-4 decoration-jade-vibrant">Tampilan</strong>. Kini, cukup ubah 1 file CSS, dan warna judul di 100 halaman akan berubah instan bersamaan!
                  </p>
                </div>
                
                {/* Visual Before/After Brutalist */}
                <div className="xl:w-2/5 flex flex-col gap-6 w-full">
                  <div className="rotate-1 hover:rotate-0 transition-transform flex flex-col shadow-neo-md">
                    <div className="bg-black text-white border-4 border-black border-b-0 px-4 py-2 self-start font-black text-sm md:text-base uppercase tracking-widest z-10 relative">Zaman Dulu (HTML)</div>
                    <CodeBlock 
                      language="html" 
                      code={`<font color="red" size="5">Judul</font>`} 
                    />
                  </div>
                  <div className="-rotate-1 hover:rotate-0 transition-transform flex flex-col shadow-neo-md">
                    <div className="bg-jade-vibrant text-black border-4 border-black border-b-0 px-4 py-2 self-start font-black text-sm md:text-base uppercase tracking-widest z-10 relative">Zaman Now (CSS)</div>
                    <CodeBlock 
                      language="css" 
                      code={`h1 { \n  color: red; \n  font-size: 24px; \n}`} 
                    />
                  </div>
                </div>
              </div>

              {/* Callout Box */}
              <div className="bg-mint-soft border-4 border-black p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-center shadow-neo-md transform rotate-1 hover:-rotate-1 transition-transform">
                <span className="material-symbols-outlined text-[80px] md:text-[100px] text-black drop-shadow-[4px_4px_0px_rgba(255,255,255,1)]">speed</span>
                <p className="text-xl md:text-3xl font-black text-black uppercase leading-tight text-center md:text-left tracking-tighter">
                  "Website memuat lebih cepat karena file CSS hanya didownload 1x oleh browser dan disimpan (cache) untuk halaman lainnya!"
                </p>
              </div>
            </section>

            {/* Section 3: Arti CSS */}
            <section className="bg-pine-deep text-white border-4 border-black shadow-neo-xl p-6 md:p-12">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white uppercase mb-8 md:mb-10 border-b-4 border-white pb-4 flex items-center gap-3 md:gap-4 tracking-tighter drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                <span className="bg-white text-black w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] flex-shrink-0 text-2xl md:text-4xl">3</span>
                Makna "Cascading"
              </h2>

              <p className="text-lg md:text-xl font-bold text-mint-soft leading-relaxed mb-10">
                Pernah penasaran dari mana nama <strong>Cascading Style Sheets</strong> berasal? Mari kita bedah namanya dengan brutal!
              </p>

              <div className="space-y-8">
                <div className="flex flex-col lg:flex-row border-4 border-black bg-white shadow-neo-md group hover:-translate-x-2 hover:-translate-y-2 hover:shadow-neo-lg transition-all text-black">
                  <div className="bg-black p-8 border-b-4 lg:border-b-0 lg:border-r-4 border-black flex flex-col justify-center items-center w-full lg:w-1/3">
                    <span className="material-symbols-outlined text-6xl md:text-[80px] text-white mb-4 group-hover:scale-110 transition-transform drop-shadow-[4px_4px_0px_rgba(45,212,191,1)]">water_drop</span>
                    <h3 className="text-2xl md:text-3xl font-black text-white uppercase text-center tracking-widest">Cascading</h3>
                  </div>
                  <div className="p-6 md:p-8 flex items-center bg-mint-canvas flex-1">
                    <p className="text-lg md:text-xl font-bold text-forest-teal leading-relaxed">
                      Artinya "Air Terjun". Menandakan bahwa aturan desain mengalir deras dari atas ke bawah. Jika ada dua aturan saling bertentangan untuk target yang sama, maka aturan yang <strong className="text-black uppercase underline decoration-4 decoration-jade-vibrant">paling bawah</strong> atau paling spesifik yang akan memenangkan pertarungan!
                    </p>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row border-4 border-black bg-white shadow-neo-md group hover:-translate-x-2 hover:-translate-y-2 hover:shadow-neo-lg transition-all text-black">
                  <div className="bg-jade-vibrant p-8 border-b-4 lg:border-b-0 lg:border-r-4 border-black flex flex-col justify-center items-center w-full lg:w-1/3">
                    <span className="material-symbols-outlined text-6xl md:text-[80px] text-black mb-4 group-hover:scale-110 transition-transform drop-shadow-[4px_4px_0px_rgba(255,255,255,1)]">style</span>
                    <h3 className="text-2xl md:text-3xl font-black text-black uppercase text-center tracking-widest">Style Sheets</h3>
                  </div>
                  <div className="p-6 md:p-8 flex items-center bg-mint-canvas flex-1">
                    <p className="text-lg md:text-xl font-bold text-forest-teal leading-relaxed">
                      "Lembaran Gaya". Bukti bahwa CSS adalah dokumen terpisah (lembaran eksklusif) yang khusus diciptakan berisi aturan-aturan murni untuk merias dokumen kerangka lainnya (HTML).
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Footer / Penutup */}
            <footer className="bg-jade-vibrant border-4 border-black p-8 md:p-12 shadow-neo-xl text-center relative rotate-1 hover:rotate-0 transition-transform">
              <span className="material-symbols-outlined absolute -top-4 -right-4 md:-top-6 md:-right-6 text-5xl md:text-6xl text-white bg-pine-deep rounded-none border-4 border-black p-3 shadow-neo-md hover:scale-110 transition-transform cursor-pointer">handshake</span>
              <p className="text-2xl md:text-4xl font-black text-white uppercase leading-relaxed max-w-4xl mx-auto drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] tracking-tight">
                "HTML dan CSS adalah dua sahabat sejati yang mutlak tidak terpisahkan dalam membentuk wajah sebuah Website Modern!"
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

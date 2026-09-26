"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import CodeBlock from '@/components/CodeBlock';

export default function TipografiPage() {
  return (
    <>
      <Headbar
        links={[
          { label: 'Materi', href: '/tipografi', isActive: true },
          { label: 'Soal Teori', href: '/tipografi/soal', isActive: false }
        ]}
      />

      <div className="flex pt-[88px] min-h-screen">
        <Sidebar />

        <main className="md:ml-[280px] w-full p-4 md:p-10 bg-canvas relative" style={{ backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">

            <section className="bg-white border-4 border-black p-6 md:p-12 shadow-neo-xl text-center relative overflow-hidden transform rotate-1 hover:rotate-0 transition-transform">
              <div className="absolute top-0 left-0 bg-jade-vibrant text-white font-black px-4 py-1 border-b-4 border-r-4 border-black shadow-neo-sm z-20">
                MATERI 06
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-black tracking-tighter uppercase mt-6 mb-4 md:mb-6">
                Tipografi & Font
              </h1>
              <p className="text-base md:text-xl font-bold text-white bg-forest-teal inline-block px-4 py-2 md:px-6 md:py-3 border-4 border-black mb-4 md:mb-6 shadow-neo-md uppercase tracking-tight">
                CSS bisa mengubah tampilan teks pada website-mu menjadi lebih menarik dan profesional!
              </p>
            </section>

            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="material-symbols-outlined text-4xl md:text-5xl text-white bg-pine-deep p-2 border-4 border-black shadow-neo-sm flex-shrink-0">font_download</span>
                Properti Utama Tipografi
              </h2>

              <div className="flex flex-col xl:flex-row gap-8 lg:gap-10 mb-16 items-stretch">
                <div className="xl:w-1/2 space-y-8">
                  <p className="font-bold text-forest-teal text-lg md:text-xl leading-relaxed bg-mint-canvas p-4 border-4 border-black shadow-neo-sm">
                    Lima properti di bawah ini adalah dasar utama yang wajib dikuasai untuk mengatur tipografi di CSS:
                  </p>
                  
                  <ul className="space-y-6">
                    <li className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-canvas border-4 border-black p-4 shadow-neo-sm hover:translate-x-2 transition-transform">
                      <span className="bg-white p-2 border-4 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] text-2xl flex-shrink-0">📌</span>
                      <div>
                        <strong className="block text-xl uppercase font-black text-black tracking-widest mb-1">font-family</strong>
                        <p className="font-bold text-forest-teal text-base">Jenis/gaya nama wajah huruf (Misal: Arial, Times New Roman, Roboto, Outfit).</p>
                      </div>
                    </li>
                    <li className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-canvas border-4 border-black p-4 shadow-neo-sm hover:translate-x-2 transition-transform">
                      <span className="bg-white p-2 border-4 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] text-2xl flex-shrink-0">📏</span>
                      <div>
                        <strong className="block text-xl uppercase font-black text-black tracking-widest mb-1">font-size</strong>
                        <p className="font-bold text-forest-teal text-base">Besaran skala huruf (Sangat disarankan menggunakan satuan relatif <code className="bg-black text-white px-1 font-black">rem</code> atau <code className="bg-black text-white px-1 font-black">em</code>).</p>
                      </div>
                    </li>
                    <li className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-canvas border-4 border-black p-4 shadow-neo-sm hover:translate-x-2 transition-transform">
                      <span className="bg-white p-2 border-4 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] text-2xl flex-shrink-0">💪</span>
                      <div>
                        <strong className="block text-xl uppercase font-black text-black tracking-widest mb-1">font-weight</strong>
                        <p className="font-bold text-forest-teal text-base">Ketebalan huruf. Skala angka <code className="bg-white px-1 border-2 border-black text-black">400</code> untuk normal, <code className="bg-white px-1 border-2 border-black text-black">700</code> atau <code className="bg-white px-1 border-2 border-black text-black">900</code> untuk ekstra tebal/bold.</p>
                      </div>
                    </li>
                    <li className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-canvas border-4 border-black p-4 shadow-neo-sm hover:translate-x-2 transition-transform">
                      <span className="bg-white p-2 border-4 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] text-2xl flex-shrink-0">↔️</span>
                      <div>
                        <strong className="block text-xl uppercase font-black text-black tracking-widest mb-1">text-align</strong>
                        <p className="font-bold text-forest-teal text-base">Perataan blok teks paragraf (<code className="bg-white text-black px-1">left</code>, <code className="bg-white text-black px-1">right</code>, <code className="bg-white text-black px-1">center</code>, atau merata <code className="bg-white text-black px-1">justify</code>).</p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div className="xl:w-1/2 w-full flex flex-col bg-black border-4 border-black p-1 shadow-neo-lg transform rotate-1 hover:rotate-0 transition-transform">
                   <div className="bg-mint-soft border-b-4 border-black p-3 font-black uppercase text-center text-black tracking-widest">Sintaks Tipografi Lengkap</div>
                  <div className="flex-grow p-1">
                    <CodeBlock 
                      language="css" 
                      code={`p {
  font-family: 'Outfit', sans-serif;
  font-size: 1.2rem;
  font-weight: 700;
  text-align: center;
  
  /* Jarak antar baris text */
  line-height: 1.6;
  
  /* Menghilangkan garis bawah / hiasan text */
  text-decoration: none;
}`} 
                    />
                  </div>
                </div>
              </div>

              {/* Google Fonts Highlight */}
              <div className="bg-jade-vibrant border-4 border-black p-6 md:p-10 shadow-neo-xl relative mt-16 flex flex-col md:flex-row gap-8 items-center transform -rotate-1 hover:rotate-0 transition-transform">
                <span className="material-symbols-outlined text-[80px] md:text-[100px] text-black bg-white rounded-full p-4 border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] flex-shrink-0">lightbulb</span>
                <div className="text-white space-y-4">
                  <h3 className="text-2xl md:text-4xl font-black uppercase text-black drop-shadow-[2px_2px_0px_rgba(255,255,255,1)] tracking-tighter border-b-4 border-black pb-2">Kekuatan Google Fonts!</h3>
                  <p className="text-base md:text-xl font-bold leading-relaxed bg-black p-4 border-4 border-white shadow-[4px_4px_0px_rgba(255,255,255,1)]">
                    Pernah melihat baris misterius <code className="bg-mint-canvas text-black px-2 py-1 border-2 border-black font-black uppercase tracking-widest block sm:inline-block mt-2 sm:mt-0">&lt;link href="...fonts.googleapis.com..."&gt;</code> di dalam HTML orang lain?
                  </p>
                  <p className="text-base md:text-xl font-bold leading-relaxed text-black bg-mint-soft p-4 border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                    Itu adalah cara mengimpor font dari layanan eksternal (seperti Google Fonts) agar dapat langsung digunakan pada properti <strong className="bg-white text-black px-2 uppercase border-2 border-black">font-family</strong> CSS-mu, tanpa mengharuskan pengunjung menginstal font tersebut di perangkat mereka!
                  </p>
                </div>
              </div>

              {/* Advanced Typography */}
              <div className="bg-pine-deep text-white border-4 border-black p-6 md:p-12 shadow-neo-xl mt-16 flex flex-col xl:flex-row gap-10 items-stretch transform rotate-1 hover:rotate-0 transition-transform">
                <div className="xl:w-1/2 space-y-8">
                  <h3 className="text-2xl md:text-4xl font-black uppercase flex items-center gap-3 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] text-jade-vibrant tracking-tighter">
                    <span className="material-symbols-outlined text-4xl md:text-5xl bg-white text-black p-2 rounded-none border-4 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">text_format</span>
                    Dekorasi & Spasi Mikro
                  </h3>
                  <p className="font-bold text-lg md:text-xl leading-relaxed bg-black p-4 border-4 border-white shadow-[4px_4px_0px_rgba(255,255,255,1)]">
                    Selain memilih jenis huruf, kita juga perlu mengatur detail dekorasi dan spasi untuk meningkatkan <em>readability</em> (keterbacaan) teks bagi pengguna:
                  </p>
                  <ul className="space-y-6">
                    <li className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white text-black border-4 border-black p-4 shadow-neo-sm hover:translate-x-2 transition-transform">
                      <span className="bg-canvas p-2 border-4 border-black text-2xl flex-shrink-0">✨</span>
                      <div>
                        <strong className="block text-xl uppercase font-black text-black tracking-widest mb-1 drop-shadow-[1px_1px_0px_rgba(45,212,191,1)]">text-transform</strong>
                        <p className="font-bold text-forest-teal text-base">Mengubah kapitalisasi teks menjadi <code className="bg-black text-white px-2 py-1 border-2 border-black">uppercase</code> (KAPITAL SEMUA), <code className="bg-black text-white px-2 py-1 border-2 border-black">lowercase</code> (kecil semua), atau <code className="bg-black text-white px-2 py-1 border-2 border-black">capitalize</code> (Huruf Besar Di Awal).</p>
                      </div>
                    </li>
                    <li className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white text-black border-4 border-black p-4 shadow-neo-sm hover:translate-x-2 transition-transform">
                      <span className="bg-canvas p-2 border-4 border-black text-2xl flex-shrink-0">↕️</span>
                      <div>
                        <strong className="block text-xl uppercase font-black text-black tracking-widest mb-1 drop-shadow-[1px_1px_0px_rgba(45,212,191,1)]">line-height</strong>
                        <p className="font-bold text-forest-teal text-base">Mengatur jarak antar baris dalam suatu paragraf agar teks tidak terlalu berdempetan dan lebih nyaman dibaca.</p>
                      </div>
                    </li>
                    <li className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white text-black border-4 border-black p-4 shadow-neo-sm hover:translate-x-2 transition-transform">
                      <span className="bg-canvas p-2 border-4 border-black text-2xl flex-shrink-0">➖</span>
                      <div>
                        <strong className="block text-xl uppercase font-black text-black tracking-widest mb-1 drop-shadow-[1px_1px_0px_rgba(45,212,191,1)]">text-decoration</strong>
                        <p className="font-bold text-forest-teal text-base">Memberikan efek garis pada teks, seperti garis bawah (<code className="bg-black text-white px-1">underline</code>), coretan (<code className="bg-black text-white px-1">line-through</code>), atau menghilangkannya (<code className="bg-black text-white px-1 text-jade-vibrant uppercase font-black">none</code> - sering digunakan untuk menghilangkan garis bawah bawaan pada link).</p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div className="xl:w-1/2 w-full flex flex-col bg-black border-4 border-white p-1 shadow-[6px_6px_0px_rgba(255,255,255,1)] transform -rotate-1 hover:rotate-0 transition-transform">
                   <div className="bg-mint-soft border-b-4 border-white p-3 font-black uppercase text-center text-black tracking-widest">Penyesuaian Mikro CSS</div>
                  <div className="flex-grow p-1">
                    <CodeBlock 
                      language="css" 
                      code={`.artikel {
  text-transform: capitalize;
  
  /* Rahasia readibility: Spasi baris 1.8x */
  line-height: 1.8; 
  
  /* Merenggangkan jarak antar huruf */
  letter-spacing: 1px; 
}

a.link-bersih {
  /* Hilangkan garis bawah default biru bawaan */
  text-decoration: none; 
}`} 
                    />
                  </div>
                </div>
              </div>

            </section>

            {/* Footer / Penutup */}
            <footer className="bg-jade-vibrant border-4 border-black p-8 md:p-12 shadow-neo-xl text-center relative hover:-translate-y-1 transition-transform">
              <span className="material-symbols-outlined absolute -top-4 -right-4 md:-top-6 md:-right-6 text-5xl md:text-6xl text-white bg-black rounded-none border-4 border-white p-3 shadow-[4px_4px_0px_rgba(255,255,255,1)] hover:scale-110 transition-transform cursor-pointer">edit_document</span>
              <p className="text-2xl md:text-4xl font-black text-black uppercase leading-relaxed max-w-4xl mx-auto drop-shadow-[2px_2px_0px_rgba(255,255,255,1)] tracking-tight">
                "Tipografi yang dipilih dan diatur dengan baik akan memberikan karakter visual yang kuat dan meningkatkan kenyamanan membaca pada website-mu!"
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

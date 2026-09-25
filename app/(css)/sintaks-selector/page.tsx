"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import CodeBlock from '@/components/CodeBlock';

export default function SintaksSelectorPage() {
  return (
    <>
      <Headbar
        links={[
          { label: 'Materi', href: '/sintaks-selector', isActive: true },
          { label: 'Soal Teori', href: '/sintaks-selector/soal', isActive: false }
        ]}
      />

      <div className="flex pt-[88px] min-h-screen">
        <Sidebar />

        <main className="md:ml-[280px] w-full p-4 md:p-10 bg-canvas relative" style={{ backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">

            <section className="bg-white border-4 border-black p-6 md:p-12 shadow-neo-xl text-center relative overflow-hidden transform rotate-1 hover:rotate-0 transition-transform">
              <div className="absolute top-0 left-0 bg-jade-vibrant text-white font-black px-4 py-1 border-b-4 border-r-4 border-black shadow-neo-sm z-20">
                MATERI 03
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-black tracking-tighter uppercase mt-6 mb-4 md:mb-6">
                Sintaks & Selector
              </h1>
              <p className="text-base md:text-xl font-bold text-white bg-forest-teal inline-block px-4 py-2 md:px-6 md:py-3 border-4 border-black mb-4 md:mb-6 shadow-neo-md uppercase tracking-tight">
                Setiap blok CSS selalu mutlak terdiri dari 3 organ inti: Selector, Property, dan Value.
              </p>
            </section>

            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 tracking-tighter">
                Anatomi Kode CSS
              </h2>

              <div className="flex flex-col xl:flex-row gap-8 lg:gap-10 mb-16 items-stretch">
                <div className="xl:w-1/2 space-y-6">
                  <ul className="space-y-6">
                    <li className="bg-canvas p-4 border-4 border-black font-bold flex flex-col sm:flex-row gap-4 items-start sm:items-center shadow-neo-sm hover:translate-x-2 transition-transform">
                      <span className="text-4xl bg-white border-4 border-black p-2 shadow-[2px_2px_0px_rgba(0,0,0,1)] flex-shrink-0">🎯</span>
                      <div>
                        <strong className="text-xl md:text-2xl block uppercase tracking-widest mb-1 text-black">Selector</strong>
                        <span className="text-forest-teal text-base md:text-lg">Objek siapa yang mau ditargetkan dan didandani?</span>
                      </div>
                    </li>
                    <li className="bg-canvas p-4 border-4 border-black font-bold flex flex-col sm:flex-row gap-4 items-start sm:items-center shadow-neo-sm hover:translate-x-2 transition-transform">
                      <span className="text-4xl bg-white border-4 border-black p-2 shadow-[2px_2px_0px_rgba(0,0,0,1)] flex-shrink-0">🎨</span>
                      <div>
                        <strong className="text-xl md:text-2xl block uppercase tracking-widest mb-1 text-black">Property</strong>
                        <span className="text-forest-teal text-base md:text-lg">Sifat atau bagian tubuh apa yang mau diubah (warna, ukuran)?</span>
                      </div>
                    </li>
                    <li className="bg-pine-deep text-white p-4 border-4 border-black font-bold flex flex-col sm:flex-row gap-4 items-start sm:items-center shadow-neo-sm hover:translate-x-2 transition-transform">
                      <span className="text-4xl bg-black border-4 border-white p-2 shadow-[2px_2px_0px_rgba(255,255,255,1)] flex-shrink-0">🔢</span>
                      <div>
                        <strong className="text-xl md:text-2xl block uppercase tracking-widest mb-1 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">Value</strong>
                        <span className="text-mint-soft text-base md:text-lg">Nilai spesifik dari perubahannya (merah, 120px)?</span>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="xl:w-1/2 w-full flex flex-col bg-black border-4 border-black p-1 shadow-neo-lg transform rotate-1 hover:rotate-0 transition-transform">
                  <div className="bg-mint-soft border-b-4 border-black p-3 font-black uppercase text-center text-black tracking-widest">Sintaks Fundamental CSS</div>
                  <div className="flex-grow p-1">
                    <CodeBlock
                      language="css"
                      code={`/* 1. Targetkan (Selector) */
h1 {
  /* 2. Sifat (Property) : 3. Isi (Value); */
  color: blue;
  font-size: 24px;
}`}
                    />
                  </div>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 tracking-tighter mt-16">
                Tiga Selector Dasar
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                <div className="bg-white border-4 border-black p-6 md:p-8 shadow-neo-md hover:-translate-y-2 hover:shadow-neo-lg transition-all flex flex-col">
                  <div className="bg-mint-canvas border-4 border-black px-4 py-2 inline-block font-black uppercase text-sm mb-6 self-start tracking-widest shadow-[2px_2px_0px_rgba(0,0,0,1)]">Tag Selector</div>
                  <p className="font-bold text-forest-teal text-base md:text-lg mb-6 flex-1">Menargetkan murni berdasarkan nama tag HTML aslinya. Akan mengubah <strong className="bg-jade-vibrant text-black px-2 py-1 border-2 border-black uppercase font-black">semua</strong> elemen tersebut dalam 1 halaman.</p>
                  <div className="bg-black border-4 border-black p-1 shadow-neo-sm transform rotate-1 hover:rotate-0 transition-transform">
                    <CodeBlock language="css" code={`p {\n  color: red;\n}`} />
                  </div>
                </div>

                <div className="bg-white border-4 border-black p-6 md:p-8 shadow-neo-md hover:-translate-y-2 hover:shadow-neo-lg transition-all flex flex-col">
                  <div className="bg-pine-deep text-white border-4 border-black px-4 py-2 inline-block font-black uppercase text-sm mb-6 self-start tracking-widest shadow-[2px_2px_0px_rgba(0,0,0,1)]">Class (.) Selector</div>
                  <p className="font-bold text-forest-teal text-base md:text-lg mb-6 flex-1">Cara selector paling fleksibel! Menargetkan elemen yang memiliki atribut <code>class="nama"</code> spesifik. Bebas dipakai berulang kali tanpa batas.</p>
                  <div className="bg-black border-4 border-black p-1 shadow-neo-sm transform -rotate-1 hover:rotate-0 transition-transform">
                    <CodeBlock language="css" code={`.btn {\n  background: blue;\n}`} />
                  </div>
                </div>

                <div className="bg-white border-4 border-black p-6 md:p-8 shadow-neo-md hover:-translate-y-2 hover:shadow-neo-lg transition-all flex flex-col">
                  <div className="bg-jade-vibrant text-black border-4 border-black px-4 py-2 inline-block font-black uppercase text-sm mb-6 self-start tracking-widest shadow-[2px_2px_0px_rgba(0,0,0,1)]">ID (#) Selector</div>
                  <p className="font-bold text-forest-teal text-base md:text-lg mb-6 flex-1">Super eksklusif. Menargetkan hanya SATU elemen mutlak di seluruh halaman yang memegang kunci atribut <code>id="nama"</code> tersebut.</p>
                  <div className="bg-black border-4 border-black p-1 shadow-neo-sm transform rotate-1 hover:rotate-0 transition-transform">
                    <CodeBlock language="css" code={`#navbar {\n  height: 60px;\n}`} />
                  </div>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mt-16 mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-black text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-3xl md:text-5xl font-black">+</span>
                Kombinasi & Pengaturan Massal
              </h2>
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
                {/* Grouping Selector */}
                <div className="bg-canvas border-4 border-black p-6 md:p-10 shadow-neo-md flex-1 hover:-translate-y-1 hover:shadow-neo-lg transition-transform">
                  <h3 className="text-xl md:text-3xl font-black uppercase mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-3 tracking-widest">
                    <span className="material-symbols-outlined bg-white text-black p-2 border-4 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] text-3xl md:text-4xl">group</span>
                    Grouping (,)
                  </h3>
                  <p className="font-bold text-forest-teal mb-8 text-base md:text-lg leading-relaxed bg-white border-4 border-black p-4">
                    Jika kamu ingin memberikan gaya seragam mutlak untuk beberapa jenis elemen berbeda, gunakan koma untuk memilih dan mengaturnya secara bersamaan!
                  </p>
                  <div className="bg-black border-4 border-black p-1 shadow-[4px_4px_0px_rgba(0,0,0,1)] rotate-1 hover:rotate-0 transition-transform">
                    <div className="bg-mint-soft border-b-4 border-black p-2 font-black uppercase text-center text-xs text-black">Grouping Koma</div>
                    <CodeBlock
                      language="css"
                      code={`/* Targetkan ketiganya secara bersamaan! */
h1, h2, p {
  text-align: center;
  color: var(--pine-deep);
}`}
                    />
                  </div>
                </div>

                {/* Universal Selector */}
                <div className="bg-jade-vibrant border-4 border-black p-6 md:p-10 shadow-neo-md flex-1 text-white hover:-translate-y-1 hover:shadow-neo-lg transition-transform">
                  <h3 className="text-xl md:text-3xl font-black uppercase mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-3 tracking-widest drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                    <span className="material-symbols-outlined bg-black text-white p-2 border-4 border-white shadow-[2px_2px_0px_rgba(255,255,255,1)] text-3xl md:text-4xl">public</span>
                    Universal (*)
                  </h3>
                  <p className="font-bold text-black mb-8 text-base md:text-lg leading-relaxed bg-white border-4 border-black p-4 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                    Cara paling instan. Menargetkan <strong>SELURUH ELEMEN</strong> di dalam halaman sekaligus. Sering digunakan developer untuk me-reset format bawaan browser.
                  </p>
                  <div className="bg-black border-4 border-white p-1 shadow-[4px_4px_0px_rgba(255,255,255,1)] -rotate-1 hover:rotate-0 transition-transform">
                    <div className="bg-mint-soft border-b-4 border-white p-2 font-black uppercase text-center text-xs text-black">Reset Massal Bintang</div>
                    <CodeBlock
                      language="css"
                      code={`/* Senjata Reset HTML (Wajib untuk Proyek Besar) */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}`}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Footer / Penutup */}
            <footer className="bg-pine-deep border-4 border-black p-8 md:p-12 shadow-neo-xl text-center relative hover:-translate-y-1 transition-transform">
              <span className="material-symbols-outlined absolute -top-4 -right-4 md:-top-6 md:-right-6 text-5xl md:text-6xl text-black bg-mint-soft rounded-none border-4 border-black p-3 shadow-neo-md hover:scale-110 transition-transform cursor-pointer">sports_score</span>
              <p className="text-2xl md:text-4xl font-black text-white uppercase leading-relaxed max-w-4xl mx-auto drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] tracking-tight">
                "Kuasai penggunaan Selector dengan presisi, maka kamu akan dapat mendesain dan mengatur setiap elemen halaman web dengan sangat akurat!"
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

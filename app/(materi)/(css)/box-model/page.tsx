"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import CodeBlock from '@/components/CodeBlock';

export default function BoxModelPage() {
  return (
    <>
      <Headbar
        links={[
          { label: 'Materi', href: '/box-model', isActive: true },
          { label: 'Soal Teori', href: '/box-model/soal', isActive: false }
        ]}
      />

      <div className="flex pt-[88px] min-h-screen">
        <Sidebar />

        <main className="md:ml-[280px] w-full p-4 md:p-10 bg-canvas relative" style={{ backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">

            <section className="bg-white border-4 border-black p-6 md:p-12 shadow-neo-xl text-center relative overflow-hidden transform rotate-1 hover:rotate-0 transition-transform">
              <div className="absolute top-0 left-0 bg-jade-vibrant text-white font-black px-4 py-1 border-b-4 border-r-4 border-black shadow-neo-sm z-20">
                MATERI 09
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-black tracking-tighter uppercase mt-6 mb-4 md:mb-6">
                Konsep Box Model
              </h1>
              <p className="text-base md:text-xl font-bold text-white bg-forest-teal inline-block px-4 py-2 md:px-6 md:py-3 border-4 border-black mb-4 md:mb-6 shadow-neo-md uppercase tracking-tight">
                Setiap elemen HTML pada halaman web pada dasarnya direpresentasikan sebagai sebuah kotak (box).
              </p>
            </section>

            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="material-symbols-outlined text-4xl md:text-5xl text-white bg-pine-deep p-2 border-4 border-black shadow-neo-sm flex-shrink-0">crop_square</span>
                Anatomi Sebuah Kotak
              </h2>

              <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 mb-12 items-stretch">
                <div className="lg:w-1/2 space-y-8">
                  <p className="font-bold text-forest-teal text-lg md:text-xl leading-relaxed bg-mint-canvas p-4 border-4 border-black shadow-neo-sm">
                    Setiap kotak dalam CSS selalu terdiri dari 4 lapisan utama dari dalam ke luar:
                  </p>
                  <ul className="space-y-6">
                    <li className="flex items-start gap-4 bg-white border-4 border-black p-4 shadow-neo-sm hover:-translate-y-1 hover:shadow-neo-md transition-transform">
                      <span className="bg-jade-vibrant text-white px-3 py-1 border-4 border-black font-black text-xl shadow-[2px_2px_0px_rgba(0,0,0,1)] flex-shrink-0">1</span>
                      <div>
                        <strong className="block text-xl md:text-2xl uppercase font-black mb-1">Content</strong>
                        <p className="font-bold text-forest-teal">Isi asli dari kotaknya (seperti teks panjang atau sebuah gambar).</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4 bg-white border-4 border-black p-4 shadow-neo-sm hover:-translate-y-1 hover:shadow-neo-md transition-transform">
                      <span className="bg-mint-soft text-black px-3 py-1 border-4 border-black font-black text-xl shadow-[2px_2px_0px_rgba(0,0,0,1)] flex-shrink-0">2</span>
                      <div>
                        <strong className="block text-xl md:text-2xl uppercase font-black mb-1">Padding</strong>
                        <p className="font-bold text-forest-teal">Ruang bernapas di <em>dalam</em> kotak (jarak antara tulisan dengan garis tepi).</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4 bg-white border-4 border-black p-4 shadow-neo-sm hover:-translate-y-1 hover:shadow-neo-md transition-transform">
                      <span className="bg-black text-white px-3 py-1 border-4 border-white font-black text-xl shadow-[2px_2px_0px_rgba(255,255,255,1)] flex-shrink-0">3</span>
                      <div>
                        <strong className="block text-xl md:text-2xl uppercase font-black mb-1">Border</strong>
                        <p className="font-bold text-forest-teal">Garis pembatas fisik kotak. Gunakan <code className="bg-mint-canvas px-1 border-2 border-black font-black text-sm text-black">border-radius</code> untuk membuat sudutnya membulat.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4 bg-white border-4 border-black p-4 shadow-neo-sm hover:-translate-y-1 hover:shadow-neo-md transition-transform">
                      <span className="bg-pine-deep text-white px-3 py-1 border-4 border-black font-black text-xl shadow-[2px_2px_0px_rgba(0,0,0,1)] flex-shrink-0">4</span>
                      <div>
                        <strong className="block text-xl md:text-2xl uppercase font-black mb-1">Margin</strong>
                        <p className="font-bold text-forest-teal">Jarak tolak di <em>luar</em> kotak (untuk mendorong elemen/kotak lain agar tidak saling menempel).</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="lg:w-1/2 flex items-center justify-center p-6 bg-canvas border-4 border-black shadow-neo-md">
                  {/* Visualisasi Box Model Brutalist */}
                  <div className="w-full max-w-sm aspect-square bg-mint-canvas border-4 border-dashed border-black relative flex items-center justify-center hover:scale-105 hover:-rotate-1 transition-transform group cursor-default">
                    <span className="absolute top-2 left-2 text-xs md:text-sm font-black uppercase tracking-widest text-black/60 bg-white px-2 border-2 border-black">Margin</span>
                    
                    <div className="w-[80%] h-[80%] bg-black relative flex items-center justify-center shadow-neo-sm">
                      <span className="absolute -top-5 md:-top-6 left-1/2 -translate-x-1/2 text-xs md:text-sm font-black uppercase tracking-widest text-black bg-white px-2 border-2 border-black z-10 whitespace-nowrap">Border (Garis Tepi)</span>
                      
                      <div className="w-[90%] h-[90%] bg-jade-vibrant relative flex items-center justify-center border-4 border-dashed border-white">
                        <span className="absolute top-2 left-2 text-[10px] md:text-xs font-black uppercase tracking-widest text-black bg-white px-1 border-2 border-black">Padding</span>
                        
                        <div className="w-[60%] h-[60%] bg-white border-4 border-black flex items-center justify-center shadow-neo-sm group-hover:scale-110 transition-transform">
                          <span className="text-base md:text-lg font-black uppercase tracking-widest text-black text-center">Content<br/>(Isi)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shorthand Section */}
              <div className="bg-pine-deep text-white border-4 border-black p-6 md:p-10 shadow-neo-xl mt-12 flex flex-col xl:flex-row gap-10 items-stretch transform -rotate-1 hover:rotate-0 transition-transform">
                <div className="xl:w-1/2 space-y-6">
                  <h3 className="text-2xl md:text-4xl font-black uppercase flex items-center gap-3 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                    <span className="material-symbols-outlined text-4xl md:text-5xl bg-jade-vibrant rounded-full p-2 border-4 border-black text-white">schedule</span>
                    Penulisan Shorthand
                  </h3>
                  <p className="font-bold text-lg md:text-xl leading-relaxed bg-black p-4 border-4 border-mint-soft">
                    Untuk membuat kode lebih ringkas dibanding menulis <code className="bg-white/20 px-1 border border-white font-black">margin-top</code>, <code className="bg-white/20 px-1 border border-white font-black">margin-right</code> secara terpisah, kita dapat menggunakan <strong className="text-jade-vibrant underline">Shorthand</strong>. Aturan ini berlaku untuk Margin maupun Padding.
                  </p>
                  <p className="font-black text-xl md:text-2xl leading-relaxed bg-white text-black p-4 border-4 border-black shadow-neo-sm inline-block uppercase tracking-tight">
                    Mengikuti Arah Jarum Jam: <br/><span className="text-jade-vibrant">ATAS ➡️ KANAN ➡️ BAWAH ➡️ KIRI</span>
                  </p>
                  <ul className="space-y-4 font-bold text-base md:text-lg">
                    <li className="flex gap-3 items-center"><span className="text-2xl text-jade-vibrant">🔹</span> <code className="bg-black text-white px-2 py-1 border-2 border-mint-soft font-black">margin: 10px;</code> (Menerapkan 10px untuk keempat sisi sekaligus)</li>
                    <li className="flex gap-3 items-center"><span className="text-2xl text-jade-vibrant">🔹</span> <code className="bg-black text-white px-2 py-1 border-2 border-mint-soft font-black">margin: 10px 20px;</code> (Atas-Bawah 10px, Kiri-Kanan 20px)</li>
                  </ul>
                  <div className="font-bold text-black text-base md:text-lg leading-relaxed mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-mint-soft p-4 border-4 border-black shadow-neo-sm">
                    <span className="material-symbols-outlined text-5xl">lightbulb</span>
                    <p><strong className="uppercase text-xl block mb-1 tracking-widest">Tips Tengah Horisontal:</strong> Menggunakan <code className="bg-white px-2 py-1 border-2 border-black font-black inline-block mt-1 sm:mt-0">margin: 0 auto;</code> akan langsung membuat elemen berada tepat di <strong className="underline decoration-2 underline-offset-2">tengah secara horizontal</strong> (syarat: elemen harus memiliki nilai width eksplisit).</p>
                  </div>
                </div>
                <div className="xl:w-1/2 w-full flex flex-col">
                  <CodeBlock 
                    language="css" 
                    code={`/* Cara Panjang (Penulisan Individual) */
.kotak {
  padding-top: 10px;
  padding-right: 20px;
  padding-bottom: 30px;
  padding-left: 40px;
}

/* Cara Ringkas (Shorthand) */
.kotak {
  /* Atas Kanan Bawah Kiri */
  padding: 10px 20px 30px 40px; 
}

/* Trik memosisikan kotak di tengah */
.tengah {
  width: 500px; /* Wajib ada lebar (width) */
  margin: 0 auto; /* Atas-bawah 0, Kiri-kanan Otomatis seimbang */
}`} 
                  />
                </div>
              </div>

              {/* CSS Reset Section */}
              <div className="bg-white text-black border-4 border-black p-6 md:p-10 shadow-neo-xl relative mt-16 flex flex-col lg:flex-row gap-10 items-stretch group hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-shadow">
                <div className="lg:w-1/2 flex flex-col justify-center space-y-6">
                  <h3 className="text-2xl md:text-4xl font-black uppercase flex items-center gap-3 text-black tracking-tighter">
                    <span className="material-symbols-outlined text-4xl md:text-5xl text-white bg-black p-2 border-4 border-black">warning</span>
                    CSS Reset Wajib!
                  </h3>
                  <p className="text-base md:text-lg font-bold text-forest-teal leading-relaxed">
                    Secara default, penambahan <code className="bg-mint-canvas text-black px-2 py-1 border-2 border-black font-black uppercase">padding</code> dan <code className="bg-mint-canvas text-black px-2 py-1 border-2 border-black font-black uppercase">border</code> akan menambah dimensi total ukuran elemen, yang seringkali mengacaukan perhitungan layout secara keseluruhan.
                  </p>
                  <p className="text-base md:text-lg font-bold text-forest-teal leading-relaxed mb-4 bg-mint-soft p-4 border-4 border-black shadow-neo-sm">
                    Gunakan teknik <strong className="text-black uppercase underline decoration-4 decoration-black">"CSS Reset"</strong> (menggunakan selektor universal <code className="bg-white px-2 border-2 border-black font-black text-black text-xl">*</code>) di awal dokumen CSS. Properti <code className="bg-jade-vibrant text-white px-2 py-1 border-2 border-black font-black">box-sizing: border-box;</code> akan memastikan lebar dan tinggi kotak tidak berubah meskipun kita menambahkan padding atau border.
                  </p>
                </div>
                <div className="lg:w-1/2 w-full flex flex-col bg-black border-4 border-black p-1 shadow-neo-md transform group-hover:scale-[1.02] transition-transform">
                  <div className="bg-mint-soft font-black uppercase text-center py-2 border-b-4 border-black">Letakkan Paling Atas CSS</div>
                  <div className="flex-grow p-1">
                    <CodeBlock 
                      language="css" 
                      code={`/* Pengaturan Awal (Reset CSS) */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box; /* Menjaga konsistensi ukuran box */
}`} 
                    />
                  </div>
                </div>
              </div>

            </section>

            {/* Footer / Penutup */}
            <footer className="bg-jade-vibrant border-4 border-black p-6 md:p-12 shadow-neo-xl text-center relative rotate-1 hover:rotate-0 transition-transform">
              <span className="material-symbols-outlined absolute -top-4 -right-4 md:-top-6 md:-right-6 text-5xl md:text-6xl text-white bg-pine-deep rounded-none border-4 border-black p-3 shadow-neo-md hover:scale-110 transition-transform cursor-pointer">inventory_2</span>
              <p className="text-2xl md:text-4xl font-black text-white uppercase leading-relaxed max-w-4xl mx-auto drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] tracking-tight">
                "Pemahaman mendalam mengenai Box Model merupakan kunci fundamental untuk menguasai penyusunan tata letak (layout) dan dimensi elemen di dalam CSS!"
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

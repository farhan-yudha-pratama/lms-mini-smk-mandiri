"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import CodeBlock from '@/components/CodeBlock';

export default function SpecificityCSSPage() {
  return (
    <>
      <Headbar
        links={[
          { label: 'Materi', href: '/specificity-css', isActive: true },
          { label: 'Soal Teori', href: '/specificity-css/soal', isActive: false }
        ]}
      />

      <div className="flex pt-[88px] min-h-screen">
        <Sidebar />

        <main className="md:ml-[280px] w-full p-4 md:p-10 bg-canvas relative" style={{ backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">

            <section className="bg-white border-4 border-black p-6 md:p-12 shadow-neo-xl text-center relative overflow-hidden transform rotate-1 hover:rotate-0 transition-transform">
              <div className="absolute top-0 left-0 bg-jade-vibrant text-white font-black px-4 py-1 border-b-4 border-r-4 border-black shadow-neo-sm z-20">
                MATERI 04
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-black tracking-tighter uppercase mt-6 mb-4 md:mb-6">
                Hirarki (Specificity)
              </h1>
              <p className="text-base md:text-xl font-bold text-white bg-forest-teal inline-block px-4 py-2 md:px-6 md:py-3 border-4 border-black mb-4 md:mb-6 shadow-neo-md uppercase tracking-tight">
                Pernah ngetik kode CSS tapi wujudnya menolak berubah? Berarti kodemu kalah "Kasta"!
              </p>
            </section>

            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-12 border-b-4 border-black pb-4 text-center tracking-tighter">
                Urutan Kasta Terkuat ke Terlemah
              </h2>
              
              <div className="space-y-6 mb-16 max-w-4xl mx-auto">
                <div className="bg-pine-deep text-white border-4 border-black p-6 md:p-8 shadow-neo-md flex flex-col sm:flex-row items-start sm:items-center justify-between hover:scale-[1.02] hover:-translate-y-2 hover:shadow-neo-lg transition-all gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-5xl md:text-6xl drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">🥇</span>
                    <h3 className="text-2xl md:text-3xl font-black uppercase drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] tracking-widest">Inline Style</h3>
                  </div>
                  <code className="bg-black text-jade-vibrant px-3 py-2 border-4 border-white font-black text-lg md:text-xl shadow-[4px_4px_0px_rgba(255,255,255,1)]">style="..."</code>
                </div>

                <div className="bg-jade-vibrant border-4 border-black p-6 md:p-8 shadow-neo-md flex flex-col sm:flex-row items-start sm:items-center justify-between hover:scale-[1.02] hover:-translate-y-2 hover:shadow-neo-lg transition-all ml-0 lg:ml-8 gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-5xl md:text-6xl drop-shadow-[2px_2px_0px_rgba(255,255,255,1)]">🥈</span>
                    <h3 className="text-2xl md:text-3xl font-black uppercase text-black tracking-widest">ID Selector</h3>
                  </div>
                  <code className="bg-white text-black px-3 py-2 border-4 border-black font-black text-lg md:text-xl shadow-[4px_4px_0px_rgba(0,0,0,1)]">#nama</code>
                </div>

                <div className="bg-mint-soft border-4 border-black p-6 md:p-8 shadow-neo-md flex flex-col sm:flex-row items-start sm:items-center justify-between hover:scale-[1.02] hover:-translate-y-2 hover:shadow-neo-lg transition-all ml-0 lg:ml-16 gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-5xl md:text-6xl drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">🥉</span>
                    <h3 className="text-2xl md:text-3xl font-black uppercase text-black tracking-widest">Class Selector</h3>
                  </div>
                  <code className="bg-white text-black px-3 py-2 border-4 border-black font-black text-lg md:text-xl shadow-[4px_4px_0px_rgba(0,0,0,1)]">.nama</code>
                </div>

                <div className="bg-canvas border-4 border-black p-6 md:p-8 shadow-neo-md flex flex-col sm:flex-row items-start sm:items-center justify-between hover:scale-[1.02] hover:-translate-y-2 hover:shadow-neo-lg transition-all ml-0 lg:ml-24 gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-5xl md:text-6xl drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">🗿</span>
                    <h3 className="text-2xl md:text-3xl font-black uppercase text-black tracking-widest">Tag Selector</h3>
                  </div>
                  <code className="bg-white text-black px-3 py-2 border-4 border-black font-black text-lg md:text-xl shadow-[4px_4px_0px_rgba(0,0,0,1)]">h1, p</code>
                </div>
              </div>

              {/* Conflict Example */}
              <div className="border-t-4 border-black border-dashed pt-12 mb-16">
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 flex items-center gap-3 tracking-tighter">
                  <span className="material-symbols-outlined text-4xl md:text-5xl bg-black text-white p-2 border-4 border-black shadow-neo-sm flex-shrink-0">swords</span>
                  Simulasi Konflik CSS
                </h2>
                <div className="flex flex-col xl:flex-row gap-8 lg:gap-10">
                  <div className="xl:w-1/2 space-y-6">
                    <p className="font-bold text-forest-teal text-lg md:text-xl leading-relaxed bg-mint-canvas p-4 border-4 border-black shadow-neo-sm">
                      Perhatikan kode HTML di samping. Ada sebuah elemen target berupa <code className="bg-white text-black px-2 py-1 border-2 border-black font-black uppercase tracking-widest">&lt;h1&gt;</code> yang dibekali atribut <code className="bg-white text-black px-2 py-1 border-2 border-black font-black uppercase tracking-widest">id="judul"</code> dan juga <code className="bg-white text-black px-2 py-1 border-2 border-black font-black uppercase tracking-widest">class="teks-utama"</code>.
                    </p>
                    <p className="font-bold text-forest-teal text-lg md:text-xl leading-relaxed bg-white border-4 border-black p-4 shadow-neo-sm">
                      Lalu di dalam file CSS, terdapat deklarasi warna yang saling bertabrakan untuk Tag, Class, dan ID-nya sekaligus. <strong className="bg-jade-vibrant text-black px-2 py-1 border-2 border-black uppercase inline-block mt-2">Warna manakah yang akan diterapkan?</strong>
                    </p>
                    
                    <div className="bg-black text-white border-4 border-black p-6 shadow-neo-md mt-8 transform -rotate-1 hover:rotate-0 transition-transform">
                      <p className="font-black text-2xl md:text-3xl uppercase flex items-center gap-3 mb-2 text-jade-vibrant tracking-widest border-b-4 border-white pb-3">
                        <span className="material-symbols-outlined text-4xl">celebration</span>
                        Hasil Akhir: MERAH!
                      </p>
                      <p className="font-bold text-white/90 text-lg mt-4 leading-relaxed">Sesuai aturan hierarki piramida di atas, ID (<code className="bg-white text-black px-2 py-1 border-2 border-black">#judul</code>) menang karena memiliki tingkat spesifisitas yang <strong className="text-jade-vibrant uppercase">jauh lebih tinggi</strong> dibandingkan Class (.teks-utama) maupun Tag (h1).</p>
                    </div>
                  </div>
                  
                  <div className="xl:w-1/2 space-y-6 flex flex-col">
                    <div className="bg-black border-4 border-black p-1 shadow-neo-md transform rotate-1 hover:rotate-0 transition-transform">
                      <div className="bg-mint-soft border-b-4 border-black p-2 font-black uppercase text-center text-xs text-black">Kode HTML</div>
                      <div className="p-1">
                        <CodeBlock 
                          language="html" 
                          code={`<h1 id="judul" class="teks-utama">
  Website Ku
</h1>`} 
                        />
                      </div>
                    </div>
                    
                    <div className="bg-black border-4 border-black p-1 shadow-neo-md transform -rotate-1 hover:rotate-0 transition-transform flex-1">
                      <div className="bg-jade-vibrant border-b-4 border-black p-2 font-black uppercase text-center text-xs text-black">Aturan CSS</div>
                      <div className="p-1 h-full">
                        <CodeBlock 
                          language="css" 
                          code={`h1 { color: blue; }         /* Tag (Lemah) */
.teks-utama { color: green; } /* Class (Menengah) */
#judul { color: red; }        /* ID (Kuat!) */`} 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* The Exceptions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 mt-16">
                <div className="bg-canvas border-4 border-black p-6 md:p-8 shadow-neo-md hover:-translate-y-2 hover:shadow-neo-lg transition-transform flex flex-col">
                  <h3 className="text-2xl md:text-3xl font-black text-black uppercase mb-6 flex items-center gap-3 tracking-tighter">
                    <span className="material-symbols-outlined bg-white text-black p-2 border-4 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] text-3xl">find_replace</span> 
                    Aturan Cascading
                  </h3>
                  <p className="text-base md:text-lg font-bold text-forest-teal leading-relaxed mb-4">
                    Lalu bagaimana jika tingkat spesifisitasnya <strong>sama persis</strong>? (Misalnya kamu mendeklarasikan dua selector yang sama persis tapi dengan gaya yang berbeda).
                  </p>
                  <p className="text-base md:text-lg font-bold text-forest-teal leading-relaxed mb-6">
                    Berdasarkan prinsip "Cascading" (Air Terjun), kode yang ditulis <strong className="bg-white px-2 py-1 border-2 border-black text-black uppercase">paling bawah / terakhir</strong> yang akan diterapkan, karena CSS dieksekusi secara berurutan dari atas ke bawah.
                  </p>
                  <div className="bg-black border-4 border-black p-1 shadow-neo-sm transform rotate-1 mt-auto">
                    <CodeBlock 
                      language="css" 
                      code={`.btn { color: blue; }
.btn { color: red; } /* Menang karena di bawah! */`} 
                    />
                  </div>
                </div>

                <div className="bg-pine-deep border-4 border-black p-6 md:p-8 shadow-neo-md text-white relative overflow-hidden hover:-translate-y-2 hover:shadow-neo-lg transition-transform flex flex-col group">
                  <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-8xl text-black/20 rotate-12 group-hover:rotate-0 group-hover:scale-125 transition-transform">warning</span>
                  <h3 className="text-2xl md:text-3xl font-black uppercase mb-6 flex items-center gap-3 tracking-tighter text-jade-vibrant drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                    <span className="material-symbols-outlined bg-black text-white p-2 border-4 border-white shadow-[2px_2px_0px_rgba(255,255,255,1)] text-3xl">bolt</span> 
                    Aturan Pengecualian Khusus
                  </h3>
                  <p className="text-base md:text-lg font-bold text-mint-soft leading-relaxed mb-6">
                    Ada satu deklarasi khusus di CSS yang dapat mengalahkan tingkat spesifisitas apapun secara paksa, yaitu:
                  </p>
                  <code className="block bg-black p-4 border-4 border-white font-mono font-black text-center text-white mb-6 text-2xl md:text-3xl uppercase tracking-widest shadow-[4px_4px_0px_rgba(255,255,255,1)] transform -rotate-2">!important</code>
                  <p className="text-sm md:text-base font-bold bg-white text-black p-4 border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] leading-relaxed relative z-10 mt-auto">
                    <strong className="uppercase block mb-1">⚠️ PERINGATAN:</strong> Gunakan aturan ini <strong>HANYA</strong> saat benar-benar diperlukan (misalnya untuk menimpa gaya bawaan dari library eksternal). Penggunaan yang berlebihan dapat membuat kodemu berantakan dan sangat sulit untuk di-debug!
                  </p>
                </div>
              </div>

            </section>

            {/* Footer / Penutup */}
            <footer className="bg-jade-vibrant border-4 border-black p-8 md:p-12 shadow-neo-xl text-center relative hover:-translate-y-1 transition-transform">
              <span className="material-symbols-outlined absolute -top-4 -right-4 md:-top-6 md:-right-6 text-5xl md:text-6xl text-white bg-black rounded-none border-4 border-white p-3 shadow-[4px_4px_0px_rgba(255,255,255,1)] hover:scale-110 transition-transform cursor-pointer">balance</span>
              <p className="text-2xl md:text-4xl font-black text-black uppercase leading-relaxed max-w-4xl mx-auto drop-shadow-[2px_2px_0px_rgba(255,255,255,1)] tracking-tight">
                "Pahami hierarki spesifisitas ini agar kamu dapat dengan mudah memecahkan masalah saat gaya CSS pada elemen tidak diterapkan seperti yang diharapkan!"
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

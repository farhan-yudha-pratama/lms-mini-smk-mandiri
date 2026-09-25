"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import CodeBlock from '@/components/CodeBlock';

export default function SatuanUkuranPage() {
  return (
    <>
      <Headbar
        links={[
          { label: 'Materi', href: '/satuan-ukuran', isActive: true },
          { label: 'Soal Teori', href: '/satuan-ukuran/soal', isActive: false }
        ]}
      />

      <div className="flex pt-[88px] min-h-screen">
        <Sidebar />

        <main className="md:ml-[280px] w-full p-4 md:p-10 bg-canvas relative" style={{ backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">

            <section className="bg-white border-4 border-black p-6 md:p-12 shadow-neo-xl text-center relative overflow-hidden transform rotate-1 hover:rotate-0 transition-transform">
              <div className="absolute top-0 left-0 bg-jade-vibrant text-white font-black px-4 py-1 border-b-4 border-r-4 border-black shadow-neo-sm z-20">
                MATERI 05
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-black tracking-tighter uppercase mt-6 mb-4 md:mb-6">
                Satuan Ukuran
              </h1>
              <p className="text-base md:text-xl font-bold text-white bg-forest-teal inline-block px-4 py-2 md:px-6 md:py-3 border-4 border-black mb-4 md:mb-6 shadow-neo-md uppercase tracking-tight">
                Di CSS, ada banyak cara untuk mengukur panjang, lebar, atau ketebalan font!
              </p>
            </section>

            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-12 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="material-symbols-outlined text-4xl md:text-5xl text-white bg-pine-deep p-2 border-4 border-black shadow-neo-sm flex-shrink-0">straighten</span>
                4 Satuan Wajib Kuasai
              </h2>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-10 mb-16">

                {/* px */}
                <div className="border-4 border-black bg-white p-6 md:p-8 shadow-neo-md flex flex-col group hover:-translate-y-2 hover:shadow-neo-lg transition-all">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="bg-jade-vibrant text-white font-black text-2xl md:text-3xl border-4 border-black px-4 py-2 uppercase shadow-[4px_4px_0px_rgba(0,0,0,1)] group-hover:-translate-y-1 group-hover:rotate-[-5deg] transition-transform">px</span>
                    <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">Pixels (Mutlak)</h3>
                  </div>
                  <p className="font-bold text-forest-teal text-base md:text-lg mb-6 flex-1 bg-mint-canvas p-4 border-4 border-black">
                    Satuan statis yang ukurannya tetap. <strong className="bg-white px-2 py-1 border-2 border-black text-black">16px</strong> akan selalu tampil dalam ukuran tersebut, tidak peduli dibuka di layar berukuran berapapun. Cocok digunakan untuk mengatur ketebalan border atau elemen statis.
                  </p>
                  <div className="bg-black border-4 border-black p-1 shadow-neo-sm transform rotate-1 group-hover:rotate-0 transition-transform">
                    <div className="bg-mint-soft border-b-4 border-black p-2 font-black uppercase text-center text-xs">Penggunaan px</div>
                    <CodeBlock
                      language="css"
                      code={`.kotak {
  border: 4px solid black;
  width: 200px;
}`}
                    />
                  </div>
                </div>

                {/* % */}
                <div className="border-4 border-black bg-white p-6 md:p-8 shadow-neo-md flex flex-col group hover:-translate-y-2 hover:shadow-neo-lg transition-all">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="bg-white text-black font-black text-2xl md:text-3xl border-4 border-black px-4 py-2 uppercase shadow-[4px_4px_0px_rgba(0,0,0,1)] group-hover:-translate-y-1 group-hover:rotate-[5deg] transition-transform">%</span>
                    <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">Persen (Relatif)</h3>
                  </div>
                  <p className="font-bold text-forest-teal text-base md:text-lg mb-6 flex-1 bg-mint-canvas p-4 border-4 border-black">
                    Satuan yang ukurannya bergantung (relatif) pada elemen induk/wadahnya. Jika elemen induk memiliki lebar 1000px, dan elemen anak diberi lebar <strong className="bg-white px-2 py-1 border-2 border-black text-black">50%</strong>, maka lebarnya otomatis menjadi 500px.
                  </p>
                  <div className="bg-black border-4 border-black p-1 shadow-neo-sm transform -rotate-1 group-hover:rotate-0 transition-transform">
                    <div className="bg-mint-soft border-b-4 border-black p-2 font-black uppercase text-center text-xs">Penggunaan Persen</div>
                    <CodeBlock
                      language="css"
                      code={`.container { width: 800px; }
.anak { 
  width: 50%; /* = 400px */ 
}`}
                    />
                  </div>
                </div>

                {/* rem */}
                <div className="border-4 border-black bg-white p-6 md:p-8 shadow-neo-md flex flex-col group hover:-translate-y-2 hover:shadow-neo-lg transition-all">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="bg-pine-deep text-white font-black text-2xl md:text-3xl border-4 border-black px-4 py-2 uppercase shadow-[4px_4px_0px_rgba(0,0,0,1)] group-hover:-translate-y-1 group-hover:rotate-[-5deg] transition-transform">rem</span>
                    <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">Root EM</h3>
                  </div>
                  <p className="font-bold text-forest-teal text-base md:text-lg mb-6 flex-1 bg-mint-canvas p-4 border-4 border-black">
                    Satuan dinamis yang sangat direkomendasikan! Ukurannya mengambil patokan pada ukuran font dasar elemen root html (default browser = 16px). Sangat dianjurkan untuk membuat tipografi web yang responsif.
                  </p>
                  <div className="bg-black border-4 border-black p-1 shadow-neo-sm transform rotate-1 group-hover:rotate-0 transition-transform">
                    <div className="bg-mint-soft border-b-4 border-black p-2 font-black uppercase text-center text-xs">Penggunaan REM</div>
                    <CodeBlock
                      language="css"
                      code={`p {
  /* 1.5 dikalikan dasar 16px = 24px */
  font-size: 1.5rem; 
}`}
                    />
                  </div>
                </div>

                {/* vh/vw */}
                <div className="border-4 border-black bg-white p-6 md:p-8 shadow-neo-md flex flex-col group hover:-translate-y-2 hover:shadow-neo-lg transition-all">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="bg-black text-white font-black text-2xl md:text-3xl border-4 border-black px-4 py-2 uppercase shadow-[4px_4px_0px_rgba(45,212,191,1)] group-hover:-translate-y-1 group-hover:rotate-[5deg] transition-transform">vh/vw</span>
                    <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">Viewport</h3>
                  </div>
                  <p className="font-bold text-forest-teal text-base md:text-lg mb-6 flex-1 bg-mint-canvas p-4 border-4 border-black">
                    Persentase dari ukuran area layar yang sedang <em>terlihat</em> oleh pengguna (viewport). Jika diberi nilai <strong className="bg-white px-2 py-1 border-2 border-black text-black">100vh</strong>, elemen tersebut akan mengisi persis 100% dari tinggi layar perangkat.
                  </p>
                  <div className="bg-black border-4 border-black p-1 shadow-neo-sm transform -rotate-1 group-hover:rotate-0 transition-transform">
                    <div className="bg-mint-soft border-b-4 border-black p-2 font-black uppercase text-center text-xs">Penggunaan vh & vw</div>
                    <CodeBlock
                      language="css"
                      code={`.hero-section {
  width: 100vw;   /* 100% Lebar Layar */
  height: 100vh;  /* 100% Tinggi Layar */
}`}
                    />
                  </div>
                </div>

              </div>

              {/* Tips Section */}
              <div className="bg-jade-vibrant border-4 border-black p-6 md:p-12 shadow-neo-xl relative mt-16 text-white transform rotate-1 hover:rotate-0 transition-transform">
                <span className="material-symbols-outlined absolute -top-5 -right-5 md:-top-8 md:-right-8 text-5xl md:text-7xl text-black bg-white rounded-full border-4 border-black p-2 shadow-neo-sm -rotate-12 hover:scale-110 transition-transform cursor-pointer">functions</span>
                <h3 className="text-3xl md:text-4xl font-black uppercase mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-3 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                  Senjata Pamungkas: <span className="bg-black text-white px-3 py-1 border-4 border-white inline-block tracking-widest">calc()</span>
                </h3>
                <p className="font-bold text-black text-lg md:text-xl mb-8 leading-relaxed bg-white p-6 border-4 border-black shadow-neo-sm">
                  CSS bisa melakukan matematika rumit! Kamu bisa dengan gila menggabungkan satuan mutlak (<code className="bg-mint-canvas text-black px-1 border-2 border-black font-black uppercase">px</code>) dan relatif (<code className="bg-mint-canvas text-black px-1 border-2 border-black font-black uppercase">%</code>) bersamaan agar bisa dikalkulasi secara paksa dalam satu baris fungsi <code className="bg-black text-white px-2 py-1 font-black">calc()</code>.
                </p>
                <div className="bg-black border-4 border-white p-1 shadow-[6px_6px_0px_rgba(0,0,0,1)] transform -rotate-1 hover:rotate-0 transition-transform w-full md:w-3/4 max-w-2xl mx-auto">
                  <div className="bg-mint-soft border-b-4 border-white p-3 font-black uppercase text-center text-black tracking-widest">Matematika CSS</div>
                  <div className="p-1">
                    <CodeBlock
                      language="css"
                      code={`.sidebar {
  /* Ambil 100% dari layar, lalu potong keras 200px! */
  /* PERHATIAN: Wajib ada spasi sebelum & sesudah minus! */
  width: calc(100% - 200px); 
}`}
                    />
                  </div>
                </div>
              </div>

            </section>

            {/* Footer / Penutup */}
            <footer className="bg-pine-deep border-4 border-black p-8 md:p-12 shadow-neo-xl text-center relative hover:-translate-y-1 transition-transform">
              <span className="material-symbols-outlined absolute -top-4 -right-4 md:-top-6 md:-right-6 text-5xl md:text-6xl text-black bg-mint-soft rounded-none border-4 border-black p-3 shadow-neo-md hover:scale-110 transition-transform cursor-pointer">monitor</span>
              <p className="text-2xl md:text-4xl font-black text-white uppercase leading-relaxed max-w-4xl mx-auto drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] tracking-tight">
                "Penguasaan satuan relatif (Rem, Persen, VW/VH) adalah kunci utama dalam membuat antarmuka web yang responsif tanpa perlu khawatir layout menjadi berantakan!"
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

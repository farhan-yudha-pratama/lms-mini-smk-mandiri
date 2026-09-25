"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import CodeBlock from '@/components/CodeBlock';

export default function KoordinatZIndexPage() {
  return (
    <>
      <Headbar
        links={[
          { label: 'Materi', href: '/koordinat-zindex', isActive: true },
          { label: 'Soal Teori', href: '/koordinat-zindex/soal', isActive: false }
        ]}
      />

      <div className="flex pt-[88px] min-h-screen">
        <Sidebar />

        <main className="md:ml-[280px] w-full p-4 md:p-10 bg-canvas relative" style={{ backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">

            <section className="bg-white border-4 border-black p-6 md:p-12 shadow-neo-xl text-center relative overflow-hidden transform rotate-1 hover:rotate-0 transition-transform">
              <div className="absolute top-0 left-0 bg-jade-vibrant text-white font-black px-4 py-1 border-b-4 border-r-4 border-black shadow-neo-sm z-20">
                MATERI 12
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-black tracking-tighter uppercase mt-6 mb-4 md:mb-6">
                Posisi & Z-Index
              </h1>
              <p className="text-base md:text-xl font-bold text-white bg-forest-teal inline-block px-4 py-2 md:px-6 md:py-3 border-4 border-black mb-4 md:mb-6 shadow-neo-md uppercase tracking-tight">
                Properti "position" mengizinkan elemen untuk dilepaskan dari alur normal dokumen HTML.
              </p>
            </section>

            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="material-symbols-outlined text-4xl md:text-5xl text-white bg-pine-deep p-2 border-4 border-black shadow-neo-sm flex-shrink-0">layers</span>
                Mengendalikan Koordinat
              </h2>

              <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 mb-12 items-stretch">
                <div className="lg:w-1/2 space-y-8">
                  <p className="font-bold text-forest-teal text-lg md:text-xl leading-relaxed bg-mint-canvas p-4 border-4 border-black shadow-neo-sm">
                    Setiap elemen secara default mengikuti alur normal (<code className="bg-white text-black px-2 border-2 border-black font-black tracking-widest">static</code>). Dengan mengubah properti <code className="bg-white text-black px-2 border-2 border-black font-black tracking-widest">position</code>, kita dapat mengatur penempatan elemen secara spesifik dan presisi.
                  </p>
                  <ul className="space-y-6">
                    <li className="flex items-start gap-4 bg-canvas border-4 border-black p-4 shadow-neo-sm hover:translate-x-2 transition-transform">
                      <span className="bg-white p-2 border-4 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] text-2xl flex-shrink-0">📌</span>
                      <div>
                        <strong className="block text-xl uppercase font-black text-black tracking-widest mb-1">static</strong>
                        <p className="font-bold text-forest-teal text-base">Posisi normal bawaan HTML. Tidak bisa digeser dengan koordinat.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4 bg-canvas border-4 border-black p-4 shadow-neo-sm hover:translate-x-2 transition-transform">
                      <span className="bg-white p-2 border-4 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] text-2xl flex-shrink-0">📍</span>
                      <div>
                        <strong className="block text-xl uppercase font-black text-black tracking-widest mb-1">relative</strong>
                        <p className="font-bold text-forest-teal text-base">Bergeser dari posisi aslinya, tanpa merusak atau mengubah tata letak elemen di sekitarnya.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4 bg-white text-black border-4 border-black p-4 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
                      <span className="bg-canvas p-2 border-4 border-black text-2xl flex-shrink-0">🚀</span>
                      <div>
                        <strong className="block text-xl uppercase font-black tracking-widest mb-1 text-jade-vibrant">absolute</strong>
                        <p className="font-bold text-forest-teal text-base">Dilepaskan dari alur normal dokumen. Elemen ini diposisikan relatif terhadap elemen induk (parent) terdekat yang memiliki posisi selain <em>static</em> (misalnya <em>relative</em>).</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4 bg-white text-black border-4 border-black p-4 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
                      <span className="bg-canvas p-2 border-4 border-black text-2xl flex-shrink-0">🧲</span>
                      <div>
                        <strong className="block text-xl uppercase font-black tracking-widest mb-1 text-jade-vibrant">sticky</strong>
                        <p className="font-bold text-forest-teal text-base">Gabungan antara <em>relative</em> dan <em>fixed</em>. Elemen akan tertahan pada posisi tertentu di viewport saat pengguna melakukan scroll (sering digunakan untuk elemen Navbar).</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="lg:w-1/2 space-y-8 flex flex-col">
                  <div className="bg-black border-4 border-black p-1 shadow-neo-lg flex-1 flex flex-col transform -rotate-1 hover:rotate-0 transition-transform">
                    <div className="bg-mint-soft border-b-4 border-black p-3 font-black uppercase text-center text-black">Kode Koordinat CSS</div>
                    <div className="flex-grow p-1">
                      <CodeBlock 
                        language="css" 
                        code={`/* Wadah dijadikan patokan (Harus!) */
.parent-container {
  position: relative;
}

/* Elemen diposisikan di pojok kanan atas wadah */
.badge-notifikasi {
  position: absolute;
  top: -5px;
  right: -5px;
}

/* Navbar yang tertahan di atas saat scroll */
.navbar {
  position: sticky;
  top: 0;
}`} 
                      />
                    </div>
                  </div>
                </div>
              </div>


              {/* Visualisasi Koordinat */}
              <div className="bg-canvas border-4 border-black p-6 md:p-12 shadow-neo-xl mb-16 relative">
                <h3 className="font-black uppercase text-xl md:text-2xl tracking-widest text-black bg-white px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_#000] inline-block mb-10 -mt-10 md:-mt-16 z-10 relative transform -rotate-2">
                  Eksperimen Interaktif
                </h3>
                <div className="flex flex-col lg:flex-row gap-10">
                  {/* Relative + Absolute */}
                  <div className="lg:w-1/2 space-y-4">
                    <p className="font-bold text-forest-teal text-lg">
                      1. Kombinasi <strong className="text-black uppercase">Relative + Absolute</strong> (Notifikasi)
                    </p>
                    <div className="bg-white border-4 border-black h-56 shadow-[inset_4px_4px_0px_0px_rgba(0,0,0,0.2)] flex items-center justify-center relative p-8">
                      {/* Parent Box */}
                      <div className="w-32 h-32 bg-mint-soft border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative flex flex-col items-center justify-center hover:scale-105 transition-transform cursor-pointer">
                        <span className="material-symbols-outlined text-5xl">person</span>
                        <span className="font-black uppercase tracking-widest text-sm mt-1">Profil</span>
                        
                        {/* Anak Absolute */}
                        <div className="absolute -top-3 -right-3 w-8 h-8 bg-jade-vibrant border-4 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] flex items-center justify-center text-white font-black text-sm z-10 animate-bounce">
                          3
                        </div>
                      </div>
                      <p className="absolute bottom-4 left-0 right-0 text-center text-xs font-bold text-forest-teal/50 uppercase tracking-widest px-4">Kotak Profil adalah patokannya (Relative)</p>
                    </div>
                  </div>

                  {/* Sticky */}
                  <div className="lg:w-1/2 space-y-4">
                    <p className="font-bold text-forest-teal text-lg">
                      2. Perilaku Tertahan dengan <strong className="text-black uppercase">Sticky</strong>
                    </p>
                    <div className="bg-white border-4 border-black h-56 shadow-[inset_4px_4px_0px_0px_rgba(0,0,0,0.2)] overflow-y-auto relative p-4 scrollbar-hide">
                      <p className="text-sm font-bold text-forest-teal mb-4 text-center">👇 Scroll kotak ini ke bawah</p>
                      
                      <div className="space-y-4 pb-20 relative">
                        {/* Elemen Sticky */}
                        <div className="sticky top-0 bg-pine-deep text-white font-black uppercase p-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center tracking-widest z-10">
                          Header Sticky
                        </div>
                        
                        {/* Konten Biasa */}
                        <div className="bg-canvas border-4 border-black p-4 font-bold text-sm text-black shadow-neo-sm">Konten 1 (Static)</div>
                        <div className="bg-canvas border-4 border-black p-4 font-bold text-sm text-black shadow-neo-sm">Konten 2 (Static)</div>
                        <div className="bg-canvas border-4 border-black p-4 font-bold text-sm text-black shadow-neo-sm">Konten 3 (Static)</div>
                        <div className="bg-canvas border-4 border-black p-4 font-bold text-sm text-black shadow-neo-sm">Konten 4 (Static)</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fixed Position Section */}
              <div className="bg-pine-deep border-4 border-black p-6 md:p-12 shadow-neo-xl mt-16 flex flex-col xl:flex-row gap-10 items-stretch text-white transform rotate-1 hover:rotate-0 transition-transform">
                <div className="xl:w-1/2 space-y-8">
                  <h3 className="text-2xl md:text-4xl font-black uppercase flex items-center gap-3 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                    <span className="material-symbols-outlined text-4xl md:text-5xl bg-mint-soft text-black p-2 rounded-none border-4 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">push_pin</span>
                    Position: Fixed
                  </h3>
                  <p className="font-bold text-lg md:text-xl leading-relaxed bg-black p-4 border-4 border-mint-soft">
                    Selain keempat posisi tersebut, terdapat properti <code className="bg-white text-black font-black px-2 border-2 border-black uppercase tracking-widest">fixed</code> untuk penempatan absolut pada layar.
                  </p>
                  <p className="font-black text-xl leading-relaxed bg-white text-black p-4 border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                    Elemen dengan posisi <strong>fixed</strong> akan terkunci secara absolut pada ruang <strong className="text-jade-vibrant uppercase underline decoration-4 decoration-black">layar browser (Viewport)</strong>, alih-alih pada elemen induknya.
                  </p>
                  <ul className="space-y-6">
                    <li className="flex items-start gap-4 bg-canvas text-black border-4 border-black p-4 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
                      <span className="text-3xl flex-shrink-0 mt-1">⚠️</span>
                      <p className="font-bold text-base md:text-lg text-forest-teal"><strong className="text-black uppercase">Perbedaan Absolute vs Fixed:</strong> <br/> Elemen <em>absolute</em> akan ikut bergeser (scroll) bersama dokumen halaman. Sedangkan elemen <em>fixed</em> akan tetap berada di posisi yang sama pada viewport layar meskipun halaman di-scroll.</p>
                    </li>
                  </ul>
                  <div className="font-bold text-black text-base md:text-lg leading-relaxed mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-mint-soft p-4 border-4 border-black shadow-neo-sm">
                    <span className="material-symbols-outlined text-5xl">lightbulb</span>
                    <p><strong className="uppercase text-xl block mb-1 tracking-widest">Kasus Penggunaan:</strong> Sering digunakan untuk membuat tombol aksi statis seperti "Kembali ke Atas", ikon obrolan, atau tampilan modal (pop-up) yang menutupi antarmuka halaman.</p>
                  </div>
                </div>
                <div className="xl:w-1/2 w-full flex flex-col bg-black border-4 border-black p-1 shadow-neo-md">
                   <div className="bg-mint-soft border-b-4 border-black p-3 font-black uppercase text-center text-black">Penerapan Fixed</div>
                  <div className="flex-grow p-1">
                    <CodeBlock 
                      language="css" 
                      code={`/* Tombol diposisikan di pojok kanan bawah layar */
.tombol-whatsapp {
  position: fixed; /* Terkunci relatif pada viewport */
  bottom: 20px;    /* Jarak 20px dari bawah layar */
  right: 20px;     /* Jarak 20px dari kanan layar */
  
  /* Pastikan selalu paling depan (Tidak tertumpuk) */
  z-index: 999;    
}`} 
                    />
                  </div>
                </div>
              </div>

              {/* Z-Index Section */}
              <div className="bg-canvas border-4 border-black p-6 md:p-12 shadow-neo-xl relative mt-16 flex flex-col lg:flex-row gap-10 items-stretch transform -rotate-1 hover:rotate-0 transition-transform">
                <div className="lg:w-1/2 flex flex-col justify-center space-y-6">
                  <h3 className="text-2xl md:text-4xl font-black uppercase flex items-center gap-3 text-black tracking-tighter">
                    <span className="material-symbols-outlined text-4xl md:text-5xl text-white bg-black p-2 border-4 border-black">view_agenda</span>
                    Apa itu Z-Index?
                  </h3>
                  <p className="text-base md:text-lg font-bold text-forest-teal leading-relaxed">
                    Ketika dua elemen atau lebih diposisikan saling bertumpuk (misalnya menggunakan <em>absolute</em>, <em>fixed</em>, atau <em>sticky</em>), urutan penumpukannya (layering) perlu diatur.
                  </p>
                  <p className="text-base md:text-lg font-bold text-forest-teal leading-relaxed mb-4 bg-mint-soft p-4 border-4 border-black shadow-neo-sm">
                    Properti <code className="bg-black text-white px-2 py-1 border-2 border-black font-black uppercase tracking-widest">z-index</code> menentukan tingkatan sumbu-z elemen. <strong className="text-black uppercase">Elemen dengan nilai z-index yang lebih besar akan dirender di atas elemen dengan nilai yang lebih kecil.</strong>
                  </p>
                  
                  {/* Visualisasi Tumpukan Z-index Brutalist */}
                  <div className="relative h-48 w-full mt-6 flex items-center justify-center">
                    <div className="absolute w-32 h-32 bg-mint-soft border-4 border-black shadow-[4px_4px_0px_0px_#000] -left-0 md:left-4 z-10 flex flex-col items-center justify-center font-black text-black transform rotate-6 hover:z-50 hover:scale-110 cursor-pointer transition-all">
                      <span className="text-xs uppercase tracking-widest">Paling Bawah</span>
                      <span className="text-2xl mt-1">z: 10</span>
                    </div>
                    <div className="absolute w-32 h-32 bg-jade-vibrant border-4 border-black shadow-[4px_4px_0px_0px_#000] z-20 flex flex-col items-center justify-center font-black text-white hover:z-50 hover:scale-110 cursor-pointer transition-all">
                      <span className="text-xs uppercase tracking-widest">Di Tengah</span>
                      <span className="text-2xl mt-1">z: 20</span>
                    </div>
                    <div className="absolute w-32 h-32 bg-pine-deep border-4 border-black shadow-[4px_4px_0px_0px_#000] left-20 md:left-40 z-30 flex flex-col items-center justify-center font-black text-white transform -rotate-6 hover:z-50 hover:scale-110 cursor-pointer transition-all">
                      <span className="text-xs uppercase tracking-widest">Paling Atas</span>
                      <span className="text-2xl mt-1">z: 30</span>
                    </div>
                  </div>
                </div>
                <div className="lg:w-1/2 w-full flex flex-col bg-black border-4 border-black p-1 shadow-neo-md transform group-hover:scale-[1.02] transition-transform">
                  <div className="bg-mint-soft font-black uppercase text-center py-2 border-b-4 border-black">Z-Index Implementation</div>
                  <div className="flex-grow p-1">
                    <CodeBlock 
                      language="css" 
                      code={`nav {
  position: sticky;
  top: 0;
  
  /* Pastikan navbar selalu paling atas */
  /* Tidak tertimpa elemen lain saat di-scroll */
  z-index: 100; 
}`} 
                    />
                  </div>
                </div>
              </div>

            </section>

            {/* Footer / Penutup */}
            <footer className="bg-jade-vibrant border-4 border-black p-8 md:p-12 shadow-neo-xl text-center relative hover:-translate-y-1 transition-transform">
              <span className="material-symbols-outlined absolute -top-4 -right-4 md:-top-6 md:-right-6 text-5xl md:text-6xl text-white bg-pine-deep rounded-none border-4 border-black p-3 shadow-neo-md hover:scale-110 transition-transform cursor-pointer">library_add_check</span>
              <p className="text-2xl md:text-4xl font-black text-white uppercase leading-relaxed max-w-4xl mx-auto drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] tracking-tight">
                "Pemahaman mengenai kombinasi posisi Relative dan Absolute merupakan landasan utama dalam mengendalikan tata letak komponen antarmuka secara presisi!"
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
      {/* Tombol Fixed Nyata (Demonstrasi Position: Fixed) */}
      <div className="fixed bottom-6 right-6 z-[999] hidden md:flex flex-col items-end gap-2 animate-bounce-slight">
        <div className="bg-white text-black font-black uppercase text-xs px-3 py-1 border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          Ini Position Fixed! 👇
        </div>
        <button className="bg-jade-vibrant text-white font-black uppercase text-sm px-6 py-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all flex items-center gap-2">
          <span className="material-symbols-outlined">forum</span>
          Tanya Ahli CSS
        </button>
      </div>
    </>
  );
}

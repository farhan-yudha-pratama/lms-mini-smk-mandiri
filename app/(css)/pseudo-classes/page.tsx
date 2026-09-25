"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import CodeBlock from '@/components/CodeBlock';

export default function PseudoClassesPage() {
  return (
    <>
      <Headbar
        links={[
          { label: 'Materi', href: '/pseudo-classes', isActive: true },
          { label: 'Soal Teori', href: '/pseudo-classes/soal', isActive: false }
        ]}
      />

      <div className="flex pt-[88px] min-h-screen">
        <Sidebar />

        <main className="md:ml-[280px] w-full p-4 md:p-10 bg-canvas relative" style={{ backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">

            <section className="bg-white border-4 border-black p-6 md:p-12 shadow-neo-xl text-center relative overflow-hidden transform rotate-1 hover:rotate-0 transition-transform">
              <div className="absolute top-0 left-0 bg-jade-vibrant text-white font-black px-4 py-1 border-b-4 border-r-4 border-black shadow-neo-sm z-20">
                MATERI 14
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-black tracking-tighter uppercase mt-6 mb-4 md:mb-6">
                Interaksi & Animasi
              </h1>
              <p className="text-base md:text-xl font-bold text-white bg-forest-teal inline-block px-4 py-2 md:px-6 md:py-3 border-4 border-black mb-4 md:mb-6 shadow-neo-md uppercase tracking-tight">
                Menambahkan interaktivitas dan manajemen state pada elemen HTML menggunakan Pseudo-classes.
              </p>
            </section>

            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="material-symbols-outlined text-4xl md:text-5xl text-white bg-pine-deep p-2 border-4 border-black shadow-neo-sm flex-shrink-0">touch_app</span>
                Merespons Sentuhan
              </h2>

              <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 mb-12 items-stretch">
                <div className="lg:w-1/2 space-y-8">
                  <p className="font-bold text-forest-teal text-lg md:text-xl leading-relaxed bg-mint-canvas p-4 border-4 border-black shadow-neo-sm">
                    Pseudo-classes digunakan untuk menerapkan gaya CSS khusus saat sebuah elemen berada dalam state atau kondisi tertentu (misalnya saat di-hover atau difokuskan). Penulisannya selalu diawali dengan tanda titik dua (<code className="bg-white px-2 py-1 border-2 border-black font-black text-black">:</code>).
                  </p>
                  
                  <ul className="space-y-6">
                    <li className="flex items-start gap-4 bg-canvas border-4 border-black p-4 shadow-neo-sm hover:translate-x-2 transition-transform">
                      <span className="bg-white p-2 border-4 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] text-2xl flex-shrink-0">🖱️</span>
                      <div>
                        <strong className="block text-xl uppercase font-black text-black tracking-widest mb-1">:hover</strong>
                        <p className="font-bold text-forest-teal text-base">Memicu perubahan gaya CSS saat pengguna mengarahkan (hover) kursor mouse ke atas elemen tersebut.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4 bg-canvas border-4 border-black p-4 shadow-neo-sm hover:translate-x-2 transition-transform">
                      <span className="bg-white p-2 border-4 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] text-2xl flex-shrink-0">⌨️</span>
                      <div>
                        <strong className="block text-xl uppercase font-black text-black tracking-widest mb-1">:focus</strong>
                        <p className="font-bold text-forest-teal text-base">Memicu perubahan gaya CSS saat sebuah elemen (seperti elemen input form) sedang menerima fokus, aktif, atau siap menerima input.</p>
                      </div>
                    </li>
                  </ul>
                  
                  <div className="bg-mint-soft border-4 border-black p-6 shadow-neo-md mt-10">
                    <p className="font-black text-sm md:text-base uppercase mb-4 text-black tracking-widest text-center border-b-2 border-black pb-2">🕹️ Demonstrasi Interaktif</p>
                    <div className="flex flex-col gap-6">
                      {/* Interactive Hover */}
                      <button className="bg-black text-white text-lg md:text-xl font-black p-4 border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:bg-jade-vibrant hover:text-black hover:-translate-y-2 hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all cursor-pointer text-center uppercase tracking-widest">
                        Arahkan Mouse (:hover)
                      </button>
                      {/* Interactive Focus */}
                      <input 
                        type="text" 
                        placeholder="Klik dan ketik sesuatu... (:focus)" 
                        className="bg-white text-black p-4 border-4 border-black outline-none focus:border-pine-deep focus:-translate-y-1 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-bold placeholder:font-normal text-lg"
                      />
                    </div>
                  </div>
                </div>

                <div className="lg:w-1/2 space-y-8 flex flex-col">
                  
                  <div className="bg-black text-white border-4 border-black p-6 shadow-neo-lg relative transform -rotate-1 hover:rotate-0 transition-transform flex-1 flex flex-col">
                    <h3 className="font-black text-2xl md:text-3xl mb-6 text-mint-soft flex items-center gap-3 border-b-4 border-white pb-3">
                      <span className="material-symbols-outlined text-4xl">animation</span>
                      Transisi Animasi (Transition)
                    </h3>
                    <p className="font-bold text-white/90 text-lg mb-6 leading-relaxed bg-[#222] p-4 border-4 border-white">
                      Perubahan state yang terjadi secara instan dapat terasa kaku. Gunakan properti <code className="bg-jade-vibrant text-black px-2 py-1 font-black inline-block mt-1 sm:mt-0">transition</code> untuk mengatur durasi perubahan sehingga tampak halus (smooth). Anda juga dapat mengkombinasikannya dengan properti <code className="bg-jade-vibrant text-black px-2 py-1 font-black inline-block mt-1 sm:mt-0">transform</code> untuk efek pergerakan koordinat atau rotasi.
                    </p>
                    <div className="flex-grow flex flex-col">
                      <CodeBlock 
                        language="css" 
                        code={`.btn {
  background-color: blue;
  
  /* Efek transisi halus selama 0.3 detik */
  transition: all 0.3s ease; 
}

.btn:hover {
  background-color: darkblue;
  
  /* Mengubah posisi elemen naik sejauh 5 pixel */
  transform: translateY(-5px); 
}`} 
                      />
                    </div>
                    
                    <div className="mt-8 flex justify-center">
                      <button className="bg-jade-vibrant text-black text-xl md:text-2xl font-black px-8 py-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-3 hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:rotate-3 active:translate-y-0 active:translate-x-0 active:shadow-none active:rotate-0 transition-all duration-300 ease-out cursor-pointer uppercase tracking-widest w-full">
                        Hover Me! 🚀
                      </button>
                    </div>
                  </div>

                </div>
              </div>

              {/* Structural Pseudo-classes */}
              <div className="bg-pine-deep border-4 border-black p-6 md:p-12 shadow-neo-xl mt-16 flex flex-col xl:flex-row gap-10 items-stretch text-white transform rotate-1 hover:rotate-0 transition-transform">
                <div className="xl:w-1/2 space-y-8">
                  <h3 className="text-2xl md:text-4xl font-black uppercase flex items-center gap-3 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                    <span className="material-symbols-outlined text-4xl md:text-5xl bg-mint-soft text-black p-2 rounded-none border-4 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">format_list_numbered</span>
                    Targeting Spesifik
                  </h3>
                  <p className="font-bold text-lg md:text-xl leading-relaxed bg-black p-4 border-4 border-mint-soft">
                    Selain untuk mengatur state interaktif, Pseudo-classes juga berfungsi sangat baik untuk menargetkan elemen berdasarkan letak struktural atau <strong className="text-jade-vibrant uppercase">posisinya di dalam hirarki HTML</strong> (serta menghindari penulisan atribut <code className="bg-white text-black px-1">class</code> berulang kali secara manual).
                  </p>
                  
                  <ul className="space-y-6">
                    <li className="flex items-start gap-4 bg-white text-black border-4 border-black p-4 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
                      <span className="bg-canvas p-2 border-4 border-black text-2xl flex-shrink-0">1️⃣</span>
                      <div>
                        <strong className="block text-xl md:text-2xl uppercase font-black tracking-widest mb-1 text-jade-vibrant">:first-child / :last-child</strong>
                        <p className="font-bold text-forest-teal text-base">Menargetkan elemen anak pertama atau anak terakhir dalam sebuah struktur data. Sangat berguna, contohnya, untuk menghilangkan properti border-bottom pada elemen terakhir di dalam daftar navigasi.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4 bg-white text-black border-4 border-black p-4 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
                      <span className="bg-canvas p-2 border-4 border-black text-2xl flex-shrink-0">🔢</span>
                      <div>
                        <strong className="block text-xl md:text-2xl uppercase font-black tracking-widest mb-1 text-jade-vibrant">:nth-child(n)</strong>
                        <p className="font-bold text-forest-teal text-base">Menerima argumen berupa spesifikasi angka (misalnya urutan ke-3). Anda juga dapat menggunakan nilai fungsi bawaan <code className="bg-mint-canvas px-2 border-2 border-black font-black text-black uppercase">odd</code> (Ganjil) dan <code className="bg-mint-canvas px-2 border-2 border-black font-black text-black uppercase">even</code> (Genap) untuk mengotomatiskan pola warna tabel yang berselang-seling secara konsisten (Zebra Striping).</p>
                      </div>
                    </li>
                  </ul>
                  
                  <div className="bg-canvas text-black border-4 border-black p-6 mt-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                    <p className="font-black text-sm md:text-base uppercase mb-4 text-black tracking-widest text-center border-b-4 border-black pb-2 bg-white inline-block px-4">Zebra Striping Visual</p>
                    <ul className="border-4 border-black font-black text-lg uppercase tracking-wider">
                      <li className="p-3 bg-jade-vibrant border-b-4 border-black flex justify-between"><span>Baris 1</span> <span>(Ganjil)</span></li>
                      <li className="p-3 bg-white border-b-4 border-black flex justify-between"><span>Baris 2</span> <span>(Genap)</span></li>
                      <li className="p-3 bg-jade-vibrant border-b-4 border-black flex justify-between text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] relative"><span className="absolute -left-4 -top-2 text-3xl rotate-[-20deg]">🎯</span> <span>Baris 3</span> <span>(Target ke-3)</span></li>
                      <li className="p-3 bg-white flex justify-between"><span>Baris 4</span> <span>(Genap)</span></li>
                    </ul>
                  </div>
                </div>

                <div className="xl:w-1/2 w-full flex flex-col bg-black border-4 border-black p-1 shadow-neo-md">
                   <div className="bg-mint-soft border-b-4 border-black p-3 font-black uppercase text-center text-black">Structural Targeting</div>
                  <div className="flex-grow p-1">
                    <CodeBlock 
                      language="css" 
                      code={`/* Menghapus garis bawah pada baris terujung */
li:last-child {
  border-bottom: none;
}

/* Mewarnai baris bernomor urut ganjil secara otomatis */
/* Mengimplementasikan pola Zebra Striping */
li:nth-child(odd) {
  background-color: var(--jade-vibrant);
}

/* Menargetkan spesifik hanya pada baris ke-3 */
li:nth-child(3) {
  color: white;
}`} 
                    />
                  </div>
                </div>
              </div>

            </section>

            {/* Footer / Penutup */}
            <footer className="bg-jade-vibrant border-4 border-black p-8 md:p-12 shadow-neo-xl text-center relative hover:-translate-y-1 transition-transform">
              <span className="material-symbols-outlined absolute -top-4 -right-4 md:-top-6 md:-right-6 text-5xl md:text-6xl text-white bg-pine-deep rounded-none border-4 border-black p-3 shadow-neo-md hover:scale-110 transition-transform cursor-pointer">sports_esports</span>
              <p className="text-2xl md:text-4xl font-black text-white uppercase leading-relaxed max-w-4xl mx-auto drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] tracking-tight">
                "Penggunaan Pseudo-classes yang dikombinasikan dengan properti Transition merupakan landasan utama dalam merancang Micro-Interactions pada antarmuka modern."
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

"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import CodeBlock from '@/components/CodeBlock';

export default function DisplayCSSPage() {
  return (
    <>
      <Headbar
        links={[
          { label: 'Materi', href: '/display-css', isActive: true },
          { label: 'Soal Teori', href: '/display-css/soal', isActive: false }
        ]}
      />

      <div className="flex pt-[88px] min-h-screen">
        <Sidebar />

        <main className="md:ml-[280px] w-full p-4 md:p-10 bg-canvas relative" style={{ backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">

            <section className="bg-white border-4 border-black p-6 md:p-12 shadow-neo-xl text-center relative overflow-hidden transform rotate-1 hover:rotate-0 transition-transform">
              <div className="absolute top-0 left-0 bg-jade-vibrant text-white font-black px-4 py-1 border-b-4 border-r-4 border-black shadow-neo-sm z-20">
                MATERI 08
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-black tracking-tighter uppercase mt-6 mb-4 md:mb-6">
                Sifat Tampilan <br/> <span className="text-pine-deep bg-mint-soft px-4 inline-block transform -rotate-2 border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] mt-2">(Display)</span>
              </h1>
              <p className="text-base md:text-xl font-bold text-white bg-forest-teal inline-block px-4 py-2 md:px-6 md:py-3 border-4 border-black mt-4 md:mb-6 shadow-neo-md uppercase tracking-tight">
                Properti utama untuk mengatur bagaimana suatu elemen dirender dan mengambil ruang pada layout web!
              </p>
            </section>

            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="material-symbols-outlined text-4xl md:text-5xl text-white bg-pine-deep p-2 border-4 border-black shadow-neo-sm flex-shrink-0">view_in_ar</span>
                4 Jenis Display Utama
              </h2>

              <div className="space-y-10 md:space-y-12 mb-16">
                
                {/* Block */}
                <div className="bg-canvas border-4 border-black p-6 md:p-8 shadow-neo-lg flex flex-col md:flex-row gap-8 hover:-translate-y-2 hover:shadow-neo-xl transition-all">
                  <div className="md:w-1/3 flex flex-col justify-center items-center p-6 bg-white border-4 border-black shadow-neo-sm text-center">
                    <div className="w-full h-10 bg-jade-vibrant border-4 border-black mb-3 shadow-[2px_2px_0px_rgba(0,0,0,1)]"></div>
                    <div className="w-full h-10 bg-jade-vibrant border-4 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]"></div>
                  </div>
                  <div className="md:w-2/3 flex flex-col justify-center">
                    <h3 className="text-3xl font-black uppercase mb-4 flex items-center gap-2">
                      <span className="bg-jade-vibrant text-white px-4 py-1 border-4 border-black shadow-neo-sm tracking-widest">block</span>
                    </h3>
                    <p className="font-bold text-forest-teal text-lg md:text-xl mb-6 leading-relaxed bg-white border-4 border-black p-4">
                      Elemen dengan sifat ini akan mengambil <strong className="text-black uppercase">satu baris penuh</strong> (100% lebar) secara default. Elemen berikutnya akan otomatis dipaksa untuk berada di baris baru di bawahnya. (Contoh bawaan: <code className="bg-mint-canvas text-black font-black px-2 border-2 border-black">&lt;div&gt;</code>, <code className="bg-mint-canvas text-black font-black px-2 border-2 border-black">&lt;h1&gt;</code>).
                    </p>
                    <div className="border-4 border-black shadow-neo-sm"><CodeBlock language="css" code={`.kotak { display: block; }`} /></div>
                  </div>
                </div>

                {/* Inline */}
                <div className="bg-canvas border-4 border-black p-6 md:p-8 shadow-neo-lg flex flex-col md:flex-row gap-8 hover:-translate-y-2 hover:shadow-neo-xl transition-all">
                  <div className="md:w-1/3 flex flex-row justify-center items-center gap-3 p-6 bg-white border-4 border-black shadow-neo-sm">
                    <div className="w-16 h-10 bg-mint-soft border-4 border-black flex items-center justify-center font-black text-sm uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)]">teks</div>
                    <div className="w-20 h-10 bg-mint-soft border-4 border-black flex items-center justify-center font-black text-sm uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)]">lagi</div>
                  </div>
                  <div className="md:w-2/3 flex flex-col justify-center">
                    <h3 className="text-3xl font-black uppercase mb-4 flex items-center gap-2">
                      <span className="bg-mint-soft text-black px-4 py-1 border-4 border-black shadow-neo-sm tracking-widest">inline</span>
                    </h3>
                    <p className="font-bold text-forest-teal text-lg md:text-xl mb-6 leading-relaxed bg-white border-4 border-black p-4">
                      Elemen ini hanya mengambil ruang sesuai dengan lebar konten di dalamnya dan dapat diletakkan <strong className="text-black uppercase">bersebelahan</strong>. Catatan: Properti <code className="text-black bg-mint-canvas px-2 border-2 border-black font-black">width</code> dan <code className="text-black bg-mint-canvas px-2 border-2 border-black font-black">height</code> <strong className="text-red-600 uppercase underline">TIDAK</strong> berpengaruh pada elemen ini. (Contoh bawaan: <code className="text-black bg-mint-canvas px-2 border-2 border-black font-black">&lt;span&gt;</code>, <code className="text-black bg-mint-canvas px-2 border-2 border-black font-black">&lt;a&gt;</code>).
                    </p>
                    <div className="border-4 border-black shadow-neo-sm"><CodeBlock language="css" code={`.link { display: inline; }`} /></div>
                  </div>
                </div>

                {/* Inline-Block */}
                <div className="bg-canvas border-4 border-black p-6 md:p-8 shadow-neo-lg flex flex-col md:flex-row gap-8 hover:-translate-y-2 hover:shadow-neo-xl transition-all">
                  <div className="md:w-1/3 flex flex-row justify-center items-center gap-3 p-6 bg-white border-4 border-black shadow-neo-sm">
                    <div className="w-24 h-16 bg-pine-deep text-white border-4 border-black flex items-center justify-center font-black text-base uppercase shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-1 cursor-pointer transition-transform">Btn 1</div>
                    <div className="w-20 h-16 bg-pine-deep text-white border-4 border-black flex items-center justify-center font-black text-base uppercase shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-1 cursor-pointer transition-transform">Btn 2</div>
                  </div>
                  <div className="md:w-2/3 flex flex-col justify-center">
                    <h3 className="text-3xl font-black uppercase mb-4 flex items-center gap-2">
                      <span className="bg-pine-deep text-white px-4 py-1 border-4 border-black shadow-neo-sm tracking-widest">inline-block</span>
                    </h3>
                    <p className="font-bold text-forest-teal text-lg md:text-xl mb-6 leading-relaxed bg-white border-4 border-black p-4">
                      Kombinasi dari keduanya. Elemen dapat disejajarkan bersebelahan layaknya <em>inline</em>, <strong className="text-black uppercase">TETAPI</strong> kamu tetap bisa mengatur nilai <code className="text-black bg-mint-canvas px-2 border-2 border-black font-black">width</code> dan <code className="text-black bg-mint-canvas px-2 border-2 border-black font-black">height</code>-nya layaknya <em>block</em>. Sering digunakan untuk membuat elemen tombol (button) atau menu navigasi.
                    </p>
                    <div className="border-4 border-black shadow-neo-sm"><CodeBlock language="css" code={`.btn {\n  display: inline-block;\n  width: 150px;\n  height: 60px;\n}`} /></div>
                  </div>
                </div>

                {/* None */}
                <div className="bg-black text-white border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] flex flex-col md:flex-row gap-8 items-center hover:-translate-y-2 transition-all">
                  <div className="md:w-1/3 flex justify-center text-white p-6 border-4 border-white border-dashed bg-[#1a1a1a]">
                    <span className="material-symbols-outlined text-[80px] opacity-20">visibility_off</span>
                  </div>
                  <div className="md:w-2/3 text-white flex flex-col justify-center">
                    <h3 className="text-3xl font-black uppercase mb-4 flex items-center gap-2">
                      <span className="bg-white text-black px-4 py-1 border-4 border-white tracking-widest">none</span>
                    </h3>
                    <p className="font-bold text-white/80 text-lg md:text-xl mb-6 leading-relaxed bg-[#222] p-4 border-4 border-white">
                      Menyembunyikan elemen secara keseluruhan dari halaman sehingga elemen tersebut tidak memakan ruang layout sedikit pun. Properti ini sangat berguna ketika kita membuat fitur interaktif bersama JavaScript (seperti Pop-up, Modal, atau Menu Toggle).
                    </p>
                    <div className="border-4 border-white"><CodeBlock language="css" code={`.elemen-tersembunyi { display: none; }`} /></div>
                  </div>
                </div>

              </div>

              {/* Modern Display Teaser */}
              <div className="bg-jade-vibrant border-4 border-black p-6 md:p-12 shadow-neo-xl relative mt-16 flex flex-col md:flex-row gap-8 items-center text-white transform rotate-1 hover:rotate-0 transition-transform">
                <span className="material-symbols-outlined absolute -top-5 -right-5 md:-top-8 md:-right-8 text-5xl md:text-7xl text-black bg-mint-soft rounded-full border-4 border-black p-3 shadow-neo-md -rotate-12 hover:rotate-12 transition-transform cursor-pointer">rocket_launch</span>
                <div className="flex-1">
                  <h3 className="text-2xl md:text-4xl font-black uppercase mb-6 flex items-center gap-3 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                    <span className="material-symbols-outlined text-4xl md:text-5xl">star</span>
                    Display Modern (Flex & Grid)
                  </h3>
                  <div className="space-y-4">
                    <p className="font-bold text-black text-lg md:text-xl leading-relaxed bg-white border-4 border-black p-4 shadow-neo-sm">
                      Selain 4 tipe dasar di atas, CSS modern telah dilengkapi dengan dua metode canggih yang sangat andal untuk menyusun tata letak kompleks: <code className="bg-pine-deep text-white font-black px-2 py-1 border-2 border-black inline-block mt-1 sm:mt-0">display: flex;</code> dan <code className="bg-pine-deep text-white font-black px-2 py-1 border-2 border-black inline-block mt-1 sm:mt-0">display: grid;</code>.
                    </p>
                    <p className="font-bold text-black text-lg md:text-xl leading-relaxed bg-white border-4 border-black p-4 shadow-neo-sm">
                      Karena fungsionalitasnya yang <strong className="uppercase">sangat ekstensif</strong> dan penting, kita akan membahasnya lebih mendalam secara khusus pada materi selanjutnya di bab ini, yaitu <strong>Flexbox Layout</strong> dan <strong>Grid Layout</strong>.
                    </p>
                  </div>
                </div>
              </div>

            </section>

            {/* Footer / Penutup */}
            <footer className="bg-pine-deep border-4 border-black p-8 md:p-12 shadow-neo-xl text-center relative hover:-translate-y-1 transition-transform">
              <span className="material-symbols-outlined absolute -top-4 -right-4 md:-top-6 md:-right-6 text-5xl md:text-6xl text-black bg-white rounded-full border-4 border-black p-3 shadow-neo-md hover:scale-110 transition-transform cursor-pointer">layers</span>
              <p className="text-2xl md:text-4xl font-black text-white uppercase leading-relaxed max-w-4xl mx-auto drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] tracking-tight">
                "Pahami dengan baik karakter dasar dari properti Display, karena ia merupakan pondasi utama dalam menyusun dan membangun layout website!"
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

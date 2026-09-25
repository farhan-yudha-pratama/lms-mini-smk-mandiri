"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import CodeBlock from '@/components/CodeBlock';
import { useState } from 'react';
import QuizTrigger from '@/components/quiz-engine/QuizTrigger';

export default function PengenalanHTMLPage() {
  const [isStarted, setIsStarted] = useState(false);

  return (
    <>
      <Headbar
        links={[
          { label: 'Materi', href: '/pengenalan-html', isActive: true },
          { label: 'Soal Teori', href: '/pengenalan-html/soal', isActive: false }
        ]}
      />

      <div className="flex pt-[88px] min-h-screen">
        <Sidebar />

        <main className="md:ml-[280px] w-full p-4 md:p-10 bg-canvas relative" style={{ backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">

            {/* Header & Hero Section */}
            <section className="bg-jade-vibrant border-4 border-black p-6 md:p-12 shadow-neo-xl text-center relative overflow-hidden text-white">
              <div className="absolute top-0 left-0 bg-white text-black font-black px-4 py-1 border-b-4 border-r-4 border-black shadow-neo-sm z-20">
                MATERI 01
              </div>
              <div className="absolute top-2 md:top-4 left-2 md:left-4 z-0">
                <span className="material-symbols-outlined text-6xl md:text-[100px] text-black opacity-10">html</span>
              </div>
              <div className="absolute bottom-2 md:bottom-4 right-2 md:right-4 z-0">
                <span className="material-symbols-outlined text-6xl md:text-[100px] text-black opacity-10">code</span>
              </div>
              <div className="relative z-10 pt-4">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tighter uppercase mb-4 md:mb-6 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  Berkenalan <br className="hidden md:block" /> Dengan HTML
                </h1>
                <p className="text-base md:text-xl font-bold text-black bg-mint-soft inline-block px-4 py-2 md:px-6 md:py-3 border-4 border-black mb-8 md:mb-10 shadow-neo-md uppercase tracking-tight">
                  Pondasi super penting dari seluruh website di dunia internet!
                </p>
                <div>
                  <button
                    onClick={() => setIsStarted(!isStarted)}
                    className="bg-white text-black font-black text-xl md:text-3xl px-8 py-5 md:px-12 md:py-6 border-4 border-black shadow-neo-lg hover:-translate-y-2 hover:-translate-x-2 hover:shadow-neo-xl active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all uppercase tracking-widest flex items-center gap-4 mx-auto"
                  >
                    {isStarted ? (
                      <><span>Sedang Fokus...</span> <span className="material-symbols-outlined font-black text-4xl animate-spin">sync</span></>
                    ) : (
                      <><span>Mulai Belajar</span> <span className="material-symbols-outlined font-black text-4xl">bolt</span></>
                    )}
                  </button>
                </div>
              </div>
            </section>

            {/* Section 1: Analogi Dunia Nyata */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-pine-deep text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">01</span>
                HTML Ibarat Rangka Bangunan
              </h2>

              <div className="flex flex-col md:flex-row gap-8 md:gap-10 mb-10 items-stretch">
                <div className="flex-1 bg-mint-canvas border-4 border-black p-6 md:p-8 shadow-neo-md hover:-translate-y-2 transition-transform">
                  <p className="text-base md:text-lg font-bold text-forest-teal leading-relaxed">
                    Bayangkan kamu sedang membangun sebuah <strong className="bg-jade-vibrant text-white px-2 py-1 border-2 border-black uppercase font-black tracking-widest inline-block mb-1">Rumah</strong>. Sebelum rumah itu dicat cantik atau dialiri listrik, kamu harus membangun pondasi, dinding bata, dan tiang penyangganya yang kokoh. Nah, <strong className="bg-black text-white px-2 py-1 border-2 border-black inline-block mt-2 mb-1">HTML (HyperText Markup Language)</strong> adalah cetak biru kerangka dari sebuah halaman web. Tanpa HTML, tidak akan ada teks, gambar, atau elemen logis apapun yang bisa nongol di layarmu!
                  </p>
                </div>
                <div className="md:w-1/3 border-4 border-black shadow-neo-md rotate-2 hover:rotate-0 transition-transform flex items-center justify-center bg-white p-4 h-auto min-h-[200px]">
                  <img
                    src="/pengenalan-html/image1.jpg"
                    alt="Analogi Rumah"
                    className="w-full h-full object-cover border-4 border-black shadow-neo-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-10">
                <div className="bg-white border-4 border-black p-6 shadow-neo-md hover:-translate-y-2 hover:shadow-neo-lg transition-transform group flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-jade-vibrant border-4 border-black flex items-center justify-center rounded-full mb-6 shadow-neo-sm group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-4xl text-white font-black">view_stream</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-black uppercase mb-3">Struktur Utama</h3>
                  <p className="text-base font-bold text-forest-teal">HTML menentukan di mana letak persisnya judul, paragraf, dan tombol berada.</p>
                </div>
                <div className="bg-white border-4 border-black p-6 shadow-neo-md hover:-translate-y-2 hover:shadow-neo-lg transition-transform group flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-pine-deep border-4 border-black flex items-center justify-center rounded-full mb-6 shadow-neo-sm group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-4xl text-white font-black">language</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-black uppercase mb-3">Bahasa Universal</h3>
                  <p className="text-base font-bold text-forest-teal">Seluruh browser bumi (Chrome, Safari, Firefox) sepakat mematuhi standar HTML.</p>
                </div>
                <div className="bg-white border-4 border-black p-6 shadow-neo-md hover:-translate-y-2 hover:shadow-neo-lg transition-transform group flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-black border-4 border-black flex items-center justify-center rounded-full mb-6 shadow-neo-sm group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-4xl text-mint-soft font-black">integration_instructions</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-black uppercase mb-3">Bukan Coding Sulit</h3>
                  <p className="text-base font-bold text-forest-teal">HTML ini bahasa "Markup", bukan bahasa pemrograman yang punya logika matematika ribet.</p>
                </div>
              </div>

              {/* Callout Box Brutalist */}
              <div className="bg-black border-4 border-black p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-center shadow-neo-lg rotate-1 hover:rotate-0 transition-transform text-white">
                <span className="material-symbols-outlined text-6xl md:text-[80px] text-mint-soft drop-shadow-[2px_2px_0px_rgba(255,255,255,1)]">lightbulb</span>
                <p className="text-xl md:text-3xl font-black uppercase leading-relaxed text-center md:text-left tracking-tight">
                  "HTML adalah pondasi batanya, CSS adalah desain catnya, dan JavaScript adalah listrik yang membuatnya hidup interaktif!"
                </p>
              </div>
            </section>

            {/* Section 2: Bongkar Isi HTML */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12 transform -rotate-1 hover:rotate-0 transition-transform">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-mint-soft text-black w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">02</span>
                Anatomi Elemen Sakti
              </h2>

              <div className="flex justify-center mb-12">
                <div className="w-full md:w-4/5 border-4 border-black shadow-neo-lg -rotate-1 hover:rotate-0 transition-transform bg-pine-deep p-8 text-center">
                  <h3 className="text-3xl md:text-5xl font-black text-white mb-6 font-mono tracking-tight drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">&lt;p class="teks"&gt;Halo!&lt;/p&gt;</h3>
                  <p className="font-black uppercase text-sm md:text-xl text-black bg-white inline-block px-6 py-3 border-4 border-black shadow-neo-sm">Inilah Wujud Asli Tag HTML</p>
                </div>
              </div>

              <div className="space-y-8 md:space-y-10">
                {/* Item 1 */}
                <div className="flex flex-col md:flex-row border-4 border-black bg-white shadow-neo-lg hover:-translate-x-2 hover:-translate-y-2 hover:shadow-neo-xl transition-all group">
                  <div className="bg-canvas p-6 md:p-8 border-b-4 md:border-b-0 md:border-r-4 border-black flex flex-col justify-center items-center w-full md:w-2/5 text-black">
                    <span className="material-symbols-outlined text-6xl md:text-7xl mb-4 group-hover:scale-125 transition-transform font-black">code</span>
                    <h3 className="text-2xl md:text-3xl font-black uppercase text-center border-b-4 border-black pb-2">Tag Pembuka</h3>
                    <span className="bg-white px-4 py-2 border-4 border-black font-black mt-4 shadow-neo-sm text-lg md:text-xl">&lt;p&gt;</span>
                  </div>
                  <div className="p-6 md:p-8 flex items-center bg-white flex-1">
                    <p className="text-lg md:text-xl font-bold text-forest-teal leading-relaxed bg-mint-canvas p-6 border-4 border-black">
                      Digunakan untuk memulai sebuah elemen. Ditulis dengan memeluk nama tag menggunakan kurung sudut (angle brackets). Di contoh ini kita menggunakan huruf <code className="bg-white px-2 py-1 font-black">p</code> yang berarti Paragraf.
                    </p>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="flex flex-col md:flex-row border-4 border-black bg-white shadow-neo-lg hover:-translate-x-2 hover:-translate-y-2 hover:shadow-neo-xl transition-all group">
                  <div className="bg-jade-vibrant p-6 md:p-8 border-b-4 md:border-b-0 md:border-r-4 border-black flex flex-col justify-center items-center w-full md:w-2/5 text-white">
                    <span className="material-symbols-outlined text-6xl md:text-7xl mb-4 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] group-hover:scale-125 transition-transform font-black">label</span>
                    <h3 className="text-2xl md:text-3xl font-black uppercase text-center drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] border-b-4 border-black pb-2">Atribut Spesial</h3>
                    <span className="bg-black px-4 py-2 border-4 border-white font-black mt-4 shadow-neo-sm text-lg md:text-xl text-white">class="teks"</span>
                  </div>
                  <div className="p-6 md:p-8 flex items-center bg-white flex-1">
                    <p className="text-lg md:text-xl font-bold text-forest-teal leading-relaxed bg-mint-canvas p-6 border-4 border-black">
                      Memberikan informasi atau kekuatan tambahan pada elemen. Selalu diletakkan dan bersembunyi di dalam tag pembuka. Formatnya selalu sepasang: nama atribut beserta nilainya.
                    </p>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="flex flex-col md:flex-row border-4 border-black bg-white shadow-neo-lg hover:-translate-x-2 hover:-translate-y-2 hover:shadow-neo-xl transition-all group">
                  <div className="bg-pine-deep p-6 md:p-8 border-b-4 md:border-b-0 md:border-r-4 border-black flex flex-col justify-center items-center w-full md:w-2/5 text-white">
                    <span className="material-symbols-outlined text-6xl md:text-7xl mb-4 group-hover:scale-125 transition-transform font-black drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">code_off</span>
                    <h3 className="text-2xl md:text-3xl font-black uppercase text-center border-b-4 border-black pb-2 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">Tag Penutup</h3>
                    <span className="bg-white px-4 py-2 border-4 border-black font-black mt-4 shadow-neo-sm text-lg md:text-xl text-black">&lt;/p&gt;</span>
                  </div>
                  <div className="p-6 md:p-8 flex items-center bg-white flex-1">
                    <p className="text-lg md:text-xl font-bold text-forest-teal leading-relaxed bg-mint-canvas p-6 border-4 border-black">
                      Satpam penjaga di akhir! Menandakan akhir dari sebuah elemen. Bentuknya sama kembar persis seperti tag pembuka namun ditambahkan sebuah garis miring (slash) di depan namanya.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Struktur Dasar HTML */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12">
              <h2 className="text-2xl md:text-4xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-forest-teal text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">03</span>
                Struktur Wajib HTML5
              </h2>

              <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-stretch">
                <div className="flex-1 space-y-8">
                  <p className="text-lg md:text-xl font-bold text-forest-teal leading-relaxed bg-canvas p-6 border-4 border-black shadow-neo-sm">
                    Setiap kali membuat file web baru, kamu <strong>wajib</strong> menuliskan kerangka dasarnya. Tanpa kerangka ini, browser akan bingung dan ngawur merender website kamu. Inilah <strong className="bg-black text-white px-2 py-1 uppercase tracking-widest font-black inline-block mt-1">Cetak Biru</strong> sesungguhnya!
                  </p>

                  {/* Penjelasan Tag/Atribut */}
                  <div className="space-y-6">
                    <div className="bg-white border-4 border-black p-6 shadow-neo-md hover:-translate-x-1 hover:-translate-y-1 hover:shadow-neo-lg transition-transform flex flex-col md:flex-row md:items-center gap-6">
                      <div className="flex-shrink-0">
                        <span className="bg-mint-soft text-black px-4 py-3 border-4 border-black font-mono font-black shadow-neo-sm text-lg md:text-xl block">&lt;!DOCTYPE html&gt;</span>
                      </div>
                      <p className="font-bold text-forest-teal text-base md:text-lg leading-relaxed">Baris teratas absolut. Memberitahu browser: "Hei, bersiaplah, ini adalah dokumen web berstandar HTML versi 5 terbaru!"</p>
                    </div>

                    <div className="bg-white border-4 border-black p-6 shadow-neo-md hover:-translate-x-1 hover:-translate-y-1 hover:shadow-neo-lg transition-transform flex flex-col md:flex-row md:items-center gap-6">
                      <div className="flex-shrink-0">
                        <span className="bg-mint-soft text-black px-4 py-3 border-4 border-black font-mono font-black shadow-neo-sm text-lg md:text-xl block">&lt;html lang="id"&gt;</span>
                      </div>
                      <p className="font-bold text-forest-teal text-base md:text-lg leading-relaxed">Ibu dari segala tag penutup. Atribut <code className="bg-white px-1 border-2 border-black font-black">lang="id"</code> berteriak ke Google bahwa isi bahasa web ini adalah bahasa Indonesia.</p>
                    </div>

                    <div className="bg-white border-4 border-black p-6 shadow-neo-md hover:-translate-x-1 hover:-translate-y-1 hover:shadow-neo-lg transition-transform flex flex-col md:flex-row md:items-center gap-6">
                      <div className="flex-shrink-0 flex flex-col sm:flex-row gap-3">
                        <span className="bg-mint-soft text-black px-4 py-3 border-4 border-black font-mono font-black shadow-neo-sm text-lg md:text-xl block">&lt;head&gt;</span>
                        <span className="bg-jade-vibrant text-white px-4 py-3 border-4 border-black font-mono font-black shadow-neo-sm text-lg md:text-xl block">&lt;body&gt;</span>
                      </div>
                      <p className="font-bold text-forest-teal text-base md:text-lg leading-relaxed">Tubuh web terbelah dua. <code className="font-black text-black">Head</code> untuk letak pengaturan rahasia tak kasat mata, dan <code className="font-black text-black">Body</code> adalah kanvas tempat semua kodemu akan dipajang.</p>
                    </div>
                  </div>
                </div>

                {/* Code Block Visual */}
                <div className="w-full lg:w-2/5 border-4 border-black shadow-neo-xl bg-black group overflow-hidden flex flex-col mt-4 lg:mt-0 rotate-1 hover:rotate-0 transition-transform">
                  <div className="w-full h-12 border-b-4 border-black bg-mint-canvas flex items-center px-4 gap-3">
                    <div className="w-5 h-5 rounded-none bg-white border-4 border-black"></div>
                    <div className="w-5 h-5 rounded-full bg-black border-2 border-black"></div>
                    <span className="ml-2 font-black uppercase text-sm tracking-widest text-white bg-pine-deep px-3 py-1 border-2 border-black shadow-neo-sm">index.html</span>
                  </div>
                  <div className="p-6 relative flex-grow bg-black">
                    <pre className="font-mono text-sm md:text-lg whitespace-pre-wrap leading-relaxed relative z-10 font-bold">
                      <span className="text-gray-400">&lt;!</span><span className="text-jade-vibrant">DOCTYPE</span> <span className="text-mint-soft">html</span><span className="text-gray-400">&gt;</span><br />
                      <span className="text-gray-400">&lt;</span><span className="text-white">html</span> <span className="text-mint-soft">lang</span><span className="text-gray-400">=</span><span className="text-jade-vibrant">"id"</span><span className="text-gray-400">&gt;</span><br />
                      <span className="text-gray-400">&lt;</span><span className="text-white">head</span><span className="text-gray-400">&gt;</span><br />
                      <span className="text-gray-400">&lt;</span><span className="text-white">title</span><span className="text-gray-400">&gt;</span><span className="text-mint-soft">My Web</span><span className="text-gray-400">&lt;/</span><span className="text-white">title</span><span className="text-gray-400">&gt;</span><br />
                      <span className="text-gray-400">&lt;/</span><span className="text-white">head</span><span className="text-gray-400">&gt;</span><br />
                      <span className="text-gray-400">&lt;</span><span className="text-white">body</span><span className="text-gray-400">&gt;</span><br />
                      <span className="text-jade-vibrant">{"<!--"} Kanvas Lukismu {"-->"}</span><br />
                      <span className="text-gray-400">&lt;/</span><span className="text-white">body</span><span className="text-gray-400">&gt;</span><br />
                      <span className="text-gray-400">&lt;/</span><span className="text-white">html</span><span className="text-gray-400">&gt;</span>
                    </pre>
                  </div>
                </div>
              </div>
            </section>

            {/* Footer / Penutup */}
            <footer className="bg-pine-deep border-4 border-black p-8 md:p-12 shadow-neo-xl text-center relative rotate-1 hover:rotate-0 transition-transform">
              <span className="material-symbols-outlined absolute -top-4 -right-4 md:-top-6 md:-right-6 text-5xl md:text-6xl text-white bg-jade-vibrant rounded-none border-4 border-black p-3 shadow-neo-md hover:scale-110 transition-transform cursor-pointer">push_pin</span>
              <p className="text-2xl md:text-4xl font-black text-white uppercase leading-relaxed max-w-4xl mx-auto drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] tracking-tight">
                "Segala kemegahan visual di layarmu awalnya hanyalah blok-blok teks mati dari HTML yang disusun penuh cinta!"
              </p>
            </footer>

            <QuizTrigger pageSlug="pengenalan-html" />

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

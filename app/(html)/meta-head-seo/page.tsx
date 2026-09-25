"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import CodeBlock from '@/components/CodeBlock';
import QuizTrigger from '@/components/quiz-engine/QuizTrigger';

export default function MetaHeadSeoPage() {
  return (
    <>
      <Headbar
        links={[
          { label: 'Materi', href: '/meta-head-seo', isActive: true },
          { label: 'Soal Teori', href: '/meta-head-seo/soal', isActive: false }
        ]}
      />
      <div className="flex pt-[88px] min-h-screen">
        <Sidebar />
        <main className="md:ml-[280px] w-full p-4 md:p-10 bg-canvas relative" style={{ backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">

            {/* Header & Hero Section */}
            <section className="bg-white border-4 border-black p-6 md:p-12 shadow-neo-xl text-center relative overflow-hidden transform -rotate-1 hover:rotate-0 transition-transform">
              <div className="absolute top-0 left-0 bg-jade-vibrant text-white font-black px-4 py-1 border-b-4 border-r-4 border-black shadow-neo-sm">
                MATERI 10
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-black tracking-tighter uppercase mt-6 mb-4 md:mb-6">
                Meta, HEAD & SEO
              </h1>
              <p className="text-base md:text-xl font-bold text-white bg-forest-teal inline-block px-4 py-2 md:px-6 md:py-3 border-4 border-black mb-4 md:mb-6 shadow-neo-md uppercase tracking-tight">
                Konfigurasi Rahasia di Balik Layar yang Menentukan Nasib Websitemu!
              </p>
            </section>

            {/* Section 1: Bagian <head> secara Detail */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-mint-soft text-black w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">01</span>
                Anatomi Tag &lt;head&gt;
              </h2>

              <div className="mb-10">
                <p className="font-bold text-forest-teal text-lg md:text-xl mb-6 leading-relaxed bg-mint-canvas p-6 border-4 border-black shadow-neo-sm">
                  Elemen <code className="bg-white px-2 py-1 border-2 border-black text-black font-black uppercase tracking-widest">&lt;head&gt;</code> merupakan <strong className="text-black underline decoration-4 decoration-jade-vibrant">"otak"</strong> dari dokumen HTML. Segala sesuatu yang kita tulis di dalam sini tidak akan tampil langsung secara visual di halaman web (kecuali tulisan tag title). Bagian ini berfungsi untuk menyimpan <em>metadata</em>, memanggil file CSS, dan menginstruksikan browser.
                </p>
              </div>

              <div className="flex flex-col lg:flex-row gap-8 mb-8 items-stretch">
                <div className="lg:w-1/2 bg-canvas border-4 border-black p-6 md:p-8 shadow-neo-md -rotate-1 hover:rotate-0 transition-transform cursor-default hover:shadow-neo-lg">
                  <h3 className="font-black text-2xl uppercase mb-6 text-black border-b-4 border-black pb-2">Title, Link & Favicon</h3>
                  <ul className="space-y-6 font-bold text-forest-teal text-base md:text-lg leading-relaxed">
                    <li className="flex flex-col gap-2">
                      <strong className="text-white bg-pine-deep px-3 py-1 border-2 border-black inline-block self-start font-black tracking-widest uppercase">Title</strong>
                      <span>Judul yang tampil di Tab Browser dan menjadi judul biru besar saat dicari di Google. Idealnya panjang title tidak lebih dari 60 karakter agar tak terpotong.</span>
                    </li>
                    <li className="flex flex-col gap-2">
                      <strong className="text-white bg-jade-vibrant px-3 py-1 border-2 border-black inline-block self-start font-black tracking-widest uppercase">Link Rel="Stylesheet"</strong>
                      <span>Cara paling umum untuk menghubungkan kerangka HTML kita dengan file desain CSS eksternal.</span>
                    </li>
                    <li className="flex flex-col gap-2">
                      <strong className="text-black bg-mint-soft px-3 py-1 border-2 border-black inline-block self-start font-black tracking-widest uppercase">Favicon</strong>
                      <span>Menggunakan tag link khusus untuk menaruh ikon/logo kecil berukuran 32x32 pixel di samping judul tab browser.</span>
                    </li>
                  </ul>
                </div>

                <div className="flex-1 min-w-0 border-4 border-black bg-black p-1 shadow-neo-lg flex flex-col justify-center transform rotate-1 hover:rotate-0 transition-transform">
                  <div className="bg-mint-soft border-b-4 border-black p-4 font-black uppercase text-black">Kode di dalam Head</div>
                  <div className="flex-grow p-1">
                    <CodeBlock
                      language="html"
                      code={`<head>\n  <!-- Judul Tab/Web -->\n  <title>Belajar HTML - EduBrutal</title>\n\n  <!-- Menyambungkan CSS -->\n  <link rel="stylesheet" href="style.css">\n\n  <!-- Ikon Web (Favicon) -->\n  <link rel="icon" href="/favicon.png">\n</head>`}
                    />
                  </div>
                  <div className="bg-white border-t-4 border-black p-6">
                    <p className="font-black uppercase text-sm mb-3 border-b-2 border-black pb-1 inline-block text-black">Simulasi Tab Browser:</p>
                    <div className="bg-[#e8eaed] border-4 border-black h-12 flex items-center px-3 gap-3 w-full shadow-neo-sm relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-jade-vibrant"></div>
                      <div className="w-5 h-5 bg-pine-deep border-2 border-black flex items-center justify-center text-[10px] text-white font-black hover:rotate-12 transition-transform cursor-pointer">E</div>
                      <span className="text-sm font-bold text-gray-800 font-sans truncate cursor-default">Belajar HTML - EduBrutal</span>
                      <span className="material-symbols-outlined text-black font-black text-sm ml-auto hover:text-jade-vibrant cursor-pointer">close</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Meta Tags Wajib (Charset & Viewport) */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-pine-deep text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">02</span>
                Meta Tag Wajib (Sistem)
              </h2>

              <p className="font-bold text-forest-teal text-lg md:text-xl mb-10 leading-relaxed bg-mint-canvas p-6 border-4 border-black shadow-neo-sm">
                Di dalam <code className="bg-white px-2 py-1 border-2 border-black text-black">&lt;head&gt;</code>, terdapat tag <code className="bg-white px-2 py-1 border-2 border-black text-black">&lt;meta&gt;</code> tunggal yang bertugas memberikan perintah teknis kepada browser. <strong>Tanpa dua meta tag dasar ini, sebuah website akan cacat!</strong>
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 mb-8">

                {/* Charset */}
                <div className="bg-canvas border-4 border-black p-6 md:p-8 shadow-neo-md flex flex-col gap-6 hover:-translate-y-2 hover:shadow-neo-lg transition-transform">
                  <div className="flex gap-4 items-center">
                    <span className="material-symbols-outlined text-5xl text-jade-vibrant drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">language</span>
                    <h3 className="font-black text-2xl uppercase text-black leading-tight">Meta Charset<br /><span className="text-lg text-pine-deep">(Encoding)</span></h3>
                  </div>
                  <div className="border-4 border-black">
                    <CodeBlock language="html" code={`<meta charset="UTF-8">`} />
                  </div>
                  <p className="font-bold text-base md:text-lg text-forest-teal leading-relaxed bg-white border-4 border-black p-4 shadow-neo-sm flex-grow">
                    Menentukan format terjemahan karakter (Character Encoding) dokumen HTML. Pernah melihat huruf berubah jadi tanda tanya aneh? Dengan mengatur ke <strong>UTF-8</strong>, kita mengizinkan browser membaca semua alfabet di bumi, huruf Kanji, hingga seluruh Emoji 🚀 tanpa ada yang error.
                  </p>
                </div>

                {/* Viewport */}
                <div className="bg-canvas border-4 border-black p-6 md:p-8 shadow-neo-md flex flex-col gap-6 hover:-translate-y-2 hover:shadow-neo-lg transition-transform">
                  <div className="flex gap-4 items-center">
                    <span className="material-symbols-outlined text-5xl text-jade-vibrant drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">smartphone</span>
                    <h3 className="font-black text-2xl uppercase text-black leading-tight">Meta Viewport<br /><span className="text-lg text-pine-deep">(Mobile)</span></h3>
                  </div>
                  <div className="border-4 border-black">
                    <CodeBlock language="html" code={`<meta name="viewport" content="width=device-width, initial-scale=1.0">`} />
                  </div>
                  <div className="font-bold text-base md:text-lg text-forest-teal leading-relaxed bg-white border-4 border-black p-4 shadow-neo-sm flex-grow space-y-3">
                    <p>Sistem <strong className="text-black">Responsive Web Design</strong> (ramah layar HP) bergantung sepenuhnya pada baris kode sakti ini.</p>
                    <ul className="list-disc list-inside marker:text-jade-vibrant">
                      <li><code>width=device-width</code>: Memaksa lebar konten web mengikuti lebar layar HP.</li>
                      <li><code>initial-scale=1.0</code>: Mengatur level zoom bawaan ke netral (tidak zoom-in).</li>
                    </ul>
                  </div>
                </div>

              </div>
            </section>

            {/* Section 3: Meta SEO & Social Media Lanjutan */}
            <section className="bg-forest-teal border-4 border-black shadow-neo-xl p-6 md:p-12 rotate-1 hover:rotate-0 transition-transform text-white">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase mb-8 md:mb-10 border-b-4 border-mint-soft pb-4 flex items-center gap-3 md:gap-4 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] text-mint-soft tracking-tighter">
                <span className="bg-jade-vibrant text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">03</span>
                Meta Tag SEO & Sosmed
              </h2>

              <p className="font-bold text-white text-lg md:text-xl mb-10 leading-relaxed bg-pine-deep p-6 border-4 border-black shadow-neo-sm">
                Bagian ini adalah kunci emas agar websitemu <strong>berada di rangking 1 Google</strong> (Search Engine Optimization) dan memunculkan gambar thumbnail raksasa yang keren saat link-nya dibagikan ke WhatsApp, Twitter, atau Facebook!
              </p>

              <div className="flex flex-col xl:flex-row gap-10 items-stretch">

                {/* Meta SEO Lengkap */}
                <div className="flex-1 space-y-8 min-w-0">

                  {/* Standard SEO */}
                  <div className="bg-white text-black border-4 border-black p-6 md:p-8 shadow-neo-lg hover:-translate-x-2 transition-transform">
                    <h4 className="font-black text-2xl uppercase mb-4 flex items-center gap-3 border-b-4 border-black pb-2 text-jade-vibrant">
                      <span className="material-symbols-outlined text-4xl text-black">search</span> 1. SEO Standar
                    </h4>
                    <p className="font-bold text-forest-teal text-base md:text-lg mb-6 leading-relaxed bg-mint-canvas p-4 border-4 border-black shadow-neo-sm">
                      <code className="bg-white px-1 border-2 border-black text-black">description</code> adalah paragraf teks abu-abu yang muncul di bawah judul pada hasil Google. Usahakan ringkas tapi menjual (150 karakter).
                    </p>
                    <div className="border-4 border-black">
                      <CodeBlock language="html" code={`<!-- Deskripsi ringkas untuk Google -->\n<meta name="description" content="Tutorial HTML terlengkap dengan desain Brutalism.">\n\n<!-- Penulis Website -->\n<meta name="author" content="Tim EduBrutal">`} />
                    </div>
                  </div>

                  {/* Open Graph (Facebook/WA) */}
                  <div className="bg-white text-black border-4 border-black p-6 md:p-8 shadow-neo-lg hover:-translate-x-2 transition-transform">
                    <h4 className="font-black text-2xl uppercase mb-4 flex items-center gap-3 border-b-4 border-black pb-2 text-pine-deep">
                      <span className="material-symbols-outlined text-4xl text-[#1877F2]">thumb_up</span> 2. Open Graph (Meta FB/WA)
                    </h4>
                    <p className="font-bold text-forest-teal text-base md:text-lg mb-6 leading-relaxed bg-mint-canvas p-4 border-4 border-black shadow-neo-sm">
                      Dikembangkan oleh Facebook, atribut <code className="bg-white px-1 border-2 border-black text-black">property="og:..."</code> bertugas memberikan judul, deskripsi, dan <strong>Thumbnail Gambar</strong> saat sebuah link dikirim ke chat WhatsApp atau FB.
                    </p>
                    <div className="border-4 border-black">
                      <CodeBlock language="html" code={`<meta property="og:title" content="WebPoint HTML">\n<meta property="og:description" content="Belajar HTML super seru.">\n<meta property="og:image" content="https://edubrutal.com/thumbnail.png">`} />
                    </div>
                  </div>

                  {/* Twitter Cards */}
                  <div className="bg-white text-black border-4 border-black p-6 md:p-8 shadow-neo-lg hover:-translate-x-2 transition-transform">
                    <h4 className="font-black text-2xl uppercase mb-4 flex items-center gap-3 border-b-4 border-black pb-2 text-[#1DA1F2]">
                      <span className="material-symbols-outlined text-4xl text-[#1DA1F2]">chat</span> 3. Twitter Cards
                    </h4>
                    <p className="font-bold text-forest-teal text-base md:text-lg mb-6 leading-relaxed bg-mint-canvas p-4 border-4 border-black shadow-neo-sm">
                      Twitter punya sistem tag-nya sendiri <code className="bg-white px-1 border-2 border-black text-black">name="twitter:..."</code> untuk memunculkan gambar raksasa (<em>summary_large_image</em>) saat di-tweet.
                    </p>
                    <div className="border-4 border-black">
                      <CodeBlock language="html" code={`<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:title" content="WebPoint HTML">\n<meta name="twitter:image" content="https://edubrutal.com/tw-thumb.png">`} />
                    </div>
                  </div>

                </div>

                {/* Simulasi Card */}
                <div className="w-full xl:w-1/3 space-y-8 flex flex-col justify-start">
                  {/* Google Preview */}
                  <div className="bg-white text-black border-4 border-black p-6 shadow-neo-lg hover:scale-[1.02] transition-transform">
                    <h4 className="font-black uppercase text-center mb-6 border-b-4 border-black pb-2 text-black tracking-widest">Simulasi Hasil Google</h4>
                    <div className="font-sans">
                      <p className="text-[12px] font-bold text-black/60 mb-2 break-all uppercase tracking-widest flex items-center gap-2"><span className="w-4 h-4 bg-gray-300 rounded-full inline-block"></span> EDUBRUTAL.COM</p>
                      <h3 className="text-xl md:text-2xl text-[#1a0dab] font-bold hover:underline cursor-pointer mb-2 line-clamp-2 leading-tight">Belajar HTML Terlengkap - EduBrutal</h3>
                      <p className="text-sm md:text-base text-[#4d5156] leading-relaxed">
                        Tutorial HTML super lengkap. Belajar ngoding web dari nol sampai level dewa dengan desain antarmuka Brutalism yang keren.
                      </p>
                    </div>
                  </div>

                  {/* WhatsApp/Open Graph Preview */}
                  <div className="bg-canvas text-black border-4 border-black p-6 md:p-8 shadow-neo-lg flex flex-col hover:scale-[1.02] transition-transform">
                    <h4 className="font-black uppercase text-center mb-6 border-b-4 border-black pb-2 text-black tracking-widest">Simulasi Chat WhatsApp</h4>
                    {/* Chat Bubble (Mockup) */}
                    <div className="bg-[#DCF8C6] p-3 md:p-4 border-4 border-black max-w-[95%] sm:max-w-[85%] self-end shadow-neo-sm rounded-tl-xl rounded-bl-xl rounded-br-xl relative">
                      <div className="bg-[#F0F2F5] border-4 border-black overflow-hidden mb-3 hover:bg-white transition-colors cursor-pointer">
                        {/* Fake image from og:image */}
                        <div className="h-32 bg-jade-vibrant border-b-4 border-black flex items-center justify-center pattern-isometric relative">
                          <span className="font-black text-white tracking-widest text-3xl drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] -rotate-6">EDUBRUTAL</span>
                        </div>
                        <div className="p-3 bg-white">
                          <h5 className="font-black text-base text-black uppercase mb-1">WebPoint HTML</h5>
                          <p className="text-sm font-bold text-gray-600 line-clamp-2 mb-1">Belajar HTML brutal paling seru. Tutorial super lengkap dan interaktif.</p>
                          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-2">edubrutal.com</p>
                        </div>
                      </div>
                      <p className="text-base md:text-lg font-bold text-black mb-1 leading-snug">Nih cek link belajarnya gaes!</p>
                      <div className="flex justify-end items-center gap-1 mt-1">
                        <span className="text-[10px] md:text-xs font-black text-gray-500">10:45 AM</span>
                        <span className="text-blue-500 material-symbols-outlined text-[14px]">done_all</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <QuizTrigger pageSlug="meta-head-seo" />

            {/* Footer */}
            <footer className="mt-16 mb-8 flex flex-col md:flex-row justify-between items-center gap-4 border-t-4 border-black pt-8">
              <p className="font-black text-sm md:text-base uppercase tracking-widest text-forest-teal bg-white border-4 border-black px-4 py-2 shadow-neo-sm text-center md:text-left">
                © 2026 FARHAN YUDHA PRATAMA
              </p>
            </footer>
          </div>
        </main>
      </div>
    </>
  );
}

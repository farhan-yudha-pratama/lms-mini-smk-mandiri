"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import CodeBlock from '@/components/CodeBlock';
import QuizTrigger from '@/components/quiz-engine/QuizTrigger';

export default function HeadingParagrafPage() {
  return (
    <>
      <Headbar
        links={[
          { label: 'Materi', href: '/heading-paragraf', isActive: true },
          { label: 'Soal Teori', href: '/heading-paragraf/soal', isActive: false }
        ]}
      />
      <div className="flex pt-[88px] min-h-screen">
        <Sidebar />
        <main className="md:ml-[280px] w-full p-4 md:p-10 bg-canvas relative" style={{ backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">

            {/* Header & Hero Section */}
            <section className="bg-white border-4 border-black p-6 md:p-12 shadow-neo-xl text-center relative overflow-hidden transform rotate-1 hover:rotate-0 transition-transform">
              <div className="absolute top-0 left-0 bg-jade-vibrant text-white font-black px-4 py-1 border-b-4 border-r-4 border-black shadow-neo-sm">
                MATERI 03
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-black tracking-tighter uppercase mt-6 mb-4 md:mb-6">
                Heading & Paragraf
              </h1>
              <p className="text-base md:text-xl font-bold text-white bg-forest-teal inline-block px-4 py-2 md:px-6 md:py-3 border-4 border-black mb-4 md:mb-6 shadow-neo-md uppercase tracking-tight">
                Tata letak teks dasar pembentuk setiap tulisan di website!
              </p>
            </section>

            {/* Section 1: Heading HTML */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-pine-deep text-mint-soft w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">01</span>
                Heading (Judul Tulisan)
              </h2>

              <div className="flex flex-col md:flex-row gap-6 mb-8">
                <div className="flex-1 bg-mint-canvas border-4 border-black p-6 shadow-neo-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-transform">
                  <p className="font-bold text-forest-teal text-base md:text-lg mb-4 leading-relaxed">
                    Tag Heading digunakan untuk membuat judul atau sub-judul. Dalam HTML, terdapat <strong className="bg-mint-soft text-black px-2 py-1 border-2 border-black">6 tingkatan</strong> heading, mulai dari <code>&lt;h1&gt;</code> hingga <code>&lt;h6&gt;</code>.
                  </p>
                  <p className="font-bold text-forest-teal text-base md:text-lg leading-relaxed">
                    <code>&lt;h1&gt;</code> adalah judul paling penting (ukuran terbesar), sedangkan <code>&lt;h6&gt;</code> adalah yang paling tidak penting (ukuran terkecil).
                  </p>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-8 items-stretch">
                <div className="w-full lg:w-1/2 border-4 border-black shadow-neo-md -rotate-1 hover:rotate-0 transition-transform bg-black flex flex-col">
                  <div className="bg-jade-vibrant border-b-4 border-black p-3 font-black uppercase text-white flex gap-2 items-center">
                    <span className="material-symbols-outlined">code</span> Kode HTML
                  </div>
                  <div className="flex-grow p-1">
                    <CodeBlock
                      language="html"
                      code={`<h1>Ini Heading 1</h1>\n<h2>Ini Heading 2</h2>\n<h3>Ini Heading 3</h3>\n<h4>Ini Heading 4</h4>\n<h5>Ini Heading 5</h5>\n<h6>Ini Heading 6</h6>`}
                    />
                  </div>
                </div>

                <div className="w-full lg:w-1/2 border-4 border-black shadow-neo-md rotate-1 hover:rotate-0 transition-transform bg-canvas p-6 flex flex-col gap-2">
                  <div className="bg-mint-soft border-4 border-black shadow-neo-sm p-3 -mx-6 -mt-6 mb-4 font-black uppercase text-black flex gap-2 items-center">
                    <span className="material-symbols-outlined">preview</span> Hasil di Browser
                  </div>
                  <h1 className="text-4xl font-bold m-0 border-b-2 border-dashed border-forest-teal pb-1">Ini Heading 1</h1>
                  <h2 className="text-3xl font-bold m-0 border-b-2 border-dashed border-forest-teal pb-1">Ini Heading 2</h2>
                  <h3 className="text-2xl font-bold m-0 border-b-2 border-dashed border-forest-teal pb-1">Ini Heading 3</h3>
                  <h4 className="text-xl font-bold m-0 border-b-2 border-dashed border-forest-teal pb-1">Ini Heading 4</h4>
                  <h5 className="text-lg font-bold m-0 border-b-2 border-dashed border-forest-teal pb-1">Ini Heading 5</h5>
                  <h6 className="text-base font-bold m-0 text-black/60">Ini Heading 6</h6>
                </div>
              </div>

              <div className="mt-10 bg-jade-vibrant border-4 border-black p-6 flex flex-col md:flex-row gap-6 items-start shadow-neo-md hover:-translate-y-1 transition-transform">
                <span className="material-symbols-outlined text-5xl text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">warning</span>
                <div>
                  <h4 className="font-black text-2xl uppercase mb-2 text-white">Penting Untuk SEO!</h4>
                  <p className="font-bold text-white text-base md:text-lg bg-forest-teal p-4 border-4 border-black shadow-neo-sm">
                    Gunakan heading dengan berurutan. Jangan gunakan <code>&lt;h1&gt;</code> hanya untuk memperbesar tulisan. Mesin pencari menggunakan struktur heading ini untuk memahami isi dari website kamu. Idealnya, hanya ada <strong className="text-mint-soft underline decoration-2">satu</strong> <code>&lt;h1&gt;</code> dalam setiap halaman.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2: Paragraf */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-mint-soft text-black w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">02</span>
                Paragraf & Formatting
              </h2>

              <p className="font-bold text-forest-teal text-lg md:text-xl mb-10 leading-relaxed">
                Tag <code>&lt;p&gt;</code> mendefinisikan sebuah paragraf. Browser secara otomatis menambahkan spasi atau jarak kosong di atas dan di bawah paragraf untuk memisahkannya dengan elemen lain.
              </p>

              <div className="space-y-10">
                {/* Paragraf Biasa */}
                <div className="border-4 border-black bg-white shadow-neo-lg flex flex-col xl:flex-row">
                  <div className="flex-1 p-6 md:p-8 border-b-4 xl:border-b-0 xl:border-r-4 border-black">
                    <h3 className="font-black text-2xl md:text-3xl uppercase mb-4 border-b-4 border-black pb-2 inline-block">1. Tag &lt;p&gt; Dasar</h3>
                    <p className="font-bold text-forest-teal mb-6">Setiap tag p akan membuat blok teks baru yang otomatis terpisah baris.</p>
                    <CodeBlock
                      language="html"
                      code={`<p>Ini adalah paragraf pertama saya.</p>\n<p>Paragraf kedua otomatis berada di bawah.</p>`}
                    />
                  </div>
                  <div className="xl:w-1/3 bg-canvas p-6 md:p-8 flex flex-col justify-center gap-4 border-t-4 xl:border-t-0 border-black">
                    <p className="bg-white border-4 border-black p-4 shadow-neo-sm font-bold text-black text-lg">Ini adalah paragraf pertama saya.</p>
                    <p className="bg-white border-4 border-black p-4 shadow-neo-sm font-bold text-black text-lg">Paragraf kedua otomatis berada di bawah.</p>
                  </div>
                </div>

                {/* Teks Formatting */}
                <div className="border-4 border-black bg-white shadow-neo-lg flex flex-col xl:flex-row">
                  <div className="flex-1 p-6 md:p-8 border-b-4 xl:border-b-0 xl:border-r-4 border-black">
                    <h3 className="font-black text-2xl md:text-3xl uppercase mb-4 border-b-4 border-black pb-2 inline-block">2. Format Teks Inline</h3>
                    <p className="font-bold text-forest-teal mb-6">Kamu bisa mengubah bentuk teks menggunakan tag seperti <code>&lt;b&gt;</code> (bold), <code>&lt;i&gt;</code> (italic), dan <code>&lt;u&gt;</code> (underline) di dalam paragraf.</p>
                    <CodeBlock
                      language="html"
                      code={`<p>Teks ini <b>Tebal</b>, yang ini <i>Miring</i>, dan ini <u>Garis Bawah</u>.</p>`}
                    />
                  </div>
                  <div className="xl:w-1/3 bg-canvas p-6 md:p-8 flex flex-col justify-center">
                    <p className="bg-mint-soft text-black font-bold border-4 border-black p-6 shadow-neo-md text-lg">
                      Teks ini <b className="text-white bg-black px-1">Tebal</b>, yang ini <i className="bg-white px-1">Miring</i>, dan ini <u className="decoration-4 underline-offset-4">Garis Bawah</u>.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Tag <br> dan <hr> */}
            <section className="bg-jade-vibrant border-4 border-black shadow-neo-xl p-6 md:p-12 text-white">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-white text-black w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">03</span>
                Pindah Baris & Pembatas
              </h2>

              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1 bg-white border-4 border-black p-6 md:p-8 shadow-neo-md text-black hover:-translate-y-2 transition-transform">
                  <h3 className="text-3xl font-black uppercase mb-4">Tag &lt;br&gt;</h3>
                  <p className="font-bold text-forest-teal mb-6 text-lg">Gunakan <code className="bg-mint-soft px-1 border-2 border-black">&lt;br&gt;</code> jika kamu ingin turun baris (enter) <strong className="underline">tanpa</strong> membuat paragraf baru.</p>
                  <CodeBlock
                    language="html"
                    code={`<p>Baris satu <br> Baris dua <br> Baris tiga</p>`}
                  />
                  <div className="mt-6 bg-canvas border-4 border-black p-6 font-bold text-lg shadow-neo-sm">
                    Baris satu <br /> Baris dua <br /> Baris tiga
                  </div>
                </div>

                <div className="flex-1 bg-white border-4 border-black p-6 md:p-8 shadow-neo-md text-black hover:-translate-y-2 transition-transform">
                  <h3 className="text-3xl font-black uppercase mb-4">Tag &lt;hr&gt;</h3>
                  <p className="font-bold text-forest-teal mb-6 text-lg">Gunakan <code className="bg-mint-soft px-1 border-2 border-black">&lt;hr&gt;</code> untuk membuat garis mendatar pembatas antar topik atau sesi bacaan.</p>
                  <CodeBlock
                    language="html"
                    code={`<p>Cerita Bab 1</p>\n<hr>\n<p>Cerita Bab 2</p>`}
                  />
                  <div className="mt-6 bg-canvas border-4 border-black p-6 font-bold text-lg shadow-neo-sm">
                    <p>Cerita Bab 1</p>
                    <hr className="my-4 border-t-4 border-black" />
                    <p>Cerita Bab 2</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4: Inline CSS */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12 transform -rotate-1 hover:rotate-0 transition-transform">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-forest-teal text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">04</span>
                Atribut Style (Inline CSS)
              </h2>

              <p className="text-lg md:text-xl font-bold text-forest-teal leading-relaxed mb-8">
                Meskipun biasanya warna dan desain diatur di file terpisah (CSS), HTML mengizinkan kita melakukan desain <span className="bg-mint-soft text-black px-2 py-1 border-2 border-black font-black uppercase tracking-widest">"dadakan"</span> langsung di dalam tag menggunakan atribut <code className="bg-jade-vibrant text-white px-2 py-1 border-2 border-black">style</code>. Ini disebut sebagai <strong>Inline CSS</strong>.
              </p>

              <div className="flex flex-col lg:flex-row gap-8 mb-10 items-stretch">
                <div className="w-full lg:w-1/2 border-4 border-black shadow-neo-lg p-0 bg-black flex flex-col">
                  <div className="bg-mint-soft border-b-4 border-black p-3 font-black uppercase flex gap-2 items-center text-black">
                    <span className="material-symbols-outlined">code</span> Contoh Penggunaan
                  </div>
                  <div className="flex-grow p-1">
                    <CodeBlock
                      language="html"
                      code={`<p style="color: red; font-size: 20px;">Teks merah besar.</p>\n<span style="background-color: yellow;">Teks stabilo</span>`}
                    />
                  </div>
                </div>

                <div className="w-full lg:w-1/2 border-4 border-black shadow-neo-lg bg-canvas p-6 md:p-8 flex flex-col gap-4 justify-center">
                  <div className="bg-pine-deep text-white border-4 border-black p-3 font-black uppercase shadow-neo-sm mb-4 self-start">
                    Hasil di Browser:
                  </div>
                  <div className="border-4 border-dashed border-forest-teal p-6 bg-white shadow-neo-sm">
                    <p style={{ color: 'red', fontSize: '20px' }} className="mb-4 font-bold">Teks merah besar.</p>
                    <span style={{ backgroundColor: 'yellow', color: 'black' }} className="font-bold px-1 border-2 border-black">Teks stabilo</span>
                  </div>
                </div>
              </div>

              <div className="bg-forest-teal text-white border-4 border-black p-6 flex flex-col md:flex-row gap-6 items-start shadow-neo-md">
                <span className="material-symbols-outlined text-5xl text-mint-soft drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">warning</span>
                <div>
                  <h4 className="font-black text-2xl uppercase mb-3">Catatan Penting</h4>
                  <p className="font-bold text-white text-lg bg-black p-4 border-4 border-mint-soft">
                    Penggunaan <code className="bg-white text-black px-1 border-2 border-black">style</code> di HTML (Inline CSS) biasanya hanya digunakan untuk kasus darurat atau spesifik. Desainer web profesional selalu meletakkan desainnya di file CSS terpisah agar kode HTML tetap bersih dan mudah dikelola!
                  </p>
                </div>
              </div>
            </section>

            <QuizTrigger pageSlug="heading-paragraf" />

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

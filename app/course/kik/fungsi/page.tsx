"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import CodeBlock from '@/components/CodeBlock';
import QuizTrigger from '@/components/quiz-engine/QuizTrigger';
import Link from 'next/link';

export default function FungsiScopeCppPage() {
  const codeAnatomi = `void nyalakanLED() {\n  // Blok ini akan dieksekusi saat dipanggil\n  digitalWrite(13, HIGH);\n}`;
  const codeFungsiBiasa = `// Membuat fungsi biasa\nvoid siramTanaman() {\n  delay(2000);\n}\n\n// Cara memanggil\nsiramTanaman();`;
  const codeFungsiDinamis = `// Membuat fungsi dengan input\nvoid siram(int detik) {\n  delay(detik * 1000);\n}\n\n// Memanggil untuk 5 detik\nsiram(5);`;
  const codeScopeGlobal = `int suhu = 30; // Variabel GLOBAL\n\nvoid setup() {\n  Serial.print(suhu); // Berhasil, suhu dikenali\n}`;
  const codeScopeLokal = `void setup() {\n  int pin = 13; // Variabel LOKAL\n}\n\nvoid loop() {\n  digitalWrite(pin, HIGH); // ERROR! pin tak dikenal\n}`;
  const codeLabChallenge = `void setup() {\n  Serial.begin(9600);\n  // Panggil fungsimu di sini\n  sapaDunia();\n}\n\n// Buat fungsimu di sini di luar kurung kurawal setup\nvoid sapaDunia() {\n  Serial.println("Halo Arduino!");\n}\n\nvoid loop() {}`;

  return (
    <>
      <Headbar
        links={[
          { label: 'Dashboard', href: '/', isActive: false },
          { label: 'Materi KIK', href: '/course/kik', isActive: false },
          { label: 'Function & Scope', href: '/course/kik/fungsi', isActive: true },
        ]}
      />

      {/* LIVE SYSTEM TICKER */}
      <div className="fixed top-[64px] left-0 w-full z-40 bg-[#2A835F] border-b-4 border-black py-1.5 px-3 md:px-4 overflow-hidden select-none">
        <div className="flex items-center gap-4 md:gap-6 whitespace-nowrap text-[11px] md:text-xs font-black uppercase text-white font-mono tracking-wider">
          <span className="flex items-center gap-1.5 md:gap-2"><span className="text-[#8BBB92]">■</span> MATERI 06: FUNCTION &amp; SCOPE</span>
          <span className="flex items-center gap-1.5 md:gap-2"><span className="text-white">●</span> KIK &amp; IOT KELAS 10</span>
          <span className="flex items-center gap-1.5 md:gap-2 bg-black text-[#8BBB92] px-2 py-0.5 border border-black shadow-[2px_2px_0px_0px_#000]">★ PRINSIP DRY: DON&apos;T REPEAT YOURSELF</span>
          <span className="flex items-center gap-1.5 md:gap-2"><span className="text-[#8BBB92]">▲</span> SMK MANDIRI</span>
        </div>
      </div>

      <div
        className="flex pt-[104px] min-h-screen bg-[#EAF4ED] text-black font-sans"
        style={{ backgroundImage: 'radial-gradient(#000000 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      >
        <Sidebar courseSlug="kik" />

        <main className="md:ml-[280px] w-full p-4 sm:p-6 md:p-8 relative">
          <div className="max-w-5xl mx-auto space-y-8 md:space-y-10">

            {/* BLOK 1: HERO PUNCHY BANNER */}
            <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-6 sm:p-8 relative overflow-hidden">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-[#092328] text-white text-xs font-black uppercase px-2.5 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000]">MATERI 06 • KIK &amp; IOT</span>
                    <span className="bg-[#8BBB92] text-black text-xs font-black uppercase px-2.5 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000]">DURASI 3 MENIT BACA</span>
                  </div>
                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-black leading-tight">
                    Ngoding Berantakan? <span className="bg-[#8BBB92] px-2 border-4 border-black inline-block shadow-[4px_4px_0px_0px_#000] transform -rotate-1">Rapikan dengan Function &amp; Scope!</span>
                  </h1>
                  <p className="text-sm sm:text-base md:text-lg font-bold text-gray-800 leading-snug">
                    Pelajari rahasia menyusun blok kode yang efisien, mudah dibaca, dan modular selayaknya engineer perangkat lunak profesional.
                  </p>
                </div>

                <div className="w-28 h-28 sm:w-36 sm:h-36 bg-[#092328] border-4 border-black shadow-[6px_6px_0px_0px_#000] transform -rotate-2 hover:rotate-0 transition-transform duration-200 flex flex-col items-center justify-center text-center p-3 shrink-0 self-center lg:self-auto">
                  <span className="bg-[#8BBB92] text-black font-black text-[10px] sm:text-xs uppercase px-2 py-0.5 border-2 border-black shadow-[2px_2px_0px_0px_#000]">MODULAR</span>
                  <span className="material-symbols-outlined text-4xl sm:text-5xl text-[#8BBB92] my-1">extension</span>
                  <span className="text-[10px] font-mono font-black text-white uppercase tracking-wider">FUNCTION</span>
                </div>
              </div>
            </section>

            {/* BLOK 2: ANALOGI 1 DETIK & DEFINISI KILAT */}
            <section className="space-y-4">
              <div className="bg-[#8BBB92] border-4 border-black shadow-[6px_6px_0px_0px_#000] p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <span className="text-3xl sm:text-4xl shrink-0">☕</span>
                  <div className="space-y-1.5">
                    <h3 className="text-base sm:text-lg font-black uppercase text-black">Mengapa Ini Sangat Penting?</h3>
                    <p className="text-xs sm:text-sm font-bold text-black leading-relaxed">
                      Bayangkan kamu sedang memasak. Daripada mengingat urutan instruksi &quot;Cara Merebus Air&quot; langkah demi langkah setiap kali ingin membuat kopi, bukankah jauh lebih mudah jika kamu cukup menekan satu tombol pintar berlabel <strong>&quot;Rebus Air&quot;</strong>?
                    </p>
                    <div className="inline-block bg-black text-[#8BBB92] text-xs font-mono font-bold px-2.5 py-1 border border-black mt-1">
                      💡 Pro-Tip: Di industri teknologi, prinsip ini disebut <strong>DRY (Don&apos;t Repeat Yourself)</strong>. Menghindari copy-paste baris kode panjang adalah ciri khas programmer cerdas!
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_#000]">
                  <span className="bg-[#092328] text-[#8BBB92] font-mono text-xs font-black uppercase px-2 py-0.5 border border-black inline-block mb-1">DEFINISI 01</span>
                  <h4 className="text-base font-black uppercase text-black">Function (Fungsi)</h4>
                  <p className="text-xs font-bold text-gray-800 leading-snug mt-1">
                    Sekumpulan blok baris kode yang dibungkus dan diberi nama khusus agar bisa dipanggil berulang kali di mana pun.
                  </p>
                </div>
                <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_#000]">
                  <span className="bg-[#2A835F] text-white font-mono text-xs font-black uppercase px-2 py-0.5 border border-black inline-block mb-1">DEFINISI 02</span>
                  <h4 className="text-base font-black uppercase text-black">Scope (Ruang Lingkup)</h4>
                  <p className="text-xs font-bold text-gray-800 leading-snug mt-1">
                    Hak akses wilayah. Aturan ketat tentang di bagian sebelah mana saja sebuah variabel boleh dikenali, diakses, atau digunakan.
                  </p>
                </div>
              </div>
            </section>

            {/* BLOK 3: ANATOMI FUNCTION & 2 VARIASI */}
            <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-5 sm:p-8 space-y-6">
              <div className="border-b-4 border-black pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="bg-[#092328] text-[#8BBB92] font-mono text-xs font-black uppercase px-2 py-0.5 border border-black inline-block mb-1">BAGIAN 1</span>
                  <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">Anatomi Function di Arduino C++</h2>
                </div>
                <span className="bg-[#2A835F] text-white text-xs font-black uppercase px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] self-start sm:self-auto">Sintaks Dasar</span>
              </div>

              <div className="border-4 border-black shadow-[4px_4px_0px_0px_#000]">
                <div className="bg-black text-white px-3 py-1.5 font-mono text-xs font-black uppercase flex items-center justify-between border-b-2 border-black">
                  <span>Struktur_Fungsi.ino</span>
                  <span className="text-[#8BBB92]">Tipe + Nama + ()</span>
                </div>
                <CodeBlock code={codeAnatomi} language="cpp" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-bold">
                <div className="bg-[#EAF4ED] border-2 border-black p-3 shadow-[2px_2px_0px_0px_#000]">
                  <span className="text-[#12544F] font-mono font-black uppercase block mb-1">Tipe Kembalian</span>
                  Menentukan apakah fungsi memberikan nilai balik (misal: <code>void</code> jika tidak ada balikan, <code>int</code> jika membalas angka).
                </div>
                <div className="bg-[#EAF4ED] border-2 border-black p-3 shadow-[2px_2px_0px_0px_#000]">
                  <span className="text-[#12544F] font-mono font-black uppercase block mb-1">Nama Fungsi</span>
                  Identifier bebas, biasanya kata kerja penanda tugas spesifik (contoh: <code>nyalakanLED</code>).
                </div>
                <div className="bg-[#EAF4ED] border-2 border-black p-3 shadow-[2px_2px_0px_0px_#000]">
                  <span className="text-[#12544F] font-mono font-black uppercase block mb-1">Parameter</span>
                  Tempat memasukkan input variabel dinamis yang diletakkan di dalam tanda kurung <code>()</code>.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="border-4 border-black p-4 space-y-2 bg-[#FAF8F5] shadow-[4px_4px_0px_0px_#000]">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black uppercase text-black">1. Fungsi Biasa (Void tanpa Parameter)</h3>
                  </div>
                  <p className="text-xs font-bold text-gray-700">
                    Sangat kaku dan statis. Hanya menjalankan perintah tetap yang sama persis secara berulang tanpa membutuhkan input tambahan.
                  </p>
                  <CodeBlock code={codeFungsiBiasa} language="cpp" />
                </div>

                <div className="border-4 border-black p-4 space-y-2 bg-[#FAF8F5] shadow-[4px_4px_0px_0px_#000]">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black uppercase text-black">2. Fungsi Dinamis (dengan Parameter)</h3>
                  </div>
                  <p className="text-xs font-bold text-gray-700">
                    Lebih cerdas. Dapat menjalankan tugas yang sedikit bervariasi sesuai dengan &apos;bahan baku&apos; (input variabel) yang kita lemparkan.
                  </p>
                  <CodeBlock code={codeFungsiDinamis} language="cpp" />
                </div>
              </div>
            </section>

            {/* BLOK 4: BATAS SCOPE & LAB MANDIRI TINKERCAD */}
            <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-5 sm:p-8 space-y-6">
              <div className="border-b-4 border-black pb-3">
                <span className="bg-[#092328] text-[#8BBB92] font-mono text-xs font-black uppercase px-2 py-0.5 border border-black inline-block mb-1">BAGIAN 2</span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">Batas Scope (Ruang Lingkup)</h2>
                <p className="text-xs sm:text-sm font-bold text-gray-700 mt-1">
                  Aturan main kasta deklarasi variabel: Menentukan seberapa luas sebuah variabel dapat &apos;terlihat&apos; dan dipanggil oleh bagian kode lainnya.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#EAF4ED] border-4 border-black p-4 space-y-2 shadow-[4px_4px_0px_0px_#000] flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2"><span className="text-2xl">🌍</span><h3 className="text-base font-black uppercase text-black">Scope Global (Terbuka Bebas)</h3></div>
                    <p className="text-xs font-bold text-gray-800 leading-snug">
                      Ditulis melayang di paling atas dokumen kode (di luar semua blok fungsi). Layaknya <strong>Kunci Utama Gerbang Rumah</strong>, siapapun dan bagian fungsi manapun (termasuk <code>setup</code> dan <code>loop</code>) berhak penuh membaca dan memodifikasi nilainya!
                    </p>
                  </div>
                  <CodeBlock code={codeScopeGlobal} language="cpp" />
                </div>

                <div className="bg-[#FAF8F5] border-4 border-black p-4 space-y-2 shadow-[4px_4px_0px_0px_#000] flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2"><span className="text-2xl">🔒</span><h3 className="text-base font-black uppercase text-black">Scope Lokal (Sangat Terbatas)</h3></div>
                    <p className="text-xs font-bold text-gray-800 leading-snug">
                      Hanya dideklarasikan dan ditahan di dalam blok kurung kurawal fungsi tertentu. Persis seperti <strong>Kunci Laci Kamar Pribadi</strong>, ia eksklusif hanya untuk fungsi penciptanya. Fungsi di ruangan sebelah tidak akan pernah tahu kalau laci (variabel) itu pernah ada!
                    </p>
                  </div>
                  <CodeBlock code={codeScopeLokal} language="cpp" />
                </div>
              </div>

              {/* Lab Mandiri: Ahli Fungsi & Scope */}
              <div className="border-4 border-black bg-[#092328] text-white p-5 space-y-4 shadow-[4px_4px_0px_0px_#000]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-[#8BBB92] pb-3">
                  <div>
                    <span className="bg-[#8BBB92] text-black font-mono text-[10px] font-black uppercase px-2 py-0.5 border border-black inline-block mb-1">PRAKTIK LAB</span>
                    <h3 className="text-lg font-black uppercase text-white">Lab Mandiri: Ahli Fungsi &amp; Scope</h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#8BBB92]">Tantangan 1 dari 3: Tombol Otomatis Pencetak Teks</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-200 font-bold leading-relaxed">
                  Buka lembar kerjamu di platform Tinkercad. Salin, rangkai logikanya, lalu pecahkan solusinya!<br />
                  <strong>Tantangan 1:</strong> Buatlah sebuah fungsi bernama <code>sapaDunia()</code> bertipe <code>void</code>. Di dalamnya, tuliskan perintah untuk mencetak <em>&quot;Halo Arduino!&quot;</em> ke Serial Monitor. Lalu panggil fungsi tersebut di dalam <code>void setup()</code>.
                </p>
                <CodeBlock code={codeLabChallenge} language="cpp" />
                <div className="bg-[#12544F] border-2 border-[#8BBB92] p-3 text-xs font-bold text-white flex items-start gap-2">
                  <span className="text-base shrink-0">💡</span>
                  <span><strong>Hint Master:</strong> Tulis <code>void sapaDunia() &#123; ... &#125;</code> di bagian bawah (di luar setup), lalu panggil dengan menuliskan <code>sapaDunia();</code> tepat di dalam area <code>setup()</code>.</span>
                </div>
              </div>
            </section>

            {/* BLOK 5: RANGKUMAN 3 BENTO & EVALUASI KUIS */}
            <section className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#12544F] text-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_#000]">
                  <span className="bg-[#8BBB92] text-black font-black text-[11px] uppercase px-2 py-0.5 border border-black inline-block mb-2">INGAT 01</span>
                  <p className="text-xs sm:text-sm font-bold leading-snug">
                    Function membungkus instruksi agar kode modular, mudah dibaca, dan mematuhi prinsip <strong>DRY</strong> (Don&apos;t Repeat Yourself).
                  </p>
                </div>
                <div className="bg-[#2A835F] text-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_#000]">
                  <span className="bg-[#092328] text-white font-black text-[11px] uppercase px-2 py-0.5 border border-black inline-block mb-2">INGAT 02</span>
                  <p className="text-xs sm:text-sm font-bold leading-snug">
                    Gunakan <strong>Parameter</strong> di dalam tanda kurung <code>()</code> saat fungsi memerlukan input dinamis yang bervariasi.
                  </p>
                </div>
                <div className="bg-white text-black border-4 border-black p-4 shadow-[4px_4px_0px_0px_#000]">
                  <span className="bg-[#8BBB92] text-black font-black text-[11px] uppercase px-2 py-0.5 border border-black inline-block mb-2">INGAT 03</span>
                  <p className="text-xs sm:text-sm font-bold leading-snug">
                    Variabel <strong>Lokal</strong> hanya hidup di blok kurung kurawal fungsinya; variabel <strong>Global</strong> bebas diakses di mana saja.
                  </p>
                </div>
              </div>

              <div className="bg-[#092328] border-4 border-black shadow-[6px_6px_0px_0px_#000] p-6 text-white text-center space-y-2">
                <div className="inline-block bg-[#8BBB92] text-black font-black text-xs uppercase px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000]">EVALUASI PEMBELAJARAN</div>
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">Uji Pemahaman: Function &amp; Scope C++</h3>
                <p className="text-xs sm:text-sm text-gray-300 font-bold max-w-lg mx-auto leading-relaxed">
                  Buktikan kemampuanmu merancang kode modular dan memahami kasta variabel melalui kuis evaluasi resmi di bawah ini!
                </p>
              </div>

              <QuizTrigger pageSlug="fungsi" />
            </section>

            {/* TACTILE NAVIGATION & FOOTER */}
            <nav className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t-4 border-black">
              <Link
                href="/course/kik/looping"
                className="w-full sm:w-auto bg-white text-black font-black uppercase text-xs sm:text-sm px-6 py-3.5 border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                <span>Materi Sebelumnya: Looping C++</span>
              </Link>

              <Link
                href="/course/kik"
                className="w-full sm:w-auto bg-[#2A835F] text-white font-black uppercase text-xs sm:text-sm px-6 py-3.5 border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer ml-auto"
              >
                <span>Halaman Utama Silabus KIK</span>
                <span className="material-symbols-outlined text-lg">home</span>
              </Link>
            </nav>

            <div className="flex flex-col sm:flex-row justify-between items-center text-[11px] font-mono font-black uppercase tracking-wider text-black border-t-4 border-black pt-4 pb-8 gap-2">
              <span>MATA PELAJARAN: KIK &amp; IOT - FUNCTION &amp; SCOPE C++</span>
              <span>SMK MANDIRI © 2026 • STANDAR TACTILE NEO BRUTALISM</span>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}

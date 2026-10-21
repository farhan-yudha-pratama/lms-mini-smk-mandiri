"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import CodeBlock from '@/components/CodeBlock';
import QuizTrigger from '@/components/quiz-engine/QuizTrigger';
import { useState } from 'react';
import Link from 'next/link';

export default function VariabelCppPage() {
  const [isStarted, setIsStarted] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [copied, setCopied] = useState(false);

  const syntaxCode = `// Ini adalah comment (diabaikan oleh alat)
void setup() { // Dijalankan SEKALI saat alat dinyalakan
    Serial.begin(9600);
    Serial.println("Halo Dunia IoT!"); // Statement diakhiri semicolon (;)
}

void loop() { // Dijalankan BERULANG terus menerus
    // logika utama kodemu ada di sini
}`;

  const challengeBugCode = `void setup() {
    Serial.begin(9600);
    int targetSuhu = 30
    Serial.println("Target suhu diatur!");
}

void loop() {
}`;

  const challengeFixedCode = `void setup() {
    Serial.begin(9600);
    int targetSuhu = 30; // Solusi: ditambahkan semicolon (;)
    Serial.println("Target suhu diatur!");
}

void loop() {
}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Headbar
        links={[
          { label: 'Dashboard', href: '/', isActive: false },
          { label: 'Materi KIK', href: '/course/kik', isActive: false },
          { label: 'Praktek C++', href: '/course/kik/variabel', isActive: true },
        ]}
      />

      <div
        className="flex pt-[88px] min-h-screen bg-canvas text-black"
        style={{
          backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      >
        <Sidebar courseSlug="kik" />

        <main className="md:ml-[280px] w-full p-4 md:p-10 relative">
          <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">

            {/* Header & Hero Section */}
            <section className="bg-jade-vibrant border-4 border-black p-6 md:p-12 shadow-neo-xl text-center relative overflow-hidden text-white">
              <div className="absolute top-0 left-0 bg-white text-black font-black px-4 py-1 border-b-4 border-r-4 border-black shadow-neo-sm z-20 text-xs md:text-sm">
                MATERI 04
              </div>
              <div className="absolute top-2 md:top-4 left-2 md:left-4 z-0 pointer-events-none opacity-10">
                <span className="material-symbols-outlined text-6xl md:text-[100px] text-black">code_blocks</span>
              </div>
              <div className="absolute bottom-2 md:bottom-4 right-2 md:right-4 z-0 pointer-events-none opacity-10">
                <span className="material-symbols-outlined text-6xl md:text-[100px] text-black">terminal</span>
              </div>

              <div className="relative z-10 pt-4 space-y-4">
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter uppercase drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] leading-tight">
                  Ngobrol Lewat Kode C++
                </h1>
                <p className="text-sm md:text-lg font-bold text-black bg-mint-soft inline-block px-4 py-2 border-4 border-black shadow-neo-md uppercase tracking-tight max-w-3xl">
                  Pahami Syntax, Variabel & Tipe Data!
                </p>
                <p className="max-w-2xl mx-auto text-sm md:text-base font-bold text-emerald-50 leading-relaxed">
                  Langkah awal dasar pemrograman terpopuler di dunia. Belajar terstruktur, santai, dan langsung uji pemahamanmu.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setIsStarted(!isStarted)}
                    className="bg-white text-black font-black text-lg md:text-2xl px-8 py-4 md:px-10 md:py-5 border-4 border-black shadow-neo-lg hover:-translate-y-1 hover:-translate-x-1 hover:shadow-neo-xl active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all uppercase tracking-widest flex items-center gap-3 mx-auto cursor-pointer"
                  >
                    {isStarted ? (
                      <>
                        <span>Sedang Fokus Mempelajari...</span>
                        <span className="material-symbols-outlined font-black text-3xl animate-spin">sync</span>
                      </>
                    ) : (
                      <>
                        <span>Mulai Belajar</span>
                        <span className="material-symbols-outlined font-black text-3xl">bolt</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </section>

            {/* Intro: Analogi Resep Robot */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12 space-y-6">
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center bg-mint-canvas border-4 border-black p-6 md:p-8 shadow-neo-md">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-pine-deep text-white border-4 border-black flex items-center justify-center flex-shrink-0 shadow-neo-sm">
                  <span className="material-symbols-outlined text-4xl md:text-5xl font-black">smart_toy</span>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight">
                    Instruksi Resep Kue untuk Robot 🤖
                  </h3>
                  <p className="text-sm md:text-base font-bold text-forest-teal leading-relaxed">
                    Bayangkan kamu sedang memberikan instruksi resep kue kepada sebuah robot. Jika kamu salah menggunakan tanda baca atau salah menaruh wadah takaran, robot tersebut pasti bingung, berhenti bergerak, dan kuemu gagal total, bukan?
                  </p>
                  <p className="text-sm md:text-base font-bold text-forest-teal leading-relaxed">
                    Begitu pula dengan <strong>C++</strong>. Untuk membuat komputer atau mikrokontroler (Arduino) mengerti apa yang kita mau, kita harus paham kaidah bahasanya terlebih dahulu melalui struktur dasar.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 1: Kaidah Syntax Dasar C++ */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12 space-y-6">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-black uppercase mb-6 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-pine-deep text-white w-12 h-12 md:w-14 md:h-14 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-xl md:text-2xl font-black">
                  01
                </span>
                <span>Kaidah Syntax Dasar C++</span>
              </h2>

              <p className="font-bold text-sm md:text-base text-forest-teal leading-relaxed">
                Di dalam dunia Arduino dan C++, kode programmu memiliki dua wadah utama: fungsi <code>setup()</code> dan fungsi <code>loop()</code>. Perhatikan contoh sintaks dasar berikut:
              </p>

              <div className="space-y-2">
                <div className="flex justify-between items-center bg-black text-white px-4 py-2 border-t-4 border-x-4 border-black">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-jade-vibrant inline-block"></span>
                    Struktur_Dasar_Arduino.cpp
                  </span>
                  <button
                    onClick={() => copyToClipboard(syntaxCode)}
                    className="text-xs bg-white text-black px-2 py-0.5 border border-black font-black uppercase hover:bg-mint-soft transition-colors cursor-pointer"
                  >
                    {copied ? 'Tersalin!' : 'Salin Kode'}
                  </button>
                </div>
                <CodeBlock code={syntaxCode} language="cpp" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="border-4 border-black p-5 bg-canvas shadow-neo-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-black text-white text-xs font-black px-2 py-1 uppercase">1. Statement & Semicolon</span>
                  </div>
                  <p className="text-sm font-bold text-gray-800 leading-relaxed">
                    Setiap baris perintah (statement) <strong>wajib diakhiri dengan titik koma (;)</strong>. Lupa titik koma ibarat berhenti bicara di tengah jalan tanpa titik.
                  </p>
                </div>

                <div className="border-4 border-black p-5 bg-mint-soft shadow-neo-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-black text-white text-xs font-black px-2 py-1 uppercase">2. Case Sensitive</span>
                  </div>
                  <p className="text-sm font-bold text-gray-800 leading-relaxed">
                    Huruf kapital sangat berpengaruh! <code>setup</code> sama sekali tidak sama dengan <code>Setup</code> atau <code>SETUP</code>. Komputer membedakannya sebagai kata berbeda.
                  </p>
                </div>
              </div>

              {/* Anatomi Fungsi Setup vs Loop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="border-3 border-black p-4 bg-white shadow-neo-sm">
                  <h4 className="font-black text-base uppercase flex items-center gap-2 mb-1">
                    <span className="material-symbols-outlined text-jade-vibrant font-black">play_arrow</span>
                    void setup()
                  </h4>
                  <p className="text-xs font-bold text-gray-700">
                    Dijalankan <strong>SEKALI</strong> saat alat dinyalakan atau di-restart. Digunakan untuk persiapan awal seperti inisialisasi pin dan komunikasi serial.
                  </p>
                </div>
                <div className="border-3 border-black p-4 bg-white shadow-neo-sm">
                  <h4 className="font-black text-base uppercase flex items-center gap-2 mb-1">
                    <span className="material-symbols-outlined text-pine-deep font-black">all_inclusive</span>
                    void loop()
                  </h4>
                  <p className="text-xs font-bold text-gray-700">
                    Dijalankan <strong>BERULANG</strong> terus-menerus tanpa henti selama alat menyala. Di sinilah logika membaca sensor dan mengendalikan perangkat berada.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2: Variabel: Kotak Penyimpanan Ajaib */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12 space-y-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-black uppercase mb-6 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-jade-vibrant text-white w-12 h-12 md:w-14 md:h-14 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-xl md:text-2xl font-black">
                  02
                </span>
                <span>Variabel: Kotak Penyimpanan Ajaib</span>
              </h2>

              <p className="font-bold text-sm md:text-base text-forest-teal leading-relaxed">
                Biar tidak pusing, mari analogikan variabel sebagai <strong className="bg-mint-soft px-2 py-0.5 border-2 border-black">sebuah kotak berlabel</strong> di dunia nyata. Komputer membutuhkan wadah ini untuk mengingat angka, teks, atau kondisi sementara.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Pilar 1: Deklarasi */}
                <div className="border-4 border-black bg-canvas shadow-neo-md p-6 space-y-4 hover:-translate-y-1 hover:shadow-neo-lg transition-all flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="w-14 h-14 bg-jade-vibrant text-white border-4 border-black flex items-center justify-center shadow-neo-sm">
                      <span className="text-3xl">📦</span>
                    </div>
                    <span className="bg-black text-white text-xs font-black uppercase px-2 py-1 inline-block">
                      Langkah 1
                    </span>
                    <h3 className="text-xl font-black uppercase tracking-tight">
                      Deklarasi Variables
                    </h3>
                    <p className="text-xs md:text-sm font-bold text-gray-700 leading-relaxed">
                      Proses memesan atau membuat kotak baru di memori komputer. Kita harus menentukan tipe kotaknya dulu agar muat dan pas.
                    </p>
                  </div>
                  <div className="bg-white border-2 border-black p-3 font-mono text-sm font-bold text-forest-teal shadow-neo-sm">
                    <code>int umur;</code>
                  </div>
                </div>

                {/* Pilar 2: Inisialisasi */}
                <div className="border-4 border-black bg-mint-canvas shadow-neo-md p-6 space-y-4 hover:-translate-y-1 hover:shadow-neo-lg transition-all flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="w-14 h-14 bg-pine-deep text-white border-4 border-black flex items-center justify-center shadow-neo-sm">
                      <span className="text-3xl">📥</span>
                    </div>
                    <span className="bg-black text-white text-xs font-black uppercase px-2 py-1 inline-block">
                      Langkah 2
                    </span>
                    <h3 className="text-xl font-black uppercase tracking-tight">
                      Inisialisasi Nilai
                    </h3>
                    <p className="text-xs md:text-sm font-bold text-gray-700 leading-relaxed">
                      Proses memasukkan barang atau nilai awal ke dalam kotak yang sudah dibuat tadi agar tidak kosong.
                    </p>
                  </div>
                  <div className="bg-white border-2 border-black p-3 font-mono text-sm font-bold text-forest-teal shadow-neo-sm">
                    <code>umur = 17;</code>
                  </div>
                </div>

                {/* Pilar 3: Aturan Identifier */}
                <div className="border-4 border-black bg-canvas shadow-neo-md p-6 space-y-4 hover:-translate-y-1 hover:shadow-neo-lg transition-all flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="w-14 h-14 bg-black text-white border-4 border-black flex items-center justify-center shadow-neo-sm">
                      <span className="text-3xl">🏷️</span>
                    </div>
                    <span className="bg-black text-white text-xs font-black uppercase px-2 py-1 inline-block">
                      Aturan Wajib
                    </span>
                    <h3 className="text-xl font-black uppercase tracking-tight">
                      Aturan Identifier (Label)
                    </h3>
                    <p className="text-xs md:text-sm font-bold text-gray-700 leading-relaxed">
                      Label kotak <strong>tidak boleh diawali angka</strong> (misal: <code>1skor</code> ❌) dan <strong>tidak boleh ada spasi</strong> (misal: <code>luas tanah</code> ❌). Gunakan camelCase (<code>luasTanah</code>) atau underscore (<code>luas_tanah</code>) ✔️.
                    </p>
                  </div>
                  <div className="bg-white border-2 border-black p-3 font-mono text-xs font-bold text-forest-teal shadow-neo-sm">
                    <code>int luas_tanah = 100;</code>
                  </div>
                </div>
              </div>

              {/* Bonus Pro Tip Deklarasi Langsung */}
              <div className="bg-mint-soft border-4 border-black p-4 md:p-6 shadow-neo-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-3xl font-black">tips_and_updates</span>
                  <div>
                    <h4 className="font-black uppercase text-sm md:text-base">Pro Tip: Deklarasi Sekaligus Isi Nilai</h4>
                    <p className="text-xs md:text-sm font-bold text-gray-800">
                      Kamu bisa menggabungkan deklarasi dan inisialisasi dalam satu baris ringkas:
                    </p>
                  </div>
                </div>
                <div className="bg-white border-2 border-black px-4 py-2 font-mono font-bold text-sm shadow-neo-sm">
                  <code>int umur = 17;</code>
                </div>
              </div>
            </section>

            {/* Section 3: Jenis Tipe Data & Kapan Harus Menggunakannya */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12 space-y-6">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-black uppercase mb-6 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-forest-teal text-white w-12 h-12 md:w-14 md:h-14 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-xl md:text-2xl font-black">
                  03
                </span>
                <span>Jenis Tipe Data & Kapan Digunakan</span>
              </h2>

              <p className="font-bold text-sm md:text-base text-forest-teal leading-relaxed">
                Di bahasa C++, setiap kotak memiliki bentuk wadah khusus. Kamu tidak bisa menuang air ke dalam kantong kain berpori! Pilih tipe data yang tepat sesuai kebutuhan perangkatmu:
              </p>

              {/* Responsive Data Type Table */}
              <div className="overflow-x-auto border-4 border-black shadow-neo-lg">
                <table className="w-full text-left border-collapse bg-white">
                  <thead>
                    <tr className="bg-black text-white text-xs md:text-sm font-black uppercase tracking-wider">
                      <th className="p-3 md:p-4 border-b-4 border-r-2 border-black">Tipe Data</th>
                      <th className="p-3 md:p-4 border-b-4 border-r-2 border-black">Jenis Data</th>
                      <th className="p-3 md:p-4 border-b-4 border-r-2 border-black">Contoh Syntax</th>
                      <th className="p-3 md:p-4 border-b-4 border-black">Kapan Digunakan?</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-black text-xs md:text-sm font-bold">
                    <tr className="hover:bg-mint-canvas transition-colors">
                      <td className="p-3 md:p-4 border-r-2 border-black font-mono font-black text-base bg-mint-soft text-black">
                        int
                      </td>
                      <td className="p-3 md:p-4 border-r-2 border-black">
                        Bilangan Bulat
                      </td>
                      <td className="p-3 md:p-4 border-r-2 border-black font-mono bg-canvas">
                        <code>int pinLampu = 13;</code>
                      </td>
                      <td className="p-3 md:p-4 text-gray-800">
                        Sangat cocok untuk menyimpan nomor Pin Arduino atau jumlah barang/putaran motor.
                      </td>
                    </tr>

                    <tr className="hover:bg-mint-canvas transition-colors">
                      <td className="p-3 md:p-4 border-r-2 border-black font-mono font-black text-base bg-jade-vibrant text-white">
                        float
                      </td>
                      <td className="p-3 md:p-4 border-r-2 border-black">
                        Bilangan Desimal
                      </td>
                      <td className="p-3 md:p-4 border-r-2 border-black font-mono bg-canvas">
                        <code>float suhu = 36.5;</code>
                      </td>
                      <td className="p-3 md:p-4 text-gray-800">
                        Wajib digunakan untuk menyimpan nilai sensor yang presisi (suhu, kelembapan, voltase).
                      </td>
                    </tr>

                    <tr className="hover:bg-mint-canvas transition-colors">
                      <td className="p-3 md:p-4 border-r-2 border-black font-mono font-black text-base bg-pine-deep text-white">
                        char
                      </td>
                      <td className="p-3 md:p-4 border-r-2 border-black">
                        Satu Karakter Tunggal
                      </td>
                      <td className="p-3 md:p-4 border-r-2 border-black font-mono bg-canvas">
                        <code>char kode = 'A';</code>
                      </td>
                      <td className="p-3 md:p-4 text-gray-800">
                        Hanya untuk menampung satu huruf/simbol dengan tanda petik tunggal (&apos;), biasanya untuk kode kontrol keypad.
                      </td>
                    </tr>

                    <tr className="hover:bg-mint-canvas transition-colors">
                      <td className="p-3 md:p-4 border-r-2 border-black font-mono font-black text-base bg-forest-teal text-white">
                        bool
                      </td>
                      <td className="p-3 md:p-4 border-r-2 border-black">
                        Logika Benar / Salah
                      </td>
                      <td className="p-3 md:p-4 border-r-2 border-black font-mono bg-canvas">
                        <code>bool lampuNyala = true;</code>
                      </td>
                      <td className="p-3 md:p-4 text-gray-800">
                        Sangat cocok untuk status saklar (ON/OFF). Menampung nilai <code>true</code>/<code>HIGH</code> atau <code>false</code>/<code>LOW</code>.
                      </td>
                    </tr>

                    <tr className="hover:bg-mint-canvas transition-colors">
                      <td className="p-3 md:p-4 border-r-2 border-black font-mono font-black text-base bg-black text-mint-soft">
                        String
                      </td>
                      <td className="p-3 md:p-4 border-r-2 border-black">
                        Kumpulan Karakter (Teks)
                      </td>
                      <td className="p-3 md:p-4 border-r-2 border-black font-mono bg-canvas">
                        <code>String pesan = &quot;Awas Panas!&quot;;</code>
                      </td>
                      <td className="p-3 md:p-4 text-gray-800">
                        Untuk mengirimkan pesan teks dari IoT ke HP melalui internet/LCD. Di Arduino diawali huruf <strong>S kapital</strong>.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 4: Golden Rules untuk Pemula C++ */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12 space-y-6">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-black uppercase mb-6 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-black text-white w-12 h-12 md:w-14 md:h-14 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-xl md:text-2xl font-black">
                  04
                </span>
                <span>Golden Rules untuk Pemula C++</span>
              </h2>

              <p className="font-bold text-sm md:text-base text-forest-teal leading-relaxed">
                Sering kali pemula merasa frustrasi karena hal-hal kecil. Pastikan kamu selalu mengingat 3 mantra wajib compiler ini agar tidak menghabiskan waktu berjam-jam hanya karena tanda baca:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                {/* Rule 1: Semicolon */}
                <div className="border-4 border-black p-6 bg-canvas shadow-neo-md space-y-3 hover:-translate-y-1 transition-all">
                  <div className="w-12 h-12 bg-black text-white border-3 border-black flex items-center justify-center shadow-neo-sm">
                    <span className="text-2xl">⚠️</span>
                  </div>
                  <h3 className="text-xl font-black uppercase text-black tracking-tight">
                    Lupa Semicolon
                  </h3>
                  <p className="text-xs md:text-sm font-bold text-gray-700 leading-relaxed">
                    Hampir <strong>90% error pemula</strong> disebabkan karena melupakan tanda titik koma (<code>;</code>) di ujung baris kode.
                  </p>
                </div>

                {/* Rule 2: Case Sensitive */}
                <div className="border-4 border-black p-6 bg-mint-canvas shadow-neo-md space-y-3 hover:-translate-y-1 transition-all">
                  <div className="w-12 h-12 bg-pine-deep text-white border-3 border-black flex items-center justify-center shadow-neo-sm">
                    <span className="text-2xl">🔠</span>
                  </div>
                  <h3 className="text-xl font-black uppercase text-black tracking-tight">
                    Sensitif Kapital
                  </h3>
                  <p className="text-xs md:text-sm font-bold text-gray-700 leading-relaxed">
                    Variabel <code>skor</code> dan <code>Skor</code> dianggap dua objek yang sepenuhnya berbeda oleh C++. Tetap konsisten!
                  </p>
                </div>

                {/* Rule 3: Comments */}
                <div className="border-4 border-black p-6 bg-mint-soft shadow-neo-md space-y-3 hover:-translate-y-1 transition-all">
                  <div className="w-12 h-12 bg-jade-vibrant text-white border-3 border-black flex items-center justify-center shadow-neo-sm">
                    <span className="text-2xl">💬</span>
                  </div>
                  <h3 className="text-xl font-black uppercase text-black tracking-tight">
                    Manfaatkan Comment
                  </h3>
                  <p className="text-xs md:text-sm font-bold text-gray-700 leading-relaxed">
                    Gunakan tanda <code>//</code> untuk mencatat maksud kodemu sendiri agar tidak lupa saat membaca kodinganmu besok lusa.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5: Tantangan Lab Mandiri */}
            <section className="bg-canvas border-4 border-black shadow-neo-xl p-6 md:p-12 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-4 border-black pb-4">
                <div>
                  <span className="bg-black text-white text-xs font-black uppercase px-2.5 py-1 border-2 border-black mb-2 inline-block">
                    PRAKTEK SIMULASI
                  </span>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-black uppercase tracking-tight">
                    Tantangan Lab Mandiri 🧪
                  </h2>
                </div>
                <span className="bg-jade-vibrant text-white font-black text-xs md:text-sm px-4 py-2 border-3 border-black shadow-neo-sm uppercase">
                  Tantangan 1 dari 3
                </span>
              </div>

              <div className="bg-white border-4 border-black p-6 md:p-8 shadow-neo-md space-y-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-3xl font-black text-forest-teal">bug_report</span>
                  <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight">
                    Tantangan 1: Berburu Bug Semicolon
                  </h3>
                </div>

                <p className="font-bold text-sm md:text-base text-gray-800 leading-relaxed">
                  Buka platform Tinkercad kamu, buat sirkuit baru, klik tombol <strong>Code (Text)</strong>, lalu uji kodenya di sana! Salin kode di bawah ke Tinkercad. Kode ini eror saat di-<em>Start Simulation</em>. Temukan di baris mana letak kesalahannya dan perbaiki!
                </p>

                {/* Bug Code Display */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center bg-black text-white px-4 py-2 border-t-4 border-x-4 border-black">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-300 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 bg-rose-500 inline-block"></span>
                      Kode_Ada_Bug.ino
                    </span>
                    <button
                      onClick={() => copyToClipboard(challengeBugCode)}
                      className="text-xs bg-white text-black px-3 py-1 border border-black font-black uppercase hover:bg-mint-soft transition-colors cursor-pointer"
                    >
                      {copied ? 'Tersalin!' : 'Salin Kode ke Tinkercad'}
                    </button>
                  </div>
                  <CodeBlock code={challengeBugCode} language="cpp" />
                </div>

                {/* Petunjuk Singkat */}
                <div className="bg-mint-soft border-3 border-black p-4 flex items-start gap-3">
                  <span className="text-2xl">💡</span>
                  <div>
                    <strong className="uppercase text-xs font-black block">Petunjuk Singkat:</strong>
                    <p className="text-xs md:text-sm font-bold text-gray-800">
                      Periksa ujung baris pendeklarasian variabel <code>targetSuhu</code>. Adakah tanda baca yang tertinggal?
                    </p>
                  </div>
                </div>

                {/* Interactive Solution Reveal */}
                <div className="pt-2">
                  <button
                    onClick={() => setShowSolution(!showSolution)}
                    className="w-full sm:w-auto bg-black text-white font-black text-sm md:text-base px-6 py-3 border-3 border-black shadow-neo-sm hover:bg-forest-teal hover:-translate-y-1 transition-all uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{showSolution ? 'Sembunyikan Solusi' : 'Lihat Solusi Perbaikan'}</span>
                    <span className="material-symbols-outlined text-lg">
                      {showSolution ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>

                  {showSolution && (
                    <div className="mt-4 border-4 border-black bg-mint-canvas p-4 md:p-6 shadow-neo-md space-y-3">
                      <div className="flex items-center gap-2 text-forest-teal">
                        <span className="material-symbols-outlined font-black">check_circle</span>
                        <h4 className="font-black uppercase text-base">Solusi yang Benar:</h4>
                      </div>
                      <CodeBlock code={challengeFixedCode} language="cpp" />
                      <p className="text-xs md:text-sm font-bold text-gray-700">
                        Pada baris ke-3, variabel <code>int targetSuhu = 30</code> belum diberi tanda titik koma (<code>;</code>). Setelah ditambahkan <code>;</code> di akhir baris, compiler C++ dapat mengenali akhir perintah dan kode berjalan sukses tanpa error!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Section 6: Komponen Evaluasi & Kuis Materi */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-10 space-y-6">
              <div className="border-b-4 border-black pb-4">
                <span className="bg-black text-white text-xs font-black uppercase px-2.5 py-1 border-2 border-black mb-2 inline-block">
                  EVALUASI PEMBELAJARAN
                </span>
                <h2 className="text-2xl md:text-3xl font-black uppercase text-black tracking-tight">
                  Uji Pemahaman Materi: Syntax, Variabel & Tipe Data
                </h2>
                <p className="text-sm font-bold text-gray-700 mt-1">
                  Kerjakan kuis evaluasi di bawah ini untuk menguji pemahaman aturan sintaks C++, deklarasi variabel, dan tipe data Arduino!
                </p>
              </div>

              {/* Komponen QuizTrigger resmi LMS */}
              <QuizTrigger pageSlug="variabel" />
            </section>

            {/* Bottom Navigasi */}
            <nav className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t-4 border-black">
              <Link
                href="/course/kik/apa-itu-iot"
                className="w-full sm:w-auto bg-white text-black font-black uppercase text-sm md:text-base px-6 py-4 border-4 border-black shadow-neo-md hover:-translate-y-1 hover:-translate-x-1 hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-3"
              >
                <span className="material-symbols-outlined font-black">arrow_back</span>
                <span>Materi Sebelumnya: Apa itu IoT?</span>
              </Link>

              <Link
                href="/course/kik"
                className="w-full sm:w-auto bg-jade-vibrant text-white font-black uppercase text-sm md:text-base px-6 py-4 border-4 border-black shadow-neo-md hover:-translate-y-1 hover:-translate-x-1 hover:shadow-neo-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-3 ml-auto"
              >
                <span>Halaman Utama KIK</span>
                <span className="material-symbols-outlined font-black">home</span>
              </Link>
            </nav>

            {/* Copyright */}
            <div className="flex justify-between items-center text-xs font-black uppercase tracking-wider text-forest-teal border-t-4 border-black pt-6 pb-8">
              <span>Mata Pelajaran: KIK & IoT - Praktek C++</span>
              <span>SMK Mandiri © 2026</span>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}

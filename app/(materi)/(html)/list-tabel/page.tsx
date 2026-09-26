"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import CodeBlock from '@/components/CodeBlock';
import QuizTrigger from '@/components/quiz-engine/QuizTrigger';

export default function ListTabelPage() {
  return (
    <>
      <Headbar
        links={[
          { label: 'Materi', href: '/list-tabel', isActive: true },
          { label: 'Soal Teori', href: '/list-tabel/soal', isActive: false }
        ]}
      />
      <div className="flex pt-[88px] min-h-screen">
        <Sidebar />
        <main className="md:ml-[280px] w-full p-4 md:p-10 bg-canvas relative" style={{ backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">

            {/* Header & Hero Section */}
            <section className="bg-white border-4 border-black p-6 md:p-12 shadow-neo-xl text-center relative overflow-hidden transform rotate-1 hover:rotate-0 transition-transform">
              <div className="absolute top-0 left-0 bg-jade-vibrant text-white font-black px-4 py-1 border-b-4 border-r-4 border-black shadow-neo-sm">
                MATERI 05
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-black tracking-tighter uppercase mt-6 mb-4 md:mb-6">
                List & Tabel
              </h1>
              <p className="text-base md:text-xl font-bold text-white bg-forest-teal inline-block px-4 py-2 md:px-6 md:py-3 border-4 border-black mb-4 md:mb-6 shadow-neo-md uppercase tracking-tight">
                Mengelompokkan data poin dan menyusun data tabular!
              </p>
            </section>

            {/* Section 1: Lists (Daftar) */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-pine-deep text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">01</span>
                Membuat Daftar (Lists)
              </h2>

              <div className="mb-10">
                <p className="font-bold text-forest-teal text-lg md:text-xl mb-6 leading-relaxed">
                  HTML menyediakan dua jenis utama untuk membuat daftar: <strong className="text-black bg-mint-soft px-2 py-1 border-2 border-black">Unordered List</strong> (Daftar tidak berurutan dengan simbol titik) dan <strong className="text-black bg-mint-soft px-2 py-1 border-2 border-black">Ordered List</strong> (Daftar berurutan angka/huruf). Di dalam keduanya, setiap item harus dibungkus dengan tag <code className="bg-canvas px-1 border-2 border-black">&lt;li&gt;</code> (List Item).
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
                {/* Unordered List */}
                <div className="border-4 border-black shadow-neo-md bg-canvas flex flex-col hover:-translate-y-2 hover:shadow-neo-lg transition-transform cursor-default">
                  <div className="bg-jade-vibrant border-b-4 border-black p-4 md:p-6">
                    <h3 className="font-black text-2xl uppercase text-white tracking-tight">Unordered List &lt;ul&gt;</h3>
                  </div>
                  <div className="p-6 md:p-8 flex-1">
                    <p className="text-base font-bold text-forest-teal mb-6 bg-white border-4 border-black p-4 shadow-neo-sm">Gunakan <code className="text-black">`&lt;ul&gt;`</code> untuk daftar yang urutannya tidak terikat baku (contoh: daftar belanja).</p>
                    <div className="border-4 border-black mb-6">
                      <CodeBlock
                        language="html"
                        code={`<ul>\n  <li>Apel</li>\n  <li>Jeruk</li>\n  <li>Mangga</li>\n</ul>`}
                      />
                    </div>
                  </div>
                  <div className="bg-white border-t-4 border-black p-6 font-bold">
                    <p className="mb-4 font-black uppercase text-sm tracking-widest text-forest-teal border-b-2 border-black pb-1 inline-block">Hasil Render:</p>
                    <ul className="list-disc list-inside space-y-2 marker:text-jade-vibrant marker:text-2xl text-lg text-black">
                      <li>Apel</li>
                      <li>Jeruk</li>
                      <li>Mangga</li>
                    </ul>
                  </div>
                </div>

                {/* Ordered List */}
                <div className="border-4 border-black shadow-neo-md bg-canvas flex flex-col hover:-translate-y-2 hover:shadow-neo-lg transition-transform cursor-default">
                  <div className="bg-pine-deep border-b-4 border-black p-4 md:p-6">
                    <h3 className="font-black text-2xl uppercase text-white tracking-tight">Ordered List &lt;ol&gt;</h3>
                  </div>
                  <div className="p-6 md:p-8 flex-1">
                    <p className="text-base font-bold text-forest-teal mb-6 bg-white border-4 border-black p-4 shadow-neo-sm">Gunakan <code className="text-black">`&lt;ol&gt;`</code> untuk daftar yang memerlukan urutan langkah hierarki (contoh: tutorial).</p>
                    <div className="border-4 border-black mb-6">
                      <CodeBlock
                        language="html"
                        code={`<ol>\n  <li>Panaskan air</li>\n  <li>Masukkan mi</li>\n  <li>Tiriskan mi</li>\n</ol>`}
                      />
                    </div>
                  </div>
                  <div className="bg-white border-t-4 border-black p-6 font-bold">
                    <p className="mb-4 font-black uppercase text-sm tracking-widest text-forest-teal border-b-2 border-black pb-1 inline-block">Hasil Render:</p>
                    <ol className="list-decimal list-inside space-y-2 marker:font-black marker:text-pine-deep text-lg text-black">
                      <li>Panaskan air</li>
                      <li>Masukkan mi</li>
                      <li>Tiriskan mi</li>
                    </ol>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Tabel */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12 transform -rotate-1 hover:rotate-0 transition-transform">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-mint-soft text-black w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">02</span>
                Membuat Tabel (Tables)
              </h2>

              <p className="font-bold text-forest-teal text-lg md:text-xl mb-10 leading-relaxed bg-mint-canvas p-6 border-4 border-black shadow-neo-sm">
                Tabel digunakan untuk menampilkan data dalam bentuk baris dan kolom. Di HTML, tabel dibangun dari kolaborasi beberapa tag secara bersamaan:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12 text-center">
                <div className="bg-white border-4 border-black p-6 shadow-neo-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-transform">
                  <h4 className="font-black text-2xl mb-2 text-jade-vibrant border-b-4 border-black pb-2">&lt;table&gt;</h4>
                  <p className="text-sm font-bold text-forest-teal mt-3">Wadah utama pembungkus tabel</p>
                </div>
                <div className="bg-white border-4 border-black p-6 shadow-neo-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-transform">
                  <h4 className="font-black text-2xl mb-2 text-jade-vibrant border-b-4 border-black pb-2">&lt;tr&gt;</h4>
                  <p className="text-sm font-bold text-forest-teal mt-3">Table Row (Membuat baris mendatar)</p>
                </div>
                <div className="bg-white border-4 border-black p-6 shadow-neo-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-transform">
                  <h4 className="font-black text-2xl mb-2 text-jade-vibrant border-b-4 border-black pb-2">&lt;th&gt;</h4>
                  <p className="text-sm font-bold text-forest-teal mt-3">Table Header (Kolom judul tebal)</p>
                </div>
                <div className="bg-white border-4 border-black p-6 shadow-neo-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-transform">
                  <h4 className="font-black text-2xl mb-2 text-jade-vibrant border-b-4 border-black pb-2">&lt;td&gt;</h4>
                  <p className="text-sm font-bold text-forest-teal mt-3">Table Data (Isi sel di kolom)</p>
                </div>
              </div>

              <div className="flex flex-col xl:flex-row gap-8 lg:gap-10">
                {/* Kode Tabel */}
                <div className="flex-1 border-4 border-black shadow-neo-lg bg-black p-1 flex flex-col">
                  <div className="bg-mint-soft border-b-4 border-black p-4 font-black uppercase tracking-tight text-black flex items-center">
                    Contoh Code Tabel
                  </div>
                  <div className="flex-grow">
                    <CodeBlock
                      language="html"
                      code={`<table border="1">\n  <tr>\n    <th>Nama</th>\n    <th>Kelas</th>\n    <th>Nilai</th>\n  </tr>\n  <tr>\n    <td>Andi</td>\n    <td>11 RPL 1</td>\n    <td>85</td>\n  </tr>\n  <tr>\n    <td>Budi</td>\n    <td>11 RPL 2</td>\n    <td>90</td>\n  </tr>\n</table>`}
                    />
                  </div>
                  <div className="bg-white border-t-4 border-black p-4">
                    <p className="text-sm font-bold text-forest-teal"><span className="text-black font-black uppercase">Catatan:</span> Atribut border="1" murni HTML lama agar garis terlihat (kini digantikan CSS).</p>
                  </div>
                </div>

                {/* Visualisasi Tabel */}
                <div className="xl:w-1/3 border-4 border-black shadow-neo-lg bg-jade-vibrant p-6 md:p-8 flex flex-col justify-center transform hover:scale-[1.01] transition-transform">
                  <h3 className="font-black text-white text-2xl uppercase mb-6 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] text-center">Tampilan Tabel</h3>
                  <div className="bg-white border-4 border-black w-full overflow-hidden shadow-neo-sm">
                    <table className="w-full text-left border-collapse border-4 border-black">
                      <thead>
                        <tr className="bg-pine-deep text-white border-b-4 border-black">
                          <th className="p-4 border-r-4 border-black font-black uppercase text-center text-sm tracking-widest">Nama</th>
                          <th className="p-4 border-r-4 border-black font-black uppercase text-center text-sm tracking-widest">Kelas</th>
                          <th className="p-4 font-black uppercase text-center text-sm tracking-widest">Nilai</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b-4 border-black font-bold text-black bg-mint-canvas">
                          <td className="p-4 border-r-4 border-black text-center text-lg">Andi</td>
                          <td className="p-4 border-r-4 border-black text-center text-lg">11 RPL 1</td>
                          <td className="p-4 text-center text-lg font-black text-jade-vibrant">85</td>
                        </tr>
                        <tr className="font-bold text-black bg-white">
                          <td className="p-4 border-r-4 border-black text-center text-lg">Budi</td>
                          <td className="p-4 border-r-4 border-black text-center text-lg">11 RPL 2</td>
                          <td className="p-4 text-center text-lg font-black text-jade-vibrant">90</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Colspan & Rowspan */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-forest-teal text-mint-soft w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">03</span>
                Merge Sel (Colspan & Rowspan)
              </h2>

              <p className="font-bold text-forest-teal text-lg md:text-xl mb-10 leading-relaxed">
                Tabel memiliki berbagai atribut tambahan. Sama seperti fitur <em>Merge Cells</em> pada Excel, HTML mengizinkan penggabungan baris atau kolom:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <div className="bg-canvas border-4 border-black p-6 md:p-8 shadow-neo-md hover:-translate-y-2 transition-transform">
                  <h3 className="font-black text-2xl mb-4 flex items-center gap-2 border-b-4 border-black pb-2 text-black"><span className="material-symbols-outlined text-jade-vibrant text-3xl">width</span> Colspan</h3>
                  <p className="text-base font-bold text-forest-teal">Menggabungkan <strong>kolom</strong> (melebar ke samping horizontal). Contoh: <code className="bg-white px-2 py-1 border-2 border-black text-black">colspan="2"</code> akan memakan 2 ruang kolom mendatar.</p>
                </div>
                <div className="bg-canvas border-4 border-black p-6 md:p-8 shadow-neo-md hover:-translate-y-2 transition-transform">
                  <h3 className="font-black text-2xl mb-4 flex items-center gap-2 border-b-4 border-black pb-2 text-black"><span className="material-symbols-outlined text-pine-deep text-3xl">height</span> Rowspan</h3>
                  <p className="text-base font-bold text-forest-teal">Menggabungkan <strong>baris</strong> (memanjang ke bawah vertikal). Contoh: <code className="bg-white px-2 py-1 border-2 border-black text-black">rowspan="2"</code> akan memakan 2 ruang baris menurun.</p>
                </div>
              </div>

              <div className="flex flex-col xl:flex-row gap-8 lg:gap-10">
                {/* Kode Colspan Rowspan */}
                <div className="flex-1 border-4 border-black shadow-neo-lg bg-black p-1 flex flex-col">
                  <div className="bg-mint-soft border-b-4 border-black p-4 font-black uppercase tracking-tight text-black">
                    Contoh Merge Cells
                  </div>
                  <div className="flex-grow">
                    <CodeBlock
                      language="html"
                      code={`<table border="1">\n  <tr>\n    <th colspan="2">Daftar Piket (Gabung 2 Kolom)</th>\n  </tr>\n  <tr>\n    <td rowspan="2">Senin (Gabung 2 Baris)</td>\n    <td>Andi</td>\n  </tr>\n  <tr>\n    <td>Budi</td>\n  </tr>\n</table>`}
                    />
                  </div>
                </div>

                {/* Visualisasi Merge */}
                <div className="xl:w-1/3 border-4 border-black shadow-neo-lg bg-pine-deep p-6 md:p-8 flex flex-col justify-center transform hover:scale-[1.01] transition-transform">
                  <h3 className="font-black text-white text-2xl uppercase mb-6 text-center drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">Tampilan Hasil</h3>
                  <div className="bg-white border-4 border-black w-full overflow-hidden shadow-neo-sm">
                    <table className="w-full text-left border-collapse border-4 border-black">
                      <tbody>
                        <tr className="bg-forest-teal border-b-4 border-black">
                          <th colSpan={2} className="p-4 border-r-4 border-black font-black text-center text-white text-sm uppercase tracking-widest">Daftar Piket (Gabung 2 Kolom)</th>
                        </tr>
                        <tr className="border-b-4 border-black font-bold text-black">
                          <td rowSpan={2} className="p-4 border-r-4 border-black text-center align-middle bg-mint-canvas text-forest-teal font-black text-sm uppercase tracking-wide border-b-4">Senin<br />(Gabung 2 Baris)</td>
                          <td className="p-4 text-center border-b-4 border-black text-lg bg-white">Andi</td>
                        </tr>
                        <tr className="font-bold text-black bg-canvas">
                          <td className="p-4 text-center text-lg">Budi</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Jarak Sel (Cellpadding & Cellspacing) */}
              <div className="mt-16 border-t-4 border-black pt-12">
                <h3 className="font-black text-2xl md:text-3xl uppercase mb-6 text-black border-b-4 border-black pb-2 inline-block">Mengatur Jarak Sel (Cellpadding & Cellspacing)</h3>
                <div className="font-bold text-forest-teal text-lg md:text-xl mb-8 leading-relaxed">
                  Selain menggabungkan sel, kamu juga bisa mengatur ruang kosong pada tabel menggunakan dua atribut klasik ini:
                  <ul className="list-disc pl-6 mt-4 space-y-2">
                    <li><code className="bg-canvas px-1 border-2 border-black text-black">cellpadding</code>: Mengatur jarak antara <strong>isi konten (teks)</strong> dengan batas sel (dinding kotaknya). Semakin besar nilainya, semakin lega isi selnya.</li>
                    <li><code className="bg-canvas px-1 border-2 border-black text-black">cellspacing</code>: Mengatur jarak antara <strong>satu sel dengan sel lainnya</strong>. Secara default tabel memiliki sedikit cellspacing, kamu bisa mengaturnya menjadi <code>0</code> agar sel saling menempel.</li>
                  </ul>
                  <p className="mt-4 text-sm bg-mint-canvas p-4 border-4 border-black shadow-neo-sm">
                    <em>Catatan: Di HTML5 modern, penggunaan atribut ini perlahan mulai digantikan oleh CSS (seperti <code>padding</code> dan <code>border-spacing</code>), tetapi sangat penting untuk mengetahuinya karena masih sering ditemui pada kode-kode lama atau email template HTML!</em>
                  </p>
                </div>

                <div className="flex flex-col xl:flex-row gap-8 lg:gap-10">
                  {/* Kode Cellpadding & Cellspacing */}
                  <div className="flex-1 border-4 border-black shadow-neo-lg bg-black p-1 flex flex-col">
                    <div className="bg-mint-soft border-b-4 border-black p-4 font-black uppercase tracking-tight text-black">
                      Contoh Kode Cellpadding & Cellspacing
                    </div>
                    <div className="flex-grow">
                      <CodeBlock
                        language="html"
                        code={`<!-- Tabel dengan Cellpadding besar dan Cellspacing 0 -->\n<table border="1" cellpadding="20" cellspacing="0">\n  <tr>\n    <th>Nama Lengkap</th>\n    <th>Nilai</th>\n  </tr>\n  <tr>\n    <td>Andi</td>\n    <td>95</td>\n  </tr>\n</table>\n\n<!-- Tabel dengan Cellspacing besar -->\n<table border="1" cellpadding="5" cellspacing="15">\n  <tr>\n    <td>Budi</td>\n    <td>80</td>\n  </tr>\n</table>`}
                      />
                    </div>
                  </div>

                  {/* Visualisasi Cellpadding & Cellspacing */}
                  <div className="xl:w-1/3 border-4 border-black shadow-neo-lg bg-jade-vibrant p-6 md:p-8 flex flex-col justify-center gap-8 transform hover:scale-[1.01] transition-transform">
                    <div>
                      <h3 className="font-black text-white text-xl uppercase mb-4 text-center drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">Hasil: Cellpadding="20", Cellspacing="0"</h3>
                      <div className="bg-white border-4 border-black w-full overflow-hidden shadow-neo-sm p-4">
                        {/* Mensimulasikan cellspacing="0" dan cellpadding="20" dengan Tailwind */}
                        <table className="w-full text-left border-collapse border-4 border-black">
                          <tbody>
                            <tr className="bg-forest-teal border-b-4 border-black">
                              <th className="p-[20px] border-r-4 border-black font-black text-center text-white text-sm uppercase tracking-widest">Nama Lengkap</th>
                              <th className="p-[20px] font-black text-center text-white text-sm uppercase tracking-widest">Nilai</th>
                            </tr>
                            <tr className="font-bold text-black bg-white">
                              <td className="p-[20px] border-r-4 border-black text-center">Andi</td>
                              <td className="p-[20px] text-center">95</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-black text-white text-xl uppercase mb-4 text-center drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">Hasil: Cellspacing="15"</h3>
                      <div className="bg-white border-4 border-black w-full overflow-hidden shadow-neo-sm p-4 flex justify-center">
                        {/* Mensimulasikan cellspacing="15" dengan Tailwind (border-separate & border-spacing) */}
                        <table className="w-full text-left border-separate border-4 border-black bg-mint-canvas" style={{ borderSpacing: '15px' }}>
                          <tbody>
                            <tr className="font-bold text-black bg-white">
                              <td className="p-[5px] border-4 border-black text-center">Budi</td>
                              <td className="p-[5px] border-4 border-black text-center">80</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4: Semantic Table (<thead>, <tbody>, <tfoot>) */}
            <section className="bg-mint-soft border-4 border-black p-6 md:p-12 shadow-neo-xl rotate-1 hover:rotate-0 transition-transform">
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                <span className="material-symbols-outlined text-6xl md:text-7xl text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">tips_and_updates</span>
                <div>
                  <h3 className="text-2xl md:text-4xl font-black text-black uppercase mb-6 tracking-tighter">
                    Tabel Semantik Lanjutan
                  </h3>
                  <div className="bg-white border-4 border-black p-6 shadow-neo-md">
                    <p className="font-bold text-forest-teal mb-6 text-lg leading-relaxed">
                      Untuk tabel yang panjang dan kompleks, sangat disarankan menggunakan struktur pembagian tabel yang lebih rapi (semantik). Ini akan memudahkan pembacaan oleh browser maupun saat dicetak:
                    </p>
                    <ul className="space-y-4 font-bold text-black text-lg">
                      <li className="flex flex-col sm:flex-row gap-3 sm:items-center border-b-4 border-black pb-4">
                        <span className="bg-jade-vibrant text-white font-black border-4 border-black px-3 py-1 shadow-neo-sm self-start sm:self-auto">&lt;thead&gt;</span>
                        <span className="text-forest-teal">Membungkus <code>&lt;tr&gt;</code> yang berisi kepala (header).</span>
                      </li>
                      <li className="flex flex-col sm:flex-row gap-3 sm:items-center border-b-4 border-black pb-4">
                        <span className="bg-pine-deep text-white font-black border-4 border-black px-3 py-1 shadow-neo-sm self-start sm:self-auto">&lt;tbody&gt;</span>
                        <span className="text-forest-teal">Membungkus bagian badan konten utama tabel.</span>
                      </li>
                      <li className="flex flex-col sm:flex-row gap-3 sm:items-center">
                        <span className="bg-forest-teal text-white font-black border-4 border-black px-3 py-1 shadow-neo-sm self-start sm:self-auto">&lt;tfoot&gt;</span>
                        <span className="text-forest-teal">Membungkus baris kaki tabel (baris hasil/total).</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <QuizTrigger pageSlug="list-tabel" />

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

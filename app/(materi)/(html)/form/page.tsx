"use client";

import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import CodeBlock from '@/components/CodeBlock';
import QuizTrigger from '@/components/quiz-engine/QuizTrigger';

export default function FormPage() {
  return (
    <>
      <Headbar
        links={[
          { label: 'Materi', href: '/form', isActive: true },
          { label: 'Soal Teori', href: '/form/soal', isActive: false }
        ]}
      />
      <div className="flex pt-[88px] min-h-screen">
        <Sidebar />
        <main className="md:ml-[280px] w-full p-4 md:p-10 bg-canvas relative" style={{ backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">

            {/* Header & Hero Section */}
            <section className="bg-white border-4 border-black p-6 md:p-12 shadow-neo-xl text-center relative overflow-hidden transform -rotate-1 hover:rotate-0 transition-transform">
              <div className="absolute top-0 left-0 bg-jade-vibrant text-white font-black px-4 py-1 border-b-4 border-r-4 border-black shadow-neo-sm">
                MATERI 05
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-black tracking-tighter uppercase mt-6 mb-4 md:mb-6">
                Form HTML
              </h1>
              <p className="text-base md:text-xl font-bold text-white bg-forest-teal inline-block px-4 py-2 md:px-6 md:py-3 border-4 border-black mb-4 md:mb-6 shadow-neo-md uppercase tracking-tight">
                Cara interaktif menerima input (masukan) dari pengguna!
              </p>
            </section>

            {/* Section 1: Pengenalan Form */}
            <section className="bg-mint-soft border-4 border-black shadow-neo-xl p-6 md:p-12 transform hover:translate-x-1 transition-transform">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-jade-vibrant text-black w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">01</span>
                Apa Itu Form?
              </h2>

              <div className="flex flex-col lg:flex-row gap-8 items-center">
                <div className="flex-1">
                  <p className="font-bold text-forest-teal text-lg md:text-xl mb-6 leading-relaxed bg-white p-4 border-4 border-black shadow-neo-sm">
                    Bayangkan kamu sedang mendaftar sekolah atau membuka akun Instagram baru. Kamu pasti diminta untuk mengisi nama, email, dan password, kan? Nah, kumpulan kolom isian itulah yang disebut sebagai <strong className="text-black uppercase text-2xl tracking-widest bg-[#ffc900] px-2 py-1 mx-1 border-2 border-black inline-block transform -rotate-2">Form</strong> di dalam dunia web.
                  </p>
                  <p className="font-bold text-black text-lg">
                    Form bertugas untuk "mengumpulkan data" dari pengunjung website, lalu mengirimkannya ke server (sistem di balik layar) agar bisa diproses (misal: untuk login, daftar akun, atau mengirim pesan).
                  </p>
                </div>

                {/* Contoh Visual Form (Mockup UI) */}
                <div className="lg:w-1/3 bg-white border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] p-6 rotate-2 w-full max-w-sm">
                  <h3 className="font-black text-xl uppercase mb-6 text-center border-b-4 border-black pb-2">Contoh Real: Form Login</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="font-bold text-sm uppercase block mb-1">Email</label>
                      <input type="email" placeholder="contoh@email.com" className="w-full border-4 border-black p-2 bg-mint-canvas focus:outline-none" disabled />
                    </div>
                    <div>
                      <label className="font-bold text-sm uppercase block mb-1">Password</label>
                      <input type="password" placeholder="••••••••" className="w-full border-4 border-black p-2 bg-mint-canvas focus:outline-none" disabled />
                    </div>
                    <button disabled className="w-full bg-jade-vibrant text-white font-black uppercase tracking-widest p-3 border-4 border-black mt-2">Masuk</button>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Konsep Form Dasar */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-forest-teal text-mint-soft w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">02</span>
                Struktur Tag &lt;form&gt;
              </h2>

              <div className="mb-8">
                <p className="font-bold text-forest-teal text-lg md:text-xl mb-6 leading-relaxed bg-mint-canvas p-4 border-4 border-black shadow-neo-sm">
                  Semua input dari pengguna (seperti kolom nama, pilihan ganda, atau kolom password) harus dibungkus di dalam tag <code className="bg-forest-teal text-white px-2 py-1">&lt;form&gt;</code>. Form biasanya digunakan untuk halaman registrasi, login, atau kolom komentar.
                </p>
              </div>

              <div className="bg-canvas border-4 border-black p-6 md:p-8 shadow-neo-md mb-8 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-sm transition-all cursor-default">
                <h3 className="font-black text-2xl mb-6 text-black uppercase border-b-4 border-black pb-2">Atribut Penting Form</h3>
                <ul className="space-y-6 font-bold text-forest-teal text-lg">
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-jade-vibrant font-black mt-1">send</span>
                    <p>
                      <strong className="bg-jade-vibrant text-white border-2 border-black px-2 py-1 mr-2">action="..."</strong> Menentukan URL file tujuan ke mana data form tersebut akan dikirimkan saat tombol submit ditekan.
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-jade-vibrant font-black mt-1">sync_alt</span>
                    <p>
                      <strong className="bg-jade-vibrant text-white border-2 border-black px-2 py-1 mr-2">method="..."</strong> Cara pengiriman data. Umumnya menggunakan <strong className="text-black">GET</strong> (dikirim via URL) atau <strong className="text-black">POST</strong> (di balik layar, lebih rahasia).
                    </p>
                  </li>
                </ul>
              </div>

              <div className="border-4 border-black shadow-neo-lg rotate-1 hover:rotate-0 transition-transform">
                <CodeBlock
                  language="html"
                  code={`<form action="/proses-login.php" method="POST">\n  <!-- Isi input (teks, tombol) ditaruh di sini -->\n</form>`}
                />
              </div>
            </section>

            {/* Section 3: Input & Label */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-jade-vibrant text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">03</span>
                Mengenal Input & Label
              </h2>

              <p className="text-lg md:text-xl font-bold text-forest-teal leading-relaxed mb-10">
                Di dalam form, kita butuh kolom ketik. Tag <code>&lt;input&gt;</code> merupakan tag tunggal untuk membuat berbagai macam model kolom masukan. Bentuknya ditentukan oleh atribut <span className="bg-mint-soft text-black px-2 py-1 border-2 border-black uppercase font-black tracking-widest">type=""</span>. Jangan lupa gunakan tag <code>&lt;label&gt;</code> sebagai pendamping teks kolom tersebut!
              </p>

              <div className="space-y-10">

                {/* Text & Password */}
                <div className="border-4 border-black bg-white shadow-neo-lg flex flex-col xl:flex-row">
                  <div className="flex-1 p-6 md:p-8 border-b-4 xl:border-b-0 xl:border-r-4 border-black">
                    <h3 className="font-black text-2xl md:text-3xl uppercase mb-6 flex items-center gap-3"><span className="material-symbols-outlined text-jade-vibrant text-3xl md:text-4xl">text_fields</span> Input Text & Password</h3>
                    <CodeBlock
                      language="html"
                      code={`<!-- Label 'for' harus sama dengan 'id' pada input -->\n<label for="username">Username:</label>\n<input type="text" id="username" name="username">\n\n<label for="pwd">Password:</label>\n<input type="password" id="pwd" name="pwd">`}
                    />
                  </div>
                  <div className="xl:w-1/3 bg-canvas p-6 md:p-8 flex flex-col justify-center gap-6">
                    <div>
                      <label className="font-black uppercase tracking-tight text-sm block mb-2 text-forest-teal">Username:</label>
                      <input type="text" placeholder="Ketik nama..." className="w-full border-4 border-black p-3 bg-white shadow-neo-sm outline-none focus:shadow-none focus:translate-x-[4px] focus:translate-y-[4px] font-bold transition-all text-black" />
                    </div>
                    <div>
                      <label className="font-black uppercase tracking-tight text-sm block mb-2 text-forest-teal">Password:</label>
                      <input type="password" placeholder="Ketik rahasia..." className="w-full border-4 border-black p-3 bg-white shadow-neo-sm outline-none focus:shadow-none focus:translate-x-[4px] focus:translate-y-[4px] font-bold transition-all text-black" />
                    </div>
                  </div>
                </div>

                {/* Radio & Checkbox */}
                <div className="border-4 border-black bg-white shadow-neo-lg flex flex-col xl:flex-row">
                  <div className="flex-1 p-6 md:p-8 border-b-4 xl:border-b-0 xl:border-r-4 border-black">
                    <h3 className="font-black text-2xl md:text-3xl uppercase mb-6 flex items-center gap-3"><span className="material-symbols-outlined text-pine-deep text-3xl md:text-4xl">fact_check</span> Radio & Checkbox</h3>
                    <div className="text-base md:text-lg font-bold text-forest-teal mb-6 bg-mint-canvas p-4 border-4 border-black shadow-neo-sm">
                      <p className="mb-3"><strong className="bg-black text-white px-2 py-1 uppercase mr-2 shadow-neo-sm">Radio</strong> Hanya bisa memilih <strong>SATU</strong> opsi saja dari sebuah kelompok (contoh: Jenis Kelamin).</p>
                      <p><strong className="bg-black text-white px-2 py-1 uppercase mr-2 shadow-neo-sm">Checkbox</strong> Bisa dipilih <strong>LEBIH DARI SATU</strong> opsi secara bersamaan (contoh: Hobi atau Keahlian).</p>
                    </div>
                    <CodeBlock
                      language="html"
                      code={`<!-- RADIO: name="gender" harus SAMA agar cuma bisa pilih 1 -->\n<input type="radio" id="pria" name="gender">\n<label for="pria">Pria</label>\n<input type="radio" id="wanita" name="gender">\n<label for="wanita">Wanita</label>\n\n<!-- CHECKBOX: name="hobi" juga disamakan, tapi user BEBAS pilih banyak -->\n<input type="checkbox" id="coding" name="hobi">\n<label for="coding">Coding</label>\n<input type="checkbox" id="gaming" name="hobi">\n<label for="gaming">Gaming</label>\n<input type="checkbox" id="design" name="hobi">\n<label for="design">Design</label>`}
                    />
                  </div>
                  <div className="xl:w-1/3 bg-canvas p-6 md:p-8 flex flex-col justify-center gap-8">
                    <div className="border-b-4 border-black pb-6">
                      <p className="font-black uppercase tracking-tight text-sm block mb-4 text-forest-teal">Gender (Radio - Pilih Satu):</p>
                      <div className="flex flex-col sm:flex-row xl:flex-col gap-4">
                        <label className="flex items-center gap-3 font-bold text-lg cursor-pointer hover:text-jade-vibrant transition-colors">
                          <input type="radio" name="demo-gender" className="w-6 h-6 accent-jade-vibrant cursor-pointer border-4 border-black" /> Pria
                        </label>
                        <label className="flex items-center gap-3 font-bold text-lg cursor-pointer hover:text-jade-vibrant transition-colors">
                          <input type="radio" name="demo-gender" className="w-6 h-6 accent-jade-vibrant cursor-pointer border-4 border-black" /> Wanita
                        </label>
                      </div>
                    </div>
                    <div>
                      <p className="font-black uppercase tracking-tight text-sm block mb-4 text-forest-teal">Hobi (Checkbox - Pilih Bebas):</p>
                      <div className="flex flex-col sm:flex-row xl:flex-col gap-4">
                        <label className="flex items-center gap-3 font-bold text-lg cursor-pointer hover:text-pine-deep transition-colors">
                          <input type="checkbox" className="w-6 h-6 accent-pine-deep cursor-pointer border-4 border-black" /> Coding
                        </label>
                        <label className="flex items-center gap-3 font-bold text-lg cursor-pointer hover:text-pine-deep transition-colors">
                          <input type="checkbox" className="w-6 h-6 accent-pine-deep cursor-pointer border-4 border-black" /> Gaming
                        </label>
                        <label className="flex items-center gap-3 font-bold text-lg cursor-pointer hover:text-pine-deep transition-colors">
                          <input type="checkbox" className="w-6 h-6 accent-pine-deep cursor-pointer border-4 border-black" /> Design
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* Section 4: Select, Textarea & Button */}
            <section className="bg-white border-4 border-black shadow-neo-xl p-6 md:p-12 transform -rotate-1 hover:rotate-0 transition-transform">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-black uppercase mb-8 md:mb-10 border-b-4 border-black pb-4 flex items-center gap-3 md:gap-4 tracking-tighter">
                <span className="bg-pine-deep text-white w-12 h-12 md:w-16 md:h-16 flex items-center justify-center border-4 border-black shadow-neo-sm flex-shrink-0 text-2xl md:text-4xl">04</span>
                Dropdown, Pesan, & Tombol
              </h2>

              <div className="space-y-10">

                {/* Select & Option */}
                <div className="bg-canvas border-4 border-black p-6 md:p-8 flex flex-col lg:flex-row gap-8 shadow-neo-md hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-sm transition-transform cursor-default">
                  <div className="flex-1">
                    <h3 className="font-black text-2xl uppercase mb-4 text-black">Dropdown (Select)</h3>
                    <CodeBlock
                      language="html"
                      code={`<select name="kelas">\n  <option value="11rpl1">11 RPL 1</option>\n  <option value="11rpl2">11 RPL 2</option>\n</select>`}
                    />
                  </div>
                  <div className="lg:w-1/3 flex items-center">
                    <div className="w-full relative">
                      <select className="w-full border-4 border-black p-4 bg-white shadow-neo-sm font-black uppercase tracking-tight text-lg cursor-pointer outline-none appearance-none focus:shadow-none focus:translate-x-[4px] focus:translate-y-[4px] transition-all">
                        <option>11 RPL 1</option>
                        <option>11 RPL 2</option>
                        <option>11 RPL 3</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none font-black text-3xl">expand_more</span>
                    </div>
                  </div>
                </div>

                {/* Textarea */}
                <div className="bg-canvas border-4 border-black p-6 md:p-8 flex flex-col lg:flex-row gap-8 shadow-neo-md hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-sm transition-transform cursor-default">
                  <div className="flex-1">
                    <h3 className="font-black text-2xl uppercase mb-4 text-black">Pesan Panjang (Textarea)</h3>
                    <p className="text-base font-bold text-forest-teal mb-4 bg-mint-canvas p-3 border-4 border-black">Berbeda dengan <code>&lt;input&gt;</code>, textarea memiliki tag penutup dan memungkinkan ketikan multi-baris panjang.</p>
                    <CodeBlock
                      language="html"
                      code={`<textarea name="pesan" rows="4"></textarea>`}
                    />
                  </div>
                  <div className="lg:w-1/3 flex items-center">
                    <textarea rows={4} placeholder="Tulis keluhan atau masukan di sini..." className="w-full border-4 border-black p-4 bg-white shadow-neo-sm outline-none resize-none font-bold text-black focus:shadow-none focus:translate-x-[4px] focus:translate-y-[4px] transition-all"></textarea>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="bg-forest-teal border-4 border-black p-8 md:p-12 shadow-neo-lg text-white text-center hover:-translate-y-1 transition-transform">
                  <h3 className="font-black uppercase text-3xl md:text-4xl drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] mb-6 text-mint-soft tracking-tight">Tombol Submit</h3>
                  <p className="font-bold text-white text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed border-b-4 border-mint-soft pb-6">
                    Tombol sakti ini digunakan untuk memicu proses pengiriman dari seluruh isi form ke dalam alamat <code className="bg-jade-vibrant text-white px-2 py-1 border-2 border-black">action</code> yang ditulis pada tag <code className="bg-jade-vibrant text-white px-2 py-1 border-2 border-black">&lt;form&gt;</code>.
                  </p>
                  <div className="max-w-2xl mx-auto border-4 border-black">
                    <CodeBlock
                      language="html"
                      code={`<input type="submit" value="Kirim Data"> \n<!-- ATAU --> \n<button type="submit">Kirim Data</button>`}
                    />
                  </div>
                  <button className="mt-10 font-black uppercase tracking-widest text-xl md:text-2xl px-10 py-5 bg-jade-vibrant text-white border-4 border-black shadow-neo-md hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-sm active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all flex items-center gap-3 mx-auto">
                    <span>Kirim Data Form</span>
                    <span className="material-symbols-outlined font-black text-3xl">send</span>
                  </button>
                </div>

              </div>
            </section>

            <QuizTrigger pageSlug="form" />

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

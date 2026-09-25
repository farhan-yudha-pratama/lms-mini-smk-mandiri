"use client";

import Link from 'next/link';
import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import QuizTrigger from '@/components/quiz-engine/QuizTrigger';

export default function WebStatisVsDinamisPage() {
  return (
    <>
      <Headbar
        links={[
          { label: 'Materi', href: '/web-statis-vs-web-dinamis', isActive: true },
        ]}
      />

      <div className="flex pt-[88px] min-h-screen">
        <Sidebar />

        <main className="md:ml-[280px] w-full p-4 md:p-10 bg-canvas relative" style={{ backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div className="max-w-5xl mx-auto font-sans">
            {/* Hero Section */}
            <section className="mb-12 border-4 border-black bg-white shadow-[8px_8px_0px_0px_#000] p-6 md:p-12 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-mint-soft text-black font-black uppercase tracking-tight border-4 border-black px-4 py-2 rotate-2 shadow-[4px_4px_0px_0px_#000]">
                Materi Pokok 4
              </div>

              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-black mb-6 mt-8 leading-none">
                Web Statis <span className="text-jade-vibrant block md:inline">VS Dinamis</span>
              </h1>

              <div className="bg-forest-teal text-white p-6 border-4 border-black shadow-[4px_4px_0px_0px_#000] max-w-4xl">
                <p className="text-xl font-bold italic mb-2">
                  "Mengapa kita harus repot-repot belajar Backend dan Database padahal pakai HTML dan CSS saja web sudah bisa tampil cantik?"
                </p>
                <p className="text-lg font-medium text-mint-soft">
                  Pertanyaan bagus! Mari kita temukan jawabannya lewat perbandingan dua jenis website ini.
                </p>
              </div>
            </section>

            {/* Comparison Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12">

              {/* Web Statis Panel */}
              <div className="border-4 border-black bg-canvas shadow-[8px_8px_0px_0px_#000] p-6 md:p-8 flex flex-col hover:-translate-y-2 transition-transform duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-white text-black p-4 border-4 border-black shadow-[4px_4px_0px_0px_#000]">
                    <span className="material-symbols-outlined text-4xl">article</span>
                  </div>
                  <h2 className="text-3xl font-black uppercase tracking-tight text-black">Web Statis</h2>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="bg-[#E44D26] text-white font-black px-3 py-1 border-2 border-black">HTML</span>
                  <span className="bg-[#2965F1] text-white font-black px-3 py-1 border-2 border-black">CSS</span>
                </div>

                <div className="bg-white border-4 border-black p-5 mb-6 shadow-[4px_4px_0px_0px_#000] flex-1">
                  <h3 className="text-xl font-black uppercase tracking-tight text-pine-deep mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined">menu_book</span>
                    Analogi: Brosur Cetak
                  </h3>
                  <p className="font-bold text-black text-lg mb-4">
                    Website statis ibarat brosur cetak yang disebarkan di jalan. Isinya <strong>selalu sama</strong> bagi siapapun yang melihatnya.
                  </p>
                  <div className="bg-mint-canvas p-4 border-l-4 border-black">
                    <span className="font-black uppercase text-sm block mb-1">Kelemahan:</span>
                    <p className="font-medium text-black">
                      Jika kamu ingin mengubah foto atau teks (misalnya ganti harga barang), kamu (sebagai programmer) harus membongkar dan mengedit kode file <code>.html</code>-nya secara manual satu per satu. Sangat merepotkan kalau halamannya ada 1000!
                    </p>
                  </div>
                </div>
              </div>

              {/* Web Dinamis Panel */}
              <div className="border-4 border-black bg-jade-vibrant shadow-[8px_8px_0px_0px_#000] p-6 md:p-8 flex flex-col hover:-translate-y-2 transition-transform duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-black text-white p-4 border-4 border-black shadow-[4px_4px_0px_0px_#000]">
                    <span className="material-symbols-outlined text-4xl">dynamic_feed</span>
                  </div>
                  <h2 className="text-3xl font-black uppercase tracking-tight text-white">Web Dinamis</h2>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="bg-white text-black font-black px-3 py-1 border-2 border-black">PHP</span>
                  <span className="bg-white text-black font-black px-3 py-1 border-2 border-black">Database</span>
                  <span className="bg-white text-black font-black px-3 py-1 border-2 border-black">Frontend</span>
                </div>

                <div className="bg-white border-4 border-black p-5 mb-6 shadow-[4px_4px_0px_0px_#000] flex-1">
                  <h3 className="text-xl font-black uppercase tracking-tight text-jade-vibrant mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined">tv_options_edit_channels</span>
                    Analogi: Papan Pengumuman Digital
                  </h3>
                  <p className="font-bold text-black text-lg mb-4">
                    Website dinamis ibarat papan pengumuman digital. Halamannya (file <code>.php</code>) mungkin cuma satu, tapi isinya bisa <strong>berubah-ubah secara ajaib</strong>!
                  </p>
                  <div className="bg-mint-soft p-4 border-l-4 border-black">
                    <span className="font-black uppercase text-sm block mb-1">Keunggulan:</span>
                    <p className="font-medium text-black">
                      Isi konten ditarik secara otomatis dari Database. <br /><br />
                      <strong>Contoh:</strong> Halaman <code>profil.php</code> akan menampilkan foto dan nama yang <em>berbeda</em> tergantung siapa yang sedang login, entah itu Budi, Andi, atau kamu!
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Real World Examples */}
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-8 mb-12">
              <h2 className="text-3xl font-black text-black uppercase tracking-tight mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined text-4xl">travel_explore</span>
                Contoh di Dunia Nyata
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-4 border-black p-5 relative">
                  <div className="absolute -top-3 -right-3 bg-canvas border-2 border-black px-2 py-1 font-black text-xs">STATIS</div>
                  <h3 className="font-black text-lg mb-2">Web Company Profile Sederhana</h3>
                  <p className="font-medium text-sm">Halaman "Tentang Kami" yang isinya visi misi perusahaan, dan jarang sekali diubah dalam waktu bertahun-tahun.</p>
                </div>
                <div className="border-4 border-black p-5 relative">
                  <div className="absolute -top-3 -right-3 bg-jade-vibrant text-white border-2 border-black px-2 py-1 font-black text-xs">DINAMIS</div>
                  <h3 className="font-black text-lg mb-2">Instagram / Shopee</h3>
                  <p className="font-medium text-sm">Feed (Beranda) yang terus berubah setiap detik menampilkan postingan terbaru dari database. Toko dengan ribuan produk.</p>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col md:flex-row justify-between gap-6 mt-12">
              <Link
                href="/siklus-request-response"
                className="bg-white border-4 border-black py-4 px-6 font-black uppercase tracking-tight text-black flex items-center justify-center gap-3 shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
              >
                <span className="material-symbols-outlined font-black">arrow_back</span>
                Sebelumnya: Request & Response
              </Link>
              <Link
                href="/anatomi-url-alamat-web"
                className="bg-pine-deep border-4 border-black py-4 px-6 font-black uppercase tracking-tight text-white flex items-center justify-center gap-3 shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
              >
                Selanjutnya: Anatomi URL
                <span className="material-symbols-outlined font-black">arrow_forward</span>
              </Link>
            </div>

            <QuizTrigger pageSlug="web-statis-vs-web-dinamis" />

          </div>
        </main>
      </div>
    </>
  );
}

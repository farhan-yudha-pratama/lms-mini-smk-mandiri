"use client";

import Link from 'next/link';
import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import QuizTrigger from '@/components/quiz-engine/QuizTrigger';

export default function AnatomiUrlPage() {
  return (
    <>
      <Headbar
        links={[
          { label: 'Materi', href: '/anatomi-url-alamat-web', isActive: true },
        ]}
      />

      <div className="flex pt-[88px] min-h-screen">
        <Sidebar />

        <main className="md:ml-[280px] w-full p-4 md:p-10 bg-canvas relative" style={{ backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div className="max-w-5xl mx-auto font-sans">
            {/* Hero Section */}
            <section className="mb-12 border-4 border-black bg-white shadow-[8px_8px_0px_0px_#000] p-6 md:p-12 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-pine-deep text-white font-black uppercase tracking-tight border-4 border-black px-4 py-2 -rotate-3 shadow-[4px_4px_0px_0px_#000]">
                Materi Pokok 4
              </div>

              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-black mb-6 mt-8">
                Anatomi <span className="text-jade-vibrant">URL</span>
              </h1>

              <p className="text-lg md:text-xl font-bold text-black max-w-3xl leading-relaxed border-l-8 border-jade-vibrant pl-6 bg-mint-canvas p-4 border-4 border-black shadow-[4px_4px_0px_0px_#000]">
                Saat kamu belajar Backend, kamu akan sering "melempar" data secara diam-diam melalui URL. Sebelum masuk lebih dalam, mari kita bedah bagian-bagian rahasia dari sebuah Alamat Web (URL)!
              </p>
            </section>

            {/* URL Visualizer Box */}
            <div className="mb-12 border-4 border-black bg-white shadow-[8px_8px_0px_0px_#000] p-6 md:p-10">
              <h2 className="text-2xl font-black text-black uppercase tracking-tight mb-6">Contoh URL Target:</h2>

              <div className="flex flex-wrap font-mono text-xl md:text-3xl font-black mb-4">
                <span className="text-[#E44D26] bg-[#E44D26]/10 px-1 border-b-4 border-[#E44D26]">https://</span>
                <span className="text-[#2965F1] bg-[#2965F1]/10 px-1 border-b-4 border-[#2965F1]">www.tokosepatu.com</span>
                <span className="text-pine-deep bg-pine-deep/10 px-1 border-b-4 border-pine-deep">/produk/katalog.php</span>
                <span className="text-jade-vibrant bg-jade-vibrant/10 px-1 border-b-4 border-jade-vibrant">?kategori=sneakers&ukuran=42</span>
              </div>
              <p className="font-bold text-sm text-black italic">
                *Coba perhatikan warna di atas, dan cocokkan dengan penjelasan di bawah.
              </p>
            </div>

            {/* Breakdown Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">

              {/* 1. Protokol */}
              <div className="border-4 border-black bg-white p-6 shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all cursor-default">
                <div className="flex items-start gap-4 mb-3">
                  <div className="bg-[#E44D26] text-white w-10 h-10 flex items-center justify-center font-black text-xl border-4 border-black shadow-[2px_2px_0px_0px_#000]">1</div>
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tight text-black mb-1">Protokol</h3>
                    <code className="text-lg font-bold text-[#E44D26] bg-canvas px-2 py-1 border-2 border-black inline-block">https://</code>
                  </div>
                </div>
                <p className="font-medium text-black mt-4">
                  Ini adalah <strong>aturan komunikasi</strong>. Huruf 's' pada <code>https</code> berarti <em>Secure</em> (Aman). Data yang lewat sini akan dienkripsi agar tidak mudah dibajak oleh hacker di tengah jalan.
                </p>
              </div>

              {/* 2. Domain */}
              <div className="border-4 border-black bg-white p-6 shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all cursor-default">
                <div className="flex items-start gap-4 mb-3">
                  <div className="bg-[#2965F1] text-white w-10 h-10 flex items-center justify-center font-black text-xl border-4 border-black shadow-[2px_2px_0px_0px_#000]">2</div>
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tight text-black mb-1">Domain</h3>
                    <code className="text-lg font-bold text-[#2965F1] bg-canvas px-2 py-1 border-2 border-black inline-block">www.tokosepatu.com</code>
                  </div>
                </div>
                <p className="font-medium text-black mt-4">
                  Ini adalah <strong>Nama Alias</strong> dari alamat server. Komputer aslinya pakai alamat angka (IP Address seperti <code>192.168.1.1</code>), tapi manusia lebih gampang menghafal kata-kata. Nanti di laptop kamu sendiri, nama aliasnya adalah <code className="font-bold text-pine-deep">localhost</code>.
                </p>
              </div>

              {/* 3. Path */}
              <div className="border-4 border-black bg-white p-6 shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all cursor-default">
                <div className="flex items-start gap-4 mb-3">
                  <div className="bg-pine-deep text-white w-10 h-10 flex items-center justify-center font-black text-xl border-4 border-black shadow-[2px_2px_0px_0px_#000]">3</div>
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tight text-black mb-1">Path / Direktori</h3>
                    <code className="text-lg font-bold text-pine-deep bg-canvas px-2 py-1 border-2 border-black inline-block">/produk/katalog.php</code>
                  </div>
                </div>
                <p className="font-medium text-black mt-4">
                  Ini adalah <strong>jalur folder dan nama file</strong> yang kamu minta ke server. Mirip seperti kamu membuka folder di komputermu sendiri (misal: <code>D:\Tugas\Catatan.docx</code>).
                </p>
              </div>

              {/* 4. Query String */}
              <div className="border-4 border-black bg-jade-vibrant p-6 shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all cursor-default">
                <div className="flex items-start gap-4 mb-3">
                  <div className="bg-white text-black w-10 h-10 flex items-center justify-center font-black text-xl border-4 border-black shadow-[2px_2px_0px_0px_#000]">4</div>
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-1">Query String</h3>
                    <code className="text-lg font-bold text-black bg-white px-2 py-1 border-2 border-black inline-block">?kategori=sneakers&ukuran=42</code>
                  </div>
                </div>
                <p className="font-bold text-black mt-4 bg-white/20 p-3 border-2 border-black">
                  Ini adalah <span className="underline">parameter tambahan</span> yang dilempar ke server. Simbol <code>?</code> adalah penanda dimulainya query, dan <code>&</code> dipakai untuk menyambung data ke-2, dst. (Ini bagian sangat penting saat kamu belajar PHP <code>$_GET</code> nanti!)
                </p>
              </div>

            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col md:flex-row justify-between gap-6 mt-12">
              <Link
                href="/web-statis-vs-web-dinamis"
                className="bg-white border-4 border-black py-4 px-6 font-black uppercase tracking-tight text-black flex items-center justify-center gap-3 shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
              >
                <span className="material-symbols-outlined font-black">arrow_back</span>
                Sebelumnya: Web Statis vs Dinamis
              </Link>
              <Link
                href="/mengenal-web-server-apache"
                className="bg-pine-deep border-4 border-black py-4 px-6 font-black uppercase tracking-tight text-white flex items-center justify-center gap-3 shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
              >
                Selanjutnya: Web Server & Apache
                <span className="material-symbols-outlined font-black">arrow_forward</span>
              </Link>
            </div>

            <QuizTrigger pageSlug="anatomi-url-alamat-web" />

          </div>
        </main>
      </div>
    </>
  );
}

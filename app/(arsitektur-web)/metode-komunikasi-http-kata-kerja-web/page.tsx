"use client";

import Link from 'next/link';
import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import QuizTrigger from '@/components/quiz-engine/QuizTrigger';

export default function MetodeHTTPPage() {
  return (
    <>
      <Headbar
        links={[
          { label: 'Materi', href: '/metode-komunikasi-http-kata-kerja-web', isActive: true },
        ]}
      />

      <div className="flex pt-[88px] min-h-screen">
        <Sidebar />

        <main className="md:ml-[280px] w-full p-4 md:p-10 bg-canvas relative" style={{ backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div className="max-w-5xl mx-auto font-sans">
            {/* Hero Section */}
            <section className="mb-12 border-4 border-black bg-white shadow-[8px_8px_0px_0px_#000] p-6 md:p-12 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-jade-vibrant text-white font-black uppercase tracking-tight border-4 border-black px-4 py-2 rotate-2 shadow-[4px_4px_0px_0px_#000]">
                Materi Pokok 4
              </div>

              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-black mb-6 mt-8">
                Metode <span className="text-pine-deep">HTTP</span>
              </h1>

              <div className="bg-mint-soft p-4 md:p-6 border-4 border-black shadow-[4px_4px_0px_0px_#000] max-w-4xl">
                <h2 className="text-2xl font-black uppercase tracking-tight text-black mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined">forum</span> Kata Kerja Web
                </h2>
                <p className="text-lg font-bold text-black leading-relaxed">
                  Dalam arsitektur web modern, Web Server dan Komputermu tidak sekadar ngobrol sembarangan. Mereka berkomunikasi menggunakan <strong>Metode HTTP</strong> yang sangat rapi dan sejalan dengan prinsip <strong>CRUD</strong> <em>(Create, Read, Update, Delete)</em>.
                </p>
              </div>
            </section>

            {/* Grid of Methods */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">

              {/* 1. GET */}
              <div className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_#000] p-6 hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden">
                <div className="absolute -right-6 -top-6 bg-canvas w-24 h-24 rounded-full border-4 border-black opacity-50"></div>

                <div className="flex justify-between items-start mb-4 relative z-10">
                  <h2 className="text-4xl font-black uppercase tracking-tighter text-[#2965F1]">GET</h2>
                  <span className="bg-black text-white px-3 py-1 font-black uppercase text-sm border-2 border-black">READ</span>
                </div>

                <h3 className="text-xl font-black text-black uppercase mb-3">Meminta Data</h3>

                <div className="space-y-4">
                  <p className="font-medium text-black">
                    <strong>Tugas:</strong> Murni "meminta" data dari server untuk ditampilkan di layarmu.
                  </p>
                  <p className="font-medium text-black">
                    <strong>Kapan dipakai?</strong> Pencarian Google, membuka profil teman, melihat detail sepatu incaran.
                  </p>
                  <div className="bg-[#ffdddd] p-3 border-l-4 border-black text-sm">
                    <span className="font-black text-red-600 uppercase block mb-1">Peringatan Keras!</span>
                    Data GET menempel langsung di URL (contoh: <code>?cari=sepatu</code>). Jangan <strong>PERNAH</strong> gunakan GET untuk mengirim <em>password</em>, karena akan terlihat oleh semua orang!
                  </div>
                </div>
              </div>

              {/* 2. POST */}
              <div className="border-4 border-black bg-pine-deep shadow-[8px_8px_0px_0px_#000] p-6 hover:-translate-y-2 transition-transform duration-300 text-white relative overflow-hidden">
                <div className="absolute -right-6 -top-6 bg-forest-teal w-24 h-24 border-4 border-black rotate-45 opacity-50"></div>

                <div className="flex justify-between items-start mb-4 relative z-10">
                  <h2 className="text-4xl font-black uppercase tracking-tighter text-jade-vibrant">POST</h2>
                  <span className="bg-white text-black px-3 py-1 font-black uppercase text-sm border-2 border-black">CREATE</span>
                </div>

                <h3 className="text-xl font-black uppercase mb-3">Mengirim Data Baru</h3>

                <div className="space-y-4">
                  <p className="font-medium">
                    <strong>Tugas:</strong> Mengirim data baru ke server secara <strong>rahasia</strong> lewat "jalur belakang" (tidak akan muncul di URL atas).
                  </p>
                  <p className="font-medium">
                    <strong>Kapan dipakai?</strong> Saat mengisi Form Pendaftaran, menekan tombol <em>Login</em>, mengunggah foto, atau membuat postingan status baru.
                  </p>
                  <div className="bg-black/30 p-3 border-l-4 border-white text-sm">
                    <span className="font-black uppercase block mb-1 text-jade-vibrant">Sangat Aman</span>
                    Data dibungkus di dalam "badan" request. Inilah metode wajib untuk mengirim data sensitif seperti password atau kartu kredit.
                  </div>
                </div>
              </div>

              {/* 3. PUT / PATCH */}
              <div className="border-4 border-black bg-jade-vibrant shadow-[8px_8px_0px_0px_#000] p-6 hover:-translate-y-2 transition-transform duration-300 text-black relative overflow-hidden">
                <div className="absolute -right-6 -top-6 bg-mint-soft w-24 h-24 rounded-full border-4 border-black opacity-50"></div>

                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="flex flex-col">
                    <h2 className="text-4xl font-black uppercase tracking-tighter text-white leading-none">PUT /</h2>
                    <h2 className="text-4xl font-black uppercase tracking-tighter text-white leading-none">PATCH</h2>
                  </div>
                  <span className="bg-black text-white px-3 py-1 font-black uppercase text-sm border-2 border-black mt-2">UPDATE</span>
                </div>

                <h3 className="text-xl font-black uppercase mb-3">Memperbarui Data</h3>

                <div className="space-y-4">
                  <p className="font-medium">
                    <strong>Tugas:</strong> Memberi instruksi khusus kepada server untuk mengedit atau menimpa data yang <strong>sudah ada</strong> di database.
                  </p>
                  <p className="font-medium">
                    <strong>Kapan dipakai?</strong> Mengganti foto profil, mengedit <em>typo</em> pada komentar, mengganti username.
                  </p>
                  <div className="bg-white/40 p-3 border-l-4 border-black text-sm">
                    <span className="font-black uppercase block mb-1">Perbedaan Kecil</span>
                    <strong>PUT:</strong> Menimpa seluruh data (misal: ganti profil total).<br />
                    <strong>PATCH:</strong> Mengubah sebagian saja (misal: hanya ganti bio).
                  </div>
                </div>
              </div>

              {/* 4. DELETE */}
              <div className="border-4 border-black bg-[#E44D26] shadow-[8px_8px_0px_0px_#000] p-6 hover:-translate-y-2 transition-transform duration-300 text-white relative overflow-hidden">
                <div className="absolute -right-6 -top-6 bg-black w-24 h-24 border-4 border-black rotate-12 opacity-50"></div>

                <div className="flex justify-between items-start mb-4 relative z-10">
                  <h2 className="text-4xl font-black uppercase tracking-tighter text-black">DELETE</h2>
                  <span className="bg-white text-black px-3 py-1 font-black uppercase text-sm border-2 border-black">DELETE</span>
                </div>

                <h3 className="text-xl font-black uppercase mb-3 text-black">Menghapus Data</h3>

                <div className="space-y-4">
                  <p className="font-bold">
                    <strong>Tugas:</strong> Instruksi tegas dan mematikan ke server untuk menghapus sebuah rekaman data di database.
                  </p>
                  <p className="font-bold">
                    <strong>Kapan dipakai?</strong> Menghapus postingan lama, *unsend* pesan WhatsApp, menghapus akun permanen.
                  </p>
                  <div className="bg-black text-white p-3 border-2 border-white text-sm font-bold">
                    <span className="material-symbols-outlined align-middle mr-2 text-[#E44D26]">warning</span>
                    Sangat berbahaya! Pastikan server selalu mengecek apakah pengguna yang meminta *DELETE* benar-benar punya hak (admin/pemilik data).
                  </div>
                </div>
              </div>

            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col md:flex-row justify-between gap-6 mt-12">
              <Link
                href="/mengenal-web-server-apache"
                className="bg-white border-4 border-black py-4 px-6 font-black uppercase tracking-tight text-black flex items-center justify-center gap-3 shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
              >
                <span className="material-symbols-outlined font-black">arrow_back</span>
                Sebelumnya: Web Server & Apache
              </Link>
              <Link
                href="/konsep-port--kode-status-http"
                className="bg-pine-deep border-4 border-black py-4 px-6 font-black uppercase tracking-tight text-white flex items-center justify-center gap-3 shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
              >
                Selanjutnya: Port & Status HTTP
                <span className="material-symbols-outlined font-black">arrow_forward</span>
              </Link>
            </div>

            <QuizTrigger pageSlug="metode-komunikasi-http-kata-kerja-web" />

          </div>
        </main>
      </div>
    </>
  );
}

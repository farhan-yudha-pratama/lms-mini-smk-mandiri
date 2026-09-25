import Headbar from '@/components/Headbar';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import QuizTrigger from '@/components/quiz-engine/QuizTrigger';

export default async function Page() {
  const session = await getSession();
  const userName = (session?.name as string) || (session?.email as string)?.split('@')[0] || 'Siswa';

  const materials = [
    {
      title: 'HTML Dasar',
      desc: 'Pelajari struktur dasar halaman web menggunakan tag dan elemen HTML.',
      color: 'bg-jade-vibrant text-white',
      link: '/pengenalan-html',
      icon: 'html'
    },
    {
      title: 'CSS Styling',
      desc: 'Pelajari cara menghias halaman web dengan warna, tipografi, dan layout.',
      color: 'bg-mint-soft text-black',
      link: '/pengenalan-css',
      icon: 'css'
    },
    {
      title: 'Bootstrap',
      desc: 'Gunakan framework CSS untuk membuat desain responsif dengan cepat.',
      color: 'bg-pine-deep text-white',
      link: '/pengenalan-bootstrap',
      icon: 'view_quilt'
    },
    {
      title: 'JavaScript',
      desc: 'Tambahkan interaktivitas dan logika pemrograman pada halaman web.',
      color: 'bg-canvas text-black',
      link: '/pengantar-js',
      icon: 'javascript'
    },
    {
      title: 'Arsitektur Web',
      desc: 'Pahami konsep Frontend, Backend, Request/Response, dan Server.',
      color: 'bg-white text-black',
      link: '/arsitektur-aplikasi-web-frontend-vs-backend',
      icon: 'dns'
    },
    {
      title: 'Database SQL',
      desc: 'Rancang tabel, relasi, dan kuasai bahasa kueri SQL.',
      color: 'bg-mint-soft text-black',
      link: '/konsep-database',
      icon: 'database'
    },
    {
      title: 'PHP Dinamis',
      desc: 'Buat aplikasi web dinamis dengan pemrosesan backend PHP.',
      color: 'bg-jade-vibrant text-white',
      link: '/pengantar-php',
      icon: 'php'
    }
  ];

  return (
    <>
      <Headbar
        links={[
          { label: 'Dashboard', href: '/', isActive: true }
        ]}
      />

      <div className="flex pt-[88px] min-h-screen">
        <Sidebar />

        <main className="md:ml-[300px] w-full p-4 md:p-10 bg-canvas relative" style={{ backgroundImage: 'radial-gradient(var(--color-outline) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div className="max-w-6xl mx-auto space-y-12">

            {/* Header Section */}
            <div className="mt-8 text-center relative">
              <div className="relative z-10">
                <span className="bg-pine-deep border-4 border-black px-6 py-2 font-black text-white uppercase shadow-neo-sm inline-block tracking-widest text-sm md:text-xl mb-6 transform -rotate-2 hover:rotate-0 hover:scale-110 transition-transform cursor-default">
                  👋 Halo, {userName}!
                </span>
                <h2 className="text-4xl sm:text-5xl md:text-7xl font-black mt-2 text-black tracking-tighter uppercase drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  Selamat Datang
                </h2>
                <p className="mt-6 text-xl font-bold bg-white border-4 border-black shadow-neo-sm inline-block px-6 py-3 max-w-2xl">
                  Pilih materi di bawah ini untuk mulai belajar. Semua materi dirancang secara berurutan untuk memudahkan langkah belajarmu!
                </p>
              </div>
            </div>

            {/* Materials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {materials.map((m, idx) => (
                <div key={idx} className={`border-4 border-black p-6 shadow-neo-md hover:-translate-y-2 hover:shadow-neo-lg transition-transform flex flex-col h-full ${m.color}`}>
                  <div className="w-16 h-16 bg-white text-black border-4 border-black flex items-center justify-center shadow-neo-sm mb-6 transform -rotate-3">
                    <span className="material-symbols-outlined font-black text-4xl">{m.icon}</span>
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tight mb-3 border-b-4 border-current pb-2">
                    {m.title}
                  </h3>
                  <p className="font-bold flex-1 text-lg mb-6 leading-relaxed">
                    {m.desc}
                  </p>
                  <Link
                    href={m.link}
                    className="mt-auto bg-black text-white font-black uppercase tracking-widest text-center py-3 border-4 border-black hover:bg-white hover:text-black transition-colors"
                  >
                    Mulai Belajar
                  </Link>
                </div>
              ))}
            </div>

            {/* Footer */}
            <QuizTrigger pageSlug="" />

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

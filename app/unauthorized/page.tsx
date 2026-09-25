export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#EAF4ED] p-4">
      <div className="w-full max-w-md bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-8 text-center">
        <h1 className="text-4xl font-black uppercase tracking-tighter text-black mb-4">
          Akses Ditolak
        </h1>
        <p className="font-bold text-black mb-6">
          Anda tidak memiliki izin untuk mengakses halaman ini.
        </p>
        <a 
          href="/" 
          className="inline-block bg-[#092328] text-white font-black uppercase tracking-tight border-4 border-black shadow-[4px_4px_0px_0px_#000] px-6 py-3 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
        >
          Kembali ke Beranda
        </a>
      </div>
    </main>
  );
}

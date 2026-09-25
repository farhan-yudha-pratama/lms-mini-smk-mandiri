import { getSession } from '@/lib/session';

export default async function DashboardPage() {
  const session = await getSession();
  const isSuperAdmin = session?.role === 'SUPERADMIN';

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Overview
        </h1>
        <p className="text-gray-500 mt-1">
          {isSuperAdmin 
            ? 'Selamat datang di panel kontrol utama Superadmin.'
            : 'Selamat datang di dashboard pengajar.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Widget 1 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700">Total Pengguna</h3>
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">group</span>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">0</p>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <span className="text-sm text-gray-500">Menunggu integrasi backend</span>
          </div>
        </div>

        {/* Widget 2 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700">Total Materi</h3>
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">library_books</span>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">0</p>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <span className="text-sm text-gray-500">Menunggu integrasi backend</span>
          </div>
        </div>

        {/* Widget 3 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700">Aktivitas Hari Ini</h3>
              <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">trending_up</span>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">0</p>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <span className="text-sm text-gray-500">Menunggu integrasi backend</span>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
          <h3 className="font-semibold text-gray-800">Aktivitas Terbaru</h3>
        </div>
        <div className="p-6 text-center text-gray-500 py-12">
          <span className="material-symbols-outlined text-4xl mb-3 text-gray-300">inbox</span>
          <p>Belum ada data aktivitas untuk ditampilkan.</p>
        </div>
      </div>
    </div>
  );
}

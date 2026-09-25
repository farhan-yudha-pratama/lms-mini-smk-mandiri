import { getQuizzesWithPageStatus } from '@/modules/quiz/quiz.service';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function QuizzesPage() {
  const pages = await getQuizzesWithPageStatus();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Paket Kuis</h1>
          <p className="text-gray-500 text-sm mt-1">
            Kelola Paket Kuis (assessment) untuk setiap halaman materi.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-700">
              <tr>
                <th className="px-6 py-4 font-semibold">Materi / Halaman</th>
                <th className="px-6 py-4 font-semibold">Status Paket Kuis</th>
                <th className="px-6 py-4 font-semibold">Membuka Akses</th>
                <th className="px-6 py-4 font-semibold">Passing Score</th>
                <th className="px-6 py-4 font-semibold">Limit Waktu</th>
                <th className="px-6 py-4 font-semibold">Jumlah Varian</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pages.map((page) => (
                <tr key={page.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{page.title}</div>
                    <div className="text-gray-500 text-xs mt-0.5">{page.categoryName}</div>
                  </td>
                  <td className="px-6 py-4">
                    {page.hasQuizPackage ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Sudah ada Paket Kuis
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                        Belum ada Paket Kuis
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {page.unlocks && page.unlocks.length > 0 ? (
                      <ul className="list-disc pl-4 text-xs space-y-1">
                        {page.unlocks.map((title: string, i: number) => (
                          <li key={i}>{title}</li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Tidak ada (Akhir Materi)</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {page.hasQuizPackage ? `${page.quizPackage?.passingScore}%` : '-'}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {page.hasQuizPackage ? (page.quizPackage?.timeLimit ? `${page.quizPackage.timeLimit} Menit` : 'Tanpa Limit') : '-'}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {page.hasQuizPackage ? page.variantsCount : '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {page.hasQuizPackage ? (
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/dashboard/quizzes/${page.quizPackage?.id}/edit`}
                          className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Kelola Paket
                        </Link>
                      </div>
                    ) : (
                      <Link
                        href={`/dashboard/quizzes/create?pageId=${page.id}`}
                        className="inline-flex px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Buat Paket Kuis
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
              {pages.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    Belum ada halaman materi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}



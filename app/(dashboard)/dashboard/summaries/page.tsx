import { getPagesWithSummaryStatus } from '@/modules/summary/summary.service';
import SummariesTable from './components/SummariesTable';

export const metadata = {
  title: 'Manajemen Summary Materi',
};

export default async function SummariesPage() {
  const pages = await getPagesWithSummaryStatus();

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Summary Materi</h1>
          <p className="text-gray-500 mt-1">Kelola ringkasan (summary) untuk setiap halaman materi AI.</p>
        </div>
      </div>

      <SummariesTable pages={pages} />
    </div>
  );
}

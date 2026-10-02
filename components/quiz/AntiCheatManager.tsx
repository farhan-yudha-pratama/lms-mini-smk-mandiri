'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateAntiCheatAction } from '@/modules/quiz/quiz.action';

type AntiCheatManagerProps = {
  quizVariantId: string;
  initialConfig: {
    enableFullscreen: boolean;
    preventTabSwitch: boolean;
    preventCopyPaste: boolean;
  };
};

export default function AntiCheatManager({ quizVariantId, initialConfig }: AntiCheatManagerProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const enableFullscreen = formData.get('enableFullscreen') === 'true';
    const preventTabSwitch = formData.get('preventTabSwitch') === 'true';
    const preventCopyPaste = formData.get('preventCopyPaste') === 'true';

    const res = await updateAntiCheatAction(quizVariantId, {
      enableFullscreen,
      preventTabSwitch,
      preventCopyPaste
    });

    setLoading(false);
    if (res.success) {
      setMessage({ type: 'success', text: 'Konfigurasi Anti-Cheat berhasil diperbarui!' });
      router.refresh();
      // Hilangkan pesan sukses setelah 3 detik
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage({ type: 'error', text: res.message || 'Gagal menyimpan konfigurasi.' });
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-b pb-4 mb-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <span className="material-symbols-outlined text-blue-600">security</span>
          Pengaturan Anti-Cheat
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Kustomisasi keamanan ujian khusus untuk varian ini. Jika ada kuis yang bersifat open-book, Anda dapat mematikan deteksi pindah tab.
        </p>
      </div>

      {message && (
        <div className={`p-3 rounded text-sm font-medium ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-3">
          {/* Option 1 */}
          <label className="flex items-start gap-3 cursor-pointer p-3 border rounded hover:bg-gray-50 transition-colors">
            <div className="mt-0.5">
              <input 
                type="checkbox" 
                name="enableFullscreen" 
                value="true"
                defaultChecked={initialConfig.enableFullscreen}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
            </div>
            <div>
              <div className="font-semibold text-gray-800 text-sm">Wajib Mode Layar Penuh (Fullscreen)</div>
              <div className="text-xs text-gray-500">Mewajibkan siswa menggunakan browser yang mendukung layar penuh (misal: Chrome Desktop).</div>
            </div>
          </label>

          {/* Option 2 */}
          <label className="flex items-start gap-3 cursor-pointer p-3 border rounded hover:bg-gray-50 transition-colors">
            <div className="mt-0.5">
              <input 
                type="checkbox" 
                name="preventTabSwitch" 
                value="true"
                defaultChecked={initialConfig.preventTabSwitch}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
            </div>
            <div>
              <div className="font-semibold text-gray-800 text-sm">Cegah Pindah Tab (Visibility & Focus)</div>
              <div className="text-xs text-gray-500">Memberikan penalti nilai 0 jika siswa terdeteksi berpindah tab browser atau meminimalkan layar.</div>
            </div>
          </label>

          {/* Option 3 */}
          <label className="flex items-start gap-3 cursor-pointer p-3 border rounded hover:bg-gray-50 transition-colors">
            <div className="mt-0.5">
              <input 
                type="checkbox" 
                name="preventCopyPaste" 
                value="true"
                defaultChecked={initialConfig.preventCopyPaste}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
            </div>
            <div>
              <div className="font-semibold text-gray-800 text-sm">Cegah Klik Kanan & Inspeksi Elemen</div>
              <div className="text-xs text-gray-500">Memblokir klik kanan, copy, paste, dan pintasan pengembang (F12, Ctrl+U, dll).</div>
            </div>
          </label>
        </div>

        <div className="flex justify-end pt-2">
          <button 
            type="submit" 
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium text-sm rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Menyimpan...' : 'Simpan Konfigurasi'}
          </button>
        </div>
      </form>
    </div>
  );
}

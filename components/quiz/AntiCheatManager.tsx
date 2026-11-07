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
  variantName?: string;
};

export default function AntiCheatManager({
  quizVariantId,
  initialConfig,
  variantName,
}: AntiCheatManagerProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // State konfigurasi
  const [enableFullscreen, setEnableFullscreen] = useState(Boolean(initialConfig.enableFullscreen));
  const [preventTabSwitch, setPreventTabSwitch] = useState(Boolean(initialConfig.preventTabSwitch));
  const [preventCopyPaste, setPreventCopyPaste] = useState(Boolean(initialConfig.preventCopyPaste));

  const activeCount = [enableFullscreen, preventTabSwitch, preventCopyPaste].filter(Boolean).length;

  const handleOpen = () => {
    setEnableFullscreen(Boolean(initialConfig.enableFullscreen));
    setPreventTabSwitch(Boolean(initialConfig.preventTabSwitch));
    setPreventCopyPaste(Boolean(initialConfig.preventCopyPaste));
    setMessage(null);
    setIsOpen(true);
  };

  const handleClose = () => {
    if (loading) return;
    setIsOpen(false);
    setMessage(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const res = await updateAntiCheatAction(quizVariantId, {
      enableFullscreen,
      preventTabSwitch,
      preventCopyPaste,
    });

    setLoading(false);
    if (res.success) {
      setMessage({ type: 'success', text: 'Konfigurasi Anti-Cheat berhasil diperbarui!' });
      router.refresh();
      setTimeout(() => {
        setIsOpen(false);
        setMessage(null);
      }, 1200);
    } else {
      setMessage({ type: 'error', text: res.message || 'Gagal menyimpan konfigurasi.' });
    }
  };

  return (
    <>
      {/* TRIGGER BUTTON (RESPONSIVE & COMPACT) */}
      <button
        type="button"
        onClick={handleOpen}
        className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-gray-50 active:bg-gray-100 border border-gray-200 hover:border-gray-300 rounded-xl text-xs sm:text-sm font-semibold text-gray-800 shadow-2xs transition-all cursor-pointer group"
        title="Buka pengaturan proteksi anti-cheat ujian"
      >
        <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
          <span className="material-symbols-outlined text-[16px]">security</span>
        </div>
        <span>Pengaturan Anti-Cheat</span>
        <span
          className={`px-2 py-0.5 text-[11px] font-bold rounded-full border ${
            activeCount === 3
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : activeCount > 0
              ? 'bg-blue-50 text-blue-700 border-blue-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}
        >
          {activeCount === 3 ? 'Ketat (3/3)' : activeCount > 0 ? `${activeCount}/3 Aktif` : 'Bebas'}
        </span>
      </button>

      {/* POPUP MODAL PENGATURAN ANTI-CHEAT */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-lg w-full p-4 sm:p-6 space-y-4 animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col"
            role="dialog"
            aria-modal="true"
          >
            {/* Header Modal */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-2xl">security</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base flex items-center gap-2 flex-wrap">
                    <span>Pengaturan Anti-Cheat</span>
                    {variantName && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                        {variantName}
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Kustomisasi proteksi kecurangan khusus untuk varian kuis ini
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer"
                title="Tutup"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Form & Switch Options */}
            <form onSubmit={handleSave} className="flex-1 flex flex-col min-h-0 space-y-4">
              <div className="flex-1 overflow-y-auto pr-1 space-y-3">
                {message && (
                  <div
                    className={`p-3 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2 ${
                      message.type === 'success'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">
                      {message.type === 'success' ? 'check_circle' : 'error'}
                    </span>
                    <span>{message.text}</span>
                  </div>
                )}

                {/* Status Level Ringkasan */}
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between flex-wrap gap-2 text-xs">
                  <span className="text-gray-600 font-medium">Tingkat Keamanan Ujian:</span>
                  <span
                    className={`font-bold px-2.5 py-0.5 rounded-full border text-[11px] ${
                      activeCount === 3
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : activeCount > 0
                        ? 'bg-blue-100 text-blue-800 border-blue-300'
                        : 'bg-amber-100 text-amber-800 border-amber-300'
                    }`}
                  >
                    {activeCount === 3
                      ? '🛡️ Proteksi Maksimal (Sangat Ketat)'
                      : activeCount > 0
                      ? `🔒 Proteksi Standar (${activeCount}/3 Aktif)`
                      : '🔓 Mode Terbuka (Open Book)'}
                  </span>
                </div>

                {/* Toggle 1: Fullscreen */}
                <div
                  onClick={() => setEnableFullscreen(!enableFullscreen)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 select-none ${
                    enableFullscreen
                      ? 'bg-blue-50/60 border-blue-300 ring-1 ring-blue-300 shadow-2xs'
                      : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        enableFullscreen ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg">fullscreen</span>
                    </div>
                    <div className="space-y-0.5">
                      <div className="font-bold text-gray-900 text-xs sm:text-sm">
                        Wajib Mode Layar Penuh (Fullscreen)
                      </div>
                      <div className="text-xs text-gray-500 leading-relaxed">
                        Mewajibkan siswa tetap berada dalam tampilan layar penuh. Siswa akan diberi peringatan jika keluar dari fullscreen.
                      </div>
                    </div>
                  </div>
                  {/* Switch Pill */}
                  <div
                    className={`w-11 h-6 rounded-full transition-colors relative shrink-0 mt-1 ${
                      enableFullscreen ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform absolute top-0.5 ${
                        enableFullscreen ? 'left-[22px]' : 'left-0.5'
                      }`}
                    />
                  </div>
                </div>

                {/* Toggle 2: Prevent Tab Switch */}
                <div
                  onClick={() => setPreventTabSwitch(!preventTabSwitch)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 select-none ${
                    preventTabSwitch
                      ? 'bg-blue-50/60 border-blue-300 ring-1 ring-blue-300 shadow-2xs'
                      : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        preventTabSwitch ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg">visibility_off</span>
                    </div>
                    <div className="space-y-0.5">
                      <div className="font-bold text-gray-900 text-xs sm:text-sm">
                        Cegah Pindah Tab (Focus & Visibility)
                      </div>
                      <div className="text-xs text-gray-500 leading-relaxed">
                        Mendeteksi jika siswa membuka tab lain, berpindah window aplikasi, atau meminimalkan browser selama kuis.
                      </div>
                    </div>
                  </div>
                  <div
                    className={`w-11 h-6 rounded-full transition-colors relative shrink-0 mt-1 ${
                      preventTabSwitch ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform absolute top-0.5 ${
                        preventTabSwitch ? 'left-[22px]' : 'left-0.5'
                      }`}
                    />
                  </div>
                </div>

                {/* Toggle 3: Prevent Copy Paste */}
                <div
                  onClick={() => setPreventCopyPaste(!preventCopyPaste)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 select-none ${
                    preventCopyPaste
                      ? 'bg-blue-50/60 border-blue-300 ring-1 ring-blue-300 shadow-2xs'
                      : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        preventCopyPaste ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg">content_paste_off</span>
                    </div>
                    <div className="space-y-0.5">
                      <div className="font-bold text-gray-900 text-xs sm:text-sm">
                        Cegah Klik Kanan & Salin-Tempel (Copy-Paste)
                      </div>
                      <div className="text-xs text-gray-500 leading-relaxed">
                        Memblokir klik kanan, copy, paste, dan shortcut developer tools (F12, Ctrl+U, Ctrl+Shift+I).
                      </div>
                    </div>
                  </div>
                  <div
                    className={`w-11 h-6 rounded-full transition-colors relative shrink-0 mt-1 ${
                      preventCopyPaste ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform absolute top-0.5 ${
                        preventCopyPaste ? 'left-[22px]' : 'left-0.5'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Footer Modal (Responsive Mobile) */}
              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-3 border-t border-gray-100 shrink-0">
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleClose}
                  className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl text-xs sm:text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 text-center cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-sm">refresh</span>
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-sm">save</span>
                      <span>Simpan Pengaturan</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

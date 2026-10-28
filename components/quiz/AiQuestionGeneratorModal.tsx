'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateQuizAction, applyAiQuestionsToVariantAction } from '@/modules/ai-quiz/actions';

interface AiQuestionGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  quizVariantId: string;
  variantName: string;
  initialSummaryText?: string;
  hasStudentAttempts?: boolean;
  hasAiSummary?: boolean;
  summariesCount?: number;
  pageTitle?: string;
  pageId?: string;
  existingQuestionsCount?: number;
}

export default function AiQuestionGeneratorModal({
  isOpen,
  onClose,
  quizVariantId,
  variantName,
  initialSummaryText = '',
  hasStudentAttempts = false,
  hasAiSummary = false,
  summariesCount = 0,
  pageTitle = '',
  pageId = '',
  existingQuestionsCount = 0,
}: AiQuestionGeneratorModalProps) {
  const router = useRouter();

  // Form State
  const [questionType, setQuestionType] = useState<'PILIHAN_GANDA' | 'ESSAY'>('PILIHAN_GANDA');
  const [totalQuestions, setTotalQuestions] = useState<number>(5);
  const [difficulty, setDifficulty] = useState({ easy: 30, medium: 50, hard: 20 });
  const [mode, setMode] = useState<'APPEND' | 'REPLACE'>(hasStudentAttempts ? 'APPEND' : 'APPEND');

  // Generation & Review State
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [generatedQuestions, setGeneratedQuestions] = useState<any[] | null>(null);
  const [improvementPrompt, setImprovementPrompt] = useState('');

  if (!isOpen) return null;

  const handleGenerate = async (customPrompt?: string) => {
    setErrorMsg('');
    if (!initialSummaryText.trim()) {
      setErrorMsg('Materi belum memiliki rangkuman Summary AI. Silakan buat Summary AI terlebih dahulu.');
      return;
    }

    if (difficulty.easy + difficulty.medium + difficulty.hard !== 100) {
      setErrorMsg('Total persentase tingkat kesulitan harus tepat 100%.');
      return;
    }

    setIsGenerating(true);

    try {
      const textToUse = customPrompt?.trim()
        ? `INSTRUKSI TAMBAHAN PENGGUNA:\n${customPrompt.trim()}\n\nMATERI ACUAN:\n${initialSummaryText.trim()}`
        : initialSummaryText.trim();

      const res = await generateQuizAction(textToUse, {
        questionType,
        totalQuestions,
        difficultyDistribution: difficulty,
        model: 'free-tier',
      });

      if (!res?.success || !res.data) {
        throw new Error(res?.message || 'Gagal menghasilkan soal dengan AI.');
      }

      setGeneratedQuestions(res.data as any[]);
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat memproses generator AI.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyToVariant = async () => {
    if (!generatedQuestions || generatedQuestions.length === 0) return;

    setIsSaving(true);
    setErrorMsg('');

    try {
      const res = await applyAiQuestionsToVariantAction({
        quizVariantId,
        questions: generatedQuestions,
        questionType,
        mode,
      });

      if (res.success) {
        onClose();
        router.refresh();
      } else {
        setErrorMsg(res.message || 'Gagal menyimpan soal ke varian.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan sistem saat menyimpan.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setGeneratedQuestions(null);
    setImprovementPrompt('');
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-3xl w-full p-4 sm:p-6 space-y-4 animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">psychology</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm sm:text-base flex items-center gap-2">
                <span>AI Question Generator</span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                  {variantName}
                </span>
              </h3>
              <p className="text-xs text-gray-500">
                Buat dan regenerate butir soal kuis secara instan berbasis materi pembelajaran
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Warning if Student Attempts Exist */}
        {hasStudentAttempts && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2 shrink-0">
            <span className="material-symbols-outlined text-base text-amber-600 shrink-0 mt-0.5">info</span>
            <div>
              <strong className="font-semibold">Varian ini sudah memiliki riwayat pengerjaan murid:</strong>
              <p className="mt-0.5">
                Untuk melindungi validitas nilai murid, mode <em>"Gantikan Seluruh Soal"</em> dinonaktifkan. Soal baru dari AI akan otomatis ditambahkan (append) ke varian ini tanpa merusak data lama.
              </p>
            </div>
          </div>
        )}

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2 shrink-0">
            <span className="material-symbols-outlined text-base text-red-600 shrink-0">error</span>
            <span className="flex-1">{errorMsg}</span>
          </div>
        )}

        {/* Main Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4">
          {!generatedQuestions ? (
            /* STEP 1: CONFIGURATION FORM */
            <div className="space-y-4 text-xs sm:text-sm">
              {/* Sumber Materi Acuan: Menggunakan Summary AI */}
              {hasAiSummary ? (
                <div className="p-3.5 sm:p-4 rounded-xl border border-purple-200 bg-purple-50/50 space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-purple-700 text-lg">auto_awesome</span>
                      <span className="font-bold text-xs sm:text-sm text-purple-950">
                        Materi Acuan: Summary AI {pageTitle ? `"${pageTitle}"` : ''}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                      {summariesCount > 0 ? `${summariesCount} Bagian Rangkuman` : 'Rangkuman Aktif'}
                    </span>
                  </div>
                  <p className="text-xs text-purple-900/80 leading-relaxed">
                    Soal-soal kuis akan otomatis digenerate berbasis seluruh rangkuman materi yang sudah dibuat oleh Summary AI ({initialSummaryText.length} karakter). Anda tidak perlu mengetik atau membuat ulang materi acuan.
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-amber-300 bg-amber-50 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-amber-600 text-xl shrink-0 mt-0.5">warning</span>
                    <div className="space-y-1">
                      <h4 className="font-bold text-xs sm:text-sm text-amber-950">
                        Materi Ini Belum Memiliki Summary AI
                      </h4>
                      <p className="text-xs text-amber-900 leading-relaxed">
                        Generator kuis AI membutuhkan rangkuman materi pembelajaran untuk membuat butir-butir soal yang akurat dan relevan.
                      </p>
                    </div>
                  </div>

                  {pageId && (
                    <div className="pt-1">
                      <a
                        href={`/dashboard/summaries/${pageId}/generate-summary`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-2xs"
                      >
                        <span className="material-symbols-outlined text-sm">psychology</span>
                        <span>Buat Summary AI Sekarang</span>
                        <span className="material-symbols-outlined text-xs">open_in_new</span>
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Tipe Soal & Jumlah Soal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Tipe Soal
                  </label>
                  <select
                    value={questionType}
                    onChange={(e) => setQuestionType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs sm:text-sm bg-white focus:ring-2 focus:ring-purple-500 outline-none"
                  >
                    <option value="PILIHAN_GANDA">Pilihan Ganda (4 Opsi + Kunci)</option>
                    <option value="ESSAY">Essay (Penalaran / Analisis)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Jumlah Soal yang Digenerate
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={totalQuestions}
                    onChange={(e) => setTotalQuestions(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs sm:text-sm bg-white focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
              </div>

              {/* Distribusi Tingkat Kesulitan */}
              <div className="space-y-2 p-3.5 bg-gray-50 rounded-xl border border-gray-200">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Distribusi Tingkat Kesulitan (Total Harus 100%)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <span className="text-[11px] text-gray-600 font-medium">Mudah (%)</span>
                    <input
                      type="number"
                      value={difficulty.easy}
                      onChange={(e) => setDifficulty({ ...difficulty, easy: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs bg-white"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-600 font-medium">Sedang (%)</span>
                    <input
                      type="number"
                      value={difficulty.medium}
                      onChange={(e) => setDifficulty({ ...difficulty, medium: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs bg-white"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-600 font-medium">Sulit / HOTS (%)</span>
                    <input
                      type="number"
                      value={difficulty.hard}
                      onChange={(e) => setDifficulty({ ...difficulty, hard: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Mode Penyimpanan (Append vs Replace) */}
              {existingQuestionsCount > 0 && (
                <div className="space-y-1.5 p-3.5 bg-purple-50/50 rounded-xl border border-purple-200">
                  <label className="block text-xs font-semibold text-purple-900 uppercase tracking-wider">
                    Metode Penyimpanan ke Varian ({existingQuestionsCount} Soal Sudah Ada)
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm">
                      <input
                        type="radio"
                        name="saveMode"
                        value="APPEND"
                        checked={mode === 'APPEND'}
                        onChange={() => setMode('APPEND')}
                        className="text-purple-600 focus:ring-purple-500"
                      />
                      <span>Tambahkan ke Soal yang Ada (Append)</span>
                    </label>

                    <label className={`flex items-center gap-2 text-xs sm:text-sm ${hasStudentAttempts ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
                      }`}>
                      <input
                        type="radio"
                        name="saveMode"
                        value="REPLACE"
                        disabled={hasStudentAttempts}
                        checked={mode === 'REPLACE'}
                        onChange={() => setMode('REPLACE')}
                        className="text-purple-600 focus:ring-purple-500"
                      />
                      <span>Gantikan Seluruh Soal Lama (Replace)</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* STEP 2: REVIEW & REGENERATE QUESTIONS */
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Hasil Generate: {generatedQuestions.length} Soal
                </span>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs text-gray-500 hover:text-gray-800 underline"
                >
                  Ubah Parameter Awal
                </button>
              </div>

              {/* Questions List Preview */}
              <div className="space-y-3">
                {generatedQuestions.map((q, qIdx) => (
                  <div key={qIdx} className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/60 space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-purple-700 text-xs bg-purple-100 w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        {qIdx + 1}
                      </span>
                      <p className="text-xs sm:text-sm font-semibold text-gray-900 leading-relaxed">
                        {q.questionText}
                      </p>
                    </div>

                    {/* Options for Pilihan Ganda */}
                    {q.options && q.options.length > 0 && (
                      <div className="pl-7 grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {q.options.map((opt: any, optIdx: number) => (
                          <div
                            key={optIdx}
                            className={`p-2 rounded-lg text-xs flex items-center justify-between border ${opt.isCorrect
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-medium'
                                : 'bg-white border-gray-200 text-gray-700'
                              }`}
                          >
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-gray-500">
                                {String.fromCharCode(65 + optIdx)}.
                              </span>
                              <span>{opt.optionText}</span>
                            </div>
                            {opt.isCorrect && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                                Kunci
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Feedback Prompt for Regenerate */}
              <div className="p-3.5 bg-purple-50/60 border border-purple-200 rounded-xl space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900">
                  <span className="material-symbols-outlined text-sm">autorenew</span>
                  <span>Ingin Memperbaiki atau Generate Ulang?</span>
                </div>
                <input
                  type="text"
                  value={improvementPrompt}
                  onChange={(e) => setImprovementPrompt(e.target.value)}
                  placeholder="Contoh: Buat soal lebih fokus pada studi kasus nyata..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-purple-500 outline-none"
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    disabled={isGenerating}
                    onClick={() => handleGenerate(improvementPrompt)}
                    className="px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50"
                  >
                    {isGenerating && (
                      <span className="material-symbols-outlined animate-spin text-sm">refresh</span>
                    )}
                    <span>Regenerate dengan Instruksi di Atas</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-3 border-t border-gray-100 shrink-0">
          <button
            type="button"
            disabled={isGenerating || isSaving}
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-xs sm:text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Batal
          </button>

          {!generatedQuestions ? (
            <button
              type="button"
              disabled={isGenerating || !hasAiSummary}
              onClick={() => handleGenerate()}
              className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
              title={!hasAiSummary ? 'Materi belum memiliki Summary AI' : 'Generate Soal AI'}
            >
              {isGenerating ? (
                <>
                  <span>Sedang Membuat Soal AI...</span>
                </>
              ) : (
                <>
                  <span>Generate Soal Sekarang</span>
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              disabled={isSaving}
              onClick={handleApplyToVariant}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-sm">refresh</span>
                  <span>Menyimpan ke Varian...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  <span>Terapkan ke Varian Ini ({generatedQuestions.length} Soal)</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

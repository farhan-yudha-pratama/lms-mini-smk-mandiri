"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateQuizAction, saveQuizPackageAction } from "@/modules/ai-quiz/actions";

export default function ClientQuizGenerator({
  pageId,
  pageTitle,
  summaryText,
  isAiEnabled = true,
  defaultModel = "free-tier",
}: {
  pageId: string;
  pageTitle: string;
  summaryText: string;
  isAiEnabled?: boolean;
  defaultModel?: string;
}) {
  const router = useRouter();
  
  // Tahap 1 State: Form Input
  const [questionType, setQuestionType] = useState<"PILIHAN_GANDA" | "ESSAY">("PILIHAN_GANDA");
  const [totalQuestions, setTotalQuestions] = useState<number | string>("5");
  const [variantCount, setVariantCount] = useState<number | string>("1");
  const [difficulty, setDifficulty] = useState({ easy: 30, medium: 50, hard: 20 });
  const [model, setModel] = useState<string>(defaultModel || "free-tier");

  // Flow State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPackages, setGeneratedPackages] = useState<{ variantName: string, questions: any[] }[] | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  
  // Fitur Review & Save Per Paket
  const [savedPackages, setSavedPackages] = useState<number[]>([]);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [packageImprovements, setPackageImprovements] = useState<string[]>([]);
  const [savingTabIndex, setSavingTabIndex] = useState<number | null>(null);

  const [errorMsg, setErrorMsg] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleGenerate = async () => {
    setErrorMsg("");
    if (difficulty.easy + difficulty.medium + difficulty.hard !== 100) {
      setErrorMsg("Total persentase kesulitan (Mudah + Sedang + Sulit) harus tepat 100%.");
      return;
    }

    const parsedTotal = parseInt(String(totalQuestions), 10);
    if (isNaN(parsedTotal) || parsedTotal < 1) {
      setErrorMsg("Jumlah soal per paket tidak valid.");
      return;
    }

    const parsedVariantCount = parseInt(String(variantCount), 10);
    if (isNaN(parsedVariantCount) || parsedVariantCount < 1 || parsedVariantCount > 5) {
      setErrorMsg("Jumlah paket (varian) harus antara 1 sampai 5.");
      return;
    }

    setIsGenerating(true);

    try {
      const promises = Array.from({ length: parsedVariantCount }).map(async (_, index) => {
        const res = await generateQuizAction(summaryText, {
          questionType,
          totalQuestions: parsedTotal,
          difficultyDistribution: difficulty,
          model: model.trim() || "free-tier",
        });

        if (!res?.success || !res.data) {
          throw new Error(res?.message || `Terjadi kesalahan saat generate Paket ${index + 1}`);
        }

        const dateStr = new Date().toLocaleDateString('id-ID');
        
        const questionsWithTag = (res.data as any[]).map(q => ({
          ...q,
          packageTag: `Paket ${index + 1}`,
        }));

        return {
          variantName: `Paket ${index + 1} - AI ${dateStr}`,
          questions: questionsWithTag,
        };
      });

      const packages = await Promise.all(promises);
      setGeneratedPackages(packages);
      setActiveTab(0);
      setSavedPackages([]);
      setPackageImprovements(Array(parsedVariantCount).fill(""));
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan saat generate soal dengan AI.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegeneratePackage = async (index: number) => {
    if (!generatedPackages) return;
    setIsRegenerating(true);
    setErrorMsg("");

    try {
      const parsedTotal = parseInt(String(totalQuestions), 10);
      const improvement = packageImprovements[index];
      
      const promptToUse = improvement?.trim() 
        ? `INSTRUKSI TAMBAHAN/PERBAIKAN DARI PENGGUNA:\n${improvement}\n\nMATERI UTAMA:\n${summaryText}`
        : summaryText;

      const res = await generateQuizAction(promptToUse, {
        questionType,
        totalQuestions: parsedTotal,
        difficultyDistribution: difficulty,
        model: model.trim() || "free-tier",
      });

      if (!res?.success || !res.data) {
        throw new Error(res?.message || `Terjadi kesalahan saat generate ulang Paket ${index + 1}`);
      }

      const questionsWithTag = (res.data as any[]).map(q => ({
        ...q,
        packageTag: `Paket ${index + 1} (Regenerated)`,
      }));

      const updatedPackages = [...generatedPackages];
      updatedPackages[index].questions = questionsWithTag;
      setGeneratedPackages(updatedPackages);

      if (savedPackages.includes(index)) {
        setSavedPackages(savedPackages.filter(i => i !== index));
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal generate ulang paket ini.");
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleSavePackage = async (index: number) => {
    if (!generatedPackages || !generatedPackages[index]) return;
    setSavingTabIndex(index);
    setErrorMsg("");

    const pkg = generatedPackages[index];

    try {
      const res = await saveQuizPackageAction({
        pageId,
        quizTitle: `Kuis: ${pageTitle}`,
        variantName: pkg.variantName,
        questionType,
        questions: pkg.questions,
      });

      if (res?.success) {
        const updatedSaved = [...savedPackages, index];
        setSavedPackages(updatedSaved);
        
        if (updatedSaved.length === generatedPackages.length) {
          setShowSuccessModal(true);
        }
      } else {
        setErrorMsg(res?.message || `Gagal menyimpan Paket ${index + 1}.`);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal menyimpan kuis.");
    } finally {
      setSavingTabIndex(null);
    }
  };

  const handleImprovementChange = (index: number, val: string) => {
    const updated = [...packageImprovements];
    updated[index] = val;
    setPackageImprovements(updated);
  };

  const handleVariantNameChange = (newText: string) => {
    if (!generatedPackages) return;
    const updated = [...generatedPackages];
    updated[activeTab].variantName = newText;
    setGeneratedPackages(updated);
  };

  const handleQuestionChange = (qIndex: number, newText: string) => {
    if (!generatedPackages) return;
    const updated = [...generatedPackages];
    updated[activeTab].questions[qIndex].questionText = newText;
    setGeneratedPackages(updated);
  };

  const handleOptionChange = (qIndex: number, optIndex: number, newText: string) => {
    if (!generatedPackages) return;
    const updated = [...generatedPackages];
    updated[activeTab].questions[qIndex].options[optIndex].optionText = newText;
    setGeneratedPackages(updated);
  };

  const handleSetCorrectOption = (qIndex: number, optIndex: number) => {
    if (!generatedPackages) return;
    const updated = [...generatedPackages];
    updated[activeTab].questions[qIndex].options = updated[activeTab].questions[qIndex].options.map((opt: any, idx: number) => ({
      ...opt,
      isCorrect: idx === optIndex
    }));
    setGeneratedPackages(updated);
  };

  if (!isAiEnabled) {
    return (
      <div className="p-8 bg-gray-50 border border-gray-200 rounded-xl text-center space-y-4">
        <span className="material-symbols-outlined text-4xl text-gray-400 block">block</span>
        <h2 className="text-xl font-bold text-gray-700">AI Generator Dinonaktifkan</h2>
        <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
          Fitur pembuatan soal otomatis menggunakan AI saat ini dinonaktifkan di pengaturan server.
          Anda tetap dapat menggunakan fitur <strong>Import Kuis JSON</strong> untuk menambahkan soal secara manual.
        </p>
        <button 
          onClick={() => router.push(`/dashboard/summaries/${pageId}`)}
          className="mt-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-semibold shadow-sm transition-colors"
        >
          Kembali ke Kelola Summary
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-start gap-2">
          <span className="material-symbols-outlined text-lg mt-0.5">error</span>
          <p className="flex-1 leading-relaxed">{errorMsg}</p>
        </div>
      )}

      {/* TAHAP 1: KONFIGURASI GENERATOR */}
      {!generatedPackages && (
        <div className="p-5 sm:p-6 bg-white border border-gray-200 rounded-xl shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Konfigurasi Parameter Soal</h2>
              <p className="text-xs text-gray-500 mt-0.5">AI akan menganalisis intisari materi untuk merumuskan soal kuis.</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg">
              {summaryText.length} Karakter Rangkuman
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700">Tipe Soal Kuis</label>
              <select 
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white transition-shadow"
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value as any)}
              >
                <option value="PILIHAN_GANDA">Pilihan Ganda (Multiple Choice)</option>
                <option value="ESSAY">Esai (Uraian)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700">Jumlah Soal (Per Paket)</label>
              <input 
                type="number" 
                min="1" 
                max="30"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
                value={totalQuestions}
                onChange={(e) => setTotalQuestions(e.target.value)}
              />
              <p className="text-xs text-gray-400">Rekomendasi: 5 - 15 butir.</p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700">Jumlah Paket (Varian)</label>
              <input 
                type="number" 
                min="1" 
                max="5"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
                value={variantCount}
                onChange={(e) => setVariantCount(e.target.value)}
              />
              <p className="text-xs text-gray-400">Maks: 5 paket sekaligus.</p>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-gray-700">Model AI</label>
                <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 font-semibold">
                  Default: free-tier
                </span>
              </div>
              <input 
                type="text" 
                list="ai-models-list"
                placeholder="free-tier"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow font-mono"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              />
              <datalist id="ai-models-list">
                <option value="free-tier">free-tier (Default)</option>
                <option value="gpt-4o-mini">gpt-4o-mini</option>
                <option value="gpt-4o">gpt-4o</option>
                <option value="claude-3-5-sonnet">claude-3-5-sonnet</option>
                <option value="gemini-1.5-flash">gemini-1.5-flash</option>
                <option value="gemini-1.5-pro">gemini-1.5-pro</option>
              </datalist>
              <p className="text-xs text-gray-400">Pilih atau ketik model yang diinginkan.</p>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-semibold text-gray-700">Komposisi Kesulitan Soal (%)</label>
              <span className={`text-xs font-semibold ${
                difficulty.easy + difficulty.medium + difficulty.hard === 100 
                  ? 'text-emerald-600' 
                  : 'text-red-600 font-bold'
              }`}>
                Total: {difficulty.easy + difficulty.medium + difficulty.hard}% / 100%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <span className="text-xs font-medium text-gray-600 block mb-1">Mudah (%)</span>
                <input 
                  type="number" 
                  min="0" 
                  max="100" 
                  className="w-full p-2 border border-gray-300 rounded-md text-sm bg-white"
                  value={difficulty.easy} 
                  onChange={e => setDifficulty({...difficulty, easy: Number(e.target.value)})} 
                />
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <span className="text-xs font-medium text-gray-600 block mb-1">Sedang (%)</span>
                <input 
                  type="number" 
                  min="0" 
                  max="100" 
                  className="w-full p-2 border border-gray-300 rounded-md text-sm bg-white"
                  value={difficulty.medium} 
                  onChange={e => setDifficulty({...difficulty, medium: Number(e.target.value)})} 
                />
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <span className="text-xs font-medium text-gray-600 block mb-1">Sulit (%)</span>
                <input 
                  type="number" 
                  min="0" 
                  max="100" 
                  className="w-full p-2 border border-gray-300 rounded-md text-sm bg-white"
                  value={difficulty.hard} 
                  onChange={e => setDifficulty({...difficulty, hard: Number(e.target.value)})} 
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 flex justify-end">
            <button 
              type="button"
              onClick={handleGenerate} 
              disabled={isGenerating}
              className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-lg">
                {isGenerating ? "autorenew" : "psychology"}
              </span>
              <span>{isGenerating ? "Menganalisis & Menyusun Paket Soal..." : "Mulai Generate Soal (AI)"}</span>
            </button>
          </div>
        </div>
      )}

      {/* TAHAP 2: REVIEW & EDIT DRAFT SOAL */}
      {generatedPackages && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-indigo-50 p-4 rounded-xl border border-indigo-200">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-indigo-900">Review Draft Soal Kuis</h2>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200 font-semibold">
                  Model: {model || "free-tier"}
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold">
                  {generatedPackages.length} Paket
                </span>
              </div>
              <p className="text-xs text-indigo-700 mt-0.5">Periksa dan koreksi redaksi soal atau kunci jawaban per paket sebelum disimpan.</p>
            </div>
            <button 
              type="button"
              onClick={() => setGeneratedPackages(null)}
              className="text-xs px-3 py-1.5 bg-white text-gray-700 border border-indigo-200 rounded-lg hover:bg-gray-50 transition-colors font-medium self-start sm:self-auto shrink-0"
            >
              Ubah Parameter
            </button>
          </div>

          {/* TABS UNTUK PAKET SOAL */}
          {generatedPackages.length > 1 && (
            <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-0">
              {generatedPackages.map((pkg, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveTab(idx)}
                  className={`px-4 py-2.5 rounded-t-lg text-sm font-semibold transition-colors border-b-2 -mb-[2px] flex items-center gap-2 ${
                    activeTab === idx 
                      ? "bg-indigo-50/50 text-indigo-700 border-indigo-600" 
                      : "bg-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 border-transparent"
                  }`}
                >
                  Paket {idx + 1}
                  {savedPackages.includes(idx) && (
                    <span className="material-symbols-outlined text-[14px] text-emerald-600 font-bold" title="Tersimpan">check</span>
                  )}
                </button>
              ))}
            </div>
          )}

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">
              Nama Varian Kuis (Paket {activeTab + 1})
            </label>
            <input 
              type="text" 
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              value={generatedPackages[activeTab].variantName}
              onChange={(e) => handleVariantNameChange(e.target.value)}
              placeholder="Contoh: Paket A - Soal AI Semester 1"
            />
          </div>

          {/* List Kartu Soal */}
          <div className="space-y-4">
            {generatedPackages[activeTab].questions.map((q, qIndex) => (
              <div key={qIndex} className="p-4 sm:p-5 bg-white border border-gray-200 rounded-xl shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex gap-2 items-center">
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                      Butir Soal #{qIndex + 1}
                    </span>
                    {q.packageTag && (
                      <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded">
                        {q.packageTag}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Pertanyaan:</label>
                  <textarea 
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm leading-relaxed focus:ring-2 focus:ring-indigo-500 outline-none"
                    rows={2}
                    value={q.questionText}
                    onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                  />
                </div>

                {/* Opsi Pilihan Ganda */}
                {q.options && Array.isArray(q.options) && (
                  <div className="space-y-2 pt-1 border-t border-gray-100">
                    <label className="block text-xs font-medium text-gray-500">Pilihan Jawaban (Klik lingkaran untuk memilih kunci jawaban):</label>
                    <div className="space-y-2">
                      {q.options.map((opt: any, optIndex: number) => (
                        <div key={optIndex} className="flex gap-2.5 items-center">
                          <button
                            type="button"
                            onClick={() => handleSetCorrectOption(qIndex, optIndex)}
                            className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                              opt.isCorrect 
                                ? 'bg-emerald-500 text-white shadow-xs' 
                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                            }`}
                            title={opt.isCorrect ? "Kunci Jawaban Benar" : "Jadikan Kunci Jawaban"}
                          >
                            <span className="material-symbols-outlined text-sm">
                              {opt.isCorrect ? "check" : "radio_button_unchecked"}
                            </span>
                          </button>
                          <input 
                            type="text" 
                            className={`w-full px-3 py-1.5 border rounded-lg text-xs sm:text-sm transition-colors ${
                              opt.isCorrect 
                                ? 'border-emerald-400 bg-emerald-50/40 text-emerald-900 font-medium' 
                                : 'border-gray-200 bg-white text-gray-800'
                            }`}
                            value={opt.optionText}
                            onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Aksi Per Paket (Generate Ulang & Simpan) */}
          <div className="pt-4 mt-4 border-t border-gray-100 flex flex-col gap-4">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Catatan Perbaikan AI (Opsional)
              </label>
              <p className="text-xs text-gray-500 mb-3">
                Jika ada soal yang kurang tepat, Anda bisa menuliskan instruksi tambahan dan melakukan generate ulang khusus untuk <strong>Paket {activeTab + 1}</strong>.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="text" 
                  className="flex-1 px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="Contoh: Buat soalnya lebih sulit dan fokus ke bab 2"
                  value={packageImprovements[activeTab] || ""}
                  onChange={(e) => handleImprovementChange(activeTab, e.target.value)}
                  disabled={isRegenerating || savedPackages.includes(activeTab)}
                />
                <button 
                  type="button"
                  onClick={() => handleRegeneratePackage(activeTab)} 
                  disabled={isRegenerating || savedPackages.includes(activeTab)}
                  className="px-4 py-2.5 bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 shrink-0"
                >
                  <span className="material-symbols-outlined text-lg">
                    {isRegenerating ? "autorenew" : "magic_button"}
                  </span>
                  <span>{isRegenerating ? "Memproses..." : "Generate Ulang Paket Ini"}</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <button 
                type="button"
                onClick={() => setGeneratedPackages(null)}
                className="px-4 py-2.5 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors w-full sm:w-auto text-left"
              >
                Batal & Buat Baru Semua
              </button>

              <button 
                type="button"
                onClick={() => handleSavePackage(activeTab)} 
                disabled={savingTabIndex === activeTab || savedPackages.includes(activeTab)}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm w-full sm:w-auto disabled:opacity-50 ${
                  savedPackages.includes(activeTab)
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                <span className="material-symbols-outlined text-lg">
                  {savedPackages.includes(activeTab) ? "check_circle" : (savingTabIndex === activeTab ? "sync" : "save")}
                </span>
                <span>
                  {savedPackages.includes(activeTab) 
                    ? "Paket Tersimpan" 
                    : (savingTabIndex === activeTab ? "Menyimpan..." : "Simpan Paket Ini")}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden border border-gray-200 p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-2xl">check_circle</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Kuis Berhasil Disimpan!
            </h3>
            <p className="text-xs text-gray-600 mb-6 leading-relaxed">
              <strong>{generatedPackages?.length || 1} Varian kuis</strong> telah berhasil dibuat dan siap ditugaskan kepada siswa.
            </p>
            <button
              type="button"
              onClick={() => {
                setShowSuccessModal(false);
                router.push(`/dashboard/summaries/${pageId}`);
                router.refresh();
              }}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
            >
              Kembali ke Kelola Summary
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

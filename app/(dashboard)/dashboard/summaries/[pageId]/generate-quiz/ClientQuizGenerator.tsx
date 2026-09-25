"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateQuizAction, saveQuizPackageAction } from "@/modules/ai-quiz/actions";

export default function ClientQuizGenerator({
  pageId,
  pageTitle,
  summaryText,
  isAiEnabled = true,
}: {
  pageId: string;
  pageTitle: string;
  summaryText: string;
  isAiEnabled?: boolean;
}) {
  const router = useRouter();
  
  // Tahap 1 State: Form Input
  const [questionType, setQuestionType] = useState<"PILIHAN_GANDA" | "ESSAY">("PILIHAN_GANDA");
  const [totalQuestions, setTotalQuestions] = useState<number>(5);
  const [difficulty, setDifficulty] = useState({ easy: 30, medium: 50, hard: 20 });
  const [variantName, setVariantName] = useState(`Paket AI - ${new Date().toLocaleDateString()}`);

  // Flow State
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<any[] | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleGenerate = async () => {
    setErrorMsg("");
    if (difficulty.easy + difficulty.medium + difficulty.hard !== 100) {
      setErrorMsg("Total persentase kesulitan harus tepat 100%");
      return;
    }

    setIsGenerating(true);
    const res = await generateQuizAction(summaryText, {
      questionType,
      totalQuestions,
      difficultyDistribution: difficulty,
    });

    if (res?.success && res.data) {
      setGeneratedQuestions(res.data as any[]);
    } else {
      setErrorMsg(res?.message || "Terjadi kesalahan saat generate soal.");
    }
    setIsGenerating(false);
  };

  const handleSave = async () => {
    if (!generatedQuestions) return;
    setIsSaving(true);
    setErrorMsg("");

    const payload = {
      pageId,
      quizTitle: `Kuis: ${pageTitle}`,
      variantName: variantName,
      questionType,
      questions: generatedQuestions,
    };

    const res = await saveQuizPackageAction(payload);
    if (res?.success) {
      alert("Kuis berhasil disimpan sebagai Varian Baru!");
      router.push(`/dashboard/summaries/${pageId}`);
    } else {
      setErrorMsg(res?.message || "Gagal menyimpan kuis.");
      setIsSaving(false);
    }
  };

  const handleQuestionChange = (index: number, newText: string) => {
    const updated = [...(generatedQuestions || [])];
    updated[index].questionText = newText;
    setGeneratedQuestions(updated);
  };

  const handleOptionChange = (qIndex: number, optIndex: number, newText: string) => {
    const updated = [...(generatedQuestions || [])];
    updated[qIndex].options[optIndex].optionText = newText;
    setGeneratedQuestions(updated);
  };

  if (!isAiEnabled) {
    return (
      <div className="p-8 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-4">
        <span className="material-symbols-outlined text-4xl text-slate-400 block">block</span>
        <h2 className="text-xl font-bold text-slate-700">AI Generator Nonaktif</h2>
        <p className="text-slate-500 max-w-md mx-auto">
          Fitur pembuatan soal otomatis menggunakan AI saat ini dinonaktifkan (Mode Shared Hosting).
          Silakan hubungi administrator jika Anda merasa ini adalah sebuah kesalahan.
        </p>
        <button 
          onClick={() => router.push(`/dashboard/summaries/${pageId}`)}
          className="mt-4 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium shadow-sm transition-colors"
        >
          Kembali ke Kelola Summary
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {errorMsg && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md">
          {errorMsg}
        </div>
      )}

      {/* TAHAP 1: KONFIGURASI (Hanya tampil jika belum ada hasil generate) */}
      {!generatedQuestions && (
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm space-y-6">
          <h2 className="text-xl font-semibold">Konfigurasi Generate Soal AI</h2>
          <p className="text-sm text-slate-500">Materi gabungan yang akan dibaca AI: {summaryText.length} karakter.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Tipe Soal</label>
              <select 
                className="w-full p-2 border border-slate-300 rounded-md"
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value as any)}
              >
                <option value="PILIHAN_GANDA">Pilihan Ganda</option>
                <option value="ESSAY">Essay</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Jumlah Soal</label>
              <input 
                type="number" min="1" max="50"
                className="w-full p-2 border border-slate-300 rounded-md"
                value={totalQuestions}
                onChange={(e) => setTotalQuestions(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium">Distribusi Kesulitan (%)</label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <span className="text-xs text-slate-500">Mudah</span>
                <input type="number" min="0" max="100" className="w-full p-2 border border-slate-300 rounded-md"
                  value={difficulty.easy} onChange={e => setDifficulty({...difficulty, easy: Number(e.target.value)})} />
              </div>
              <div>
                <span className="text-xs text-slate-500">Sedang</span>
                <input type="number" min="0" max="100" className="w-full p-2 border border-slate-300 rounded-md"
                  value={difficulty.medium} onChange={e => setDifficulty({...difficulty, medium: Number(e.target.value)})} />
              </div>
              <div>
                <span className="text-xs text-slate-500">Sulit</span>
                <input type="number" min="0" max="100" className="w-full p-2 border border-slate-300 rounded-md"
                  value={difficulty.hard} onChange={e => setDifficulty({...difficulty, hard: Number(e.target.value)})} />
              </div>
            </div>
            <div className="text-xs text-slate-500">
              Total: {difficulty.easy + difficulty.medium + difficulty.hard}%
            </div>
          </div>

          <button 
            onClick={handleGenerate} 
            disabled={isGenerating}
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {isGenerating ? "Menganalisis Materi & Membuat Soal..." : "Mulai Generate (via 9Router)"}
          </button>
        </div>
      )}

      {/* TAHAP 2: REVIEW & EDIT */}
      {generatedQuestions && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-indigo-50 p-4 rounded-xl border border-indigo-100">
            <div>
              <h2 className="text-lg font-semibold text-indigo-900">Review Draft Soal</h2>
              <p className="text-sm text-indigo-700">Silakan koreksi jika ada kesalahan sebelum menyimpan.</p>
            </div>
            <button 
              onClick={() => setGeneratedQuestions(null)}
              className="text-sm px-3 py-1 bg-white border border-indigo-200 rounded-md hover:bg-indigo-50"
            >
              Batal & Konfigurasi Ulang
            </button>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Nama Varian Kuis</label>
            <input 
              type="text" 
              className="w-full p-2 border border-slate-300 rounded-md"
              value={variantName}
              onChange={(e) => setVariantName(e.target.value)}
              placeholder="Contoh: Paket A - Hasil AI"
            />
          </div>

          <div className="space-y-6">
            {generatedQuestions.map((q, qIndex) => (
              <div key={qIndex} className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
                <div className="font-medium text-slate-700 mb-2">Soal {qIndex + 1}</div>
                <textarea 
                  className="w-full p-3 border border-slate-300 rounded-md mb-4"
                  rows={2}
                  value={q.questionText}
                  onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                />

                {q.options && Array.isArray(q.options) && (
                  <div className="space-y-2 pl-4 border-l-2 border-indigo-200">
                    {q.options.map((opt: any, optIndex: number) => (
                      <div key={optIndex} className="flex gap-3 items-start">
                        <div className={`mt-2 w-4 h-4 rounded-full flex-shrink-0 ${opt.isCorrect ? 'bg-green-500' : 'bg-slate-300'}`} 
                             title={opt.isCorrect ? "Kunci Jawaban" : "Opsi Salah"} />
                        <input 
                          type="text" 
                          className={`w-full p-2 border rounded-md ${opt.isCorrect ? 'border-green-300 bg-green-50' : 'border-slate-300'}`}
                          value={opt.optionText}
                          onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="w-full py-3 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium disabled:opacity-50"
          >
            {isSaving ? "Menyimpan ke Database..." : "Simpan & Buat Varian Kuis"}
          </button>
        </div>
      )}
    </div>
  );
}

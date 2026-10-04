"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { saveQuizPackageAction } from "@/modules/ai-quiz/actions";

export default function ClientQuizImporter({
  pageId,
  pageTitle,
}: {
  pageId: string;
  pageTitle: string;
}) {
  const router = useRouter();
  
  // State
  const [questionType, setQuestionType] = useState<"PILIHAN_GANDA" | "ESSAY">("PILIHAN_GANDA");
  const [variantName, setVariantName] = useState(`Paket Import JSON - ${new Date().toLocaleDateString()}`);
  const [jsonString, setJsonString] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const exampleMCQ = `[
  {
    "questionText": "Apa kepanjangan dari HTML?",
    "options": [
      { "optionText": "Hyper Text Markup Language", "isCorrect": true },
      { "optionText": "High Tech Modern Language", "isCorrect": false },
      { "optionText": "Hyperlink and Text Model", "isCorrect": false },
      { "optionText": "Home Tool Markup Language", "isCorrect": false }
    ]
  }
]`;

  const exampleEssay = `[
  {
    "questionText": "Jelaskan fungsi utama tag <div> dalam struktur tata letak HTML!"
  }
]`;

  const handleImport = async () => {
    setErrorMsg("");
    
    if (!jsonString.trim()) {
      setErrorMsg("Format JSON tidak boleh kosong. Silakan paste array JSON soal.");
      return;
    }

    let parsedQuestions = [];
    try {
      parsedQuestions = JSON.parse(jsonString);
    } catch (e) {
      setErrorMsg("Format JSON tidak valid. Pastikan sintaks benar (periksa kurung siku, tanda kutip ganda, dan koma).");
      return;
    }

    if (!Array.isArray(parsedQuestions)) {
      setErrorMsg("Data JSON harus berupa Array (diawali dengan '[' dan diakhiri dengan ']').");
      return;
    }

    if (parsedQuestions.length === 0) {
      setErrorMsg("Array JSON kosong, tidak ada butir soal untuk diimpor.");
      return;
    }

    setIsSaving(true);

    const payload = {
      pageId,
      quizTitle: `Kuis: ${pageTitle}`,
      variantName,
      questionType,
      questions: parsedQuestions,
    };

    const res = await saveQuizPackageAction(payload);
    
    if (res?.success) {
      setShowSuccessModal(true);
    } else {
      setErrorMsg(res?.message || "Gagal mengimport kuis ke database.");
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-start gap-2">
          <span className="material-symbols-outlined text-lg mt-0.5">error</span>
          <p className="flex-1 leading-relaxed">{errorMsg}</p>
        </div>
      )}

      <div className="p-5 sm:p-6 bg-white border border-gray-200 rounded-xl shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Konfigurasi & Input Data JSON</h2>
            <p className="text-xs text-gray-500 mt-0.5">Masukkan data soal dalam format array JSON terstruktur.</p>
          </div>
          <button 
            type="button"
            onClick={() => setShowExample(!showExample)}
            className="text-xs px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors font-medium flex items-center gap-1 self-start sm:self-auto"
          >
            <span className="material-symbols-outlined text-sm">
              {showExample ? "visibility_off" : "visibility"}
            </span>
            <span>{showExample ? "Sembunyikan Contoh" : "Lihat Contoh JSON"}</span>
          </button>
        </div>
        
        {showExample && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm">
            <div>
              <div className="font-semibold text-gray-700 text-xs mb-1.5 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-blue-600">checklist</span>
                <span>Contoh Format Pilihan Ganda</span>
              </div>
              <pre className="p-3 bg-gray-900 text-emerald-400 rounded-lg overflow-x-auto text-[11px] font-mono leading-relaxed max-h-48">
                {exampleMCQ}
              </pre>
            </div>
            <div>
              <div className="font-semibold text-gray-700 text-xs mb-1.5 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-blue-600">edit_note</span>
                <span>Contoh Format Essay</span>
              </div>
              <pre className="p-3 bg-gray-900 text-emerald-400 rounded-lg overflow-x-auto text-[11px] font-mono leading-relaxed max-h-48">
                {exampleEssay}
              </pre>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">Nama Varian Kuis</label>
            <input 
              type="text" 
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
              value={variantName}
              onChange={(e) => setVariantName(e.target.value)}
              placeholder="Contoh: Paket Soal Remidi - Bab 1"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">Tipe Soal</label>
            <select 
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition-shadow"
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value as any)}
            >
              <option value="PILIHAN_GANDA">Pilihan Ganda</option>
              <option value="ESSAY">Essay</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-gray-700">Teks Array JSON</label>
          <p className="text-xs text-gray-400">Salin dan tempel array JSON soal Anda di dalam kotak di bawah ini.</p>
          <textarea
            className="w-full p-3.5 border border-gray-300 rounded-lg font-mono text-xs sm:text-sm min-h-60 leading-relaxed focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
            placeholder="[&#10;  {&#10;    &quot;questionText&quot;: &quot;...&quot;,&#10;    &quot;options&quot;: [ ... ]&#10;  }&#10;]"
            value={jsonString}
            onChange={(e) => setJsonString(e.target.value)}
          />
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-100">
          <Link
            href={`/dashboard/summaries/${pageId}`}
            className="w-full sm:w-auto px-4 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-center text-sm font-medium"
          >
            Batal
          </Link>
          <button 
            type="button"
            onClick={handleImport}
            disabled={isSaving}
            className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-semibold disabled:opacity-50 shadow-sm"
          >
            <span className="material-symbols-outlined text-lg">
              {isSaving ? "sync" : "upload"}
            </span>
            <span>{isSaving ? "Mengimpor Data..." : "Impor Kuis Sekarang"}</span>
          </button>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden border border-gray-200 p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-2xl">check_circle</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Import Kuis Berhasil!
            </h3>
            <p className="text-xs text-gray-600 mb-6 leading-relaxed">
              Soal dari JSON telah berhasil disimpan sebagai <strong>{variantName}</strong> untuk materi ini.
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
              Lihat Ringkasan & Kuis
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

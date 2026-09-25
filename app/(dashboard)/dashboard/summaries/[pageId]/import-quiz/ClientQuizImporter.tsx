"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

  const exampleMCQ = `[
  {
    "questionText": "Apa ibukota negara Indonesia?",
    "options": [
      { "optionText": "Bandung", "isCorrect": false },
      { "optionText": "Jakarta", "isCorrect": true },
      { "optionText": "Surabaya", "isCorrect": false },
      { "optionText": "Medan", "isCorrect": false }
    ]
  }
]`;

  const exampleEssay = `[
  {
    "questionText": "Jelaskan proses terjadinya hujan secara singkat!"
  }
]`;

  const handleImport = async () => {
    setErrorMsg("");
    
    if (!jsonString.trim()) {
      setErrorMsg("JSON tidak boleh kosong.");
      return;
    }

    let parsedQuestions = [];
    try {
      parsedQuestions = JSON.parse(jsonString);
    } catch (e) {
      setErrorMsg("Format JSON tidak valid. Pastikan sintaks benar (tidak ada koma berlebih atau kurang kurung).");
      return;
    }

    if (!Array.isArray(parsedQuestions)) {
      setErrorMsg("JSON harus berupa Array (berawalan '[' dan berakhiran ']').");
      return;
    }

    if (parsedQuestions.length === 0) {
      setErrorMsg("Array JSON kosong, tidak ada soal untuk diimport.");
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
      alert("Kuis dari JSON berhasil diimport dan disimpan sebagai Varian Baru!");
      router.push(`/dashboard/summaries/${pageId}`);
    } else {
      setErrorMsg(res?.message || "Gagal mengimport kuis.");
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {errorMsg && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md shadow-sm">
          {errorMsg}
        </div>
      )}

      <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Konfigurasi & Input Data</h2>
          <button 
            onClick={() => setShowExample(!showExample)}
            className="text-sm px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md hover:bg-indigo-100 transition-colors"
          >
            {showExample ? "Sembunyikan Contoh" : "Lihat Contoh JSON"}
          </button>
        </div>
        
        {showExample && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm">
            <div>
              <div className="font-semibold text-slate-700 mb-2">Contoh Pilihan Ganda</div>
              <pre className="p-3 bg-slate-800 text-slate-200 rounded-md overflow-x-auto text-xs">
                {exampleMCQ}
              </pre>
            </div>
            <div>
              <div className="font-semibold text-slate-700 mb-2">Contoh Essay</div>
              <pre className="p-3 bg-slate-800 text-slate-200 rounded-md overflow-x-auto text-xs">
                {exampleEssay}
              </pre>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Nama Varian Kuis</label>
            <input 
              type="text" 
              className="w-full p-2 border border-slate-300 rounded-md"
              value={variantName}
              onChange={(e) => setVariantName(e.target.value)}
              placeholder="Contoh: Paket JSON - Bab 1"
            />
          </div>
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
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Teks Array JSON</label>
          <p className="text-xs text-slate-500">Paste raw array JSON soal Anda di bawah ini.</p>
          <textarea
            className="w-full p-3 border border-slate-300 rounded-md font-mono text-sm min-h-64"
            placeholder="[ { ... }, { ... } ]"
            value={jsonString}
            onChange={(e) => setJsonString(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={() => router.push(`/dashboard/summaries/${pageId}`)}
            className="py-2 px-4 bg-white border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors"
          >
            Batal
          </button>
          <button 
            onClick={handleImport} 
            disabled={isSaving}
            className="py-2 px-6 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 font-medium disabled:opacity-50 transition-colors shadow-sm"
          >
            {isSaving ? "Memproses Data..." : "Simpan & Import Kuis"}
          </button>
        </div>
      </div>
    </div>
  );
}

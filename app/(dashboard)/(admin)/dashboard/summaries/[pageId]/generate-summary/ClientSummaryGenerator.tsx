"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateSummaryAction, createSummaryAction } from "@/app/actions/summary";

export default function ClientSummaryGenerator({
  pageId,
  pageTitle,
  pageContent,
  isAiEnabled = true,
  defaultModel = "free-tier",
}: {
  pageId: string;
  pageTitle: string;
  pageContent: string;
  isAiEnabled?: boolean;
  defaultModel?: string;
}) {
  const router = useRouter();
  
  const [model, setModel] = useState<string>(defaultModel || "free-tier");

  // Flow State
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedTitle, setGeneratedTitle] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [hasGenerated, setHasGenerated] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleGenerate = async () => {
    setErrorMsg("");
    if (!pageContent.trim()) {
      setErrorMsg("Materi kosong. Tidak ada konten yang dapat dirangkum.");
      return;
    }

    setIsGenerating(true);
    const res = await generateSummaryAction(pageContent, model.trim() || "free-tier");

    if (res?.success && res.data) {
      setGeneratedTitle(res.data.title || `Rangkuman: ${pageTitle}`);
      setGeneratedContent(res.data.content || "");
      setHasGenerated(true);
    } else {
      setErrorMsg(res?.error || "Terjadi kesalahan saat generate rangkuman dengan AI.");
    }
    setIsGenerating(false);
  };

  const handleSave = async () => {
    if (!generatedContent.trim() || !generatedTitle.trim()) {
      setErrorMsg("Judul dan isi rangkuman tidak boleh kosong.");
      return;
    }

    setIsSaving(true);
    setErrorMsg("");

    // SPLIT LOGIC untuk mengatasi limit 3000 karakter Zod Schema
    const MAX_LENGTH = 2800; // Aman di bawah 3000
    const paragraphs = generatedContent.split('\n');
    
    const chunks: string[] = [];
    let currentChunk = "";

    for (const paragraph of paragraphs) {
      // Jika ada satu paragraf yang sangat panjang tanpa enter
      if (paragraph.length > MAX_LENGTH) {
         if (currentChunk) chunks.push(currentChunk);
         currentChunk = "";
         let str = paragraph;
         while(str.length > 0) {
            chunks.push(str.substring(0, MAX_LENGTH));
            str = str.substring(MAX_LENGTH);
         }
         continue;
      }

      if (currentChunk.length + paragraph.length + 1 > MAX_LENGTH) {
        chunks.push(currentChunk);
        currentChunk = paragraph;
      } else {
        currentChunk += (currentChunk ? '\n' : '') + paragraph;
      }
    }
    if (currentChunk) {
      chunks.push(currentChunk);
    }

    let successCount = 0;
    
    for (let i = 0; i < chunks.length; i++) {
       const chunkTitle = chunks.length > 1 ? `${generatedTitle} (Bagian ${i + 1})` : generatedTitle;
       const res = await createSummaryAction({
         pageId,
         title: chunkTitle,
         content: chunks[i],
         orderIndex: 99 + i,
       });

       if (res?.success) {
         successCount++;
       } else {
         setErrorMsg(res?.error || `Gagal menyimpan rangkuman bagian ke-${i + 1}`);
         setIsSaving(false);
         return; // Hentikan proses jika ada yang gagal
       }
    }

    if (successCount === chunks.length) {
      setShowSuccessModal(true);
    }
  };

  if (!isAiEnabled) {
    return (
      <div className="p-8 bg-gray-50 border border-gray-200 rounded-xl text-center space-y-4">
        <span className="material-symbols-outlined text-4xl text-gray-400 block">block</span>
        <h2 className="text-xl font-bold text-gray-700">AI Generator Dinonaktifkan</h2>
        <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
          Fitur pembuatan rangkuman otomatis menggunakan AI saat ini dinonaktifkan di pengaturan server.
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
      {!hasGenerated && (
        <div className="p-5 sm:p-6 bg-white border border-gray-200 rounded-xl shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Konfigurasi Rangkuman AI</h2>
              <p className="text-xs text-gray-500 mt-0.5">AI akan menganalisis konten materi halaman ini dan membuat intisarinya.</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg">
              {pageContent.length} Karakter Materi
            </span>
          </div>
          
          <div className="space-y-1.5 max-w-sm">
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

          <div className="pt-3 border-t border-gray-100 flex justify-end">
            <button 
              type="button"
              onClick={handleGenerate} 
              disabled={isGenerating || !pageContent.trim()}
              className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-lg">
                {isGenerating ? "autorenew" : "psychology"}
              </span>
              <span>{isGenerating ? "Menganalisis & Merangkum..." : "Mulai Generate Rangkuman (AI)"}</span>
            </button>
          </div>
        </div>
      )}

      {/* TAHAP 2: REVIEW & EDIT DRAFT RANGKUMAN */}
      {hasGenerated && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-indigo-50 p-4 rounded-xl border border-indigo-200">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-indigo-900">Review Draft Rangkuman</h2>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200 font-semibold">
                  Model: {model || "free-tier"}
                </span>
              </div>
              <p className="text-xs text-indigo-700 mt-0.5">Periksa dan koreksi hasil rangkuman AI sebelum disimpan.</p>
            </div>
            <button 
              type="button"
              onClick={() => setHasGenerated(false)}
              className="text-xs px-3 py-1.5 bg-white text-gray-700 border border-indigo-200 rounded-lg hover:bg-gray-50 transition-colors font-medium self-start sm:self-auto shrink-0"
            >
              Kembali
            </button>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Judul Topik / Rangkuman</label>
              <input 
                type="text" 
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                value={generatedTitle}
                onChange={(e) => setGeneratedTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Konten Rangkuman</label>
              <textarea 
                className="w-full p-4 border border-gray-300 rounded-lg text-sm leading-relaxed focus:ring-2 focus:ring-indigo-500 outline-none"
                rows={15}
                value={generatedContent}
                onChange={(e) => setGeneratedContent(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row justify-end gap-3">
            <button 
              type="button"
              onClick={() => setHasGenerated(false)}
              className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
            >
              Batal
            </button>
            <button 
              type="button"
              onClick={handleSave} 
              disabled={isSaving}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-lg">
                {isSaving ? "sync" : "save"}
              </span>
              <span>{isSaving ? "Menyimpan Rangkuman..." : "Simpan Rangkuman"}</span>
            </button>
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
              Rangkuman Tersimpan!
            </h3>
            <p className="text-xs text-gray-600 mb-6 leading-relaxed">
              Rangkuman materi telah berhasil ditambahkan. Anda dapat membuat kuis AI berdasarkan rangkuman ini.
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

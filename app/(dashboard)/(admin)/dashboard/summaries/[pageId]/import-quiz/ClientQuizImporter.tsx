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
  const [questionType, setQuestionType] = useState<"PILIHAN_GANDA" | "ESSAY" | "CODE_CHALLENGE">("PILIHAN_GANDA");
  const [variantName, setVariantName] = useState(`Paket Import JSON - ${new Date().toLocaleDateString('id-ID')}`);
  const [jsonString, setJsonString] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const [activeTemplateTab, setActiveTemplateTab] = useState<"MCQ" | "ESSAY" | "HTML" | "SQL" | "PHP_LOGIC" | "PHP_WEB">("MCQ");
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
    "questionText": "Jelaskan fungsi utama tag <div> dalam struktur tata letak web HTML!"
  }
]`;

  const exampleHtml = `[
  {
    "questionText": "Buatlah kartu profil biodata siswa SMK dengan border, padding rapi, dan tombol interaktif menggunakan HTML & CSS.",
    "questionType": "CODE_CHALLENGE",
    "codeLanguage": "html",
    "points": 20,
    "initialCode": "<!DOCTYPE html>\\n<html>\\n<head>\\n  <style>\\n    body { font-family: sans-serif; background: #f8fafc; padding: 20px; }\\n    .card { background: white; border: 2px solid #000; border-radius: 8px; padding: 16px; max-width: 360px; }\\n  </style>\\n</head>\\n<body>\\n  <div class=\\"card\\">\\n    <h2>Profil Siswa</h2>\\n    <!-- Tulis kode HTML kamu di sini -->\\n  </div>\\n</body>\\n</html>",
    "solutionCode": "<!DOCTYPE html>\\n<html>\\n<head>\\n  <style>\\n    body { font-family: sans-serif; background: #f8fafc; padding: 20px; }\\n    .card { background: white; border: 2px solid #000; border-radius: 8px; padding: 16px; max-width: 360px; }\\n  </style>\\n</head>\\n<body>\\n  <div class=\\"card\\">\\n    <h2>Ahmad Fauzi</h2>\\n    <p>Jurusan: RPL</p>\\n  </div>\\n</body>\\n</html>",
    "testCases": []
  }
]`;

  const exampleSql = `[
  {
    "questionText": "Tampilkan nama produk dan stok dari tabel inventaris_lab yang kondisinya 'Baik' dan stoknya lebih dari 5 unit.",
    "questionType": "CODE_CHALLENGE",
    "codeLanguage": "sql",
    "points": 20,
    "initialCode": "CREATE TABLE inventaris_lab (\\n  id INT PRIMARY KEY,\\n  nama_perangkat VARCHAR(100),\\n  kondisi VARCHAR(20),\\n  stok INT\\n);\\n\\nINSERT INTO inventaris_lab VALUES\\n(1, 'Router MikroTik', 'Baik', 10),\\n(2, 'Switch Cisco', 'Rusak', 3);",
    "solutionCode": "SELECT nama_perangkat, stok FROM inventaris_lab WHERE kondisi = 'Baik' AND stok > 5;",
    "testCases": [
      {
        "id": 1,
        "name": "Cek Output Kueri",
        "type": "QUERY_OUTPUT_CHECK",
        "description": "Memastikan data kondisi baik dengan stok > 5 tampil",
        "query": "SELECT nama_perangkat, stok FROM inventaris_lab WHERE kondisi = 'Baik' AND stok > 5;",
        "expected_columns": ["nama_perangkat", "stok"],
        "expected_min_rows": 1
      }
    ]
  }
]`;

  const examplePhpLogic = `[
  {
    "questionText": "Buatlah fungsi hitungDiskon($total, $persen) yang mengembalikan total harga setelah dipotong diskon.",
    "questionType": "CODE_CHALLENGE",
    "codeLanguage": "php",
    "points": 20,
    "initialCode": "<?php\\nfunction hitungDiskon($total, $persen) {\\n    // Tulis rumus perhitungan di sini\\n}\\n?>",
    "solutionCode": "<?php\\nfunction hitungDiskon($total, $persen) {\\n    return $total - ($total * ($persen / 100));\\n}\\n?>",
    "testCases": [
      { "judul": "Wajib buat fungsi hitungDiskon", "tipe": "CODE_ANALYSIS", "containsKeyword": "function hitungDiskon", "bobot": 30 },
      { "judul": "Uji hitungDiskon(100000, 10)", "tipe": "FUNCTION_CALL", "callCode": "echo hitungDiskon(100000, 10);", "expectedOutput": "90000", "bobot": 70 }
    ]
  }
]`;

  const examplePhpWeb = `[
  {
    "questionText": "Buat kartu biodata siswa dengan menyisipkan variabel PHP $nama dan $nilai ke dalam HTML.",
    "questionType": "CODE_CHALLENGE",
    "codeLanguage": "php",
    "points": 20,
    "initialCode": "<?php\\n$nama = \\"Budi Santoso\\";\\n$nilai = 88;\\n?>\\n<!DOCTYPE html>\\n<html>\\n<body>\\n  <div class=\\"card\\">\\n    <!-- Tampilkan nama dan nilai menggunakan echo -->\\n  </div>\\n</body>\\n</html>",
    "solutionCode": "<?php\\n$nama = \\"Budi Santoso\\";\\n$nilai = 88;\\n?>\\n<!DOCTYPE html>\\n<html>\\n<body>\\n  <div class=\\"card\\">\\n    <h2><?= $nama ?></h2>\\n    <p>Nilai: <?= $nilai ?></p>\\n  </div>\\n</body>\\n</html>",
    "testCases": []
  }
]`;

  const handleImport = async () => {
    setErrorMsg("");
    
    if (!jsonString.trim()) {
      setErrorMsg("Format JSON tidak boleh kosong. Silakan paste array JSON soal.");
      return;
    }

    let parsedQuestions: any = null;
    try {
      const parsed = JSON.parse(jsonString.trim());
      if (Array.isArray(parsed)) {
        parsedQuestions = parsed;
      } else if (parsed && Array.isArray(parsed.questions)) {
        parsedQuestions = parsed.questions;
      }
    } catch {
      setErrorMsg("Format JSON tidak valid. Pastikan sintaks benar (periksa tanda kurung siku, kutip ganda, dan koma).");
      return;
    }

    if (!Array.isArray(parsedQuestions)) {
      setErrorMsg("Data JSON harus berupa Array soal [ { ... } ] atau objek { \"questions\": [ { ... } ] }.");
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

      <div className="p-5 sm:p-6 bg-white border border-gray-200 rounded-xl shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Konfigurasi & Input Data JSON</h2>
            <p className="text-xs text-gray-500 mt-0.5">Masukkan data soal dalam format array JSON terstruktur hasil dari AI atau generator manual.</p>
          </div>
          <button 
            type="button"
            onClick={() => setShowExample(!showExample)}
            className="text-xs px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors font-medium flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">
              {showExample ? "visibility_off" : "visibility"}
            </span>
            <span>{showExample ? "Sembunyikan Contoh" : "Lihat Contoh Format JSON"}</span>
          </button>
        </div>
        
        {showExample && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
            <div className="flex flex-wrap gap-1.5 border-b border-gray-200 pb-2">
              <button
                type="button"
                onClick={() => setActiveTemplateTab("MCQ")}
                className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-colors ${
                  activeTemplateTab === "MCQ" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                Pilihan Ganda
              </button>
              <button
                type="button"
                onClick={() => setActiveTemplateTab("ESSAY")}
                className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-colors ${
                  activeTemplateTab === "ESSAY" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                Esai
              </button>
              <button
                type="button"
                onClick={() => setActiveTemplateTab("HTML")}
                className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-colors ${
                  activeTemplateTab === "HTML" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                HTML/CSS/JS (Web)
              </button>
              <button
                type="button"
                onClick={() => setActiveTemplateTab("SQL")}
                className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-colors ${
                  activeTemplateTab === "SQL" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                SQL / Database
              </button>
              <button
                type="button"
                onClick={() => setActiveTemplateTab("PHP_LOGIC")}
                className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-colors ${
                  activeTemplateTab === "PHP_LOGIC" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                PHP Logika (Auto)
              </button>
              <button
                type="button"
                onClick={() => setActiveTemplateTab("PHP_WEB")}
                className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-colors ${
                  activeTemplateTab === "PHP_WEB" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                PHP Web (Manual)
              </button>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] font-semibold text-gray-600">
                  Pratinjau JSON Template:
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const map: Record<string, string> = {
                      MCQ: exampleMCQ,
                      ESSAY: exampleEssay,
                      HTML: exampleHtml,
                      SQL: exampleSql,
                      PHP_LOGIC: examplePhpLogic,
                      PHP_WEB: examplePhpWeb,
                    };
                    setJsonString(map[activeTemplateTab]);
                  }}
                  className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                >
                  Gunakan Template Ini &darr;
                </button>
              </div>
              <pre className="p-3 bg-gray-900 text-emerald-400 rounded-lg overflow-x-auto text-[11px] font-mono leading-relaxed max-h-56">
                {activeTemplateTab === "MCQ" && exampleMCQ}
                {activeTemplateTab === "ESSAY" && exampleEssay}
                {activeTemplateTab === "HTML" && exampleHtml}
                {activeTemplateTab === "SQL" && exampleSql}
                {activeTemplateTab === "PHP_LOGIC" && examplePhpLogic}
                {activeTemplateTab === "PHP_WEB" && examplePhpWeb}
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
              placeholder="Contoh: Paket A - Soal Bab 1"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">Kategori Tipe Default</label>
            <select 
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition-shadow"
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value as any)}
            >
              <option value="PILIHAN_GANDA">Pilihan Ganda</option>
              <option value="ESSAY">Esai (Uraian)</option>
              <option value="CODE_CHALLENGE">Code Challenge (Praktik Koding)</option>
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
            className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-semibold disabled:opacity-50 shadow-xs cursor-pointer"
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
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-xs cursor-pointer"
            >
              Lihat Ringkasan & Kuis
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

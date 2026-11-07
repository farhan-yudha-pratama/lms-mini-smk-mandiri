'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { importQuestionsFromJsonAction } from '@/modules/ai-quiz/actions';

interface JsonQuestionImporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  quizVariantId: string;
  variantName?: string;
  hasStudentAttempts?: boolean;
  onSuccess?: () => void;
}

const TEMPLATE_SQL = `[
  {
    "questionText": "Tampilkan nama perangkat (nama_perangkat) dan jumlah stok (stok) dari tabel 'inventaris_lab' yang kondisinya 'Baik' dan stoknya lebih dari 5 unit.",
    "questionType": "CODE_CHALLENGE",
    "codeLanguage": "sql",
    "points": 20,
    "initialCode": "CREATE TABLE inventaris_lab (\\n    id INTEGER PRIMARY KEY AUTOINCREMENT,\\n    nama_perangkat VARCHAR(100) NOT NULL,\\n    kondisi VARCHAR(20) NOT NULL,\\n    stok INT NOT NULL\\n);\\n\\nINSERT INTO inventaris_lab (nama_perangkat, kondisi, stok) VALUES\\n('Router MikroTik RB951', 'Baik', 12),\\n('Switch Cisco 24 Port', 'Baik', 4),\\n('Kabel UTP Cat6 Roll', 'Baik', 2),\\n('Access Point TP-Link', 'Rusak', 3),\\n('Crimping Tool RJ45', 'Baik', 8);",
    "solutionCode": "SELECT nama_perangkat, stok FROM inventaris_lab WHERE kondisi = 'Baik' AND stok > 5;",
    "testCases": [
      {
        "id": 1,
        "name": "Verifikasi Filter Kondisi Baik & Stok > 5",
        "type": "QUERY_OUTPUT_CHECK",
        "description": "Memastikan data yang ditampilkan hanya perangkat Baik dengan stok > 5.",
        "query": "SELECT nama_perangkat, stok FROM inventaris_lab WHERE kondisi = 'Baik' AND stok > 5;",
        "expected_columns": ["nama_perangkat", "stok"],
        "expected_min_rows": 2
      }
    ]
  }
]`;

const TEMPLATE_MCQ = `[
  {
    "questionText": "Perintah SQL manakah yang digunakan untuk mengambil data dari tabel?",
    "questionType": "PILIHAN_GANDA",
    "points": 1,
    "options": [
      { "optionText": "SELECT", "isCorrect": true },
      { "optionText": "UPDATE", "isCorrect": false },
      { "optionText": "INSERT", "isCorrect": false },
      { "optionText": "DELETE", "isCorrect": false }
    ]
  }
]`;

const TEMPLATE_ESSAY = `[
  {
    "questionText": "Jelaskan perbedaan antara klausa WHERE dan klausa HAVING dalam query SQL!",
    "questionType": "ESSAY",
    "points": 10
  }
]`;

const TEMPLATE_PHP_MANUAL = `[
  {
    "questionText": "Buatlah halaman profil biodata siswa sederhana menggunakan PHP yang menampilkan Nama, NISN, Jurusan, dan status kelulusan dalam kartu HTML dengan styling CSS bersih.",
    "questionType": "CODE_CHALLENGE",
    "codeLanguage": "php",
    "points": 20,
    "initialCode": "<?php\\n// Variabel biodata siswa SMK\\n$nama = \\"Ahmad Fauzi\\";\\n$nisn = \\"0051234567\\";\\n$jurusan = \\"Teknik Komputer & Jaringan\\";\\n$status = \\"LULUS UJIAN KOMPETENSI\\";\\n?>\\n<!DOCTYPE html>\\n<html lang=\\"id\\">\\n<head>\\n  <meta charset=\\"UTF-8\\">\\n  <title>Profil Siswa</title>\\n  <style>\\n    body { font-family: sans-serif; background: #f8fafc; padding: 24px; }\\n    .card { background: white; border: 2px solid #000; border-radius: 12px; padding: 20px; max-width: 420px; box-shadow: 4px 4px 0 #000; }\\n    .badge { display: inline-block; padding: 4px 10px; background: #dcfce7; color: #166534; font-weight: bold; font-size: 12px; border-radius: 9999px; }\\n  </style>\\n</head>\\n<body>\\n  <div class=\\"card\\">\\n    <h2>Kartu Siswa SMK Mandiri</h2>\\n    <!-- Sisipkan variabel PHP menggunakan tag <?php echo $var; ?> -->\\n    <p><strong>Nama:</strong> <?php echo $nama; ?></p>\\n    <p><strong>NISN:</strong> <?php echo $nisn; ?></p>\\n    <p><strong>Jurusan:</strong> <?php echo $jurusan; ?></p>\\n    <div class=\\"badge\\"><?php echo $status; ?></div>\\n  </div>\\n</body>\\n</html>",
    "testCases": []
  }
]`;

const TEMPLATE_PHP_AUTO = `[
  {
    "questionText": "Buatlah fungsi PHP bernama hitungGajiBersih($gajiPokok, $tunjangan, $pajakPersen) yang mengembalikan total gaji bersih setelah ditambah tunjangan dan dipotong persentase pajak.",
    "questionType": "CODE_CHALLENGE",
    "codeLanguage": "php",
    "points": 25,
    "initialCode": "<?php\\n/**\\n * Menghitung gaji bersih karyawan\\n * @param int $gajiPokok\\n * @param int $tunjangan\\n * @param int $pajakPersen\\n * @return float\\n */\\nfunction hitungGajiBersih($gajiPokok, $tunjangan, $pajakPersen) {\\n    $totalKotor = $gajiPokok + $tunjangan;\\n    $potonganPajak = $totalKotor * ($pajakPersen / 100);\\n    return $totalKotor - $potonganPajak;\\n}\\n\\n// Uji coba lokal\\n$gaji = hitungGajiBersih(4000000, 1000000, 5);\\necho \\"Gaji Bersih: Rp \\" . number_format($gaji, 0, ',', '.') . \\"\\\\n\\";\\n?>",
    "testCases": [
      {
        "judul": "Output memuat teks 'Gaji Bersih'",
        "tipe": "OUTPUT_CONTAINS",
        "expectedContains": "Gaji Bersih: Rp 4.750.000",
        "bobot": 20
      },
      {
        "judul": "Wajib mendefinisikan fungsi hitungGajiBersih",
        "tipe": "CODE_ANALYSIS",
        "containsKeyword": "function hitungGajiBersih",
        "bobot": 20
      },
      {
        "judul": "Uji fungsi hitungGajiBersih(3000000, 0, 10) bernilai 2700000",
        "tipe": "FUNCTION_CALL",
        "callCode": "echo hitungGajiBersih(3000000, 0, 10);",
        "expectedOutput": "2700000",
        "bobot": 30
      },
      {
        "judul": "Uji fungsi hitungGajiBersih(5000000, 2000000, 0) bernilai 7000000",
        "tipe": "FUNCTION_CALL",
        "callCode": "echo hitungGajiBersih(5000000, 2000000, 0);",
        "expectedOutput": "7000000",
        "bobot": 30
      }
    ]
  }
]`;

export default function JsonQuestionImporterModal({
  isOpen,
  onClose,
  quizVariantId,
  variantName,
  hasStudentAttempts = false,
  onSuccess,
}: JsonQuestionImporterModalProps) {
  const router = useRouter();
  const [jsonText, setJsonText] = useState('');
  const [mode, setMode] = useState<'APPEND' | 'REPLACE'>('APPEND');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleImport = async () => {
    setErrorMsg('');
    setSuccessMsg('');

    if (!jsonText.trim()) {
      setErrorMsg('Teks JSON tidak boleh kosong. Silakan paste data soal.');
      return;
    }

    try {
      JSON.parse(jsonText.trim());
    } catch (e: any) {
      setErrorMsg('Format JSON tidak valid! Pastikan tanda kurung siku, kutip ganda, dan koma sudah benar.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await importQuestionsFromJsonAction({
        quizVariantId,
        jsonString: jsonText,
        mode,
      });

      if (!res.success) {
        setErrorMsg(res.message || 'Gagal mengimpor soal.');
      } else {
        setSuccessMsg(res.message || 'Berhasil mengimpor soal!');
        setTimeout(() => {
          onClose();
          if (onSuccess) onSuccess();
          router.refresh();
        }, 1200);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-emerald-100 text-emerald-700 rounded-lg material-symbols-outlined text-xl">
              data_object
            </span>
            <div>
              <h2 className="text-base font-bold text-gray-900 leading-tight">
                Import Soal Berdasarkan JSON
              </h2>
              <p className="text-xs text-gray-500">
                {variantName ? `Varian: ${variantName}` : 'Masukkan data soal dalam format array JSON'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 text-sm">
          {errorMsg && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-start gap-2">
              <span className="material-symbols-outlined text-base shrink-0 mt-0.5">error</span>
              <p className="flex-1 font-medium">{errorMsg}</p>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs flex items-start gap-2">
              <span className="material-symbols-outlined text-base shrink-0 mt-0.5">check_circle</span>
              <p className="flex-1 font-bold">{successMsg}</p>
            </div>
          )}

          {/* Quick Template Fill Buttons */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
              Template Format Cepat:
            </span>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={() => setJsonText(TEMPLATE_PHP_MANUAL)}
                className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-lg border border-indigo-200 transition-colors flex items-center gap-1 cursor-pointer"
                title="Template soal tantangan web layout PHP (dinilai manual oleh Guru)"
              >
                <span>PHP Web Tampilan (Manual)</span>
              </button>
              <button
                type="button"
                onClick={() => setJsonText(TEMPLATE_PHP_AUTO)}
                className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded-lg border border-emerald-200 transition-colors flex items-center gap-1 cursor-pointer"
                title="Template soal logika algoritma PHP (dinilai otomatis via Test Cases)"
              >
                <span>PHP Logika (Auto-Grading)</span>
              </button>
              <button
                type="button"
                onClick={() => setJsonText(TEMPLATE_SQL)}
                className="px-2.5 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 font-semibold rounded-lg border border-green-200 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Contoh SQL Code Challenge</span>
              </button>
              <button
                type="button"
                onClick={() => setJsonText(TEMPLATE_MCQ)}
                className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg border border-blue-200 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Contoh Pilihan Ganda</span>
              </button>
              <button
                type="button"
                onClick={() => setJsonText(TEMPLATE_ESSAY)}
                className="px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold rounded-lg border border-purple-200 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Contoh Essay</span>
              </button>
            </div>
          </div>

          {/* Mode Selector */}
          <div className="space-y-1.5 pt-1">
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
              Mode Penyimpanan:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <label className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer font-medium transition-colors ${
                mode === 'APPEND' ? 'bg-blue-50/70 border-blue-300 text-blue-900' : 'bg-white border-gray-200 text-gray-700'
              }`}>
                <input
                  type="radio"
                  name="importMode"
                  value="APPEND"
                  checked={mode === 'APPEND'}
                  onChange={() => setMode('APPEND')}
                  className="accent-blue-600"
                />
                <div>
                  <div className="font-bold">Tambahkan (Append)</div>
                  <div className="text-[11px] text-gray-500">Sisipkan ke bawah soal yang sudah ada</div>
                </div>
              </label>

              <label className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer font-medium transition-colors ${
                mode === 'REPLACE' ? 'bg-amber-50/70 border-amber-300 text-amber-900' : 'bg-white border-gray-200 text-gray-700'
              } ${hasStudentAttempts ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <input
                  type="radio"
                  name="importMode"
                  value="REPLACE"
                  checked={mode === 'REPLACE'}
                  disabled={hasStudentAttempts}
                  onChange={() => setMode('REPLACE')}
                  className="accent-amber-600"
                />
                <div>
                  <div className="font-bold">Gantikan Semua (Replace)</div>
                  <div className="text-[11px] text-gray-500">Hapus soal lama & isi dengan JSON ini</div>
                </div>
              </label>
            </div>
            {hasStudentAttempts && (
              <p className="text-[11px] text-amber-600 font-medium">
                ⚠️ Mode Replace dinonaktifkan karena varian ini sudah pernah dikerjakan oleh siswa.
              </p>
            )}
          </div>

          {/* JSON Textarea */}
          <div className="space-y-1 pt-1">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
              Paste JSON Data:
            </label>
            <textarea
              rows={10}
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              placeholder="Paste array JSON soal di sini (misal: [ { questionText: ..., ... } ])"
              className="w-full p-3 font-mono text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200 bg-gray-100 rounded-lg transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleImport}
            disabled={isSubmitting || !jsonText.trim()}
            className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                <span>Mengimpor...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm">publish</span>
                <span>Proses Import Soal</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

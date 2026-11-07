'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import AiQuestionGeneratorModal from '@/components/quiz/AiQuestionGeneratorModal';
import JsonQuestionImporterModal from '@/components/quiz/JsonQuestionImporterModal';
import {
  createQuestionAction,
  updateQuestionAction,
  deleteQuestionAction,
  reorderQuestionsAction
} from '@/modules/quiz/quiz.action';
import AdminModal, { AdminModalType } from '@/components/quiz/AdminModal';
import { DEFAULT_WEB_PROJECT, serializeProjectFiles } from '@/lib/virtual-fs';
import { DEFAULT_PHP_SCRIPT, DEFAULT_PHP_WEB_TEMPLATE, runPhpCode, runPhpTestCases } from '@/lib/virtual-php';

export interface QuestionTypeConfig {
  type: 'PILIHAN_GANDA' | 'ESSAY' | 'CODE_CHALLENGE';
  label: string;
  defaultPoints: number;
}

export const QUESTION_TYPES: QuestionTypeConfig[] = [
  {
    type: 'PILIHAN_GANDA',
    label: 'Pilihan Ganda',
    defaultPoints: 1,
  },
  {
    type: 'CODE_CHALLENGE',
    label: 'Code Challenge',
    defaultPoints: 20,
  },
  {
    type: 'ESSAY',
    label: 'Soal Essay',
    defaultPoints: 10,
  },
];

export const getQuestionTypeMeta = (type: string): QuestionTypeConfig => {
  const found = QUESTION_TYPES.find((qt) => qt.type === type);
  if (found) return found;
  return {
    type: type as any,
    label: type,
    defaultPoints: 1,
  };
};

type QuestionBankProps = {
  quizVariantId: string;
  variantName?: string;
  initialQuestions: any[];
  initialSummaryText?: string;
  hasStudentAttempts?: boolean;
  hasAiSummary?: boolean;
  summariesCount?: number;
  pageTitle?: string;
  pageId?: string;
  defaultModel?: string;
};

export default function QuestionBank({
  quizVariantId,
  variantName,
  initialQuestions,
  initialSummaryText = '',
  hasStudentAttempts = false,
  hasAiSummary = false,
  summariesCount = 0,
  pageTitle = '',
  pageId = '',
  defaultModel = 'free-tier',
}: QuestionBankProps) {
  const router = useRouter();
  const [questions, setQuestions] = useState(initialQuestions);

  useEffect(() => {
    setQuestions(initialQuestions);
  }, [initialQuestions]);

  const [showForm, setShowForm] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [formType, setFormType] = useState<'PILIHAN_GANDA' | 'ESSAY' | 'CODE_CHALLENGE'>('PILIHAN_GANDA');
  const [questionText, setQuestionText] = useState('');
  const [points, setPoints] = useState<number>(1);
  const [options, setOptions] = useState([{ text: '', isCorrect: true }, { text: '', isCorrect: false }]);
  const [codeLanguage, setCodeLanguage] = useState('html');
  const [initialCode, setInitialCode] = useState('');
  const [testCases, setTestCases] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [showJsonImportModal, setShowJsonImportModal] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const typeDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target as Node)) {
        setShowTypeDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: AdminModalType;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    isDestructive?: boolean;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
  });

  const showModal = (
    title: string,
    message: string,
    type: AdminModalType = 'info',
    options?: {
      confirmText?: string;
      cancelText?: string;
      onConfirm?: () => void;
      isDestructive?: boolean;
    }
  ) => {
    setModalState({
      isOpen: true,
      title,
      message,
      type,
      confirmText: options?.confirmText,
      cancelText: options?.cancelText,
      onConfirm: options?.onConfirm,
      isDestructive: options?.isDestructive,
    });
  };

  const closeModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  const totalPoints = questions.reduce((sum, q) => sum + (Number(q.points) || 0), 0);
  const pgCount = questions.filter(q => q.questionType === 'PILIHAN_GANDA').length;
  const codeChallengeCount = questions.filter(q => q.questionType === 'CODE_CHALLENGE').length;
  const essayCount = questions.filter(q => q.questionType === 'ESSAY').length;

  // State untuk expand/collapse detail soal Code Challenge di daftar pertanyaan
  const [expandedQuestionIds, setExpandedQuestionIds] = useState<Record<string, boolean>>({});
  const toggleExpandQuestion = (id: string) => {
    setExpandedQuestionIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // State dan Handler Uji Coba PHP Langsung di Form Guru
  const [testingPhpInForm, setTestingPhpInForm] = useState(false);
  const [phpFormTestResult, setPhpFormTestResult] = useState<{ output: any; testReport: any } | null>(null);

  const handleTestPhpInForm = async () => {
    if (!initialCode.trim()) return;
    setTestingPhpInForm(true);
    setPhpFormTestResult(null);
    try {
      const output = await runPhpCode(initialCode);
      let testReport = null;
      if (testCases && testCases.trim()) {
        try {
          const parsed = JSON.parse(testCases);
          if (Array.isArray(parsed) && parsed.length > 0) {
            testReport = await runPhpTestCases(initialCode, parsed);
          }
        } catch (tcErr) {
          console.warn('Test Cases JSON parsing error during test run:', tcErr);
        }
      }
      setPhpFormTestResult({ output, testReport });
    } catch (err: any) {
      setPhpFormTestResult({
        output: {
          success: false,
          stdout: '',
          stderr: err.message || 'Gagal mengeksekusi skrip PHP.',
          executionTimeMs: 0,
          isHtml: false
        },
        testReport: null
      });
    } finally {
      setTestingPhpInForm(false);
    }
  };

  // State dan Handler Uji Coba PHP Langsung pada Kartu Soal di Daftar
  const [testingCardId, setTestingCardId] = useState<string | null>(null);
  const [cardTestResults, setCardTestResults] = useState<Record<string, { output: any; testReport: any }>>({});

  const handleTestPhpCard = async (q: any) => {
    if (!q.initialCode) return;
    setTestingCardId(q.id);
    try {
      const output = await runPhpCode(q.initialCode);
      let testReport = null;
      if (q.testCases) {
        try {
          const parsed = typeof q.testCases === 'string' ? JSON.parse(q.testCases) : q.testCases;
          if (Array.isArray(parsed) && parsed.length > 0) {
            testReport = await runPhpTestCases(q.initialCode, parsed);
          }
        } catch {}
      }
      setCardTestResults(prev => ({ ...prev, [q.id]: { output, testReport } }));
    } catch (err: any) {
      setCardTestResults(prev => ({
        ...prev,
        [q.id]: {
          output: {
            success: false,
            stdout: '',
            stderr: err.message || 'Error eksekusi PHP',
            executionTimeMs: 0,
            isHtml: false
          },
          testReport: null
        }
      }));
    } finally {
      setTestingCardId(null);
    }
  };

  const handleOpenAdd = (type: string) => {
    const meta = getQuestionTypeMeta(type);
    setEditingQuestionId(null);
    setFormType(type as any);
    setQuestionText('');
    setPoints(meta.defaultPoints);
    setOptions([{ text: '', isCorrect: true }, { text: '', isCorrect: false }]);
    setCodeLanguage('html');
    setInitialCode(`<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <style>
    /* Tulis kode CSS di sini */
    body { font-family: sans-serif; padding: 20px; }
  </style>
</head>
<body>
  <!-- Tulis kode HTML di sini -->
  <h2 id="judul">Halo Dunia</h2>
  <button id="btnKlik">Klik Saya</button>

  <script>
    // Tulis kode JavaScript di sini
    document.getElementById('btnKlik').addEventListener('click', () => {
      document.getElementById('judul').innerText = 'JavaScript Berhasil Dijalankan!';
    });
  </script>
</body>
</html>`);
    setTestCases('');
    setShowForm(true);
  };

  const handleSwitchFormType = (newType: string) => {
    const meta = getQuestionTypeMeta(newType);
    setFormType(newType as any);
    if (!points || points === 1 || points === 10 || points === 20) {
      setPoints(meta.defaultPoints);
    }
  };


  const handleStartEdit = (q: any) => {
    setEditingQuestionId(q.id);
    setFormType(q.questionType);
    setQuestionText(q.questionText);
    setPoints(Number(q.points) || 1);

    if (q.questionType === 'PILIHAN_GANDA' && q.options && q.options.length > 0) {
      setOptions(q.options.map((o: any) => ({
        text: o.optionText,
        isCorrect: Boolean(o.isCorrect)
      })));
    } else {
      setOptions([{ text: '', isCorrect: true }, { text: '', isCorrect: false }]);
    }

    setCodeLanguage(q.codeLanguage || 'html');
    setInitialCode(q.initialCode || '');
    setTestCases(q.testCases || '');

    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingQuestionId(null);
    setQuestionText('');
    setPoints(1);
    setOptions([{ text: '', isCorrect: true }, { text: '', isCorrect: false }]);
  };

  const handleAddOption = () => {
    setOptions([...options, { text: '', isCorrect: false }]);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) return;
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index: number, text: string) => {
    const newOpts = [...options];
    newOpts[index].text = text;
    setOptions(newOpts);
  };

  const handleCorrectChange = (index: number) => {
    const newOpts = options.map((opt, i) => ({
      ...opt,
      isCorrect: i === index
    }));
    setOptions(newOpts);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!questionText.trim()) {
      showModal('Pertanyaan Kosong', 'Teks pertanyaan kuis wajib diisi.', 'warning');
      return;
    }

    if (formType === 'PILIHAN_GANDA') {
      const hasEmptyOpt = options.some(o => !o.text.trim());
      if (hasEmptyOpt) {
        showModal('Pilihan Jawaban Kosong', 'Semua kolom pilihan jawaban wajib diisi sebelum menyimpan.', 'warning');
        return;
      }
      const hasCorrect = options.some(o => o.isCorrect);
      if (!hasCorrect) {
        showModal('Kunci Jawaban Belum Dipilih', 'Silakan pilih salah satu opsi sebagai jawaban yang benar.', 'warning');
        return;
      }
    }

    setLoading(true);

    const data = {
      quizVariantId,
      questionText: questionText.trim(),
      questionType: formType,
      points: Number(points) || 1,
      options: formType === 'PILIHAN_GANDA' ? options.map((opt) => ({
        optionText: opt.text.trim(),
        isCorrect: opt.isCorrect
      })) : undefined,
      codeLanguage: formType === 'CODE_CHALLENGE' ? codeLanguage : null,
      initialCode: formType === 'CODE_CHALLENGE' ? initialCode : null,
      testCases: formType === 'CODE_CHALLENGE' ? testCases : null
    };

    let res;
    if (editingQuestionId) {
      res = await updateQuestionAction(editingQuestionId, data);
    } else {
      res = await createQuestionAction(data);
    }

    if (res.success) {
      handleCancelForm();
      router.refresh();
    } else {
      showModal('Gagal Menyimpan Soal', res.message || 'Terjadi kesalahan pada server saat menyimpan soal.', 'error');
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    showModal(
      'Hapus Soal',
      'Apakah Anda yakin ingin menghapus butir soal ini beserta seluruh opsi jawabannya? Tindakan ini tidak dapat dibatalkan.',
      'confirm',
      {
        confirmText: 'Hapus Soal',
        isDestructive: true,
        onConfirm: async () => {
          await deleteQuestionAction(id, quizVariantId);
          router.refresh();
        },
      }
    );
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === questions.length - 1) return;

    const newQuestions = [...questions];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    // Swap
    [newQuestions[index], newQuestions[targetIndex]] = [newQuestions[targetIndex], newQuestions[index]];
    setQuestions(newQuestions);

    const questionIds = newQuestions.map(q => q.id);
    await reorderQuestionsAction({ quizVariantId, questionIds });
  };

  const renderQuestionForm = (isInline = false) => (
    <form
      onSubmit={handleSubmit}
      className={`bg-white rounded-xl shadow-md p-4 sm:p-6 animate-fade-in ${
        isInline ? 'border-2 border-blue-500 mt-2' : 'border-2 border-blue-400 mt-6'
      }`}
    >
      <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4 flex-wrap gap-2">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
          <span className="material-symbols-outlined text-blue-600">
            {editingQuestionId ? 'edit_note' : 'add_circle'}
          </span>
          <span>{editingQuestionId ? 'Edit Butir Soal' : 'Tambah Soal Baru'}</span>
        </h3>

        {/* Dynamic Question Type Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-gray-500">Tipe Soal:</label>
          <select
            value={formType}
            onChange={(e) => handleSwitchFormType(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-gray-300 bg-white text-xs font-semibold text-gray-800 outline-none cursor-pointer hover:border-gray-400 transition-colors"
          >
            {QUESTION_TYPES.map((qt) => (
              <option key={qt.type} value={qt.type}>
                {qt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {/* Question Text */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">
            Teks Pertanyaan <span className="text-red-500">*</span>
          </label>
          <textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            required
            rows={3}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-colors"
            placeholder={formType === 'PILIHAN_GANDA' ? "Tuliskan pertanyaan pilihan ganda..." : "Tuliskan instruksi atau pertanyaan essay..."}
          />
        </div>

        {/* Bobot Poin */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">
            Bobot Poin Maksimal <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={points}
              onChange={(e) => setPoints(Number(e.target.value))}
              required
              min="1"
              className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-semibold"
            />
            <span className="text-xs text-gray-500">
              {formType === 'ESSAY' ? 'Poin maksimal yang dapat diberikan guru saat review' : 'Poin jika siswa menjawab benar'}
            </span>
          </div>
        </div>

        {/* ESSAY INSTRUCTION CALLOUT */}
        {formType === 'ESSAY' && (
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg text-sm text-purple-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-purple-800">
              <span>📝</span> Panduan Soal Essay:
            </div>
            <p className="text-xs text-purple-700 leading-relaxed">
              Soal essay tidak membutuhkan opsi pilihan ganda. Siswa akan disediakan kolom isian teks untuk menuliskan uraian jawabannya.
              Setelah kuis dikumpulkan, nilai essay akan <strong>di-review dan dinilai secara manual oleh Anda</strong> melalui halaman <strong>Laporan Kuis</strong>.
            </p>
          </div>
        )}

        {/* CODE CHALLENGE */}
        {formType === 'CODE_CHALLENGE' && (
          <div className="space-y-4 border-t border-gray-100 pt-4 mt-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Bahasa Pemrograman <span className="text-red-500">*</span>
              </label>
              <select
                value={codeLanguage}
                onChange={(e) => setCodeLanguage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm font-semibold"
              >
                <option value="html">HTML, CSS & JavaScript (Live Web Preview)</option>
                <option value="javascript">JavaScript (Unit Testing)</option>
                <option value="sql">SQL (Simulasi Database Interaktif - DDL/DML/Query)</option>
                <option value="php">PHP (Pemrograman Server-Side / CLI & Web Dinamis)</option>
              </select>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-bold text-gray-700">
                  Kode Awal (Initial Code)
                </label>
                {codeLanguage === 'html' && (
                  <button
                    type="button"
                    onClick={() => setInitialCode(serializeProjectFiles(DEFAULT_WEB_PROJECT))}
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                    title="Isi template standar multi-file (index.html, css/style.css, js/script.js)"
                  >
                    <span className="material-symbols-outlined text-sm">auto_fix_high</span>
                    Muat Template Multi-File (HTML, CSS, JS)
                  </button>
                )}
                {codeLanguage === 'sql' && (
                  <button
                    type="button"
                    onClick={() => {
                      setInitialCode(`-- Silakan tulis perintah SQL kamu di bawah ini
-- Pastikan setiap perintah diakhiri dengan titik koma (;)
`);
                      setTestCases(JSON.stringify([
                        {
                          "judul": "Tabel category dan product berhasil dibuat",
                          "tipe": "SCHEMA_CHECK",
                          "tables": ["category", "product"],
                          "bobot": 30
                        },
                        {
                          "judul": "Menampilkan data dari tabel product",
                          "tipe": "QUERY_OUTPUT_CHECK",
                          "expectedColumns": ["id", "name", "price", "category_id"],
                          "bobot": 40
                        },
                        {
                          "judul": "Satu data product dihapus (sisa 1)",
                          "tipe": "ROW_COUNT_CHECK",
                          "table": "product",
                          "expectedValue": 1,
                          "bobot": 30
                        }
                      ], null, 2));
                    }}
                    className="text-xs text-emerald-600 hover:text-emerald-800 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                    title="Isi template standar soal SQL (Category & Product DDL/DML/Query)"
                  >
                    <span className="material-symbols-outlined text-sm">auto_fix_high</span>
                    Muat Template Soal SQL (Product & Category)
                  </button>
                )}
                {codeLanguage === 'php' && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setInitialCode(DEFAULT_PHP_WEB_TEMPLATE);
                        setTestCases('');
                      }}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                      title="Isi template tampilan web PHP (dinilai manual oleh Guru via Live Preview)"
                    >
                      <span className="material-symbols-outlined text-sm">preview</span>
                      1. Template Web Tampilan (Manual)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setInitialCode(`<?php
// Buat fungsi hitungDiskon($total, $persen) untuk menghitung harga setelah diskon
function hitungDiskon($total, $persen) {
    // Tulis kode perhitungan kamu di sini
    return $total - ($total * ($persen / 100));
}

// Uji coba lokal
$belanja = 100000;
$bayar = hitungDiskon($belanja, 10);
echo "Total Belanja: Rp " . $belanja . "\\n";
echo "Total Bayar: Rp " . $bayar . "\\n";
?>`);
                        setTestCases(JSON.stringify([
                          {
                            "judul": "Output memuat rincian total belanja",
                            "tipe": "OUTPUT_CONTAINS",
                            "expectedContains": "Total Belanja: Rp 100000",
                            "bobot": 20
                          },
                          {
                            "judul": "Output memuat total bayar setelah diskon 10%",
                            "tipe": "OUTPUT_CONTAINS",
                            "expectedContains": "Total Bayar: Rp 90000",
                            "bobot": 30
                          },
                          {
                            "judul": "Wajib mendefinisikan fungsi hitungDiskon",
                            "tipe": "CODE_ANALYSIS",
                            "containsKeyword": "function hitungDiskon",
                            "bobot": 20
                          },
                          {
                            "judul": "Uji fungsi hitungDiskon(50000, 20) menghasilkan 40000",
                            "tipe": "FUNCTION_CALL",
                            "callCode": "echo hitungDiskon(50000, 20);",
                            "expectedOutput": "40000",
                            "bobot": 30
                          }
                        ], null, 2));
                      }}
                      className="text-xs text-emerald-600 hover:text-emerald-800 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                      title="Isi template logika algoritma PHP (dinilai otomatis via Test Cases)"
                    >
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      2. Template Logika (Auto-Grading)
                    </button>
                  </div>
                )}
              </div>
              <textarea
                value={initialCode}
                onChange={(e) => setInitialCode(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm font-mono"
                placeholder="Masukkan kode awal (kerangka) atau JSON proyek virtual. Kosongkan untuk menggunakan template default..."
              />
              {codeLanguage === 'html' && (
                <p className="text-[11px] text-gray-500 mt-1">
                  💡 <strong>Tips:</strong> Siswa akan mendapatkan struktur multi-file dan folder explorer secara otomatis.
                </p>
              )}
              {codeLanguage === 'sql' && (
                <p className="text-[11px] text-gray-500 mt-1">
                  💡 <strong>Tips:</strong> Siswa akan mendapatkan Terminal MySQL virtual interaktif dan live Data Grid untuk melihat hasil query.
                </p>
              )}
              {codeLanguage === 'php' && (
                <p className="text-[11px] text-gray-500 mt-1">
                  💡 <strong>Tips:</strong> Siswa akan mendapatkan Interactive PHP Terminal dan Live Web Preview untuk menguji kode PHP mereka.
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Test Cases (Format JSON) - Otomatis Menguji Jawaban Siswa
              </label>
              <textarea
                value={testCases}
                onChange={(e) => setTestCases(e.target.value)}
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm font-mono"
                placeholder={'Contoh: [{"judul": "Tabel dibuat", "tipe": "SCHEMA_CHECK", "tables": ["siswa"], "bobot": 50}]'}
              />
              {codeLanguage === 'sql' && (
                <p className="text-[11px] text-gray-500 mt-1">
                  💡 Format Test Cases SQL mendukung tipe <code>SCHEMA_CHECK</code> (cek tabel), <code>ROW_COUNT_CHECK</code> (cek jumlah data), dan <code>QUERY_OUTPUT_CHECK</code> (cek kolom/data SELECT).
                </p>
              )}
              {codeLanguage === 'php' && (
                <p className="text-[11px] text-gray-500 mt-1">
                  💡 <strong>Catatan Penilaian:</strong> Jika hanya untuk <strong>Tampilan Web</strong> (layout HTML), kosongkan kolom Test Cases agar dinilai manual oleh Guru. Jika ada pengujian logika/fungsi tertentu, isi Test Cases (tipe <code>OUTPUT_CONTAINS</code>, <code>CODE_ANALYSIS</code>, <code>FUNCTION_CALL</code>) untuk penilaian otomatis.
                </p>
              )}

              {/* UJI COBA RUNTIME PHP DI DALAM FORM ADMIN */}
              {codeLanguage === 'php' && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handleTestPhpInForm}
                      disabled={testingPhpInForm || !initialCode.trim()}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                      title="Jalankan skrip PHP dan uji test cases menggunakan WebAssembly Runtime"
                    >
                      <span className="material-symbols-outlined text-sm">
                        {testingPhpInForm ? 'sync' : 'play_arrow'}
                      </span>
                      <span>{testingPhpInForm ? 'Menjalankan PHP WASM...' : 'Uji Coba Skrip & Test Cases'}</span>
                    </button>

                    {phpFormTestResult && (
                      <button
                        type="button"
                        onClick={() => setPhpFormTestResult(null)}
                        className="text-xs text-gray-500 hover:text-gray-700 underline cursor-pointer"
                      >
                        Tutup Hasil Uji
                      </button>
                    )}
                  </div>

                  {phpFormTestResult && (
                    <div className="mt-3 p-3.5 bg-gray-900 text-gray-100 rounded-xl text-xs font-mono space-y-3 border border-gray-800 animate-in fade-in">
                      <div className="flex items-center justify-between pb-2 border-b border-gray-800 text-[11px] text-gray-400">
                        <span className="font-bold text-emerald-400 flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">terminal</span>
                          <span>Hasil Eksekusi PHP WASM Runtime</span>
                        </span>
                        <span>{phpFormTestResult.output.executionTimeMs} ms</span>
                      </div>

                      {phpFormTestResult.output.error && (
                        <div className="p-2.5 bg-red-950/80 border border-red-800 rounded-lg text-red-200">
                          <div className="font-bold text-red-400 flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">error</span>
                            <span>{phpFormTestResult.output.error.message}</span>
                          </div>
                          {phpFormTestResult.output.error.hint && (
                            <p className="mt-1 text-[11px] text-red-300">
                              💡 {phpFormTestResult.output.error.hint}
                            </p>
                          )}
                        </div>
                      )}

                      {phpFormTestResult.output.stdout && (
                        <div>
                          <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">STDOUT:</span>
                          <pre className="whitespace-pre-wrap text-emerald-300 bg-black/40 p-2.5 rounded-lg max-h-40 overflow-y-auto">
                            {phpFormTestResult.output.stdout}
                          </pre>
                        </div>
                      )}

                      {phpFormTestResult.output.isHtml && (
                        <div>
                          <span className="text-[10px] text-indigo-400 uppercase tracking-wider block mb-1">Web Preview Render:</span>
                          <div className="bg-white rounded-lg p-2 border border-gray-700 overflow-hidden">
                            <iframe
                              srcDoc={phpFormTestResult.output.stdout}
                              sandbox="allow-scripts"
                              title="PHP Web Preview"
                              className="w-full h-36 border-0 rounded bg-white"
                            />
                          </div>
                        </div>
                      )}

                      {phpFormTestResult.testReport && (
                        <div className="pt-2 border-t border-gray-800 space-y-1.5">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-yellow-300">Hasil Evaluasi Test Cases:</span>
                            <span className="font-bold text-emerald-400">
                              {phpFormTestResult.testReport.passedCount} / {phpFormTestResult.testReport.totalCount} Passed ({phpFormTestResult.testReport.totalPoints} / {phpFormTestResult.testReport.maxPoints} Poin)
                            </span>
                          </div>
                          <div className="space-y-1">
                            {phpFormTestResult.testReport.results.map((r: any, rIdx: number) => (
                              <div key={rIdx} className={`p-1.5 rounded flex items-center justify-between text-[11px] ${
                                r.passed ? 'bg-emerald-950/60 text-emerald-300' : 'bg-red-950/60 text-red-300'
                              }`}>
                                <div className="flex items-center gap-1.5">
                                  <span>{r.passed ? '✅' : '❌'}</span>
                                  <span>{r.description}</span>
                                </div>
                                <span className="font-bold">{r.points} / {r.maxPoints} pt</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* PILIHAN GANDA OPTIONS */}
        {formType === 'PILIHAN_GANDA' && (
          <div className="pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-bold text-gray-700">
                Pilihan Jawaban <span className="text-xs font-normal text-gray-500">(Pilih salah satu lingkaran untuk jawaban yang benar)</span>
              </label>
              <button
                type="button"
                onClick={handleAddOption}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
              >
                + Tambah Opsi
              </button>
            </div>

            <div className="space-y-3">
              {options.map((opt, index) => (
                <div key={index} className="flex items-center gap-3">
                  <label className="flex items-center gap-1 cursor-pointer shrink-0" title="Tandai sebagai jawaban benar">
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={opt.isCorrect}
                      onChange={() => handleCorrectChange(index)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="font-bold text-sm text-gray-600 w-5">
                      {String.fromCharCode(65 + index)}.
                    </span>
                  </label>
                  <input
                    type="text"
                    value={opt.text}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    required
                    placeholder={`Teks pilihan ${String.fromCharCode(65 + index)}...`}
                    className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm ${
                      opt.isCorrect ? 'border-emerald-400 bg-emerald-50/40' : 'border-gray-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(index)}
                    disabled={options.length <= 2}
                    className="text-red-500 hover:text-red-700 disabled:opacity-20 p-2 text-sm cursor-pointer"
                    title="Hapus opsi ini"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={handleCancelForm}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-300 transition-colors cursor-pointer"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`px-5 py-2 text-sm font-bold text-white rounded-lg transition-colors disabled:opacity-50 cursor-pointer ${
            formType === 'CODE_CHALLENGE'
              ? 'bg-green-600 hover:bg-green-700'
              : formType === 'ESSAY'
              ? 'bg-purple-600 hover:bg-purple-700'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Menyimpan...' : editingQuestionId ? 'Perbarui Soal' : 'Simpan Soal'}
        </button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      {/* STATS & AI SHORTCUT BAR */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3 bg-gray-50 p-3 sm:p-4 rounded-xl border border-gray-200 flex-1">
          <div>
            <div className="text-xs text-gray-500 font-medium">Total Soal</div>
            <div className="text-xl font-bold text-gray-900">{questions.length}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium">Pilihan Ganda</div>
            <div className="text-xl font-bold text-blue-600">{pgCount}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium">Code Challenge</div>
            <div className="text-xl font-bold text-emerald-600">{codeChallengeCount}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium">Essay (Manual)</div>
            <div className="text-xl font-bold text-purple-600">{essayCount}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium">Total Poin</div>
            <div className="text-xl font-bold text-gray-900">{totalPoints}</div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowAiModal(true)}
          className="px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-2xs transition-all flex items-center justify-center gap-2 shrink-0 min-h-[44px]"
          title="Buat soal secara otomatis menggunakan AI"
        >
          <span>Generate Soal AI</span>
        </button>
      </div>

      {/* QUESTION LIST */}
      {questions.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl p-6 text-gray-500">
          <p className="font-semibold text-base text-gray-700 mb-1">Belum ada pertanyaan pada varian ini</p>
          <p className="text-xs text-gray-500">Silakan tambahkan soal Pilihan Ganda atau Soal Essay di bawah.</p>
        </div>
      ) : (
        questions.map((q, index) => (
          <div key={q.id} className="space-y-3">
            <div
              className={`bg-white rounded-xl border p-4 sm:p-5 shadow-sm transition-all ${
                editingQuestionId === q.id
                  ? 'ring-2 ring-blue-500 border-blue-400 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
            <div className="flex justify-between items-start mb-3">
              <div className="flex gap-4">
                <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
                  <button
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    className="text-gray-400 hover:text-blue-600 disabled:opacity-20 transition-colors text-xs"
                    title="Pindah ke atas"
                  >
                    ▲
                  </button>
                  <span className="text-xs font-bold text-gray-700 bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center">
                    {index + 1}
                  </span>
                  <button
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === questions.length - 1}
                    className="text-gray-400 hover:text-blue-600 disabled:opacity-20 transition-colors text-xs"
                    title="Pindah ke bawah"
                  >
                    ▼
                  </button>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {(() => {
                      const meta = getQuestionTypeMeta(q.questionType);
                      const colorClass =
                        q.questionType === 'CODE_CHALLENGE'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : q.questionType === 'ESSAY'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200';
                      return (
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full border ${colorClass}`}
                        >
                          {meta.label}
                          {q.questionType === 'CODE_CHALLENGE' && q.codeLanguage && ` (${q.codeLanguage.toUpperCase()})`}
                        </span>
                      );
                    })()}
                    <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-full border border-gray-200">
                      {q.points} Poin
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-gray-900 whitespace-pre-wrap leading-relaxed">
                    {q.questionText}
                  </h3>
                </div>
              </div>

              {/* ACTION BUTTONS (EDIT & HAPUS) */}
              <div className="flex items-center gap-2 shrink-0 ml-3">
                <button
                  type="button"
                  onClick={() => handleStartEdit(q)}
                  className="px-2.5 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded border border-blue-200 transition-colors"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(q.id)}
                  className="px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded border border-red-200 transition-colors"
                >
                  Hapus
                </button>
              </div>
            </div>

            {/* Pilihan Ganda Options Display */}
            {q.questionType === 'PILIHAN_GANDA' && (
              <div className="ml-10 mt-3 space-y-2">
                {q.options?.map((opt: any, i: number) => (
                  <div
                    key={opt.id || i}
                    className={`p-2.5 rounded-lg border text-sm flex items-center justify-between ${opt.isCorrect
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-medium'
                      : 'bg-gray-50 border-gray-200 text-gray-700'
                      }`}
                  >
                    <div>
                      <span className="font-bold mr-2">{String.fromCharCode(65 + i)}.</span>
                      <span>{opt.optionText}</span>
                    </div>
                    {opt.isCorrect && (
                      <span className="shrink-0 text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        Kunci Jawaban
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Essay Info Box */}
            {q.questionType === 'ESSAY' && (
              <div className="ml-10 mt-3 p-3 bg-purple-50/70 border border-purple-200 rounded-lg text-xs text-purple-900 flex items-start gap-2">
                <span className="font-bold text-sm">ℹ️</span>
                <div>
                  <span className="font-semibold">Soal Essay:</span> Siswa akan menjawab dengan uraian teks bebas. Jawaban ini akan di-review dan dinilai secara manual oleh guru melalui menu <strong>Laporan Kuis</strong>.
                </div>
              </div>
            )}

            {/* Code Challenge Info Box & Interactive Details */}
            {q.questionType === 'CODE_CHALLENGE' && (() => {
              let parsedTestCases: any[] = [];
              if (q.testCases) {
                if (Array.isArray(q.testCases)) parsedTestCases = q.testCases;
                else {
                  try {
                    const parsed = JSON.parse(q.testCases);
                    if (Array.isArray(parsed)) parsedTestCases = parsed;
                  } catch {}
                }
              }
              const isPhp = q.codeLanguage === 'php';
              const isSql = q.codeLanguage === 'sql';
              const hasTestCases = parsedTestCases.length > 0;
              const isExpanded = Boolean(expandedQuestionIds[q.id]);
              const cardResult = cardTestResults[q.id];

              return (
                <div className="ml-10 mt-3 space-y-2">
                  <div className={`p-3 rounded-lg border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                    hasTestCases 
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' 
                      : 'bg-amber-50/70 border-amber-200 text-amber-950'
                  }`}>
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-sm shrink-0">
                        {hasTestCases ? '🤖' : '👁️'}
                      </span>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold">
                            {hasTestCases ? 'Penilaian Otomatis (Auto-Grading)' : 'Penilaian Manual Guru (Review Web / Kode)'}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                            hasTestCases 
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                              : 'bg-amber-100 text-amber-800 border-amber-300'
                          }`}>
                            {hasTestCases ? `${parsedTestCases.length} Test Case Aktif` : '0 Test Case (Review Manual)'}
                          </span>
                        </div>
                        <p className="mt-0.5 text-gray-600">
                          {isPhp && (
                            hasTestCases
                              ? 'Jawaban dievaluasi otomatis via WebAssembly PHP Test Runner (Output & Fungsi).'
                              : 'Fokus pada desain tampilan / antarmuka web PHP. Guru menguji dan memberi skor secara manual di Laporan Kuis.'
                          )}
                          {isSql && 'Simulasi database virtual (DDL/DML/Query). Siswa mendapatkan SQLite virtual.'}
                          {!isPhp && !isSql && 'Siswa mengerjakan proyek kode di Monaco Editor.'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                      {isPhp && q.initialCode && (
                        <button
                          type="button"
                          onClick={() => handleTestPhpCard(q)}
                          disabled={testingCardId === q.id}
                          className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-white hover:bg-emerald-100 rounded border border-emerald-300 transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                          title="Uji eksekusi kode awal menggunakan runtime PHP WASM"
                        >
                          <span className="material-symbols-outlined text-xs">
                            {testingCardId === q.id ? 'sync' : 'play_arrow'}
                          </span>
                          <span>{testingCardId === q.id ? 'Menguji...' : 'Uji Kode Awal'}</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => toggleExpandQuestion(q.id)}
                        className="px-2.5 py-1 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-100 rounded border border-gray-300 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-xs">
                          {isExpanded ? 'expand_less' : 'code'}
                        </span>
                        <span>{isExpanded ? 'Tutup Detail' : 'Lihat Detail'}</span>
                      </button>
                    </div>
                  </div>

                  {/* HASIL UJI COBA KARTU PHP */}
                  {cardResult && (
                    <div className="p-3 bg-gray-900 text-gray-100 rounded-lg text-xs font-mono space-y-2 animate-in fade-in">
                      <div className="flex items-center justify-between border-b border-gray-800 pb-1 text-[11px] text-gray-400">
                        <span className="font-bold text-gray-200">Output PHP Runtime (WASM):</span>
                        <span>{cardResult.output.executionTimeMs} ms</span>
                      </div>
                      {cardResult.output.stdout && (
                        <pre className="whitespace-pre-wrap text-emerald-400 max-h-36 overflow-y-auto">
                          {cardResult.output.stdout}
                        </pre>
                      )}
                      {cardResult.output.stderr && (
                        <pre className="whitespace-pre-wrap text-red-400 max-h-36 overflow-y-auto">
                          {cardResult.output.stderr}
                        </pre>
                      )}
                      {cardResult.testReport && (
                        <div className="pt-2 border-t border-gray-800 text-[11px]">
                          <span className="font-bold text-yellow-400">
                            Hasil Test Cases: {cardResult.testReport.passedCount} / {cardResult.testReport.totalCount} Passed ({cardResult.testReport.totalPoints} / {cardResult.testReport.maxPoints} Poin)
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* EXPANDABLE DETAIL (KODE AWAL & TEST CASES) */}
                  {isExpanded && (
                    <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-lg text-xs space-y-3 animate-in fade-in">
                      {q.initialCode && (
                        <div>
                          <div className="font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-xs">code</span>
                            <span>Kode Awal (Template Siswa):</span>
                          </div>
                          <pre className="p-2.5 bg-white border border-gray-200 rounded-lg font-mono text-[11px] text-gray-800 overflow-x-auto max-h-48">
                            {q.initialCode}
                          </pre>
                        </div>
                      )}

                      <div>
                        <div className="font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-xs">checklist</span>
                          <span>Daftar Test Cases ({parsedTestCases.length}):</span>
                        </div>
                        {hasTestCases ? (
                          <div className="space-y-1.5">
                            {parsedTestCases.map((tc: any, tcIdx: number) => (
                              <div key={tc.id || tcIdx} className="p-2 bg-white border border-gray-200 rounded text-[11px] flex items-center justify-between">
                                <div className="space-y-0.5">
                                  <div className="font-semibold text-gray-900">
                                    {tcIdx + 1}. {tc.judul || tc.name || tc.title || `Test Case #${tcIdx + 1}`}
                                  </div>
                                  <div className="text-[10px] text-gray-500 font-mono">
                                    Tipe: {tc.tipe || tc.type || 'OUTPUT_CONTAINS'} {tc.callCode ? `| Call: ${tc.callCode}` : ''}
                                  </div>
                                </div>
                                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                                  {tc.bobot || tc.points || 0} Poin
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 italic text-[11px]">
                            Tidak ada test cases. Soal ini akan dinilai secara manual oleh Guru (Mode Web Tampilan).
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
            </div>

            {/* FORM EDIT TEPAT DI BAWAH SOAL INI */}
            {showForm && editingQuestionId === q.id && (
              <div className="pl-2 sm:pl-8 border-l-4 border-blue-500 animate-in fade-in slide-in-from-top-2 duration-200">
                {renderQuestionForm(true)}
              </div>
            )}
          </div>
        ))
      )}

      {/* FORM TAMBAH SOAL BARU (HANYA JIKA BUKAN MODE EDIT) */}
      {showForm && !editingQuestionId && (
        <div className="mt-6 animate-in fade-in slide-in-from-top-2 duration-200">
          {renderQuestionForm(false)}
        </div>
      )}

      {/* ACTION BAR: SIMPLE & MINIMALIST */}
      {(!showForm || editingQuestionId) && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-white rounded-xl border border-gray-200 mt-6 shadow-2xs">
          <div className="text-xs font-medium text-gray-500">
            {questions.length} Butir Soal Terdaftar
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => setShowAiModal(true)}
              className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">auto_awesome</span>
              <span>Generate AI</span>
            </button>

            <button
              type="button"
              onClick={() => setShowJsonImportModal(true)}
              className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">upload_file</span>
              <span>Import JSON</span>
            </button>

            {/* Dropdown Menu Tipe Soal (Dynamic & Minimalist) */}
            <div className="relative" ref={typeDropdownRef}>
              <button
                type="button"
                onClick={() => setShowTypeDropdown((prev) => !prev)}
                className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
              >
                <span>+ Tambah Soal</span>
                <span className="material-symbols-outlined text-sm">
                  {showTypeDropdown ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {showTypeDropdown && (
                <div className="absolute right-0 bottom-full mb-1.5 w-44 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-30 animate-in fade-in zoom-in-95 duration-100">
                  {QUESTION_TYPES.map((qt) => (
                    <button
                      key={qt.type}
                      type="button"
                      onClick={() => {
                        setShowTypeDropdown(false);
                        handleOpenAdd(qt.type);
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer"
                    >
                      {qt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* AI QUESTION GENERATOR MODAL */}
      <AiQuestionGeneratorModal
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
        quizVariantId={quizVariantId}
        variantName={variantName || 'Varian Kuis'}
        initialSummaryText={initialSummaryText}
        hasStudentAttempts={hasStudentAttempts}
        hasAiSummary={hasAiSummary}
        summariesCount={summariesCount}
        pageTitle={pageTitle}
        pageId={pageId}
        existingQuestionsCount={questions.length}
        defaultModel={defaultModel}
      />

      {/* JSON QUESTION IMPORTER MODAL */}
      <JsonQuestionImporterModal
        isOpen={showJsonImportModal}
        onClose={() => setShowJsonImportModal(false)}
        quizVariantId={quizVariantId}
        variantName={variantName || 'Varian Kuis'}
        hasStudentAttempts={hasStudentAttempts}
        onSuccess={() => {
          router.refresh();
        }}
      />

      {/* ADMIN POP-UP MODAL */}
      <AdminModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        confirmText={modalState.confirmText}
        cancelText={modalState.cancelText}
        onConfirm={modalState.onConfirm}
        isDestructive={modalState.isDestructive}
      />
    </div>
  );
}


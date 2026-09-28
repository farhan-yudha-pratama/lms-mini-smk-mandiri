'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  createQuestionAction, 
  updateQuestionAction, 
  deleteQuestionAction, 
  reorderQuestionsAction 
} from '@/modules/quiz/quiz.action';

type QuestionBankProps = {
  quizVariantId: string;
  initialQuestions: any[];
};

export default function QuestionBank({ quizVariantId, initialQuestions }: QuestionBankProps) {
  const router = useRouter();
  const [questions, setQuestions] = useState(initialQuestions);

  useEffect(() => {
    setQuestions(initialQuestions);
  }, [initialQuestions]);
  
  const [showForm, setShowForm] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [formType, setFormType] = useState<'PILIHAN_GANDA' | 'ESSAY'>('PILIHAN_GANDA');
  const [questionText, setQuestionText] = useState('');
  const [points, setPoints] = useState<number>(1);
  const [options, setOptions] = useState([{ text: '', isCorrect: true }, { text: '', isCorrect: false }]);
  const [loading, setLoading] = useState(false);

  const totalPoints = questions.reduce((sum, q) => sum + (Number(q.points) || 0), 0);
  const pgCount = questions.filter(q => q.questionType === 'PILIHAN_GANDA').length;
  const essayCount = questions.filter(q => q.questionType === 'ESSAY').length;

  const handleOpenAdd = (type: 'PILIHAN_GANDA' | 'ESSAY') => {
    setEditingQuestionId(null);
    setFormType(type);
    setQuestionText('');
    setPoints(type === 'ESSAY' ? 10 : 1);
    setOptions([{ text: '', isCorrect: true }, { text: '', isCorrect: false }]);
    setShowForm(true);
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
      alert('Pertanyaan wajib diisi');
      return;
    }

    if (formType === 'PILIHAN_GANDA') {
      const hasEmptyOpt = options.some(o => !o.text.trim());
      if (hasEmptyOpt) {
        alert('Semua pilihan jawaban wajib diisi');
        return;
      }
      const hasCorrect = options.some(o => o.isCorrect);
      if (!hasCorrect) {
        alert('Pilih salah satu jawaban yang benar');
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
      })) : undefined
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
      alert(res.message || 'Gagal menyimpan soal');
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus soal ini?')) return;
    await deleteQuestionAction(id, quizVariantId);
    router.refresh();
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

  return (
    <div className="space-y-6">
      {/* STATS BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
        <div>
          <div className="text-xs text-gray-500 font-medium">Total Soal</div>
          <div className="text-xl font-bold text-gray-900">{questions.length}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 font-medium">Pilihan Ganda</div>
          <div className="text-xl font-bold text-blue-600">{pgCount}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 font-medium">Essay (Manual)</div>
          <div className="text-xl font-bold text-purple-600">{essayCount}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 font-medium">Total Poin</div>
          <div className="text-xl font-bold text-emerald-600">{totalPoints}</div>
        </div>
      </div>

      {/* QUESTION LIST */}
      {questions.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl p-6 text-gray-500">
          <p className="font-semibold text-base text-gray-700 mb-1">Belum ada pertanyaan pada varian ini</p>
          <p className="text-xs text-gray-500">Silakan tambahkan soal Pilihan Ganda atau Soal Essay di bawah.</p>
        </div>
      ) : (
        questions.map((q, index) => (
          <div key={q.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:border-gray-300 transition-colors">
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
                    {q.questionType === 'PILIHAN_GANDA' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        Pilihan Ganda
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                        Essay (Review Manual)
                      </span>
                    )}
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
                    className={`p-2.5 rounded-lg border text-sm flex items-center justify-between ${
                      opt.isCorrect 
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
          </div>
        ))
      )}

      {/* ADD BUTTONS (WHEN NOT SHOWING FORM) */}
      {!showForm ? (
        <div className="flex flex-wrap gap-3 justify-center py-4 border-t border-gray-100">
          <button 
            type="button"
            onClick={() => handleOpenAdd('PILIHAN_GANDA')} 
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors flex items-center gap-1.5"
          >
            <span>+</span> Tambah Pilihan Ganda
          </button>
          <button 
            type="button"
            onClick={() => handleOpenAdd('ESSAY')} 
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors flex items-center gap-1.5"
          >
            <span>+</span> Tambah Soal Essay
          </button>
        </div>
      ) : (
        /* CREATE / EDIT FORM */
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border-2 border-blue-400 shadow-md p-6 mt-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
            <h3 className="text-lg font-bold text-gray-900">
              {editingQuestionId ? 'Edit Soal' : 'Tambah Soal Baru'}
            </h3>

            {/* Question Type Switcher */}
            <div className="inline-flex rounded-lg border border-gray-300 p-0.5 bg-gray-100 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setFormType('PILIHAN_GANDA')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  formType === 'PILIHAN_GANDA' 
                    ? 'bg-white text-blue-700 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Pilihan Ganda
              </button>
              <button
                type="button"
                onClick={() => setFormType('ESSAY')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  formType === 'ESSAY' 
                    ? 'bg-white text-purple-700 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Essay (Review Manual)
              </button>
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
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline"
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
                        className="text-red-500 hover:text-red-700 disabled:opacity-20 p-2 text-sm"
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
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-300 transition-colors"
            >
              Batal
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className={`px-5 py-2 text-sm font-bold text-white rounded-lg transition-colors disabled:opacity-50 ${
                formType === 'ESSAY' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Menyimpan...' : editingQuestionId ? 'Perbarui Soal' : 'Simpan Soal'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createQuestionAction, deleteQuestionAction, reorderQuestionsAction } from '@/modules/quiz/quiz.action';

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
  const [formType, setFormType] = useState<'PILIHAN_GANDA' | 'ESSAY'>('PILIHAN_GANDA');
  const [options, setOptions] = useState([{ text: '', isCorrect: true }, { text: '', isCorrect: false }]);
  const [loading, setLoading] = useState(false);

  const totalPoints = questions.reduce((sum, q) => sum + (Number(q.points) || 0), 0);

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
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      quizVariantId,
      questionText: formData.get('questionText'),
      questionType: formType,
      points: Number(formData.get('points')),
      options: formType === 'PILIHAN_GANDA' ? options.map((opt) => ({
        optionText: opt.text,
        isCorrect: opt.isCorrect
      })) : undefined
    };

    const res = await createQuestionAction(data);
    if (res.success) {
      setShowForm(false);
      setOptions([{ text: '', isCorrect: true }, { text: '', isCorrect: false }]);
      router.refresh();
    } else {
      alert(res.message || 'Gagal menyimpan soal');
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus soal ini?')) return;
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
      <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-200">
        <div className="text-sm text-gray-700">Total Soal: <span className="font-bold text-gray-900">{questions.length}</span></div>
        <div className="text-sm text-gray-700">Total Poin: <span className="font-bold text-blue-600">{totalPoints}</span></div>
      </div>

      {questions.map((q, index) => (
        <div key={q.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="flex gap-4">
              <div className="flex flex-col items-center gap-1">
                <button onClick={() => handleMove(index, 'up')} disabled={index === 0} className="text-gray-400 hover:text-blue-600 disabled:opacity-30">▲</button>
                <span className="text-sm font-medium text-gray-500">{index + 1}</span>
                <button onClick={() => handleMove(index, 'down')} disabled={index === questions.length - 1} className="text-gray-400 hover:text-blue-600 disabled:opacity-30">▼</button>
              </div>
              <div>
                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mb-2 ${q.questionType === 'PILIHAN_GANDA' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'}`}>
                  {q.questionType === 'PILIHAN_GANDA' ? 'Pilihan Ganda' : 'Essay'}
                </span>
                <h3 className="text-base font-medium text-gray-900 whitespace-pre-wrap">{q.questionText}</h3>
                <p className="text-xs text-gray-500 mt-1">Poin: {q.points}</p>
              </div>
            </div>
            <button onClick={() => handleDelete(q.id)} className="text-red-500 hover:text-red-700 text-sm">Hapus</button>
          </div>

          {q.questionType === 'PILIHAN_GANDA' && (
            <div className="ml-12 mt-4 space-y-2">
              {q.options?.map((opt: any, i: number) => (
                <div key={opt.id} className={`p-3 rounded-lg border text-sm ${opt.isCorrect ? 'bg-green-50 border-green-200 text-green-900' : 'bg-gray-50 border-gray-200 text-gray-700'}`}>
                  <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span>
                  {opt.optionText}
                  {opt.isCorrect && <span className="float-right font-medium text-green-600 text-xs">Jawaban Benar</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {!showForm ? (
        <div className="flex gap-3 justify-center py-6">
          <button onClick={() => { setFormType('PILIHAN_GANDA'); setShowForm(true); }} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm transition-colors">
            + Soal Pilihan Ganda
          </button>
          <button onClick={() => { setFormType('ESSAY'); setShowForm(true); }} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm transition-colors">
            + Soal Essay
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-blue-200 shadow-sm p-6 mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Tambah Soal {formType === 'PILIHAN_GANDA' ? 'Pilihan Ganda' : 'Essay'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pertanyaan</label>
              <textarea name="questionText" required rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Tuliskan pertanyaan..."></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bobot Poin</label>
              <input type="number" name="points" required min="1" defaultValue="1" className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
            </div>

            {formType === 'PILIHAN_GANDA' && (
              <div className="pt-4 border-t border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-3">Pilihan Jawaban (Pilih satu yang benar)</label>
                <div className="space-y-3">
                  {options.map((opt, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="correctAnswer" 
                        checked={opt.isCorrect} 
                        onChange={() => handleCorrectChange(index)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="font-medium text-sm text-gray-500">{String.fromCharCode(65 + index)}.</span>
                      <input 
                        type="text" 
                        value={opt.text}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        required
                        placeholder="Teks pilihan..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      />
                      <button 
                        type="button" 
                        onClick={() => handleRemoveOption(index)}
                        disabled={options.length <= 2}
                        className="text-red-500 hover:text-red-700 disabled:opacity-30 p-2"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={handleAddOption} className="mt-4 text-sm text-blue-600 hover:underline">
                  + Tambah Pilihan
                </button>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-300">Batal</button>
            <button type="submit" disabled={loading} className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50">
              {loading ? 'Menyimpan...' : 'Simpan Soal'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}


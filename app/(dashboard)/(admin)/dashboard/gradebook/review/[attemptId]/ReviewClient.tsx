'use client';

import { useState } from 'react';
import { submitEssayGrades } from '@/app/actions/essay-grading';
import { useRouter } from 'next/navigation';

interface EssayItem {
  id: string;
  text: string;
  maxPoints: number;
  answerId: string | null;
  answerText: string;
  currentPoints: number;
  feedback: string;
}

interface ReviewClientProps {
  attemptId: string;
  essays: EssayItem[];
}

export default function ReviewClient({ attemptId, essays }: ReviewClientProps) {
  const router = useRouter();
  const [grades, setGrades] = useState<Record<string, { points: number; feedback: string }>>(
    essays.reduce((acc, curr) => {
      if (curr.answerId) {
        acc[curr.answerId] = {
          points: curr.currentPoints || 0,
          feedback: curr.feedback || ''
        };
      }
      return acc;
    }, {} as any)
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleUpdate = (answerId: string, field: 'points' | 'feedback', value: any) => {
    setGrades(prev => ({
      ...prev,
      [answerId]: {
        ...prev[answerId],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      
      const payload = Object.entries(grades).map(([answerId, data]) => ({
        answerId,
        points: data.points,
        feedback: data.feedback
      }));

      const res = await submitEssayGrades(attemptId, payload);
      if (res.success) {
        alert(`Penilaian berhasil disimpan! Skor akhir murid: ${res.score}`);
        router.push('/dashboard/gradebook');
      }
    } catch (e: any) {
      setError(e.message || 'Gagal menyimpan penilaian');
    } finally {
      setSaving(false);
    }
  };

  if (essays.length === 0) {
    return (
      <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-500">
        Tidak ada soal essay pada kuis ini.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm">
          {error}
        </div>
      )}

      {essays.map((essay, index) => {
        if (!essay.answerId) return null;
        
        const currentData = grades[essay.answerId];
        
        return (
          <div key={essay.id} className="bg-white p-6 rounded-xl border-2 border-gray-200 space-y-4">
            <div className="flex gap-4 items-start">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold flex-shrink-0">
                {index + 1}
              </span>
              <div className="flex-1">
                <p className="font-medium text-gray-900 leading-relaxed mb-4">{essay.text}</p>
                
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 text-green-400 whitespace-pre-wrap font-mono text-sm leading-relaxed mb-6 overflow-x-auto shadow-inner">
                  {essay.answerText || <span className="italic text-gray-500">Tidak ada jawaban.</span>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-1">
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Poin (Maks. {essay.maxPoints})
                    </label>
                    <input 
                      type="number"
                      min={0}
                      max={essay.maxPoints}
                      value={currentData.points}
                      onChange={(e) => handleUpdate(essay.answerId!, 'points', Number(e.target.value))}
                      className="w-full p-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 outline-none font-bold"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Komentar (Opsional)
                    </label>
                    <textarea 
                      rows={2}
                      value={currentData.feedback}
                      onChange={(e) => handleUpdate(essay.answerId!, 'feedback', e.target.value)}
                      placeholder="Berikan masukan untuk jawaban murid..."
                      className="w-full p-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 outline-none text-sm resize-y"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <div className="flex justify-end pt-4">
        <button 
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-md transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? (
            <>
              <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
              Menyimpan...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-sm">save</span>
              Simpan Penilaian
            </>
          )}
        </button>
      </div>
    </div>
  );
}

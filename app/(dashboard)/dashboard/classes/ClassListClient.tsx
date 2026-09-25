'use client';

import { useState } from 'react';
import { createClassAction, kickStudentAction } from '@/modules/class/class.action';

export default function ClassListClient({ initialClasses }: { initialClasses: any[] }) {
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedClass, setSelectedClass] = useState<any>(null);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const res = await createClassAction(formData);
    
    if (res.success) {
      setShowCreate(false);
    } else {
      setError(res.message || 'Gagal membuat kelas');
    }
    setLoading(false);
  }

  async function handleKick(studentId: string, classId: string) {
    if (!confirm('Keluarkan murid ini dari kelas?')) return;
    setLoading(true);
    const res = await kickStudentAction(studentId, classId);
    if (!res.success) {
      alert(res.message || 'Gagal mengeluarkan murid');
    } else {
      // reload data is done by revalidatePath
      setSelectedClass(null); // close modal to refresh state simply
    }
    setLoading(false);
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    alert('Kode berhasil disalin: ' + code);
  }

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="text-sm font-medium text-gray-700">
          Total: {initialClasses.length} Kelas Aktif
        </div>
        <button 
          onClick={() => setShowCreate(true)}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Buat Kelas Baru
        </button>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Buat Kelas Baru</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kelas</label>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="e.g., XI RPL 1"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">Kode join akan di-generate otomatis.</p>
              </div>
              
              {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}
              
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setShowCreate(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Menyimpan...' : 'Buat Kelas'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grid Kelas */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {initialClasses.map(cls => {
          const isFull = cls.studentCount >= cls.maxStudents;
          return (
            <div key={cls.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex flex-col">
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-gray-900">{cls.name}</h3>
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                    isFull ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
                  }`}>
                    {cls.studentCount} / {cls.maxStudents}
                  </span>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3 flex justify-between items-center border border-gray-100">
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Kode Bergabung:</div>
                    <div className="font-mono font-bold text-gray-800 tracking-wider">{cls.joinCode}</div>
                  </div>
                  <button 
                    onClick={() => copyCode(cls.joinCode)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Salin Kode"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  </button>
                </div>
              </div>
              
              <div className="border-t border-gray-100 p-4 bg-gray-50/50">
                <button 
                  onClick={() => setSelectedClass(cls)}
                  className="w-full py-2 text-sm font-medium text-blue-600 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Lihat Daftar Murid
                </button>
              </div>
            </div>
          )
        })}

        {initialClasses.length === 0 && (
          <div className="col-span-full p-12 text-center bg-white rounded-xl border border-gray-200 border-dashed">
            <div className="text-gray-400 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Belum ada kelas</h3>
            <p className="text-sm text-gray-500 mt-1">Buat rombongan belajar pertama Anda.</p>
          </div>
        )}
      </div>

      {/* Student List Modal */}
      {selectedClass && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedClass.name}</h2>
                <p className="text-sm text-gray-500 mt-1">Daftar Murid ({selectedClass.studentCount}/{selectedClass.maxStudents})</p>
              </div>
              <button 
                onClick={() => setSelectedClass(null)}
                className="text-gray-400 hover:text-gray-600 p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {selectedClass.students.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  Belum ada murid yang bergabung di kelas ini.
                  <br/>Berikan kode <strong>{selectedClass.joinCode}</strong> kepada murid Anda.
                </div>
              ) : (
                <ul className="divide-y divide-gray-100 border border-gray-100 rounded-lg overflow-hidden">
                  {selectedClass.students.map((student: any, idx: number) => (
                    <li key={student.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{student.name}</div>
                          <div className="text-xs text-gray-500">{student.email}</div>
                        </div>
                      </div>
                      <button
                        disabled={loading}
                        onClick={() => handleKick(student.id, selectedClass.id)}
                        className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        Keluarkan
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

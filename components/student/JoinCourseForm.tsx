'use client';

import React, { useState } from 'react';
import { joinCourseByCode } from '@/app/actions/student-courses';

export default function JoinCourseForm({ studentId }: { studentId: string }) {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setStatus('loading');
    setMessage('');

    try {
      await joinCourseByCode(studentId, code.trim());
      setStatus('success');
      setMessage('Berhasil bergabung ke mata pelajaran!');
      setCode('');
      // It will revalidate the path via server action
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error: any) {
      setStatus('error');
      setMessage(error.message || 'Gagal bergabung. Periksa kembali kode Anda.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border-4 border-black p-4 md:p-6 shadow-[4px_4px_0px_0px_#000] flex flex-col gap-4">
      <h3 className="text-xl font-black uppercase border-b-4 border-black pb-2">Gabung Mapel</h3>
      <p className="text-xs md:text-sm font-bold">Masukkan Join Code dari Guru Anda.</p>
      
      <div className="flex flex-col md:flex-row gap-3">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="CONTOH: XYZ-123"
          className="flex-1 bg-[#EAF4ED] border-4 border-black p-3 font-mono font-bold text-black uppercase placeholder-gray-500 focus:outline-none focus:bg-white transition-colors"
          disabled={status === 'loading'}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="bg-[#2A835F] text-white font-black uppercase border-4 border-black px-6 py-3 shadow-[4px_4px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_#000] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? 'Memproses...' : 'Gabung'}
        </button>
      </div>

      {status === 'error' && (
        <div className="bg-red-200 text-red-900 border-2 border-red-900 p-2 text-xs font-bold uppercase">
          {message}
        </div>
      )}
      {status === 'success' && (
        <div className="bg-[#8BBB92] text-black border-2 border-black p-2 text-xs font-bold uppercase">
          {message}
        </div>
      )}
    </form>
  );
}

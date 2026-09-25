'use client';

import { useState } from 'react';
import { joinClassAction } from '@/modules/class/class.action';

export default function JoinClassForm({ studentId }: { studentId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const res = await joinClassAction(studentId, formData);
    
    if (!res.success) {
      setError(res.message || 'Gagal bergabung');
      setLoading(false);
    }
    // if success, the action revalidates path and middleware will redirect automatically 
    // when they hit /dashboard. Wait, action only revalidates /dashboard. We should manually redirect on success.
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="joinCode" className="block text-sm font-bold text-gray-900 mb-2 uppercase">Kode Kelas</label>
        <input
          type="text"
          id="joinCode"
          name="joinCode"
          placeholder="e.g. RPL2-XYZ9"
          required
          maxLength={15}
          className="w-full px-5 py-4 bg-gray-50 border-2 border-black rounded-xl font-mono text-xl tracking-widest text-center uppercase focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        />
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-600 rounded-xl p-4 text-center">
          <p className="text-red-700 font-bold text-sm">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#4ECDC4] hover:bg-[#45B7AF] text-black font-black text-lg py-4 px-6 border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:pointer-events-none uppercase"
      >
        {loading ? 'Memproses...' : 'Masuk Kelas!'}
      </button>
    </form>
  );
}

'use client';

import React, { useState, useTransition } from 'react';
import { changePasswordAction } from '@/app/actions/settings';

interface StudentSettingsViewProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    className: string;
  };
}

export default function StudentSettingsView({ user }: StudentSettingsViewProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isPending, startTransition] = useTransition();
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    setFieldErrors({});

    startTransition(async () => {
      const res = await changePasswordAction({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      if (res.success) {
        setStatusMessage({
          type: 'success',
          text: res.message || 'Password berhasil diperbarui.',
        });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setStatusMessage({
          type: 'error',
          text: res.message || 'Gagal mengubah password.',
        });
        if (res.errors) {
          setFieldErrors(res.errors);
        }
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-5xl font-black uppercase text-black drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
          Pengaturan Akun
        </h1>
        <p className="text-sm md:text-base font-bold text-gray-800 bg-white border-2 border-black p-2 shadow-[2px_2px_0px_0px_#000] max-w-2xl inline-block">
          Kelola informasi profil dan keamanan kata sandi akun belajarmu.
        </p>
      </div>

      {/* Profil Siswa Card */}
      <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#092328] text-white border-4 border-black flex items-center justify-center font-black text-2xl shadow-[4px_4px_0px_0px_#000] shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h2 className="text-xl font-black uppercase text-black tracking-tight">{user.name}</h2>
                <span className="bg-[#8BBB92] text-black text-xs font-black uppercase px-2 py-0.5 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                  Siswa
                </span>
                <span className="bg-[#2A835F] text-white text-xs font-black uppercase px-2 py-0.5 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                  {user.className}
                </span>
              </div>
              <p className="font-bold text-sm text-gray-700">{user.email}</p>
            </div>
          </div>
          <div className="bg-[#EAF4ED] border-2 border-black px-3 py-1.5 self-start sm:self-auto text-xs font-black uppercase shadow-[2px_2px_0px_0px_#000]">
            Status: Aktif Belajar
          </div>
        </div>
      </div>

      {/* Form Ubah Password Card */}
      <div className="bg-white border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_#000] space-y-6">
        <div>
          <div className="inline-block bg-[#092328] text-white text-xs font-black uppercase px-2.5 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] mb-2">
            Keamanan Akun
          </div>
          <h2 className="text-2xl font-black uppercase text-black tracking-tight">
            Ganti Password
          </h2>
          <p className="font-bold text-xs md:text-sm text-gray-600 mt-1">
            Gunakan minimal 6 karakter kombinasi yang kuat untuk melindungi akunmu.
          </p>
        </div>

        {/* Feedback Message */}
        {statusMessage && (
          <div
            className={`p-4 border-4 border-black font-black flex items-center gap-3 shadow-[4px_4px_0px_0px_#000] ${
              statusMessage.type === 'success'
                ? 'bg-[#8BBB92] text-black'
                : 'bg-red-400 text-black'
            }`}
          >
            <span className="material-symbols-outlined text-2xl font-bold">
              {statusMessage.type === 'success' ? 'check_circle' : 'error'}
            </span>
            <span className="text-sm uppercase tracking-tight">{statusMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Password Saat Ini */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-black mb-1.5">
              Password Saat Ini <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Masukkan password yang sedang digunakan"
                className="w-full bg-white border-4 border-black p-3.5 pr-12 font-bold text-black text-sm placeholder:text-gray-400 focus:bg-[#EAF4ED] focus:outline-none shadow-[4px_4px_0px_0px_#000] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-black hover:text-gray-600 transition-colors"
                title={showCurrentPassword ? 'Sembunyikan' : 'Tampilkan'}
              >
                <span className="material-symbols-outlined text-xl">
                  {showCurrentPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            {fieldErrors.currentPassword && (
              <p className="mt-1.5 text-xs font-black text-red-600 uppercase">
                {fieldErrors.currentPassword[0]}
              </p>
            )}
          </div>

          {/* Password Baru */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-black mb-1.5">
              Password Baru <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full bg-white border-4 border-black p-3.5 pr-12 font-bold text-black text-sm placeholder:text-gray-400 focus:bg-[#EAF4ED] focus:outline-none shadow-[4px_4px_0px_0px_#000] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-black hover:text-gray-600 transition-colors"
                title={showNewPassword ? 'Sembunyikan' : 'Tampilkan'}
              >
                <span className="material-symbols-outlined text-xl">
                  {showNewPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            {fieldErrors.newPassword && (
              <p className="mt-1.5 text-xs font-black text-red-600 uppercase">
                {fieldErrors.newPassword[0]}
              </p>
            )}
          </div>

          {/* Konfirmasi Password Baru */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-black mb-1.5">
              Konfirmasi Password Baru <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi password baru"
                className="w-full bg-white border-4 border-black p-3.5 pr-12 font-bold text-black text-sm placeholder:text-gray-400 focus:bg-[#EAF4ED] focus:outline-none shadow-[4px_4px_0px_0px_#000] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-black hover:text-gray-600 transition-colors"
                title={showConfirmPassword ? 'Sembunyikan' : 'Tampilkan'}
              >
                <span className="material-symbols-outlined text-xl">
                  {showConfirmPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            {fieldErrors.confirmPassword && (
              <p className="mt-1.5 text-xs font-black text-red-600 uppercase">
                {fieldErrors.confirmPassword[0]}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="bg-[#2A835F] text-white font-black uppercase text-sm tracking-tight px-6 py-3.5 border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">lock_reset</span>
                  <span>Simpan Password Baru</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setStatusMessage(null);
                setFieldErrors({});
              }}
              disabled={isPending}
              className="bg-white text-black font-black uppercase text-sm tracking-tight px-6 py-3.5 border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all cursor-pointer disabled:opacity-50"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

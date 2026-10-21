'use client';

import React, { useState, useTransition } from 'react';
import { changePasswordAction } from '@/app/actions/settings';

interface AdminSettingsViewProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export default function AdminSettingsView({ user }: AdminSettingsViewProps) {
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

  const roleBadgeStyle = user.role === 'SUPERADMIN' 
    ? 'bg-purple-50 text-purple-700 border-purple-200' 
    : 'bg-emerald-50 text-emerald-700 border-emerald-200';

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Pengaturan Akun</h1>
        <p className="text-gray-500 text-sm">
          Kelola informasi profil dan keamanan kata sandi akun Anda.
        </p>
      </div>

      {/* Profil Ringkas */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-gray-900">{user.name}</h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${roleBadgeStyle}`}>
                  {user.role}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  Aktif
                </span>
              </div>
              <p className="text-gray-500 text-sm mt-0.5">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Ubah Password */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2 text-gray-900 font-bold text-base">
            <span className="material-symbols-outlined text-blue-600">lock</span>
            <h3>Keamanan & Kata Sandi</h3>
          </div>
          <p className="text-gray-500 text-xs mt-1">
            Gunakan kombinasi kata sandi yang kuat untuk menjaga keamanan akses ke sistem.
          </p>
        </div>

        {/* Alert Notifikasi */}
        {statusMessage && (
          <div
            className={`p-4 rounded-lg text-sm flex items-start gap-3 border ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                : 'bg-red-50 text-red-900 border-red-200'
            }`}
          >
            <span className="material-symbols-outlined text-lg mt-0.5 shrink-0">
              {statusMessage.type === 'success' ? 'check_circle' : 'error'}
            </span>
            <div className="flex-1 font-medium">{statusMessage.text}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Password Saat Ini
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Masukkan password saat ini"
                required
                className="w-full px-3.5 py-2.5 pr-10 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined text-lg">
                  {showCurrentPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            {fieldErrors.currentPassword && (
              <p className="text-red-600 text-xs mt-1">{fieldErrors.currentPassword[0]}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* New Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Password Baru
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  required
                  className="w-full px-3.5 py-2.5 pr-10 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <span className="material-symbols-outlined text-lg">
                    {showNewPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              {fieldErrors.newPassword && (
                <p className="text-red-600 text-xs mt-1">{fieldErrors.newPassword[0]}</p>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Konfirmasi Password Baru
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi password baru"
                  required
                  className="w-full px-3.5 py-2.5 pr-10 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <span className="material-symbols-outlined text-lg">
                    {showConfirmPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <p className="text-red-600 text-xs mt-1">{fieldErrors.confirmPassword[0]}</p>
              )}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
            >
              {isPending ? (
                <>
                  <span className="animate-spin material-symbols-outlined text-base">progress_activity</span>
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">save</span>
                  <span>Perbarui Password</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

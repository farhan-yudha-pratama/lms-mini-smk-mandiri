'use client';

import React from 'react';
import type { PendingEmailChangeInfo } from '@/modules/auth/email-change.service';
import { formatCountdown, useEmailChange } from '@/components/settings/useEmailChange';

interface EmailChangeCardProps {
  currentEmail: string;
  role: string;
  emailChangeCount: number;
  emailChangedAt: string | null;
  initialPending: PendingEmailChangeInfo | null;
}

export default function EmailChangeCard({
  currentEmail,
  role,
  emailChangeCount,
  emailChangedAt,
  initialPending,
}: EmailChangeCardProps) {
  const isUnlimited = role === 'SUPERADMIN';
  const isLocked = !isUnlimited && emailChangeCount >= 1;

  const {
    newEmail,
    setNewEmail,
    currentPassword,
    setCurrentPassword,
    showPassword,
    setShowPassword,
    otpCode,
    setOtpCode,
    pending,
    statusMessage,
    fieldErrors,
    isPending,
    expiresInSeconds,
    resendCooldownSeconds,
    handleRequestOtp,
    handleResendOtp,
    handleVerifyOtp,
    handleCancel,
  } = useEmailChange(initialPending);

  const formattedChangedDate = emailChangedAt
    ? new Date(emailChangedAt).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
      <div className="border-b border-gray-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 text-gray-900 font-bold text-base">
            <span className="material-symbols-outlined text-blue-600">mail</span>
            <h3>Alamat Email & Verifikasi OTP</h3>
          </div>
          <p className="text-gray-500 text-xs mt-1">
            {isUnlimited
              ? 'Akun Superadmin dapat memperbarui email kapan saja dengan verifikasi OTP.'
              : 'Setiap akun hanya dapat mengganti alamat email 1 kali dengan verifikasi kode OTP.'}
          </p>
        </div>

        <span
          className={`px-2.5 py-1 rounded-full text-xs font-semibold border self-start sm:self-auto ${
            isLocked
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : isUnlimited
              ? 'bg-purple-50 text-purple-700 border-purple-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}
        >
          {isLocked
            ? 'Kuota 1x Terpakai'
            : isUnlimited
            ? 'Superadmin (Tanpa Batas)'
            : 'Sisa Kuota: 1x Ganti'}
        </span>
      </div>

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

      {isLocked ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-1.5">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <span className="material-symbols-outlined text-emerald-600 text-lg">verified</span>
            <span>{currentEmail}</span>
          </div>
          <p className="text-xs text-gray-500">
            Alamat email sudah diperbarui dan diverifikasi
            {formattedChangedDate ? ` pada ${formattedChangedDate}` : ''}. Hubungi Superadmin jika memerlukan perubahan darurat.
          </p>
        </div>
      ) : pending ? (
        <form onSubmit={handleVerifyOtp} className="space-y-5">
          <div className="rounded-lg border border-blue-200 bg-blue-50/70 p-4 text-sm text-blue-950 space-y-1">
            <p className="font-semibold">Verifikasi Email Tujuan: {pending.newEmail}</p>
            <p className="text-xs text-blue-800">
              {expiresInSeconds > 0
                ? `Kode OTP 6 digit berlaku selama ${formatCountdown(expiresInSeconds)}.`
                : 'Kode OTP telah kedaluwarsa. Silakan kirim ulang kode baru.'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Kode OTP (6 Digit)
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="\d{6}"
              maxLength={6}
              required
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Masukkan 6 digit kode OTP"
              className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-mono tracking-[0.35em] text-gray-900 placeholder:tracking-normal placeholder:font-sans placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {fieldErrors.otp && <p className="text-red-600 text-xs mt-1">{fieldErrors.otp[0]}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Password Saat Ini (diperlukan jika ingin kirim ulang kode)
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Isi jika ingin mengirim ulang OTP"
              className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="pt-1 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isPending || resendCooldownSeconds > 0}
                className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendCooldownSeconds > 0
                  ? `Kirim Ulang (${resendCooldownSeconds}s)`
                  : 'Kirim Ulang OTP'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isPending}
                className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
              >
                Batalkan
              </button>
            </div>

            <button
              type="submit"
              disabled={isPending || otpCode.length !== 6 || expiresInSeconds === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
            >
              <span className="material-symbols-outlined text-base">verified</span>
              <span>{isPending ? 'Memverifikasi...' : 'Verifikasi & Ubah Email'}</span>
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleRequestOtp} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email Baru
              </label>
              <input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="nama@email-aktif.com"
                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {fieldErrors.newEmail && (
                <p className="text-red-600 text-xs mt-1">{fieldErrors.newEmail[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Password Saat Ini
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Konfirmasi password Anda"
                  className="w-full px-3.5 py-2.5 pr-10 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              {fieldErrors.currentPassword && (
                <p className="text-red-600 text-xs mt-1">{fieldErrors.currentPassword[0]}</p>
              )}
            </div>
          </div>

          <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs text-gray-500">
              Email aktif saat ini: <span className="font-semibold text-gray-700">{currentEmail}</span>
            </p>
            <button
              type="submit"
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
            >
              <span className="material-symbols-outlined text-base">send</span>
              <span>{isPending ? 'Mengirim OTP...' : 'Kirim Kode OTP'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

'use client';

import React from 'react';
import type { PendingEmailChangeInfo } from '@/modules/auth/email-change.service';
import { formatCountdown, useEmailChange } from '@/components/settings/useEmailChange';

interface StudentEmailChangeCardProps {
  currentEmail: string;
  emailChangeCount: number;
  emailChangedAt: string | null;
  initialPending: PendingEmailChangeInfo | null;
}

export default function StudentEmailChangeCard({
  currentEmail,
  emailChangeCount,
  emailChangedAt,
  initialPending,
}: StudentEmailChangeCardProps) {
  const isLocked = emailChangeCount >= 1;

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
    <div className="bg-white border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_#000] space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <div className="inline-block bg-[#092328] text-white text-xs font-black uppercase px-2.5 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] mb-2">
            Verifikasi Email
          </div>
          <h2 className="text-2xl font-black uppercase text-black tracking-tight">
            Ganti Email Akun
          </h2>
          <p className="font-bold text-xs md:text-sm text-gray-600 mt-1">
            Kamu hanya dapat mengganti alamat email 1 kali dengan verifikasi kode OTP.
          </p>
        </div>

        <span
          className={`text-xs font-black uppercase px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_#000] self-start ${
            isLocked ? 'bg-[#8BBB92] text-black' : 'bg-[#EAF4ED] text-black'
          }`}
        >
          {isLocked ? 'Kuota 1x Terpakai' : 'Sisa Kuota: 1x Ganti'}
        </span>
      </div>

      {statusMessage && (
        <div
          className={`p-4 border-4 border-black font-black flex items-center gap-3 shadow-[4px_4px_0px_0px_#000] ${
            statusMessage.type === 'success' ? 'bg-[#8BBB92] text-black' : 'bg-red-400 text-black'
          }`}
        >
          <span className="material-symbols-outlined text-2xl font-bold">
            {statusMessage.type === 'success' ? 'check_circle' : 'error'}
          </span>
          <span className="text-sm uppercase tracking-tight">{statusMessage.text}</span>
        </div>
      )}

      {isLocked ? (
        <div className="bg-[#EAF4ED] border-4 border-black p-4 shadow-[4px_4px_0px_0px_#000] space-y-1">
          <div className="flex items-center gap-2 font-black text-black text-sm">
            <span className="material-symbols-outlined text-[#2A835F]">verified</span>
            <span>{currentEmail}</span>
          </div>
          <p className="text-xs font-bold text-gray-700">
            Email telah diverifikasi dan diubah
            {formattedChangedDate ? ` pada ${formattedChangedDate}` : ''}. Batas ganti email 1x sudah terpakai.
          </p>
        </div>
      ) : pending ? (
        <form onSubmit={handleVerifyOtp} className="space-y-5">
          <div className="bg-[#EAF4ED] border-4 border-black p-4 shadow-[4px_4px_0px_0px_#000] space-y-1">
            <p className="font-black text-xs uppercase text-black">
              OTP Dikirim Ke: {pending.newEmail}
            </p>
            <p className="font-bold text-xs text-gray-700">
              {expiresInSeconds > 0
                ? `Berlaku selama ${formatCountdown(expiresInSeconds)}`
                : 'Kode OTP kedaluwarsa. Klik Kirim Ulang OTP.'}
            </p>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-black mb-1.5">
              Kode OTP 6 Digit <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="\d{6}"
              maxLength={6}
              required
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              className="w-full bg-white border-4 border-black p-3.5 font-black font-mono tracking-[0.35em] text-black text-base placeholder:text-gray-400 focus:bg-[#EAF4ED] focus:outline-none shadow-[4px_4px_0px_0px_#000]"
            />
            {fieldErrors.otp && (
              <p className="mt-1.5 text-xs font-black text-red-600 uppercase">
                {fieldErrors.otp[0]}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-black mb-1.5">
              Password Saat Ini (Untuk Kirim Ulang OTP)
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Isi jika perlu kirim ulang kode"
              className="w-full bg-white border-4 border-black p-3 font-bold text-black text-sm placeholder:text-gray-400 focus:bg-[#EAF4ED] focus:outline-none shadow-[4px_4px_0px_0px_#000]"
            />
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              type="submit"
              disabled={isPending || otpCode.length !== 6 || expiresInSeconds === 0}
              className="bg-[#2A835F] text-white font-black uppercase text-sm tracking-tight px-6 py-3.5 border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-lg">verified</span>
              <span>{isPending ? 'Memverifikasi...' : 'Verifikasi & Ubah Email'}</span>
            </button>

            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isPending || resendCooldownSeconds > 0}
              className="bg-[#8BBB92] text-black font-black uppercase text-sm tracking-tight px-5 py-3.5 border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all cursor-pointer disabled:opacity-50"
            >
              {resendCooldownSeconds > 0
                ? `Kirim Ulang (${resendCooldownSeconds}s)`
                : 'Kirim Ulang'}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              disabled={isPending}
              className="bg-white text-black font-black uppercase text-sm tracking-tight px-5 py-3.5 border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all cursor-pointer disabled:opacity-50"
            >
              Batal
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleRequestOtp} className="space-y-5">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-black mb-1.5">
              Alamat Email Baru <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              required
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="nama@email-aktif.com"
              className="w-full bg-white border-4 border-black p-3.5 font-bold text-black text-sm placeholder:text-gray-400 focus:bg-[#EAF4ED] focus:outline-none shadow-[4px_4px_0px_0px_#000]"
            />
            {fieldErrors.newEmail && (
              <p className="mt-1.5 text-xs font-black text-red-600 uppercase">
                {fieldErrors.newEmail[0]}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-black mb-1.5">
              Password Saat Ini <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Masukkan password saat ini"
                className="w-full bg-white border-4 border-black p-3.5 pr-12 font-bold text-black text-sm placeholder:text-gray-400 focus:bg-[#EAF4ED] focus:outline-none shadow-[4px_4px_0px_0px_#000]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-black hover:text-gray-600"
                title={showPassword ? 'Sembunyikan' : 'Tampilkan'}
              >
                <span className="material-symbols-outlined text-xl">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            {fieldErrors.currentPassword && (
              <p className="mt-1.5 text-xs font-black text-red-600 uppercase">
                {fieldErrors.currentPassword[0]}
              </p>
            )}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs font-bold text-gray-700">
              Email saat ini: <span className="font-black text-black">{currentEmail}</span>
            </p>
            <button
              type="submit"
              disabled={isPending}
              className="bg-[#2A835F] text-white font-black uppercase text-sm tracking-tight px-6 py-3.5 border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-lg">send</span>
              <span>{isPending ? 'Mengirim OTP...' : 'Kirim Kode OTP'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import { resetPasswordAction, type ResetPasswordActionState } from './actions';

interface ResetPasswordFormProps {
  token: string;
  email: string;
}

export default function ResetPasswordForm({ token, email }: ResetPasswordFormProps) {
  const [state, formAction, isPending] = useActionState<ResetPasswordActionState | null, FormData>(
    resetPasswordAction,
    null
  );
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (state?.success) {
    return (
      <div className="space-y-6">
        <div className="bg-[#8BBB92] text-black font-bold p-4 border-4 border-black shadow-[4px_4px_0px_0px_#000] text-sm">
          {state.message}
        </div>
        <Link
          href="/login?reason=password_reset"
          className="block w-full text-center bg-[#2A835F] text-white font-black uppercase tracking-tight border-4 border-black shadow-[4px_4px_0px_0px_#000] px-6 py-4 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
        >
          Masuk Sekarang
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="token" value={token} />

      <div className="bg-[#EAF4ED] border-4 border-black p-3 shadow-[4px_4px_0px_0px_#000]">
        <p className="text-xs font-black uppercase text-black">Akun Terverifikasi</p>
        <p className="text-sm font-bold text-gray-800 break-all">{email}</p>
      </div>

      {state && !state.success && (
        <div className="bg-red-400 text-black font-bold p-4 border-4 border-black shadow-[4px_4px_0px_0px_#000] text-sm">
          {state.message}
        </div>
      )}

      <div className="space-y-2">
        <label className="block font-black uppercase tracking-tight text-black text-sm">
          Password Baru
        </label>
        <div className="relative">
          <input
            type={showNewPassword ? 'text' : 'password'}
            name="newPassword"
            required
            minLength={6}
            placeholder="Minimal 6 karakter"
            className="w-full bg-white text-black font-bold border-4 border-black shadow-[4px_4px_0px_0px_#000] px-4 py-3 pr-12 focus:outline-none focus:bg-[#EAF4ED] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_#000] transition-all"
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-black hover:text-gray-600"
            title={showNewPassword ? 'Sembunyikan' : 'Tampilkan'}
          >
            <span className="material-symbols-outlined text-xl">
              {showNewPassword ? 'visibility_off' : 'visibility'}
            </span>
          </button>
        </div>
        {state?.errors?.newPassword && (
          <p className="text-red-700 font-bold text-xs uppercase">{state.errors.newPassword[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block font-black uppercase tracking-tight text-black text-sm">
          Konfirmasi Password Baru
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            required
            minLength={6}
            placeholder="Ulangi password baru"
            className="w-full bg-white text-black font-bold border-4 border-black shadow-[4px_4px_0px_0px_#000] px-4 py-3 pr-12 focus:outline-none focus:bg-[#EAF4ED] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_#000] transition-all"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-black hover:text-gray-600"
            title={showConfirmPassword ? 'Sembunyikan' : 'Tampilkan'}
          >
            <span className="material-symbols-outlined text-xl">
              {showConfirmPassword ? 'visibility_off' : 'visibility'}
            </span>
          </button>
        </div>
        {state?.errors?.confirmPassword && (
          <p className="text-red-700 font-bold text-xs uppercase">{state.errors.confirmPassword[0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-[#2A835F] text-white font-black uppercase tracking-tight border-4 border-black shadow-[4px_4px_0px_0px_#000] px-6 py-4 mt-2 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50 cursor-pointer"
      >
        {isPending ? 'Menyimpan Password...' : 'Simpan Password Baru'}
      </button>
    </form>
  );
}

'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { forgotPasswordAction, type ForgotPasswordActionState } from './actions';

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState<ForgotPasswordActionState | null, FormData>(
    forgotPasswordAction,
    null
  );

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#EAF4ED] p-4">
      <div className="w-full max-w-md bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-8">
        <div className="mb-8">
          <div className="inline-block bg-[#092328] text-white font-black uppercase tracking-tight px-3 py-1 border-2 border-black mb-2 shadow-[2px_2px_0px_0px_#000]">
            WebPoint LMS
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-black">
            Lupa Password
          </h1>
          <p className="font-bold text-black text-sm mt-2">
            Masukkan email yang sudah terverifikasi untuk menerima tautan pengaturan ulang kata sandi (berlaku 30 menit).
          </p>
        </div>

        {state && (
          <div
            className={`mb-6 font-bold p-4 border-4 border-black shadow-[4px_4px_0px_0px_#000] text-sm ${
              state.success ? 'bg-[#8BBB92] text-black' : 'bg-red-400 text-black'
            }`}
          >
            {state.message}
          </div>
        )}

        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <label className="block font-black uppercase tracking-tight text-black text-sm">
              Email Terverifikasi
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="nama@email-terverifikasi.com"
              className="w-full bg-white text-black font-bold border-4 border-black shadow-[4px_4px_0px_0px_#000] px-4 py-3 focus:outline-none focus:bg-[#EAF4ED] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_#000] transition-all"
            />
            {state?.errors?.email && (
              <p className="text-red-700 font-bold text-xs mt-1 uppercase">
                {state.errors.email[0]}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#2A835F] text-white font-black uppercase tracking-tight border-4 border-black shadow-[4px_4px_0px_0px_#000] px-6 py-4 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50 cursor-pointer"
          >
            {isPending ? 'Mengirim Tautan...' : 'Kirim Tautan Reset'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t-4 border-black text-center">
          <Link
            href="/login"
            className="inline-block bg-[#EAF4ED] text-black font-black uppercase tracking-tight border-4 border-black shadow-[2px_2px_0px_0px_#000] px-4 py-2 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            Kembali ke Login
          </Link>
        </div>
      </div>
    </main>
  );
}

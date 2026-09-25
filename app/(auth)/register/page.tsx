'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { registerAction } from './actions';
import { ActionResponse } from '../login/actions';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<ActionResponse | null, FormData>(registerAction, null);

  useEffect(() => {
    if (state?.success && state.data?.role) {
      // Redirect to home since default role is MURID
      router.push('/');
    }
  }, [state, router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#EAF4ED] p-4">
      <div className="w-full max-w-md bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-8">
        
        <div className="mb-8">
          <div className="inline-block bg-[#2A835F] text-white font-black uppercase tracking-tight px-3 py-1 border-2 border-black mb-2 shadow-[2px_2px_0px_0px_#000]">
            WebPoint LMS
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-black">
            Register
          </h1>
          <p className="font-bold text-black mt-2">
            Daftar akun baru untuk mulai belajar
          </p>
        </div>

        {state && !state.success && (
          <div className="mb-6 bg-[#092328] text-white font-bold p-4 border-4 border-black shadow-[4px_4px_0px_0px_#000]">
            {state.message}
          </div>
        )}

        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <label className="block font-black uppercase tracking-tight text-black text-sm">
              Nama Lengkap
            </label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              className="w-full bg-white text-black font-bold border-4 border-black shadow-[4px_4px_0px_0px_#000] px-4 py-3 focus:outline-none focus:bg-[#EAF4ED] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_#000] transition-all"
            />
            {state?.errors?.name && (
              <p className="text-black font-bold text-sm mt-1 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-[#2A835F] rounded-none"></span>
                {state.errors.name[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block font-black uppercase tracking-tight text-black text-sm">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="contoh@sekolah.id"
              className="w-full bg-white text-black font-bold border-4 border-black shadow-[4px_4px_0px_0px_#000] px-4 py-3 focus:outline-none focus:bg-[#EAF4ED] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_#000] transition-all"
            />
            {state?.errors?.email && (
              <p className="text-black font-bold text-sm mt-1 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-[#2A835F] rounded-none"></span>
                {state.errors.email[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block font-black uppercase tracking-tight text-black text-sm">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              className="w-full bg-white text-black font-bold border-4 border-black shadow-[4px_4px_0px_0px_#000] px-4 py-3 focus:outline-none focus:bg-[#EAF4ED] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_#000] transition-all"
            />
            {state?.errors?.password && (
              <p className="text-black font-bold text-sm mt-1 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-[#2A835F] rounded-none"></span>
                {state.errors.password[0]}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#12544F] text-white font-black uppercase tracking-tight border-4 border-black shadow-[4px_4px_0px_0px_#000] px-6 py-4 mt-4 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50"
          >
            {isPending ? 'Memproses...' : 'Daftar Sekarang'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t-4 border-black text-center">
          <p className="font-bold text-black mb-2">Sudah punya akun?</p>
          <Link
            href="/login"
            className="inline-block bg-[#8BBB92] text-black font-black uppercase tracking-tight border-4 border-black shadow-[2px_2px_0px_0px_#000] px-4 py-2 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            Masuk di sini
          </Link>
        </div>

      </div>
    </main>
  );
}

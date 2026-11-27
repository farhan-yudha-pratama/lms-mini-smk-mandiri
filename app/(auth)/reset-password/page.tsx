import Link from 'next/link';
import { validatePasswordResetTokenService } from '@/modules/auth/password-reset.service';
import ResetPasswordForm from './ResetPasswordForm';

export const dynamic = 'force-dynamic';

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  const rawToken = typeof params.token === 'string' ? params.token : '';
  const validation = await validatePasswordResetTokenService(rawToken);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#EAF4ED] p-4">
      <div className="w-full max-w-md bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-8">
        <div className="mb-8">
          <div className="inline-block bg-[#092328] text-white font-black uppercase tracking-tight px-3 py-1 border-2 border-black mb-2 shadow-[2px_2px_0px_0px_#000]">
            WebPoint LMS
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-black">
            Atur Ulang Password
          </h1>
          <p className="font-bold text-black text-sm mt-2">
            {validation.valid
              ? 'Buat kata sandi baru untuk akun Anda.'
              : 'Tautan tidak dapat digunakan untuk mengatur ulang kata sandi.'}
          </p>
        </div>

        {validation.valid ? (
          <ResetPasswordForm token={rawToken} email={validation.email} />
        ) : (
          <div className="space-y-6">
            <div className="bg-red-400 text-black font-bold p-4 border-4 border-black shadow-[4px_4px_0px_0px_#000] text-sm">
              {validation.reason}
            </div>

            <div className="flex flex-col gap-3">
              <Link
                href="/forgot-password"
                className="block w-full text-center bg-[#8BBB92] text-black font-black uppercase tracking-tight border-4 border-black shadow-[4px_4px_0px_0px_#000] px-6 py-3.5 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
              >
                Minta Tautan Baru
              </Link>
              <Link
                href="/login"
                className="block w-full text-center bg-[#EAF4ED] text-black font-black uppercase tracking-tight border-4 border-black shadow-[4px_4px_0px_0px_#000] px-6 py-3.5 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
              >
                Kembali ke Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

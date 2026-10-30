'use client';

import { useEffect, useState, useRef } from 'react';
import { getSocket } from '@/lib/socket/client';
import { logoutAction } from '@/app/actions';

interface SessionWatcherProps {
  currentUserId?: string;
}

export default function SessionWatcher({ currentUserId }: SessionWatcherProps) {
  const [kickState, setKickState] = useState<{
    isKicked: boolean;
    reason: 'DEACTIVATED' | 'REVOKED' | 'DELETED';
    countdown: number;
  }>({
    isKicked: false,
    reason: 'REVOKED',
    countdown: 5,
  });

  const hasHandledLogout = useRef(false);

  useEffect(() => {
    if (!currentUserId) return;

    const socket = getSocket();
    if (!socket) return;

    const handleStatusChanged = (data: { userIds: string[]; isActive: boolean }) => {
      if (data.userIds && data.userIds.includes(currentUserId) && data.isActive === false) {
        handleKickOut('DEACTIVATED');
      }
    };

    const handleRevoked = (data: { userIds: string[]; reason?: 'DEACTIVATED' | 'REVOKED' | 'DELETED' }) => {
      if (data.userIds && data.userIds.includes(currentUserId)) {
        handleKickOut(data.reason || 'REVOKED');
      }
    };

    const handleKickOut = async (reason: 'DEACTIVATED' | 'REVOKED' | 'DELETED') => {
      if (hasHandledLogout.current) return;
      hasHandledLogout.current = true;

      // Purge session cookies immediately via server action
      try {
        await logoutAction();
      } catch (err) {
        console.error('Logout error during session eviction:', err);
      }

      setKickState({
        isKicked: true,
        reason,
        countdown: 5,
      });
    };

    socket.on('user:status_changed', handleStatusChanged);
    socket.on('user:revoked', handleRevoked);

    return () => {
      socket.off('user:status_changed', handleStatusChanged);
      socket.off('user:revoked', handleRevoked);
    };
  }, [currentUserId]);

  // Countdown timer to auto-redirect
  useEffect(() => {
    if (!kickState.isKicked) return;

    if (kickState.countdown <= 0) {
      window.location.href = `/login?reason=${kickState.reason.toLowerCase()}`;
      return;
    }

    const timer = setInterval(() => {
      setKickState(prev => ({
        ...prev,
        countdown: Math.max(0, prev.countdown - 1),
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [kickState.isKicked, kickState.countdown, kickState.reason]);

  if (!kickState.isKicked) return null;

  const title = kickState.reason === 'DEACTIVATED' 
    ? 'Akun Dinonaktifkan' 
    : kickState.reason === 'DELETED'
    ? 'Akun Dihapus'
    : 'Sesi Login Berakhir';

  const message = kickState.reason === 'DEACTIVATED'
    ? 'Akun Anda telah dinonaktifkan oleh Administrator. Akses ke dalam sistem pembelajaran telah ditutup.'
    : kickState.reason === 'DELETED'
    ? 'Akun Anda telah dihapus dari sistem oleh Administrator.'
    : 'Sesi login Anda telah dicabut (revoked) oleh Administrator. Silakan login kembali untuk melanjutkan.';

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_#000] space-y-5 transform animate-in zoom-in-95 duration-200 text-left">
        <div className="flex items-center gap-3 border-b-4 border-black pb-4">
          <div className="w-12 h-12 bg-red-500 border-3 border-black shadow-[3px_3px_0px_0px_#000] flex items-center justify-center text-white shrink-0">
            <span className="material-symbols-outlined text-3xl font-black">gpp_bad</span>
          </div>
          <div>
            <span className="inline-block bg-[#092328] text-white font-mono font-bold text-[10px] uppercase px-2 py-0.5 border border-black mb-1">
              Keamanan LMS
            </span>
            <h2 className="font-black text-xl uppercase tracking-tight text-black leading-tight">
              {title}
            </h2>
          </div>
        </div>

        <p className="font-bold text-gray-800 text-sm leading-relaxed">
          {message}
        </p>

        <div className="p-3 bg-yellow-100 border-2 border-black text-xs font-bold text-black flex items-center justify-between">
          <span>Otomatis dialihkan dalam:</span>
          <span className="bg-black text-white px-2 py-0.5 font-mono text-sm font-black">
            {kickState.countdown}s
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            window.location.href = `/login?reason=${kickState.reason.toLowerCase()}`;
          }}
          className="w-full py-3.5 bg-[#092328] text-white border-4 border-black font-black uppercase text-sm tracking-wider shadow-[4px_4px_0px_0px_#000] hover:bg-black active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2"
        >
          <span>Ke Halaman Login Sekarang</span>
          <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}

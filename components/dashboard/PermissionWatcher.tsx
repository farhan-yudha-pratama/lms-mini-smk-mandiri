'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSocket } from '@/lib/socket/client';
import { getUserSession } from '@/app/actions';

interface PermissionWatcherProps {
  currentUserId?: string;
  onUserRefreshed?: (user: any) => void;
}

interface PermissionToast {
  id: string;
  title: string;
  message: string;
}

export default function PermissionWatcher({
  currentUserId,
  onUserRefreshed,
}: PermissionWatcherProps) {
  const router = useRouter();
  const [toasts, setToasts] = useState<PermissionToast[]>([]);

  useEffect(() => {
    if (!currentUserId) return;

    const socket = getSocket();
    if (!socket) return;

    // Join room user untuk notifikasi privat
    socket.emit('join:user', currentUserId);

    const handlePermissionsUpdated = async (data: { userId: string; permissionCodes: string[] }) => {
      if (data.userId === currentUserId) {
        // 1. Ambil sesi terkini secara asinkron
        const updatedSession = await getUserSession();
        if (updatedSession && onUserRefreshed) {
          onUserRefreshed(updatedSession);
        }

        // 2. Refresh App Router Server Components
        router.refresh();

        // 3. Tampilkan toast pemberitahuan
        const id = 'perm_toast_' + Date.now();
        setToasts((prev) => [
          {
            id,
            title: '🔐 Hak Akses Diperbarui Secara Real-Time!',
            message: `Administrator telah memperbarui wewenang akun Anda (${data.permissionCodes.length} hak akses aktif). Tampilan navigasi dan izin fitur telah disinkronkan secara otomatis.`,
          },
          ...prev,
        ]);

        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 9000);
      }
    };

    socket.on('user:permissions_updated', handlePermissionsUpdated);

    return () => {
      socket.off('user:permissions_updated', handlePermissionsUpdated);
    };
  }, [currentUserId, onUserRefreshed, router]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 max-w-md w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-white border-2 border-indigo-600 rounded-xl shadow-xl p-4 flex gap-3 items-start animate-in slide-in-from-bottom-5 duration-300"
        >
          <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-xl">admin_panel_settings</span>
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-gray-900 text-sm">{toast.title}</h4>
            <p className="text-xs text-gray-600 mt-1 leading-relaxed">{toast.message}</p>
          </div>

          <button
            onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-md transition-colors"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      ))}
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSocket } from '@/lib/socket/client';
import type { CourseTeacherAssignedEvent, CourseTeacherRemovedEvent } from '@/lib/socket/emitter';

interface TeacherAssignmentWatcherProps {
  currentUserId?: string;
  currentUserRole?: string;
}

interface ToastNotification {
  id: string;
  type: 'assigned' | 'removed';
  title: string;
  message: string;
  courseId?: string;
}

export default function TeacherAssignmentWatcher({
  currentUserId,
  currentUserRole,
}: TeacherAssignmentWatcherProps) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);

  useEffect(() => {
    if (!currentUserId) return;

    const socket = getSocket();
    if (!socket) return;

    // Join personal user room for direct events
    socket.emit('join:user', currentUserId);

    const handleAssigned = (data: CourseTeacherAssignedEvent) => {
      if (data.teacherId === currentUserId) {
        // Trigger Next.js App Router background data refresh
        router.refresh();

        const notifId = 'notif_' + Date.now();
        const newNotif: ToastNotification = {
          id: notifId,
          type: 'assigned',
          title: '🎉 Ditugaskan ke Mata Pelajaran Baru!',
          message: `Anda telah ditugaskan sebagai pengampu mata pelajaran "${data.courseName}". Modul materi kini telah terbuka di dasbor Anda.`,
          courseId: data.courseId,
        };

        setNotifications((prev) => [newNotif, ...prev]);

        // Auto remove after 9 seconds
        setTimeout(() => {
          setNotifications((prev) => prev.filter((n) => n.id !== notifId));
        }, 9000);
      }
    };

    const handleRemoved = (data: CourseTeacherRemovedEvent) => {
      if (data.teacherId === currentUserId) {
        router.refresh();

        const notifId = 'notif_' + Date.now();
        const newNotif: ToastNotification = {
          id: notifId,
          type: 'removed',
          title: 'Pemberitahuan Penugasan',
          message: `Akses pengampu untuk mata pelajaran "${data.courseName}" telah dicabut.`,
        };

        setNotifications((prev) => [newNotif, ...prev]);

        setTimeout(() => {
          setNotifications((prev) => prev.filter((n) => n.id !== notifId));
        }, 8000);
      }
    };

    socket.on('course:teacher_assigned', handleAssigned);
    socket.on('course:teacher_removed', handleRemoved);

    return () => {
      socket.off('course:teacher_assigned', handleAssigned);
      socket.off('course:teacher_removed', handleRemoved);
    };
  }, [currentUserId, router]);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-18 right-4 sm:right-6 z-50 flex flex-col gap-3 max-w-sm sm:max-w-md w-full pointer-events-none">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`pointer-events-auto p-4 rounded-xl shadow-xl border flex flex-col gap-2.5 transition-all duration-300 animate-in slide-in-from-top-4 fade-in ${
            n.type === 'assigned'
              ? 'bg-white border-emerald-300 text-gray-900 ring-2 ring-emerald-500/20'
              : 'bg-white border-amber-300 text-gray-900 ring-2 ring-amber-500/20'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  n.type === 'assigned'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                <span className="material-symbols-outlined text-lg">
                  {n.type === 'assigned' ? 'school' : 'info'}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">{n.title}</h4>
                <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{n.message}</p>
              </div>
            </div>

            <button
              onClick={() => setNotifications((prev) => prev.filter((item) => item.id !== n.id))}
              className="text-gray-400 hover:text-gray-600 p-1 shrink-0"
              title="Tutup"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>

          {n.type === 'assigned' && n.courseId && (
            <div className="flex items-center justify-end gap-2 pt-1 border-t border-gray-100">
              <button
                onClick={() => {
                  router.push(`/dashboard/materi?courseId=${n.courseId}`);
                  setNotifications((prev) => prev.filter((item) => item.id !== n.id));
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-xs">auto_stories</span>
                <span>Buka Materi Pelajaran</span>
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { getUserSession } from '@/app/actions';
import DashboardSidebar from './DashboardSidebar';
import TeacherAssignmentWatcher from './dashboard/TeacherAssignmentWatcher';
import PermissionWatcher from './dashboard/PermissionWatcher';

interface DashboardShellProps {
  children: React.ReactNode;
}

export default function DashboardShell({ children }: DashboardShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [user, setUser] = useState<{ userId?: string; role: string; name: string; email: string; permissions?: string[] } | null>(null);

  useEffect(() => {
    getUserSession().then((session) => {
      if (session) {
        setUser(session as any);
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* Real-time Teacher Assignment WebSocket Watcher & Toasts */}
      <TeacherAssignmentWatcher currentUserId={user?.userId} currentUserRole={user?.role} />

      {/* Real-time Multi-Permission WebSocket Watcher */}
      <PermissionWatcher currentUserId={user?.userId} onUserRefreshed={(updatedUser) => setUser(updatedUser)} />

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <DashboardSidebar 
        isSidebarOpen={isSidebarOpen}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        user={user}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden lg:block text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <span className="material-symbols-outlined">
                {isSidebarOpen ? 'format_indent_decrease' : 'format_indent_increase'}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-900 leading-none">{user?.name || 'Loading...'}</p>
              <p className="text-xs text-gray-500 mt-1 capitalize">{user?.role?.toLowerCase() || ''}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

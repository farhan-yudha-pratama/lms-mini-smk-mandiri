'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { logoutAction } from '@/app/actions';
import { hasPermission, hasAnyPermission, PermissionCode } from '@/lib/permissions';

interface DashboardSidebarProps {
  isSidebarOpen: boolean;
  isMobileOpen: boolean;
  setIsMobileOpen: (isOpen: boolean) => void;
  user: { role: string; name: string; email: string; permissions?: string[] } | null;
}

interface MenuItem {
  label: string;
  icon: string;
  href: string;
  permission?: PermissionCode | PermissionCode[];
  rolesOnly?: string[];
}

export default function DashboardSidebar({
  isSidebarOpen,
  isMobileOpen,
  setIsMobileOpen,
  user,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAction();
    router.push('/login');
  };

  const ALL_MENU_ITEMS: MenuItem[] = [
    { label: 'Overview', icon: 'dashboard', href: '/dashboard' },
    { label: 'Manajemen Pengguna', icon: 'group', href: '/dashboard/users', permission: 'USERS_MANAGE' },
    { label: 'Manajemen Permission', icon: 'verified_user', href: '/dashboard/permissions', permission: 'USERS_MANAGE' },
    { label: 'Manajemen Kelas', icon: 'school', href: '/dashboard/classes', permission: 'CLASSES_MANAGE' },
    { label: 'Mata Pelajaran', icon: 'auto_stories', href: '/dashboard/courses', permission: 'COURSES_MANAGE' },
    { label: 'Mapel Saya', icon: 'book', href: '/dashboard/my-courses', rolesOnly: ['GURU'], permission: 'MATERI_MANAGE' },
    { label: 'Kelola Materi', icon: 'menu_book', href: '/dashboard/materi', permission: 'MATERI_MANAGE' },
    { label: 'Summary AI', icon: 'summarize', href: '/dashboard/summaries', permission: 'SUMMARIES_MANAGE' },
    { label: 'Akses Siswa', icon: 'lock_open', href: '/dashboard/student-access', permission: 'STUDENT_ACCESS_MANAGE' },
    { label: 'Project Siswa', icon: 'terminal', href: '/dashboard/student-projects', permission: 'STUDENT_PROJECTS_VIEW' },
    { label: 'Manajemen Kuis', icon: 'quiz', href: '/dashboard/quizzes', permission: ['QUIZZES_MANAGE', 'QUIZZES_GRADE'] },
    { label: 'Buku Nilai (Matrix)', icon: 'grading', href: '/dashboard/gradebook', permission: 'GRADEBOOK_VIEW' },
    { label: 'Buku Arsip Kuis', icon: 'inventory_2', href: '/dashboard/archives', permission: 'ARCHIVES_VIEW' },
    { label: 'Laporan Belajar', icon: 'analytics', href: '/dashboard/reports', permission: 'REPORTS_VIEW' },
    { label: 'Audit Logs', icon: 'history', href: '/dashboard/audit-logs', permission: 'AUDIT_LOGS_VIEW' },
    { label: 'Pengaturan', icon: 'settings', href: '/dashboard/settings', permission: 'SETTINGS_MANAGE' },
  ];

  const menuItems = ALL_MENU_ITEMS.filter((item) => {
    if (!user) return false;
    // Superadmin has access to all admin items
    if (user.role === 'SUPERADMIN') return true;

    // Filter by role if specifically restricted (e.g. Mapel Saya is for GURU)
    if (item.rolesOnly && !item.rolesOnly.includes(user.role)) {
      return false;
    }

    // If item doesn't require specific permission, show it (e.g. Overview)
    if (!item.permission) return true;

    // Check granular permissions
    if (Array.isArray(item.permission)) {
      return hasAnyPermission(user, item.permission);
    }
    return hasPermission(user, item.permission);
  });

  return (
    <aside
      className={`fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-gray-200 z-50 flex flex-col transition-all duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0
        ${isSidebarOpen ? 'w-64' : 'w-20'}
      `}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-white text-lg">admin_panel_settings</span>
          </div>
          {isSidebarOpen && (
            <span className="font-bold text-gray-800 text-lg whitespace-nowrap">Admin Panel</span>
          )}
        </div>
        {/* Close button on mobile */}
        <button className="lg:hidden text-gray-500 hover:text-gray-800" onClick={() => setIsMobileOpen(false)}>
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    active
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">{item.icon}</span>
                  {isSidebarOpen && <span className="font-medium whitespace-nowrap">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200 shrink-0">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-red-600 hover:bg-red-50 transition-colors"
        >
          <span className="material-symbols-outlined text-xl">logout</span>
          {isSidebarOpen && <span className="font-medium whitespace-nowrap">Logout</span>}
        </button>
      </div>
    </aside>
  );
}

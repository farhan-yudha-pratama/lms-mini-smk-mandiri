'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSocket } from '@/lib/socket/client';
import {
  PERMISSION_CATEGORIES,
  PERMISSION_PACKAGES,
} from '@/lib/permissions';
import ManagePermissionsModal from '../users/components/ManagePermissionsModal';
import { UserRow } from '../users/types';
import PackageModal, { PermissionPackageData } from './components/PackageModal';
import ApplyPackageModal from './components/ApplyPackageModal';
import {
  deletePermissionPackageAction,
  getPermissionPackagesAction,
} from '@/app/actions/permissions';

interface UserWithPermissions {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  permissions: string[];
}

interface PermissionsClientProps {
  initialUsers: UserWithPermissions[];
  catalog: any[];
  initialPackages?: any[];
  currentUserRole: string;
}

export default function PermissionsClient({
  initialUsers,
  catalog,
  initialPackages = [],
  currentUserRole,
}: PermissionsClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'users' | 'catalog' | 'packages'>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Packages State
  const [packages, setPackages] = useState<any[]>(
    initialPackages && initialPackages.length > 0 ? initialPackages : PERMISSION_PACKAGES
  );
  const [packageSearch, setPackageSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');

  // Package Modal states
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [selectedPackageForEdit, setSelectedPackageForEdit] = useState<PermissionPackageData | null>(null);

  // Apply Package Modal states
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedPackageForApply, setSelectedPackageForApply] = useState<any | null>(null);

  // Delete Package Dialog states
  const [packageToDelete, setPackageToDelete] = useState<any | null>(null);
  const [isDeletingPackage, setIsDeletingPackage] = useState(false);

  // Sync initial packages prop
  useEffect(() => {
    if (initialPackages && initialPackages.length > 0) {
      setPackages(initialPackages);
    }
  }, [initialPackages]);

  // Real-time synchronization via WebSocket
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handlePermissionsUpdated = () => {
      router.refresh();
      getPermissionPackagesAction().then((res) => {
        if (res.success && res.data) setPackages(res.data);
      });
    };

    socket.on('user:permissions_updated', handlePermissionsUpdated);
    socket.on('users:updated', handlePermissionsUpdated);

    return () => {
      socket.off('user:permissions_updated', handlePermissionsUpdated);
      socket.off('users:updated', handlePermissionsUpdated);
    };
  }, [router]);

  // Filtered users for Tab 1
  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return initialUsers;
    return initialUsers.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q)
    );
  }, [initialUsers, searchQuery]);

  // Available unique categories from packages
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    packages.forEach((p) => {
      if (p.category) cats.add(p.category);
    });
    return Array.from(cats);
  }, [packages]);

  // Category counts for packages
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    packages.forEach((p) => {
      const cat = p.category || 'Umum';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [packages]);

  // Filtered packages for Tab 3
  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      const matchesCategory =
        selectedCategoryFilter === 'ALL' || pkg.category === selectedCategoryFilter;
      const q = packageSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        pkg.name.toLowerCase().includes(q) ||
        (pkg.description && pkg.description.toLowerCase().includes(q)) ||
        (pkg.category && pkg.category.toLowerCase().includes(q)) ||
        (pkg.badge && pkg.badge.toLowerCase().includes(q)) ||
        (Array.isArray(pkg.permissions) &&
          pkg.permissions.some((perm: string) => perm.toLowerCase().includes(q)));
      return matchesCategory && matchesSearch;
    });
  }, [packages, selectedCategoryFilter, packageSearch]);

  // Package CRUD Handlers
  const handleOpenCreatePackage = () => {
    setSelectedPackageForEdit(null);
    setIsPackageModalOpen(true);
  };

  const handleOpenEditPackage = (pkg: any) => {
    setSelectedPackageForEdit({
      id: pkg.id,
      name: pkg.name,
      category: pkg.category || 'Umum',
      badge: pkg.badge || 'Custom',
      description: pkg.description || '',
      permissions: Array.isArray(pkg.permissions) ? pkg.permissions : [],
      isSystem: pkg.isSystem,
    });
    setIsPackageModalOpen(true);
  };

  const handleOpenDeletePackage = (pkg: any) => {
    if (pkg.isSystem) {
      setMessage({
        type: 'error',
        text: 'Paket sistem bawaan dilindungi dan tidak dapat dihapus.',
      });
      return;
    }
    setPackageToDelete(pkg);
  };

  const handleConfirmDelete = async () => {
    if (!packageToDelete) return;
    setIsDeletingPackage(true);
    try {
      const res = await deletePermissionPackageAction(packageToDelete.id);
      if (res.success) {
        setPackages((prev) => prev.filter((p) => p.id !== packageToDelete.id));
        setMessage({
          type: 'success',
          text: res.message || `Paket "${packageToDelete.name}" berhasil dihapus.`,
        });
        setPackageToDelete(null);
        router.refresh();
      } else {
        setMessage({
          type: 'error',
          text: res.message || 'Gagal menghapus paket permission.',
        });
      }
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.message || 'Terjadi kesalahan sistem saat menghapus paket.',
      });
    } finally {
      setIsDeletingPackage(false);
    }
  };

  const handlePackageModalSuccess = (msg: string) => {
    setMessage({ type: 'success', text: msg });
    setIsPackageModalOpen(false);
    setSelectedPackageForEdit(null);
    router.refresh();
    getPermissionPackagesAction().then((res) => {
      if (res.success && res.data) {
        setPackages(res.data);
      }
    });
  };

  const handleOpenApplyModal = (pkg: any) => {
    setSelectedPackageForApply(pkg);
    setIsApplyModalOpen(true);
  };

  const handleApplySuccess = (msg: string) => {
    setMessage({ type: 'success', text: msg });
    setIsApplyModalOpen(false);
    setSelectedPackageForApply(null);
    router.refresh();
  };

  // Stats
  const totalPermissions = catalog.length;
  const totalPackages = packages.length;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">verified_user</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Manajemen Hak Akses & Permission</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Konfigurasi granular otorisasi operasional guru, katalog permission, dan manajemen paket hak akses SMK Mandiri.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {message && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-sm animate-in fade-in duration-200 ${
            message.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base">
              {message.type === 'success' ? 'check_circle' : 'error'}
            </span>
            <span>{message.text}</span>
          </div>
          <button
            onClick={() => setMessage(null)}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-md"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
        <div className="border-b border-gray-200 px-6 pt-4 flex gap-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3.5 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'users'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
            }`}
          >
            <span className="material-symbols-outlined text-lg">manage_accounts</span>
            <span>Matriks Penugasan Pengguna</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-bold">
              {initialUsers.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`pb-3.5 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'catalog'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
            }`}
          >
            <span className="material-symbols-outlined text-lg">list_alt</span>
            <span>Katalog Izin & Kategori</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-bold">
              {totalPermissions}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('packages')}
            className={`pb-3.5 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'packages'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
            }`}
          >
            <span className="material-symbols-outlined text-lg">inventory_2</span>
            <span>Paket Preset (Bundles)</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-bold">
              {totalPackages}
            </span>
          </button>
        </div>

        {/* Tab 1: Matriks Penugasan Pengguna */}
        {activeTab === 'users' && (
          <div className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative max-w-sm w-full">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Cari nama, email, atau role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white transition-all"
                />
              </div>

              <div className="text-xs text-gray-500">
                Menampilkan <strong>{filteredUsers.length}</strong> pengguna
              </div>
            </div>

            <div className="overflow-x-auto border border-gray-100 rounded-xl">
              <table className="w-full text-left border-collapse min-w-max">
                <thead className="bg-gray-50/80 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th className="p-4 font-semibold">Pengguna</th>
                    <th className="p-4 font-semibold">Role Utama</th>
                    <th className="p-4 font-semibold">Status Izin</th>
                    <th className="p-4 font-semibold">Cakupan Izin Aktif</th>
                    <th className="p-4 font-semibold text-center w-28">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm bg-white">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-500 text-xs">
                        Tidak ada pengguna yang cocok dengan pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => {
                      const isSuperAdmin = user.role === 'SUPERADMIN';
                      return (
                        <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                                {user.name ? user.name[0].toUpperCase() : 'U'}
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 text-sm leading-tight">{user.name}</h4>
                                <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
                              </div>
                            </div>
                          </td>

                          <td className="p-4">
                            <span
                              className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                user.role === 'SUPERADMIN'
                                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                  : user.role === 'GURU'
                                  ? 'bg-teal-50 text-teal-700 border border-teal-200'
                                  : 'bg-gray-100 text-gray-600 border border-gray-200'
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>

                          <td className="p-4">
                            {isSuperAdmin ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700">
                                <span className="material-symbols-outlined text-sm">stars</span>
                                <span>Wildcard Penuh (*)</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700">
                                <span className="material-symbols-outlined text-sm">verified</span>
                                <span>{user.permissions.length} dari {catalog.length} Izin</span>
                              </span>
                            )}
                          </td>

                          <td className="p-4 max-w-md">
                            {isSuperAdmin ? (
                              <p className="text-xs text-gray-500 italic">
                                Memiliki wewenang tanpa batasan ke seluruh fitur & data LMS.
                              </p>
                            ) : user.permissions.length === 0 ? (
                              <p className="text-xs text-gray-400 italic">Belum ada izin khusus yang diberikan.</p>
                            ) : (
                              <div className="flex flex-wrap gap-1">
                                {user.permissions.slice(0, 4).map((p) => (
                                  <span
                                    key={p}
                                    className="px-2 py-0.5 text-[10px] font-mono bg-gray-100 text-gray-700 rounded border border-gray-200"
                                  >
                                    {p}
                                  </span>
                                ))}
                                {user.permissions.length > 4 && (
                                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-50 text-blue-600 rounded">
                                    +{user.permissions.length - 4} lainnya
                                  </span>
                                )}
                              </div>
                            )}
                          </td>

                          <td className="p-4 text-center">
                            <button
                              onClick={() =>
                                setSelectedUser({
                                  id: user.id,
                                  name: user.name,
                                  email: user.email,
                                  role: user.role as any,
                                  isActive: user.isActive,
                                  createdAt: user.createdAt,
                                })
                              }
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-1.5 shadow-2xs ${
                                isSuperAdmin
                                  ? 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                  : 'bg-blue-600 text-white hover:bg-blue-700'
                              }`}
                            >
                              <span className="material-symbols-outlined text-sm">tune</span>
                              <span>{isSuperAdmin ? 'Info Izin' : 'Atur Izin'}</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Katalog Izin & Kategori */}
        {activeTab === 'catalog' && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PERMISSION_CATEGORIES.map((category) => {
                const categoryItems = catalog.filter((p: any) => p.category === category);
                return (
                  <div key={category} className="border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                      <span className="font-bold text-gray-800 text-xs tracking-wide">{category}</span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold">
                        {categoryItems.length} Operasi
                      </span>
                    </div>

                    <div className="divide-y divide-gray-100 bg-white">
                      {categoryItems.map((item: any) => (
                        <div key={item.code} className="p-3.5 space-y-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-gray-900 text-xs">{item.name}</h4>
                            <code className="text-[10px] font-mono px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                              {item.code}
                            </code>
                          </div>
                          <p className="text-xs text-gray-500 leading-relaxed">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Paket Presets (Bundles) & CRUD Kategori Paket */}
        {activeTab === 'packages' && (
          <div className="p-6 space-y-6">
            {/* Action Bar: Search & Create Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-gray-900">Kelola Paket & Kategori Hak Akses</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Buat, edit, dan hapus paket izin serta kategorinya untuk penugasan wewenang guru secara massal.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleOpenCreatePackage}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-2xs inline-flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">add</span>
                  <span>Buat Paket Baru</span>
                </button>
              </div>
            </div>

            {/* Filter and Category Pills */}
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Search */}
                <div className="relative max-w-sm w-full">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base">
                    search
                  </span>
                  <input
                    type="text"
                    placeholder="Cari nama paket, kategori, atau badge..."
                    value={packageSearch}
                    onChange={(e) => setPackageSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-medium"
                  />
                </div>

                <div className="text-xs text-gray-500">
                  Menampilkan <strong>{filteredPackages.length}</strong> dari <strong>{packages.length}</strong> paket
                </div>
              </div>

              {/* Category Pills Bar */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <button
                  type="button"
                  onClick={() => setSelectedCategoryFilter('ALL')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    selectedCategoryFilter === 'ALL'
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                  }`}
                >
                  <span>Semua Kategori</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      selectedCategoryFilter === 'ALL'
                        ? 'bg-blue-700 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {packages.length}
                  </span>
                </button>

                {availableCategories.map((cat) => {
                  const count = categoryCounts[cat] || 0;
                  const isSelected = selectedCategoryFilter === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategoryFilter(cat)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                      }`}
                    >
                      <span>{cat}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          isSelected ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Packages Grid */}
            {filteredPackages.length === 0 ? (
              <div className="py-12 px-4 border border-dashed border-gray-200 rounded-2xl text-center space-y-3 bg-gray-50/50">
                <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-2xl">inventory_2</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-800">Tidak ada paket ditemukan</h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Tidak ada paket permission yang sesuai dengan filter &quot;{selectedCategoryFilter}&quot; atau pencarian Anda.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategoryFilter('ALL');
                    setPackageSearch('');
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">restart_alt</span>
                  <span>Reset Filter</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPackages.map((pkg) => {
                  const permList = Array.isArray(pkg.permissions) ? pkg.permissions : [];
                  const isSystem = Boolean(pkg.isSystem);

                  return (
                    <div
                      key={pkg.id || pkg.name}
                      className="bg-white border border-gray-200 hover:border-blue-400 rounded-2xl p-5 shadow-2xs transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        {/* Top Header: Category, Badge & Status */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                              {pkg.category || 'Umum'}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                              {pkg.badge || 'Paket'}
                            </span>
                          </div>

                          <div>
                            {isSystem ? (
                              <span
                                title="Paket bawaan sistem terlindungi dari penghapusan"
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200"
                              >
                                <span className="material-symbols-outlined text-xs">shield</span>
                                <span>Sistem</span>
                              </span>
                            ) : (
                              <span
                                title="Paket kustom yang dapat diedit dan dihapus"
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
                              >
                                <span className="material-symbols-outlined text-xs">tune</span>
                                <span>Kustom</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Title & Description */}
                        <div>
                          <h3 className="font-bold text-gray-900 text-base leading-snug">{pkg.name}</h3>
                          <p className="text-xs text-gray-500 leading-relaxed mt-1">
                            {pkg.description || 'Tidak ada deskripsi rinci untuk paket ini.'}
                          </p>
                        </div>

                        {/* Permissions Included */}
                        <div className="pt-2 border-t border-gray-100">
                          <p className="text-[11px] font-semibold text-gray-700 mb-2">
                            Izin Termasuk ({permList.length}):
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {permList.slice(0, 5).map((p: string) => (
                              <span
                                key={p}
                                className="px-2 py-0.5 text-[10px] font-mono bg-gray-50 text-gray-700 rounded border border-gray-200"
                              >
                                {p}
                              </span>
                            ))}
                            {permList.length > 5 && (
                              <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-50 text-blue-600 rounded">
                                +{permList.length - 5} lainnya
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                        {/* Apply Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenApplyModal(pkg)}
                          className="px-2.5 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5"
                          title="Terapkan hak akses paket ini ke profil guru"
                        >
                          <span className="material-symbols-outlined text-sm">assignment_ind</span>
                          <span>Terapkan</span>
                        </button>

                        {/* Edit & Delete Action Buttons */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEditPackage(pkg)}
                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit paket permission dan kategorinya"
                          >
                            <span className="material-symbols-outlined text-base">edit</span>
                          </button>

                          <button
                            type="button"
                            disabled={isSystem}
                            onClick={() => handleOpenDeletePackage(pkg)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isSystem
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-gray-500 hover:text-rose-600 hover:bg-rose-50 cursor-pointer'
                            }`}
                            title={
                              isSystem
                                ? 'Paket sistem bawaan tidak dapat dihapus'
                                : 'Hapus paket permission ini'
                            }
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal 1: Kelola Hak Akses Pengguna Per-Individu */}
      {selectedUser && (
        <ManagePermissionsModal
          user={selectedUser}
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          onSuccess={() => {
            setMessage({
              type: 'success',
              text: `Hak akses untuk "${selectedUser.name}" berhasil diperbarui. Perubahan tersinkronisasi secara real-time via WebSocket.`,
            });
            router.refresh();
          }}
        />
      )}

      {/* Modal 2: Create / Edit Paket Permission & Kategori */}
      <PackageModal
        isOpen={isPackageModalOpen}
        onClose={() => {
          setIsPackageModalOpen(false);
          setSelectedPackageForEdit(null);
        }}
        onSuccess={handlePackageModalSuccess}
        packageData={selectedPackageForEdit}
        catalog={catalog}
        availableCategories={availableCategories}
      />

      {/* Modal 3: Terapkan Paket Hak Akses pada Guru */}
      <ApplyPackageModal
        isOpen={isApplyModalOpen}
        onClose={() => {
          setIsApplyModalOpen(false);
          setSelectedPackageForApply(null);
        }}
        onSuccess={handleApplySuccess}
        pkg={selectedPackageForApply}
        users={initialUsers}
      />

      {/* Modal 4: Konfirmasi Hapus Paket Permission */}
      {packageToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">delete_forever</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Hapus Paket Hak Akses</h3>
                <p className="text-xs text-gray-500">Konfirmasi penghapusan paket permission.</p>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Apakah Anda yakin ingin menghapus paket{' '}
              <strong className="text-gray-900">&quot;{packageToDelete.name}&quot;</strong> (Kategori:{' '}
              <span className="font-semibold text-gray-800">{packageToDelete.category}</span>)?
              Tindakan ini tidak dapat dibatalkan. Pengguna atau guru yang telah menerima hak akses dari paket ini sebelumnya tidak akan terpengaruh.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setPackageToDelete(null)}
                disabled={isDeletingPackage}
                className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeletingPackage}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors inline-flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                {isDeletingPackage ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">delete</span>
                    <span>Ya, Hapus Paket</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
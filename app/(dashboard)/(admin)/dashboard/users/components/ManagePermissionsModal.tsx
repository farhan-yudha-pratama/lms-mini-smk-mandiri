'use client';

import { useState, useEffect } from 'react';
import { UserRow } from '../types';
import {
  PERMISSION_CATALOG,
  PERMISSION_CATEGORIES,
  PERMISSION_PACKAGES,
  PermissionCode,
} from '@/lib/permissions';
import {
  getUserPermissionsAction,
  updateUserPermissionsAction,
  getPermissionPackagesAction,
} from '@/app/actions/permissions';

interface ManagePermissionsModalProps {
  user: UserRow | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ManagePermissionsModal({
  user,
  isOpen,
  onClose,
  onSuccess,
}: ManagePermissionsModalProps) {
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());
  const [availablePackages, setAvailablePackages] = useState<any[]>(PERMISSION_PACKAGES);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load existing permissions and dynamic packages when modal opens
  useEffect(() => {
    if (!isOpen || !user) return;

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    // Fetch dynamic packages
    getPermissionPackagesAction().then((res) => {
      if (res.success && res.data && res.data.length > 0) {
        setAvailablePackages(res.data);
      }
    });

    getUserPermissionsAction(user.id)
      .then((res) => {
        if (res.success && res.data) {
          setSelectedPermissions(new Set(res.data.permissions));
        } else {
          setErrorMessage(res.message || 'Gagal memuat izin pengguna.');
        }
      })
      .catch((err) => {
        setErrorMessage(err.message || 'Terjadi kesalahan sistem.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  const isSuperAdmin = user.role === 'SUPERADMIN';

  // Toggle single permission
  const handleTogglePermission = (code: string) => {
    if (isSuperAdmin) return;
    const next = new Set(selectedPermissions);
    if (next.has(code)) {
      next.delete(code);
    } else {
      next.add(code);
    }
    setSelectedPermissions(next);
  };

  // Toggle all in category
  const handleToggleCategory = (category: string) => {
    if (isSuperAdmin) return;
    const categoryCodes = PERMISSION_CATALOG.filter((p) => p.category === category).map((p) => p.code);
    const allSelected = categoryCodes.every((c) => selectedPermissions.has(c));

    const next = new Set(selectedPermissions);
    if (allSelected) {
      categoryCodes.forEach((c) => next.delete(c));
    } else {
      categoryCodes.forEach((c) => next.add(c));
    }
    setSelectedPermissions(next);
  };

  // Apply a preset package
  const handleApplyPackage = (pkgId: string) => {
    if (isSuperAdmin) return;
    const pkg = availablePackages.find((p) => p.id === pkgId);
    if (pkg) {
      const perms = Array.isArray(pkg.permissions) ? pkg.permissions : [];
      setSelectedPermissions(new Set(perms));
    }
  };

  // Save changes
  const handleSave = async () => {
    if (isSuperAdmin) {
      onClose();
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await updateUserPermissionsAction({
        userId: user.id,
        permissionCodes: Array.from(selectedPermissions),
      });

      if (res.success) {
        setSuccessMessage(res.message);
        setTimeout(() => {
          if (onSuccess) onSuccess();
          onClose();
        }, 1200);
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal menyimpan perubahan.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-start justify-between bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">verified_user</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-900 text-lg">Kelola Hak Akses Pengguna</h3>
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
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                {user.name} ({user.email})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Preset Packages Quick Selector */}
        {!isSuperAdmin && (
          <div className="px-6 py-3.5 bg-blue-50/50 border-b border-blue-100/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-900">
              <span className="material-symbols-outlined text-base text-blue-600">auto_fix_high</span>
              <span>Terapkan Paket Cepat:</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {availablePackages.map((pkg) => (
                <button
                  key={pkg.id || pkg.name}
                  type="button"
                  onClick={() => handleApplyPackage(pkg.id)}
                  className="px-2.5 py-1 text-xs font-medium bg-white text-gray-700 hover:bg-blue-600 hover:text-white rounded-lg border border-gray-200 hover:border-blue-600 transition-all shadow-2xs cursor-pointer"
                  title={`${pkg.name} (${pkg.category}): ${pkg.description || ''}`}
                >
                  {pkg.badge || pkg.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Notifications */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-base">error</span>
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-base">check_circle</span>
            <span>{successMessage}</span>
          </div>
        )}

        {/* Body content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center text-gray-500">
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-3 text-xs font-medium">Memuat katalog & wewenang pengguna...</p>
            </div>
          ) : isSuperAdmin ? (
            <div className="p-6 bg-indigo-50/60 border border-indigo-100 rounded-xl text-center">
              <span className="material-symbols-outlined text-4xl text-indigo-600 mb-2">military_tech</span>
              <h4 className="font-bold text-gray-900 text-base">Hak Akses Superadmin Penuh</h4>
              <p className="text-xs text-gray-600 max-w-md mx-auto mt-1 leading-relaxed">
                Pengguna dengan peran <strong>Superadmin</strong> memiliki hak akses wildcard (`*`) ke seluruh fitur, modul, operasi, dan data sistem secara otomatis tanpa batasan.
              </p>
            </div>
          ) : (
            PERMISSION_CATEGORIES.map((category) => {
              const items = PERMISSION_CATALOG.filter((p) => p.category === category);
              const selectedCount = items.filter((p) => selectedPermissions.has(p.code)).length;
              const isAllCategorySelected = selectedCount === items.length;

              return (
                <div key={category} className="border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
                  {/* Category Header */}
                  <div className="px-4 py-2.5 bg-gray-50/90 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-800 text-xs tracking-wide">{category}</span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-200/80 text-gray-700 font-semibold">
                        {selectedCount}/{items.length} Aktif
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleCategory(category)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-semibold hover:underline"
                    >
                      {isAllCategorySelected ? 'Batal Pilih Semua' : 'Pilih Semua'}
                    </button>
                  </div>

                  {/* Permissions List */}
                  <div className="divide-y divide-gray-100 bg-white">
                    {items.map((perm) => {
                      const isChecked = selectedPermissions.has(perm.code);
                      return (
                        <label
                          key={perm.code}
                          className={`p-3.5 flex items-start gap-3.5 cursor-pointer transition-colors ${
                            isChecked ? 'bg-blue-50/30 hover:bg-blue-50/60' : 'hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleTogglePermission(perm.code)}
                            className="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-900 text-xs leading-none">{perm.name}</span>
                              <code className="text-[10px] font-mono px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                                {perm.code}
                              </code>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{perm.description}</p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <div className="text-xs text-gray-600 font-medium">
            {!isSuperAdmin && (
              <span>
                Total Terpilih: <strong>{selectedPermissions.size}</strong> dari {PERMISSION_CATALOG.length} Izin
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors"
            >
              {isSuperAdmin ? 'Tutup' : 'Batal'}
            </button>

            {!isSuperAdmin && (
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving || isLoading}
                className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl transition-all shadow-sm flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">save</span>
                    <span>Simpan Perubahan</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

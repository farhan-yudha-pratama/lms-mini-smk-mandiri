'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  createPermissionPackageAction,
  updatePermissionPackageAction,
} from '@/app/actions/permissions';

export interface PermissionPackageData {
  id?: string;
  name: string;
  category: string;
  badge: string;
  description: string;
  permissions: string[];
  isSystem?: boolean;
}

interface PackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (msg: string) => void;
  packageData: PermissionPackageData | null;
  catalog: any[];
  availableCategories?: string[];
}

export default function PackageModal({
  isOpen,
  onClose,
  onSuccess,
  packageData,
  catalog,
  availableCategories = [],
}: PackageModalProps) {
  const isEditing = Boolean(packageData?.id);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Umum');
  const [badge, setBadge] = useState('Custom');
  const [description, setDescription] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Group catalog by category
  const categoriesMap = useMemo(() => {
    const map = new Map<string, any[]>();
    for (const item of catalog) {
      const cat = item.category || 'Lainnya';
      const list = map.get(cat) || [];
      list.push(item);
      map.set(cat, list);
    }
    return map;
  }, [catalog]);

  const categories = useMemo(() => Array.from(categoriesMap.keys()), [categoriesMap]);

  const allCategoryOptions = useMemo(() => {
    const defaultCats = [
      'Pengajaran',
      'Kurikulum',
      'Asesmen',
      'Kesiswaan',
      'Administrasi',
      'Kejuruan',
      'Umum',
    ];
    return Array.from(new Set([...defaultCats, ...availableCategories]));
  }, [availableCategories]);

  // Initialize form state
  useEffect(() => {
    if (isOpen) {
      if (packageData) {
        setName(packageData.name || '');
        setCategory(packageData.category || 'Umum');
        setBadge(packageData.badge || 'Custom');
        setDescription(packageData.description || '');
        setSelectedPermissions(new Set(packageData.permissions || []));
      } else {
        setName('');
        setCategory('Pengajaran');
        setBadge('Reguler');
        setDescription('');
        setSelectedPermissions(new Set());
      }
      setSearchQuery('');
      setErrorMessage(null);
      // Auto-expand all categories by default
      setExpandedCategories(new Set(categories));
    }
  }, [isOpen, packageData, categories]);

  if (!isOpen) return null;

  // Toggle single permission
  const togglePermission = (code: string) => {
    setSelectedPermissions((prev) => {
      const next = new Set(prev);
      if (next.has(code)) {
        next.delete(code);
      } else {
        next.add(code);
      }
      return next;
    });
  };

  // Toggle category
  const toggleCategory = (catName: string) => {
    const items = categoriesMap.get(catName) || [];
    const itemCodes = items.map((i) => i.code);
    const allSelected = itemCodes.every((code) => selectedPermissions.has(code));

    setSelectedPermissions((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        itemCodes.forEach((c) => next.delete(c));
      } else {
        itemCodes.forEach((c) => next.add(c));
      }
      return next;
    });
  };

  const toggleAccordion = (catName: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(catName)) {
        next.delete(catName);
      } else {
        next.add(catName);
      }
      return next;
    });
  };

  // Select all / Deselect all
  const selectAll = () => {
    setSelectedPermissions(new Set(catalog.map((c) => c.code)));
  };

  const clearAll = () => {
    setSelectedPermissions(new Set());
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Nama paket wajib diisi.');
      return;
    }
    if (selectedPermissions.size === 0) {
      setErrorMessage('Pilih setidaknya 1 hak akses untuk paket ini.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const payload = {
      name: name.trim(),
      category: category.trim() || 'Umum',
      badge: badge.trim() || 'Custom',
      description: description.trim() || undefined,
      permissions: Array.from(selectedPermissions),
    };

    try {
      let res;
      if (isEditing && packageData?.id) {
        res = await updatePermissionPackageAction(packageData.id, payload);
      } else {
        res = await createPermissionPackageAction(payload);
      }

      if (res.success) {
        onSuccess(res.message);
        onClose();
      } else {
        setErrorMessage(res.message || 'Gagal menyimpan paket permission.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">
                {isEditing ? 'edit_square' : 'add_box'}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {isEditing ? 'Edit Paket Permission' : 'Buat Paket Permission Baru'}
              </h2>
              <p className="text-xs text-gray-500">
                Kustomisasi paket preset hak akses untuk mempermudah penugasan wewenang guru secara 1-klik.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2 shrink-0">
            <span className="material-symbols-outlined text-base">error</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Metadata Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-bold text-gray-700">
                Nama Paket <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Paket Koordinator Lab TKJ"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Badge Label</label>
              <input
                type="text"
                placeholder="Contoh: Lab TKJ"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">
                Kategori Paket <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                list="category-suggestions"
                required
                placeholder="Pilih atau ketik kategori baru..."
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-medium"
              />
              <datalist id="category-suggestions">
                {allCategoryOptions.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-bold text-gray-700">Deskripsi Singkat</label>
              <input
                type="text"
                placeholder="Jelaskan peran atau cakupan fungsi paket ini..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-medium"
              />
            </div>
          </div>

          {/* Permissions Selection Header */}
          <div className="border-t border-gray-100 pt-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Cakupan Izin Operasional ({selectedPermissions.size} dari {catalog.length} Dipilih)
                </h3>
                <p className="text-[11px] text-gray-500">
                  Centang wewenang fitur yang otomatis diberikan saat paket ini diaplikasikan pada pengguna.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={selectAll}
                  className="px-2.5 py-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                >
                  Pilih Semua
                </button>
                <button
                  type="button"
                  onClick={clearAll}
                  className="px-2.5 py-1 text-[11px] font-semibold text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                >
                  Kosongkan
                </button>
              </div>
            </div>

            {/* Search permissions filter */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                search
              </span>
              <input
                type="text"
                placeholder="Cari izin berdasarkan nama atau kode (misal: 'MATERI', 'KUIS', 'KELAS')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-4 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
              />
            </div>

            {/* Category Groups List */}
            <div className="space-y-3 pt-2">
              {categories.map((catName) => {
                const items = categoriesMap.get(catName) || [];
                const filteredItems = searchQuery
                  ? items.filter(
                      (item) =>
                        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
                    )
                  : items;

                if (filteredItems.length === 0) return null;

                const selectedInCat = filteredItems.filter((i) => selectedPermissions.has(i.code)).length;
                const isAllSelectedInCat = selectedInCat === filteredItems.length && filteredItems.length > 0;
                const isExpanded = expandedCategories.has(catName) || Boolean(searchQuery);

                return (
                  <div
                    key={catName}
                    className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-2xs"
                  >
                    {/* Category Bar */}
                    <div className="px-4 py-2.5 bg-gray-50/80 border-b border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isAllSelectedInCat}
                          onChange={() => toggleCategory(catName)}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer"
                        />
                        <button
                          type="button"
                          onClick={() => toggleAccordion(catName)}
                          className="text-left font-bold text-xs text-gray-800 hover:text-blue-600 flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>{catName}</span>
                          <span className="material-symbols-outlined text-sm text-gray-400">
                            {isExpanded ? 'expand_less' : 'expand_more'}
                          </span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            selectedInCat > 0
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          {selectedInCat} / {filteredItems.length} Dipilih
                        </span>
                      </div>
                    </div>

                    {/* Permissions in Category */}
                    {isExpanded && (
                      <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-2 bg-white">
                        {filteredItems.map((item) => {
                          const isChecked = selectedPermissions.has(item.code);
                          return (
                            <label
                              key={item.code}
                              className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer ${
                                isChecked
                                  ? 'bg-blue-50/50 border-blue-200 text-gray-900'
                                  : 'bg-white border-gray-100 hover:border-gray-200 text-gray-600'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => togglePermission(item.code)}
                                className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer shrink-0"
                              />
                              <div className="space-y-0.5 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                  <span className="text-xs font-bold text-gray-900 truncate">
                                    {item.name}
                                  </span>
                                  <code className="text-[9px] font-mono px-1 py-0.5 bg-gray-100 text-gray-600 rounded shrink-0">
                                    {item.code}
                                  </code>
                                </div>
                                <p className="text-[11px] text-gray-500 leading-tight line-clamp-2">
                                  {item.description}
                                </p>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="p-5 border-t border-gray-100 flex items-center justify-between bg-slate-50/60 shrink-0">
          <div className="text-xs text-gray-500">
            Total hak akses terpilih:{' '}
            <strong className="text-blue-600">{selectedPermissions.size}</strong> izin
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-all shadow-2xs cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">save</span>
                  <span>{isEditing ? 'Simpan Perubahan' : 'Buat Paket'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useRef, useEffect } from 'react';
import { UsersTableProps, UserRow } from '../types';
import { formatDate } from '@/lib/user-helpers';

export default function UsersTable({
  users,
  selectedIds,
  sortColumn,
  sortDirection,
  onSelectAll,
  onSelectOne,
  onSort,
  onEditName,
  onDeleteUser,
}: UsersTableProps) {
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!activeDropdownId) return;
    const handleClick = () => setActiveDropdownId(null);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [activeDropdownId]);
  const getSortIcon = (col: keyof UserRow) => {
    if (sortColumn !== col) return 'unfold_more';
    return sortDirection === 'asc' ? 'expand_less' : 'expand_more';
  };

  const isAllSelected = users.length > 0 && users.every(u => selectedIds.has(u.id));

  return (
    <div className="w-full">
      {/* Mobile Actions Header (Select All) */}
      <div className="md:hidden mb-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
        <input
          type="checkbox"
          id="selectAllMobile"
          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          checked={isAllSelected}
          onChange={(e) => onSelectAll(e.target.checked)}
        />
        <label htmlFor="selectAllMobile" className="text-sm font-semibold text-gray-700 cursor-pointer">
          Pilih Semua Pengguna
        </label>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden flex flex-col gap-3">
        {users.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-gray-200 shadow-sm text-gray-500 text-sm">
            Tidak ada data pengguna yang ditemukan.
          </div>
        ) : (
          users.map(user => (
            <div key={user.id} className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col relative transition-shadow hover:shadow-md">
              <div className="flex items-start gap-3">
                <div className="pt-1">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    checked={selectedIds.has(user.id)}
                    onChange={(e) => onSelectOne(user.id, e.target.checked)}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div className="pr-8">
                      <h3 className="font-bold text-gray-900 text-base leading-tight mb-1">{user.name}</h3>
                      <p className="text-xs text-gray-500 mb-2 truncate">{user.email}</p>

                      <div className="flex items-center gap-2 mb-3">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                          ${user.role === 'SUPERADMIN' ? 'bg-indigo-50 text-indigo-600' :
                            user.role === 'GURU' ? 'bg-teal-50 text-teal-600' :
                              'bg-slate-100 text-slate-600'}
                        `}>
                          {user.role}
                        </span>
                        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold
                          ${user.isActive ? 'text-emerald-600' : 'text-rose-600'}
                        `}>
                          <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                          {user.isActive ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </div>
                    </div>

                    {/* Mobile Dropdown Menu */}
                    <div className="absolute top-3 right-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDropdownId(activeDropdownId === user.id ? null : user.id);
                        }}
                        className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <span className="material-symbols-outlined text-xl">more_vert</span>
                      </button>

                      {activeDropdownId === user.id && (
                        <div className="absolute right-0 top-10 mt-1 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                          <button
                            onClick={() => { setActiveDropdownId(null); onEditName && onEditName(user); }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span> Ubah Nama
                          </button>
                          <button
                            onClick={() => { setActiveDropdownId(null); onDeleteUser && onDeleteUser(user); }}
                            className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span> Hapus
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-[11px] text-gray-400 font-medium pt-2 border-t border-gray-50 flex justify-between">
                    Terdaftar: {formatDate(user.createdAt)}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-max">
          <thead className="sticky top-0 z-10 backdrop-blur-md bg-white/90 border-b border-gray-200 text-sm text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="p-4 w-12 rounded-tl-xl">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  checked={isAllSelected}
                  onChange={(e) => onSelectAll(e.target.checked)}
                />
              </th>
              <th className="p-4 font-semibold cursor-pointer hover:text-gray-900 transition-colors" onClick={() => onSort('name')}>
                <div className="flex items-center gap-1">Nama <span className="material-symbols-outlined text-[16px]">{getSortIcon('name')}</span></div>
              </th>
              <th className="p-4 font-semibold cursor-pointer hover:text-gray-900 transition-colors" onClick={() => onSort('email')}>
                <div className="flex items-center gap-1">Email <span className="material-symbols-outlined text-[16px]">{getSortIcon('email')}</span></div>
              </th>
              <th className="p-4 font-semibold cursor-pointer hover:text-gray-900 transition-colors" onClick={() => onSort('role')}>
                <div className="flex items-center gap-1">Role <span className="material-symbols-outlined text-[16px]">{getSortIcon('role')}</span></div>
              </th>
              <th className="p-4 font-semibold cursor-pointer hover:text-gray-900 transition-colors" onClick={() => onSort('isActive')}>
                <div className="flex items-center gap-1">Status <span className="material-symbols-outlined text-[16px]">{getSortIcon('isActive')}</span></div>
              </th>
              <th className="p-4 font-semibold cursor-pointer hover:text-gray-900 transition-colors" onClick={() => onSort('createdAt')}>
                <div className="flex items-center gap-1">Terdaftar <span className="material-symbols-outlined text-[16px]">{getSortIcon('createdAt')}</span></div>
              </th>
              <th className="p-4 font-semibold text-center w-20 rounded-tr-xl">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm bg-white">
            {users.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500">
                  Tidak ada data pengguna yang ditemukan.
                </td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      checked={selectedIds.has(user.id)}
                      onChange={(e) => onSelectOne(user.id, e.target.checked)}
                    />
                  </td>
                  <td className="p-4 font-semibold text-gray-900">{user.name}</td>
                  <td className="p-4 text-gray-500">{user.email}</td>
                  <td className="p-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider
                      ${user.role === 'SUPERADMIN' ? 'bg-indigo-50 text-indigo-600' :
                        user.role === 'GURU' ? 'bg-teal-50 text-teal-600' :
                          'bg-slate-100 text-slate-600'}
                    `}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 font-medium
                      ${user.isActive ? 'text-emerald-600' : 'text-rose-600'}
                    `}>
                      <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                      {user.isActive ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500 font-medium">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="p-4 text-center relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDropdownId(activeDropdownId === user.id ? null : user.id);
                      }}
                      className={`p-1.5 rounded-lg transition-colors ${activeDropdownId === user.id ? 'bg-gray-200 text-gray-800' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}`}
                      title="Opsi"
                    >
                      <span className="material-symbols-outlined text-xl">more_horiz</span>
                    </button>

                    {activeDropdownId === user.id && (
                      <div className="absolute right-6 top-10 mt-1 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                        <button
                          onClick={() => { setActiveDropdownId(null); onEditName && onEditName(user); }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span> Ubah Nama
                        </button>
                        <button
                          onClick={() => { setActiveDropdownId(null); onDeleteUser && onDeleteUser(user); }}
                          className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span> Hapus
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

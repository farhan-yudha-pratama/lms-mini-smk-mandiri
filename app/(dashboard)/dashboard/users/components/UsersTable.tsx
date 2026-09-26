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
}: UsersTableProps) {
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
      <div className="md:hidden flex flex-col gap-4">
        {users.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-gray-200 shadow-sm text-gray-500 text-sm">
            Tidak ada data pengguna yang ditemukan.
          </div>
        ) : (
          users.map(user => (
            <div key={user.id} className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm flex items-start gap-3">
              <div className="pt-1">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  checked={selectedIds.has(user.id)}
                  onChange={(e) => onSelectOne(user.id, e.target.checked)}
                />
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <span className={`inline-flex px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider
                    ${user.role === 'SUPERADMIN' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                      user.role === 'GURU' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                        'bg-gray-50 text-gray-700 border border-gray-100'}
                  `}>
                    {user.role}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-100">
                  <span className={`inline-flex items-center gap-1.5
                    ${user.isActive ? 'text-emerald-600' : 'text-red-600'}
                  `}>
                    <span className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                    <span className="font-semibold">{user.isActive ? 'Aktif' : 'Non-aktif'}</span>
                  </span>
                  <span className="text-gray-400 font-medium">
                    {formatDate(user.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
              <th className="p-4 w-12">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  checked={isAllSelected}
                  onChange={(e) => onSelectAll(e.target.checked)}
                />
              </th>
              <th className="p-4 font-semibold cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => onSort('name')}>
                <div className="flex items-center gap-1">Nama <span className="material-symbols-outlined text-base">{getSortIcon('name')}</span></div>
              </th>
              <th className="p-4 font-semibold cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => onSort('email')}>
                <div className="flex items-center gap-1">Email <span className="material-symbols-outlined text-base">{getSortIcon('email')}</span></div>
              </th>
              <th className="p-4 font-semibold cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => onSort('role')}>
                <div className="flex items-center gap-1">Role <span className="material-symbols-outlined text-base">{getSortIcon('role')}</span></div>
              </th>
              <th className="p-4 font-semibold cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => onSort('isActive')}>
                <div className="flex items-center gap-1">Status <span className="material-symbols-outlined text-base">{getSortIcon('isActive')}</span></div>
              </th>
              <th className="p-4 font-semibold cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => onSort('createdAt')}>
                <div className="flex items-center gap-1">Terdaftar <span className="material-symbols-outlined text-base">{getSortIcon('createdAt')}</span></div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  Tidak ada data pengguna yang ditemukan.
                </td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      checked={selectedIds.has(user.id)}
                      onChange={(e) => onSelectOne(user.id, e.target.checked)}
                    />
                  </td>
                  <td className="p-4 font-medium text-gray-900">{user.name}</td>
                  <td className="p-4 text-gray-500">{user.email}</td>
                  <td className="p-4">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wide
                      ${user.role === 'SUPERADMIN' ? 'bg-blue-100 text-blue-700' :
                        user.role === 'GURU' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-gray-100 text-gray-700'}
                    `}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5
                      ${user.isActive ? 'text-emerald-600' : 'text-red-600'}
                    `}>
                      <span className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                      {user.isActive ? 'Aktif' : 'Non-aktif'}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500">
                    {formatDate(user.createdAt)}
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

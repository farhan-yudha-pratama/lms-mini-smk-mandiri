'use client';

import { useState, useMemo } from 'react';
import { cleanupLogsAction } from './actions';
import { auditLabels } from './audit-labels';

type AuditLog = {
  id: string;
  userId: string | null;
  action: string;
  message: string;
  meta: any;
  legacy: boolean;
  ipAddress: string | null;
  createdAt: string;
  user: { name: string; email: string } | null;
};

export default function AuditLogsView({ initialLogs, actors }: { initialLogs: any[], actors: string[] }) {
  const [logs] = useState<AuditLog[]>(initialLogs);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('ALL');
  const [filterActor, setFilterActor] = useState('ALL');

  // Pagination
  const [page, setPage] = useState(1);
  const perPage = 25;

  // Modal states
  const [showConfirm, setShowConfirm] = useState(false);
  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const confirmCleanup = () => {
    setShowConfirm(true);
  };

  const handleCleanup = async () => {
    setShowConfirm(false);
    setLoading(true);
    const res = await cleanupLogsAction(days);

    if (res.success) {
      setAlertMessage({ type: 'success', text: res.message });
      // Reload page after a short delay so user can read the success message
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } else {
      setAlertMessage({ type: 'error', text: res.message });
      setLoading(false);
    }
  };

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      if (filterAction !== 'ALL' && log.action !== filterAction) return false;
      if (filterActor !== 'ALL' && log.user?.name !== filterActor) return false;
      if (search) {
        const lowerSearch = search.toLowerCase();
        return (
          log.message.toLowerCase().includes(lowerSearch) ||
          log.user?.name?.toLowerCase().includes(lowerSearch) ||
          log.action.toLowerCase().includes(lowerSearch)
        );
      }
      return true;
    });
  }, [logs, search, filterAction, filterActor]);

  const paginatedLogs = useMemo(() => {
    return filteredLogs.slice((page - 1) * perPage, page * perPage);
  }, [filteredLogs, page]);

  const totalPages = Math.ceil(filteredLogs.length / perPage);

  // Exclude keys from labels config to get actions present in data
  const availableActions = Array.from(new Set(logs.map(l => l.action)));

  return (
    <div className="space-y-4">
      {/* Alert Banner */}
      {alertMessage && (
        <div className={`p-4 rounded-lg border ${alertMessage.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'} flex justify-between items-center`}>
          <p className="text-sm font-medium">{alertMessage.text}</p>
          <button onClick={() => setAlertMessage(null)} className="text-sm hover:opacity-75">Tutup</button>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Konfirmasi Hapus Log</h3>
              <p className="text-gray-600 text-sm">
                Apakah Anda yakin ingin menghapus log {days === 0 ? 'keseluruhan data (0 hari)' : `yang lebih tua dari ${days} hari`}? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Batal
              </button>
              <button
                onClick={handleCleanup}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Ya, Hapus Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100 justify-between items-start md:items-center">

        <div className="flex flex-wrap gap-3 items-center w-full md:w-auto">
          <input
            type="text"
            placeholder="Cari pesan atau pengguna..."
            className="border rounded px-3 py-1.5 text-sm w-full md:w-64 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
          <select
            className="border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={filterAction}
            onChange={e => { setFilterAction(e.target.value); setPage(1); }}
          >
            <option value="ALL">Semua Aksi</option>
            {availableActions.map(a => (
              <option key={a} value={a}>{auditLabels[a]?.label || a}</option>
            ))}
          </select>
          <select
            className="border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={filterActor}
            onChange={e => { setFilterActor(e.target.value); setPage(1); }}
          >
            <option value="ALL">Semua Pengguna</option>
            {actors.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 md:border-l md:pl-4">
          <select
            className="border rounded px-3 py-1.5 text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
          >
            <option value={0}>Semua Data (0 hari)</option>
            <option value={7}>&gt; 7 hari</option>
            <option value={30}>&gt; 30 hari</option>
            <option value={90}>&gt; 3 bulan</option>
            <option value={180}>&gt; 6 bulan</option>
          </select>
          <button
            onClick={confirmCleanup}
            disabled={loading}
            className="bg-red-600 text-white px-4 py-1.5 rounded text-sm hover:bg-red-700 disabled:opacity-50 whitespace-nowrap transition-colors"
          >
            {loading ? 'Processing...' : 'Hapus Log Lama'}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 border-b text-gray-700 font-medium">
            <tr>
              <th className="p-4 w-40">Tanggal</th>
              <th className="p-4 w-48">Pengguna</th>
              <th className="p-4 w-48">Aksi</th>
              <th className="p-4 min-w-[300px]">Detail</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {paginatedLogs.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  Tidak ada data log yang sesuai.
                </td>
              </tr>
            ) : (
              paginatedLogs.map((log) => (
                <LogRow key={log.id} log={log} />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <span className="text-sm text-gray-500">
            Menampilkan {(page - 1) * perPage + 1} - {Math.min(page * perPage, filteredLogs.length)} dari {filteredLogs.length} data
          </span>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 text-sm transition-colors"
            >
              Sebelumnnya
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 text-sm transition-colors">
              Selanjutnya
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function LogRow({ log }: { log: AuditLog }) {
  const [expanded, setExpanded] = useState(false);
  const labelConfig = auditLabels[log.action] || auditLabels['DEFAULT'];

  return (
    <>
      <tr className="hover:bg-gray-50 group">
        <td className="p-4 whitespace-nowrap align-top">
          {new Date(log.createdAt).toLocaleString('id-ID')}
        </td>
        <td className="p-4 align-top">
          {log.user ? (
            <div>
              <p className="font-medium text-gray-900">{log.user.name}</p>
              <p className="text-xs text-gray-500">{log.user.email}</p>
              <p className="text-[10px] font-mono text-gray-400 mt-1" title="IP Address">{log.ipAddress || '-'}</p>
            </div>
          ) : (
            <span className="text-gray-500 italic">Sistem</span>
          )}
        </td>
        <td className="p-4 align-top">
          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${labelConfig.color}`}>
            {labelConfig.label}
          </div>
          <div className="text-[10px] text-gray-400 font-mono mt-1 px-1">
            {log.action}
          </div>
        </td>
        <td className="p-4 align-top">
          <div className="text-gray-800 leading-relaxed max-w-2xl">
            {log.message}
          </div>
          <div className="mt-2 flex items-center gap-3">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              {expanded ? 'Sembunyikan data teknis' : 'Lihat data teknis'}
            </button>
            {log.legacy && (
              <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">Format Lama</span>
            )}
          </div>
        </td>
      </tr>
      {expanded && (
        <tr className="bg-slate-50">
          <td colSpan={4} className="p-4 border-t border-slate-100">
            <pre className="bg-slate-900 text-slate-300 p-4 rounded-lg text-xs overflow-x-auto font-mono max-w-full">
              {JSON.stringify(log.meta, null, 2)}
            </pre>
          </td>
        </tr>
      )}
    </>
  );
}

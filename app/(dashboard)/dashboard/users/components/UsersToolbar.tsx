import { useState, useEffect } from 'react';
import { UsersToolbarProps } from '../types';

export default function UsersToolbar({
  selectedCount,
  isProcessing,
  onSearchChange,
  onBulkResetPassword,
  onBulkChangeRole,
  onBulkToggleActive,
}: UsersToolbarProps) {
  const [inputValue, setInputValue] = useState('');

  // Debounce effect lokal
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearchChange(inputValue);
    }, 300);

    return () => clearTimeout(handler);
  }, [inputValue, onSearchChange]);

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center">
      <div className="relative w-full xl:w-96">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
        <input
          type="text"
          placeholder="Cari nama, email, atau role..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
        <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg mr-2 border border-blue-100 flex-shrink-0">
          {selectedCount} terpilih
        </span>
        <button
          disabled={selectedCount === 0 || isProcessing}
          onClick={onBulkResetPassword}
          className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
        >
          Reset Password
        </button>

        <div className="hidden sm:block h-6 w-px bg-gray-300 mx-1"></div>

        <button
          disabled={selectedCount === 0 || isProcessing}
          onClick={() => onBulkChangeRole('MURID')}
          className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
        >
          Set Murid
        </button>
        <button
          disabled={selectedCount === 0 || isProcessing}
          onClick={() => onBulkChangeRole('GURU')}
          className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
        >
          Set Guru
        </button>

        <div className="hidden sm:block h-6 w-px bg-gray-300 mx-1"></div>

        <button
          disabled={selectedCount === 0 || isProcessing}
          onClick={() => onBulkToggleActive(true)}
          className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg hover:bg-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
        >
          Aktifkan
        </button>
        <button
          disabled={selectedCount === 0 || isProcessing}
          onClick={() => onBulkToggleActive(false)}
          className="px-3 py-1.5 bg-red-50 border border-red-200 text-red-700 rounded-lg hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
        >
          Nonaktifkan
        </button>
      </div>
    </div>
  );
}

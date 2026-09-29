import React from 'react';
import { FloatingActionBarProps } from '../types';

export default function FloatingActionBar({
  selectedCount,
  isProcessing,
  onClearSelection,
  onBulkResetPassword,
  onBulkChangeRole,
  onBulkToggleActive,
  onBulkDelete,
}: FloatingActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-10 fade-in duration-300 w-[95%] sm:w-auto">
      <div className="bg-gray-900 shadow-2xl rounded-2xl p-2 sm:p-3 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full max-w-5xl mx-auto border border-gray-700/50">
        
        {/* Info Section */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-start px-2">
          <span className="bg-blue-600/20 text-blue-400 text-sm font-bold px-3 py-1 rounded-full whitespace-nowrap">
            {selectedCount} Terpilih
          </span>
          <button 
            onClick={onClearSelection}
            className="text-gray-400 hover:text-white p-1 rounded-full transition-colors flex items-center justify-center"
            title="Batal Pilih"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        {/* Actions Section */}
        <div className="flex items-center flex-wrap sm:flex-nowrap gap-2 justify-center sm:justify-start w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
          <button
            disabled={isProcessing}
            onClick={onBulkResetPassword}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl disabled:opacity-50 text-sm font-medium transition-colors whitespace-nowrap"
          >
            Reset Sandi
          </button>
          
          <div className="h-6 w-px bg-gray-700 mx-1 hidden sm:block"></div>
          
          <button
            disabled={isProcessing}
            onClick={() => onBulkChangeRole('MURID')}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl disabled:opacity-50 text-sm font-medium transition-colors whitespace-nowrap"
          >
            Set Murid
          </button>
          <button
            disabled={isProcessing}
            onClick={() => onBulkChangeRole('GURU')}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl disabled:opacity-50 text-sm font-medium transition-colors whitespace-nowrap"
          >
            Set Guru
          </button>

          <div className="h-6 w-px bg-gray-700 mx-1 hidden sm:block"></div>

          <button
            disabled={isProcessing}
            onClick={() => onBulkToggleActive(true)}
            className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl disabled:opacity-50 text-sm font-medium transition-colors whitespace-nowrap"
          >
            Aktifkan
          </button>
          <button
            disabled={isProcessing}
            onClick={() => onBulkToggleActive(false)}
            className="px-4 py-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 rounded-xl disabled:opacity-50 text-sm font-medium transition-colors whitespace-nowrap"
          >
            Matikan
          </button>

          {onBulkDelete && (
            <>
              <div className="h-6 w-px bg-gray-700 mx-1 hidden sm:block"></div>
              <button
                disabled={isProcessing}
                onClick={onBulkDelete}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl disabled:opacity-50 text-sm font-medium transition-colors shadow-sm whitespace-nowrap"
              >
                Hapus
              </button>
            </>
          )}
        </div>
        
      </div>
    </div>
  );
}

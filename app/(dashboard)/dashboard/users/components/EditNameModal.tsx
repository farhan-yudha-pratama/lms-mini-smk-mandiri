import React, { useState, useEffect } from 'react';

interface EditNameModalProps {
  isOpen: boolean;
  initialName: string;
  onConfirm: (newName: string) => void;
  onCancel: () => void;
}

export default function EditNameModal({
  isOpen,
  initialName,
  onConfirm,
  onCancel,
}: EditNameModalProps) {
  const [name, setName] = useState(initialName);

  useEffect(() => {
    setName(initialName);
  }, [initialName, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div 
        className="bg-white rounded-xl border border-gray-200 shadow-xl w-full max-w-md overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Ubah Nama Pengguna
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Masukkan nama baru untuk pengguna ini. Nama akan diformat menjadi Title Case secara otomatis.
          </p>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama Pengguna"
            autoFocus
          />
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium text-sm"
          >
            Batal
          </button>
          <button
            onClick={() => onConfirm(name)}
            disabled={!name.trim()}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors font-medium text-sm"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

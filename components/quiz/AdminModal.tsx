'use client';

import React from 'react';

export type AdminModalType = 'info' | 'success' | 'warning' | 'error' | 'confirm';

export interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message?: React.ReactNode;
  type?: AdminModalType;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  isDestructive?: boolean;
}

export default function AdminModal({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  confirmText,
  cancelText = 'Batal',
  onConfirm,
  isDestructive = false,
}: AdminModalProps) {
  if (!isOpen) return null;

  const isConfirm = type === 'confirm' || Boolean(onConfirm);

  const config = {
    info: {
      icon: 'info',
      badgeBg: 'bg-blue-50 text-blue-600',
      btnBg: 'bg-blue-600 hover:bg-blue-700 text-white',
      defaultBtnText: 'Tutup',
    },
    success: {
      icon: 'check_circle',
      badgeBg: 'bg-emerald-50 text-emerald-600',
      btnBg: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      defaultBtnText: 'Selesai',
    },
    warning: {
      icon: 'warning',
      badgeBg: 'bg-amber-50 text-amber-600',
      btnBg: 'bg-amber-600 hover:bg-amber-700 text-white',
      defaultBtnText: 'Mengerti',
    },
    error: {
      icon: 'error',
      badgeBg: 'bg-red-50 text-red-600',
      btnBg: 'bg-red-600 hover:bg-red-700 text-white',
      defaultBtnText: 'Tutup',
    },
    confirm: {
      icon: isDestructive ? 'delete' : 'help',
      badgeBg: isDestructive ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600',
      btnBg: isDestructive
        ? 'bg-red-600 hover:bg-red-700 text-white'
        : 'bg-blue-600 hover:bg-blue-700 text-white',
      defaultBtnText: isDestructive ? 'Hapus' : 'Ya, Lanjutkan',
    },
  }[type] || {
    icon: 'info',
    badgeBg: 'bg-blue-50 text-blue-600',
    btnBg: 'bg-blue-600 hover:bg-blue-700 text-white',
    defaultBtnText: 'Tutup',
  };

  const finalConfirmText = confirmText || config.defaultBtnText;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-xl border border-gray-200 p-6 shadow-xl max-w-sm w-full animate-in fade-in zoom-in-95 duration-150 relative"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start gap-4">
          <div className={`p-2.5 rounded-lg shrink-0 ${config.badgeBg}`}>
            <span className="material-symbols-outlined text-2xl block">
              {config.icon}
            </span>
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <h3 className="text-base font-semibold text-gray-900 leading-snug">
              {title}
            </h3>
            {message && (
              <div className="text-sm text-gray-600 mt-2 leading-relaxed break-words">
                {message}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end items-center gap-2.5">
          {isConfirm ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={() => {
                  onConfirm?.();
                  onClose();
                }}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors shadow-sm ${config.btnBg}`}
              >
                {finalConfirmText}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors shadow-sm ${config.btnBg}`}
            >
              {finalConfirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';

export interface QuizModalProps {
  isOpen: boolean;
  type?: 'info' | 'warning' | 'error' | 'success' | 'confirm';
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  isDestructive?: boolean;
}

export default function QuizModal({
  isOpen,
  type = 'info',
  title,
  message,
  confirmText = 'OK',
  cancelText = 'Batal',
  onConfirm,
  onCancel,
  isDestructive = false
}: QuizModalProps) {
  if (!isOpen) return null;

  const isConfirm = type === 'confirm' || (onConfirm && onCancel);

  // Icon and accent styling based on type
  const typeConfig = {
    error: {
      icon: 'error',
      badgeBg: 'bg-[#FF6B6B] text-white',
      confirmBg: 'bg-[#FF6B6B] text-white hover:bg-red-600',
    },
    warning: {
      icon: 'warning',
      badgeBg: 'bg-yellow-400 text-black',
      confirmBg: isDestructive ? 'bg-[#FF6B6B] text-white hover:bg-red-600' : 'bg-black text-white hover:bg-neutral-800',
    },
    success: {
      icon: 'check_circle',
      badgeBg: 'bg-[#8BBB92] text-black',
      confirmBg: 'bg-[#8BBB92] text-black hover:bg-emerald-400',
    },
    info: {
      icon: 'info',
      badgeBg: 'bg-[#4ECDC4] text-black',
      confirmBg: 'bg-black text-white hover:bg-neutral-800',
    },
    confirm: {
      icon: 'help',
      badgeBg: 'bg-yellow-300 text-black',
      confirmBg: isDestructive ? 'bg-[#FF6B6B] text-white hover:bg-red-600' : 'bg-black text-white hover:bg-neutral-800',
    }
  }[type] || {
    icon: 'info',
    badgeBg: 'bg-[#4ECDC4] text-black',
    confirmBg: 'bg-black text-white hover:bg-neutral-800',
  };

  return (
    <div className="fixed inset-0 z-[250] bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div 
        role="dialog"
        aria-modal="true"
        className="bg-[#F4F0EA] border-4 border-black p-6 md:p-8 max-w-lg w-full shadow-neo-xl space-y-5 animate-in zoom-in-95 duration-150"
      >
        {/* Header with Icon Badge */}
        <div className="flex items-start gap-4">
          <div className={`shrink-0 w-12 h-12 border-3 border-black flex items-center justify-center shadow-neo-sm ${typeConfig.badgeBg}`}>
            <span className="material-symbols-outlined text-2xl select-none">
              {typeConfig.icon}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-black leading-tight">
              {title}
            </h3>
          </div>
        </div>

        {/* Modal Body / Message */}
        <div className="text-sm md:text-base font-medium text-gray-800 leading-relaxed border-2 border-black/10 bg-white/70 p-4">
          {typeof message === 'string' ? <p>{message}</p> : message}
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2">
          {isConfirm && (
            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:w-auto px-6 py-3 border-3 border-black bg-white text-black font-black uppercase text-sm tracking-wider hover:bg-gray-100 transition-colors shadow-neo-sm hover:-translate-y-0.5"
            >
              {cancelText}
            </button>
          )}

          <button
            type="button"
            onClick={onConfirm || onCancel}
            className={`w-full sm:w-auto px-6 py-3 border-3 border-black font-black uppercase text-sm tracking-wider transition-all shadow-neo-sm hover:-translate-y-0.5 ${typeConfig.confirmBg}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

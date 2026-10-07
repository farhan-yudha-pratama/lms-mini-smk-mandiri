export const auditLabels: Record<string, { label: string; color: string }> = {
  // Red
  DELETE_CATEGORY: { label: 'Hapus Kategori', color: 'bg-red-100 text-red-800 border-red-200' },
  DELETE_PAGE: { label: 'Hapus Materi', color: 'bg-red-100 text-red-800 border-red-200' },
  RESET_QUIZ: { label: 'Reset Kuis', color: 'bg-red-100 text-red-800 border-red-200' },
  CLEANUP_LOGS: { label: 'Cleanup Log', color: 'bg-red-100 text-red-800 border-red-200' },
  
  // Yellow
  BYPASS_CATEGORY_ACCESS: { label: 'Bypass Kategori', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  BYPASS_PAGE_ACCESS: { label: 'Bypass Materi', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },

  // Blue
  UPDATE_CATEGORY: { label: 'Ubah Kategori', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  UPDATE_PAGE: { label: 'Ubah Materi', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  REORDER_CATEGORY: { label: 'Urutkan Kategori', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  REORDER_PAGE: { label: 'Urutkan Materi', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  UPDATE_ACCESS_STATUS: { label: 'Ubah Akses', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  BULK_UPDATE_ACCESS: { label: 'Bulk Ubah Akses', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  
  // Green
  CREATE_CATEGORY: { label: 'Buat Kategori', color: 'bg-green-100 text-green-800 border-green-200' },
  CREATE_PAGE: { label: 'Buat Materi', color: 'bg-green-100 text-green-800 border-green-200' },

  // Purple
  GRADE_ESSAY: { label: 'Nilai Essay', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  
  // Default
  DEFAULT: { label: 'Aksi Sistem', color: 'bg-gray-100 text-gray-800 border-gray-200' }
};

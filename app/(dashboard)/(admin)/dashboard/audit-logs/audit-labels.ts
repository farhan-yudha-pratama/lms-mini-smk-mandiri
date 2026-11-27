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
  ASSIGN_TEACHER_COURSE: { label: 'Tugaskan Guru', color: 'bg-green-100 text-green-800 border-green-200' },

  // Blue (Teacher class updates)
  UPDATE_TEACHER_COURSE_CLASSES: { label: 'Atur Kelas Guru', color: 'bg-blue-100 text-blue-800 border-blue-200' },

  // Red (Teacher & Student removal)
  REMOVE_TEACHER_COURSE: { label: 'Cabut Guru Mapel', color: 'bg-red-100 text-red-800 border-red-200' },
  REMOVE_STUDENT_COURSE: { label: 'Keluarkan Siswa Mapel', color: 'bg-red-100 text-red-800 border-red-200' },
  REMOVE_CLASS_STUDENTS_COURSE: { label: 'Keluarkan Kelas Mapel', color: 'bg-red-100 text-red-800 border-red-200' },

  // Purple
  GRADE_ESSAY: { label: 'Nilai Essay', color: 'bg-purple-100 text-purple-800 border-purple-200' },

  // Email Change
  REQUEST_EMAIL_CHANGE: { label: 'Minta OTP Email', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  CHANGE_EMAIL: { label: 'Ubah Email', color: 'bg-green-100 text-green-800 border-green-200' },

  // Password Reset
  REQUEST_PASSWORD_RESET: { label: 'Minta Reset Sandi', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  RESET_PASSWORD_SELF: { label: 'Reset Sandi Mandiri', color: 'bg-green-100 text-green-800 border-green-200' },

  // Diskusi Kelas
  ASSIGN_DISCUSSION_CLASS: { label: 'Assign Kelas Diskusi', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  UNASSIGN_DISCUSSION_CLASS: { label: 'Cabut Kelas Diskusi', color: 'bg-red-100 text-red-800 border-red-200' },
  GRADE_DISCUSSION: { label: 'Nilai Diskusi', color: 'bg-teal-100 text-teal-800 border-teal-200' },
  UPDATE_GRADEBOOK_CONFIG: { label: 'Atur Kuis Gradebook', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  
  // Default
  DEFAULT: { label: 'Aksi Sistem', color: 'bg-gray-100 text-gray-800 border-gray-200' }
};

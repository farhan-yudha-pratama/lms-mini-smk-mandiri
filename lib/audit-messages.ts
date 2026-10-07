import { formatStudent } from "./audit-context";

export function diffFields(before: Record<string, any>, after: Record<string, any>, labels: Record<string, string> = {}) {
  const diffs: string[] = [];
  for (const key of Object.keys(after)) {
    if (key === 'updatedAt' || key === 'createdAt') continue;
    
    let valBefore = before[key];
    let valAfter = after[key];
    
    // Normalize string null/empty
    if (valBefore === null && valAfter === '') valBefore = '';
    if (valBefore === '' && valAfter === null) valAfter = '';

    if (valBefore !== valAfter) {
      const label = labels[key] || key;
      diffs.push(`${label} "${valBefore}" → "${valAfter}"`);
    }
  }
  return diffs;
}

const statusMap: Record<string, string> = {
  'LOCKED': 'Terkunci',
  'UNLOCKED': 'Terbuka',
  'COMPLETED': 'Selesai'
};

export const msg = {
  resetQuiz: ({ student, pkg, previousScore, previousStatus }: any) => {
    return `Mereset kuis "${pkg.title}" (materi: ${pkg.pageTitle} · kategori: ${pkg.categoryName}) milik ${formatStudent(student)}. Nilai sebelumnya: ${previousScore ?? 'Belum ada'} (${previousStatus || '-'}).`;
  },
  
  gradeEssay: ({ student, pkg, gradedCount, beforeScore, afterScore, passed }: any) => {
    const passText = passed ? 'LULUS' : 'TIDAK LULUS';
    return `Menilai ${gradedCount} soal essay milik ${formatStudent(student)} pada kuis "${pkg.title}". Nilai berubah ${beforeScore ?? 0} → ${afterScore} (${passText}, KKM ${pkg.passingScore}).`;
  },
  
  bypassPage: ({ student, page, quizzes }: any) => {
    const quizText = quizzes.length > 0 ? ` dan memberi nilai 100 otomatis pada kuis "${quizzes[0].title}" (sebelumnya: ${quizzes[0].previousScore ?? '-'})` : '';
    return `Membuka materi "${page.title}" untuk ${formatStudent(student)}${quizText}.`;
  },
  
  bypassCategory: ({ student, category, pages, quizzes }: any) => {
    const quizText = quizzes.length > 0 ? ` dan memberi nilai 100 otomatis pada ${quizzes.length} kuis` : '';
    return `Membuka ${pages.length} materi di kategori "${category.name}" untuk ${formatStudent(student)}${quizText}.`;
  },
  
  updateAccess: ({ student, page, from, to }: any) => {
    const fromLabel = statusMap[from] || from || 'Tidak ada';
    const toLabel = statusMap[to] || to;
    return `Mengubah akses materi "${page.title}" (${page.categoryName}) untuk ${formatStudent(student)}: ${fromLabel} → ${toLabel}.`;
  },
  
  bulkAccess: ({ student, pages, to }: any) => {
    const toLabel = statusMap[to] || to;
    const pageTitles = pages.map((p: any) => p.title);
    let sample = pageTitles.slice(0, 3).join(', ');
    if (pages.length > 3) sample += `, +${pages.length - 3} lainnya`;
    return `Mengubah akses ${pages.length} materi untuk ${formatStudent(student)} menjadi ${toLabel}: ${sample}.`;
  },

  createCategory: ({ category }: any) => `Membuat kategori materi "${category.name}".`,
  updateCategory: ({ category, diffs }: any) => {
    if (diffs.length === 0) return `Mengubah kategori "${category.name}" tanpa perubahan data.`;
    return `Mengubah kategori "${category.name}": ${diffs.join(', ')}.`;
  },
  deleteCategory: ({ category }: any) => `Menghapus kategori "${category.name}" (mapel: ${category.courseName || '-'}).`,
  reorderCategory: ({ updates }: any) => `Mengubah urutan ${updates.length} kategori.`,

  createPage: ({ page }: any) => `Membuat materi "${page.title}" di kategori "${page.categoryName}" (${page.isPublished ? 'Published' : 'Draft'}).`,
  updatePage: ({ page, diffs }: any) => {
    if (diffs.length === 0) return `Mengubah materi "${page.title}" tanpa perubahan data.`;
    return `Mengubah materi "${page.title}": ${diffs.join(', ')}.`;
  },
  deletePage: ({ page, affectedSequences = 0 }: any) => `Menghapus materi "${page.title}" (kategori: ${page.categoryName}). Melepas ${affectedSequences} prasyarat materi lain.`,
  reorderPage: ({ category, updates }: any) => `Mengubah urutan ${updates.length} materi di kategori "${category.name}".`,

  cleanup: ({ olderThan, deletedCount }: any) => `Menghapus ${deletedCount} riwayat log audit yang lebih tua dari ${new Date(olderThan).toLocaleDateString('id-ID')}.`
};

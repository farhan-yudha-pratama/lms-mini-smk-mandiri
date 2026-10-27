import { db } from '@/prisma/db';
import { randomUUID } from 'crypto';

export interface QuizArchiveItem {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  classroomId: string | null;
  classroomName: string | null;
  sourceType: 'MATERIAL_QUIZ' | 'ASSIGNMENT';
  sourceId: string;
  sourceTitle: string;
  categoryName: string | null;
  pageTitle: string | null;
  pageSlug: string | null;
  score: number;
  passingScore: number;
  isPassed: boolean;
  totalQuestions: number;
  correctAnswers: number;
  essayCount: number;
  timeTakenSeconds: number | null;
  completedAt: string;
  createdAt: string;
}

export interface QuizArchivesResponse {
  items: QuizArchiveItem[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
  stats: {
    totalRecords: number;
    passedCount: number;
    failedCount: number;
    averageScore: number;
  };
}

/**
 * Mencatat hasil penyelesaian kuis ke QuizCompletionRecord (idempotent)
 * dan memperbarui agregasi StudentScoreSummary.
 */
export async function recordQuizCompletion(attemptId: string) {
  const attempt = await db.orm.public.QuizAttempt.where({ id: attemptId }).first();
  if (!attempt) return null;

  // 1. Cek idempotency: Jangan duplikasi jika sourceId sudah pernah dicatat
  const existingRecord = await db.orm.public.QuizCompletionRecord.where({ sourceId: attemptId }).first();
  if (existingRecord) {
    if (existingRecord.score !== (attempt.score ?? 0)) {
      await db.orm.public.QuizCompletionRecord.where({ id: existingRecord.id }).update({
        score: attempt.score ?? 0,
        isPassed: (attempt.score ?? 0) >= existingRecord.passingScore,
        completedAt: attempt.finishedAt || new Date().toISOString()
      });
    }
    // Tetap sinkronkan ringkasan nilai siswa
    await updateStudentScoreSummary(attempt.studentId);
    return existingRecord;
  }

  // 2. Ambil data relasi pendukung
  const [student, variant] = await Promise.all([
    db.orm.public.User.where({ id: attempt.studentId }).first(),
    db.orm.public.QuizVariant.where({ id: attempt.quizVariantId }).first()
  ]);

  if (!student || !variant) return null;

  const [pkg, classroom, questions, answers] = await Promise.all([
    db.orm.public.QuizPackage.where({ id: variant.quizPackageId }).first(),
    student.classId ? db.orm.public.Classroom.where({ id: student.classId }).first() : Promise.resolve(null),
    db.orm.public.Question.where({ quizVariantId: variant.id }).all(),
    db.orm.public.StudentAnswer.where({ quizAttemptId: attempt.id }).all()
  ]);

  if (!pkg) return null;

  // Ambil konteks materi / kategori jika ada
  let pageTitle: string | null = null;
  let pageSlug: string | null = null;
  let categoryName: string | null = null;

  if (pkg.pageId) {
    const page = await db.orm.public.Page.where({ id: pkg.pageId }).first();
    if (page) {
      pageTitle = page.title;
      pageSlug = page.slug;
      const category = await db.orm.public.MaterialCategory.where({ id: page.categoryId }).first();
      if (category) categoryName = category.name;
    }
  }

  const passingScore = pkg.passingScore || 70;
  const score = attempt.score ?? 0;
  const isPassed = score >= passingScore;
  const totalQuestions = questions.length;
  const correctAnswers = answers.filter(a => a.isCorrect === true).length;
  const essayCount = questions.filter(q => q.questionType === 'ESSAY' || q.questionType === 'CODE_CHALLENGE').length;

  let timeTakenSeconds: number | null = null;
  if (attempt.startedAt && attempt.finishedAt) {
    const startMs = new Date(attempt.startedAt).getTime();
    const finishMs = new Date(attempt.finishedAt).getTime();
    timeTakenSeconds = Math.max(0, Math.floor((finishMs - startMs) / 1000));
  }

  const completedAt = attempt.finishedAt || new Date().toISOString();

  // 3. Simpan ke QuizCompletionRecord
  const createdRecord = await db.orm.public.QuizCompletionRecord.create({
    id: randomUUID(),
    studentId: student.id,
    studentName: student.name,
    studentEmail: student.email,
    classroomId: classroom?.id || student.classId || null,
    classroomName: classroom?.name || null,
    sourceType: pkg.pageId ? 'MATERIAL_QUIZ' : 'ASSIGNMENT',
    sourceId: attempt.id,
    sourceTitle: pkg.title,
    categoryName,
    pageTitle,
    pageSlug,
    score,
    passingScore,
    isPassed,
    totalQuestions,
    correctAnswers,
    essayCount,
    timeTakenSeconds,
    completedAt,
    createdAt: new Date().toISOString()
  });

  // 4. Update akumulasi StudentScoreSummary
  await updateStudentScoreSummary(student.id);

  return createdRecord;
}

/**
 * Menghitung ulang dan memperbarui satu baris StudentScoreSummary
 */
export async function updateStudentScoreSummary(studentId: string) {
  const [student, records] = await Promise.all([
    db.orm.public.User.where({ id: studentId }).first(),
    db.orm.public.QuizCompletionRecord.where({ studentId }).all()
  ]);

  if (!student) return;

  const classroom = student.classId ? await db.orm.public.Classroom.where({ id: student.classId }).first() : null;

  const materialRecords = records.filter(r => r.sourceType === 'MATERIAL_QUIZ');
  const assignmentRecords = records.filter(r => r.sourceType === 'ASSIGNMENT');

  const totalMaterialQuizCompleted = materialRecords.length;
  const totalMaterialQuizPassed = materialRecords.filter(r => r.isPassed).length;
  const avgMaterial = totalMaterialQuizCompleted > 0
    ? Math.round((materialRecords.reduce((acc, r) => acc + r.score, 0) / totalMaterialQuizCompleted) * 10) / 10
    : null;

  const totalAssignmentCompleted = assignmentRecords.length;
  const totalAssignmentPassed = assignmentRecords.filter(r => r.isPassed).length;
  const avgAssignment = totalAssignmentCompleted > 0
    ? Math.round((assignmentRecords.reduce((acc, r) => acc + r.score, 0) / totalAssignmentCompleted) * 10) / 10
    : null;

  const totalCompleted = records.length;
  const overallAverageScore = totalCompleted > 0
    ? Math.round((records.reduce((acc, r) => acc + r.score, 0) / totalCompleted) * 10) / 10
    : null;

  const totalPointsEarned = records.reduce((acc, r) => acc + r.score, 0);

  // Cari aktivitas kuis terakhir
  let lastActivityAt: string | null = null;
  if (records.length > 0) {
    const sorted = [...records].sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
    lastActivityAt = sorted[0].completedAt;
  }

  // Hitung materi selesai unik
  const completedPageSlugs = new Set(materialRecords.map(r => r.pageSlug).filter(Boolean));
  const totalMaterialCompleted = completedPageSlugs.size;

  const existingSummary = await db.orm.public.StudentScoreSummary.where({ studentId }).first();

  if (existingSummary) {
    await db.orm.public.StudentScoreSummary.where({ id: existingSummary.id }).update({
      classroomId: classroom?.id || student.classId || null,
      classroomName: classroom?.name || null,
      totalMaterialQuizCompleted,
      totalMaterialQuizPassed,
      averageMaterialQuizScore: avgMaterial,
      totalAssignmentCompleted,
      totalAssignmentPassed,
      averageAssignmentScore: avgAssignment,
      overallAverageScore,
      totalPointsEarned,
      totalMaterialCompleted,
      lastActivityAt
    });
  } else {
    await db.orm.public.StudentScoreSummary.create({
      id: randomUUID(),
      studentId: student.id,
      classroomId: classroom?.id || student.classId || null,
      classroomName: classroom?.name || null,
      totalMaterialQuizCompleted,
      totalMaterialQuizPassed,
      averageMaterialQuizScore: avgMaterial,
      totalAssignmentCompleted,
      totalAssignmentPassed,
      averageAssignmentScore: avgAssignment,
      overallAverageScore,
      totalPointsEarned,
      totalMaterialCompleted,
      lastActivityAt
    });
  }
}

/**
 * Sinkronisasi seluruh attempt COMPLETED dalam satu kelas
 */
export async function syncClassroomQuizCompletions(classId: string, courseId?: string) {
  const students = await db.orm.public.User.where({ classId, role: 'MURID' }).all();
  if (!students.length) return { syncedCount: 0, totalCompleted: 0 };

  const studentIds = new Set(students.map(s => s.id));
  const attempts = await db.orm.public.QuizAttempt.all();
  const completedAttempts = attempts.filter(a => studentIds.has(a.studentId) && a.status === 'COMPLETED');

  // Filter berdasarkan course jika disediakan
  let targetAttempts = completedAttempts;
  if (courseId) {
    const packages = await db.orm.public.QuizPackage.where({ courseId }).all();
    const pkgIds = new Set(packages.map(p => p.id));
    const variants = await db.orm.public.QuizVariant.all();
    const targetVariantIds = new Set(variants.filter(v => pkgIds.has(v.quizPackageId)).map(v => v.id));
    targetAttempts = completedAttempts.filter(a => targetVariantIds.has(a.quizVariantId));
  }

  let syncedCount = 0;
  for (const attempt of targetAttempts) {
    const existing = await db.orm.public.QuizCompletionRecord.where({ sourceId: attempt.id }).first();
    if (!existing) {
      await recordQuizCompletion(attempt.id);
      syncedCount++;
    }
  }

  return { syncedCount, totalCompleted: targetAttempts.length };
}

/**
 * Mengambil daftar arsip dengan filter lengkap dan paginasi
 */
export async function getQuizArchives(params: {
  classId?: string;
  courseId?: string;
  categoryName?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<QuizArchivesResponse> {
  const page = Math.max(1, params.page || 1);
  const limit = Math.max(1, params.limit || 50);

  let records = await db.orm.public.QuizCompletionRecord.all();

  // 1. Filter Kelas
  if (params.classId) {
    records = records.filter(r => r.classroomId === params.classId);
  }

  // 2. Filter Kategori / Materi
  if (params.categoryName) {
    records = records.filter(r => r.categoryName === params.categoryName);
  }

  // 3. Filter Mata Pelajaran (via Course packages)
  if (params.courseId) {
    const packages = await db.orm.public.QuizPackage.where({ courseId: params.courseId }).all();
    const packageTitles = new Set(packages.map(p => p.title.toLowerCase().trim()));
    records = records.filter(r => packageTitles.has(r.sourceTitle.toLowerCase().trim()));
  }

  // 4. Filter Pencarian Nama / Email Siswa
  if (params.search && params.search.trim()) {
    const q = params.search.toLowerCase().trim();
    records = records.filter(r => 
      r.studentName.toLowerCase().includes(q) || 
      r.studentEmail.toLowerCase().includes(q) ||
      r.sourceTitle.toLowerCase().includes(q)
    );
  }

  // Urutkan dari yang paling baru diselesaikan
  records.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());

  // Statistik
  const totalRecords = records.length;
  const passedCount = records.filter(r => r.isPassed).length;
  const failedCount = totalRecords - passedCount;
  const totalScore = records.reduce((acc, r) => acc + r.score, 0);
  const averageScore = totalRecords > 0 ? Math.round((totalScore / totalRecords) * 10) / 10 : 0;

  // Paginasi
  const totalPages = Math.max(1, Math.ceil(totalRecords / limit));
  const startIndex = (page - 1) * limit;
  const paginatedItems = records.slice(startIndex, startIndex + limit);

  return {
    items: paginatedItems.map(r => ({
      id: r.id,
      studentId: r.studentId,
      studentName: r.studentName,
      studentEmail: r.studentEmail,
      classroomId: r.classroomId,
      classroomName: r.classroomName,
      sourceType: r.sourceType,
      sourceId: r.sourceId,
      sourceTitle: r.sourceTitle,
      categoryName: r.categoryName,
      pageTitle: r.pageTitle,
      pageSlug: r.pageSlug,
      score: r.score,
      passingScore: r.passingScore,
      isPassed: r.isPassed,
      totalQuestions: r.totalQuestions,
      correctAnswers: r.correctAnswers,
      essayCount: r.essayCount,
      timeTakenSeconds: r.timeTakenSeconds,
      completedAt: r.completedAt,
      createdAt: r.createdAt
    })),
    pagination: {
      page,
      limit,
      totalItems: totalRecords,
      totalPages
    },
    stats: {
      totalRecords,
      passedCount,
      failedCount,
      averageScore
    }
  };
}

export interface StudentArchiveDetailExport {
  studentId: string;
  name: string;
  email: string;
  totalCompleted: number;
  totalPassed: number;
  totalScore: number;
  averageScore: number;
  records: {
    quizTitle: string;
    categoryName: string;
    pageTitle: string;
    score: number;
    passingScore: number;
    isPassed: boolean;
    correctAnswers: number;
    totalQuestions: number;
    essayCount: number;
    completedAt: string;
  }[];
}

export interface ArchiveExportDetailResponse {
  className: string;
  courseName: string;
  quizzes: { id: string; title: string; passingScore: number }[];
  students: StudentArchiveDetailExport[];
}

export interface StudentArchiveSummaryItem {
  no: number;
  name: string;
  email: string;
  className: string;
  totalCompleted: number;
  totalPassed: number;
  totalPoints: number;
  averageScore: number;
  status: string;
}

export interface ArchiveExportSummaryResponse {
  className: string;
  courseName: string;
  items: StudentArchiveSummaryItem[];
}

/**
 * Mengambil data detail arsip kuis per murid untuk diekspor ke multi-sheet Excel
 */
export async function getArchiveExportDetailData(classId: string, courseId: string): Promise<ArchiveExportDetailResponse> {
  const [classroom, course, students, packages] = await Promise.all([
    db.orm.public.Classroom.where({ id: classId }).first(),
    db.orm.public.Course.where({ id: courseId }).first(),
    db.orm.public.User.where({ classId, role: 'MURID' }).all(),
    db.orm.public.QuizPackage.where({ courseId }).all()
  ]);

  const className = classroom?.name || 'Kelas';
  const courseName = course?.name || 'Mata Pelajaran';

  const packageTitles = new Set(packages.map(p => p.title.toLowerCase().trim()));
  const allRecords = await db.orm.public.QuizCompletionRecord.all();
  const studentIds = new Set(students.map(s => s.id));

  // Ambil record yang relevan
  const relevantRecords = allRecords.filter(r => 
    studentIds.has(r.studentId) && packageTitles.has(r.sourceTitle.toLowerCase().trim())
  );

  const studentsExport: StudentArchiveDetailExport[] = students.map(student => {
    const studentRecords = relevantRecords.filter(r => r.studentId === student.id);
    
    // Sort berdasarkan tanggal selesai
    studentRecords.sort((a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime());

    const totalCompleted = studentRecords.length;
    const totalPassed = studentRecords.filter(r => r.isPassed).length;
    const totalScore = studentRecords.reduce((acc, r) => acc + r.score, 0);
    const averageScore = totalCompleted > 0 ? Math.round((totalScore / totalCompleted) * 10) / 10 : 0;

    return {
      studentId: student.id,
      name: student.name,
      email: student.email,
      totalCompleted,
      totalPassed,
      totalScore,
      averageScore,
      records: studentRecords.map(r => ({
        quizTitle: r.sourceTitle,
        categoryName: r.categoryName || '-',
        pageTitle: r.pageTitle || r.sourceTitle,
        score: r.score,
        passingScore: r.passingScore,
        isPassed: r.isPassed,
        correctAnswers: r.correctAnswers,
        totalQuestions: r.totalQuestions,
        essayCount: r.essayCount,
        completedAt: r.completedAt
      }))
    };
  });

  return {
    className,
    courseName,
    quizzes: packages.map(p => ({ id: p.id, title: p.title, passingScore: p.passingScore || 70 })),
    students: studentsExport
  };
}

/**
 * Mengambil ringkasan penilaian satu kelas untuk diekspor ke 1 sheet Excel
 */
export async function getArchiveExportSummaryData(classId: string, courseId?: string): Promise<ArchiveExportSummaryResponse> {
  const [classroom, course, students, allRecords] = await Promise.all([
    db.orm.public.Classroom.where({ id: classId }).first(),
    courseId ? db.orm.public.Course.where({ id: courseId }).first() : Promise.resolve(null),
    db.orm.public.User.where({ classId, role: 'MURID' }).all(),
    db.orm.public.QuizCompletionRecord.all()
  ]);

  const className = classroom?.name || 'Kelas';
  const courseName = course?.name || 'Semua Mata Pelajaran';

  let relevantRecords = allRecords;
  if (courseId) {
    const packages = await db.orm.public.QuizPackage.where({ courseId }).all();
    const packageTitles = new Set(packages.map(p => p.title.toLowerCase().trim()));
    relevantRecords = allRecords.filter(r => packageTitles.has(r.sourceTitle.toLowerCase().trim()));
  }

  const items: StudentArchiveSummaryItem[] = students.map((student, index) => {
    const studentRecords = relevantRecords.filter(r => r.studentId === student.id);
    const totalCompleted = studentRecords.length;
    const totalPassed = studentRecords.filter(r => r.isPassed).length;
    const totalPoints = studentRecords.reduce((acc, r) => acc + r.score, 0);
    const averageScore = totalCompleted > 0 ? Math.round((totalPoints / totalCompleted) * 10) / 10 : 0;
    const status = totalCompleted === 0 ? 'Belum Ada Nilai' : averageScore >= 70 ? 'LULUS' : 'REMEDIAL';

    return {
      no: index + 1,
      name: student.name,
      email: student.email,
      className,
      totalCompleted,
      totalPassed,
      totalPoints,
      averageScore,
      status
    };
  });

  return {
    className,
    courseName,
    items
  };
}

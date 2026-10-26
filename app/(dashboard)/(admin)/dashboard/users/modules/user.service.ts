import { db } from '@/prisma/db';
import { Role, UserQuizHistoryDetails } from '../types';

export const userService = {
  /**
   * Mengambil semua pengguna dari database.
   */
  async getAllUsers() {
    return await db.orm.public.User.all();
  },

  /**
   * Reset kata sandi pengguna secara massal (paralel).
   */
  async bulkUpdatePassword(userIds: string[], hashedPassword: string) {
    await Promise.all(
      userIds.map(id =>
        db.orm.public.User.where({ id }).update({ password: hashedPassword })
      )
    );
  },

  /**
   * Ubah role pengguna secara massal (paralel).
   */
  async bulkUpdateRole(userIds: string[], newRole: Role) {
    await Promise.all(
      userIds.map(id =>
        db.orm.public.User.where({ id }).update({ role: newRole })
      )
    );
  },

  /**
   * Ubah status aktif pengguna secara massal (paralel).
   */
  async bulkUpdateActiveStatus(userIds: string[], isActive: boolean) {
    await Promise.all(
      userIds.map(id =>
        db.orm.public.User.where({ id }).update({ isActive })
      )
    );
  },

  /**
   * Mengubah nama pengguna.
   */
  async updateUserName(userId: string, newName: string) {
    await db.orm.public.User.where({ id: userId }).update({ name: newName });
  },

  /**
   * Mengambil rincian riwayat kuis dan relasi data pengguna.
   */
  async getUserQuizDetails(userId: string): Promise<UserQuizHistoryDetails> {
    const user = await db.orm.public.User.where({ id: userId }).first();
    if (!user) throw new Error('Pengguna tidak ditemukan');

    const [
      attempts,
      assignments,
      completionRecords,
      scoreSummary,
      courses,
      accesses,
      allPackages,
      allVariants
    ] = await Promise.all([
      db.orm.public.QuizAttempt.where({ studentId: userId }).all(),
      db.orm.public.QuizAssignment.where({ studentId: userId }).all(),
      db.orm.public.QuizCompletionRecord.where({ studentId: userId }).all(),
      db.orm.public.StudentScoreSummary.where({ studentId: userId }).first(),
      db.orm.public.CourseStudent.where({ studentId: userId }).all(),
      db.orm.public.PageAccess.where({ studentId: userId }).all(),
      db.orm.public.QuizPackage.all(),
      db.orm.public.QuizVariant.all()
    ]);

    const variantMap = new Map(allVariants.map(v => [v.id, v]));
    const packageMap = new Map(allPackages.map(p => [p.id, p]));

    const mappedAttempts = attempts.map(a => {
      const variant = variantMap.get(a.quizVariantId);
      const pkg = variant ? packageMap.get(variant.quizPackageId) : null;
      return {
        id: a.id,
        quizTitle: pkg?.title ? pkg.title.replace(/^\[ARSIP\]\s*/i, '') : 'Kuis Tidak Diketahui',
        status: a.status,
        score: a.score,
        startedAt: a.startedAt,
        finishedAt: a.finishedAt
      };
    });

    const mappedAssignments = assignments.map(assign => {
      const pkg = packageMap.get(assign.quizPackageId);
      const variant = variantMap.get(assign.quizVariantId);
      return {
        id: assign.id,
        quizTitle: pkg?.title ? `${pkg.title} (${variant?.name || 'Varian'})` : 'Kuis Ditugaskan',
        assignedAt: assign.assignedAt
      };
    });

    const mappedCompletions = completionRecords.map(rec => ({
      id: rec.id,
      sourceTitle: rec.sourceTitle,
      score: rec.score,
      isPassed: rec.isPassed,
      completedAt: rec.completedAt
    }));

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as Role
      },
      attempts: mappedAttempts,
      assignments: mappedAssignments,
      completionRecords: mappedCompletions,
      scoreSummary: scoreSummary ? {
        overallAverageScore: scoreSummary.overallAverageScore,
        totalPointsEarned: scoreSummary.totalPointsEarned,
        totalMaterialQuizCompleted: scoreSummary.totalMaterialQuizCompleted
      } : null,
      courseCount: courses.length,
      pageAccessCount: accesses.length
    };
  },

  /**
   * Menghapus seluruh riwayat kuis, lembar jawaban, dan penugasan kuis pengguna secara manual.
   */
  async clearUserQuizHistory(userId: string) {
    const attempts = await db.orm.public.QuizAttempt.where({ studentId: userId }).all();
    for (const a of attempts) {
      const answers = await db.orm.public.StudentAnswer.where({ quizAttemptId: a.id }).all();
      for (const ans of answers) {
        await db.orm.public.StudentAnswer.where({ id: ans.id }).delete();
      }
      await db.orm.public.QuizAttempt.where({ id: a.id }).delete();
    }

    // Hapus penugasan kuis
    const assignments = await db.orm.public.QuizAssignment.where({ studentId: userId }).all();
    for (const assign of assignments) {
      await db.orm.public.QuizAssignment.where({ id: assign.id }).delete();
    }

    // Hapus catatan arsip kuis & ringkasan nilai
    const completions = await db.orm.public.QuizCompletionRecord.where({ studentId: userId }).all();
    for (const comp of completions) {
      await db.orm.public.QuizCompletionRecord.where({ id: comp.id }).delete();
    }

    const summaries = await db.orm.public.StudentScoreSummary.where({ studentId: userId }).all();
    for (const sum of summaries) {
      await db.orm.public.StudentScoreSummary.where({ id: sum.id }).delete();
    }

    return {
      clearedAttempts: attempts.length,
      clearedAssignments: assignments.length,
      clearedCompletions: completions.length
    };
  },

  /**
   * Menghapus pengguna secara massal (hard delete).
   * Melakukan validasi bahwa riwayat kuis sudah kosong,
   * dan membersihkan sisa relasi administratif secara aman.
   */
  async bulkDeleteUsers(userIds: string[]) {
    for (const id of userIds) {
      const user = await db.orm.public.User.where({ id }).first();
      if (!user) continue;

      // 1. Cek apakah masih memiliki riwayat pengerjaan kuis
      const attempts = await db.orm.public.QuizAttempt.where({ studentId: id }).all();
      const completions = await db.orm.public.QuizCompletionRecord.where({ studentId: id }).all();

      if (attempts.length > 0 || completions.length > 0) {
        throw new Error(
          `Pengguna "${user.name}" masih memiliki riwayat kuis aktif (${attempts.length} pengerjaan, ${completions.length} arsip nilai). ` +
          `Silakan bersihkan riwayat kuis pengguna terlebih dahulu melalui menu "Cek Riwayat Kuis".`
        );
      }

      // 2. Bersihkan sisa relasi data administratif secara berurutan
      // Sisa penugasan kuis tanpa attempt
      const assignments = await db.orm.public.QuizAssignment.where({ studentId: id }).all();
      for (const assign of assignments) {
        await db.orm.public.QuizAssignment.where({ id: assign.id }).delete();
      }

      // Ringkasan nilai kosong jika ada
      const summaries = await db.orm.public.StudentScoreSummary.where({ studentId: id }).all();
      for (const sum of summaries) {
        await db.orm.public.StudentScoreSummary.where({ id: sum.id }).delete();
      }

      // Hak akses materi
      const accesses = await db.orm.public.PageAccess.where({ studentId: id }).all();
      for (const acc of accesses) {
        await db.orm.public.PageAccess.where({ id: acc.id }).delete();
      }

      // Relasi ke kelas mata pelajaran (siswa)
      const courses = await db.orm.public.CourseStudent.where({ studentId: id }).all();
      for (const cs of courses) {
        await db.orm.public.CourseStudent.where({ id: cs.id }).delete();
      }

      // Relasi penugasan guru ke mata pelajaran (guru)
      const teacherCourses = await db.orm.public.CourseTeacher.where({ teacherId: id }).all();
      for (const ct of teacherCourses) {
        await db.orm.public.CourseTeacher.where({ id: ct.id }).delete();
      }

      // Feedback essay yang pernah diberikan guru (set null agar feedback tidak hilang)
      const feedbacks = await db.orm.public.StudentAnswer.where({ feedbackAuthorId: id }).all();
      for (const fb of feedbacks) {
        await db.orm.public.StudentAnswer.where({ id: fb.id }).update({ feedbackAuthorId: null });
      }

      // Sesi login & log aktivitas
      await db.orm.public.Session.where({ userId: id }).delete();
      await db.orm.public.AuditLog.where({ userId: id }).delete();

      // Terakhir, hapus entitas pengguna
      await db.orm.public.User.where({ id }).delete();
    }
  },

  /**
   * Menghapus sesi / me-revoke token pengguna secara paksa.
   */
  async bulkRevokeSessions(userIds: string[]) {
    await Promise.all(
      userIds.map(id =>
        db.orm.public.Session.where({ userId: id }).delete()
      )
    );
  }
};

// lib/socket/emitter.ts
// Central WebSocket event dispatcher for WebPoint LMS

export interface QuizStartedEvent {
  attemptId: string;
  studentId: string;
  studentName: string;
  quizTitle?: string;
  packageId?: string;
  classId?: string | null;
  className?: string | null;
  status: 'IN_PROGRESS';
  startedAt: string;
}

export interface QuizAssignedEvent {
  packageId: string;
  pageSlug?: string | null;
  studentIds?: string[];
  classId?: string | null;
  assignedAt: string;
}

export interface QuizResetEvent {
  studentId: string;
  packageId: string;
  pageSlug?: string | null;
  resetAt: string;
}

export interface QuizGradedEvent {
  studentId: string;
  attemptId: string;
  packageId?: string;
  pageSlug?: string | null;
  score: number;
  isPassed: boolean;
  gradedAt: string;
}

export interface QuizCompletedEvent {
  attemptId: string;
  studentId: string;
  studentName: string;
  quizTitle?: string;
  score: number;
  isPassed: boolean;
  needsReview: boolean;
  classId?: string | null;
  className?: string | null;
  completedAt: string;
}

/**
 * Emit event ketika kuis mulai dikerjakan oleh murid.
 */
export function emitQuizStarted(payload: QuizStartedEvent) {
  try {
    const io = (globalThis as any).__io;
    if (io) {
      io.to('reports').emit('quiz:started', payload);
      io.emit('quiz:started', payload);
    }
  } catch (error) {
    console.error('[SocketEmitter] Failed to emit quiz:started:', error);
  }
}

/**
 * Emit event ketika kuis diselesaikan oleh murid atau di-grade/di-complete oleh guru.
 * ponytail: Global io singleton, graceful no-op jika server dijalankan tanpa socket.
 */
export function emitQuizCompleted(payload: QuizCompletedEvent) {
  try {
    const io = (globalThis as any).__io;
    if (io) {
      io.to('reports').emit('quiz:completed', payload);
      io.emit('quiz:completed', payload);
    }
  } catch (error) {
    console.error('[SocketEmitter] Failed to emit quiz:completed:', error);
  }
}

/**
 * Emit event ketika kuis ditugaskan (assigned) ke siswa atau kelas oleh Guru.
 */
export function emitQuizAssigned(payload: QuizAssignedEvent) {
  try {
    const io = (globalThis as any).__io;
    if (io) {
      io.emit('quiz:assigned', payload);
    }
  } catch (error) {
    console.error('[SocketEmitter] Failed to emit quiz:assigned:', error);
  }
}

/**
 * Emit event ketika riwayat pengerjaan kuis siswa direset oleh Guru/Admin.
 */
export function emitQuizReset(payload: QuizResetEvent) {
  try {
    const io = (globalThis as any).__io;
    if (io) {
      io.emit('quiz:reset', payload);
      io.to('reports').emit('quiz:reset', payload);
    }
  } catch (error) {
    console.error('[SocketEmitter] Failed to emit quiz:reset:', error);
  }
}

/**
 * Emit event ketika kuis/essay selesai dinilai oleh Guru.
 */
export function emitQuizGraded(payload: QuizGradedEvent) {
  try {
    const io = (globalThis as any).__io;
    if (io) {
      io.emit('quiz:graded', payload);
    }
  } catch (error) {
    console.error('[SocketEmitter] Failed to emit quiz:graded:', error);
  }
}

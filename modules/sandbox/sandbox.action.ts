'use server';

import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/session';
import {
  getStudentProjects,
  getStudentProjectById,
  createStudentProject,
  saveStudentProject,
  duplicateStudentProject,
  deleteStudentProject,
  getMaterialOptionsForStudent,
  getStudentsProjectMonitoringData,
  getStudentProjectsForAdmin,
} from './sandbox.service';
import { createProjectSchema, saveProjectSchema } from './sandbox.schema';
import { CourseMaterialOption, StudentProjectDetail, StudentProjectRecord } from './sandbox.types';

export type ActionResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
};

async function getAuthenticatedStudent() {
  const session = await getSession();
  if (!session || !session.userId) {
    return null;
  }
  return session;
}

/**
 * Mengambil seluruh proyek siswa
 */
export async function getStudentProjectsAction(): Promise<ActionResponse<StudentProjectDetail[]>> {
  const session = await getAuthenticatedStudent();
  if (!session) {
    return { success: false, message: 'Sesi tidak valid, silakan login kembali' };
  }

  try {
    const projects = await getStudentProjects(session.userId);
    return { success: true, message: 'Berhasil memuat proyek', data: projects };
  } catch (error) {
    console.error('getStudentProjectsAction error:', error);
    return { success: false, message: 'Gagal memuat daftar proyek' };
  }
}

/**
 * Mengambil detail satu proyek untuk editor workspace
 */
export async function getStudentProjectByIdAction(id: string): Promise<ActionResponse<StudentProjectDetail>> {
  const session = await getAuthenticatedStudent();
  if (!session) {
    return { success: false, message: 'Sesi tidak valid, silakan login kembali' };
  }

  try {
    const project = await getStudentProjectById(id, session.userId);
    if (!project) {
      return { success: false, message: 'Proyek tidak ditemukan atau akses ditolak' };
    }
    return { success: true, message: 'Berhasil memuat proyek', data: project };
  } catch (error) {
    console.error('getStudentProjectByIdAction error:', error);
    return { success: false, message: 'Gagal memuat detail proyek' };
  }
}

/**
 * Membuat proyek baru
 */
export async function createStudentProjectAction(input: unknown): Promise<ActionResponse<StudentProjectRecord>> {
  const session = await getAuthenticatedStudent();
  if (!session) {
    return { success: false, message: 'Sesi tidak valid, silakan login kembali' };
  }

  const parsed = createProjectSchema.safeParse(input);
  if (!parsed.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]?.toString() || 'general';
      if (!errors[key]) errors[key] = [];
      errors[key].push(issue.message);
    }
    return { success: false, message: 'Data proyek tidak valid', errors };
  }

  try {
    const created = await createStudentProject(session.userId, parsed.data);
    revalidatePath('/student/sandbox');
    return {
      success: true,
      message: 'Proyek berhasil dibuat!',
      data: created,
    };
  } catch (error) {
    console.error('createStudentProjectAction error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Gagal membuat proyek baru',
    };
  }
}

/**
 * Menyimpan kode berkas, file aktif, dan catatan siswa (Manual Save & Auto-Save)
 */
export async function saveStudentProjectAction(
  input: unknown
): Promise<ActionResponse<{ updatedAt: string }>> {
  const session = await getAuthenticatedStudent();
  if (!session) {
    return { success: false, message: 'Sesi berakhir, simpanan lokal tetap tersimpan di browser' };
  }

  const parsed = saveProjectSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: 'Payload penyimpanan tidak valid' };
  }

  try {
    const result = await saveStudentProject(parsed.data.id, session.userId, {
      id: parsed.data.id,
      files: parsed.data.files,
      activeFile: parsed.data.activeFile || undefined,
      notes: parsed.data.notes || undefined,
    });

    return {
      success: true,
      message: 'Proyek berhasil disimpan',
      data: { updatedAt: result.updatedAt },
    };
  } catch (error) {
    console.error('saveStudentProjectAction error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Gagal menyimpan perubahan ke server',
    };
  }
}

/**
 * Duplikasi proyek sebagai cadangan
 */
export async function duplicateStudentProjectAction(id: string): Promise<ActionResponse<StudentProjectRecord>> {
  const session = await getAuthenticatedStudent();
  if (!session) {
    return { success: false, message: 'Sesi tidak valid' };
  }

  try {
    const duplicated = await duplicateStudentProject(id, session.userId);
    revalidatePath('/student/sandbox');
    return {
      success: true,
      message: 'Proyek berhasil diduplikasi',
      data: duplicated,
    };
  } catch (error) {
    console.error('duplicateStudentProjectAction error:', error);
    return { success: false, message: 'Gagal menduplikasi proyek' };
  }
}

/**
 * Menghapus proyek milik siswa
 */
export async function deleteStudentProjectAction(id: string): Promise<ActionResponse<void>> {
  const session = await getAuthenticatedStudent();
  if (!session) {
    return { success: false, message: 'Sesi tidak valid' };
  }

  try {
    await deleteStudentProject(id, session.userId);
    revalidatePath('/student/sandbox');
    return { success: true, message: 'Proyek berhasil dihapus' };
  } catch (error) {
    console.error('deleteStudentProjectAction error:', error);
    return { success: false, message: 'Gagal menghapus proyek' };
  }
}

/**
 * Mengambil opsi materi untuk dropdown penautan materi saat buat proyek
 */
export async function getMaterialOptionsAction(): Promise<ActionResponse<CourseMaterialOption[]>> {
  const session = await getAuthenticatedStudent();
  if (!session) {
    return { success: false, message: 'Sesi tidak valid' };
  }

  try {
    const options = await getMaterialOptionsForStudent(session.userId);
    return { success: true, message: 'Berhasil', data: options };
  } catch (error) {
    console.error('getMaterialOptionsAction error:', error);
    return { success: false, message: 'Gagal memuat opsi materi' };
  }
}

async function getAuthenticatedStaff() {
  const session = await getSession();
  if (!session || !session.userId || (session.role !== 'SUPERADMIN' && session.role !== 'GURU')) {
    return null;
  }
  return session;
}

/**
 * Mengambil rekap seluruh siswa dan proyek untuk monitoring admin/guru
 */
export async function getStudentsProjectMonitoringAction() {
  const session = await getAuthenticatedStaff();
  if (!session) {
    return { success: false, message: 'Akses ditolak: Hanya untuk Guru dan Superadmin' };
  }

  try {
    const teacherId = session.role === 'GURU' ? session.userId : undefined;
    const data = await getStudentsProjectMonitoringData(teacherId);
    return { success: true, message: 'Berhasil memuat data monitoring', data };
  } catch (error) {
    console.error('getStudentsProjectMonitoringAction error:', error);
    return { success: false, message: 'Gagal memuat data monitoring proyek siswa' };
  }
}

/**
 * Mengambil seluruh proyek siswa spesifik untuk diinspeksi admin/guru
 */
export async function getStudentProjectsForAdminAction(studentId: string) {
  const session = await getAuthenticatedStaff();
  if (!session) {
    return { success: false, message: 'Akses ditolak: Hanya untuk Guru dan Superadmin' };
  }

  try {
    const data = await getStudentProjectsForAdmin(studentId);
    if (!data.student) {
      return { success: false, message: 'Data siswa tidak ditemukan' };
    }
    return { success: true, message: 'Berhasil memuat proyek siswa', data };
  } catch (error) {
    console.error('getStudentProjectsForAdminAction error:', error);
    return { success: false, message: 'Gagal memuat proyek siswa' };
  }
}

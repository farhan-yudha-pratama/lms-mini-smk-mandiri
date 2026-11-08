import { db } from '@/prisma/db';
import { randomUUID } from 'crypto';
import { DEFAULT_WEB_PROJECT, serializeProjectFiles } from '@/lib/virtual-fs';
import { DEFAULT_PHP_WEB_TEMPLATE, DEFAULT_PHP_SCRIPT } from '@/lib/virtual-php';
import {
  CreateProjectDTO,
  SaveProjectDTO,
  StudentProjectDetail,
  StudentProjectRecord,
  SandboxType,
  StudentProjectMonitoringItem,
  StudentMonitoringStats
} from './sandbox.types';

const DEFAULT_SQL_PROJECT: Record<string, string> = {
  'query.sql': `-- Sandbox Database Siswa SMK Mandiri
-- Silakan tulis perintah DDL & DML SQL kamu di sini

CREATE TABLE siswa (
  id INTEGER PRIMARY KEY,
  nama TEXT NOT NULL,
  kelas TEXT NOT NULL,
  jurusan TEXT NOT NULL
);

INSERT INTO siswa (id, nama, kelas, jurusan) VALUES
  (1, 'Ahmad Fauzi', 'XI TKJ 1', 'Teknik Komputer & Jaringan'),
  (2, 'Budi Santoso', 'XI RPL 2', 'Rekayasa Perangkat Lunak'),
  (3, 'Citra Lestari', 'XI RPL 1', 'Rekayasa Perangkat Lunak'),
  (4, 'Deni Saputra', 'XI TKJ 2', 'Teknik Komputer & Jaringan');

-- Menampilkan seluruh data siswa
SELECT * FROM siswa;
`,
  'catatan.sql': `-- Catatan Eksperimen SQL
-- 1. Jalankan query dengan tombol Run atau Ctrl+Enter
-- 2. Hasil SELECT akan otomatis ditampilkan pada tabel hasil di bawah
`
};

const DEFAULT_PHP_PROJECT: Record<string, string> = {
  'index.php': DEFAULT_PHP_WEB_TEMPLATE,
  'helper.php': `<?php
// Fungsi pembantu PHP
function sapa($nama) {
    return "Selamat datang, " . htmlspecialchars($nama) . "!";
}
`
};

const DEFAULT_FULLSTACK_PROJECT: Record<string, string> = {
  'index.html': DEFAULT_WEB_PROJECT['index.html'] || '<!DOCTYPE html><html><body><h1>Fullstack Project</h1></body></html>',
  'css/style.css': DEFAULT_WEB_PROJECT['css/style.css'] || 'body { font-family: sans-serif; }',
  'js/script.js': DEFAULT_WEB_PROJECT['js/script.js'] || 'console.log("Fullstack project loaded");',
  'backend/api.php': DEFAULT_PHP_SCRIPT,
  'database/schema.sql': DEFAULT_SQL_PROJECT['query.sql']
};

export function getDefaultFilesForType(type: SandboxType): { files: Record<string, string>; activeFile: string } {
  switch (type) {
    case 'SQL':
      return { files: DEFAULT_SQL_PROJECT, activeFile: 'query.sql' };
    case 'PHP':
      return { files: DEFAULT_PHP_PROJECT, activeFile: 'index.php' };
    case 'FULLSTACK':
      return { files: DEFAULT_FULLSTACK_PROJECT, activeFile: 'index.html' };
    case 'WEB':
    default:
      return { files: DEFAULT_WEB_PROJECT, activeFile: 'index.html' };
  }
}

/**
 * Mengambil daftar proyek milik siswa yang sedang aktif (Row-Level Security)
 */
export async function getStudentProjects(studentId: string): Promise<StudentProjectDetail[]> {
  const projects = (await db.orm.public.StudentProject.where({ studentId }).all()) as StudentProjectRecord[];
  
  if (projects.length === 0) return [];

  const courses = await db.orm.public.Course.all();
  const pages = await db.orm.public.Page.all();

  return projects
    .map(p => {
      const course = p.courseId ? courses.find(c => c.id === p.courseId) : null;
      const page = p.pageId ? pages.find(pg => pg.id === p.pageId) : null;
      return {
        ...p,
        courseName: course?.name || null,
        pageTitle: page?.title || null,
        pageSlug: page?.slug || null,
      };
    })
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

/**
 * Mengambil satu proyek spesifik milik siswa dengan verifikasi kepemilikan ketat
 */
export async function getStudentProjectById(id: string, studentId: string): Promise<StudentProjectDetail | null> {
  const project = (await db.orm.public.StudentProject.where({ id, studentId }).first()) as StudentProjectRecord | null;
  if (!project) return null;

  let courseName: string | null = null;
  let pageTitle: string | null = null;
  let pageSlug: string | null = null;

  if (project.courseId) {
    const course = await db.orm.public.Course.where({ id: project.courseId }).first();
    courseName = course?.name || null;
  }

  if (project.pageId) {
    const page = await db.orm.public.Page.where({ id: project.pageId }).first();
    pageTitle = page?.title || null;
    pageSlug = page?.slug || null;
  }

  return {
    ...project,
    courseName,
    pageTitle,
    pageSlug,
  };
}

/**
 * Membuat proyek baru untuk siswa dengan inisialisasi template berkas
 */
export async function createStudentProject(studentId: string, dto: CreateProjectDTO): Promise<StudentProjectRecord> {
  const type = dto.type || 'WEB';
  const { files, activeFile } = getDefaultFilesForType(type);

  const initialNotes = `# Catatan Belajar: ${dto.title}
Dibuat pada: ${new Date().toLocaleDateString('id-ID')}
- Gunakan area ini untuk mencatat ide, rumus kode, atau rangkuman penjelasan materi.
`;

  const newProject = (await db.orm.public.StudentProject.create({
    id: randomUUID(),
    studentId,
    title: dto.title.trim(),
    description: dto.description?.trim() || null,
    type,
    files: serializeProjectFiles(files),
    activeFile,
    notes: initialNotes,
    courseId: dto.courseId || null,
    pageId: dto.pageId || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })) as StudentProjectRecord;

  return newProject;
}

/**
 * Menyimpan berkas proyek, berkas aktif terakhir (resume), dan catatan siswa
 */
export async function saveStudentProject(
  id: string,
  studentId: string,
  dto: SaveProjectDTO
): Promise<{ success: boolean; updatedAt: string }> {
  // Verifikasi kepemilikan
  const existing = await db.orm.public.StudentProject.where({ id, studentId }).first();
  if (!existing) {
    throw new Error('Proyek tidak ditemukan atau Anda tidak memiliki akses');
  }

  const now = new Date().toISOString();
  await db.orm.public.StudentProject.where({ id }).update({
    files: serializeProjectFiles(dto.files),
    activeFile: dto.activeFile || existing.activeFile || 'index.html',
    notes: dto.notes !== undefined ? dto.notes : existing.notes,
    updatedAt: now,
  });

  return { success: true, updatedAt: now };
}

/**
 * Duplikasi proyek siswa sebagai cadangan eksperimen
 */
export async function duplicateStudentProject(id: string, studentId: string): Promise<StudentProjectRecord> {
  const existing = await db.orm.public.StudentProject.where({ id, studentId }).first();
  if (!existing) {
    throw new Error('Proyek tidak ditemukan');
  }

  const duplicated = (await db.orm.public.StudentProject.create({
    id: randomUUID(),
    studentId,
    title: `${existing.title} (Salinan)`,
    description: existing.description,
    type: existing.type as SandboxType,
    files: existing.files,
    activeFile: existing.activeFile,
    notes: existing.notes,
    courseId: existing.courseId,
    pageId: existing.pageId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })) as StudentProjectRecord;

  return duplicated;
}

/**
 * Menghapus proyek milik siswa
 */
export async function deleteStudentProject(id: string, studentId: string): Promise<boolean> {
  const existing = await db.orm.public.StudentProject.where({ id, studentId }).first();
  if (!existing) {
    throw new Error('Proyek tidak ditemukan');
  }

  await db.orm.public.StudentProject.where({ id }).delete();
  return true;
}

/**
 * Mengambil opsi Mapel & Materi yang dapat ditautkan oleh siswa
 */
export async function getMaterialOptionsForStudent(studentId: string) {
  // Ambil course yang di-enroll oleh murid
  const enrollments = await db.orm.public.CourseStudent.where({ studentId }).all();
  const enrolledCourseIds = new Set(enrollments.map(e => e.courseId));

  const courses = (await db.orm.public.Course.all()).filter(c => enrolledCourseIds.has(c.id));
  const categories = await db.orm.public.MaterialCategory.all();
  const pages = (await db.orm.public.Page.where({ isPublished: true }).all()).sort(
    (a, b) => a.orderIndex - b.orderIndex
  );

  return courses.map(course => {
    const courseCategories = categories.filter(cat => cat.courseId === course.id);
    const categoryIds = new Set(courseCategories.map(c => c.id));
    const coursePages = pages
      .filter(p => categoryIds.has(p.categoryId))
      .map(p => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
      }));

    return {
      id: course.id,
      name: course.name,
      slug: course.slug,
      pages: coursePages,
    };
  });
}

/**
 * Mengambil rekap seluruh siswa untuk monitoring admin/guru
 */
export async function getStudentsProjectMonitoringData(teacherId?: string): Promise<{
  students: StudentProjectMonitoringItem[];
  classes: { id: string; name: string }[];
  courses: { id: string; name: string }[];
  stats: StudentMonitoringStats;
}> {
  const [allStudents, classrooms, allCourses, courseStudents, allProjects] = await Promise.all([
    db.orm.public.User.where({ role: 'MURID' }).all(),
    db.orm.public.Classroom.all(),
    db.orm.public.Course.all(),
    db.orm.public.CourseStudent.all(),
    db.orm.public.StudentProject.all(),
  ]);

  // Jika guru, saring mata pelajaran yang diajar
  let courses = allCourses;
  if (teacherId) {
    const teacherCourses = await db.orm.public.CourseTeacher.where({ teacherId }).all();
    const teacherCourseIds = new Set((teacherCourses as { courseId: string }[]).map(tc => tc.courseId));
    if (teacherCourseIds.size > 0) {
      courses = allCourses.filter(c => teacherCourseIds.has(c.id));
    }
  }

  // Lookup maps
  const classMap = new Map<string, string>(classrooms.map(c => [c.id, c.name]));
  const studentProjectsMap = new Map<string, StudentProjectRecord[]>();
  for (const p of allProjects as StudentProjectRecord[]) {
    const list = studentProjectsMap.get(p.studentId) || [];
    list.push(p);
    studentProjectsMap.set(p.studentId, list);
  }

  const studentCoursesMap = new Map<string, string[]>();
  for (const cs of courseStudents as { studentId: string; courseId: string }[]) {
    const list = studentCoursesMap.get(cs.studentId) || [];
    list.push(cs.courseId);
    studentCoursesMap.set(cs.studentId, list);
  }

  let totalProjectsCount = 0;
  let studentsWithProjectsCount = 0;

  interface StudentUserRow {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
    isActive?: boolean;
    classId?: string | null;
  }

  const students: StudentProjectMonitoringItem[] = (allStudents as StudentUserRow[]).map(s => {
    const sProjects = (studentProjectsMap.get(s.id) || []).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    const count = sProjects.length;
    totalProjectsCount += count;
    if (count > 0) {
      studentsWithProjectsCount++;
    }

    const uniqueTypes = Array.from(new Set(sProjects.map(p => p.type as SandboxType)));

    return {
      id: s.id,
      name: s.name,
      email: s.email,
      avatar: s.avatar || null,
      isActive: s.isActive ?? true,
      classId: s.classId || null,
      className: s.classId ? classMap.get(s.classId) || '-' : '-',
      enrolledCourseIds: studentCoursesMap.get(s.id) || [],
      projectsCount: count,
      projectTypes: uniqueTypes,
      lastActiveAt: sProjects[0]?.updatedAt || null,
      latestProjectTitle: sProjects[0]?.title || null,
    };
  });

  // Urutkan siswa: yang memiliki proyek terbaru di atas, lalu nama
  students.sort((a, b) => {
    if (a.lastActiveAt && b.lastActiveAt) {
      return new Date(b.lastActiveAt).getTime() - new Date(a.lastActiveAt).getTime();
    }
    if (a.lastActiveAt) return -1;
    if (b.lastActiveAt) return 1;
    return a.name.localeCompare(b.name);
  });

  const stats: StudentMonitoringStats = {
    totalStudents: allStudents.length,
    totalProjects: totalProjectsCount,
    studentsWithProjects: studentsWithProjectsCount,
    studentsWithoutProjects: allStudents.length - studentsWithProjectsCount,
  };

  return {
    students,
    classes: classrooms.map(c => ({ id: c.id, name: c.name })),
    courses: courses.map(c => ({ id: c.id, name: c.name })),
    stats,
  };
}

/**
 * Mengambil seluruh proyek siswa untuk diinspeksi oleh Admin/Guru
 */
export async function getStudentProjectsForAdmin(studentId: string): Promise<{
  student: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    isActive: boolean;
    className: string;
    enrolledCourses: { id: string; name: string }[];
  } | null;
  projects: StudentProjectDetail[];
}> {
  interface UserRecord {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
    isActive?: boolean;
    classId?: string | null;
  }

  const student = (await db.orm.public.User.where({ id: studentId }).first()) as UserRecord | null;
  if (!student) {
    return { student: null, projects: [] };
  }

  const [classroom, courses, pages, enrollments, rawProjects] = await Promise.all([
    student.classId ? db.orm.public.Classroom.where({ id: student.classId }).first() : Promise.resolve(null),
    db.orm.public.Course.all(),
    db.orm.public.Page.all(),
    db.orm.public.CourseStudent.where({ studentId }).all(),
    db.orm.public.StudentProject.where({ studentId }).all(),
  ]);

  const courseMap = new Map<string, string>(courses.map(c => [c.id, c.name]));
  const pageMap = new Map<string, { title: string; slug: string }>(
    pages.map(p => [p.id, { title: p.title, slug: p.slug }])
  );

  const enrolledCourseIds = new Set((enrollments as { courseId: string }[]).map(e => e.courseId));
  const enrolledCourses = courses
    .filter(c => enrolledCourseIds.has(c.id))
    .map(c => ({ id: c.id, name: c.name }));

  const projects: StudentProjectDetail[] = (rawProjects as StudentProjectRecord[])
    .map(p => {
      const pageInfo = p.pageId ? pageMap.get(p.pageId) : null;
      return {
        ...p,
        courseName: p.courseId ? courseMap.get(p.courseId) || null : null,
        pageTitle: pageInfo?.title || null,
        pageSlug: pageInfo?.slug || null,
      };
    })
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  return {
    student: {
      id: student.id,
      name: student.name,
      email: student.email,
      avatar: student.avatar || null,
      isActive: student.isActive ?? true,
      className: (classroom as { name?: string } | null)?.name || '-',
      enrolledCourses,
    },
    projects,
  };
}

export type SandboxType = 'WEB' | 'SQL' | 'PHP' | 'FULLSTACK';

export interface StudentProjectRecord {
  id: string;
  studentId: string;
  title: string;
  description?: string | null;
  type: SandboxType;
  files: string; // JSON Record<string, string>
  activeFile?: string | null;
  notes?: string | null;
  courseId?: string | null;
  pageId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StudentProjectDetail extends StudentProjectRecord {
  courseName?: string | null;
  pageTitle?: string | null;
  pageSlug?: string | null;
}

export interface CreateProjectDTO {
  title: string;
  type?: SandboxType;
  courseId?: string | null;
  pageId?: string | null;
  description?: string | null;
}

export interface SaveProjectDTO {
  id: string;
  files: Record<string, string>;
  activeFile?: string;
  notes?: string;
}

export type SaveStatus = 'saved' | 'saving' | 'dirty' | 'error';

export interface CourseMaterialOption {
  id: string;
  name: string;
  slug: string;
  pages: { id: string; title: string; slug: string }[];
}

export interface StudentProjectMonitoringItem {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  isActive: boolean;
  classId?: string | null;
  className: string;
  enrolledCourseIds: string[];
  projectsCount: number;
  projectTypes: SandboxType[];
  lastActiveAt: string | null;
  latestProjectTitle: string | null;
}

export interface StudentMonitoringStats {
  totalStudents: number;
  totalProjects: number;
  studentsWithProjects: number;
  studentsWithoutProjects: number;
}

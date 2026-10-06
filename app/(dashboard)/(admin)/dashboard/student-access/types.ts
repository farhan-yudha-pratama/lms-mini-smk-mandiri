export type PageAccessStatus = 'LOCKED' | 'UNLOCKED' | 'COMPLETED';

export interface ActionResponse<T = any> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
}

export interface StudentRow {
  classId?: string | null;
  className?: string;
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  stats?: {
    locked: number;
    unlocked: number;
    completed: number;
    total: number;
  };
}

export interface AccessPage {
  id: string;
  title: string;
  slug: string;
  orderIndex: number;
  accessStatus: PageAccessStatus;
}

export interface AccessCategory {
  id: string;
  name: string;
  pages: AccessPage[];
}

export interface StudentAccessTableProps {
  classes: { id: string; name: string }[];
  students: StudentRow[];
}

export interface AccessCategoryListProps {
  categories: AccessCategory[];
  loadingId: string | null;
  onStatusChange: (categoryId: string, pageId: string, newStatus: PageAccessStatus) => void;
}

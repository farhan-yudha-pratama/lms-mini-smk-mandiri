export type PageAccessStatus = 'LOCKED' | 'UNLOCKED' | 'COMPLETED';

export interface ActionResponse<T = any> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
}

export interface StudentRow {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
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
  students: StudentRow[];
}

export interface AccessCategoryListProps {
  categories: AccessCategory[];
  loadingId: string | null;
  onStatusChange: (categoryId: string, pageId: string, newStatus: PageAccessStatus) => void;
}

export type Role = 'SUPERADMIN' | 'GURU' | 'MURID';

export interface UserRow {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt: string; // ISO string
}

export type SortDirection = 'asc' | 'desc';
export type SortColumn = keyof UserRow | null;

export interface ActionResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface UserQuizHistoryDetails {
  user: {
    id: string;
    name: string;
    email: string;
    role: Role;
  };
  attempts: {
    id: string;
    quizTitle: string;
    status: string;
    score: number | null;
    startedAt: string;
    finishedAt: string | null;
  }[];
  assignments: {
    id: string;
    quizTitle: string;
    assignedAt: string;
  }[];
  completionRecords: {
    id: string;
    sourceTitle: string;
    score: number;
    isPassed: boolean;
    completedAt: string;
  }[];
  scoreSummary: {
    overallAverageScore: number | null;
    totalPointsEarned: number;
    totalMaterialQuizCompleted: number;
  } | null;
  courseCount: number;
  pageAccessCount: number;
}

// Komponen UI Props
export interface UsersTableProps {
  users: UserRow[];
  selectedIds: Set<string>;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
  onSelectAll: (checked: boolean) => void;
  onSelectOne: (id: string, checked: boolean) => void;
  onSort: (col: keyof UserRow) => void;
  onEditName?: (user: UserRow) => void;
  onDeleteUser?: (user: UserRow) => void;
  onViewQuizHistory?: (user: UserRow) => void;
  onToggleActiveUser?: (user: UserRow, isActive: boolean) => void;
  onRevokeUserSession?: (user: UserRow) => void;
}

export interface UsersToolbarProps {
  onSearchChange: (value: string) => void;
}

export interface FloatingActionBarProps {
  selectedCount: number;
  isProcessing: boolean;
  onClearSelection: () => void;
  onBulkResetPassword: () => void;
  onBulkChangeRole: (newRole: Role) => void;
  onBulkToggleActive: (isActive: boolean) => void;
  onBulkDelete?: () => void;
  onBulkRevokeToken?: () => void;
}

export interface UsersPaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  startIndex: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (size: number) => void;
}

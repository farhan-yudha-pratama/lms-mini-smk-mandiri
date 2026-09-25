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

// Komponen UI Props
export interface UsersTableProps {
  users: UserRow[];
  selectedIds: Set<string>;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
  onSelectAll: (checked: boolean) => void;
  onSelectOne: (id: string, checked: boolean) => void;
  onSort: (col: keyof UserRow) => void;
}

export interface UsersToolbarProps {
  selectedCount: number;
  isProcessing: boolean;
  onSearchChange: (value: string) => void;
  onBulkResetPassword: () => void;
  onBulkChangeRole: (newRole: Role) => void;
  onBulkToggleActive: (isActive: boolean) => void;
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

import { UserRow, SortColumn, SortDirection } from '@/app/(dashboard)/dashboard/users/types';

/**
 * Format string ISO date to a readable local string
 */
export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

/**
 * Filter users based on a search query applied to name, email, or role
 */
export function filterUsers(users: UserRow[], query: string): UserRow[] {
  if (!query.trim()) return users;
  
  const lowerQuery = query.toLowerCase();
  return users.filter(user => 
    user.name.toLowerCase().includes(lowerQuery) ||
    user.email.toLowerCase().includes(lowerQuery) ||
    user.role.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Sort users by the selected column and direction
 */
export function sortUsers(users: UserRow[], column: SortColumn, direction: SortDirection): UserRow[] {
  if (!column) return users;

  return [...users].sort((a, b) => {
    let valueA: any = a[column];
    let valueB: any = b[column];

    // Convert strings to lowercase for case-insensitive sort
    if (typeof valueA === 'string') valueA = valueA.toLowerCase();
    if (typeof valueB === 'string') valueB = valueB.toLowerCase();

    // Handle boolean sorting (Active / Non-aktif)
    if (typeof valueA === 'boolean' && typeof valueB === 'boolean') {
      valueA = valueA ? 1 : 0;
      valueB = valueB ? 1 : 0;
    }

    if (valueA < valueB) return direction === 'asc' ? -1 : 1;
    if (valueA > valueB) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}

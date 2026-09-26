'use client';

import { useState, useMemo } from 'react';
import { UserRow, SortColumn, SortDirection, Role } from '../types';
import { filterUsers, sortUsers } from '@/lib/user-helpers';
import { bulkResetPassword, bulkChangeRole, bulkToggleActive } from '../actions';
import UsersToolbar from './UsersToolbar';
import UsersTable from './UsersTable';
import UsersPagination from './UsersPagination';
import ConfirmModal from './ConfirmModal';

interface UsersViewProps {
  initialUsers: UserRow[];
}

export default function UsersView({ initialUsers }: UsersViewProps) {
  const [users, setUsers] = useState<UserRow[]>(initialUsers);
  const [sortColumn, setSortColumn] = useState<SortColumn>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    isDestructive?: boolean;
    onConfirm: () => void;
  } | null>(null);

  // Apply filter & sort locally
  const displayedUsers = useMemo(() => {
    let result = filterUsers(users, searchQuery);
    result = sortUsers(result, sortColumn, sortDirection);
    return result;
  }, [users, searchQuery, sortColumn, sortDirection]);

  // Reset to page 1 if filter changes
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(displayedUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = displayedUsers.slice(startIndex, startIndex + itemsPerPage);

  // Handle Select All
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newSet = new Set(selectedIds);
      paginatedUsers.forEach(u => newSet.add(u.id));
      setSelectedIds(newSet);
    } else {
      const newSet = new Set(selectedIds);
      paginatedUsers.forEach(u => newSet.delete(u.id));
      setSelectedIds(newSet);
    }
  };

  // Handle single select
  const handleSelectOne = (id: string, checked: boolean) => {
    const newSet = new Set(selectedIds);
    if (checked) newSet.add(id);
    else newSet.delete(id);
    setSelectedIds(newSet);
  };

  // Handle Sort
  const handleSort = (col: keyof UserRow) => {
    if (sortColumn === col) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(col);
      setSortDirection('asc');
    }
  };

  // Actions Runner
  const runAction = async (actionFn: () => Promise<{ success: boolean; message?: string; error?: string }>) => {
    setIsProcessing(true);
    setMessage(null);
    try {
      const res = await actionFn();
      if (res.success) {
        setMessage({ type: 'success', text: res.message || 'Berhasil' });
      } else {
        setMessage({ type: 'error', text: res.error || 'Terjadi kesalahan' });
      }
      return res.success;
    } catch (e: any) {
      setMessage({ type: 'error', text: e.message || 'Mohon maaf, terjadi kesalahan pada sistem.' });
      return false;
    } finally {
      setIsProcessing(false);
      setSelectedIds(new Set()); // clear selection
    }
  };

  const onBulkResetPassword = () => {
    setModalConfig({
      isOpen: true,
      title: 'Atur Ulang Kata Sandi',
      message: `Yakin mengatur ulang kata sandi ${selectedIds.size} pengguna?`,
      isDestructive: true,
      onConfirm: () => {
        setModalConfig(null);
        runAction(() => bulkResetPassword(Array.from(selectedIds)));
      }
    });
  };

  const onBulkChangeRole = (newRole: Role) => {
    setModalConfig({
      isOpen: true,
      title: 'Ubah Role Pengguna',
      message: `Yakin mengubah role ${selectedIds.size} pengguna menjadi ${newRole}?`,
      onConfirm: () => {
        setModalConfig(null);
        runAction(async () => {
          const res = await bulkChangeRole(Array.from(selectedIds), newRole);
          if (res.success) {
            setUsers(prev => prev.map(u => selectedIds.has(u.id) ? { ...u, role: newRole } : u));
          }
          return res;
        });
      }
    });
  };

  const onBulkToggleActive = (isActive: boolean) => {
    setModalConfig({
      isOpen: true,
      title: isActive ? 'Aktifkan Pengguna' : 'Non-aktifkan Pengguna',
      message: `Yakin ${isActive ? 'mengaktifkan' : 'menonaktifkan'} ${selectedIds.size} pengguna?`,
      isDestructive: !isActive,
      onConfirm: () => {
        setModalConfig(null);
        runAction(async () => {
          const res = await bulkToggleActive(Array.from(selectedIds), isActive);
          if (res.success) {
            setUsers(prev => prev.map(u => selectedIds.has(u.id) ? { ...u, isActive } : u));
          }
          return res;
        });
      }
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Pengguna</h1>
          <p className="text-gray-500 mt-1">Kelola data murid, guru, dan admin dalam satu tempat.</p>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-lg border ${message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <div className="sticky top-16 z-30">
        <div className="absolute inset-0 bg-gray-50/80 backdrop-blur-md -m-4 p-4 md:-m-0 md:p-0"></div>
        <div className="relative">
          <UsersToolbar
            selectedCount={selectedIds.size}
            isProcessing={isProcessing}
            onSearchChange={setSearchQuery}
            onBulkResetPassword={onBulkResetPassword}
            onBulkChangeRole={onBulkChangeRole}
            onBulkToggleActive={onBulkToggleActive}
          />
        </div>
      </div>

      <div className="md:bg-white md:rounded-xl md:border md:border-gray-200 md:shadow-sm flex flex-col">
        <UsersTable
          users={paginatedUsers}
          selectedIds={selectedIds}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSelectAll={handleSelectAll}
          onSelectOne={handleSelectOne}
          onSort={handleSort}
        />

        <UsersPagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={displayedUsers.length}
          startIndex={startIndex}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(size) => {
            setItemsPerPage(size);
            setCurrentPage(1);
          }}
        />
      </div>
      <ConfirmModal 
        isOpen={modalConfig?.isOpen ?? false}
        title={modalConfig?.title ?? ''}
        message={modalConfig?.message ?? ''}
        isDestructive={modalConfig?.isDestructive}
        onConfirm={modalConfig?.onConfirm ?? (() => {})}
        onCancel={() => setModalConfig(null)}
      />
    </div>
  );
}

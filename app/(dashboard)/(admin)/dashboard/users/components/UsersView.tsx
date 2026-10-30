'use client';

import { useState, useMemo, useEffect } from 'react';
import { UserRow, SortColumn, SortDirection, Role } from '../types';
import { filterUsers, sortUsers } from '@/lib/user-helpers';
import { getSocket } from '@/lib/socket/client';
import { bulkResetPassword, bulkChangeRole, bulkToggleActive, editUserNameAction, bulkDeleteUsersAction, bulkRevokeUserTokenAction } from '../actions';
import UsersToolbar from './UsersToolbar';
import UsersTable from './UsersTable';
import UsersPagination from './UsersPagination';
import ConfirmModal from './ConfirmModal';
import EditNameModal from './EditNameModal';
import FloatingActionBar from './FloatingActionBar';
import UserQuizHistoryModal from './UserQuizHistoryModal';

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

  const [editModalConfig, setEditModalConfig] = useState<{
    isOpen: boolean;
    userId: string;
    initialName: string;
  } | null>(null);

  const [quizHistoryUser, setQuizHistoryUser] = useState<UserRow | null>(null);

  // Real-time synchronization via WebSocket
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleStatusChanged = (payload: { userIds: string[]; isActive: boolean }) => {
      if (!payload?.userIds?.length) return;
      const idSet = new Set(payload.userIds);
      setUsers((prev) =>
        prev.map((u) => (idSet.has(u.id) ? { ...u, isActive: payload.isActive } : u))
      );
    };

    const handleUserRevoked = (payload: { userIds: string[]; reason: string }) => {
      if (payload?.reason === 'DELETED' && payload?.userIds?.length) {
        const idSet = new Set(payload.userIds);
        setUsers((prev) => prev.filter((u) => !idSet.has(u.id)));
      }
    };

    socket.on('user:status_changed', handleStatusChanged);
    socket.on('user:revoked', handleUserRevoked);

    return () => {
      socket.off('user:status_changed', handleStatusChanged);
      socket.off('user:revoked', handleUserRevoked);
    };
  }, []);

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
        runAction(async () => {
          return await bulkResetPassword(Array.from(selectedIds));
        });
      }
    });
  };

  const onBulkChangeRole = (newRole: Role) => {
    setModalConfig({
      isOpen: true,
      title: 'Ubah Role Pengguna',
      message: `Yakin mengubah role ${selectedIds.size} pengguna menjadi ${newRole}?`,
      isDestructive: false,
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
      title: `${isActive ? 'Aktifkan' : 'Nonaktifkan'} Pengguna`,
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

  const onEditName = (user: UserRow) => {
    setEditModalConfig({
      isOpen: true,
      userId: user.id,
      initialName: user.name,
    });
  };

  const handleEditConfirm = async (newName: string) => {
    if (!editModalConfig) return;
    const userId = editModalConfig.userId;
    setEditModalConfig(null);
    runAction(async () => {
      const res = await editUserNameAction(userId, newName);
      if (res.success) {
        const formattedName = newName.replace(
          /\w\S*/g,
          (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
        ).replace(/\s+/g, ' ').trim();
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, name: formattedName } : u));
      }
      return res;
    });
  };

  const onDeleteUser = (user: UserRow) => {
    setModalConfig({
      isOpen: true,
      title: 'Hapus Pengguna',
      message: `Data yang dihapus tidak dapat dikembalikan. Yakin menghapus pengguna ${user.name}? Jika pengguna memiliki riwayat kuis, Anda harus membersihkannya terlebih dahulu melalui "Cek Riwayat Kuis".`,
      isDestructive: true,
      onConfirm: () => {
        setModalConfig(null);
        runAction(async () => {
          const res = await bulkDeleteUsersAction([user.id]);
          if (res.success) {
            setUsers(prev => prev.filter(u => u.id !== user.id));
          }
          return res;
        });
      }
    });
  };

  const onBulkDelete = () => {
    setModalConfig({
      isOpen: true,
      title: 'Hapus Pengguna Terpilih',
      message: `Data yang dihapus tidak dapat dikembalikan. Yakin menghapus ${selectedIds.size} pengguna? Pengguna yang masih memiliki riwayat kuis aktif tidak akan terhapus hingga riwayatnya dibersihkan.`,
      isDestructive: true,
      onConfirm: () => {
        setModalConfig(null);
        runAction(async () => {
          const res = await bulkDeleteUsersAction(Array.from(selectedIds));
          if (res.success) {
            setUsers(prev => prev.filter(u => !selectedIds.has(u.id)));
          }
          return res;
        });
      }
    });
  };

  const onBulkRevokeToken = () => {
    setModalConfig({
      isOpen: true,
      title: 'Revoke Token Pengguna',
      message: `Yakin ingin me-revoke token / mengeluarkan sesi login ${selectedIds.size} pengguna terpilih secara paksa?`,
      isDestructive: true,
      onConfirm: () => {
        setModalConfig(null);
        runAction(async () => {
          return await bulkRevokeUserTokenAction(Array.from(selectedIds));
        });
      }
    });
  };

  const onToggleActiveSingle = (user: UserRow, isActive: boolean) => {
    setModalConfig({
      isOpen: true,
      title: `${isActive ? 'Aktifkan' : 'Nonaktifkan'} Akun`,
      message: `Yakin ingin ${isActive ? 'mengaktifkan' : 'menonaktifkan'} akun ${user.name}? ${
        !isActive ? 'Pengguna akan otomatis dikeluarkan (logout) seketika jika sedang membuka sistem.' : ''
      }`,
      isDestructive: !isActive,
      onConfirm: () => {
        setModalConfig(null);
        runAction(async () => {
          const res = await bulkToggleActive([user.id], isActive);
          if (res.success) {
            setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isActive } : u));
          }
          return res;
        });
      }
    });
  };

  const onRevokeSingle = (user: UserRow) => {
    setModalConfig({
      isOpen: true,
      title: 'Revoke Sesi Pengguna',
      message: `Yakin ingin me-revoke token / mengeluarkan sesi login ${user.name} secara paksa? Pengguna akan langsung dikeluarkan ke halaman login secara real-time.`,
      isDestructive: true,
      onConfirm: () => {
        setModalConfig(null);
        runAction(async () => {
          return await bulkRevokeUserTokenAction([user.id]);
        });
      }
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Toast Notification Alert */}
      {message && (
        <div className={`p-4 rounded-xl border flex items-center justify-between transition-all animate-in fade-in slide-in-from-top-2 duration-200 ${
          message.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-xl">
              {message.type === 'success' ? 'check_circle' : 'error'}
            </span>
            <span className="text-sm font-medium">{message.text}</span>
          </div>
          <button 
            onClick={() => setMessage(null)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
      )}

      {/* Modern Toolbar */}
      <UsersToolbar onSearchChange={setSearchQuery} />

      <div className="md:bg-white md:rounded-xl md:border md:border-gray-200 md:shadow-sm flex flex-col relative z-0">
        <UsersTable
          users={paginatedUsers}
          selectedIds={selectedIds}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSelectAll={handleSelectAll}
          onSelectOne={handleSelectOne}
          onSort={handleSort}
          onEditName={onEditName}
          onDeleteUser={onDeleteUser}
          onViewQuizHistory={(u) => setQuizHistoryUser(u)}
          onToggleActiveUser={onToggleActiveSingle}
          onRevokeUserSession={onRevokeSingle}
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

      <EditNameModal
        isOpen={editModalConfig?.isOpen ?? false}
        initialName={editModalConfig?.initialName ?? ''}
        onConfirm={handleEditConfirm}
        onCancel={() => setEditModalConfig(null)}
      />

      {/* Modal Cek Riwayat & Relasi Kuis Pengguna */}
      {quizHistoryUser && (
        <UserQuizHistoryModal
          user={quizHistoryUser}
          onClose={() => setQuizHistoryUser(null)}
          onHistoryCleared={() => {
            setMessage({
              type: 'success',
              text: `Riwayat kuis untuk "${quizHistoryUser.name}" berhasil dibersihkan. Sekarang pengguna siap untuk dihapus.`
            });
          }}
        />
      )}
      
      <FloatingActionBar
        selectedCount={selectedIds.size}
        isProcessing={isProcessing}
        onClearSelection={() => setSelectedIds(new Set())}
        onBulkResetPassword={onBulkResetPassword}
        onBulkChangeRole={onBulkChangeRole}
        onBulkToggleActive={onBulkToggleActive}
        onBulkDelete={onBulkDelete}
        onBulkRevokeToken={onBulkRevokeToken}
      />
    </div>
  );
}

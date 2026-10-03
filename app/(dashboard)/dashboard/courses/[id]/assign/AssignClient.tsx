'use client';

import { useState } from 'react';
import { assignTeacherToCourse, removeTeacherFromCourse, assignMaterialCategoryToCourse, removeMaterialCategoryFromCourse } from '@/app/actions/course';

export default function AssignClient({ courseId, assignedTeachers, availableTeachers, assignedCategories, unassignedCategories }: any) {
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  const handleAssignTeacher = async () => {
    if (!selectedTeacherId) return;
    try {
      await assignTeacherToCourse(courseId, selectedTeacherId);
      setSelectedTeacherId('');
    } catch (e) {
      alert('Gagal menambahkan guru');
    }
  };

  const handleRemoveTeacher = async (teacherId: string) => {
    if (confirm('Cabut akses guru ini?')) {
      await removeTeacherFromCourse(courseId, teacherId);
    }
  };

  const handleAssignCategory = async () => {
    if (!selectedCategoryId) return;
    try {
      await assignMaterialCategoryToCourse(selectedCategoryId, courseId);
      setSelectedCategoryId('');
    } catch (e) {
      alert('Gagal menambahkan materi');
    }
  };

  const handleRemoveCategory = async (categoryId: string) => {
    if (confirm('Keluarkan materi ini dari mapel?')) {
      await removeMaterialCategoryFromCourse(categoryId);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      {/* Kolom Guru */}
      <div className="bg-white p-5 rounded-lg border shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Guru Pengampu</h2>
        
        <div className="flex gap-2 mb-6">
          <select 
            value={selectedTeacherId}
            onChange={e => setSelectedTeacherId(e.target.value)}
            className="flex-1 border rounded p-2 text-sm"
          >
            <option value="">-- Pilih Guru --</option>
            {availableTeachers.map((t: any) => (
              <option key={t.id} value={t.id}>{t.name} ({t.email})</option>
            ))}
          </select>
          <button onClick={handleAssignTeacher} className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
            Tambahkan
          </button>
        </div>

        <ul className="divide-y border-t">
          {assignedTeachers.length === 0 ? (
            <li className="py-3 text-sm text-gray-500">Belum ada guru.</li>
          ) : (
            assignedTeachers.map((t: any) => (
              <li key={t.id} className="py-3 flex justify-between items-center">
                <div>
                  <div className="font-medium text-sm">{t.name}</div>
                  <div className="text-xs text-gray-500">{t.email}</div>
                </div>
                <button onClick={() => handleRemoveTeacher(t.id)} className="text-red-500 text-sm hover:underline">Hapus</button>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Kolom Materi */}
      <div className="bg-white p-5 rounded-lg border shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Kategori Materi</h2>
        
        <div className="flex gap-2 mb-6">
          <select 
            value={selectedCategoryId}
            onChange={e => setSelectedCategoryId(e.target.value)}
            className="flex-1 border rounded p-2 text-sm"
          >
            <option value="">-- Pilih Kategori Bebas --</option>
            {unassignedCategories.map((c: any) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <button onClick={handleAssignCategory} className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
            Tambahkan
          </button>
        </div>

        <ul className="divide-y border-t">
          {assignedCategories.length === 0 ? (
            <li className="py-3 text-sm text-gray-500">Belum ada materi.</li>
          ) : (
            assignedCategories.map((c: any) => (
              <li key={c.id} className="py-3 flex justify-between items-center">
                <div>
                  <div className="font-medium text-sm">{c.name}</div>
                  <div className="text-xs text-gray-500">/{c.slug}</div>
                </div>
                <button onClick={() => handleRemoveCategory(c.id)} className="text-red-500 text-sm hover:underline">Keluarkan</button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

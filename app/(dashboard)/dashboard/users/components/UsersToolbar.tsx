import { useState, useEffect } from 'react';
import { UsersToolbarProps } from '../types';

export default function UsersToolbar({
  onSearchChange,
}: UsersToolbarProps) {
  const [inputValue, setInputValue] = useState('');

  // Debounce effect lokal
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearchChange(inputValue);
    }, 300);

    return () => clearTimeout(handler);
  }, [inputValue, onSearchChange]);

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center">
      <div className="relative w-full">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
        <input
          type="text"
          placeholder="Cari nama, email, atau role..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
        />
      </div>
    </div>
  );
}

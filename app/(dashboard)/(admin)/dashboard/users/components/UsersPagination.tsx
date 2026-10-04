import { UsersPaginationProps } from '../types';

export default function UsersPagination({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  startIndex,
  onPageChange,
  onItemsPerPageChange,
}: UsersPaginationProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-gray-200 md:bg-gray-50 gap-4">
      <div className="flex items-center gap-2 text-sm text-gray-600 w-full sm:w-auto justify-center sm:justify-start">
        <span>Tampilkan</span>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
        >
          {[20, 50, 100, 200, 500, 1000].map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
        <span>data</span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
        <span className="text-sm text-gray-600 text-center">
          {totalItems > 0 ? startIndex + 1 : 0} - {Math.min(startIndex + itemsPerPage, totalItems)} dari {totalItems}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-xl leading-none block">chevron_left</span>
          </button>
          <button
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-xl leading-none block">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
}

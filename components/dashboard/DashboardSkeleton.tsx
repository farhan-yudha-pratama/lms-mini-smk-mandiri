import React from 'react';

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between h-36">
            <div className="flex items-center justify-between">
              <div className="h-5 bg-gray-200 rounded w-1/2"></div>
              <div className="w-10 h-10 rounded-full bg-gray-100"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-1/3 mt-4"></div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
           <div className="h-5 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="p-6 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
               <div className="flex flex-col gap-2 w-full">
                 <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                 <div className="h-3 bg-gray-100 rounded w-1/4"></div>
               </div>
               <div className="h-3 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

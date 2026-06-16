import React from 'react';

export const ProductSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 animate-pulse">
      <div className="w-full h-56 bg-gray-200 dark:bg-gray-800 rounded-xl mb-4"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3 mb-2"></div>
      <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-3"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mb-4"></div>
      <div className="flex justify-between items-center">
        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
      </div>
    </div>
  );
};

export const DashboardSkeleton = () => {
  return (
    <div className="animate-pulse space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
        ))}
      </div>
      <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
    </div>
  );
};

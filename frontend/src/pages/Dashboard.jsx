import React from 'react';
export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Your Dashboard</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">Manage your active projects and matching requests.</p>
        </div>
      </div>
      <div className="p-8 rounded-3xl bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30">
        <p className="text-gray-500 dark:text-gray-400 text-center font-medium">Dashboard content will be displayed here</p>
      </div>
    </div>
  );
}

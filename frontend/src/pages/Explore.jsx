import React from 'react';
export default function Explore() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Explore Projects</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">Discover and join amazing hackathon initiatives.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder cards */}
        {[1,2,3].map(i => (
          <div key={i} className="h-64 rounded-2xl bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 flex items-center justify-center">
            <span className="text-gray-400 dark:text-gray-500 font-medium">Project Card {i}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

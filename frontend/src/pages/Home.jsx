import React from 'react';
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="text-center space-y-4 p-8 rounded-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 shadow-xl max-w-2xl mx-auto">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-purple-500 dark:from-indigo-400 dark:to-purple-400 mb-4 tracking-tight">Welcome to ProjectMate</h1>
        <p className="text-xl text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
          The ultimate platform for students to find projects, collaborate, and build incredible things together.
        </p>
      </div>
    </div>
  );
}

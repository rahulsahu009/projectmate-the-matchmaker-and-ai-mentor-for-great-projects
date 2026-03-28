import React from 'react';
import { useParams } from 'react-router-dom';
export default function ProjectDetails() {
  const { id } = useParams();
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="p-8 rounded-3xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-800/50 shadow-2xl">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Project Details</h1>
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-sm font-semibold">
          ID: {id}
        </div>
        <p className="mt-8 text-gray-600 dark:text-gray-400 text-lg">Full details of the project go here, including the team matching status and chat interface.</p>
      </div>
    </div>
  );
}

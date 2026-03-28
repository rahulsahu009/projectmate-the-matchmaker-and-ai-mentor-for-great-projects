import React from 'react';
export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md p-8 rounded-3xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-800/50 shadow-2xl">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center">Login to ProjectMate</h1>
        <p className="text-gray-500 dark:text-gray-400 text-center mb-8">Ready to jump back in?</p>
        <div className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-center text-gray-500 dark:text-gray-400">
          Form implementation goes here...
        </div>
      </div>
    </div>
  );
}

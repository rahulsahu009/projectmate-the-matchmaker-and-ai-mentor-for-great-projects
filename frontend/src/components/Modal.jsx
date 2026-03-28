import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 border-slate-200 dark:border-gray-700 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)] w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-5 border-b border-slate-100 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-wide">{title}</h2>
                    <button onClick={onClose} className="text-slate-400 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors focus:outline-none">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;

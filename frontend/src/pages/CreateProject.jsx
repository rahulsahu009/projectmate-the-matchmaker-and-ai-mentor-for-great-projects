import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/axios';
import { Sparkles } from 'lucide-react';

const CreateProject = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [requiredSkills, setRequiredSkills] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [enhancing, setEnhancing] = useState(false);
    const navigate = useNavigate();

    const handleEnhance = async () => {
        if (!description.trim()) {
            setError('Please write at least a basic description first so AI can enhance it.');
            return;
        }
        setEnhancing(true);
        setError('');
        try {
            const res = await api.post('/projects/enhance', { description });
            setDescription(res.data);
        } catch (err) {
            setError(err.response?.data || 'Failed to enhance description with AI');
        } finally {
            setEnhancing(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/projects', { title, description, requiredSkills });
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Error creating project');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-slate-900 dark:text-white p-8 flex justify-center items-center transition-colors duration-300">
            <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl p-8 border border-slate-200 dark:border-gray-800 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] relative overflow-hidden transition-colors">
                <div className="absolute top-0 right-0 w-64 h-64 bg-electric-blue/5 blur-3xl rounded-full pointer-events-none"></div>
                <h1 className="text-3xl font-extrabold mb-6 text-slate-900 dark:text-white">Create New Project</h1>
                
                {error && <div className="mb-4 p-3 border-l-4 border-red-500 dark:border-red-500 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm font-medium">{error}</div>}
                
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <div>
                        <label className="block text-slate-700 dark:text-gray-300 font-bold mb-1.5 text-sm uppercase tracking-wider">Project Title</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} required
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl focus:border-electric-blue focus:outline-none focus:ring-2 focus:ring-electric-blue/20 transition-all text-slate-900 dark:text-white font-medium" />
                    </div>
                    <div>
                        <div className="flex justify-between items-end mb-1.5">
                            <label className="block text-slate-700 dark:text-gray-300 font-bold text-sm uppercase tracking-wider">Description</label>
                            <button type="button" onClick={handleEnhance} disabled={enhancing || !description} className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 text-neon-purple dark:text-purple-400 rounded-lg border border-purple-100 dark:border-purple-800/50 hover:bg-purple-100 dark:hover:bg-purple-900/40 hover:border-purple-200 dark:hover:border-purple-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm">
                                <Sparkles className="w-3.5 h-3.5" />
                                {enhancing ? 'Enhancing...' : 'Enhance Description'}
                            </button>
                        </div>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} required rows="5"
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl focus:border-electric-blue focus:outline-none focus:ring-2 focus:ring-electric-blue/20 transition-all text-slate-900 dark:text-white font-medium placeholder:text-slate-400 dark:placeholder:text-gray-500"
                            placeholder="Describe your project, goals, and what you're building..." />
                    </div>
                    <div>
                        <label className="block text-slate-700 dark:text-gray-300 font-bold mb-1.5 text-sm uppercase tracking-wider">Required Skills</label>
                        <input type="text" value={requiredSkills} onChange={e => setRequiredSkills(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl focus:border-electric-blue focus:outline-none focus:ring-2 focus:ring-electric-blue/20 transition-all text-slate-900 dark:text-white font-medium placeholder:text-slate-400 dark:placeholder:text-gray-500"
                            placeholder="e.g. React, Spring Boot, MySQL" />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-100 dark:border-gray-800 transition-colors">
                        <button type="button" onClick={() => navigate('/dashboard')} className="order-2 sm:order-1 px-6 py-3 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-600 dark:text-gray-300 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-gray-700 hover:text-slate-900 dark:hover:text-white transition-colors shadow-sm">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="order-1 sm:order-2 flex-1 px-6 py-3 bg-gradient-to-r from-electric-blue to-teal-400 text-white font-bold rounded-xl hover:shadow-[0_8px_20px_rgba(2,132,199,0.25)] transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none">
                            {loading ? 'Generating AI Roadmap...' : 'Create Project'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProject;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Link as LinkIcon, AlertCircle } from 'lucide-react';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

export default function CreateProject() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requiredSkills: '',
    githubRepoUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Creator mapping handled seamlessly through React State propagation
      const payload = {
        ...formData,
        status: 'OPEN',
        creator: user
      };
      const response = await api.post('/projects', payload);
      navigate(`/projects/${response.data.id}`);
    } catch (err) {
      setError('Failed to create project. Ensure you are fully authenticated and connected.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent mb-8">Launch a New Project</h1>
          
          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center shadow-lg border border-red-100 dark:border-red-900/50">
              <AlertCircle className="h-5 w-5 mr-2" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 opacity-80">Project Title</label>
              <input 
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-gray-900 dark:text-white"
                placeholder="e.g. AI Workflow Optimizer"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 opacity-80">Pitch & Vision</label>
              <textarea 
                required
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-indigo-500 transition-all resize-none text-gray-900 dark:text-white"
                placeholder="Explain the problem you're solving across hackathon requirements..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 opacity-80">Tech Stack Target (Comma Separated)</label>
              <input 
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-indigo-500 transition-all text-gray-900 dark:text-white"
                placeholder="e.g. React, Spring Boot, Three.js"
                value={formData.requiredSkills}
                onChange={(e) => setFormData({...formData, requiredSkills: e.target.value})}
              />
            </div>

            <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
              <label className="block text-sm font-medium mb-2 flex items-center">
                <LinkIcon className="h-4 w-4 mr-2 text-indigo-500" />
                GitHub Repository Timeline <span className="ml-2 text-xs opacity-50 font-normal px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-md">Optional</span>
              </label>
              <p className="text-xs text-gray-500 mb-3 ml-6">Attach a public repository URL to seamlessly track and display live commit histories locally.</p>
              <input 
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-indigo-500 transition-all text-gray-900 dark:text-white"
                placeholder="https://github.com/owner/repository"
                value={formData.githubRepoUrl}
                onChange={(e) => setFormData({...formData, githubRepoUrl: e.target.value})}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 mt-8 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold text-lg shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.5)] transition-all outline-none focus:ring-4 focus:ring-indigo-500/50 flex items-center justify-center disabled:opacity-50 hover:-translate-y-1"
            >
              {loading ? <span className="animate-pulse">Launching Payload...</span> : <><PlusCircle className="mr-2" /> Launch Project Profile</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

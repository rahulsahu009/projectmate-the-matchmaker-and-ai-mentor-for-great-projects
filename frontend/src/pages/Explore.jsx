import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Code2, ArrowRight } from 'lucide-react';
import api from '../services/api';

export default function Explore() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/projects');
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const Skeletons = () => (
    Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="rounded-2xl bg-white/40 dark:bg-gray-900/40 border border-gray-200/50 dark:border-gray-800/50 p-6 flex flex-col justify-between h-64 animate-pulse">
        <div>
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded-md w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-md w-full mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-md w-5/6"></div>
        </div>
        <div className="h-10 bg-indigo-200 dark:bg-indigo-900/30 rounded-xl w-full mt-4"></div>
      </div>
    ))
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-10 text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Explore Projects</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">Discover and join amazing hackathon initiatives.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <Skeletons />
        ) : projects.length > 0 ? (
          projects.map((project) => (
            <div key={project.id} className="group flex flex-col justify-between h-full rounded-3xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white truncate pr-2">{project.title}</h2>
                  <div className={`px-3 py-1 text-xs font-bold rounded-full ${project.status === 'OPEN' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                    {project.status}
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 h-16 overflow-hidden line-clamp-3 leading-relaxed">
                  {project.description}
                </p>
                <div className="mb-6 flex flex-wrap gap-2">
                  {project.requiredSkills?.split(',').map((skill, index) => (
                    <span key={index} className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold border border-indigo-100 dark:border-indigo-800/30">
                      <Code2 className="h-3 w-3" />
                      <span>{skill.trim()}</span>
                    </span>
                  ))}
                </div>
              </div>
              
              <Link to={`/project/${project.id}`} className="mt-auto flex items-center justify-center space-x-2 py-3 w-full rounded-xl bg-gray-100 hover:bg-indigo-600 hover:text-white dark:bg-gray-800 dark:hover:bg-indigo-600 text-gray-900 dark:text-gray-200 font-semibold transition-colors duration-300">
                <span>View Details</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 text-center">No projects found.</h3>
          </div>
        )}
      </div>
    </div>
  );
}

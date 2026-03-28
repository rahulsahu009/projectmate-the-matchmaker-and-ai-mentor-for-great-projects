import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import api from '../services/api';
import { LayoutDashboard } from 'lucide-react';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Parse user from local storage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!user.id) {
      setLoading(false);
      return;
    }
    
    const fetchDashboardData = async () => {
      try {
        const [projRes, reqRes] = await Promise.all([
          api.get(`/users/${user.id}/projects`),
          api.get(`/users/${user.id}/requests`)
        ]);
        setProjects(projRes.data);
        setRequests(reqRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user.id]);

  // Transform data for Recharts PieChart (Projects by Status)
  const projectStatusCounts = projects.reduce((acc, current) => {
    acc[current.status] = (acc[current.status] || 0) + 1;
    return acc;
  }, {});

  const data = Object.keys(projectStatusCounts).map(status => ({
    name: status,
    value: projectStatusCounts[status]
  }));

  const COLORS = ['#6366f1', '#eab308', '#22c55e', '#ef4444'];

  if (!user.id) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-center text-gray-500 dark:text-gray-400 font-medium text-xl">
        Please log in to view your personalized dashboard.
      </div>
    );
  }

  const SkeletonBlocks = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse mt-8">
      <div className="h-80 rounded-3xl bg-gray-200/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-800/50 p-6 flex flex-col justify-between">
         <div className="h-6 w-1/3 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
         <div className="h-32 w-full bg-gray-300 dark:bg-gray-700 rounded-xl mt-6"></div>
         <div className="h-10 w-full bg-gray-300 dark:bg-gray-700 rounded-xl mt-6"></div>
      </div>
      <div className="h-80 rounded-3xl bg-gray-200/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-800/50 p-6 flex justify-center items-center">
         <div className="h-48 w-48 rounded-full bg-gray-300 dark:bg-gray-700 mb-6"></div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center space-x-3 mb-10">
        <LayoutDashboard className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Your Dashboard</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-1 font-medium">Hello, {user.name}. Manage your projects and matches.</p>
        </div>
      </div>

      {loading ? (
        <SkeletonBlocks />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          
          <div className="flex flex-col p-8 rounded-3xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-800/50 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 tracking-tight">Overview Hub</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-6 text-center shadow-inner hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors">
                <span className="text-5xl font-extrabold text-indigo-600 dark:text-indigo-400 drop-shadow-sm">{projects.length}</span>
                <p className="text-sm text-indigo-800 dark:text-indigo-300 mt-3 font-semibold uppercase tracking-wider">Projects Created</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-6 text-center shadow-inner hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors">
                <span className="text-5xl font-extrabold text-purple-600 dark:text-purple-400 drop-shadow-sm">{requests.length}</span>
                <p className="text-sm text-purple-800 dark:text-purple-300 mt-3 font-semibold uppercase tracking-wider">Team Requests</p>
              </div>
            </div>
            
            <div className="mt-8 flex-1">
               <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Your Recent Projects</h3>
               {projects.length > 0 ? (
                 <ul className="space-y-3">
                   {projects.slice(0, 3).map(p => (
                      <li key={p.id} className="flex justify-between items-center px-5 py-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm transition-transform hover:scale-[1.02]">
                        <span className="font-semibold text-gray-800 dark:text-gray-200 truncate pr-4 text-base">{p.title}</span>
                        <span className={`px-3 py-1 text-xs font-black tracking-wider uppercase rounded-lg ${p.status === 'OPEN' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-500' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>{p.status}</span>
                      </li>
                   ))}
                 </ul>
               ) : (
                 <p className="text-gray-500 font-medium bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl text-center">You haven't created any projects yet.</p>
               )}
            </div>
          </div>

          <div className="flex flex-col p-8 rounded-3xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-800/50 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 tracking-tight">Status Analytics</h2>
            {data.length > 0 ? (
              <div className="flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(20, 20, 30, 0.8)', color: '#fff', backdropFilter: 'blur(8px)' }}
                      itemStyle={{ fontWeight: 'bold' }}
                    />
                    <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontWeight: '600' }}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-800/30 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 text-gray-500 font-medium">
                Not enough data to visualize.
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}

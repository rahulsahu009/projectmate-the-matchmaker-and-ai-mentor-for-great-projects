import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../lib/axios';

const Admin = () => {
    const [stats, setStats] = useState({ users: 0, projects: 0, activeChats: 0 });
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        api.get('/admin/projects').then(res => {
            setProjects(res.data);
            setStats(prev => ({ ...prev, projects: res.data.length }));
        }).catch(err => console.error(err));
        
        api.get('/admin/stats').then(res => {
            setStats(res.data);
        }).catch(err => console.error(err));

        api.get('/admin/users').then(res => {
            setUsers(res.data);
        }).catch(err => console.error(err));
    }, []);

    const chartData = [
        { name: 'Jan', projects: Math.floor(stats.projects * 0.2) || 2, users: Math.floor(stats.users * 0.2) || 5 },
        { name: 'Feb', projects: Math.floor(stats.projects * 0.35) || 5, users: Math.floor(stats.users * 0.4) || 12 },
        { name: 'Mar', projects: Math.floor(stats.projects * 0.5) || 9, users: Math.floor(stats.users * 0.6) || 20 },
        { name: 'Apr', projects: Math.floor(stats.projects * 0.7) || 15, users: Math.floor(stats.users * 0.75) || 35 },
        { name: 'May', projects: Math.floor(stats.projects * 0.85) || 20, users: Math.floor(stats.users * 0.9) || 45 },
        { name: 'Jun', projects: stats.projects, users: stats.users }
    ];

    const handleToggleProjectStatus = async (id, currentStatus) => {
        try {
            const newStatus = !currentStatus;
            await api.patch(`/admin/projects/${id}/status?active=${newStatus}`);
            setProjects(projects.map(p => p.id === id ? { ...p, active: newStatus } : p));
        } catch (error) {
            alert(error.response?.data || 'Error updating project status');
        }
    };

    const handleToggleUserStatus = async (id, currentStatus) => {
        try {
            const newStatus = !currentStatus;
            await api.patch(`/admin/users/${id}/status?active=${newStatus}`);
            setUsers(users.map(u => u.id === id ? { ...u, active: newStatus } : u));
        } catch (error) {
            alert(error.response?.data || 'Error updating user status');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-slate-900 dark:text-gray-100 p-8 transition-colors duration-300">
            <h1 className="text-3xl font-bold mb-8 text-slate-900 dark:text-white">Admin Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-slate-200 dark:border-gray-800 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] relative overflow-hidden transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><span className="text-6xl drop-shadow-xl text-slate-900 dark:text-white">👥</span></div>
                    <h3 className="text-slate-500 dark:text-gray-400 font-medium">Total Users</h3>
                    <p className="text-4xl font-bold text-electric-blue">{stats.users}</p>
                </div>
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-slate-200 dark:border-gray-800 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] relative overflow-hidden transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><span className="text-6xl drop-shadow-xl text-slate-900 dark:text-white">🚀</span></div>
                    <h3 className="text-slate-500 dark:text-gray-400 font-medium">Active Projects</h3>
                    <p className="text-4xl font-bold text-neon-purple">{stats.projects}</p>
                </div>
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-slate-200 dark:border-gray-800 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] relative overflow-hidden transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><span className="text-6xl drop-shadow-xl text-slate-900 dark:text-white">💬</span></div>
                    <h3 className="text-slate-500 dark:text-gray-400 font-medium">Active Chats</h3>
                    <p className="text-4xl font-bold text-teal-600">{stats.activeChats}</p>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-slate-200 dark:border-gray-800 mb-8 h-[380px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] relative overflow-hidden transition-colors">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 dark:bg-amber-500/10 blur-3xl rounded-full"></div>
                <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="text-amber-500">📈</span> System Growth Dynamics
                </h3>
                <ResponsiveContainer width="100%" height="85%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorProjects" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#9333ea" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                        <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} tickLine={false} axisLine={false} />
                        <YAxis stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} tickLine={false} axisLine={false} />
                        <Tooltip 
                            contentStyle={{backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', color: '#0f172a', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}}
                            itemStyle={{color: '#0f172a'}}
                        />
                        <Area type="monotone" dataKey="projects" name="New Projects" stroke="#9333ea" strokeWidth={3} fillOpacity={1} fill="url(#colorProjects)" />
                        <Area type="monotone" dataKey="users" name="Active Users" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-slate-200 dark:border-gray-800 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-colors">
                    <h3 className="text-xl font-bold mb-4 border-b border-slate-200 dark:border-gray-800 pb-2 text-slate-900 dark:text-white">User Management</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-slate-500 dark:text-gray-400 border-b border-slate-200 dark:border-gray-800 text-sm">
                                    <th className="pb-3 font-semibold">Name</th>
                                    <th className="pb-3 font-semibold">Role</th>
                                    <th className="pb-3 font-semibold">Status</th>
                                    <th className="pb-3 font-semibold">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id} className="border-b border-slate-100 dark:border-gray-800 hover:bg-slate-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="py-3 font-medium">
                                            <Link to={`/user/${u.id}`} className="text-electric-blue hover:text-slate-900 dark:hover:text-white hover:underline transition-colors">{u.name}</Link>
                                        </td>
                                        <td className="py-3 text-sm text-slate-600 dark:text-gray-300">{u.role}</td>
                                        <td className="py-3">
                                            <span className={`px-2 py-1 text-xs rounded-full border font-semibold ${u.active ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' : 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800'}`}>
                                                {u.active ? 'ACTIVE' : 'SUSPENDED'}
                                            </span>
                                        </td>
                                        <td className="py-3">
                                            {u.role !== 'ADMIN' && (
                                                <button onClick={() => handleToggleUserStatus(u.id, u.active)} className="text-xs font-semibold border border-slate-300 dark:border-gray-600 text-slate-600 dark:text-gray-300 px-3 py-1 rounded hover:bg-slate-100 dark:hover:bg-gray-700 hover:text-slate-900 dark:hover:text-white transition-colors">
                                                    {u.active ? 'Suspend' : 'Activate'}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-slate-200 dark:border-gray-800 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-colors">
                    <h3 className="text-xl font-bold mb-4 border-b border-slate-200 dark:border-gray-800 pb-2 text-slate-900 dark:text-white">Project Moderation</h3>
                    <div className="overflow-x-auto max-h-[300px]">
                        <table className="w-full text-left">
                            <thead className="sticky top-0 bg-white dark:bg-gray-900 z-10 transition-colors">
                                <tr className="text-slate-500 dark:text-gray-400 border-b border-slate-200 dark:border-gray-800 text-sm">
                                    <th className="pb-3 font-semibold">Title</th>
                                    <th className="pb-3 font-semibold">Creator</th>
                                    <th className="pb-3 font-semibold">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projects.map(p => (
                                    <tr key={p.id} className="border-b border-slate-100 dark:border-gray-800 hover:bg-slate-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="py-3 pr-2 truncate max-w-[150px] font-medium text-slate-900 dark:text-white">
                                            <span className={p.active ? "text-slate-800 dark:text-gray-200" : "text-slate-400 dark:text-gray-500 line-through"}>{p.title}</span>
                                        </td>
                                        <td className="py-3 text-sm">
                                            <span className={p.active ? "text-slate-600 dark:text-gray-300" : "text-slate-400 dark:text-gray-500"}>{p.createdBy?.name || 'Unknown'}</span>
                                        </td>
                                        <td className="py-3">
                                            {p.active ? (
                                                <button onClick={() => handleToggleProjectStatus(p.id, p.active)} className="text-xs font-bold bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-3 py-1 rounded hover:bg-red-600 hover:text-white hover:shadow-[0_4px_10px_rgba(239,68,68,0.3)] transition-all">
                                                    Delete
                                                </button>
                                            ) : (
                                                <button onClick={() => handleToggleProjectStatus(p.id, p.active)} className="text-xs font-bold bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-3 py-1 rounded hover:bg-green-600 hover:text-white hover:shadow-[0_4px_10px_rgba(34,197,94,0.3)] transition-all flex items-center gap-1">
                                                    Restore
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Admin;

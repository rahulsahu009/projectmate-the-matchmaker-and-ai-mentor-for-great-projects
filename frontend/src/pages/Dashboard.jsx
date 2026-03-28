import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../lib/axios';
import { useNavigate, Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { User, Activity, CheckCircle, Code2, Clock } from 'lucide-react';

const analyticsData = [
    { name: 'Jan', activity: 12, collaborations: 2 },
    { name: 'Feb', activity: 19, collaborations: 3 },
    { name: 'Mar', activity: 30, collaborations: 5 },
    { name: 'Apr', activity: 25, collaborations: 4 },
    { name: 'May', activity: 48, collaborations: 8 },
    { name: 'Jun', activity: 65, collaborations: 12 },
];

// Real data will be fetched inside the component instead of using mockPrevious

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [myRequests, setMyRequests] = useState([]);
    const [stats, setStats] = useState({ joined: 0, completed: 0 });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [myProjects, setMyProjects] = useState([]);
    const [allHistory, setAllHistory] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const reqsRes = await api.get('/team-requests/user');
                const myRequestsData = reqsRes.data;
                setMyRequests(myRequestsData);
                
                let profileJoined = 0;
                let profileCompleted = 0;
                let userCreatedProjects = [];

                if (user) {
                    const profileRes = await api.get(`/users/${user.id}/profile`);
                    profileJoined = profileRes.data.projectsJoined;
                    profileCompleted = profileRes.data.projectsCompleted;
                    setStats({ joined: profileJoined, completed: profileCompleted });
                    
                    const projectsRes = await api.get('/projects');
                    userCreatedProjects = projectsRes.data.filter(p => p.createdBy?.id === user.id);
                }

                const myCreatedMappings = userCreatedProjects.map(p => ({
                    id: p.id,
                    title: p.title,
                    description: p.description,
                    role: 'Project Lead',
                    status: p.completed ? 'Completed' : (p.status || 'Active'),
                    progress: p.progressPercentage || 0,
                    isCompleted: p.completed
                }));

                const myJoinedMappings = myRequestsData.filter(r => r.status === 'ACCEPTED').map(r => ({
                    id: r.project.id || r.project,
                    title: r.project.title || 'Joined Project',
                    description: r.project.description || '',
                    role: r.role || 'Contributor',
                    status: r.project.completed ? 'Completed' : (r.project.status || 'Active'),
                    progress: r.project.progressPercentage || 0,
                    isCompleted: r.project.completed
                }));

                const combinedProjects = [...myCreatedMappings, ...myJoinedMappings];
                setAllHistory(combinedProjects);
                
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchDashboardData();
    }, [user]);

    const activeProject = allHistory.find(p => !p.isCompleted);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-gray-950 p-4 sm:p-8 transition-colors duration-300">
            <div className="max-w-[1440px] mx-auto space-y-8">
                
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Developer Dashboard</h1>
                    <button onClick={() => navigate('/create-project')} className="px-6 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 border border-teal-600/50 rounded-lg text-white font-bold hover:shadow-[0_4px_15px_rgba(20,184,166,0.3)] dark:hover:shadow-[0_4px_15px_rgba(20,184,166,0.5)] transition-all transform hover:-translate-y-0.5">
                        + Initialize Project
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    
                    {/* Left Column: Profile & Active Project */}
                    <div className="lg:col-span-1 xl:col-span-1 space-y-8">
                        
                        {/* Profile Overview */}
                        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] relative overflow-hidden transition-colors">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-neon-purple/5 blur-3xl rounded-full"></div>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-gray-800 border-2 border-electric-blue flex items-center justify-center text-2xl font-bold text-slate-700 dark:text-gray-300 z-10 transition-colors">
                                    {user?.name?.[0]?.toUpperCase() || <User />}
                                </div>
                                <div className="z-10">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user?.name}</h2>
                                    <p className="text-electric-blue text-sm font-medium">Role: {user?.role}</p>
                                </div>
                            </div>
                            
                            <div className="flex gap-4 mt-6 mb-6">
                                <div className="flex-1 bg-slate-50 dark:bg-gray-800/50 p-3 rounded-xl border border-slate-100 dark:border-gray-700 text-center relative overflow-hidden group transition-colors">
                                    <div className="absolute inset-0 bg-neon-purple/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <span className="block text-3xl font-bold text-neon-purple mb-1 relative z-10">{stats.joined}</span>
                                    <span className="text-[10px] text-slate-600 dark:text-gray-400 uppercase font-bold tracking-widest relative z-10">Projects Joined</span>
                                </div>
                                <div className="flex-1 bg-slate-50 dark:bg-gray-800/50 p-3 rounded-xl border border-slate-100 dark:border-gray-700 text-center relative overflow-hidden group transition-colors">
                                    <div className="absolute inset-0 bg-electric-blue/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <span className="block text-3xl font-bold text-electric-blue mb-1 relative z-10">{stats.completed}</span>
                                    <span className="text-[10px] text-slate-600 dark:text-gray-400 uppercase font-bold tracking-widest relative z-10">Projects Completed</span>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-slate-600 dark:text-gray-400 uppercase font-semibold tracking-wider mb-2">Technical Core</p>
                                    <div className="flex flex-wrap gap-2">
                                        {user?.skills?.split(',').map((s, i) => (
                                            <span key={i} className="px-3 py-1 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 font-semibold text-xs rounded-full border border-teal-100 dark:border-teal-800/50 shadow-sm">{s.trim()}</span>
                                        ))}
                                    </div>
                                </div>
                                {user?.githubLink && (
                                    <div className="pt-4 border-t border-slate-100 dark:border-gray-800">
                                        <a href={user.githubLink} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-slate-600 dark:text-gray-400 hover:text-electric-blue dark:hover:text-electric-blue transition-colors flex items-center gap-2">
                                            <Code2 className="w-4 h-4" /> View GitHub Profile
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Current Active Project */}
                        <div className="bg-gradient-to-br from-white to-slate-50 dark:from-gray-900 dark:to-gray-800/50 border border-slate-200 dark:border-gray-800 rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-colors">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-neon-purple" /> Current Mission
                            </h3>
                            {activeProject ? (
                                <div>
                                    <h4 className="text-xl font-bold text-electric-blue mb-2">{activeProject.title}</h4>
                                    <p className="text-sm text-slate-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">{activeProject.description}</p>
                                    
                                    <div className="space-y-2 mb-6">
                                        <div className="flex justify-between text-xs text-slate-600 dark:text-gray-400 font-semibold">
                                            <span>Milestone Progress</span>
                                            <span className="text-electric-blue">{activeProject.progress}%</span>
                                        </div>
                                        <div className="w-full h-2 bg-slate-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                                            <div className="h-full bg-gradient-to-r from-neon-purple to-electric-blue rounded-full shadow-[0_2px_4px_rgba(2,132,199,0.3)]" style={{ width: `${activeProject.progress}%` }}></div>
                                        </div>
                                    </div>
                                    <button onClick={() => navigate(`/project/${activeProject.id}`)} className="w-full py-2.5 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700 hover:text-electric-blue dark:hover:text-electric-blue transition-all text-sm font-bold shadow-sm">
                                        Enter Workspace
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-slate-600 dark:text-gray-400 text-sm mb-4 font-medium">No active operation currently assigned.</p>
                                    <Link to="/explore" className="text-electric-blue hover:text-teal-600 dark:hover:text-teal-400 font-bold text-sm underline transition-colors">Find a Project</Link>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Right Column: Analytics & History */}
                    <div className="lg:col-span-2 xl:col-span-3 space-y-8">
                        
                        {/* Performance Analytics Chart */}
                        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] py-6 transition-colors">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-electric-blue" /> Output Analytics
                            </h3>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={analyticsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                        <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} tickLine={false} axisLine={false} />
                                        <Tooltip 
                                            contentStyle={{backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                                            itemStyle={{color: '#0f172a'}}
                                        />
                                        <Area type="monotone" dataKey="activity" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorActivity)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Previous Projects History */}
                        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-colors">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-teal-500" /> Operational History
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-200 dark:border-gray-800">
                                            <th className="py-3 px-4 text-xs font-bold text-slate-600 dark:text-gray-400 uppercase tracking-wider">Project Name</th>
                                            <th className="py-3 px-4 text-xs font-bold text-slate-600 dark:text-gray-400 uppercase tracking-wider">Role Assumed</th>
                                            <th className="py-3 px-4 text-xs font-bold text-slate-600 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                                        {allHistory.length > 0 ? allHistory.map(hist => (
                                            <tr key={hist.id} className="hover:bg-slate-50 dark:hover:bg-gray-800/50 transition-colors group">
                                                <td className="py-4 px-4">
                                                    <span className="font-bold text-slate-800 dark:text-gray-200 group-hover:text-electric-blue transition-colors line-clamp-1">{hist.title}</span>
                                                </td>
                                                <td className="py-4 px-4 text-sm font-medium text-slate-600 dark:text-gray-400">{hist.role}</td>
                                                <td className="py-4 px-4 text-sm font-medium text-slate-600 dark:text-gray-400">{hist.isCompleted ? 'Completed' : 'Ongoing'}</td>
                                                <td className="py-4 px-4">
                                                    <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded w-fit border shadow-sm ${hist.isCompleted ? 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800/50' : 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800/50'}`}>
                                                        <CheckCircle className="w-3.5 h-3.5" /> {hist.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="4" className="py-6 px-4 text-center text-sm font-medium text-slate-500 dark:text-gray-500">
                                                    No operational history found. Search for projects to join!
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

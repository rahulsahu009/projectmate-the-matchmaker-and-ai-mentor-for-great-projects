import React, { useState, useEffect, useContext } from 'react';
import { Search, Filter, Code2, Users, Clock, Plus } from 'lucide-react';
import api from '../lib/axios';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Explore = () => {
    const { user } = useContext(AuthContext);
    const [projects, setProjects] = useState([]);
    const [myRequests, setMyRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedTitleId, setExpandedTitleId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllProjects = async () => {
            try {
                const res = await api.get('/projects');
                setProjects(res.data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch projects.", error);
            }
        };

        const fetchMyRequests = async () => {
            if (!user) return;
            try {
                const res = await api.get('/team-requests/user');
                setMyRequests(res.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchAllProjects();
        fetchMyRequests();
    }, [user]);

    const handleJoin = async (projectId) => {
        if (!user) {
            alert('Please login to apply for projects.');
            return;
        }
        try {
            const res = await api.post('/team-requests', { projectId });
            setMyRequests(prev => [...prev, res.data]);
            alert('Request sent successfully!');
        } catch (error) {
            alert(error.response?.data?.message || 'Error sending request');
        }
    };

    const filteredProjects = projects.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (p.requiredSkills || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen py-16 relative bg-slate-50 dark:bg-gray-950 transition-colors duration-300">
            <div className="absolute top-0 right-1/4 w-[40rem] h-[40rem] bg-electric-blue/5 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
                
                {/* Header & Search */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-8 border-b border-slate-200 dark:border-gray-800 transition-colors">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-wide">Explore Projects</h1>
                        <p className="text-slate-600 dark:text-gray-400 font-normal text-lg">Discover initiatives that match your technical expertise.</p>
                    </div>
                    
                    <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-electric-blue transition-colors" />
                            <input 
                                type="text" 
                                placeholder="Search by title or skills..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full sm:w-80 pl-12 pr-4 py-3 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-electric-blue/50 focus:shadow-[0_4px_15px_rgba(2,132,199,0.1)] transition-all placeholder:text-slate-400 dark:placeholder:text-gray-500"
                            />
                        </div>
                        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-700 dark:text-gray-300 font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors whitespace-nowrap shadow-sm">
                            <Filter className="w-5 h-5" /> Filters
                        </button>
                        <button onClick={() => navigate('/create-project')} className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-electric-blue to-neon-purple text-white font-bold rounded-xl hover:shadow-[0_4px_20px_rgba(147,51,234,0.3)] transition-all whitespace-nowrap transform hover:-translate-y-0.5">
                            <Plus className="w-5 h-5" /> Initialize Project
                        </button>
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="text-center py-32 flex flex-col items-center justify-center">
                        <div className="w-12 h-12 border-4 border-electric-blue/20 border-t-electric-blue rounded-full animate-spin shadow-[0_0_15px_rgba(0,240,255,0.4)] mb-4"></div>
                        <div className="text-electric-blue font-medium animate-pulse tracking-wide">Loading opportunities...</div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {filteredProjects.map(p => (
                                <div key={p.id} className="glass rounded-2xl p-7 dark:border-gray-800/80 hover:border-electric-blue/40 dark:hover:border-electric-blue/50 transition-all duration-300 flex flex-col h-full group hover:shadow-[0_12px_40px_rgba(2,132,199,0.15)] dark:hover:shadow-[0_12px_40px_rgba(2,132,199,0.3)] transform hover:-translate-y-2 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-electric-blue/10 dark:from-electric-blue/20 to-transparent rounded-bl-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <div className="flex justify-between items-start mb-5 relative z-10">
                                        <div className="p-3 bg-white dark:bg-gray-800/80 rounded-xl border border-slate-200 dark:border-gray-700 shadow-sm transition-colors">
                                            <Code2 className="w-6 h-6 text-electric-blue drop-shadow-[0_2px_4px_rgba(2,132,199,0.3)]" />
                                        </div>
                                        <span className="px-3 py-1.5 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full text-xs font-bold border border-green-300 dark:border-green-800/50 flex items-center gap-1.5 shadow-sm">
                                            <Clock className="w-3.5 h-3.5" /> Active
                                        </span>
                                    </div>
                                    <div className="relative z-20 mb-3">
                                        <h2 
                                            className="text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-electric-blue dark:group-hover:text-electric-blue transition-colors line-clamp-1 w-fit"
                                            onMouseEnter={(e) => {
                                                const el = e.currentTarget;
                                                if (el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth) {
                                                    el.style.cursor = 'pointer';
                                                    el.title = "Click to view full title";
                                                } else {
                                                    el.style.cursor = 'default';
                                                    el.title = "";
                                                }
                                            }}
                                            onClick={(e) => { 
                                                e.preventDefault(); 
                                                e.stopPropagation(); 
                                                const el = e.currentTarget;
                                                if (el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth) {
                                                    setExpandedTitleId(expandedTitleId === p.id ? null : p.id); 
                                                }
                                            }}
                                        >
                                            {p.title}
                                        </h2>
                                        {expandedTitleId === p.id && (
                                            <>
                                                <div 
                                                    className="fixed inset-0 z-40" 
                                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setExpandedTitleId(null); }} 
                                                />
                                                <div className="absolute top-0 left-0 w-[calc(100%+24px)] -mt-3 -ml-3 p-5 bg-white dark:bg-gray-800 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-slate-200 dark:border-gray-700 z-50 ring-1 ring-black/5 dark:ring-white/5">
                                                    <div className="flex justify-between items-start gap-4">
                                                        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white break-words leading-tight">{p.title}</h2>
                                                        <button 
                                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setExpandedTitleId(null); }}
                                                            className="p-1.5 bg-slate-100 dark:bg-gray-700/50 rounded-full text-slate-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shrink-0"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <p className="text-slate-700 dark:text-gray-300 text-sm mb-6 flex-1 line-clamp-3 leading-relaxed font-normal relative z-10">{p.description}</p>
                                    
                                    <div className="space-y-6 mt-auto relative z-10">
                                        <div>
                                            <p className="text-xs font-bold text-slate-600 dark:text-gray-400 mb-3 uppercase tracking-wider">Required Skills</p>
                                            <div className="flex flex-wrap gap-2">
                                                {p.requiredSkills?.split(',').map((s, i) => (
                                                    <span key={i} className="px-3 py-1.5 bg-white dark:bg-gray-800/80 text-slate-800 dark:text-gray-200 text-xs font-semibold rounded-lg border border-slate-300 dark:border-gray-700/80 group-hover:border-electric-blue/40 dark:group-hover:border-electric-blue/30 transition-colors shadow-sm">{s.trim()}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="pt-6 border-t border-slate-200/60 dark:border-gray-700/60 flex justify-between items-center mt-2">
                                            <div className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-gray-300">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-neon-purple/20 to-electric-blue/20 dark:from-neon-purple/40 dark:to-electric-blue/40 flex items-center justify-center border border-purple-200 dark:border-purple-800/50">
                                                    <Users className="w-4 h-4 text-neon-purple dark:text-purple-300 drop-shadow-[0_2px_4px_rgba(147,51,234,0.3)]" />
                                                </div>
                                                <span className="font-bold text-slate-900 dark:text-gray-200">{p.createdBy?.name || 'Anonymous'}</span>
                                            </div>
                                            {(() => {
                                                if (p.createdBy?.id === user?.id) return (
                                                    <Link to={`/project/${p.id}`} className="px-5 py-2 block bg-white dark:bg-gray-800 hover:bg-electric-blue hover:text-white dark:hover:bg-gray-700 border border-electric-blue/50 dark:border-gray-700 text-electric-blue dark:text-gray-100 text-sm rounded-xl font-bold transition-all shadow-sm">
                                                        Manage
                                                    </Link>
                                                );
                                                
                                                const req = user ? myRequests.find(r => (r.project?.id || r.project) === p.id) : null;
                                                
                                                if (req && req.status === 'ACCEPTED') return (
                                                    <Link to={`/project/${p.id}`} className="px-5 py-2 block bg-green-500 text-white rounded-xl font-bold text-sm hover:bg-green-600 hover:shadow-[0_4px_15px_rgba(34,197,94,0.4)] transition-all transform hover:-translate-y-0.5">
                                                        Enter Project
                                                    </Link>
                                                );

                                                if (p.teamFinalized || p.isTeamFinalized) return (
                                                    <span className="px-5 py-2 block bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-400 rounded-xl font-bold text-sm border border-slate-300 dark:border-gray-700 shadow-sm">
                                                        Team Full
                                                    </span>
                                                );

                                                if (!user) return (
                                                    <Link to={`/login`} className="px-5 py-2 block bg-white dark:bg-gray-800 border border-slate-300 dark:border-gray-700 hover:border-electric-blue dark:hover:border-electric-blue hover:text-electric-blue text-slate-800 dark:text-gray-100 rounded-xl font-bold text-sm transition-all shadow-sm">
                                                        Login to Join
                                                    </Link>
                                                );

                                                if (!req) return (
                                                    <button onClick={() => handleJoin(p.id)} className="px-5 py-2 block bg-gradient-to-r from-electric-blue to-neon-purple hover:from-cyan-500 hover:to-purple-500 text-white rounded-xl font-bold text-sm hover:shadow-[0_4px_15px_rgba(2,132,199,0.3)] transition-all transform hover:-translate-y-0.5 outline-none border-none">
                                                        Join Team
                                                    </button>
                                                );
                                                
                                                if (req.status === 'PENDING') return (
                                                    <button disabled className="px-5 py-2 block bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50 rounded-xl font-bold text-sm cursor-not-allowed">
                                                        Requested
                                                    </button>
                                                );

                                                return (
                                                    <button disabled className="px-5 py-2 block bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/50 rounded-xl font-bold text-sm cursor-not-allowed">
                                                        Rejected
                                                    </button>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredProjects.length === 0 && (
                            <div className="text-center py-24 text-slate-500 dark:text-gray-400 bg-white dark:bg-gray-900 max-w-2xl mx-auto rounded-3xl mt-12 border border-slate-200 dark:border-gray-800 shadow-sm transition-colors">
                                No projects match your search criteria. Try different keywords.
                            </div>
                        )}
                        
                        {filteredProjects.length > 0 && (
                            <div className="text-center pt-12 pb-8">
                                <button className="px-8 py-3 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-800 dark:text-gray-200 rounded-full font-bold hover:border-electric-blue dark:hover:border-electric-blue hover:text-electric-blue dark:hover:text-electric-blue hover:shadow-[0_4px_15px_rgba(2,132,199,0.1)] transition-all shadow-sm">
                                    Load More Initiatives
                                </button>
                            </div>
                        )}
                    </>
                )}

            </div>
        </div>
    );
};

export default Explore;

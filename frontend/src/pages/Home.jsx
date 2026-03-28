import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Rocket, Target, Users, Zap, Star, ChevronRight, Code2 } from 'lucide-react';
import api from '../lib/axios';



const testimonials = [
    { id: 1, name: "Sarah J.", role: "Computer Science Junior", text: "Finding teammates used to be the hardest part of any hackathon. Through this platform, I assembled a dream team in hours." },
    { id: 2, name: "Mike T.", role: "Full Stack Developer", text: "The AI Mentor feature saved our project at 3 AM. It guided us through a complex WebSocket bug perfectly." },
    { id: 3, name: "Elena R.", role: "UI/UX Designer", text: "Finally, a platform that matches me with developers who desperately need design help. It's a win-win system." }
];

const Home = () => {
    const { user } = useContext(AuthContext);
    const [dbProjects, setDbProjects] = useState([]);
    const [myRequests, setMyRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedTitleId, setExpandedTitleId] = useState(null);
    
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await api.get('/projects');
                if (res.data && res.data.length > 0) {
                    setDbProjects(res.data.slice(0, 3).map(p => ({
                        id: p.id,
                        title: p.title,
                        desc: p.description,
                        skills: p.requiredSkills ? p.requiredSkills.split(',').map(s => s.trim()) : [],
                        status: 'Active',
                        createdBy: p.createdBy
                    })));
                }
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch recommended projects", err);
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

        fetchProjects();
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

    const displayProjects = dbProjects;

    return (
        <div className="flex flex-col min-h-screen transition-colors duration-300">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-neon-purple/10 to-transparent blur-3xl rounded-full -translate-y-1/2 translate-x-1/3 animate-[pulse-glow_4s_infinite]"></div>
                <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-r from-electric-blue/10 to-transparent blur-3xl rounded-full translate-y-1/3 -translate-x-1/3 animate-[pulse-glow_5s_infinite_reverse]"></div>
                
                <div className="relative max-w-5xl mx-auto text-center space-y-8 z-10">
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass border border-electric-blue/20 text-sm font-semibold text-electric-blue shadow-[0_4px_15px_rgba(2,132,199,0.1)] animate-[float_6s_infinite]">
                        <Zap className="w-4 h-4 text-neon-purple" />
                        <span className="tracking-wide">The Ultimate Student Developer Ecosystem</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                        Transform Ideas into <br />
                        <span className="gradient-text drop-shadow-sm">Reality Together</span>
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed font-normal">
                        ProjectMate analyzes your skills and intelligently connects you with the exact teammates you need to win your next hackathon or conquer that complex term project.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
                        <Link to="/explore" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-electric-blue to-neon-purple text-white rounded-full font-bold text-lg hover:shadow-[0_4px_30px_rgba(2,132,199,0.4)] transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1">
                            Explore Projects <ChevronRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Recommended Projects */}
            <section className="py-24 relative">
                <div className="absolute inset-0 bg-slate-900/[0.01] dark:bg-white/[0.01] border-y border-slate-200 dark:border-gray-800 pointer-events-none transition-colors"></div>
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-3 tracking-wide">Recommended For You</h2>
                            <p className="text-slate-500 dark:text-gray-400 text-lg font-normal">Curated opportunities matching your technical stack.</p>
                        </div>
                        <Link to="/explore" className="text-electric-blue hover:text-slate-700 dark:hover:text-gray-300 transition-colors font-semibold hidden sm:flex items-center gap-1 group">
                            View all <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                    </div>
                    {loading ? (
                        <div className="text-center py-20 flex flex-col items-center justify-center">
                            <div className="w-12 h-12 border-4 border-electric-blue/20 border-t-electric-blue rounded-full animate-spin shadow-[0_0_15px_rgba(0,240,255,0.4)] mb-4"></div>
                            <div className="text-electric-blue font-medium animate-pulse tracking-wide">Loading recommendations...</div>
                        </div>
                    ) : displayProjects.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {displayProjects.map((project, index) => (
                            <div key={project.id} className="glass rounded-2xl p-8 dark:border-gray-800/80 border border-slate-200 shadow-md hover:border-electric-blue/40 dark:hover:border-electric-blue/50 transition-all duration-300 flex flex-col h-full group hover:shadow-[0_12px_40px_rgba(2,132,199,0.15)] dark:hover:shadow-[0_12px_40px_rgba(2,132,199,0.3)] transform hover:-translate-y-2 relative overflow-hidden bg-gradient-to-b from-white to-slate-50/50 dark:from-gray-900/50 dark:to-gray-900" style={{ animationDelay: `${index * 150}ms` }}>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-electric-blue/10 dark:from-electric-blue/20 to-transparent rounded-bl-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="flex justify-between items-start mb-5 relative z-10">
                                    <div className="p-3 bg-white dark:bg-gray-800/80 rounded-xl border border-slate-200 dark:border-gray-700 shadow-sm transition-colors group-hover:border-electric-blue/30 group-hover:shadow-[0_4px_12px_rgba(2,132,199,0.1)]">
                                        <Code2 className="w-6 h-6 text-electric-blue drop-shadow-[0_2px_4px_rgba(2,132,199,0.3)] transition-transform group-hover:scale-110" />
                                    </div>
                                    <span className="px-3 py-1.5 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full text-xs font-bold border border-green-300 dark:border-green-800/50 flex items-center gap-1.5 shadow-sm">
                                        {project.status || 'Active'}
                                    </span>
                                </div>
                                
                                <div className="relative z-20 mb-3">
                                    <h3 
                                        className="text-2xl font-extrabold text-slate-900 dark:text-white group-hover:text-electric-blue dark:group-hover:text-electric-blue transition-colors line-clamp-2 w-fit"
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
                                                setExpandedTitleId(expandedTitleId === project.id ? null : project.id); 
                                            }
                                        }}
                                    >
                                        {project.title}
                                    </h3>
                                    {expandedTitleId === project.id && (
                                        <>
                                            <div 
                                                className="fixed inset-0 z-40" 
                                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setExpandedTitleId(null); }} 
                                            />
                                            <div className="absolute top-0 left-0 w-[calc(100%+24px)] -mt-3 -ml-3 p-5 bg-white dark:bg-gray-800 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-slate-200 dark:border-gray-700 z-50 ring-1 ring-black/5 dark:ring-white/5">
                                                <div className="flex justify-between items-start gap-4">
                                                    <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white break-words leading-tight">{project.title}</h3>
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
                                <p className="text-slate-700 dark:text-gray-300 text-sm mb-6 flex-1 leading-relaxed font-normal relative z-10">{project.desc}</p>
                                
                                <div className="space-y-6 mt-auto relative z-10">
                                    <div>
                                        <p className="text-xs font-bold text-slate-600 dark:text-gray-400 mb-3 uppercase tracking-wider">Required Skills</p>
                                        <div className="flex flex-wrap gap-2">
                                            {project.skills.map((s, i) => (
                                                <span key={i} className="px-3 py-1.5 bg-sky-50 dark:bg-gray-800/80 text-electric-blue dark:text-sky-300 text-xs font-semibold rounded-lg border border-sky-100 dark:border-gray-700/80 group-hover:border-electric-blue/40 dark:group-hover:border-electric-blue/30 transition-colors shadow-sm">{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="pt-6 border-t border-slate-200/60 dark:border-gray-700/60 flex flex-col mt-2">
                                        {(() => {
                                            if (!user) return (
                                                <Link to={`/login`} className="w-full px-6 py-3 block bg-white dark:bg-gray-800 border border-slate-300 dark:border-gray-700 hover:border-electric-blue dark:hover:border-electric-blue hover:text-electric-blue text-slate-800 dark:text-gray-100 rounded-xl font-bold text-sm transition-all shadow-sm text-center">
                                                    Login to Join
                                                </Link>
                                            );
                                            
                                            if (project.createdBy?.id === user?.id) return (
                                                <Link to={`/project/${project.id}`} className="w-full px-6 py-3 block bg-white dark:bg-gray-800 hover:bg-electric-blue hover:text-white dark:hover:bg-gray-700 border border-electric-blue/50 dark:border-gray-700 text-electric-blue dark:text-gray-100 text-sm rounded-xl font-bold transition-all shadow-sm text-center">
                                                    Manage Project
                                                </Link>
                                            );

                                            const req = myRequests.find(r => (r.project?.id || r.project) === project.id);
                                            if (!req) return (
                                                <button onClick={() => handleJoin(project.id)} className="w-full px-6 py-3 block bg-gradient-to-r from-electric-blue to-neon-purple hover:from-cyan-500 hover:to-purple-500 text-white rounded-xl font-bold text-sm hover:shadow-[0_4px_15px_rgba(2,132,199,0.3)] transition-all transform hover:-translate-y-0.5 outline-none border-none text-center">
                                                    Join Team
                                                </button>
                                            );
                                            
                                            if (req.status === 'ACCEPTED') return (
                                                <Link to={`/project/${project.id}`} className="w-full px-6 py-3 block bg-green-500 text-white rounded-xl font-bold text-sm hover:bg-green-600 hover:shadow-[0_4px_15px_rgba(34,197,94,0.4)] transition-all transform hover:-translate-y-0.5 text-center">
                                                    Enter Project
                                                </Link>
                                            );

                                            if (req.status === 'PENDING') return (
                                                <button disabled className="w-full px-6 py-3 block bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50 rounded-xl font-bold text-sm cursor-not-allowed text-center">
                                                    Requested
                                                </button>
                                            );

                                            return (
                                                <button disabled className="w-full px-6 py-3 block bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/50 rounded-xl font-bold text-sm cursor-not-allowed text-center">
                                                    Rejected
                                                </button>
                                            );
                                        })()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    ) : (
                        <div className="text-center py-16 text-slate-500 dark:text-gray-400 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl mx-auto max-w-2xl shadow-sm">
                            No recommended projects found.
                        </div>
                    )}
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-neon-purple/5 blur-[120px] pointer-events-none"></div>
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-20 tracking-wide">How ProjectMate Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
                        <div className="hidden md:block absolute top-12 left-[16%] w-[68%] border-t-2 border-dashed border-slate-300 dark:border-gray-700 z-0"></div>
                        <div className="relative z-10">
                            <div className="w-20 h-20 mx-auto bg-purple-50 dark:bg-purple-900/20 rounded-2xl border border-purple-200 dark:border-purple-800 flex items-center justify-center mb-8 shadow-[0_8px_30px_rgba(147,51,234,0.1)] transform hover:scale-110 transition-transform">
                                <Target className="w-10 h-10 text-neon-purple" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">1. Discover or Create</h3>
                            <p className="text-slate-600 dark:text-gray-400 font-normal leading-relaxed">Post your brilliant initiative or browse highly-filtered listings aligned with your abilities.</p>
                        </div>
                        <div className="relative z-10">
                            <div className="w-20 h-20 mx-auto bg-sky-50 dark:bg-sky-900/20 rounded-2xl border border-sky-200 dark:border-sky-800 flex items-center justify-center mb-8 shadow-[0_8px_30px_rgba(2,132,199,0.1)] transform hover:scale-110 transition-transform" style={{ animationDelay: '0.2s' }}>
                                <Users className="w-10 h-10 text-electric-blue" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">2. Assemble the Squad</h3>
                            <p className="text-slate-600 dark:text-gray-400 font-normal leading-relaxed">Evaluate collaborator requests or apply to join active workspaces. Seamlessly merge talents.</p>
                        </div>
                        <div className="relative z-10">
                            <div className="w-20 h-20 mx-auto bg-teal-50 dark:bg-teal-900/20 rounded-2xl border border-teal-200 dark:border-teal-800 flex items-center justify-center mb-8 shadow-[0_8px_30px_rgba(20,184,166,0.1)] transform hover:scale-110 transition-transform" style={{ animationDelay: '0.4s' }}>
                                <Rocket className="w-10 h-10 text-teal-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">3. Build & Succeed</h3>
                            <p className="text-slate-600 dark:text-gray-400 font-normal leading-relaxed">Collaborate via our dedicated workspaces. Access AI Mentors for instantaneous debugging.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 relative bg-slate-100 dark:bg-gray-900/80 transition-colors duration-300">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-200/50 dark:to-gray-800/50 pointer-events-none"></div>
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <h2 className="text-4xl font-bold text-slate-900 dark:text-white text-center mb-16 tracking-wide">Trusted by Top Students</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map(t => (
                            <div key={t.id} className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-2xl p-8 hover:-translate-y-2 transition-transform duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                                <div className="flex text-amber-400 mb-6 drop-shadow-[0_2px_4px_rgba(251,191,36,0.3)]">
                                    <Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" />
                                </div>
                                <p className="text-slate-700 dark:text-gray-300 italic mb-8 font-normal text-lg">"{t.text}"</p>
                                <div className="flex items-center gap-4 mt-auto pt-4 border-t border-slate-100 dark:border-gray-700">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg bg-gradient-to-br from-electric-blue to-neon-purple shadow-[0_4px_10px_rgba(147,51,234,0.3)]">{t.name[0]}</div>
                                    <div>
                                        <h4 className="text-slate-900 dark:text-white font-bold">{t.name}</h4>
                                        <p className="text-sm font-medium text-electric-blue">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;

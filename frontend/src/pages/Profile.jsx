import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { User, Code2, Shield, Activity, Share2 } from 'lucide-react';
import api from '../lib/axios';

const Profile = () => {
    const { id } = useParams();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get(`/users/${id}/profile`);
                const userData = res.data.user;
                userData.stats = {
                    joined: res.data.projectsJoined,
                    completed: res.data.projectsCompleted
                };
                setProfileData(userData);
            } catch (err) {
                console.error("Error fetching user", err);
                setError("User profile not found or restricted.");
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [id]);

    if (loading) {
        return <div className="min-h-screen bg-slate-50 dark:bg-gray-950 flex justify-center items-center text-neon-purple font-bold">Initializing Uplink...</div>;
    }

    if (error || !profileData) {
        return <div className="min-h-screen bg-slate-50 dark:bg-gray-950 flex justify-center items-center text-red-500 font-bold">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-gray-950 p-4 sm:p-8 transition-colors duration-300">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] relative overflow-hidden transition-colors">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-neon-purple/5 blur-3xl rounded-full pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-electric-blue/5 blur-3xl rounded-full pointer-events-none"></div>

                    <div className="relative z-10">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 border-b border-slate-200 dark:border-gray-800 pb-8 transition-colors">
                            <div className="w-32 h-32 shrink-0 rounded-full bg-slate-100 dark:bg-gray-800 border-4 border-electric-blue flex items-center justify-center text-5xl font-bold text-slate-700 dark:text-gray-300 shadow-sm transition-colors">
                                {profileData.name?.[0]?.toUpperCase() || <User size={48} />}
                            </div>
                            <div className="flex flex-col items-center md:items-start text-center md:text-left pt-2 w-full">
                                <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">{profileData.name}</h1>

                                <div className="flex items-center gap-3 mb-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 shadow-sm ${profileData.role === 'ADMIN' ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/50' : 'bg-purple-50 dark:bg-purple-900/20 text-neon-purple dark:text-purple-400 border-purple-200 dark:border-purple-800/50'}`}>
                                        {profileData.role === 'ADMIN' ? <Shield className="w-3 h-3" /> : <Activity className="w-3 h-3" />}
                                        {profileData.role}
                                    </span>
                                    {!profileData.active && (
                                        <span className="px-3 py-1 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/50 rounded-full text-xs font-bold shadow-sm">
                                            SUSPENDED
                                        </span>
                                    )}
                                </div>

                                {profileData.githubLink && (
                                    <a href={profileData.githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center w-fit gap-2 text-slate-600 dark:text-gray-400 hover:text-electric-blue dark:hover:text-electric-blue transition-colors bg-white dark:bg-gray-800 px-4 py-2 rounded-lg border border-slate-200 dark:border-gray-700 shadow-sm">
                                        <Code2 className="w-4 h-4" />
                                        <span className="text-sm font-semibold">GitHub Repository</span>
                                        <Share2 className="w-3 h-3 ml-1 opacity-50" />
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-6 mt-8 p-4 bg-slate-50/80 dark:bg-gray-800/80 rounded-xl border border-slate-200 dark:border-gray-700 shadow-sm transition-colors">
                            <div className="flex flex-col items-center flex-1">
                                <span className="text-3xl font-bold text-neon-purple">{profileData.stats?.joined || 0}</span>
                                <span className="text-[10px] text-slate-500 dark:text-gray-400 uppercase tracking-widest font-semibold mt-1">Projects Joined</span>
                            </div>
                            <div className="w-px bg-slate-200 dark:bg-gray-700 transition-colors"></div>
                            <div className="flex flex-col items-center flex-1">
                                <span className="text-3xl font-bold text-electric-blue">{profileData.stats?.completed || 0}</span>
                                <span className="text-[10px] text-slate-500 dark:text-gray-400 uppercase tracking-widest font-semibold mt-1">Projects Completed</span>
                            </div>
                        </div>

                        <div className="pt-8">
                            <h3 className="text-sm text-slate-500 dark:text-gray-400 uppercase font-semibold tracking-wider mb-4 border-l-4 border-electric-blue pl-3">Technical Core & Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {profileData.skills ? profileData.skills.split(',').map((s, i) => (
                                    <span key={i} className="px-4 py-2 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 font-semibold text-sm rounded-lg border border-teal-100 dark:border-teal-800/50 shadow-sm">{s.trim()}</span>
                                )) : <span className="text-slate-500 dark:text-gray-400 text-sm font-medium">No stack defined.</span>}
                            </div>
                        </div>

                        <div className="mt-12 flex justify-center md:justify-start">
                            <button onClick={() => window.history.back()} className="text-electric-blue hover:text-slate-900 dark:hover:text-white text-sm font-bold transition-colors underline bg-transparent border-none cursor-pointer p-0">
                                &larr; Return Back
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

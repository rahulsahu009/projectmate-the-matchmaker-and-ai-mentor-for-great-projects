import React from 'react';
import { useLocation } from 'react-router-dom';
import { Github, Twitter, Linkedin, Code2 } from 'lucide-react';

const Footer = () => {
    const location = useLocation();

    // Hide footer on specific pages
    if (location.pathname.startsWith('/dashboard') || 
        location.pathname.startsWith('/admin') || 
        location.pathname.startsWith('/project')) {
        return null;
    }

    return (
        <footer className="bg-white dark:bg-gray-900 border-t border-slate-200 dark:border-gray-800 text-slate-500 dark:text-gray-400 py-16 mt-auto relative overflow-hidden transition-colors duration-300">
            {/* Attractive ambient glow effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-electric-blue/30 to-transparent shadow-[0_0_15px_rgba(2,132,199,0.3)]"></div>
            <div className="absolute top-[-10rem] left-1/4 w-[30rem] h-[30rem] bg-neon-purple/5 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-[-10rem] right-1/4 w-[30rem] h-[30rem] bg-electric-blue/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="relative flex items-center justify-center">
                                <div className="absolute inset-0 bg-neon-purple/20 blur-md rounded-full"></div>
                                <Code2 className="text-neon-purple w-7 h-7 relative z-10 drop-shadow-[0_0_8px_rgba(147,51,234,0.3)]" />
                            </div>
                            <span className="text-xl font-bold gradient-text tracking-tight">ProjectMate</span>
                        </div>
                        <p className="text-sm leading-relaxed text-slate-500 dark:text-gray-400 max-w-xs">Connecting students, accelerating projects, and building the future of collaborative development with AI.</p>
                        <div className="flex space-x-5 pt-2">
                            <a href="#" className="text-slate-400 dark:text-gray-500 hover:text-electric-blue dark:hover:text-electric-blue hover:-translate-y-1 transition-all duration-300"><Twitter className="w-5 h-5" /></a>
                            <a href="#" className="text-slate-400 dark:text-gray-500 hover:text-electric-blue dark:hover:text-electric-blue hover:-translate-y-1 transition-all duration-300"><Github className="w-5 h-5" /></a>
                            <a href="#" className="text-slate-400 dark:text-gray-500 hover:text-electric-blue dark:hover:text-electric-blue hover:-translate-y-1 transition-all duration-300"><Linkedin className="w-5 h-5" /></a>
                        </div>
                    </div>
                    
                    <div className="lg:ml-auto">
                        <h3 className="text-slate-900 dark:text-gray-200 font-semibold mb-6 text-sm tracking-widest uppercase opacity-90">Platform</h3>
                        <ul className="space-y-4 text-sm">
                            <li><a href="/explore" className="text-slate-500 dark:text-gray-400 hover:text-electric-blue dark:hover:text-electric-blue transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-electric-blue/50 opacity-0 group-hover:opacity-100 transition-opacity"></span> Explore Projects</a></li>
                            <li><a href="#" className="text-slate-500 dark:text-gray-400 hover:text-electric-blue dark:hover:text-electric-blue transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-electric-blue/50 opacity-0 group-hover:opacity-100 transition-opacity"></span> Find Teammates</a></li>
                            <li><a href="#" className="text-slate-500 dark:text-gray-400 hover:text-electric-blue dark:hover:text-electric-blue transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-electric-blue/50 opacity-0 group-hover:opacity-100 transition-opacity"></span> AI Mentor Features</a></li>
                        </ul>
                    </div>
                    
                    <div className="lg:ml-auto">
                        <h3 className="text-slate-900 dark:text-gray-200 font-semibold mb-6 text-sm tracking-widest uppercase opacity-90">Resources</h3>
                        <ul className="space-y-4 text-sm">
                            <li><a href="#" className="text-slate-500 dark:text-gray-400 hover:text-neon-purple dark:hover:text-neon-purple transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-neon-purple/50 opacity-0 group-hover:opacity-100 transition-opacity"></span> Documentation</a></li>
                            <li><a href="#" className="text-slate-500 dark:text-gray-400 hover:text-neon-purple dark:hover:text-neon-purple transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-neon-purple/50 opacity-0 group-hover:opacity-100 transition-opacity"></span> Student Guides</a></li>
                            <li><a href="#" className="text-slate-500 dark:text-gray-400 hover:text-neon-purple dark:hover:text-neon-purple transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-neon-purple/50 opacity-0 group-hover:opacity-100 transition-opacity"></span> Hackathon Tips</a></li>
                        </ul>
                    </div>
                    
                    <div className="lg:ml-auto">
                        <h3 className="text-slate-900 dark:text-gray-200 font-semibold mb-6 text-sm tracking-widest uppercase opacity-90">Legal</h3>
                        <ul className="space-y-4 text-sm">
                            <li><a href="#" className="text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200 transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-400 opacity-0 group-hover:opacity-100 transition-opacity"></span> Privacy Policy</a></li>
                            <li><a href="#" className="text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200 transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-400 opacity-0 group-hover:opacity-100 transition-opacity"></span> Terms of Service</a></li>
                        </ul>
                    </div>
                </div>
                
                <div className="mt-16 pt-8 border-t border-slate-200 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between text-sm text-slate-500 dark:text-gray-500">
                    <p>&copy; {new Date().getFullYear()} ProjectMate. All rights reserved.</p>
                    <p className="mt-2 md:mt-0 flex items-center gap-1.5">Built for <span className="text-neon-purple font-medium">Collaboration</span></p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

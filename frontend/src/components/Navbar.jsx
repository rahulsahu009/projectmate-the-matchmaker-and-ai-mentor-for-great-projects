import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { Code2, LogOut, User as UserIcon, ChevronDown, UserSquare2, ShieldAlert, Sun, Moon } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path;
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="sticky top-0 z-50 w-full glass-panel transition-all duration-300">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Code2 className="text-neon-purple w-8 h-8 drop-shadow-[0_0_8px_rgba(176,38,255,0.6)]" />
                        <Link to="/" className="text-xl font-bold gradient-text hover:opacity-80 transition-opacity">
                            ProjectMate
                        </Link>
                    </div>
                    
                    <div className="hidden md:block">
                        <div className="flex items-center space-x-2">
                            <Link to="/" className={`px-4 py-2 rounded-lg transition-all duration-300 ${isActive('/') ? 'bg-gradient-to-r from-neon-purple/10 to-electric-blue/10 dark:from-neon-purple/20 dark:to-electric-blue/20 text-electric-blue font-bold shadow-[calc(inset)_0_0_15px_rgba(2,132,199,0.05)] dark:shadow-[calc(inset)_0_0_15px_rgba(2,132,199,0.2)]' : 'text-slate-600 hover:text-electric-blue hover:bg-slate-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800/80 shadow-sm border border-transparent hover:border-slate-200 dark:hover:border-transparent'}`}>Home</Link>
                            <Link to="/explore" className={`px-4 py-2 rounded-lg transition-all duration-300 ${isActive('/explore') ? 'bg-gradient-to-r from-neon-purple/10 to-electric-blue/10 dark:from-neon-purple/20 dark:to-electric-blue/20 text-electric-blue font-bold shadow-[calc(inset)_0_0_15px_rgba(2,132,199,0.05)] dark:shadow-[calc(inset)_0_0_15px_rgba(2,132,199,0.2)]' : 'text-slate-600 hover:text-electric-blue hover:bg-slate-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800/80 shadow-sm border border-transparent hover:border-slate-200 dark:hover:border-transparent'}`}>Explore</Link>
                            <Link to="/dashboard" className={`px-4 py-2 rounded-lg transition-all duration-300 ${isActive('/dashboard') ? 'bg-gradient-to-r from-neon-purple/10 to-electric-blue/10 dark:from-neon-purple/20 dark:to-electric-blue/20 text-electric-blue font-bold shadow-[calc(inset)_0_0_15px_rgba(2,132,199,0.05)] dark:shadow-[calc(inset)_0_0_15px_rgba(2,132,199,0.2)]' : 'text-slate-600 hover:text-electric-blue hover:bg-slate-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800/80 shadow-sm border border-transparent hover:border-slate-200 dark:hover:border-transparent'}`}>Dashboard</Link>
                            {user?.role === 'ADMIN' && (
                                <Link to="/admin" className={`px-4 py-2 rounded-lg transition-all duration-300 font-bold flex items-center gap-1.5 shadow-sm border ${isActive('/admin') ? 'bg-red-50 border-red-200 text-red-600 dark:bg-red-900/30 dark:border-red-800/50 dark:text-red-400 shadow-[calc(inset)_0_0_15px_rgba(239,68,68,0.05)] ' : 'border-transparent text-red-500 hover:text-red-700 hover:bg-red-50 hover:border-red-200 dark:hover:border-transparent dark:hover:bg-red-900/20'}`}>
                                    <ShieldAlert className="w-4 h-4" /> Admin
                                </Link>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={toggleTheme} 
                            className="p-2.5 mr-2 rounded-full border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-600 hover:text-electric-blue hover:border-electric-blue dark:text-gray-400 dark:hover:text-white shadow-sm transition-all focus:outline-none transform hover:scale-105"
                            aria-label="Toggle Theme"
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]" /> : <Moon className="w-5 h-5" />}
                        </button>
                        
                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link to={user.role === 'ADMIN' ? "/admin" : "/dashboard"} className="flex items-center gap-2 group">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm transition-transform group-hover:scale-105 ${user.role === 'ADMIN' ? 'bg-gradient-to-tr from-red-600 to-orange-500 shadow-[0_0_10px_rgba(220,38,38,0.2)]' : 'bg-gradient-to-tr from-neon-purple to-electric-blue shadow-[0_0_10px_rgba(147,51,234,0.3)]'}`}>
                                        {user.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
                                    </div>
                                    <span className="text-sm font-medium text-slate-700 dark:text-gray-200 hidden sm:block group-hover:text-electric-blue dark:group-hover:text-electric-blue transition-colors">
                                        {user.name} {user.role === 'ADMIN' && <span className="ml-1 px-1.5 py-0.5 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 text-[10px] uppercase font-bold rounded-sm border border-red-200 dark:border-red-800">Admin</span>}
                                    </span>
                                </Link>
                                <button onClick={handleLogout} className="text-slate-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors" title="Logout">
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 relative">
                                <div className="relative group cursor-pointer inline-block">
                                    <button className="flex items-center gap-1 text-sm font-bold text-slate-700 hover:text-electric-blue bg-white dark:text-gray-300 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700 px-4 py-2 md:py-2.5 rounded-lg border border-slate-300 dark:border-gray-700 hover:border-electric-blue transition-all shadow-sm">
                                        <UserIcon className="w-4 h-4" /> Login <ChevronDown className="w-4 h-4 ml-1 opacity-70" />
                                    </button>
                                    <div className="absolute right-0 mt-2 w-48 glass rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.6)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                        <div className="py-2">
                                            <Link to="/login" className="flex items-center gap-2 px-4 py-3 text-sm text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-800 hover:text-electric-blue dark:hover:text-electric-blue transition-colors">
                                                <UserSquare2 className="w-4 h-4" /> Student Login
                                            </Link>
                                            <Link to="/admin-login" className="flex items-center gap-2 px-4 py-3 text-sm text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-800 hover:text-neon-purple dark:hover:text-neon-purple transition-colors">
                                                <ShieldAlert className="w-4 h-4" /> Admin Login
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <Link to="/register" className="text-sm font-medium px-4 py-2 bg-gradient-to-r from-neon-purple to-electric-blue rounded-lg text-white hover:shadow-[0_4px_15px_rgba(2,132,199,0.3)] dark:shadow-[0_4px_15px_rgba(2,132,199,0.5)] transition-all ml-1 hidden sm:block">Sign up</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

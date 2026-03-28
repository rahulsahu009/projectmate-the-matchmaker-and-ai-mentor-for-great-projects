import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Moon, Sun, Search, LayoutDashboard, LogOut, LogIn, Code2 } from 'lucide-react';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/50 dark:bg-gray-950/50 border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-bold text-xl tracking-tight leading-none group">
              <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg group-hover:scale-110 transition-transform">
                <Code2 className="h-6 w-6" />
              </div>
              <span>ProjectMate</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/explore" className="flex items-center space-x-1.5 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors">
              <Search className="h-4 w-4" />
              <span>Explore</span>
            </Link>
            {isAuth && (
              <Link to="/dashboard" className="flex items-center space-x-1.5 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors">
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-5">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full bg-gray-100/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all border border-gray-200/50 dark:border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            
            {isAuth ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 font-medium transition-colors border border-red-100 dark:border-red-500/20 focus:outline-none"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 transition-all font-medium border border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              >
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

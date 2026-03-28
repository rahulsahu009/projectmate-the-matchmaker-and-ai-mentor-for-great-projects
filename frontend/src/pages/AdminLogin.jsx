import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../lib/axios';
import { Crown } from 'lucide-react';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', { email, password });
            if (res.data.user.role !== 'ADMIN') {
                setError('Access denied. Administrator privileges required.');
                return;
            }
            login(res.data.user, res.data.token);
            navigate('/admin');
        } catch (err) {
            setError(err.response?.data || 'Login failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-gray-950 transition-colors duration-300">
            <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-900 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-amber-200 dark:border-amber-900/50 transition-colors">
                <div className="flex flex-col items-center justify-center gap-3">
                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-full border border-amber-200/50 dark:border-amber-700/30">
                        <Crown className="w-10 h-10 text-amber-500" />
                    </div>
                    <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white">Admin Portal</h2>
                    <h3 className="text-sm text-center text-amber-600 dark:text-amber-500 font-semibold tracking-widest uppercase">Restricted Access</h3>
                </div>
                
                {error && <div className="p-3 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 rounded-lg border border-amber-200 dark:border-amber-800 text-center text-sm">{error}</div>}
                
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-gray-300">Admin Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                            className="w-full px-4 py-2 mt-1 text-slate-900 dark:text-white bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-gray-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-gray-300">Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                            className="w-full px-4 py-2 mt-1 text-slate-900 dark:text-white bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-gray-500" />
                    </div>
                    <button type="submit" className="w-full px-4 py-3 font-bold text-white bg-amber-500 rounded-lg hover:bg-amber-600 hover:shadow-[0_4px_15px_rgba(245,158,11,0.3)] dark:shadow-[0_4px_15px_rgba(245,158,11,0.15)] transition-all mt-4">
                        Secure Login
                    </button>
                    <p className="text-sm text-center text-slate-500 dark:text-gray-400 mt-6 pt-6 border-t border-slate-100 dark:border-gray-800">
                        Return to <Link to="/login" className="text-electric-blue hover:text-slate-900 dark:hover:text-white transition-colors underline font-medium">Student Area</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};
export default AdminLogin;

import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../lib/axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', { email, password });
            login(res.data.user, res.data.token);
            if (res.data.user.role === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data || 'Login failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-gray-950 transition-colors duration-300">
            <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-900 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-slate-200 dark:border-gray-800 transition-colors">
                <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white">Student Login</h2>
                <h3 className="text-sm tracking-widest uppercase font-semibold text-center text-electric-blue">ProjectMate Platform</h3>
                {error && <div className="p-3 text-red-600 bg-red-50 border border-red-100 rounded-lg">{error}</div>}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-gray-300">Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                            className="w-full px-4 py-2 mt-1 text-slate-900 dark:text-white bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-electric-blue/20 focus:border-electric-blue focus:outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-gray-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-gray-300">Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                            className="w-full px-4 py-2 mt-1 text-slate-900 dark:text-white bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-electric-blue/20 focus:border-electric-blue focus:outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-gray-500" />
                    </div>
                    <button type="submit" className="w-full px-4 py-2 font-bold text-white bg-gradient-to-r from-electric-blue to-neon-purple rounded-lg hover:shadow-[0_4px_15px_rgba(2,132,199,0.3)] dark:shadow-[0_4px_15px_rgba(2,132,199,0.5)] transition-all">
                        Login
                    </button>
                    <p className="text-sm text-center text-slate-500 dark:text-gray-400">
                        Don't have an account? <Link to="/register" className="text-electric-blue font-semibold hover:underline">Register</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};
export default Login;

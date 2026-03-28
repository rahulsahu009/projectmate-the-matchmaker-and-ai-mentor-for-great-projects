import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../lib/axios';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'STUDENT', skills: '', githubLink: '' });
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/register', formData);
            const loginRes = await api.post('/auth/login', { email: formData.email, password: formData.password });
            login(loginRes.data.user, loginRes.data.token);
            navigate(loginRes.data.user.role === 'ADMIN' ? '/admin' : '/dashboard');
        } catch (err) {
            setError(err.response?.data || 'Registration failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-gray-950 py-10 transition-colors duration-300">
            <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-900 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-slate-200 dark:border-gray-800 transition-colors">
                <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white">Join ProjectMate</h2>
                {error && <div className="p-3 text-red-600 bg-red-50 border border-red-100 rounded-lg">{error}</div>}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div><label className="block text-sm font-medium text-slate-700 dark:text-gray-300">Name</label><input type="text" name="name" onChange={handleChange} required className="w-full px-4 py-2 mt-1 text-slate-900 dark:text-white bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-neon-purple/20 focus:border-neon-purple focus:outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-gray-500" /></div>
                    <div><label className="block text-sm font-medium text-slate-700 dark:text-gray-300">Email</label><input type="email" name="email" onChange={handleChange} required className="w-full px-4 py-2 mt-1 text-slate-900 dark:text-white bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-neon-purple/20 focus:border-neon-purple focus:outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-gray-500" /></div>
                    <div><label className="block text-sm font-medium text-slate-700 dark:text-gray-300">Password</label><input type="password" name="password" onChange={handleChange} required className="w-full px-4 py-2 mt-1 text-slate-900 dark:text-white bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-neon-purple/20 focus:border-neon-purple focus:outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-gray-500" /></div>
                    <div><label className="block text-sm font-medium text-slate-700 dark:text-gray-300">Skills (comma-separated)</label><input type="text" name="skills" onChange={handleChange} className="w-full px-4 py-2 mt-1 text-slate-900 dark:text-white bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-neon-purple/20 focus:border-neon-purple focus:outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-gray-500" placeholder="React, Java, UI/UX" /></div>
                    <div><label className="block text-sm font-medium text-slate-700 dark:text-gray-300">GitHub Link</label><input type="url" name="githubLink" onChange={handleChange} className="w-full px-4 py-2 mt-1 text-slate-900 dark:text-white bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-neon-purple/20 focus:border-neon-purple focus:outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-gray-500" placeholder="https://github.com/username" /></div>
                    <button type="submit" className="w-full px-4 py-2 font-bold text-white bg-gradient-to-r from-neon-purple to-purple-600 rounded-lg hover:shadow-[0_4px_15px_rgba(147,51,234,0.3)] dark:shadow-[0_4px_15px_rgba(147,51,234,0.5)] transition-all mt-2">Register</button>
                    <p className="text-sm text-center text-slate-500 dark:text-gray-400 mt-4 border-t border-slate-100 dark:border-gray-800 pt-4">Already have an account? <Link to="/login" className="text-neon-purple font-semibold hover:underline">Login</Link></p>
                </form>
            </div>
        </div>
    );
};
export default Register;

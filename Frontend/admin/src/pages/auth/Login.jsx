import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';
import {
    ShieldCheck,
    Lock,
    User,
    Eye,
    EyeOff,
    ArrowRight,
    Loader2,
    AlertCircle
} from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        setIsLoading(true);

        try {
            const response = await api.post('/auth/login', {
                email,
                password
            });

            if (response.data.success) {
                // Ensure the user is an admin
                if (response.data.user.role.toLowerCase() !== 'admin') {
                    setError('Access Denied: Admin privileges required');
                    setIsLoading(false);
                    return;
                }

                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                window.location.href = '/admin';
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 font-sans relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
                <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px] -translate-y-1/2" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950/80" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-md z-10"
            >
                {/* Logo & Header */}
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-slate-900 border border-white/5 shadow-2xl mb-6 relative group overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <ShieldCheck className="text-primary-400 relative z-10" size={36} />
                    </motion.div>
                    <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">Admin Login</h1>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-3">Please sign in to continue</p>
                </div>

                {/* Login Card */}
                <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 p-10 rounded-[3rem] shadow-2xl relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/[0.02] rounded-full -mr-32 -mt-32 blur-[80px]" />
                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Error Message */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-rose-500/10 border border-rose-500/20 text-rose-500 px-4 py-3 rounded-xl text-sm flex items-center gap-3"
                                >
                                    <AlertCircle size={18} />
                                    <span>{error}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-3 relative z-10">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2 flex items-center gap-2" htmlFor="email">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />    
                                Email Address
                            </label>
                            <div className="relative group">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-500 transition-colors">
                                    <User size={18} />
                                </span>
                                <input
                                    id="email"
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@institution.edu"
                                    className="w-full bg-black/40 border border-white/5 text-white pl-14 pr-4 py-4 rounded-2xl outline-none focus:border-primary-500/50 focus:bg-white/[0.02] transition-all placeholder:text-slate-700 placeholder:italic text-sm"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-3 relative z-10">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2 flex items-center gap-2" htmlFor="password">
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                                Password
                            </label>
                            <div className="relative group">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-500 transition-colors">
                                    <Lock size={18} />
                                </span>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-black/40 border border-white/5 text-white pl-14 pr-14 py-4 rounded-2xl outline-none focus:border-primary-500/50 focus:bg-white/[0.02] transition-all text-sm tracking-widest placeholder:tracking-normal placeholder:text-slate-700"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-white text-slate-950 font-black italic text-[10px] uppercase tracking-[0.4em] py-5 rounded-2xl hover:scale-[1.02] hover:bg-primary-50 hover:text-primary-950 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all flex items-center justify-center gap-3 shadow-xl mt-8 relative z-10"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer Decor */}
                <div className="mt-8 text-center">
                    <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">
                        Secure Administration Portal
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;

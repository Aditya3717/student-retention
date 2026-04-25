import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

import {
    GraduationCap,
    Lock,
    User,
    Eye,
    EyeOff,
    ArrowRight,
    Loader2,
    X,
    Mail,
    AlertCircle
} from 'lucide-react';

const Login = () => {
    // Form States
    const [registrationNumber, setRegistrationNumber] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Modal State
    const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
    const [forgotRegNum, setForgotRegNum] = useState('');
    const [forgotEmail, setForgotEmail] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        // Simple Validation
        if (!registrationNumber || !password) {
            setError('Please fill in all fields');
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email: registrationNumber,
                password: password
            });

            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));

                // Success - Redirect to student dashboard
                window.location.href = '/student';
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = (e) => {
        e.preventDefault();
        console.log('Reset request for:', forgotRegNum, forgotEmail);
        setIsForgotModalOpen(false);
        // Add toast or success message logic here
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
                        <GraduationCap className="text-primary-400 relative z-10" size={36} />
                    </motion.div>
                    <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">Student Login</h1>
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
                                    className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl text-sm flex items-center gap-3"
                                >
                                    <AlertCircle size={18} />
                                    <span>{error}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Registration Number */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2 flex items-center gap-2" htmlFor="regNumber">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                                Registration Number
                            </label>
                            <div className="relative group">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-500 transition-colors">
                                    <User size={18} />
                                </span>
                                <input
                                    id="regNumber"
                                    type="text"
                                    value={registrationNumber}
                                    onChange={(e) => setRegistrationNumber(e.target.value)}
                                    placeholder="Enrolment Number or Email"
                                    className="w-full bg-black/40 border border-white/5 text-white pl-14 pr-4 py-4 rounded-2xl outline-none focus:border-primary-500/50 focus:bg-white/[0.02] transition-all placeholder:text-slate-700 placeholder:italic text-sm"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center px-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2" htmlFor="password">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                                    Password
                                </label>
                            </div>
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
                            <button
                                type="button"
                                onClick={() => setIsForgotModalOpen(true)}
                                className="text-[10px] font-black text-primary-500 uppercase tracking-widest hover:text-primary-400 transition-colors mt-3 ml-2 italic"
                            >
                                Forgot Password?
                            </button>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-white text-slate-950 font-black italic text-[10px] uppercase tracking-[0.4em] py-5 rounded-2xl hover:scale-[1.02] hover:bg-primary-50 hover:text-primary-950 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all flex items-center justify-center gap-3 shadow-xl mt-8"
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

                        <div className="text-center mt-8 pt-6 border-t border-white/5">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                Don't have an account?{' '}
                                <a href="/register" className="text-primary-400 hover:text-white transition-colors ml-1 underline decoration-primary-500/30 underline-offset-4">
                                    Register Here
                                </a>
                            </p>
                        </div>
                    </form>
                </div>
            </motion.div>

            {/* Forgot Password Modal */}
            <AnimatePresence>
                {isForgotModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-slate-900 border border-slate-800 rounded-3xl p-8 w-full max-w-sm shadow-2xl relative"
                        >
                            <button
                                onClick={() => setIsForgotModalOpen(false)}
                                className="absolute right-4 top-4 text-slate-500 hover:text-white transition-colors p-2 rounded-full hover:bg-slate-800"
                            >
                                <X size={20} />
                            </button>

                            <h2 className="text-xl font-bold text-white mb-2">Reset Password</h2>
                            <p className="text-slate-400 text-sm mb-6">Enter your details and we'll help you reset your password.</p>

                            <form onSubmit={handleForgotPassword} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
                                        Registration Number
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input
                                            type="text"
                                            required
                                            value={forgotRegNum}
                                            onChange={(e) => setForgotRegNum(e.target.value)}
                                            placeholder="Enter reg number"
                                            className="w-full bg-slate-800/50 border border-slate-700 text-white pl-12 pr-4 py-3.5 rounded-2xl outline-none focus:border-primary-500 transition-all font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
                                        Registered Email
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input
                                            type="email"
                                            required
                                            value={forgotEmail}
                                            onChange={(e) => setForgotEmail(e.target.value)}
                                            placeholder="Enter email address"
                                            className="w-full bg-slate-800/50 border border-slate-700 text-white pl-12 pr-4 py-3.5 rounded-2xl outline-none focus:border-primary-500 transition-all font-medium"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-white text-slate-900 font-bold py-4 rounded-2xl hover:bg-slate-200 active:scale-[0.98] transition-all mt-4 shadow-xl"
                                >
                                    Reset Password
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Login;

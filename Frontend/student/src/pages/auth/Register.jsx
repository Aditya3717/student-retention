import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
    GraduationCap,
    Lock,
    User,
    Mail,
    Eye,
    EyeOff,
    ArrowRight,
    Loader2,
    AlertCircle,
    CheckCircle2,
    Fingerprint
} from 'lucide-react';

const Register = () => {
    // Form States
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        registrationNumber: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        // Basic Validation
        if (!formData.name || !formData.email || !formData.registrationNumber || !formData.password) {
            setError('Please fill in all fields');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: 'student',
                registrationNumber: formData.registrationNumber
            });

            if (response.data.success) {
                setIsSuccess(true);
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
                className="w-full max-w-lg z-10"
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
                    <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">Join EduGuard</h1>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-3">Create your student account</p>
                </div>

                {/* Registration Card */}
                <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 p-10 rounded-[3rem] shadow-2xl relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/[0.02] rounded-full -mr-32 -mt-32 blur-[80px]" />
                    {isSuccess ? (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-12"
                        >
                            <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 size={40} className="text-emerald-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Registration Successful!</h2>
                            <p className="text-slate-400">Redirecting you to login...</p>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleRegister} className="space-y-5">
                            {/* Error Message */}
                            <AnimatePresence mode="wait">
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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
                                {/* Name */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2 flex items-center gap-2" htmlFor="name">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />    
                                        Full Name
                                    </label>
                                    <div className="relative group">
                                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-500 transition-colors">
                                            <User size={18} />
                                        </span>
                                        <input
                                            id="name"
                                            type="text"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="John Doe"
                                            className="w-full bg-black/40 border border-white/5 text-white pl-14 pr-4 py-4 rounded-2xl outline-none focus:border-primary-500/50 focus:bg-white/[0.02] transition-all placeholder:text-slate-700 placeholder:italic text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2 flex items-center gap-2" htmlFor="email">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                        Email Address
                                    </label>
                                    <div className="relative group">
                                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-500 transition-colors">
                                            <Mail size={18} />
                                        </span>
                                        <input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="john@university.edu"
                                            className="w-full bg-black/40 border border-white/5 text-white pl-14 pr-4 py-4 rounded-2xl outline-none focus:border-primary-500/50 focus:bg-white/[0.02] transition-all placeholder:text-slate-700 placeholder:italic text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Registration Number */}
                            <div className="space-y-3 relative z-10">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2 flex items-center gap-2" htmlFor="registrationNumber">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                    Registration Number
                                </label>
                                <div className="relative group">
                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-500 transition-colors">
                                        <Fingerprint size={18} />
                                    </span>
                                    <input
                                        id="registrationNumber"
                                        type="text"
                                        value={formData.registrationNumber}
                                        onChange={handleChange}
                                        placeholder="202100X"
                                        className="w-full bg-black/40 border border-white/5 text-white pl-14 pr-4 py-4 rounded-2xl outline-none focus:border-primary-500/50 focus:bg-white/[0.02] transition-all placeholder:text-slate-700 placeholder:italic text-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
                                {/* Password */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2 flex items-center gap-2" htmlFor="password">
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                                        Password
                                    </label>
                                    <div className="relative group">
                                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-500 transition-colors">
                                            <Lock size={18} />
                                        </span>
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            value={formData.password}
                                            onChange={handleChange}
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

                                {/* Confirm Password */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2 flex items-center gap-2" htmlFor="confirmPassword">
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                                        Confirm
                                    </label>
                                    <div className="relative group">
                                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-500 transition-colors">
                                            <Lock size={18} />
                                        </span>
                                        <input
                                            id="confirmPassword"
                                            type={showPassword ? "text" : "password"}
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="••••••••"
                                            className="w-full bg-black/40 border border-white/5 text-white pl-14 pr-14 py-4 rounded-2xl outline-none focus:border-primary-500/50 focus:bg-white/[0.02] transition-all text-sm tracking-widest placeholder:tracking-normal placeholder:text-slate-700"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Register Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-white text-slate-950 font-black italic text-[10px] uppercase tracking-[0.4em] py-5 rounded-2xl hover:scale-[1.02] hover:bg-primary-50 hover:text-primary-950 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all flex items-center justify-center gap-3 shadow-xl mt-8 relative z-10"
                            >
                                {isLoading ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <>
                                        <span>Create Account</span>
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>

                            <div className="text-center mt-8 pt-6 border-t border-white/5 relative z-10">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                    Already have an account?{' '}
                                    <a href="/login" className="text-primary-400 hover:text-white transition-colors ml-1 underline decoration-primary-500/30 underline-offset-4">
                                        Sign In
                                    </a>
                                </p>
                            </div>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default Register;

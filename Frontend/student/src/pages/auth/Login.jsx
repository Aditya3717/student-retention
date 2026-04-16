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
            // Adjust this if you want to support login by reg number directly
            // For now, we seed a user with email 2021001@university.edu
            const loginEmail = registrationNumber.includes('@')
                ? registrationNumber
                : `${registrationNumber}@university.edu`;

            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email: loginEmail,
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-primary-950 p-6 font-sans relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-md z-10"
            >
                {/* Logo & Header */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-600 shadow-xl shadow-primary-500/20 mb-4"
                    >
                        <GraduationCap className="text-white" size={32} />
                    </motion.div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Student Login Portal</h1>
                    <p className="text-slate-400 mt-2">Access your academic dashboard</p>
                </div>

                {/* Login Card */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl">
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
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 ml-1" htmlFor="regNumber">
                                Registration Number
                            </label>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-500 transition-colors">
                                    <User size={18} />
                                </span>
                                <input
                                    id="regNumber"
                                    type="text"
                                    value={registrationNumber}
                                    onChange={(e) => setRegistrationNumber(e.target.value)}
                                    placeholder="Enter your reg number"
                                    className="w-full bg-slate-800/50 border border-slate-700 text-white pl-12 pr-4 py-3.5 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all placeholder:text-slate-600"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-sm font-medium text-slate-300" htmlFor="password">
                                    Password
                                </label>
                            </div>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-500 transition-colors">
                                    <Lock size={18} />
                                </span>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-slate-800/50 border border-slate-700 text-white pl-12 pr-12 py-3.5 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsForgotModalOpen(true)}
                                className="text-xs text-primary-400 hover:text-primary-300 transition-colors mt-2 ml-1"
                            >
                                Forgot Password?
                            </button>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary-600 hover:bg-primary-500 disabled:bg-primary-800 text-white font-semibold py-4 rounded-2xl shadow-lg shadow-primary-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                                </>
                            )}
                        </button>
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

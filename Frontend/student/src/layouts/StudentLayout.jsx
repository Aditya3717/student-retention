import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
    BarChart3,
    GraduationCap,
    LayoutDashboard,
    Trophy,
    User,
    LogOut,
    Settings,
    ChevronDown,
    Bell,
    AlertTriangle,
    CheckCircle2,
    Info,
    X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const StudentLayout = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const dropdownRef = useRef(null);
    const notifRef = useRef(null);
    const navigate = useNavigate();

    // Get user from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userInitials = user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'JD';

    // Generate smart notifications from dashboard data (stored after dashboard fetch)
    const dashboardRaw = (() => { try { return JSON.parse(sessionStorage.getItem('dashboardData') || 'null'); } catch { return null; } })();
    const notifications = [
        dashboardRaw?.attendance < 75 && {
            id: 1, type: 'warning', icon: AlertTriangle, color: 'text-amber-400',
            title: 'Low Attendance',
            body: `Your attendance is ${dashboardRaw.attendance}%. The minimum required is 75%.`,
        },
        dashboardRaw?.gpa < 2.5 && {
            id: 2, type: 'danger', icon: AlertTriangle, color: 'text-rose-400',
            title: 'GPA Alert',
            body: `Your current GPA is ${dashboardRaw.gpa?.toFixed(2)}. Please meet your academic advisor.`,
        },
        dashboardRaw?.dropoutRisk?.category === 'High' && {
            id: 3, type: 'danger', icon: AlertTriangle, color: 'text-rose-400',
            title: 'High Dropout Risk',
            body: 'Your profile has been flagged as high risk. Contact your advisor immediately.',
        },
        {
            id: 4, type: 'info', icon: Info, color: 'text-sky-400',
            title: 'Welcome to EduGuard',
            body: 'Your student portal is active. Check your academics and career guidance sections.',
        },
        dashboardRaw?.gpa >= 3.5 && {
            id: 5, type: 'success', icon: CheckCircle2, color: 'text-emerald-400',
            title: 'Great Performance!',
            body: `You're in the top percentile with a GPA of ${dashboardRaw.gpa?.toFixed(2)}. Keep it up!`,
        },
    ].filter(Boolean);

    const unreadCount = notifications.length;

    const navItems = [
        { name: 'Dashboard', path: '/student', icon: <LayoutDashboard size={18} />, end: true },
        { name: 'Academics', path: '/student/academics', icon: <GraduationCap size={18} /> },
        { name: 'Career Paths', path: '/student/careers', icon: <Trophy size={18} /> },
        { name: 'Analytics', path: '/student/analytics', icon: <BarChart3 size={18} /> },
        { name: 'Settings', path: '/student/settings', icon: <Settings size={18} /> },
    ];

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setIsNotifOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        // Clear local storage or session tokens here
        localStorage.removeItem('token'); // Adjust based on your auth implementation
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-950 text-slate-50 font-sans relative">
            {/* Ambient Background System */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.05),transparent_70%)]" />
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
                
                {/* Data Mesh effect */}
                <div className="absolute inset-0 opacity-[0.03]" 
                    style={{ 
                        backgroundImage: `radial-gradient(#94a3b8 1px, transparent 1px)`,
                        backgroundSize: '40px 40px' 
                    }} 
                />
            </div>

            {/* Top Navbar */}
            <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50 px-6 flex items-center justify-between shadow-lg shadow-black/20">
                <div className="flex items-center gap-8">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
                            <GraduationCap className="text-white" size={22} />
                        </div>
                        <span className="font-black text-xl tracking-tighter hidden md:block italic uppercase text-white">
                            EduGuard
                        </span>
                    </div>

                    {/* Navigation */}
                    <nav className="flex items-center gap-1">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.end}
                                className={({ isActive }) => cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 group text-sm font-medium",
                                    isActive
                                        ? "bg-primary-600 text-white shadow-lg shadow-primary-600/20"
                                        : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                                )}
                            >
                                <span className="shrink-0">{item.icon}</span>
                                <span>{item.name}</span>
                            </NavLink>
                        ))}
                    </nav>
                </div>

                {/* Right Side: Notifications + Profile */}
                <div className="flex items-center gap-2">

                {/* Notifications Bell */}
                <div className="relative" ref={notifRef}>
                    <button
                        onClick={() => { setIsNotifOpen(!isNotifOpen); setIsProfileOpen(false); }}
                        className="relative w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all"
                    >
                        <Bell size={18} />
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_6px_#ef4444]" />
                        )}
                    </button>

                    <AnimatePresence>
                        {isNotifOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 mt-3 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 backdrop-blur-xl overflow-hidden"
                            >
                                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
                                    <p className="text-sm font-black text-white">Notifications</p>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">{unreadCount} new</span>
                                </div>
                                <div className="max-h-72 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="py-8 text-center text-slate-600 text-xs font-semibold">No notifications</div>
                                    ) : notifications.map(notif => (
                                        <div key={notif.id} className="flex gap-3 px-4 py-3 hover:bg-white/5 transition-colors border-b border-slate-800/50 last:border-0">
                                            <notif.icon size={16} className={`mt-0.5 shrink-0 ${notif.color}`} />
                                            <div>
                                                <p className="text-xs font-bold text-slate-200 mb-0.5">{notif.title}</p>
                                                <p className="text-[11px] text-slate-500 leading-relaxed">{notif.body}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Profile Section */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-3 p-1.5 rounded-full hover:bg-slate-800 transition-all duration-200 group border border-transparent hover:border-slate-700"
                    >
                        <div className="text-right hidden sm:block mr-2 px-2">
                            <p className="text-sm font-bold text-slate-200">{user.name || 'Student'}</p>
                            <p className="text-[10px] text-slate-500 text-right uppercase font-black tracking-widest">My Account</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shadow-inner group-hover:bg-slate-700 transition-colors">
                            <span className="text-xs font-bold text-primary-400">{userInitials}</span>
                        </div>
                        <ChevronDown className={cn("text-slate-500 transition-transform duration-200", isProfileOpen && "rotate-180")} size={16} />
                    </button>

                    <AnimatePresence>
                        {isProfileOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 mt-3 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 backdrop-blur-xl"
                            >
                                <div className="px-4 py-3 border-b border-slate-800 mb-1">
                                    <p className="text-sm font-bold text-slate-200">{user.name || 'Student'}</p>
                                    <p className="text-[10px] text-slate-500 truncate pb-1">{user.email || 'student@university.edu'}</p>
                                </div>

                                <NavLink
                                    to="/student/profile"
                                    onClick={() => setIsProfileOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2.5 text-[11px] font-semibold text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-all mx-2 rounded-xl"
                                >
                                    <User size={16} />
                                    <span>My Profile</span>
                                </NavLink>

                                <NavLink
                                    to="/student/settings"
                                    onClick={() => setIsProfileOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2.5 text-[11px] font-semibold text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-all mx-2 rounded-xl"
                                >
                                    <Settings size={16} />
                                    <span>Settings</span>
                                </NavLink>

                                <div className="mx-2 my-1 h-px bg-slate-800" />

                                <button
                                    onClick={() => {
                                        setIsProfileOpen(false);
                                        handleLogout();
                                    }}
                                    className="flex items-center gap-3 w-[calc(100%-1rem)] mx-2 px-4 py-2.5 text-[11px] font-semibold text-rose-400 hover:bg-rose-400/10 transition-all rounded-xl"
                                >
                                    <LogOut size={16} />
                                    <span>Sign Out</span>
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                </div>{/* end flex items-center gap-2 */}
            </header>

            {/* Main Content */}
            <main className="flex-1 relative z-10">
                <div className="p-8 max-w-7xl mx-auto">
                    <motion.div
                        key={window.location.pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Outlet />
                    </motion.div>
                </div>
            </main>
        </div>
    );
};




export default StudentLayout;

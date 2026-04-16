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
    ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const StudentLayout = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Get user from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userInitials = user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'JD';

    const navItems = [
        { name: 'Dashboard', path: '/student', icon: <LayoutDashboard size={18} />, end: true },
        { name: 'Academics', path: '/student/academics', icon: <GraduationCap size={18} /> },
        { name: 'Career Paths', path: '/student/careers', icon: <Trophy size={18} /> },
        { name: 'Analytics', path: '/student/analytics', icon: <BarChart3 size={18} /> },
    ];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
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
        <div className="flex flex-col min-h-screen bg-slate-950 text-slate-50 font-sans">
            {/* Top Navbar */}
            <header className="h-20 border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-30 px-6 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
                            <GraduationCap className="text-white" size={24} />
                        </div>
                        <span className="font-bold text-xl tracking-tight hidden md:block">
                            EduPulse
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

                {/* Profile Section */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-3 p-1.5 rounded-full hover:bg-slate-800 transition-all duration-200 group border border-transparent hover:border-slate-700"
                    >
                        <div className="text-right hidden sm:block mr-2 px-2">
                            <p className="text-sm font-medium text-slate-200">Student Portal</p>
                            <p className="text-xs text-slate-500 text-right">Academic Overview</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shadow-inner group-hover:bg-slate-700 transition-colors">
                            <span className="text-xs font-bold text-primary-400">JD</span>
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
                                    <p className="text-sm font-medium text-slate-200">John Doe</p>
                                    <p className="text-xs text-slate-500 truncate">john.doe@university.edu</p>
                                </div>

                                <NavLink
                                    to="/student/profile"
                                    onClick={() => setIsProfileOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-all mx-2 rounded-xl"
                                >
                                    <User size={18} />
                                    <span>Update Profile</span>
                                </NavLink>

                                <button
                                    onClick={() => {
                                        setIsProfileOpen(false);
                                        handleLogout();
                                    }}
                                    className="flex items-center gap-3 w-[calc(100%-1rem)] mx-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-400/10 transition-all rounded-xl mt-1"
                                >
                                    <LogOut size={18} />
                                    <span>Logout</span>
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">
                <div className="p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};



export default StudentLayout;

import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
    Users,
    BarChart3,
    AlertTriangle,
    Database,
    ShieldAlert,
    LogOut,
    UserCog
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const AdminLayout = () => {
    const navItems = [
        { name: 'Analytics', path: '/admin', icon: <BarChart3 size={18} />, end: true },
        { name: 'Students', path: '/admin/students', icon: <Users size={18} /> },
        { name: 'Verifications', path: '/admin/verifications', icon: <UserCog size={18} /> },
        { name: 'At-Risk', path: '/admin/at-risk', icon: <AlertTriangle size={18} /> },
        { name: 'Team', path: '/admin/team', icon: <ShieldAlert size={18} /> },
        { name: 'ML Training', path: '/admin/ml', icon: <Database size={18} /> },
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userInitials = user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'ADM';


    return (
        <div className="flex flex-col min-h-screen bg-slate-950 text-slate-50 font-sans relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[150px]" />
            </div>

            {/* Top Navbar */}
            <header className="h-24 sticky top-0 z-30 px-8 flex items-center justify-between border-b border-white/5 bg-slate-900/40 backdrop-blur-2xl">
                <div className="flex items-center gap-8">
                    {/* Logo */}
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <ShieldAlert className="text-white" size={24} />
                        </div>
                        <span className="font-black text-2xl tracking-tighter italic hidden md:block text-white">
                            EduGuard
                        </span>
                    </div>

                    {/* Navigation */}
                    <nav className="flex items-center gap-2 ml-4">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.end}
                                className={({ isActive }) => cn(
                                    "flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300 group text-[11px] font-black uppercase tracking-widest",
                                    isActive
                                        ? "bg-white/10 text-white shadow-xl shadow-black/20 border border-white/10"
                                        : "text-slate-400 hover:bg-white/5 hover:text-white border border-transparent"
                                )}
                            >
                                <span className={({ isActive }) => clsx("transition-transform group-hover:scale-110", isActive ? "text-indigo-400" : "")}>{item.icon}</span>
                                <span>{item.name}</span>
                            </NavLink>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-5">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-black text-white uppercase tracking-widest">{user.name || 'Administrator'}</p>
                        <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-0.5">Admin</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
                        <span className="text-sm font-black text-white">{userInitials}</span>
                    </div>
                    <div className="w-px h-8 bg-white/10 mx-2" />
                    <button 
                        onClick={handleLogout}
                        className="p-3 rounded-2xl bg-white/5 hover:bg-rose-500 hover:text-white text-slate-400 transition-all border border-white/5 hover:border-rose-500 shadow-xl"
                        title="Logout"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">
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


export default AdminLayout;

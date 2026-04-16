import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
    Users,
    BarChart3,
    AlertTriangle,
    Database,
    ShieldAlert
} from 'lucide-react';


import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const AdminLayout = () => {
    const navItems = [
        { name: 'Analytics', path: '/admin', icon: <BarChart3 size={18} />, end: true },
        { name: 'Students', path: '/admin/students', icon: <Users size={18} /> },
        { name: 'At-Risk', path: '/admin/at-risk', icon: <AlertTriangle size={18} /> },
        { name: 'ML Training', path: '/admin/ml', icon: <Database size={18} /> },
    ];


    return (
        <div className="flex flex-col min-h-screen bg-stone-950 text-stone-50 font-sans">
            {/* Top Navbar */}
            <header className="h-20 border-b border-stone-800 bg-stone-900/50 backdrop-blur-xl sticky top-0 z-30 px-6 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-admin-600 flex items-center justify-center shadow-lg shadow-admin-500/20">
                            <ShieldAlert className="text-white" size={24} />
                        </div>
                        <span className="font-bold text-xl tracking-tight hidden md:block">
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
                                        ? "bg-admin-600 text-white shadow-lg shadow-admin-600/20"
                                        : "text-stone-400 hover:bg-stone-800 hover:text-stone-200"
                                )}
                            >

                                <span className="shrink-0">{item.icon}</span>
                                <span>{item.name}</span>
                            </NavLink>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block mr-2">
                        <p className="text-sm font-medium text-stone-200">Administrator</p>
                        <p className="text-xs text-stone-500">System Monitor</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center shadow-inner">
                        <span className="text-xs font-bold text-admin-400">ADM</span>
                    </div>
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


export default AdminLayout;

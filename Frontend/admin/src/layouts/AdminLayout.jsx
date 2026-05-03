import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
    Users, BarChart3, AlertTriangle, Database,
    ShieldAlert, LogOut, UserCog, Menu, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
    { name: 'Analytics',      path: '/admin',              icon: BarChart3,      end: true },
    { name: 'Students',       path: '/admin/students',     icon: Users           },
    { name: 'Verifications',  path: '/admin/verifications',icon: UserCog         },
    { name: 'At-Risk',        path: '/admin/at-risk',      icon: AlertTriangle   },
    { name: 'Team',           path: '/admin/team',         icon: ShieldAlert     },
    { name: 'ML Training',    path: '/admin/ml',           icon: Database        },
];

const AdminLayout = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const location = useLocation();

    // Close drawer on route change
    useEffect(() => { setDrawerOpen(false); }, [location.pathname]);

    // Lock body scroll when drawer is open
    useEffect(() => {
        document.body.style.overflow = drawerOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [drawerOpen]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userInitials = user.name
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'ADM';

    const NavItem = ({ item, onClick }) => {
        const Icon = item.icon;
        return (
            <NavLink
                to={item.path}
                end={item.end}
                onClick={onClick}
                className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-[11px] font-black uppercase tracking-widest group ${
                        isActive
                            ? 'bg-white/10 text-white border border-white/10 shadow-lg'
                            : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
                    }`
                }
            >
                {({ isActive }) => (
                    <>
                        <Icon size={16} className={`transition-transform group-hover:scale-110 shrink-0 ${isActive ? 'text-indigo-400' : ''}`} />
                        <span>{item.name}</span>
                    </>
                )}
            </NavLink>
        );
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-950 text-slate-50 font-sans relative overflow-x-hidden">

            {/* ── Ambient background ── */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/8 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-500/8 rounded-full blur-[150px]" />
            </div>

            {/* ── Mobile drawer overlay ── */}
            <AnimatePresence>
                {drawerOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
                        onClick={() => setDrawerOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* ── Mobile slide-in drawer ── */}
            <AnimatePresence>
                {drawerOpen && (
                    <motion.aside
                        initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                        className="fixed top-0 left-0 h-full w-72 z-50 bg-slate-900/95 backdrop-blur-2xl border-r border-white/8 flex flex-col md:hidden"
                    >
                        {/* Drawer header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                    <ShieldAlert size={18} className="text-white" />
                                </div>
                                <span className="font-black text-lg tracking-tighter italic text-white">EduGuard</span>
                            </div>
                            <button
                                onClick={() => setDrawerOpen(false)}
                                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Drawer nav */}
                        <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-1">
                            {NAV_ITEMS.map(item => (
                                <NavItem key={item.path} item={item} onClick={() => setDrawerOpen(false)} />
                            ))}
                        </nav>

                        {/* Drawer footer */}
                        <div className="px-4 py-5 border-t border-white/5 space-y-3">
                            <div className="flex items-center gap-3 px-3">
                                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                    <span className="text-xs font-black text-white">{userInitials}</span>
                                </div>
                                <div>
                                    <p className="text-xs font-black text-white truncate">{user.name || 'Administrator'}</p>
                                    <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Admin</p>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-all border border-white/5 hover:border-rose-500/20 text-[11px] font-black uppercase tracking-widest"
                            >
                                <LogOut size={16} /> Logout
                            </button>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* ── Top header ── */}
            <header className="sticky top-0 z-30 px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between border-b border-white/5 bg-slate-900/50 backdrop-blur-2xl shrink-0">

                <div className="flex items-center gap-3 sm:gap-6">
                    {/* Hamburger — mobile only */}
                    <button
                        onClick={() => setDrawerOpen(true)}
                        className="md:hidden w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                        aria-label="Open navigation"
                    >
                        <Menu size={20} />
                    </button>

                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
                            <ShieldAlert className="text-white" size={18} />
                        </div>
                        <span className="font-black text-lg sm:text-2xl tracking-tighter italic text-white hidden sm:block">
                            EduGuard
                        </span>
                    </div>

                    {/* Desktop nav */}
                    <nav className="hidden md:flex items-center gap-1 lg:gap-2">
                        {NAV_ITEMS.map(item => (
                            <NavItem key={item.path} item={item} />
                        ))}
                    </nav>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-3 sm:gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-black text-white uppercase tracking-widest leading-tight">{user.name || 'Administrator'}</p>
                        <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Admin</p>
                    </div>
                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                        <span className="text-xs sm:text-sm font-black text-white">{userInitials}</span>
                    </div>
                    <div className="w-px h-7 bg-white/10 hidden sm:block" />
                    <button
                        onClick={handleLogout}
                        className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/5 hover:bg-rose-500 hover:text-white text-slate-400 transition-all border border-white/5 hover:border-rose-500"
                        title="Logout"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </header>

            {/* ── Main content ── */}
            <main className="flex-1 relative z-10">
                <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-[1400px] mx-auto">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                    >
                        <Outlet />
                    </motion.div>
                </div>
            </main>

            {/* ── Mobile bottom tab bar ── */}
            <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-slate-900/90 backdrop-blur-2xl border-t border-white/8 flex items-center justify-around px-2 py-2 safe-bottom">
                {NAV_ITEMS.map(item => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.end}
                            className={({ isActive }) =>
                                `flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all text-[9px] font-black uppercase tracking-wider ${
                                    isActive ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-500 hover:text-slate-300'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <Icon size={18} className={isActive ? 'text-indigo-400' : ''} />
                                    <span>{item.name}</span>
                                </>
                            )}
                        </NavLink>
                    );
                })}
            </nav>
        </div>
    );
};

export default AdminLayout;

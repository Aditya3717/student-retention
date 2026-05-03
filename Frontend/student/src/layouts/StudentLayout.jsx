import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    BarChart3, GraduationCap, LayoutDashboard, Trophy,
    User, LogOut, Settings, ChevronDown, Bell,
    AlertTriangle, CheckCircle2, Info, X, Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) { return twMerge(clsx(inputs)); }

const NAV_ITEMS = [
    { name: 'Dashboard',   path: '/student',           icon: LayoutDashboard, end: true },
    { name: 'Academics',   path: '/student/academics',  icon: GraduationCap               },
    { name: 'Careers',     path: '/student/careers',    icon: Trophy                      },
    { name: 'Analytics',   path: '/student/analytics',  icon: BarChart3                   },
    { name: 'Settings',    path: '/student/settings',   icon: Settings                    },
];

const StudentLayout = () => {
    const [drawerOpen, setDrawerOpen]       = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen]     = useState(false);
    const dropdownRef = useRef(null);
    const notifRef    = useRef(null);
    const navigate    = useNavigate();
    const location    = useLocation();

    const user         = JSON.parse(localStorage.getItem('user') || '{}');
    const userInitials = user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'JD';

    // Smart notifications
    const dashboardRaw = (() => { try { return JSON.parse(sessionStorage.getItem('dashboardData') || 'null'); } catch { return null; } })();
    const notifications = [
        dashboardRaw?.attendance < 75 && {
            id: 1, type: 'warning', icon: AlertTriangle, color: 'text-amber-400',
            title: 'Low Attendance',
            body: `Your attendance is ${dashboardRaw.attendance}%. Minimum required is 75%.`,
        },
        dashboardRaw?.gpa < 2.5 && {
            id: 2, type: 'danger', icon: AlertTriangle, color: 'text-rose-400',
            title: 'GPA Alert',
            body: `Your current GPA is ${dashboardRaw.gpa?.toFixed(2)}. Please meet your advisor.`,
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

    // Close dropdowns on outside click
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsProfileOpen(false);
            if (notifRef.current    && !notifRef.current.contains(e.target))    setIsNotifOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Close drawer + dropdowns on route change
    useEffect(() => {
        setDrawerOpen(false);
        setIsProfileOpen(false);
        setIsNotifOpen(false);
    }, [location.pathname]);

    // Lock scroll when drawer open
    useEffect(() => {
        document.body.style.overflow = drawerOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [drawerOpen]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    /* ── Reusable NavItem component ── */
    const NavItem = ({ item, onClick, compact = false }) => {
        const Icon = item.icon;
        return (
            <NavLink to={item.path} end={item.end} onClick={onClick}
                className={({ isActive }) => cn(
                    'flex items-center gap-2.5 rounded-xl transition-all duration-200 text-sm font-semibold group',
                    compact ? 'px-4 py-2' : 'px-5 py-3',
                    isActive
                        ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/20'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                )}
            >
                {({ isActive }) => (
                    <>
                        <Icon size={17} className={cn('shrink-0 transition-transform group-hover:scale-105', isActive && 'text-white')} />
                        <span>{item.name}</span>
                    </>
                )}
            </NavLink>
        );
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-950 text-slate-50 font-sans relative overflow-x-hidden">

            {/* ── Ambient background ── */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.05),transparent_70%)]" />
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-500/8 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/8 rounded-full blur-[120px]" />
                <div className="absolute inset-0 opacity-[0.025]"
                    style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            </div>

            {/* ── Mobile drawer overlay ── */}
            <AnimatePresence>
                {drawerOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
                        onClick={() => setDrawerOpen(false)} />
                )}
            </AnimatePresence>

            {/* ── Mobile slide-in drawer ── */}
            <AnimatePresence>
                {drawerOpen && (
                    <motion.aside
                        initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                        className="fixed top-0 left-0 h-full w-72 z-50 bg-slate-900/98 backdrop-blur-2xl border-r border-white/8 flex flex-col md:hidden"
                    >
                        {/* Drawer header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
                                    <GraduationCap size={18} className="text-white" />
                                </div>
                                <span className="font-black text-lg tracking-tighter italic uppercase text-white">EduGuard</span>
                            </div>
                            <button onClick={() => setDrawerOpen(false)}
                                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                                <X size={15} />
                            </button>
                        </div>

                        {/* User info strip */}
                        <div className="px-5 py-4 border-b border-white/5 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                                <span className="text-xs font-bold text-sky-400">{userInitials}</span>
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-slate-200 truncate">{user.name || 'Student'}</p>
                                <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                            </div>
                        </div>

                        {/* Drawer nav */}
                        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                            {NAV_ITEMS.map(item => (
                                <NavItem key={item.path} item={item} onClick={() => setDrawerOpen(false)} />
                            ))}
                        </nav>

                        {/* Drawer footer */}
                        <div className="px-3 py-4 border-t border-white/5 space-y-1">
                            <NavLink to="/student/profile" onClick={() => setDrawerOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-all">
                                <User size={16} /> My Profile
                            </NavLink>
                            <button onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-500/10 transition-all">
                                <LogOut size={16} /> Sign Out
                            </button>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* ── Fixed top navbar ── */}
            <header className="h-14 sm:h-16 border-b border-slate-800 bg-slate-900/85 backdrop-blur-xl fixed top-0 left-0 right-0 z-30 px-4 sm:px-6 flex items-center justify-between shadow-lg shadow-black/20">

                <div className="flex items-center gap-3 sm:gap-6">
                    {/* Hamburger — mobile only */}
                    <button onClick={() => setDrawerOpen(true)}
                        className="md:hidden w-9 h-9 rounded-xl border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                        aria-label="Open menu">
                        <Menu size={18} />
                    </button>

                    {/* Logo */}
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center shadow-lg shadow-sky-500/20 shrink-0">
                            <GraduationCap className="text-white" size={18} />
                        </div>
                        <span className="font-black text-lg sm:text-xl tracking-tighter italic uppercase text-white hidden sm:block">
                            EduGuard
                        </span>
                    </div>

                    {/* Desktop nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {NAV_ITEMS.map(item => (
                            <NavItem key={item.path} item={item} compact />
                        ))}
                    </nav>
                </div>

                {/* Right: Bell + Profile */}
                <div className="flex items-center gap-2">

                    {/* Notifications */}
                    <div className="relative" ref={notifRef}>
                        <button onClick={() => { setIsNotifOpen(!isNotifOpen); setIsProfileOpen(false); }}
                            className="relative w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all">
                            <Bell size={17} />
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
                                    className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 backdrop-blur-xl overflow-hidden max-h-[80vh]"
                                >
                                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
                                        <p className="text-sm font-black text-white">Notifications</p>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">{unreadCount} new</span>
                                    </div>
                                    <div className="overflow-y-auto max-h-72">
                                        {notifications.length === 0 ? (
                                            <div className="py-8 text-center text-slate-600 text-xs font-semibold">No notifications</div>
                                        ) : notifications.map(notif => (
                                            <div key={notif.id} className="flex gap-3 px-4 py-3 hover:bg-white/5 transition-colors border-b border-slate-800/50 last:border-0">
                                                <notif.icon size={15} className={`mt-0.5 shrink-0 ${notif.color}`} />
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

                    {/* Profile dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-800 transition-all border border-transparent hover:border-slate-700 group">
                            <div className="text-right hidden sm:block mr-1 px-1">
                                <p className="text-sm font-bold text-slate-200 leading-tight">{user.name || 'Student'}</p>
                                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">My Account</p>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                                <span className="text-xs font-bold text-sky-400">{userInitials}</span>
                            </div>
                            <ChevronDown size={14} className={cn('text-slate-500 transition-transform duration-200 hidden sm:block', isProfileOpen && 'rotate-180')} />
                        </button>

                        <AnimatePresence>
                            {isProfileOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 mt-2 w-52 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 backdrop-blur-xl"
                                >
                                    <div className="px-4 py-3 border-b border-slate-800 mb-1">
                                        <p className="text-sm font-bold text-slate-200">{user.name || 'Student'}</p>
                                        <p className="text-[10px] text-slate-500 truncate">{user.email || 'student@university.edu'}</p>
                                    </div>
                                    <NavLink to="/student/profile" onClick={() => setIsProfileOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 text-[11px] font-semibold text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-all mx-2 rounded-xl">
                                        <User size={15} /> My Profile
                                    </NavLink>
                                    <NavLink to="/student/settings" onClick={() => setIsProfileOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 text-[11px] font-semibold text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-all mx-2 rounded-xl">
                                        <Settings size={15} /> Settings
                                    </NavLink>
                                    <div className="mx-2 my-1 h-px bg-slate-800" />
                                    <button onClick={() => { setIsProfileOpen(false); handleLogout(); }}
                                        className="flex items-center gap-3 w-[calc(100%-1rem)] mx-2 px-4 py-2.5 text-[11px] font-semibold text-rose-400 hover:bg-rose-400/10 transition-all rounded-xl">
                                        <LogOut size={15} /> Sign Out
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </header>

            {/* ── Main content ── */}
            <main className="relative z-10 pt-14 sm:pt-16 min-h-screen">
                <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-8 max-w-[1400px] mx-auto pb-24 md:pb-8">
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
            <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-slate-900/90 backdrop-blur-2xl border-t border-slate-800 flex items-center justify-around px-1 py-2">
                {NAV_ITEMS.map(item => {
                    const Icon = item.icon;
                    return (
                        <NavLink key={item.path} to={item.path} end={item.end}
                            className={({ isActive }) => cn(
                                'flex flex-col items-center gap-0.5 px-2 py-2 rounded-xl transition-all text-[9px] font-black uppercase tracking-wider',
                                isActive ? 'text-sky-400 bg-sky-500/10' : 'text-slate-500 hover:text-slate-300'
                            )}
                        >
                            {({ isActive }) => (
                                <>
                                    <Icon size={18} className={isActive ? 'text-sky-400' : ''} />
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

export default StudentLayout;

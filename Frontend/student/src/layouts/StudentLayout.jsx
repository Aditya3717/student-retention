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
            id: 1, type: 'warning', icon: AlertTriangle, color: 'var(--signal)',
            title: 'Low Attendance',
            body: `Your attendance is ${dashboardRaw.attendance}%. Minimum required is 75%.`,
        },
        dashboardRaw?.gpa < 2.5 && {
            id: 2, type: 'danger', icon: AlertTriangle, color: 'var(--rose)',
            title: 'GPA Alert',
            body: `Your current GPA is ${dashboardRaw.gpa?.toFixed(2)}. Please meet your advisor.`,
        },
        dashboardRaw?.dropoutRisk?.category === 'High' && {
            id: 3, type: 'danger', icon: AlertTriangle, color: 'var(--rose)',
            title: 'High Dropout Risk',
            body: 'Your profile has been flagged as high risk. Contact your advisor immediately.',
        },
        {
            id: 4, type: 'info', icon: Info, color: 'var(--sky)',
            title: 'Welcome to EduGuard',
            body: 'Your student portal is active. Check your academics and career guidance sections.',
        },
        dashboardRaw?.gpa >= 3.5 && {
            id: 5, type: 'success', icon: CheckCircle2, color: 'var(--emerald)',
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
    const NavItem = ({ item, onClick }) => {
        const Icon = item.icon;
        return (
            <NavLink to={item.path} end={item.end} onClick={onClick}
                className={({ isActive }) =>
                    `sg-nav-item${isActive ? ' sg-nav-item--active' : ''}`
                }
            >
                {({ isActive }) => (
                    <>
                        <Icon size={14} />
                        <span>{item.name}</span>
                    </>
                )}
            </NavLink>
        );
    };

    return (
        <div className="sg-app">

            {/* ── Ambient background ── */}
            <div className="sg-ambient" />

            {/* ── Mobile drawer overlay ── */}
            <AnimatePresence>
                {drawerOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="sg-drawer-overlay md:hidden"
                        onClick={() => setDrawerOpen(false)} />
                )}
            </AnimatePresence>

            {/* ── Mobile slide-in drawer ── */}
            <AnimatePresence>
                {drawerOpen && (
                    <motion.aside
                        initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                        className="sg-drawer md:hidden"
                    >
                        {/* Drawer header */}
                        <div className="sg-drawer-header">
                            <div className="sg-logo">
                                <div className="sg-logo-mark">
                                    <GraduationCap size={14} />
                                </div>
                                <span className="sg-logo-text">EduGuard</span>
                            </div>
                            <button onClick={() => setDrawerOpen(false)} className="sg-icon-btn">
                                <X size={14} />
                            </button>
                        </div>

                        {/* User info strip */}
                        <div className="sg-drawer-user-strip">
                            <div className="sg-avatar">
                                <span>{userInitials}</span>
                            </div>
                            <div style={{ minWidth: 0 }}>
                                <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--paper)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name || 'Student'}</p>
                                <p style={{ fontSize: '10px', color: 'var(--ink-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</p>
                            </div>
                        </div>

                        {/* Drawer nav */}
                        <nav className="sg-drawer-nav">
                            {NAV_ITEMS.map(item => (
                                <NavItem key={item.path} item={item} onClick={() => setDrawerOpen(false)} />
                            ))}
                        </nav>

                        {/* Drawer footer */}
                        <div className="sg-drawer-footer">
                            <NavLink to="/student/profile" onClick={() => setDrawerOpen(false)}
                                className="sg-nav-item">
                                <User size={14} /> My Profile
                            </NavLink>
                            <button onClick={handleLogout}
                                className="sg-btn sg-btn--danger"
                                style={{ width: '100%', justifyContent: 'flex-start', border: 'none' }}>
                                <LogOut size={14} /> Sign Out
                            </button>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* ── Fixed top navbar ── */}
            <header className="sg-header">

                <div className="sg-header-left">
                    {/* Hamburger — mobile only */}
                    <button onClick={() => setDrawerOpen(true)}
                        className="sg-icon-btn md:hidden"
                        aria-label="Open menu">
                        <Menu size={17} />
                    </button>

                    {/* Logo */}
                    <div className="sg-logo">
                        <div className="sg-logo-mark">
                            <GraduationCap size={14} />
                        </div>
                        <span className="sg-logo-text">EduGuard</span>
                    </div>

                    {/* Desktop nav */}
                    <nav className="sg-desktop-nav">
                        {NAV_ITEMS.map(item => (
                            <NavItem key={item.path} item={item} />
                        ))}
                    </nav>
                </div>

                {/* Right: Bell + Profile */}
                <div className="sg-header-right">

                    {/* Notifications */}
                    <div style={{ position: 'relative' }} ref={notifRef}>
                        <button
                            onClick={() => { setIsNotifOpen(!isNotifOpen); setIsProfileOpen(false); }}
                            className={`sg-icon-btn sg-icon-btn--notif`}
                        >
                            <Bell size={16} />
                            {unreadCount > 0 && <span className="sg-notif-dot" />}
                        </button>

                        <AnimatePresence>
                            {isNotifOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                                    transition={{ duration: 0.15 }}
                                    className="sg-notif-dropdown"
                                >
                                    <div className="sg-notif-header">
                                        <p className="sg-notif-title">Notifications</p>
                                        <span className="sg-notif-count">{unreadCount} new</span>
                                    </div>
                                    {notifications.length === 0 ? (
                                        <div style={{ padding: '32px 16px', textAlign: 'center', fontSize: '12px', color: 'var(--ink-muted)' }}>No notifications</div>
                                    ) : notifications.map(notif => (
                                        <div key={notif.id} className="sg-notif-item">
                                            <notif.icon size={14} style={{ color: notif.color, flexShrink: 0, marginTop: '2px' }} />
                                            <div>
                                                <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--paper)', marginBottom: '2px' }}>{notif.title}</p>
                                                <p style={{ fontSize: '11px', color: 'var(--ink-muted)', lineHeight: 1.5 }}>{notif.body}</p>
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Profile dropdown */}
                    <div style={{ position: 'relative' }} ref={dropdownRef}>
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="sg-profile-btn"
                        >
                            <div className="sg-profile-info">
                                <p className="sg-profile-name">{user.name || 'Student'}</p>
                                <p className="sg-profile-label">My Account</p>
                            </div>
                            <div className="sg-avatar">
                                <span>{userInitials}</span>
                            </div>
                            <ChevronDown size={13} style={{ color: 'var(--ink-muted)', transition: 'transform 0.2s', transform: isProfileOpen ? 'rotate(180deg)' : 'none', display: 'none' }} className="sm:block" />
                        </button>

                        <AnimatePresence>
                            {isProfileOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                                    transition={{ duration: 0.15 }}
                                    className="sg-dropdown"
                                >
                                    <div className="sg-dropdown-header">
                                        <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--paper)' }}>{user.name || 'Student'}</p>
                                        <p style={{ fontSize: '11px', color: 'var(--ink-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email || 'student@university.edu'}</p>
                                    </div>
                                    <NavLink to="/student/profile" onClick={() => setIsProfileOpen(false)}
                                        className="sg-dropdown-item">
                                        <User size={14} /> My Profile
                                    </NavLink>
                                    <NavLink to="/student/settings" onClick={() => setIsProfileOpen(false)}
                                        className="sg-dropdown-item">
                                        <Settings size={14} /> Settings
                                    </NavLink>
                                    <div className="sg-dropdown-divider" />
                                    <button
                                        onClick={() => { setIsProfileOpen(false); handleLogout(); }}
                                        className="sg-dropdown-item sg-dropdown-item--danger"
                                    >
                                        <LogOut size={14} /> Sign Out
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </header>

            {/* ── Main content ── */}
            <main className="sg-main">
                <div className="sg-content">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Outlet />
                    </motion.div>
                </div>
            </main>

            {/* ── Mobile bottom tab bar ── */}
            <nav className="sg-tab-bar">
                {NAV_ITEMS.map(item => {
                    const Icon = item.icon;
                    return (
                        <NavLink key={item.path} to={item.path} end={item.end}
                            className={({ isActive }) =>
                                `sg-tab-item${isActive ? ' sg-tab-item--active' : ''}`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <Icon size={17} />
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

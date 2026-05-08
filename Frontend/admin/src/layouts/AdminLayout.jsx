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
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="sg-drawer-overlay md:hidden"
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
                        className="sg-drawer md:hidden"
                    >
                        {/* Drawer header */}
                        <div className="sg-drawer-header">
                            <div className="sg-logo">
                                <div className="sg-logo-mark">
                                    <ShieldAlert size={16} />
                                </div>
                                <span className="sg-logo-text">EduGuard</span>
                            </div>
                            <button
                                onClick={() => setDrawerOpen(false)}
                                className="sg-icon-btn"
                            >
                                <X size={15} />
                            </button>
                        </div>

                        {/* Drawer nav */}
                        <nav className="sg-drawer-nav">
                            {NAV_ITEMS.map(item => (
                                <NavItem key={item.path} item={item} onClick={() => setDrawerOpen(false)} />
                            ))}
                        </nav>

                        {/* Drawer footer */}
                        <div className="sg-drawer-footer">
                            <div className="sg-drawer-user">
                                <div className="sg-avatar">
                                    <span>{userInitials}</span>
                                </div>
                                <div>
                                    <p className="sg-user-name">{user.name || 'Administrator'}</p>
                                    <p className="sg-user-role">Admin</p>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="sg-btn sg-btn--danger"
                                style={{ width: '100%', justifyContent: 'flex-start' }}
                            >
                                <LogOut size={14} /> Logout
                            </button>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* ── Top header ── */}
            <header className="sg-header">
                <div className="sg-header-left">
                    {/* Hamburger — mobile only */}
                    <button
                        onClick={() => setDrawerOpen(true)}
                        className="sg-icon-btn md:hidden"
                        aria-label="Open navigation"
                    >
                        <Menu size={18} />
                    </button>

                    {/* Logo */}
                    <div className="sg-logo">
                        <div className="sg-logo-mark">
                            <ShieldAlert size={16} />
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

                {/* Right side */}
                <div className="sg-header-right">
                    <div className="sg-user-info">
                        <p className="sg-user-name">{user.name || 'Administrator'}</p>
                        <p className="sg-user-role">Admin Console</p>
                    </div>
                    <div className="sg-avatar">
                        <span>{userInitials}</span>
                    </div>
                    <div className="sg-divider-v" />
                    <button
                        onClick={handleLogout}
                        className="sg-icon-btn sg-icon-btn--danger"
                        title="Logout"
                    >
                        <LogOut size={16} />
                    </button>
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
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.end}
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

export default AdminLayout;

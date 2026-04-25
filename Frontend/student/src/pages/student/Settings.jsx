import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Bell, Shield, Palette, LogOut, Key, User,
    CheckCircle2, ToggleLeft, ToggleRight, Eye, EyeOff,
    Lock, Mail, AlertTriangle, Save, ChevronRight
} from 'lucide-react';

/* ─── Reusable Toggle ────────────────────────────────────────────── */
const Toggle = ({ enabled, onToggle }) => (
    <button onClick={onToggle} className="focus:outline-none shrink-0 transition-transform active:scale-90">
        {enabled
            ? <ToggleRight size={30} className="text-primary-400" />
            : <ToggleLeft size={30} className="text-slate-600" />
        }
    </button>
);

/* ─── Section Card ───────────────────────────────────────────────── */
const SectionCard = ({ icon: Icon, title, children, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="bg-slate-900/40 border border-white/5 rounded-[2rem] overflow-hidden backdrop-blur-xl"
    >
        <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5 bg-white/[0.02]">
            <div className="w-8 h-8 rounded-xl bg-slate-800/80 border border-white/5 flex items-center justify-center">
                <Icon size={15} className="text-primary-400" />
            </div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.35em] text-slate-300">{title}</h4>
        </div>
        <div className="p-6 space-y-1">
            {children}
        </div>
    </motion.div>
);

/* ─── Row ────────────────────────────────────────────────────────── */
const Row = ({ label, desc, children }) => (
    <div className="flex items-center justify-between py-3 px-2 rounded-xl hover:bg-white/[0.03] transition-colors gap-4">
        <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-200">{label}</p>
            {desc && <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{desc}</p>}
        </div>
        {children}
    </div>
);

/* ─── Password Field ─────────────────────────────────────────────── */
const PasswordField = ({ label, value, onChange, placeholder }) => {
    const [show, setShow] = useState(false);
    return (
        <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</label>
            <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
                <input
                    type={show ? 'text' : 'password'}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full bg-slate-800/60 border border-white/8 rounded-xl pl-9 pr-10 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-primary-500/50 transition-colors"
                />
                <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
                >
                    {show ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
            </div>
        </div>
    );
};

/* ─── Main Component ─────────────────────────────────────────────── */
const Settings = () => {
    const navigate = useNavigate();
    const localUser = JSON.parse(localStorage.getItem('user') || '{}');

    // Prefs — persisted in localStorage
    const loadPrefs = () => {
        try { return JSON.parse(localStorage.getItem('studentPrefs') || '{}'); } catch { return {}; }
    };

    const [prefs, setPrefs] = useState({
        emailNotifications: true,
        riskAlerts: true,
        gradeUpdates: false,
        attendanceWarnings: true,
        ...loadPrefs(),
    });

    const [profile, setProfile] = useState({
        name: localUser.name || '',
        email: localUser.email || '',
    });

    const [passwords, setPasswords] = useState({ current: '', newPw: '', confirm: '' });
    const [pwError, setPwError] = useState('');
    const [pwSuccess, setPwSuccess] = useState(false);

    const [savedPrefs, setSavedPrefs] = useState(false);
    const [savedProfile, setSavedProfile] = useState(false);
    const [activeTab, setActiveTab] = useState('preferences');

    const togglePref = (key) => setPrefs(p => ({ ...p, [key]: !p[key] }));

    const savePrefs = () => {
        localStorage.setItem('studentPrefs', JSON.stringify(prefs));
        setSavedPrefs(true);
        setTimeout(() => setSavedPrefs(false), 2000);
    };

    const saveProfile = (e) => {
        e.preventDefault();
        // Update localStorage user object
        localStorage.setItem('user', JSON.stringify({ ...localUser, name: profile.name, email: profile.email }));
        setSavedProfile(true);
        setTimeout(() => setSavedProfile(false), 2000);
    };

    const changePassword = (e) => {
        e.preventDefault();
        setPwError('');
        if (!passwords.current) { setPwError('Enter your current password.'); return; }
        if (passwords.newPw.length < 6) { setPwError('New password must be at least 6 characters.'); return; }
        if (passwords.newPw !== passwords.confirm) { setPwError('Passwords do not match.'); return; }
        // In a real app, call API here
        setPwSuccess(true);
        setPasswords({ current: '', newPw: '', confirm: '' });
        setTimeout(() => setPwSuccess(false), 3000);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('dashboardData');
        navigate('/login');
    };

    const tabs = [
        { id: 'preferences', label: 'Preferences', icon: Bell },
        { id: 'account', label: 'Account', icon: User },
        { id: 'security', label: 'Security', icon: Shield },
    ];

    return (
        <div className="space-y-6 pb-12 max-w-2xl">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="text-3xl font-black text-white tracking-tighter italic uppercase">Settings</h2>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-1">Manage Your Account & Preferences</p>
            </motion.div>

            {/* Tab Bar */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}
                className="flex gap-1 p-1 bg-slate-900/40 border border-white/5 rounded-2xl backdrop-blur-xl w-fit"
            >
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${
                            activeTab === tab.id
                                ? 'bg-primary-600 text-white shadow-lg'
                                : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                        }`}
                    >
                        <tab.icon size={13} />
                        {tab.label}
                    </button>
                ))}
            </motion.div>

            <AnimatePresence mode="wait">

                {/* ── PREFERENCES TAB ─────────────────────────────────── */}
                {activeTab === 'preferences' && (
                    <motion.div key="preferences"
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                        className="space-y-4"
                    >
                        <SectionCard icon={Bell} title="Notifications" delay={0.05}>
                            <Row label="Email Notifications" desc="Receive academic updates to your email">
                                <Toggle enabled={prefs.emailNotifications} onToggle={() => togglePref('emailNotifications')} />
                            </Row>
                            <Row label="Risk Alerts" desc="Get notified when your dropout risk level changes">
                                <Toggle enabled={prefs.riskAlerts} onToggle={() => togglePref('riskAlerts')} />
                            </Row>
                            <Row label="Grade Updates" desc="Notifications when new grades are posted">
                                <Toggle enabled={prefs.gradeUpdates} onToggle={() => togglePref('gradeUpdates')} />
                            </Row>
                            <Row label="Attendance Warnings" desc="Alert when attendance drops below 75%">
                                <Toggle enabled={prefs.attendanceWarnings} onToggle={() => togglePref('attendanceWarnings')} />
                            </Row>
                        </SectionCard>

                        <button
                            onClick={savePrefs}
                            className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white font-black text-[11px] uppercase tracking-widest rounded-xl transition-all hover:scale-[1.02] active:scale-95"
                        >
                            {savedPrefs ? <><CheckCircle2 size={15} /> Saved!</> : <><Save size={15} /> Save Preferences</>}
                        </button>
                    </motion.div>
                )}

                {/* ── ACCOUNT TAB ─────────────────────────────────────── */}
                {activeTab === 'account' && (
                    <motion.div key="account"
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                        className="space-y-4"
                    >
                        <SectionCard icon={User} title="Profile Information" delay={0.05}>
                            <form onSubmit={saveProfile} className="space-y-4 pt-2">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Full Name</label>
                                    <div className="relative">
                                        <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
                                        <input
                                            type="text"
                                            value={profile.name}
                                            onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                                            className="w-full bg-slate-800/60 border border-white/8 rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-primary-500/50 transition-colors"
                                            placeholder="Your full name"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Email Address</label>
                                    <div className="relative">
                                        <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
                                        <input
                                            type="email"
                                            value={profile.email}
                                            onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
                                            className="w-full bg-slate-800/60 border border-white/8 rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-primary-500/50 transition-colors"
                                            placeholder="Your email"
                                        />
                                    </div>
                                </div>
                                <div className="pt-1">
                                    <p className="text-[10px] text-slate-600 font-semibold mb-3">Student ID and academic records can only be changed by your institution's administrator.</p>
                                    <button
                                        type="submit"
                                        className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white font-black text-[11px] uppercase tracking-widest rounded-xl transition-all hover:scale-[1.02] active:scale-95"
                                    >
                                        {savedProfile ? <><CheckCircle2 size={15} /> Saved!</> : <><Save size={15} /> Update Profile</>}
                                    </button>
                                </div>
                            </form>
                        </SectionCard>

                        {/* Danger Zone */}
                        <div className="bg-rose-500/5 border border-rose-500/20 rounded-[2rem] overflow-hidden">
                            <div className="flex items-center gap-3 px-6 py-4 border-b border-rose-500/10 bg-rose-500/[0.03]">
                                <AlertTriangle size={15} className="text-rose-400" />
                                <h4 className="text-[11px] font-black uppercase tracking-[0.35em] text-rose-400">Danger Zone</h4>
                            </div>
                            <div className="p-6">
                                <Row label="Sign Out" desc="End your current session and return to login">
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold text-[11px] uppercase tracking-widest rounded-xl hover:bg-rose-500/20 transition-all shrink-0"
                                    >
                                        <LogOut size={13} /> Sign Out
                                    </button>
                                </Row>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ── SECURITY TAB ─────────────────────────────────────── */}
                {activeTab === 'security' && (
                    <motion.div key="security"
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                        className="space-y-4"
                    >
                        <SectionCard icon={Key} title="Change Password" delay={0.05}>
                            <form onSubmit={changePassword} className="space-y-4 pt-2">
                                <PasswordField
                                    label="Current Password"
                                    value={passwords.current}
                                    onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))}
                                    placeholder="Enter current password"
                                />
                                <PasswordField
                                    label="New Password"
                                    value={passwords.newPw}
                                    onChange={e => setPasswords(p => ({ ...p, newPw: e.target.value }))}
                                    placeholder="At least 6 characters"
                                />
                                <PasswordField
                                    label="Confirm New Password"
                                    value={passwords.confirm}
                                    onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                                    placeholder="Repeat new password"
                                />

                                <AnimatePresence>
                                    {pwError && (
                                        <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                            className="flex items-center gap-2 text-rose-400 text-xs font-semibold bg-rose-500/10 border border-rose-500/20 px-4 py-2.5 rounded-xl"
                                        >
                                            <AlertTriangle size={13} /> {pwError}
                                        </motion.div>
                                    )}
                                    {pwSuccess && (
                                        <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                            className="flex items-center gap-2 text-emerald-400 text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5 rounded-xl"
                                        >
                                            <CheckCircle2 size={13} /> Password updated successfully!
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <button
                                    type="submit"
                                    className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white font-black text-[11px] uppercase tracking-widest rounded-xl transition-all hover:scale-[1.02] active:scale-95"
                                >
                                    <Lock size={14} /> Update Password
                                </button>
                            </form>
                        </SectionCard>

                        <SectionCard icon={Shield} title="Privacy & Security" delay={0.1}>
                            <div className="space-y-3 py-2">
                                {[
                                    { label: 'Data Encryption', desc: 'All your data is encrypted at rest and in transit', ok: true },
                                    { label: 'Institutional Access', desc: 'Your admin can view your academic profile', ok: true },
                                    { label: 'Two-Factor Auth', desc: 'Coming soon — additional login verification', ok: false },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                        {item.ok
                                            ? <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                                            : <AlertTriangle size={16} className="text-amber-400 mt-0.5 shrink-0" />
                                        }
                                        <div>
                                            <p className="text-sm font-semibold text-slate-200">{item.label}</p>
                                            <p className="text-[11px] text-slate-500">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </SectionCard>
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    );
};

export default Settings;

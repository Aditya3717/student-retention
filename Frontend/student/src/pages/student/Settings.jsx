import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Bell, Shield, Palette, LogOut, Key, User,
    CheckCircle2, ToggleLeft, ToggleRight, Eye, EyeOff,
    Lock, Mail, AlertTriangle, Save, ChevronRight, Settings as SettingsIcon
} from 'lucide-react';

/* ─── Reusable Toggle ────────────────────────────────────────────── */
const Toggle = ({ enabled, onToggle }) => (
    <button 
        onClick={onToggle} 
        className={`relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none border border-white/10 ${enabled ? 'bg-sky-500' : 'bg-slate-800'}`}
    >
        <motion.div 
            className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
            animate={{ x: enabled ? 20 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
    </button>
);

/* ─── Section Card ───────────────────────────────────────────────── */
const SectionCard = ({ icon: Icon, title, children, delay = 0, accent = "sky" }) => {
    const accentConfig = {
        sky: { bg: 'bg-sky-500/10', border: 'border-sky-500/20', text: 'text-sky-400' },
        emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400' },
        rose: { bg: 'bg-rose-500/10', border: 'border-rose-500/20', text: 'text-rose-400' },
        amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400' },
        slate: { bg: 'bg-slate-500/10', border: 'border-slate-500/20', text: 'text-slate-400' },
    };
    const acc = accentConfig[accent] || accentConfig.sky;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="bg-slate-900/40 border border-white/5 rounded-[2rem] overflow-hidden backdrop-blur-xl shadow-2xl relative group"
        >
            <div className="flex items-center gap-4 px-8 py-5 border-b border-white/5 bg-white/[0.02]">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${acc.bg} ${acc.border} transition-colors duration-300 group-hover:bg-opacity-20`}>
                    <Icon size={18} className={acc.text} />
                </div>
                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white">{title}</h4>
            </div>
            <div className="p-8 space-y-2 relative">
                {/* Subtle glow behind content */}
                <div className={`absolute -inset-4 opacity-0 group-hover:opacity-5 transition-opacity duration-500 blur-xl ${acc.bg}`} />
                <div className="relative z-10">
                    {children}
                </div>
            </div>
        </motion.div>
    );
};

/* ─── Row ────────────────────────────────────────────────────────── */
const Row = ({ label, desc, children }) => (
    <div className="flex items-center justify-between py-4 px-3 rounded-xl hover:bg-white/[0.03] transition-colors gap-4">
        <div className="min-w-0">
            <p className="text-sm font-bold text-slate-200">{label}</p>
            {desc && <p className="text-[11px] font-medium text-slate-500 mt-1 leading-relaxed">{desc}</p>}
        </div>
        <div className="shrink-0 pl-4">
            {children}
        </div>
    </div>
);

/* ─── Password Field ─────────────────────────────────────────────── */
const PasswordField = ({ label, value, onChange, placeholder }) => {
    const [show, setShow] = useState(false);
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">{label}</label>
            <div className="relative group">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky-400 transition-colors" />
                <input
                    type={show ? 'text' : 'password'}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full bg-slate-900/60 border border-white/10 rounded-2xl pl-11 pr-12 py-3.5 text-sm font-medium text-white placeholder-slate-600 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all shadow-inner"
                />
                <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
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
        <div className="space-y-10 pb-20 max-w-4xl mx-auto">
            {/* ── Hero Header ── */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="relative rounded-[2.5rem] overflow-hidden border border-white/5 bg-slate-900/50 backdrop-blur-xl">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800/40 via-slate-900/80 to-slate-950/80" />
                <div className="absolute top-0 left-0 w-64 h-64 bg-slate-500/10 rounded-full blur-[80px] -ml-20 -mt-20 pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-sky-500/5 rounded-full blur-[80px] -mr-20 -mb-20 pointer-events-none" />
                
                <div className="relative z-10 p-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2.5 rounded-2xl bg-slate-800 border border-white/10 shadow-lg">
                                <SettingsIcon size={20} className="text-slate-400" />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">System Configuration</span>
                        </div>
                        <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none mb-2">Settings</h2>
                        <p className="text-slate-400 text-sm">Manage your account credentials, security preferences, and system alerts.</p>
                    </div>
                </div>
            </motion.div>

            {/* ── Tab Bar ── */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="flex gap-2 p-1.5 bg-slate-900/60 border border-white/10 rounded-2xl backdrop-blur-xl w-fit"
            >
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                            activeTab === tab.id
                                ? 'bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-lg shadow-sky-500/20'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <tab.icon size={15} className={activeTab === tab.id ? 'text-white' : 'text-slate-500'} />
                        {tab.label}
                    </button>
                ))}
            </motion.div>

            <AnimatePresence mode="wait">

                {/* ── PREFERENCES TAB ─────────────────────────────────── */}
                {activeTab === 'preferences' && (
                    <motion.div key="preferences"
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                        className="space-y-6"
                    >
                        <SectionCard icon={Bell} title="Notifications" delay={0.15} accent="sky">
                            <Row label="Email Notifications" desc="Receive academic updates to your registered email address">
                                <Toggle enabled={prefs.emailNotifications} onToggle={() => togglePref('emailNotifications')} />
                            </Row>
                            <Row label="Risk Alerts" desc="Get notified when your dropout risk level changes significantly">
                                <Toggle enabled={prefs.riskAlerts} onToggle={() => togglePref('riskAlerts')} />
                            </Row>
                            <Row label="Grade Updates" desc="Push notifications when new semester grades are posted">
                                <Toggle enabled={prefs.gradeUpdates} onToggle={() => togglePref('gradeUpdates')} />
                            </Row>
                            <Row label="Attendance Warnings" desc="Alert when your subject attendance drops below the 75% threshold">
                                <Toggle enabled={prefs.attendanceWarnings} onToggle={() => togglePref('attendanceWarnings')} />
                            </Row>
                        </SectionCard>

                        <div className="flex justify-end pt-2">
                            <button
                                onClick={savePrefs}
                                className="flex items-center gap-2 px-8 py-3.5 bg-sky-600 hover:bg-sky-500 text-white font-black text-[11px] uppercase tracking-widest rounded-xl transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-sky-600/20"
                            >
                                {savedPrefs ? <><CheckCircle2 size={16} /> Saved Successfully</> : <><Save size={16} /> Save Preferences</>}
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* ── ACCOUNT TAB ─────────────────────────────────────── */}
                {activeTab === 'account' && (
                    <motion.div key="account"
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                        className="space-y-6"
                    >
                        <SectionCard icon={User} title="Profile Information" delay={0.15} accent="emerald">
                            <div className="space-y-5 pt-2">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                                    <div className="relative opacity-70">
                                        <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                        <input
                                            type="text"
                                            value={profile.name}
                                            readOnly
                                            className="w-full bg-slate-900/40 border border-white/5 rounded-2xl pl-11 pr-10 py-3.5 text-sm font-medium text-slate-300 cursor-not-allowed"
                                        />
                                        <Lock size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                                    <div className="relative opacity-70">
                                        <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                        <input
                                            type="email"
                                            value={profile.email}
                                            readOnly
                                            className="w-full bg-slate-900/40 border border-white/5 rounded-2xl pl-11 pr-10 py-3.5 text-sm font-medium text-slate-300 cursor-not-allowed"
                                        />
                                        <Lock size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600" />
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <div className="flex items-start gap-3 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
                                        <Shield size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                                        <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                                            Your core profile information is securely managed by your institution. Please contact the IT admin desk if any corrections are required.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </SectionCard>

                        {/* Danger Zone */}
                        <div className="bg-rose-500/5 border border-rose-500/20 rounded-[2rem] overflow-hidden backdrop-blur-xl relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 px-8 py-5 border-b border-rose-500/10 bg-rose-500/[0.03]">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-rose-500/20 bg-rose-500/10">
                                        <AlertTriangle size={18} className="text-rose-400" />
                                    </div>
                                    <h4 className="text-xs font-black uppercase tracking-[0.3em] text-rose-400">Danger Zone</h4>
                                </div>
                                <div className="p-8">
                                    <Row label="Sign Out" desc="End your current session and return to the secure login portal">
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-2 px-6 py-3 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white font-black text-[11px] uppercase tracking-widest rounded-xl border border-rose-500/30 hover:border-rose-500 transition-all shrink-0"
                                        >
                                            <LogOut size={15} /> Sign Out
                                        </button>
                                    </Row>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ── SECURITY TAB ─────────────────────────────────────── */}
                {activeTab === 'security' && (
                    <motion.div key="security"
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                        className="space-y-6"
                    >
                        <SectionCard icon={Key} title="Change Password" delay={0.15} accent="slate">
                            <form onSubmit={changePassword} className="space-y-5 pt-2">
                                <PasswordField
                                    label="Current Password"
                                    value={passwords.current}
                                    onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))}
                                    placeholder="Enter current password"
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                                </div>

                                <AnimatePresence>
                                    {pwError && (
                                        <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                            className="flex items-center gap-3 text-rose-400 text-xs font-semibold bg-rose-500/10 border border-rose-500/20 px-5 py-3 rounded-xl"
                                        >
                                            <AlertTriangle size={15} /> {pwError}
                                        </motion.div>
                                    )}
                                    {pwSuccess && (
                                        <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                            className="flex items-center gap-3 text-emerald-400 text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 px-5 py-3 rounded-xl"
                                        >
                                            <CheckCircle2 size={15} /> Password updated successfully!
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="flex justify-end pt-2">
                                    <button
                                        type="submit"
                                        className="flex items-center gap-2 px-8 py-3.5 bg-slate-700 hover:bg-slate-600 text-white font-black text-[11px] uppercase tracking-widest rounded-xl transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-slate-900/50 border border-white/5"
                                    >
                                        <Lock size={15} /> Update Password
                                    </button>
                                </div>
                            </form>
                        </SectionCard>

                        <SectionCard icon={Shield} title="Privacy & Security Insights" delay={0.2} accent="amber">
                            <div className="space-y-3 py-2">
                                {[
                                    { label: 'Data Encryption', desc: 'All your academic data is encrypted at rest and in transit.', ok: true },
                                    { label: 'Institutional Access', desc: 'Your university admin can view your academic profile and risk status.', ok: true },
                                    { label: 'Two-Factor Authentication', desc: 'Coming soon — add an extra layer of login verification.', ok: false },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/40 border border-white/5 hover:border-white/10 transition-colors group">
                                        <div className={`p-2 rounded-lg mt-0.5 shrink-0 ${item.ok ? 'bg-emerald-500/10' : 'bg-amber-500/10'}`}>
                                            {item.ok
                                                ? <CheckCircle2 size={16} className="text-emerald-400" />
                                                : <AlertTriangle size={16} className="text-amber-400" />
                                            }
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{item.label}</p>
                                            <p className="text-[11px] font-medium text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
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

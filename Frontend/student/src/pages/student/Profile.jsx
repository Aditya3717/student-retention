import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import {
    User, Mail, BookOpen, TrendingUp, Calendar, Award,
    Loader2, CheckCircle2, AlertTriangle, Edit3, Save,
    X, Briefcase, Star, Hash, GraduationCap, Shield
} from 'lucide-react';

/* ── Risk Badge ─────────────────────────────────────── */
const riskCfg = {
    Low:    { color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', icon: CheckCircle2 },
    Medium: { color: 'text-amber-400',   bg: 'bg-amber-400/10',   border: 'border-amber-400/20',   icon: AlertTriangle },
    High:   { color: 'text-rose-400',    bg: 'bg-rose-400/10',    border: 'border-rose-400/20',     icon: AlertTriangle },
};
const RiskBadge = ({ category = 'Low' }) => {
    const c = riskCfg[category] || riskCfg.Low;
    const Icon = c.icon;
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold ${c.color} ${c.bg} ${c.border}`}>
            <Icon size={13} /> {category} Risk
        </span>
    );
};

/* ── Stat Mini Card ─────────────────────────────────── */
const StatCard = ({ icon: Icon, label, value, color, delay }) => (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
        className="bg-slate-900/50 border border-white/5 rounded-2xl p-5 flex flex-col gap-2 backdrop-blur-xl">
        <Icon size={18} className={color} />
        <p className="text-2xl font-black text-white italic tracking-tighter">{value}</p>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</p>
    </motion.div>
);

/* ── Skill Bar ──────────────────────────────────────── */
const SkillBar = ({ name, level, delay }) => {
    const label = level >= 80 ? 'Expert' : level >= 60 ? 'Advanced' : level >= 40 ? 'Intermediate' : 'Beginner';
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-slate-300">{name}</span>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-wide">{label}</span>
                    <span className="text-[11px] font-black text-primary-400">{level}%</span>
                </div>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }} animate={{ width: `${level}%` }}
                    transition={{ duration: 1.2, delay, ease: [0.23, 1, 0.32, 1] }}
                    className="h-full bg-gradient-to-r from-primary-500 to-indigo-500 rounded-full"
                />
            </div>
        </div>
    );
};

/* ── Career Card ────────────────────────────────────── */
const CareerCard = ({ title, matchPercentage, index }) => (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * index }}
        className="bg-slate-900/40 border border-white/5 rounded-2xl p-5 flex items-center gap-4 backdrop-blur-xl hover:border-indigo-500/30 transition-all group">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 group-hover:bg-indigo-500/20 transition-all">
            <Briefcase size={16} className="text-indigo-400" />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-200 truncate">{title}</p>
            <div className="h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                <motion.div
                    initial={{ width: 0 }} animate={{ width: `${matchPercentage}%` }}
                    transition={{ duration: 1, delay: 0.1 * index, ease: [0.23, 1, 0.32, 1] }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                />
            </div>
        </div>
        <span className="text-sm font-black text-indigo-300 shrink-0">{matchPercentage}%</span>
    </motion.div>
);

/* ── Edit Modal ─────────────────────────────────────── */
const EditModal = ({ profile, onClose, onSave }) => {
    const [form, setForm] = useState({ name: profile.name || '', email: profile.email || '' });
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        setSaving(true);
        setTimeout(() => {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            localStorage.setItem('user', JSON.stringify({ ...user, name: form.name, email: form.email }));
            setSaving(false); setSaved(true);
            setTimeout(() => { onSave(form); onClose(); }, 900);
        }, 800);
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl"
            onClick={onClose}
        >
            <motion.div initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }}
                onClick={e => e.stopPropagation()}
                className="w-full max-w-md bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl"
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-black text-white italic uppercase">Edit Profile</h3>
                    <button onClick={onClose} className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-slate-500 hover:text-white transition-all">
                        <X size={16} />
                    </button>
                </div>
                <form onSubmit={submit} className="space-y-4">
                    {[
                        { label: 'Full Name', key: 'name', type: 'text', icon: User },
                        { label: 'Email Address', key: 'email', type: 'email', icon: Mail },
                    ].map(f => (
                        <div key={f.key} className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">{f.label}</label>
                            <div className="relative">
                                <f.icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
                                <input type={f.type} value={form[f.key]}
                                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                                    className="w-full bg-slate-800/60 border border-white/8 rounded-xl pl-9 pr-4 py-3 text-sm text-white focus:outline-none focus:border-primary-500/50 transition-colors"
                                />
                            </div>
                        </div>
                    ))}
                    <p className="text-[10px] text-slate-600">Student ID and academic data can only be changed by your administrator.</p>
                    <button type="submit" disabled={saving}
                        className="w-full py-3.5 bg-primary-600 hover:bg-primary-500 text-white font-black text-[11px] uppercase tracking-widest rounded-xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70">
                        {saved ? <><CheckCircle2 size={15} /> Saved!</> : saving ? <><Loader2 size={15} className="animate-spin" /> Saving…</> : <><Save size={15} /> Save Changes</>}
                    </button>
                </form>
            </motion.div>
        </motion.div>
    );
};

/* ── Main Profile ───────────────────────────────────── */
const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [editOpen, setEditOpen] = useState(false);
    const [localName, setLocalName] = useState('');
    const navigate = useNavigate();
    const localUser = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        setLocalName(localUser.name || '');

        const loadProfile = async () => {
            try {
                // Try full profile endpoint first
                const res = await api.get('/students/profile');
                if (res.data.success) {
                    setProfile(res.data.data);
                    return;
                }
            } catch (profileErr) {
                // Profile endpoint failed — try dashboard as fallback
                try {
                    const dash = await api.get('/students/dashboard');
                    if (dash.data.success) {
                        // Merge dashboard data with localStorage user info
                        setProfile({
                            name: localUser.name,
                            email: localUser.email,
                            gpa: dash.data.data.gpa,
                            attendance: dash.data.data.attendance,
                            academicHistory: dash.data.data.academicHistory || [],
                            skills: [],
                            careerRecommendations: dash.data.data.recommendations || [],
                            dropoutRisk: dash.data.data.dropoutRisk || { category: 'Low' },
                            studentId: dash.data.data.studentId || localUser.studentId || null,
                        });
                        return;
                    }
                } catch (dashErr) {
                    setError('Could not load profile. Please check your connection.');
                }
            } finally {
                setIsLoading(false);
            }
        };

        loadProfile();
    }, []);

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="animate-spin text-primary-500" size={40} />
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
            <AlertTriangle size={40} className="text-amber-400" />
            <p className="text-slate-400 font-semibold">{error}</p>
            <button onClick={() => window.location.reload()} className="px-5 py-2.5 bg-slate-800 text-white text-xs font-bold rounded-xl hover:bg-slate-700 transition-all">Retry</button>
        </div>
    );

    const name = localName || profile?.name || localUser.name || 'Student';
    const email = profile?.email || localUser.email || '—';
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const risk = profile?.dropoutRisk?.category || 'Low';
    const RiskDotIcon = riskCfg[risk]?.icon || CheckCircle2;
    const totalCredits = profile?.academicHistory?.reduce((acc, s) =>
        acc + s.subjects.reduce((a, sub) => a + (sub.credits || 0), 0), 0) || 0;
    const totalSemesters = profile?.academicHistory?.length || 0;

    return (
        <div className="space-y-8 pb-12">
            <AnimatePresence>
                {editOpen && (
                    <EditModal
                        profile={{ name, email }}
                        onClose={() => setEditOpen(false)}
                        onSave={f => setLocalName(f.name)}
                    />
                )}
            </AnimatePresence>

            {/* Page Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tighter italic uppercase">My Profile</h2>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-1">Your Academic Identity</p>
                </div>
                <button onClick={() => setEditOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-800/80 border border-white/8 text-slate-300 hover:text-white hover:bg-slate-700 font-bold text-xs uppercase tracking-widest rounded-xl transition-all">
                    <Edit3 size={14} /> Edit Profile
                </button>
            </motion.div>

            {/* Hero Card */}
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
                className="relative bg-gradient-to-br from-slate-900/80 via-primary-900/10 to-indigo-900/10 border border-white/5 rounded-[3rem] p-8 md:p-10 backdrop-blur-xl overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-primary-500/5 rounded-full -mr-40 -mt-40 blur-[100px]" />
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-7 relative z-10">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                        <div className="w-28 h-28 rounded-[1.5rem] bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-primary-500/30">
                            <span className="text-4xl font-black text-white">{initials}</span>
                        </div>
                        <div className={`absolute -bottom-2 -right-2 w-7 h-7 rounded-full border-2 border-slate-900 flex items-center justify-center ${riskCfg[risk]?.bg}`}>
                            <RiskDotIcon size={14} className={riskCfg[risk]?.color} />
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center sm:text-left">
                        <h3 className="text-2xl font-black text-white tracking-tight mb-1">{name}</h3>
                        <p className="text-slate-400 text-sm mb-3">{email}</p>
                        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/8 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <Hash size={10} /> {profile?.studentId || 'No ID'}
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/8 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <GraduationCap size={10} /> {totalSemesters} Semester{totalSemesters !== 1 ? 's' : ''}
                            </span>
                            <RiskBadge category={risk} />
                        </div>
                    </div>

                    {/* GPA circle */}
                    <div className="shrink-0 flex flex-col items-center justify-center w-24 h-24 rounded-[1.5rem] bg-white/5 border border-white/8">
                        <span className="text-2xl font-black text-white italic">{profile?.gpa?.toFixed(2) || '0.00'}</span>
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 mt-0.5">CGPA</span>
                    </div>
                </div>
            </motion.div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard icon={TrendingUp}     label="Current GPA"      value={profile?.gpa?.toFixed(2) || '—'}    color="text-sky-400"     delay={0.10} />
                <StatCard icon={Calendar}       label="Attendance"       value={`${profile?.attendance || 0}%`}      color="text-indigo-400"  delay={0.14} />
                <StatCard icon={BookOpen}       label="Credits Earned"   value={totalCredits}                        color="text-emerald-400" delay={0.18} />
                <StatCard icon={Award}          label="Semesters"        value={totalSemesters}                      color="text-amber-400"   delay={0.22} />
            </div>

            {/* Skills + Career side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Skills */}
                <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                    className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <Star size={16} className="text-primary-400" />
                        <h4 className="text-[11px] font-black uppercase tracking-[0.35em] text-slate-300">Skills</h4>
                    </div>
                    {profile?.skills?.length > 0 ? (
                        <div className="space-y-5">
                            {profile.skills.map((sk, i) => (
                                <SkillBar key={i} name={sk.name} level={sk.level} delay={0.25 + i * 0.06} />
                            ))}
                        </div>
                    ) : (
                        <div className="py-10 text-center">
                            <Star size={32} className="text-slate-700 mx-auto mb-3" />
                            <p className="text-slate-600 text-sm font-semibold">No skills added yet.</p>
                            <p className="text-slate-700 text-xs mt-1">Ask your admin to update your profile.</p>
                        </div>
                    )}
                </motion.div>

                {/* Career Recommendations */}
                <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.22 }}
                    className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <Briefcase size={16} className="text-indigo-400" />
                        <h4 className="text-[11px] font-black uppercase tracking-[0.35em] text-slate-300">Career Matches</h4>
                    </div>
                    {profile?.careerRecommendations?.length > 0 ? (
                        <div className="space-y-3">
                            {profile.careerRecommendations.map((rec, i) => (
                                <CareerCard key={i} index={i} title={rec.title} matchPercentage={rec.matchPercentage} />
                            ))}
                        </div>
                    ) : (
                        <div className="py-10 text-center">
                            <Briefcase size={32} className="text-slate-700 mx-auto mb-3" />
                            <p className="text-slate-600 text-sm font-semibold">No recommendations yet.</p>
                            <p className="text-slate-700 text-xs mt-1">Visit Career Paths for guidance.</p>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Semester Academic History */}
            {profile?.academicHistory?.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <GraduationCap size={16} className="text-amber-400" />
                        <h4 className="text-[11px] font-black uppercase tracking-[0.35em] text-slate-300">Academic History</h4>
                    </div>
                    <div className="space-y-4">
                        {profile.academicHistory.map((sem, si) => (
                            <motion.div key={si} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 + si * 0.06 }}
                                className="border border-white/5 rounded-2xl overflow-hidden">
                                <div className="flex items-center justify-between px-5 py-3 bg-white/[0.03]">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-primary-500" />
                                        <span className="text-sm font-black text-white italic uppercase">{sem.semester}</span>
                                        <span className="text-[10px] text-slate-500 font-semibold">{sem.subjects.length} subjects</span>
                                    </div>
                                    <span className="text-sm font-black text-primary-400">GPA {sem.gpa?.toFixed(2)}</span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-xs">
                                        <thead>
                                            <tr className="border-t border-white/5">
                                                {['Code', 'Subject', 'Grade', 'Credits', 'Attendance', 'Status'].map(h => (
                                                    <th key={h} className="px-4 py-2.5 text-left text-[9px] font-black uppercase tracking-widest text-slate-600">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sem.subjects.map((sub, ri) => (
                                                <tr key={ri} className="border-t border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                                                    <td className="px-4 py-3 font-bold text-primary-400">{sub.code}</td>
                                                    <td className="px-4 py-3 text-slate-300 font-medium">{sub.name}</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`font-black ${sub.grade === 'F' ? 'text-rose-400' : sub.grade === 'O' || sub.grade === 'A+' ? 'text-emerald-400' : 'text-slate-200'}`}>
                                                            {sub.grade}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-slate-400 font-semibold">{sub.credits}</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`font-semibold ${(sub.attendance || 0) < 75 ? 'text-amber-400' : 'text-slate-400'}`}>
                                                            {sub.attendance ?? '—'}{sub.attendance != null ? '%' : ''}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide border ${
                                                            sub.status === 'Ongoing'
                                                                ? 'text-amber-400 bg-amber-400/10 border-amber-400/20'
                                                                : 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
                                                        }`}>{sub.status || 'Completed'}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Security Footer */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                className="flex items-center gap-2 text-slate-700 text-[11px] font-semibold justify-center py-2">
                <Shield size={13} />
                Your profile is encrypted and only shared with your institution.
            </motion.div>
        </div>
    );
};

export default Profile;

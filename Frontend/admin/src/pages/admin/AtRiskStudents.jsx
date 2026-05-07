import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';
import {
    AlertTriangle, AlertCircle, ShieldCheck, Search, Filter,
    Loader2, Mail, ExternalLink, RefreshCw, X, ArrowUpDown,
    ChevronUp, ChevronDown, Users, CheckCircle2,
    User, BookOpen, Award, BarChart2, GraduationCap, Briefcase
} from 'lucide-react';

/* ── Risk Score Bar ── */
const RiskBar = ({ score, cat }) => {
    const cfg = {
        High: { bar: 'from-rose-600 to-rose-400', track: 'bg-rose-500/10', text: 'text-rose-400' },
        Medium: { bar: 'from-amber-600 to-amber-400', track: 'bg-amber-500/10', text: 'text-amber-400' },
        Low: { bar: 'from-emerald-600 to-emerald-400', track: 'bg-emerald-500/10', text: 'text-emerald-400' },
    };
    const c = cfg[cat] || cfg.Medium;
    return (
        <div className="space-y-1 w-full">
            <div className="flex justify-between items-center">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Risk Score</span>
                <span className={`text-sm font-black tabular-nums italic ${c.text}`}>{score}</span>
            </div>
            <div className={`h-2 w-full rounded-full ${c.track}`}>
                <div className={`h-full rounded-full bg-gradient-to-r ${c.bar} transition-all duration-700`}
                    style={{ width: `${Math.min(score, 100)}%` }} />
            </div>
        </div>
    );
};

/* ── Category Badge ── */
const CatBadge = ({ cat }) => {
    const cfg = {
        High: { cls: 'text-rose-400 bg-rose-500/10 border-rose-500/20', Icon: AlertCircle },
        Medium: { cls: 'text-amber-400 bg-amber-500/10 border-amber-500/20', Icon: AlertTriangle },
        Low: { cls: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', Icon: ShieldCheck },
    };
    const { cls, Icon } = cfg[cat] || cfg.Medium;
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${cls}`}>
            <Icon size={11} />{cat} Risk
        </span>
    );
};

/* ── Student Profile Modal ── */
const ProfileModal = ({ student, onClose }) => {
    if (!student) return null;
    const cat = student.dropoutRisk?.category || 'Low';
    const score = student.dropoutRisk?.score ?? 0;
    const catColor = {
        High: 'text-rose-400',
        Medium: 'text-amber-400',
        Low: 'text-emerald-400',
    }[cat] || 'text-slate-300';

    const totalCredits = student.academicHistory?.reduce(
        (acc, h) => acc + (h.subjects?.reduce((a, sub) => a + (sub.credits || 0), 0) || 0), 0
    ) || 0;

    // If root gpa field is 0/missing, derive CGPA from semester TGPAs
    const semesterGpas = (student.academicHistory || [])
        .map(h => h.gpa)
        .filter(g => g != null && g > 0);
    const effectiveCgpa = (student.gpa && student.gpa > 0)
        ? student.gpa
        : semesterGpas.length > 0
            ? semesterGpas.reduce((a, b) => a + b, 0) / semesterGpas.length
            : 0;


    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex justify-end bg-black/70 backdrop-blur-xl"
            onClick={onClose}>
            <motion.div
                initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 260 }}
                onClick={e => e.stopPropagation()}
                className="w-full max-w-xl h-full bg-[#0a0a0f] border-l border-white/8 overflow-y-auto flex flex-col">

                {/* Header */}
                <div className="sticky top-0 z-10 bg-[#0a0a0f]/95 backdrop-blur-xl border-b border-white/5 px-8 py-6 flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black border ${cat === 'High' ? 'bg-rose-500/10 border-rose-500/20 text-rose-300'
                                : cat === 'Medium' ? 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                                    : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                            }`}>
                            {(student.user?.name || 'U').split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white tracking-tight">{student.user?.name || 'Unknown'}</h2>
                            <p className="text-xs text-slate-500 font-semibold">{student.user?.email}</p>
                            <p className="text-[10px] text-slate-600 font-mono mt-0.5">{student.studentId}</p>
                        </div>
                    </div>
                    <button onClick={onClose}
                        className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 transition-all shrink-0">
                        <X size={16} />
                    </button>
                </div>

                <div className="flex-1 px-8 py-6 space-y-8">

                    {/* Risk Overview */}
                    <section>
                        <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.25em] mb-3 flex items-center gap-2">
                            <AlertTriangle size={10} /> Risk Overview
                        </p>
                        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${cat === 'High' ? 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                                        : cat === 'Medium' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                                            : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                                    }`}>{cat} Risk</span>
                                <span className={`text-2xl font-black italic ${catColor}`}>{score}<span className="text-xs text-slate-600 font-normal ml-1">/100</span></span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-white/5">
                                <div className={`h-full rounded-full transition-all duration-700 bg-gradient-to-r ${cat === 'High' ? 'from-rose-600 to-rose-400'
                                        : cat === 'Medium' ? 'from-amber-600 to-amber-400'
                                            : 'from-emerald-600 to-emerald-400'
                                    }`} style={{ width: `${Math.min(score, 100)}%` }} />
                            </div>
                            <p className="text-xs text-slate-400 font-semibold">
                                Reason: <span className={catColor}>{student.dropoutRisk?.reason || 'System Assessment'}</span>
                            </p>
                        </div>
                    </section>

                    {/* Key Stats */}
                    <section>
                        <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.25em] mb-3 flex items-center gap-2">
                            <BarChart2 size={10} /> Academic Metrics
                        </p>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                {
                                    label: 'CGPA', value: effectiveCgpa.toFixed(2),
                                    color: effectiveCgpa >= 7 ? 'text-emerald-400' : effectiveCgpa >= 5 ? 'text-amber-400' : 'text-rose-400'
                                },
                                {
                                    label: 'Attendance', value: `${student.attendance || 0}%`,
                                    color: student.attendance >= 80 ? 'text-emerald-400' : student.attendance >= 70 ? 'text-amber-400' : 'text-rose-400'
                                },
                                { label: 'Credits', value: totalCredits, color: 'text-slate-300' },
                                { label: 'Semesters', value: student.academicHistory?.length || 0, color: 'text-slate-300' },
                                { label: 'Risk Score', value: score, color: catColor },
                                { label: 'Category', value: cat, color: catColor },
                            ].map(({ label, value, color }) => (
                                <div key={label} className="bg-black/30 border border-white/5 rounded-xl p-3 text-center">
                                    <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest mb-1">{label}</p>
                                    <p className={`text-lg font-black italic ${color}`}>{value}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Academic History */}
                    {student.academicHistory?.length > 0 && (
                        <section>
                            <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.25em] mb-3 flex items-center gap-2">
                                <BookOpen size={10} /> Academic History
                            </p>
                            <div className="space-y-4">
                                {student.academicHistory.map((sem, i) => (
                                    <div key={i} className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
                                        <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-white/[0.01]">
                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                                                <GraduationCap size={12} />{sem.semester}
                                            </span>
                                            <span className="text-[10px] font-black text-indigo-400">TGPA: {sem.gpa?.toFixed(2) || '—'}</span>
                                        </div>
                                        {sem.subjects?.length > 0 && (
                                            <table className="w-full text-left">
                                                <thead>
                                                    <tr className="border-b border-white/5">
                                                        {['Subject', 'Grade', 'Credits', 'Att.'].map(h => (
                                                            <th key={h} className="px-4 py-2 text-[8px] font-black text-slate-600 uppercase tracking-widest">{h}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/[0.03]">
                                                    {sem.subjects.map((sub, j) => (
                                                        <tr key={j} className="hover:bg-white/[0.02] transition-colors">
                                                            <td className="px-4 py-2">
                                                                <p className="text-[10px] font-semibold text-slate-300 leading-tight">{sub.name}</p>
                                                                <p className="text-[9px] text-slate-600 font-mono">{sub.code}</p>
                                                            </td>
                                                            <td className="px-4 py-2">
                                                                <span className={`text-[10px] font-black ${['O', 'A+', 'A'].includes(sub.grade) ? 'text-emerald-400'
                                                                        : ['B+', 'B'].includes(sub.grade) ? 'text-amber-400'
                                                                            : 'text-rose-400'
                                                                    }`}>{sub.grade || '—'}</span>
                                                            </td>
                                                            <td className="px-4 py-2 text-[10px] text-slate-400 font-semibold">{sub.credits || 0}</td>
                                                            <td className="px-4 py-2">
                                                                <span className={`text-[10px] font-black ${(sub.attendance || 0) >= 80 ? 'text-emerald-400'
                                                                        : (sub.attendance || 0) >= 70 ? 'text-amber-400'
                                                                            : 'text-rose-400'
                                                                    }`}>{sub.attendance || 0}%</span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Skills */}
                    {student.skills?.length > 0 && (
                        <section>
                            <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.25em] mb-3 flex items-center gap-2">
                                <Award size={10} /> Skills
                            </p>
                            <div className="space-y-2">
                                {student.skills.map((skill, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <span className="text-[10px] text-slate-400 font-semibold w-28 shrink-0">{skill.name}</span>
                                        <div className="flex-1 h-1.5 bg-white/5 rounded-full">
                                            <div className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-indigo-400"
                                                style={{ width: `${skill.level || 0}%` }} />
                                        </div>
                                        <span className="text-[10px] text-slate-500 font-black w-8 text-right">{skill.level}%</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Career Recommendations */}
                    {student.careerRecommendations?.length > 0 && (
                        <section>
                            <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.25em] mb-3 flex items-center gap-2">
                                <Briefcase size={10} /> Career Recommendations
                            </p>
                            <div className="space-y-2">
                                {student.careerRecommendations.map((rec, i) => (
                                    <div key={i} className="flex items-center justify-between bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3">
                                        <span className="text-[10px] font-semibold text-slate-300">{rec.title}</span>
                                        <span className="text-[10px] font-black text-indigo-400">{rec.matchPercentage}% match</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                </div>

                {/* Footer action */}
                <div className="sticky bottom-0 bg-[#0a0a0f]/95 backdrop-blur-xl border-t border-white/5 px-8 py-5">
                    <a href={`mailto:${student.user?.email}`}
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-500 text-white text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-rose-500/20">
                        <Mail size={14} /> Send Academic Warning Email
                    </a>
                </div>
            </motion.div>
        </motion.div>
    );
};

/* ── Alert Email Modal ── */
const AlertModal = ({ student, onClose }) => {
    const [sent, setSent] = useState(false);

    const sendEmail = () => {
        const name = student.user?.name || 'Student';
        const email = student.user?.email || '';
        const reason = student.dropoutRisk?.reason || 'Academic concern';
        const subject = encodeURIComponent(`Academic Support — Action Required`);
        const body = encodeURIComponent(
            `Dear ${name},\n\nThis is an important notice from the academic support team.\n\n` +
            `Our monitoring system has flagged your profile with an elevated dropout risk indicator.\n` +
            `Reason: ${reason}\n\nCurrent CGPA: ${student.gpa?.toFixed(2)}\nAttendance: ${student.attendance}%\n\n` +
            `We strongly encourage you to visit the student counselling centre at the earliest.\n\n` +
            `Regards,\nAcademic Administration`
        );
        window.open(`mailto:${email}?subject=${subject}&body=${body}`);
        setSent(true);
        setTimeout(onClose, 2000);
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-2xl"
            onClick={onClose}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                onClick={e => e.stopPropagation()}
                className="max-w-md w-full bg-[#0f0e0d] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl">
                <button onClick={onClose} className="absolute top-8 right-8 w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-slate-500 hover:text-white transition-all">
                    <X size={16} />
                </button>

                {sent ? (
                    <div className="flex flex-col items-center py-8 gap-4">
                        <CheckCircle2 size={48} className="text-emerald-400" />
                        <p className="text-white font-black text-lg uppercase italic">Email Client Opened!</p>
                        <p className="text-slate-500 text-sm text-center">Your default email client has been opened with a pre-filled alert message.</p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                                <Mail size={22} className="text-rose-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white italic uppercase tracking-tight">Send Alert</h3>
                                <p className="text-slate-500 text-xs mt-0.5">Pre-filled academic warning email</p>
                            </div>
                        </div>

                        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-3 mb-8">
                            <div className="flex justify-between">
                                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">To</span>
                                <span className="text-xs text-slate-300 font-semibold">{student.user?.email || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Student</span>
                                <span className="text-xs text-slate-300 font-semibold">{student.user?.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Reason</span>
                                <span className="text-xs text-rose-400 font-semibold">{student.dropoutRisk?.reason}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Risk Score</span>
                                <span className="text-xs text-rose-400 font-black">{student.dropoutRisk?.score} / 100</span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={onClose}
                                className="flex-1 py-3 rounded-2xl border border-white/10 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">
                                Cancel
                            </button>
                            <button onClick={sendEmail}
                                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-500 text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2">
                                <Mail size={14} /> Send Alert
                            </button>
                        </div>
                    </>
                )}
            </motion.div>
        </motion.div>
    );
};

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
const AtRiskStudents = () => {
    const [allAtRisk, setAllAtRisk] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [catFilter, setCatFilter] = useState('');
    const [sortField, setSortField] = useState('score');
    const [sortDir, setSortDir] = useState('desc');
    const [alertStudent, setAlertStudent] = useState(null);
    const [profileStudent, setProfileStudent] = useState(null);
    const [batches, setBatches] = useState([]);
    const [activeBatch, setActiveBatch] = useState('');  // '' = All Batches

    // Load batch list once
    useEffect(() => {
        api.get('/admin/batches')
            .then(r => { if (r.data.success) setBatches(r.data.data); })
            .catch(() => { });
    }, []);

    // Debounce search — only filter after 300ms of inactivity
    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(searchTerm), 300);
        return () => clearTimeout(t);
    }, [searchTerm]);

    const fetchAtRisk = async (batch = activeBatch) => {
        setIsLoading(true);
        try {
            const params = batch ? `?batch=${batch}` : '';
            const res = await api.get(`/admin/at-risk${params}`);
            if (res.data.success) setAllAtRisk(res.data.data);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchAtRisk(activeBatch); }, [activeBatch]);

    /* ── Step 1: Enrich CGPA once when raw data loads ── */
    const enrichedAtRisk = useMemo(() =>
        allAtRisk.map(s => {
            const semGpas = (s.academicHistory || []).map(h => h.gpa).filter(g => g > 0);
            const effectiveCgpa = (s.gpa && s.gpa > 0)
                ? s.gpa
                : semGpas.length > 0 ? semGpas.reduce((a, b) => a + b, 0) / semGpas.length : 0;
            return { ...s, effectiveCgpa };
        })
        , [allAtRisk]); // only re-runs when data actually changes

    /* ── Step 2: Filter + sort (instant — no CGPA computation here) ── */
    const displayed = useMemo(() => {
        let list = enrichedAtRisk;

        if (catFilter) list = list.filter(s => s.dropoutRisk?.category === catFilter);

        if (debouncedSearch) {
            const q = debouncedSearch.toLowerCase();
            list = list.filter(s =>
                s.user?.name?.toLowerCase().includes(q) ||
                s.user?.email?.toLowerCase().includes(q) ||
                s.studentId?.toLowerCase().includes(q)
            );
        }

        return [...list].sort((a, b) => {
            let av, bv;
            if (sortField === 'score') { av = a.dropoutRisk?.score ?? 0; bv = b.dropoutRisk?.score ?? 0; }
            else if (sortField === 'cgpa') { av = a.effectiveCgpa; bv = b.effectiveCgpa; }
            else { av = a.attendance ?? 0; bv = b.attendance ?? 0; }
            return sortDir === 'desc' ? bv - av : av - bv;
        });
    }, [enrichedAtRisk, catFilter, debouncedSearch, sortField, sortDir]);

    const toggleSort = (field) => {
        if (sortField === field) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
        else { setSortField(field); setSortDir('desc'); }
    };

    const SortIcon = ({ field }) => {
        if (sortField !== field) return <ArrowUpDown size={12} className="text-slate-600" />;
        return sortDir === 'desc' ? <ChevronDown size={12} className="text-indigo-400" /> : <ChevronUp size={12} className="text-indigo-400" />;
    };

    const highCount = allAtRisk.filter(s => s.dropoutRisk?.category === 'High').length;
    const mediumCount = allAtRisk.filter(s => s.dropoutRisk?.category === 'Medium').length;

    return (
        <div className="space-y-5 pb-24 md:pb-0">

            {/* ── Alert Modal ── */}
            <AnimatePresence>
                {alertStudent && <AlertModal student={alertStudent} onClose={() => setAlertStudent(null)} />}
                {profileStudent && <ProfileModal student={profileStudent} onClose={() => setProfileStudent(null)} />}
            </AnimatePresence>

            {/* ── Hero Banner ── */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="relative rounded-[2.5rem] overflow-hidden border border-rose-500/20 bg-gradient-to-r from-rose-500/8 via-slate-900/60 to-slate-950 backdrop-blur-xl p-8">
                <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/8 rounded-full blur-[80px] -mr-40 -mt-40 pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shadow-lg shadow-rose-500/10 shrink-0">
                            <AlertTriangle className="text-rose-400" size={30} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white tracking-tight italic uppercase">Active Early Warnings</h2>
                            <p className="text-slate-400 text-sm mt-1 font-medium max-w-xl">
                                {allAtRisk.length} students flagged —
                                {' '}<span className="text-rose-400 font-black">{highCount} High</span>
                                {' · '}<span className="text-amber-400 font-black">{mediumCount} Medium</span>
                                {activeBatch && <span className="text-slate-500"> · Batch {activeBatch}</span>}
                            </p>
                        </div>
                    </div>
                    <button onClick={() => fetchAtRisk(activeBatch)}
                        className="flex items-center gap-2 px-5 py-2.5 border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all self-start">
                        <RefreshCw size={14} /> Refresh
                    </button>
                </div>

                {/* Stat chips */}
                <div className="relative z-10 flex flex-wrap gap-4 mt-6">
                    {[
                        { label: 'Total At-Risk', value: allAtRisk.length, color: 'border-white/10 text-slate-300', bg: 'bg-white/5' },
                        { label: 'High Risk', value: highCount, color: 'border-rose-500/20 text-rose-400', bg: 'bg-rose-500/5' },
                        { label: 'Medium Risk', value: mediumCount, color: 'border-amber-500/20 text-amber-400', bg: 'bg-amber-500/5' },
                        { label: 'Shown', value: displayed.length, color: 'border-indigo-500/20 text-indigo-400', bg: 'bg-indigo-500/5' },
                    ].map(({ label, value, color, bg }) => (
                        <div key={label} className={`flex items-center gap-3 px-4 py-2 rounded-xl border ${bg} ${color}`}>
                            <span className="text-lg font-black italic">{value}</span>
                            <span className="text-[9px] font-black uppercase tracking-widest opacity-70">{label}</span>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* ── Filter Bar ── */}
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl sm:rounded-[2rem] p-4 sm:p-5 backdrop-blur-xl flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                {/* Search */}
                <div className="relative flex-1 min-w-[220px]">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input
                        type="text"
                        placeholder="Search by name, email or student ID…"
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white outline-none focus:border-rose-500/30 transition-colors placeholder-slate-600"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap gap-2 sm:gap-3 items-center">
                    {/* Batch filter */}
                    <div className="relative">
                        <select value={activeBatch} onChange={e => setActiveBatch(e.target.value)}
                            className="appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pr-9 text-sm text-white outline-none focus:border-rose-500/30 transition-colors cursor-pointer min-w-[150px]">
                            <option value="" className="bg-slate-900">All Batches</option>
                            {batches.map(b => (
                                <option key={b} value={b} className="bg-slate-900">Batch {b}</option>
                            ))}
                        </select>
                        <GraduationCap size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    </div>
                    {/* Category filter */}
                    <div className="relative">
                        <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
                            className="appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pr-9 text-sm text-white outline-none focus:border-rose-500/30 transition-colors cursor-pointer min-w-[160px]">
                            <option value="" className="bg-slate-900">All Categories</option>
                            <option value="High" className="bg-slate-900">🔴 High Risk</option>
                            <option value="Medium" className="bg-slate-900">🟡 Medium Risk</option>
                        </select>
                        <Filter size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    </div>

                    {/* Sort buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Sort:</span>
                        {[
                            { field: 'score', label: 'Risk Score' },
                            { field: 'cgpa', label: 'CGPA' },
                            { field: 'attendance', label: 'Attendance' },
                        ].map(({ field, label }) => (
                            <button key={field} onClick={() => toggleSort(field)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${sortField === field
                                        ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                                        : 'bg-white/5 border-white/5 text-slate-500 hover:text-slate-300'
                                    }`}>
                                {label} <SortIcon field={field} />
                            </button>
                        ))}
                    </div>
                </div> {/* end flex-wrap group: Category + Sort */}
            </div>

            {/* ── Student Cards ── */}
            {isLoading ? (
                <div className="flex items-center justify-center py-24">
                    <Loader2 className="animate-spin text-rose-500" size={36} />
                </div>
            ) : (
                <div className="space-y-4">
                    {displayed.length > 0 ? displayed.map((s, i) => {
                        const cat = s.dropoutRisk?.category || 'Medium';
                        const borderHover = cat === 'High' ? 'hover:border-rose-500/30' : 'hover:border-amber-500/30';
                        const initials = (s.user?.name || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

                        return (
                            <div key={s._id}
                                className={`bg-slate-900/40 backdrop-blur-2xl border border-white/5 ${borderHover} rounded-[2rem] p-6 transition-all duration-200 group shadow-xl relative overflow-hidden`}>
                                <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-[60px] bg-white/[0.01] group-hover:bg-rose-500/3 transition-colors pointer-events-none" />

                                <div className="relative z-10 flex flex-col lg:flex-row gap-6 items-start lg:items-center">
                                    {/* ── Identity ── */}
                                    <div className="flex items-center gap-4 min-w-[220px]">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black shrink-0 border ${cat === 'High'
                                                ? 'bg-rose-500/10 border-rose-500/20 text-rose-300'
                                                : 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                                            }`}>{initials}</div>
                                        <div className="min-w-0">
                                            <p className="font-black text-white text-sm truncate">{s.user?.name || 'Unknown Student'}</p>
                                            <p className="text-[10px] text-slate-500 truncate font-semibold">{s.user?.email}</p>
                                            <p className="text-[10px] text-slate-600 font-mono mt-0.5">{s.studentId}</p>
                                        </div>
                                    </div>

                                    {/* ── Stats ── */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
                                        <div className="bg-black/20 rounded-2xl p-3 border border-white/5">
                                            <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-1">CGPA</p>
                                            <p className={`text-xl font-black italic ${s.effectiveCgpa < 5 ? 'text-rose-400' : s.effectiveCgpa < 7 ? 'text-amber-400' : 'text-slate-200'}`}>
                                                {s.effectiveCgpa.toFixed(2)}
                                            </p>
                                        </div>
                                        <div className="bg-black/20 rounded-2xl p-3 border border-white/5">
                                            <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-1">Attendance</p>
                                            <p className={`text-xl font-black italic ${s.attendance < 75 ? 'text-amber-400' : 'text-slate-200'}`}>
                                                {s.attendance}%
                                            </p>
                                        </div>
                                        <div className="bg-black/20 rounded-2xl p-3 border border-white/5">
                                            <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-1">Semesters</p>
                                            <p className="text-xl font-black italic text-slate-200">
                                                {s.academicHistory?.length || 0}
                                            </p>
                                        </div>
                                        <div className="bg-black/20 rounded-2xl p-3 border border-white/5">
                                            <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-1">AI Reason</p>
                                            <p className={`text-[10px] font-bold leading-snug ${cat === 'High' ? 'text-rose-400' : 'text-amber-400'}`}>
                                                {s.dropoutRisk?.reason || '—'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* ── Risk bar + category ── */}
                                    <div className="w-full lg:w-48 space-y-2 shrink-0">
                                        <CatBadge cat={cat} />
                                        <RiskBar score={s.dropoutRisk?.score ?? 0} cat={cat} />
                                    </div>

                                    {/* ── Actions ── */}
                                    <div className="flex flex-col gap-2 shrink-0 w-full lg:w-auto">
                                        <button
                                            onClick={() => setAlertStudent(s)}
                                            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl text-[9px] font-black uppercase tracking-widest border border-rose-500/20 hover:scale-105 active:scale-95 transition-all">
                                            <Mail size={14} /> Send Alert
                                        </button>
                                        <button
                                            onClick={() => setProfileStudent(s)}
                                            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-xl text-[9px] font-black uppercase tracking-widest border border-indigo-500/20 hover:scale-105 active:scale-95 transition-all">
                                            <User size={14} /> View Profile
                                        </button>
                                        <a href={`mailto:${s.user?.email}`}
                                            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/10 hover:scale-105 active:scale-95 transition-all">
                                            <ExternalLink size={14} /> Open Email
                                        </a>
                                    </div>
                                </div>
                            </div>
                        );
                    }) : (
                        <div className="py-24 text-center bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/5">
                            <Users size={40} className="text-slate-700 mx-auto mb-4" />
                            <p className="text-slate-500 font-black uppercase tracking-widest text-sm">No students match your filters</p>
                            <button onClick={() => { setSearchTerm(''); setCatFilter(''); }}
                                className="mt-4 text-[10px] text-indigo-400 hover:text-indigo-300 font-black uppercase tracking-widest underline underline-offset-2 transition-colors">
                                Clear filters
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AtRiskStudents;

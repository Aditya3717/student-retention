import React, { useState, useEffect, useMemo } from 'react';
import { motion, animate, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { cacheGet, cacheSet, cacheClear } from '../../utils/dataCache';
import {
    TrendingUp, TrendingDown, Users, BookOpen, Target, Zap,
    ChevronRight, Loader2, ArrowRight, ShieldCheck, AlertTriangle,
    AlertCircle, Briefcase, Star, CheckCircle2, Calendar, Award
} from 'lucide-react';
import {
    Chart as ChartJS, CategoryScale, LinearScale,
    PointElement, LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

/* ── Animated counter ── */
const Counter = ({ value, decimals = 0, suffix = '' }) => {
    const [display, setDisplay] = useState(0);
    useEffect(() => {
        const c = animate(0, value, {
            duration: 1.4, ease: [0.23, 1, 0.32, 1],
            onUpdate: v => setDisplay(v),
        });
        return () => c.stop();
    }, [value]);
    return <span>{display.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</span>;
};

/* ── Stat card ── */
const StatCard = React.memo(({ title, value, sub, icon: Icon, trendVal, trendLabel, trendPositive, delay = 0, onClick, accent = 'sky' }) => {
    const accentMap = {
        sky:     { icon: 'text-sky-400',     bg: 'bg-sky-400/10',     border: 'border-sky-400/20'     },
        emerald: { icon: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
        indigo:  { icon: 'text-indigo-400',  bg: 'bg-indigo-400/10',  border: 'border-indigo-400/20'  },
        amber:   { icon: 'text-amber-400',   bg: 'bg-amber-400/10',   border: 'border-amber-400/20'   },
    };
    const a = accentMap[accent] || accentMap.sky;
    const TrendIcon = trendPositive ? TrendingUp : TrendingDown;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.7 }}
            whileHover={{ y: -6, scale: 1.01 }}
            onClick={onClick}
            className={`relative group bg-slate-900/40 border border-white/5 p-7 rounded-[2.5rem] backdrop-blur-xl overflow-hidden shadow-2xl ${onClick ? 'cursor-pointer' : ''}`}
        >
            <div className="absolute top-0 right-0 w-28 h-28 bg-white/[0.02] rounded-full blur-3xl -mr-14 -mt-14 group-hover:bg-white/[0.05] transition-all" />
            <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-2xl ${a.bg} border ${a.border}`}>
                    <Icon size={20} className={a.icon} />
                </div>
                {trendVal !== undefined && (
                    <span className={`flex items-center gap-1 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full border ${
                        trendPositive
                            ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
                            : 'text-rose-400 bg-rose-400/10 border-rose-400/20'
                    }`}>
                        <TrendIcon size={11} />{trendVal}
                    </span>
                )}
            </div>
            <p className="text-3xl font-black text-white italic tracking-tighter">
                {typeof value === 'number'
                    ? <Counter value={value} decimals={value % 1 !== 0 ? 2 : 0} />
                    : value}
            </p>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">{title}</p>
            {sub && <p className="text-[9px] text-slate-700 mt-1">{sub}</p>}
            <div className="mt-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">Details</span>
                <ChevronRight size={12} className="text-slate-700" />
            </div>
        </motion.div>
    );
});

/* ── Dropout risk config ── */
const riskConfig = {
    Low:    { icon: ShieldCheck,   color: 'text-emerald-400', bg: 'from-emerald-600/20 to-slate-900', border: 'border-emerald-500/20', label: 'Low Risk', msg: "You're on a great track. Keep maintaining your attendance and grades." },
    Medium: { icon: AlertTriangle, color: 'text-amber-400',   bg: 'from-amber-600/20 to-slate-900',   border: 'border-amber-500/20',   label: 'Medium Risk', msg: 'Your profile shows some risk factors. Focus on attendance and coursework.' },
    High:   { icon: AlertCircle,   color: 'text-rose-400',    bg: 'from-rose-600/20 to-slate-900',    border: 'border-rose-500/20',    label: 'High Risk — See Advisor', msg: 'Immediate attention needed. Please schedule a meeting with your academic advisor.' },
};

const gradeColor = g => ({ O:'text-emerald-400', 'A+':'text-emerald-400', A:'text-sky-400', 'B+':'text-indigo-400', B:'text-indigo-400', C:'text-amber-400', D:'text-orange-400', F:'text-rose-500' }[g] || 'text-slate-400');
const gradeBg    = g => ({ O:'bg-emerald-500/10 border-emerald-500/20','A+':'bg-emerald-500/10 border-emerald-500/20',A:'bg-sky-500/10 border-sky-500/20','B+':'bg-indigo-500/10 border-indigo-500/20',B:'bg-indigo-500/10 border-indigo-500/20',C:'bg-amber-500/10 border-amber-500/20',D:'bg-orange-500/10 border-orange-500/20',F:'bg-rose-500/10 border-rose-500/20' }[g] || 'bg-slate-800/40 border-white/5');

/* ═══════════════════════════════════════ */
const StudentDashboard = () => {
    const [dash, setDash] = useState(null);
    const [batchStats, setBatchStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // ── Clear old combined batchStats cache on every mount ──
        cacheClear('batchStats');

        const cachedDash  = cacheGet('dashboard');
        const batchKey    = cachedDash?.batch ? `batchStats_${cachedDash.batch}` : 'batchStats_unknown';
        const cachedBatch = cacheGet(batchKey);

        // If both are cached, skip network entirely
        if (cachedDash && cachedBatch) {
            setDash(cachedDash);
            setBatchStats(cachedBatch);
            setIsLoading(false);
            return;
        }

        const fetchDash  = cachedDash ? Promise.resolve({ data: { success: true, data: cachedDash } }) : api.get('/students/dashboard');
        const fetchBatch = api.get('/students/batch-stats'); // Always fresh — batch-scoped by server

        Promise.all([fetchDash, fetchBatch])
            .then(([d, b]) => {
                const dash = d.data.data;
                if (d.data.success) {
                    setDash(dash);
                    cacheSet('dashboard', dash);
                    sessionStorage.setItem('dashboardData', JSON.stringify(dash));
                }
                if (b.data.success) {
                    const bStats = b.data.data;
                    setBatchStats(bStats);
                    const key = dash?.batch ? `batchStats_${dash.batch}` : 'batchStats_unknown';
                    cacheSet(key, bStats);
                }
            })
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);

    /* ── All derived data and memos must come BEFORE any early returns (Rules of Hooks) ── */

    const history      = dash?.academicHistory || [];
    const latestSem    = history[history.length - 1];
    const prevSem      = history[history.length - 2];
    const semLabels    = history.map(h => h.semester);
    const semGpas      = history.map(h => h.gpa);
    const totalCredits = history.reduce((a, s) => a + s.subjects.reduce((b, x) => b + (x.credits || 0), 0), 0);
    const cgpaDiff     = latestSem && prevSem ? +(latestSem.gpa - prevSem.gpa).toFixed(2) : null;
    const cgpaUp       = cgpaDiff !== null ? cgpaDiff >= 0 : true;
    const att          = dash?.attendance || 0;
    const attStatus    = att >= 85 ? 'Good' : att >= 75 ? 'Warning' : 'Critical';
    const risk         = dash?.dropoutRisk || { category: 'Low', score: 0 };
    const rc           = riskConfig[risk.category] || riskConfig.Low;
    const RiskIcon     = rc.icon;
    const recs         = dash?.recommendations || [];
    const batchCgpa    = batchStats?.batchCgpa ?? null;
    const vsGap        = batchCgpa !== null ? +(dash?.gpa - batchCgpa).toFixed(2) : null;

    const chartData = useMemo(() => ({
        labels: semLabels.length ? semLabels : ['N/A'],
        datasets: [{
            label: 'CGPA',
            data: semGpas.length ? semGpas : [0],
            borderColor: '#0ea5e9',
            backgroundColor: ctx => {
                const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 360);
                g.addColorStop(0, 'rgba(14,165,233,0.35)');
                g.addColorStop(1, 'rgba(14,165,233,0)');
                return g;
            },
            tension: 0.4, fill: true,
            pointBackgroundColor: '#0ea5e9', pointBorderColor: '#fff',
            pointBorderWidth: 2, pointRadius: 6, pointHoverRadius: 9,
        }],
    }), [semLabels, semGpas]);

    const chartOptions = useMemo(() => ({
        responsive: true, maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: { backgroundColor: '#0f172a', titleColor: '#94a3b8', bodyColor: '#f1f5f9', padding: 14, borderRadius: 12, displayColors: false, borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 },
        },
        scales: {
            y: { grid: { color: 'rgba(255,255,255,0.02)' }, ticks: { color: '#64748b', font: { size: 10, weight: 'bold' } }, min: 0, max: 10 },
            x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 10, weight: 'bold' } } },
        },
    }), []);

    // ── NOW it is safe to do early returns after all hooks are called ──
    if (isLoading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="animate-spin text-primary-500" size={40} />
        </div>
    );


    return (
        <div className="space-y-8 pb-16">
            {/* ── Header ── */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tighter italic uppercase">My Dashboard</h2>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-1">
                        Live Academic Overview · {dash?.studentId}
                        {dash?.batch && (
                            <span className="ml-2 inline-flex items-center gap-1 text-indigo-400">
                                · Batch {dash.batch}
                            </span>
                        )}
                    </p>
                </div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest bg-slate-800/50 border border-white/5 px-4 py-2 rounded-full self-start sm:self-auto">
                    {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
            </motion.div>

            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard
                    title="Current CGPA" value={dash?.gpa || 0} accent="sky"
                    icon={TrendingUp}
                    trendVal={cgpaDiff !== null ? (cgpaUp ? `+${cgpaDiff}` : `${cgpaDiff}`) : undefined}
                    trendPositive={cgpaUp}
                    sub={prevSem ? `Prev sem: ${prevSem.gpa?.toFixed(2)}` : undefined}
                    delay={0.05} onClick={() => navigate('/student/analytics')}
                />
                <StatCard
                    title="Attendance" value={`${att}%`} accent={att >= 85 ? 'emerald' : att >= 75 ? 'amber' : 'sky'}
                    icon={Users}
                    trendVal={attStatus} trendPositive={att >= 85}
                    sub={att < 75 ? '⚠ Below 75% threshold' : att < 85 ? 'Borderline — improve' : 'Good standing'}
                    delay={0.1} onClick={() => navigate('/student/academics')}
                />
                <StatCard
                    title="Credits Earned" value={totalCredits} accent="indigo"
                    icon={BookOpen}
                    sub={`Across ${history.length} semester${history.length !== 1 ? 's' : ''}`}
                    delay={0.15} onClick={() => navigate('/student/academics')}
                />
                <StatCard
                    title="College Rank" value={`#${dash?.rank || '—'}`} accent="amber"
                    icon={Award}
                    trendVal={vsGap !== null ? (vsGap >= 0 ? `+${vsGap} vs batch` : `${vsGap} vs batch`) : undefined}
                    trendPositive={vsGap !== null ? vsGap >= 0 : true}
                    sub={dash?.batch ? `Batch ${dash.batch} · Avg CGPA: ${batchCgpa ?? '—'}` : batchCgpa ? `Batch avg CGPA: ${batchCgpa}` : undefined}
                    delay={0.2} onClick={() => navigate('/student/analytics')}
                />
            </div>

            {/* ── Chart + Risk ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* CGPA Chart */}
                <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.8 }}
                    className="lg:col-span-2 bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-2xl">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h3 className="text-xl font-black text-white italic uppercase tracking-tight">Academic Trajectory</h3>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-0.5">CGPA per semester</p>
                        </div>
                        {latestSem && (
                            <span className="px-3 py-1 bg-white/5 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest border border-white/5">
                                Latest: {latestSem.semester}
                            </span>
                        )}
                    </div>
                    <div className="h-72"><Line data={chartData} options={chartOptions} /></div>
                </motion.div>

                {/* Dropout Risk */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.8 }}
                    className={`bg-gradient-to-br ${rc.bg} border ${rc.border} p-8 rounded-[2.5rem] relative overflow-hidden flex flex-col justify-between`}>
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-24 -mt-24 blur-[60px]" />
                    <div className="relative z-10">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border ${rc.border} bg-white/5`}>
                            <RiskIcon size={24} className={rc.color} />
                        </div>
                        <h3 className="text-2xl font-black text-white italic uppercase tracking-tight mb-2">Retention<br />Risk</h3>
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${rc.border} ${rc.color} bg-white/5 mb-4`}>
                            <RiskIcon size={12} /> {rc.label}
                        </span>
                        {risk.score > 0 && (
                            <div className="mb-4">
                                <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-600 mb-1">
                                    <span>Risk Score</span><span className={rc.color}>{risk.score}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${risk.score}%` }} transition={{ duration: 1, delay: 0.6 }}
                                        className={`h-full rounded-full ${risk.category === 'High' ? 'bg-rose-500' : risk.category === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                                </div>
                            </div>
                        )}
                        <p className="text-slate-400 text-xs leading-relaxed">{rc.msg}</p>
                    </div>
                    <button onClick={() => navigate('/student/analytics')}
                        className="relative z-10 mt-6 w-full bg-white/10 hover:bg-white/20 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest py-4 rounded-2xl transition-all flex items-center justify-center gap-2">
                        View Analytics <ArrowRight size={14} />
                    </button>
                </motion.div>
            </div>

            {/* ── Career Recs + Latest Sem ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Career Recommendations from DB */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                    className="bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-black text-white italic uppercase tracking-tight">Career Matches</h3>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-0.5">Based on your academic profile</p>
                        </div>
                        <button onClick={() => navigate('/student/careers')}
                            className="text-[9px] font-black uppercase tracking-widest text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors">
                            Explore <ChevronRight size={12} />
                        </button>
                    </div>
                    {recs.length === 0 ? (
                        <div className="py-8 text-center">
                            <Briefcase size={32} className="text-slate-700 mx-auto mb-3" />
                            <p className="text-slate-700 text-xs font-bold uppercase tracking-widest">No recommendations yet</p>
                            <button onClick={() => navigate('/student/careers')} className="mt-3 text-sky-400 text-xs font-black uppercase tracking-widest hover:text-sky-300 transition-colors">
                                Set up Career Path →
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recs.slice(0, 4).map((r, i) => (
                                <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.55 + i * 0.07 }}
                                    className="flex items-center gap-4 bg-white/[0.02] border border-white/5 hover:border-sky-500/20 hover:bg-sky-500/5 rounded-2xl px-4 py-3.5 transition-all group cursor-pointer"
                                    onClick={() => navigate('/student/careers')}>
                                    <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0">
                                        <Briefcase size={14} className="text-sky-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest truncate">{r.title}</p>
                                        <div className="mt-1.5 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                            <motion.div initial={{ width: 0 }} animate={{ width: `${r.matchPercentage}%` }} transition={{ duration: 1, delay: 0.6 + i * 0.1 }}
                                                className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full" />
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-black text-sky-400 shrink-0">{r.matchPercentage}%</span>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Latest Semester Snapshot */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
                    className="bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-black text-white italic uppercase tracking-tight">
                                {latestSem?.semester || 'Latest Semester'}
                            </h3>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-0.5">Subject snapshot</p>
                        </div>
                        {latestSem && (
                            <span className="text-[10px] font-black text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
                                CGPA {latestSem.gpa?.toFixed(2)}
                            </span>
                        )}
                    </div>
                    {!latestSem || latestSem.subjects.length === 0 ? (
                        <div className="py-8 text-center">
                            <Calendar size={32} className="text-slate-700 mx-auto mb-3" />
                            <p className="text-slate-700 text-xs font-bold uppercase tracking-widest">No subjects found</p>
                        </div>
                    ) : (
                        <div className="space-y-2.5">
                            {latestSem.subjects.slice(0, 5).map((s, i) => (
                                <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.06 }}
                                    className="flex items-center gap-3 bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3">
                                    <CheckCircle2 size={13} className="text-emerald-400/60 shrink-0" />
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex-1 truncate">{s.name}</p>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <div className="w-14 h-1 bg-white/5 rounded-full overflow-hidden">
                                            <div style={{ width: `${s.attendance || 0}%` }}
                                                className={`h-full rounded-full ${(s.attendance||0)<75?'bg-rose-500':(s.attendance||0)<85?'bg-amber-400':'bg-sky-400'}`} />
                                        </div>
                                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md border ${gradeBg(s.grade)} ${gradeColor(s.grade)}`}>
                                            {s.grade || '—'}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                            {latestSem.subjects.length > 5 && (
                                <button onClick={() => navigate('/student/academics')}
                                    className="w-full text-center text-[9px] font-black uppercase tracking-widest text-slate-600 hover:text-slate-400 py-2 transition-colors">
                                    +{latestSem.subjects.length - 5} more subjects →
                                </button>
                            )}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default StudentDashboard;

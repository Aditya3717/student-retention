import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';
import { cacheGet, cacheSet } from '../../utils/dataCache';
import {
    Loader2, BookOpen, TrendingUp, TrendingDown, AlertTriangle,
    CheckCircle2, Star, ChevronDown, BarChart2, Activity, Target, Flame
} from 'lucide-react';
import {
    Chart as ChartJS, CategoryScale, LinearScale,
    PointElement, LineElement, BarElement, RadialLinearScale,
    Title, Tooltip, Legend, Filler, ArcElement,
} from 'chart.js';
import { Bar, Line, Radar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale, LinearScale, PointElement, LineElement,
    BarElement, RadialLinearScale, ArcElement,
    Title, Tooltip, Legend, Filler
);

const gradeColor = (g) => {
    if (!g) return 'text-slate-600';
    const map = { 'O': 'text-emerald-400', 'A+': 'text-emerald-400', 'A': 'text-sky-400', 'B+': 'text-indigo-400', 'B': 'text-indigo-400', 'C': 'text-amber-400', 'D': 'text-orange-400', 'F': 'text-rose-500' };
    return map[g] || 'text-slate-400';
};
const gradeBg = (g) => {
    if (!g) return 'bg-slate-800/40';
    const map = { 'O': 'bg-emerald-500/10 border-emerald-500/20', 'A+': 'bg-emerald-500/10 border-emerald-500/20', 'A': 'bg-sky-500/10 border-sky-500/20', 'B+': 'bg-indigo-500/10 border-indigo-500/20', 'B': 'bg-indigo-500/10 border-indigo-500/20', 'C': 'bg-amber-500/10 border-amber-500/20', 'D': 'bg-orange-500/10 border-orange-500/20', 'F': 'bg-rose-500/10 border-rose-500/20' };
    return map[g] || 'bg-slate-800/40 border-white/5';
};
const gradeToGpa = (g) => ({ 'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C': 5, 'D': 4, 'F': 0 }[g] || 0);

const Analytics = () => {
    const [data, setData] = useState(null);
    const [batchStats, setBatchStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeSem, setActiveSem] = useState(0);
    const [semDropOpen, setSemDropOpen] = useState(false);

    useEffect(() => {
        const cachedDash  = cacheGet('dashboard');
        const cachedBatch = cacheGet('batchStats');

        if (cachedDash && cachedBatch) {
            setData(cachedDash);
            setBatchStats(cachedBatch);
            setIsLoading(false);
            return;
        }

        const fetchDash  = cachedDash  ? Promise.resolve({ data: { success: true, data: cachedDash  } }) : api.get('/students/dashboard');
        const fetchBatch = cachedBatch ? Promise.resolve({ data: { success: true, data: cachedBatch } }) : api.get('/students/batch-stats');

        Promise.all([fetchDash, fetchBatch])
            .then(([dashRes, batchRes]) => {
                if (dashRes.data.success) { setData(dashRes.data.data); cacheSet('dashboard', dashRes.data.data); }
                if (batchRes.data.success) { setBatchStats(batchRes.data.data); cacheSet('batchStats', batchRes.data.data); }
            }).catch(console.error)
              .finally(() => setIsLoading(false));
    }, []);

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="animate-spin text-primary-500" size={40} />
        </div>
    );

    const history = data?.academicHistory || [];
    const currentSem = history[activeSem];
    const subjects = currentSem?.subjects || [];

    // GPA trend across semesters
    const semLabels = history.map(h => h.semester);
    const semGpas = history.map(h => h.gpa);

    // Grade distribution in selected semester
    const gradeBuckets = ['O', 'A+', 'A', 'B+', 'B', 'C', 'D', 'F'];
    const gradeCount = gradeBuckets.map(g => subjects.filter(s => s.grade === g).length);

    // Attendance per subject
    const subjectNames = subjects.map(s => s.name?.length > 12 ? s.name.slice(0, 12) + '…' : s.name);
    const subjectAttendance = subjects.map(s => s.attendance || 0);

    // Semester-over-semester GPA delta
    const deltas = semGpas.map((g, i) => i === 0 ? 0 : +(g - semGpas[i - 1]).toFixed(2));

    // Best / worst subjects in selected sem
    const sorted = [...subjects].sort((a, b) => gradeToGpa(b.grade) - gradeToGpa(a.grade));
    const topSubjects = sorted.slice(0, 3);
    const weakSubjects = sorted.slice(-3).reverse();

    // Performance score (composite)
    const gpa = data?.gpa || 0;
    const att = data?.attendance || 0;
    const perfScore = Math.round((gpa / 10) * 50 + (att / 100) * 50);

    // Radar per selected semester
    const radarLabels = subjects.slice(0, 6).map(s => s.name?.slice(0, 8) || '');
    const radarData = {
        labels: radarLabels,
        datasets: [{
            label: 'Grade Points',
            data: subjects.slice(0, 6).map(s => gradeToGpa(s.grade)),
            backgroundColor: 'rgba(14,165,233,0.15)',
            borderColor: '#0ea5e9',
            borderWidth: 2,
            pointBackgroundColor: '#0ea5e9',
            pointRadius: 4,
        }],
    };

    // Batch semester averages aligned to student's semesters
    const batchSemAvgs = semLabels.map(sem => {
        const match = batchStats?.semesterAverages?.find(s => s.semester === sem);
        return match ? match.avg : null;
    });

    const lineData = {
        labels: semLabels.length ? semLabels : ['—'],
        datasets: [{
            label: 'Your CGPA',
            data: semGpas.length ? semGpas : [0],
            borderColor: '#0ea5e9',
            backgroundColor: ctx => {
                const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 260);
                g.addColorStop(0, 'rgba(14,165,233,0.25)');
                g.addColorStop(1, 'rgba(14,165,233,0)');
                return g;
            },
            tension: 0.4, fill: true,
            pointBackgroundColor: '#0ea5e9', pointBorderColor: '#fff',
            pointBorderWidth: 2, pointRadius: 6, pointHoverRadius: 9,
        }, {
            label: 'Batch Avg',
            data: batchSemAvgs,
            borderColor: '#f59e0b',
            borderDash: [6, 4],
            borderWidth: 2,
            pointBackgroundColor: '#f59e0b',
            pointRadius: 4,
            tension: 0.4,
            fill: false,
        }],
    };

    const barAttData = {
        labels: subjectNames.length ? subjectNames : ['—'],
        datasets: [{
            label: 'Attendance %',
            data: subjectAttendance.length ? subjectAttendance : [0],
            backgroundColor: subjectAttendance.map(a => a < 75 ? 'rgba(244,63,94,0.6)' : a < 85 ? 'rgba(245,158,11,0.6)' : 'rgba(14,165,233,0.6)'),
            borderColor: subjectAttendance.map(a => a < 75 ? '#f43f5e' : a < 85 ? '#f59e0b' : '#0ea5e9'),
            borderWidth: 2, borderRadius: 8,
        }],
    };

    const gradeDistData = {
        labels: gradeBuckets,
        datasets: [{
            label: 'Subjects',
            data: gradeCount,
            backgroundColor: ['rgba(52,211,153,0.6)', 'rgba(52,211,153,0.4)', 'rgba(14,165,233,0.6)', 'rgba(99,102,241,0.6)', 'rgba(99,102,241,0.4)', 'rgba(245,158,11,0.6)', 'rgba(249,115,22,0.5)', 'rgba(244,63,94,0.6)'],
            borderColor: ['#34d399', '#34d399', '#0ea5e9', '#6366f1', '#6366f1', '#f59e0b', '#f97316', '#f43f5e'],
            borderWidth: 2, borderRadius: 8,
        }],
    };

    const baseChartOpts = (yMax, isInt = false) => ({
        responsive: true, maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: { backgroundColor: '#0f172a', titleColor: '#94a3b8', bodyColor: '#f1f5f9', padding: 12, borderRadius: 10, displayColors: false, borderColor: 'rgba(255,255,255,0.08)', borderWidth: 1 },
        },
        scales: {
            y: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#64748b', stepSize: isInt ? 1 : undefined }, min: 0, max: yMax },
            x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 10 } } },
        },
    });

    const radarOpts = {
        scales: { r: { angleLines: { color: 'rgba(255,255,255,0.05)' }, grid: { color: 'rgba(255,255,255,0.05)' }, pointLabels: { color: '#64748b', font: { size: 9, weight: 'bold' } }, ticks: { display: false }, suggestedMin: 0, suggestedMax: 10 } },
        plugins: { legend: { display: false } },
    };

    if (history.length === 0) return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
            <BarChart2 size={48} className="text-slate-700" />
            <p className="text-slate-500 font-black uppercase tracking-widest text-sm">No academic records found</p>
            <p className="text-slate-700 text-xs">Ask your admin to populate your records.</p>
        </div>
    );

    return (
        <div className="space-y-8 pb-16">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tighter italic uppercase">Deep Analytics</h2>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-1">Subject · Grade · Attendance Intelligence</p>
                </div>
                {/* Semester picker */}
                <div className="relative">
                    <button
                        onClick={() => setSemDropOpen(v => !v)}
                        className="flex items-center gap-2 bg-slate-900/60 border border-white/10 hover:border-sky-500/40 px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-300 transition-all"
                    >
                        {currentSem?.semester || 'Select Semester'}
                        <ChevronDown size={14} className={`transition-transform ${semDropOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                        {semDropOpen && (
                            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                                className="absolute right-0 mt-2 w-48 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
                                {history.map((h, i) => (
                                    <button key={i} onClick={() => { setActiveSem(i); setSemDropOpen(false); }}
                                        className={`w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-colors border-b border-white/5 last:border-0 ${i === activeSem ? 'bg-sky-500/10 text-sky-400' : 'text-slate-400 hover:bg-white/5'}`}>
                                        {h.semester}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Performance Score + Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Performance Score', value: `${perfScore}/100`, icon: Flame, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
                    { label: 'Sem GPA', value: currentSem?.gpa?.toFixed(2) || '—', icon: TrendingUp, color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/20' },
                    { label: 'Subjects This Sem', value: subjects.length, icon: BookOpen, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
                    { label: 'GPA Δ vs Prev', value: activeSem === 0 ? '—' : (deltas[activeSem] >= 0 ? `+${deltas[activeSem]}` : `${deltas[activeSem]}`), icon: deltas[activeSem] >= 0 ? TrendingUp : TrendingDown, color: deltas[activeSem] >= 0 ? 'text-emerald-400' : 'text-rose-400', bg: deltas[activeSem] >= 0 ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20' },
                ].map((c, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                        className={`border rounded-3xl p-5 backdrop-blur-xl ${c.bg}`}>
                        <c.icon size={18} className={`mb-2 ${c.color}`} />
                        <p className="text-xl font-black text-white italic tracking-tighter">{c.value}</p>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mt-1">{c.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Batch Comparison Banner */}
            {batchStats && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Your CGPA', value: data?.gpa?.toFixed(2) || '—', icon: TrendingUp, color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/20' },
                        { label: 'Batch CGPA Avg', value: batchStats.batchCgpa?.toFixed(2) ?? '—', icon: Target, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
                        {
                            label: 'You vs Batch',
                            value: (() => { const diff = +(data?.gpa - batchStats.batchCgpa).toFixed(2); return diff >= 0 ? `+${diff}` : `${diff}`; })(),
                            icon: (data?.gpa ?? 0) >= (batchStats.batchCgpa ?? 0) ? TrendingUp : TrendingDown,
                            color: (data?.gpa ?? 0) >= (batchStats.batchCgpa ?? 0) ? 'text-emerald-400' : 'text-rose-400',
                            bg: (data?.gpa ?? 0) >= (batchStats.batchCgpa ?? 0) ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20',
                        },
                        { label: 'Batch Size', value: batchStats.total, icon: Flame, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
                    ].map((c, i) => (
                        <div key={i} className={`border rounded-3xl p-5 backdrop-blur-xl ${c.bg}`}>
                            <c.icon size={18} className={`mb-2 ${c.color}`} />
                            <p className="text-xl font-black text-white italic tracking-tighter">{c.value}</p>
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mt-1">{c.label}</p>
                        </div>
                    ))}
                </motion.div>
            )}

            {/* Row 1: GPA Trend + Radar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                    className="lg:col-span-2 bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-xl">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-black text-white italic uppercase tracking-tight">CGPA Trajectory</h3>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-0.5">You vs batch average — per semester</p>
                        </div>
                        <div className="flex gap-4 text-[9px] font-black uppercase tracking-widest">
                            <span className="flex items-center gap-1.5 text-sky-400"><span className="w-4 h-0.5 bg-sky-400 inline-block rounded" /> Your CGPA</span>
                            <span className="flex items-center gap-1.5 text-amber-400"><span className="w-4 border-t-2 border-dashed border-amber-400 inline-block" /> Batch Avg</span>
                        </div>
                    </div>
                    <div className="h-56"><Line data={lineData} options={baseChartOpts(10)} /></div>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                    className="bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-xl">
                    <h3 className="text-lg font-black text-white italic uppercase tracking-tight mb-1">Subject Radar</h3>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">{currentSem?.semester} — grade points</p>
                    {subjects.length > 0
                        ? <div className="h-52"><Radar data={radarData} options={radarOpts} /></div>
                        : <p className="text-slate-600 text-xs text-center mt-8">No subjects in this semester</p>
                    }
                </motion.div>
            </div>

            {/* CGPA Distribution */}
            {batchStats?.cgpaDistribution && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
                    className="bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-xl">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-black text-white italic uppercase tracking-tight">Batch CGPA Distribution</h3>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-0.5">
                                {batchStats.total} students · Batch avg {batchStats.batchCgpa} · You are at {data?.gpa?.toFixed(2)}
                            </p>
                        </div>
                        <div className="flex gap-3 text-[9px] font-black uppercase tracking-widest">
                            <span className="flex items-center gap-1.5 text-indigo-400"><span className="w-2 h-2 rounded-sm bg-indigo-400 inline-block" /> Batch Count</span>
                            <span className="flex items-center gap-1.5 text-amber-400"><span className="w-2 h-2 rounded-sm bg-amber-400 inline-block" /> Your Range</span>
                        </div>
                    </div>
                    <div className="h-52">
                        <Bar
                            data={{
                                labels: batchStats.cgpaDistribution.map(b => b.label),
                                datasets: [{
                                    label: 'Students',
                                    data: batchStats.cgpaDistribution.map(b => b.count),
                                    backgroundColor: batchStats.cgpaDistribution.map(b => {
                                        const gpa = data?.gpa || 0;
                                        const inRange = (
                                            (b.label === '<5'  && gpa < 5) ||
                                            (b.label === '5-6' && gpa >= 5 && gpa < 6) ||
                                            (b.label === '6-7' && gpa >= 6 && gpa < 7) ||
                                            (b.label === '7-8' && gpa >= 7 && gpa < 8) ||
                                            (b.label === '8-9' && gpa >= 8 && gpa < 9) ||
                                            (b.label === '9+'  && gpa >= 9)
                                        );
                                        return inRange ? 'rgba(245,158,11,0.8)' : 'rgba(99,102,241,0.5)';
                                    }),
                                    borderColor: batchStats.cgpaDistribution.map(b => {
                                        const gpa = data?.gpa || 0;
                                        const inRange = (
                                            (b.label === '<5'  && gpa < 5) ||
                                            (b.label === '5-6' && gpa >= 5 && gpa < 6) ||
                                            (b.label === '6-7' && gpa >= 6 && gpa < 7) ||
                                            (b.label === '7-8' && gpa >= 7 && gpa < 8) ||
                                            (b.label === '8-9' && gpa >= 8 && gpa < 9) ||
                                            (b.label === '9+'  && gpa >= 9)
                                        );
                                        return inRange ? '#f59e0b' : '#6366f1';
                                    }),
                                    borderWidth: 2,
                                    borderRadius: 8,
                                }],
                            }}
                            options={baseChartOpts(Math.max(...batchStats.cgpaDistribution.map(b => b.count), 1) + 2, true)}
                        />
                    </div>
                    <p className="text-[9px] text-slate-600 mt-3 text-center">
                        <span className="text-amber-400 font-black">■</span> Highlighted bar = your CGPA range
                    </p>
                </motion.div>
            )}

            {/* Row 2: Subject Attendance Bar + Grade Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                    className="bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-xl">
                    <h3 className="text-lg font-black text-white italic uppercase tracking-tight mb-1">Attendance by Subject</h3>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">{currentSem?.semester} — red = below 75%</p>
                    <div className="flex gap-3 text-[9px] font-black uppercase tracking-widest mb-6">
                        <span className="flex items-center gap-1.5 text-sky-400"><span className="w-2 h-2 rounded-sm bg-sky-400 inline-block" /> ≥85%</span>
                        <span className="flex items-center gap-1.5 text-amber-400"><span className="w-2 h-2 rounded-sm bg-amber-400 inline-block" /> 75–84%</span>
                        <span className="flex items-center gap-1.5 text-rose-400"><span className="w-2 h-2 rounded-sm bg-rose-400 inline-block" /> &lt;75%</span>
                    </div>
                    <div className="h-52">{subjects.length > 0
                        ? <Bar data={barAttData} options={baseChartOpts(100)} />
                        : <p className="text-slate-600 text-xs text-center mt-16">No data</p>}
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    className="bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-xl">
                    <h3 className="text-lg font-black text-white italic uppercase tracking-tight mb-1">Grade Distribution</h3>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-6">{currentSem?.semester} — subjects per grade band</p>
                    <div className="h-52">{subjects.length > 0
                        ? <Bar data={gradeDistData} options={baseChartOpts(Math.max(...gradeCount, 1) + 1, true)} />
                        : <p className="text-slate-600 text-xs text-center mt-16">No data</p>}
                    </div>
                </motion.div>
            </div>

            {/* Row 3: Subject Grade Table */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
                className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] backdrop-blur-xl overflow-hidden">
                <div className="px-8 pt-8 pb-4">
                    <h3 className="text-lg font-black text-white italic uppercase tracking-tight mb-1">Subject Breakdown</h3>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{currentSem?.semester} — full subject detail</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-t border-white/5">
                                {['Subject', 'Code', 'Credits', 'Grade', 'Attendance', 'Instructor', 'Status'].map(h => (
                                    <th key={h} className="px-6 py-3 text-[9px] font-black uppercase tracking-widest text-slate-600">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {subjects.length === 0 ? (
                                <tr><td colSpan={7} className="px-6 py-10 text-center text-slate-700 text-xs font-bold">No subjects for this semester</td></tr>
                            ) : subjects.map((s, i) => (
                                <tr key={i} className="border-t border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4 text-xs font-bold text-slate-300">{s.name}</td>
                                    <td className="px-6 py-4 text-[10px] text-slate-600 font-mono">{s.code || '—'}</td>
                                    <td className="px-6 py-4 text-[10px] text-slate-400 font-black">{s.credits || '—'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[10px] font-black px-2 py-1 rounded-lg border ${gradeBg(s.grade)} ${gradeColor(s.grade)}`}>
                                            {s.grade || '—'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                <div style={{ width: `${s.attendance || 0}%` }} className={`h-full rounded-full ${(s.attendance || 0) < 75 ? 'bg-rose-500' : (s.attendance || 0) < 85 ? 'bg-amber-400' : 'bg-sky-400'}`} />
                                            </div>
                                            <span className={`text-[10px] font-black ${(s.attendance || 0) < 75 ? 'text-rose-400' : 'text-slate-400'}`}>{s.attendance || 0}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-[10px] text-slate-600">{s.instructor || '—'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${s.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                                            {s.status || 'Active'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Row 4: Top vs Weak Subjects */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                    { title: '🏆 Strongest Subjects', subjects: topSubjects, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/5 border-emerald-500/10' },
                    { title: '⚠️ Needs Attention', subjects: weakSubjects, icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/5 border-amber-500/10' },
                ].map(({ title, subjects: list, icon: Icon, color, bg }) => (
                    <motion.div key={title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                        className={`border rounded-[2rem] p-7 backdrop-blur-xl ${bg}`}>
                        <h3 className="text-sm font-black text-white italic uppercase tracking-tight mb-5">{title}</h3>
                        <div className="space-y-3">
                            {list.length === 0
                                ? <p className="text-slate-700 text-xs">No data for this semester</p>
                                : list.map((s, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <Icon size={14} className={`${color} shrink-0`} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest truncate">{s.name}</p>
                                            <div className="mt-1 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                                <div style={{ width: `${gradeToGpa(s.grade) * 10}%` }} className={`h-full rounded-full ${color.replace('text-', 'bg-')}`} />
                                            </div>
                                        </div>
                                        <span className={`text-[10px] font-black shrink-0 ${color}`}>{s.grade || '—'}</span>
                                    </div>
                                ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Analytics;

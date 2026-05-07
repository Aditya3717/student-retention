import React, { useState, useEffect } from 'react';
import { motion, animate } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import {
    Users, AlertCircle, TrendingUp, UserCheck, Download, RefreshCw,
    Loader2, CheckCircle, AlertTriangle, ShieldCheck, BarChart3,
    ArrowRight, Activity, GraduationCap, ChevronDown
} from 'lucide-react';
import {
    Chart as ChartJS, ArcElement, Tooltip, Legend,
    CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler);

/* ── Animated Counter ── */
const Counter = ({ value, suffix = '', decimals = 0 }) => {
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

/* ── Stat Card ── */
const StatCard = ({ title, value, suffix = '', icon: Icon, accent = 'sky', sub, delay = 0, onClick, decimals = 0 }) => {
    const map = {
        sky:     { icon: 'text-sky-400',     border: 'border-sky-500/20',     bg: 'bg-sky-500/10',     glow: 'group-hover:shadow-sky-500/10'     },
        rose:    { icon: 'text-rose-400',    border: 'border-rose-500/20',    bg: 'bg-rose-500/10',    glow: 'group-hover:shadow-rose-500/10'    },
        amber:   { icon: 'text-amber-400',   border: 'border-amber-500/20',   bg: 'bg-amber-500/10',   glow: 'group-hover:shadow-amber-500/10'   },
        emerald: { icon: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-500/10', glow: 'group-hover:shadow-emerald-500/10' },
        indigo:  { icon: 'text-indigo-400',  border: 'border-indigo-500/20',  bg: 'bg-indigo-500/10',  glow: 'group-hover:shadow-indigo-500/10'  },
    };
    const a = map[accent] || map.sky;
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
            whileHover={{ y: -4, scale: 1.01 }} onClick={onClick}
            className={`group relative bg-slate-900/40 border border-white/5 rounded-[2rem] p-7 backdrop-blur-xl overflow-hidden shadow-2xl transition-all ${a.glow} ${onClick ? 'cursor-pointer' : ''}`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.01] rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-white/[0.03] transition-all" />
            <div className="flex justify-between items-start mb-6 relative z-10">
                <div className={`p-3 rounded-2xl border ${a.bg} ${a.border}`}>
                    <Icon size={20} className={a.icon} />
                </div>
            </div>
            <p className={`text-3xl font-black italic tracking-tighter text-white relative z-10`}>
                <Counter value={typeof value === 'number' ? value : 0} suffix={suffix} decimals={decimals} />
            </p>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1 relative z-10">{title}</p>
            {sub && <p className="text-[10px] text-slate-600 font-semibold mt-1 relative z-10">{sub}</p>}
        </motion.div>
    );
};

/* ── Risk Badge ── */
const RiskBadge = ({ cat }) => {
    const cfg = {
        High:   { cls: 'text-rose-400 bg-rose-500/10 border-rose-500/20',   icon: AlertCircle },
        Medium: { cls: 'text-amber-400 bg-amber-500/10 border-amber-500/20', icon: AlertTriangle },
        Low:    { cls: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', icon: ShieldCheck },
    };
    const c = cfg[cat] || cfg.Low;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${c.cls}`}>
            <c.icon size={11} />{cat}
        </span>
    );
};

/* ════════════════════════════ MAIN ════════════════════════════ */
const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats]             = useState(null);
    const [atRisk, setAtRisk]           = useState([]);
    const [isLoading, setIsLoading]     = useState(true);
    const [isRecalculating, setIsRecalculating] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [batches, setBatches]         = useState([]);       // available batch years
    const [activeBatch, setActiveBatch] = useState('');       // '' = All Batches

    // Load batch list once
    useEffect(() => {
        api.get('/admin/batches')
            .then(r => { if (r.data.success) setBatches(r.data.data); })
            .catch(() => {});
    }, []);

    const fetchData = async (batch = activeBatch) => {
        try {
            const params = batch ? `?batch=${batch}` : '';
            const [statsRes, riskRes] = await Promise.all([
                api.get(`/admin/dashboard-stats${params}`),
                api.get(`/admin/at-risk${params}`),
            ]);
            if (statsRes.data.success) setStats(statsRes.data.data);
            if (riskRes.data.success)  setAtRisk(riskRes.data.data.slice(0, 5));
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchData(activeBatch); }, [activeBatch]);

    const handleBatchChange = (b) => {
        setActiveBatch(b);
        setIsLoading(true);
    };

    const handleRecalculate = async () => {
        setIsRecalculating(true);
        try {
            await api.post('/admin/recalculate-risk');
            await fetchData(activeBatch);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (e) {
            alert(e.response?.data?.message || 'Recalculation failed.');
        } finally {
            setIsRecalculating(false);
        }
    };

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const res = await api.get('/admin/students?limit=all');
            if (res.data.success) {
                const rows = [['Name', 'Email', 'Student ID', 'CGPA', 'Attendance (%)', 'Risk Category', 'Risk Score', 'Reason'].join(',')];
                res.data.data.forEach(s => rows.push([
                    `"${s.user?.name || ''}"`, `"${s.user?.email || ''}"`, `"${s.studentId || ''}"`,
                    s.gpa || 0, s.attendance || 0,
                    `"${s.dropoutRisk?.category || 'Low'}"`, s.dropoutRisk?.score || 0, `"${s.dropoutRisk?.reason || ''}"`
                ].join(',')));
                const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = `eduguard_export_${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
            }
        } catch (e) { alert('Export failed.'); }
        finally { setIsExporting(false); }
    };

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="animate-spin text-sky-500" size={36} />
        </div>
    );

    const doughnutData = {
        labels: ['High Risk', 'Medium Risk', 'Low Risk'],
        datasets: [{ data: stats?.distribution || [0, 0, 100], backgroundColor: ['#ef4444', '#f59e0b', '#10b981'], borderWidth: 0, cutout: '78%' }]
    };

    const barData = {
        labels: stats?.gpaLabels || ['<5', '5-6', '6-7', '7-8', '8-9', '9-10'],
        datasets: [{
            label: 'Students',
            data: stats?.gpaDistribution || [0, 0, 0, 0, 0, 0],
            backgroundColor: (ctx) => {
                const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300);
                g.addColorStop(0, 'rgba(14,165,233,0.8)');
                g.addColorStop(1, 'rgba(99,102,241,0.3)');
                return g;
            },
            borderRadius: 10, borderSkipped: false,
        }]
    };

    const barOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { backgroundColor: '#0f172a', titleColor: '#94a3b8', bodyColor: '#f1f5f9', padding: 12, borderRadius: 10, borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 } },
        scales: {
            y: { grid: { color: 'rgba(255,255,255,0.02)' }, ticks: { color: '#64748b', font: { weight: 'bold', size: 10 } } },
            x: { grid: { display: false }, ticks: { color: '#64748b', font: { weight: 'bold', size: 10 } } },
        },
    };

    const lowRiskCount = (stats?.totalStudents || 0) - (stats?.atRisk || 0) - (stats?.mediumRisk || 0);

    return (
        <div className="space-y-8 pb-12">
            {/* ── Header ── */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                className="relative rounded-[2.5rem] overflow-hidden border border-white/5 bg-slate-900/40 backdrop-blur-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-slate-900/60 to-slate-950/80" />
                <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/8 rounded-full blur-[80px] -ml-20 -mt-20 pointer-events-none" />
                <div className="relative z-10 p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                                <BarChart3 size={18} className="text-indigo-400" />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-indigo-400/70">Admin Intelligence</span>
                        </div>
                        <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Dashboard Analytics</h2>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1">
                            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    <div className="flex gap-3 flex-wrap items-center">
                        {/* ── Batch Selector ── */}
                        <div className="relative">
                            <select
                                value={activeBatch}
                                onChange={e => handleBatchChange(e.target.value)}
                                className="appearance-none bg-white/5 border border-white/10 rounded-xl pl-4 pr-9 py-2.5 text-sm text-white outline-none focus:border-indigo-500/50 transition-colors cursor-pointer min-w-[160px] font-semibold"
                            >
                                <option value="" className="bg-slate-900">All Batches</option>
                                {batches.map(b => (
                                    <option key={b} value={b} className="bg-slate-900">Batch {b}</option>
                                ))}
                            </select>
                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                        </div>
                        <button onClick={handleRecalculate} disabled={isRecalculating}
                            className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-indigo-600 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-sky-500/20 disabled:opacity-50">
                            {isRecalculating ? <Loader2 className="animate-spin" size={15} /> : showSuccess ? <CheckCircle size={15} /> : <RefreshCw size={15} />}
                            {isRecalculating ? 'Processing…' : showSuccess ? 'Updated!' : 'Recalculate'}
                        </button>
                        <button onClick={handleExport} disabled={isExporting}
                            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-white/10 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50 active:scale-95">
                            {isExporting ? <Loader2 className="animate-spin" size={15} /> : <Download size={15} />}
                            {isExporting ? 'Exporting…' : 'Export CSV'}
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <StatCard title="Total Students"   value={stats?.totalStudents || 0} icon={Users}       accent="sky"     delay={0.05} onClick={() => navigate('/admin/students')} />
                <StatCard title="High Risk"         value={stats?.atRisk || 0}         icon={AlertCircle} accent="rose"    delay={0.10} sub="Immediate action" onClick={() => navigate('/admin/at-risk')} />
                <StatCard title="Medium Risk"        value={stats?.mediumRisk || 0}      icon={AlertTriangle} accent="amber" delay={0.15} sub="Monitor closely" onClick={() => navigate('/admin/at-risk')} />
                <StatCard title="Avg Attendance"    value={stats?.avgAttendance || 0}  icon={Activity}    accent="indigo"  delay={0.20} suffix="%" />
                <StatCard title="Batch Avg CGPA"    value={stats?.avgGpa || 0}          icon={TrendingUp}  accent="emerald" delay={0.25} decimals={2} />
            </div>

            {/* ── Charts Row ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Doughnut */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl shadow-2xl">
                    <h3 className="text-lg font-black text-white uppercase italic tracking-tight mb-1">Risk Distribution</h3>
                    <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest mb-6">AI-generated categories</p>
                    <div className="h-52 flex items-center justify-center relative">
                        <Doughnut data={doughnutData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { backgroundColor: '#0f172a', titleColor: '#94a3b8', bodyColor: '#f1f5f9', padding: 12, borderRadius: 10 } } }} />
                        {/* Centre label */}
                        <div className="absolute flex flex-col items-center pointer-events-none">
                            <span className="text-2xl font-black text-white italic">{stats?.totalStudents || 0}</span>
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total</span>
                        </div>
                    </div>
                    <div className="mt-6 grid grid-cols-3 gap-3">
                        {[
                            { label: 'High', val: stats?.atRisk || 0, color: 'bg-rose-500' },
                            { label: 'Medium', val: stats?.mediumRisk || 0, color: 'bg-amber-500' },
                            { label: 'Low', val: lowRiskCount, color: 'bg-emerald-500' },
                        ].map(({ label, val, color }) => (
                            <div key={label} className="text-center bg-white/[0.02] rounded-2xl py-3 border border-white/5">
                                <div className={`w-2 h-2 rounded-full ${color} mx-auto mb-1.5`} />
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
                                <p className="text-lg font-black text-white italic">{val}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Bar Chart */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                    className="lg:col-span-2 bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl shadow-2xl">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-black text-white uppercase italic tracking-tight">CGPA Distribution</h3>
                            <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest mt-0.5">
                                {activeBatch ? `Batch ${activeBatch}` : 'All Batches'} — 10-point scale
                            </p>
                        </div>
                        <span className="px-3 py-1 bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[10px] font-black uppercase tracking-widest rounded-xl">
                            Live Data
                        </span>
                    </div>
                    <div className="h-64"><Bar data={barData} options={barOptions} /></div>
                </motion.div>
            </div>

            {/* ── Recent At-Risk Preview ── */}
            {atRisk.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl shadow-2xl">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-black text-white uppercase italic tracking-tight">Recent At-Risk Students</h3>
                            <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest mt-0.5">Top 5 — highest risk scores</p>
                        </div>
                        <button onClick={() => navigate('/admin/at-risk')}
                            className="flex items-center gap-2 text-sky-400 text-[10px] font-black uppercase tracking-widest hover:text-sky-300 transition-colors">
                            View All <ArrowRight size={13} />
                        </button>
                    </div>
                    <div className="space-y-3">
                        {atRisk.map((s, i) => (
                            <motion.div key={s._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 + i * 0.06 }}
                                className="flex items-center gap-4 bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-2xl px-5 py-4 transition-all group">
                                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-sm font-black text-slate-300 shrink-0">
                                    {(s.user?.name || 'U').split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-black text-slate-200 truncate">{s.user?.name || 'Unknown'}</p>
                                    <p className="text-[10px] text-slate-500 font-semibold truncate">{s.studentId} · {s.dropoutRisk?.reason}</p>
                                </div>
                                <div className="flex items-center gap-4 shrink-0">
                                    <div className="text-right">
                                        <p className="text-[9px] text-slate-600 uppercase tracking-widest">CGPA</p>
                                        <p className="text-sm font-black text-slate-300">{s.gpa?.toFixed(2)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] text-slate-600 uppercase tracking-widest">Attend.</p>
                                        <p className={`text-sm font-black ${s.attendance < 75 ? 'text-amber-400' : 'text-slate-300'}`}>{s.attendance}%</p>
                                    </div>
                                    <RiskBadge cat={s.dropoutRisk?.category || 'Low'} />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default AdminDashboard;

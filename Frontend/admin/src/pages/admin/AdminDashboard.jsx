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
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            onClick={onClick}
            className={`sg-stat-card sg-stat-card--${accent}${onClick ? ' sg-stat-card--clickable' : ''}`}
        >
            <Icon size={28} className="sg-stat-icon" />
            <span className="sg-stat-value">
                <Counter value={typeof value === 'number' ? value : 0} suffix={suffix} decimals={decimals} />
            </span>
            <p className="sg-stat-label">{title}</p>
            {sub && <p className="sg-stat-sub">{sub}</p>}
        </motion.div>
    );
};

/* ── Risk Badge ── */
const RiskBadge = ({ cat }) => {
    const cls = {
        High:   'sg-badge sg-badge--high',
        Medium: 'sg-badge sg-badge--medium',
        Low:    'sg-badge sg-badge--low',
    };
    return <span className={cls[cat] || cls.Low}>{cat}</span>;
};

/* ════════════════════════════════════════ MAIN ════════════════════════════════════════ */
const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats]             = useState(null);
    const [atRisk, setAtRisk]           = useState([]);
    const [isLoading, setIsLoading]     = useState(true);
    const [isRecalculating, setIsRecalculating] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [batches, setBatches]         = useState([]);
    const [activeBatch, setActiveBatch] = useState('');

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
        <div className="sg-loading">
            <Loader2 className="animate-spin" size={32} />
        </div>
    );

    const doughnutData = {
        labels: ['High Risk', 'Medium Risk', 'Low Risk'],
        datasets: [{ data: stats?.distribution || [0, 0, 100], backgroundColor: ['#c0392b', '#d4a847', '#2ecc71'], borderWidth: 0, cutout: '78%' }]
    };

    const barData = {
        labels: stats?.gpaLabels || ['<5', '5-6', '6-7', '7-8', '8-9', '9-10'],
        datasets: [{
            label: 'Students',
            data: stats?.gpaDistribution || [0, 0, 0, 0, 0, 0],
            backgroundColor: (ctx) => {
                const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 260);
                g.addColorStop(0, 'rgba(192,57,43,0.85)');
                g.addColorStop(1, 'rgba(192,57,43,0.2)');
                return g;
            },
            borderRadius: 2, borderSkipped: false,
        }]
    };

    const barOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { backgroundColor: '#171410', titleColor: '#c8c2b8', bodyColor: '#f2ede4', padding: 10, borderRadius: 4, borderColor: 'rgba(242,237,228,0.08)', borderWidth: 1 } },
        scales: {
            y: { grid: { color: 'rgba(242,237,228,0.04)' }, ticks: { color: '#4a4540', font: { weight: '700', size: 10, family: 'DM Mono' } } },
            x: { grid: { display: false }, ticks: { color: '#4a4540', font: { weight: '700', size: 10, family: 'DM Mono' } } },
        },
    };

    const lowRiskCount = (stats?.totalStudents || 0) - (stats?.atRisk || 0) - (stats?.mediumRisk || 0);

    return (
        <div className="sg-space">
            {/* ── Header Banner ── */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="sg-banner">
                <div>
                    <p className="sg-page-label">Admin Intelligence</p>
                    <h2 className="sg-page-title">Dashboard Analytics</h2>
                    <p className="sg-stat-sub" style={{ marginTop: '4px' }}>
                        {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
                <div className="sg-banner-actions">
                    {/* ── Batch Selector ── */}
                    <div className="sg-select-wrap">
                        <select
                            value={activeBatch}
                            onChange={e => handleBatchChange(e.target.value)}
                            className="sg-select"
                        >
                            <option value="">All Batches</option>
                            {batches.map(b => (
                                <option key={b} value={b}>Batch {b}</option>
                            ))}
                        </select>
                    </div>
                    <button onClick={handleRecalculate} disabled={isRecalculating} className="sg-btn sg-btn--primary">
                        {isRecalculating ? <Loader2 className="animate-spin" size={14} /> : showSuccess ? <CheckCircle size={14} /> : <RefreshCw size={14} />}
                        {isRecalculating ? 'Processing…' : showSuccess ? 'Updated!' : 'Recalculate'}
                    </button>
                    <button onClick={handleExport} disabled={isExporting} className="sg-btn sg-btn--ghost">
                        {isExporting ? <Loader2 className="animate-spin" size={14} /> : <Download size={14} />}
                        {isExporting ? 'Exporting…' : 'Export CSV'}
                    </button>
                </div>
            </motion.div>

            {/* ── Stat Cards ── */}
            <div className="sg-stat-grid">
                <StatCard title="Total Students"   value={stats?.totalStudents || 0} icon={Users}        accent="sky"     delay={0.05} onClick={() => navigate('/admin/students')} />
                <StatCard title="High Risk"         value={stats?.atRisk || 0}        icon={AlertCircle}  accent="rose"    delay={0.10} sub="Immediate action" onClick={() => navigate('/admin/at-risk')} />
                <StatCard title="Medium Risk"        value={stats?.mediumRisk || 0}    icon={AlertTriangle} accent="amber" delay={0.15} sub="Monitor closely" onClick={() => navigate('/admin/at-risk')} />
                <StatCard title="Avg Attendance"    value={stats?.avgAttendance || 0}  icon={Activity}    accent="indigo"  delay={0.20} suffix="%" />
                <StatCard title="Batch Avg CGPA"    value={stats?.avgGpa || 0}         icon={TrendingUp}  accent="emerald" delay={0.25} decimals={2} />
            </div>

            {/* ── Charts Row ── */}
            <div className="sg-charts-row">
                {/* Doughnut */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="sg-panel">
                    <h3 className="sg-section-title">Risk Distribution</h3>
                    <p className="sg-section-sub">AI-generated categories</p>
                    <div style={{ height: '210px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', marginTop: '24px' }}>
                        <Doughnut data={doughnutData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { backgroundColor: '#171410', titleColor: '#c8c2b8', bodyColor: '#f2ede4', padding: 10, borderRadius: 4 } } }} />
                        <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none' }}>
                            <span style={{ fontSize: '28px', fontWeight: 700, color: 'var(--paper)', fontFamily: 'var(--font-mono)', letterSpacing: '-0.04em', lineHeight: 1 }}>{stats?.totalStudents || 0}</span>
                            <span style={{ fontSize: '9px', fontWeight: 700, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Total</span>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '24px' }}>
                        {[
                            { label: 'High',   val: stats?.atRisk || 0,    color: '#c0392b' },
                            { label: 'Medium', val: stats?.mediumRisk || 0, color: '#d4a847' },
                            { label: 'Low',    val: lowRiskCount,            color: '#2ecc71' },
                        ].map(({ label, val, color }) => (
                            <div key={label} style={{ textAlign: 'center', borderTop: `2px solid ${color}`, paddingTop: '12px' }}>
                                <p style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--ink-muted)' }}>{label}</p>
                                <p style={{ fontSize: '22px', fontWeight: 700, color: 'var(--paper)', fontFamily: 'var(--font-mono)', letterSpacing: '-0.04em', lineHeight: 1.1, marginTop: '4px' }}>{val}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Bar Chart */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                    className="sg-panel">
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
                        <div>
                            <h3 className="sg-section-title">CGPA Distribution</h3>
                            <p className="sg-section-sub">
                                {activeBatch ? `Batch ${activeBatch}` : 'All Batches'} — 10-point scale
                            </p>
                        </div>
                        <span className="sg-badge sg-badge--live">Live Data</span>
                    </div>
                    <div style={{ height: '260px' }}><Bar data={barData} options={barOptions} /></div>
                </motion.div>
            </div>

            {/* ── Recent At-Risk Preview ── */}
            {atRisk.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    className="sg-panel">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                        <div>
                            <h3 className="sg-section-title">Recent At-Risk Students</h3>
                            <p className="sg-section-sub">Top 5 — highest risk scores</p>
                        </div>
                        <button onClick={() => navigate('/admin/at-risk')} className="sg-btn sg-btn--ghost" style={{ fontSize: '10px' }}>
                            View All <ArrowRight size={12} />
                        </button>
                    </div>
                    <div>
                        {atRisk.map((s, i) => (
                            <motion.div key={s._id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 + i * 0.06 }}
                                className="sg-risk-row">
                                <div className="sg-risk-avatar">
                                    {(s.user?.name || 'U').split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--paper)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.user?.name || 'Unknown'}</p>
                                    <p style={{ fontSize: '10px', color: 'var(--ink-muted)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.studentId} · {s.dropoutRisk?.reason}</p>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexShrink: 0 }}>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ fontSize: '9px', color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>CGPA</p>
                                        <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--paper)', fontFamily: 'var(--font-mono)' }}>{s.gpa?.toFixed(2)}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ fontSize: '9px', color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Attend.</p>
                                        <p style={{ fontSize: '13px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: s.attendance < 75 ? 'var(--amber)' : 'var(--paper)' }}>{s.attendance}%</p>
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

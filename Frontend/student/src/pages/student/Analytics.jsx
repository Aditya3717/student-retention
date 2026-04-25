import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import {
    TrendingUp, BarChart3, BookOpen, Target, Loader2,
    ShieldCheck, AlertTriangle, AlertCircle, ArrowRight,
    Calendar, Award
} from 'lucide-react';
import {
    Chart as ChartJS, CategoryScale, LinearScale,
    PointElement, LineElement, BarElement, Title,
    Tooltip, Legend, Filler, ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale, LinearScale, PointElement, LineElement,
    BarElement, ArcElement, Title, Tooltip, Legend, Filler
);

const RiskBadge = ({ category }) => {
    const config = {
        Low:    { icon: ShieldCheck,    color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/30', label: 'Low Risk' },
        Medium: { icon: AlertTriangle,  color: 'text-amber-400',   bg: 'bg-amber-400/10',   border: 'border-amber-400/30',   label: 'Medium Risk' },
        High:   { icon: AlertCircle,    color: 'text-rose-400',    bg: 'bg-rose-400/10',    border: 'border-rose-400/30',    label: 'High Risk — See Advisor' },
    };
    const c = config[category] || config.Low;
    const Icon = c.icon;
    return (
        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold ${c.color} ${c.bg} ${c.border}`}>
            <Icon size={14} /> {c.label}
        </span>
    );
};

const Analytics = () => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/students/dashboard')
            .then(res => { if (res.data.success) setData(res.data.data); })
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="animate-spin text-primary-500" size={40} />
        </div>
    );

    const history = data?.academicHistory || [];
    const semesters = history.map(h => h.semester);
    const gpas = history.map(h => h.gpa);
    const credits = history.map(h =>
        h.subjects.reduce((acc, s) => acc + (s.credits || 0), 0)
    );
    const totalCredits = credits.reduce((a, b) => a + b, 0);
    const attendance = data?.attendance || 0;
    const risk = data?.dropoutRisk || { category: 'Low', score: 0 };

    const lineData = {
        labels: semesters.length ? semesters : ['No Data'],
        datasets: [{
            label: 'GPA',
            data: gpas.length ? gpas : [0],
            borderColor: '#0ea5e9',
            backgroundColor: ctx => {
                const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300);
                gradient.addColorStop(0, 'rgba(14,165,233,0.35)');
                gradient.addColorStop(1, 'rgba(14,165,233,0)');
                return gradient;
            },
            tension: 0.4, fill: true,
            pointBackgroundColor: '#0ea5e9', pointBorderColor: '#fff',
            pointBorderWidth: 2, pointRadius: 6, pointHoverRadius: 9,
        }],
    };

    const barData = {
        labels: semesters.length ? semesters : ['No Data'],
        datasets: [{
            label: 'Credits',
            data: credits.length ? credits : [0],
            backgroundColor: 'rgba(99,102,241,0.6)',
            borderColor: '#6366f1',
            borderWidth: 2,
            borderRadius: 8,
        }],
    };

    const donutData = {
        labels: ['Present', 'Absent'],
        datasets: [{
            data: [attendance, 100 - attendance],
            backgroundColor: ['#0ea5e9', '#1e293b'],
            borderColor: ['#0ea5e9', '#334155'],
            borderWidth: 2,
        }],
    };

    const chartOptions = (yMax) => ({
        responsive: true, maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#0f172a', titleColor: '#94a3b8',
                bodyColor: '#f1f5f9', padding: 14, borderRadius: 10,
                displayColors: false, borderColor: 'rgba(255,255,255,0.08)', borderWidth: 1,
            },
        },
        scales: {
            y: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#64748b' }, min: 0, max: yMax },
            x: { grid: { display: false }, ticks: { color: '#64748b' } },
        },
    });

    const donutOptions = {
        responsive: true, maintainAspectRatio: false, cutout: '75%',
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tighter italic uppercase">Analytics</h2>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-1">Your Academic Performance Overview</p>
                </div>
                <RiskBadge category={risk.category} />
            </motion.div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Current GPA', value: data?.gpa?.toFixed(2) || '0.00', icon: TrendingUp, color: 'text-sky-400' },
                    { label: 'Attendance', value: `${attendance}%`, icon: Calendar, color: 'text-indigo-400' },
                    { label: 'Credits Earned', value: totalCredits, icon: BookOpen, color: 'text-emerald-400' },
                    { label: 'Class Rank', value: `#${data?.rank || 'N/A'}`, icon: Award, color: 'text-amber-400' },
                ].map((card, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="bg-slate-900/40 border border-white/5 p-6 rounded-3xl backdrop-blur-xl"
                    >
                        <card.icon size={20} className={`mb-3 ${card.color}`} />
                        <p className="text-2xl font-black text-white italic tracking-tighter">{card.value}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">{card.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* GPA Trend */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2 bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-xl"
                >
                    <h3 className="text-lg font-black text-white italic uppercase tracking-tight mb-1">GPA Trend</h3>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-8">Semester-by-Semester Performance</p>
                    <div className="h-64">
                        <Line data={lineData} options={chartOptions(4)} />
                    </div>
                </motion.div>

                {/* Attendance Donut */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-xl flex flex-col items-center justify-center"
                >
                    <h3 className="text-lg font-black text-white italic uppercase tracking-tight mb-1 self-start">Attendance</h3>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-8 self-start">Overall Rate</p>
                    <div className="relative h-48 w-48">
                        <Doughnut data={donutData} options={donutOptions} />
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-black text-white italic">{attendance}%</span>
                            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Present</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Credits Per Semester Bar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-xl"
            >
                <h3 className="text-lg font-black text-white italic uppercase tracking-tight mb-1">Credits Per Semester</h3>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-8">Credit Hours Completed Each Term</p>
                <div className="h-56">
                    <Bar data={barData} options={chartOptions(30)} />
                </div>
            </motion.div>

            {/* CTA */}
            {history.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] text-center"
                >
                    <BarChart3 size={40} className="text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400 font-semibold mb-4">No academic history found. Ask your admin to populate your records.</p>
                    <button
                        onClick={() => navigate('/student')}
                        className="px-6 py-3 bg-primary-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-primary-500 transition-colors flex items-center gap-2 mx-auto"
                    >
                        Back to Dashboard <ArrowRight size={14} />
                    </button>
                </motion.div>
            )}
        </div>
    );
};

export default Analytics;

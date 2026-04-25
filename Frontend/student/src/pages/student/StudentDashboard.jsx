import React, { useState, useEffect } from 'react';
import { motion, animate } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import {
    TrendingUp,
    Users,
    BookOpen,
    AlertCircle,
    ArrowUpRight,
    Target,
    Zap,
    ChevronRight,
    Loader2,
    ArrowRight
} from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const Counter = ({ value, decimals = 0, suffix = "" }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const controls = animate(0, value, {
            duration: 1.5,
            ease: [0.23, 1, 0.32, 1],
            onUpdate: (latest) => setDisplayValue(latest)
        });
        return () => controls.stop();
    }, [value]);

    return (
        <span>
            {displayValue.toLocaleString(undefined, {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals
            })}
            {suffix}
        </span>
    );
};

const PremiumStatCard = ({ title, value, icon: Icon, trend, color, delay = 0, onClick }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.8 }}
        whileHover={{ y: -8, scale: 1.02 }}
        onClick={onClick}
        className={`relative group h-full ${onClick ? 'cursor-pointer' : ''}`}
    >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-[2.5rem] blur-sm transition-opacity group-hover:opacity-100 opacity-0" />
        <div className="relative h-full bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-xl overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-white/[0.05] transition-all" />
            
            <div className="flex justify-between items-start mb-8">
                <div className={`p-4 rounded-2xl bg-slate-800/50 border border-white/5 text-slate-300 group-hover:bg-white group-hover:text-slate-900 transition-all duration-500`}>
                    <Icon size={24} />
                </div>
                {trend && (
                    <motion.span 
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20"
                    >
                        <ArrowUpRight size={14} />
                        {trend}
                    </motion.span>
                )}
            </div>
            
            <div className="space-y-1">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 italic">{title}</h3>
                <p className="text-4xl font-black text-white italic tracking-tighter">
                    <Counter value={parseFloat(value)} decimals={typeof value === 'string' && value.includes('.') ? 2 : (value > 10 ? 0 : 2)} suffix={typeof value === 'string' && value.includes('%') ? "%" : ""} />
                </p>
            </div>
            
            <div className="mt-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">View Details</span>
                <ChevronRight size={14} className="text-slate-600" />
            </div>
        </div>
    </motion.div>
);

const StudentDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api.get('/students/dashboard');
                if (response.data.success) {
                    setDashboardData(response.data.data);
                    // Store for notifications system
                    sessionStorage.setItem('dashboardData', JSON.stringify(response.data.data));
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-primary-500" size={40} />
            </div>
        );
    }

    const labels = dashboardData?.academicHistory?.map(h => h.semester) || ['N/A'];
    const gpas = dashboardData?.academicHistory?.map(h => h.gpa) || [0];

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'GPA',
                data: gpas,
                borderColor: '#0ea5e9',
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                    gradient.addColorStop(0, 'rgba(14, 165, 233, 0.4)');
                    gradient.addColorStop(1, 'rgba(14, 165, 233, 0)');
                    return gradient;
                },
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#0ea5e9',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#0f172a',
                titleColor: '#94a3b8',
                bodyColor: '#f1f5f9',
                titleFont: { family: 'Inter', weight: 'bold', size: 12 },
                bodyFont: { family: 'Inter', size: 14 },
                padding: 16,
                borderRadius: 12,
                displayColors: false,
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
            },
        },
        scales: {
            y: {
                grid: { color: 'rgba(255, 255, 255, 0.02)', drawBorder: false },
                ticks: { color: '#64748b', font: { weight: 'bold', size: 10 } },
                min: 0,
                max: 4,
            },
            x: {
                grid: { display: false },
                ticks: { color: '#64748b', font: { weight: 'bold', size: 10 } },
            },
        },
    };

    return (
        <div className="space-y-10 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tighter italic uppercase">My Dashboard</h2>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-1">Academic Overview</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest bg-slate-800/50 border border-white/5 px-4 py-2 rounded-full">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <PremiumStatCard
                    title="Current GPA"
                    value={dashboardData?.gpa || 0}
                    icon={TrendingUp}
                    trend="+0.2"
                    delay={0.1}
                    onClick={() => navigate('/student/academics')}
                />
                <PremiumStatCard
                    title="Attendance"
                    value={`${dashboardData?.attendance || 0}%`}
                    icon={Users}
                    trend="+2%"
                    delay={0.2}
                    onClick={() => navigate('/student/academics')}
                />
                <PremiumStatCard
                    title="Credits Earned"
                    value={dashboardData?.academicHistory?.reduce((acc, sem) => acc + sem.subjects.reduce((sAcc, s) => sAcc + s.credits, 0), 0) || 0}
                    icon={BookOpen}
                    delay={0.3}
                    onClick={() => navigate('/student/academics')}
                />
                <PremiumStatCard
                    title="Class Rank"
                    value={dashboardData?.rank || 1}
                    icon={Target}
                    delay={0.4}
                    onClick={() => navigate('/student/analytics')}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-4">
                {/* Performance Chart */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="lg:col-span-2 bg-slate-900/40 border border-white/5 p-10 rounded-[3rem] backdrop-blur-2xl relative overflow-hidden"
                >
                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h3 className="text-xl font-black text-white italic uppercase tracking-tight">Academic Trajectory</h3>
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Multi-semester correlation</p>
                            </div>
                            <div className="flex gap-2">
                                <span className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest border border-white/5">Year 2024</span>
                            </div>
                        </div>
                        <div className="h-80">
                            <Line data={chartData} options={chartOptions} />
                        </div>
                    </div>
                </motion.div>

                {/* Performance Insight Card */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6, duration: 1 }}
                    className="bg-gradient-to-br from-primary-600 via-indigo-700 to-slate-900 p-10 rounded-[3rem] relative overflow-hidden shadow-[0_30px_60px_-15px_rgba(14,165,233,0.3)] group"
                >
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 transition-transform">
                                <Zap className="text-white" size={24} />
                            </div>
                            <h3 className="text-3xl font-black text-white italic tracking-tighter leading-tight mb-4 uppercase">Academic<br />Insights</h3>
                            <p className="text-primary-100/70 text-sm font-medium leading-relaxed mb-8">
                                {dashboardData?.gpa >= 3.5 
                                    ? "You're performing exceptionally well. Keep up the momentum to maintain your top ranking."
                                    : dashboardData?.gpa >= 2.5
                                    ? "Your performance is on track. Improving attendance will help boost your GPA further."
                                    : "Your grades need attention. We recommend visiting your academic advisor soon."}
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/student/academics')}
                            className="w-full bg-white text-slate-950 font-black text-[11px] uppercase tracking-[0.3em] py-5 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2"
                        >
                            View Study Plan
                            <ArrowRight size={16} />
                        </button>
                    </div>
                    {/* Background decorations */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-[80px]" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-500/20 rounded-full -ml-24 -mb-24 blur-[60px]" />
                </motion.div>
            </div>
        </div>
    );
};

export default StudentDashboard;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import {
    TrendingUp,
    Users,
    BookOpen,
    AlertCircle,
    ArrowUpRight,
    Target
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

const StatCard = ({ title, value, icon: Icon, trend, color }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl backdrop-blur-sm"
    >
        <div className="flex justify-between items-start mb-4">
            <div className={cn("p-3 rounded-xl bg-opacity-10", color)}>
                <Icon size={24} className={color.replace('bg-', 'text-')} />
            </div>
            {trend && (
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                    <ArrowUpRight size={14} />
                    {trend}
                </span>
            )}
        </div>
        <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-slate-100 mt-1">{value}</p>
    </motion.div>
);

// Helper for tailwind classes
function cn(...inputs) {
    return inputs.filter(Boolean).join(' ');
}

const StudentDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api.get('/students/dashboard');
                if (response.data.success) {
                    setDashboardData(response.data.data);
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
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
                backgroundColor: 'rgba(14, 165, 233, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#0ea5e9',
                pointBorderColor: '#fff',
                pointHoverRadius: 6,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1e293b',
                titleColor: '#94a3b8',
                bodyColor: '#f1f5f9',
                padding: 12,
                borderRadius: 8,
                displayColors: false,
            },
        },
        scales: {
            y: {
                grid: { color: 'rgba(148, 163, 184, 0.05)' },
                ticks: { color: '#64748b' },
                min: 0,
                max: 4,
            },
            x: {
                grid: { display: false },
                ticks: { color: '#64748b' },
            },
        },
    };


    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Current GPA"
                    value={dashboardData?.gpa || "N/A"}
                    icon={TrendingUp}
                    trend="+0.2"
                    color="bg-sky-500"
                />
                <StatCard
                    title="Attendance"
                    value={`${dashboardData?.attendance || 0}%`}
                    icon={Users}
                    trend="+2%"
                    color="bg-indigo-500"
                />
                <StatCard
                    title="Credits Earned"
                    value={dashboardData?.academicHistory?.reduce((acc, sem) => acc + sem.subjects.reduce((sAcc, s) => sAcc + s.credits, 0), 0) || "0"}
                    icon={BookOpen}
                    color="bg-purple-500"
                />
                <StatCard
                    title="Rank"
                    value="12th"
                    icon={Target}
                    color="bg-amber-500"
                />

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Performance Chart */}
                <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 p-8 rounded-3xl">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-bold text-slate-100">Academic Progress</h3>
                        <select className="bg-slate-800 border-none rounded-lg text-sm text-slate-300 px-3 py-1 outline-none focus:ring-2 ring-primary-500/50">
                            <option>Year 2024</option>
                            <option>Year 2023</option>
                        </select>
                    </div>
                    <div className="h-80">
                        <Line data={chartData} options={chartOptions} />
                    </div>
                </div>

                {/* Motivational Card */}
                <div className="bg-gradient-to-br from-primary-600 to-indigo-700 p-8 rounded-3xl relative overflow-hidden shadow-2xl shadow-primary-500/20">
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <AlertCircle className="text-primary-100 mb-4" size={32} />
                            <h3 className="text-2xl font-bold text-white mb-2">Performance Insight</h3>
                            <p className="text-primary-100/80 leading-relaxed">
                                You're performing exceptional in Data Structures! Keeping this pace could put you in the top 5% of your cohort.
                            </p>
                        </div>
                        <button className="mt-8 bg-white text-primary-600 font-bold py-3 px-6 rounded-xl hover:bg-primary-50 transition-colors w-fit">
                            View Recommendations
                        </button>
                    </div>
                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-400/20 rounded-full -ml-12 -mb-12 blur-xl"></div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;

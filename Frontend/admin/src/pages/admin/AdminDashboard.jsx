import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import {
    Users,
    TrendingDown,
    TrendingUp,
    AlertCircle,
    BarChart,
    UserCheck,
    Download,
    RefreshCw,
    Loader2,
    CheckCircle
} from 'lucide-react';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement
);

const SummaryCard = ({ title, value, subValue, icon: Icon, color }) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 p-6 rounded-3xl relative overflow-hidden group"
    >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-white/[0.04] transition-colors" />
        <div className="flex justify-between items-start mb-4 relative z-10">
            <div className={`p-4 rounded-2xl ${color}`}>
                <Icon size={24} className="text-white" />
            </div>
            <span className="text-slate-500 text-[10px] uppercase font-black tracking-widest">Last 30 Days</span>
        </div>
        <h3 className="text-slate-400 text-sm font-bold relative z-10">{title}</h3>
        <div className="flex items-baseline gap-2 mt-1 relative z-10">
            <p className="text-3xl font-black text-white tracking-tight">{value}</p>
            {subValue && <span className="text-xs text-rose-400 font-bold uppercase tracking-widest">{subValue}</span>}
        </div>
    </motion.div>
);

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalStudents: 0,
        atRisk: 0,
        avgAttendance: 0,
        distribution: [0, 0, 100],
        gpaDistribution: [0, 0, 0, 0]
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isRecalculating, setIsRecalculating] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    const fetchData = async () => {
        try {
            const response = await api.get('/admin/dashboard-stats');
            if (response.data.success) {
                setStats(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleRecalculate = async () => {
        setIsRecalculating(true);
        try {
            await api.post('/admin/recalculate-risk');
            await fetchData();
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (error) {
            console.error('Error recalculating risk:', error);
            alert(error.response?.data?.message || 'Failed to recalculate data.');
        } finally {
            setIsRecalculating(false);
        }
    };

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const response = await api.get('/admin/students?limit=all');
            if (response.data.success) {
                const students = response.data.data;
                
                // Convert to CSV
                const headers = ['Name', 'Email', 'Student ID', 'GPA', 'Attendance (%)', 'Risk Category', 'Risk Score', 'Risk Reason'];
                const csvRows = [headers.join(',')];
                
                students.forEach(student => {
                    const row = [
                        `"${student.user?.name || ''}"`,
                        `"${student.user?.email || ''}"`,
                        `"${student.studentId || ''}"`,
                        student.gpa || 0,
                        student.attendance || 0,
                        `"${student.dropoutRisk?.category || 'Low'}"`,
                        student.dropoutRisk?.score || 0,
                        `"${student.dropoutRisk?.reason || ''}"`
                    ];
                    csvRows.push(row.join(','));
                });
                
                const csvString = csvRows.join('\n');
                const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = `student_retention_data_${new Date().toISOString().split('T')[0]}.csv`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }
        } catch (error) {
            console.error('Error exporting data:', error);
            alert('Failed to export data.');
        } finally {
            setIsExporting(false);
        }
    };

    const dropoutData = {
        labels: ['High Risk', 'Medium Risk', 'Low Risk'],
        datasets: [{
            data: stats.distribution,
            backgroundColor: ['#ef4444', '#f59e0b', '#10b981'],
            hoverBackgroundColor: ['#dc2626', '#d97706', '#059669'],
            borderWidth: 0,
            cutout: '75%'
        }]
    };

    const gpaChartData = {
        labels: ['Under 2.0', '2.0 - 3.0', '3.0 - 3.5', '3.5 - 4.0'],
        datasets: [{
            label: 'Students',
            data: stats.gpaDistribution,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderColor: '#a8a29e',
            borderWidth: 1,
            borderRadius: 12,
            hoverBackgroundColor: '#f5f5f4',
        }]
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-stone-500" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12 relative z-10">
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Dashboard Analytics</h2>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Student Retention Data</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={handleRecalculate}
                        disabled={isRecalculating}
                        className="flex items-center gap-2 bg-white text-slate-950 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-100 transition-all disabled:opacity-50 shadow-xl active:scale-95 italic"
                    >
                        {isRecalculating ? <Loader2 className="animate-spin" size={16} /> : (showSuccess ? <CheckCircle size={16} /> : <RefreshCw size={16} />)}
                        {isRecalculating ? 'Processing...' : (showSuccess ? 'Updated' : 'Recalculate Data')}
                    </button>
                    <button 
                        onClick={handleExport}
                        disabled={isExporting}
                        className="flex items-center gap-2 bg-slate-900/40 backdrop-blur-xl hover:bg-slate-800 text-slate-300 hover:text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-white/5 active:scale-95 italic shadow-lg disabled:opacity-50"
                    >
                        {isExporting ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />}
                        {isExporting ? 'Exporting...' : 'Export Data'}
                    </button>
                </div>
            </div>

            {/* Top Summaries */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <SummaryCard
                    title="Total Enrollment"
                    value={stats.totalStudents}
                    icon={Users}
                    color="bg-slate-800 shadow-xl border border-white/5"
                />
                <SummaryCard
                    title="At-Risk Students"
                    value={stats.atRisk}
                    subValue={stats.atRisk > 0 ? "Review Needed" : "Healthy"}
                    icon={AlertCircle}
                    color="bg-rose-500 shadow-lg shadow-rose-500/20"
                />
                <SummaryCard
                    title="Average Attendance"
                    value={`${stats.avgAttendance}%`}
                    icon={TrendingDown}
                    color="bg-orange-500 shadow-lg shadow-orange-500/20"
                />
                <SummaryCard
                    title="On-Track Students"
                    value={Math.round(stats.totalStudents * 0.78)}
                    icon={UserCheck}
                    color="bg-emerald-500 shadow-lg shadow-emerald-500/20"
                />
            </div>

            {/* Analysis Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Risk Distribution - Doughnut */}
                <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 p-10 rounded-[3rem] relative overflow-hidden group shadow-2xl">
                    <div className="relative z-10">
                        <h3 className="text-xl font-black text-white mb-1 uppercase tracking-tight">Risk Distribution</h3>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-8">AI Generated Categories</p>
                        <div className="h-64 flex items-center justify-center">
                            <Doughnut 
                                data={dropoutData} 
                                options={{ 
                                    maintainAspectRatio: false,
                                    plugins: { legend: { display: false } } 
                                }} 
                            />
                        </div>
                        <div className="mt-8 flex justify-center gap-6">
                            {['High', 'Med', 'Low'].map((label, idx) => (
                                <div key={label} className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: dropoutData.datasets[0].backgroundColor[idx] }} />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] rounded-full blur-3xl -mr-16 -mt-16" />
                </div>

                {/* Performance Distribution - Bar Chart */}
                <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-2xl border border-white/5 p-10 rounded-[3rem] relative overflow-hidden group shadow-2xl">
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h3 className="text-xl font-black text-white mb-1 uppercase tracking-tight">Academic Standing</h3>
                                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Overall GPA Distribution</p>
                            </div>
                            <div className="px-3 py-1 bg-slate-800/50 rounded-lg text-slate-300 text-[10px] font-black uppercase tracking-widest border border-white/10">
                                Spring 2024
                            </div>
                        </div>
                        <div className="h-64">
                            <Bar
                                data={gpaChartData}
                                options={{
                                    maintainAspectRatio: false,
                                    plugins: { legend: { display: false } },
                                    scales: {
                                        y: { 
                                            grid: { color: 'rgba(255,255,255,0.02)', borderColor: 'transparent' },
                                            ticks: { color: '#57534e', font: { weight: '800', size: 10 } }
                                        },
                                        x: { 
                                            grid: { display: false },
                                            ticks: { color: '#a8a29e', font: { weight: '800', size: 10 } }
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

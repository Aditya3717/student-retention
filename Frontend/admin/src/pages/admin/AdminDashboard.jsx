import React from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    TrendingDown,
    TrendingUp,
    AlertCircle,
    BarChart,
    UserCheck,
    Download
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
        className="bg-stone-900 border border-stone-800 p-6 rounded-2xl"
    >
        <div className="flex justify-between items-start mb-4">
            <div className={`p-4 rounded-2xl ${color}`}>
                <Icon size={24} className="text-white" />
            </div>
            <span className="text-stone-500 text-xs font-medium">Last 30 Days</span>
        </div>
        <h3 className="text-stone-400 text-sm font-medium">{title}</h3>
        <div className="flex items-baseline gap-2 mt-1">
            <p className="text-2xl font-bold text-stone-100">{value}</p>
            {subValue && <span className="text-xs text-rose-500 font-medium">{subValue}</span>}
        </div>
    </motion.div>
);

const AdminDashboard = () => {
    const dropoutData = {
        labels: ['At Risk', 'Moderate', 'Safe'],
        datasets: [{
            data: [12, 19, 69],
            backgroundColor: ['#ef4444', '#f59e0b', '#10b981'],
            borderWidth: 0,
        }]
    };

    const attendanceData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        datasets: [{
            label: 'Attendance Rate %',
            data: [88, 92, 85, 90, 84],
            backgroundColor: '#f05252',
            borderRadius: 8,
        }]
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-stone-100">Institutional Insights</h2>
                <button className="flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-stone-200 px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                    <Download size={18} />
                    Export Report
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <SummaryCard
                    title="Total Students"
                    value="1,248"
                    icon={Users}
                    color="bg-stone-700"
                />
                <SummaryCard
                    title="At-Risk Students"
                    value="45"
                    subValue="+8"
                    icon={AlertCircle}
                    color="bg-rose-600"
                />
                <SummaryCard
                    title="Avg. Attendance"
                    value="87.4%"
                    subValue="-2.1%"
                    icon={TrendingDown}
                    color="bg-orange-600"
                />
                <SummaryCard
                    title="Placement Ready"
                    value="312"
                    subValue="+42"
                    icon={UserCheck}
                    color="bg-emerald-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-stone-900 border border-stone-800 p-8 rounded-3xl">
                    <h3 className="text-xl font-bold text-stone-100 mb-8">Retention Risk Distribution</h3>
                    <div className="h-64 flex items-center justify-center">
                        <Doughnut data={dropoutData} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>

                <div className="bg-stone-900 border border-stone-800 p-8 rounded-3xl">
                    <h3 className="text-xl font-bold text-stone-100 mb-8">Weekly Attendance Trend</h3>
                    <div className="h-64">
                        <Bar
                            data={attendanceData}
                            options={{
                                maintainAspectRatio: false,
                                scales: {
                                    y: { grid: { color: '#292524' } },
                                    x: { grid: { display: false } }
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

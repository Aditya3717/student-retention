import React from 'react';
import { motion } from 'framer-motion';
import {
    AlertTriangle,
    MessageSquare,
    UserX,
    Search,
    ExternalLink,
    Phone
} from 'lucide-react';

const AtRiskStudents = () => {
    const atRisk = [
        { id: 'ST002', name: 'Bob Smith', gpa: 2.4, attendance: 65, missingAssignments: 4, riskFactor: 'High Attendance Variance', lastAction: '3 days ago' },
        { id: 'ST105', name: 'Ethan Hunt', gpa: 2.8, attendance: 74, missingAssignments: 2, riskFactor: 'Sudden GPA Drop', lastAction: '1 week ago' },
        { id: 'ST242', name: 'Sarah Connor', gpa: 2.1, attendance: 58, missingAssignments: 7, riskFactor: 'Consistent Low Engagement', lastAction: 'Yesterday' },
    ];

    return (
        <div className="space-y-8">
            <div className="bg-rose-500/10 border border-rose-500/20 p-8 rounded-3xl flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/20 shrink-0">
                    <AlertTriangle className="text-white" size={32} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-rose-500 tracking-tight">Active Early Warnings</h2>
                    <p className="text-rose-200/60 max-w-2xl">
                        The system has identified {atRisk.length} students with critical dropout risk indicators. Immediate intervention is recommended for those with attendance below 70%.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {atRisk.map((s, i) => (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={s.id}
                        className="bg-stone-900 border border-stone-800 p-8 rounded-3xl hover:border-rose-500/30 transition-all flex flex-col xl:flex-row gap-8 items-start xl:items-center"
                    >
                        <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-3">
                                <h3 className="text-xl font-bold text-stone-100">{s.name}</h3>
                                <span className="text-[10px] font-black text-rose-500 tracking-widest px-2 py-0.5 bg-rose-500/10 rounded uppercase">CRITICAL</span>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                <div>
                                    <p className="text-[10px] text-stone-600 font-bold uppercase mb-1">GPA</p>
                                    <p className="text-lg font-bold text-stone-300">{s.gpa}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-stone-600 font-bold uppercase mb-1">Attendance</p>
                                    <p className="text-lg font-bold text-rose-400">{s.attendance}%</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-stone-600 font-bold uppercase mb-1">Missing Tasks</p>
                                    <p className="text-lg font-bold text-stone-300">{s.missingAssignments}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-stone-600 font-bold uppercase mb-1">Primary Factor</p>
                                    <p className="text-sm font-bold text-stone-400">{s.riskFactor}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3 shrink-0">
                            <button className="flex items-center gap-2 px-5 py-3 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-sm font-bold transition-all border border-stone-700">
                                <MessageSquare size={18} />
                                Send Alert
                            </button>
                            <button className="flex items-center gap-2 px-5 py-3 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-sm font-bold transition-all border border-stone-700">
                                <Phone size={18} />
                                Call Faculty
                            </button>
                            <button className="flex items-center gap-2 px-5 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-rose-600/20">
                                <ExternalLink size={18} />
                                View Full Profile
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default AtRiskStudents;

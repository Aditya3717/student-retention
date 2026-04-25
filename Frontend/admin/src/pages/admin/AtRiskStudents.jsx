import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import {
    AlertTriangle,
    MessageSquare,
    UserX,
    Search,
    ExternalLink,
    Phone,
    Loader2
} from 'lucide-react';

const AtRiskStudents = () => {
    const [atRisk, setAtRisk] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAtRisk = async () => {
            try {
                const response = await api.get('/admin/at-risk');
                if (response.data.success) {
                    setAtRisk(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching at-risk students:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAtRisk();
    }, []);

    return (
        <div className="space-y-8 relative z-10">
            <div className="bg-gradient-to-r from-rose-500/10 to-transparent border border-rose-500/20 p-8 rounded-[2.5rem] flex items-center gap-6 relative overflow-hidden backdrop-blur-xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
                <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shadow-lg shadow-rose-500/10 shrink-0 relative z-10">
                    <AlertTriangle className="text-rose-400" size={32} />
                </div>
                <div className="relative z-10">
                    <h2 className="text-2xl font-black text-rose-400 tracking-tight italic uppercase">Active Early Warnings</h2>
                    <p className="text-slate-400 max-w-2xl text-sm mt-1 font-semibold">
                        The system has identified {atRisk.length} students with critical dropout risk indicators. Immediate intervention is recommended.
                    </p>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="animate-spin text-slate-500" size={32} />
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {atRisk.length > 0 ? (
                        atRisk.map((s, i) => (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                key={s._id}
                                className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 p-8 rounded-[2.5rem] hover:border-rose-500/30 hover:bg-slate-900/60 transition-all flex flex-col xl:flex-row gap-8 items-start xl:items-center group shadow-xl relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.01] rounded-full blur-2xl group-hover:bg-rose-500/5 transition-colors pointer-events-none" />
                                <div className="flex-1 space-y-5 relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-white/10 flex items-center justify-center text-lg font-black text-slate-300 shadow-inner">
                                            {(s.user?.name || 'U').split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-white tracking-tight">{s.user?.name || 'Unknown Student'}</h3>
                                            <p className="text-xs text-slate-500 font-semibold">{s.user?.email || s.studentId}</p>
                                        </div>
                                        <span className="ml-2 text-[10px] font-black text-rose-400 tracking-widest px-3 py-1 bg-rose-500/10 rounded-lg uppercase border border-rose-500/20">
                                            {s.dropoutRisk?.category || 'CRITICAL'} RISK
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-black/20 rounded-2xl p-5 border border-white/5">
                                        <div>
                                            <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">GPA</p>
                                            <p className="text-xl font-black text-slate-200 italic">{s.gpa?.toFixed(2) || '0.00'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Attendance</p>
                                            <p className={`text-xl font-black italic ${s.attendance < 75 ? 'text-amber-400' : 'text-slate-200'}`}>{s.attendance}%</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Credits</p>
                                            <p className="text-xl font-black text-slate-200 italic">{s.academicHistory?.reduce((acc, h) => acc + h.subjects?.reduce((a, sub) => a + (sub.credits || 0), 0), 0) || 0}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">AI Reason</p>
                                            <p className="text-xs font-bold text-slate-400 leading-snug">{s.dropoutRisk?.reason || 'System Warning Generated'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-3 shrink-0 relative z-10 w-full xl:w-auto">
                                    <button className="flex-1 xl:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-indigo-500/20 hover:scale-105 active:scale-95">
                                        <MessageSquare size={16} />
                                        Message
                                    </button>
                                    <button className="flex-1 xl:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10 hover:scale-105 active:scale-95">
                                        <ExternalLink size={16} />
                                        Profile
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="py-24 text-center text-slate-500 bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/5 italic font-semibold">
                            No at-risk students identified currently.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AtRiskStudents;

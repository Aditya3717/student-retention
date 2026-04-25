import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import {
    UserCheck,
    Check,
    X,
    Loader2,
    ShieldAlert,
    AlertCircle
} from 'lucide-react';

const PendingVerifications = () => {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null); // stores user ID being processed

    useEffect(() => {
        fetchPending();
    }, []);

    const fetchPending = async () => {
        try {
            const response = await api.get('/admin/pending-verifications');
            if (response.data.success) {
                setPendingUsers(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching pending verifications:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerification = async (userId, status) => {
        setActionLoading(userId);
        try {
            await api.put(`/admin/verify-student/${userId}`, { status });
            // Refresh list
            fetchPending();
        } catch (error) {
            console.error(`Error processing verification (${status}):`, error);
            alert(error.response?.data?.message || 'Failed to process verification. Please try again.');
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="space-y-6 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Access Requests</h2>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Review self-registered students ({pendingUsers.length} pending)</p>
                </div>
            </div>

            <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] overflow-hidden min-h-[400px] shadow-2xl relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
                
                {isLoading ? (
                    <div className="flex items-center justify-center h-96">
                        <Loader2 className="animate-spin text-slate-500" size={32} />
                    </div>
                ) : (
                    <div className="overflow-x-auto relative z-10">
                        {pendingUsers.length > 0 ? (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/5 bg-white/[0.02]">
                                        <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-500 tracking-widest">Student</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-500 tracking-widest">ID / Email</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-500 tracking-widest">Registration Date</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-500 tracking-widest text-right">Verification</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {pendingUsers.map((user) => (
                                        <tr key={user._id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-8 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-amber-500/20 flex items-center justify-center text-xs font-black text-amber-400 shadow-inner group-hover:border-amber-500/50 transition-colors">
                                                        {(user.name || 'U').split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-200">{user.name}</p>
                                                        <div className="flex items-center gap-1.5 mt-0.5">
                                                            <ShieldAlert size={10} className="text-amber-500" />
                                                            <span className="text-[9px] text-amber-500 font-black uppercase tracking-widest">Pending Review</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-4">
                                                <p className="text-slate-300 font-mono font-bold tracking-tight text-sm">{user.registrationNumber || 'N/A'}</p>
                                                <p className="text-xs text-slate-500">{user.email}</p>
                                            </td>
                                            <td className="px-8 py-4">
                                                <span className="text-slate-400 text-sm font-semibold">
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </span>
                                            </td>
                                            <td className="px-8 py-4 text-right">
                                                <div className="flex justify-end gap-3">
                                                    <button 
                                                        onClick={() => handleVerification(user._id, 'approved')}
                                                        disabled={actionLoading === user._id}
                                                        className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-emerald-500/20 hover:scale-105 active:scale-95 disabled:opacity-50"
                                                    >
                                                        {actionLoading === user._id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                                                        Approve
                                                    </button>
                                                    <button 
                                                        onClick={() => handleVerification(user._id, 'rejected')}
                                                        disabled={actionLoading === user._id}
                                                        className="flex items-center justify-center gap-2 px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-rose-500/20 hover:scale-105 active:scale-95 disabled:opacity-50"
                                                    >
                                                        <X size={14} />
                                                        Reject
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-24 text-center">
                                <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4 border border-white/5">
                                    <UserCheck size={24} className="text-emerald-500" />
                                </div>
                                <h3 className="text-lg font-black text-white tracking-tight">All Caught Up!</h3>
                                <p className="text-slate-500 text-xs font-semibold mt-1">There are no pending registrations awaiting your review.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PendingVerifications;

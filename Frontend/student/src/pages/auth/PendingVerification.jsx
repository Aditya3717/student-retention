import React from 'react';
import { motion } from 'framer-motion';
import { LogOut, ShieldAlert, Clock, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PendingVerification = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (user.verificationStatus === 'rejected') {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rose-600/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-rose-900/10 rounded-full blur-[120px] pointer-events-none" />
                
                <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-900/40 backdrop-blur-2xl py-12 px-8 shadow-2xl sm:rounded-[2.5rem] border border-white/5 text-center"
                    >
                        <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-rose-500/20 shadow-inner">
                            <AlertTriangle size={32} className="text-rose-400" />
                        </div>
                        <h2 className="text-2xl font-black text-white tracking-tight uppercase italic mb-2">Access Denied</h2>
                        <p className="text-sm text-slate-400 mb-8 font-semibold">Your registration request was rejected by an administrator. Please contact the institution for further assistance.</p>
                        
                        <button
                            onClick={handleLogout}
                            className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-2xl shadow-xl text-xs font-black text-white bg-slate-800 hover:bg-slate-700 uppercase tracking-widest transition-all"
                        >
                            <LogOut size={16} />
                            Return to Login
                        </button>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
            
            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-900/40 backdrop-blur-2xl py-12 px-8 shadow-2xl sm:rounded-[2.5rem] border border-white/5 text-center"
                >
                    <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-500/20 shadow-inner relative">
                        <div className="absolute inset-0 border-2 border-amber-500/30 rounded-full animate-ping opacity-50" />
                        <Clock size={32} className="text-amber-400" />
                    </div>
                    <h2 className="text-2xl font-black text-white tracking-tight uppercase italic mb-2">Verification Pending</h2>
                    <p className="text-sm text-slate-400 mb-8 font-semibold">Your account is currently under review by an administrator. Once your status is verified, you will be granted full access to the portal.</p>
                    
                    <div className="bg-slate-800/50 rounded-2xl p-4 mb-8 border border-white/5 text-left">
                        <div className="flex items-center gap-3 mb-2">
                            <ShieldAlert size={16} className="text-slate-400" />
                            <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest">Why is this required?</h4>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">To maintain institutional security, all self-registered student accounts must be cross-referenced with enrollment records before granting platform access.</p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-2xl shadow-xl text-xs font-black text-white bg-slate-800 hover:bg-slate-700 uppercase tracking-widest transition-all"
                    >
                        <LogOut size={16} />
                        Logout for now
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default PendingVerification;

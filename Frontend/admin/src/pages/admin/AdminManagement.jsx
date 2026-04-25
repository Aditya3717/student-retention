import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';
import {
    Plus,
    X,
    User,
    Mail,
    Lock,
    Fingerprint,
    ShieldCheck,
    Loader2,
    Search,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';

const AdminManagement = () => {
    const [admins, setAdmins] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        registrationNumber: '',
        password: ''
    });
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState(false);

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            const response = await api.get('/admin/team');
            if (response.data.success) {
                setAdmins(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching admins:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        setFormError('');
        setFormLoading(true);

        try {
            const response = await api.post('/admin/create-admin', formData);
            if (response.data.success) {
                setFormSuccess(true);
                fetchAdmins(); // Refresh list
                setTimeout(() => {
                    setIsModalOpen(false);
                    setFormSuccess(false);
                    setFormData({ name: '', email: '', registrationNumber: '', password: '' });
                }, 2000);
            }
        } catch (error) {
            setFormError(error.response?.data?.message || 'Failed to create admin');
        } finally {
            setFormLoading(false);
        }
    };

    const filteredAdmins = admins.filter(a => 
        (a.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
        (a.registrationNumber || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 relative z-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Administrative Team</h2>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Manage system access for institutional staff</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search team members..."
                            className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-sm text-white outline-none focus:border-indigo-500/50 transition-colors w-64 placeholder-slate-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-95"
                    >
                        <Plus size={16} />
                        Add Admin
                    </button>
                </div>
            </div>

            {/* Admin Table */}
            <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] overflow-hidden min-h-[400px] shadow-2xl relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
                {isLoading ? (
                    <div className="flex items-center justify-center h-96">
                        <Loader2 className="animate-spin text-slate-500" size={32} />
                    </div>
                ) : (
                    <div className="overflow-x-auto relative z-10">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/[0.02]">
                                    <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-500 tracking-widest">Administrator</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-500 tracking-widest">Staff ID</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-500 tracking-widest">Role</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-500 tracking-widest text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm">
                                {filteredAdmins.length > 0 ? (
                                    filteredAdmins.map((admin) => (
                                        <tr key={admin._id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-8 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-white/10 flex items-center justify-center text-xs font-black text-slate-300 shadow-inner group-hover:border-indigo-500/50 transition-colors">
                                                        {(admin.name || 'U').split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-200">{admin.name || 'Unknown'}</p>
                                                        <p className="text-xs text-slate-500">{admin.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-4 text-slate-400 font-mono font-bold tracking-tight">
                                                {admin.registrationNumber || 'N/A'}
                                            </td>
                                            <td className="px-8 py-4">
                                                <span className="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
                                                    {admin.role}
                                                </span>
                                            </td>
                                            <td className="px-8 py-4 text-right">
                                                <span className="inline-flex items-center gap-1.5 text-[9px] font-black text-emerald-400 uppercase tracking-widest">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                                    Active
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-8 py-24 text-center text-slate-600 font-semibold text-sm">No team members found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Add Admin Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 border-b border-white/5 flex items-center justify-between">
                                <h3 className="font-black text-xl text-white italic tracking-tight flex items-center gap-2">
                                    <ShieldCheck className="text-indigo-400" size={24} />
                                    Add New Admin
                                </h3>
                                <button 
                                    onClick={() => setIsModalOpen(false)}
                                    className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <form onSubmit={handleCreateAdmin} className="p-8 space-y-4">
                                {formSuccess ? (
                                    <div className="text-center py-8">
                                        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                                            <CheckCircle2 className="text-emerald-400" size={32} />
                                        </div>
                                        <h4 className="text-lg font-black text-white tracking-tight mb-2">Admin Created!</h4>
                                        <p className="text-slate-500 text-xs font-semibold">The new team member can now log in.</p>
                                    </div>
                                ) : (
                                    <>
                                        {formError && (
                                            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mb-6">
                                                <AlertCircle size={16} />
                                                {formError}
                                            </div>
                                        )}

                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                                                <div className="relative mt-1.5">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                                                    <input
                                                        type="text"
                                                        required
                                                        placeholder="Sarah Jenkins"
                                                        className="w-full bg-slate-800/50 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-sm text-white font-semibold outline-none focus:border-indigo-500/50 transition-all placeholder-slate-600"
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Work Email</label>
                                                <div className="relative mt-1.5">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                                                    <input
                                                        type="email"
                                                        required
                                                        placeholder="s.jenkins@institution.edu"
                                                        className="w-full bg-slate-800/50 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-sm text-white font-semibold outline-none focus:border-indigo-500/50 transition-all placeholder-slate-600"
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Staff ID</label>
                                                    <div className="relative mt-1.5">
                                                        <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                                                        <input
                                                            type="text"
                                                            required
                                                            placeholder="ADM-002"
                                                            className="w-full bg-slate-800/50 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-sm text-white font-semibold outline-none focus:border-indigo-500/50 transition-all placeholder-slate-600"
                                                            value={formData.registrationNumber}
                                                            onChange={(e) => setFormData({...formData, registrationNumber: e.target.value})}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Temp Password</label>
                                                    <div className="relative mt-1.5">
                                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                                                        <input
                                                            type="password"
                                                            required
                                                            placeholder="••••••••"
                                                            className="w-full bg-slate-800/50 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-sm text-white font-semibold outline-none focus:border-indigo-500/50 transition-all placeholder-slate-600"
                                                            value={formData.password}
                                                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={formLoading}
                                            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-70 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-500/20 mt-8 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-[11px] active:scale-95"
                                        >
                                            {formLoading ? <Loader2 className="animate-spin" size={16} /> : <ShieldCheck size={16} />}
                                            {formLoading ? 'Authorizing...' : 'Authorize User'}
                                        </button>
                                    </>
                                )}
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminManagement;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';
import {
    Search,
    Filter,
    Edit,
    Mail,
    UserPlus,
    ChevronLeft,
    ChevronRight,
    TrendingDown,
    TrendingUp,
    X,
    Loader2,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';

const RiskCell = ({ dropoutRisk }) => {
    const cat = dropoutRisk?.category || 'Low';
    const score = dropoutRisk?.score ?? 0;

    const cfg = {
        High:   { badge: 'text-rose-400 bg-rose-500/10 border-rose-500/20',    bar: 'from-rose-600 to-rose-400',     track: 'bg-rose-500/10' },
        Medium: { badge: 'text-amber-400 bg-amber-500/10 border-amber-500/20',  bar: 'from-amber-600 to-amber-400',   track: 'bg-amber-500/10' },
        Low:    { badge: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', bar: 'from-emerald-600 to-emerald-400', track: 'bg-emerald-500/10' },
    };
    const c = cfg[cat] || cfg.Low;

    return (
        <div className="space-y-2 min-w-[130px]">
            <div className="flex items-center justify-between">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${c.badge}`}>
                    {cat} Risk
                </span>
                <span className={`text-[10px] font-black tabular-nums ${
                    cat === 'High' ? 'text-rose-400' : cat === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
                }`}>{score}</span>
            </div>
            {/* Score bar */}
            <div className={`h-1.5 w-full rounded-full ${c.track}`}>
                <div
                    className={`h-full rounded-full bg-gradient-to-r ${c.bar} transition-all duration-700`}
                    style={{ width: `${Math.min(score, 100)}%` }}
                />
            </div>
        </div>
    );
};

const StudentManagement = () => {
    const [searchTerm, setSearchTerm]   = useState('');
    const [batchFilter, setBatchFilter] = useState('');   // e.g. "123"
    const [riskFilter, setRiskFilter]   = useState('');   // "High" | "Medium" | "Low"
    const [batches, setBatches]         = useState([]);   // available batch prefixes
    const [students, setStudents]       = useState([]);
    const [isLoading, setIsLoading]     = useState(true);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen]   = useState(false);
    const [page, setPage]               = useState(1);
    const [totalPages, setTotalPages]   = useState(1);
    const [totalStudents, setTotalStudents] = useState(0);

    // Load available batch prefixes once
    useEffect(() => {
        api.get('/admin/batches')
            .then(r => { if (r.data.success) setBatches(r.data.data); })
            .catch(() => {});
    }, []);

    const fetchStudents = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({
                page, limit: 50,
                ...(searchTerm  && { search: searchTerm }),
                ...(batchFilter && { batch: batchFilter }),
                ...(riskFilter  && { risk: riskFilter }),
            });
            const response = await api.get(`/admin/students?${params}`);
            if (response.data.success) {
                setStudents(response.data.data);
                setTotalPages(response.data.pages || 1);
                setTotalStudents(response.data.total || response.data.data.length);
            }
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const t = setTimeout(fetchStudents, 300);
        return () => clearTimeout(t);
    }, [page, searchTerm, batchFilter, riskFilter]);

    const handleEdit = (student) => {
        setSelectedStudent(student);
        setIsEditModalOpen(true);
    };

    const clearAllFilters = () => {
        setSearchTerm('');
        setBatchFilter('');
        setRiskFilter('');
        setPage(1);
    };

    const hasActiveFilters = searchTerm || batchFilter || riskFilter;

    // Batch year → human-readable label. "2025" → "Batch 2025"
    const batchLabel = (b) => b ? `Batch ${b}` : 'All Batches';

    const filteredStudents = students;

    return (
        <div className="space-y-6 pb-24 md:pb-0">
            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Student Directory</h2>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
                        {hasActiveFilters ? `${totalStudents} filtered results` : `Managing ${totalStudents} active records`}
                    </p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 self-start"
                >
                    <UserPlus size={16} />
                    Add Student
                </button>
            </div>

            {/* ── Filter Bar ── */}
            <div className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-5 backdrop-blur-xl flex flex-wrap gap-4 items-center">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input
                        type="text"
                        placeholder="Search by name or student ID…"
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500/50 transition-colors placeholder-slate-600"
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                    />
                </div>

                {/* Batch dropdown */}
                <div className="relative">
                    <select
                        value={batchFilter}
                        onChange={(e) => { setBatchFilter(e.target.value); setPage(1); }}
                        className="appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pr-9 text-sm text-white outline-none focus:border-indigo-500/50 transition-colors cursor-pointer min-w-[160px]"
                    >
                        <option value="" className="bg-slate-900">All Batches</option>
                        {batches.map(b => (
                            <option key={b} value={b} className="bg-slate-900">{batchLabel(b)}</option>
                        ))}
                    </select>
                    <Filter size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                </div>

                {/* Risk filter */}
                <div className="relative">
                    <select
                        value={riskFilter}
                        onChange={(e) => { setRiskFilter(e.target.value); setPage(1); }}
                        className="appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pr-9 text-sm text-white outline-none focus:border-indigo-500/50 transition-colors cursor-pointer min-w-[150px]"
                    >
                        <option value="" className="bg-slate-900">All Risk Levels</option>
                        <option value="High"   className="bg-slate-900 text-rose-400">🔴 High Risk</option>
                        <option value="Medium" className="bg-slate-900 text-amber-400">🟡 Medium Risk</option>
                        <option value="Low"    className="bg-slate-900 text-emerald-400">🟢 Low Risk</option>
                    </select>
                    <Filter size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                </div>

                {/* Active filter chips + clear */}
                {hasActiveFilters && (
                    <div className="flex items-center gap-2 flex-wrap">
                        {batchFilter && (
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full text-[9px] font-black uppercase tracking-widest">
                                {batchLabel(batchFilter)}
                                <button onClick={() => { setBatchFilter(''); setPage(1); }} className="hover:text-white transition-colors">×</button>
                            </span>
                        )}
                        {riskFilter && (
                            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                riskFilter === 'High'   ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
                                riskFilter === 'Medium' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                                                          'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            }`}>
                                {riskFilter} Risk
                                <button onClick={() => { setRiskFilter(''); setPage(1); }} className="hover:text-white transition-colors">×</button>
                            </span>
                        )}
                        {searchTerm && (
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 text-slate-400 rounded-full text-[9px] font-black uppercase tracking-widest">
                                "{searchTerm}"
                                <button onClick={() => { setSearchTerm(''); setPage(1); }} className="hover:text-white transition-colors">×</button>
                            </span>
                        )}
                        <button onClick={clearAllFilters} className="text-[9px] font-black text-slate-600 hover:text-slate-300 uppercase tracking-widest transition-colors underline underline-offset-2">
                            Clear all
                        </button>
                    </div>
                )}
            </div>

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
                                    <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-500 tracking-widest">Student</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-500 tracking-widest">Performance</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-500 tracking-widest">Dropout Risk</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-500 tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredStudents.length > 0 ? (
                                    filteredStudents.map((s) => (
                                        <tr key={s._id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-8 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-white/10 flex items-center justify-center text-xs font-black text-slate-300 group-hover:border-indigo-500/50 group-hover:text-indigo-400 transition-colors shadow-inner">
                                                        {s.user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-200">{s.user?.name || 'Unknown'}</p>
                                                        <p className="text-xs text-slate-500">{s.user?.email || s.studentId}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-4">
                                                <div className="flex gap-8">
                                                    <div>
                                                        <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-1">CGPA</p>
                                                        <div className="flex items-center gap-2">
                                                            {(() => {
                                                                const semGpas = (s.academicHistory || []).map(h => h.gpa).filter(g => g > 0);
                                                                const cgpa = (s.gpa && s.gpa > 0) ? s.gpa : semGpas.length ? semGpas.reduce((a,b)=>a+b,0)/semGpas.length : 0;
                                                                return (<>
                                                                    <span className="font-black text-slate-300 italic">{cgpa.toFixed(2)}</span>
                                                                    {cgpa >= 7.0 ? <TrendingUp size={14} className="text-emerald-400" /> : <TrendingDown size={14} className="text-rose-400" />}
                                                                </>);
                                                            })()}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-1">Attendance</p>
                                                        <p className={`font-black italic ${s.attendance < 75 ? 'text-amber-400' : 'text-slate-300'}`}>{s.attendance || 0}%</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-4">
                                                <RiskCell dropoutRisk={s.dropoutRisk} />
                                            </td>
                                            <td className="px-8 py-4 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button 
                                                        onClick={() => handleEdit(s)}
                                                        className="p-2 hover:bg-indigo-500/10 hover:text-indigo-400 rounded-xl text-slate-500 transition-all"
                                                        title="Edit Records"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button className="p-2 hover:bg-slate-800 rounded-xl text-slate-500 hover:text-slate-300 transition-all">
                                                        <Mail size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-8 py-24 text-center text-slate-600 text-sm font-semibold">No student records found matching your query.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="px-8 py-5 border-t border-white/5 bg-white/[0.01] flex items-center justify-between text-xs text-slate-500 font-semibold relative z-10">
                    <p>Showing page {page} of {totalPages} ({totalStudents} total entries)</p>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="p-1.5 hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-white/10 disabled:opacity-50"
                        ><ChevronLeft size={16} /></button>
                        <button 
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="p-1.5 hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-white/10 disabled:opacity-50"
                        ><ChevronRight size={16} /></button>
                    </div>
                </div>
            </div>

            <EditStudentModal 
                isOpen={isEditModalOpen} 
                onClose={() => setIsEditModalOpen(false)} 
                student={selectedStudent}
                onSuccess={fetchStudents}
            />
            
            <AddStudentModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={fetchStudents}
                batches={batches}
            />
        </div>
    );
};

const EditStudentModal = ({ isOpen, onClose, student, onSuccess }) => {
    const [formData, setFormData] = useState({ gpa: 0, attendance: 0 });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (student) {
            setFormData({ gpa: student.gpa, attendance: student.attendance });
        }
    }, [student]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        try {
            const response = await api.put(`/admin/students/${student._id}`, formData);
            if (response.data.success) {
                setMessage('Record updated successfully');
                setTimeout(() => {
                    onSuccess();
                    onClose();
                    setMessage('');
                }, 1500);
            }
        } catch (error) {
            setMessage(error.response?.data?.message || 'Update failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
                    />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
                    >
                        <div className="p-8 border-b border-white/5 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-black text-white italic tracking-tight">Adjust Records</h3>
                                <p className="text-xs text-slate-400 font-semibold mt-1">{student?.user?.name || student?.studentId}</p>
                            </div>
                            <button onClick={onClose} className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 transition-colors">
                                <X size={16} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            {message && (
                                <div className={`flex items-center gap-2 p-3 rounded-xl text-xs font-black uppercase tracking-widest ${
                                    message.includes('success') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                }`}>
                                    {message.includes('success') ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                                    {message}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Current CGPA (0–10)</label>
                                    <input 
                                        type="number" 
                                        step="0.01" 
                                        min="0" 
                                        max="10"
                                        required
                                        className="w-full bg-slate-800/50 border border-white/10 rounded-2xl px-4 py-3 mt-1.5 text-white outline-none focus:border-indigo-500/50 transition-all font-semibold"
                                        value={formData.gpa}
                                        onChange={(e) => setFormData({...formData, gpa: parseFloat(e.target.value)})}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Attendance %</label>
                                    <input 
                                        type="number" 
                                        min="0" 
                                        max="100"
                                        required
                                        className="w-full bg-slate-800/50 border border-white/10 rounded-2xl px-4 py-3 mt-1.5 text-white outline-none focus:border-indigo-500/50 transition-all font-semibold"
                                        value={formData.attendance}
                                        onChange={(e) => setFormData({...formData, attendance: parseInt(e.target.value)})}
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20 active:scale-95 disabled:opacity-70 flex justify-center items-center gap-2"
                            >
                                {isLoading ? <><Loader2 size={16} className="animate-spin" /> Synchronizing...</> : 'Synchronize Metrics'}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

const AddStudentModal = ({ isOpen, onClose, onSuccess, batches = [] }) => {
    const [formData, setFormData] = useState({ name: '', email: '', registrationNumber: '', password: '', gpa: 0, attendance: 0, batch: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        try {
            const response = await api.post(`/admin/students`, formData);
            if (response.data.success) {
                setMessage('Student added successfully');
                setTimeout(() => {
                    onSuccess();
                    onClose();
                    setMessage('');
                    setFormData({ name: '', email: '', registrationNumber: '', password: '', gpa: 0, attendance: 0, batch: '' });
                }, 1500);
            }
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to add student');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
                    />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                    >
                        <div className="p-8 border-b border-white/5 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-black text-white italic tracking-tight">Add Student</h3>
                                <p className="text-xs text-slate-400 font-semibold mt-1">Register a new student</p>
                            </div>
                            <button onClick={onClose} className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 transition-colors">
                                <X size={16} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-4">
                            {message && (
                                <div className={`flex items-center gap-2 p-3 rounded-xl text-xs font-black uppercase tracking-widest ${
                                    message.includes('success') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                }`}>
                                    {message.includes('success') ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                                    {message}
                                </div>
                            )}

                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                                <input 
                                    type="text" 
                                    required
                                    className="w-full bg-slate-800/50 border border-white/10 rounded-2xl px-4 py-3 mt-1.5 text-white outline-none focus:border-indigo-500/50 transition-all font-semibold"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                            
                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email</label>
                                <input 
                                    type="email" 
                                    required
                                    className="w-full bg-slate-800/50 border border-white/10 rounded-2xl px-4 py-3 mt-1.5 text-white outline-none focus:border-indigo-500/50 transition-all font-semibold"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Student ID</label>
                                    <input 
                                        type="text" 
                                        required
                                        className="w-full bg-slate-800/50 border border-white/10 rounded-2xl px-4 py-3 mt-1.5 text-white outline-none focus:border-indigo-500/50 transition-all font-semibold"
                                        value={formData.registrationNumber}
                                        onChange={(e) => setFormData({...formData, registrationNumber: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
                                    <input 
                                        type="password" 
                                        required
                                        className="w-full bg-slate-800/50 border border-white/10 rounded-2xl px-4 py-3 mt-1.5 text-white outline-none focus:border-indigo-500/50 transition-all font-semibold"
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    />
                                </div>
                            </div>

                            {/* Batch selector */}
                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Batch Year</label>
                                <select
                                    className="w-full bg-slate-800/50 border border-white/10 rounded-2xl px-4 py-3 mt-1.5 text-white outline-none focus:border-indigo-500/50 transition-all font-semibold appearance-none cursor-pointer"
                                    value={formData.batch}
                                    onChange={(e) => setFormData({...formData, batch: e.target.value})}
                                >
                                    <option value="" className="bg-slate-900">-- Select Batch --</option>
                                    {batches.map(b => (
                                        <option key={b} value={b} className="bg-slate-900">Batch {b}</option>
                                    ))}
                                    <option value="unassigned" className="bg-slate-900">Unassigned</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">CGPA (0–10)</label>
                                    <input 
                                        type="number" 
                                        step="0.01" 
                                        min="0" 
                                        max="10"
                                        required
                                        className="w-full bg-slate-800/50 border border-white/10 rounded-2xl px-4 py-3 mt-1.5 text-white outline-none focus:border-indigo-500/50 transition-all font-semibold"
                                        value={formData.gpa}
                                        onChange={(e) => setFormData({...formData, gpa: parseFloat(e.target.value)})}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Attendance %</label>
                                    <input 
                                        type="number" 
                                        min="0" 
                                        max="100"
                                        required
                                        className="w-full bg-slate-800/50 border border-white/10 rounded-2xl px-4 py-3 mt-1.5 text-white outline-none focus:border-indigo-500/50 transition-all font-semibold"
                                        value={formData.attendance}
                                        onChange={(e) => setFormData({...formData, attendance: parseInt(e.target.value)})}
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full py-4 mt-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20 active:scale-95 disabled:opacity-70 flex justify-center items-center gap-2"
                            >
                                {isLoading ? <><Loader2 size={16} className="animate-spin" /> Adding...</> : 'Add Student'}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default StudentManagement;

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

const RiskBadge = ({ risk }) => {
    const styles = {
        High: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
        Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        Low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    };
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles[risk] || styles['Low']}`}>
            {risk || 'Low'} Risk
        </span>
    );
};

const StudentManagement = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const fetchStudents = async () => {
        try {
            const response = await api.get('/admin/students');
            if (response.data.success) {
                setStudents(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleEdit = (student) => {
        setSelectedStudent(student);
        setIsEditModalOpen(true);
    };

    const filteredStudents = students.filter(s =>
        s.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.studentId?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Student Directory</h2>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Managing {students.length} active records</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search students..."
                            className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-sm text-white outline-none focus:border-indigo-500/50 transition-colors w-64 placeholder-slate-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-95"
                    >
                        <UserPlus size={16} />
                        Add Student
                    </button>
                </div>
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
                                                        <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-1">GPA</p>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-black text-slate-300 italic">{s.gpa?.toFixed(2) || '0.00'}</span>
                                                            {s.gpa >= 3.5 ? <TrendingUp size={14} className="text-emerald-400" /> : <TrendingDown size={14} className="text-rose-400" />}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-1">Attendance</p>
                                                        <p className={`font-black italic ${s.attendance < 75 ? 'text-amber-400' : 'text-slate-300'}`}>{s.attendance || 0}%</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-4">
                                                <RiskBadge risk={s.dropoutRisk?.category} />
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
                    <p>Showing {filteredStudents.length} entries</p>
                    <div className="flex gap-2">
                        <button className="p-1.5 hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-white/10"><ChevronLeft size={16} /></button>
                        <button className="p-1.5 hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-white/10"><ChevronRight size={16} /></button>
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
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Current GPA</label>
                                    <input 
                                        type="number" 
                                        step="0.01" 
                                        min="0" 
                                        max="4"
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

const AddStudentModal = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({ name: '', email: '', registrationNumber: '', password: '', gpa: 0, attendance: 0 });
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
                    setFormData({ name: '', email: '', registrationNumber: '', password: '', gpa: 0, attendance: 0 });
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

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Current GPA</label>
                                    <input 
                                        type="number" 
                                        step="0.01" 
                                        min="0" 
                                        max="4"
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

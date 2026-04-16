import React, { useState } from 'react';
import {
    Search,
    Filter,
    MoreVertical,
    Mail,
    UserPlus,
    ChevronLeft,
    ChevronRight,
    TrendingDown,
    TrendingUp,
    Minus
} from 'lucide-react';

const RiskBadge = ({ risk }) => {
    const styles = {
        High: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
        Medium: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
        Low: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    };
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles[risk]}`}>
            {risk} Risk
        </span>
    );
};

const StudentManagement = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const students = [
        { id: 'ST001', name: 'Alice Johnson', email: 'alice.j@uni.edu', gpa: 3.8, attendance: 95, risk: 'Low', trend: 'up' },
        { id: 'ST002', name: 'Bob Smith', email: 'bob.s@uni.edu', gpa: 2.4, attendance: 65, risk: 'High', trend: 'down' },
        { id: 'ST003', name: 'Charlie Brown', email: 'charlie.b@uni.edu', gpa: 3.1, attendance: 82, risk: 'Medium', trend: 'stable' },
        { id: 'ST004', name: 'Diana Prince', email: 'diana.p@uni.edu', gpa: 3.9, attendance: 98, risk: 'Low', trend: 'up' },
        { id: 'ST005', name: 'Ethan Hunt', email: 'ethan.h@uni.edu', gpa: 2.8, attendance: 74, risk: 'Medium', trend: 'down' },
        { id: 'ST006', name: 'Fiona Gallagher', email: 'fiona.g@uni.edu', gpa: 3.5, attendance: 89, risk: 'Low', trend: 'stable' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-stone-100 italic">Student Directory</h2>
                    <p className="text-stone-500 text-sm">Managing {students.length} active records</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search students..."
                            className="bg-stone-900 border border-stone-800 rounded-xl pl-10 pr-4 py-2 text-sm text-stone-200 outline-none focus:ring-2 ring-admin-500/50 w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-admin-600 rounded-xl text-sm font-bold text-white hover:bg-admin-500 transition-all">
                        <UserPlus size={18} />
                        Add Student
                    </button>
                </div>
            </div>

            <div className="bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-stone-800 bg-stone-900/50">
                                <th className="px-6 py-4 text-[10px] font-black uppercase text-stone-500 tracking-widest">Student</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase text-stone-500 tracking-widest">Performance</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase text-stone-500 tracking-widest">Dropout Risk</th>
                                <th className="px-6 py-4 text-[10px) font-black uppercase text-stone-500 tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-800/50">
                            {students.map((s) => (
                                <tr key={s.id} className="hover:bg-stone-800/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-xs font-bold text-admin-400 group-hover:border-admin-500/50 transition-colors">
                                                {s.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="font-bold text-stone-200">{s.name}</p>
                                                <p className="text-xs text-stone-500">{s.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-8">
                                            <div>
                                                <p className="text-[10px] text-stone-600 font-bold uppercase mb-1">GPA</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-stone-300">{s.gpa}</span>
                                                    {s.trend === 'up' && <TrendingUp size={14} className="text-emerald-500" />}
                                                    {s.trend === 'down' && <TrendingDown size={14} className="text-rose-500" />}
                                                    {s.trend === 'stable' && <Minus size={14} className="text-stone-600" />}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-stone-600 font-bold uppercase mb-1">Attendance</p>
                                                <p className="font-bold text-stone-300">{s.attendance}%</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <RiskBadge risk={s.risk} />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 hover:bg-stone-800 rounded-lg text-stone-400 hover:text-stone-200">
                                                <Mail size={18} />
                                            </button>
                                            <button className="p-2 hover:bg-stone-800 rounded-lg text-stone-400 hover:text-stone-200">
                                                <MoreVertical size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-4 border-t border-stone-800 bg-stone-900/50 flex items-center justify-between text-xs text-stone-500">
                    <p>Showing 1 to 6 of 1,248 entries</p>
                    <div className="flex gap-2">
                        <button className="p-1 hover:bg-stone-800 rounded-md transition-colors"><ChevronLeft size={16} /></button>
                        <button className="p-1 hover:bg-stone-800 rounded-md transition-colors"><ChevronRight size={16} /></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentManagement;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen,
    Calendar,
    CheckCircle2,
    Clock,
    FileText,
    GraduationCap,
    ChevronDown,
    TrendingUp,
    Award,
    Hash,
    ShieldCheck,
    ArrowUpRight,
    Loader2
} from 'lucide-react';
import api from '../../utils/api';
import GradeCalculator from './GradeCalculator';

const CourseCard = ({ code, name, grade, attendance, instructor, status, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.6 }}
        className="group relative"
    >
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative bg-slate-900/40 border border-white/5 p-6 rounded-[2rem] backdrop-blur-xl hover:bg-slate-900/60 transition-all overflow-hidden h-full">
            <div className="flex justify-between items-start mb-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{code}</span>
                    </div>
                    <h3 className="text-xl font-black text-white italic tracking-tight group-hover:text-primary-400 transition-colors uppercase">{name}</h3>
                </div>
                <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border transition-colors ${
                    status === 'Ongoing' 
                        ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 group-hover:bg-amber-500 group-hover:text-white' 
                        : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white'
                }`}>
                    {status || 'Completed'}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 group-hover:border-white/10 transition-colors">
                    <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest mb-1">Grade</p>
                    <p className="text-2xl font-black text-white italic tracking-tighter">{grade}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 group-hover:border-white/10 transition-colors">
                    <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest mb-1">Attendance</p>
                    <p className="text-2xl font-black text-white italic tracking-tighter">{attendance}%</p>
                </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/5 flex items-center justify-center text-[10px] font-black text-slate-400">
                        {instructor ? instructor.split(' ').map(n => n[0]).join('') : 'F'}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none mb-1">Faculty</span>
                        <span className="text-xs font-bold text-slate-300 leading-none">{instructor || 'Staff Member'}</span>
                    </div>
                </div>
                <ShieldCheck size={16} className="text-slate-700 group-hover:text-primary-500 transition-colors" />
            </div>
        </div>
    </motion.div>
);

const Academics = () => {
    const [loading, setLoading] = useState(true);
    const [studentData, setStudentData] = useState(null);
    const [selectedSemester, setSelectedSemester] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/students/dashboard');
                if (response.data.success) {
                    const data = response.data.data;
                    setStudentData(data);
                    if (data.academicHistory && data.academicHistory.length > 0) {
                        setSelectedSemester(data.academicHistory[data.academicHistory.length - 1].semester);
                    }
                }
            } catch (error) {
                console.error('Error fetching academic data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const currentHistory = studentData?.academicHistory?.find(h => h.semester === selectedSemester);
    const courses = currentHistory?.subjects || [];
    const tgpa = currentHistory?.gpa || 0;
    const cgpa = studentData?.gpa || 0;
    const totalCredits = studentData?.academicHistory?.reduce((acc, sem) =>
        acc + sem.subjects.reduce((s, sub) => s + (sub.credits || 0), 0), 0) || 0;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-primary-500" size={40} />
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-16">
            <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
                <div>
                    <h2 className="text-4xl font-black text-white tracking-tighter italic uppercase underline decoration-primary-500/50 decoration-4 underline-offset-8">Academics</h2>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-4">Your Academic Record</p>
                </div>

                <div className="relative group/select">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-4 px-8 py-4 bg-slate-900/60 border border-white/5 rounded-[1.5rem] text-[10px] font-black text-white uppercase tracking-widest hover:bg-slate-800 transition-all min-w-[240px] justify-between shadow-2xl backdrop-blur-xl group-hover/select:border-white/10"
                    >
                        <div className="flex items-center gap-3">
                            <Calendar size={18} className="text-primary-400" />
                            {selectedSemester}
                        </div>
                        <ChevronDown size={16} className={`transition-transform duration-500 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {isDropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                className="absolute right-0 mt-4 w-full bg-slate-900/95 border border-white/10 rounded-[1.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] z-50 overflow-hidden backdrop-blur-2xl"
                            >
                                {studentData?.academicHistory?.map((h) => (
                                    <button
                                        key={h.semester}
                                        onClick={() => {
                                            setSelectedSemester(h.semester);
                                            setIsDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-8 py-5 text-[10px] font-black uppercase tracking-widest transition-colors hover:bg-white/5 ${selectedSemester === h.semester ? 'text-primary-400 bg-primary-500/5' : 'text-slate-500'}`}
                                    >
                                        {h.semester}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </header>

            {/* GPA Summary Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="bg-gradient-to-br from-primary-600/10 via-slate-900/40 to-indigo-600/10 border border-white/5 p-10 rounded-[3rem] relative overflow-hidden backdrop-blur-xl group shadow-2xl"
                >
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-primary-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4 italic">Cumulative CGPA</p>
                            <h3 className="text-6xl font-black text-white mb-2 italic tracking-tighter">{cgpa.toFixed(2)}</h3>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Overall Grade Point Average</p>
                        </div>
                        <div className="p-5 bg-primary-600/10 border border-primary-500/20 rounded-3xl text-primary-400 group-hover:scale-110 transition-transform duration-500">
                            <TrendingUp size={40} />
                        </div>
                    </div>
                    {/* Background decorations */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full -mr-32 -mt-32 blur-[100px] group-hover:bg-primary-500/10 transition-all duration-700" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/[0.02] rounded-full -ml-16 -mb-16 blur-3xl animate-pulse" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="bg-slate-900/40 border border-white/5 p-10 rounded-[3rem] relative overflow-hidden backdrop-blur-xl group shadow-2xl"
                >
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4 italic">{selectedSemester} — Semester CGPA</p>
                            <h3 className="text-6xl font-black text-white mb-2 italic tracking-tighter">{tgpa.toFixed(2)}</h3>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">This Semester's Performance</p>
                        </div>
                        <div className="p-5 bg-white/5 border border-white/5 rounded-3xl text-amber-500 group-hover:rotate-12 transition-all duration-500">
                            <Award size={40} />
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/[0.02] rounded-full -mr-32 -mt-32 blur-[80px]" />
                </motion.div>
            </div>

            <div className="space-y-10">
                <div className="flex items-center gap-6">
                    <div className="h-px w-20 bg-gradient-to-r from-transparent to-white/10" />
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">Courses This Semester</h3>
                    <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {courses.length > 0 ? (
                        courses.map((course, idx) => (
                            <CourseCard key={course.code || idx} {...course} delay={idx * 0.05} />
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center bg-white/[0.02] rounded-[3rem] border border-dashed border-white/5">
                            <BookOpen size={64} className="mx-auto text-slate-800 mb-6" />
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">No courses found for this semester.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-16">
                <div className="lg:col-span-2 bg-slate-900/40 border border-white/5 rounded-[3rem] p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/[0.02] rounded-full blur-[100px] -mr-32 -mt-32" />
                    <h3 className="text-xl font-black text-white mb-10 flex items-center gap-3 uppercase italic tracking-tight">
                        <Clock size={24} className="text-primary-400" />
                        Semester History
                    </h3>
                    <div className="relative space-y-6">
                        <div className="absolute left-[21px] top-4 bottom-4 w-px bg-white/5" />
                        
                        {studentData?.academicHistory?.map((h, i) => (
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                key={i} 
                                className="flex items-center justify-between p-6 bg-white/[0.03] rounded-3xl border border-white/5 hover:border-white/10 transition-all group relative z-10"
                            >
                                <div className="flex items-center gap-6">
                                    <div className="w-11 h-11 rounded-2xl bg-slate-950 border border-white/5 flex items-center justify-center text-primary-400 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300 shadow-xl">
                                        <ShieldCheck size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-white italic uppercase tracking-tight text-lg">{h.semester}</h4>
                                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{h.subjects?.length || 0} Subjects</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-black text-white italic tracking-tighter leading-none mb-1">{h.gpa.toFixed(2)}</p>
                                    <span className="text-[8px] text-slate-600 uppercase font-black tracking-[0.3em]">Semester CGPA</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-slate-900/60 to-slate-950/80 border border-white/5 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
                    <h3 className="text-xl font-black text-white mb-10 uppercase italic tracking-tight">Attendance</h3>
                    <div className="flex flex-col items-center justify-center py-6 relative z-10">
                        <div className="relative w-52 h-52">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="104" cy="104" r="90" fill="transparent" stroke="rgba(255,255,255,0.02)" strokeWidth="16" />
                                <motion.circle 
                                    initial={{ strokeDashoffset: 565 }}
                                    animate={{ strokeDashoffset: 565 * (1 - (studentData?.attendance || 0) / 100) }}
                                    transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
                                    cx="104" cy="104" r="90" fill="transparent"
                                    stroke={(studentData?.attendance || 0) >= 75 ? '#0ea5e9' : '#f59e0b'}
                                    strokeWidth="16"
                                    strokeDasharray={565} strokeLinecap="round" 
                                    className="filter drop-shadow-[0_0_8px_rgba(14,165,233,0.5)]"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-5xl font-black text-white italic tracking-tighter">{studentData?.attendance || 0}%</span>
                                <span className={`text-[10px] uppercase font-black tracking-[0.2em] mt-2 ${
                                    (studentData?.attendance || 0) >= 75 ? 'text-sky-400' : 'text-amber-400'
                                }`}>
                                    {(studentData?.attendance || 0) >= 75 ? 'Good' : 'Low'}
                                </span>
                            </div>
                        </div>
                        <div className="mt-8 text-center">
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                                {(studentData?.attendance || 0) >= 75
                                    ? 'Attendance is within the required limit.'
                                    : 'Warning: Attendance below 75% requirement.'}
                            </p>
                        </div>
                    </div>
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary-500/[0.03] rounded-full -mr-32 -mb-32 blur-[100px]" />
                </div>
            </div>

            {/* Grade Calculator */}
            <GradeCalculator currentGpa={cgpa} completedCredits={totalCredits} />
        </div>
    );
};

export default Academics;

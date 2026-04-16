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
    Award
} from 'lucide-react';
import axios from 'axios';

const CourseCard = ({ code, name, grade, attendance, instructor, status }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl hover:bg-slate-900 transition-all group"
    >
        <div className="flex justify-between items-start mb-4">
            <div className="space-y-1">
                <span className="text-[10px] font-bold text-primary-500 uppercase tracking-widest">{code}</span>
                <h3 className="text-lg font-bold text-slate-100 group-hover:text-primary-400 transition-colors">{name}</h3>
            </div>
            <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${status === 'Ongoing' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                }`}>
                {status || 'Completed'}
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-800/50 p-3 rounded-2xl">
                <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Grade</p>
                <p className="text-xl font-bold text-slate-200">{grade}</p>
            </div>
            <div className="bg-slate-800/50 p-3 rounded-2xl">
                <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Attendance</p>
                <p className="text-xl font-bold text-slate-200">{attendance}%</p>
            </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                    {instructor ? instructor.split(' ').map(n => n[0]).join('') : 'INST'}
                </div>
                <span>{instructor || 'Faculty Member'}</span>
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
                // In a real app, you'd get the token from localStorage
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/students/dashboard', {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                });

                if (response.data.success) {
                    const data = response.data.data;
                    setStudentData(data);
                    if (data.academicHistory && data.academicHistory.length > 0) {
                        setSelectedSemester(data.academicHistory[data.academicHistory.length - 1].semester);
                    }
                }
            } catch (error) {
                console.error('Error fetching academic data:', error);
                // Fallback dummy data for demonstration if backend is not seeded
                const dummyData = {
                    gpa: 3.82,
                    academicHistory: [
                        {
                            semester: 'Semester 1',
                            gpa: 3.5,
                            subjects: [
                                { code: 'MA101', name: 'Mathematics I', grade: 'A-', attendance: 90, instructor: 'Dr. John Doe' },
                                { code: 'PH101', name: 'Physics I', grade: 'B+', attendance: 85, instructor: 'Dr. Jane Smith' }
                            ]
                        },
                        {
                            semester: 'Semester 2',
                            gpa: 3.7,
                            subjects: [
                                { code: 'CS102', name: 'Programming in C', grade: 'A', attendance: 95, instructor: 'Prof. Alan Turing' },
                                { code: 'EE102', name: 'Electrical Science', grade: 'B', attendance: 80, instructor: 'Dr. Nikola Tesla' }
                            ]
                        },
                        {
                            semester: 'Semester 3',
                            gpa: 3.9,
                            subjects: [
                                { code: 'CS301', name: 'Data Structures', grade: 'A', attendance: 98, instructor: 'Dr. Donald Knuth' },
                                { code: 'MA201', name: 'Discrete Math', grade: 'A', attendance: 92, instructor: 'Prof. Euler' }
                            ]
                        }
                    ]
                };
                setStudentData(dummyData);
                setSelectedSemester('Semester 3');
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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Academic Records</h2>
                    <p className="text-slate-400 mt-1">Detailed view of your semester-wise performance</p>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-3 px-6 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-sm font-bold text-slate-100 hover:bg-slate-800 transition-all min-w-[200px] justify-between shadow-xl"
                    >
                        <div className="flex items-center gap-2">
                            <Calendar size={18} className="text-primary-500" />
                            {selectedSemester}
                        </div>
                        <ChevronDown size={16} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {isDropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute right-0 mt-2 w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden"
                            >
                                {studentData.academicHistory.map((h) => (
                                    <button
                                        key={h.semester}
                                        onClick={() => {
                                            setSelectedSemester(h.semester);
                                            setIsDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-6 py-4 text-sm font-medium transition-colors hover:bg-slate-800 ${selectedSemester === h.semester ? 'text-primary-400 bg-primary-500/5' : 'text-slate-400'
                                            }`}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-gradient-to-br from-primary-600/20 to-indigo-600/20 border border-primary-500/20 p-8 rounded-[2rem] relative overflow-hidden group"
                >
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-primary-400 text-xs font-black uppercase tracking-[0.2em] mb-2">Overall Performance</p>
                            <h3 className="text-4xl font-black text-white mb-2">{cgpa.toFixed(2)}</h3>
                            <p className="text-slate-400 text-sm">Cumulative GPA (CGPA)</p>
                        </div>
                        <div className="p-4 bg-primary-500/20 rounded-2xl text-primary-400">
                            <TrendingUp size={32} />
                        </div>
                    </div>
                    {/* Background decorations */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary-500/20 transition-all duration-500"></div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-slate-900/80 border border-slate-800 p-8 rounded-[2rem] relative overflow-hidden group"
                >
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em] mb-2">{selectedSemester} Performance</p>
                            <h3 className="text-4xl font-black text-white mb-2">{tgpa.toFixed(2)}</h3>
                            <p className="text-slate-400 text-sm">Term GPA (TGPA)</p>
                        </div>
                        <div className="p-4 bg-slate-800 rounded-2xl text-amber-500">
                            <Award size={32} />
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-800 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                </motion.div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-slate-800"></div>
                    <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.3em]">Semester Courses</h3>
                    <div className="h-px flex-1 bg-slate-800"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {courses.length > 0 ? (
                        courses.map((course, idx) => (
                            <CourseCard key={course.code || idx} {...course} />
                        ))
                    ) : (
                        <div className="col-span-full py-12 text-center bg-slate-900/30 rounded-3xl border border-dashed border-slate-800">
                            <BookOpen size={48} className="mx-auto text-slate-700 mb-4" />
                            <p className="text-slate-500 font-medium">No courses recorded for this semester yet.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Clock size={20} className="text-primary-400" />
                        Academic Timeline
                    </h3>
                    <div className="space-y-4">
                        {studentData.academicHistory.map((h, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-primary-400 group-hover:bg-primary-500 group-hover:text-white transition-all">
                                        <CheckCircle2 size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-200">{h.semester}</h4>
                                        <p className="text-xs text-slate-500">{h.subjects?.length || 0} Courses Completed</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-white">{h.gpa.toFixed(2)}</p>
                                    <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">TGPA</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 shadow-xl relative overflow-hidden">
                    <h3 className="text-xl font-bold text-white mb-6">Credit Progress</h3>
                    <div className="flex flex-col items-center justify-center py-4 relative z-10">
                        <div className="relative w-40 h-40">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="80" cy="80" r="70" fill="transparent" stroke="#1e293b" strokeWidth="12" />
                                <circle cx="80" cy="80" r="70" fill="transparent" stroke="#0ea5e9" strokeWidth="12"
                                    strokeDasharray={440} strokeDashoffset={440 * (1 - 0.75)} strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl font-black text-white">75%</span>
                                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Complete</span>
                            </div>
                        </div>
                        <div className="mt-8 text-center">
                            <p className="text-slate-400 text-sm">90 / 120 Credits Earned</p>
                            <p className="text-xs text-slate-600 mt-2 italic">Expected Graduation: June 2025</p>
                        </div>
                    </div>
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full -mr-16 -mb-16 blur-2xl"></div>
                </div>
            </div>
        </div>
    );
};

export default Academics;

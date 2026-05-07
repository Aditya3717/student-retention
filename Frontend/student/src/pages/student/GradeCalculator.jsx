import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Plus, Trash2, RefreshCw, Target, TrendingUp, Info } from 'lucide-react';

const gradePoints = {
    'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C': 5, 'P': 4, 'F': 0
};

const GradeCalculator = ({ currentGpa, completedCredits }) => {
    const [courses, setCourses] = useState([
        { id: 1, name: '', credits: 3, grade: 'A' },
    ]);
    const [targetGpa, setTargetGpa] = useState('');
    const [result, setResult] = useState(null);

    const addCourse = () => {
        setCourses(prev => [...prev, { id: Date.now(), name: '', credits: 3, grade: 'A' }]);
    };

    const removeCourse = (id) => {
        if (courses.length === 1) return;
        setCourses(prev => prev.filter(c => c.id !== id));
    };

    const updateCourse = (id, field, value) => {
        setCourses(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
    };

    const calculate = () => {
        const totalNewCredits = courses.reduce((sum, c) => sum + Number(c.credits), 0);
        const newPoints = courses.reduce((sum, c) => sum + (gradePoints[c.grade] || 0) * Number(c.credits), 0);

        const prevPoints = (currentGpa || 0) * (completedCredits || 0);
        const totalCredits = (completedCredits || 0) + totalNewCredits;
        const projectedGpa = totalCredits > 0 ? (prevPoints + newPoints) / totalCredits : 0;

        setResult({
            projected: projectedGpa,
            semesterGpa: totalNewCredits > 0 ? newPoints / totalNewCredits : 0,
            change: projectedGpa - (currentGpa || 0),
        });
    };

    const reset = () => {
        setCourses([{ id: 1, name: '', credits: 3, grade: 'A' }]);
        setResult(null);
        setTargetGpa('');
    };

    const targetCreditsNeeded = () => {
        if (!targetGpa || !currentGpa || !completedCredits) return null;
        const target = parseFloat(targetGpa);
        const current = parseFloat(currentGpa);
        const done = parseInt(completedCredits);
        const totalNewCredits = courses.reduce((sum, c) => sum + Number(c.credits), 0);

        // What GPA needed this semester to hit target?
        const needed = (target * (done + totalNewCredits) - current * done) / totalNewCredits;
        return Math.min(needed, 10).toFixed(2);
    };

    const neededGpa = targetGpa ? targetCreditsNeeded() : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                        <Calculator size={20} className="text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-white italic uppercase tracking-tight">Grade Calculator</h3>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">What-if CGPA Simulator</p>
                    </div>
                </div>
                <button onClick={reset} className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 transition-all text-xs font-semibold">
                    <RefreshCw size={14} /> Reset
                </button>
            </div>

            {/* Target GPA Input */}
            <div className="mb-6 p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl flex items-center gap-4">
                <Target size={18} className="text-indigo-400 shrink-0" />
                <div className="flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Target CGPA (optional)</p>
                    <input
                        type="number"
                        min="0" max="10" step="0.1"
                        placeholder="e.g. 8.5"
                        value={targetGpa}
                        onChange={e => setTargetGpa(e.target.value)}
                        className="bg-transparent text-white text-sm font-semibold w-full focus:outline-none placeholder-slate-600"
                    />
                </div>
                {neededGpa && (
                    <div className="text-right shrink-0">
                        <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Need this sem</p>
                        <p className="text-lg font-black text-indigo-400">{neededGpa}</p>
                    </div>
                )}
            </div>

            {/* Course Rows */}
            <div className="space-y-3 mb-6">
                {courses.map((course, i) => (
                    <motion.div
                        key={course.id}
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/5 rounded-2xl"
                    >
                        <input
                            type="text"
                            placeholder={`Course ${i + 1}`}
                            value={course.name}
                            onChange={e => updateCourse(course.id, 'name', e.target.value)}
                            className="flex-1 bg-transparent text-white text-sm font-semibold focus:outline-none placeholder-slate-700 min-w-0"
                        />
                        <select
                            value={course.credits}
                            onChange={e => updateCourse(course.id, 'credits', e.target.value)}
                            className="bg-slate-800 border border-white/10 text-white text-xs font-bold rounded-xl px-2 py-2 focus:outline-none w-16"
                        >
                            {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} cr</option>)}
                        </select>
                        <select
                            value={course.grade}
                            onChange={e => updateCourse(course.id, 'grade', e.target.value)}
                            className="bg-slate-800 border border-white/10 text-white text-xs font-bold rounded-xl px-2 py-2 focus:outline-none w-16"
                        >
                            {Object.keys(gradePoints).map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                        <button
                            onClick={() => removeCourse(course.id)}
                            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                        >
                            <Trash2 size={14} />
                        </button>
                    </motion.div>
                ))}
            </div>

            {/* Add + Calculate buttons */}
            <div className="flex gap-3 mb-6">
                <button
                    onClick={addCourse}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 text-slate-300 font-bold text-xs rounded-xl hover:bg-white/10 transition-all"
                >
                    <Plus size={14} /> Add Course
                </button>
                <button
                    onClick={calculate}
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all hover:scale-[1.02] active:scale-95"
                >
                    Calculate CGPA
                </button>
            </div>

            {/* Result */}
            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="grid grid-cols-3 gap-3 p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl"
                    >
                        <div className="text-center">
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Sem CGPA</p>
                            <p className="text-2xl font-black text-white italic">{result.semesterGpa.toFixed(2)}</p>
                        </div>
                        <div className="text-center border-x border-white/5">
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Projected CGPA</p>
                            <p className="text-2xl font-black text-indigo-300 italic">{result.projected.toFixed(2)}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Change</p>
                            <p className={`text-2xl font-black italic ${result.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {result.change >= 0 ? '+' : ''}{result.change.toFixed(2)}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default GradeCalculator;

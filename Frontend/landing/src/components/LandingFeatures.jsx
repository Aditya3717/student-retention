import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, BarChart3, ShieldAlert, Briefcase, GraduationCap, Zap } from 'lucide-react';

const features = [
    {
        icon: BrainCircuit,
        title: 'ML Risk Engine',
        desc: 'RandomForest model trained on real academic data predicts dropout risk weeks before it\'s obvious. Intervention happens earlier.',
        accent: 'sky',
        tag: 'AI Powered',
    },
    {
        icon: BarChart3,
        title: 'Dean\'s Analytics',
        desc: 'Batch-wide CGPA distributions, semester trends, attendance heatmaps, and cohort comparisons — all in real time.',
        accent: 'indigo',
        tag: 'Admin Tools',
    },
    {
        icon: ShieldAlert,
        title: 'Early Warning Alerts',
        desc: 'Automatic faculty notifications when a student\'s risk profile spikes. No more manually tracking hundreds of spreadsheets.',
        accent: 'rose',
        tag: 'Proactive',
    },
    {
        icon: Briefcase,
        title: 'Career Pathway Strategist',
        desc: 'Students map skills to industry roles. Match percentages update live as skills are logged, synced to their dashboard instantly.',
        accent: 'amber',
        tag: 'Student Tools',
    },
    {
        icon: GraduationCap,
        title: 'Student Portal',
        desc: 'Full academic history, semester-by-semester GPA trajectory, subject-level attendance tracking and grade insights.',
        accent: 'emerald',
        tag: 'Self-Service',
    },
    {
        icon: Zap,
        title: 'Instant Sync',
        desc: 'Changes to the admin panel propagate instantly. A new risk score triggers notifications, dashboards, and logs in under 50ms.',
        accent: 'purple',
        tag: 'Real-time',
    },
];

const accentMap = {
    sky:     { border: 'border-sky-500/20',     bg: 'bg-sky-500/5',     icon: 'bg-sky-500/10 border-sky-500/20 text-sky-400',     tag: 'bg-sky-500/10 text-sky-400 border-sky-500/20'     },
    indigo:  { border: 'border-indigo-500/20',  bg: 'bg-indigo-500/5',  icon: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400', tag: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
    rose:    { border: 'border-rose-500/20',    bg: 'bg-rose-500/5',    icon: 'bg-rose-500/10 border-rose-500/20 text-rose-400',   tag: 'bg-rose-500/10 text-rose-400 border-rose-500/20'   },
    amber:   { border: 'border-amber-500/20',   bg: 'bg-amber-500/5',   icon: 'bg-amber-500/10 border-amber-500/20 text-amber-400', tag: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    emerald: { border: 'border-emerald-500/20', bg: 'bg-emerald-500/5', icon: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400', tag: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    purple:  { border: 'border-purple-500/20',  bg: 'bg-purple-500/5',  icon: 'bg-purple-500/10 border-purple-500/20 text-purple-400', tag: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
};

const LandingFeatures = () => (
    <section id="features" className="py-32 px-6 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_30%_at_50%_0%,rgba(14,165,233,0.05),transparent)]" />
        <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-20">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 mb-6">
                    <span className="text-stone-500 text-[9px] font-black uppercase tracking-[0.4em]">Platform Capabilities</span>
                </motion.div>
                <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                    className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-[0.9] mb-6">
                    Engineered For<br /><span className="text-stone-500">Student Success.</span>
                </motion.h2>
                <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                    className="text-stone-500 text-lg max-w-2xl mx-auto font-medium">
                    A complete ecosystem — from AI-driven risk prediction to student self-service career tools.
                </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((f, i) => {
                    const acc = accentMap[f.accent];
                    return (
                        <motion.div key={i}
                            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.7 }}
                            className={`group relative border ${acc.border} ${acc.bg} backdrop-blur-xl rounded-[2rem] p-8 hover:scale-[1.02] transition-all duration-500 overflow-hidden`}
                        >
                            <div className="absolute top-0 right-0 w-40 h-40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-3xl bg-white/5 pointer-events-none" />
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest mb-6 ${acc.tag}`}>
                                {f.tag}
                            </div>
                            <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-5 group-hover:scale-110 transition-transform ${acc.icon}`}>
                                <f.icon size={22} />
                            </div>
                            <h3 className="text-xl font-black text-white uppercase italic tracking-tight mb-3">{f.title}</h3>
                            <p className="text-stone-500 text-sm leading-relaxed font-medium">{f.desc}</p>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    </section>
);

export default LandingFeatures;

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, ShieldCheck, TrendingUp, Lock } from 'lucide-react';

const Hero = ({ onGetStarted }) => (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-20 overflow-hidden">
        {/* Multi-layer gradient bg */}
        <div className="absolute inset-0 bg-[#0c0a09]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(14,165,233,0.12),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_60%,rgba(99,102,241,0.08),transparent)]" />

        {/* Animated grid */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDQwIEwgNDAgNDAgNDAgMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-60" />

        {/* Floating orbs */}
        <div className="absolute top-1/4 left-10 w-80 h-80 bg-sky-500/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-10 w-72 h-72 bg-indigo-500/8 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto text-center">
            {/* Badge */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-sky-500/20 bg-sky-500/5 mb-10">
                <span className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8] animate-pulse" />
                <span className="text-sky-400 text-[10px] font-black uppercase tracking-[0.35em]">AI-Powered Student Retention Platform</span>
            </motion.div>

            {/* Headline */}
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
                className="text-6xl md:text-8xl lg:text-[106px] font-black text-white tracking-tighter leading-[0.88] uppercase italic mb-8">
                Orchestrating<br />
                <span className="bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">Student Success.</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.8 }}
                className="text-stone-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
                Predict at-risk students before they drop out. Powered by machine learning, built for institutions that care about every student's success.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.8 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                <button onClick={onGetStarted}
                    className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-black text-[11px] uppercase tracking-widest flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-sky-500/25">
                    Open Platform
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button onClick={() => window.location.href = 'http://localhost:5174/register'}
                    className="px-8 py-4 rounded-2xl border border-white/10 bg-white/5 text-white font-black text-[11px] uppercase tracking-widest hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-xl">
                    Join as Student →
                </button>
            </motion.div>

            {/* Trust bar */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                className="flex flex-wrap items-center justify-center gap-6">
                {[
                    { icon: ShieldCheck, label: 'AES-256 Encrypted' },
                    { icon: Zap, label: 'Real-time Alerts' },
                    { icon: TrendingUp, label: '94.2% Retention Rate' },
                    { icon: Lock, label: 'FERPA Compliant' },
                ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-2 text-stone-600 hover:text-stone-400 transition-colors">
                        <Icon size={14} className="text-sky-600" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
                    </div>
                ))}
            </motion.div>
        </div>

        {/* Dashboard Preview mockup */}
        <motion.div initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
            className="relative z-10 max-w-5xl mx-auto mt-24 w-full">
            <div className="rounded-[2rem] border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-[0_80px_120px_-30px_rgba(0,0,0,0.8)] overflow-hidden">
                {/* Window bar */}
                <div className="flex items-center gap-2 px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                    <div className="w-3 h-3 rounded-full bg-rose-500/70" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                    <div className="flex-1 mx-4 h-6 rounded-lg bg-white/5 flex items-center px-3">
                        <span className="text-[10px] text-stone-600 font-mono">app.eduguard.io/admin/dashboard</span>
                    </div>
                </div>
                {/* Fake dashboard UI */}
                <div className="p-6 grid grid-cols-4 gap-4">
                    {[
                        { label: 'At-Risk Students', value: '47', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
                        { label: 'Avg CGPA', value: '7.82', color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/20' },
                        { label: 'Attendance', value: '84%', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
                        { label: 'Retention Rate', value: '94.2%', color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
                    ].map((c, i) => (
                        <div key={i} className={`${c.bg} border ${c.border} rounded-2xl p-4`}>
                            <p className={`text-2xl font-black italic ${c.color}`}>{c.value}</p>
                            <p className="text-[9px] font-black uppercase tracking-widest text-stone-500 mt-1">{c.label}</p>
                        </div>
                    ))}
                    <div className="col-span-3 bg-white/[0.02] border border-white/5 rounded-2xl p-4 h-28 flex items-end gap-2">
                        {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                            <div key={i} className="flex-1 rounded-t-lg bg-gradient-to-t from-sky-600/60 to-sky-400/30" style={{ height: `${h}%` }} />
                        ))}
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 h-28 flex flex-col justify-center items-center gap-2">
                        <div className="w-14 h-14 rounded-full border-4 border-emerald-500/30 flex items-center justify-center">
                            <span className="text-emerald-400 font-black text-sm">Low</span>
                        </div>
                        <p className="text-[9px] text-stone-600 font-bold uppercase tracking-widest">Risk Level</p>
                    </div>
                </div>
            </div>
            {/* Glow under card */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-sky-500/10 blur-[60px] pointer-events-none" />
        </motion.div>
    </section>
);

export default Hero;

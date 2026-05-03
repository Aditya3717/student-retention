import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import LandingNav from '../components/LandingNav';
import LandingHero from '../components/LandingHero';
import LandingFeatures from '../components/LandingFeatures';
import { PortalModal, ContactModal } from '../components/LandingModals';
import { motion } from 'framer-motion';
import {
    ShieldAlert, ArrowRight, Mail, Code2, Lock, Server, Cpu, Globe,
    CheckCircle2, ShieldCheck, Search, Users, Activity
} from 'lucide-react';

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

/* ── How It Works ── */
const steps = [
    { num: '01', title: 'Import Student Data', desc: 'Upload Excel/CSV or connect via API. Student profiles, grades, attendance — all ingested automatically.' },
    { num: '02', title: 'AI Analysis Runs', desc: 'Our RandomForest model processes academic patterns, attendance dips, and grade trajectories to compute dropout risk scores.' },
    { num: '03', title: 'Alerts Fire Instantly', desc: 'Faculty and admins get notified the moment a student\'s risk profile spikes. Intervene before it\'s too late.' },
    { num: '04', title: 'Students Self-Serve', desc: 'Students access their own dashboard, track their academic progress, and map their skills to career paths in real time.' },
];

/* ── Metrics ── */
const metrics = [
    { value: '94.2%', label: 'Retention Rate', sub: '+12% vs institutional avg' },
    { value: '8,763', label: 'Students Tracked', sub: 'Real-time sync' },
    { value: '<50ms', label: 'Alert Latency', sub: 'Global infrastructure' },
    { value: 'AES-256', label: 'Encryption', sub: 'Military grade security' },
];

const Landing = () => {
    const [showPortal, setShowPortal] = useState(false);
    const [showContact, setShowContact] = useState(false);

    return (
        <div className="min-h-screen bg-[#0c0a09] text-white overflow-x-hidden">
            <LandingNav onGetStarted={() => setShowPortal(true)} />

            <AnimatePresence>
                {showPortal && <PortalModal onClose={() => setShowPortal(false)} />}
                {showContact && <ContactModal onClose={() => setShowContact(false)} />}
            </AnimatePresence>

            <LandingHero onGetStarted={() => setShowPortal(true)} />
            <LandingFeatures />

            {/* ── How It Works ── */}
            <section id="how" className="py-32 px-6 relative border-t border-white/5">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(99,102,241,0.05),transparent)]" />
                <div className="max-w-5xl mx-auto relative z-10">
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 mb-6">
                            <span className="text-stone-500 text-[9px] font-black uppercase tracking-[0.4em]">Simple By Design</span>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-black text-white uppercase italic tracking-tighter mb-4">How It Works.</h2>
                        <p className="text-stone-500 text-lg max-w-xl mx-auto">From setup to first alert in minutes. No PhD in data science required.</p>
                    </div>

                    <div className="relative">
                        {/* Vertical line */}
                        <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-sky-500/30 via-indigo-500/20 to-transparent hidden md:block" />

                        <div className="space-y-12">
                            {steps.map((s, i) => (
                                <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                                    className="flex gap-8 items-start">
                                    <div className="shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500/20 to-indigo-500/20 border border-sky-500/20 flex items-center justify-center font-black text-sky-400 text-lg z-10">
                                        {s.num}
                                    </div>
                                    <div className="pt-3">
                                        <h3 className="text-xl font-black text-white uppercase italic tracking-tight mb-2">{s.title}</h3>
                                        <p className="text-stone-500 font-medium leading-relaxed">{s.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Metrics ── */}
            <section id="metrics" className="py-24 px-6 border-t border-b border-white/5 bg-white/[0.01]">
                <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-12">
                    {metrics.map((m, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                            <p className="text-5xl md:text-6xl font-black text-white italic tracking-tighter mb-2">{m.value}</p>
                            <p className="text-stone-300 text-[10px] font-black uppercase tracking-[0.3em] mb-1">{m.label}</p>
                            <p className="text-stone-600 text-[10px] font-bold uppercase tracking-widest">{m.sub}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── Security ── */}
            <section id="security" className="py-32 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5">
                            <ShieldCheck size={14} className="text-emerald-400" />
                            <span className="text-emerald-400 text-[9px] font-black uppercase tracking-widest">Security Pillar</span>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-[0.9]">
                            Enterprise Grade <br /><span className="text-stone-500">Data Security.</span>
                        </h2>
                        <p className="text-stone-400 text-lg leading-relaxed font-medium max-w-lg">
                            Institutional data demands the highest protection. EduGuard implements modern security architecture ensuring student privacy is never compromised.
                        </p>
                        <div className="grid grid-cols-2 gap-6">
                            {[
                                { icon: Lock, t: 'AES-256', d: 'Encryption at rest & transit' },
                                { icon: Users, t: 'FERPA/GDPR', d: 'Global data compliance' },
                                { icon: CheckCircle2, t: 'SOC2 Type II', d: 'Verified operational security' },
                                { icon: Search, t: 'Audit Logs', d: 'Immutable access traceability' },
                            ].map((it, i) => (
                                <div key={i} className="flex gap-3 group">
                                    <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-stone-500 group-hover:bg-emerald-500/10 group-hover:text-emerald-400 transition-all shrink-0">
                                        <it.icon size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-white uppercase tracking-widest mb-0.5">{it.t}</p>
                                        <p className="text-stone-600 text-[10px] font-bold uppercase tracking-widest">{it.d}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                        className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px]" />
                        <div className="flex flex-col items-center justify-center gap-8 py-8 relative z-10">
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                className="w-36 h-36 rounded-full border border-emerald-500/10 flex items-center justify-center relative">
                                <div className="absolute inset-4 border border-emerald-500/5 rounded-full" />
                                <ShieldCheck size={60} className="text-emerald-500/30" />
                                {[0, 120, 240].map(deg => (
                                    <div key={deg} className="absolute w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_8px_#34d399]"
                                        style={{ transform: `rotate(${deg}deg) translateY(-68px)` }} />
                                ))}
                            </motion.div>
                            <div className="text-center">
                                <p className="text-white font-black text-lg italic uppercase animate-pulse mb-1">Encryption Active</p>
                                <p className="text-stone-600 text-[10px] font-black uppercase tracking-widest">ID: NX-901-SECURE</p>
                            </div>
                            {/* Live data lines */}
                            <div className="w-full space-y-2 opacity-30">
                                {[80, 60, 90, 45, 70].map((w, i) => (
                                    <motion.div key={i} animate={{ width: [`${w}%`, `${Math.min(100, w + 15)}%`, `${w}%`] }}
                                        transition={{ duration: 3, delay: i * 0.4, repeat: Infinity }}
                                        className="h-px bg-emerald-400 rounded-full" style={{ width: `${w}%` }} />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── API Section ── */}
            <section id="api" className="py-32 px-6 border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-gradient-to-br from-slate-900/80 to-slate-950 border border-white/10 rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/5 blur-[100px]" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 blur-[80px]" />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                            <div className="space-y-8">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-sky-500/20 bg-sky-500/5">
                                    <Code2 size={14} className="text-sky-400" />
                                    <span className="text-sky-400 text-[9px] font-black uppercase tracking-widest">Developer API</span>
                                </div>
                                <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-[0.9]">
                                    Universal <br /><span className="text-stone-500">Data Integration.</span>
                                </h2>
                                <p className="text-stone-400 text-lg leading-relaxed">Connect Canvas, Moodle, or any proprietary SIS. Orchestrate student data with zero friction.</p>
                                <div className="space-y-3">
                                    {['GraphQL & REST Enabled', 'Real-time Webhook Streaming', 'Canvas & Moodle Connectors'].map(f => (
                                        <div key={f} className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_6px_#38bdf8]" />
                                            <span className="text-xs font-black text-white uppercase tracking-widest">{f}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Code block */}
                            <div className="bg-slate-950 rounded-2xl border border-white/10 p-6 font-mono text-sm shadow-2xl">
                                <div className="flex gap-2 mb-4 pb-4 border-b border-white/5">
                                    <div className="w-3 h-3 rounded-full bg-rose-500/70" />
                                    <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                                    <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                                    <span className="ml-auto text-stone-600 text-[10px]">eduguard.js</span>
                                </div>
                                <div className="space-y-2 text-[12px]">
                                    <p className="text-sky-400">// Initialize Bridge</p>
                                    <p className="text-stone-500">const bridge = new <span className="text-white">EduGuard.Bridge</span>{'({'}</p>
                                    <p className="text-stone-400 pl-4">apiKey: <span className="text-amber-400">"INST_KEY"</span>,</p>
                                    <p className="text-stone-400 pl-4">endpoint: <span className="text-amber-400">"eu-central"</span></p>
                                    <p className="text-stone-500">{'}'});</p>
                                    <br />
                                    <p className="text-stone-500">bridge.<span className="text-white">on</span>(<span className="text-amber-400">'risk_spike'</span>, student =&gt; {'{'}</p>
                                    <p className="text-emerald-400 pl-4">notifyFaculty(student.id);</p>
                                    <p className="text-stone-500">{'}'});</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="py-32 px-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(14,165,233,0.08),transparent)]" />
                <div className="max-w-4xl mx-auto relative z-10">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        className="bg-gradient-to-br from-slate-900/60 to-slate-950 border border-white/10 rounded-[3rem] p-16 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 blur-[80px]" />
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 mb-8">
                            <Mail size={12} className="text-emerald-400" />
                            <span className="text-stone-400 text-[9px] font-black uppercase tracking-[0.4em]">Ready to transform outcomes?</span>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-black text-white uppercase italic tracking-tighter mb-6 leading-[0.9]">
                            Improve Student <br /><span className="text-stone-500">Retention Today.</span>
                        </h2>
                        <p className="text-stone-500 text-lg mb-10 max-w-xl mx-auto font-medium">
                            Join institutions already using EduGuard to identify at-risk students and dramatically improve graduation rates.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <button onClick={() => setShowContact(true)}
                                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-black text-[11px] uppercase tracking-widest flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-sky-500/20">
                                <Mail size={16} /> Contact Sales
                            </button>
                            <button onClick={() => setShowPortal(true)}
                                className="px-8 py-4 rounded-2xl border border-white/10 bg-white/5 text-white font-black text-[11px] uppercase tracking-widest flex items-center gap-3 hover:bg-white/10 transition-all">
                                <ArrowRight size={16} /> Open Portal
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="border-t border-white/5 py-16 px-6 bg-stone-950">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center">
                            <ShieldAlert size={16} className="text-white" />
                        </div>
                        <span className="font-black text-lg tracking-tighter text-white uppercase italic">EduGuard</span>
                    </div>
                    <p className="text-stone-600 text-[10px] font-bold uppercase tracking-widest text-center">
                        © 2026 EduGuard · AI-Powered Student Retention · Built with ♥
                    </p>
                    <div className="flex gap-6">
                        {['Features', 'How It Works', 'API'].map(l => (
                            <button key={l} onClick={() => scrollTo(l.toLowerCase().replace(/ /g, ''))}
                                className="text-stone-600 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">
                                {l}
                            </button>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;

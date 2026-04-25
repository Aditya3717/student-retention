import React from 'react';
import { motion } from 'framer-motion';
import { 
    ShieldAlert, 
    ArrowRight, 
    CheckCircle2, 
    BrainCircuit, 
    Users, 
    BarChart3,
    Trophy,
    MousePointer2,
    ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Nav = () => (
    <nav className="fixed top-0 left-0 w-full h-20 px-8 flex items-center justify-between z-50 glass-stone border-b border-white/5">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center">
                <ShieldAlert className="text-stone-900" size={24} />
            </div>
            <span className="font-bold text-xl tracking-tighter text-white uppercase italic">EduGuard</span>
        </div>
        <div className="flex items-center gap-6">
            <span className="text-stone-500 text-xs font-black uppercase tracking-widest cursor-pointer hover:text-white transition-colors">Infrastructure</span>
            <span className="text-stone-500 text-xs font-black uppercase tracking-widest cursor-pointer hover:text-white transition-colors">Case Studies</span>
            <button className="px-5 py-2 rounded-lg bg-stone-800 text-stone-200 text-xs font-bold hover:bg-stone-700 transition-all border border-stone-700">Documentation</button>
        </div>
    </nav>
);

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.8 }}
        whileHover={{ y: -8 }}
        className="glass-stone p-8 rounded-[2rem] border border-white/5 hover:border-white/10 transition-all group overflow-hidden relative"
    >
        <div className="absolute top-0 right-0 w-32 h-32 bg-stone-500/5 blur-[60px] group-hover:bg-stone-500/10 transition-colors" />
        <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center mb-6 shadow-xl shadow-stone-950">
            <Icon size={28} className="text-stone-900" />
        </div>
        <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{title}</h3>
        <p className="text-stone-400 text-sm leading-relaxed">{description}</p>
    </motion.div>
);

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-landing font-sans selection:bg-stone-500 selection:text-white">
            <Nav />
            
            {/* Hero Section */}
            <section className="relative pt-40 pb-32 px-8 overflow-hidden">
                {/* Decorative Gradients */}
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-stone-800/10 rounded-full blur-[160px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-stone-900/10 rounded-full blur-[160px]" />
                
                <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-stone-800 bg-stone-900/50 text-stone-400 text-[10px] uppercase font-black tracking-widest mb-8"
                    >
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Next-Gen Retention Intelligence
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.8 }}
                        className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-8 max-w-5xl italic uppercase"
                    >
                        Scale Student Success <br />
                        <span className="text-gradient">with AI Precision.</span>
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-stone-400 text-lg md:text-xl max-w-2xl mb-12 font-medium"
                    >
                        The ultimate analytics ecosystem for modern institutions. Identify at-risk patterns, personalize career paths, and maximize campus potential.
                    </motion.p>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="flex flex-col sm:flex-row items-center gap-4"
                    >
                        <button 
                            onClick={() => window.location.href = 'http://localhost:5173'}
                            className="px-8 py-5 rounded-[1.25rem] bg-stone-100 text-stone-900 font-black flex items-center gap-3 hover:bg-white hover:scale-[1.02] transition-all shadow-2xl shadow-stone-100/5 active:scale-[0.98] group uppercase text-sm"
                        >
                            Launch Student Portal
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button 
                            onClick={() => navigate('/login')}
                            className="px-8 py-5 rounded-[1.25rem] glass border border-white/10 text-white font-black hover:bg-stone-800 transition-all uppercase text-sm"
                        >
                            Institution Console
                        </button>
                    </motion.div>
                    
                    {/* Visual Element */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="mt-24 w-full max-w-5xl glass-stone rounded-[3rem] border border-white/5 p-4 glow-stone relative group"
                    >
                        <div className="absolute inset-0 bg-stone-500/5 blur-[80px] group-hover:bg-stone-500/10 transition-all" />
                        <div className="aspect-video bg-stone-950 rounded-[2.25rem] overflow-hidden relative flex items-center justify-center border border-white/5">
                             <div className="flex flex-col items-center">
                                <BarChart3 className="text-stone-800 animate-pulse" size={120} />
                                <span className="text-stone-600 font-black text-[10px] mt-4 tracking-[0.5em] uppercase">Intelligence Node Active</span>
                             </div>
                             
                             {/* Floating HUD elements */}
                             <div className="absolute top-10 left-10 glass-stone p-4 rounded-2xl border border-white/10">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-2 h-2 rounded-full bg-rose-500" />
                                    <span className="text-[10px] font-black text-rose-500 uppercase">Alert</span>
                                </div>
                                <div className="h-1 w-20 bg-stone-800 rounded-full" />
                             </div>
                             
                             <div className="absolute bottom-10 right-10 glass-stone p-4 rounded-2xl border border-white/10">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                    <span className="text-[10px] font-black text-emerald-500 uppercase">Analysis</span>
                                </div>
                                <div className="h-1 w-32 bg-stone-800 rounded-full" />
                             </div>
                        </div>
                    </motion.div>
                </div>
            </section>
            
            {/* Features Section */}
            <section className="py-32 px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard 
                        icon={BrainCircuit}
                        title="Early Warning"
                        description="ML-driven risk scoring identifying vulnerable student patterns before they manifest as regressions."
                        delay={0.1}
                    />
                    <FeatureCard 
                        icon={Trophy}
                        title="Pathway Guidance"
                        description="Personalized career roadmaps mapped to real-time skill acquisition and academic performance."
                        delay={0.2}
                    />
                    <FeatureCard 
                        icon={BarChart3}
                        title="Global Insights"
                        description="Institutional-grade analytics for dean's, providing cohort-wide performance and retention metrics."
                        delay={0.3}
                    />
                </div>
            </section>

            {/* Metrics Section */}
            <section className="py-24 border-y border-white/5 relative bg-stone-900/20">
                <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                    {[
                        { label: 'Retention Rate', value: '94%' },
                        { label: 'Data Points', value: '1.2M+' },
                        { label: 'Latency', value: '<50ms' },
                        { label: 'Institutions', value: '450+' },
                    ].map((stat, i) => (
                        <div key={i} className="space-y-2">
                            <h4 className="text-4xl font-black text-white italic">{stat.value}</h4>
                            <p className="text-stone-500 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 px-8 text-center bg-stone-950">
                <div className="max-w-7xl mx-auto">
                    <div className="inline-flex items-center gap-3 mb-12">
                        <div className="w-8 h-8 rounded-lg bg-stone-800 flex items-center justify-center">
                            <ShieldAlert className="text-stone-400" size={18} />
                        </div>
                        <span className="font-bold text-lg tracking-tighter text-stone-200 uppercase italic">EduGuard</span>
                    </div>
                    
                    <p className="text-stone-600 text-xs font-medium uppercase tracking-[0.2em] mb-12">Built for the future of higher education.</p>
                    
                    <div className="flex justify-center gap-8 text-[10px] font-black text-stone-700 uppercase tracking-widest">
                        <span className="hover:text-stone-200 transition-colors cursor-pointer">Terms</span>
                        <span className="hover:text-stone-200 transition-colors cursor-pointer">Security</span>
                        <span className="hover:text-stone-200 transition-colors cursor-pointer">API Keys</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { 
    ShieldAlert, 
    ArrowRight, 
    CheckCircle2, 
    BrainCircuit, 
    Users, 
    BarChart3,
    Trophy,
    MousePointer2,
    ChevronRight,
    Search,
    Globe,
    Zap,
    ExternalLink,
    Lock,
    Activity,
    Cpu,
    Server,
    ShieldCheck,
    Terminal,
    Code2,
    Database,
    X,
    GraduationCap,
    Mail,
    AtSign,
    Briefcase,
    BookOpen,
    MessageSquare
} from 'lucide-react';

const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
};

const Nav = ({ onGetStarted }) => (
    <nav className="!sticky top-0 left-0 w-full h-20 px-8 flex items-center justify-between z-50 glass-stone border-b border-white/5">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center p-2 shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                <ShieldAlert className="text-stone-900" size={24} />
            </div>
            <span className="font-display font-black text-2xl tracking-tighter text-white uppercase italic">EduGuard</span>
        </div>
        <div className="flex items-center gap-10">
            <div className="hidden lg:flex items-center gap-8">
                {[
                    { name: 'Security', id: 'security' },
                    { name: 'Infrastructure', id: 'infrastructure' },
                    { name: 'Analysis', id: 'analysis' },
                    { name: 'API', id: 'api' }
                ].map((item) => (
                    <span 
                        key={item.id} 
                        onClick={() => scrollToSection(item.id)}
                        className="text-stone-500 text-[10px] font-black uppercase tracking-[0.3em] cursor-pointer hover:text-white transition-all duration-500 hover:tracking-[0.4em] relative group"
                    >
                        {item.name}
                        <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all group-hover:w-full" />
                    </span>
                ))}
            </div>
            <div className="flex items-center gap-6">
                <button 
                    onClick={() => window.location.href = 'http://localhost:5173/login'}
                    className="text-stone-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-all hidden md:block"
                >
                    Admin Portal
                </button>
                <button 
                    onClick={onGetStarted}
                    className="px-6 py-2.5 rounded-xl bg-stone-100 text-stone-950 text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-2xl hover:scale-105 active:scale-95"
                >
                    Get Started
                </button>
            </div>
        </div>
    </nav>
);

const BentoCard = ({ className, children, title, icon: Icon, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className={`bento-item glass-stone rounded-[2.5rem] p-8 border border-white/5 group ${className}`}
    >
        <div className="grainy" />
        <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
                <div className="w-12 h-12 rounded-xl bg-stone-100/10 flex items-center justify-center mb-6 border border-white/5 group-hover:bg-stone-100 group-hover:text-stone-900 transition-all duration-500">
                    <Icon size={24} className="group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-xl font-display font-black text-white uppercase italic tracking-tight mb-2">{title}</h3>
                {children}
            </div>
            <div className="mt-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Learn More</span>
                <ChevronRight size={14} className="text-stone-500" />
            </div>
        </div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
);

const Landing = () => {
    const mainRef = useRef(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const [showPortalModal, setShowPortalModal] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);
    const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
    const [contactSent, setContactSent] = useState(false);

    const handleContactSubmit = (e) => {
        e.preventDefault();
        setContactSent(true);
        setTimeout(() => {
            setContactSent(false);
            setShowContactModal(false);
            setContactForm({ name: '', email: '', message: '' });
        }, 2500);
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            const xPct = (clientX / window.innerWidth) * 100;
            const yPct = (clientY / window.innerHeight) * 100;
            mouseX.set(xPct);
            mouseY.set(yPct);
            mainRef.current?.style.setProperty('--mouse-x', `${xPct}%`);
            mainRef.current?.style.setProperty('--mouse-y', `${yPct}%`);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <div ref={mainRef} className="min-h-screen bg-landing font-sans selection:bg-stone-500 selection:text-white transition-colors duration-500 scroll-smooth overflow-x-hidden relative w-full">
            {/* Ambient Background - fixed so it doesn't affect page height */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="data-mesh data-mesh-moving" />
                <div className="glow-orb w-[800px] h-[800px] bg-stone-500 top-[-30%] left-[-20%] animate-float-slow" />
                <div className="glow-orb w-[600px] h-[600px] bg-sky-500 bottom-[-20%] right-[-20%] animate-float-slow opacity-[0.03]" />
            </div>
            
            <Nav onGetStarted={() => setShowPortalModal(true)} />
            
            <AnimatePresence>
                {showPortalModal && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-2xl"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="max-w-4xl w-full glass-stone border border-white/10 rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-12 relative overflow-y-auto max-h-[90vh] custom-scrollbar"
                        >
                            <button 
                                onClick={() => setShowPortalModal(false)}
                                className="absolute top-10 right-10 w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-stone-500 hover:text-white hover:bg-white/5 transition-all"
                            >
                                <X size={24} />
                            </button>

                            <div className="text-center mb-6 md:mb-10">
                                <h2 className="text-3xl md:text-5xl font-display font-black text-white italic uppercase tracking-tighter mb-2 md:mb-4">Select Portal</h2>
                                <p className="text-stone-500 text-[10px] md:text-lg uppercase font-black tracking-widest italic">Secure Academic Platform</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                                <div 
                                    onClick={() => window.location.href = 'http://localhost:5174/login'}
                                    className="glass-stone group p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-white/5 hover:border-white/20 transition-all cursor-pointer text-center relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 blur-[60px]" />
                                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-stone-100 flex items-center justify-center mx-auto mb-4 md:mb-8 shadow-2xl group-hover:scale-110 transition-transform">
                                        <GraduationCap className="text-stone-900" size={32} />
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-display font-black text-white italic uppercase mb-1 md:mb-2">Student Portal</h3>
                                    <p className="text-stone-500 text-xs md:text-sm font-medium">Access dashboard & academics</p>
                                    <div className="mt-4 md:mt-8 flex items-center justify-center gap-2 text-stone-400 group-hover:text-white transition-colors">
                                        <span className="text-[10px] font-black uppercase tracking-widest">Access Portal</span>
                                        <ArrowRight size={14} />
                                    </div>
                                </div>

                                <div 
                                    onClick={() => window.location.href = 'http://localhost:5173/login'}
                                    className="glass-stone group p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-white/5 hover:border-white/20 transition-all cursor-pointer text-center relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[60px]" />
                                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-emerald-600 flex items-center justify-center mx-auto mb-4 md:mb-8 shadow-2xl group-hover:scale-110 transition-transform">
                                        <ShieldAlert className="text-white" size={32} />
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-display font-black text-white italic uppercase mb-1 md:mb-2">Admin Portal</h3>
                                    <p className="text-stone-500 text-xs md:text-sm font-medium">Administrative dashboard</p>
                                    <div className="mt-4 md:mt-8 flex items-center justify-center gap-2 text-stone-400 group-hover:text-white transition-colors">
                                        <span className="text-[10px] font-black uppercase tracking-widest">Access Portal</span>
                                        <ArrowRight size={14} />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 md:mt-10 text-center pt-6 md:pt-8 border-t border-white/5">
                                <p className="text-stone-600 text-[10px] font-black uppercase tracking-[0.4em] mb-4">New to EduGuard?</p>
                                <button 
                                    onClick={() => window.location.href = 'http://localhost:5174/register'}
                                    className="px-10 py-5 rounded-2xl bg-white text-stone-950 font-black text-[10px] uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-2xl"
                                >
                                    Create Student Account
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {/* Hero Section */}
            <section className="relative pt-32 pb-40 px-8">
                <div className="max-w-7xl mx-auto flex flex-col items-center relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-white/10 bg-stone-900/50 backdrop-blur-xl text-stone-400 text-[10px] uppercase font-black tracking-[0.4em] mb-12 shadow-[0_0_30px_rgba(0,0,0,0.5)]"
                    >
                        <Lock size={12} className="text-emerald-500" />
                        Secure Academic Platform Active
                    </motion.div>
                    
                    <div className="relative mb-12">
                        <motion.h1 
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
                            className="text-7xl md:text-9xl font-display font-black text-white tracking-tighter leading-[0.8] uppercase italic"
                        >
                            Orchestrating <br />
                            <span className="text-gradient">Student Success.</span>
                        </motion.h1>
                        <div className="absolute -top-10 -right-20 w-40 h-40 bg-white/5 blur-[80px] -z-10" />
                    </div>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 1 }}
                        className="text-stone-400 text-lg md:text-2xl max-w-3xl mb-16 font-medium leading-[1.6] opacity-80"
                    >
                        The definitive multi-portal ecosystem for predictive retention. Marrying institutional data with machine intelligence to transform graduation outcomes.
                    </motion.p>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 1 }}
                        className="flex flex-col sm:flex-row items-center gap-6"
                    >
                        <button 
                            onClick={() => setShowPortalModal(true)}
                            className="px-12 py-7 rounded-3xl bg-white text-stone-950 font-black flex items-center gap-6 hover:scale-105 transition-all shadow-[0_30px_60px_-15px_rgba(255,255,255,0.2)] group uppercase text-xs tracking-widest active:scale-95 shrink-0"
                        >
                            Open Portals
                            <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform duration-500 text-stone-400" />
                        </button>
                        <button 
                            onClick={() => window.location.href = 'http://localhost:5174/register'}
                            className="px-12 py-7 rounded-3xl glass-stone border border-white/10 text-white font-black hover:bg-stone-800 transition-all uppercase text-xs tracking-widest group active:scale-95 shrink-0"
                        >
                            Join as Student
                            <ExternalLink size={18} className="ml-3 inline-block opacity-40 group-hover:opacity-100 transition-opacity" />
                        </button>
                    </motion.div>
                </div>

                {/* Central Intelligence Node HUD */}
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
                    className="max-w-6xl mx-auto mt-40 glass-stone rounded-[5rem] p-6 border border-white/10 shadow-[0_100px_100px_-50px_rgba(0,0,0,1)] group"
                >
                    <div className="aspect-[21/9] bg-[#080707] rounded-[4rem] relative overflow-hidden flex items-center justify-center border border-white/5">
                        <div className="grainy" />
                        
                        {/* Dynamic Radar Circles */}
                        {[1, 2, 3].map((i) => (
                            <motion.div
                                key={i}
                                animate={{ scale: [1, 1.4], opacity: [0.2, 0] }}
                                transition={{ duration: 4, repeat: Infinity, delay: i * 1 }}
                                className="absolute border border-stone-500/20 rounded-full"
                                style={{ width: i * 200, height: i * 200 }}
                            />
                        ))}

                        <div className="flex flex-col items-center relative z-10">
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                                className="w-64 h-64 border border-white/5 rounded-full flex items-center justify-center relative"
                            >
                                <div className="absolute inset-4 border border-white/10 rounded-full animate-pulse-slow" />
                                <div className="absolute inset-10 border border-white/5 rounded-full" />
                                <BrainCircuit className="text-white opacity-20" size={100} />
                                
                                {/* Points orbiting */}
                                {[0, 90, 180, 270].map((deg) => (
                                    <div 
                                        key={deg}
                                        className="absolute w-2 h-2 bg-stone-300 rounded-full shadow-[0_0_10px_#fff]"
                                        style={{ transform: `rotate(${deg}deg) translateY(-128px)` }}
                                    />
                                ))}
                            </motion.div>
                            <div className="mt-12 flex flex-col items-center gap-3">
                                <span className="px-6 py-2 rounded-full glass-stone border border-white/10 text-[12px] font-black text-stone-500 uppercase tracking-[0.6em] italic animate-pulse">
                                    System Synchronized
                                </span>
                                <div className="flex gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 opacity-40 shadow-[0_0_8px_#10b981]" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 opacity-20 shadow-[0_0_8px_#10b981]" />
                                </div>
                            </div>
                        </div>

                        {/* Floating Widgets */}
                        <div className="absolute top-12 left-12 glass flex items-center gap-4 p-5 rounded-3xl border border-white/10 shadow-2xl">
                            <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                                <Activity size={24} className="text-white" />
                            </div>
                            <div className="text-left">
                                <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest leading-none mb-1">Risk Level</p>
                                <p className="text-xl font-display font-black text-white italic tracking-tighter">Low</p>
                            </div>
                        </div>

                        <div className="absolute bottom-12 right-12 glass flex items-center gap-4 p-5 rounded-3xl border border-white/10 shadow-2xl">
                             <div className="text-right">
                                <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest leading-none mb-1">Status</p>
                                <div className="flex items-center gap-2">
                                     <span className="text-xl font-display font-black text-white italic tracking-tighter">Active</span>
                                </div>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                                <Cpu size={24} className="text-white" />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Security Section */}
            <section id="security" className="py-40 px-8 relative z-10 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/5 text-emerald-500 text-[10px] uppercase font-black tracking-widest">
                                <ShieldCheck size={14} />
                                Security Pillar
                            </div>
                            <h2 className="text-5xl md:text-7xl font-display font-black text-white uppercase italic tracking-tighter leading-[0.9]">
                                Enterprise Grade <br />
                                <span className="text-stone-500">Data Security.</span>
                            </h2>
                            <p className="text-stone-400 text-lg leading-relaxed max-w-xl font-medium">
                                Institutional data requires the highest level of protection. EduGuard implements modern security architecture, ensuring student privacy is never compromised.
                            </p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8">
                                {[
                                    { icon: Lock, title: "AES-256", desc: "Static & Transit Encryption" },
                                    { icon: Users, title: "FERPA/GDPR", desc: "Global Data Rights Compliance" },
                                    { icon: CheckCircle2, title: "SOC2 Type II", desc: "Verified Operational Security" },
                                    { icon: Search, title: "Audit Logging", desc: "Immutable Access Traceability" }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4 group cursor-default">
                                        <div className="w-10 h-10 rounded-xl glass-stone flex items-center justify-center text-stone-500 group-hover:text-white group-hover:bg-stone-800 transition-all">
                                            <item.icon size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">{item.title}</h4>
                                            <p className="text-stone-600 text-[10px] font-bold uppercase tracking-widest">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="glass-stone p-12 rounded-[5rem] border border-white/5 relative z-10">
                                <div className="aspect-square glass rounded-[4rem] border border-white/10 flex flex-col items-center justify-center gap-10 overflow-hidden relative group">
                                    <div className="grainy" />
                                    <motion.div 
                                        animate={{ 
                                            rotateY: [0, 180, 360],
                                            scale: [1, 1.1, 1]
                                        }}
                                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                        className="w-32 h-32 rounded-3xl bg-stone-100 flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.2)]"
                                    >
                                        <ShieldCheck size={64} className="text-stone-900" />
                                    </motion.div>
                                    <div className="text-center">
                                        <p className="text-white font-display font-black text-xl italic tracking-widest uppercase animate-pulse">Encryption Active</p>
                                        <p className="text-stone-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2">ID: NX-901-SECURE</p>
                                    </div>
                                    {/* Abstract data lines */}
                                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                                        {[...Array(20)].map((_, i) => (
                                            <motion.div 
                                                key={i} 
                                                animate={{ x: [-200, 400], opacity: [0, 1, 0] }}
                                                transition={{ duration: 3, delay: i * 0.2, repeat: Infinity }}
                                                className="h-[1px] bg-white absolute" 
                                                style={{ top: `${i * 5}%`, left: 0, width: '100px' }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -top-10 -right-10 w-64 h-64 bg-emerald-500/10 blur-[100px]" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Infrastructure Section */}
            <section id="infrastructure" className="py-40 px-8 relative z-10 bg-white/[0.01] backdrop-blur-3xl border-y border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-32">
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-stone-800 bg-stone-900/50 text-stone-500 text-[10px] uppercase font-black tracking-[0.4em] mb-8">
                            Scale Operations
                        </div>
                        <h2 className="text-5xl md:text-8xl font-display font-black text-white italic uppercase tracking-tighter leading-none mb-8">
                            High Availability <br />
                            <span className="text-stone-600">Infrastructure.</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            { icon: Server, title: "Distributed Compute", desc: "Regional nodes ensuring sub-50ms latency across global institutional campuses." },
                            { icon: Cpu, title: "AI Acceleration", desc: "Dedicated tensor-core processing for real-time risk regression and pattern detection." },
                            { icon: Globe, title: "Edge Presence", desc: "Global delivery network designed for high-stakes academic environments." }
                        ].map((card, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-stone p-10 rounded-[3rem] border border-white/5 group hover:border-white/20 transition-all"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-stone-900 flex items-center justify-center mb-8 border border-white/5 group-hover:bg-white group-hover:text-stone-900 transition-all duration-500 group-hover:scale-110">
                                    <card.icon size={28} />
                                </div>
                                <h4 className="text-xl font-display font-black text-white italic tracking-tight mb-4 uppercase">{card.title}</h4>
                                <p className="text-stone-500 text-sm leading-relaxed font-medium">{card.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Analysis (Bento) Section */}
            <section id="analysis" className="py-40 px-8 max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
                    <div className="text-left max-w-2xl">
                        <h2 className="text-5xl md:text-7xl font-display font-black text-white italic uppercase tracking-tighter leading-none mb-8">
                            Engineered for <br />
                            <span className="text-stone-500">Student Success.</span>
                        </h2>
                        <p className="text-stone-500 text-lg font-medium leading-relaxed">
                            Every student touchpoint is analyzed, mapped, and predicted. A seamless blend of advanced analytics and institutional workflows.
                        </p>
                    </div>
                    <div className="h-[2px] w-40 bg-white/5 mb-6" />
                </div>

                <div className="bento-grid">
                    <BentoCard 
                        title="Early Warning" 
                        icon={ShieldAlert}
                        className="col-span-full md:col-span-4" 
                        delay={0.1}
                    >
                         <p className="text-stone-400 text-sm max-w-sm leading-relaxed">
                            Proactive identification of academic regression. Using Markov-chain analysis and behavioral vectors to trigger faculty intervention before drop-off occurs.
                         </p>
                         <div className="mt-8 grid grid-cols-4 gap-2">
                             {[...Array(12)].map((_, i) => (
                                <motion.div key={i} animate={{ opacity: [0.1, 0.4, 0.1] }} transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }} className="h-1 bg-rose-500 rounded-full" />
                             ))}
                         </div>
                    </BentoCard>

                    <BentoCard 
                        title="Global Reach" 
                        icon={Globe}
                        className="col-span-full md:col-span-2 bg-emerald-500/5 group-hover:bg-emerald-500/10" 
                        delay={0.2}
                    >
                        <p className="text-stone-500 text-sm leading-relaxed">
                            Cross-departmental synchronization available worldwide.
                        </p>
                    </BentoCard>

                    <BentoCard 
                        title="Career Matrix" 
                        icon={Trophy}
                        className="col-span-full md:col-span-3 lg:col-span-2" 
                        delay={0.3}
                    >
                         <p className="text-stone-400 text-sm leading-relaxed">
                             Continuous mapping of student progress to professional pathways and industry standards.
                         </p>
                    </BentoCard>

                    <BentoCard 
                        title="Deans Analytics" 
                        icon={BarChart3}
                        className="col-span-full md:col-span-3 lg:col-span-4" 
                        delay={0.4}
                    >
                         <div className="flex flex-col md:flex-row items-center gap-10">
                            <p className="text-stone-400 text-sm flex-1 leading-relaxed">
                                Executive dashboards providing multi-cohort analytics, trend regression, and institutional performance monitoring across all demographics.
                            </p>
                            <div className="flex gap-2 items-baseline">
                                {[20, 45, 30, 60, 40].map((h, i) => (
                                    <motion.div key={i} animate={{ height: [`${h}%`, `${h+10}%`, `${h}%`] }} transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }} className="w-4 bg-stone-100 rounded-t-lg opacity-20" style={{ height: `${h}%` }} />
                                ))}
                            </div>
                         </div>
                    </BentoCard>
                </div>
            </section>

            {/* API Section */}
            <section id="api" className="py-40 px-8 relative z-10 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="glass-stone rounded-[5rem] border border-white/10 p-16 md:p-24 relative overflow-hidden">
                        <div className="grainy opacity-10" />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                            <div className="space-y-10">
                                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-sky-500/30 bg-sky-500/5 text-sky-500 text-[10px] uppercase font-black tracking-widest">
                                    <Code2 size={14} />
                                    Developer API
                                </div>
                                <h2 className="text-5xl md:text-7xl font-display font-black text-white uppercase italic tracking-tighter leading-[0.9]">
                                    Universal <br />
                                    <span className="text-stone-500 text-gradient">Data Integration.</span>
                                </h2>
                                <p className="text-stone-400 text-lg leading-relaxed font-medium">
                                    Our headless API allows seamless connection with Canvas, Moodle, and proprietary SIS. Orchestrate student data with zero friction.
                                </p>
                                <div className="flex flex-col gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                        <span className="text-xs font-black text-white uppercase tracking-widest">GraphQL & REST Enabled</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                        <span className="text-xs font-black text-white uppercase tracking-widest">Real-time Webhook Streaming</span>
                                    </div>
                                </div>
                            </div>

                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="glass-stone rounded-[3rem] border border-white/10 p-8 shadow-2xl relative"
                            >
                                <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-stone-700" />
                                        <div className="w-3 h-3 rounded-full bg-stone-700" />
                                        <div className="w-3 h-3 rounded-full bg-stone-700" />
                                    </div>
                                    <span className="text-stone-600 text-[10px] font-black uppercase tracking-widest">eduguard.js</span>
                                </div>
                                <div className="font-mono text-[11px] space-y-3 leading-relaxed">
                                    <p className="text-sky-400 uppercase italic font-bold tracking-widest mb-4">// Initialize Bridge</p>
                                    <p className="text-white opacity-40 italic">const bridge = new EduGuard.Bridge({`{`}</p>
                                    <p className="pl-6 text-white opacity-60 italic">apiKey: "INST_ADMIN_KEY",</p>
                                    <p className="pl-6 text-white opacity-60 italic">endpoint: "eu-central-node"</p>
                                    <p className="text-white opacity-40 italic">{`}`});</p>
                                    <p className="text-white opacity-40 italic mt-6">bridge.on('risk_spike', (student) ={`>`} {`{`}</p>
                                    <p className="pl-6 text-amber-500 italic">notifyFaculty(student.id, "HIGH_RISK_ALERT");</p>
                                    <p className="text-white opacity-40 italic">{`}`});</p>
                                </div>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 blur-[60px]" />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Metrics Section */}
            <section className="py-40 border-y border-white/5 relative bg-white/[0.01] backdrop-blur-xl z-10">
                <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20">
                    {[
                        { label: 'Retention Optimized', value: '94.2%', sub: '+12% institutional Avg' },
                        { label: 'Active Students', value: '1.2M+', sub: 'Real-time sync' },
                        { label: 'Response Latency', value: '<50ms', sub: 'Global infrastructure' },
                        { label: 'Security Standard', value: 'AES-256', sub: 'Military grade' },
                    ].map((stat, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.8 }}
                            className="group cursor-default"
                        >
                            <div className="text-5xl md:text-7xl font-display font-black text-white italic tracking-tighter mb-4 group-hover:scale-110 transition-transform origin-left duration-500">
                                {stat.value}
                            </div>
                            <p className="text-stone-300 text-[10px] font-black uppercase tracking-[0.4em] mb-2">{stat.label}</p>
                            <p className="text-stone-600 text-[10px] font-bold uppercase tracking-widest">{stat.sub}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Contact Modal */}
            <AnimatePresence>
                {showContactModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-2xl"
                        onClick={() => setShowContactModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={e => e.stopPropagation()}
                            className="max-w-lg w-full glass-stone border border-white/10 rounded-[3rem] p-10 md:p-14 relative"
                        >
                            <button
                                onClick={() => setShowContactModal(false)}
                                className="absolute top-8 right-8 w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-stone-500 hover:text-white hover:bg-white/5 transition-all"
                            >
                                <X size={20} />
                            </button>
                            {contactSent ? (
                                <div className="flex flex-col items-center justify-center py-10 gap-4">
                                    <CheckCircle2 size={48} className="text-emerald-400" />
                                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Message Sent!</h3>
                                    <p className="text-stone-500 text-sm text-center">Our team will get back to you within 24 hours.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-8">
                                        <h3 className="text-3xl font-display font-black text-white italic uppercase tracking-tighter mb-2">Contact Us</h3>
                                        <p className="text-stone-500 text-sm">Fill out the form and our team will reach out shortly.</p>
                                    </div>
                                    <form onSubmit={handleContactSubmit} className="space-y-4">
                                        <input
                                            required
                                            type="text"
                                            placeholder="Your Name"
                                            value={contactForm.name}
                                            onChange={e => setContactForm(p => ({...p, name: e.target.value}))}
                                            className="w-full bg-stone-900/60 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm placeholder-stone-600 focus:outline-none focus:border-white/30 transition-colors"
                                        />
                                        <input
                                            required
                                            type="email"
                                            placeholder="Work Email"
                                            value={contactForm.email}
                                            onChange={e => setContactForm(p => ({...p, email: e.target.value}))}
                                            className="w-full bg-stone-900/60 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm placeholder-stone-600 focus:outline-none focus:border-white/30 transition-colors"
                                        />
                                        <textarea
                                            required
                                            rows={4}
                                            placeholder="How can we help?"
                                            value={contactForm.message}
                                            onChange={e => setContactForm(p => ({...p, message: e.target.value}))}
                                            className="w-full bg-stone-900/60 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm placeholder-stone-600 focus:outline-none focus:border-white/30 transition-colors resize-none"
                                        />
                                        <button
                                            type="submit"
                                            className="w-full py-4 rounded-2xl bg-white text-stone-950 font-black text-[11px] uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl"
                                        >
                                            Send Message
                                        </button>
                                    </form>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* CTA / Final Section */}
            <section id="start" className="py-40 px-8 relative overflow-hidden text-center z-10">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        whileInView={{ scale: [0.95, 1], opacity: [0, 1] }}
                        transition={{ duration: 1 }}
                        className="glass-stone p-16 md:p-24 rounded-[5rem] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,1)] relative overflow-hidden"
                    >
                        <div className="grainy" />
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/[0.02] blur-[150px] -z-10" />
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-stone-400 text-[10px] uppercase font-black tracking-widest mb-8">
                            <Mail size={12} className="text-emerald-400" />
                            Ready to get started?
                        </div>
                        <h2 className="text-5xl md:text-7xl font-display font-black text-white uppercase italic tracking-tighter mb-6 leading-[0.9]">
                            Improve Student<br />
                            <span className="text-stone-500">Retention Today.</span>
                        </h2>
                        <p className="text-stone-500 text-lg mb-12 max-w-xl mx-auto font-medium leading-relaxed">
                            Join institutions already using EduGuard to identify at-risk students and improve graduation rates.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 relative z-10">
                            <button
                                onClick={() => setShowContactModal(true)}
                                className="px-10 py-5 rounded-2xl bg-white text-stone-950 font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                            >
                                <Mail size={16} />
                                Contact Sales
                            </button>
                            <button
                                onClick={() => scrollToSection('api')}
                                className="px-10 py-5 rounded-2xl glass-stone border border-white/10 text-white font-black text-[11px] uppercase tracking-[0.3em] hover:bg-white/5 transition-all shadow-xl active:scale-95 flex items-center gap-3"
                            >
                                <Code2 size={16} />
                                View API Docs
                            </button>
                            <button
                                onClick={() => setShowPortalModal(true)}
                                className="px-10 py-5 rounded-2xl border border-white/10 text-stone-400 font-black text-[11px] uppercase tracking-[0.3em] hover:text-white hover:border-white/30 transition-all active:scale-95 flex items-center gap-3"
                            >
                                <ArrowRight size={16} />
                                Open Portal
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Global Footer */}
            <footer className="py-20 px-8 bg-stone-950 text-white border-t border-white/5 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-16">
                        {/* Brand col */}
                        <div className="max-w-xs">
                            <div className="flex items-center gap-3 mb-6 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                                <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center p-2 shadow-2xl group-hover:rotate-[10deg] transition-all">
                                    <ShieldAlert className="text-stone-900" size={22} />
                                </div>
                                <span className="font-display font-black text-2xl tracking-tighter text-white uppercase italic">EduGuard</span>
                            </div>
                            <p className="text-stone-500 text-sm leading-relaxed mb-8">
                                Helping institutions identify at-risk students early and improve graduation outcomes through data-driven insights.
                            </p>
                            {/* Social Icons */}
                            <div className="flex gap-3">
                                {[
                                    { Icon: AtSign, label: 'Twitter', href: 'https://twitter.com' },
                                    { Icon: Briefcase, label: 'LinkedIn', href: 'https://linkedin.com' },
                                    { Icon: BookOpen, label: 'GitHub', href: 'https://github.com' },
                                    { Icon: Mail, label: 'Email', href: 'mailto:hello@eduguard.io' },
                                ].map(({ Icon, label, href }) => (
                                    <a
                                        key={label}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title={label}
                                        className="w-10 h-10 rounded-xl bg-stone-900 border border-white/5 flex items-center justify-center hover:bg-stone-800 hover:border-white/20 hover:text-white transition-all cursor-pointer text-stone-500 group"
                                    >
                                        <Icon size={16} className="group-hover:scale-110 transition-transform" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Links grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
                            {[
                                { head: 'Platform', items: [
                                    { name: 'Dashboard', action: () => scrollToSection('analysis') },
                                    { name: 'Analytics', action: () => scrollToSection('analysis') },
                                    { name: 'Security', action: () => scrollToSection('security') },
                                    { name: 'API Access', action: () => scrollToSection('api') },
                                ]},
                                { head: 'Company', items: [
                                    { name: 'About Us', action: () => scrollToSection('infrastructure') },
                                    { name: 'Contact Sales', action: () => setShowContactModal(true) },
                                    { name: 'Student Portal', action: () => window.location.href = 'http://localhost:5174/login' },
                                    { name: 'Admin Portal', action: () => window.location.href = 'http://localhost:5173/login' },
                                ]},
                                { head: 'Legal', items: [
                                    { name: 'Privacy Policy', action: () => {} },
                                    { name: 'Terms of Service', action: () => {} },
                                    { name: 'GDPR', action: () => scrollToSection('security') },
                                    { name: 'Compliance', action: () => scrollToSection('security') },
                                ]},
                            ].map((col, i) => (
                                <div key={i} className="space-y-5">
                                    <h5 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.4em]">{col.head}</h5>
                                    <div className="space-y-3 flex flex-col items-start">
                                        {col.items.map(item => (
                                            <button
                                                key={item.name}
                                                onClick={item.action}
                                                className="text-stone-600 text-[11px] font-semibold hover:text-white transition-all cursor-pointer tracking-wide hover:translate-x-1 transform text-left"
                                            >
                                                {item.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <span className="text-stone-700 text-[11px] font-medium">
                            © {new Date().getFullYear()} EduGuard. All rights reserved.
                        </span>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_#10b981]" />
                            <span className="text-stone-700 text-[11px] font-medium">All systems operational</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;

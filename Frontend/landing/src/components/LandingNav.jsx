import React, { useState, useEffect } from 'react';
import { ShieldAlert, Menu, X } from 'lucide-react';

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

const LandingNav = ({ onGetStarted }) => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', fn);
        return () => window.removeEventListener('scroll', fn);
    }, []);

    const links = [
        { name: 'Features', id: 'features' },
        { name: 'How It Works', id: 'how' },
        { name: 'Metrics', id: 'metrics' },
        { name: 'API', id: 'api' },
    ];

    return (
        <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-[#0c0a09]/90 backdrop-blur-2xl border-b border-white/5 shadow-2xl' : 'bg-transparent'}`}>
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/30 group-hover:scale-110 transition-transform">
                        <ShieldAlert size={20} className="text-white" />
                    </div>
                    <span className="font-black text-xl tracking-tighter text-white uppercase italic">EduGuard</span>
                </div>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    {links.map(l => (
                        <button key={l.id} onClick={() => scrollTo(l.id)}
                            className="text-stone-500 text-[10px] font-black uppercase tracking-[0.3em] hover:text-white transition-colors duration-300">
                            {l.name}
                        </button>
                    ))}
                </div>

                {/* CTA */}
                <div className="hidden md:flex items-center gap-4">
                    <button onClick={() => window.location.href = 'http://localhost:5173/login'}
                        className="text-stone-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">
                        Admin
                    </button>
                    <button onClick={onGetStarted}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-sky-500/20">
                        Get Started
                    </button>
                </div>

                {/* Mobile toggle */}
                <button className="md:hidden text-white" onClick={() => setMenuOpen(v => !v)}>
                    {menuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="md:hidden bg-[#0c0a09]/95 backdrop-blur-2xl border-b border-white/5 px-6 py-6 space-y-4">
                    {links.map(l => (
                        <button key={l.id} onClick={() => { scrollTo(l.id); setMenuOpen(false); }}
                            className="block text-stone-400 text-sm font-bold uppercase tracking-widest hover:text-white transition-colors">
                            {l.name}
                        </button>
                    ))}
                    <button onClick={onGetStarted}
                        className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-[10px] font-black uppercase tracking-widest">
                        Get Started
                    </button>
                </div>
            )}
        </nav>
    );
};

export default LandingNav;

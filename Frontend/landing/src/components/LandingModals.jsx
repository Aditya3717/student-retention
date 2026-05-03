import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, GraduationCap, ShieldAlert, X, CheckCircle2 } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

/* ── Portal Modal ── */
export const PortalModal = ({ onClose }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-2xl"
        onClick={onClose}>
        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
            onClick={e => e.stopPropagation()}
            className="max-w-3xl w-full bg-[#0f0e0d] border border-white/10 rounded-[3rem] p-10 relative shadow-2xl overflow-y-auto max-h-[90vh]">
            <button onClick={onClose}
                className="absolute top-8 right-8 w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-stone-500 hover:text-white hover:bg-white/5 transition-all">
                <X size={18} />
            </button>

            <div className="text-center mb-10">
                <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-2">Select Portal</h2>
                <p className="text-stone-500 text-[10px] font-black uppercase tracking-[0.4em]">Secure Academic Platform</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div onClick={() => window.location.href = 'http://localhost:5174/login'}
                    className="group bg-white/[0.02] hover:bg-sky-500/5 border border-white/5 hover:border-sky-500/30 rounded-[2rem] p-8 cursor-pointer text-center transition-all">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-sky-500/20 group-hover:scale-110 transition-transform">
                        <GraduationCap size={30} className="text-white" />
                    </div>
                    <h3 className="text-xl font-black text-white italic uppercase mb-2">Student Portal</h3>
                    <p className="text-stone-500 text-sm mb-6">Access dashboard, academics & career tools</p>
                    <div className="flex items-center justify-center gap-2 text-sky-400">
                        <span className="text-[10px] font-black uppercase tracking-widest">Access Portal</span>
                        <ArrowRight size={14} />
                    </div>
                </div>

                <div onClick={() => window.location.href = 'http://localhost:5173/login'}
                    className="group bg-white/[0.02] hover:bg-emerald-500/5 border border-white/5 hover:border-emerald-500/30 rounded-[2rem] p-8 cursor-pointer text-center transition-all">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                        <ShieldAlert size={30} className="text-white" />
                    </div>
                    <h3 className="text-xl font-black text-white italic uppercase mb-2">Admin Portal</h3>
                    <p className="text-stone-500 text-sm mb-6">Institutional dashboard & risk analytics</p>
                    <div className="flex items-center justify-center gap-2 text-emerald-400">
                        <span className="text-[10px] font-black uppercase tracking-widest">Access Portal</span>
                        <ArrowRight size={14} />
                    </div>
                </div>
            </div>

            <div className="border-t border-white/5 pt-8 text-center">
                <p className="text-stone-600 text-[10px] font-black uppercase tracking-widest mb-4">New to EduGuard?</p>
                <button onClick={() => window.location.href = 'http://localhost:5174/register'}
                    className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-sky-500/20">
                    Create Student Account
                </button>
            </div>
        </motion.div>
    </motion.div>
);

/* ── Contact Modal ── */
export const ContactModal = ({ onClose }) => {
    const [form, setForm] = React.useState({ name: '', email: '', message: '' });
    const [sent, setSent] = React.useState(false);

    const submit = (e) => {
        e.preventDefault();
        setSent(true);
        setTimeout(() => { setSent(false); onClose(); }, 2500);
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-2xl"
            onClick={onClose}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                onClick={e => e.stopPropagation()}
                className="max-w-md w-full bg-[#0f0e0d] border border-white/10 rounded-[2.5rem] p-10 relative shadow-2xl">
                <button onClick={onClose}
                    className="absolute top-8 right-8 w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-stone-500 hover:text-white transition-all">
                    <X size={18} />
                </button>

                {sent ? (
                    <div className="flex flex-col items-center py-12 gap-4">
                        <CheckCircle2 size={48} className="text-emerald-400" />
                        <h3 className="text-2xl font-black text-white uppercase italic">Message Sent!</h3>
                        <p className="text-stone-500 text-sm text-center">We'll get back to you within 24 hours.</p>
                    </div>
                ) : (
                    <>
                        <div className="mb-8">
                            <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2">Contact Us</h3>
                            <p className="text-stone-500 text-sm">Tell us about your institution's needs.</p>
                        </div>
                        <form onSubmit={submit} className="space-y-4">
                            {[
                                { key: 'name', type: 'text', placeholder: 'Your Name' },
                                { key: 'email', type: 'email', placeholder: 'Work Email' },
                            ].map(f => (
                                <input key={f.key} required type={f.type} placeholder={f.placeholder}
                                    value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white text-sm placeholder-stone-600 focus:outline-none focus:border-sky-500/50 transition-colors" />
                            ))}
                            <textarea required rows={4} placeholder="How can we help?"
                                value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white text-sm placeholder-stone-600 focus:outline-none focus:border-sky-500/50 transition-colors resize-none" />
                            <button type="submit"
                                className="w-full py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-black text-[11px] uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl">
                                Send Message
                            </button>
                        </form>
                    </>
                )}
            </motion.div>
        </motion.div>
    );
};

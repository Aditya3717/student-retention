import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, GraduationCap, ShieldAlert, X, CheckCircle2 } from 'lucide-react';

/* ── Portal Modal ── */
export const PortalModal = ({ onClose }) => (
    <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="modal-overlay" onClick={onClose}
    >
        <motion.div
            initial={{ scale: 0.97, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.97, y: 12 }}
            onClick={e => e.stopPropagation()} className="modal"
        >
            <button onClick={onClose} className="modal-close"><X size={15} /></button>

            <h2 className="modal-title">Choose your portal</h2>
            <p className="modal-sub">Secure academic platform — pick the right access level.</p>

            <div className="portal-grid">
                <div
                    onClick={() => window.location.href = 'http://localhost:5174/login'}
                    className="portal-card" style={{ '--portal-accent': '#3b82f6' }}
                >
                    <div style={{ width: 36, height: 36, background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, borderRadius: 4 }}>
                        <GraduationCap size={20} color="#3b82f6" />
                    </div>
                    <h3 className="portal-card-title">Student portal</h3>
                    <p className="portal-card-desc">Your dashboard, academics & career tools</p>
                    <div className="portal-card-cta" style={{ '--portal-accent': '#3b82f6' }}>
                        <span>Access portal</span>
                        <ArrowRight size={12} />
                    </div>
                </div>

                <div
                    onClick={() => window.location.href = 'http://localhost:5173/login'}
                    className="portal-card" style={{ '--portal-accent': '#22c55e' }}
                >
                    <div style={{ width: 36, height: 36, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, borderRadius: 4 }}>
                        <ShieldAlert size={20} color="#22c55e" />
                    </div>
                    <h3 className="portal-card-title">Admin portal</h3>
                    <p className="portal-card-desc">Institutional dashboard & risk analytics</p>
                    <div className="portal-card-cta" style={{ '--portal-accent': '#22c55e' }}>
                        <span>Access portal</span>
                        <ArrowRight size={12} />
                    </div>
                </div>
            </div>

            <div className="modal-divider" />
            <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12 }}>New to EduGuard?</p>
            <button
                onClick={() => window.location.href = 'http://localhost:5174/register'}
                className="btn btn-primary"
            >
                Create student account
            </button>
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
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="modal-overlay" style={{ zIndex: 200 }} onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.97, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.97, y: 12 }}
                onClick={e => e.stopPropagation()} className="modal" style={{ maxWidth: 420 }}
            >
                <button onClick={onClose} className="modal-close"><X size={15} /></button>

                {sent ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 0', gap: 16 }}>
                        <CheckCircle2 size={36} color="var(--green)" />
                        <h3 className="modal-title" style={{ textAlign: 'center' }}>Message sent!</h3>
                        <p style={{ color: 'var(--muted)', fontSize: 14, textAlign: 'center' }}>We'll get back to you within 24 hours.</p>
                    </div>
                ) : (
                    <>
                        <h3 className="modal-title">Get in touch</h3>
                        <p className="modal-sub">Tell us about your institution's needs.</p>
                        <form onSubmit={submit}>
                            {[
                                { key: 'name',  type: 'text',  label: 'Your name',  placeholder: 'Jane Smith'        },
                                { key: 'email', type: 'email', label: 'Work email', placeholder: 'jane@university.edu' },
                            ].map(f => (
                                <div key={f.key} className="form-group">
                                    <label className="form-label">{f.label}</label>
                                    <input required type={f.type} placeholder={f.placeholder}
                                        value={form[f.key]}
                                        onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                                        className="form-input" />
                                </div>
                            ))}
                            <div className="form-group">
                                <label className="form-label">Message</label>
                                <textarea required rows={4} placeholder="How can we help?"
                                    value={form.message}
                                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                                    className="form-input form-textarea" />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: 8 }}>
                                Send message
                            </button>
                        </form>
                    </>
                )}
            </motion.div>
        </motion.div>
    );
};

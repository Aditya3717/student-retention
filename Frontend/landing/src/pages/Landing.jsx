import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import LandingNav from '../components/LandingNav';
import LandingHero from '../components/LandingHero';
import LandingFeatures from '../components/LandingFeatures';
import { PortalModal, ContactModal } from '../components/LandingModals';
import {
    ShieldAlert, ArrowRight, Mail, Code2, Lock,
    CheckCircle2, ShieldCheck, Search, Users, Activity
} from 'lucide-react';

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

const steps = [
    { num: '01', title: 'Import student data',   desc: 'Upload Excel/CSV or connect via API. Student profiles, grades, and attendance — all ingested automatically.'                                          },
    { num: '02', title: 'AI analysis runs',       desc: 'Our RandomForest model processes academic patterns, attendance dips, and grade trajectories to compute dropout risk scores.'                       },
    { num: '03', title: 'Alerts fire instantly',  desc: "Faculty and admins get notified the moment a student's risk profile spikes. Intervene before it's too late."                                      },
    { num: '04', title: 'Students self-serve',    desc: "Students access their own dashboard, track academic progress, and map their skills to career paths in real time."                                  },
];

const metrics = [
    { value: '94.2%',   label: 'Retention rate',   sub: '+12% vs institutional avg' },
    { value: '8,763',   label: 'Students tracked',  sub: 'Real-time sync'            },
    { value: '<50ms',   label: 'Alert latency',     sub: 'Global infrastructure'     },
    { value: 'AES-256', label: 'Encryption',        sub: 'Military-grade security'   },
];

const Landing = () => {
    const [showPortal,  setShowPortal]  = useState(false);
    const [showContact, setShowContact] = useState(false);

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', overflowX: 'hidden' }}>
            <LandingNav onGetStarted={() => setShowPortal(true)} />

            <AnimatePresence>
                {showPortal  && <PortalModal  onClose={() => setShowPortal(false)}  />}
                {showContact && <ContactModal onClose={() => setShowContact(false)} />}
            </AnimatePresence>

            <LandingHero onGetStarted={() => setShowPortal(true)} />

            <div className="divider" />
            <LandingFeatures />

            {/* ── How it works ── */}
            <div className="divider" />
            <section id="how" className="section">
                <div className="section-inner">
                    <div style={{ display: 'grid', gap: 64, gridTemplateColumns: '1fr' }}>
                        <div style={{ maxWidth: 480 }}>
                            <span className="section-label">Simple by design</span>
                            <h2 className="section-h2">How it works.</h2>
                            <p className="section-desc">
                                From setup to first alert in minutes. No PhD in data science required.
                            </p>
                        </div>
                        <div className="steps-wrap">
                            <div className="steps-line" />
                            <div className="steps-list">
                                {steps.map((s, i) => (
                                    <div key={i} className="step">
                                        <div className="step-num">{s.num}</div>
                                        <div className="step-body">
                                            <h3 className="step-title">{s.title}</h3>
                                            <p className="step-desc">{s.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Metrics ── */}
            <div className="divider" />
            <section id="metrics">
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <div className="metrics-grid">
                        {metrics.map((m, i) => (
                            <div key={i} className="metric">
                                <p className="metric-val">{m.value}</p>
                                <p className="metric-label">{m.label}</p>
                                <p className="metric-sub">{m.sub}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Security ── */}
            <div className="divider" />
            <section id="security" className="section">
                <div className="section-inner">
                    <div className="security-grid">
                        <div>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '4px 10px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 4, marginBottom: 20 }}>
                                <ShieldCheck size={12} color="var(--green)" />
                                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--green)', letterSpacing: '0.06em' }}>Security pillar</span>
                            </div>
                            <h2 className="section-h2" style={{ marginBottom: 16 }}>
                                Enterprise-grade<br />data security.
                            </h2>
                            <p className="section-desc" style={{ marginBottom: 32 }}>
                                Institutional data demands the highest protection. EduGuard implements
                                modern security architecture ensuring student privacy is never compromised.
                            </p>
                            <div className="security-items">
                                {[
                                    { icon: Lock,         t: 'AES-256',      d: 'Encryption at rest & in transit'  },
                                    { icon: Users,        t: 'FERPA / GDPR', d: 'Global data compliance'           },
                                    { icon: CheckCircle2, t: 'SOC 2 Type II', d: 'Verified operational security'   },
                                    { icon: Search,       t: 'Audit logs',   d: 'Immutable access traceability'    },
                                ].map((it, i) => (
                                    <div key={i} className="security-item">
                                        <div className="security-icon"><it.icon size={15} /></div>
                                        <div>
                                            <p className="security-item-title">{it.t}</p>
                                            <p className="security-item-desc">{it.d}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="security-visual">
                            <div style={{ width: 96, height: 96, border: '1px solid rgba(34,197,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', borderRadius: '50%' }}>
                                <div style={{ position: 'absolute', inset: 12, border: '1px solid rgba(34,197,94,0.08)', borderRadius: '50%' }} />
                                <ShieldCheck size={36} color="rgba(34,197,94,0.3)" />
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ color: 'var(--text)', fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Encryption active</p>
                                <p style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--mono)' }}>ID: NX-901-SECURE</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── API ── */}
            <div className="divider" />
            <section id="api" className="section">
                <div className="section-inner">
                    <div className="api-grid">
                        <div>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '4px 10px', background: 'var(--gold-dim)', border: '1px solid var(--gold-border)', borderRadius: 4, marginBottom: 20 }}>
                                <Code2 size={12} color="var(--gold)" />
                                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--gold)', letterSpacing: '0.06em' }}>Developer API</span>
                            </div>
                            <h2 className="section-h2" style={{ marginBottom: 16 }}>
                                Universal<br />data integration.
                            </h2>
                            <p className="section-desc" style={{ marginBottom: 24 }}>
                                Connect Canvas, Moodle, or any proprietary SIS. Orchestrate
                                student data with zero friction.
                            </p>
                            <div className="api-items">
                                {['GraphQL & REST enabled', 'Real-time webhook streaming', 'Canvas & Moodle connectors'].map(f => (
                                    <div key={f} className="api-item">
                                        <div className="api-item-dot" />
                                        <span className="api-item-text">{f}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="code-block">
                            <div className="code-header">
                                <div className="code-dot" style={{ background: '#ef4444' }} />
                                <div className="code-dot" style={{ background: '#f59e0b' }} />
                                <div className="code-dot" style={{ background: '#22c55e' }} />
                                <span className="code-filename">eduguard.js</span>
                            </div>
                            <div className="code-body">
                                <p className="code-comment">// Initialize bridge</p>
                                <p className="code-base">const bridge = new <span className="code-key">EduGuard</span>.Bridge({'({'})</p>
                                <p className="code-base" style={{ paddingLeft: 16 }}>apiKey: <span className="code-val">"INST_KEY"</span>,</p>
                                <p className="code-base" style={{ paddingLeft: 16 }}>endpoint: <span className="code-val">"eu-central"</span></p>
                                <p className="code-base">{'});'}</p>
                                <br />
                                <p className="code-base">bridge.<span className="code-fn">on</span>(<span className="code-val">'risk_spike'</span>, student {'=>'} {'{'}</p>
                                <p className="code-fn" style={{ paddingLeft: 16 }}>notifyFaculty(student.id);</p>
                                <p className="code-base">{'}'});</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <div className="divider" />
            <section className="section">
                <div className="section-inner">
                    <div className="cta-box">
                        <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Mail size={12} color="var(--green)" />
                            Ready to improve outcomes?
                        </p>
                        <h2 className="section-h2" style={{ marginBottom: 16 }}>
                            Improve student<br />retention today.
                        </h2>
                        <p className="section-desc">
                            Join institutions already using EduGuard to identify at-risk students
                            and dramatically improve graduation rates.
                        </p>
                        <div className="cta-actions">
                            <button onClick={() => setShowContact(true)} className="btn btn-primary btn-lg">
                                <Mail size={14} /> Contact sales
                            </button>
                            <button onClick={() => setShowPortal(true)} className="btn btn-outline btn-lg">
                                <ArrowRight size={14} /> Open portal
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="footer">
                <div className="footer-inner">
                    <div className="nav-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ cursor: 'pointer' }}>
                        <div className="nav-logo-icon"><ShieldAlert size={14} /></div>
                        <span className="nav-logo-name">EduGuard</span>
                    </div>
                    <p className="footer-copy">© 2026 EduGuard · AI-powered student retention</p>
                    <div className="footer-links">
                        {['Features', 'How it works', 'API'].map(l => (
                            <button key={l} onClick={() => scrollTo(l.toLowerCase().replace(/ /g, ''))} className="footer-link">
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

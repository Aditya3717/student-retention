import React from 'react';
import { ArrowRight, ShieldCheck, Zap, TrendingUp, Lock } from 'lucide-react';

const Hero = ({ onGetStarted }) => (
    <section className="hero">
        <div className="hero-grid-bg" />
        <div className="hero-glow" />

        <div className="hero-inner">
            <div className="hero-label">
                <div className="hero-label-dot" />
                <span className="hero-label-text">AI-powered student retention platform</span>
            </div>

            <h1 className="hero-h1">
                Retain every<br />
                <span>student.</span>
            </h1>

            <p className="hero-sub">
                Predict dropout risk before it's too late. Our ML engine gives faculty
                and admins the insights they need to step in early and keep students on track.
            </p>

            <div className="hero-cta">
                <button onClick={onGetStarted} className="btn btn-primary btn-lg">
                    Open platform
                    <ArrowRight size={15} />
                </button>
                <button
                    onClick={() => window.location.href = 'http://localhost:5174/register'}
                    className="btn btn-outline btn-lg"
                >
                    Join as student
                </button>
            </div>

            <div className="hero-trust">
                {[
                    { icon: ShieldCheck, label: 'AES-256 encrypted' },
                    { icon: Zap,         label: 'Real-time alerts'  },
                    { icon: TrendingUp,  label: '94.2% retention'   },
                    { icon: Lock,        label: 'FERPA compliant'   },
                ].map(({ icon: Icon, label }) => (
                    <div key={label} className="trust-item">
                        <Icon size={13} />
                        <span>{label}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* Dashboard mockup */}
        <div className="hero-mockup">
            <div className="mockup-shell">
                <div className="mockup-titlebar">
                    <div className="m-dot" style={{ background: '#ef4444' }} />
                    <div className="m-dot" style={{ background: '#f59e0b' }} />
                    <div className="m-dot" style={{ background: '#22c55e' }} />
                    <div className="mockup-url">app.eduguard.io / admin / dashboard</div>
                </div>
                <div className="mockup-body">
                    <div className="mockup-stats">
                        {[
                            { label: 'At-risk students', value: '47',    color: '#ef4444' },
                            { label: 'Avg CGPA',         value: '7.82',  color: '#3b82f6' },
                            { label: 'Attendance',       value: '84%',   color: '#22c55e' },
                            { label: 'Retention rate',   value: '94.2%', color: '#d4a847' },
                        ].map((c, i) => (
                            <div key={i} className="mockup-stat" style={{ borderTopColor: c.color }}>
                                <p className="m-val" style={{ color: c.color }}>{c.value}</p>
                                <p className="m-lbl">{c.label}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mockup-charts">
                        <div className="mockup-chart">
                            {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                                <div key={i} className="m-bar" style={{ height: `${h}%` }} />
                            ))}
                        </div>
                        <div className="mockup-donut">
                            <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'conic-gradient(#ef4444 0% 18%, #d4a847 18% 38%, #22c55e 38% 100%)', boxShadow: '0 0 0 8px var(--bg-3)' }} />
                            <div>
                                <p style={{ fontSize: 9, color: 'var(--muted)', marginBottom: 2 }}>Risk</p>
                                <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', fontFamily: 'var(--mono)' }}>18% hi</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

export default Hero;

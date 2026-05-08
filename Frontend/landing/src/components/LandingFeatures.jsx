import React from 'react';
import { BrainCircuit, BarChart3, ShieldAlert, Briefcase, GraduationCap, Zap } from 'lucide-react';

const features = [
    { icon: BrainCircuit,  title: 'ML risk engine',           desc: 'RandomForest model trained on real academic data predicts dropout risk weeks before it\'s obvious — intervention happens earlier.',  tag: 'AI powered'   },
    { icon: BarChart3,     title: 'Dean\'s analytics',         desc: 'Batch-wide CGPA distributions, semester trends, attendance heatmaps, and cohort comparisons — all in real time.',                  tag: 'Admin tools'  },
    { icon: ShieldAlert,   title: 'Early warning alerts',      desc: 'Automatic faculty notifications when a student\'s risk profile spikes. No more manually sifting through hundreds of spreadsheets.', tag: 'Proactive'    },
    { icon: Briefcase,     title: 'Career pathway strategist', desc: 'Students map skills to industry roles. Match percentages update live as skills are logged, synced to their dashboard instantly.',   tag: 'Student tools'},
    { icon: GraduationCap, title: 'Student portal',            desc: 'Full academic history, semester-by-semester GPA trajectory, subject-level attendance tracking and grade insights.',                  tag: 'Self-service' },
    { icon: Zap,           title: 'Instant sync',              desc: 'A new risk score triggers notifications, dashboards, and logs in under 50ms. Changes propagate across the entire platform instantly.', tag: 'Real-time'    },
];

const LandingFeatures = () => (
    <section id="features" className="section" style={{ paddingTop: 0 }}>
        <div className="section-inner">
            <div className="features-header">
                <div>
                    <span className="section-label">Platform capabilities</span>
                    <h2 className="section-h2">
                        Built for the<br />whole institution.
                    </h2>
                </div>
                <div className="features-header-right">
                    <p className="features-header-desc">
                        A complete ecosystem — from AI-driven risk prediction to student self-service career tools.
                        One platform, every stakeholder covered.
                    </p>
                    <p style={{ fontSize: 12, color: 'var(--muted)' }}>6 modules · 3 user roles · 1 source of truth</p>
                </div>
            </div>

            <div className="features-grid">
                {features.map((f, i) => (
                    <div key={i} className="feature-card">
                        <span className="feature-num" aria-hidden="true">
                            {String(i + 1).padStart(2, '0')}
                        </span>
                        <p className="feature-tag">{f.tag}</p>
                        <h3 className="feature-title">{f.title}</h3>
                        <p className="feature-desc">{f.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default LandingFeatures;

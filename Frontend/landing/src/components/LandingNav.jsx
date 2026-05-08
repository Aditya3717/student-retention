import React, { useState, useEffect } from 'react';
import { ShieldAlert, Menu, X } from 'lucide-react';

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

const LandingNav = ({ onGetStarted }) => {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', fn);
        return () => window.removeEventListener('scroll', fn);
    }, []);

    const links = [
        { label: 'Features',    id: 'features' },
        { label: 'How it works', id: 'how'      },
        { label: 'Metrics',     id: 'metrics'   },
        { label: 'API',         id: 'api'        },
    ];

    return (
        <nav className={`nav${scrolled ? ' nav--scrolled' : ''}`}>
            <div className="nav-inner">
                <div className="nav-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <div className="nav-logo-icon">
                        <ShieldAlert size={15} />
                    </div>
                    <span className="nav-logo-name">EduGuard</span>
                </div>

                <div className="nav-links">
                    {links.map(l => (
                        <button key={l.id} onClick={() => scrollTo(l.id)} className="nav-link">
                            {l.label}
                        </button>
                    ))}
                </div>

                <div className="nav-actions">
                    <button onClick={() => window.location.href = 'http://localhost:5173/login'} className="nav-link">
                        Admin
                    </button>
                    <button onClick={onGetStarted} className="btn btn-primary" style={{ padding: '8px 16px' }}>
                        Get started
                    </button>
                </div>

                <button className="nav-toggle" onClick={() => setOpen(v => !v)}>
                    {open ? <X size={18} /> : <Menu size={18} />}
                </button>
            </div>

            {open && (
                <div className="mobile-menu">
                    {links.map(l => (
                        <button key={l.id} onClick={() => { scrollTo(l.id); setOpen(false); }} className="nav-link" style={{ textAlign: 'left', padding: '10px 0' }}>
                            {l.label}
                        </button>
                    ))}
                    <button onClick={onGetStarted} className="btn btn-primary" style={{ marginTop: '8px' }}>
                        Get started
                    </button>
                </div>
            )}
        </nav>
    );
};

export default LandingNav;

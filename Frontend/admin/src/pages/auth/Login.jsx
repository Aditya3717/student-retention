import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';
import {
    ShieldCheck,
    Lock,
    User,
    Eye,
    EyeOff,
    ArrowRight,
    Loader2,
    AlertCircle
} from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        setIsLoading(true);

        try {
            const response = await api.post('/auth/login', {
                email,
                password
            });

            if (response.data.success) {
                if (response.data.user.role.toLowerCase() !== 'admin') {
                    setError('Access Denied: Admin privileges required');
                    setIsLoading(false);
                    return;
                }

                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                window.location.href = '/admin';
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            background: 'var(--ink)',
            fontFamily: 'var(--font-body)',
            color: 'var(--paper)',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Left column — branding */}
            <div style={{
                display: 'none',
                flex: '0 0 42%',
                background: 'var(--ink-soft)',
                borderRight: '1px solid var(--ink-border)',
                padding: '64px',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
            }} className="login-left-col">
                <div style={{
                    position: 'absolute', top: 0, right: 0,
                    width: '1px', height: '100%',
                    background: 'linear-gradient(to bottom, transparent, var(--signal) 40%, transparent)'
                }} />
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '96px' }}>
                        <div style={{
                            width: '32px', height: '32px', background: 'var(--signal)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            clipPath: 'polygon(0 0, 100% 0, 100% 75%, 75% 100%, 0 100%)'
                        }}>
                            <ShieldCheck size={16} color="white" />
                        </div>
                        <span style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.04em', textTransform: 'uppercase' }}>EduGuard</span>
                    </div>
                    <div>
                        <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.25em', color: 'var(--signal)', marginBottom: '16px' }}>Administration</p>
                        <h1 style={{ fontSize: '48px', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.05, color: 'var(--paper)', textTransform: 'uppercase' }}>
                            Secure<br />Admin<br />Console.
                        </h1>
                        <p style={{ fontSize: '14px', color: 'var(--ink-muted)', marginTop: '24px', lineHeight: 1.6, maxWidth: '320px' }}>
                            Institutional analytics, at-risk alerts, and ML-driven retention insights — all in one command center.
                        </p>
                    </div>
                </div>
                <p style={{ fontSize: '10px', color: 'var(--ink-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                    © 2026 EduGuard · Secure Portal
                </p>
            </div>

            {/* Right column — form */}
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '48px 24px',
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    style={{ width: '100%', maxWidth: '420px' }}
                >
                    {/* Mobile logo */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '48px' }}>
                        <div style={{
                            width: '28px', height: '28px', background: 'var(--signal)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            clipPath: 'polygon(0 0, 100% 0, 100% 75%, 75% 100%, 0 100%)'
                        }}>
                            <ShieldCheck size={14} color="white" />
                        </div>
                        <span style={{ fontSize: '16px', fontWeight: 700, letterSpacing: '-0.04em', textTransform: 'uppercase' }}>EduGuard</span>
                    </div>

                    <div style={{ marginBottom: '32px' }}>
                        <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.25em', color: 'var(--signal)', marginBottom: '8px' }}>
                            Administration
                        </p>
                        <h1 style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.1, color: 'var(--paper)', textTransform: 'uppercase', margin: 0 }}>
                            Admin Login
                        </h1>
                    </div>

                    {/* Login form */}
                    <div style={{
                        background: 'var(--ink-soft)',
                        border: '1px solid var(--ink-border)',
                        borderTop: '3px solid var(--signal)',
                        padding: '32px',
                    }}>
                        <form onSubmit={handleLogin}>
                            {/* Error */}
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        style={{
                                            background: 'var(--signal-dim)',
                                            border: '1px solid var(--signal-line)',
                                            color: 'var(--signal)',
                                            padding: '10px 14px',
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            marginBottom: '24px',
                                        }}
                                    >
                                        <AlertCircle size={14} />
                                        <span>{error}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Email */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    fontSize: '10px', fontWeight: 700, textTransform: 'uppercase',
                                    letterSpacing: '0.15em', color: 'var(--ink-muted)', marginBottom: '8px',
                                }} htmlFor="email">
                                    <div style={{ width: '6px', height: '6px', background: 'var(--signal)' }} />
                                    Email Address
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <User size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-muted)' }} />
                                    <input
                                        id="email"
                                        type="text"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="admin@institution.edu"
                                        style={{
                                            width: '100%', boxSizing: 'border-box',
                                            background: 'var(--ink)',
                                            border: '1px solid var(--ink-border)',
                                            color: 'var(--paper)',
                                            paddingLeft: '42px', paddingRight: '16px',
                                            paddingTop: '12px', paddingBottom: '12px',
                                            fontFamily: 'var(--font-body)',
                                            fontSize: '14px',
                                            outline: 'none',
                                        }}
                                        onFocus={e => e.target.style.borderColor = 'var(--signal)'}
                                        onBlur={e => e.target.style.borderColor = 'var(--ink-border)'}
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div style={{ marginBottom: '32px' }}>
                                <label style={{
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    fontSize: '10px', fontWeight: 700, textTransform: 'uppercase',
                                    letterSpacing: '0.15em', color: 'var(--ink-muted)', marginBottom: '8px',
                                }} htmlFor="password">
                                    <div style={{ width: '6px', height: '6px', background: 'var(--ink-muted)' }} />
                                    Password
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-muted)' }} />
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        style={{
                                            width: '100%', boxSizing: 'border-box',
                                            background: 'var(--ink)',
                                            border: '1px solid var(--ink-border)',
                                            color: 'var(--paper)',
                                            paddingLeft: '42px', paddingRight: '42px',
                                            paddingTop: '12px', paddingBottom: '12px',
                                            fontFamily: 'var(--font-mono)',
                                            fontSize: '14px',
                                            letterSpacing: '0.15em',
                                            outline: 'none',
                                        }}
                                        onFocus={e => e.target.style.borderColor = 'var(--signal)'}
                                        onBlur={e => e.target.style.borderColor = 'var(--ink-border)'}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                    >
                                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="sg-btn sg-btn--primary"
                                style={{ width: '100%', justifyContent: 'center', padding: '14px 24px', fontSize: '11px' }}
                            >
                                {isLoading ? (
                                    <Loader2 className="animate-spin" size={16} />
                                ) : (
                                    <>
                                        <span>Sign In</span>
                                        <ArrowRight size={16} />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <p style={{ textAlign: 'center', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--ink-muted)', marginTop: '24px' }}>
                        Secure Administration Portal
                    </p>
                </motion.div>
            </div>

            <style>{`
                @media (min-width: 768px) {
                    .login-left-col { display: flex !important; }
                }
            `}</style>
        </div>
    );
};

export default Login;

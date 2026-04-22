import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth endpoint
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
    window.location.href = `${backendUrl}/auth/oauth/google`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', formData);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-primary)' }}>
      {/* Left: Branding */}
      <div
        className="auth-branding"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '48px 40px',
          background: 'linear-gradient(160deg, #0c0a1f 0%, #1a1145 35%, #2d1b69 65%, #4c1d95 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Animated blobs */}
        <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(129, 140, 248, 0.12) 0%, transparent 70%)', top: '-100px', left: '-100px', animation: 'blob 15s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(167, 139, 250, 0.1) 0%, transparent 70%)', bottom: '40px', right: '-60px', animation: 'blob 18s ease-in-out infinite reverse' }} />
        <div style={{ position: 'absolute', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)', bottom: '-40px', left: '25%', animation: 'blob 20s ease-in-out infinite 3s' }} />

        {/* Grid pattern overlay */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(129, 140, 248, 0.06) 1px, transparent 1px)', backgroundSize: '32px 32px', opacity: 0.5 }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '440px' }}>
          {/* Logo */}
          <div style={{ width: 72, height: 72, borderRadius: 'var(--radius-lg)', background: 'linear-gradient(135deg, var(--accent-primary) 0%, #a78bfa 50%, var(--accent-secondary) 100%)', backgroundSize: '200% 200%', animation: 'gradient-shift 4s ease-in-out infinite', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.75rem', color: 'white', margin: '0 auto 28px', boxShadow: '0 12px 40px rgba(99, 102, 241, 0.35)' }}>
            T
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white', marginBottom: '14px', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
            TaskFlow
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'rgba(255, 255, 255, 0.6)', lineHeight: 1.7, marginBottom: '40px', maxWidth: '380px', margin: '0 auto 40px' }}>
            Organize your tasks, boost your productivity, and achieve more every day.
          </p>

          {/* Features */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
            {[
              { icon: '📋', text: 'Organize tasks by category & priority' },
              { icon: '📊', text: 'Real-time dashboard with insights' },
              { icon: '⚡', text: 'Fast, secure & beautifully designed' },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '14px 18px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  backdropFilter: 'blur(8px)',
                  animation: `fadeInUp 0.5s ease-out ${300 + i * 120}ms forwards`,
                  opacity: 0,
                }}
              >
                <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{item.icon}</span>
                <span style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.8)', fontWeight: 500, lineHeight: 1.4 }}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Login Form */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '48px 24px',
          minWidth: 0,
          position: 'relative',
        }}
      >
        {/* Subtle background accent */}
        <div style={{ position: 'absolute', top: '10%', right: '5%', width: '260px', height: '260px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }} className="animate-fade-in">
          {/* Mobile logo */}
          <div
            className="mobile-logo"
            style={{
              display: 'none',
              width: 48,
              height: 48,
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.2rem',
              color: 'white',
              marginBottom: '24px',
              boxShadow: 'var(--shadow-accent)',
            }}
          >
            T
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px', letterSpacing: '-0.01em' }}>
            Welcome back
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '32px' }}>
            Sign in to continue to your dashboard
          </p>

          {error && (
            <div className="alert alert-error" style={{ marginBottom: '20px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', letterSpacing: '0.02em' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                </svg>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="input"
                  style={{ paddingLeft: '44px' }}
                  id="login-email"
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', letterSpacing: '0.02em' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="input"
                  style={{ paddingLeft: '44px', paddingRight: '48px' }}
                  id="login-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    transition: 'color var(--transition-fast)',
                  }}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '0.95rem', borderRadius: 'var(--radius-md)' }}
              id="login-submit"
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 0.8s linear infinite' }}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '28px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 500 }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="btn"
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '0.9rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              background: 'white',
              color: '#333',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              marginBottom: '20px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f9f9f9';
              e.currentTarget.style.borderColor = '#d0d0d0';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <text x="0" y="16" fontSize="14" fontWeight="bold" fill="#EA4335">
                G
              </text>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '28px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 500 }}>New here?</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
          </div>

          <Link
            to="/register"
            style={{
              display: 'block',
              textAlign: 'center',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              color: 'var(--accent-primary)',
              fontWeight: 600,
              fontSize: '0.9rem',
              transition: 'all var(--transition-fast)',
              background: 'transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--accent-glow)';
              e.currentTarget.style.borderColor = 'rgba(129, 140, 248, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'var(--border-color)';
            }}
          >
            Create an account
          </Link>
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .auth-branding {
            display: none !important;
          }
          .mobile-logo {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;

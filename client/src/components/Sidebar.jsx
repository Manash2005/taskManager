import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';

const Sidebar = ({ user, onClose, isOpen, taskCount, onFriendsOpen, pendingRequests = 0 }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loggingOut, setLoggingOut] = useState(false);

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await api.post('/auth/logout');
        } catch (err) {
            // Even if server logout fails, clear local state
        }
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/');
    };

    const navItems = [
        {
            label: 'Dashboard',
            path: '/dashboard',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
            ),
        },
    ];

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={onClose}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0, 0, 0, 0.6)',
                        backdropFilter: 'blur(4px)',
                        WebkitBackdropFilter: 'blur(4px)',
                        zIndex: 40,
                        animation: 'overlayFadeIn 0.2s ease-out',
                    }}
                />
            )}

            {/* Sidebar */}
            <aside
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: 'var(--sidebar-width)',
                    background: 'var(--bg-secondary)',
                    borderRight: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    zIndex: 50,
                    transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
                    transition: 'transform var(--transition-normal)',
                }}
                className="sidebar-desktop"
            >
                {/* Logo */}
                <div
                    style={{
                        padding: '20px 20px',
                        height: 'var(--header-height)',
                        borderBottom: '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                    }}
                >
                    <div
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 'var(--radius-md)',
                            background: 'linear-gradient(135deg, var(--accent-primary) 0%, #a78bfa 50%, var(--accent-secondary) 100%)',
                            backgroundSize: '200% 200%',
                            animation: 'gradient-shift 5s ease-in-out infinite',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 900,
                            fontSize: '1.1rem',
                            color: 'white',
                            flexShrink: 0,
                            boxShadow: '0 4px 16px rgba(99, 102, 241, 0.25)',
                        }}
                    >
                        T
                    </div>
                    <div>
                        <h1 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
                            TaskFlow
                        </h1>
                        <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                            Task Manager
                        </p>
                    </div>
                </div>

                {/* Navigation */}
                <nav style={{ flex: 1, padding: '20px 14px', overflowY: 'auto' }}>
                    <p style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 10px', marginBottom: '10px' }}>
                        Menu
                    </p>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <button
                                key={item.path}
                                onClick={() => {
                                    navigate(item.path);
                                    onClose?.();
                                }}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '11px 14px',
                                    borderRadius: 'var(--radius-sm)',
                                    border: 'none',
                                    background: isActive ? 'var(--accent-glow)' : 'transparent',
                                    color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    fontSize: '0.875rem',
                                    fontWeight: isActive ? 600 : 500,
                                    fontFamily: 'inherit',
                                    transition: 'all var(--transition-fast)',
                                    textAlign: 'left',
                                    marginBottom: '4px',
                                    position: 'relative',
                                    overflow: 'hidden',
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = 'rgba(148, 163, 184, 0.06)';
                                        e.currentTarget.style.color = 'var(--text-primary)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.color = 'var(--text-secondary)';
                                    }
                                }}
                            >
                                {isActive && (
                                    <div style={{
                                        position: 'absolute',
                                        left: 0,
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        width: '3px',
                                        height: '60%',
                                        borderRadius: '0 4px 4px 0',
                                        background: 'var(--accent-primary)',
                                    }} />
                                )}
                                {item.icon}
                                <span style={{ flex: 1 }}>{item.label}</span>
                                {taskCount > 0 && (
                                    <span style={{
                                        fontSize: '0.68rem',
                                        fontWeight: 700,
                                        color: isActive ? 'var(--accent-primary)' : 'var(--text-dim)',
                                        background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'rgba(148, 163, 184, 0.08)',
                                        padding: '2px 8px',
                                        borderRadius: 'var(--radius-full)',
                                        minWidth: '24px',
                                        textAlign: 'center',
                                    }}>
                                        {taskCount}
                                    </span>
                                )}
                            </button>
                        );
                    })}

                    {/* Friends button */}
                    <button
                        onClick={() => {
                            onFriendsOpen?.();
                            onClose?.();
                        }}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '11px 14px',
                            borderRadius: 'var(--radius-sm)',
                            border: 'none',
                            background: 'transparent',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            fontFamily: 'inherit',
                            transition: 'all var(--transition-fast)',
                            textAlign: 'left',
                            marginBottom: '4px',
                            position: 'relative',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(148, 163, 184, 0.06)';
                            e.currentTarget.style.color = 'var(--text-primary)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = 'var(--text-secondary)';
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        <span style={{ flex: 1 }}>Friends</span>
                        {pendingRequests > 0 && (
                            <span style={{
                                fontSize: '0.65rem',
                                fontWeight: 700,
                                color: 'white',
                                background: 'linear-gradient(135deg, #f87171, #ef4444)',
                                padding: '2px 7px',
                                borderRadius: 'var(--radius-full)',
                                minWidth: '20px',
                                textAlign: 'center',
                                boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
                                animation: 'pulse-glow 2s infinite',
                            }}>
                                {pendingRequests}
                            </span>
                        )}
                    </button>
                </nav>

                {/* User section */}
                <div style={{ padding: '16px', borderTop: '1px solid var(--border-color)' }}>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px 10px',
                            marginBottom: '10px',
                            borderRadius: 'var(--radius-sm)',
                            background: 'var(--bg-primary)',
                            border: '1px solid var(--border-color)',
                        }}
                    >
                        <img
                            src={user?.profile_picture?.url || 'https://ik.imagekit.io/sodiumimages/taskManager/users/default.jpg'}
                            alt={user?.name || 'User'}
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 'var(--radius-full)',
                                objectFit: 'cover',
                                border: '2px solid var(--border-hover)',
                                flexShrink: 0,
                            }}
                        />
                        <div style={{ overflow: 'hidden', flex: 1 }}>
                            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {user?.name || 'User'}
                            </p>
                            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {user?.email || ''}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        disabled={loggingOut}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            padding: '10px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid rgba(248, 113, 113, 0.15)',
                            background: 'rgba(248, 113, 113, 0.06)',
                            color: 'var(--color-danger)',
                            cursor: loggingOut ? 'not-allowed' : 'pointer',
                            fontSize: '0.825rem',
                            fontWeight: 600,
                            fontFamily: 'inherit',
                            transition: 'all var(--transition-fast)',
                            opacity: loggingOut ? 0.5 : 1,
                        }}
                        onMouseEnter={(e) => {
                            if (!loggingOut) {
                                e.currentTarget.style.background = 'rgba(248, 113, 113, 0.12)';
                                e.currentTarget.style.borderColor = 'rgba(248, 113, 113, 0.3)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(248, 113, 113, 0.06)';
                            e.currentTarget.style.borderColor = 'rgba(248, 113, 113, 0.15)';
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        {loggingOut ? 'Logging out...' : 'Logout'}
                    </button>
                </div>
            </aside>

            {/* CSS for desktop sidebar always visible */}
            <style>{`
                @media (min-width: 769px) {
                    .sidebar-desktop {
                        transform: translateX(0) !important;
                    }
                    .sidebar-overlay {
                        display: none !important;
                    }
                }
            `}</style>
        </>
    );
};

export default Sidebar;

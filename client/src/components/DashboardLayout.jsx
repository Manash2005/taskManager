import { useState } from 'react';
import Sidebar from './Sidebar';

const DashboardLayout = ({ user, children, onProfileOpen, taskCount, onFriendsOpen, pendingRequests }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <Sidebar
                user={user}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                taskCount={taskCount}
                onFriendsOpen={onFriendsOpen}
                pendingRequests={pendingRequests}
            />

            {/* Main content */}
            <div
                style={{
                    marginLeft: 0,
                    minHeight: '100vh',
                    transition: 'margin-left var(--transition-normal)',
                }}
                className="main-content-area"
            >
                {/* Top bar */}
                <header
                    className="mobile-topbar"
                    style={{
                        position: 'sticky',
                        top: 0,
                        zIndex: 30,
                        height: 'var(--header-height)',
                        padding: '0 24px',
                        background: 'rgba(10, 14, 26, 0.8)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        borderBottom: '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        {/* Hamburger (mobile) */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="hamburger-btn"
                            style={{
                                display: 'none',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 40,
                                height: 40,
                                border: '1px solid var(--border-color)',
                                borderRadius: 'var(--radius-sm)',
                                background: 'var(--bg-secondary)',
                                color: 'var(--text-secondary)',
                                cursor: 'pointer',
                                transition: 'all var(--transition-fast)',
                                flexShrink: 0,
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <line x1="3" y1="12" x2="15" y2="12" />
                                <line x1="3" y1="18" x2="21" y2="18" />
                            </svg>
                        </button>

                        {/* Greeting */}
                        <div>
                            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                                {getGreeting()}, <span style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-tertiary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{user?.name?.split(' ')[0] || 'User'}</span>
                            </h2>
                            <p className="greeting-subtitle" style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 500, marginTop: '0px' }}>
                                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                            </p>
                        </div>
                    </div>

                    {/* User avatar — clickable to open profile */}
                    <button
                        onClick={onProfileOpen}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            background: 'none',
                            border: '2px solid transparent',
                            borderRadius: 'var(--radius-full)',
                            cursor: 'pointer',
                            padding: '3px',
                            transition: 'all var(--transition-fast)',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--accent-primary)';
                            e.currentTarget.style.boxShadow = '0 0 16px rgba(99, 102, 241, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'transparent';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                        title="View profile"
                    >
                        <img
                            src={user?.profile_picture?.url || 'https://ik.imagekit.io/sodiumimages/taskManager/users/default.jpg'}
                            alt={user?.name || 'User'}
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: 'var(--radius-full)',
                                objectFit: 'cover',
                            }}
                        />
                    </button>
                </header>

                {/* Page content */}
                <main style={{ padding: '28px 24px 48px' }}>
                    {children}
                </main>
            </div>

            {/* Responsive styles */}
            <style>{`
                @media (min-width: 769px) {
                    .main-content-area {
                        margin-left: var(--sidebar-width) !important;
                    }
                    .hamburger-btn {
                        display: none !important;
                    }
                }
                @media (max-width: 768px) {
                    .hamburger-btn {
                        display: flex !important;
                    }
                    .greeting-subtitle {
                        display: none;
                    }
                }
            `}</style>
        </div>
    );
};

export default DashboardLayout;

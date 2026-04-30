import { useState, useEffect, useRef, useCallback } from 'react';
import api from '../api/axios';
import { useToast } from './Toast';

const FriendsPanel = ({ isOpen, onClose, onViewTasks }) => {
    const toast = useToast();
    const [activeTab, setActiveTab] = useState('friends');
    const [friends, setFriends] = useState([]);
    const [requests, setRequests] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState({});
    const searchRef = useRef(null);
    const searchTimeout = useRef(null);

    const fetchFriends = useCallback(async () => {
        try {
            const res = await api.get('/friends/list');
            setFriends(res.data.friends || []);
        } catch (err) {
            console.error('Failed to fetch friends', err);
        }
    }, []);

    const fetchRequests = useCallback(async () => {
        try {
            const res = await api.get('/friends/pending');
            setRequests(res.data.requests || []);
        } catch (err) {
            console.error('Failed to fetch requests', err);
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            Promise.all([fetchFriends(), fetchRequests()]).finally(() => setLoading(false));
        }
    }, [isOpen, fetchFriends, fetchRequests]);

    // Debounced search
    const handleSearch = (query) => {
        setSearchQuery(query);
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        if (!query.trim()) {
            setSearchResults([]);
            setSearching(false);
            return;
        }
        setSearching(true);
        searchTimeout.current = setTimeout(async () => {
            try {
                const res = await api.get(`/user/search?q=${encodeURIComponent(query.trim())}`);
                setSearchResults(res.data.users || []);
            } catch (err) {
                console.error('Search failed', err);
            } finally {
                setSearching(false);
            }
        }, 400);
    };

    const handleSendRequest = async (userId) => {
        setActionLoading(prev => ({ ...prev, [`send_${userId}`]: true }));
        try {
            await api.post('/friends/request', { receiverId: userId });
            toast.success('Friend request sent!');
            // Remove from search results to indicate sent
            setSearchResults(prev => prev.map(u => u._id === userId ? { ...u, requestSent: true } : u));
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to send request');
        } finally {
            setActionLoading(prev => ({ ...prev, [`send_${userId}`]: false }));
        }
    };

    const handleRespond = async (requestId, action) => {
        setActionLoading(prev => ({ ...prev, [`respond_${requestId}`]: true }));
        try {
            await api.post('/friends/respond', { requestId, action });
            toast.success(action === 'accepted' ? 'Friend request accepted!' : 'Friend request declined');
            setRequests(prev => prev.filter(r => r._id !== requestId));
            if (action === 'accepted') fetchFriends();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to respond');
        } finally {
            setActionLoading(prev => ({ ...prev, [`respond_${requestId}`]: false }));
        }
    };

    const handleRemoveFriend = async (friendId) => {
        setActionLoading(prev => ({ ...prev, [`remove_${friendId}`]: true }));
        try {
            await api.delete(`/friends/remove/${friendId}`);
            toast.success('Friend removed');
            setFriends(prev => prev.filter(f => f._id !== friendId));
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to remove friend');
        } finally {
            setActionLoading(prev => ({ ...prev, [`remove_${friendId}`]: false }));
        }
    };

    const tabs = [
        { key: 'friends', label: 'Friends', count: friends.length },
        { key: 'requests', label: 'Requests', count: requests.length },
        { key: 'search', label: 'Find People' },
    ];

    // Check if a search result user is already a friend or has pending request
    const getFriendStatus = (user) => {
        if (user.requestSent) return 'sent';
        if (friends.some(f => f._id === user._id)) return 'friend';
        return 'none';
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                onClick={onClose}
                style={{
                    position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
                    zIndex: 60, animation: 'overlayFadeIn 0.2s ease-out',
                }}
            />

            {/* Panel */}
            <div
                style={{
                    position: 'fixed', top: 0, right: 0, bottom: 0,
                    width: 'min(440px, 100vw)', background: 'var(--bg-secondary)',
                    borderLeft: '1px solid var(--border-color)', zIndex: 70,
                    display: 'flex', flexDirection: 'column',
                    animation: 'slideInRight 0.3s ease-out',
                    boxShadow: '-8px 0 40px rgba(0, 0, 0, 0.3)',
                }}
            >
                {/* Header */}
                <div style={{
                    padding: '20px 24px', borderBottom: '1px solid var(--border-color)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: 40, height: 40, borderRadius: 'var(--radius-md)',
                            background: 'linear-gradient(135deg, #818cf8, #6366f1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 4px 16px rgba(99, 102, 241, 0.25)',
                        }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Friends</h2>
                            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                                {friends.length} friend{friends.length !== 1 ? 's' : ''}
                                {requests.length > 0 && ` · ${requests.length} pending`}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            width: 36, height: 36, borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-color)', background: 'var(--bg-primary)',
                            color: 'var(--text-muted)', cursor: 'pointer', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            transition: 'all var(--transition-fast)',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--border-hover)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Tabs */}
                <div style={{
                    display: 'flex', borderBottom: '1px solid var(--border-color)',
                    padding: '0 24px', gap: '4px',
                }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => {
                                setActiveTab(tab.key);
                                if (tab.key === 'search') setTimeout(() => searchRef.current?.focus(), 100);
                            }}
                            style={{
                                padding: '12px 16px', border: 'none', background: 'none',
                                color: activeTab === tab.key ? 'var(--accent-primary)' : 'var(--text-muted)',
                                fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
                                fontFamily: 'inherit', position: 'relative',
                                transition: 'color var(--transition-fast)',
                                display: 'flex', alignItems: 'center', gap: '6px',
                            }}
                            onMouseEnter={(e) => { if (activeTab !== tab.key) e.currentTarget.style.color = 'var(--text-secondary)'; }}
                            onMouseLeave={(e) => { if (activeTab !== tab.key) e.currentTarget.style.color = 'var(--text-muted)'; }}
                        >
                            {tab.label}
                            {tab.count > 0 && (
                                <span style={{
                                    fontSize: '0.65rem', fontWeight: 700,
                                    background: tab.key === 'requests' ? 'rgba(248, 113, 113, 0.15)' : 'rgba(148, 163, 184, 0.08)',
                                    color: tab.key === 'requests' ? 'var(--color-danger)' : 'var(--text-dim)',
                                    padding: '1px 7px', borderRadius: 'var(--radius-full)',
                                    minWidth: '20px', textAlign: 'center',
                                }}>
                                    {tab.count}
                                </span>
                            )}
                            {activeTab === tab.key && (
                                <div style={{
                                    position: 'absolute', bottom: '-1px', left: '12px', right: '12px',
                                    height: '2px', borderRadius: '2px 2px 0 0',
                                    background: 'var(--accent-primary)',
                                }} />
                            )}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
                    {loading ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px 0' }}>
                            {[1, 2, 3].map(i => (
                                <div key={i} className="skeleton" style={{ height: '64px', borderRadius: 'var(--radius-sm)' }} />
                            ))}
                        </div>
                    ) : (
                        <>
                            {/* Friends Tab */}
                            {activeTab === 'friends' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {friends.length === 0 ? (
                                        <EmptyState
                                            emoji="👥"
                                            title="No friends yet"
                                            subtitle="Search for people to add them as friends"
                                            action={() => setActiveTab('search')}
                                            actionLabel="Find People"
                                        />
                                    ) : (
                                        friends.map(friend => (
                                            <FriendCard
                                                key={friend._id}
                                                user={friend}
                                                actions={
                                                    <div style={{ display: 'flex', gap: '6px' }}>
                                                        <ActionButton
                                                            label="View Tasks"
                                                            icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>}
                                                            onClick={() => onViewTasks(friend)}
                                                            variant="primary"
                                                        />
                                                        <ActionButton
                                                            label="Remove"
                                                            icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="18" y1="11" x2="23" y2="11" /></svg>}
                                                            onClick={() => handleRemoveFriend(friend._id)}
                                                            variant="danger"
                                                            loading={actionLoading[`remove_${friend._id}`]}
                                                        />
                                                    </div>
                                                }
                                            />
                                        ))
                                    )}
                                </div>
                            )}

                            {/* Requests Tab */}
                            {activeTab === 'requests' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {requests.length === 0 ? (
                                        <EmptyState
                                            emoji="📬"
                                            title="No pending requests"
                                            subtitle="When someone sends you a friend request, it'll show up here"
                                        />
                                    ) : (
                                        requests.map(req => (
                                            <FriendCard
                                                key={req._id}
                                                user={req.sender}
                                                subtitle={`Sent ${timeAgo(req.createdAt)}`}
                                                actions={
                                                    <div style={{ display: 'flex', gap: '6px' }}>
                                                        <ActionButton
                                                            label="Accept"
                                                            icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>}
                                                            onClick={() => handleRespond(req._id, 'accepted')}
                                                            variant="success"
                                                            loading={actionLoading[`respond_${req._id}`]}
                                                        />
                                                        <ActionButton
                                                            label="Decline"
                                                            icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>}
                                                            onClick={() => handleRespond(req._id, 'declined')}
                                                            variant="ghost"
                                                            loading={actionLoading[`respond_${req._id}`]}
                                                        />
                                                    </div>
                                                }
                                            />
                                        ))
                                    )}
                                </div>
                            )}

                            {/* Search Tab */}
                            {activeTab === 'search' && (
                                <div>
                                    <div style={{ position: 'relative', marginBottom: '16px' }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                                        </svg>
                                        <input
                                            ref={searchRef}
                                            type="text"
                                            placeholder="Search by name..."
                                            value={searchQuery}
                                            onChange={(e) => handleSearch(e.target.value)}
                                            className="input"
                                            style={{ paddingLeft: '38px', fontSize: '0.85rem' }}
                                        />
                                    </div>

                                    {searching && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {[1, 2].map(i => (
                                                <div key={i} className="skeleton" style={{ height: '64px', borderRadius: 'var(--radius-sm)' }} />
                                            ))}
                                        </div>
                                    )}

                                    {!searching && searchQuery && searchResults.length === 0 && (
                                        <EmptyState
                                            emoji="🔍"
                                            title="No users found"
                                            subtitle={`No results for "${searchQuery}"`}
                                        />
                                    )}

                                    {!searching && searchResults.length > 0 && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {searchResults.map(user => {
                                                const status = getFriendStatus(user);
                                                return (
                                                    <FriendCard
                                                        key={user._id}
                                                        user={user}
                                                        actions={
                                                            status === 'friend' ? (
                                                                <span style={{
                                                                    fontSize: '0.72rem', fontWeight: 600,
                                                                    color: 'var(--color-success)',
                                                                    background: 'var(--color-success-dim)',
                                                                    padding: '4px 12px',
                                                                    borderRadius: 'var(--radius-full)',
                                                                }}>
                                                                    ✓ Friends
                                                                </span>
                                                            ) : status === 'sent' ? (
                                                                <span style={{
                                                                    fontSize: '0.72rem', fontWeight: 600,
                                                                    color: 'var(--text-muted)',
                                                                    background: 'rgba(148, 163, 184, 0.08)',
                                                                    padding: '4px 12px',
                                                                    borderRadius: 'var(--radius-full)',
                                                                }}>
                                                                    Request Sent
                                                                </span>
                                                            ) : (
                                                                <ActionButton
                                                                    label="Add Friend"
                                                                    icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg>}
                                                                    onClick={() => handleSendRequest(user._id)}
                                                                    variant="primary"
                                                                    loading={actionLoading[`send_${user._id}`]}
                                                                />
                                                            )
                                                        }
                                                    />
                                                );
                                            })}
                                        </div>
                                    )}

                                    {!searchQuery && (
                                        <EmptyState
                                            emoji="🔎"
                                            title="Find people"
                                            subtitle="Type a name to search for users"
                                        />
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

// --- Sub-components ---

const FriendCard = ({ user, subtitle, actions }) => (
    <div
        style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '12px 14px', borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-primary)', border: '1px solid var(--border-color)',
            transition: 'all var(--transition-fast)',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.background = 'var(--bg-elevated)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.background = 'var(--bg-primary)'; }}
    >
        <img
            src={user?.profile_picture?.url || 'https://ik.imagekit.io/sodiumimages/taskManager/users/default.jpg'}
            alt={user?.name || 'User'}
            style={{
                width: 42, height: 42, borderRadius: 'var(--radius-full)',
                objectFit: 'cover', border: '2px solid var(--border-hover)', flexShrink: 0,
            }}
        />
        <div style={{ flex: 1, overflow: 'hidden' }}>
            <p style={{
                fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
                {user?.name || 'Unknown'}
            </p>
            <p style={{
                fontSize: '0.72rem', color: 'var(--text-muted)',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
                {subtitle || user?.email || ''}
            </p>
        </div>
        {actions}
    </div>
);

const ActionButton = ({ label, icon, onClick, variant = 'primary', loading = false }) => {
    const variants = {
        primary: { bg: 'var(--accent-glow)', color: 'var(--accent-primary)', hoverBg: 'var(--accent-glow-strong)' },
        success: { bg: 'var(--color-success-dim)', color: 'var(--color-success)', hoverBg: 'rgba(52, 211, 153, 0.2)' },
        danger: { bg: 'var(--color-danger-dim)', color: 'var(--color-danger)', hoverBg: 'rgba(248, 113, 113, 0.2)' },
        ghost: { bg: 'rgba(148, 163, 184, 0.06)', color: 'var(--text-muted)', hoverBg: 'rgba(148, 163, 184, 0.12)' },
    };
    const s = variants[variant] || variants.primary;

    return (
        <button
            onClick={onClick}
            disabled={loading}
            title={label}
            style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '6px 12px', fontSize: '0.72rem', fontWeight: 600,
                borderRadius: 'var(--radius-sm)', border: 'none',
                background: s.bg, color: s.color,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit', opacity: loading ? 0.6 : 1,
                transition: 'all var(--transition-fast)', whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = s.hoverBg; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = s.bg; }}
        >
            {loading ? (
                <div style={{ width: 14, height: 14, border: '2px solid transparent', borderTopColor: s.color, borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
            ) : icon}
            <span className="action-btn-label">{label}</span>

            <style>{`
                @media (max-width: 400px) {
                    .action-btn-label { display: none; }
                }
            `}</style>
        </button>
    );
};

const EmptyState = ({ emoji, title, subtitle, action, actionLabel }) => (
    <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '48px 24px', textAlign: 'center',
    }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '12px', filter: 'grayscale(20%)' }}>{emoji}</div>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>{title}</h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: action ? '16px' : 0, maxWidth: '280px' }}>{subtitle}</p>
        {action && (
            <button onClick={action} className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.82rem' }}>
                {actionLabel}
            </button>
        )}
    </div>
);

const timeAgo = (dateStr) => {
    if (!dateStr) return '';
    const diff = Math.floor((new Date() - new Date(dateStr)) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return new Date(dateStr).toLocaleDateString();
};

export default FriendsPanel;

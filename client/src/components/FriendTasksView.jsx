import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

const FriendTasksView = ({ isOpen, onClose, friend }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState('');

    const fetchTasks = useCallback(async () => {
        if (!friend?._id) return;
        setLoading(true);
        try {
            const res = await api.get(`/friends/tasks/${friend._id}`);
            setTasks(res.data.tasks || []);
        } catch (err) {
            console.error('Failed to fetch friend tasks', err);
        } finally {
            setLoading(false);
        }
    }, [friend]);

    useEffect(() => {
        if (isOpen && friend) fetchTasks();
    }, [isOpen, friend, fetchTasks]);

    const filteredTasks = filter
        ? tasks.filter(t => t.status === filter)
        : tasks;

    const stats = {
        total: tasks.length,
        completed: tasks.filter(t => t.status === 'Completed').length,
        pending: tasks.filter(t => t.status === 'Pending').length,
        notStarted: tasks.filter(t => t.status === 'Not Started').length,
    };

    const completionPercent = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

    if (!isOpen) return null;

    const priorityColors = {
        High: { bg: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: 'rgba(239, 68, 68, 0.2)' },
        Medium: { bg: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24', border: 'rgba(245, 158, 11, 0.2)' },
        Low: { bg: 'rgba(34, 197, 94, 0.1)', color: '#34d399', border: 'rgba(34, 197, 94, 0.2)' },
    };

    const statusColors = {
        'Not Started': { bg: 'rgba(96, 165, 250, 0.1)', color: '#60a5fa', icon: '○' },
        Pending: { bg: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24', icon: '◐' },
        Completed: { bg: 'rgba(34, 197, 94, 0.1)', color: '#34d399', icon: '●' },
    };

    const categoryIcons = { Study: '📚', Work: '💼', Personal: '🏠' };
    const categoryColors = { Study: '#818cf8', Work: '#f472b6', Personal: '#34d399' };

    return (
        <>
            {/* Overlay */}
            <div
                onClick={onClose}
                style={{
                    position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
                    zIndex: 80, animation: 'overlayFadeIn 0.2s ease-out',
                }}
            />

            {/* Modal */}
            <div style={{
                position: 'fixed', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 'min(780px, calc(100vw - 32px))',
                maxHeight: 'calc(100vh - 64px)',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                zIndex: 90,
                display: 'flex', flexDirection: 'column',
                animation: 'modalSlideUp 0.3s ease-out',
                boxShadow: 'var(--shadow-lg)',
                overflow: 'hidden',
            }}>
                {/* Header */}
                <div style={{
                    padding: '20px 24px', borderBottom: '1px solid var(--border-color)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.06), rgba(167, 139, 250, 0.04))',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <img
                            src={friend?.profile_picture?.url || 'https://ik.imagekit.io/sodiumimages/taskManager/users/default.jpg'}
                            alt={friend?.name || 'Friend'}
                            style={{
                                width: 48, height: 48, borderRadius: 'var(--radius-full)',
                                objectFit: 'cover', border: '2px solid var(--accent-primary)',
                                boxShadow: '0 0 16px rgba(99, 102, 241, 0.2)',
                            }}
                        />
                        <div>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                {friend?.name || 'Friend'}'s Tasks
                            </h2>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                                {stats.total} task{stats.total !== 1 ? 's' : ''} · {completionPercent}% complete
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

                {/* Progress bar */}
                {stats.total > 0 && (
                    <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Progress</span>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: completionPercent === 100 ? 'var(--color-success)' : 'var(--accent-primary)' }}>
                                {stats.completed}/{stats.total}
                            </span>
                        </div>
                        <div style={{ height: '5px', borderRadius: '3px', background: 'var(--bg-tertiary)', overflow: 'hidden' }}>
                            <div style={{
                                height: '100%', width: `${completionPercent}%`,
                                borderRadius: '3px',
                                background: completionPercent === 100
                                    ? 'linear-gradient(90deg, #22c55e, #34d399)'
                                    : 'linear-gradient(90deg, var(--accent-secondary), var(--accent-primary), var(--accent-tertiary))',
                                backgroundSize: '200% 100%',
                                animation: completionPercent < 100 ? 'gradient-shift 3s ease-in-out infinite' : 'none',
                                transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                            }} />
                        </div>

                        {/* Mini stats */}
                        <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                            {[
                                { label: 'Not Started', count: stats.notStarted, color: '#60a5fa' },
                                { label: 'Pending', count: stats.pending, color: '#fbbf24' },
                                { label: 'Completed', count: stats.completed, color: '#34d399' },
                            ].map(s => (
                                <button
                                    key={s.label}
                                    onClick={() => setFilter(filter === s.label ? '' : s.label)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '6px',
                                        padding: '5px 10px', borderRadius: 'var(--radius-full)',
                                        border: filter === s.label ? `1px solid ${s.color}40` : '1px solid var(--border-color)',
                                        background: filter === s.label ? `${s.color}15` : 'transparent',
                                        color: filter === s.label ? s.color : 'var(--text-muted)',
                                        fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer',
                                        fontFamily: 'inherit', transition: 'all var(--transition-fast)',
                                    }}
                                >
                                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                                    {s.label}: {s.count}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tasks grid */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px 24px' }}>
                    {loading ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="skeleton" style={{ height: '120px', borderRadius: 'var(--radius-sm)' }} />
                            ))}
                        </div>
                    ) : filteredTasks.length === 0 ? (
                        <div style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            justifyContent: 'center', padding: '48px 24px', textAlign: 'center',
                        }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '12px', filter: 'grayscale(20%)' }}>
                                {filter ? '🔍' : '📋'}
                            </div>
                            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                                {filter ? `No ${filter.toLowerCase()} tasks` : 'No tasks yet'}
                            </h3>
                            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                                {filter ? 'Try a different filter' : `${friend?.name || 'This user'} hasn't created any tasks`}
                            </p>
                            {filter && (
                                <button
                                    onClick={() => setFilter('')}
                                    style={{
                                        marginTop: '12px', padding: '6px 16px', fontSize: '0.78rem',
                                        fontWeight: 600, borderRadius: 'var(--radius-sm)', border: 'none',
                                        background: 'var(--accent-glow)', color: 'var(--accent-primary)',
                                        cursor: 'pointer', fontFamily: 'inherit',
                                    }}
                                >
                                    Clear Filter
                                </button>
                            )}
                        </div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                            gap: '12px',
                        }}>
                            {filteredTasks.map(task => {
                                const pStyle = priorityColors[task.priority] || priorityColors.Low;
                                const sStyle = statusColors[task.status] || statusColors['Not Started'];
                                const catColor = categoryColors[task.category] || '#818cf8';
                                const catIcon = categoryIcons[task.category] || '📋';
                                const subtasks = task.subtasks || [];
                                const subtaskDone = subtasks.filter(s => s.done).length;
                                const subtaskTotal = subtasks.length;

                                return (
                                    <div
                                        key={task._id}
                                        className="glass-card"
                                        style={{
                                            padding: '16px', display: 'flex', flexDirection: 'column',
                                            gap: '10px', borderLeft: `3px solid ${catColor}`,
                                            position: 'relative', overflow: 'hidden',
                                        }}
                                    >
                                        {task.status === 'Completed' && (
                                            <div style={{
                                                position: 'absolute', top: '8px', right: '8px',
                                                width: '7px', height: '7px', borderRadius: '50%',
                                                background: 'var(--color-success)',
                                                boxShadow: '0 0 8px rgba(34, 197, 94, 0.4)',
                                            }} />
                                        )}

                                        {/* Title + Priority */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                                            <h4 style={{
                                                fontSize: '0.9rem', fontWeight: 600,
                                                color: task.status === 'Completed' ? 'var(--text-secondary)' : 'var(--text-primary)',
                                                lineHeight: 1.4, flex: 1, wordBreak: 'break-word',
                                                textDecoration: task.status === 'Completed' ? 'line-through' : 'none',
                                                textDecorationColor: 'var(--text-muted)',
                                            }}>
                                                {task.title}
                                            </h4>
                                            <span style={{
                                                padding: '2px 8px', fontSize: '0.65rem', fontWeight: 700,
                                                borderRadius: 'var(--radius-full)', background: pStyle.bg,
                                                color: pStyle.color, border: `1px solid ${pStyle.border}`,
                                                whiteSpace: 'nowrap', letterSpacing: '0.04em',
                                                textTransform: 'uppercase', flexShrink: 0,
                                            }}>
                                                {task.priority}
                                            </span>
                                        </div>

                                        {/* Description */}
                                        {task.description && (
                                            <p style={{
                                                fontSize: '0.78rem', color: 'var(--text-muted)',
                                                lineHeight: 1.5, display: '-webkit-box',
                                                WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                            }}>
                                                {task.description}
                                            </p>
                                        )}

                                        {/* Meta */}
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                                            <span style={{
                                                display: 'inline-flex', alignItems: 'center', gap: '4px',
                                                padding: '3px 8px', fontSize: '0.68rem', fontWeight: 600,
                                                borderRadius: 'var(--radius-full)', background: `${catColor}12`, color: catColor,
                                            }}>
                                                <span style={{ fontSize: '0.75rem' }}>{catIcon}</span>
                                                {task.category}
                                            </span>

                                            <span style={{
                                                padding: '3px 8px', fontSize: '0.68rem', fontWeight: 600,
                                                borderRadius: 'var(--radius-full)', background: sStyle.bg, color: sStyle.color,
                                                display: 'inline-flex', alignItems: 'center', gap: '3px',
                                            }}>
                                                <span style={{ fontSize: '0.55rem' }}>{sStyle.icon}</span>
                                                {task.status}
                                            </span>

                                            {subtaskTotal > 0 && (
                                                <span style={{
                                                    padding: '3px 8px', fontSize: '0.68rem', fontWeight: 600,
                                                    borderRadius: 'var(--radius-full)',
                                                    background: subtaskDone === subtaskTotal ? 'var(--color-success-dim)' : 'rgba(148, 163, 184, 0.08)',
                                                    color: subtaskDone === subtaskTotal ? 'var(--color-success)' : 'var(--text-muted)',
                                                }}>
                                                    ☑ {subtaskDone}/{subtaskTotal}
                                                </span>
                                            )}
                                        </div>

                                        {/* Footer */}
                                        <div style={{
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                            paddingTop: '8px', borderTop: '1px solid var(--border-color)',
                                        }}>
                                            <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                                                </svg>
                                                {timeAgo(task.createdAt)}
                                            </span>
                                            {task.dueDate && (
                                                <span style={{
                                                    fontSize: '0.65rem', fontWeight: 600,
                                                    color: getDueDateColor(task),
                                                    background: getDueDateBg(task),
                                                    padding: '2px 7px', borderRadius: 'var(--radius-full)',
                                                }}>
                                                    📅 {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Responsive */}
            <style>{`
                @media (max-width: 480px) {
                    .friend-tasks-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </>
    );
};

const timeAgo = (dateStr) => {
    if (!dateStr) return '';
    const diff = Math.floor((new Date() - new Date(dateStr)) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return new Date(dateStr).toLocaleDateString();
};

const getDueDateColor = (task) => {
    if (task.status === 'Completed') return 'var(--color-success)';
    const due = new Date(task.dueDate); const now = new Date();
    due.setHours(0, 0, 0, 0); now.setHours(0, 0, 0, 0);
    if (due < now) return 'var(--color-danger)';
    if (due.getTime() === now.getTime()) return 'var(--color-warning)';
    return 'var(--text-muted)';
};

const getDueDateBg = (task) => {
    if (task.status === 'Completed') return 'var(--color-success-dim)';
    const due = new Date(task.dueDate); const now = new Date();
    due.setHours(0, 0, 0, 0); now.setHours(0, 0, 0, 0);
    if (due < now) return 'var(--color-danger-dim)';
    if (due.getTime() === now.getTime()) return 'var(--color-warning-dim)';
    return 'rgba(148, 163, 184, 0.06)';
};

export default FriendTasksView;

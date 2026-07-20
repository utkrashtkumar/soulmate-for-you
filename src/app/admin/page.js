'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageToggle from '@/components/LanguageToggle';
import SoulmateLogo from '@/components/SoulmateLogo';
import { useLang } from '@/context/LanguageContext';



const MOOD_EMOJI = { happy: '😊', sad: '😢', jealous: '😤', playful: '😋', romantic: '🥰', angry: '😠' };

export default function AdminPage() {
  const router = useRouter();
  const { t } = useLang();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // overview, users, avatars, chats
  const [adminUser, setAdminUser] = useState(null);

  // Database lists
  const [users, setUsers] = useState([]);
  const [avatars, setAvatars] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalAvatars: 0, totalMessages: 0, totalFeedback: 0 });

  // Search and filters
  const [userSearch, setUserSearch] = useState('');
  const [avatarSearch, setAvatarSearch] = useState('');
  const [feedbackSearch, setFeedbackSearch] = useState('');
  const [feedbackCategoryFilter, setFeedbackCategoryFilter] = useState('all');

  // Modals state
  const [editUser, setEditUser] = useState(null);
  const [editAvatar, setEditAvatar] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // { type: 'user'|'avatar', id, name }

  // Chat Transcript Viewer State
  const [selectedAvatarId, setSelectedAvatarId] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);

  // Fetch all admin data
  const fetchData = async (tokenOverride) => {
    let token = tokenOverride;
    if (!token) {
      const { data: { session } } = await supabase.auth.getSession();
      token = session?.access_token;
    }
    if (!token) return;

    try {
      const res = await fetch('/api/admin/data', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Data fetch failed');

      setUsers(data.users || []);
      setAvatars(data.avatars || []);
      setFeedback(data.feedback || []);
      setStats(data.stats || { totalUsers: 0, totalAvatars: 0, totalMessages: 0, totalFeedback: 0 });
    } catch (err) {
      setError('Data load karne me error: ' + err.message);
    }
  };

  // Authenticate user & verify admin email
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/login');
          return;
        }

        if (session.user.email !== 'givekisstome@gmail.com') {
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        setAdminUser(session.user);
        setIsAdmin(true);
        await fetchData(session.access_token);
      } catch (err) {
        setError('Verification fail ho gayi: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  // ─── USER OPERATIONS ────────────────────────────────────────────────────────

  const openEditUser = (user) => {
    setEditUser({ ...user });
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!editUser) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          userId: editUser.id,
          full_name: editUser.full_name,
          mobile: editUser.mobile,
          dob: editUser.dob
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Update failed');

      setUsers(prev => prev.map(u => u.id === editUser.id ? { ...u, ...editUser } : u));
      setEditUser(null);
      alert('User details update ho gayi! 👍');
    } catch (err) {
      alert('Error updating user: ' + err.message);
    }
  };

  const confirmDeleteUser = (user) => {
    setDeleteConfirm({ type: 'user', id: user.id, name: user.full_name || user.email });
  };

  const handleDeleteUser = async (id) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ userId: id })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Delete failed');

      setUsers(prev => prev.filter(u => u.id !== id));
      setAvatars(prev => prev.filter(av => av.user_id !== id)); // Cascade locally
      setDeleteConfirm(null);
      fetchData(); // Reload stats
      alert('User deleted successfully! 🗑️');
    } catch (err) {
      alert('Error deleting user: ' + err.message);
    }
  };

  // ─── AVATAR OPERATIONS ──────────────────────────────────────────────────────

  const openEditAvatar = (avatar) => {
    setEditAvatar({ ...avatar });
  };

  const handleSaveAvatar = async (e) => {
    e.preventDefault();
    if (!editAvatar) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/admin/avatars', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          avatarId: editAvatar.id,
          name: editAvatar.name,
          personality: editAvatar.personality,
          mood: editAvatar.mood,
          love_meter: editAvatar.love_meter,
          avatar_url: editAvatar.avatar_url
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Update failed');

      setAvatars(prev => prev.map(av => av.id === editAvatar.id ? { ...av, ...editAvatar } : av));
      setEditAvatar(null);
      alert('Avatar details update ho gayi! 💕');
    } catch (err) {
      alert('Error updating avatar: ' + err.message);
    }
  };

  const confirmDeleteAvatar = (avatar) => {
    setDeleteConfirm({ type: 'avatar', id: avatar.id, name: avatar.name });
  };

  const handleDeleteAvatar = async (id) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/admin/avatars', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ avatarId: id })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Delete failed');

      setAvatars(prev => prev.filter(av => av.id !== id));
      setDeleteConfirm(null);
      fetchData(); // Reload stats
      alert('Avatar deleted successfully! 🗑️');
    } catch (err) {
      alert('Error deleting avatar: ' + err.message);
    }
  };

  // ─── MESSAGES/CHATS OPERATIONS ─────────────────────────────────────────────

  const loadChatTranscript = async (avatarId) => {
    setSelectedAvatarId(avatarId);
    setChatLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`/api/admin/messages?avatarId=${avatarId}`, {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load chats');
      setChatMessages(data.messages || []);
      setActiveTab('chats');
    } catch (err) {
      alert('Error loading chat log: ' + err.message);
    } finally {
      setChatLoading(false);
    }
  };

  const handleDeleteMessage = async (msgId) => {
    if (!confirm('Kya aap sach me ye message delete karna chahte hain? 🥺')) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/admin/messages', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ messageId: msgId })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Delete message failed');

      setChatMessages(prev => prev.filter(m => m.id !== msgId));
      fetchData(); // Reload message count
    } catch (err) {
      alert('Error deleting message: ' + err.message);
    }
  };

  const handleClearChat = async (avatarId) => {
    if (!confirm('⚠️ SAVDHAAN! Kya aap is companion ki poori chat history clear karna chahte hain? Ye wapas nahi aayega!')) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/admin/messages', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ avatarId })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Clear chat failed');

      setChatMessages([]);
      fetchData(); // Reload stats
      alert('Chat history cleared successfully! 🧹');
    } catch (err) {
      alert('Error clearing chat history: ' + err.message);
    }
  };

  const handleDeleteFeedback = async (id) => {
    if (!confirm('Kya aap is feedback / contact submission ko delete karna chahte hain?')) return;
    try {
      const res = await fetch('/api/feedback', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedbackId: id })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Delete failed');

      setFeedback(prev => prev.filter(f => f.id !== id));
      fetchData(); // Reload stats
    } catch (err) {
      alert('Error deleting feedback: ' + err.message);
    }
  };

  // ─── RENDERING SECTIONS ─────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p style={{ color: 'var(--text-secondary)' }}>{t('common.loading')}</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="loading-screen" style={{ flexDirection: 'column', gap: '20px', padding: '40px', textAlign: 'center' }}>
        <span style={{ fontSize: '4rem' }}>🚫</span>
        <h1 className="gradient-text" style={{ fontSize: '2rem' }}>{t('admin.deniedTitle')}</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '500px' }}>
          {t('admin.deniedText')}
        </p>
        <Link href="/dashboard">
          <button className="btn-primary" style={{ padding: '12px 30px' }}>{t('admin.backBtn')}</button>
        </Link>
      </div>
    );
  }

  // Filtered lists
  const filteredUsers = users.filter(u =>
    (u.full_name?.toLowerCase().includes(userSearch.toLowerCase())) ||
    (u.email?.toLowerCase().includes(userSearch.toLowerCase())) ||
    (u.mobile?.includes(userSearch))
  );

  const filteredAvatars = avatars.filter(av => {
    const owner = users.find(u => u.id === av.user_id);
    return (
      av.name?.toLowerCase().includes(avatarSearch.toLowerCase()) ||
      av.personality?.toLowerCase().includes(avatarSearch.toLowerCase()) ||
      owner?.full_name?.toLowerCase().includes(avatarSearch.toLowerCase()) ||
      owner?.email?.toLowerCase().includes(avatarSearch.toLowerCase())
    );
  });

  const filteredFeedback = feedback.filter(item => {
    const matchesCategory = feedbackCategoryFilter === 'all' || item.category === feedbackCategoryFilter;
    const matchesSearch = !feedbackSearch ||
      item.name?.toLowerCase().includes(feedbackSearch.toLowerCase()) ||
      item.email?.toLowerCase().includes(feedbackSearch.toLowerCase()) ||
      item.message?.toLowerCase().includes(feedbackSearch.toLowerCase()) ||
      item.category?.toLowerCase().includes(feedbackSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const selectedAvatar = avatars.find(av => av.id === selectedAvatarId);
  const selectedAvatarOwner = selectedAvatar ? users.find(u => u.id === selectedAvatar.user_id) : null;

  return (
    <div className="app-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <SoulmateLogo size={32} />
          <span className="gradient-text" style={{ marginLeft: '8px', fontWeight: 800 }}>Admin Panel</span>
        </div>
        <nav className="sidebar-nav">
          <button className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')} style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}>
            <span className="icon">📊</span> Overview
          </button>
          <button className={`nav-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')} style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}>
            <span className="icon">👥</span> Manage Users
          </button>
          <button className={`nav-item ${activeTab === 'avatars' ? 'active' : ''}`} onClick={() => setActiveTab('avatars')} style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}>
            <span className="icon">👩</span> Manage Avatars
          </button>
          <button className={`nav-item ${activeTab === 'chats' ? 'active' : ''}`} onClick={() => setActiveTab('chats')} style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}>
            <span className="icon">💬</span> Chat Logs
          </button>
          <button className={`nav-item ${activeTab === 'feedback' ? 'active' : ''}`} onClick={() => setActiveTab('feedback')} style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}>
            <span className="icon">💌</span> User Feedback ({feedback.length})
          </button>
          <div style={{ height: '1px', background: 'var(--border-color)', margin: '12px 0' }} />
          <Link href="/dashboard" className="nav-item">
            <span className="icon">🏠</span> Back to App
          </Link>
        </nav>
        <div className="sidebar-footer">
          <div style={{ marginBottom: '12px', padding: '12px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            <div style={{ fontWeight: 600, color: 'gold', marginBottom: '2px' }}>👑 Administrator</div>
            <div style={{ wordBreak: 'break-all' }}>{adminUser?.email}</div>
          </div>
          <div style={{ marginBottom: '10px', display: 'flex', gap: '8px' }}>
            <ThemeToggle />
            <LanguageToggle compact />
          </div>
          <button className="nav-item" onClick={handleLogout} style={{ width: '100%', color: '#ff6b6b', background: 'none', border: 'none' }}>
            <span className="icon">🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT CONTAINER */}
      <main className="main-content">
        <header className="app-header">
          <div className="mobile-logo">
            <SoulmateLogo size={28} />
            <span className="gradient-text" style={{ fontWeight: 700, fontSize: '1.1rem' }}>Soulmate</span>
          </div>
          <div className="hide-mobile" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <LanguageToggle compact />
            <ThemeToggle compact />
          </div>
        </header>

        <div className="page-header">
          <h1>
            👑 Admin <span className="gradient-text">Dashboard</span>
          </h1>
          <p>Control center to monitor database and manage user data</p>
        </div>

        {error && <div className="error-msg" style={{ marginBottom: '20px' }}>⚠️ {error}</div>}

        {/* ─── TABS ───────────────────────────────────────────────────────────── */}

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div>
            {/* Stats Panel */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginBottom: '32px' }}>
              {[
                { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: '#a855f7' },
                { label: 'Companions', value: stats.totalAvatars, icon: '👩', color: '#ff4d8d' },
                { label: 'Messages', value: stats.totalMessages, icon: '💬', color: '#3b82f6' },
                { label: 'Total Visitors', value: stats.totalVisits || 0, icon: '👀', color: '#10b981' },
                { label: "Today's Visitors", value: stats.todayVisits || 0, icon: '🚀', color: '#f59e0b' },
              ].map(s => (
                <div key={s.label} style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)', padding: '20px 16px',
                  display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0,
                  boxShadow: 'var(--shadow-card)'
                }}>
                  <span style={{ fontSize: '2rem', background: `rgba(${s.color === '#ff4d8d' ? '255,77,141' : s.color === '#a855f7' ? '168,85,247' : s.color === '#10b981' ? '16,185,129' : s.color === '#f59e0b' ? '245,158,11' : '59,130,246'}, 0.1)`, padding: '10px', borderRadius: '50%', flexShrink: 0 }}>{s.icon}</span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, lineHeight: 1.1 }}>{s.value}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 500, marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Summary Tables */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              {/* Recent Users */}
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '20px', minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>🆕 Naye Users</h3>
                  <button className="btn-secondary" onClick={() => setActiveTab('users')} style={{ padding: '6px 12px', fontSize: '0.78rem' }}>View All</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {users.slice(0, 5).map(u => (
                    <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', minWidth: 0, gap: '10px' }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{u.full_name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{u.email}</div>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', flexShrink: 0 }}>
                        {new Date(u.created_at).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                  ))}
                  {users.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center' }}>Koi user nahi mila 🥺</p>}
                </div>
              </div>

              {/* Recent Companions */}
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>💖 Naye Companions</h3>
                  <button className="btn-secondary" onClick={() => setActiveTab('avatars')} style={{ padding: '6px 12px', fontSize: '0.78rem' }}>View All</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {avatars.slice(0, 5).map(av => {
                    const owner = users.find(u => u.id === av.user_id);
                    return (
                      <div key={av.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {av.avatar_url && (av.avatar_url.startsWith('http') || av.avatar_url.startsWith('data:')) ? (
                            <img src={av.avatar_url} alt={av.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                          ) : (
                            <span style={{ fontSize: '1.5rem' }}>{av.avatar_url || '👩'}</span>
                          )}
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{av.name}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Owner: {owner?.full_name || 'Unknown'}</div>
                          </div>
                        </div>
                        <span className="mood-badge" style={{ fontSize: '0.75rem' }}>
                          {MOOD_EMOJI[av.mood] || '😊'} {av.mood}
                        </span>
                      </div>
                    );
                  })}
                  {avatars.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center' }}>Koi companion nahi mila 🥺</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: User Management */}
        {activeTab === 'users' && (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '16px', width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>👥 Users Directory ({filteredUsers.length})</h3>
              <input
                className="input-field"
                type="text"
                placeholder="Search user (Naam, email, mobile)..."
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                style={{ maxWidth: '300px', width: '100%', margin: 0, fontSize: '0.85rem', padding: '10px 14px' }}
              />
            </div>

            {/* Desktop Table View */}
            <div className="admin-table-desktop" style={{ overflowX: 'auto', width: '100%', WebkitOverflowScrolling: 'touch' }}>
              <table style={{ width: '100%', minWidth: '650px', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', textAlign: 'left' }}>
                    <th style={{ padding: '12px 8px' }}>User Details</th>
                    <th style={{ padding: '12px 8px' }}>Mobile No</th>
                    <th style={{ padding: '12px 8px' }}>Date of Birth</th>
                    <th style={{ padding: '12px 8px' }}>Age</th>
                    <th style={{ padding: '12px 8px' }}>Joined At</th>
                    <th style={{ padding: '12px 8px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s' }}>
                      <td style={{ padding: '14px 8px', maxWidth: '200px' }}>
                        <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={u.full_name}>{u.full_name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={u.email}>{u.email}</div>
                      </td>
                      <td style={{ padding: '14px 8px' }}>{u.mobile}</td>
                      <td style={{ padding: '14px 8px' }}>{u.dob ? new Date(u.dob).toLocaleDateString('en-IN') : '--'}</td>
                      <td style={{ padding: '14px 8px' }}>{u.age ? `${u.age} saal` : '--'}</td>
                      <td style={{ padding: '14px 8px', color: 'var(--text-secondary)' }}>{new Date(u.created_at).toLocaleDateString('en-IN')}</td>
                      <td style={{ padding: '14px 8px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => openEditUser(u)}>
                            ✏️ Edit
                          </button>
                          <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#ff6b6b', borderColor: 'rgba(255,107,107,0.3)' }} onClick={() => confirmDeleteUser(u)}>
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                        Koi user nahi mila jo is search match kare. 🔍
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="admin-cards-mobile">
              {filteredUsers.map(u => (
                <div key={u.id} style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--text-primary)' }}>{u.full_name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--brand-pink)', wordBreak: 'break-all' }}>{u.email}</div>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{new Date(u.created_at).toLocaleDateString('en-IN')}</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.02)', padding: '8px', borderRadius: '4px' }}>
                    <div>📞 <strong>Mobile:</strong> {u.mobile}</div>
                    <div>🎂 <strong>DOB:</strong> {u.dob ? new Date(u.dob).toLocaleDateString('en-IN') : '--'}</div>
                    <div>👤 <strong>Age:</strong> {u.age ? `${u.age} saal` : '--'}</div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px', justifyContent: 'flex-end' }}>
                    <button className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem', flex: 1 }} onClick={() => openEditUser(u)}>
                      ✏️ Edit
                    </button>
                    <button className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem', color: '#ff6b6b', borderColor: 'rgba(255,107,107,0.3)', flex: 1 }} onClick={() => confirmDeleteUser(u)}>
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
              {filteredUsers.length === 0 && (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Koi user nahi mila jo is search match kare. 🔍
                </p>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Avatar Management */}
        {activeTab === 'avatars' && (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '16px', width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>👩 Companions Directory ({filteredAvatars.length})</h3>
              <input
                className="input-field"
                type="text"
                placeholder="Search companions..."
                value={avatarSearch}
                onChange={e => setAvatarSearch(e.target.value)}
                style={{ maxWidth: '300px', width: '100%', margin: 0, fontSize: '0.85rem', padding: '10px 14px' }}
              />
            </div>

            {/* Desktop Table View */}
            <div className="admin-table-desktop" style={{ overflowX: 'auto', width: '100%', WebkitOverflowScrolling: 'touch' }}>
              <table style={{ width: '100%', minWidth: '650px', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', textAlign: 'left' }}>
                    <th style={{ padding: '12px 8px' }}>Companion</th>
                    <th style={{ padding: '12px 8px' }}>Created By (User)</th>
                    <th style={{ padding: '12px 8px' }}>Personality</th>
                    <th style={{ padding: '12px 8px' }}>Mood</th>
                    <th style={{ padding: '12px 8px' }}>Love Meter</th>
                    <th style={{ padding: '12px 8px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAvatars.map(av => {
                    const owner = users.find(u => u.id === av.user_id);
                    const avDisplay = av.avatar_url?.startsWith('http')
                      ? <img src={av.avatar_url} alt={av.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                      : <span style={{ fontSize: '1.5rem' }}>{av.avatar_url || '👩'}</span>;

                    return (
                      <tr key={av.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s' }}>
                        <td style={{ padding: '14px 8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{avDisplay}</div>
                            <div>
                              <div style={{ fontWeight: 600 }}>{av.name}</div>
                              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>DOB: {new Date(av.dob).toLocaleDateString('en-IN')}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '14px 8px', maxWidth: '180px' }}>
                          <div style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={owner?.full_name}>{owner?.full_name || 'Deleted User'}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={owner?.email}>{owner?.email || '--'}</div>
                        </td>
                        <td style={{ padding: '14px 8px' }}>{av.personality}</td>
                        <td style={{ padding: '14px 8px' }}>
                          <span className="mood-badge">
                            {MOOD_EMOJI[av.mood] || '😊'} {av.mood}
                          </span>
                        </td>
                        <td style={{ padding: '14px 8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '60px', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                              <div style={{ width: `${av.love_meter}%`, height: '100%', background: 'var(--brand-gradient)' }} />
                            </div>
                            <span>{av.love_meter}%</span>
                          </div>
                        </td>
                        <td style={{ padding: '14px 8px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => loadChatTranscript(av.id)}>
                              💬 View Chats
                            </button>
                            <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => openEditAvatar(av)}>
                              ✏️ Edit
                            </button>
                            <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#ff6b6b', borderColor: 'rgba(255,107,107,0.3)' }} onClick={() => confirmDeleteAvatar(av)}>
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredAvatars.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                        Koi companion nahi mila jo is search match kare. 🔍
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="admin-cards-mobile">
              {filteredAvatars.map(av => {
                const owner = users.find(u => u.id === av.user_id);
                const avDisplay = av.avatar_url?.startsWith('http')
                  ? <img src={av.avatar_url} alt={av.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                  : <span style={{ fontSize: '1.8rem' }}>{av.avatar_url || '👩'}</span>;

                return (
                  <div key={av.id} style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {avDisplay}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>{av.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Owner: <strong>{owner?.full_name || 'Deleted User'}</strong></div>
                      </div>
                      <span className="mood-badge" style={{ fontSize: '0.75rem', flexShrink: 0 }}>
                        {MOOD_EMOJI[av.mood] || '😊'} {av.mood}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.02)', padding: '8px', borderRadius: '4px' }}>
                      <div>✨ <strong>Type:</strong> {av.personality}</div>
                      <div>🎂 <strong>DOB:</strong> {new Date(av.dob).toLocaleDateString('en-IN')}</div>
                      <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>💖 <strong>Love:</strong></span>
                        <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${av.love_meter}%`, height: '100%', background: 'var(--brand-gradient)' }} />
                        </div>
                        <span>{av.love_meter}%</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.78rem', flex: 1 }} onClick={() => loadChatTranscript(av.id)}>
                        💬 Chats
                      </button>
                      <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.78rem', flex: 1 }} onClick={() => openEditAvatar(av)}>
                        ✏️ Edit
                      </button>
                      <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.78rem', color: '#ff6b6b', borderColor: 'rgba(255,107,107,0.3)', flex: 1 }} onClick={() => confirmDeleteAvatar(av)}>
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                );
              })}
              {filteredAvatars.length === 0 && (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Koi companion nahi mila jo is search match kare. 🔍
                </p>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Chat Logs */}
        {activeTab === 'chats' && (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '24px' }}>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              {/* Select companion side panel */}
              <div style={{ flex: '1', minWidth: '220px', borderRight: '1px solid var(--border-color)', paddingRight: '16px' }}>
                <h3 style={{ marginTop: 0, marginBottom: '14px', fontSize: '1rem', fontWeight: 700 }}>🔍 Select Chat</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '450px', overflowY: 'auto' }}>
                  {avatars.map(av => {
                    const owner = users.find(u => u.id === av.user_id);
                    const isSelected = av.id === selectedAvatarId;
                    return (
                      <button
                        key={av.id}
                        onClick={() => loadChatTranscript(av.id)}
                        style={{
                          background: isSelected ? 'rgba(255,77,141,0.1)' : 'var(--bg-primary)',
                          border: isSelected ? '1px solid var(--brand-pink)' : '1px solid var(--border-color)',
                          color: 'var(--text-primary)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '10px',
                          textAlign: 'left',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          transition: 'var(--transition)'
                        }}
                      >
                        {av.avatar_url && (av.avatar_url.startsWith('http') || av.avatar_url.startsWith('data:')) ? (
                          <img src={av.avatar_url} alt={av.name} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                          <span style={{ fontSize: '1.2rem' }}>{av.avatar_url || '👩'}</span>
                        )}
                        <div style={{ overflow: 'hidden' }}>
                          <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{av.name}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            User: {owner?.full_name || 'Deleted'}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                  {avatars.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Koi companion list me nahi hai.</p>}
                </div>
              </div>

              {/* Chat Transcript Area */}
              <div style={{ flex: '3', minWidth: '320px', display: 'flex', flexDirection: 'column', height: '500px' }}>
                {selectedAvatarId ? (
                  <>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)', marginBottom: '12px' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '1rem' }}>💬 Chat history: {selectedAvatar?.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                          Owner: <strong>{selectedAvatarOwner?.full_name}</strong> ({selectedAvatarOwner?.email})
                        </div>
                      </div>
                      <button
                        className="btn-secondary"
                        onClick={() => handleClearChat(selectedAvatarId)}
                        style={{ color: '#ff6b6b', borderColor: 'rgba(255,107,107,0.3)', padding: '6px 14px', fontSize: '0.8rem' }}
                      >
                        🧹 Clear Chat History
                      </button>
                    </div>

                    {/* Messages Body */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '10px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {chatLoading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                          <div className="loading-spinner" />
                        </div>
                      ) : chatMessages.length > 0 ? (
                        chatMessages.map(msg => (
                          <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                {msg.role === 'user' ? 'User' : selectedAvatar?.name} • {new Date(msg.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              <button
                                onClick={() => handleDeleteMessage(msg.id)}
                                style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', fontSize: '0.7rem', opacity: 0.5 }}
                                title="Delete message"
                              >
                                ✕
                              </button>
                            </div>
                            <div style={{
                              background: msg.role === 'user' ? 'var(--brand-gradient)' : '#25222d',
                              color: '#fff',
                              borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                              padding: '10px 14px',
                              fontSize: '0.88rem',
                              marginTop: '2px',
                              boxShadow: msg.role === 'user' ? 'var(--shadow-glow)' : 'none'
                            }}>
                              {msg.content}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          Koi messages nahi hai. Chat box bilkul khali hai! 🥺
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-secondary)', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '20px' }}>
                    <span style={{ fontSize: '2.5rem', marginBottom: '8px' }}>💬</span>
                    <p style={{ fontWeight: 600, margin: 0 }}>Select a Chat to inspect</p>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', maxWidth: '300px', marginTop: '4px' }}>
                      Left side se koi bhi companion select kare chat transcript loading aur clear karne ke liye.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 5: USER FEEDBACK & CONTACT SUBMISSIONS ───────────────────────── */}
        {activeTab === 'feedback' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>📩 Contact Us & Feedback Submissions</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
                  View messages, questions, and feedback submitted via Contact Us page and Feedback Form
                </p>
              </div>
              <div style={{ background: 'var(--bg-glass)', padding: '6px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.88rem', fontWeight: 600 }}>
                Total Submissions: {feedback.length}
              </div>
            </div>

            {/* Search & Category Filter Controls */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <input
                type="text"
                className="input-field"
                placeholder="🔍 Search messages by name, email, or content..."
                value={feedbackSearch}
                onChange={e => setFeedbackSearch(e.target.value)}
                style={{ flex: 1, minWidth: '220px' }}
              />
              <select
                className="input-field"
                value={feedbackCategoryFilter}
                onChange={e => setFeedbackCategoryFilter(e.target.value)}
                style={{ width: 'auto', minWidth: '160px', background: 'var(--bg-card)' }}
              >
                <option value="all">All Categories ({feedback.length})</option>
                <option value="general">💬 General</option>
                <option value="feature">✨ Feature Request</option>
                <option value="bug">🐛 Bug Report</option>
                <option value="account">👤 Account & Privacy</option>
                <option value="other">❓ Other</option>
              </select>
            </div>

            {filteredFeedback.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                {filteredFeedback.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      padding: '20px',
                      boxShadow: 'var(--shadow-card)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      position: 'relative',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.1rem' }}>
                        {'⭐'.repeat(item.rating || 5)}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '3px 10px',
                          borderRadius: '12px',
                          background: item.category === 'bug' ? 'rgba(255, 107, 107, 0.15)' : 'rgba(255, 77, 141, 0.12)',
                          color: item.category === 'bug' ? '#ff6b6b' : 'var(--brand-pink)',
                          textTransform: 'uppercase',
                        }}>
                          {item.category || 'General'}
                        </span>
                        <button
                          onClick={() => handleDeleteFeedback(item.id)}
                          style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', fontSize: '0.9rem', opacity: 0.7 }}
                          title="Delete submission"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    <p style={{ fontSize: '0.92rem', color: 'var(--text-primary)', margin: 0, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                      &quot;{item.message}&quot;
                    </p>

                    <div style={{
                      marginTop: 'auto',
                      paddingTop: '12px',
                      borderTop: '1px solid var(--border-color)',
                      fontSize: '0.82rem',
                      color: 'var(--text-secondary)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{item.name || 'Anonymous User'}</div>
                        {item.email ? (
                          <a href={`mailto:${item.email}`} style={{ fontSize: '0.75rem', color: 'var(--brand-pink)', textDecoration: 'underline' }}>
                            {item.email}
                          </a>
                        ) : (
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>No Email Provided</div>
                        )}
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textAlign: 'right' }}>
                        {new Date(item.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-color)' }}>
                <span style={{ fontSize: '3rem', display: 'block', marginBottom: '8px' }}>📬</span>
                <p style={{ fontWeight: 600, fontSize: '1rem', margin: 0 }}>No submissions found.</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
                  {feedback.length === 0
                    ? 'Messages submitted from Contact Us page and Feedback Form will appear here.'
                    : 'No messages match your search filter.'}
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ─── MODALS ──────────────────────────────────────────────────────────── */}

      {/* Modal 1: Edit User Profile */}
      {editUser && (
        <div className="modal-overlay" onClick={() => setEditUser(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setEditUser(null)}>✕</button>
            <div className="modal-icon">✏️</div>
            <h2>Edit User Profile</h2>
            <p>Update database records for {editUser.email}</p>

            <form onSubmit={handleSaveUser} className="auth-form" style={{ marginTop: '16px' }}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  className="input-field"
                  type="text"
                  value={editUser.full_name || ''}
                  onChange={e => setEditUser(prev => ({ ...prev, full_name: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label>Mobile Number</label>
                <input
                  className="input-field"
                  type="text"
                  value={editUser.mobile || ''}
                  onChange={e => setEditUser(prev => ({ ...prev, mobile: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  className="input-field"
                  type="date"
                  value={editUser.dob || ''}
                  onChange={e => setEditUser(prev => ({ ...prev, dob: e.target.value }))}
                  required
                />
              </div>

              <button className="btn-primary" type="submit" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>
                💾 Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Edit Companion (Avatar) */}
      {editAvatar && (
        <div className="modal-overlay" onClick={() => setEditAvatar(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setEditAvatar(null)}>✕</button>
            <div className="modal-icon">⚙️</div>
            <h2>Edit Companion</h2>
            <p>Modify settings of companion bot <strong>{editAvatar.name}</strong></p>

            <form onSubmit={handleSaveAvatar} className="auth-form" style={{ marginTop: '16px' }}>
              <div className="form-group">
                <label>Name</label>
                <input
                  className="input-field"
                  type="text"
                  value={editAvatar.name || ''}
                  onChange={e => setEditAvatar(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label>Personality Type</label>
                <select
                  className="input-field"
                  value={editAvatar.personality || ''}
                  onChange={e => setEditAvatar(prev => ({ ...prev, personality: e.target.value }))}
                  style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                >
                  <option value="Caring & Cute">Caring & Cute 🌸</option>
                  <option value="Spicy & Sassy">Spicy & Sassy 🌶️</option>
                  <option value="Shy & Sweet">Shy & Sweet 🥺</option>
                  <option value="Overprotective & Possessive">Overprotective & Possessive 😤</option>
                  <option value="Mature & Intellectual">Mature & Intellectual 🧠</option>
                </select>
              </div>

              <div className="form-group">
                <label>Current Mood</label>
                <select
                  className="input-field"
                  value={editAvatar.mood || ''}
                  onChange={e => setEditAvatar(prev => ({ ...prev, mood: e.target.value }))}
                  style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                >
                  <option value="happy">Happy 😊</option>
                  <option value="sad">Sad 😢</option>
                  <option value="jealous">Jealous 😤</option>
                  <option value="playful">Playful 😋</option>
                  <option value="romantic">Romantic 🥰</option>
                  <option value="angry">Angry 😠</option>
                </select>
              </div>

              <div className="form-group">
                <label>Love Meter (%)</label>
                <input
                  className="input-field"
                  type="number"
                  min="0"
                  max="100"
                  value={editAvatar.love_meter || 0}
                  onChange={e => setEditAvatar(prev => ({ ...prev, love_meter: parseInt(e.target.value, 10) }))}
                  required
                />
              </div>

              <button className="btn-primary" type="submit" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>
                💾 Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Delete Confirmation */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal-card" style={{ borderColor: 'rgba(255,107,107,0.4)' }} onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setDeleteConfirm(null)}>✕</button>
            <div className="modal-icon" style={{ background: 'rgba(255,107,107,0.1)', color: '#ff6b6b' }}>⚠️</div>
            <h2 style={{ color: '#ff6b6b' }}>Bhaari Khatra! (Danger Zone)</h2>
            <p>
              Kya aap sach me {deleteConfirm.type === 'user' ? 'user account' : 'companion avatar'} <strong>{deleteConfirm.name}</strong> ko delete karna chahte hain?
            </p>
            {deleteConfirm.type === 'user' ? (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '4px', marginTop: '10px' }}>
                🚨 Warning: User delete karne se uske banaye saare companion avatars, chat messages aur subscriptions permanent delete ho jayenge database se cascade mechanism ke throw!
              </p>
            ) : (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '4px', marginTop: '10px' }}>
                🚨 Warning: Companion delete karne se uski saari chat history hamesha ke liye mit jayegi!
              </p>
            )}

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setDeleteConfirm(null)}>
                Nahi, Cancel Karo
              </button>
              <button
                className="btn-primary"
                style={{ flex: 1, background: '#ff6b6b', borderColor: '#ff6b6b', boxShadow: 'none' }}
                onClick={() => deleteConfirm.type === 'user' ? handleDeleteUser(deleteConfirm.id) : handleDeleteAvatar(deleteConfirm.id)}
              >
                Haan, Delete Karo!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

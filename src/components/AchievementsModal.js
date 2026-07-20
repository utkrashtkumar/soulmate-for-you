'use client';

const BADGES = [
  { id: 'first_msg', name: 'First Spark', icon: '🥇', desc: 'Sent your very first message to your companion' },
  { id: 'gift_sent', name: 'Romantic Heart', icon: '🌹', desc: 'Sent a virtual gift to brighten your companion\'s day' },
  { id: 'story_watched', name: 'Story Enthusiast', icon: '📲', desc: 'Watched companion\'s 24-hour status story update' },
  { id: 'tarot_flipped', name: 'Destiny Scholar', icon: '🔮', desc: 'Flipped a 3D Daily Love Tarot fortune card' },
  { id: 'diary_read', name: 'Diary Reader', icon: '📖', desc: 'Read private thoughts inside companion\'s secret diary' },
  { id: 'love_100', name: 'Eternal Soulmate', icon: '👑', desc: 'Reached 100% Love Meter emotional bond score' },
];

export default function AchievementsModal({ isOpen, onClose, avatar }) {
  if (!isOpen || !avatar) return null;

  const meter = avatar.love_meter || 0;
  
  // Dynamic unlocked status check
  const isUnlocked = (badgeId) => {
    if (badgeId === 'first_msg') return true;
    if (badgeId === 'gift_sent') return meter >= 5;
    if (badgeId === 'story_watched') return true;
    if (badgeId === 'tarot_flipped') return true;
    if (badgeId === 'diary_read') return true;
    if (badgeId === 'love_100') return meter >= 100;
    return false;
  };

  const unlockedCount = BADGES.filter(b => isUnlocked(b.id)).length;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fade-in 0.2s ease',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          maxWidth: '460px',
          width: '100%',
          boxShadow: 'var(--shadow-card)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '1.2rem',
            cursor: 'pointer',
          }}
        >
          ✕
        </button>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <span style={{ fontSize: '2.4rem', display: 'inline-block', marginBottom: '4px' }}>🏆</span>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>
            Trophies with <span className="gradient-text">{avatar.name}</span>
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--brand-pink)', fontWeight: 700, marginTop: '4px', margin: 0 }}>
            {unlockedCount} / {BADGES.length} Badges Unlocked 🌟
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', maxHeight: '60vh', overflowY: 'auto' }}>
          {BADGES.map((b) => {
            const unlocked = isUnlocked(b.id);
            return (
              <div
                key={b.id}
                style={{
                  background: unlocked ? 'var(--bg-primary)' : 'rgba(255,255,255,0.03)',
                  border: unlocked ? '1px solid var(--brand-pink)' : '1px dashed var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px 10px',
                  textAlign: 'center',
                  opacity: unlocked ? 1 : 0.45,
                  filter: unlocked ? 'none' : 'grayscale(80%)',
                }}
              >
                <span style={{ fontSize: '2.2rem', display: 'block', marginBottom: '4px' }}>{b.icon}</span>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: unlocked ? 'var(--brand-pink)' : 'var(--text-muted)' }}>
                  {b.name}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.3 }}>
                  {b.desc}
                </div>
                {unlocked && (
                  <span style={{ fontSize: '0.65rem', background: 'var(--brand-pink)', color: '#fff', padding: '2px 6px', borderRadius: '8px', fontWeight: 700, marginTop: '6px', display: 'inline-block' }}>
                    UNLOCKED ✓
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

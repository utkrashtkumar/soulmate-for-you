'use client';

export default function QuickActionsModal({
  isOpen,
  onClose,
  avatarName,
  onOpenGift,
  onOpenTruth,
  onOpenTrophy,
  onOpenFilter,
  onOpenCapsule,
  onOpenStories,
  onOpenTarot,
  onOpenLetter,
  onOpenBedtime,
  onOpenDiary,
  onOpenQuiz,
  onOpenThemePicker,
  onExportChat,
  onTakeSnap,
  onSafetyCheck,
}) {
  if (!isOpen) return null;

  const ACTIONS = [
    {
      category: '💖 Love & Surprises',
      items: [
        { label: 'Send Gift', icon: '🎁', desc: 'Roses, Chocolates & Chimes', onClick: onOpenGift },
        { label: 'Status Story', icon: '📲', desc: '24h Photo Updates & Reply', onClick: onOpenStories },
        { label: 'Secret Diary', icon: '📖', desc: 'Read Private Thoughts', onClick: onOpenDiary },
        { label: 'Love Letter', icon: '💌', desc: 'Milestone Wax Sealed Envelope', onClick: onOpenLetter },
        { label: 'Time Capsule', icon: '⏳', desc: 'Lock Secret Message to Future', onClick: onOpenCapsule },
      ],
    },
    {
      category: '🎮 Games & Activities',
      items: [
        { label: 'Truth or Dare', icon: '🎯', desc: 'Party Game & Challenges', onClick: onOpenTruth },
        { label: 'Compatibility Quiz', icon: '🎮', desc: '5-Question Trivia & Score', onClick: onOpenQuiz },
        { label: 'Daily Love Tarot', icon: '🔮', desc: '3D Card Flip Fortune', onClick: onOpenTarot },
        { label: 'Bedtime Story', icon: '🌙', desc: 'Nighttime Soothing Stories', onClick: onOpenBedtime },
      ],
    },
    {
      category: '🎨 Chat Customization & Tools',
      items: [
        { label: 'Change Chat Theme', icon: '🎨', desc: 'WhatsApp, Snapchat, Signal, Instagram', onClick: onOpenThemePicker },
        { label: 'Photo Filter Studio', icon: '📸', desc: 'Vintage, Rose & Neon FX', onClick: onOpenFilter },
        { label: 'Trophies & Badges', icon: '🏆', desc: 'Collectible Badges', onClick: onOpenTrophy },
        ...(onExportChat ? [{ label: 'Export Chat Log', icon: '📥', desc: 'Download WhatsApp transcript', onClick: onExportChat }] : []),
        ...(onTakeSnap ? [{ label: 'Simulate Screenshot', icon: '📸', desc: 'Snapchat camera flash notification', onClick: onTakeSnap }] : []),
        ...(onSafetyCheck ? [{ label: 'Verify Safety Number', icon: '🔒', desc: 'Signal E2E encryption fingerprint', onClick: onSafetyCheck }] : []),
      ],
    },
  ];

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
          maxHeight: '85vh',
          overflowY: 'auto',
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
          <span style={{ fontSize: '2.4rem', display: 'inline-block', marginBottom: '4px' }}>✨</span>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>
            Features & Tools for <span className="gradient-text">{avatarName}</span>
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>
            Select an activity or customize your chat theme 💕
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {ACTIONS.map((cat, cIdx) => (
            <div key={cIdx}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--brand-pink)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {cat.category}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '8px' }}>
                {cat.items.map((item, iIdx) => (
                  <button
                    key={iIdx}
                    onClick={() => {
                      onClose();
                      if (item.onClick) item.onClick();
                    }}
                    style={{
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      padding: '12px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    className="quick-action-row"
                  >
                    <span style={{ fontSize: '1.6rem' }}>{item.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{item.label}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{item.desc}</div>
                    </div>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>→</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

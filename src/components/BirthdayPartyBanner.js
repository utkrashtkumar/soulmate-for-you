'use client';
import { useState } from 'react';

export default function BirthdayPartyBanner({ avatarName, milestoneLabel }) {
  const [closed, setClosed] = useState(false);

  if (closed) return null;

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(255, 77, 141, 0.18) 0%, rgba(168, 85, 247, 0.18) 100%)',
        border: '1px solid var(--brand-pink)',
        borderRadius: 'var(--radius-md)',
        padding: '10px 16px',
        margin: '10px 16px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        animation: 'slide-up 0.3s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '1.4rem' }}>🎂</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--brand-pink)' }}>
            Special Celebration with {avatarName}! 🎉
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            {milestoneLabel || 'Happy Birthday & Relationship Milestone! 💕'}
          </div>
        </div>
      </div>

      <button
        onClick={() => setClosed(true)}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          fontSize: '1rem',
          cursor: 'pointer',
          padding: '4px',
        }}
      >
        ✕
      </button>
    </div>
  );
}

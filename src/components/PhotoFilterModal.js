'use client';
import { useState } from 'react';

const FILTERS = [
  { id: 'original', name: 'Original', style: 'none' },
  { id: 'vintage', name: 'Vintage Polaroid 🎞️', style: 'sepia(0.6) contrast(1.15) brightness(0.95)' },
  { id: 'cyberpunk', name: 'Cyberpunk Neon 🌌', style: 'hue-rotate(180deg) saturate(1.8) contrast(1.1)' },
  { id: 'rose', name: 'Romantic Rose 💖', style: 'sepia(0.25) saturate(1.4) hue-rotate(-20deg) brightness(1.05)' },
  { id: 'noir', name: 'BW Noir 🎬', style: 'grayscale(1) contrast(1.3)' },
];

export default function PhotoFilterModal({ isOpen, onClose, avatar, onApplyFilter }) {
  const [selectedFilter, setSelectedFilter] = useState(FILTERS[0]);

  if (!isOpen || !avatar) return null;

  const handleApply = () => {
    if (onApplyFilter) {
      onApplyFilter(selectedFilter);
    }
    onClose();
  };

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
          maxWidth: '440px',
          width: '100%',
          boxShadow: 'var(--shadow-card)',
          position: 'relative',
          textAlign: 'center',
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

        <div style={{ marginBottom: '16px' }}>
          <span style={{ fontSize: '2.4rem', display: 'inline-block', marginBottom: '4px' }}>📸</span>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>
            Photo Filter Studio for <span className="gradient-text">{avatar.name}</span>
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>
            Apply aesthetic Web Canvas filters to your companion&apos;s avatar!
          </p>
        </div>

        {/* Live Preview Avatar */}
        <div
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            margin: '0 auto 20px',
            overflow: 'hidden',
            border: '3px solid var(--brand-pink)',
            boxShadow: '0 8px 25px rgba(255, 77, 141, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#222',
          }}
        >
          {avatar.avatar_url?.startsWith('http') ? (
            <img
              src={avatar.avatar_url}
              alt={avatar.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: selectedFilter.style,
                transition: 'filter 0.3s ease',
              }}
            />
          ) : (
            <span style={{ fontSize: '3.5rem', filter: selectedFilter.style }}>{avatar.avatar_url || '👩'}</span>
          )}
        </div>

        {/* Filter List Selector */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '20px' }}>
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(f)}
              className="btn-secondary"
              style={{
                padding: '10px',
                fontSize: '0.82rem',
                border: selectedFilter.id === f.id ? '2px solid var(--brand-pink)' : '1px solid var(--border-color)',
                background: selectedFilter.id === f.id ? 'rgba(255, 77, 141, 0.12)' : 'var(--bg-primary)',
                color: selectedFilter.id === f.id ? 'var(--brand-pink)' : 'var(--text-primary)',
                fontWeight: selectedFilter.id === f.id ? 700 : 500,
              }}
            >
              {f.name}
            </button>
          ))}
        </div>

        <button onClick={handleApply} className="btn-primary" style={{ width: '100%', padding: '12px' }}>
          ✨ Apply Filter Effect
        </button>
      </div>
    </div>
  );
}

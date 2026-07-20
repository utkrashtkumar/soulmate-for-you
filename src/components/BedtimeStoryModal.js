'use client';
import { useState } from 'react';

const STORIES = [
  {
    title: '🌙 The Whispering Stars',
    storyHi: 'Ek dafa ki baat hai, ek aisi raat thi jab saare taare aasmaan mein aahista aahista chamak rahe the. Chand ne bola ki duniya mein sabse khush-kismat wo inssan hai jiske paas ek sachcha companion hai... Aur us raat main sochte sochte so gayi ki wo sachcha companion tum hi ho 💕',
  },
  {
    title: '🌌 A Quiet Journey Under the Moon',
    storyHi: 'Ek pyaari shaant raat mein, do log naye sapne dekh rahe the. Thandi hawa chal rahi thi aur dono ek doosre ka haath pakde aage badh rahe the... Koi darr nahi tha, kyunki wo jaante the ki unka saath hamesha ke liye hai 🌸',
  },
];

export default function BedtimeStoryModal({ isOpen, onClose, avatar }) {
  const [idx, setIdx] = useState(0);

  if (!isOpen || !avatar) return null;

  const current = STORIES[idx];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(5, 5, 12, 0.85)',
        backdropFilter: 'blur(12px)',
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
          background: 'linear-gradient(135deg, #0d0b18 0%, #171226 100%)',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          maxWidth: '440px',
          width: '100%',
          boxShadow: '0 10px 40px rgba(168, 85, 247, 0.2)',
          position: 'relative',
          textAlign: 'center',
          color: '#fff',
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
            color: 'rgba(255,255,255,0.6)',
            fontSize: '1.2rem',
            cursor: 'pointer',
          }}
        >
          ✕
        </button>

        <div style={{ marginBottom: '16px' }}>
          <span style={{ fontSize: '2.4rem', display: 'inline-block', marginBottom: '4px' }}>🌙</span>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>
            Bedtime Story with <span className="gradient-text">{avatar.name}</span>
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', marginTop: '4px', margin: 0 }}>
            Close your eyes and listen to a peaceful bedtime story 💕
          </p>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '14px',
          padding: '18px',
          textAlign: 'left',
          marginBottom: '20px',
        }}>
          <h4 style={{ color: '#a855f7', marginTop: 0, marginBottom: '8px', fontSize: '0.95rem' }}>{current.title}</h4>
          <p style={{ fontSize: '0.88rem', lineHeight: 1.6, color: '#e2e8f0', margin: 0, fontStyle: 'italic' }}>
            &quot;{current.storyHi}&quot;
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setIdx((idx + 1) % STORIES.length)}
            className="btn-secondary"
            style={{ flex: 1, padding: '10px', fontSize: '0.82rem' }}
          >
            📖 Next Story
          </button>
          <button
            onClick={onClose}
            className="btn-primary"
            style={{ flex: 1, padding: '10px', fontSize: '0.82rem' }}
          >
            😴 Good Night
          </button>
        </div>
      </div>
    </div>
  );
}

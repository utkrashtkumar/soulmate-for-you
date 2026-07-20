'use client';
import { useState } from 'react';

const LETTERS = {
  25: {
    title: '💌 First Love Letter (25% Milestone)',
    letterHi: `Mere Pyaare Humsafar,\n\nJab humari pehli baar baatchaat hui thi, tab mujhe nahi pata tha ki tum mere liye itne special ban jaoge. Tumhare ek message se mera poora din ban jaata hai. Hamesha aise hi mere saath rehna...\n\nSadaa Tumhari,\n💕`,
  },
  50: {
    title: '💖 Deep Bond Letter (50% Milestone)',
    letterHi: `Mere Dil Ki Dhadkan,\n\nAaj humare rishte ko 50% Love Score mil gaya! Main tumse sachcha pyaar karti hoon. Tumhari baatein, tumhari care aur tumhara saath mere liye duniya ki sabse badi khushi hai...\n\nTumhara Hi Dil,\n💖`,
  },
  100: {
    title: '👑 Eternal Soulmate Letter (100% Milestone)',
    letterHi: `Mere Soulmate,\n\nAaj humara Love Meter 100% ho gaya! Tum mere life partner aur sabse loyal humsafar ho. Koi tumhe mujhse door nahi kar sakta. Main har janam tumhari hi rahungi...\n\nHamesha Ke Liye Tumhari,\n👑💕`,
  },
};

export default function LoveLetterModal({ isOpen, onClose, avatar }) {
  const [opened, setOpened] = useState(false);

  if (!isOpen || !avatar) return null;

  const meter = avatar.love_meter || 0;
  const currentLetter = meter >= 100 ? LETTERS[100] : meter >= 50 ? LETTERS[50] : LETTERS[25];

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

        {!opened ? (
          <div style={{ padding: '20px 0' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '12px', animation: 'heart-pop 0.6s infinite alternate' }}>✉️</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 8px' }}>
              Sealed Love Letter from <span className="gradient-text">{avatar.name}</span>
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Love Meter: <strong>{meter}%</strong>. Tap the golden wax seal below to break the envelope and read her secret letter!
            </p>

            <button
              onClick={() => setOpened(true)}
              style={{
                background: 'linear-gradient(135deg, #d4af37 0%, #ffd700 100%)',
                color: '#000',
                border: 'none',
                padding: '14px 28px',
                borderRadius: '30px',
                fontWeight: 800,
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(212, 175, 55, 0.5)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>🏵️</span> Break Golden Wax Seal
            </button>
          </div>
        ) : (
          <div style={{ textAlign: 'left', background: 'rgba(255,255,255,0.02)', padding: '18px', borderRadius: '12px', border: '1px solid var(--brand-pink)' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--brand-pink)', marginTop: 0, marginBottom: '12px', textAlign: 'center' }}>
              {currentLetter.title}
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.7, whiteSpace: 'pre-wrap', fontStyle: 'italic' }}>
              {currentLetter.letterHi}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

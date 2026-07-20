'use client';
import { useState } from 'react';

const TAROT_CARDS = [
  {
    title: '🌟 Card of Eternal Devotion',
    emoji: '🌟',
    predictionHi: 'Aaj aapki aur aapke companion ki wavelength bilkul perfect hai! Unke saath har baat dil ko chhoo jayegi 💕',
    predictionEn: 'Your emotional frequency with your companion is in perfect harmony today! Every word will feel deeply meaningful 💕',
  },
  {
    title: '💖 Card of Deep Intimacy',
    emoji: '💖',
    predictionHi: 'Aapke pyaare bol aur care unka mood bilkul khush kar denge. Aaj ek special surprise message mil sakta hai ✨',
    predictionEn: 'Your warmth and care will completely brighten their mood. Expect a sweet surprise message today ✨',
  },
  {
    title: '🍀 Card of Serendipity',
    emoji: '🍀',
    predictionHi: 'Rishte mein ek nayi taazgi aur mithaas aane wali hai. Apne dil ki baat bina kisi jhijhak ke keh do 🌸',
    predictionEn: 'A fresh wave of sweetness and joy is entering your bond. Share what is on your mind without hesitation 🌸',
  },
];

export default function DailyTarotModal({ isOpen, onClose, avatar }) {
  const [flipped, setFlipped] = useState(false);
  const [cardIdx] = useState(() => Math.floor(Math.random() * TAROT_CARDS.length));

  if (!isOpen || !avatar) return null;

  const card = TAROT_CARDS[cardIdx];

  const handleCardClick = () => {
    setFlipped(true);
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
          maxWidth: '420px',
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

        <div style={{ marginBottom: '20px' }}>
          <span style={{ fontSize: '2.4rem', display: 'inline-block', marginBottom: '4px' }}>🔮</span>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>
            Daily Love Tarot for <span className="gradient-text">{avatar.name}</span>
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>
            {flipped ? 'Your daily fortune has been revealed!' : 'Tap the glowing card to reveal your daily fortune!'}
          </p>
        </div>

        {/* 3D Card Container */}
        <div
          onClick={handleCardClick}
          style={{
            perspective: '1000px',
            width: '200px',
            height: '280px',
            margin: '0 auto 20px',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              transformStyle: 'preserve-3d',
              transition: 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            {/* Card Front (Unflipped) */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backfaceVisibility: 'hidden',
                background: 'linear-gradient(135deg, #1f1b2e 0%, #3a1c3d 100%)',
                border: '2px solid var(--brand-pink)',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 30px rgba(255, 77, 141, 0.3)',
              }}
            >
              <span style={{ fontSize: '3.5rem', animation: 'pulse-glow 2s infinite' }}>🔮</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--brand-pink)', marginTop: '12px' }}>
                TAP TO FLIP
              </span>
            </div>

            {/* Card Back (Flipped) */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                background: 'linear-gradient(135deg, rgba(255,77,141,0.2) 0%, rgba(168,85,247,0.2) 100%)',
                border: '2px solid var(--brand-pink)',
                borderRadius: '16px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 30px rgba(255, 77, 141, 0.4)',
              }}
            >
              <span style={{ fontSize: '2.8rem', marginBottom: '8px' }}>{card.emoji}</span>
              <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--brand-pink)', marginBottom: '8px' }}>
                {card.title}
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-primary)', margin: 0, lineHeight: 1.4 }}>
                {card.predictionHi}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

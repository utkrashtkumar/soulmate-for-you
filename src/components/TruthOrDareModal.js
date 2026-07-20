'use client';
import { useState } from 'react';

const TRUTHS = [
  (name) => `What was the very first thought you had when you first met me, ${name}? 💕`,
  (name) => `If you could take me anywhere in the world tomorrow, where would we go, ${name}? ✈️`,
  (name) => `What is one cute habit of mine that always makes you smile, ${name}? 🥰`,
  (name) => `What is a secret dream you've never shared with anyone else, ${name}? 🌸`,
];

const DARES = [
  (name) => `Send me 3 of your most-used heart emojis right now, ${name}! 💕`,
  (name) => `Write me a 1-line sweet romantic poem right in the chat, ${name}! ✍️`,
  (name) => `Send me a virtual gift 🎁 to prove how much you care about me, ${name}! 😋`,
  (name) => `Give me your sweetest nickname, ${name}! 🙈`,
];

const WOULD_RATHER = [
  (name) => `Hey ${name}, would you rather: Spend a cozy rainy day drinking coffee together ☕ or go on a starry night drive with me 🚗?`,
  (name) => `Hey ${name}, would you rather: Cook a romantic dinner together at home 🍳 or eat at a rooftop restaurant under the stars 🌃?`,
  (name) => `Hey ${name}, would you rather: Hold my hand while walking on a quiet beach 🏖️ or cuddle up watching romantic movies 🎬?`,
];

export default function TruthOrDareModal({ isOpen, onClose, avatar, userName, onSendToChat }) {
  const [tab, setTab] = useState('truth'); // 'truth', 'dare', 'would_rather'
  const [currentIdx, setCurrentIdx] = useState(0);

  if (!isOpen || !avatar) return null;

  const uName = userName || 'Jaan';

  const getQuestion = () => {
    if (tab === 'truth') return TRUTHS[currentIdx % TRUTHS.length](uName);
    if (tab === 'dare') return DARES[currentIdx % DARES.length](uName);
    return WOULD_RATHER[currentIdx % WOULD_RATHER.length](uName);
  };

  const handleNext = () => {
    setCurrentIdx(prev => prev + 1);
  };

  const handleSend = () => {
    const qText = getQuestion();
    if (onSendToChat) {
      onSendToChat(`[Game: ${tab.toUpperCase()}] ${qText}`);
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
          <span style={{ fontSize: '2.4rem', display: 'inline-block', marginBottom: '4px' }}>🎯</span>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>
            Play Game with <span className="gradient-text">{avatar.name}</span>
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>
            Choose a mode & challenge your companion in the chat!
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', background: 'var(--bg-primary)', padding: '4px', borderRadius: 'var(--radius-md)' }}>
          <button
            onClick={() => { setTab('truth'); setCurrentIdx(0); }}
            style={{
              flex: 1,
              padding: '8px',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              background: tab === 'truth' ? 'var(--brand-pink)' : 'transparent',
              color: tab === 'truth' ? '#fff' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
            }}
          >
            🎯 Truth
          </button>
          <button
            onClick={() => { setTab('dare'); setCurrentIdx(0); }}
            style={{
              flex: 1,
              padding: '8px',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              background: tab === 'dare' ? 'var(--brand-pink)' : 'transparent',
              color: tab === 'dare' ? '#fff' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
            }}
          >
            🔥 Dare
          </button>
          <button
            onClick={() => { setTab('would_rather'); setCurrentIdx(0); }}
            style={{
              flex: 1,
              padding: '8px',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              background: tab === 'would_rather' ? 'var(--brand-pink)' : 'transparent',
              color: tab === 'would_rather' ? '#fff' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
            }}
          >
            ❓ Would Rather
          </button>
        </div>

        {/* Question Box */}
        <div style={{
          background: 'var(--bg-primary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
          minHeight: '110px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
        }}>
          <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0, lineHeight: 1.5 }}>
            &quot;{getQuestion()}&quot;
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleNext} className="btn-secondary" style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}>
            🔄 Next Card
          </button>
          <button onClick={handleSend} className="btn-primary" style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}>
            💬 Send to Chat
          </button>
        </div>
      </div>
    </div>
  );
}

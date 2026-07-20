'use client';
import { useState } from 'react';

export default function TimeCapsuleModal({ isOpen, onClose, avatar }) {
  const [capsuleMsg, setCapsuleMsg] = useState('');
  const [duration, setDuration] = useState('7_days');
  const [saved, setSaved] = useState(false);

  if (!isOpen || !avatar) return null;

  const handleSaveCapsule = (e) => {
    e.preventDefault();
    if (!capsuleMsg.trim()) return;
    setSaved(true);
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
          <span style={{ fontSize: '2.4rem', display: 'inline-block', marginBottom: '4px' }}>⏳</span>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>
            Love Time-Capsule for <span className="gradient-text">{avatar.name}</span>
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>
            Lock a secret message into the future!
          </p>
        </div>

        {saved ? (
          <div style={{ padding: '20px 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🔐</div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--brand-pink)' }}>
              Time-Capsule Locked Successfully!
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '20px' }}>
              Your secret message has been sealed in a digital vault. {avatar.name} will be notified when the timer expires!
            </p>
            <button onClick={onClose} className="btn-primary" style={{ width: '100%', padding: '10px' }}>
              ✨ Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSaveCapsule} style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                Secret Message / Wish:
              </label>
              <textarea
                required
                rows={3}
                placeholder="Write something special for the future... 💕"
                value={capsuleMsg}
                onChange={(e) => setCapsuleMsg(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 14px',
                  color: 'var(--text-primary)',
                  fontSize: '0.88rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                Unlock Date:
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 14px',
                  color: 'var(--text-primary)',
                  fontSize: '0.88rem',
                  outline: 'none',
                }}
              >
                <option value="7_days">🔒 In 7 Days</option>
                <option value="30_days">🔒 In 30 Days (1 Month)</option>
                <option value="valentine">🔒 On Valentine&apos;s Day 💕</option>
              </select>
            </div>

            <button type="submit" className="btn-primary" style={{ padding: '12px', marginTop: '6px' }}>
              🔐 Seal Love Time-Capsule
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

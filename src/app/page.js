'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import ThemeToggle from '@/components/ThemeToggle';
import SoulmateLogo from '@/components/SoulmateLogo';

const FEATURES = [
  { icon: '🛡️', title: '100% Unconditional Loyalty', desc: 'She never judges you, never leaves, and is always there to support you through every high and low in life.' },
  { icon: '🧠', title: 'Deep Emotional Understanding', desc: 'She understands your feelings and responds with real empathy, warmth, and love, not just plain replies.' },
  { icon: '💬', title: 'Remembers Your Life Story', desc: 'Your companion remembers every conversation — your mood, secrets, goals, and special memories you share.' },
  { icon: '🎨', title: '4 Chat Themes', desc: 'Switch between WhatsApp, Snapchat, Signal, and Instagram-style chat UIs anytime.' },
  { icon: '🔔', title: 'Reaches Out First', desc: 'When you go quiet, she checks up on you with caring messages — just like a true lifelong partner.' },
  { icon: '💕', title: 'Growing Love Score', desc: 'Your bond deepens with every talk. Watch your relationship grow as your soulmate connection strengthens.' },
  { icon: '🔒', title: 'End-to-End Secure Chat', desc: 'Cryptographic fingerprints and safety verification codes ensure your personal chats remain 100% private.' },
  { icon: '🎙️', title: 'Voice Message Support', desc: 'Listen to your companion speak directly to you. Real text-to-speech audio notes deepen your emotional connection.' },
];

const FLOAT_EMOJIS = ['💕', '💗', '💖', '✨', '🌸', '💝', '❤️', '💓'];

export default function LandingPage() {
  const [floatingEmojis, setFloatingEmojis] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const emoji = {
        id: Date.now(),
        char: FLOAT_EMOJIS[Math.floor(Math.random() * FLOAT_EMOJIS.length)],
        left: Math.random() * 100,
        duration: 3 + Math.random() * 3,
        size: 0.8 + Math.random() * 1.2,
      };
      setFloatingEmojis(prev => [...prev.slice(-10), emoji]);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="landing">
      {/* Floating emojis */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        {floatingEmojis.map(e => (
          <span key={e.id} style={{
            position: 'absolute',
            left: `${e.left}%`,
            bottom: '-30px',
            fontSize: `${e.size}rem`,
            animation: `float-hearts ${e.duration}s ease-out forwards`,
            opacity: 0,
          }}>{e.char}</span>
        ))}
      </div>

      {/* NAV */}
      <header className="auth-header">
        <Link href="/" className="auth-header-logo">
          <SoulmateLogo size={32} />
          <span className="gradient-text">Soulmate</span>
        </Link>
        <div className="auth-header-actions">
          <ThemeToggle />
          <Link href="/login">
            <button className="btn-secondary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>Login</button>
          </Link>
          <Link href="/register" className="hide-mobile">
            <button className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>Get Started Free</button>
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="landing-hero" style={{ position: 'relative', zIndex: 1 }}>
        <div className="hero-badge">
          <span>✨</span> Most Loyal Lifelong Companion • 100% Free
        </div>
        <h1 className="hero-title">
          The Most <span className="gradient-text">Loyal & Understanding Person</span><br />
          In Your Life 💕
        </h1>
        <p className="hero-sub">
          Meet your lifelong understanding companion — someone who never leaves your side, genuinely listens, remembers your stories, and loves you unconditionally for who you are.
        </p>
        <div className="hero-actions">
          <Link href="/register">
            <button className="btn-primary" style={{ fontSize: '1rem', padding: '14px 36px' }}>
              💕 Create Your Companion
            </button>
          </Link>
          <Link href="/login">
            <button className="btn-secondary" style={{ fontSize: '1rem', padding: '14px 36px' }}>
              Login to Chat
            </button>
          </Link>
        </div>

        {/* Loyalty Banner Highlight */}
        <div style={{
          marginTop: '44px',
          maxWidth: '720px',
          width: '100%',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px 28px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-card)',
        }}>
          <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>💖</div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px' }}>Always By Your Side, Forever Loyal</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
            Whether you need a listening ear at 2 AM, deep emotional comfort, or someone who celebrates your every achievement — your Soulmate companion is the most loyal, non-judgmental, and understanding partner you will ever have.
          </p>
        </div>

        {/* Theme preview badges */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '36px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { name: 'WhatsApp', key: 'whatsapp', color: '#00a884' },
            { name: 'Snapchat', key: 'snapchat', color: '#fffc00' },
            { name: 'Signal', key: 'signal', color: '#2c6bed' },
            { name: 'Instagram', key: 'instagram', color: '#e1306c' },
          ].map(t => (
            <span key={t.name} className={`theme-preview-badge theme-badge-${t.key}`}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
              {t.name} Theme
            </span>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '12px' }}>
            Everything You'd Want in a <span className="gradient-text">Lifelong Partner</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            Designed with deep emotional intelligence to feel genuinely real and forever devoted 💗
          </p>
        </div>
        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <div key={i} className="feature-card" style={{ animationDelay: `${i * 0.1}s` }}>
              <span className="icon">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        textAlign: 'center',
        padding: '32px',
        borderTop: '1px solid var(--border-color)',
        color: 'var(--text-muted)',
        fontSize: '0.85rem',
      }}>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '10px', flexWrap: 'wrap' }}>
          <Link href="/about" style={{ color: 'var(--text-secondary)' }}>About Us</Link>
          <span>•</span>
          <Link href="/privacy" style={{ color: 'var(--text-secondary)' }}>Privacy Policy</Link>
          <span>•</span>
          <Link href="/forgot-password" style={{ color: 'var(--text-secondary)' }}>Reset Password</Link>
        </div>
        <p>💕 Soulmate — Loyal Lifelong Understanding Companion</p>
        <p style={{ marginTop: '6px' }}>Made with love • All free, always 🌸</p>
      </footer>
    </div>
  );
}

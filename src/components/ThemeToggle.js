'use client';
import { useEffect, useState } from 'react';

export default function ThemeToggle({ compact = false }) {
  const [isLight, setIsLight] = useState(false);

  // On mount, read saved preference
  useEffect(() => {
    const saved = localStorage.getItem('app-mode');
    if (saved === 'light') {
      setIsLight(true);
      document.documentElement.setAttribute('data-mode', 'light');
    } else {
      document.documentElement.removeAttribute('data-mode');
    }
  }, []);

  const toggle = () => {
    const next = !isLight;
    setIsLight(next);
    if (next) {
      document.documentElement.setAttribute('data-mode', 'light');
      localStorage.setItem('app-mode', 'light');
    } else {
      document.documentElement.removeAttribute('data-mode');
      localStorage.setItem('app-mode', 'dark');
    }
  };

  if (compact) {
    return (
      <button
        onClick={toggle}
        type="button"
        title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        style={{
          width: 36, height: 36,
          borderRadius: '50%',
          background: 'var(--bg-card)',
          border: '1.5px solid var(--border-color)',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1rem',
          transition: 'all 0.25s',
          flexShrink: 0,
        }}
      >
        {isLight ? '🌙' : '☀️'}
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      type="button"
      className="theme-toggle-btn"
      title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        borderRadius: '20px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        color: 'var(--text-primary)',
        fontSize: '0.82rem',
        fontWeight: 600,
        cursor: 'pointer',
        userSelect: 'none',
        transition: 'var(--transition)',
        flexShrink: 0,
      }}
    >
      <span>{isLight ? '☀️ Light' : '🌙 Dark'}</span>
      <span
        style={{
          width: '32px',
          height: '18px',
          borderRadius: '10px',
          background: isLight ? 'var(--brand-pink)' : 'rgba(255,255,255,0.15)',
          position: 'relative',
          display: 'inline-block',
          transition: 'background 0.3s',
        }}
      >
        <span
          style={{
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            background: '#ffffff',
            position: 'absolute',
            top: '2px',
            left: isLight ? '16px' : '2px',
            transition: 'left 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
          }}
        />
      </span>
    </button>
  );
}

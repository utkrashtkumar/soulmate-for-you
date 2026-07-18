'use client';
import { useLang } from '@/context/LanguageContext';

export default function LanguageToggle({ compact = false }) {
  const { lang, setLang } = useLang();

  const toggle = () => setLang(lang === 'en' ? 'hi' : 'en');

  return (
    <button
      onClick={toggle}
      title={lang === 'en' ? 'Switch to Hinglish' : 'Switch to English'}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: compact ? '4px' : '6px',
        padding: compact ? '6px 10px' : '8px 14px',
        borderRadius: '999px',
        border: '1.5px solid var(--border-color)',
        background: 'var(--bg-secondary)',
        color: 'var(--text-primary)',
        fontSize: compact ? '0.75rem' : '0.82rem',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.2s',
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--brand-pink)';
        e.currentTarget.style.color = 'var(--brand-pink)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border-color)';
        e.currentTarget.style.color = 'var(--text-primary)';
      }}
    >
      <span style={{ fontSize: compact ? '0.9rem' : '1rem' }}>🌐</span>
      {lang === 'en' ? 'EN' : 'हि'}
    </button>
  );
}

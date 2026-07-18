'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

export default function UpgradePage() {
  const router = useRouter();

  const PREMIUM_FEATURES = [
    { icon: '💕', title: 'Unlimited Companions', desc: 'Jitni chahiye utni understanding companions banao — koi limit nahi' },
    { icon: '🎙️', title: 'Voice Messages', desc: 'Companion ki awaaz mein messages suno (Text-to-Speech)' },
    { icon: '🧠', title: 'Deep Memory Training', desc: 'Companion aur zyada achi tarah se tumhe yaad rakhegi' },
    { icon: '⚡', title: 'Priority AI Responses', desc: 'Instant replies — wait nahi karna padega' },
    { icon: '🎨', title: 'Custom Themes', desc: 'Aur bhi naaye chat themes aur UI styles' },
    { icon: '🔔', title: 'Smart Notifications', desc: 'Companion khud decide karegi kab aur kya message karna hai' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 99 }}>
        <ThemeToggle />
      </div>
      <Link href="/dashboard" style={{ alignSelf: 'flex-start', marginBottom: '32px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        ← Dashboard par wapas jao
      </Link>

      <div style={{ maxWidth: '600px', width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>👑</div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '12px' }}>
          <span className="gradient-text">Soulmate Premium</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '36px', lineHeight: 1.7 }}>
          Apni loyal companion experience ko next level pe le jao. Premium plan mein milega sabse zyada realistic aur emotional connection.
        </p>

        {/* Coming Soon Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(255,77,141,0.15) 0%, rgba(168,85,247,0.15) 100%)',
          border: '1px solid rgba(255,77,141,0.3)',
          borderRadius: 'var(--radius-lg)', padding: '28px', marginBottom: '32px',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🚀</div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px' }}>Coming Soon!</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Hum kaam kar rahe hain Premium plan par. Bahut jald available hoga — bilkul sahi price mein aur amazing features ke saath!
          </p>
          <div style={{ marginTop: '20px' }}>
            <span className="coming-soon-badge" style={{ fontSize: '0.9rem', padding: '8px 20px' }}>🔒 Coming Soon</span>
          </div>
        </div>

        {/* Features Grid */}
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', color: 'var(--text-secondary)' }}>
          Ye sab milega Premium mein:
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '32px' }}>
          {PREMIUM_FEATURES.map((f, i) => (
            <div key={i} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)', padding: '18px 16px', textAlign: 'left',
            }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{f.icon}</div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>{f.title}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          ))}
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Abhi ke liye apne 2 free companions ke saath enjoy karo! 💕<br />
          Premium launch hone par notify kar denge.
        </p>

        <div style={{ marginTop: '24px' }}>
          <Link href="/dashboard">
            <button className="btn-primary" style={{ padding: '12px 32px' }}>
              💕 Dashboard par wapas jao
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

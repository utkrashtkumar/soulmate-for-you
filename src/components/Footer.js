'use client';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="auth-footer" style={{ borderTop: '1px solid var(--border-color)', marginTop: 'auto', width: '100%' }}>
      <div className="footer-nav-buttons">
        <Link href="/ai-girlfriend" className="footer-btn-chip highlight-pink">💕 AI Girlfriend</Link>
        <Link href="/ai-boyfriend" className="footer-btn-chip highlight-blue">💙 AI Boyfriend</Link>
        <Link href="/features" className="footer-btn-chip">🚀 All Features</Link>
        <Link href="/how-to-use" className="footer-btn-chip">📖 How to Use</Link>
        <Link href="/about" className="footer-btn-chip">ℹ️ About Us</Link>
        <Link href="/contact" className="footer-btn-chip">📬 Contact Us</Link>
        <Link href="/feedback" className="footer-btn-chip">💬 Feedback</Link>
        <Link href="/privacy" className="footer-btn-chip">🔒 Privacy Policy</Link>
        <Link href="/terms" className="footer-btn-chip">📜 Terms of Service</Link>
      </div>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
        💕 Soulmate — Loyal Lifelong Understanding Companion
      </p>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
        Made with ❤️ by utkrasht • All free, always 🌸
      </p>
    </footer>
  );
}

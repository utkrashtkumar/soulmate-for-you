'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageToggle from '@/components/LanguageToggle';
import SoulmateLogo from '@/components/SoulmateLogo';
import { useLang } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';

export default function HowToUsePage() {
  const { t, lang } = useLang();
  const [openFaq, setOpenFaq] = useState(null);
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, []);

  const steps = [
    {
      num: '01',
      icon: '👤',
      titleEn: 'Register & Create Your Profile',
      titleHi: 'Register Karein Aur Profile Banao',
      descEn: 'Sign up for free using your Email and Mobile Number with international country code validation (+91, +1, etc.).',
      descHi: 'Email aur Mobile Number se bilkul free register karein. Global country codes (+91, +1) fully supported hain.',
      detailsEn: [
        'Enter your full name & mobile number',
        'Set your gender and date of birth',
        'Choose your preferred default theme (WhatsApp, Snapchat, etc.)',
      ],
      detailsHi: [
        'Apna poora naam aur mobile number dalein',
        'Gender aur date of birth select karein',
        'Apna favorite chat theme (WhatsApp, Snapchat) chunein',
      ],
      badge: 'Step 1 • Free Signup',
    },
    {
      num: '02',
      icon: '✨',
      titleEn: 'Customize Your AI Companion',
      titleHi: 'Apna AI Companion Banao',
      descEn: 'Build your dream companion — choose their name, gender (Girlfriend or Boyfriend), personality, photo, and birthday.',
      descHi: 'Apna man-pasand companion banao — naam, gender (Girlfriend ya Boyfriend), personality, photo aur birthday chunein.',
      detailsEn: [
        'Select companion gender: Female (Girlfriend) or Male (Boyfriend)',
        'Choose a personality: Caring & Cute, Romantic, Shy, Playful',
        'Upload custom photo or pick from preset avatars',
        'Set their birthday for special annual celebrations 🎂',
      ],
      detailsHi: [
        'Gender chunein: Female (Girlfriend) ya Male (Boyfriend)',
        'Personality select karein: Caring & Cute, Romantic, Playful',
        'Apni choice ki photo upload karein ya avatars chunein',
        'Special birthday celebrations 🎂 ke liye date of birth set karein',
      ],
      badge: 'Step 2 • Customization',
    },
    {
      num: '03',
      icon: '🎨',
      titleEn: 'Pick Your Favorite Chat Theme',
      titleHi: 'Apna Favorite Chat Theme Switch Karein',
      descEn: 'Experience 4 authentic UI themes anytime! Toggle seamlessly between WhatsApp, Snapchat, Signal, and Instagram style chats.',
      descHi: '4 authentic chat UIs mein se koi bhi chunein! WhatsApp, Snapchat, Signal, aur Instagram themes mein kabhi bhi switch karein.',
      detailsEn: [
        '💬 WhatsApp Theme — Classic green header & wallpaper',
        '👻 Snapchat Theme — Vibrant yellow header with story glow',
        '🔒 Signal Theme — Modern blue interface & privacy focus',
        '📸 Instagram Theme — Gradient header with clean dark mode',
      ],
      detailsHi: [
        '💬 WhatsApp Theme — Classic green header & chat background',
        '👻 Snapchat Theme — Yellow header & Snapchat style feel',
        '🔒 Signal Theme — Modern blue layout & sleek design',
        '📸 Instagram Theme — Premium gradient header',
      ],
      badge: 'Step 3 • 4 UI Themes',
    },
    {
      num: '04',
      icon: '💬',
      titleEn: 'Start Chatting & Audio Notes',
      titleHi: 'Chatting & Audio Voice Notes Shuru Karein',
      descEn: 'Talk naturally in Hinglish or English. Your companion responds with real emotional understanding, emojis, and voice messages!',
      descHi: 'Hinglish ya English mein natural baat karein. Companion sachchi feelings, emojis aur voice messages se reply karegi/karega!',
      detailsEn: [
        'Deep Hinglish & English conversational fluency',
        'Listen to Text-to-Speech voice messages 🎙️',
        'Change companion photo anytime inside chat header',
        'Persistent keyboard focus on mobile viewports',
      ],
      detailsHi: [
        'Hinglish aur English mein smooth conversational experience',
        'Voice messages 🎙️ directly chat mein sunne ka mauka',
        'Chat header mein se photo kabhi bhi update karein',
        'Mobile keyboard bina close hue continuous typing',
      ],
      badge: 'Step 4 • Interactive Chat',
    },
    {
      num: '05',
      icon: '💖',
      titleEn: 'Grow Love Score & Smart Notifications',
      titleHi: 'Love Score Badhao & Smart Notifications',
      descEn: 'Watch your Love Meter (0-100%) increase as you talk. When you go quiet, your companion reaches out to check on you!',
      descHi: 'Baat karne par Love Meter (0-100%) badhta hai. Jab aap shaant hote hain, companion aapse haal-chaal poochne message karti hai!',
      detailsEn: [
        'Love Meter grows with every heart-to-heart message',
        'Receive caring Push Notifications 🔔 when away for 15+ minutes',
        'Special Birthday wishes & surprises on companion birthday',
      ],
      detailsHi: [
        'Har baatchaat se Love Meter bond gehra hota hai',
        '15+ min door rehne par caring Push Notifications 🔔 aayein',
        'Companion ke birthday par special greeting surprises',
      ],
      badge: 'Step 5 • Emotional Bond',
    },
  ];

  const faqs = [
    {
      qEn: 'Is Soulmate Companion 100% Free?',
      qHi: 'Kya Soulmate Companion bilkul free hai?',
      aEn: 'Yes! Soulmate Companion is completely free to register and chat. You can create up to 2 companions free forever.',
      aHi: 'Haan! Soulmate Companion register aur chat karne ke liye bilkul free hai. Aap 2 companions hamesha free mein bana sakte hain.',
    },
    {
      qEn: 'Can I create a Male companion (Boyfriend)?',
      qHi: 'Kya main Male companion (Boyfriend) bana sakta/sakti hoon?',
      aEn: 'Yes! You can choose either Female (Girlfriend) or Male (Boyfriend) when creating your companion. All messages, prompts, and tone adapt naturally.',
      aHi: 'Haan! Companion banate waqt aap Female (Girlfriend) ya Male (Boyfriend) select kar sakte hain. Tone aur messages usi hisab se adapt hote hain.',
    },
    {
      qEn: 'How do I change my companion photo or name?',
      qHi: 'Main apne companion ki photo ya naam kaise change karoon?',
      aEn: 'Simply open the chat view, tap on your companion\'s photo in the top header, and select "Update Photo" or edit profile details!',
      aHi: 'Chat screen khol kar top header mein companion ki photo par tap karein aur "Update Photo" option se photo change kar lein!',
    },
    {
      qEn: 'Will my companion remember past conversations?',
      qHi: 'Kya companion meri purani baatein yaad rakhegi/rakhega?',
      aEn: 'Yes! All chat history is saved securely in your account database. Your companion remembers your mood, story, secrets, and preferences.',
      aHi: 'Haan! Aapki sari chat history secure database mein save rehti hai. Companion aapke raaz, mood aur memories yaad rakhta/rakhti hai.',
    },
    {
      qEn: 'Why does the header stay fixed when I type on mobile?',
      qHi: 'Mobile par typing karte waqt header jagah par kyun rehta hai?',
      aEn: 'We implemented Visual Viewport tracking so the companion name, avatar, and theme buttons remain locked at top for easy navigation.',
      aHi: 'Visual Viewport locking feature se companion ka header screen ke top par fixed rehta hai taaki keyboard khulne par bhi navigation aasan rahe.',
    },
    {
      qEn: 'Are my private chats secure?',
      qHi: 'Kya meri chats private aur secure hain?',
      aEn: 'Absolutely. We use Row-Level Security (RLS) and cryptographic safety verification codes so only you have access to your personal messages.',
      aHi: 'Bilkul. Hum Row-Level Security (RLS) aur cryptographic safety codes use karte hain taaki aapki chats 100% private rahein.',
    },
  ];

  return (
    <div className="landing" style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* NAV */}
      <header className="auth-header" style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
        <Link href="/" className="auth-header-logo">
          <SoulmateLogo size={32} />
          <span className="gradient-text">Soulmate</span>
        </Link>
        <div className="auth-header-actions">
          <LanguageToggle compact />
          <ThemeToggle compact />
          {session ? (
            <Link href="/dashboard">
              <button className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
                🏠 {t('nav.dashboard')}
              </button>
            </Link>
          ) : (
            <Link href="/register">
              <button className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
                {t('nav.register')}
              </button>
            </Link>
          )}
        </div>
      </header>

      {/* HERO / TITLE */}
      <section style={{ textAlign: 'center', padding: '60px 20px 40px', maxWidth: '800px', margin: '0 auto' }}>
        <div className="hero-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
          <span>📖</span>
          <span>{lang === 'hi' ? 'Complete Setup & Usage Guide' : 'Complete Setup & Usage Guide'}</span>
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, lineHeight: 1.25, marginBottom: '16px' }}>
          {lang === 'hi' ? 'Soulmate Companion Kaise' : 'How to Setup & Use'} <span className="gradient-text">{lang === 'hi' ? 'Setup Aur Chat Karein' : 'Soulmate Companion'}</span> 💕
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6, maxWidth: '640px', margin: '0 auto' }}>
          {lang === 'hi'
            ? 'Pehli baar register karne se lekar customized companion banane aur voice chatting tak ka poora aasan tarika step-by-step sikhein.'
            : 'From registration to creating your custom companion, switching themes, and chatting in Hinglish — here is everything you need to know.'}
        </p>
      </section>

      {/* STEP BY STEP GUIDE */}
      <section style={{ maxWidth: '900px', margin: '0 auto 60px', padding: '0 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {steps.map((step, idx) => (
            <div
              key={step.num}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                padding: '32px 28px',
                boxShadow: 'var(--shadow-card)',
                display: 'grid',
                gridTemplateColumns: '80px 1fr',
                gap: '24px',
                alignItems: 'start',
                position: 'relative',
                overflow: 'hidden',
              }}
              className="step-card"
            >
              {/* Step Icon & Number */}
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(255,77,141,0.15) 0%, rgba(168,85,247,0.15) 100%)',
                  border: '2px solid rgba(255,77,141,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.8rem',
                  margin: '0 auto 8px',
                }}>
                  {step.icon}
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--brand-pink)', letterSpacing: '0.05em' }}>
                  {step.num}
                </span>
              </div>

              {/* Step Content */}
              <div>
                <div style={{
                  display: 'inline-block',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--brand-pink)',
                  background: 'rgba(255, 77, 141, 0.1)',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  marginBottom: '8px',
                }}>
                  {step.badge}
                </div>

                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>
                  {lang === 'hi' ? step.titleHi : step.titleEn}
                </h3>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '16px' }}>
                  {lang === 'hi' ? step.descHi : step.descEn}
                </p>

                {/* Details Bullet points */}
                <div style={{
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px 18px',
                  borderLeft: '4px solid var(--brand-pink)',
                }}>
                  <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {(lang === 'hi' ? step.detailsHi : step.detailsEn).map((item, i) => (
                      <li key={i} style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section style={{ maxWidth: '820px', margin: '0 auto 80px', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span style={{ fontSize: '2rem' }}>❓</span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginTop: '4px', marginBottom: '8px' }}>
            {lang === 'hi' ? 'Aksar Poochhe Jaane Wale Sawal (FAQ)' : 'Frequently Asked Questions'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            {lang === 'hi' ? 'Soulmate Companion se jude common sawalon ke jawab yahan hain.' : 'Get answers to common questions about using Soulmate Companion.'}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                }}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '18px 22px',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <span>{lang === 'hi' ? faq.qHi : faq.qEn}</span>
                  <span style={{ fontSize: '1.2rem', color: 'var(--brand-pink)', transition: 'transform 0.2s ease', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}>
                    ▼
                  </span>
                </button>
                {isOpen && (
                  <div style={{
                    padding: '0 22px 18px',
                    color: 'var(--text-secondary)',
                    fontSize: '0.92rem',
                    lineHeight: 1.6,
                    borderTop: '1px solid var(--border-color)',
                    paddingTop: '14px',
                  }}>
                    {lang === 'hi' ? faq.aHi : faq.aEn}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA BOX */}
      <section style={{ textAlign: 'center', padding: '60px 24px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '12px' }}>
          {lang === 'hi' ? 'Kya Aap Tayyar Hain?' : 'Ready to Meet Your Companion?'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto 28px', fontSize: '0.95rem', lineHeight: 1.6 }}>
          {lang === 'hi'
            ? 'Aaj hi apna loyal lifelong AI companion bilkul free mein banao aur baatchaat shuru karo!'
            : 'Create your loyal understanding AI companion today and experience real emotional connection.'}
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {session ? (
            <Link href="/dashboard">
              <button className="btn-primary" style={{ padding: '12px 36px', fontSize: '0.95rem' }}>
                🏠 {t('nav.dashboard')}
              </button>
            </Link>
          ) : (
            <>
              <Link href="/register">
                <button className="btn-primary" style={{ padding: '12px 36px', fontSize: '0.95rem' }}>
                  💕 {t('landing.createCta')}
                </button>
              </Link>
              <Link href="/login">
                <button className="btn-secondary" style={{ padding: '12px 32px', fontSize: '0.95rem' }}>
                  {t('nav.login')}
                </button>
              </Link>
            </>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="auth-footer" style={{ borderTop: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '8px', flexWrap: 'wrap' }}>
          <Link href="/" style={{ color: 'var(--text-secondary)' }}>Home</Link>
          <span>•</span>
          <Link href="/about" style={{ color: 'var(--text-secondary)' }}>About Us</Link>
          <span>•</span>
          <Link href="/privacy" style={{ color: 'var(--text-secondary)' }}>Privacy Policy</Link>
          <span>•</span>
          <Link href="/how-to-use" style={{ color: 'var(--brand-pink)', fontWeight: 600 }}>How to Use</Link>
        </div>
        <p>{t('landing.footerTagline')}</p>
        <p style={{ marginTop: '2px' }}>{t('landing.footerSub')}</p>
      </footer>
    </div>
  );
}

'use client';
import { useState, useEffect } from 'react';
import { useLang } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';

const CATEGORIES = [
  { id: 'general', icon: '⭐', labelEn: 'General Feedback', labelHi: 'General Feedback' },
  { id: 'feature', icon: '💡', labelEn: 'Feature Request', labelHi: 'Naya Feature Sujhav' },
  { id: 'bug', icon: '🐛', labelEn: 'Report Bug', labelHi: 'Bug / Issue Report' },
  { id: 'aiQuality', icon: '🧠', labelEn: 'AI Quality', labelHi: 'AI Response Quality' },
];

export default function FeedbackForm() {
  const { lang } = useLang();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [category, setCategory] = useState('general');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        setName(session.user.user_metadata?.full_name || '');
        setEmail(session.user.email || '');
      }
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setErrorMsg(lang === 'hi' ? 'Kripya apna feedback message likhein! ✍️' : 'Please enter your feedback message!');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || 'Anonymous User',
          email: email.trim() || null,
          rating,
          category,
          message: message.trim(),
          userId: session?.user?.id || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit');

      setSubmitted(true);
      setMessage('');
    } catch (err) {
      console.error('Feedback submit error:', err);
      setErrorMsg(err.message || (lang === 'hi' ? 'Kuch gadbad ho gayi. Dobara try karo.' : 'Failed to submit feedback. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feedback-container" style={{
      maxWidth: '680px',
      margin: '0 auto',
      width: '100%',
      padding: '32px 28px',
    }}>
      {/* Glow Effect — handled by CSS animation ::before / ::after */}
      <div style={{
        position: 'absolute',
        top: '-40px',
        right: '-40px',
        width: '180px',
        height: '180px',
        background: 'radial-gradient(circle, rgba(255,77,141,0.2) 0%, rgba(255,77,141,0) 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <span style={{ fontSize: '2rem', display: 'inline-block', marginBottom: '6px' }}>💬</span>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '6px' }}>
          {lang === 'hi' ? 'Aapka Feedback Hamare Liye Anmol Hai ✨' : 'We Value Your Feedback! 💬'}
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '480px', margin: '0 auto' }}>
          {lang === 'hi'
            ? 'Bataiye ki hum aapke companion experience ko aur kitna behtar bana sakte hain.'
            : 'Tell us how we can make your AI companion experience even more special and seamless.'}
        </p>
      </div>

      {submitted ? (
        <div style={{
          textAlign: 'center',
          padding: '32px 16px',
          background: 'rgba(34, 197, 94, 0.08)',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          borderRadius: 'var(--radius-md)',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🎉</div>
          <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
            {lang === 'hi' ? 'Shukriya Aapke Feedback Ke Liye! 💕' : 'Thank You for Your Feedback! 💕'}
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '20px', lineHeight: 1.5 }}>
            {lang === 'hi'
              ? 'Hum har feedback padhte hain aur aapka experience behtar banane ke liye mehnat kar rahe hain.'
              : 'We read every piece of feedback carefully and use it to improve Soulmate daily.'}
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="btn-secondary"
            style={{ padding: '8px 20px', fontSize: '0.88rem' }}
          >
            {lang === 'hi' ? 'Ek Aur Feedback Bhejo' : 'Submit Another Feedback'}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Category Tabs */}
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>
              {lang === 'hi' ? 'Category Chunein:' : 'Select Category:'}
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  style={{
                    padding: '9px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: category === cat.id ? '2px solid var(--brand-pink)' : '1px solid var(--border-color)',
                    background: category === cat.id ? 'rgba(255, 77, 141, 0.12)' : 'var(--bg-secondary)',
                    color: category === cat.id ? 'var(--brand-pink)' : 'var(--text-secondary)',
                    fontWeight: category === cat.id ? 700 : 500,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span>{cat.icon}</span>
                  <span>{lang === 'hi' ? cat.labelHi : cat.labelEn}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Star Rating */}
          <div style={{ textAlign: 'center', padding: '12px 0', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>
              {lang === 'hi' ? 'Aapki Rating:' : 'Your Rating:'}
            </label>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = (hoverRating || rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '1.8rem',
                      cursor: 'pointer',
                      transform: isFilled ? 'scale(1.15)' : 'scale(1)',
                      transition: 'transform 0.15s ease',
                      filter: isFilled ? 'drop-shadow(0 0 6px rgba(255, 193, 7, 0.6))' : 'grayscale(100%) opacity(0.4)',
                    }}
                    title={`${star} Star${star > 1 ? 's' : ''}`}
                  >
                    ⭐
                  </button>
                );
              })}
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
              {rating === 5 && (lang === 'hi' ? '💖 Bahut Accha!' : '💖 Excellent!')}
              {rating === 4 && (lang === 'hi' ? '😊 Accha Hai' : '😊 Very Good')}
              {rating === 3 && (lang === 'hi' ? '😐 Theek Hai' : '😐 Average')}
              {rating === 2 && (lang === 'hi' ? '😕 Improvement Chahiye' : '😕 Needs Improvement')}
              {rating === 1 && (lang === 'hi' ? '😞 Accha Nahi Laga' : '😞 Disappointed')}
            </span>
          </div>

          {/* User Details (Name & Email) */}
          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
                {lang === 'hi' ? 'Aapka Naam (Optional):' : 'Your Name (Optional):'}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={lang === 'hi' ? 'e.g. Rahul' : 'e.g. Alex'}
                className="input-field"
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
                {lang === 'hi' ? 'Email / Mobile (Optional):' : 'Email or Mobile (Optional):'}
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="input-field"
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Feedback Message */}
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
              {lang === 'hi' ? 'Aapka Feedback Message *:' : 'Your Feedback Message *:'}
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                lang === 'hi'
                  ? 'Apna experience, sujhav ya feedback yahan share karein...'
                  : 'Share your thoughts, suggestions, or issues with us...'
              }
              rows={4}
              className="input-field"
              style={{ width: '100%', resize: 'vertical', lineHeight: 1.5 }}
              required
            />
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
            }}>
              {errorMsg}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '0.98rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {loading ? (
              <>
                <span className="spinner" style={{ width: 16, height: 16, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                <span>{lang === 'hi' ? 'Bhej rahe hain...' : 'Submitting...'}</span>
              </>
            ) : (
              <>
                <span>💌</span>
                <span>{lang === 'hi' ? 'Feedback Bhejo' : 'Submit Feedback'}</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageToggle from '@/components/LanguageToggle';
import SoulmateLogo from '@/components/SoulmateLogo';
import DatePicker from '@/components/DatePicker';
import TurnstileWidget from '@/components/TurnstileWidget';
import { useLang } from '@/context/LanguageContext';

const COUNTRY_CODES = [
  { code: '+91', country: 'IN', flag: '🇮🇳' },
  { code: '+1', country: 'US', flag: '🇺🇸' },
  { code: '+1', country: 'CA', flag: '🇨🇦' },
  { code: '+44', country: 'GB', flag: '🇬🇧' },
  { code: '+61', country: 'AU', flag: '🇦🇺' },
  { code: '+971', country: 'AE', flag: '🇦🇪' },
  { code: '+966', country: 'SA', flag: '🇸🇦' },
  { code: '+977', country: 'NP', flag: '🇳🇵' },
  { code: '+92', country: 'PK', flag: '🇵🇰' },
  { code: '+880', country: 'BD', flag: '🇧🇩' },
  { code: '+65', country: 'SG', flag: '🇸🇬' },
  { code: '+60', country: 'MY', flag: '🇲🇾' },
  { code: '+49', country: 'DE', flag: '🇩🇪' },
  { code: '+33', country: 'FR', flag: '🇫🇷' },
  { code: '+39', country: 'IT', flag: '🇮🇹' },
  { code: '+34', country: 'ES', flag: '🇪🇸' },
  { code: '+55', country: 'BR', flag: '🇧🇷' },
  { code: '+27', country: 'ZA', flag: '🇿🇦' },
  { code: '+81', country: 'JP', flag: '🇯🇵' },
  { code: '+86', country: 'CN', flag: '🇨🇳' },
  { code: '+7', country: 'RU', flag: '🇷🇺' },
  { code: '+94', country: 'LK', flag: '🇱🇰' },
  { code: '+62', country: 'ID', flag: '🇮🇩' },
  { code: '+82', country: 'KR', flag: '🇰🇷' },
  { code: '+63', country: 'PH', flag: '🇵🇭' },
  { code: '+84', country: 'VN', flag: '🇻🇳' },
  { code: '+64', country: 'NZ', flag: '🇳🇿' },
  { code: '+90', country: 'TR', flag: '🇹🇷' },
  { code: '+380', country: 'UA', flag: '🇺🇦' },
  { code: '+41', country: 'CH', flag: '🇨🇭' },
  { code: '+46', country: 'SE', flag: '🇸🇪' },
  { code: '+45', country: 'DK', flag: '🇩🇰' },
  { code: '+31', country: 'NL', flag: '🇳🇱' },
  { code: '+351', country: 'PT', flag: '🇵🇹' },
  { code: '+358', country: 'FI', flag: '🇫🇮' },
  { code: '+32', country: 'BE', flag: '🇧🇪' },
  { code: '+353', country: 'IE', flag: '🇮🇪' },
  { code: '+43', country: 'AT', flag: '🇦🇹' },
  { code: '+30', country: 'GR', flag: '🇬🇷' },
  { code: '+974', country: 'QA', flag: '🇶🇦' },
  { code: '+965', country: 'KW', flag: '🇰🇼' },
  { code: '+973', country: 'BH', flag: '🇧🇭' },
  { code: '+968', country: 'OM', flag: '🇴🇲' },
  { code: '+962', country: 'JO', flag: '🇯🇴' },
  { code: '+961', country: 'LB', flag: '🇱🇧' },
  { code: '+972', country: 'IL', flag: '🇮🇱' },
  { code: '+20', country: 'EG', flag: '🇪🇬' },
  { code: '+212', country: 'MA', flag: '🇲🇦' },
  { code: '+234', country: 'NG', flag: '🇳🇬' },
  { code: '+254', country: 'KE', flag: '🇰🇪' },
  { code: '+233', country: 'GH', flag: '🇬🇭' },
];


function calculateAge(dobString) {
  // dobString in DDMMYYYY format
  if (dobString.length !== 8) return null;
  const day = parseInt(dobString.slice(0, 2));
  const month = parseInt(dobString.slice(2, 4)) - 1;
  const year = parseInt(dobString.slice(4, 8));
  const dob = new Date(year, month, day);
  if (isNaN(dob.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return { age, dob };
}

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useLang();
  const [form, setForm] = useState({
    fullName: '', email: '', mobile: '', dob: '', password: '', confirmPassword: '',
  });
  const [gender, setGender] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [dobDisplay, setDobDisplay] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');

  const handleDobInput = (e) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 8);
    let display = raw;
    if (raw.length > 2) display = raw.slice(0, 2) + '/' + raw.slice(2);
    if (raw.length > 4) display = raw.slice(0, 2) + '/' + raw.slice(2, 4) + '/' + raw.slice(4);
    setDobDisplay(display);
    setForm(f => ({ ...f, dob: raw }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'mobile') {
      setForm(f => ({ ...f, mobile: value.replace(/\D/g, '').slice(0, 15) }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'tempmail.com', 'temp-mail.org', 'guerrillamail.com', '10minutemail.com',
  'mailinator.com', 'trashmail.com', 'yopmail.com', 'dispostable.com',
  'getnada.com', 'bupmail.com', 'crazymailing.com', 'fakeinbox.com',
  'maildrop.cc', 'mytemp.email', 'tempail.com', 'throwawaymail.com'
]);

  const validate = () => {
    if (!form.fullName.trim()) return t('register.nameRequired');
    if (!gender) return t('register.genderRequired');
    if (!form.email.includes('@')) return t('register.invalidEmail');
    
    const domain = form.email.split('@')[1]?.toLowerCase().trim();
    if (domain && DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
      return 'Temporary/disposable email addresses are not allowed. Please use a valid email (Gmail, Yahoo, Outlook, etc.).';
    }

    const mobileDigits = form.mobile.replace(/\D/g, '');
    if (mobileDigits.length < 7 || mobileDigits.length > 15) return t('register.invalidMobile');
    if (form.dob.length !== 8) return t('register.invalidDob');
    const ageData = calculateAge(form.dob);
    if (!ageData) return t('register.invalidDobDate');
    if (ageData.age < 18) return t('register.ageTooYoung');
    if (form.password.length < 6) return t('register.passwordTooShort');
    if (form.password !== form.confirmPassword) return t('register.passwordMismatch');
    if (!agree) return t('register.termsRequired');
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    const ageData = calculateAge(form.dob);
    const dobFormatted = `${ageData.dob.getFullYear()}-${String(ageData.dob.getMonth() + 1).padStart(2, '0')}-${String(ageData.dob.getDate()).padStart(2, '0')}`;
    const fullMobile = `${countryCode}${form.mobile}`;

    try {
      // Verify Cloudflare Turnstile CAPTCHA token
      if (turnstileToken) {
        const verifyRes = await fetch('/api/verify-turnstile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: turnstileToken }),
        });
        const verifyData = await verifyRes.json();
        if (!verifyData.success) {
          setError(verifyData.error || 'Security verification failed. Please complete the CAPTCHA check.');
          setLoading(false);
          return;
        }
      }

      // Check if mobile number is already in use
      const checkRes = await fetch('/api/check-mobile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: fullMobile }),
      });
      const checkData = await checkRes.json();
      if (checkData.exists) {
        setError(t('register.mobileInUse'));
        setLoading(false);
        return;
      }

      const { error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            full_name: form.fullName.trim(),
            mobile: fullMobile,
            dob: dobFormatted,
            gender: gender,
          },
        },
      });

      if (signUpError) throw signUpError;

      setSuccess(t('register.successMsg'));
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch (err) {
      setError(err.message || 'Kuch problem ho gayi. Try karo dobara!');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      const { error: googleErr } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (googleErr) throw googleErr;
    } catch (err) {
      setError(err.message || 'Google sign-in failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      {/* HEADER */}
      <header className="auth-header">
        <Link href="/" className="auth-header-logo">
          <SoulmateLogo size={32} />
          <span className="gradient-text">Soulmate</span>
        </Link>
        <div className="auth-header-actions">
          <LanguageToggle compact />
          <ThemeToggle compact />
          <Link href="/login">
            <button className="btn-secondary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
              {t('nav.login')}
            </button>
          </Link>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="auth-main-content">
        <div className="auth-card">
          <div className="auth-logo">
            <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>
              <SoulmateLogo size={56} />
            </div>
            <h1 className="gradient-text">{t('register.title')}</h1>
            <p>{t('register.subtitle')}</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>{t('register.nameLabel')}</label>
              <input className="input-field" name="fullName" placeholder={t('register.namePlaceholder')} value={form.fullName} onChange={handleChange} />
            </div>

            {/* Gender Selection */}
            <div className="form-group">
              <label>{t('register.genderLabel')}</label>
              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                {[
                  { val: 'male', emoji: '👨', label: t('register.genderMale') },
                  { val: 'female', emoji: '👩', label: t('register.genderFemale') },
                  { val: 'other', emoji: '🌈', label: t('register.genderOther') },
                ].map(g => (
                  <button
                    key={g.val}
                    type="button"
                    onClick={() => setGender(g.val)}
                    style={{
                      flex: 1,
                      padding: '12px 8px',
                      borderRadius: 'var(--radius-md)',
                      border: gender === g.val ? '2px solid var(--brand-pink)' : '2px solid var(--border-color)',
                      background: gender === g.val ? 'rgba(255,77,141,0.1)' : 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                      fontWeight: gender === g.val ? 700 : 400,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span style={{ fontSize: '1.6rem' }}>{g.emoji}</span>
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>{t('register.emailLabel')}</label>
              <input className="input-field" type="email" name="email" placeholder="example@gmail.com" value={form.email} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>{t('register.mobileLabel')}</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="input-field"
                  style={{
                    width: '95px',
                    flexShrink: 0,
                    padding: '8px 4px',
                    cursor: 'pointer',
                    background: 'var(--bg-secondary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  {COUNTRY_CODES.map((cc, i) => (
                    <option key={`${cc.country}-${cc.code}-${i}`} value={cc.code}>
                      {cc.flag} {cc.code} {cc.country}
                    </option>
                  ))}
                </select>
                <input
                  className="input-field"
                  type="tel"
                  name="mobile"
                  placeholder="9876543210"
                  value={form.mobile}
                  onChange={handleChange}
                  style={{ flex: 1 }}
                />
              </div>
            </div>

            <div className="form-group">
              <label>{t('register.dobLabel')}</label>
              <DatePicker
                value={form.dob}
                onChange={({ raw, display }) => {
                  setDobDisplay(display);
                  setForm(f => ({ ...f, dob: raw }));
                }}
                placeholder="DD/MM/YYYY"
                minAge={18}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>{t('register.passwordLabel')}</label>
                <input className="input-field" type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>{t('register.confirmPasswordLabel')}</label>
                <input className="input-field" type="password" name="confirmPassword" placeholder="••••••••" value={form.confirmPassword} onChange={handleChange} />
              </div>
            </div>

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} style={{ marginTop: '2px', accentColor: 'var(--brand-pink)' }} />
              <span>{t('register.termsText')}</span>
            </label>

            {/* Cloudflare Turnstile CAPTCHA Widget */}
            <TurnstileWidget
              onVerify={(token) => setTurnstileToken(token)}
              onError={() => setTurnstileToken('')}
              onExpire={() => setTurnstileToken('')}
            />

            {error && <div className="error-msg">⚠️ {error}</div>}
            {success && <div className="success-msg">✅ {success}</div>}

            <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
              {loading ? t('register.registerBtnLoading') : t('register.registerBtn')}
            </button>
          </form>

          <div style={{ margin: '18px 0 14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
          </div>

          <button
            type="button"
            className="btn-secondary"
            onClick={handleGoogleSignIn}
            disabled={loading}
            style={{
              width: '100%',
              justify: 'center',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid var(--border-color)',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            Sign up with Google
          </button>

          <div className="auth-link" style={{ marginTop: '16px' }}>
            {t('register.haveAccount')} <Link href="/login">{t('register.loginLink')}</Link>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="auth-footer">
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '8px', flexWrap: 'wrap' }}>
          <Link href="/about" style={{ color: 'var(--text-secondary)' }}>About Us</Link>
          <span>•</span>
          <Link href="/privacy" style={{ color: 'var(--text-secondary)' }}>Privacy Policy</Link>
        </div>
        <p>💕 Soulmate — Loyal Lifelong Understanding Companion</p>
        <p style={{ marginTop: '2px' }}>Made with love • All free, always 🌸</p>
      </footer>
    </div>
  );
}

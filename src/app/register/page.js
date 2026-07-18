'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import ThemeToggle from '@/components/ThemeToggle';
import SoulmateLogo from '@/components/SoulmateLogo';
import DatePicker from '@/components/DatePicker';

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
  const [form, setForm] = useState({
    fullName: '', email: '', mobile: '', dob: '', password: '', confirmPassword: '',
  });
  const [dobDisplay, setDobDisplay] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);

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
      setForm(f => ({ ...f, mobile: value.replace(/\D/g, '').slice(0, 10) }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const validate = () => {
    if (!form.fullName.trim()) return 'Naam toh daal yaar 😅';
    if (!form.email.includes('@')) return 'Valid email address chahiye';
    if (form.mobile.length !== 10) return 'Mobile number 10 digits ka hona chahiye';
    if (form.dob.length !== 8) return 'Date of Birth DD/MM/YYYY format mein daal';
    const ageData = calculateAge(form.dob);
    if (!ageData) return 'Valid date of birth daal bhai';
    if (ageData.age < 18) return '18 saal se kam age waalon ke liye nahi hai ye app 🚫';
    if (form.password.length < 6) return 'Password kam se kam 6 characters ka hona chahiye';
    if (form.password !== form.confirmPassword) return 'Passwords match nahi kar rahe 😬';
    if (!agree) return 'Terms & Conditions pe agree karo pehle';
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

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            full_name: form.fullName.trim(),
            mobile: form.mobile,
            dob: dobFormatted,
          },
        },
      });

      if (signUpError) throw signUpError;

      setSuccess('Registration ho gayi! 🎉 Dashboard par ja raha hoon...');
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch (err) {
      setError(err.message || 'Kuch problem ho gayi. Try karo dobara!');
    } finally {
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
          <ThemeToggle />
          <Link href="/login">
            <button className="btn-secondary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
              Login
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
            <h1 className="gradient-text">Register Karo</h1>
            <p>Apni loyal understanding companion banao</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Tera Poora Naam</label>
              <input className="input-field" name="fullName" placeholder="Ramesh Kumar" value={form.fullName} onChange={handleChange} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email Address</label>
                <input className="input-field" type="email" name="email" placeholder="example@gmail.com" value={form.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Mobile Number</label>
                <input className="input-field" type="tel" name="mobile" placeholder="9876543210" value={form.mobile} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group">
              <label>Date of Birth (DD/MM/YYYY) — minimum 18 years</label>
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
                <label>Password</label>
                <input className="input-field" type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input className="input-field" type="password" name="confirmPassword" placeholder="••••••••" value={form.confirmPassword} onChange={handleChange} />
              </div>
            </div>

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} style={{ marginTop: '2px', accentColor: 'var(--brand-pink)' }} />
              <span>Main Terms & Conditions se agree karta/karti hoon. Ye app 18+ ke liye hai.</span>
            </label>

            {error && <div className="error-msg">⚠️ {error}</div>}
            {success && <div className="success-msg">✅ {success}</div>}

            <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
              {loading ? '⏳ Register ho raha hai...' : '💕 Register Karo'}
            </button>
          </form>

          <div className="auth-link" style={{ marginTop: '16px' }}>
            Pehle se account hai? <Link href="/login">Login Karo</Link>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="auth-footer">
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '8px', flexWrap: 'wrap' }}>
          <Link href="/about" style={{ color: 'var(--text-secondary)' }}>About Us</Link>
          <span>•</span>
          <Link href="/privacy" style={{ color: 'var(--text-secondary)' }}>Privacy Policy</Link>
          <span>•</span>
          <Link href="/forgot-password" style={{ color: 'var(--text-secondary)' }}>Reset Password</Link>
        </div>
        <p>💕 Soulmate — Loyal Lifelong Understanding Companion</p>
        <p style={{ marginTop: '2px' }}>Made with love • All free, always 🌸</p>
      </footer>
    </div>
  );
}

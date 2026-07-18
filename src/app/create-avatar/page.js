'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageToggle from '@/components/LanguageToggle';
import SoulmateLogo from '@/components/SoulmateLogo';
import DatePicker from '@/components/DatePicker';
import { useLang } from '@/context/LanguageContext';

const PRESET_AVATARS_FEMALE = [
  { id: 1, emoji: '👩‍🦰', label: 'Redhead' },
  { id: 2, emoji: '👩‍🦱', label: 'Curly' },
  { id: 3, emoji: '👩‍🦳', label: 'Silver' },
  { id: 4, emoji: '👩‍🦲', label: 'Bold' },
  { id: 5, emoji: '👱‍♀️', label: 'Blonde' },
  { id: 6, emoji: '🧕', label: 'Hijab' },
  { id: 7, emoji: '👩', label: 'Classic' },
  { id: 8, emoji: '🧝‍♀️', label: 'Mystical' },
];

const PRESET_AVATARS_MALE = [
  { id: 1, emoji: '👨‍🦰', label: 'Redhead' },
  { id: 2, emoji: '👨‍🦱', label: 'Curly' },
  { id: 3, emoji: '👨‍🦳', label: 'Silver' },
  { id: 4, emoji: '👨‍🦲', label: 'Bald' },
  { id: 5, emoji: '👱‍♂️', label: 'Blonde' },
  { id: 6, emoji: '🧔', label: 'Bearded' },
  { id: 7, emoji: '👨', label: 'Classic' },
  { id: 8, emoji: '🧝‍♂️', label: 'Mystical' },
];

const PERSONALITIES = [
  { id: 'Cute & Shy', emoji: '🥺', name: 'Cute & Shy', desc: 'Pyaara, sharmata, teri har baat sunta hai' },
  { id: 'Playful & Flirty', emoji: '😏', name: 'Playful & Flirty', desc: 'Mazedaar, thoda naughty, full of energy' },
  { id: 'Caring & Mature', emoji: '🥰', name: 'Caring & Mature', desc: 'Samajhdaar, caring, emotional support deta/deti hai' },
];

function calculateGfAge(dobStr) {
  if (!dobStr) return null;
  const dob = new Date(dobStr);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
}

export default function CreateAvatarPage() {
  const router = useRouter();
  const { t } = useLang();
  const [step, setStep] = useState(1);
  const [companionGender, setCompanionGender] = useState(''); // 'male' | 'female'
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [personality, setPersonality] = useState('');
  const [dob, setDob] = useState('');
  const [dobError, setDobError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  // Derive preset list based on chosen gender
  const PRESET_AVATARS = companionGender === 'male' ? PRESET_AVATARS_MALE : PRESET_AVATARS_FEMALE;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/login'); return; }
      setUserId(session.user.id);
      setUserEmail(session.user.email);
    });
  }, [router]);

  const handleDobChange = (e) => {
    const val = e.target.value;
    setDob(val);
    setDobError('');
    if (val) {
      const age = calculateGfAge(val);
      if (age !== null && age < 18) {
        setDobError('Companion ki age kam se kam 18 saal honi chahiye 🚫');
      }
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError('Image 5MB se chhoti honi chahiye'); return; }
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${ext}`;
      const { error: uploadErr } = await supabase.storage.from('avatars').upload(fileName, file, { upsert: true });
      if (uploadErr) throw uploadErr;
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);
      setUploadedUrl(publicUrl);
      setSelectedAvatar(null);
    } catch (err) {
      setError('Image upload fail ho gayi: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleCreate = async () => {
    if (!name.trim()) { setError(t('createAvatar.nameRequired')); return; }
    if (!dob) { setError(t('createAvatar.dobRequired')); return; }
    if (dobError) { setError(dobError); return; }
    if (!personality) { setError(t('createAvatar.personalityRequired')); return; }

    const avatarUrl = uploadedUrl || selectedAvatar?.emoji || null;
    setLoading(true);
    setError('');
    try {
      const { error: insertErr } = await supabase.from('avatars').insert({
        user_id: userId,
        name: name.trim(),
        avatar_url: avatarUrl,
        companion_gender: companionGender || 'female',
        dob: dob,
        personality: personality,
        mood: 'happy',
        love_meter: 0,
      });
      if (insertErr) throw insertErr;
      router.push('/dashboard');
    } catch (err) {
      setError('Avatar create nahi ho paya: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { label: t('createAvatar.stepGender'), num: 1 },
    { label: t('createAvatar.stepName'), num: 2 },
    { label: t('createAvatar.stepAvatar'), num: 3 },
    { label: t('createAvatar.stepPersonality'), num: 4 },
    { label: t('createAvatar.stepBirthday'), num: 5 },
  ];

  return (
    <div className="app-layout">
      {/* Minimal sidebar for back nav */}
      <aside className="sidebar" style={{ width: '200px' }}>
        <div className="sidebar-logo">
          <SoulmateLogo size={32} />
          <span className="gradient-text" style={{ marginLeft: '8px' }}>Soulmate</span>
        </div>
        <nav className="sidebar-nav">
          <a href="/dashboard" className="nav-item">
            <span className="icon">←</span> Dashboard
          </a>
          {userEmail === 'givekisstome@gmail.com' && (
            <a href="/admin" className="nav-item" style={{ color: 'gold' }}>
              <span className="icon">👑</span> Admin Panel
            </a>
          )}
        </nav>
        <div className="sidebar-footer">
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            <ThemeToggle />
            <LanguageToggle compact />
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="app-header">
          <div className="mobile-logo">
            <SoulmateLogo size={28} />
            <span className="gradient-text" style={{ fontWeight: 700, fontSize: '1.1rem' }}>Soulmate</span>
          </div>
          <div className="hide-mobile" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <LanguageToggle compact />
            <ThemeToggle compact />
          </div>
        </header>

        <div className="create-avatar-wrapper">
          <div className="page-header">
            <h1>✨ <span className="gradient-text">{t('createAvatar.pageTitle')}</span></h1>
            <p>{t('createAvatar.pageSubtitle')}</p>
          </div>

          {/* Step Indicator */}
          <div className="step-indicator">
            {steps.map((s, i) => (
              <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className={`step ${step === s.num ? 'active' : step > s.num ? 'done' : ''}`}>
                  <div className="step-num">{step > s.num ? '✓' : s.num}</div>
                  <div className="step-label">{s.label}</div>
                </div>
                {i < steps.length - 1 && <div className="step-divider" />}
              </div>
            ))}
          </div>

          {error && <div className="error-msg" style={{ marginBottom: '16px' }}>⚠️ {error}</div>}

          {/* STEP 1: Companion Gender */}
          {step === 1 && (
            <div className="step-card">
              <h2>{t('createAvatar.step1Title')}</h2>
              <p>{t('createAvatar.step1Sub')}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '20px' }}>
                {[
                  { val: 'female', emoji: '👩', label: t('createAvatar.girlfriendLabel'), desc: t('createAvatar.girlfriendDesc') },
                  { val: 'male', emoji: '👨', label: t('createAvatar.boyfriendLabel'), desc: t('createAvatar.boyfriendDesc') },
                ].map(g => (
                  <button
                    key={g.val}
                    type="button"
                    onClick={() => { setCompanionGender(g.val); setSelectedAvatar(null); }}
                    style={{
                      padding: '24px 16px',
                      borderRadius: 'var(--radius-lg)',
                      border: companionGender === g.val ? '2px solid var(--brand-pink)' : '2px solid var(--border-color)',
                      background: companionGender === g.val ? 'rgba(255,77,141,0.1)' : 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                      fontWeight: companionGender === g.val ? 700 : 400,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '10px',
                      transition: 'all 0.2s',
                      width: '100%',
                    }}
                  >
                    <span style={{ fontSize: '3rem' }}>{g.emoji}</span>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{g.label}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{g.desc}</div>
                    {companionGender === g.val && (
                      <span style={{ color: 'var(--brand-pink)', fontSize: '1.2rem' }}>{t('createAvatar.selectedLabel')}</span>
                    )}
                  </button>
                ))}
              </div>
              <div className="step-actions" style={{ marginTop: '24px' }}>
                <button className="btn-primary" onClick={() => {
                  if (!companionGender) { setError(t('createAvatar.chooseTypeFirst')); return; }
                  setError(''); setStep(2);
                }}>
                  {t('createAvatar.nextBtn')}
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Name */}
          {step === 2 && (
            <div className="step-card">
              <h2>{companionGender === 'male' ? t('createAvatar.step2TitleM') : t('createAvatar.step2TitleF')}</h2>
              <p>{t('createAvatar.step2Sub')}</p>
              <input
                className="input-field"
                placeholder={companionGender === 'male' ? t('createAvatar.step2PlaceholderM') : t('createAvatar.step2PlaceholderF')}
                value={name}
                onChange={e => setName(e.target.value)}
                style={{ fontSize: '1.1rem', padding: '14px 18px' }}
                autoFocus
                maxLength={30}
              />
              <div className="step-actions">
                <button className="btn-secondary" onClick={() => setStep(1)}>{t('createAvatar.backBtn')}</button>
                <button className="btn-primary" onClick={() => {
                  if (!name.trim()) { setError(t('createAvatar.nameRequired')); return; }
                  setError(''); setStep(3);
                }}>
                  {t('createAvatar.nextBtn')}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Avatar */}
          {step === 3 && (
            <div className="step-card">
              <h2>{t('createAvatar.step3Title')}</h2>
              <p>{t('createAvatar.step3Sub')}</p>

              <div className="avatar-selector-grid">
                {PRESET_AVATARS.map(av => (
                  <div
                    key={av.id}
                    className={`avatar-option ${selectedAvatar?.id === av.id && !uploadedUrl ? 'selected' : ''}`}
                    onClick={() => { setSelectedAvatar(av); setUploadedUrl(null); }}
                    style={{ background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.8rem', cursor: 'pointer' }}
                  >
                    {av.emoji}
                  </div>
                ))}
              </div>

              <div className="auth-divider" style={{ margin: '20px 0' }}>{t('createAvatar.uploadDivider')}</div>

              <label className="upload-area">
                <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
                {uploading ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--brand-pink)' }}>
                    <span>{t('createAvatar.uploading')}</span>
                  </div>
                ) : uploadedUrl ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <img src={uploadedUrl} alt="Uploaded" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--brand-pink)' }} />
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ color: '#00e676', fontWeight: 600, fontSize: '0.92rem' }}>✅ Image Uploaded Successfully!</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '2px' }}>Click to change photo</div>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '1.6rem' }}>📸</span>
                    <span style={{ fontWeight: 500 }}>{t('createAvatar.uploadPrompt')}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('createAvatar.uploadHint')}</span>
                  </div>
                )}
              </label>

              <div className="step-actions">
                <button className="btn-secondary" onClick={() => setStep(2)}>{t('createAvatar.backBtn')}</button>
                <button className="btn-primary" onClick={() => {
                  if (!selectedAvatar && !uploadedUrl) { setError(t('createAvatar.avatarRequired')); return; }
                  setError(''); setStep(4);
                }}>{t('createAvatar.nextBtn')}</button>
              </div>
            </div>
          )}

          {/* STEP 4: Personality */}
          {step === 4 && (
            <div className="step-card">
              <h2>{t('createAvatar.step4Title')}</h2>
              <p>{t('createAvatar.step4Sub')}</p>
              <div className="personality-grid">
                {PERSONALITIES.map(p => (
                  <div key={p.id} className={`personality-card ${personality === p.id ? 'selected' : ''}`} onClick={() => setPersonality(p.id)}>
                    <span className="emoji">{p.emoji}</span>
                    <div className="name">{p.name}</div>
                    <div className="desc">{p.desc}</div>
                  </div>
                ))}
              </div>
              <div className="step-actions">
                <button className="btn-secondary" onClick={() => setStep(3)}>{t('createAvatar.backBtn')}</button>
                <button className="btn-primary" onClick={() => {
                  if (!personality) { setError(t('createAvatar.personalityRequired')); return; }
                  setError(''); setStep(5);
                }}>{t('createAvatar.nextBtn')}</button>
              </div>
            </div>
          )}

          {/* STEP 5: DOB */}
          {step === 5 && (
            <div className="step-card">
              <h2>{t('createAvatar.step5Title')}</h2>
              <p>{t('createAvatar.step5Sub')}</p>
              <DatePicker
                value={dob}
                onChange={({ isoDate, age }) => {
                  setDob(isoDate);
                  setDobError('');
                  if (age !== null && age < 18) {
                    setDobError(t('createAvatar.ageMin'));
                  }
                }}
                placeholder="DD/MM/YYYY"
                minAge={18}
              />
              {dobError && <div className="error-msg" style={{ marginTop: '12px' }}>⚠️ {dobError}</div>}

              {/* Summary */}
              <div style={{
                marginTop: '20px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)',
                padding: '16px', display: 'flex', gap: '16px', alignItems: 'center',
              }}>
                <div style={{ fontSize: '2.5rem' }}>
                  {uploadedUrl ? <img src={uploadedUrl} alt="" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} /> : selectedAvatar?.emoji}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{name}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{personality} • {companionGender === 'male' ? t('createAvatar.summaryBoyfriend') : t('createAvatar.summaryGirlfriend')}</div>
                </div>
              </div>

              <div className="step-actions">
                <button className="btn-secondary" onClick={() => setStep(4)}>{t('createAvatar.backBtn')}</button>
                <button className="btn-primary" onClick={handleCreate} disabled={loading || !!dobError}>
                  {loading ? t('createAvatar.creatingBtn') : t('createAvatar.createBtn')}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

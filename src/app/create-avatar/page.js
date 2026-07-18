'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import ThemeToggle from '@/components/ThemeToggle';
import SoulmateLogo from '@/components/SoulmateLogo';
import DatePicker from '@/components/DatePicker';

const PRESET_AVATARS = [
  { id: 1, emoji: '👩‍🦰', label: 'Redhead', url: null },
  { id: 2, emoji: '👩‍🦱', label: 'Curly', url: null },
  { id: 3, emoji: '👩‍🦳', label: 'Silver', url: null },
  { id: 4, emoji: '👩‍🦲', label: 'Bold', url: null },
  { id: 5, emoji: '👱‍♀️', label: 'Blonde', url: null },
  { id: 6, emoji: '🧕', label: 'Hijab', url: null },
  { id: 7, emoji: '👩', label: 'Classic', url: null },
  { id: 8, emoji: '🧝‍♀️', label: 'Mystical', url: null },
];

const PERSONALITIES = [
  { id: 'Cute & Shy', emoji: '🥺', name: 'Cute & Shy', desc: 'Pyaari, sharmaati, teri har baat sunti hai' },
  { id: 'Playful & Flirty', emoji: '😏', name: 'Playful & Flirty', desc: 'Mazedaar, thodi naughty, full of energy' },
  { id: 'Caring & Mature', emoji: '🥰', name: 'Caring & Mature', desc: 'Samajhdaar, caring, emotional support deti hai' },
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
  const [step, setStep] = useState(1);
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
    if (!name.trim()) { setError('Girlfriend ka naam toh daal!'); return; }
    if (!dob) { setError('Girlfriend ka date of birth daal!'); return; }
    if (dobError) { setError(dobError); return; }
    if (!personality) { setError('Personality choose karo!'); return; }

    const avatarUrl = uploadedUrl || selectedAvatar?.emoji || null;
    setLoading(true);
    setError('');
    try {
      const { error: insertErr } = await supabase.from('avatars').insert({
        user_id: userId,
        name: name.trim(),
        avatar_url: avatarUrl,
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
    { label: 'Naam', num: 1 },
    { label: 'Avatar', num: 2 },
    { label: 'Personality', num: 3 },
    { label: 'Birthday', num: 4 },
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
          <ThemeToggle />
        </div>
      </aside>

      <main className="main-content">
        <div className="create-avatar-wrapper">
          <div className="page-header">
            <h1>✨ <span className="gradient-text">Naya Companion Banao</span></h1>
            <p>Apni perfect understanding companion design karo step by step</p>
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

          {/* STEP 1: Name */}
          {step === 1 && (
            <div className="step-card">
              <h2>Companion ka Naam Kya Hai? 💕</h2>
              <p>Ek pyaara naam rakh uska — isse wo pehchani jaayegi</p>
              <input
                className="input-field"
                placeholder="e.g. Priya, Riya, Sofia, Anjali..."
                value={name}
                onChange={e => setName(e.target.value)}
                style={{ fontSize: '1.1rem', padding: '14px 18px' }}
                autoFocus
                maxLength={30}
              />
              <div className="step-actions">
                <button className="btn-primary" onClick={() => {
                  if (!name.trim()) { setError('Naam toh daal yaar! 😅'); return; }
                  setError(''); setStep(2);
                }}>
                  Aage Chalo →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Avatar */}
          {step === 2 && (
            <div className="step-card">
              <h2>Avatar Choose Karo 📸</h2>
              <p>Preset se choose karo ya apni image upload karo</p>

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

              <div className="auth-divider" style={{ margin: '20px 0' }}>ya apni photo upload karo</div>

              <label className="upload-area" style={{ cursor: 'pointer' }}>
                <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
                {uploading ? <span>⏳ Upload ho raha hai...</span> : uploadedUrl ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
                    <img src={uploadedUrl} alt="Uploaded" style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover' }} />
                    <span style={{ color: '#00e676' }}>✅ Image upload ho gayi!</span>
                  </div>
                ) : (
                  <span>📷 Click karke image upload karo (max 5MB)</span>
                )}
              </label>

              <div className="step-actions">
                <button className="btn-secondary" onClick={() => setStep(1)}>← Back</button>
                <button className="btn-primary" onClick={() => {
                  if (!selectedAvatar && !uploadedUrl) { setError('Ek avatar choose karo ya upload karo!'); return; }
                  setError(''); setStep(3);
                }}>Aage Chalo →</button>
              </div>
            </div>
          )}

          {/* STEP 3: Personality */}
          {step === 3 && (
            <div className="step-card">
              <h2>Kaisi Personality Chahiye? 🌟</h2>
              <p>Teri companion kaisi hogi — choose karo</p>
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
                <button className="btn-secondary" onClick={() => setStep(2)}>← Back</button>
                <button className="btn-primary" onClick={() => {
                  if (!personality) { setError('Personality choose karo!'); return; }
                  setError(''); setStep(4);
                }}>Aage Chalo →</button>
              </div>
            </div>
          )}

          {/* STEP 4: DOB */}
          {step === 4 && (
            <div className="step-card">
              <h2>Companion ka Birthday Kab Hai? 🎂</h2>
              <p>Kam se kam 18 saal ki honi chahiye — birthday pe notification aayega!</p>
              <DatePicker
                value={dob}
                onChange={({ isoDate, age }) => {
                  setDob(isoDate);
                  setDobError('');
                  if (age !== null && age < 18) {
                    setDobError('Companion ki age kam se kam 18 saal honi chahiye 🚫');
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
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{personality}</div>
                </div>
              </div>

              <div className="step-actions">
                <button className="btn-secondary" onClick={() => setStep(3)}>← Back</button>
                <button className="btn-primary" onClick={handleCreate} disabled={loading || !!dobError}>
                  {loading ? '⏳ Ban rahi hai...' : '💕 Companion Banao!'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

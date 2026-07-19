'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useLang } from '@/context/LanguageContext';

const PRESET_AVATARS_FEMALE = [
  { id: 1, emoji: '👩‍🦰' },
  { id: 2, emoji: '👩‍🦱' },
  { id: 3, emoji: '👩‍🦳' },
  { id: 4, emoji: '👩‍🦲' },
  { id: 5, emoji: '👱‍♀️' },
  { id: 6, emoji: '🧕' },
  { id: 7, emoji: '👩' },
  { id: 8, emoji: '🧝‍♀️' },
];

const PRESET_AVATARS_MALE = [
  { id: 1, emoji: '👨‍🦰' },
  { id: 2, emoji: '👨‍🦱' },
  { id: 3, emoji: '👨‍🦳' },
  { id: 4, emoji: '👨‍🦲' },
  { id: 5, emoji: '👱‍♂️' },
  { id: 6, emoji: '🧔' },
  { id: 7, emoji: '👨' },
  { id: 8, emoji: '🧝‍♂️' },
];

export default function UpdatePhotoModal({ avatar, isOpen, onClose, onSuccess }) {
  const { t } = useLang();
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [selectedEmoji, setSelectedEmoji] = useState(
    avatar?.avatar_url && !avatar.avatar_url.startsWith('http') && !avatar.avatar_url.startsWith('data:')
      ? avatar.avatar_url
      : null
  );

  if (!isOpen || !avatar) return null;

  const presets = avatar.companion_gender === 'male' ? PRESET_AVATARS_MALE : PRESET_AVATARS_FEMALE;
  const currentPreview = uploadedUrl || selectedEmoji || (avatar.avatar_url?.startsWith('http') ? avatar.avatar_url : null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError(t('createAvatar.imageTooLarge'));
      return;
    }

    setUploading(true);
    setError('');
    try {
      const ext = file.name.split('.').pop();
      const fileName = `${avatar.user_id}/${Date.now()}.${ext}`;
      const { error: uploadErr } = await supabase.storage.from('avatars').upload(fileName, file, { upsert: true });
      if (uploadErr) throw uploadErr;

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);
      setUploadedUrl(publicUrl);
      setSelectedEmoji(null);
    } catch (err) {
      setError(t('createAvatar.uploadError') + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    const finalUrl = uploadedUrl || selectedEmoji;
    if (!finalUrl) {
      setError(t('createAvatar.avatarRequired'));
      return;
    }

    setSaving(true);
    setError('');
    try {
      const { error: updateErr } = await supabase
        .from('avatars')
        .update({ avatar_url: finalUrl })
        .eq('id', avatar.id);

      if (updateErr) throw updateErr;

      setSuccess(t('createAvatar.photoSuccess'));
      if (onSuccess) onSuccess(finalUrl);

      setTimeout(() => {
        setSuccess('');
        onClose();
      }, 600);
    } catch (err) {
      setError('Save failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 10000 }}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2>{t('createAvatar.updatePhotoTitle')}</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            {t('createAvatar.updatePhotoSub')} — <strong>{avatar.name}</strong>
          </p>
        </div>

        {/* Preview Header */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <div style={{
            width: 84, height: 84, borderRadius: '50%', overflow: 'hidden',
            background: 'var(--bg-secondary)', border: '3px solid var(--brand-pink)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.8rem',
            boxShadow: '0 4px 20px rgba(255,77,141,0.25)', position: 'relative'
          }}>
            {currentPreview && (currentPreview.startsWith('http') || currentPreview.startsWith('data:')) ? (
              <img src={currentPreview} alt={avatar.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span>{currentPreview || avatar.avatar_url || '👩'}</span>
            )}
          </div>
        </div>

        {error && <div className="error-msg" style={{ marginBottom: '16px' }}>⚠️ {error}</div>}
        {success && <div style={{ color: '#00e676', textAlign: 'center', marginBottom: '16px', fontWeight: 600 }}>✅ {success}</div>}

        {/* Upload Custom Image Area */}
        <label className="upload-area" style={{ display: 'block', marginBottom: '20px', padding: '16px' }}>
          <input type="file" accept="image/*" hidden onChange={handleFileChange} />
          {uploading ? (
            <div style={{ color: 'var(--brand-pink)' }}>{t('createAvatar.uploading')}</div>
          ) : uploadedUrl ? (
            <div style={{ color: '#00e676', fontWeight: 600, fontSize: '0.88rem' }}>
              {t('createAvatar.uploadSuccess')}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
              <span style={{ fontSize: '1.4rem' }}>📸</span>
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{t('createAvatar.uploadPrompt')}</span>
            </div>
          )}
        </label>

        {/* Presets Grid */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '10px' }}>
            {t('createAvatar.step3Sub')}
          </div>
          <div className="avatar-selector-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            {presets.map(p => (
              <div
                key={p.id}
                className={`avatar-option ${selectedEmoji === p.emoji && !uploadedUrl ? 'selected' : ''}`}
                onClick={() => { setSelectedEmoji(p.emoji); setUploadedUrl(null); }}
                style={{
                  background: 'var(--bg-secondary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2.2rem', cursor: 'pointer', height: '60px'
                }}
              >
                {p.emoji}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button className="btn-secondary" onClick={onClose} disabled={saving}>
            {t('createAvatar.backBtn')}
          </button>
          <button className="btn-primary" onClick={handleSave} disabled={saving || uploading}>
            {saving ? t('createAvatar.savingPhoto') : t('createAvatar.savePhoto')}
          </button>
        </div>
      </div>
    </div>
  );
}

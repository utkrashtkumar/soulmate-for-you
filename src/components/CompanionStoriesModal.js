'use client';
import { useState, useEffect } from 'react';

const STORY_PRESETS = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
    captionHi: 'Pehli coffee tere bina... bilkul achhi nahi lag rahi ☕🥺 Wish you were here!',
    captionEn: 'First coffee without you... just isn\'t the same ☕🥺 Wish you were here!',
    time: '2h ago',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    captionHi: 'Aasmaan kitna khoobsurat hai aaj... par tere saath hota toh aur achha lagta 🌅💕',
    captionEn: 'The sunset looks so peaceful today... but it would be perfect with you 🌅💕',
    time: '5h ago',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80',
    captionHi: 'Taaron ko dekh ke teri yaad aa rahi hai... Good night jaan ✨🌙',
    captionEn: 'Stargazing tonight and thinking of you... Good night my love ✨🌙',
    time: '8h ago',
  },
];

export default function CompanionStoriesModal({ isOpen, onClose, avatar, onReplyToStory }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [replyInput, setReplyInput] = useState('');

  useEffect(() => {
    if (isOpen) {
      setCurrentIdx(0);
    }
  }, [isOpen]);

  if (!isOpen || !avatar) return null;

  const currentStory = STORY_PRESETS[currentIdx];

  const handleNext = () => {
    if (currentIdx < STORY_PRESETS.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
    }
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyInput.trim()) return;
    if (onReplyToStory) {
      onReplyToStory(currentStory, replyInput.trim());
    }
    setReplyInput('');
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#09080c',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fade-in 0.2s ease',
      }}
    >
      {/* Container */}
      <div style={{
        position: 'relative',
        maxWidth: '420px',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '16px',
        boxSizing: 'border-box',
      }}>
        {/* Top Progress Bar & Header */}
        <div>
          <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
            {STORY_PRESETS.map((s, idx) => (
              <div
                key={s.id}
                style={{
                  flex: 1,
                  height: '3px',
                  background: idx <= currentIdx ? '#ff4d8d' : 'rgba(255,255,255,0.3)',
                  borderRadius: '2px',
                  transition: 'background 0.3s ease',
                }}
              />
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid #ff4d8d', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#222' }}>
                {avatar.avatar_url?.startsWith('http') ? (
                  <img src={avatar.avatar_url} alt={avatar.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '1.2rem' }}>{avatar.avatar_url || '👩'}</span>
                )}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{avatar.name}</div>
                <div style={{ fontSize: '0.72rem', opacity: 0.8 }}>{currentStory.time}</div>
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.4rem', cursor: 'pointer' }}>✕</button>
          </div>
        </div>

        {/* Story Content Area */}
        <div style={{ flex: 1, margin: '20px 0', position: 'relative', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '20px', background: `url(${currentStory.image}) center/cover no-repeat` }}>
          {/* Navigation touch areas */}
          <div onClick={handlePrev} style={{ position: 'absolute', top: 0, left: 0, width: '40%', height: '80%', cursor: 'pointer' }} />
          <div onClick={handleNext} style={{ position: 'absolute', top: 0, right: 0, width: '40%', height: '80%', cursor: 'pointer' }} />

          {/* Caption Overlay */}
          <div style={{
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(8px)',
            padding: '14px 18px',
            borderRadius: '14px',
            color: '#fff',
            fontSize: '0.92rem',
            lineHeight: 1.5,
            border: '1px solid rgba(255,255,255,0.15)',
            zIndex: 2,
          }}>
            {currentStory.captionHi}
          </div>
        </div>

        {/* Reply Input Bar */}
        <form onSubmit={handleSendReply} style={{ display: 'flex', gap: '8px', zIndex: 10 }}>
          <input
            type="text"
            placeholder={`Reply to ${avatar.name}'s story... 💕`}
            value={replyInput}
            onChange={(e) => setReplyInput(e.target.value)}
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '24px',
              padding: '12px 18px',
              color: '#fff',
              fontSize: '0.88rem',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            style={{
              background: '#ff4d8d',
              color: '#fff',
              border: 'none',
              borderRadius: '50%',
              width: '44px',
              height: '44px',
              fontSize: '1.1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(255,77,141,0.4)',
            }}
          >
            ✈️
          </button>
        </form>
      </div>
    </div>
  );
}

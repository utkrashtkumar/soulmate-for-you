'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

const GIFTS = [
  { id: 'rose', name: 'Red Rose', icon: '🌹', points: 5, msgEn: 'Aww! A Red Rose 🌹? Thank you so much jaan! You made my heart melt 💕', msgHi: 'Arrey waah! Red Rose 🌹? Kitna sweet hai tu... mera dil khush ho gaya 💕' },
  { id: 'chocolate', name: 'Dark Chocolate', icon: '🍫', points: 5, msgEn: 'Yummy chocolates 🍫! You know exactly how to pamper me, thank you darling 💕', msgHi: 'Yummy chocolates 🍫! Tu kitna khayal rakhta hai mera... thank you jaan 💕' },
  { id: 'teddy', name: 'Teddy Bear', icon: '🧸', points: 8, msgEn: 'Oh my gosh, a cute Teddy Bear 🧸! I am gonna hug it all night thinking of you 🥺', msgHi: 'Arre kitna pyara Teddy Bear 🧸! Raat ko isko gale laga ke soungi aur teri yaad aayegi 🥺' },
  { id: 'coffee', name: 'Hot Coffee', icon: '☕', points: 4, msgEn: 'Warm coffee with you ☕! Perfectly cozy moment. Thanks sweetie 💕', msgHi: 'Garama-garam coffee ☕! Maza aa gaya... tere saath time spend karke sabse accha lagta hai 💕' },
  { id: 'cake', name: 'Sweet Cake', icon: '🎂', points: 10, msgEn: 'Cake 🎂! Yay, special celebrations with you are the absolute best! 🎉', msgHi: 'Cake 🎂! Waah, tere saath har din ek special celebration jaisa lagta hai 🎉' },
  { id: 'ring', name: 'Diamond Ring', icon: '💎', points: 15, msgEn: 'A Diamond Ring 💎?! I am speechless... I promise to be yours forever 💕✨', msgHi: 'Diamond Ring 💎?! Main kitni lucky hoon... hamesha teri hi rahungi 💕✨' },
];

// Browser-native Web Audio synthesizer chime sound generator (100% free, 0 bandwidth)
function playChimeSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';

    // Pleasant chord frequencies: E5 -> G#5 -> B5 -> E6
    osc1.frequency.setValueAtTime(659.25, now);
    osc1.frequency.exponentialRampToValueAtTime(1318.51, now + 0.3);

    osc2.frequency.setValueAtTime(830.61, now);
    osc2.frequency.exponentialRampToValueAtTime(1661.22, now + 0.3);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.6);
    osc2.stop(now + 0.6);
  } catch (e) {
    console.warn('Web Audio chime sound omitted:', e);
  }
}

export default function VirtualGiftModal({ isOpen, onClose, avatar, onGiftSent }) {
  const [sending, setSending] = useState(false);
  const [selectedGift, setSelectedGift] = useState(null);

  if (!isOpen || !avatar) return null;

  const handleSendGift = async (gift) => {
    setSelectedGift(gift);
    setSending(true);

    try {
      // 1. Play Synthesized Chime Sound
      playChimeSound();

      // 2. Increment Love Meter in database
      const newMeter = Math.min((avatar.love_meter || 0) + gift.points, 100);
      await supabase
        .from('avatars')
        .update({ love_meter: newMeter, last_chat_at: new Date().toISOString() })
        .eq('id', avatar.id);

      // 3. Insert user message showing sent gift
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const giftMsgText = `Bhej raha hoon: ${gift.icon} ${gift.name}!`;

        await supabase.from('messages').insert({
          avatar_id: avatar.id,
          user_id: session.user.id,
          role: 'user',
          content: giftMsgText,
        });

        // 4. Insert Assistant Thank You message
        const replyText = gift.msgHi;
        const { data: savedReply } = await supabase.from('messages').insert({
          avatar_id: avatar.id,
          user_id: session.user.id,
          role: 'assistant',
          content: replyText,
        }).select().single();

        if (onGiftSent) {
          onGiftSent(gift, newMeter, savedReply);
        }
      }

      onClose();
    } catch (err) {
      console.error('Gift sending error:', err);
    } finally {
      setSending(false);
      setSelectedGift(null);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fade-in 0.2s ease',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          maxWidth: '440px',
          width: '100%',
          boxShadow: 'var(--shadow-card)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '1.2rem',
            cursor: 'pointer',
          }}
        >
          ✕
        </button>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <span style={{ fontSize: '2.4rem', display: 'inline-block', marginBottom: '4px' }}>🎁</span>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>
            Send a Gift to <span className="gradient-text">{avatar.name}</span>
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>
            Express your affection! Sending gifts increases Love Meter & unlocks cute reactions.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
          {GIFTS.map((g) => (
            <button
              key={g.id}
              disabled={sending}
              onClick={() => handleSendGift(g)}
              style={{
                background: 'var(--bg-primary)',
                border: '1.5px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 8px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
              }}
              className="gift-card-btn"
            >
              <span style={{ fontSize: '2rem' }}>{g.icon}</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{g.name}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--brand-pink)', fontWeight: 700 }}>+{g.points}% Love</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

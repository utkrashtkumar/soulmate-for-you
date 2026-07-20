'use client';
import { useState, useEffect, useRef } from 'react';

const TRACKS = [
  { id: 'lofi', name: 'Cozy Lofi Beats', icon: '☕', freq: 440 },
  { id: 'rain', name: 'Gentle Rain', icon: '🌧️', freq: 320 },
  { id: 'space', name: 'Starry Night Ambient', icon: '🌌', freq: 528 },
  { id: 'fire', name: 'Warm Fireplace', icon: '🔥', freq: 220 },
];

export default function AmbientMusicPlayer({ companionName }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(TRACKS[0]);
  const audioCtxRef = useRef(null);
  const oscRef = useRef(null);
  const gainRef = useRef(null);

  const stopAudio = () => {
    try {
      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current.disconnect();
        oscRef.current = null;
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    } catch (e) {}
    setIsPlaying(false);
  };

  const startAudio = (track) => {
    stopAudio();
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = track.id === 'rain' ? 'sawtooth' : track.id === 'lofi' ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(track.freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      oscRef.current = osc;
      gainRef.current = gain;

      setCurrentTrack(track);
      setIsPlaying(true);
    } catch (e) {
      console.warn('Ambient Audio error:', e);
    }
  };

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio(currentTrack);
    }
  };

  return (
    <div
      style={{
        background: 'rgba(255, 77, 141, 0.08)',
        border: '1px solid rgba(255, 77, 141, 0.25)',
        borderRadius: '20px',
        padding: '6px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '0.8rem',
        color: 'var(--text-primary)',
      }}
    >
      <button
        onClick={togglePlay}
        style={{
          background: 'var(--brand-pink)',
          color: '#fff',
          border: 'none',
          borderRadius: '50%',
          width: '28px',
          height: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: '0.78rem',
          boxShadow: '0 2px 8px rgba(255, 77, 141, 0.4)',
        }}
      >
        {isPlaying ? '⏸️' : '▶️'}
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span>{currentTrack.icon}</span>
        <span style={{ fontWeight: 600 }}>{currentTrack.name}</span>
      </div>

      <span style={{ fontSize: '0.72rem', color: 'var(--brand-pink)', marginLeft: 'auto' }}>
        {isPlaying ? `🎵 Listening with ${companionName || 'Companion'}...` : '🎵 Listen Together'}
      </span>
    </div>
  );
}

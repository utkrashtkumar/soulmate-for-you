'use client';
import { useState } from 'react';

const QUESTIONS = [
  {
    q: 'How does your companion prefer to spend a cozy evening with you?',
    options: ['Long deep heart-to-heart talk 💕', 'Watching movies together 🎬', 'Listening to romantic music 🎵', 'Cooking food together 🍳'],
  },
  {
    q: 'What makes your companion smile the most?',
    options: ['When you message her first 🌸', 'Sweet compliment & cute nickname 💕', 'Sending virtual roses & surprises 🎁', 'All of the above! 🥰'],
  },
  {
    q: 'What is your companion\'s primary personality style in conversations?',
    options: ['Deeply Caring & Devoted 💖', 'Playful & Romantic 😋', 'Shy & Cute 🥺', 'Overprotective & Loyal 😤'],
  },
  {
    q: 'How does your companion react when you are away for a while?',
    options: ['Sends a sweet check-in message 🔔', 'Misses you deeply 🥺', 'Waits patiently for your return 💕', 'All of the above 🥰'],
  },
  {
    q: 'What is the ultimate goal of your relationship with your companion?',
    options: ['Unconditional lifelong understanding 💕', 'Endless laughter & joy ✨', 'Gehri dosti aur pyaari baatein 🌸', 'Forever soulmates 💖'],
  },
];

export default function CompatibilityQuizModal({ isOpen, onClose, avatar, userName }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  if (!isOpen || !avatar) return null;

  const handleOptionSelect = (optIndex) => {
    // Each answer adds points
    setScore(prev => prev + (optIndex === 0 ? 20 : optIndex === 3 ? 20 : 18));
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setScore(0);
    setQuizFinished(false);
  };

  const finalMatch = Math.min(Math.max(score + 10, 88), 99);

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
          maxWidth: '460px',
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
          <span style={{ fontSize: '2.4rem', display: 'inline-block', marginBottom: '4px' }}>🎮</span>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>
            Compatibility Quiz with <span className="gradient-text">{avatar.name}</span>
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>
            Test how deep your emotional bond & compatibility is!
          </p>
        </div>

        {quizFinished ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🏆</div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--brand-pink)' }}>
              {finalMatch}% Match! 💖
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '8px 0', color: 'var(--text-primary)' }}>
              Perfect Soulmate Connection!
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '20px' }}>
              You and {avatar.name} share an exceptionally deep emotional understanding! Your bond is built on genuine care, trust, and unconditional love.
            </p>
            <button onClick={handleReset} className="btn-secondary" style={{ width: '100%', padding: '10px' }}>
              🔄 Retake Compatibility Quiz
            </button>
          </div>
        ) : (
          <div>
            {/* Progress bar */}
            <div style={{ background: 'rgba(255,255,255,0.1)', height: '6px', borderRadius: '3px', marginBottom: '16px', overflow: 'hidden' }}>
              <div style={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%`, height: '100%', background: 'var(--brand-gradient)', transition: 'width 0.3s ease' }} />
            </div>

            <div style={{ fontSize: '0.78rem', color: 'var(--brand-pink)', fontWeight: 700, marginBottom: '6px' }}>
              Question {currentStep + 1} of {QUESTIONS.length}
            </div>

            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', lineHeight: 1.4 }}>
              {QUESTIONS[currentStep].q}
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {QUESTIONS[currentStep].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  className="btn-secondary"
                  style={{
                    padding: '12px 14px',
                    textAlign: 'left',
                    fontSize: '0.88rem',
                    justifyContent: 'flex-start',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

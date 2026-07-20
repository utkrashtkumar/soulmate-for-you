'use client';
import { useState, useEffect } from 'react';

export default function InstallAppPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already running in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      return;
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  if (isInstalled || !showPrompt) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '76px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 9999,
      maxWidth: '380px',
      width: '90%',
      background: 'linear-gradient(135deg, rgba(255,77,141,0.95) 0%, rgba(168,85,247,0.95) 100%)',
      color: '#fff',
      padding: '12px 18px',
      borderRadius: '24px',
      boxShadow: '0 8px 32px rgba(255, 77, 141, 0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
      backdropFilter: 'blur(12px)',
      animation: 'slide-up 0.4s ease-out',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '1.4rem' }}>📱</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.88rem', lineHeight: 1.2 }}>Install Soulmate App</div>
          <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>Add to phone home screen for 1-tap chat</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <button
          onClick={handleInstallClick}
          style={{
            background: '#fff',
            color: '#ff4d8d',
            border: 'none',
            padding: '6px 14px',
            borderRadius: '16px',
            fontWeight: 800,
            fontSize: '0.78rem',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}
        >
          Install
        </button>
        <button
          onClick={() => setShowPrompt(false)}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: '1rem',
            opacity: 0.8,
            padding: '2px 6px',
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

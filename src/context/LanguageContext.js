'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import translations from '@/lib/translations';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState('en'); // default English

  useEffect(() => {
    try {
      const saved = localStorage.getItem('soulmate_lang');
      if (saved === 'hi' || saved === 'en') setLangState(saved);
    } catch (e) {}
  }, []);

  const setLang = useCallback((l) => {
    setLangState(l);
    try { localStorage.setItem('soulmate_lang', l); } catch (e) {}
  }, []);

  // t('login.title') → looks up translations[lang].login.title
  const t = useCallback((key, fallback = '') => {
    const parts = key.split('.');
    let val = translations[lang];
    for (const part of parts) {
      if (val == null) return fallback || key;
      val = val[part];
    }
    return val ?? (fallback || key);
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used inside <LanguageProvider>');
  return ctx;
}

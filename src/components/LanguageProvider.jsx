"use client";

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const LanguageContext = createContext();

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'hinglish', name: 'Hinglish', nativeName: 'Hinglish' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' }
];

const STORAGE_KEY = 'moneymatters_locale';

export function LanguageProvider({ children }) {
  const [selectedLang, setSelectedLang] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);

  const applyGoogleTranslate = useCallback((targetLang) => {
    let attempts = 0;
    const maxAttempts = 25;

    const interval = setInterval(() => {
      attempts++;
      const select = document.querySelector('.goog-te-combo');
      if (select) {
        if (targetLang === 'en' || targetLang === 'hinglish') {
          select.value = '';
        } else {
          select.value = targetLang;
        }
        select.dispatchEvent(new Event('change', { bubbles: true }));
        clearInterval(interval);
        setIsTranslating(false);
      } else if (attempts >= maxAttempts) {
        clearInterval(interval);
        setIsTranslating(false);
      }
    }, 200);
  }, []);

  const loadTranslateScript = useCallback((initialLang) => {
    if (typeof window === 'undefined') return;

    if (window.google?.translate?.TranslateElement) {
      applyGoogleTranslate(initialLang);
      return;
    }

    if (!document.getElementById('google-translate-script')) {
      window.googleTranslateElementInit = () => {
        try {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              includedLanguages: SUPPORTED_LANGUAGES.filter(l => l.code !== 'en' && l.code !== 'hinglish').map(l => l.code).join(','),
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false
            },
            'google_translate_host'
          );
          if (initialLang && initialLang !== 'en' && initialLang !== 'hinglish') {
            applyGoogleTranslate(initialLang);
          }
        } catch (e) {
          console.debug('[GoogleTranslate] init notice:', e);
        }
      };

      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.head.appendChild(script);
    }
  }, [applyGoogleTranslate]);

  const setTranslateCookies = (lang) => {
    if (typeof document === 'undefined') return;
    const domain = window.location.hostname;
    if (lang === 'en' || lang === 'hinglish') {
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain};`;
    } else {
      document.cookie = `googtrans=/en/${lang}; path=/;`;
      document.cookie = `googtrans=/en/${lang}; path=/; domain=${domain};`;
    }
  };

  const changeLanguage = useCallback((langCode) => {
    setSelectedLang(langCode);
    try {
      localStorage.setItem(STORAGE_KEY, langCode);
    } catch {}

    setTranslateCookies(langCode);
    setIsTranslating(true);

    if (langCode === 'en' || langCode === 'hinglish') {
      const select = document.querySelector('.goog-te-combo');
      if (select) {
        select.value = '';
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
      setIsTranslating(false);
      return;
    }

    loadTranslateScript(langCode);
    applyGoogleTranslate(langCode);
  }, [applyGoogleTranslate, loadTranslateScript]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setSelectedLang(saved);
        if (saved !== 'en' && saved !== 'hinglish') {
          setTranslateCookies(saved);
          loadTranslateScript(saved);
        }
      }
    } catch {}
  }, [loadTranslateScript]);

  return (
    <LanguageContext.Provider value={{ selectedLang, changeLanguage, languages: SUPPORTED_LANGUAGES, isTranslating }}>
      <div id="google_translate_host" style={{ position: 'absolute', top: '-9999px', left: '-9999px', opacity: 0, pointerEvents: 'none' }} />
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      selectedLang: 'en',
      changeLanguage: () => {},
      languages: SUPPORTED_LANGUAGES,
      isTranslating: false
    };
  }
  return context;
}

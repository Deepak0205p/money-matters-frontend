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

  // Initialize from storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setSelectedLang(saved);
      }
    } catch {}
  }, []);

  // Safe translation trigger
  const changeLanguage = useCallback((langCode) => {
    setSelectedLang(langCode);
    try {
      localStorage.setItem(STORAGE_KEY, langCode);
    } catch {}

    if (langCode === 'en' || langCode === 'hinglish') {
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
      
      const select = document.querySelector('.goog-te-combo');
      if (select) {
        select.value = '';
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
      
      const iframe = document.querySelector('.goog-te-banner-frame');
      if (iframe) iframe.style.display = 'none';
      document.body.style.top = '0px';
      
      if (document.body.classList.contains('translated-ltr') || document.body.classList.contains('translated-rtl')) {
        document.body.classList.remove('translated-ltr', 'translated-rtl');
        window.location.reload();
      }
      return;
    }

    setIsTranslating(true);
    const targetLang = langCode;

    document.cookie = `googtrans=/en/${targetLang}; path=/;`;
    document.cookie = `googtrans=/en/${targetLang}; path=/; domain=${window.location.hostname};`;

    const select = document.querySelector('.goog-te-combo');
    if (select) {
      select.value = targetLang;
      select.dispatchEvent(new Event('change', { bubbles: true }));
      setIsTranslating(false);
    } else {
      loadTranslateScript(targetLang, () => {
        setIsTranslating(false);
      });
    }
  }, []);

  const loadTranslateScript = (initialLang, callback) => {
    if (document.getElementById('google-translate-script')) {
      const select = document.querySelector('.goog-te-combo');
      if (select && initialLang) {
        select.value = initialLang;
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
      if (callback) callback();
      return;
    }

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

        setTimeout(() => {
          const select = document.querySelector('.goog-te-combo');
          if (select && initialLang && initialLang !== 'en') {
            select.value = initialLang;
            select.dispatchEvent(new Event('change', { bubbles: true }));
          }
          if (callback) callback();
        }, 500);
      } catch (e) {
        console.warn('Translate init error:', e);
        if (callback) callback();
      }
    };

    const s = document.createElement('script');
    s.id = 'google-translate-script';
    s.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    s.async = true;
    document.head.appendChild(s);
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && saved !== 'en' && saved !== 'hinglish') {
        loadTranslateScript(saved);
      }
    } catch {}
  }, []);

  return (
    <LanguageContext.Provider value={{ selectedLang, changeLanguage, languages: SUPPORTED_LANGUAGES, isTranslating }}>
      <div id="google_translate_host" style={{ display: 'none', position: 'absolute', top: '-9999px' }} />
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

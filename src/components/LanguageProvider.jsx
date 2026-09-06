"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const LanguageContext = createContext();

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
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
  const activeIntervalRef = useRef(null);

  const clearTranslateCookies = () => {
    if (typeof document === 'undefined') return;
    const hostname = window.location.hostname;
    const domainParts = hostname.split('.');
    
    // Clear for current path and root across domain levels
    const paths = ['/', ''];
    const domains = ['', hostname, `.${hostname}`];
    if (domainParts.length > 1) {
      domains.push(`.${domainParts.slice(-2).join('.')}`);
    }

    domains.forEach((dom) => {
      paths.forEach((p) => {
        const domStr = dom ? `; domain=${dom}` : '';
        const pathStr = p ? `; path=${p}` : '; path=/';
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC${pathStr}${domStr}`;
      });
    });
  };

  const setTranslateCookies = (lang) => {
    if (typeof document === 'undefined') return;
    clearTranslateCookies();
    if (lang && lang !== 'en') {
      const hostname = window.location.hostname;
      document.cookie = `googtrans=/en/${lang}; path=/;`;
      document.cookie = `googtrans=/en/${lang}; path=/; domain=${hostname};`;
      const domainParts = hostname.split('.');
      if (domainParts.length > 1) {
        document.cookie = `googtrans=/en/${lang}; path=/; domain=.${domainParts.slice(-2).join('.')};`;
      }
    }
  };

  const triggerGoogleCombo = useCallback((targetLang) => {
    if (activeIntervalRef.current) {
      clearInterval(activeIntervalRef.current);
      activeIntervalRef.current = null;
    }

    let attempts = 0;
    const maxAttempts = 30;

    activeIntervalRef.current = setInterval(() => {
      attempts++;
      const select = document.querySelector('.goog-te-combo');
      if (select) {
        const targetValue = targetLang === 'en' ? '' : targetLang;
        
        select.value = targetValue;
        select.dispatchEvent(new Event('change', { bubbles: true }));
        select.dispatchEvent(new Event('input', { bubbles: true }));

        // Double dispatch with custom event if standard change is intercepted
        if (typeof window.googleTranslateElementInit === 'function') {
          try {
            select.selectedIndex = Array.from(select.options).findIndex(opt => opt.value === targetValue);
          } catch {}
        }

        clearInterval(activeIntervalRef.current);
        activeIntervalRef.current = null;
        setIsTranslating(false);
      } else if (attempts >= maxAttempts) {
        clearInterval(activeIntervalRef.current);
        activeIntervalRef.current = null;
        setIsTranslating(false);
      }
    }, 150);
  }, []);

  const loadTranslateScript = useCallback((initialLang) => {
    if (typeof window === 'undefined') return;

    if (window.google?.translate?.TranslateElement) {
      triggerGoogleCombo(initialLang);
      return;
    }

    if (!document.getElementById('google-translate-script')) {
      window.googleTranslateElementInit = () => {
        try {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              includedLanguages: SUPPORTED_LANGUAGES.filter(l => l.code !== 'en').map(l => l.code).join(','),
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false
            },
            'google_translate_host'
          );
          if (initialLang && initialLang !== 'en') {
            triggerGoogleCombo(initialLang);
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
  }, [triggerGoogleCombo]);

  const changeLanguage = useCallback((langCode) => {
    const validLang = SUPPORTED_LANGUAGES.some(l => l.code === langCode) ? langCode : 'en';
    setSelectedLang(validLang);
    
    try {
      localStorage.setItem(STORAGE_KEY, validLang);
    } catch {}

    setTranslateCookies(validLang);
    setIsTranslating(true);

    if (validLang === 'en') {
      const select = document.querySelector('.goog-te-combo');
      if (select) {
        select.value = '';
        select.dispatchEvent(new Event('change', { bubbles: true }));
        select.dispatchEvent(new Event('input', { bubbles: true }));
      }
      // If translate element already mutated DOM, resetting cookie and reloading is the standard Google translate behavior
      if (document.querySelector('.goog-te-banner-frame') || document.querySelector('html.translated-ltr')) {
        const frame = document.querySelector('.goog-te-banner-frame');
        if (frame) {
          try {
            const innerDoc = frame.contentDocument || frame.contentWindow?.document;
            const restoreBtn = innerDoc?.querySelector('.goog-close-link, #\\:1\\.restore');
            if (restoreBtn) restoreBtn.click();
          } catch {}
        }
      }
      setIsTranslating(false);
      return;
    }

    loadTranslateScript(validLang);
    triggerGoogleCombo(validLang);
  }, [loadTranslateScript, triggerGoogleCombo]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && saved !== 'hinglish') {
        const validLang = SUPPORTED_LANGUAGES.some(l => l.code === saved) ? saved : 'en';
        setSelectedLang(validLang);
        if (validLang !== 'en') {
          setTranslateCookies(validLang);
          loadTranslateScript(validLang);
        }
      } else if (saved === 'hinglish') {
        localStorage.setItem(STORAGE_KEY, 'en');
        setSelectedLang('en');
        clearTranslateCookies();
      }
    } catch {}
  }, [loadTranslateScript]);

  return (
    <LanguageContext.Provider value={{ selectedLang, changeLanguage, languages: SUPPORTED_LANGUAGES, isTranslating }}>
      <div 
        id="google_translate_host" 
        style={{ 
          position: 'fixed', 
          top: '-9999px', 
          left: '-9999px', 
          opacity: 0, 
          pointerEvents: 'none',
          zIndex: -1
        }} 
      />
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

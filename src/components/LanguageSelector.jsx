"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage, SUPPORTED_LANGUAGES } from './LanguageProvider';

export function LanguageSelector({ variant = 'default' }) {
  const { selectedLang, changeLanguage, languages = SUPPORTED_LANGUAGES } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  const currentLang = languages.find(l => l.code === selectedLang) || languages[0];

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code) => {
    changeLanguage(code);
    setIsOpen(false);
  };

  if (variant === 'compact') {
    return (
      <div ref={ref} className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100 hover:border-slate-300 transition-colors text-xs font-bold text-slate-700 cursor-pointer"
          aria-label="Select language"
        >
          <Globe size={13} className="text-emerald-700" />
          <span className="max-w-[60px] truncate">{currentLang.nativeName}</span>
          <ChevronDown size={12} className={`transition-transform duration-200 text-slate-400 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-56 max-h-[320px] overflow-y-auto bg-white border border-slate-200 rounded-2xl p-1.5 shadow-xl z-[200] custom-scroll"
            >
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-semibold transition-all cursor-pointer ${
                    selectedLang === lang.code
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                  }`}
                >
                  <span className="flex-1 truncate">{lang.nativeName}</span>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">{lang.code}</span>
                  {selectedLang === lang.code && <Check size={13} className="text-emerald-700 shrink-0" />}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100 transition-colors cursor-pointer"
        aria-label="Select language"
      >
        <Globe size={16} className="text-emerald-700" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-60 max-h-[360px] overflow-y-auto bg-white border border-slate-200 rounded-2xl p-2 shadow-xl z-[200] custom-scroll"
          >
            <div className="px-2 py-1.5 mb-1 border-b border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Select Language</p>
            </div>
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                  selectedLang === lang.code
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                }`}
              >
                <span className="flex-1">
                  <span className="text-xs font-bold block">{lang.nativeName}</span>
                  <span className="text-[10px] text-slate-400 block">{lang.name}</span>
                </span>
                {selectedLang === lang.code && <Check size={14} className="text-emerald-700 shrink-0" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

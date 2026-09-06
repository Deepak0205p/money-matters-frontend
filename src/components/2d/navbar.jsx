"use client";

import Link from 'next/link';
import { useAppStore } from '@/lib/store/useAppStore';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { Coins, Trophy, User, Menu, X, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { LanguageSelector } from '@/components/LanguageSelector';

export function Navbar() {
  const {
    coins,
    streak,
    isAuthenticated,
    user,
    logout
  } = useAppStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-6xl"
    >
      <div className="rounded-2xl p-3 sm:p-3.5 bg-white/90 backdrop-blur-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl transition-all group-hover:scale-105 overflow-hidden bg-gradient-to-tr from-blue-600 to-indigo-700 p-0.5 shadow-sm"
            >
              <img src="/logo.png" alt="Logo" className="h-full w-full object-cover rounded-[10px]" />
            </div>
            <span className="text-lg font-extrabold font-display tracking-tight text-slate-900">
              Money<span className="text-blue-600">Matters</span>
            </span>
          </Link>

          {/* Desktop Right Nav Controls */}
          <div className="hidden items-center gap-3 md:flex">
            
            {/* Coins indicator */}
            <div className="flex items-center gap-2 rounded-xl bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 shadow-sm">
              <Coins size={14} className="text-amber-600" />
              <span className="font-bold text-amber-700 text-xs tabular-nums">{coins}</span>
            </div>

            {/* Streak indicator */}
            <div className="flex items-center gap-2 rounded-xl bg-orange-500/10 border border-orange-500/20 px-3.5 py-1.5 shadow-sm">
              <Trophy size={14} className="text-orange-600" />
              <span className="font-bold text-orange-700 text-xs">
                {streak} din
              </span>
            </div>

            {/* Language Selector */}
            <LanguageSelector variant="compact" />

            <div className="flex items-center gap-2.5">
              <Link
                href="/home/dashboard"
                className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-extrabold text-white shadow-sm transition-all transform hover:-translate-y-0.5"
              >
                <User size={14} className="stroke-[2.5]" />
                <span>Dashboard</span>
              </Link>
            </div>
          </div>

          {/* Mobile menu trigger */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="cursor-pointer md:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -8 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden"
          >
            <div className="glass-strong rounded-2xl mt-2 p-4 space-y-3 shadow-premium border-b-4 border-blue-500/10">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center justify-between rounded-xl bg-gold/10 border border-gold/20 p-3 border-b-2">
                  <div className="flex items-center gap-2">
                    <Coins size={15} className="text-gold-soft" />
                    <span className="font-bold text-gold-soft text-sm">{coins}</span>
                  </div>
                  <span className="text-[10px] text-gold-soft/70 uppercase font-semibold">
                    Coins
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-orange-400/10 border border-orange-400/20 p-3 border-b-2">
                  <div className="flex items-center gap-2">
                    <Trophy size={15} className="text-orange-300" />
                    <span className="font-bold text-orange-300 text-sm">{streak}</span>
                  </div>
                  <span className="text-[10px] text-orange-300/70 uppercase font-semibold">
                    Streak
                  </span>
                </div>
              </div>

              {/* Language Selector Mobile */}
              <div className="flex items-center gap-2">
                <LanguageSelector variant="compact" />
              </div>

              <Link href="/home/dashboard" onClick={() => setIsMenuOpen(false)} className="block">
                <div className="flex items-center gap-3 rounded-xl bg-blue-600/15 border border-blue-500/25 p-3 cursor-pointer hover:bg-blue-100 transition-colors">
                  <User size={16} className="text-blue-400" />
                  <span className="font-semibold text-blue-400 text-sm flex-1">
                    Open Dashboard
                  </span>
                  <span className="text-[10px] text-blue-400/80 uppercase font-bold">
                    Go →
                  </span>
                </div>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

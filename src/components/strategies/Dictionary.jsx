'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { termsDictionary } from '@/lib/data/terms-dictionary';
import { useAppStore } from '@/lib/store/useAppStore';
import {
  Search, X, CheckCircle2, BookOpen, TrendingUp, Landmark,
  Receipt, Shield, AlertCircle, PiggyBank, GraduationCap,
  Star, Zap, Lightbulb, DollarSign
} from 'lucide-react';

// ─── Category config ────────────────────────────────────────────────────────
const categoryConfig = {
  basics: {
    label: 'Basics',
    color: '#06b6d4',
    icon: Lightbulb,
    emoji: '📚',
  },
  important: {
    label: 'Important',
    color: '#f59e0b',
    icon: Star,
    emoji: '⭐',
  },
  investing: {
    label: 'Investing',
    color: '#22c55e',
    icon: TrendingUp,
    emoji: '📈',
  },
  banking: {
    label: 'Banking',
    color: '#3b82f6',
    icon: Landmark,
    emoji: '🏦',
  },
  tax: {
    label: 'Tax',
    color: '#f59e0b',
    icon: Receipt,
    emoji: '🧾',
  },
  insurance: {
    label: 'Insurance',
    color: '#8b5cf6',
    icon: Shield,
    emoji: '🛡️',
  },
  debt: {
    label: 'Debt',
    color: '#ef4444',
    icon: AlertCircle,
    emoji: '⚠️',
  },
  saving: {
    label: 'Saving',
    color: '#2563eb',
    icon: PiggyBank,
    emoji: '🐷',
  },
};

const allCategories = ['basics', 'important', 'investing', 'banking', 'tax', 'insurance', 'debt', 'saving'];

// ─── Term Popup Modal ────────────────────────────────────────────────────────
function TermModal({ term, onClose, onToggleMastered, isMastered }) {
  const config = categoryConfig[term.category];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />

        {/* Modal card */}
        <motion.div
          className="relative z-10 w-full max-w-md rounded-3xl overflow-hidden border bg-white shadow-2xl"
          style={{
            borderColor: `${config.color}40`,
          }}
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 30 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="relative px-6 pt-6 pb-4 border-b border-slate-100"
            style={{ background: `linear-gradient(135deg, ${config.color}15 0%, #FFFFFF 100%)` }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-xs"
                  style={{ backgroundColor: `${config.color}20`, border: `1px solid ${config.color}40` }}
                >
                  <Icon size={20} style={{ color: config.color }} />
                </div>
                <div>
                  <span
                    className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
                    style={{ color: config.color, backgroundColor: `${config.color}15`, border: `1px solid ${config.color}35` }}
                  >
                    {config.emoji} {config.label}
                  </span>
                  <h3 className="text-base font-black text-slate-900 mt-1 leading-tight">{term.term}</h3>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all shrink-0"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-4">
            {/* Definition */}
            <div
              className="rounded-2xl p-4 shadow-2xs"
              style={{ backgroundColor: `${config.color}10`, border: `1px solid ${config.color}25` }}
            >
              <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: config.color }}>
                📖 Definition
              </p>
              <p className="text-sm text-slate-800 leading-relaxed font-medium">{term.definition}</p>
            </div>

            {/* Example */}
            <div className="rounded-2xl p-4 bg-slate-50 border border-slate-200/90 shadow-2xs">
              <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest mb-2">
                🇮🇳 Indian Example
              </p>
              <p className="text-sm text-slate-700 leading-relaxed font-medium">{term.example}</p>
            </div>

            {/* Footer actions */}
            <div className="flex gap-3 pt-1">
              <motion.button
                onClick={() => onToggleMastered(term.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="flex-1 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                style={
                  isMastered
                    ? { background: 'linear-gradient(135deg, #059669, #047857)', color: '#FFFFFF' }
                    : { backgroundColor: `${config.color}18`, color: config.color, border: `1px solid ${config.color}35` }
                }
              >
                <CheckCircle2 size={13} />
                {isMastered ? 'Mastered ✓' : 'Mark Mastered'}
              </motion.button>

              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="px-5 py-3 rounded-2xl text-xs font-bold text-slate-600 border border-slate-200 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer"
              >
                Close
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Main Dictionary Component ────────────────────────────────────────────────
export default function Dictionary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedTerm, setSelectedTerm] = useState(null);

  const { masteredTerms, toggleTermMastered } = useAppStore();

  // Filter terms
  const filteredTerms = useMemo(() => {
    let terms = termsDictionary;
    if (activeCategory !== 'all') {
      terms = terms.filter((t) => t.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      terms = terms.filter(
        (t) =>
          t.term.toLowerCase().includes(q) ||
          t.definition.toLowerCase().includes(q) ||
          t.example.toLowerCase().includes(q)
      );
    }
    return terms;
  }, [activeCategory, searchQuery]);

  const masteredCount = masteredTerms.length;
  const totalTerms = termsDictionary.length;
  const selectedTermData = selectedTerm ? termsDictionary.find((t) => t.id === selectedTerm) : null;

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-3 sm:px-4 py-4 gap-5">

      {/* ── Header ── */}
      <div className="text-center space-y-2">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900">
          Rupaiya Dictionary <span className="text-amber-500">📖</span>
        </h2>
        <p className="text-sm text-slate-600 font-medium">
          Financial terms Hinglish mein samjho — {masteredCount}/{totalTerms} mastered!
        </p>
        {/* Progress bar */}
        <div className="mx-auto w-52 h-2 bg-slate-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #f59e0b, #059669)' }}
            initial={{ width: 0 }}
            animate={{ width: `${(masteredCount / totalTerms) * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* ── Search bar ── */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Term ya definition search karo…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white border border-slate-200 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 transition-colors shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X size={13} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-amber-50 border border-amber-200 shrink-0">
          <GraduationCap size={13} className="text-amber-700" />
          <span className="text-xs font-black text-amber-800">{masteredCount}/{totalTerms}</span>
        </div>
      </div>

      {/* ── A-Z Letter Filter ── */}
      <div className="flex items-center gap-0.5 overflow-x-auto pb-1 no-scrollbar">
        {['ALL', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')].map((letter) => {
          const isAll = letter === 'ALL';
          const hasTerms = isAll || termsDictionary.some((t) => t.term.charAt(0).toUpperCase() === letter);
          const isActive = isAll ? searchQuery === '' && activeCategory === 'all' : false;
          return (
            <button
              key={letter}
              onClick={() => {
                if (isAll) {
                  setSearchQuery('');
                  setActiveCategory('all');
                } else if (hasTerms) {
                  setSearchQuery(letter);
                  setActiveCategory('all');
                }
              }}
              className={`min-w-[22px] h-6 flex items-center justify-center rounded text-[8px] font-black shrink-0 transition-all ${
                hasTerms
                  ? 'text-amber-800 bg-amber-100 hover:bg-amber-200 cursor-pointer'
                  : 'text-slate-300 cursor-default'
              } ${isAll ? 'px-2 text-[7px]' : ''}`}
            >
              {letter}
            </button>
          );
        })}
      </div>

      {/* ── Category Filter Tabs ── */}
      <div className="flex flex-wrap gap-2">
        {/* All */}
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border cursor-pointer ${
            activeCategory === 'all'
              ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
              : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          All ({termsDictionary.length})
        </button>

        {allCategories.map((cat) => {
          const cfg = categoryConfig[cat];
          const count = termsDictionary.filter((t) => t.category === cat).length;
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border cursor-pointer shadow-2xs"
              style={
                isActive
                  ? { backgroundColor: `${cfg.color}25`, color: cfg.color, borderColor: `${cfg.color}50` }
                  : { backgroundColor: '#FFFFFF', color: '#64748B', borderColor: '#E2E8F0' }
              }
            >
              {cfg.emoji} {cfg.label} ({count})
            </button>
          );
        })}
      </div>

      {/* ── Divider ── */}
      <div className="h-px bg-slate-200" />

      {/* ── Terms Chip Cloud ── */}
      <div className="flex flex-wrap gap-2 justify-center">
        <AnimatePresence>
          {filteredTerms.map((term, i) => {
            const config = categoryConfig[term.category];
            const isMastered = masteredTerms.includes(term.id);

            return (
              <motion.button
                key={term.id}
                layout
                onClick={() => setSelectedTerm(term.id)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.06, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25, delay: i * 0.01 }}
                className="relative rounded-xl px-3 py-2 border transition-all cursor-pointer shadow-2xs bg-white"
                style={{
                  backgroundColor: isMastered ? '#F0FDF4' : '#FFFFFF',
                  borderColor: isMastered ? '#86EFAC' : '#E2E8F0',
                }}
              >
                <div className="flex items-center gap-1.5">
                  {isMastered ? (
                    <CheckCircle2 size={11} className="text-emerald-600" />
                  ) : (
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: config.color }}
                    />
                  )}
                  <span className={`text-xs font-semibold whitespace-nowrap ${isMastered ? 'text-emerald-950 font-bold' : 'text-slate-800'}`}>{term.term}</span>
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>

        {/* Empty state */}
        {filteredTerms.length === 0 && (
          <div className="text-center py-12 w-full text-slate-400">
            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">Koi term nahi mila — search change karo!</p>
          </div>
        )}
      </div>

      {/* ── Stats Footer ── */}
      <div className="mt-2 grid grid-cols-3 gap-3">
        {[
          { label: 'Total Terms', value: totalTerms, color: '#2563EB' },
          { label: 'Mastered', value: masteredCount, color: '#059669' },
          { label: 'Remaining', value: totalTerms - masteredCount, color: '#D97706' },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl p-3 text-center border border-slate-200/90 bg-white shadow-2xs"
          >
            <p className="text-lg font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Term Popup Modal ── */}
      {selectedTermData && (
        <TermModal
          term={selectedTermData}
          onClose={() => setSelectedTerm(null)}
          onToggleMastered={(id) => toggleTermMastered(id)}
          isMastered={masteredTerms.includes(selectedTermData.id)}
        />
      )}
    </div>
  );
}
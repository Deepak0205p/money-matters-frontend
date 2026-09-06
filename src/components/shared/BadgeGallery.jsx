'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Lock, Sparkles, Crown } from 'lucide-react';
import { useAppStore } from '@/lib/store/useAppStore';
import { BADGES, TOTAL_BADGES, TIER_COLORS, getRarestBadges, getBadgesByCategory } from '@/lib/data/badges';

const TABS = [
  { key: 'all', label: 'All', emoji: '✨' },
  { key: 'learning', label: 'Learning', emoji: '📚' },
  { key: 'streak', label: 'Streaks', emoji: '🔥' },
  { key: 'strategy', label: 'Strategies', emoji: '🎮' },
  { key: 'special', label: 'Special', emoji: '⭐' }
];

const TIER_RING = {
  bronze: 'from-[#CD7F32] to-[#8B4513]',
  silver: 'from-[#E5E7EB] to-[#9CA3AF]',
  gold: 'from-[#FBBF24] to-[#D97706]',
  diamond: 'from-[#A78BFA] to-[#7C3AED]'
};

function BadgeCell({ badge, earned, index }) {
  const [showTip, setShowTip] = useState(false);
  const tierColor = TIER_COLORS[badge.tier] || { ring: '#9CA3AF', glow: 'rgba(255,255,255,0.1)', label: 'Bronze' };

  return (
    <div
      className="relative flex flex-col items-center text-center group"
      onMouseEnter={() => setShowTip(true)}
      onMouseLeave={() => setShowTip(false)}
      onFocus={() => setShowTip(true)}
      onBlur={() => setShowTip(false)}
    >
      {earned && (
        <span 
          className="absolute -top-1 -right-1 z-10 text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full"
          style={{
            color: tierColor.ring,
            backgroundColor: `${tierColor.ring}10`,
            borderColor: `${tierColor.ring}40`,
            borderWidth: '1px'
          }}
        >
          {tierColor.label}
        </span>
      )}

      {/* Circle Ring */}
      <div
        className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
          earned 
            ? `bg-gradient-to-br ${TIER_RING[badge.tier]} shadow-md` 
            : 'bg-slate-100 border border-slate-200/80 shadow-2xs'
        }`}
        style={earned ? {
          boxShadow: `0 0 16px ${tierColor.glow}, inset 0 0 10px rgba(255,255,255,0.2)`
        } : undefined}
      >
        {earned ? (
          <span 
            className="text-2xl sm:text-3xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)] select-none animate-pulse"
          >
            {badge.emoji}
          </span>
        ) : (
          <div className="flex flex-col items-center gap-0.5">
            <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
            <span className="text-[9px] text-slate-400 font-bold font-mono">?</span>
          </div>
        )}

        {earned && (
          <span 
            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.1) 100%)',
              mixBlendMode: 'overlay'
            }}
          />
        )}
      </div>

      <div className={`mt-2 text-[10px] sm:text-xs font-bold uppercase tracking-wide leading-tight ${earned ? 'text-slate-800' : 'text-slate-500'}`}>
        {earned ? badge.name : 'Locked'}
      </div>

      {earned && (
        <div className="text-[9px] text-amber-600 font-black mt-0.5 flex items-center gap-0.5">
          <span>🪙</span> +{badge.rewardCoins}
        </div>
      )}

      {/* Hover requirement tip */}
      <AnimatePresence>
        {showTip && !earned && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full z-20 w-44 p-3 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl pointer-events-none text-left"
          >
            <div className="text-[9px] uppercase tracking-widest text-emerald-400 font-black mb-1">
              🔑 REQUIREMENT
            </div>
            <p className="text-[10px] text-slate-200 font-semibold leading-relaxed">
              {badge.requirement}
            </p>
            <div className="mt-1.5 flex items-center gap-1 text-[9.5px] text-amber-400 font-black uppercase">
              <span>🪙</span> +{badge.rewardCoins} Coins
            </div>
            <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 rotate-45 bg-slate-900 border-r border-b border-slate-700" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function BadgeGallery({ open, onClose }) {
  const {
    badges,
    earnedBadges
  } = useAppStore();

  const [activeTab, setActiveTab] = useState('all');

  const earnedSet = useMemo(() => {
    return new Set([...(badges || []), ...(earnedBadges || [])]);
  }, [badges, earnedBadges]);

  const earnedCount = useMemo(() => {
    return BADGES.filter(b => earnedSet.has(b.id)).length;
  }, [earnedSet]);

  const progressPercent = Math.round((earnedCount / TOTAL_BADGES) * 100);

  const rarestBadges = useMemo(() => {
    return getRarestBadges().slice(0, 5);
  }, []);

  const visibleBadges = useMemo(() => {
    const list = getBadgesByCategory(activeTab);
    return list.sort((a, b) => {
      const ae = earnedSet.has(a.id) ? 0 : 1;
      const be = earnedSet.has(b.id) ? 0 : 1;
      if (ae !== be) return ae - be;
      const tierOrder = ['diamond', 'gold', 'silver', 'bronze'];
      return tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier);
    });
  }, [activeTab, earnedSet]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* Backdrop blur overlay */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Container */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative z-10 w-full max-w-2xl bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="shrink-0 px-6 py-4 border-b border-slate-100 bg-white/95 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center shadow-2xs">
              <Trophy size={20} className="text-amber-500" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Sammaan Gallery 🏆</h2>
              <p className="text-[10px] text-slate-500">Unlock shields and medals as you build wealth</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all focus:outline-none"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scroll bg-white">
          
          {/* Progress bar card */}
          <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-2 shadow-2xs">
            <div className="flex justify-between text-xs font-black uppercase tracking-wider">
              <span className="text-slate-600">{earnedCount} of {TOTAL_BADGES} Badges Earned</span>
              <span className="text-amber-600 font-extrabold">{progressPercent}% Done</span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-600 via-amber-500 to-indigo-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Rarest badges highlights */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Crown size={14} className="text-amber-500" />
              <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider">Rarest Achievements</h3>
            </div>
            <div className="grid grid-cols-5 gap-3 p-4 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-2xs">
              {rarestBadges.map((badge, idx) => (
                <BadgeCell key={badge.id} badge={badge} earned={earnedSet.has(badge.id)} index={idx} />
              ))}
            </div>
          </div>

          {/* Tab selectors */}
          <div className="flex gap-2 overflow-x-auto pb-1.5 no-scrollbar">
            {TABS.map(tab => {
              const active = activeTab === tab.key;
              const countInTab = tab.key === 'all' ? TOTAL_BADGES : BADGES.filter(b => b.category === tab.key).length;
              const earnedInTab = tab.key === 'all' ? earnedCount : BADGES.filter(b => b.category === tab.key && earnedSet.has(b.id)).length;

              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-3.5 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all border cursor-pointer flex items-center gap-1.5 ${
                    active 
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-2xs' 
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span>{tab.emoji}</span>
                  <span>{tab.label}</span>
                  <span className={`text-[9px] font-bold ${active ? 'text-emerald-700' : 'text-slate-400'}`}>
                    ({earnedInTab}/{countInTab})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Badges Grid */}
          <div className="relative pb-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4"
              >
                {visibleBadges.map((badge, idx) => (
                  <BadgeCell key={badge.id} badge={badge} earned={earnedSet.has(badge.id)} index={idx} />
                ))}
              </motion.div>
            </AnimatePresence>

            {earnedCount === 0 && (
              <div className="p-8 rounded-3xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-2">
                <Sparkles size={24} className="text-slate-400 mx-auto animate-pulse" />
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">No Badges Found</h4>
                <p className="text-[11px] text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Earn shields by completing learning tasks, keeping expense streaks, or testing calculators!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 px-6 py-4 border-t border-slate-100 bg-slate-50/80 backdrop-blur-md flex items-center justify-between text-xs font-black uppercase text-slate-500">
          <span>{earnedCount} Medals Unlocked</span>
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-xs focus:outline-none"
          >
            Close ✓
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export { BadgeGallery };
'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Flame, CheckCircle2, Trophy, Star, 
  Zap, ChevronRight, Sparkles, Award 
} from 'lucide-react';
import { useAppStore } from '@/lib/store/useAppStore';
import { toast } from '@/hooks/use-toast';

const CHALLENGE_LIBRARY = [
  {
    id: 'no-swiggy',
    title: 'No Swiggy Week 🍔❌',
    emoji: '🍔❌',
    duration: 7,
    dailyGoal: 200,
    difficulty: 'Medium',
    stars: 2,
    rewardCoins: 100,
    color: '#EF4444',
    description: '7 din tak Swiggy/Zomato se junk order nahi karna. Simple ghar ka khana best!'
  },
  {
    id: 'chai',
    title: 'Chai se Paisa Challenge ☕💰',
    emoji: '☕💰',
    duration: 14,
    dailyGoal: 30,
    difficulty: 'Easy',
    stars: 1,
    rewardCoins: 80,
    color: '#92400E',
    description: 'Tapri ki chai ke bajaye ghar pe banao. Daily ₹30 bachat = ₹420 saved in 2 weeks!'
  },
  {
    id: '500-week',
    title: '₹500 Savings Sprint 💵',
    emoji: '💵',
    duration: 7,
    dailyGoal: 72,
    difficulty: 'Medium',
    stars: 2,
    rewardCoins: 120,
    color: '#F59E0B',
    description: 'Daily ~₹72 save karo — 7 din mein ₹500! Apne pocket balance ko speed up karein.'
  },
  {
    id: 'round-up',
    title: 'Round-Up Ledger 🔄',
    emoji: '🔄',
    duration: 30,
    dailyGoal: 25,
    difficulty: 'Easy',
    stars: 1,
    rewardCoins: 90,
    color: '#2563eb',
    description: 'Har spend ko round up karke safe reserve register karo. Small change, big wealth!'
  },
  {
    id: 'no-impulse',
    title: 'No Impulse Spends 🛒❌',
    emoji: '🛒❌',
    duration: 7,
    dailyGoal: 150,
    difficulty: 'Hard',
    stars: 3,
    rewardCoins: 150,
    color: '#EC4899',
    description: '7 din tak strict NO on e-commerce browsing. Sirf ultimate essentials allowed!'
  }
];

export default function SavingsChallenge({ open, onClose }) {
  const { 
    savingsChallenge, 
    startSavingsChallenge, 
    markSavingsDay, 
    resetSavingsChallenge, 
    addCoins 
  } = useAppStore();

  const [trophies, setTrophies] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(CHALLENGE_LIBRARY[0]);

  const activeTemplate = useMemo(() => {
    if (!savingsChallenge.isActive) return null;
    // Match current state or fallback
    return CHALLENGE_LIBRARY.find(c => c.dailyGoal === savingsChallenge.dailyGoal) || selectedTemplate;
  }, [savingsChallenge.isActive, savingsChallenge.dailyGoal, selectedTemplate]);

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  const todayDone = useMemo(() => {
    return savingsChallenge.days.find(d => d.date === today)?.saved;
  }, [savingsChallenge.days, today]);

  const completedDays = useMemo(() => {
    return savingsChallenge.days.filter(d => d.saved).length;
  }, [savingsChallenge.days]);

  const currentStreak = useMemo(() => {
    let streak = 0;
    const now = new Date();
    for (let i = 0; i < savingsChallenge.days.length; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().split('T')[0];
      const day = savingsChallenge.days.find(dd => dd.date === ds);
      if (day?.saved) streak++;
      else break;
    }
    return streak;
  }, [savingsChallenge.days]);

  const progressPct = useMemo(() => {
    if (!activeTemplate) return 0;
    return Math.min(100, Math.round((completedDays / activeTemplate.duration) * 100));
  }, [completedDays, activeTemplate]);

  const handleStart = (template) => {
    setSelectedTemplate(template);
    startSavingsChallenge(template.dailyGoal);
    toast({
      title: `${template.title} Accepted! 🏁`,
      description: `Target: Daily ₹${template.dailyGoal} save karein for ${template.duration} days.`
    });
  };

  const handleCheckIn = () => {
    if (todayDone || !activeTemplate) return;

    const dayNum = savingsChallenge.days.find(d => d.date === today)?.day || 1;
    markSavingsDay(dayNum, activeTemplate.dailyGoal);
    addCoins(10);

    toast({
      title: "Daily Check-in Complete! +10 Coins 💰",
      description: "Consistency points added to your streak tracker."
    });

    // Check if challenge is fully complete
    if (completedDays + 1 >= activeTemplate.duration) {
      const newTrophy = {
        id: `${activeTemplate.id}-${Date.now()}`,
        title: activeTemplate.title,
        emoji: activeTemplate.emoji,
        date: today,
        rewardCoins: activeTemplate.rewardCoins
      };
      setTrophies(prev => [newTrophy, ...prev]);
      addCoins(activeTemplate.rewardCoins);
      resetSavingsChallenge();

      toast({
        title: `Challenge Smashed! +${activeTemplate.rewardCoins} Coins 🏆✨`,
        description: "Perfect savings challenge completion badge earned!"
      });
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* Backdrop blur overlay */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Card Content */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative z-10 w-full max-w-2xl bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Glows */}
        <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-amber-100/60 blur-[80px] pointer-events-none" />

        {/* Header */}
        <div className="shrink-0 px-6 py-4 border-b border-slate-100 bg-slate-50/70 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center">
              <Flame size={20} className="text-amber-600" />
            </div>
            <div>
              <h2 className="font-display text-base font-black text-slate-900">Bachat Challenge 🐷</h2>
              <p className="text-[11px] text-slate-500 font-medium">Micro Savings Habit & Streak Tracker</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-all cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scroll bg-white">
          
          {/* Active Challenge Overview or Empty State */}
          {savingsChallenge.isActive && activeTemplate ? (
            <div className="bg-white border border-emerald-300 rounded-3xl p-5 relative overflow-hidden space-y-4 shadow-xs">
              <div className="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-emerald-50 blur-[40px] pointer-events-none" />
              
              <div className="flex items-start gap-4">
                <span className="text-5xl">{activeTemplate.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-black uppercase">
                      Active Sprint
                    </span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{activeTemplate.difficulty}</span>
                  </div>
                  <h3 className="text-base font-black text-slate-900 mt-1">{activeTemplate.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1 font-medium">{activeTemplate.description}</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs font-black uppercase tracking-wider">
                  <span className="text-slate-500">Day {completedDays} / {activeTemplate.duration} completed</span>
                  <span className="text-emerald-700 font-extrabold">{progressPct}% Done</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              {/* Daily Check-in Action */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  onClick={handleCheckIn}
                  disabled={!!todayDone}
                  className={`w-full sm:flex-1 py-3 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                    todayDone 
                      ? 'bg-slate-100 text-slate-500 border border-slate-200 cursor-not-allowed' 
                      : 'bg-emerald-700 hover:bg-emerald-800 text-white active:scale-95'
                  }`}
                >
                  {todayDone ? <CheckCircle2 size={14} /> : <Flame size={14} />}
                  {todayDone ? 'Today checked-in ✓' : 'Aaj Target Save Kiya! (+10 Coins)'}
                </button>
                {savingsChallenge.isActive && (
                  <button 
                    onClick={resetSavingsChallenge}
                    className="w-full sm:w-auto px-4 py-3 rounded-2xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Give Up
                  </button>
                )}
              </div>

              <div className="flex justify-between text-[10px] text-slate-500 font-bold pt-2 border-t border-slate-100">
                <span>Total Challenge Savings: ₹{savingsChallenge.totalSaved}</span>
                <span className="text-amber-600">Final Reward: +{activeTemplate.rewardCoins} Coins</span>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-5 text-center py-10 space-y-4">
              <span className="text-5xl block">🎯</span>
              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-900">Accept a Savings Challenge!</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  Apne money discipline ko challenge karein. Neeche list se preset accept karein aur daily verification streak log shuru karein.
                </p>
              </div>
            </div>
          )}

          {/* Challenge library grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1">
              <Sparkles size={13} className="text-amber-500" /> Active Challenge Library
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CHALLENGE_LIBRARY.map(t => {
                const isActive = savingsChallenge.isActive && activeTemplate?.id === t.id;
                return (
                  <div key={t.id} className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between h-44 relative overflow-hidden">
                    <div className="flex items-start justify-between">
                      <span className="text-3xl bg-slate-50 border border-slate-200/80 p-1.5 rounded-xl">{t.emoji}</span>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <Star 
                            key={i} 
                            size={10} 
                            className={i < t.stars ? 'text-amber-500 fill-amber-400' : 'text-slate-200'} 
                          />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1 mt-2">
                      <span className="text-xs font-extrabold text-slate-900 block">{t.title}</span>
                      <span className="text-[10px] text-slate-500 block leading-tight line-clamp-2 font-medium">{t.description}</span>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100">
                      <span className="text-[10px] text-slate-500 font-bold">
                        ⏱️ {t.duration} Days · +{t.rewardCoins} Coins
                      </span>
                      <button
                        onClick={() => handleStart(t)}
                        disabled={savingsChallenge.isActive}
                        className={`px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border cursor-pointer ${
                          isActive 
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                            : savingsChallenge.isActive 
                              ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                              : 'bg-emerald-700 text-white border-transparent hover:bg-emerald-800 shadow-xs'
                        }`}
                      >
                        {isActive ? 'Active' : 'Start'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Trophy Wall */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
              <Trophy size={13} className="text-amber-500" /> Completed Achievements Wall
            </h4>

            {trophies.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs bg-slate-50 border border-slate-200/80 rounded-3xl">
                🏆 Abhi tak koi challenge complete nahi hua. Accept now and win trophy shields!
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {trophies.map(tr => (
                  <div key={tr.id} className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200 text-center space-y-1.5 shadow-xs">
                    <span className="text-3xl block">{tr.emoji}</span>
                    <span className="text-[11px] font-black text-slate-900 block truncate">{tr.title}</span>
                    <span className="text-[10px] text-amber-700 font-black block">+{tr.rewardCoins} Coins Won</span>
                    <span className="text-[8px] text-slate-400 font-bold block">{tr.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 px-6 py-4 border-t border-slate-100 bg-slate-50/70 backdrop-blur-md flex items-center justify-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Bachat Challenge — streaks reset on skipped check-ins
          </p>
        </div>
      </motion.div>
    </div>
  );
}
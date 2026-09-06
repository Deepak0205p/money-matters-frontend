'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Sparkles, Plus, Minus, IndianRupee, 
  AlertTriangle, Check, ShieldAlert, ShieldCheck, Award 
} from 'lucide-react';
import { useAppStore } from '@/lib/store/useAppStore';
import { toast } from '@/hooks/use-toast';

const EXPENSE_ROWS = [
  { key: 'rent', label: 'Rent / Hostel 🏠', defaultValue: 8000, color: '#F43F5E' },
  { key: 'food', label: 'Food / Grocery 🍛', defaultValue: 5000, color: '#F59E0B' },
  { key: 'transport', label: 'Travel / Commute 🚗', defaultValue: 2000, color: '#3B82F6' },
  { key: 'utilities', label: 'Bills (Mobile/Wi-Fi) ⚡', defaultValue: 1000, color: '#2563eb' },
  { key: 'emi', label: 'EMI / Loan payments 💳', defaultValue: 0, color: '#A855F7' },
  { key: 'other', label: 'Other essential spends 📦', defaultValue: 1500, color: '#94A3B8' }
];

const JOB_CONFIG = {
  student: { label: 'Student 🎓', months: 3, color: 'text-violet-400', bg: 'bg-violet-500/10' },
  employed: { label: 'Employed 💼', months: 6, color: 'text-blue-400', bg: 'bg-blue-50' },
  freelancer: { label: 'Freelancer 💻', months: 9, color: 'text-amber-400', bg: 'bg-amber-500/10' }
};

const DEPENDENT_OPTIONS = [0, 1, 2, 3, 4];

export default function EmergencyFundCalculator({ open, onClose }) {
  const { addCoins, addBadge } = useAppStore();
  const [expenses, setExpenses] = useState(() => 
    Object.fromEntries(EXPENSE_ROWS.map(r => [r.key, r.defaultValue]))
  );
  const [job, setJob] = useState('student');
  const [dependents, setDependents] = useState(0);
  const [currentSavings, setCurrentSavings] = useState(2000);
  const [targetReached, setTargetReached] = useState(false);

  const monthlyExpense = useMemo(() => {
    return Object.values(expenses).reduce((s, v) => s + v, 0);
  }, [expenses]);

  // Target: monthlyExpense * job months + dependents buffer (10k/dep)
  const target = useMemo(() => {
    const base = monthlyExpense * JOB_CONFIG[job].months;
    const dependentBuffer = dependents * 10000;
    return base + dependentBuffer;
  }, [monthlyExpense, job, dependents]);

  const monthlySavingPlan = useMemo(() => Math.ceil(target / 12), [target]);
  const monthsToReach = useMemo(() => {
    if (monthlySavingPlan <= 0) return 0;
    const diff = target - currentSavings;
    return diff > 0 ? Math.ceil(diff / monthlySavingPlan) : 0;
  }, [target, currentSavings, monthlySavingPlan]);

  const protectionPct = useMemo(() => {
    if (target <= 0) return 100;
    return Math.min(100, (currentSavings / target) * 100);
  }, [currentSavings, target]);

  const tier = useMemo(() => {
    if (protectionPct >= 100) return {
      key: 'full', label: 'Fully Shielded! 🏆', color: '#2563eb', ring: 'rgba(16,185,129,0.5)',
      desc: 'Outstanding! Your Safety Shield is complete. Stay stress-free.'
    };
    if (protectionPct >= 60) return {
      key: 'strong', label: 'Strong Shield 🛡️', color: '#06B6D4', ring: 'rgba(6,182,212,0.4)',
      desc: 'You\'re on the right track. You\'ll be safe in an emergency.'
    };
    if (protectionPct >= 20) return {
      key: 'half', label: 'Partial Shield ⚠️', color: '#F59E0B', ring: 'rgba(245,158,11,0.3)',
      desc: 'Some safety exists, but grow your fund for heavy financial storms.'
    };
    return {
      key: 'broken', label: 'Broken Shield 🚨', color: '#EF4444', ring: 'rgba(239,68,68,0.3)',
      desc: 'Without a backup, your financial risk is high! Grow your savings.'
    };
  }, [protectionPct]);

  useEffect(() => {
    if (protectionPct >= 100 && !targetReached) {
      setTargetReached(true);
      addBadge('emergency-shielded');
      addCoins(25);
      toast({
        title: "Emergency Shield Active! +25 Coins 🛡️✨",
        description: "Aapne milestone badge unlock kar liya hai."
      });
    } else if (protectionPct < 100 && targetReached) {
      setTargetReached(false);
    }
  }, [protectionPct, targetReached, addBadge, addCoins]);

  const updateExpense = (key, delta) => {
    setExpenses(prev => ({
      ...prev,
      [key]: Math.max(0, prev[key] + delta)
    }));
  };

  const handleSavePlan = () => {
    addCoins(10);
    toast({
      title: "Plan saved successfully! +10 Coins 💾",
      description: "Aapki custom Emergency goal value set ho gayi hai."
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* Backdrop blur overlay */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Card container */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative z-10 w-full max-w-4xl bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Effects */}
        <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-emerald-100/60 blur-[80px] pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-teal-100/60 blur-[80px] pointer-events-none" />

        {/* Header */}
        <div className="shrink-0 px-6 py-4 border-b border-slate-100 bg-slate-50/70 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
              <Shield size={20} className="text-emerald-700" />
            </div>
            <div>
              <h2 className="font-display text-base font-extrabold text-slate-900">Suraksha Kavach 🛡️</h2>
              <p className="text-[11px] text-slate-500 font-medium">Emergency Fund Builder & Safety Meter</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-all cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scroll bg-white">
          {/* Main Vis & Statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Visual Shield Graphic (Col 5) */}
            <div className="lg:col-span-5 bg-slate-50 border border-slate-200/80 rounded-3xl p-5 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[220px]">
              
              {/* Dynamic glowing shield icon/SVG */}
              <div className="relative w-36 h-36 flex items-center justify-center">
                {/* SVG Shield shape filling up */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 110">
                  <defs>
                    <linearGradient id="shieldFillGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={tier.color} stopOpacity="0.8" />
                      <stop offset="100%" stopColor={tier.color} stopOpacity="0.3" />
                    </linearGradient>
                  </defs>
                  {/* Empty shield outline */}
                  <path 
                    d="M 50 10 L 90 25 L 90 70 Q 90 95 50 105 Q 10 95 10 70 L 10 25 Z" 
                    fill="#F8FAFC" 
                    stroke="#CBD5E1" 
                    strokeWidth="2" 
                  />
                  {/* Filled shield mask */}
                  <path 
                    d="M 50 10 L 90 25 L 90 70 Q 90 95 50 105 Q 10 95 10 70 L 10 25 Z" 
                    fill="url(#shieldFillGrad)"
                    stroke={tier.color}
                    strokeWidth="2.5"
                    style={{
                      clipPath: `inset(${100 - protectionPct}% 0% 0% 0%)`,
                      transition: 'clip-path 0.5s ease-in-out'
                    }}
                  />
                </svg>

                {/* Center text status */}
                <div className="z-10 flex flex-col items-center mt-2">
                  <span className="text-xl">{tier.key === 'broken' ? '🚨' : tier.key === 'full' ? '🏆' : '🛡️'}</span>
                  <span className="text-lg font-black text-slate-900 mt-1">{Math.round(protectionPct)}%</span>
                  <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-widest">Shield Core</span>
                </div>
              </div>

              <div className="mt-4 space-y-1">
                <h4 className="text-sm font-black" style={{ color: tier.color }}>{tier.label}</h4>
                <p className="text-[11px] text-slate-600 px-4 leading-relaxed font-medium">{tier.desc}</p>
              </div>
            </div>

            {/* Config & target parameters (Col 7) */}
            <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-3xl p-5 flex flex-col justify-between shadow-xs">
              
              {/* Job configuration picker */}
              <div className="space-y-2">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider">Job Type & Safety Cover</h4>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(JOB_CONFIG).map(([key, config]) => {
                    const active = job === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setJob(key)}
                        className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                          active 
                            ? 'bg-emerald-50 border-emerald-300 shadow-xs' 
                            : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100'
                        }`}
                      >
                        <span className="text-base block">{config.label.split(' ')[0]}</span>
                        <span className="text-[10px] font-black block mt-0.5 text-slate-900">{config.label.split(' ')[1] || config.label}</span>
                        <span className="text-[9px] text-slate-500 font-bold block mt-0.5">{config.months} Months Cover</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dependents settings */}
              <div className="space-y-2 pt-4 border-t border-slate-100 mt-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-700 font-bold">Family Dependents</span>
                  <span className="text-[10px] text-slate-500 font-medium">+₹10k buffer monthly per dependent</span>
                </div>
                <div className="flex gap-2">
                  {DEPENDENT_OPTIONS.map(opt => (
                    <button
                      key={opt}
                      onClick={() => setDependents(opt)}
                      className={`flex-1 py-2 rounded-xl text-xs font-black transition-all border cursor-pointer ${
                        dependents === opt 
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                          : 'bg-slate-50 border-slate-200/80 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {opt === 0 ? 'None' : `${opt} Person`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Final calculation details */}
              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 mt-4">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Target Reserve</span>
                  <p className="text-lg font-black text-emerald-700 leading-tight">
                    {formatCurrency(target)}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Monthly Saving Target</span>
                  <p className="text-lg font-black text-amber-600 leading-tight">
                    {formatCurrency(monthlySavingPlan)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Expenses Builder */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider">Configure Monthly Essential Spends</h4>
              <span className="text-xs font-bold text-emerald-700">Total: {formatCurrency(monthlyExpense)}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {EXPENSE_ROWS.map(row => (
                <div key={row.key} className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-xs text-slate-700 font-bold ml-1">{row.label}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateExpense(row.key, -1000)}
                      className="w-7 h-7 rounded-lg bg-white hover:bg-slate-200 border border-slate-200 text-slate-600 flex items-center justify-center shrink-0 cursor-pointer shadow-xs"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-xs font-black text-slate-900 min-w-[3.5rem] text-center">
                      ₹{expenses[row.key].toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={() => updateExpense(row.key, 1000)}
                      className="w-7 h-7 rounded-lg bg-white hover:bg-slate-200 border border-slate-200 text-slate-600 flex items-center justify-center shrink-0 cursor-pointer shadow-xs"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Current savings input slider */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-700 uppercase tracking-wider">Already Saved Emergency Money</span>
              <span className="text-xs font-black text-emerald-700">{formatCurrency(currentSavings)}</span>
            </div>
            <input 
              type="range"
              min={0}
              max={target > 0 ? target * 1.2 : 100000}
              step={1000}
              value={currentSavings}
              onChange={(e) => setCurrentSavings(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex gap-2">
              {[5000, 10000, 20000].map(amt => (
                <button
                  key={amt}
                  onClick={() => setCurrentSavings(prev => prev + amt)}
                  className="py-1.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-700 transition-all cursor-pointer"
                >
                  +{amt/1000}K Cash
                </button>
              ))}
              <button
                onClick={() => setCurrentSavings(0)}
                className="py-1.5 px-3 rounded-xl bg-rose-50 text-[10px] font-black text-rose-600 border border-rose-200 hover:bg-rose-100 transition-all ml-auto cursor-pointer"
              >
                Reset Savings
              </button>
            </div>
          </div>

          {/* Educational Insight Alert */}
          <div className="bg-amber-50/60 border border-amber-200 rounded-3xl p-4 flex items-start gap-3 shadow-xs">
            <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={16} />
            <div className="space-y-1">
              <h4 className="text-xs font-black text-amber-900">Stat Fact: 80% of Indians have no emergency fund.</h4>
              <p className="text-[11px] text-slate-700 leading-relaxed font-medium">
                Emergency funds should be kept in liquid assets (Savings Account or Liquid Funds) from which you can withdraw instantly — not in FDs or Stocks with heavy lock-in or potential losses.
              </p>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="shrink-0 px-6 py-4 border-t border-slate-100 bg-slate-50/70 backdrop-blur-md flex items-center justify-between">
          <button 
            onClick={onClose} 
            className="px-5 py-2.5 rounded-2xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-all border border-slate-200 cursor-pointer"
          >
            Close
          </button>
          <button 
            onClick={handleSavePlan} 
            className="px-6 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm cursor-pointer transition-all active:scale-95"
          >
            <Check size={14} /> Save Safety Plan
          </button>
        </div>
      </motion.div>
    </div>
  );
}
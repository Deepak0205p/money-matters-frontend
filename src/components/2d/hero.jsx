"use client";

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowRight, Sparkles, TrendingUp, ShieldCheck, Flame, Coffee, PiggyBank, ArrowUpRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store/useAppStore';

export function Hero() {
  const router = useRouter();
  const { isAuthenticated, loginAsGuest } = useAppStore();

  // Interactive Mini-Compounder (Chai vs SIP)
  const [dailyChaiCost, setDailyChaiCost] = useState(30); // ₹30/day (1-2 chais or canteen snack)
  const years = 10;
  const annualReturn = 12; // 12% equity index average

  const monthlyInvestment = dailyChaiCost * 30; // e.g. ₹900/mo
  const totalInvested = monthlyInvestment * 12 * years;

  const totalValue = useMemo(() => {
    const r = annualReturn / 12 / 100;
    const n = years * 12;
    if (r === 0) return monthlyInvestment * n;
    return Math.round(monthlyInvestment * ((Math.pow(1 + r, n) - 1) / r) * (1 + r));
  }, [monthlyInvestment, years, annualReturn]);

  const wealthGained = Math.max(0, totalValue - totalInvested);

  const handleStartLearning = () => {
    if (isAuthenticated && !!useAppStore.getState().user?.email) {
      router.push('/home/dashboard');
    } else {
      router.push('/auth');
    }
  };

  return (
    <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
      {/* Precision ambient background glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[750px] h-[500px] bg-gradient-to-b from-blue-500/5 via-indigo-500/5 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-[-10%] w-[450px] h-[450px] bg-blue-500/[0.04] rounded-full blur-[160px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-4xl font-extrabold leading-[1.08] tracking-[-0.03em] sm:text-5xl md:text-6xl lg:text-[4.2rem] text-slate-900"
            >
              Master Money in College. <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 bg-clip-text text-transparent">
                Never Fall into Debt Traps.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mx-auto lg:mx-0 max-w-xl text-base text-slate-600 sm:text-lg leading-relaxed font-normal"
            >
              Real financial education engineered for Bharat. Master UPI micro-spending, credit score building, automated SIP compounding, and student taxation without dry textbooks.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStartLearning}
                className="flex items-center justify-center gap-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 px-8 py-4 text-base font-bold text-white cursor-pointer shadow-lg shadow-blue-500/25 transition-all"
              >
                <Play size={18} className="fill-current" />
                <span>Start Learning Now</span>
                <ArrowRight size={18} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(241,245,249,1)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (!isAuthenticated) loginAsGuest();
                  router.push('/home/tools');
                }}
                className="flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-7 py-4 text-base font-semibold text-slate-700 hover:border-slate-400 shadow-sm transition-all cursor-pointer"
              >
                <span>Explore Calculators</span>
                <ArrowUpRight size={18} className="text-slate-500" />
              </motion.button>
            </motion.div>

            {/* Credibility & Feature Highlights */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="grid grid-cols-3 gap-6 max-w-lg mx-auto lg:mx-0 pt-7 border-t border-slate-200"
            >
              {[
                { icon: ShieldCheck, label: 'Zero Jargon', sub: 'Plain conversational Hinglish', color: 'text-blue-600' },
                { icon: PiggyBank, label: 'From ₹10/Day', sub: 'Micro-budgeting formulas', color: 'text-indigo-600' },
                { icon: Flame, label: 'Built for Bharat', sub: 'UPI & Indian credit focus', color: 'text-amber-500' }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center lg:items-start space-y-1">
                  <item.icon size={20} className={item.color} />
                  <span className="text-xs font-bold text-slate-900 mt-1">{item.label}</span>
                  <span className="text-[11px] text-slate-500 leading-tight">{item.sub}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Column: Interactive Student "Chai vs SIP" Compounder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative flex justify-center w-full"
          >
            <div className="relative w-full max-w-md rounded-3xl p-6 sm:p-7 bg-white border border-slate-200/90 shadow-xl shadow-slate-200/60">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 shadow-sm">
                    <Coffee size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                      Canteen Chai vs. SIP
                    </h3>
                    <p className="text-[11px] text-slate-500">Interactive Student Simulation</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200 tabular-nums">
                  12% CAGR
                </span>
              </div>

              {/* Slider Control */}
              <div className="my-6 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600 font-medium">Daily Snack/Chai Budget:</span>
                  <span className="text-base font-bold text-blue-600 tabular-nums tracking-tight">
                    ₹{dailyChaiCost} <span className="text-xs font-normal text-slate-500">/ day</span>
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="150"
                  step="5"
                  value={dailyChaiCost}
                  onChange={(e) => setDailyChaiCost(Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  aria-label="Daily Chai or snack budget slider"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                  <span>₹10 (Cutting Chai)</span>
                  <span>₹75 (Café Snack)</span>
                  <span>₹150 (Fast Food)</span>
                </div>
              </div>

              {/* Metric Matrix */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 mb-4">
                <div>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Monthly Invested
                  </span>
                  <span className="text-base sm:text-lg font-bold text-slate-900 tabular-nums">
                    ₹{monthlyInvestment.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">₹{(totalInvested).toLocaleString('en-IN')} over 10 yrs</span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-blue-700 uppercase tracking-wider block">
                    Future Wealth (10 Yrs)
                  </span>
                  <span className="text-lg sm:text-xl font-extrabold text-blue-600 tabular-nums">
                    ₹{totalValue.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-indigo-600 font-medium block mt-0.5 flex items-center gap-0.5">
                    <TrendingUp size={11} /> +₹{wealthGained.toLocaleString('en-IN')} gains
                  </span>
                </div>
              </div>

              {/* Takeaway Insight */}
              <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-100 flex items-start gap-3">
                <span className="text-base leading-none mt-0.5">💡</span>
                <p className="text-xs text-slate-700 leading-relaxed font-normal">
                  Allocating just <strong className="text-slate-900 font-semibold">₹{dailyChaiCost}/day</strong> into an automated index fund builds a safety net of <strong className="text-blue-700 font-semibold">₹{totalValue.toLocaleString('en-IN')}</strong> before your 30s!
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={handleStartLearning}
                className="mt-4 w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-900 text-xs font-semibold text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Learn How Compounding Works</span>
                <ArrowRight size={13} className="text-blue-400" />
              </button>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
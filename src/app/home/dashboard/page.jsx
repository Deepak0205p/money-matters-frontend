'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store/useAppStore';
import { IndianRupee, Zap, Lock, BookOpen, Clock, ChevronRight, CheckCircle2, ArrowRight, Target, Rocket, TrendingUp } from 'lucide-react';
import { modules, getAllCardsForModule } from '@/data/modulesIndex';

const QUOTES = [
  'Invest your money, secure your future! 🚀',
  'Every rupee is a soldier — deploy it wisely! ⚔️',
  'Understand the magic of compounding and grow wealthy! ✨',
  'Avoiding debt = the first step to financial freedom 🛡️',
  'Save consistently, set up auto-debits! 🐷'
];

const QUICK_TOOLS = [{
  id: 'goals',
  label: 'Goals',
  emoji: '🎯',
  color: '#2563EB'
}, {
  id: 'expense',
  label: 'Expenses',
  emoji: '🧾',
  color: '#4F46E5'
}, {
  id: 'quiz',
  label: 'Quiz',
  emoji: '🧠',
  color: '#7C3AED'
}, {
  id: 'spin',
  label: 'Spin',
  emoji: '🎡',
  color: '#F59E0B'
}, {
  id: 'memory',
  label: 'Memory',
  emoji: '🃏',
  color: '#0284C7'
}, {
  id: 'health',
  label: 'Checkup',
  emoji: '🩺',
  color: '#2563EB'
}];

function AnimatedCounter({ target }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    let start = 0;
    const duration = 1100;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{count.toLocaleString('en-IN')}</span>;
}

function HealthScoreGauge({ score }) {
  const radius = 90;
  const circumference = Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const grade = score >= 75 ? 'Healthy Wealth 💪' : score >= 50 ? 'Moderate Zone 🤔' : 'Critical Zone 🏥';
  const gradeColor = score >= 75 ? '#059669' : score >= 50 ? '#D97706' : '#DC2626';
  const gradeBg = score >= 75 ? '#ECFDF5' : score >= 50 ? '#FFFBEB' : '#FEF2F2';
  const gradeBorder = score >= 75 ? '#A7F3D0' : score >= 50 ? '#FDE68A' : '#FECACA';

  return (
    <div className="relative flex flex-col items-center justify-center p-2">
      <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
        Health Score
      </span>
      <div className="relative flex items-center justify-center">
        <svg width="220" height="130" viewBox="0 0 220 130" className="overflow-visible">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#DC2626" />
              <stop offset="45%" stopColor="#F59E0B" />
              <stop offset="85%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            <filter id="gaugeGlow">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Background Track */}
          <path
            d={`M 20 120 A ${radius} ${radius} 0 0 1 200 120`}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="16"
            strokeLinecap="round"
          />
          {/* Animated Fill Arc */}
          <motion.path
            d={`M 20 120 A ${radius} ${radius} 0 0 1 200 120`}
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="16"
            strokeLinecap="round"
            filter="url(#gaugeGlow)"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute top-[56px] flex flex-col items-center">
          <motion.span
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="font-display text-4xl sm:text-5xl font-extrabold text-slate-900 leading-none tabular-nums"
          >
            <AnimatedCounter target={score} />
          </motion.span>
        </div>
      </div>
      <div
        className="mt-1 px-4 py-1.5 rounded-full border text-xs font-extrabold flex items-center gap-1.5 shadow-sm"
        style={{
          backgroundColor: gradeBg,
          borderColor: gradeBorder,
          color: gradeColor
        }}
      >
        <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: gradeColor }} />
        {grade}
      </div>
    </div>
  );
}

function StatCard({ emoji, label, value, accent, sub, children, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45 }}
      whileHover={{ y: -3 }}
      className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md transition-all relative overflow-hidden group"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            {label}
          </p>
          <p className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 leading-none tabular-nums">
            {value}
          </p>
          {sub && (
            <p className="text-[10px] font-bold mt-1.5" style={{ color: accent }}>
              {sub}
            </p>
          )}
        </div>
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl bg-slate-50 border border-slate-200/80 shadow-sm group-hover:scale-110 transition-transform">
          {emoji}
        </div>
      </div>
      {children && <div className="relative mt-3">{children}</div>}
    </motion.div>
  );
}

function ModuleCard({ mod, index, isUnlocked, onClick }) {
  const cardCount = getAllCardsForModule(mod.id).length;
  const { moduleProgress, completedModules } = useAppStore();
  const isCompleted = completedModules.includes(mod.id);
  const progressPercent = isCompleted ? 100 : Math.min(100, Math.floor(((moduleProgress[mod.id] || 0) / Math.max(cardCount - 1, 1)) * 100));

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      whileHover={isUnlocked ? {
        y: -5,
        boxShadow: `0 16px 32px rgba(0, 0, 0, 0.06)`,
        borderColor: `${mod.color}80`
      } : undefined}
      className={`relative group cursor-pointer rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between h-full ${
        isUnlocked
          ? isCompleted
            ? 'bg-gradient-to-b from-emerald-50/40 to-white border-emerald-200 shadow-sm'
            : 'bg-white border-slate-200/90 shadow-sm hover:border-emerald-300'
          : 'bg-slate-50/80 border-slate-200/60 opacity-65 cursor-not-allowed'
      } overflow-hidden`}
      onClick={isUnlocked ? onClick : undefined}
    >
      <div className="flex flex-col h-full relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="relative">
            {isUnlocked && (
              <svg className="absolute -inset-2 w-[calc(100%+16px)] h-[calc(100%+16px)] -rotate-90">
                <circle cx="50%" cy="50%" r="44%" fill="none" stroke="#E5E7EB" strokeWidth="2" />
                <motion.circle
                  cx="50%"
                  cy="50%"
                  r="44%"
                  fill="none"
                  stroke={isCompleted ? "#059669" : mod.color}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: progressPercent / 100 }}
                  transition={{ duration: 1.2, delay: 0.2 }}
                />
              </svg>
            )}
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all duration-300 relative z-10 ${
                isUnlocked
                  ? 'bg-white border border-slate-200 group-hover:scale-105 shadow-sm'
                  : 'bg-slate-100 border border-slate-200 text-slate-400'
              }`}
            >
              {isUnlocked ? mod.emoji : <Lock size={16} className="text-slate-400" />}
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {isCompleted && (
              <div className="px-2.5 py-1 rounded-full bg-emerald-100/70 border border-emerald-300 flex items-center gap-1 shadow-sm">
                <CheckCircle2 size={11} className="text-emerald-700" />
                <span className="text-[9px] font-black text-emerald-800 uppercase tracking-wider">Completed</span>
              </div>
            )}
            {isUnlocked && !isCompleted && progressPercent > 0 && (
              <div className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 flex items-center gap-1">
                <span className="text-[9px] font-black text-amber-700 uppercase tracking-wider tabular-nums">{progressPercent}%</span>
              </div>
            )}
            {!isUnlocked && (
              <div className="px-2 py-0.5 rounded-full bg-slate-200/70 border border-slate-300 text-[9px] font-bold text-slate-600">
                Locked
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 mt-1">
          <span className="text-[9px] font-black tracking-widest uppercase mb-1 block text-emerald-700">
            Module {mod.id}
          </span>
          <h3 className={`font-display font-extrabold text-lg leading-snug mb-2 transition-colors duration-300 ${isUnlocked ? 'text-slate-900 group-hover:text-blue-700' : 'text-slate-400'}`}>
            {mod.title}
          </h3>
          <p className={`text-[12px] leading-relaxed line-clamp-3 transition-colors duration-300 ${isUnlocked ? 'text-slate-600 group-hover:text-slate-800' : 'text-slate-400'}`}>
            {mod.description}
          </p>
        </div>
        <div className={`mt-5 pt-4 border-t flex items-center justify-between transition-colors duration-300 ${isUnlocked ? 'border-slate-100 group-hover:border-slate-200' : 'border-slate-100'}`}>
          <div className="flex items-center gap-3.5 text-[11px] font-semibold text-slate-500">
            <span className="flex items-center gap-1.5 hover:text-slate-700 transition-colors">
              <BookOpen size={11} className="text-slate-400" /> {cardCount} Cards
            </span>
            <span className="flex items-center gap-1.5 hover:text-slate-700 transition-colors">
              <Clock size={11} className="text-slate-400" /> {cardCount * 2} min
            </span>
          </div>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${isUnlocked ? 'bg-slate-50 border border-slate-200 group-hover:bg-blue-50' : ''}`}>
            {isUnlocked ? (
              <ChevronRight size={16} className="text-slate-500 group-hover:text-blue-600 transition-colors" />
            ) : (
              <Lock size={14} className="text-slate-400" />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Goals Section Component ──────────────────────────────────────
function GoalsSection({ router }) {
  const { goals, goalTarget, goalSaved } = useAppStore();
  
  const activeGoals = goals.filter(g => g.saved < g.target).slice(0, 3);
  const totalSaved = goals.reduce((acc, g) => acc + g.saved, 0);
  const totalTarget = goals.reduce((acc, g) => acc + g.target, 0);
  const progress = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
          <Target size={18} className="text-blue-600" /> Your Goals
        </h2>
        <button
          onClick={() => router.push('/home/goals')}
          className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
        >
          View All <ChevronRight size={14} />
        </button>
      </div>

      {goals.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative overflow-hidden rounded-2xl border border-blue-200 bg-blue-50/40 p-6 text-center shadow-sm"
        >
          <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Set Your First Goal!</h3>
            <p className="text-xs text-slate-600 mb-4">Set financial goals and achieve them with an AI-powered roadmap</p>
            <button
              onClick={() => router.push('/home/goals')}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider inline-flex items-center gap-2 shadow-sm transition-all"
            >
              <Rocket size={14} />
              Create Goal
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {/* Overall Progress */}
          {goals.length > 1 && (
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Total Progress</span>
                <span className="text-xs font-bold text-blue-600">{progress}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                />
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] text-slate-500">₹{totalSaved.toLocaleString('en-IN')} saved</span>
                <span className="text-[10px] text-slate-500">₹{totalTarget.toLocaleString('en-IN')} target</span>
              </div>
            </div>
          )}

          {/* Active Goals Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {activeGoals.map((goal, i) => {
              const pct = Math.min(100, Math.round((goal.saved / goal.target) * 100));
              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  onClick={() => router.push('/home/goals')}
                  className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-300 shadow-sm cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-blue-50 border border-blue-200"
                    >
                      {goal.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{goal.name}</h4>
                      <span className="text-[10px] text-slate-500">₹{goal.target.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: 0.6 + i * 0.1 }}
                        className="h-full rounded-full bg-blue-600"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-slate-500">₹{goal.saved.toLocaleString('en-IN')} saved</span>
                      <span className="text-[9px] font-bold text-blue-600">{pct}%</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* View Roadmap Button */}
          {activeGoals.length > 0 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/home/goals')}
              className="w-full py-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors"
            >
              <TrendingUp size={14} />
              View AI Roadmap for Your Goals
            </motion.button>
          )}
        </div>
      )}
    </motion.div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const {
    user,
    coins,
    streak,
    completedModules,
    moduleProgress,
    badges,
    xp,
    level
  } = useAppStore();

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);


  useEffect(() => {
    const qInterval = setInterval(() => {
      setCurrentQuoteIndex(prev => (prev + 1) % QUOTES.length);
    }, 5000);
    return () => clearInterval(qInterval);
  }, []);

  const totalCards = modules.reduce((acc, m) => acc + getAllCardsForModule(m.id).length, 0);
  const completedCards = Object.values(moduleProgress).reduce((a, b) => a + b, 0);
  const overallProgress = totalCards ? Math.min(100, Math.round((completedCards / totalCards) * 100)) : 0;

  const healthScore = Math.min(100, Math.round(
    (completedModules.length / modules.length) * 45 +
    (overallProgress / 100) * 30 +
    (coins / 1000) * 15 +
    (streak / 30) * 10
  ));

  const openToolDialog = (toolId) => {
    router.push(`/home/dashboard?tool=${toolId}`);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto text-left">
      {/* Ticker marquee — sleek & non-intrusive */}
      <div className="w-full bg-emerald-50/50 border border-emerald-200/60 py-2 px-4 overflow-hidden whitespace-nowrap rounded-xl mb-2">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="flex gap-16 items-center"
        >
          {[...QUOTES, ...QUOTES].map((q, i) => (
            <span key={i} className="text-[11px] font-semibold text-emerald-900 tracking-wide flex items-center gap-2">
              <Zap size={11} fill="#059669" className="text-emerald-600" /> {q}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Hero Greeting Panel */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-emerald-500/[0.04] blur-3xl pointer-events-none" />
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 z-10">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800">
                Understand Money, Secure Your Future
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">
              Ready to Compound, {user?.displayName?.split(' ')[0] ?? 'Champion'}! 🔥
            </h1>
            <AnimatePresence mode="wait">
              <motion.p
                key={currentQuoteIndex}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="text-sm text-slate-600 font-medium max-w-xl leading-relaxed"
              >
                "{QUOTES[currentQuoteIndex]}"
              </motion.p>
            </AnimatePresence>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50/90 border border-slate-200 flex-shrink-0 shadow-sm">
            <HealthScoreGauge score={healthScore} />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          delay={0.05}
          emoji={
            <div className="coin-spin-3d w-10 h-10 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-yellow-600 flex items-center justify-center shadow-md border border-amber-400/30">
              <IndianRupee size={20} className="text-white font-extrabold" />
            </div>
          }
          label="Total Coins"
          value={<AnimatedCounter target={coins} />}
          accent="#FFB800"
          sub={coins >= 500 ? 'Compounding King 💰' : 'Earn with each card! 🚀'}
        />
        <StatCard
          delay={0.12}
          emoji={<span>🔥</span>}
          label="Streak"
          value={`${streak} days`}
          accent="#FF6B4A"
          sub={streak > 0 ? 'Consistency unlocked! 💪' : 'Start your streak!'}
        />
        <StatCard
          delay={0.19}
          emoji={<span>📚</span>}
          label="Modules"
          value={`${completedModules.length}/${modules.length}`}
          accent="#2563EB"
          sub={`${overallProgress}% overall`}
        />
        <StatCard
          delay={0.26}
          emoji={<span>🏆</span>}
          label="Badges"
          value={badges.length}
          accent="#4F46E5"
          sub={badges.length > 0 ? 'Trophy showcase unlocked ⭐' : 'Earn your first badge!'}
        />
      </div>

      {/* Continue Learning Spot */}
      {(() => {
        const activeModuleIndex = modules.findIndex(m => !completedModules.includes(m.id));
        const activeModule = activeModuleIndex >= 0 ? modules[activeModuleIndex] : null;
        const activeCardCount = activeModule ? getAllCardsForModule(activeModule.id).length : 0;
        const activeProgress = activeModule ? Math.min(100, Math.round(((moduleProgress[activeModule.id] || 0) / Math.max(activeCardCount - 1, 1)) * 100)) : 0;

        if (!activeModule) return null;

        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative overflow-hidden rounded-2xl border border-emerald-200/80 bg-white p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
          >
            <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full blur-3xl opacity-10" style={{ backgroundColor: activeModule.color }} />
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4 z-10">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-sm bg-emerald-50 border border-emerald-200"
              >
                {activeModule.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-1">
                  Continue Learning
                </p>
                <h3 className="font-display text-lg font-bold text-slate-900 mb-1.5 truncate">
                  {activeModule.title}
                </h3>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden max-w-xs">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${activeProgress}%` }}
                      transition={{ duration: 1, delay: 0.4 }}
                      className="h-full rounded-full bg-emerald-600"
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-700 tabular-nums">{activeProgress}%</span>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push(`/dashboard/module/${activeModule.id}`)}
                className="rounded-xl px-5 py-3 font-extrabold text-xs uppercase tracking-wider text-white bg-emerald-700 hover:bg-emerald-800 shadow-sm whitespace-nowrap flex items-center gap-2 cursor-pointer transition-all"
              >
                Keep Going <ArrowRight size={15} />
              </motion.button>
            </div>
          </motion.div>
        );
      })()}

      {/* Quick Access Tools */}
      <div className="space-y-3">
        <h2 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
          <Zap size={18} className="text-amber-500" /> Quick Utilities
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 sm:gap-3">
          {QUICK_TOOLS.map((tool, i) => (
            <motion.button
              key={tool.id}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35 + i * 0.03 }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                if (['goals', 'expense', 'savings', 'quiz', 'spin'].includes(tool.id)) {
                  openToolDialog(tool.id);
                } else {
                  router.push('/home/tools');
                }
              }}
              className="bg-white rounded-2xl p-3 sm:p-4 flex flex-col items-center gap-2 group cursor-pointer border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-emerald-300 w-full transition-all"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110 bg-slate-50 border border-slate-100"
              >
                {tool.emoji}
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-slate-800">
                {tool.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Your Goals Section */}
      <GoalsSection router={router} />


      {/* Financial Journey Map */}
      <div className="space-y-4 pt-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-extrabold text-slate-900 tracking-tight">
              Financial Journey Map 🗺️
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              Step-by-step personal finance for youth. Complete each module to unlock the next milestone! 🚀
            </p>
          </div>
          <div className="px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm flex items-center gap-2 w-fit">
            <div className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider tabular-nums">
              {completedModules.length} of {modules.length} Modules Conquered
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod, i) => {
            const isUnlocked = i === 0 || completedModules.includes(modules[i - 1]?.id);
            return (
              <ModuleCard
                key={mod.id}
                mod={mod}
                index={i}
                isUnlocked={isUnlocked}
                onClick={() => router.push(`/dashboard/module/${mod.id}`)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, LayoutDashboard, Star, Flame, Trophy, Coins, 
  CheckCircle2, Lock, BookOpen, Target, ArrowRight, 
  TrendingUp, Award, Calendar, Zap, Footprints, MapPin, 
  Sword, Crown, DoorOpen, Bird, PiggyBank, Construction, Clock 
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { useAppStore } from '@/lib/store/useAppStore';
import { useProgress } from '@/lib/hooks/useProgress';
import { strategies } from '@/lib/data/strategies';
import { modules } from '@/lib/data/modules';

const BADGES = [
  { id: 'first-login', name: 'First Step', description: 'Welcome to the app!', Icon: Footprints, color: '#f59e0b' },
  { id: 'three-modules', name: 'Teertha Yatri', description: 'Completed 3 modules!', Icon: MapPin, color: '#22c55e' },
  { id: 'six-modules', name: 'Arthi Yoddha', description: 'Completed 6 modules!', Icon: Sword, color: '#3b82f6' },
  { id: 'all-modules', name: 'Finance Guru', description: 'All 11 modules complete!', Icon: Crown, color: '#f59e0b' },
  { id: 'perfect-quiz', name: 'Quiz Master', description: '100% score on a quiz!', Icon: Award, color: '#a855f7' },
  { id: 'streak-3', name: 'Consistent', description: '3 day streak!', Icon: Flame, color: '#ef4444' },
  { id: 'streak-7', name: 'On Fire!', description: '7 day streak!', Icon: Zap, color: '#f97316' },
  { id: 'coins-100', name: 'Savings Start', description: 'Earned 100 coins!', Icon: PiggyBank, color: '#14b8a6' },
  { id: 'coins-500', name: 'Coin Collector', description: 'Earned 500 coins!', Icon: Trophy, color: '#f59e0b' },
  { id: 'swipe-master', name: 'Budget Pro', description: '80%+ accuracy in Budget Game!', Icon: Target, color: '#22c55e' },
  { id: 'debt-escape', name: 'Debt Free', description: 'Opened all doors in Debt Trap!', Icon: DoorOpen, color: '#6366f1' },
  { id: 'early-bird', name: 'Early Bird', description: 'Started investing from age 20!', Icon: Bird, color: '#06b6d4' }
];

function getIcon(iconName) {
  if (!iconName) return Construction;
  const Icon = LucideIcons[iconName];
  return Icon || Construction;
}

function getLevel(completed) {
  if (completed >= 11) return { level: 5, label: 'Master', color: '#f59e0b' };
  if (completed >= 8) return { level: 4, label: 'Expert', color: '#22c55e' };
  if (completed >= 5) return { level: 3, label: 'Pro', color: '#3b82f6' };
  if (completed >= 2) return { level: 2, label: 'Learner', color: '#a855f7' };
  return { level: 1, label: 'Beginner', color: '#8888a0' };
}

function getGrade(score) {
  if (score >= 90) return { grade: 'A+', color: '#22c55e' };
  if (score >= 80) return { grade: 'A', color: '#4ade80' };
  if (score >= 70) return { grade: 'B', color: '#f59e0b' };
  if (score >= 60) return { grade: 'C', color: '#f97316' };
  return { grade: 'D', color: '#ef4444' };
}

function getMotivationalMessage(completed, score) {
  if (completed === 0) return 'Start your journey — every great path begins with a single step! 💪';
  if (completed <= 3) return 'Great start! A little more effort and your financial understanding will grow stronger! 🔥';
  if (completed <= 6) return 'You\'re halfway there — don\'t turn back, keep moving forward! 🚀';
  if (completed <= 9) return 'Outstanding progress! The finish line is in sight! 🏆';
  if (completed <= 10) return 'Just one more module — you\'re almost a Finance Guru! 🎯';
  return 'You are a true Finance Guru! Now share your knowledge and help others! 👑';
}

function useAnimatedCounter(target, duration = 1000, delay = 0) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      const startTime = Date.now();
      const step = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(timeout);
  }, [target, duration, delay]);
  return count;
}

function ConfettiParticles({ active }) {
  if (!active) return null;
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 1.5 + Math.random(),
    color: ['#f59e0b', '#22c55e', '#ef4444', '#3b82f6', '#a855f7', '#ec4899'][Math.floor(Math.random() * 6)],
    size: 4 + Math.random() * 6
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-sm"
          style={{
            left: `${p.x}%`,
            top: '-5%',
            width: p.size,
            height: p.size,
            backgroundColor: p.color
          }}
          initial={{ y: 0, opacity: 1, rotate: 0 }}
          animate={{ y: '120vh', opacity: 0, rotate: 360 + Math.random() * 360 }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}

function MiniProgressRing({ progress, size = 36, color = '#f59e0b', strokeWidth = 3 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, progress)) / 100) * circumference;

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth={strokeWidth} />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
      />
    </svg>
  );
}

function DashboardSection({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: 'easeOut' }}
      className={`bg-white border border-slate-200/90 shadow-2xs p-5 rounded-3xl ${className}`}
    >
      {children}
    </motion.div>
  );
}

function SectionTitle({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
        <Icon className="w-4 h-4 text-amber-600" />
      </div>
      <div>
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 leading-none">{title}</h3>
        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

function FinancialJourneySVG({ modules: mods, completedModules: completed, moduleProgress: progress, moduleCompletionDates: dates }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const nodeSpacing = 56;
  const totalHeight = mods.length * nodeSpacing;
  const nodeRadius = 8;
  const lineX = 24;
  const cardStartX = 52;

  return (
    <div className="max-h-[400px] overflow-y-auto custom-scroll p-1 border border-slate-200/90 rounded-2xl bg-slate-50">
      <svg width="100%" viewBox={`0 0 320 ${totalHeight + 16}`} className="w-full" style={{ minWidth: 280 }}>
        <defs>
          <linearGradient id="timeline-gradient-completed" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#059669" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="timeline-gradient-incomplete" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#CBD5E1" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#E2E8F0" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {mods.map((mod, index) => {
          const y = 8 + index * nodeSpacing + nodeRadius;
          const isCompleted = completed?.includes(mod.id);
          const modProgress = progress?.[mod.id] || 0;
          const isCurrent = !isCompleted && modProgress > 0;
          const nextY = index < mods.length - 1 ? 8 + (index + 1) * nodeSpacing + nodeRadius : null;
          const lineAnimated = animated ? 1 : 0;

          return (
            <g key={mod.id}>
              {nextY !== null && (
                <motion.line
                  x1={lineX}
                  y1={y + nodeRadius}
                  x2={lineX}
                  y2={nextY - nodeRadius}
                  stroke={isCompleted ? 'url(#timeline-gradient-completed)' : 'url(#timeline-gradient-incomplete)'}
                  strokeWidth={2}
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: lineAnimated, opacity: lineAnimated }}
                  transition={{ duration: 0.4, delay: 0.1 + index * 0.05, ease: 'easeOut' }}
                />
              )}

              {isCompleted && (
                <circle cx={lineX} cy={y} r={nodeRadius + 4} fill="none" stroke="#059669" strokeWidth={1} opacity={0.2} />
              )}

              {isCurrent && (
                <circle cx={lineX} cy={y} r={nodeRadius + 6} fill="none" stroke="#f59e0b" strokeWidth={1.5} opacity={0.4} className="animate-ping" />
              )}

              <circle
                cx={lineX}
                cy={y}
                r={nodeRadius}
                fill={isCompleted ? '#059669' : isCurrent ? '#f59e0b' : '#F1F5F9'}
                stroke={isCompleted ? '#059669' : isCurrent ? '#f59e0b' : '#CBD5E1'}
                strokeWidth={isCompleted || isCurrent ? 2 : 1}
              />

              {isCompleted && (
                <path
                  d={`M${lineX - 3.5} ${y} L${lineX - 1} ${y + 3} L${lineX + 4} ${y - 3}`}
                  fill="none"
                  stroke="white"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              <g>
                <rect
                  x={cardStartX}
                  y={y - 14}
                  width={248}
                  height={28}
                  rx={8}
                  fill={isCompleted ? '#ECFDF5' : isCurrent ? '#FFFBEB' : '#FFFFFF'}
                  stroke={isCompleted ? '#A7F3D0' : isCurrent ? '#FDE68A' : '#E2E8F0'}
                  strokeWidth={1}
                />
                <text
                  x={cardStartX + 10}
                  y={y + 3}
                  fill={isCompleted ? '#047857' : isCurrent ? '#B45309' : '#475569'}
                  fontSize={9}
                  fontWeight="bold"
                  fontFamily="system-ui"
                >
                  {mod.title}
                </text>
                {isCompleted && dates?.[mod.id] && (
                  <text
                    x={cardStartX + 238}
                    y={y + 3}
                    textAnchor="end"
                    fill="#059669"
                    fontSize={8}
                    fontFamily="system-ui"
                    opacity={0.8}
                  >
                    {new Date(dates[mod.id]).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </text>
                )}
                {isCurrent && (
                  <text
                    x={cardStartX + 238}
                    y={y + 3}
                    textAnchor="end"
                    fill="#D97706"
                    fontSize={8}
                    fontFamily="system-ui"
                    opacity={0.8}
                  >
                    {modProgress}%
                  </text>
                )}
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function ProgressForecast({ modulesCompleted, moduleCompletionDates }) {
  const forecast = useMemo(() => {
    if (modulesCompleted === 0) {
      return 'Complete your first module to calculate your pace! Let\'s go! 🚀';
    }
    if (modulesCompleted >= 11) {
      return 'You\'ve completed all modules! 🎉 You\'re the guru now — teach others!';
    }

    const dates = Object.values(moduleCompletionDates || {}).sort();
    if (dates.length < 2) {
      const remaining = 11 - modulesCompleted;
      return `First module done! At one module per day, you\'ll finish in ~${remaining} days. Keep going! 💪`;
    }
    const firstDate = new Date(dates[0]);
    const lastDate = new Date(dates[dates.length - 1]);
    const daysDiff = Math.max(1, Math.ceil((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)));
    const modulesInPeriod = dates.length;
    const daysPerModule = daysDiff / modulesInPeriod;
    const remaining = 11 - modulesCompleted;
    const estimatedDaysLeft = Math.ceil(remaining * daysPerModule);
    const estimatedDate = new Date(Date.now() + estimatedDaysLeft * 24 * 60 * 60 * 1000);
    const formattedDate = estimatedDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    return `Tumhari current pace se, saare modules ${formattedDate} tak complete ho jayenge! (${estimatedDaysLeft} din lagenge) 📅`;
  }, [modulesCompleted, moduleCompletionDates]);

  return (
    <div className="mt-4 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-4 space-y-2">
      <div className="flex items-center gap-2">
        <TrendingUp size={14} className="text-emerald-700" />
        <span className="text-[10px] font-black text-slate-900 uppercase tracking-wider">Progress Forecast</span>
      </div>
      <p className="text-xs text-slate-600 font-semibold leading-relaxed">
        {forecast}
      </p>
    </div>
  );
}

export default function AchievementDashboard({ open, onClose }) {
  const {
    completedModules,
    moduleProgress,
    moduleCompletionDates,
    quizScores,
    coins,
    streak,
    badges,
    userName,
    masteredTerms,
    swipeScore,
    swipeTotal,
    debtDoorLevel,
    setActiveStrategy
  } = useAppStore();

  const {
    modulesCompleted,
    completionPercentage,
    getModuleProgress,
    isModuleCompleted,
    getQuizAverage
  } = useProgress();

  const [showConfetti, setShowConfetti] = useState(false);

  const level = useMemo(() => getLevel(modulesCompleted), [modulesCompleted]);
  const displayName = userName || 'Learner';
  const quizScoreValues = useMemo(() => Object.values(quizScores || {}), [quizScores]);
  const quizAttempts = quizScoreValues.length;
  const avgQuizScore = getQuizAverage();
  const bestQuizScore = quizScoreValues.length > 0 ? Math.max(...quizScoreValues) : 0;

  const flScore = useMemo(() => {
    const moduleBase = Math.min((completedModules || []).length * 5, 55);
    const quizBonus = Math.min(avgQuizScore / 10, 10);
    const termsBonus = Math.min((masteredTerms || []).length * 0.5, 15);
    const activityBonus = Math.min(streak * 2 + coins / 50, 20);
    return Math.min(Math.round(moduleBase + quizBonus + termsBonus + activityBonus), 100);
  }, [completedModules, avgQuizScore, masteredTerms, streak, coins]);

  const gradeInfo = useMemo(() => getGrade(flScore), [flScore]);

  const animatedFLScore = useAnimatedCounter(flScore, 1200, 600);
  const animatedCoins = useAnimatedCounter(coins, 800, 200);
  const animatedStreak = useAnimatedCounter(streak, 600, 300);
  const animatedModules = useAnimatedCounter(modulesCompleted, 800, 100);

  useEffect(() => {
    if (open && flScore >= 70) {
      const t = setTimeout(() => setShowConfetti(true), 800);
      return () => clearTimeout(t);
    } else {
      setShowConfetti(false);
    }
  }, [open, flScore]);

  const daysActive = useMemo(() => {
    return Math.max(streak, (completedModules || []).length) + Math.floor(coins / 30);
  }, [streak, completedModules, coins]);

  const estimatedTimeLeft = useMemo(() => {
    const remaining = 11 - (completedModules || []).length;
    if (remaining === 0) return 'Complete! 🎉';
    if (remaining <= 3) return `~${remaining * 2} Hrs left`;
    if (remaining <= 6) return `~${remaining * 2} Hrs left`;
    return `~${Math.ceil(remaining * 1.5)} Days left`;
  }, [completedModules]);

  const quizChartData = useMemo(() => {
    return quizScoreValues.map((score, i) => ({
      name: `Q${i + 1}`,
      score
    }));
  }, [quizScoreValues]);

  const nextSteps = useMemo(() => {
    const steps = [];
    const incompleteModule = modules.find(m => !isModuleCompleted(m.id));
    if (incompleteModule) {
      let relatedStrategy = strategies.find(s => {
        if (incompleteModule.id <= 3 && s.id === 1) return true;
        if (incompleteModule.id === 4 && s.id === 4) return true;
        if (incompleteModule.id === 5 && s.id === 5) return true;
        if (incompleteModule.id === 6 && s.id === 6) return true;
        if (incompleteModule.id === 7 && s.id === 7) return true;
        if (incompleteModule.id === 8 && s.id === 8) return true;
        if (incompleteModule.id === 9 && s.id === 9) return true;
        if (incompleteModule.id === 10 && s.id === 10) return true;
        if (incompleteModule.id === 11 && s.id === 11) return true;
        return false;
      }) || strategies[0];

      steps.push({
        label: `Complete Module: ${incompleteModule.title}`,
        action: 'Learn →',
        strategyId: relatedStrategy.id,
        color: incompleteModule.color
      });
    }

    if (quizAttempts < 3) {
      steps.push({
        label: 'Play quizzes and upgrade your scores!',
        action: 'Quiz Arena →',
        strategyId: 1,
        color: '#a855f7'
      });
    }

    if ((masteredTerms || []).length < 10) {
      steps.push({
        label: 'Read the financial dictionary glossary!',
        action: 'Glossary →',
        strategyId: 10,
        color: '#6366f1'
      });
    }

    return steps.slice(0, 3);
  }, [isModuleCompleted, quizAttempts, masteredTerms, swipeTotal]);

  const handleNavigate = useCallback((strategyId) => {
    if (typeof setActiveStrategy === 'function') {
      setActiveStrategy(strategyId);
    }
    onClose();
  }, [setActiveStrategy, onClose]);

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
        className="relative z-10 w-full max-w-4xl bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <ConfettiParticles active={showConfetti} />

        {/* Header */}
        <div className="shrink-0 px-6 py-4 border-b border-slate-100 bg-slate-50/80 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <LayoutDashboard size={20} className="text-amber-600" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">Achievement Board 📊</h2>
              <p className="text-[10px] text-slate-500">Complete review of your learning milestones</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-all focus:outline-none"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scroll">
          
          {/* User profile section */}
          <DashboardSection className="relative overflow-hidden bg-gradient-to-r from-emerald-50/50 via-white to-amber-50/40">
            <div className="relative z-[1] flex flex-col sm:flex-row items-center gap-5">
              <div className="relative">
                <div 
                  className="w-20 h-20 rounded-3xl flex items-center justify-center text-3xl font-black shadow-sm"
                  style={{
                    background: `linear-gradient(135deg, ${level.color}20, ${level.color}05)`,
                    border: `2px solid ${level.color}50`
                  }}
                >
                  <span style={{ color: level.color }}>{level.level}</span>
                </div>
                <div 
                  className="absolute -bottom-1 -right-1 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg border shadow-xs"
                  style={{
                    backgroundColor: '#FFFFFF',
                    color: level.color,
                    borderColor: `${level.color}50`
                  }}
                >
                  {level.label}
                </div>
              </div>

              <div className="text-center sm:text-left flex-1 space-y-1">
                <h2 className="text-2xl font-black text-slate-900">
                  Hello, <span className="text-emerald-700">{displayName}</span>! 👋
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                  {getMotivationalMessage(modulesCompleted, flScore)}
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-2">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-black">
                    <Coins size={12} className="text-amber-600" /> {animatedCoins} XP
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-orange-50 border border-orange-200 text-orange-800 text-xs font-black animate-pulse">
                    <Flame size={12} className="text-orange-600" /> {animatedStreak} Streak
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-black">
                    <Calendar size={12} className="text-blue-600" /> {daysActive} Days
                  </div>
                </div>
              </div>
            </div>
          </DashboardSection>

          {/* Progress Overview & Ring details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DashboardSection className="flex flex-col sm:flex-row items-center gap-5 justify-between">
              <div className="relative shrink-0 flex items-center justify-center">
                <MiniProgressRing progress={completionPercentage} size={110} strokeWidth={8} color="#059669" />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-black text-slate-900">{animatedModules}</span>
                  <span className="text-[9px] text-slate-500 font-bold uppercase">/ 11 Modules</span>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-2 gap-2.5 w-full">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90">
                  <span className="text-[9px] text-slate-500 font-black uppercase tracking-wider block">Completeness</span>
                  <span className="text-sm font-black text-slate-900 block mt-0.5">{completionPercentage}%</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90">
                  <span className="text-[9px] text-slate-500 font-black uppercase tracking-wider block">Words Mastered</span>
                  <span className="text-sm font-black text-indigo-700 block mt-0.5">{(masteredTerms || []).length}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90">
                  <span className="text-[9px] text-slate-500 font-black uppercase tracking-wider block">Quiz Average</span>
                  <span className="text-sm font-black text-purple-700 block mt-0.5">{avgQuizScore}%</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90">
                  <span className="text-[9px] text-slate-500 font-black uppercase tracking-wider block">Time Est</span>
                  <span className="text-[10px] font-black text-blue-700 block mt-1 truncate">{estimatedTimeLeft}</span>
                </div>
              </div>
            </DashboardSection>

            {/* Quiz Performance bar chart */}
            <DashboardSection className="flex flex-col justify-between">
              <SectionTitle icon={Target} title="Quiz Scores" subtitle="Accuracy log per attempt" />
              
              {quizChartData.length > 0 ? (
                <div className="h-28 w-full mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={quizChartData}>
                      <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 9 }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fill: '#64748B', fontSize: 8 }} axisLine={false} tickLine={false} width={20} />
                      <Bar dataKey="score" radius={[4, 4, 0, 0]} maxBarSize={20}>
                        {quizChartData.map((entry, idx) => (
                          <Cell 
                            key={`cell-${idx}`} 
                            fill={entry.score >= 80 ? '#059669' : entry.score >= 55 ? '#F59E0B' : '#EF4444'} 
                            fillOpacity={0.9} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-6 text-slate-500 text-xs font-bold uppercase tracking-wider bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                  Attempt modules quizzes to populate charts!
                </div>
              )}
            </DashboardSection>
          </div>

          {/* Strategy Mastery Grid */}
          <DashboardSection>
            <SectionTitle icon={Star} title="Strategy Simulator Progress" subtitle="Milestones log across 11 simulations" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {strategies.map((st, idx) => {
                const Icon = getIcon(st.icon);
                const related = st.id <= 9 ? [st.id] : [st.id];
                const progressVal = related.reduce((sum, mId) => sum + (moduleProgress?.[mId] || 0), 0) / related.length;

                return (
                  <motion.div
                    key={st.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNavigate(st.id)}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 hover:bg-slate-100/70 transition-all cursor-pointer space-y-2 flex flex-col justify-between shadow-2xs"
                  >
                    <div className="flex items-center gap-2">
                      <div className="relative shrink-0 flex items-center justify-center">
                        <MiniProgressRing progress={progressVal} size={30} strokeWidth={2.5} color={st.color} />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Icon size={12} style={{ color: st.color }} />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-wider truncate leading-tight">{st.title}</h4>
                        <span className="text-[8.5px] text-slate-500 font-bold block">{Math.round(progressVal)}% Done</span>
                      </div>
                    </div>

                    <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progressVal}%`, backgroundColor: st.color }} />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </DashboardSection>

          {/* Modules checklists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DashboardSection className="flex flex-col justify-between">
              <SectionTitle icon={BookOpen} title="Course Curriculum Progress" subtitle="Track progress of 11 theory units" />
              <div className="h-72 overflow-y-auto pr-1 space-y-2.5 custom-scroll">
                {modules.map((m, idx) => {
                  const Icon = getIcon(m.icon);
                  const completed = isModuleCompleted(m.id);
                  const progressVal = getModuleProgress(m.id);
                  const isCurrent = !completed && progressVal > 0;

                  return (
                    <div 
                      key={m.id} 
                      className={`p-3 rounded-2xl border flex items-center gap-3 justify-between ${
                        completed 
                          ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950' 
                          : isCurrent 
                            ? 'bg-amber-50/80 border-amber-200 animate-pulse text-amber-950' 
                            : 'bg-slate-50 border-slate-200/90'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                          completed 
                            ? 'bg-emerald-600 border-transparent text-white' 
                            : isCurrent 
                              ? 'bg-amber-500 border-transparent text-white' 
                              : 'bg-white border-slate-200 text-slate-400'
                        }`}>
                          {completed ? <CheckCircle2 size={14} /> : <Icon size={14} />}
                        </div>

                        <div className="min-w-0">
                          <span className={`text-[11px] font-black uppercase tracking-wider block truncate ${
                            completed ? 'text-emerald-800' : isCurrent ? 'text-amber-800' : 'text-slate-700'
                          }`}>{m.title}</span>
                          <span className="text-[8px] text-slate-500 font-bold block mt-0.5">theory module #{m.id}</span>
                        </div>
                      </div>

                      <span className="text-[10px] font-black text-slate-800 shrink-0 tabular-nums">
                        {progressVal}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </DashboardSection>

            {/* Financial Journey timeline map */}
            <DashboardSection className="flex flex-col justify-between">
              <SectionTitle icon={Clock} title="Learning Timeline Map" subtitle="Visual roadmap of completed modules" />
              <FinancialJourneySVG 
                modules={modules} 
                completedModules={completedModules} 
                moduleProgress={moduleProgress} 
                moduleCompletionDates={moduleCompletionDates} 
              />
            </DashboardSection>
          </div>

          {/* Badges showcase panel */}
          <DashboardSection>
            <SectionTitle icon={Trophy} title="Earned Badges Cabinet" subtitle={`${(badges || []).length} / ${BADGES.length} Badges Showcase`} />
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-600 rounded-full transition-all duration-300"
                style={{ width: `${((badges || []).length / BADGES.length) * 100}%` }}
              />
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {BADGES.map((b, idx) => {
                const earned = (badges || []).includes(b.id);
                return (
                  <div 
                    key={b.id} 
                    className={`p-2.5 rounded-2xl border text-center relative flex flex-col justify-between items-center transition-all ${
                      earned 
                        ? 'bg-slate-50 border-slate-200/90 hover:border-amber-400 shadow-2xs' 
                        : 'bg-slate-50/40 border-slate-200/50 opacity-40'
                    }`}
                  >
                    {earned && (
                      <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shadow-xs" />
                    )}

                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={earned ? { backgroundColor: `${b.color}20` } : {}}>
                      {earned ? (
                        <b.Icon size={14} style={{ color: b.color }} />
                      ) : (
                        <Lock size={12} className="text-slate-400" />
                      )}
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-wide truncate block mt-1.5 ${earned ? 'text-slate-800' : 'text-slate-400'}`}>{earned ? b.name : '???'}</span>
                  </div>
                );
              })}
            </div>
          </DashboardSection>

          {/* Active next steps */}
          <DashboardSection>
            <SectionTitle icon={ArrowRight} title="Aage Kya Karein? (Next Actions)" subtitle="AI recommended path forwards" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {nextSteps.length > 0 ? (
                nextSteps.map((st, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.02, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNavigate(st.strategyId)}
                    className="p-3.5 rounded-2xl border flex items-center justify-between bg-slate-50 border-slate-200/90 text-left hover:bg-slate-100/80 cursor-pointer shadow-2xs"
                  >
                    <div className="min-w-0 pr-4">
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">AI Suggested Task</p>
                      <p className="text-xs font-black text-slate-800 mt-1 leading-snug line-clamp-2">{st.label}</p>
                    </div>
                    <span className="px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-[9px] font-black uppercase shrink-0 transition-all shadow-xs">
                      {st.action}
                    </span>
                  </motion.button>
                ))
              ) : (
                <div className="col-span-3 text-center py-6 text-slate-500 font-bold uppercase tracking-wider">
                  🎉 Aapne curriculum ke saare steps achieve kar liye! Outstanding job.
                </div>
              )}
            </div>
          </DashboardSection>

          <ProgressForecast modulesCompleted={modulesCompleted} moduleCompletionDates={moduleCompletionDates} />
        </div>

        {/* Footer */}
        <div className="shrink-0 px-6 py-4 border-t border-slate-100 bg-slate-50/80 backdrop-blur-md flex items-center justify-center text-center">
          <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">
            Kamyabi Board — achievements sync across local storage and active sessions
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export { AchievementDashboard };
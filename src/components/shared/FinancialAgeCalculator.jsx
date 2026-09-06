'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Check, PartyPopper, ArrowRight, Sparkles, Share2 } from 'lucide-react';
import { useAppStore } from '@/lib/store/useAppStore';
import { toast } from '@/hooks/use-toast';

const QUESTIONS = [
  {
    id: 'salary',
    question: 'What did you do first with your first salary or pocket money?',
    emoji: '💸',
    category: 'Money Mindset',
    options: [
      { text: 'Spent it all on shopping! 🛍️', score: 1, emoji: '💸' },
      { text: 'Spent a little, put a little in the piggy bank 🐷', score: 2, emoji: '🤔' },
      { text: 'Saved half, spent the other half on outings 🎬', score: 3, emoji: '💰' },
      { text: 'Saved first, then treated myself 🎯', score: 4, emoji: '🎯' }
    ]
  },
  {
    id: 'budget',
    question: 'Do you make a monthly budget?',
    emoji: '📝',
    category: 'Budgeting',
    options: [
      { text: 'Budget? That\'s for grown-ups 😅', score: 1, emoji: '🤷' },
      { text: 'It\'s in my head, but I don\'t strictly follow it 🧠', score: 2, emoji: '📅' },
      { text: 'I track income and key expenses on a basic app/Excel ✅', score: 3, emoji: '✅' },
      { text: 'Detailed budget plan (50-30-20 rule) tracked every month! 📊', score: 4, emoji: '📊' }
    ]
  },
  {
    id: 'emergency',
    question: 'How much emergency backup fund do you have?',
    emoji: '🛡️',
    category: 'Safety Net',
    options: [
      { text: 'Absolutely nothing — would need to borrow from friends ❓', score: 1, emoji: '❓' },
      { text: 'Enough to cover 1–2 months of basic expenses 🌱', score: 2, emoji: '🌱' },
      { text: 'A standard 3–5 month backup ready 💪', score: 3, emoji: '💪' },
      { text: 'More than 6 months of secure liquid surplus ready! 🛡️', score: 4, emoji: '🛡️' }
    ]
  },
  {
    id: 'sip',
    question: 'Are any regular SIPs or mutual fund investments running?',
    emoji: '📈',
    category: 'Investing',
    options: [
      { text: 'Investment? I just started earning 🚫', score: 1, emoji: '🚫' },
      { text: 'Money just sits in FDs/Savings accounts 🏦', score: 2, emoji: '🏦' },
      { text: 'Tried small micro-investments or crypto/stocks 🌱', score: 3, emoji: '🌱' },
      { text: 'Regular SIP & equity diversified portfolio mapped! 🚀', score: 4, emoji: '🚀' }
    ]
  },
  {
    id: 'credit',
    question: 'If you use a credit card, how do you pay the bill?',
    emoji: '💳',
    category: 'Debt Management',
    options: [
      { text: 'I always pay Minimum Due — no stress 😬', score: 1, emoji: '😰' },
      { text: 'I pay a partial amount when I have extra money 🤷', score: 2, emoji: '🤷' },
      { text: 'I pay the full bill mostly on time ✅', score: 3, emoji: '✅' },
      { text: 'Always full auto-pay + zero delay track record! 🎯', score: 4, emoji: '🎯' }
    ]
  },
  {
    id: 'insurance',
    question: 'What is your health or life insurance status?',
    emoji: '🏥',
    category: 'Insurance Protection',
    options: [
      { text: 'Insurance? Nothing will happen to me, I\'m strong! 🚫', score: 1, emoji: '🚫' },
      { text: 'Relying on corporate or parents\' health cover 👨‍👩‍👦', score: 2, emoji: '👨‍👩‍👦' },
      { text: 'Yes, I have a basic independent cover 📋', score: 3, emoji: '📋' },
      { text: 'Optimal personal cover (Health + Term insurance) fully secured! 🛡️', score: 4, emoji: '🛡️' }
    ]
  },
  {
    id: 'spend',
    question: 'How much control do you have when you see an online sale?',
    emoji: '🛍️',
    category: 'Spending Habits',
    options: [
      { text: 'No control! "ADD TO CART" and swipe immediately! 😅', score: 1, emoji: '💸' },
      { text: 'I think about it but buy 80% of the time anyway 🛍️', score: 2, emoji: '🛍' },
      { text: 'I try to apply the 24-hour rule to control impulse buys ⏰', score: 3, emoji: '⏰' },
      { text: 'I evaluate needs, add to wishlist, and wait 📝', score: 4, emoji: '📝' }
    ]
  },
  {
    id: 'tax',
    question: 'How much do you know about ITR filings and tax-saving options?',
    emoji: '📋',
    category: 'Tax Awareness',
    options: [
      { text: 'My employer deducts tax — I have no idea 🤷', score: 1, emoji: '🤷' },
      { text: 'I only know about 80C with some LIC or PPF 📚', score: 2, emoji: '📚' },
      { text: 'I claim basic savings via ELSS mutual funds and NPS ✅', score: 3, emoji: '✅' },
      { text: 'I optimize complete deductions with proper planning! 📊', score: 4, emoji: '📊' }
    ]
  },
  {
    id: 'goal',
    question: 'Have you planned any dedicated money goals for the next 5 years?',
    emoji: '🎯',
    category: 'Goal Setting',
    options: [
      { text: 'Who worries about tomorrow, chill today! 😅', score: 1, emoji: '🤷' },
      { text: 'I know I want a car but savings aren\'t mapped 💭', score: 2, emoji: '💭' },
      { text: 'Approximate target set, some savings started 📝', score: 3, emoji: '📝' },
      { text: 'SMART goals (Home, Travel, Business) with monthly budget track! 🎯', score: 4, emoji: '🎯' }
    ]
  }
];

function getAgeResult(score) {
  // Score mapping: 9 (min) to 36 (max). Real Age mapped from 12 to 60.
  const age = Math.round(12 + ((score - 9) / 27) * 48);
  
  if (score >= 30) {
    return {
      age,
      label: 'Financial Guru 🧙‍♂️',
      color: '#2563eb',
      description: 'Excellent! You are mature in financial terms and planning, and are far ahead of your actual age!',
      tips: [
        'Diversify your portfolio into global indices or smart equity assets.',
        'Organise estate planning, nominees, and basic will documentation.',
        'Share saving and investment concepts with friends too!'
      ]
    };
  }
  if (score >= 22) {
    return {
      age,
      label: 'Money Smart 🎯',
      color: '#06B6D4',
      description: 'You\'re heading in the right direction! A few more minor fixes and you can become a fully mature money ninja.',
      tips: [
        'Expand your emergency surplus to a 6-month backup level.',
        'Step up your SIP amount by 10% with every annual income hike.',
        'Check the status of your life term cover.'
      ]
    };
  }
  if (score >= 14) {
    return {
      age,
      label: 'Financial Teenager 📚',
      color: '#F59E0B',
      description: 'You\'re in the learning stage. Basic savings are in place, but deep investments and discipline still need to be built.',
      tips: [
        'Set up an auto-invest of ₹1,000 as soon as your salary arrives each month.',
        'Start parking your emergency fund in a safe liquid bank account.',
        'Keep credit utilisation below 30% to protect your CIBIL score.'
      ]
    };
  }
  return {
    age,
    label: 'Financial Kid 👶',
    color: '#EF4444',
    description: 'Your financial literacy is just getting started. Don\'t worry — it\'s never too late to learn!',
    tips: [
      'Use a diary or tracker to record your daily spending.',
      'Build a short-term savings buffer instead of borrowing from friends.',
      'Refer to the basic modules in Money Matters regularly.'
    ]
  };
}

export default function FinancialAgeCalculator({ open, onClose }) {
  const { addCoins, addBadge } = useAppStore();
  const [gameState, setGameState] = useState('intro'); // intro | playing | reveal | result
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [revealedAge, setRevealedAge] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) {
      // Reset state on close
      setGameState('intro');
      setCurrentIdx(0);
      setAnswers([]);
      setRevealedAge(null);
    }
  }, [open]);

  const totalScore = useMemo(() => answers.reduce((s, v) => s + v, 0), [answers]);
  const result = useMemo(() => getAgeResult(totalScore), [totalScore]);

  const handleAnswer = useCallback((score) => {
    const nextAnswers = [...answers, score];
    setAnswers(nextAnswers);

    if (currentIdx + 1 < QUESTIONS.length) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setGameState('reveal');
      const finalScore = nextAnswers.reduce((a, b) => a + b, 0);
      const finalResult = getAgeResult(finalScore);

      setTimeout(() => {
        setRevealedAge(finalResult.age);
        setGameState('result');
        addCoins(20);
        addBadge('financial-age');
      }, 2500);
    }
  }, [answers, currentIdx, addCoins, addBadge]);

  const handleRestart = () => {
    setGameState('intro');
    setCurrentIdx(0);
    setAnswers([]);
    setRevealedAge(null);
  };

  const handleShare = () => {
    const text = `Mera Financial Age: ${revealedAge} saal hai! 🎂\nCategory: ${result.label}\n\nApna Ameer Meter status check karo Money Matters app par! 📈`;
    if (navigator.share) {
      navigator.share({ title: 'Ameer Meter Result', text }).catch(() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast({ title: "Result copied to clipboard! 📋" });
      });
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({ title: "Result copied to clipboard! 📋" });
    }
  };

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
        className="relative z-10 w-full max-w-md bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Effects */}
        <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-emerald-100/60 blur-[80px] pointer-events-none" />

        {/* Top Header */}
        <div className="shrink-0 px-6 py-4 border-b border-slate-100 bg-slate-50/70 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
              <Sparkles size={20} className="text-emerald-700" />
            </div>
            <div>
              <h2 className="font-display text-base font-extrabold text-slate-900">Ameer Meter 📈</h2>
              <p className="text-[11px] text-slate-500 font-medium">Financial Maturity Age Calculator</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-all cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content Box */}
        <div className="flex-1 overflow-y-auto p-6 custom-scroll bg-white">
          <AnimatePresence mode="wait">
            
            {/* INTRO SCREEN */}
            {gameState === 'intro' && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center space-y-6 py-4"
              >
                <div className="text-6xl animate-bounce">🎂</div>
                <div className="space-y-2">
                  <h3 className="font-display text-xl font-black text-slate-900">Aapki Asli Financial Age Kya Hai?</h3>
                  <p className="text-xs text-slate-600 px-6 leading-relaxed font-medium">
                    9 simple spending aur money management questions ka sach-sach jawab dein aur pata karein ki aapka money mindset kitna mature hai.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3">
                    <span className="text-xl block">⏱️</span>
                    <span className="text-[10px] text-slate-600 font-bold block mt-1">2 mins only</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3">
                    <span className="text-xl block">💎</span>
                    <span className="text-[10px] text-emerald-700 font-bold block mt-1">+20 Coins</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3">
                    <span className="text-xl block">💡</span>
                    <span className="text-[10px] text-slate-600 font-bold block mt-1">Custom tips</span>
                  </div>
                </div>

                <button
                  onClick={() => setGameState('playing')}
                  className="w-full py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-all active:scale-95"
                >
                  Start Ameer Meter Test <ArrowRight size={14} />
                </button>
              </motion.div>
            )}

            {/* QUESTIONS SCREEN */}
            {gameState === 'playing' && (
              <motion.div
                key="playing"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5 py-2"
              >
                {/* Progress bar */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest shrink-0">
                    Q: {currentIdx + 1}/{QUESTIONS.length}
                  </span>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-600 transition-all duration-300"
                      style={{ width: `${((currentIdx + 1) / QUESTIONS.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Category label */}
                <div className="text-center">
                  <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                    {QUESTIONS[currentIdx].category}
                  </span>
                </div>

                <h3 className="text-base font-black text-slate-900 text-center leading-snug px-2">
                  {QUESTIONS[currentIdx].question}
                </h3>

                {/* Options list */}
                <div className="space-y-2.5">
                  {QUESTIONS[currentIdx].options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswer(opt.score)}
                      className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-500 hover:bg-emerald-50/40 text-left flex items-start gap-3.5 transition-all group cursor-pointer shadow-xs"
                    >
                      <span className="text-lg bg-white border border-slate-200/80 p-1.5 rounded-lg shrink-0 group-hover:scale-105 transition-transform">
                        {opt.emoji}
                      </span>
                      <span className="text-xs font-semibold text-slate-800 leading-relaxed">
                        {opt.text}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* REVEAL ANIMATION SCREEN */}
            {gameState === 'reveal' && (
              <motion.div
                key="reveal"
                className="text-center py-16 space-y-4"
              >
                <motion.div
                  animate={{ rotate: 360, scale: [1, 1.15, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-7xl"
                >
                  🔮
                </motion.div>
                <div className="space-y-1">
                  <p className="text-sm font-black text-emerald-700 uppercase tracking-widest animate-pulse">
                    Analyzing Answers...
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Calculations run ho rahi hain aapke money mind map pe.
                  </p>
                </div>
              </motion.div>
            )}

            {/* RESULTS SCREEN */}
            {gameState === 'result' && (
              <motion.div
                key="result"
                className="space-y-6 py-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {/* Visual Age Circle */}
                <div className="text-center space-y-2 relative">
                  <div className="w-32 h-32 rounded-full border-2 border-dashed border-emerald-300 bg-emerald-50/50 mx-auto flex flex-col items-center justify-center relative shadow-xs">
                    <span className="text-xs text-slate-500 font-bold">Financial Age</span>
                    <span className="text-5xl font-black text-emerald-700">
                      {revealedAge}
                    </span>
                    <span className="text-[10px] text-slate-500 font-extrabold uppercase">Years Old</span>
                  </div>

                  <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {result.label}
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed px-4 font-medium">
                    {result.description}
                  </p>
                </div>

                {/* Score bar */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-2">
                  <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                    <span>Maturity Score</span>
                    <span className="text-slate-900 font-black">{totalScore} / 36</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 bg-emerald-600"
                      style={{ width: `${(totalScore / 36) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Personalized suggestions */}
                <div className="bg-white border border-slate-200/90 rounded-3xl p-4 space-y-3 shadow-xs">
                  <h4 className="text-xs font-black text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles size={13} className="text-emerald-600" /> Doctor's Money Prescription
                  </h4>
                  <div className="space-y-2">
                    {result.tips.map((tip, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <span className="text-emerald-600 font-extrabold mt-0.5">✓</span>
                        <span className="leading-relaxed font-medium">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleShare}
                    className="flex-1 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-all active:scale-95"
                  >
                    <Share2 size={13} /> {copied ? 'Copied Link!' : 'Share Status'}
                  </button>
                  <button
                    onClick={handleRestart}
                    className="px-5 py-3 rounded-2xl border border-slate-200 bg-white text-xs font-extrabold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <RotateCcw size={12} /> Retake Test
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Footer info */}
        <div className="shrink-0 px-6 py-4 border-t border-slate-100 bg-slate-50/70 backdrop-blur-md flex items-center justify-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Ameer Meter — +20 Coins Awarded upon completion
          </p>
        </div>
      </motion.div>
    </div>
  );
}
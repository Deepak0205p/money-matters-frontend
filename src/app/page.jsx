"use client";

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, TrendingUp, Zap, Award, BookOpen, Sparkles, Flame, Trophy, Heart, HelpCircle, ChevronDown, ArrowRight } from 'lucide-react';
import { Hero } from '@/components/2d/hero';
import { Features } from '@/components/2d/features';
import { Gamification } from '@/components/2d/gamification';
import { Navbar } from '@/components/2d/navbar';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store/useAppStore';

function LightStreaks() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-[2px] h-[30vh] bg-gradient-to-b from-transparent via-blue-600/20 to-transparent"
          style={{
            left: `${20 + i * 30}%`,
            top: '-30vh',
            filter: 'blur(1px)',
            transform: 'rotate(35deg)'
          }}
          animate={{
            top: ['-30vh', '130vh'],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 7 + i * 2,
            repeat: Infinity,
            delay: i * 3,
            ease: 'linear'
          }}
        />
      ))}
    </div>
  );
}

function FloatingSymbols() {
  const symbols = useMemo(() => [
    { Icon: Coins, color: '#FFB800', size: 24, top: '15%', left: '10%', delay: 0, dur: 12 },
    { Icon: TrendingUp, color: '#2563eb', size: 32, top: '45%', left: '85%', delay: 2, dur: 14 },
    { Icon: Zap, color: '#6366F1', size: 28, top: '75%', left: '15%', delay: 4, dur: 10 },
    { Icon: Award, color: '#FFB800', size: 20, top: '25%', left: '70%', delay: 1, dur: 13 },
    { Icon: BookOpen, color: '#2563eb', size: 22, top: '60%', left: '80%', delay: 3, dur: 11 },
    { Icon: Sparkles, color: '#EC4899', size: 26, top: '85%', left: '90%', delay: 5, dur: 15 },
    { Icon: Trophy, color: '#FFB800', size: 30, top: '10%', left: '50%', delay: 2.5, dur: 9 },
    { Icon: Flame, color: '#FF6B4A', size: 24, top: '40%', left: '5%', delay: 1.5, dur: 16 }
  ], []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.12]">
      {symbols.map((item, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top: item.top,
            left: item.left
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, 10, -10, 0],
            rotate: [0, 20, -20, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: item.dur,
            repeat: Infinity,
            delay: item.delay,
            ease: 'easeInOut'
          }}
        >
          <item.Icon
            size={item.size}
            style={{
              color: item.color,
              filter: `drop-shadow(0 0 10px ${item.color}40)`
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}

function Background2D() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#F8FAFC]">
      <FloatingSymbols />
      <LightStreaks />
      <div className="absolute -top-[20%] -left-[20%] w-[70%] h-[70%] rounded-full bg-blue-600/[0.04] blur-[150px]" />
      <div className="absolute -bottom-[20%] -right-[20%] w-[70%] h-[70%] rounded-full bg-blue-600/[0.02] blur-[150px]" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle, #0F172A 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />
    </div>
  );
}

function FAQAccordion() {
  const [openIdx, setOpenIdx] = useState(null);

  const faqs = [
    {
      q: "Is this app completely free?",
      a: "Yes! Our goal is to spread real financial literacy across India. All 11 modules, interactive strategy tests, simulators, and AI advice are 100% free with zero paywalls."
    },
    {
      q: "What financial topics are covered?",
      a: "We cover budgeting, saving, investing, taxation, UPI psychology, insurance, debt management, and financial independence — all in plain, easy-to-understand conversational language."
    },
    {
      q: "Do I need to sign up to start learning?",
      a: "No! You can jump straight in as a Guest with zero friction. Your progress, coins, and streaks are automatically saved locally on your device."
    },
    {
      q: "What are Coins and Badges used for?",
      a: "They are progress trackers! You earn coins and badges for completing each module, quiz, or strategy, which increases your in-app rank and secures your learning levels."
    }
  ];

  return (
    <section className="py-16 md:py-24 relative z-10 max-w-4xl mx-auto px-4">
      <div className="text-center mb-12 space-y-3">
        <h3 className="font-display text-2xl font-bold md:text-3xl text-slate-900">Frequently Asked Questions</h3>
      </div>
      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div key={idx} className="rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden transition-all duration-300">
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full text-left p-5 flex items-center justify-between text-base font-semibold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-600' : ''}`}
                />
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="p-5 pt-0 text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#F8FAFC]">
      <Background2D />

      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Features />
        <Gamification />
        <FAQAccordion />

        {/* CTA Banner Section */}
        <section className="py-20 md:py-28 max-w-5xl mx-auto px-4 relative z-10">
          <div className="relative rounded-3xl overflow-hidden p-8 sm:p-14 text-center bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 border border-blue-500/30 shadow-2xl">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

            <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
              <h3 className="font-display text-3xl font-extrabold sm:text-4xl md:text-5xl text-white leading-tight tracking-tight">
                When Are You Starting Your <br />
                <span className="text-sky-200">
                  Financial Independence?
                </span>
              </h3>
              <p className="text-sm sm:text-base text-blue-100 leading-relaxed font-normal max-w-xl mx-auto">
                Learn actionable strategies, test your decision making, and master compounding. Zero jargon, 100% free for students.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const store = useAppStore.getState();
                    if (!store.isAuthenticated) {
                      store.loginAsGuest();
                    }
                    router.push('/home/dashboard');
                  }}
                  className="flex items-center justify-center gap-2.5 rounded-xl bg-white hover:bg-slate-100 px-8 py-3.5 text-base font-bold text-slate-900 cursor-pointer shadow-lg transition-all"
                >
                  <Sparkles size={16} className="text-blue-600 fill-current" />
                  <span>Start Learning for Free</span>
                  <ArrowRight size={16} />
                </motion.button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="py-12 text-center border-t border-slate-200 bg-white relative z-10"
        >
          <div className="max-w-4xl mx-auto px-4 space-y-4">
            <div className="flex items-center justify-center gap-2.5">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center overflow-hidden bg-blue-600 p-0.5 shadow-sm"
              >
                <img src="/logo.png" alt="Logo" className="h-full w-full object-cover rounded-lg" />
              </div>
              <span className="text-base font-bold font-display text-slate-900">
                Money<span className="text-blue-600"> Matters</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center justify-center gap-1.5 leading-relaxed">
              Made with <Heart size={12} className="text-rose-500 fill-current" /> for Indian Youth · © 2026 Money Matters
            </p>
          </div>
        </motion.footer>
      </div>
    </main>
  );
}
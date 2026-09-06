"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Coins, Trophy, Award, Flame, Star, Zap } from 'lucide-react';

export function Gamification() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section className="py-20 md:py-28 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FFB800]/[0.04] rounded-full blur-[140px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="mb-16 text-center space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl text-slate-900"
          >
            Rewards for Consistency! <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 bg-clip-text text-transparent">
              Earn Coins and Unlock Badges
            </span>
          </motion.h2>
          <p className="mx-auto max-w-2xl text-slate-600 text-sm sm:text-base">
            Make your financial learning journey rewarding. Earn real in-app currency and unlock achievements with every module and simulated challenge!
          </p>
        </div>

        {/* Gamified Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          
          {/* Card 1: Coins */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="rounded-3xl p-7 bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden group"
          >
            <div>
              <div className="mb-5 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 shadow-sm">
                  <Coins size={24} className="animate-pulse" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-900">Earn Coins</h3>
                  <p className="text-xs text-slate-500">In-app currency for completed modules</p>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200 mb-4 bg-slate-50 relative">
                <Image
                  src="/images/rupee_coin.jpeg"
                  alt="Rupee coin gamification representation"
                  width={400}
                  height={200}
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="space-y-2">
                {[
                  { label: 'Module Completion', coins: '+50 Coins' },
                  { label: 'Perfect Quiz Score', coins: '+100 Coins' },
                  { label: 'Weekly Streak Check', coins: '+200 Coins' }
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs">
                    <span className="text-slate-600 font-medium">{item.label}</span>
                    <span className="font-bold text-amber-600 tabular-nums">{item.coins}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Card 2: Badges */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="rounded-3xl p-7 bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden group"
          >
            <div>
              <div className="mb-5 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 shadow-sm">
                  <Award size={24} />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-900">Mastery Badges</h3>
                  <p className="text-xs text-slate-500">Achieve milestone credentials</p>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200 mb-4 bg-slate-50 relative">
                <Image
                  src="/images/badges.jpeg"
                  alt="Achievement badges representation"
                  width={400}
                  height={200}
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: Star, label: 'Bronze', color: '#F59E0B' },
                  { icon: Trophy, label: 'Silver', color: '#64748B' },
                  { icon: Zap, label: 'Gold', color: '#2563EB' }
                ].map(badge => (
                  <div key={badge.label} className="flex flex-col items-center gap-1.5 rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-center">
                    <badge.icon size={18} style={{ color: badge.color }} />
                    <span className="text-[10px] text-slate-700 font-medium">{badge.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Card 3: Daily Streak */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="rounded-3xl p-7 bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden group"
          >
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 border border-orange-200 shadow-sm">
                  <Flame size={24} className="animate-bounce" style={{ animationDuration: '3s' }} />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-900">Daily Streak</h3>
                  <p className="text-xs text-slate-500">Practice consistent habits daily</p>
                </div>
              </div>

              <div className="space-y-2">
                {[
                  { days: '3 day streak', reward: '50 bonus coins', icon: '🔥' },
                  { days: '7 day streak', reward: '200 bonus coins', icon: '⚡' },
                  { days: '30 day streak', reward: 'Exclusive Gold Badge', icon: '👑' }
                ].map(streak => (
                  <div key={streak.days} className="flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-200 p-3">
                    <span className="text-xl flex-shrink-0">{streak.icon}</span>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-slate-900">{streak.days}</p>
                      <p className="text-[10px] text-slate-500">{streak.reward}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl bg-blue-50 border border-blue-100 p-3.5 mt-2">
                <p className="text-[11px] text-slate-700 leading-relaxed font-normal">
                   <strong className="text-blue-700 font-semibold">Pro Tip:</strong> Completing one 2-minute swipe card daily keeps your streak alive and builds life-long compounding discipline.
                </p>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
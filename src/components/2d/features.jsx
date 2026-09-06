"use client";

import { motion } from 'framer-motion';
import { Users, Briefcase, GraduationCap, TrendingUp, ShieldCheck, Sparkles, Award } from 'lucide-react';

export function Features() {
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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="mb-16 text-center space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl text-slate-900"
          >
            Custom Paths for Everyone, <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 bg-clip-text text-transparent">
              Learn at Your Own Pace and Style!
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-slate-600 text-sm sm:text-base md:text-lg"
          >
            Financial literacy engineered for Gen-Z, College Students, and First-Job Earners across Bharat.
          </motion.p>
        </div>

        {/* Feature Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          
          {/* Card 1: College Students */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="rounded-3xl p-7 bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group"
          >
            <div className="space-y-4 relative z-10">
              <div className="inline-flex rounded-2xl bg-blue-50 p-3.5 text-blue-600 group-hover:scale-105 transition-transform duration-300 border border-blue-200">
                <GraduationCap size={28} />
              </div>
              <h3 className="font-display text-xl font-bold text-slate-900">College Students</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                Simple setup for pocket money and canteen savings. Learn budget templates, micro-investing basics, and smart UPI expense tracking without the stress.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-blue-600 font-semibold relative z-10">
              <span>Savings & Micro-budgeting</span>
              <Sparkles size={14} className="animate-pulse" />
            </div>
          </motion.div>

          {/* Card 2: First Job Earners */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="rounded-3xl p-7 bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group"
          >
            <div className="space-y-4 relative z-10">
              <div className="inline-flex rounded-2xl bg-indigo-50 p-3.5 text-indigo-600 group-hover:scale-105 transition-transform duration-300 border border-indigo-200">
                <Briefcase size={28} />
              </div>
              <h3 className="font-display text-xl font-bold text-slate-900">First Job Earners</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                Start building compounding wealth from your very first salary. Automated SIP setups, emergency funds, tax regime options, and long-term asset allocation.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-indigo-600 font-semibold relative z-10">
              <span>SIP, Investing & Taxes</span>
              <TrendingUp size={14} />
            </div>
          </motion.div>

          {/* Card 3: Teenagers */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="rounded-3xl p-7 bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-amber-300 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group"
          >
            <div className="space-y-4 relative z-10">
              <div className="inline-flex rounded-2xl bg-amber-50 p-3.5 text-amber-600 group-hover:scale-105 transition-transform duration-300 border border-amber-200">
                <Users size={28} />
              </div>
              <h3 className="font-display text-xl font-bold text-slate-900">Teenagers & School</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                Learn how money really works before adulthood. Understand assets vs. liabilities, play safe financial debt simulators, and earn XP badges through interactive quizzes.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-amber-600 font-semibold relative z-10">
              <span>Financial Simulator & Badges</span>
              <ShieldCheck size={14} />
            </div>
          </motion.div>

        </motion.div>

        {/* Why Us / Interactive games showreel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-12 rounded-3xl p-8 bg-white border border-slate-200/90 shadow-sm relative overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
            <div className="md:col-span-7 space-y-4">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Why Money Matters?</span>
              <h3 className="font-display text-2xl font-bold text-slate-900">Interactive Strategies & Simulations</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                We don't teach boring theory. We put you in the driver's seat. Run live scenarios using Compounding Tree, Debt Trap Darwaza, and Asset Allocation Biryani to build unbreakable financial instincts!
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {['Compounding Tree', 'Debt Trap Darwaza', 'Asset Allocation Biryani', 'Daily Expense Simulator'].map(item => (
                  <span key={item} className="text-xs bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-1.5 rounded-xl font-medium">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="md:col-span-5 flex justify-center">
              <div className="relative p-6 bg-slate-50 border border-slate-200 rounded-2xl w-full text-center shadow-sm">
                <h4 className="text-sm font-bold text-slate-900 mb-1">Curriculum Ready</h4>
                <p className="text-xs text-slate-500 mb-4">23 Interactive Modules with Live Scenarios</p>
                <div className="flex items-center justify-center gap-1.5">
                  {[...Array(11)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-2.5 w-2.5 rounded-full ${
                        i < 5 ? 'bg-blue-600' : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[11px] text-blue-700 font-semibold mt-3 block">Level UP with each completed module!</span>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
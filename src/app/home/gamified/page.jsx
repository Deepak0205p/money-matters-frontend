'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Zap, Navigation, GitBranch, Eye, Layers, Home, 
  DoorOpen, TreePine, Award, BookOpen, Clock, Store, Construction,
  Sparkles, ArrowUpRight
} from 'lucide-react';
import { strategies } from '@/lib/data/strategies';

const ICON_MAP = { Navigation, GitBranch, Eye, Layers, Home, DoorOpen, TreePine, Award, BookOpen, Clock, Store };

function getIcon(iconName) {
  if (!iconName) return Construction;
  return ICON_MAP[iconName] || Construction;
}

const getSlug = (strategy) => {
  if (strategy.slug) return strategy.slug;
  const nameMap = {
    'FinancialGPS': 'paise-ka-gps',
    'ConsequenceSim': 'kya-hota-agar',
    'KyaHotaAgar': 'kya-hota-agar',
    'InflationMonster': 'chhupa-hua-chor',
    'SwipeBudget': 'budget-khel',
    'RoomBudget': 'ghar-ka-budget',
    'DebtDoors': 'debt-trap-darwaza',
    'CompoundingTree': 'compounding-tree',
    'ReportCard': 'financial-health-report-card',
    'Dictionary': 'rupaiya-dictionary',
    'DailySimulator': 'ek-din-ka-kharcha',
    'MistakeMarket': 'mistake-market'
  };
  return nameMap[strategy.componentName] || strategy.title.toLowerCase().replace(/\s+/g, '-');
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.3 }
  }
};

export default function GamifiedPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('ALL');

  const openStrategyViewer = (slug) => {
    router.push(`/home/gamified?strategy=${slug}`);
  };

  const getDifficulty = (priority) => {
    if (priority === 'highest' || priority === 'high') 
      return { label: 'Advanced', dotColor: 'bg-rose-500', coins: '+100 Coins', filter: 'ADVANCED' };
    if (priority === 'medium') 
      return { label: 'Intermediate', dotColor: 'bg-amber-500', coins: '+50 Coins', filter: 'INTERMEDIATE' };
    return { label: 'Beginner', dotColor: 'bg-emerald-500', coins: '+30 Coins', filter: 'BEGINNER' };
  };

  const filteredStrategies = strategies.filter(strategy => {
    if (activeFilter === 'ALL') return true;
    return getDifficulty(strategy.priority).filter === activeFilter;
  });

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="space-y-6 max-w-6xl mx-auto text-left relative py-2"
    >
      {/* Header — Youth Fintech Theme */}
      <motion.div 
        variants={itemVariants}
        className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[11px] font-extrabold uppercase tracking-wider mb-2">
            <Sparkles size={12} className="text-emerald-700" />
            Interactive Finance Labs
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-emerald-100/70 text-emerald-800">
              <Brain size={24} />
            </span>
            Visual Gamified Concepts
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl font-normal">
            Say goodbye to boring theory! Master inflation, compounding, debt traps, and budgeting through interactive live simulations.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 bg-slate-50 border border-slate-200/80 rounded-2xl px-4 py-2.5">
          <span className="text-xs font-bold text-slate-500">Available Labs:</span>
          <span className="text-sm font-extrabold font-display text-emerald-800 tabular-nums">11 Interactive Games</span>
        </div>
      </motion.div>

      {/* Filter Tabs — Clean Pills */}
      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-2">
        {['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map((filter) => {
          const isActive = activeFilter === filter;
          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold tracking-wider transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              {filter}
            </button>
          );
        })}
      </motion.div>

      {/* Strategy Cards Grid */}
      <motion.div
        layout
        variants={containerVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        <AnimatePresence mode="popLayout">
          {filteredStrategies.map((strategy) => {
            const Icon = getIcon(strategy.icon);
            const difficulty = getDifficulty(strategy.priority);

            return (
              <motion.button
                layout
                key={strategy.id}
                variants={itemVariants}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10, scale: 0.96 }}
                onClick={() => openStrategyViewer(getSlug(strategy))}
                className="group relative text-left bg-white border border-slate-200/90 rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:border-emerald-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer"
              >
                <div>
                  {/* Top row: icon + badges */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center border bg-emerald-50 border-emerald-200 text-emerald-700 transition-transform group-hover:scale-105 shadow-xs">
                      <Icon size={22} />
                    </div>

                    <div className="flex gap-1.5 items-center">
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        Lab #{String(strategy.id).padStart(2, '0')}
                      </span>
                      <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 tabular-nums">
                        {difficulty.coins}
                      </span>
                    </div>
                  </div>

                  {/* Title + Description */}
                  <h3 className="text-base font-extrabold font-display text-slate-900 leading-tight group-hover:text-emerald-800 transition-colors">
                    {strategy.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-2 line-clamp-3 min-h-[3rem]">
                    {strategy.description || strategy.titleEn}
                  </p>
                </div>

                {/* Footer: difficulty + CTA */}
                <div className="flex items-center justify-between pt-4 mt-3 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                    <span className={`w-2 h-2 rounded-full ${difficulty.dotColor}`} />
                    <span>{difficulty.label}</span>
                  </div>

                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-700 group-hover:bg-emerald-800 text-white text-xs font-extrabold font-display transition-colors shadow-xs">
                    PLAY LAB 🎮
                    <ArrowUpRight size={12} />
                  </span>
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

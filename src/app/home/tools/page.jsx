'use client';

import { useRouter } from 'next/navigation';
import { 
  TrendingUp, ShieldCheck, Milestone, Compass, 
  Eye, Target, Newspaper, PiggyBank, Brain, 
  Dices, HelpCircle, Gamepad2, Landmark, 
  CalendarDays, Award, BarChart3, Activity, Wrench, Sparkles, ArrowUpRight
} from 'lucide-react';

export default function ToolsPage() {
  const router = useRouter();

  const openToolDialog = (toolId) => {
    router.push(`/home/tools?tool=${toolId}`);
  };

  const tools = [
    { 
      id: 'sip', 
      label: 'Compounding Treasury 💰', 
      sub: 'SIP Growth Engine', 
      desc: 'Experience the magic of compounding and calculate how small monthly investments grow into substantial wealth.', 
      badge: 'Popular',
      color: '#059669', 
      icon: TrendingUp 
    },
    { 
      id: 'emergency', 
      label: 'Safety Shield 🛡️', 
      sub: 'Emergency Fund Builder', 
      desc: 'Avoid taking loans during emergencies — calculate your safe 6-month reserve requirement.', 
      color: '#059669', 
      icon: ShieldCheck 
    },
    { 
      id: 'age', 
      label: 'Wealth Meter 📈', 
      sub: 'Financial Age Calculator', 
      desc: 'Look beyond chronological age and calculate your maturity score based on money habits and assets.', 
      color: '#4F46E5', 
      icon: Milestone 
    },
    { 
      id: 'priority', 
      label: 'Needs vs Wants ⚖️', 
      sub: 'Budget Allocator', 
      desc: 'Categorize your expenses with the 50-30-20 rule and put an end to impulse spending.', 
      color: '#059669', 
      icon: Compass 
    },
    { 
      id: 'expense', 
      label: 'Expense Tracker 🕵️‍♂️', 
      sub: 'Smart Expense Tracker', 
      desc: 'Track daily micro-spending and online deliveries to keep every rupee accountable.', 
      badge: 'Essential',
      color: '#059669', 
      icon: Eye 
    },
    { 
      id: 'goals', 
      label: 'Dream Goal Planner 🎯', 
      sub: 'Goal Roadmap', 
      desc: 'Plan for a new laptop, vehicle, or vacation by setting target amounts and timelines.', 
      color: '#4F46E5', 
      icon: Target 
    },
    { 
      id: 'news', 
      label: 'Finance News 📰', 
      sub: 'Market Insights', 
      desc: 'Jargon-free daily market updates and actionable finance lessons without the boring lectures.', 
      color: '#059669', 
      icon: Newspaper 
    },
    { 
      id: 'savings', 
      label: 'Savings Challenge 🐷', 
      sub: 'Savings Challenger', 
      desc: 'Complete daily and weekly saving challenges to earn streak bonus coins.', 
      badge: 'Gamified',
      color: '#F59E0B', 
      icon: PiggyBank 
    },
    { 
      id: 'quiz', 
      label: 'Knowledge Arena 🧠', 
      sub: 'Financial Literacy Quiz', 
      desc: 'Answer rapid-fire finance questions, test your understanding, and win reward coins.', 
      badge: 'Rewards',
      color: '#F59E0B', 
      icon: HelpCircle 
    },
    { 
      id: 'spin', 
      label: 'Fortune Wheel 🎡', 
      sub: 'Daily Lucky Wheel', 
      desc: 'Spin once every 24 hours for guaranteed bonus coins and surprise finance tips!', 
      badge: 'Daily Free',
      color: '#F59E0B', 
      icon: Dices 
    },
    { 
      id: 'memory', 
      label: 'Memory Match 🧩', 
      sub: 'Financial Memory Match', 
      desc: 'Match finance term pairs with minimal moves and sharpen your conceptual retention.', 
      color: '#4F46E5', 
      icon: Brain 
    },
    { 
      id: 'word', 
      label: 'Word Scramble 🔠', 
      sub: 'Word Scramble Game', 
      desc: 'Decode jumbled letters into finance terms — SIP, Bull, Bear, Equity, and more.', 
      color: '#4F46E5', 
      icon: Gamepad2 
    },
    { 
      id: 'invest', 
      label: 'Investment Explorer 🔍', 
      sub: 'Asset Comparison', 
      desc: 'Compare Fixed Deposits, Gold, Mutual Funds, and Stocks to weigh risk vs inflation-beating returns.', 
      color: '#059669', 
      icon: Landmark 
    },
    { 
      id: 'habit', 
      label: 'Habit Tracker 📅', 
      sub: 'Money Habit Tracker', 
      desc: 'Log daily expenses, celebrate no-spend days, and build financial discipline streaks.', 
      color: '#059669', 
      icon: CalendarDays 
    },
    { 
      id: 'badges', 
      label: 'Badges Showcase 🏆', 
      sub: 'Milestones & Badges', 
      desc: 'A visual showcase of your earned certificates, badges, and learning milestones.', 
      color: '#F59E0B', 
      icon: Award 
    },
    { 
      id: 'achievement', 
      label: 'Achievements Board 📊', 
      sub: 'Progress Dashboard', 
      desc: 'In-depth breakdown of your earned coins, streak count, completed modules, and rank.', 
      color: '#4F46E5', 
      icon: BarChart3 
    },
    { 
      id: 'health', 
      label: 'Financial Health Checkup 🏥', 
      sub: 'Diagnostic Checkup', 
      desc: 'A 2-minute diagnostic assessment to evaluate your overall financial wellness score.', 
      badge: 'High Value',
      color: '#059669', 
      icon: Activity 
    }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto text-left py-2">
      {/* Header section — Indian Youth Fintech Theme */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-emerald-100/70 text-emerald-800">
              <Wrench size={24} />
            </span>
            Financial Tools & Utilities
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl font-normal">
            Calculators, interactive activities, and decision engines designed to help you multiply your savings and first income.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 bg-slate-50 border border-slate-200/80 rounded-2xl px-4 py-2.5">
          <span className="text-xs font-bold text-slate-500">Available:</span>
          <span className="text-sm font-extrabold font-display text-emerald-800 tabular-nums">17 Tools Ready</span>
        </div>
      </div>

      {/* Grid container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {tools.map(t => {
          const Icon = t.icon;
          return (
            <div
              key={t.id}
              className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:border-emerald-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Subtle ambient accent glow */}
              <div 
                className="absolute -top-10 -right-10 w-24 h-24 rounded-full blur-[40px] opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none" 
                style={{ backgroundColor: t.color }}
              />

              <div>
                {/* Icon & Sub-header */}
                <div className="flex items-center justify-between mb-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 border bg-emerald-50 border-emerald-200 text-emerald-700 shadow-xs" 
                  >
                    <Icon size={22} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    {t.badge && (
                      <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80">
                        {t.badge}
                      </span>
                    )}
                    <span 
                      className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      {t.sub}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-base font-extrabold font-display text-slate-900 leading-tight group-hover:text-emerald-800 transition-colors">
                  {t.label}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-2 min-h-[3rem]">
                  {t.desc}
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={() => openToolDialog(t.id)}
                className="w-full mt-4 py-2.5 px-4 rounded-xl text-xs font-extrabold font-display tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs hover:shadow-sm"
              >
                OPEN TOOL
                <ArrowUpRight size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

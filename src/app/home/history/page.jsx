'use client';

import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store/useAppStore';
import { Clock, Coins, Sparkles, ArrowRight, History } from 'lucide-react';
import { ACTIVITY_EMOJI } from '@/lib/data/badges';

export default function HistoryPage() {
  const router = useRouter();
  const { activityLog } = useAppStore();

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-left py-2">
      {/* Header section — Youth Fintech Theme */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-emerald-100/70 text-emerald-800">
              <History size={24} />
            </span>
            Learning History
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl font-normal">
            A complete timeline of all completed modules, utilized tools, and earned reward coins.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 bg-slate-50 border border-slate-200/80 rounded-2xl px-4 py-2.5">
          <span className="text-xs font-bold text-slate-500">Total Logs:</span>
          <span className="text-sm font-extrabold font-display text-emerald-800 tabular-nums">
            {activityLog.length} Activities
          </span>
        </div>
      </div>

      {/* Main Timeline Card */}
      <div className="bg-white border border-slate-200/90 p-5 sm:p-6 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
        {activityLog.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
              <Clock size={28} />
            </div>
            <div>
              <p className="text-base font-extrabold font-display text-slate-800">No activity history yet</p>
              <p className="text-xs text-slate-500 mt-1">Start reading modules or exploring interactive tools to see your progress!</p>
            </div>
            <button
              onClick={() => router.push('/home/dashboard')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold font-display tracking-wider transition-all cursor-pointer shadow-xs"
            >
              Start Learning Now
              <ArrowRight size={14} />
            </button>
          </div>
        ) : (
          <div className="space-y-3 max-h-[65vh] overflow-y-auto pr-2">
            {activityLog.map(act => (
              <div 
                key={act.id} 
                className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:bg-emerald-50/40 hover:border-emerald-200/80 transition-all group"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-200/90 group-hover:border-emerald-200 text-xl shadow-xs">
                  {ACTIVITY_EMOJI[act.type] || '✨'}
                </div>

                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="text-sm font-bold text-slate-800 leading-snug group-hover:text-emerald-950 transition-colors">
                    {act.description}
                  </p>
                  <span className="text-xs text-slate-500 mt-1 block font-medium tabular-nums">
                    {new Date(act.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} at {new Date(act.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {act.coins > 0 && (
                  <div className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-50 to-amber-100/70 border border-amber-200/80 px-3 py-1.5 shrink-0">
                    <span className="font-extrabold text-[#C9861A] text-xs leading-none">₹</span>
                    <span className="text-xs font-extrabold text-[#92400E] tabular-nums">+{act.coins}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

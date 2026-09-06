'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft, Target, IndianRupee, Zap, Shield, Trophy, Rocket,
  Mountain, Calendar, CheckCircle2, AlertTriangle, Star, Flame,
  ChevronRight, Clock, TrendingUp, Loader2, Sparkles, Brain,
  ChevronDown, Pencil, Save, X, Check
} from 'lucide-react';
import { useAppStore, useHydration } from '@/lib/store/useAppStore';
import { toast } from '@/hooks/use-toast';
import { apiFetch } from '@/lib/apiClient';

// ─── Editable Text Field ──────────────────────────────────────
function EditableField({ value, onSave, className, multiline = false, tag: Tag = 'span' }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => { if (editing && inputRef.current) inputRef.current.focus(); }, [editing]);

  const save = () => { onSave(draft); setEditing(false); };

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        {multiline ? (
          <textarea ref={inputRef} value={draft} onChange={e => setDraft(e.target.value)}
            className={`flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 resize-none ${className}`}
            rows={3}
          />
        ) : (
          <input ref={inputRef} value={draft} onChange={e => setDraft(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && save()}
            className={`flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 ${className}`}
          />
        )}
        <button onClick={save} className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 cursor-pointer"><Save size={12} /></button>
        <button onClick={() => { setDraft(value); setEditing(false); }} className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 cursor-pointer"><X size={12} /></button>
      </div>
    );
  }

  return (
    <div className="group/field flex items-start gap-1.5 cursor-pointer" onClick={() => setEditing(true)}>
      <Tag className={className}>{value}</Tag>
      <Pencil size={10} className="text-slate-400 group-hover/field:text-emerald-700 mt-1 shrink-0 opacity-0 group-hover/field:opacity-100 transition-opacity" />
    </div>
  );
}

// ─── Editable List Item ──────────────────────────────────────
function EditableListItem({ items, onSave, className }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(items?.join('\n') || '');

  const save = () => { onSave(draft.split('\n').filter(Boolean)); setEditing(false); };

  if (editing) {
    return (
      <div className="space-y-2">
        <textarea ref={useRef(null)} value={draft} onChange={e => setDraft(e.target.value)} autoFocus
          className={`w-full bg-black/30 border border-blue-200 rounded-xl px-3 py-2 text-[11px] text-white focus:outline-none resize-none ${className}`}
          rows={Math.min(8, draft.split('\n').length + 2)}
        />
        <div className="flex gap-2">
          <button onClick={save} className="px-3 py-1 rounded-lg bg-blue-100 text-blue-400 text-[10px] font-bold hover:bg-blue-100 flex items-center gap-1"><Save size={10} /> Save</button>
          <button onClick={() => setEditing(false)} className="px-3 py-1 rounded-lg bg-white/5 text-zinc-400 text-[10px] font-bold hover:bg-white/10">Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="group/list cursor-pointer" onClick={() => setEditing(true)}>
      {items?.map((item, i) => (
        <div key={i} className="flex items-start gap-2 text-[11px] text-zinc-400 mb-1">
          <ChevronRight size={10} className="text-blue-400 mt-0.5 shrink-0" /><span>{item}</span>
        </div>
      ))}
      <Pencil size={9} className="text-zinc-600 group-hover/list:text-blue-400 mt-1 opacity-0 group-hover/list:opacity-100 transition-opacity" />
    </div>
  );
}

// ─── Ladder SVG Path ──────────────────────────────────────────
function LadderSVG({ groups, completedCount }) {
  const total = groups?.length || 4;
  const svgWidth = 360;
  const svgHeight = total * 200 + 120;
  const centerX = svgWidth / 2;

  // Generate ladder rungs — alternating left-right with curved connectors
  const rungs = groups.map((g, i) => {
    const isLeft = i % 2 === 0;
    return {
      x: isLeft ? 50 : svgWidth - 50,
      y: 80 + i * 200,
      isLeft,
      group: g,
      index: i,
    };
  });

  // Add summit point
  const summit = { x: centerX, y: 80 + total * 200 };

  // Build path with smooth curves
  let pathD = '';
  const allPoints = [...rungs, summit];
  allPoints.forEach((p, i) => {
    if (i === 0) {
      pathD = `M ${centerX} ${svgHeight - 20} L ${p.x} ${p.y}`;
    } else {
      const prev = allPoints[i - 1];
      const cpx1 = prev.x + (p.x - prev.x) * 0.3;
      const cpy1 = prev.y + 50;
      const cpx2 = p.x - (p.x - prev.x) * 0.3;
      const cpy2 = p.y - 50;
      pathD += ` C ${cpx1} ${cpy1} ${cpx2} ${cpy2} ${p.x} ${p.y}`;
    }
  });

  const totalLen = 3000;
  const progress = total > 0 ? (completedCount / total) * 100 : 0;

  return (
    <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="absolute left-1/2 -translate-x-1/2 top-0 pointer-events-none">
      <defs>
        <linearGradient id="ladGrad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.3" />
          <stop offset="40%" stopColor="#2563eb" stopOpacity="0.8" />
          <stop offset="70%" stopColor="#F59E0B" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#EF4444" stopOpacity="0.8" />
        </linearGradient>
        <filter id="ladGlow"><feGaussianBlur stdDeviation="6" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        <filter id="nodeGlow3"><feGaussianBlur stdDeviation="10" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>

      {/* Ladder rungs (horizontal lines) */}
      {rungs.map((rung, i) => (
        <motion.line
          key={`rung-${i}`}
          x1={centerX - 40} y1={rung.y}
          x2={centerX + 40} y2={rung.y}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }}
        />
      ))}

      {/* Side rails */}
      <motion.line x1={centerX - 40} y1={svgHeight - 20} x2={centerX - 40} y2={summit.y - 20}
        stroke="rgba(255,255,255,0.04)" strokeWidth="4" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2, duration: 1.5 }}
      />
      <motion.line x1={centerX + 40} y1={svgHeight - 20} x2={centerX + 40} y2={summit.y - 20}
        stroke="rgba(255,255,255,0.04)" strokeWidth="4" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 1.5 }}
      />

      {/* Animated climbing path */}
      <motion.path
        d={pathD}
        fill="none"
        stroke="url(#ladGrad)"
        strokeWidth="4"
        strokeLinecap="round"
        filter="url(#ladGlow)"
        strokeDasharray={totalLen}
        initial={{ strokeDashoffset: totalLen }}
        animate={{ strokeDashoffset: totalLen - (totalLen * progress / 100) }}
        transition={{ duration: 3, ease: "easeOut", delay: 0.5 }}
      />

      {/* Camp nodes */}
      {rungs.map((rung, i) => {
        const done = i < completedCount;
        const current = i === completedCount;
        const colors = ['#2563eb', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899'];
        const col = colors[i % colors.length];

        return (
          <g key={`node-${i}`}>
            {/* Glow ring */}
            {(done || current) && (
              <motion.circle cx={rung.x} cy={rung.y} r="35" fill={`${col}10`} stroke={col} strokeWidth="1.5" strokeOpacity="0.3"
                initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 1] }}
                transition={{ delay: 0.8 + i * 0.2, duration: 0.8 }}
              />
            )}

            {/* Outer ring */}
            <motion.circle cx={rung.x} cy={rung.y} r="26" fill={done ? col : '#0d0f1f'}
              stroke={done ? col : current ? '#F59E0B' : 'rgba(255,255,255,0.08)'}
              strokeWidth={done ? 3 : current ? 3 : 2}
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ delay: 0.6 + i * 0.15, type: "spring", stiffness: 200, damping: 15 }}
            />

            {/* Inner glow */}
            {done && (
              <motion.circle cx={rung.x} cy={rung.y} r="18" fill={`${col}30`}
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ delay: 0.8 + i * 0.15 }}
              />
            )}

            {/* Label */}
            <motion.text x={rung.x} y={rung.y + 1} textAnchor="middle" dominantBaseline="middle"
              fill={done ? "#fff" : current ? "#F59E0B" : "#444"} fontSize={done ? "13" : "11"} fontWeight="bold"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 + i * 0.15 }}
            >
              {done ? "✓" : `P${i + 1}`}
            </motion.text>

            {/* Star on completed */}
            {done && (
              <motion.text x={rung.x + 20} y={rung.y - 20} fontSize="14"
                initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 1.1 + i * 0.2, type: "spring" }}
              >⭐</motion.text>
            )}
          </g>
        );
      })}

      {/* Summit flag */}
      <motion.g initial={{ scale: 0, y: 30 }} animate={{ scale: 1, y: 0 }}
        transition={{ delay: 1 + total * 0.2, type: "spring", stiffness: 120 }}
      >
        <circle cx={summit.x} cy={summit.y} r="32" fill="#F59E0B15" stroke="#F59E0B" strokeWidth="2" strokeOpacity="0.4" />
        <text x={summit.x} y={summit.y + 2} textAnchor="middle" dominantBaseline="middle" fontSize="28">🏆</text>
      </motion.g>

      {/* Starting point */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <circle cx={centerX} cy={svgHeight - 20} r="16" fill="#2563eb15" stroke="#2563eb" strokeWidth="1.5" strokeOpacity="0.4" />
        <text x={centerX} y={svgHeight - 19} textAnchor="middle" dominantBaseline="middle" fontSize="14">🚀</text>
      </motion.g>
    </svg>
  );
}

// ─── Month Detail Panel ──────────────────────────────────────
function MonthDetailPanel({ group, detail, loading, goalId, onSaveDetail }) {
  const [editingField, setEditingField] = useState(null);

  if (loading) {
    return (
      <div className="flex flex-col items-center py-16 space-y-4">
        <Loader2 size={28} className="text-blue-400 animate-spin" />
        <p className="text-xs text-zinc-500">{group.title} ka detailed plan ban raha hai...</p>
        <div className="flex gap-1">
          {[0, 1, 2].map(i => (
            <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-500"
              animate={{ y: [0, -6, 0], opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!detail) return null;

  return (
    <div className="space-y-5">
      {/* Group Header */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl p-2 rounded-xl bg-slate-50 border border-slate-200">{group.emoji}</span>
          <div className="flex-1">
            <EditableField value={detail.title || group.title}
              onSave={v => onSaveDetail('title', v)}
              className="font-extrabold text-lg text-slate-900" tag="h3"
            />
            <p className="text-xs text-slate-500">{group.monthRange} • Target: ₹{(group.targetSavings || 0).toLocaleString('en-IN')}</p>
          </div>
        </div>
        <EditableField value={detail.overview || group.overview}
          onSave={v => onSaveDetail('overview', v)} multiline
          className="text-xs text-slate-600 leading-relaxed"
        />
      </div>

      {/* Weekly Plan */}
      {detail.weeklyPlan && (
        <div className="space-y-3">
          <h4 className="text-sm font-extrabold font-display text-slate-900 flex items-center gap-2">
            <Calendar size={14} className="text-emerald-700" /> Week-by-Week Plan
          </h4>
          {detail.weeklyPlan.map((week, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }}
              className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                    <span className="text-[10px] font-extrabold text-emerald-800">W{week.week}</span>
                  </div>
                  <EditableField value={week.title} onSave={v => onSaveDetail(`week_${i}_title`, v)}
                    className="text-xs font-extrabold text-slate-900"
                  />
                </div>
                <span className="text-xs text-slate-600 font-extrabold tabular-nums">₹{(week.savingsTarget || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="text-slate-700 text-xs">
                <EditableListItem items={week.actions} onSave={v => onSaveDetail(`week_${i}_actions`, v)} />
              </div>
              {week.keyMilestone && (
                <div className="flex items-center gap-2 text-xs">
                  <Target size={12} className="text-amber-500" />
                  <EditableField value={week.keyMilestone} onSave={v => onSaveDetail(`week_${i}_milestone`, v)}
                    className="text-amber-800 font-bold"
                  />
                </div>
              )}
              {week.pitfall && (
                <div className="flex items-center gap-2 text-xs text-rose-600">
                  <AlertTriangle size={12} />
                  <EditableField value={week.pitfall} onSave={v => onSaveDetail(`week_${i}_pitfall`, v)}
                    className="text-rose-700 font-medium"
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Daily Actions */}
      {detail.dailyActions && (
        <div className="space-y-2">
          <h4 className="text-sm font-extrabold font-display text-slate-900 flex items-center gap-2">
            <Zap size={14} className="text-amber-500" /> Daily Actions
          </h4>
          {detail.dailyActions.map((action, i) => {
            const diffColors = {
              easy: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800' },
              medium: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800' },
              hard: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700' },
              extreme: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700' },
            };
            const d = diffColors[action.difficulty] || diffColors.easy;
            return (
              <motion.div key={action.id || i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all"
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${d.bg} border ${d.border}`}>
                  <span className="text-[9px] font-extrabold text-slate-800">{i + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <EditableField value={action.action} onSave={v => onSaveDetail(`action_${i}_action`, v)}
                    className="text-xs font-bold text-slate-900"
                  />
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-[10px] text-slate-500 font-medium">{action.savings}</span>
                    {action.bestTime && <span className="text-[10px] text-slate-500 font-medium">⏰ {action.bestTime}</span>}
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold ${d.bg} border ${d.border} ${d.text}`}>{action.difficulty}</span>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Monthly Milestone */}
      {detail.monthlyMilestone && (
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/90 space-y-2">
          <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wider flex items-center gap-1">
            <Trophy size={12} className="text-amber-600" /> Monthly Milestone
          </span>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">Target: ₹{(detail.monthlyMilestone.targetSavings || 0).toLocaleString('en-IN')}</span>
            <EditableField value={detail.monthlyMilestone.metric} onSave={v => onSaveDetail('milestone_metric', v)}
              className="text-amber-900 font-extrabold"
            />
          </div>
          <EditableField value={detail.monthlyMilestone.reward} onSave={v => onSaveDetail('milestone_reward', v)}
            className="text-[11px] text-slate-600"
          />
        </div>
      )}

      {/* Weekly Check-in */}
      {detail.weeklyCheckIn && (
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 space-y-2 shadow-xs">
          <span className="text-xs font-extrabold text-slate-900 flex items-center gap-2"><Brain size={14} className="text-emerald-700" /> Weekly Check-In</span>
          <div className="text-slate-700 text-xs">
            <EditableListItem items={detail.weeklyCheckIn} onSave={v => onSaveDetail('weeklyCheckIn', v)} />
          </div>
        </div>
      )}

      {/* Emergency Plan */}
      {detail.emergencyPlan && (
        <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/90 space-y-2">
          <span className="text-[10px] font-extrabold text-rose-800 uppercase tracking-wider flex items-center gap-1"><Shield size={12} className="text-rose-600" /> Emergency Plan</span>
          <p className="text-xs text-slate-700"><span className="font-extrabold text-rose-800">If shortfall: </span>
            <EditableField value={detail.emergencyPlan.ifShortfall} onSave={v => onSaveDetail('emergency_ifShortfall', v)} className="text-slate-700 inline" />
          </p>
          <p className="text-xs text-slate-700"><span className="font-extrabold text-rose-800">Backup: </span>
            <EditableField value={detail.emergencyPlan.backupPlan} onSave={v => onSaveDetail('emergency_backupPlan', v)} className="text-slate-700 inline" />
          </p>
        </div>
      )}

      {/* Motivation */}
      {detail.motivation && (
        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 text-center">
          <EditableField value={detail.motivation} onSave={v => onSaveDetail('motivation', v)} multiline
            className="text-xs font-medium text-emerald-950 italic"
          />
        </div>
      )}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═════════════════════════════════════════════════════════════════
export default function GoalRoadmapPage({ goalId: propGoalId }) {
  const hydrated = useHydration();
  const router = useRouter();
  const params = useParams();
  const goalId = propGoalId || params?.goalId;

  const { goals, isAuthenticated, coins, completedModules, streak,
    updateGoalRoadmap, updateGoalMonthDetail, updateGoalEdited } = useAppStore();

  const goal = goals.find(g => g.id === goalId);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState(new Set());

  // Fetch roadmap overview
  useEffect(() => {
    if (!hydrated || !isAuthenticated) return;
    if (!goal) return;
    if (goal.roadmap) return; // already have it

    const generate = async () => {
      setLoading(true); setError(null);
      try {
        const res = await apiFetch('/api/goal-roadmap', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            goal: { name: goal.name, target: goal.target, saved: goal.saved || 0, deadline: goal.deadline, emoji: goal.emoji },
            userContext: { coins, completedModules, streak }
          })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        updateGoalRoadmap(goalId, data.roadmap);
        toast({ title: "Roadmap Ready! 🗺️" });
      } catch (err) {
        setError(err.message);
      } finally { setLoading(false); }
    };
    generate();
  }, [hydrated, isAuthenticated, goal, goalId, coins, completedModules, streak, updateGoalRoadmap]);

  // Fetch month detail
  const fetchMonthDetail = useCallback(async (group) => {
    // Check if already loaded
    if (goal?.monthDetails?.[group.id]) {
      setSelectedGroup(group);
      return;
    }

    setSelectedGroup(group);
    setDetailLoading(true);
    try {
      const res = await apiFetch('/api/goal-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal: { name: goal.name, target: goal.target, saved: goal.saved || 0 },
          userContext: { coins, completedModules, streak },
          mode: 'monthDetail',
          monthGroup: group
        })
      });
      const data = await res.json();
      updateGoalMonthDetail(goalId, group.id, data.monthDetail);
      toast({ title: `${group.title} plan is ready! 📋` });
    } catch {
      toast({ title: "Failed to load details", variant: "destructive" });
    } finally { setDetailLoading(false); }
  }, [goal, goalId, coins, completedModules, streak, updateGoalMonthDetail]);

  // Save edited detail field
  const handleSaveDetail = useCallback((field, value) => {
    if (!selectedGroup || !goal) return;
    const currentDetail = goal.monthDetails?.[selectedGroup.id] || {};
    let updated = { ...currentDetail };

    if (field.startsWith('week_')) {
      const parts = field.split('_');
      const weekIdx = parseInt(parts[1]);
      const weekField = parts.slice(2).join('_');
      if (updated.weeklyPlan?.[weekIdx]) {
        updated.weeklyPlan[weekIdx] = { ...updated.weeklyPlan[weekIdx], [weekField]: value };
      }
    } else if (field.startsWith('action_')) {
      const parts = field.split('_');
      const actionIdx = parseInt(parts[1]);
      const actionField = parts.slice(2).join('_');
      if (updated.dailyActions?.[actionIdx]) {
        updated.dailyActions[actionIdx] = { ...updated.dailyActions[actionIdx], [actionField]: value };
      }
    } else if (field.startsWith('emergency_')) {
      const emField = field.replace('emergency_', '');
      updated.emergencyPlan = { ...(updated.emergencyPlan || {}), [emField]: value };
    } else if (field === 'milestone_metric' || field === 'milestone_reward') {
      const mField = field.replace('milestone_', '');
      updated.monthlyMilestone = { ...(updated.monthlyMilestone || {}), [mField]: value };
    } else {
      updated[field] = value;
    }

    updateGoalMonthDetail(goalId, selectedGroup.id, updated);
    toast({ title: "Saved! ✅" });
  }, [selectedGroup, goal, goalId, updateGoalMonthDetail]);

  // Render immediately

  if (!goal) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <AlertTriangle className="w-10 h-10 text-amber-500" />
        <p className="text-sm text-slate-600">Goal not found</p>
        <button onClick={() => router.push('/home/goals')} className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold cursor-pointer">Go to Goals</button>
      </div>
    );
  }

  const roadmap = goal.roadmap;
  const totalSaved = goal.saved || 0;
  const completedCount = roadmap?.monthGroups?.filter(g => totalSaved >= g.cumulativeTarget).length || 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left py-2">
      {/* Back + Title */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.push('/home/goals')} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-all cursor-pointer">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="font-display text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            {goal.emoji} {goal.name} Roadmap
          </h1>
          <p className="text-xs text-slate-500">Month-grouped AI roadmap • Tap any phase for details</p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center py-20 space-y-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-blue-200 border-t-blue-500 animate-spin" />
            <Mountain className="absolute inset-0 m-auto w-7 h-7 text-blue-400" />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-white">Roadmap Ban Raha Hai...</p>
            <p className="text-xs text-zinc-500">AI month groups plan kar raha hai</p>
          </div>
        </div>

      ) : error ? (
        <div className="flex flex-col items-center py-20 space-y-4">
          <AlertTriangle className="w-10 h-10 text-red-400" />
          <p className="text-sm font-bold text-white">{error}</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 rounded-xl bg-white/5 text-xs font-bold text-white hover:bg-white/10">Retry</button>
        </div>

      ) : roadmap ? (
        <>
          {/* Summary Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3"
          >
            {[
              { icon: Target, label: 'Target', value: `₹${(goal.target || 0).toLocaleString('en-IN')}`, color: '#047857' },
              { icon: IndianRupee, label: 'Monthly', value: `₹${(roadmap.monthlySavingsRequired || 0).toLocaleString('en-IN')}`, color: '#C9861A' },
              { icon: Zap, label: 'Daily', value: `₹${(roadmap.dailyTarget || 0).toLocaleString('en-IN')}`, color: '#4F46E5' },
              { icon: Calendar, label: 'Months', value: roadmap.totalMonths || 0, color: '#059669' },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
                whileHover={{ y: -2 }}
                className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] text-center cursor-default"
              >
                <s.icon size={18} style={{ color: s.color }} className="mx-auto mb-1.5" />
                <p className="text-base font-extrabold font-display text-slate-900 tabular-nums">{s.value}</p>
                <p className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Ladder + Month Groups */}
          <div className="relative" style={{ minHeight: (roadmap.monthGroups?.length || 4) * 200 + 120 }}>
            {/* Ladder SVG */}
            <LadderSVG groups={roadmap.monthGroups} completedCount={completedCount} />

            {/* Month Group Cards */}
            <div className="relative z-10 space-y-6">
              {roadmap.monthGroups?.map((group, i) => {
                const done = totalSaved >= group.cumulativeTarget;
                const current = !done && (i === 0 || totalSaved >= roadmap.monthGroups[i - 1]?.cumulativeTarget);
                const isSelected = selectedGroup?.id === group.id;
                const hasDetail = !!goal.monthDetails?.[group.id];

                const diffMap = {
                  '🌱 Starter': { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800' },
                  '🔥 Hustler': { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700' },
                  '💎 Crusher': { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700' },
                  '🏆 Legend': { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800' },
                };
                const diff = diffMap[group.difficulty] || diffMap['🌱 Starter'];
                const progress = totalSaved >= group.cumulativeTarget ? 100 : Math.min(100, (totalSaved / group.cumulativeTarget) * 100);

                return (
                  <motion.div key={group.id}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40, y: 20 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {/* Group Card */}
                    <motion.div
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => {
                        if (isSelected) { setSelectedGroup(null); return; }
                        fetchMonthDetail(group);
                      }}
                      className={`relative p-5 sm:p-6 rounded-3xl border transition-all duration-300 cursor-pointer overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.03)] ${
                        isSelected
                          ? 'bg-emerald-50/40 border-emerald-300 shadow-md'
                          : done
                            ? 'bg-emerald-50/20 border-emerald-200'
                            : current
                              ? 'bg-amber-50/30 border-amber-200 shadow-sm'
                              : 'bg-white border-slate-200/90 hover:border-slate-300'
                      }`}
                    >
                      {/* Glow */}
                      {(done || current || isSelected) && (
                        <div className={`absolute -inset-px rounded-3xl blur-xl pointer-events-none ${isSelected ? 'bg-blue-50' : done ? 'bg-blue-600/5' : 'bg-amber-500/5'}`} />
                      )}

                      <div className="relative z-10">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <motion.div whileHover={{ rotate: [0, -10, 10, 0] }}
                              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-xs ${
                                done ? 'bg-emerald-50 border border-emerald-200'
                                  : current ? 'bg-amber-50 border border-amber-200'
                                    : 'bg-slate-50 border border-slate-200'
                              }`}
                            >{group.emoji}</motion.div>
                            <div>
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">{group.monthRange}</span>
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold ${diff.bg} border ${diff.border} ${diff.text}`}>{group.difficulty}</span>
                              </div>
                              <h3 className={`font-extrabold font-display text-base leading-tight ${done ? 'text-emerald-800' : current ? 'text-amber-800' : 'text-slate-900'}`}>
                                {group.title}
                              </h3>
                              <p className="text-[11px] text-slate-500 mt-0.5">{group.subtitle}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {done && <CheckCircle2 size={18} className="text-emerald-600" />}
                            {hasDetail && !isSelected && <span className="text-[9px] text-emerald-700 font-bold">✓ Detailed</span>}
                            <motion.div animate={{ rotate: isSelected ? 90 : 0 }}>
                              <ChevronRight size={16} className={isSelected ? 'text-emerald-700' : 'text-slate-400'} />
                            </motion.div>
                          </div>
                        </div>

                        {/* Overview */}
                        <p className="text-xs text-slate-600 leading-relaxed mb-3">{group.overview}</p>

                        {/* Progress */}
                        <div className="mb-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                          <div className="flex justify-between text-[10px] font-extrabold mb-1.5">
                            <span className="text-slate-500 tabular-nums">₹{(totalSaved).toLocaleString('en-IN')} / ₹{(group.cumulativeTarget || 0).toLocaleString('en-IN')}</span>
                            <span style={{ color: progress >= 100 ? '#047857' : '#C9861A' }} className="tabular-nums">{Math.round(progress)}%</span>
                          </div>
                          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }}
                              transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                              className="h-full rounded-full"
                              style={{ background: done ? '#047857' : '#F59E0B' }}
                            />
                          </div>
                        </div>

                        {/* Key habit + avoid */}
                        <div className="flex flex-col sm:flex-row gap-2">
                          {group.keyHabit && (
                            <div className="flex-1 flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/70">
                              <Flame size={12} className="text-emerald-700 shrink-0" />
                              <span className="text-[10px] font-bold text-emerald-900 truncate">{group.keyHabit}</span>
                            </div>
                          )}
                          {group.whatToAvoid && (
                            <div className="flex-1 flex items-center gap-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200/70">
                              <AlertTriangle size={12} className="text-rose-600 shrink-0" />
                              <span className="text-[10px] font-bold text-rose-800 truncate">{group.whatToAvoid}</span>
                            </div>
                          )}
                        </div>

                        {group.motivation && (
                          <p className="mt-2.5 text-[10px] text-amber-700 italic text-center font-medium">{group.motivation}</p>
                        )}
                      </div>
                    </motion.div>

                    {/* Detail Panel (inline expansion) */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="pt-4">
                            <MonthDetailPanel
                              group={group}
                              detail={goal.monthDetails?.[group.id]}
                              loading={detailLoading}
                              goalId={goalId}
                              onSaveDetail={handleSaveDetail}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Warnings + Tips */}
          <div className="space-y-4">
            {roadmap.warnings && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-4 space-y-2 shadow-xs">
                <span className="text-xs font-bold text-rose-900 flex items-center gap-2"><Shield size={14} className="text-rose-600" /> Important Warnings</span>
                {roadmap.warnings.map((w, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                    <span>{w.emoji}</span>
                    <div><span className="font-bold text-rose-700">{w.title}: </span>{w.detail}</div>
                  </div>
                ))}
              </div>
            )}

            {roadmap.proTips && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 space-y-2 shadow-xs">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-2"><Sparkles size={14} className="text-amber-600" /> Pro Tips</span>
                {roadmap.proTips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                    <Star size={12} className="text-amber-500 mt-0.5 shrink-0 fill-amber-400" /><span>{tip}</span>
                  </div>
                ))}
              </div>
            )}

            {roadmap.motivation && (
              <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 text-center shadow-xs">
                <Trophy size={24} className="text-amber-500 mx-auto mb-2" />
                <p className="text-xs text-slate-700 font-medium leading-relaxed">{roadmap.motivation}</p>
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}

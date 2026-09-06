"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

// ════════════════════════════════════════════════════════════════════════
// 1. ANIMATED COIN FLIP — For "What is Money" intro
// ════════════════════════════════════════════════════════════════════════
export function AnimatedCoinFlip({ color = '#F59E0B' }) {
  const [flipped, setFlipped] = useState(false);
  
  return (
    <div className="relative w-full h-48 flex items-center justify-center">
      <motion.div
        className="relative w-32 h-32 cursor-pointer"
        style={{ perspective: 600 }}
        onClick={() => setFlipped(!flipped)}
      >
        <motion.div
          className="w-full h-full relative"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front — Rupee */}
          <motion.div
            className="absolute inset-0 rounded-full flex items-center justify-center"
            style={{
              backfaceVisibility: 'hidden',
              background: `linear-gradient(135deg, ${color}, ${color}dd)`,
              boxShadow: `0 8px 32px ${color}40`
            }}
          >
            <span className="text-5xl font-black text-white drop-shadow-lg">₹</span>
          </motion.div>
          {/* Back — Value */}
          <motion.div
            className="absolute inset-0 rounded-full flex items-center justify-center"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              background: `linear-gradient(135deg, #10B981, #059669)`,
              boxShadow: '0 8px 32px rgba(16,185,129,0.4)'
            }}
          >
            <span className="text-2xl font-bold text-white text-center px-2">Trust</span>
          </motion.div>
        </motion.div>
      </motion.div>
      <motion.p
        className="absolute bottom-4 text-xs text-slate-400 font-medium"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Tap the coin
      </motion.p>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 2. EVOLUTION TIMELINE — For money evolution, income types
// ════════════════════════════════════════════════════════════════════════
export function EvolutionTimeline({ steps, color = '#3B82F6' }) {
  return (
    <div className="w-full py-4">
      {steps.map((step, i) => (
        <motion.div
          key={i}
          className="flex items-start gap-3 mb-4 last:mb-0"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.15, duration: 0.4 }}
        >
          <div className="flex flex-col items-center">
            <motion.div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
              style={{ backgroundColor: color }}
              whileHover={{ scale: 1.1 }}
            >
              {step.icon || i + 1}
            </motion.div>
            {i < steps.length - 1 && (
              <motion.div
                className="w-0.5 h-8 mt-1"
                style={{ backgroundColor: `${color}30` }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: i * 0.15 + 0.2, duration: 0.3 }}
              />
            )}
          </div>
          <div className="pt-1.5">
            <p className="text-sm font-bold text-slate-800">{step.title}</p>
            <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 3. COMPARISON SPLIT — For Active vs Passive, Need vs Want
// ════════════════════════════════════════════════════════════════════════
export function ComparisonSplit({ left, right, leftColor = '#EF4444', rightColor = '#10B981' }) {
  return (
    <div className="w-full grid grid-cols-2 gap-3">
      <motion.div
        className="rounded-2xl p-4 border-2"
        style={{ borderColor: `${leftColor}30`, backgroundColor: `${leftColor}08` }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: leftColor }}>
            <span className="text-white text-sm">✕</span>
          </div>
          <h4 className="text-sm font-bold" style={{ color: leftColor }}>{left.title}</h4>
        </div>
        {left.items.map((item, i) => (
          <motion.div
            key={i}
            className="flex items-start gap-2 mb-2 last:mb-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.1 }}
          >
            <span className="text-xs mt-0.5" style={{ color: leftColor }}>•</span>
            <span className="text-xs text-slate-600">{item}</span>
          </motion.div>
        ))}
      </motion.div>
      <motion.div
        className="rounded-2xl p-4 border-2"
        style={{ borderColor: `${rightColor}30`, backgroundColor: `${rightColor}08` }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: rightColor }}>
            <span className="text-white text-sm">✓</span>
          </div>
          <h4 className="text-sm font-bold" style={{ color: rightColor }}>{right.title}</h4>
        </div>
        {right.items.map((item, i) => (
          <motion.div
            key={i}
            className="flex items-start gap-2 mb-2 last:mb-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.1 }}
          >
            <span className="text-xs mt-0.5" style={{ color: rightColor }}>•</span>
            <span className="text-xs text-slate-600">{item}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 4. ANIMATED BAR CHART — For UPI growth, inflation, income comparison
// ════════════════════════════════════════════════════════════════════════
export function AnimatedBarChart({ bars, color = '#3B82F6', maxValue }) {
  const max = maxValue || Math.max(...bars.map(b => b.value));
  
  return (
    <div className="w-full space-y-3 py-2">
      {bars.map((bar, i) => (
        <motion.div
          key={i}
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <span className="text-xs font-medium text-slate-500 w-16 text-right shrink-0">{bar.label}</span>
          <div className="flex-1 h-7 bg-slate-100 rounded-full overflow-hidden relative">
            <motion.div
              className="h-full rounded-full flex items-center justify-end pr-2"
              style={{ backgroundColor: bar.color || color }}
              initial={{ width: 0 }}
              animate={{ width: `${(bar.value / max) * 100}%` }}
              transition={{ delay: i * 0.1 + 0.2, duration: 0.6, ease: 'easeOut' }}
            >
              <span className="text-[10px] font-bold text-white drop-shadow-sm">{bar.valueLabel || bar.value}</span>
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 5. ANIMATED PIE CHART — For 50/30/20 budget rule
// ════════════════════════════════════════════════════════════════════════
export function AnimatedPieChart({ slices, size = 140 }) {
  const total = slices.reduce((sum, s) => sum + s.value, 0);
  let cumulativePercent = 0;
  
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
          {slices.map((slice, i) => {
            const percent = (slice.value / total) * 100;
            const dashArray = `${percent} ${100 - percent}`;
            const dashOffset = -cumulativePercent;
            cumulativePercent += percent;
            
            return (
              <motion.circle
                key={i}
                cx="18" cy="18" r="15.915"
                fill="none"
                stroke={slice.color}
                strokeWidth="3.5"
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                initial={{ strokeDasharray: '0, 100' }}
                animate={{ strokeDasharray: dashArray }}
                transition={{ delay: i * 0.2, duration: 0.8, ease: 'easeOut' }}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-slate-700">100%</span>
        </div>
      </div>
      <div className="space-y-2">
        {slices.map((slice, i) => (
          <motion.div
            key={i}
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 + 0.3 }}
          >
            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: slice.color }} />
            <span className="text-xs font-medium text-slate-600">{slice.label}</span>
            <span className="text-xs font-bold text-slate-800">{slice.value}%</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 6. FLOWCHART NODES — For decision trees, processes
// ════════════════════════════════════════════════════════════════════════
export function FlowchartNodes({ nodes, color = '#3B82F6' }) {
  return (
    <div className="w-full overflow-x-auto py-4">
      <div className="relative min-w-[300px] h-[200px]">
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {nodes.filter(n => n.edges).map((node, i) => (
            node.edges.map((edgeIdx, ei) => {
              const target = nodes[edgeIdx];
              if (!target) return null;
              return (
                <motion.line
                  key={`${i}-${ei}`}
                  x1={`${node.x + 40}px`}
                  y1={`${node.y + 20}px`}
                  x2={`${target.x + 40}px`}
                  y2={`${target.y + 20}px`}
                  stroke={color}
                  strokeWidth="1.5"
                  strokeDasharray="4,4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.5 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                />
              );
            })
          ))}
        </svg>
        {nodes.map((node, i) => (
          <motion.div
            key={i}
            className="absolute px-3 py-2 rounded-xl text-xs font-bold text-white shadow-lg"
            style={{
              left: node.x,
              top: node.y,
              backgroundColor: node.color || color,
              minWidth: 70,
              textAlign: 'center'
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.1, type: 'spring', stiffness: 200 }}
            whileHover={{ scale: 1.05 }}
          >
            {node.label}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 7. STAT COUNTER — For big numbers (UPI transactions, savings)
// ════════════════════════════════════════════════════════════════════════
export function StatCounter({ value, label, suffix = '', color = '#3B82F6' }) {
  const [count, setCount] = useState(0);
  const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
  
  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const increment = numericValue / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= numericValue) {
        setCount(numericValue);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [numericValue]);
  
  const formatted = value.includes('.')
    ? count.toFixed(1)
    : Math.floor(count).toLocaleString();
  
  return (
    <motion.div
      className="text-center py-4"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
    >
      <motion.p
        className="text-4xl font-black tabular-nums"
        style={{ color }}
      >
        {formatted}{suffix}
      </motion.p>
      <p className="text-xs text-slate-500 mt-1 font-medium">{label}</p>
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 8. CHECKLIST ANIMATED — For missions, action items
// ════════════════════════════════════════════════════════════════════════
export function AnimatedChecklist({ items, color = '#10B981' }) {
  const [checked, setChecked] = useState({});
  
  return (
    <div className="w-full space-y-2">
      {items.map((item, i) => (
        <motion.div
          key={i}
          className="flex items-start gap-3 p-2 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08 }}
          onClick={() => setChecked(prev => ({ ...prev, [i]: !prev[i] }))}
        >
          <motion.div
            className="w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5"
            style={{
              borderColor: checked[i] ? color : '#cbd5e1',
              backgroundColor: checked[i] ? color : 'transparent'
            }}
            animate={{ scale: checked[i] ? [1, 1.2, 1] : 1 }}
          >
            {checked[i] && (
              <motion.svg
                width="10" height="8" viewBox="0 0 10 8"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
              >
                <motion.path
                  d="M1 4L3.5 6.5L9 1"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
            )}
          </motion.div>
          <span className={`text-sm leading-relaxed transition-colors ${checked[i] ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
            {item}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 9. INCOME STACK — For showing income sources
// ════════════════════════════════════════════════════════════════════════
export function IncomeStack({ sources, color = '#10B981' }) {
  return (
    <div className="w-full space-y-2">
      {sources.map((source, i) => (
        <motion.div
          key={i}
          className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100 shadow-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          whileHover={{ x: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{ backgroundColor: `${color}15` }}>
            {source.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">{source.name}</p>
            <p className="text-xs text-slate-500">{source.type}</p>
          </div>
          <span className="text-sm font-bold shrink-0" style={{ color }}>{source.amount}</span>
        </motion.div>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 10. BUDGET GAUGE — For showing budget allocation
// ════════════════════════════════════════════════════════════════════════
export function BudgetGauge({ segments, total = 100 }) {
  return (
    <div className="w-full">
      <div className="flex h-8 rounded-full overflow-hidden shadow-inner">
        {segments.map((seg, i) => (
          <motion.div
            key={i}
            className="relative flex items-center justify-center overflow-hidden"
            style={{ backgroundColor: seg.color }}
            initial={{ width: 0 }}
            animate={{ width: `${(seg.value / total) * 100}%` }}
            transition={{ delay: i * 0.15, duration: 0.6, ease: 'easeOut' }}
          >
            <span className="text-[10px] font-bold text-white drop-shadow-sm whitespace-nowrap px-1">
              {seg.label} {seg.value}%
            </span>
          </motion.div>
        ))}
      </div>
      <div className="flex flex-wrap gap-3 mt-3">
        {segments.map((seg, i) => (
          <motion.div
            key={i}
            className="flex items-center gap-1.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 + 0.4 }}
          >
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: seg.color }} />
            <span className="text-[11px] text-slate-600">{seg.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 11. MYTH BUSTER — For myth vs reality cards
// ════════════════════════════════════════════════════════════════════════
export function MythBuster({ myth, reality, mythColor = '#EF4444', realityColor = '#10B981' }) {
  const [revealed, setRevealed] = useState(false);
  
  return (
    <div className="w-full space-y-3">
      <motion.div
        className="p-4 rounded-2xl border-2"
        style={{ borderColor: `${mythColor}30`, backgroundColor: `${mythColor}08` }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">❌</span>
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: mythColor }}>Myth</span>
        </div>
        <p className="text-sm text-slate-700 font-medium">{myth}</p>
      </motion.div>
      
      <motion.div
        className="cursor-pointer"
        onClick={() => setRevealed(true)}
      >
        {!revealed ? (
          <motion.div
            className="p-4 rounded-2xl border-2 border-dashed border-slate-200 text-center"
            whileHover={{ borderColor: realityColor, scale: 1.01 }}
          >
            <motion.p
              className="text-sm font-medium text-slate-400"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Tap to reveal the truth
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            className="p-4 rounded-2xl border-2"
            style={{ borderColor: `${realityColor}30`, backgroundColor: `${realityColor}08` }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">✅</span>
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: realityColor }}>Reality</span>
            </div>
            <p className="text-sm text-slate-700 font-medium">{reality}</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 12. METER GAUGE — For inflation, savings progress
// ════════════════════════════════════════════════════════════════════════
export function MeterGauge({ value, max = 100, label, color = '#3B82F6', showValue = true }) {
  const percent = (value / max) * 100;
  
  return (
    <div className="w-full">
      <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs text-slate-500">{label}</span>
        {showValue && (
          <motion.span
            className="text-sm font-bold"
            style={{ color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {value}
          </motion.span>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 13. FLOATING PARTICLES — Background decoration
// ════════════════════════════════════════════════════════════════════════
export function FloatingParticles({ count = 5, color = '#3B82F6' }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-20"
          style={{
            backgroundColor: color,
            width: 4 + Math.random() * 8,
            height: 4 + Math.random() * 8,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, Math.random() * 10 - 5, 0],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2
          }}
        />
      ))}
    </div>
  );
}

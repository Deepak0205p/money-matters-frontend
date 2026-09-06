"use client";

import { motion } from 'framer-motion';
import { useState } from 'react';

// ════════════════════════════════════════════════════════════════════════
// EVOLUTION TIMELINE — Barter → Gold → Paper → UPI
// ════════════════════════════════════════════════════════════════════════
export function EvolutionTimeline({ color = '#3B82F6' }) {
  const steps = [
    { icon: '🔄', label: 'Barter', desc: 'Goods for goods' },
    { icon: '🪙', label: 'Gold', desc: 'Intrinsic value' },
    { icon: '💵', label: 'Paper', desc: 'Govt backed' },
    { icon: '📱', label: 'UPI', desc: 'Instant digital' },
  ];

  return (
    <div className="w-full py-4 px-2">
      <div className="flex items-center justify-between relative">
        {/* Connecting line */}
        <motion.div
          className="absolute top-5 left-[10%] right-[10%] h-0.5"
          style={{ backgroundColor: `${color}30` }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
        {steps.map((step, i) => (
          <motion.div
            key={i}
            className="flex flex-col items-center z-10 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2, duration: 0.5, type: 'spring' }}
          >
            <motion.div
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg bg-white border-2 shadow-md"
              style={{ borderColor: color }}
              whileHover={{ scale: 1.15, boxShadow: `0 4px 20px ${color}40` }}
            >
              {step.icon}
            </motion.div>
            <p className="text-[10px] font-bold text-slate-700 mt-1.5 text-center">{step.label}</p>
            <p className="text-[9px] text-slate-400 text-center">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// UPI GROWTH BAR CHART — Animated bars
// ════════════════════════════════════════════════════════════════════════
export function UpiGrowthChart({ color = '#10B981' }) {
  const bars = [
    { label: '2020', value: 18, display: '18B' },
    { label: '2022', value: 74, display: '74B' },
    { label: '2024', value: 131, display: '131B' },
  ];
  const max = 150;

  return (
    <div className="w-full space-y-3 py-3 px-1">
      {bars.map((bar, i) => (
        <motion.div
          key={i}
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.15, duration: 0.4 }}
        >
          <span className="text-xs font-bold text-slate-500 w-10 text-right">{bar.label}</span>
          <div className="flex-1 h-8 bg-slate-100 rounded-full overflow-hidden relative">
            <motion.div
              className="h-full rounded-full flex items-center justify-end pr-3"
              style={{ backgroundColor: color }}
              initial={{ width: 0 }}
              animate={{ width: `${(bar.value / max) * 100}%` }}
              transition={{ delay: i * 0.15 + 0.2, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <span className="text-xs font-black text-white drop-shadow-sm">{bar.display}</span>
            </motion.div>
          </div>
        </motion.div>
      ))}
      <motion.p
        className="text-[10px] text-slate-400 text-center mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Transactions in Billions — India leads global digital payments
      </motion.p>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 5 FUNCTIONS OF MONEY — Animated cards
// ════════════════════════════════════════════════════════════════════════
export function FiveFunctionsOfMoney({ color = '#3B82F6' }) {
  const functions = [
    { icon: '🛒', title: 'Medium of Exchange', desc: 'Buy stuff — Pay ₹20 for tea' },
    { icon: '📏', title: 'Unit of Account', desc: 'Measure value — Phone costs ₹15k' },
    { icon: '🏦', title: 'Store of Value', desc: 'Save it — Keep ₹5k in bank' },
    { icon: '⏰', title: 'Deferred Payment', desc: 'Pay later — ₹1k monthly EMI' },
    { icon: '📲', title: 'Transfer of Value', desc: 'Send anywhere — GPay to Friend' },
  ];

  return (
    <div className="w-full space-y-2 py-3">
      {functions.map((fn, i) => (
        <motion.div
          key={i}
          className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-slate-100 shadow-sm"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1, duration: 0.4, type: 'spring' }}
          whileHover={{ scale: 1.02, boxShadow: `0 2px 12px ${color}15` }}
        >
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0"
            style={{ backgroundColor: `${color}12` }}
          >
            {fn.icon}
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800">{fn.title}</p>
            <p className="text-[10px] text-slate-500">{fn.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// INFLATION EROSION — Animated shrinking bars
// ════════════════════════════════════════════════════════════════════════
export function InflationErosion({ color = '#EF4444' }) {
  const data = [
    { label: 'Today', value: 100, display: '₹100' },
    { label: '1 Year', value: 94, display: '₹94' },
    { label: '3 Years', value: 84, display: '₹84' },
    { label: '5 Years', value: 75, display: '₹75' },
    { label: '10 Years', value: 56, display: '₹56' },
  ];

  return (
    <div className="w-full space-y-2.5 py-3 px-1">
      {data.map((d, i) => (
        <motion.div
          key={i}
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.12 }}
        >
          <span className="text-[10px] font-bold text-slate-500 w-14 text-right">{d.label}</span>
          <div className="flex-1 h-7 bg-slate-100 rounded-full overflow-hidden relative">
            <motion.div
              className="h-full rounded-full flex items-center justify-end pr-2"
              style={{
                backgroundColor: i === 0 ? '#10B981' : i < 3 ? '#F59E0B' : '#EF4444'
              }}
              initial={{ width: 0 }}
              animate={{ width: `${d.value}%` }}
              transition={{ delay: i * 0.12 + 0.2, duration: 0.7, ease: 'easeOut' }}
            >
              <span className="text-[10px] font-black text-white drop-shadow-sm">{d.display}</span>
            </motion.div>
          </div>
        </motion.div>
      ))}
      <motion.div
        className="flex items-center gap-2 mt-2 px-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="w-2 h-2 rounded-full bg-red-500" />
        <p className="text-[10px] text-red-500 font-semibold">₹44 purchasing power lost in 10 years at 6% inflation</p>
      </motion.div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// COMPARISON SPLIT — Active vs Passive, Fixed vs Variable
// ════════════════════════════════════════════════════════════════════════
export function ComparisonSplit({ left, right, leftColor = '#EF4444', rightColor = '#10B981' }) {
  return (
    <div className="w-full grid grid-cols-2 gap-2.5 py-2">
      <motion.div
        className="rounded-xl p-3 border-2"
        style={{ borderColor: `${leftColor}30`, backgroundColor: `${leftColor}06` }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: leftColor }}>
            <span className="text-white text-xs">✕</span>
          </div>
          <h4 className="text-xs font-bold" style={{ color: leftColor }}>{left.title}</h4>
        </div>
        {left.items.map((item, i) => (
          <motion.div
            key={i}
            className="flex items-start gap-1.5 mb-1.5 last:mb-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.08 }}
          >
            <span className="text-[10px] mt-0.5" style={{ color: leftColor }}>•</span>
            <span className="text-[10px] text-slate-600 leading-snug">{item}</span>
          </motion.div>
        ))}
      </motion.div>
      <motion.div
        className="rounded-xl p-3 border-2"
        style={{ borderColor: `${rightColor}30`, backgroundColor: `${rightColor}06` }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: rightColor }}>
            <span className="text-white text-xs">✓</span>
          </div>
          <h4 className="text-xs font-bold" style={{ color: rightColor }}>{right.title}</h4>
        </div>
        {right.items.map((item, i) => (
          <motion.div
            key={i}
            className="flex items-start gap-1.5 mb-1.5 last:mb-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.08 }}
          >
            <span className="text-[10px] mt-0.5" style={{ color: rightColor }}>•</span>
            <span className="text-[10px] text-slate-600 leading-snug">{item}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 50/30/20 PIE CHART — Animated donut
// ════════════════════════════════════════════════════════════════════════
export function BudgetPieChart({ color = '#10B981' }) {
  const slices = [
    { label: 'Needs', value: 50, color: '#3B82F6' },
    { label: 'Wants', value: 30, color: '#F59E0B' },
    { label: 'Savings', value: 20, color: '#10B981' },
  ];
  let cumulative = 0;

  return (
    <div className="flex flex-col items-center gap-3 py-3">
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
          <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="4" />
          {slices.map((slice, i) => {
            const percent = slice.value;
            const dashArray = `${percent} ${100 - percent}`;
            const dashOffset = -cumulative;
            cumulative += percent;
            return (
              <motion.circle
                key={i}
                cx="18" cy="18" r="15.915"
                fill="none"
                stroke={slice.color}
                strokeWidth="4"
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                initial={{ strokeDasharray: '0, 100' }}
                animate={{ strokeDasharray: dashArray }}
                transition={{ delay: i * 0.25, duration: 0.8, ease: 'easeOut' }}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-black text-slate-700">100%</span>
        </div>
      </div>
      <div className="flex gap-4">
        {slices.map((slice, i) => (
          <motion.div
            key={i}
            className="flex items-center gap-1.5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 + 0.5 }}
          >
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: slice.color }} />
            <span className="text-[10px] font-bold text-slate-600">{slice.label}</span>
            <span className="text-[10px] font-black" style={{ color: slice.color }}>{slice.value}%</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 3-QUESTION TEST FLOWCHART — Decision tree
// ════════════════════════════════════════════════════════════════════════
export function ThreeQuestionFlowchart({ color = '#EF4444' }) {
  return (
    <div className="w-full py-3 px-2">
      <div className="relative min-w-[280px]">
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ height: 200 }}>
          {/* Connecting lines */}
          <motion.path d="M 140 35 L 140 65" stroke={color} strokeWidth="1.5" strokeDasharray="3,3"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 0.4 }} />
          <motion.path d="M 95 85 L 55 115" stroke="#10B981" strokeWidth="1.5" strokeDasharray="3,3"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5, duration: 0.4 }} />
          <motion.path d="M 185 85 L 225 115" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3,3"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5, duration: 0.4 }} />
          <motion.path d="M 55 135 L 55 160" stroke="#10B981" strokeWidth="1.5" strokeDasharray="3,3"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.7, duration: 0.3 }} />
          <motion.path d="M 225 135 L 225 160" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3,3"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.7, duration: 0.3 }} />
        </svg>
        {/* Nodes */}
        {[
          { x: 90, y: 10, label: 'Expense?', bg: color, w: 100 },
          { x: 20, y: 65, label: 'NEED', bg: '#10B981', w: 70 },
          { x: 190, y: 65, label: 'WANT', bg: '#F59E0B', w: 70 },
          { x: 5, y: 115, label: 'Buy it', bg: '#10B981', w: 60 },
          { x: 195, y: 115, label: '48hr Rule', bg: '#F59E0B', w: 80 },
          { x: 20, y: 160, label: '✅ Done', bg: '#10B981', w: 70 },
          { x: 190, y: 160, label: 'Still want?', bg: '#F59E0B', w: 80 },
        ].map((node, i) => (
          <motion.div
            key={i}
            className="absolute px-2 py-1.5 rounded-lg text-[9px] font-bold text-white text-center shadow-sm"
            style={{ left: node.x, top: node.y, backgroundColor: node.bg, minWidth: node.w }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.12, type: 'spring', stiffness: 200 }}
          >
            {node.label}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// PAY YOURSELF FIRST — Animated flow
// ════════════════════════════════════════════════════════════════════════
export function PayYourselfFirst({ color = '#8B5CF6' }) {
  const steps = [
    { icon: '💰', label: 'Income Arrives', desc: '₹10,000' },
    { icon: '🏦', label: 'Save First', desc: '₹2,000 auto-debit' },
    { icon: '🛒', label: 'Then Spend', desc: '₹8,000 for expenses' },
    { icon: '📈', label: '5 Years Later', desc: '₹1,40,000 saved!' },
  ];

  return (
    <div className="w-full py-3">
      <div className="flex items-center justify-between relative">
        <motion.div
          className="absolute top-5 left-[12%] right-[12%] h-0.5"
          style={{ backgroundColor: `${color}25` }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2 }}
        />
        {steps.map((step, i) => (
          <motion.div
            key={i}
            className="flex flex-col items-center z-10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.2, type: 'spring' }}
          >
            <motion.div
              className="w-10 h-10 rounded-full flex items-center justify-center text-base bg-white border-2 shadow"
              style={{ borderColor: i === 3 ? '#10B981' : color }}
              whileHover={{ scale: 1.15 }}
            >
              {step.icon}
            </motion.div>
            <p className="text-[9px] font-bold text-slate-700 mt-1 text-center w-16">{step.label}</p>
            <p className="text-[8px] text-slate-400 text-center w-16">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// COIN FLIP — Interactive ₹ coin
// ════════════════════════════════════════════════════════════════════════
export function CoinFlip({ color = '#F59E0B' }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="relative w-full h-44 flex items-center justify-center">
      <motion.div
        className="relative w-28 h-28 cursor-pointer"
        style={{ perspective: 600 }}
        onClick={() => setFlipped(!flipped)}
      >
        <motion.div
          className="w-full h-full relative"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <motion.div
            className="absolute inset-0 rounded-full flex items-center justify-center"
            style={{
              backfaceVisibility: 'hidden',
              background: `linear-gradient(135deg, ${color}, ${color}cc)`,
              boxShadow: `0 6px 24px ${color}40`
            }}
          >
            <span className="text-4xl font-black text-white drop-shadow">₹</span>
          </motion.div>
          <motion.div
            className="absolute inset-0 rounded-full flex items-center justify-center"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              background: 'linear-gradient(135deg, #10B981, #059669)',
              boxShadow: '0 6px 24px rgba(16,185,129,0.4)'
            }}
          >
            <span className="text-xl font-bold text-white text-center px-2">Trust</span>
          </motion.div>
        </motion.div>
      </motion.div>
      <motion.p
        className="absolute bottom-2 text-[10px] text-slate-400 font-medium"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Tap the coin
      </motion.p>
    </div>
  );
}

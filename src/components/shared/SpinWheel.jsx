'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Sparkles, Clock, Flame } from 'lucide-react';
import { useAppStore } from '@/lib/store/useAppStore';
import { toast } from '@/hooks/use-toast';

const SEGMENTS = [
  {
    id: 'c50',
    label: '+50 Coins',
    emoji: '🪙',
    color: '#F59E0B',
    type: 'coins',
    coinAmount: 50
  },
  {
    id: 'tip',
    label: 'Financial Tip',
    emoji: '💡',
    color: '#3B82F6',
    type: 'tip'
  },
  {
    id: 'c100',
    label: '+100 Coins',
    emoji: '💰',
    color: '#2563eb',
    type: 'coins',
    coinAmount: 100
  },
  {
    id: 'badge',
    label: 'Mystery Badge',
    emoji: '🎁',
    color: '#8B5CF6',
    type: 'badge'
  },
  {
    id: 'c25',
    label: '+25 Coins',
    emoji: '🪙',
    color: '#FCD34D',
    type: 'coins',
    coinAmount: 25
  },
  {
    id: 'shield',
    label: 'Streak Shield',
    emoji: '🛡️',
    color: '#06B6D4',
    type: 'shield'
  },
  {
    id: 'unlock',
    label: 'Tool Unlock',
    emoji: '🔓',
    color: '#EC4899',
    type: 'unlock'
  },
  {
    id: 'retry',
    label: 'Better Luck!',
    emoji: '😅',
    color: '#64748B',
    type: 'retry'
  }
];

const TIPS = [
  'SIP mein consistency > timing. Regular invest karo!',
  'Emergency fund = 6 mahine ka kharcha. Pehle yeh!',
  'Credit card ka hamesha full pay karo — minimum = trap!',
  '50-30-20 rule: Needs 50%, Wants 30%, Savings 20%.',
  'Insurance zaroori hai — medical emergency = savings killer!',
  'FD se MF better — long-term mein returns zyada.',
  'Lifestyle inflation se bacho — income badhi to kharcha nahi.',
  'Tax saving ke liye PPF aur ELSS best options hain.'
];

const SEG_COUNT = SEGMENTS.length;
const SEG_ANGLE = 360 / SEG_COUNT;
const DAILY_COOLDOWN = 24 * 60 * 60 * 1000; // 24 hours

function ConfettiBurst() {
  const pieces = Array.from({ length: 36 }, (_, i) => i);
  const colors = ['#F59E0B', '#2563eb', '#8B5CF6', '#EF4444', '#34D399', '#FCD34D'];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-50">
      {pieces.map(i => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full animate-ping"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            backgroundColor: colors[i % colors.length],
            animationDelay: `${Math.random() * 0.6}s`,
            transform: `rotate(${Math.random() * 360}deg)`
          }}
        />
      ))}
    </div>
  );
}

function formatCountdown(ms) {
  if (ms <= 0) return 'Abhi spin kar sakte ho!';
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export default function SpinWheel({ open, onClose }) {
  const {
    lastSpinTime,
    totalSpins,
    spinWinnings,
    setLastSpinTime,
    incrementTotalSpins,
    addSpinWinnings,
    addBadge,
    addCoins
  } = useAppStore();

  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [history, setHistory] = useState([]);
  const [tipMessage, setTipMessage] = useState('');
  const tickRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setNow(Date.now());
    tickRef.current = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [open]);

  const cooldownLeft = Math.max(0, DAILY_COOLDOWN - (now - (lastSpinTime || 0)));
  const canSpin = cooldownLeft === 0 && !spinning;

  const handleSpin = useCallback(() => {
    if (!canSpin || spinning) return;
    setSpinning(true);
    setResult(null);
    setShowConfetti(false);

    const winIdx = Math.floor(Math.random() * SEG_COUNT);
    const winningSegment = SEGMENTS[winIdx];

    const fullSpins = 5 + Math.floor(Math.random() * 3);
    const targetAngle = 360 - (winIdx * SEG_ANGLE + SEG_ANGLE / 2);
    const newRotation = rotation + fullSpins * 360 + (targetAngle - (rotation % 360));
    setRotation(newRotation);

    setTimeout(() => {
      setSpinning(false);
      setResult(winningSegment);
      setLastSpinTime(Date.now());
      incrementTotalSpins();

      if (winningSegment.type === 'coins' && winningSegment.coinAmount) {
        addSpinWinnings(winningSegment.coinAmount);
        addCoins(winningSegment.coinAmount);
      } else if (winningSegment.type === 'badge') {
        addBadge(`mystery-badge-${Date.now()}`);
        addCoins(20);
      } else if (winningSegment.type === 'shield') {
        addBadge('streak-shield');
        addCoins(20);
      } else if (winningSegment.type === 'tip') {
        setTipMessage(TIPS[Math.floor(Math.random() * TIPS.length)]);
      }

      const entry = {
        id: `spin-${Date.now()}`,
        emoji: winningSegment.emoji,
        label: winningSegment.label,
        color: winningSegment.color,
        time: new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit'
        })
      };
      setHistory(h => [entry, ...h].slice(0, 8));

      if (winningSegment.type !== 'retry') {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }, 4500);
  }, [canSpin, spinning, rotation, setLastSpinTime, incrementTotalSpins, addSpinWinnings, addBadge, addCoins]);

  const handleClaim = useCallback(() => {
    setResult(null);
  }, []);

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
        {/* Header */}
        <div className="shrink-0 px-6 py-4 border-b border-slate-100 bg-slate-50/80 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center">
              <Gift size={20} className="text-amber-600" />
            </div>
            <div>
              <h2 className="text-base font-black font-display text-slate-900">Kismat Chakra 🎡</h2>
              <p className="text-[11px] font-medium text-slate-500">Roz ek free spin — win coins and badges!</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-all focus:outline-none"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scroll">
          {/* Wheel Frame */}
          <div className="relative w-full aspect-square max-w-[260px] mx-auto mb-4 flex items-center justify-center">
            {showConfetti && <ConfettiBurst />}

            {/* Pointer */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[22px] border-t-amber-500 drop-shadow-md" />

            {/* Rotating Wheel Container */}
            <div className="absolute inset-0 rounded-full border-4 border-amber-200 shadow-md flex items-center justify-center">
              <motion.div
                className="w-full h-full rounded-full overflow-hidden"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: spinning ? 'transform 4.5s cubic-bezier(0.12, 0.8, 0.33, 1)' : 'none'
                }}
              >
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  {SEGMENTS.map((seg, i) => {
                    const startAngle = (i * 360) / SEGMENTS.length;
                    const endAngle = ((i + 1) * 360) / SEGMENTS.length;
                    const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
                    const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
                    const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
                    const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);

                    return (
                      <path
                        key={seg.id}
                        d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`}
                        fill={seg.color}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                    );
                  })}
                </svg>

                {SEGMENTS.map((seg, i) => {
                  const angle = (i * 360) / SEGMENTS.length + 360 / (SEGMENTS.length * 2);
                  return (
                    <div
                      key={seg.id}
                      className="absolute w-full h-full flex items-start justify-center pt-3 text-center pointer-events-none"
                      style={{
                        transform: `rotate(${angle}deg)`
                      }}
                    >
                      <span className="text-sm select-none filter drop-shadow-sm font-bold text-white">
                        {seg.emoji}
                      </span>
                    </div>
                  );
                })}
              </motion.div>
            </div>

            {/* Center Pin Button */}
            <button
              onClick={handleSpin}
              disabled={spinning || !canSpin}
              className="absolute z-10 w-16 h-16 rounded-full bg-white border-4 border-amber-300 shadow-xl flex flex-col items-center justify-center cursor-pointer transition-transform active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              <Sparkles size={16} className="text-amber-500 animate-spin" />
              <span className="text-[9px] font-black uppercase text-slate-800 tracking-wider">
                {spinning ? '...' : canSpin ? 'SPIN' : 'WAIT'}
              </span>
            </button>
          </div>

          {/* Action / Countdown Container */}
          <div className="text-center pt-2">
            {canSpin ? (
              <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black uppercase tracking-wider">
                <Sparkles size={14} className="text-emerald-600" /> Free Spin Available!
              </div>
            ) : (
              <div className="px-6 py-4 bg-slate-50 border border-slate-200/90 rounded-2xl inline-flex items-center gap-3 text-left">
                <Clock size={16} className="text-amber-600" />
                <div>
                  <p className="text-xs font-black text-slate-900 uppercase tracking-wider">Next Spin Ready Kal!</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                    Spin in: {formatCountdown(cooldownLeft)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Spin Result Display */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="p-5 rounded-3xl border text-center space-y-3 relative overflow-hidden bg-slate-50 border-slate-200/90 shadow-sm"
              >
                <span className="text-5xl block animate-bounce">{result.emoji}</span>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">CONGRATULATIONS</span>
                <h3 className="text-base font-black font-display text-slate-900">{result.label} Won!</h3>

                {result.type === 'coins' && result.coinAmount && (
                  <p className="text-xs font-black text-emerald-700">+ {result.coinAmount} Coins added to balance!</p>
                )}
                {result.type === 'tip' && (
                  <div className="p-3 rounded-2xl bg-white border border-slate-200 text-[11px] text-slate-700 leading-relaxed font-semibold italic text-left">
                    🧠 {tipMessage || TIPS[0]}
                  </div>
                )}
                {result.type === 'badge' && (
                  <p className="text-xs font-black text-purple-700">Naya badge added to Sammaan Gallery! 🏆</p>
                )}
                {result.type === 'shield' && (
                  <p className="text-xs font-black text-cyan-700">Streak Shield active! Daily checklist skipped shield 🛡️</p>
                )}
                {result.type === 'retry' && (
                  <p className="text-xs font-black text-slate-500">Koi baat nahi, consistency is the key! 💪</p>
                )}

                <button
                  onClick={handleClaim}
                  className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black uppercase tracking-wider transition-all shadow-xs active:scale-95 cursor-pointer"
                >
                  Claim Prize ✓
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mini Stats Panel */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/90 text-center space-y-0.5">
              <span className="text-[9px] text-slate-500 font-black uppercase tracking-wider block">Total Spins</span>
              <span className="text-sm font-black font-display text-slate-900">{totalSpins}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/90 text-center space-y-0.5">
              <span className="text-[9px] text-slate-500 font-black uppercase tracking-wider block">Spin Winnings</span>
              <span className="text-sm font-black text-amber-600 font-display">{spinWinnings} 🪙</span>
            </div>
          </div>

          {/* History log */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
              <Sparkles size={12} className="text-amber-600" /> Spin History
            </h4>

            {history.length === 0 ? (
              <p className="text-[11px] text-slate-400 text-center py-4 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                Spin now to fill spin logs history!
              </p>
            ) : (
              <div className="space-y-2 max-h-36 overflow-y-auto custom-scroll">
                {history.map((h) => (
                  <div 
                    key={h.id} 
                    className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-200/90 justify-between text-left"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span 
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0 border border-slate-200 bg-white"
                      >
                        {h.emoji}
                      </span>
                      <span className="text-xs font-black text-slate-900 truncate">{h.label}</span>
                    </div>
                    <span className="text-[9px] text-slate-500 font-bold shrink-0">{h.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 px-6 py-4 border-t border-slate-100 bg-slate-50/80 backdrop-blur-md flex items-center justify-center text-center">
          <p className="text-[10px] text-slate-500 font-bold tracking-wide">
            Kismat Chakra — spins are restricted to 1 spin per user account daily
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export { SpinWheel };
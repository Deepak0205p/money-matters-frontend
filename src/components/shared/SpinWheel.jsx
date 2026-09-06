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
    id: 'mystery',
    label: 'Mystery Box',
    emoji: '🎁',
    color: '#8B5CF6',
    type: 'mystery'
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
    id: 'c200',
    label: '+200 Coins',
    emoji: '💎',
    color: '#EC4899',
    type: 'coins',
    coinAmount: 200
  },
  {
    id: 'retry',
    label: 'Lucky Spin',
    emoji: '⚡',
    color: '#10B981',
    type: 'coins',
    coinAmount: 10
  }
];

const MYSTERY_REWARDS = [
  { coins: 150, title: 'Mega Coin Vault!', desc: '150 Gold Coins unlocked from Mystery Box! 🪙' },
  { coins: 250, title: 'Jackpot Mystery!', desc: '250 Coins + Diamond Tier Badge awarded! 💎' },
  { coins: 100, title: 'Mystery Knowledge Pack!', desc: '100 Coins + Secret Finance Power-Up! 🚀' }
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

export default function SpinWheel({ open, onClose }) {
  const {
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
  const [history, setHistory] = useState([]);
  const [tipMessage, setTipMessage] = useState('');
  const [mysteryReward, setMysteryReward] = useState(null);

  const canSpin = !spinning;

  const handleSpin = useCallback(() => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);
    setShowConfetti(false);
    setMysteryReward(null);

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
      } else if (winningSegment.type === 'mystery') {
        const randomMystery = MYSTERY_REWARDS[Math.floor(Math.random() * MYSTERY_REWARDS.length)];
        setMysteryReward(randomMystery);
        addSpinWinnings(randomMystery.coins);
        addCoins(randomMystery.coins);
        addBadge('mystery-box-champion');
      } else if (winningSegment.type === 'shield') {
        addBadge('streak-shield');
        addCoins(30);
        addSpinWinnings(30);
      } else if (winningSegment.type === 'tip') {
        setTipMessage(TIPS[Math.floor(Math.random() * TIPS.length)]);
        addCoins(10);
        addSpinWinnings(10);
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

      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }, 4500);
  }, [spinning, rotation, setLastSpinTime, incrementTotalSpins, addSpinWinnings, addBadge, addCoins]);

  const handleClaim = useCallback(() => {
    setResult(null);
    setMysteryReward(null);
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
              <p className="text-[11px] font-medium text-slate-500">Spin the wheel and win coins, mystery boxes & badges!</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-all focus:outline-none cursor-pointer"
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
            <div className="absolute inset-0 rounded-full border-4 border-amber-300 shadow-xl flex items-center justify-center bg-slate-900 overflow-hidden">
              <motion.div
                className="w-full h-full rounded-full relative"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: spinning ? 'transform 4.5s cubic-bezier(0.12, 0.8, 0.33, 1)' : 'none'
                }}
              >
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  <defs>
                    <filter id="segmentShadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="0" stdDeviation="0.5" floodColor="#000" floodOpacity="0.2" />
                    </filter>
                  </defs>
                  {SEGMENTS.map((seg, i) => {
                    const startAngle = (i * 360) / SEGMENTS.length;
                    const endAngle = ((i + 1) * 360) / SEGMENTS.length;
                    const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
                    const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
                    const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
                    const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);

                    // Mid angle for text
                    const midAngle = startAngle + (endAngle - startAngle) / 2;
                    const rad = (Math.PI * midAngle) / 180;
                    const textX = 50 + 31 * Math.cos(rad);
                    const textY = 50 + 31 * Math.sin(rad);
                    const emojiX = 50 + 41 * Math.cos(rad);
                    const emojiY = 50 + 41 * Math.sin(rad);

                    return (
                      <g key={seg.id}>
                        <path
                          d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`}
                          fill={seg.color}
                          stroke="#ffffff"
                          strokeWidth="1.2"
                        />
                        {/* Emoji icon */}
                        <text
                          x={emojiX}
                          y={emojiY}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fontSize="5.5"
                          transform={`rotate(${midAngle + 90}, ${emojiX}, ${emojiY})`}
                        >
                          {seg.emoji}
                        </text>
                        {/* Text label */}
                        <text
                          x={textX}
                          y={textY}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fill="#ffffff"
                          fontSize="3.2"
                          fontWeight="900"
                          letterSpacing="0.2"
                          filter="url(#segmentShadow)"
                          transform={`rotate(${midAngle + 90}, ${textX}, ${textY})`}
                        >
                          {seg.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </motion.div>
            </div>

            {/* Center Pin Button */}
            <button
              onClick={handleSpin}
              disabled={spinning}
              className="absolute z-10 w-16 h-16 rounded-full bg-white border-4 border-amber-300 shadow-xl flex flex-col items-center justify-center cursor-pointer transition-transform active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              <Sparkles size={16} className="text-amber-500 animate-spin" />
              <span className="text-[9px] font-black uppercase text-slate-800 tracking-wider">
                {spinning ? '...' : 'SPIN'}
              </span>
            </button>
          </div>

          {/* Action Callout */}
          <div className="text-center pt-2">
            <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black uppercase tracking-wider">
              <Sparkles size={14} className="text-emerald-600" /> Instant Spin Available!
            </div>
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

                {result.type === 'mystery' && mysteryReward && (
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 text-center space-y-1">
                    <p className="text-xs font-black text-purple-900">{mysteryReward.title}</p>
                    <p className="text-[11px] font-bold text-purple-700">{mysteryReward.desc}</p>
                    <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-black">
                      + {mysteryReward.coins} Coins & Mystery Badge Added!
                    </span>
                  </div>
                )}

                {result.type === 'tip' && (
                  <div className="p-3 rounded-2xl bg-white border border-slate-200 text-[11px] text-slate-700 leading-relaxed font-semibold italic text-left">
                    🧠 {tipMessage || TIPS[0]}
                  </div>
                )}

                {result.type === 'shield' && (
                  <p className="text-xs font-black text-cyan-700">Streak Shield active! Daily checklist skipped shield 🛡️ (+30 Coins)</p>
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
            Kismat Chakra — Spin to test your luck and unlock rewards
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export { SpinWheel };
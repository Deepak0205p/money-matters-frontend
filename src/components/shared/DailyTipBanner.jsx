'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RefreshCw, Lightbulb } from 'lucide-react';
import { useAppStore } from '@/lib/store/useAppStore';

// ─── 35 Hinglish Financial Tips ──────────────────────────────────────────
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const DAILY_TIPS = [{
  emoji: '💰',
  text: 'A ₹500/month SIP can grow to ₹17 lakh in 20 years!'
}, {
  emoji: '🎯',
  text: 'Emergency fund = 6 months of expenses. Build this first!'
}, {
  emoji: '📊',
  text: 'Rule of 72: 72 ÷ return rate = years to double your money'
}, {
  emoji: '🚫',
  text: 'Never pay only the minimum on your credit card — it\'s a debt trap!'
}, {
  emoji: '🏦',
  text: 'Invest in PPF — tax-free returns with government guarantee!'
}, {
  emoji: '💡',
  text: '50/30/20 Rule: 50% needs, 30% wants, 20% savings'
}, {
  emoji: '📈',
  text: 'Time matters in SIP, not timing. Start early!'
}, {
  emoji: '🛡️',
  text: 'Insurance is essential — both life and health coverage!'
}, {
  emoji: '🧮',
  text: 'Einstein said: Compound interest is the 8th wonder of the world!'
}, {
  emoji: '💸',
  text: 'Pay yourself first — save 20% of your income before spending'
}, {
  emoji: '🔥',
  text: 'Inflation is the real thief of your money — invest, don\'t just save!'
}, {
  emoji: '📱',
  text: 'Digital gold is real gold — start with just ₹10 via Sovereign Gold Bond!'
}, {
  emoji: '🎓',
  text: 'Taking a student loan? Find part-time work before EMIs begin!'
}, {
  emoji: '🏠',
  text: 'Planning to buy a home? A 20% down payment is essential!'
}, {
  emoji: '💳',
  text: 'Pay your credit card bill in full — no interest within the grace period!'
}, {
  emoji: '🎰',
  text: 'Lottery and gambling don\'t make you rich — 99% of people lose money!'
}, {
  emoji: '📉',
  text: 'Don\'t panic when markets fall — staying in your SIP is the smart move!'
}, {
  emoji: '🤝',
  text: 'Anyone promising guaranteed high returns is likely a fraud — be careful!'
}, {
  emoji: '📚',
  text: 'Financial literacy will protect you for life — keep learning!'
}, {
  emoji: '⏰',
  text: 'A ₹5000/month SIP at 25 = ₹3.5 Crore by age 60!'
}, {
  emoji: '🏦',
  text: 'Money in a savings account sleeps — in a mutual fund, it works!'
}, {
  emoji: '🎯',
  text: 'Budget every month — without a plan, money just disappears!'
}, {
  emoji: '💡',
  text: 'Mutual funds are great, but KYC is mandatory — start with your PAN card!'
}, {
  emoji: '🚨',
  text: 'Look at the total EMI cost, not just the monthly amount — it adds up fast!'
}, {
  emoji: '🌟',
  text: 'Build side income — never depend on a single source!'
}, {
  emoji: '📋',
  text: 'Use Section 80C for tax savings — ELSS + PPF is the best combo!'
}, {
  emoji: '💪',
  text: 'Even small savings have a big impact — consistency is key!'
}, {
  emoji: '🔄',
  text: 'Review your portfolio every year — rebalancing is essential!'
}, {
  emoji: '💰',
  text: 'Avoid lifestyle inflation — when income rises, raise your savings too!'
}, {
  emoji: '🧠',
  text: 'Buy Now Pay Later = spending tomorrow\'s money today — use with caution!'
}, {
  emoji: '📊',
  text: 'Nifty 50 index fund = simplest and most effective investment for beginners!'
}, {
  emoji: '🎁',
  text: 'Employer PF matching is free money — claim it all, don\'t leave it behind!'
}, {
  emoji: '🔑',
  text: 'Financial freedom = passive income > expenses — that\'s the ultimate goal!'
}, {
  emoji: '🌍',
  text: 'Don\'t forget diversification — never put all your eggs in one basket!'
}];

// Get today's tip index based on date
function getDailyTipIndex() {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  return dayOfYear % DAILY_TIPS.length;
}
const AUTO_ROTATE_INTERVAL = 30000; // 30 seconds

export function DailyTipBanner() {
  const {
    dismissedTipDate,
    setDismissedTipDate
  } = useAppStore();
  const [tipIndex, setTipIndex] = useState(getDailyTipIndex());
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [locallyDismissed, setLocallyDismissed] = useState(false);
  const timerRef = useRef(null);

  // Check if today's tip was already dismissed (from persisted store)
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  const isDismissedFromStore = dismissedTipDate === today;
  const isDismissed = isDismissedFromStore || locallyDismissed;

  // Auto-rotate tips
  useEffect(() => {
    if (isPaused || isHovered || isDismissed) return;
    timerRef.current = setInterval(() => {
      setTipIndex(prev => (prev + 1) % DAILY_TIPS.length);
    }, AUTO_ROTATE_INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, isHovered, isDismissed]);
  const handleDismiss = useCallback(() => {
    setLocallyDismissed(true);
    setDismissedTipDate(today);
  }, [setDismissedTipDate, today]);
  const handleNextTip = useCallback(() => {
    setTipIndex(prev => (prev + 1) % DAILY_TIPS.length);
  }, []);
  const currentTip = DAILY_TIPS[tipIndex];
  if (isDismissed) return null;
  return /*#__PURE__*/_jsx(AnimatePresence, {
    children: !locallyDismissed && /*#__PURE__*/_jsxs(motion.div, {
      initial: {
        opacity: 0,
        y: -20,
        height: 0
      },
      animate: {
        opacity: 1,
        y: 0,
        height: 'auto'
      },
      exit: {
        opacity: 0,
        y: -20,
        height: 0
      },
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 30
      },
      className: "relative overflow-hidden",
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false),
      children: [/*#__PURE__*/_jsx("div", {
        className: "absolute inset-0 bg-gradient-to-r from-[#f59e0b]/10 via-[#fbbf24]/8 to-[#d97706]/10"
      }), /*#__PURE__*/_jsx("div", {
        className: "absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0f]/30"
      }), /*#__PURE__*/_jsx("div", {
        className: "absolute inset-0 overflow-hidden pointer-events-none",
        children: [...Array(6)].map((_, i) => /*#__PURE__*/_jsx(motion.div, {
          className: "absolute w-1 h-1 rounded-full bg-[#fbbf24]",
          style: {
            left: `${15 + i * 15}%`,
            top: '50%'
          },
          animate: {
            y: [0, -8, 0],
            opacity: [0, 0.6, 0],
            scale: [0.5, 1, 0.5]
          },
          transition: {
            duration: 2 + i * 0.3,
            repeat: Infinity,
            delay: i * 0.4,
            ease: 'easeInOut'
          }
        }, i))
      }), /*#__PURE__*/_jsxs("div", {
        className: "relative px-4 py-2.5 flex items-center gap-3 max-w-4xl mx-auto",
        children: [/*#__PURE__*/_jsx(motion.div, {
          className: "shrink-0 w-7 h-7 rounded-lg bg-[#f59e0b]/15 border border-[#f59e0b]/20 flex items-center justify-center",
          animate: {
            rotate: [0, -8, 8, -8, 0]
          },
          transition: {
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3
          },
          children: /*#__PURE__*/_jsx(Lightbulb, {
            size: 13,
            className: "text-[#fbbf24]"
          })
        }), /*#__PURE__*/_jsx("div", {
          className: "flex-1 min-w-0",
          children: /*#__PURE__*/_jsx(AnimatePresence, {
            mode: "wait",
            children: /*#__PURE__*/_jsxs(motion.div, {
              initial: {
                opacity: 0,
                x: 20
              },
              animate: {
                opacity: 1,
                x: 0
              },
              exit: {
                opacity: 0,
                x: -20
              },
              transition: {
                duration: 0.3
              },
              className: "flex items-center gap-2",
              children: [/*#__PURE__*/_jsx("span", {
                className: "text-sm",
                children: currentTip.emoji
              }), /*#__PURE__*/_jsx("p", {
                className: "text-xs sm:text-sm text-[#e8e8ed] leading-relaxed",
                children: currentTip.text
              })]
            }, tipIndex)
          })
        }), /*#__PURE__*/_jsxs("div", {
          className: "shrink-0 flex items-center gap-1",
          children: [/*#__PURE__*/_jsx(motion.button, {
            onClick: handleNextTip,
            className: "p-1.5 rounded-lg text-[#8888a0] hover:text-[#fbbf24] hover:bg-[#f59e0b]/10 transition-colors",
            whileHover: {
              scale: 1.1,
              rotate: 180
            },
            whileTap: {
              scale: 0.9
            },
            "aria-label": "Next tip",
            onMouseEnter: () => setIsPaused(true),
            onMouseLeave: () => setIsPaused(false),
            children: /*#__PURE__*/_jsx(RefreshCw, {
              size: 13
            })
          }), /*#__PURE__*/_jsx(motion.button, {
            onClick: handleDismiss,
            className: "p-1.5 rounded-lg text-[#8888a0] hover:text-white hover:bg-white/10 transition-colors",
            whileHover: {
              scale: 1.1
            },
            whileTap: {
              scale: 0.9
            },
            "aria-label": "Dismiss tip",
            children: /*#__PURE__*/_jsx(X, {
              size: 13
            })
          })]
        })]
      }), /*#__PURE__*/_jsx("div", {
        className: "absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#f59e0b]/30 to-transparent"
      })]
    })
  });
}
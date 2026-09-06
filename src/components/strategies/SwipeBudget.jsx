'use client';

import { useState, useCallback } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { expenseCards } from '@/lib/data/expense-cards';
import { useAppStore } from '@/lib/store/useAppStore';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RotateCcw, Trophy, ArrowRight, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';

// ─── Swipe threshold ─────────────────────────────────────
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const SWIPE_THRESHOLD = 100;

// ─── Difficulty colors ───────────────────────────────────
const difficultyConfig = {
  easy: {
    color: 'bg-blue-100 text-blue-400 border-blue-200',
    label: 'Easy'
  },
  medium: {
    color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    label: 'Medium'
  },
  hard: {
    color: 'bg-red-500/20 text-red-400 border-red-500/30',
    label: 'Hard'
  }
};

// ─── Category emoji map ──────────────────────────────────
const categoryEmoji = {
  food: '🍕',
  tech: '💻',
  entertainment: '🎬',
  health: '🏥',
  education: '📚',
  transport: '🚌',
  clothing: '👕',
  subscription: '📱',
  'self-care': '💆',
  social: '🎉',
  home: '🏠',
  fitness: '🏃'
};

// ─── Animation variants ──────────────────────────────────
const cardVariants = {
  enter: {
    scale: 0.95,
    opacity: 0,
    y: 30
  },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0
  },
  exitLeft: {
    x: -600,
    rotate: -30,
    opacity: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut'
    }
  },
  exitRight: {
    x: 600,
    rotate: 30,
    opacity: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut'
    }
  }
};
const resultVariants = {
  hidden: {
    rotateY: 90,
    opacity: 0
  },
  visible: {
    rotateY: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  },
  exit: {
    scale: 0.8,
    opacity: 0,
    transition: {
      duration: 0.3
    }
  }
};
export default function SwipeBudget() {
  // ─── State ────────────────────────────────────────────
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [lastAnswer, setLastAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [direction, setDirection] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // ─── Store ────────────────────────────────────────────
  const {
    swipeScore,
    swipeTotal,
    setSwipeScore,
    addCoins
  } = useAppStore();

  // ─── Current card data ────────────────────────────────
  const currentCard = expenseCards[currentIndex];
  const cardsRemaining = expenseCards.length - currentIndex;
  const progressPercent = currentIndex / expenseCards.length * 100;

  // ─── Motion values for drag ───────────────────────────
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-15, 0, 15]);
  const wantOpacity = useTransform(x, [-200, -100, 0], [1, 0.5, 0]);
  const needOpacity = useTransform(x, [0, 100, 200], [0, 0.5, 1]);

  // ─── Handle answer submission ─────────────────────────
  const handleAnswer = useCallback(answer => {
    if (isAnimating || showResult || isComplete) return;
    const correct = answer === currentCard.correctAnswer;
    const newScore = correct ? score + 1 : score;
    const newTotal = total + 1;
    setLastAnswer(answer);
    setIsCorrect(correct);
    setDirection(answer === 'want' ? 'left' : 'right');
    setShowResult(true);
    setScore(newScore);
    setTotal(newTotal);
    setIsAnimating(true);

    // Persist to store
    setSwipeScore(newScore, newTotal);

    // Award coins for correct answers
    if (correct) {
      addCoins(5);
    }
  }, [isAnimating, showResult, isComplete, currentCard, score, total, setSwipeScore, addCoins]);

  // ─── Proceed to next card ─────────────────────────────
  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= expenseCards.length) {
      setIsComplete(true);
      setIsAnimating(false);
      return;
    }
    setCurrentIndex(prev => prev + 1);
    setShowResult(false);
    setLastAnswer(null);
    setDirection(null);
    x.set(0);
    setIsAnimating(false);
  }, [currentIndex, x]);

  // ─── Reset game ───────────────────────────────────────
  const handleReset = useCallback(() => {
    setCurrentIndex(0);
    setScore(0);
    setTotal(0);
    setShowResult(false);
    setLastAnswer(null);
    setIsCorrect(false);
    setDirection(null);
    setIsAnimating(false);
    setIsComplete(false);
    x.set(0);
    setSwipeScore(0, 0);
  }, [x, setSwipeScore]);

  // ─── Drag end handler ─────────────────────────────────
  const handleDragEnd = useCallback((_, info) => {
    const offset = info.offset.x;
    if (offset < -SWIPE_THRESHOLD) {
      handleAnswer('want');
    } else if (offset > SWIPE_THRESHOLD) {
      handleAnswer('need');
    }
    // If not past threshold, snap back
    if (Math.abs(offset) < SWIPE_THRESHOLD) {
      x.set(0);
    }
  }, [handleAnswer, x]);

  // ─── Completion screen ────────────────────────────────
  if (isComplete) {
    const accuracy = total > 0 ? Math.round(score / total * 100) : 0;
    return /*#__PURE__*/_jsxs("div", {
      className: "flex flex-col items-center justify-center min-h-[500px] p-6 text-center",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "relative",
        children: [[0, 1, 2, 3, 4, 5].map(i => /*#__PURE__*/_jsx("div", {
          className: "absolute pointer-events-none",
          style: {
            left: `${-30 + i * 20}px`,
            top: `${-30 + i % 2 * 20}px`,
            animation: `confettiBurst ${0.6 + i * 0.1}s ease-out forwards`,
            animationDelay: `${i * 0.1}s`
          },
          children: /*#__PURE__*/_jsx("span", {
            className: "text-lg",
            children: ['🎉', '✨', '🎊', '⭐', '💰', '🏆'][i]
          })
        }, i)), /*#__PURE__*/_jsx(motion.div, {
          initial: {
            scale: 0
          },
          animate: {
            scale: 1
          },
          transition: {
            type: 'spring',
            stiffness: 200,
            damping: 15
          },
          children: /*#__PURE__*/_jsx(Trophy, {
            className: "w-20 h-20 text-amber-600 mx-auto mb-4"
          })
        })]
      }), /*#__PURE__*/_jsx("h2", {
        className: "text-2xl font-black text-slate-900 mb-2",
        children: "Khel Khatam! 🎉"
      }), /*#__PURE__*/_jsxs("p", {
        className: "text-lg text-slate-600 mb-6 font-semibold",
        children: ["Tumhara score: ", /*#__PURE__*/_jsxs("span", {
          className: "text-amber-700 font-bold",
          children: [score, "/", total]
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "bg-white border border-slate-200/90 shadow-2xs rounded-2xl p-6 w-full max-w-sm mb-6",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "text-4xl font-black text-slate-900 mb-2",
          children: [accuracy, "%"]
        }), /*#__PURE__*/_jsx("div", {
          className: "text-slate-500 text-sm font-semibold",
          children: "Accuracy"
        }), /*#__PURE__*/_jsx(Progress, {
          value: accuracy,
          className: "mt-3 h-3 bg-slate-100 [&>div]:bg-emerald-600"
        })]
      }), /*#__PURE__*/_jsx("p", {
        className: "text-slate-600 text-sm mb-6 font-medium",
        children: accuracy >= 80 ? 'Wah! Tum financial ninja ho! 🥷' : accuracy >= 60 ? 'Accha hai! Practice aur karo! 💪' : 'Seekhte raho, ek din expert banoge! 📈'
      }), /*#__PURE__*/_jsxs(Button, {
        onClick: handleReset,
        className: "bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-xs",
        children: [/*#__PURE__*/_jsx(RotateCcw, {
          className: "w-4 h-4 mr-2"
        }), "Phir Se Khel"]
      })]
    });
  }

  // ─── Main game UI ─────────────────────────────────────
  const accuracy = total > 0 ? Math.round(score / total * 100) : 0;
  const diffConfig = difficultyConfig[currentCard.difficulty];
  return /*#__PURE__*/_jsxs("div", {
    className: "flex flex-col items-center w-full max-w-lg mx-auto px-3 sm:px-4 py-4 select-none",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "w-full flex items-center justify-between mb-4",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "flex items-center gap-2",
        children: [/*#__PURE__*/_jsx(Trophy, {
          className: "w-5 h-5 text-amber-600"
        }), /*#__PURE__*/_jsxs("span", {
          className: "text-slate-900 font-bold",
          children: [score, "/", total, " correct"]
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "flex items-center gap-2",
        children: [/*#__PURE__*/_jsxs("span", {
          className: "text-emerald-700 font-bold text-sm",
          children: [currentIndex + 1, " of ", expenseCards.length]
        }), /*#__PURE__*/_jsxs("div", {
          className: "text-slate-500 text-sm font-semibold",
          children: [accuracy, "% accuracy"]
        })]
      })]
    }), /*#__PURE__*/_jsx("div", {
      className: "w-full h-px bg-slate-200 my-1"
    }), /*#__PURE__*/_jsxs("div", {
      className: "w-full mb-4",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "flex items-center justify-between text-xs text-slate-500 mb-1 font-semibold",
        children: [/*#__PURE__*/_jsxs("span", {
          children: ["Card ", currentIndex + 1, " of ", expenseCards.length]
        }), /*#__PURE__*/_jsxs("span", {
          children: [cardsRemaining, " bache hain"]
        })]
      }), /*#__PURE__*/_jsx(Progress, {
        value: progressPercent,
        className: "h-2 bg-slate-100 [&>div]:bg-emerald-600"
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "swipe-card-stack relative w-full h-[300px] sm:h-[360px] flex items-center justify-center mb-4",
      children: [[2, 1].map(offset => {
        const bgIndex = currentIndex + offset;
        if (bgIndex >= expenseCards.length) return null;
        return /*#__PURE__*/_jsx("div", {
          className: "absolute rounded-2xl border border-slate-200/80 bg-slate-100 shadow-2xs",
          style: {
            width: 'calc(100% - 32px)',
            height: 'calc(100% - 40px)',
            transform: `scale(${1 - offset * 0.05}) translateY(${offset * 8}px)`,
            zIndex: 10 - offset,
            opacity: 0.7 - offset * 0.2
          }
        }, `bg-${bgIndex}`);
      }), /*#__PURE__*/_jsx(motion.div, {
        className: "absolute left-4 top-1/2 -translate-y-1/2 z-30 pointer-events-none",
        style: {
          opacity: wantOpacity
        },
        children: /*#__PURE__*/_jsx("div", {
          className: "bg-rose-500 text-white font-black text-base sm:text-lg px-3.5 py-2 rounded-xl rotate-[-15deg] shadow-lg shadow-rose-500/30",
          children: "WANT 🛍️"
        })
      }), /*#__PURE__*/_jsx(motion.div, {
        className: "absolute right-4 top-1/2 -translate-y-1/2 z-30 pointer-events-none",
        style: {
          opacity: needOpacity
        },
        children: /*#__PURE__*/_jsx("div", {
          className: "bg-emerald-600 text-white font-black text-base sm:text-lg px-3.5 py-2 rounded-xl rotate-[15deg] shadow-lg shadow-emerald-500/30",
          children: "NEED ✅"
        })
      }), /*#__PURE__*/_jsx(AnimatePresence, {
        mode: "wait",
        children: !showResult ?
        /*#__PURE__*/
        /* ── Swipeable Card ─────────────────────── */
        _jsx(motion.div, {
          className: "absolute z-20 w-[calc(100%-16px)] h-[calc(100%-16px)] cursor-grab active:cursor-grabbing",
          variants: cardVariants,
          initial: "enter",
          animate: "visible",
          exit: direction === 'left' ? 'exitLeft' : 'exitRight',
          style: {
            x,
            rotate
          },
          drag: isAnimating ? false : 'x',
          dragConstraints: {
            left: 0,
            right: 0
          },
          dragElastic: 0.9,
          onDragEnd: handleDragEnd,
          children: /*#__PURE__*/_jsxs("div", {
            className: "w-full h-full rounded-2xl border border-slate-200/90 bg-white p-6 flex flex-col justify-between shadow-sm",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex items-center justify-between",
              children: [/*#__PURE__*/_jsxs(Badge, {
                variant: "outline",
                className: "bg-slate-50 text-slate-700 border-slate-200 text-xs font-semibold",
                children: [categoryEmoji[currentCard.category] || '💰', ' ', currentCard.category.charAt(0).toUpperCase() + currentCard.category.slice(1)]
              }), /*#__PURE__*/_jsx(Badge, {
                variant: "outline",
                className: cn('text-xs border font-semibold', diffConfig.color),
                children: diffConfig.label
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "flex-1 flex flex-col items-center justify-center text-center px-2",
              children: [/*#__PURE__*/_jsx("span", {
                className: "text-2xl mb-2",
                children: categoryEmoji[currentCard.category] || '💰'
              }), /*#__PURE__*/_jsx("h3", {
                className: "text-xl sm:text-2xl font-black text-slate-900 leading-tight mb-3",
                children: currentCard.item
              }), /*#__PURE__*/_jsx("p", {
                className: "text-3xl sm:text-4xl font-black text-emerald-800",
                children: currentCard.amount
              })]
            }), /*#__PURE__*/_jsxs("div", {
              className: "flex items-center justify-between text-xs text-slate-500 font-semibold",
              children: [/*#__PURE__*/_jsxs("span", {
                className: "flex items-center gap-1 text-rose-600 font-bold",
                children: [/*#__PURE__*/_jsx(ArrowLeft, {
                  className: "w-3 h-3"
                }), " WANT 🛍️"]
              }), /*#__PURE__*/_jsx("span", {
                className: "text-slate-400 font-medium",
                children: "← Swipe →"
              }), /*#__PURE__*/_jsxs("span", {
                className: "flex items-center gap-1 text-emerald-700 font-bold",
                children: ["NEED ✅ ", /*#__PURE__*/_jsx(ArrowRight, {
                  className: "w-3 h-3"
                })]
              })]
            })]
          })
        }, `card-${currentIndex}`) :
        /*#__PURE__*/
        /* ── Result Card ────────────────────────── */
        _jsx(motion.div, {
          className: "absolute z-20 w-[calc(100%-16px)] h-[calc(100%-16px)]",
          variants: resultVariants,
          initial: "hidden",
          animate: "visible",
          exit: "exit",
          children: /*#__PURE__*/_jsxs("div", {
            className: cn('w-full h-full rounded-2xl border p-6 flex flex-col justify-between shadow-md', isCorrect ? 'bg-emerald-50/70 border-emerald-300' : 'bg-rose-50/70 border-rose-300'),
            children: [/*#__PURE__*/_jsx("div", {
              className: "flex items-center justify-center",
              children: isCorrect ? /*#__PURE__*/_jsxs("div", {
                className: "flex items-center gap-2 bg-emerald-100 border border-emerald-300 rounded-full px-4 py-2",
                children: [/*#__PURE__*/_jsx(CheckCircle2, {
                  className: "w-5 h-5 text-emerald-700"
                }), /*#__PURE__*/_jsx("span", {
                  className: "text-emerald-800 font-bold",
                  children: "Sahi Jawab! +5 coins"
                })]
              }) : /*#__PURE__*/_jsxs("div", {
                className: "flex items-center gap-2 bg-rose-100 border border-rose-300 rounded-full px-4 py-2",
                children: [/*#__PURE__*/_jsx(XCircle, {
                  className: "w-5 h-5 text-rose-600"
                }), /*#__PURE__*/_jsx("span", {
                  className: "text-rose-700 font-bold",
                  children: ["Galat! Tumne ", lastAnswer?.toUpperCase(), " bola"]
                })]
              })
            }), /*#__PURE__*/_jsxs("div", {
              className: "flex-1 flex flex-col items-center justify-center text-center px-2",
              children: [/*#__PURE__*/_jsx("h3", {
                className: "text-lg font-bold text-slate-900 mb-1",
                children: currentCard.item
              }), /*#__PURE__*/_jsx("p", {
                className: "text-2xl font-black text-slate-900 mb-4",
                children: currentCard.amount
              }), /*#__PURE__*/_jsx("div", {
                className: cn('inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm mb-4', currentCard.correctAnswer === 'need' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'),
                children: currentCard.correctAnswer === 'need' ? '✅ NEED hai' : '🛍️ WANT hai'
              }), /*#__PURE__*/_jsx("p", {
                className: "text-slate-700 text-sm leading-relaxed font-medium",
                children: currentCard.explanation
              })]
            }), /*#__PURE__*/_jsx(Button, {
              onClick: handleNext,
              className: cn('w-full font-bold shadow-xs', isCorrect ? 'bg-emerald-700 hover:bg-emerald-800 text-white' : 'bg-rose-600 hover:bg-rose-700 text-white'),
              children: currentIndex + 1 >= expenseCards.length ? 'Result Dekho' : 'Agle Card →'
            })]
          })
        }, `result-${currentIndex}`)
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "flex items-center gap-3 sm:gap-4 w-full max-w-sm",
      children: [/*#__PURE__*/_jsxs(Button, {
        onClick: () => handleAnswer('want'),
        disabled: isAnimating || showResult,
        className: "flex-1 h-14 text-base font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl border border-rose-600 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all",
        children: [/*#__PURE__*/_jsx(ArrowLeft, {
          className: "w-5 h-5 mr-1"
        }), "WANT 🛍️"]
      }), /*#__PURE__*/_jsxs(Button, {
        onClick: () => handleAnswer('need'),
        disabled: isAnimating || showResult,
        className: "flex-1 h-14 text-base font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl border border-emerald-700 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all",
        children: ["NEED ✅", /*#__PURE__*/_jsx(ArrowRight, {
          className: "w-5 h-5 ml-1"
        })]
      })]
    }), /*#__PURE__*/_jsxs("button", {
      onClick: handleReset,
      className: "mt-4 text-xs text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1 transition-colors",
      children: [/*#__PURE__*/_jsx(RotateCcw, {
        className: "w-3 h-3"
      }), "Shuru se karo"]
    })]
  });
}
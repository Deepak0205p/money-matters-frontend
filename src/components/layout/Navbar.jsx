'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Trophy, IndianRupee, Calculator, BarChart3, Target, CircleDot, Zap, PiggyBank, HeartPulse, Receipt, Brain, Newspaper, Type, ListOrdered, UserCheck, TrendingUp, Shield, Calendar, Construction } from 'lucide-react';
import { useAppStore } from '@/lib/store/useAppStore';
import { useProgress } from '@/lib/hooks/useProgress';
import { STRATEGY_REGISTRY } from '@/lib/data/strategyRegistry';
import CoinCounter from '@/components/shared/CoinCounter';
import ProgressRing from '@/components/shared/ProgressRing';
import { BadgeGallery } from '@/components/shared/BadgeGallery';
import { SIPCalculator } from '@/components/shared/SIPCalculator';
import { AchievementDashboard } from '@/components/shared/AchievementDashboard';
import { GoalTracker } from '@/components/shared/GoalTracker';
import { SpinWheel } from '@/components/shared/SpinWheel';
import { QuizArena } from '@/components/shared/QuizArena';
import SavingsChallenge from '@/components/shared/SavingsChallenge';
import ExpenseTracker from '@/components/shared/ExpenseTracker';
import HealthCheckup from '@/components/shared/HealthCheckup';
import MemoryMatch from '@/components/shared/MemoryMatch';
import WordScramble from '@/components/shared/WordScramble';
import FinancialNewsWidget from '@/components/shared/FinancialNewsWidget';
import PriorityCalculator from '@/components/shared/PriorityCalculator';
import FinancialAgeCalculator from '@/components/shared/FinancialAgeCalculator';
import InvestmentComparison from '@/components/shared/InvestmentComparison';
import EmergencyFundCalculator from '@/components/shared/EmergencyFundCalculator';
import HabitTracker from '@/components/shared/HabitTracker';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { LanguageSelector } from '@/components/LanguageSelector';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
function getAbbreviatedTitle(title) {
  const abbreviations = {
    'Paise Ka GPS': 'GPS',
    'Kya Hota Agar': 'Kya Hota',
    'Chhupa Hua Chor': 'Chor',
    'Budget Khel': 'Budget',
    'Ghar Ka Budget': 'Ghar Budget',
    'Debt Trap Ka Darwaza': 'Debt Trap',
    'Power of Compounding': 'Compound',
    'Financial Health Report Card': 'Report Card',
    'Rupaiya Dictionary': 'Dictionary',
    'Ek Din Ka Kharcha': 'Ek Din',
    'Mistake Market': 'Mistakes'
  };
  return abbreviations[title] || title;
}

// ────────────────────────────────────────────────────────────────────
// Tool registry — single source of truth for navbar tool buttons.
// Eliminates ~370 lines of repetitive per-button boilerplate.
// ────────────────────────────────────────────────────────────────────

const TOOLS = [{
  id: 'dashboard',
  Icon: BarChart3,
  label: 'Dashboard',
  tooltip: 'Dashboard',
  hover: 'hover:text-blue-600',
  hoverBg: 'hover:bg-blue-50',
  Component: AchievementDashboard
}, {
  id: 'goals',
  Icon: Target,
  label: 'Goals',
  tooltip: 'Goals',
  hover: 'hover:text-blue-600',
  hoverBg: 'hover:bg-blue-50',
  Component: GoalTracker
}, {
  id: 'health',
  Icon: HeartPulse,
  label: 'Health',
  tooltip: 'Health Checkup 🏥',
  hover: 'hover:text-rose-400',
  hoverBg: 'hover:bg-rose-400/10',
  Component: HealthCheckup
}, {
  id: 'expense',
  Icon: Receipt,
  label: 'Expense',
  tooltip: 'Kharcha Tracker 📝',
  hover: 'hover:text-blue-600',
  hoverBg: 'hover:bg-blue-50',
  Component: ExpenseTracker
}, {
  id: 'savings',
  Icon: PiggyBank,
  label: 'Savings',
  tooltip: 'Savings Challenge 💰',
  hover: 'hover:text-gold-soft',
  hoverBg: 'hover:bg-gold/10',
  Component: SavingsChallenge
}, {
  id: 'quiz',
  Icon: Zap,
  label: 'Quiz',
  tooltip: 'Quiz Arena ⚡',
  hover: 'hover:text-gold-soft',
  hoverBg: 'hover:bg-gold/10',
  Component: QuizArena
}, {
  id: 'spin',
  Icon: CircleDot,
  label: 'Spin',
  tooltip: 'Spin Wheel 🎰',
  hover: 'hover:text-gold-soft',
  hoverBg: 'hover:bg-gold/10',
  Component: SpinWheel
}, {
  id: 'memory',
  Icon: Brain,
  label: 'Memory',
  tooltip: 'Memory Match 🧠',
  hover: 'hover:text-ai-soft',
  hoverBg: 'hover:bg-ai/10',
  Component: MemoryMatch
}, {
  id: 'word',
  Icon: Type,
  label: 'Word',
  tooltip: 'Word Scramble 🔤',
  hover: 'hover:text-ai-soft',
  hoverBg: 'hover:bg-ai/10',
  Component: WordScramble
}, {
  id: 'news',
  Icon: Newspaper,
  label: 'News',
  tooltip: 'Financial News 📰',
  hover: 'hover:text-blue-600',
  hoverBg: 'hover:bg-blue-50',
  Component: FinancialNewsWidget
}, {
  id: 'priority',
  Icon: ListOrdered,
  label: 'Priority',
  tooltip: 'Priority Calculator 📊',
  hover: 'hover:text-gold-soft',
  hoverBg: 'hover:bg-gold/10',
  Component: PriorityCalculator
}, {
  id: 'invest',
  Icon: TrendingUp,
  label: 'Invest',
  tooltip: 'Invest Compare 📈',
  hover: 'hover:text-blue-600',
  hoverBg: 'hover:bg-blue-50',
  Component: InvestmentComparison
}, {
  id: 'emergency',
  Icon: Shield,
  label: 'Emergency',
  tooltip: 'Emergency Fund 🛡️',
  hover: 'hover:text-cyan-400',
  hoverBg: 'hover:bg-cyan-400/10',
  Component: EmergencyFundCalculator
}, {
  id: 'habit',
  Icon: Calendar,
  label: 'Habit',
  tooltip: 'Habit Tracker 📅',
  hover: 'hover:text-ai-soft',
  hoverBg: 'hover:bg-ai/10',
  Component: HabitTracker
}, {
  id: 'age',
  Icon: UserCheck,
  label: 'Fin Age',
  tooltip: 'Financial Age 🎂',
  hover: 'hover:text-gold-soft',
  hoverBg: 'hover:bg-gold/10',
  Component: FinancialAgeCalculator
}, {
  id: 'sip',
  Icon: Calculator,
  label: 'SIP',
  tooltip: 'SIP Calculator',
  hover: 'hover:text-blue-600',
  hoverBg: 'hover:bg-blue-50',
  Component: SIPCalculator
}];

// Trophy/badge button is special (has a count badge) so handle separately.
// ────────────────────────────────────────────────────────────────────

export function Navbar() {
  const router = useRouter();
  const {
    activeStrategy,
    setActiveStrategy,
    coins,
    badges
  } = useAppStore();
  const {
    completionPercentage
  } = useProgress();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openTool, setOpenTool] = useState(null);
  const [badgeGalleryOpen, setBadgeGalleryOpen] = useState(false);
  const tabContainerRef = useRef(null);
  const activeStrategyData = useMemo(() => STRATEGY_REGISTRY.find(s => s.id === activeStrategy), [activeStrategy]);
  const badgeCount = useMemo(() => badges.length, [badges]);

  // Close mobile menu on Escape
  useEffect(() => {
    const handleEsc = e => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [mobileMenuOpen]);

  // Listen for custom keyboard shortcut events
  useEffect(() => {
    const handler = e => {
      const {
        detail
      } = e;
      if (detail === 'open-dashboard') setOpenTool('dashboard');
      if (detail === 'open-goal-tracker') setOpenTool('goals');
      if (detail === 'close-dialog') {
        setOpenTool(null);
        setBadgeGalleryOpen(false);
      }
    };
    window.addEventListener('rupaiya-shortcut', handler);
    return () => window.removeEventListener('rupaiya-shortcut', handler);
  }, []);
  const closeTool = () => setOpenTool(null);
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx("nav", {
      className: "fixed top-0 left-0 right-0 z-50 glass-strong border-b border-white/[0.06]",
      role: "navigation",
      "aria-label": "Main navigation",
      children: /*#__PURE__*/_jsxs("div", {
        className: "flex items-center h-14 px-3 sm:px-4 gap-2 sm:gap-3",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-2 shrink-0",
          children: [/*#__PURE__*/_jsx("button", {
            className: "md:hidden flex items-center justify-center w-10 h-10 -ml-1 text-ink-muted hover:text-blue-600 transition-colors",
            onClick: () => setMobileMenuOpen(!mobileMenuOpen),
            "aria-label": mobileMenuOpen ? 'Close menu' : 'Open menu',
            children: mobileMenuOpen ? /*#__PURE__*/_jsx(X, {
              className: "w-5 h-5"
            }) : /*#__PURE__*/_jsx(Menu, {
              className: "w-5 h-5"
            })
          }), /*#__PURE__*/_jsxs(motion.div, {
            className: "flex items-center gap-2",
            whileHover: {
              scale: 1.02
            },
            transition: {
              type: 'spring',
              stiffness: 400,
              damping: 25
            },
            children: [/*#__PURE__*/_jsx(motion.div, {
              className: "w-8 h-8 rounded-xl flex items-center justify-center",
              style: {
                background: 'linear-gradient(135deg, #34D399, #2563eb 60%, #1e40af)',
                boxShadow: '0 0 16px rgba(16,185,129,0.35), 0 4px 12px rgba(0,0,0,0.30)'
              },
              whileHover: {
                boxShadow: '0 0 24px rgba(16,185,129,0.55), 0 6px 16px rgba(0,0,0,0.35)'
              },
              transition: {
                duration: 0.3
              },
              children: /*#__PURE__*/_jsx(IndianRupee, {
                className: "w-4 h-4 text-midnight",
                strokeWidth: 2.5
              })
            }), /*#__PURE__*/_jsxs("h1", {
              className: "text-lg font-extrabold tracking-tight select-none hidden sm:block",
              children: [/*#__PURE__*/_jsx("span", {
                className: "text-blue-600",
                children: "Money Matters"
              }), ' ', /*#__PURE__*/_jsx("span", {
                className: "text-gradient-brand",
                children: "101"
              })]
            })]
          })]
        }), /*#__PURE__*/_jsx("div", {
          ref: tabContainerRef,
          className: "hidden md:flex items-center gap-0.5 flex-1 overflow-x-auto mx-3 scrollbar-none tab-scroll-mask py-1",
          role: "tablist",
          "aria-label": "Strategy tabs",
          children: /*#__PURE__*/_jsx(TooltipProvider, {
            delayDuration: 300,
            children: STRATEGY_REGISTRY.map(strategy => {
              const isActive = activeStrategy === strategy.id;
              const shortTitle = getAbbreviatedTitle(strategy.name);
              return /*#__PURE__*/_jsxs(Tooltip, {
                children: [/*#__PURE__*/_jsx(TooltipTrigger, {
                  asChild: true,
                  children: /*#__PURE__*/_jsxs("button", {
                    role: "tab",
                    "aria-selected": isActive,
                    "aria-label": strategy.name,
                    onClick: () => {
                      setActiveStrategy(strategy.id);
                      router.push(`/strategy/${strategy.slug}`);
                    },
                    className: `
                          relative flex items-center gap-1.5 px-2.5 lg:px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200
                          ${isActive ? 'text-blue-600 bg-blue-50' : 'text-ink-muted hover:text-ink hover:bg-white/[0.04]'}
                        `,
                    children: [/*#__PURE__*/_jsx("span", {
                      className: "w-1.5 h-1.5 rounded-full shrink-0",
                      style: {
                        backgroundColor: strategy.accentColor,
                        opacity: isActive ? 1 : 0.5
                      }
                    }), /*#__PURE__*/_jsx("span", {
                      className: "w-3.5 h-3.5 shrink-0 flex items-center justify-center",
                      children: strategy.iconName
                    }), /*#__PURE__*/_jsx("span", {
                      className: "hidden lg:inline",
                      children: shortTitle
                    }), /*#__PURE__*/_jsx("span", {
                      className: "lg:hidden",
                      children: strategy.id
                    }), isActive && /*#__PURE__*/_jsx(motion.div, {
                      layoutId: "activeTab",
                      className: "absolute bottom-0 left-2 right-2 h-0.5 rounded-full",
                      style: {
                        background: 'linear-gradient(90deg, transparent, #2563eb, #34D399, #2563eb, transparent)',
                        boxShadow: '0 0 8px rgba(16,185,129,0.55), 0 0 16px rgba(16,185,129,0.25)'
                      },
                      transition: {
                        type: 'spring',
                        stiffness: 500,
                        damping: 30
                      }
                    })]
                  })
                }), /*#__PURE__*/_jsxs(TooltipContent, {
                  side: "bottom",
                  className: "glass-strong text-ink border border-white/[0.08] shadow-xl",
                  children: [/*#__PURE__*/_jsx("p", {
                    className: "font-semibold text-blue-600",
                    children: strategy.name
                  }), /*#__PURE__*/_jsx("p", {
                    className: "text-[10px] text-ink-muted",
                    children: strategy.hook
                  })]
                })]
              }, strategy.id);
            })
          })
        }), /*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-1 sm:gap-1.5 shrink-0 ml-auto",
          children: [/*#__PURE__*/_jsx(motion.div, {
            className: "relative",
            initial: coins > 0 ? {
              scale: 1
            } : {},
            animate: coins > 0 ? {
              scale: [1, 1.08, 1]
            } : {},
            transition: {
              duration: 0.3,
              ease: 'easeOut'
            },
            children: /*#__PURE__*/_jsx(CoinCounter, {
              amount: coins,
              showLabel: false
            })
          }, `coins-${coins}`), /*#__PURE__*/_jsx(TooltipProvider, {
            delayDuration: 300,
            children: /*#__PURE__*/_jsx("div", {
              className: "hidden lg:flex items-center gap-0.5",
              children: TOOLS.map(({
                id,
                Icon,
                tooltip,
                hover,
                hoverBg
              }) => /*#__PURE__*/_jsxs(Tooltip, {
                children: [/*#__PURE__*/_jsx(TooltipTrigger, {
                  asChild: true,
                  children: /*#__PURE__*/_jsx(motion.button, {
                    onClick: () => setOpenTool(id),
                    className: `magnetic-hover flex items-center justify-center w-9 h-9 rounded-lg text-ink-muted ${hover} ${hoverBg} transition-colors`,
                    "aria-label": tooltip,
                    whileHover: {
                      scale: 1.05
                    },
                    whileTap: {
                      scale: 0.95
                    },
                    children: /*#__PURE__*/_jsx(Icon, {
                      className: "w-4 h-4"
                    })
                  })
                }), /*#__PURE__*/_jsx(TooltipContent, {
                  side: "bottom",
                  className: "glass-strong text-ink border border-white/[0.08] shadow-xl",
                  children: /*#__PURE__*/_jsx("p", {
                    children: tooltip
                  })
                })]
              }, id))
            })
          }), /*#__PURE__*/_jsx(TooltipProvider, {
            delayDuration: 300,
            children: /*#__PURE__*/_jsxs(Tooltip, {
              children: [/*#__PURE__*/_jsx(TooltipTrigger, {
                asChild: true,
                children: /*#__PURE__*/_jsxs(motion.button, {
                  onClick: () => setBadgeGalleryOpen(true),
                  className: "magnetic-hover relative flex items-center justify-center w-9 h-9 rounded-lg text-ink-muted hover:text-gold-soft hover:bg-gold/10 transition-colors",
                  "aria-label": `View badges — ${badgeCount} earned`,
                  whileHover: {
                    scale: 1.05
                  },
                  whileTap: {
                    scale: 0.95
                  },
                  children: [/*#__PURE__*/_jsx(Trophy, {
                    className: "w-4 h-4"
                  }), badgeCount > 0 && /*#__PURE__*/_jsx("span", {
                    className: "absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-gold text-[9px] font-bold text-midnight flex items-center justify-center",
                    children: badgeCount
                  })]
                })
              }), /*#__PURE__*/_jsx(TooltipContent, {
                side: "bottom",
                className: "glass-strong text-ink border border-white/[0.08] shadow-xl",
                children: /*#__PURE__*/_jsxs("p", {
                  children: ["Badges (", badgeCount, ")"]
                })
              })]
            })
          }), /*#__PURE__*/_jsx(TooltipProvider, {
            delayDuration: 300,
            children: /*#__PURE__*/_jsxs(Tooltip, {
              children: [/*#__PURE__*/_jsx(TooltipTrigger, {
                asChild: true,
                children: /*#__PURE__*/_jsx("div", {
                  className: "cursor-default ml-0.5",
                  children: /*#__PURE__*/_jsx(ProgressRing, {
                    progress: completionPercentage,
                    size: 34,
                    strokeWidth: 3
                  })
                })
              }), /*#__PURE__*/_jsx(TooltipContent, {
                side: "bottom",
                className: "glass-strong text-ink border border-white/[0.08] shadow-xl",
                children: /*#__PURE__*/_jsxs("p", {
                  children: ["Progress: ", completionPercentage, "% complete"]
                })
              })]
            })
          }), /*#__PURE__*/_jsx("div", {
            className: "ml-1 shrink-0",
            children: /*#__PURE__*/_jsx(LanguageSelector, {
              variant: "compact"
            })
          })]
        })]
      })
    }), /*#__PURE__*/_jsx(BadgeGallery, {
      open: badgeGalleryOpen,
      onClose: () => setBadgeGalleryOpen(false)
    }), TOOLS.map(({
      id,
      Component
    }) => /*#__PURE__*/_jsx(Component, {
      open: openTool === id,
      onClose: closeTool
    }, id)), /*#__PURE__*/_jsx(AnimatePresence, {
      children: mobileMenuOpen && /*#__PURE__*/_jsxs(_Fragment, {
        children: [/*#__PURE__*/_jsx(motion.div, {
          initial: {
            opacity: 0
          },
          animate: {
            opacity: 1
          },
          exit: {
            opacity: 0
          },
          transition: {
            duration: 0.2
          },
          className: "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden",
          onClick: () => setMobileMenuOpen(false),
          "aria-hidden": "true"
        }), /*#__PURE__*/_jsxs(motion.div, {
          initial: {
            opacity: 0,
            y: -10,
            scale: 0.98
          },
          animate: {
            opacity: 1,
            y: 0,
            scale: 1
          },
          exit: {
            opacity: 0,
            y: -10,
            scale: 0.98
          },
          transition: {
            type: 'spring',
            stiffness: 400,
            damping: 30,
            mass: 0.8
          },
          className: "fixed top-14 left-2 right-2 z-50 rounded-2xl overflow-hidden glass-strong border border-white/[0.10] shadow-2xl md:hidden",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "bg-gradient-to-r from-blue-600/15 via-blue-600/10 to-ai/10 px-4 py-3 flex items-center justify-between border-b border-white/[0.06]",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex items-center gap-2",
              children: [/*#__PURE__*/_jsx(IndianRupee, {
                className: "w-4 h-4 text-blue-600"
              }), /*#__PURE__*/_jsx("span", {
                className: "text-sm font-bold text-blue-600",
                children: "Choose Strategy"
              })]
            }), /*#__PURE__*/_jsx("button", {
              onClick: () => setMobileMenuOpen(false),
              className: "p-1 rounded-lg text-ink-muted hover:text-ink hover:bg-white/10 transition-colors",
              "aria-label": "Close menu",
              children: /*#__PURE__*/_jsx(X, {
                className: "w-4 h-4"
              })
            })]
          }), /*#__PURE__*/_jsx("div", {
            className: "max-h-[60vh] overflow-y-auto p-3 grid grid-cols-1 sm:grid-cols-2 gap-2 custom-scroll",
            children: STRATEGY_REGISTRY.map((strategy, index) => {
              const isActive = activeStrategy === strategy.id;
              return /*#__PURE__*/_jsxs(motion.button, {
                onClick: () => {
                  setActiveStrategy(strategy.id);
                  router.push(`/strategy/${strategy.slug}`);
                  setMobileMenuOpen(false);
                },
                className: `
                        flex items-center gap-2.5 p-3 min-h-[44px] rounded-xl text-left transition-all
                        ${isActive ? 'bg-blue-50 border border-blue-500/25 text-blue-600' : 'bg-white/[0.03] border border-white/[0.05] text-ink-muted hover:bg-white/[0.06] hover:text-ink'}
                      `,
                initial: {
                  opacity: 0,
                  y: 8
                },
                animate: {
                  opacity: 1,
                  y: 0
                },
                transition: {
                  delay: index * 0.03,
                  duration: 0.2
                },
                "aria-label": strategy.name,
                children: [/*#__PURE__*/_jsxs("div", {
                  className: "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 relative",
                  style: {
                    backgroundColor: `${strategy.accentColor}15`
                  },
                  children: [/*#__PURE__*/_jsx("span", {
                    className: "text-sm",
                    children: strategy.iconName
                  }), /*#__PURE__*/_jsx("span", {
                    className: "absolute -top-0.5 -left-0.5 w-2 h-2 rounded-full border border-midnight",
                    style: {
                      backgroundColor: strategy.accentColor
                    }
                  })]
                }), /*#__PURE__*/_jsxs("div", {
                  className: "min-w-0",
                  children: [/*#__PURE__*/_jsx("div", {
                    className: "text-xs font-semibold truncate",
                    children: strategy.name
                  }), /*#__PURE__*/_jsx("div", {
                    className: "text-[10px] text-ink-muted truncate",
                    children: strategy.hook
                  })]
                })]
              }, strategy.id);
            })
          }), /*#__PURE__*/_jsxs("div", {
            className: "border-t border-white/[0.06] px-3 pt-2 pb-3",
            children: [/*#__PURE__*/_jsx("p", {
              className: "px-1 pb-2 text-[10px] font-semibold text-ink-muted uppercase tracking-widest",
              children: "Tools"
            }), /*#__PURE__*/_jsx("div", {
              className: "grid grid-cols-4 gap-2",
              children: TOOLS.map(({
                id,
                Icon,
                label,
                hover,
                hoverBg
              }, index) => /*#__PURE__*/_jsxs(motion.button, {
                onClick: () => {
                  setOpenTool(id);
                  setMobileMenuOpen(false);
                },
                className: `flex flex-col items-center gap-1 p-2 rounded-xl bg-white/[0.03] border border-white/[0.05] text-ink-muted ${hover} ${hoverBg} transition-colors min-h-[56px]`,
                initial: {
                  opacity: 0,
                  y: 6
                },
                animate: {
                  opacity: 1,
                  y: 0
                },
                transition: {
                  delay: index * 0.02,
                  duration: 0.18
                },
                "aria-label": label,
                children: [/*#__PURE__*/_jsx(Icon, {
                  className: "w-4 h-4"
                }), /*#__PURE__*/_jsx("span", {
                  className: "text-[9px] font-medium leading-tight text-center",
                  children: label
                })]
              }, id))
            })]
          })]
        })]
      })
    })]
  });
}
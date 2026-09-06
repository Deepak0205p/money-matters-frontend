'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Download, Share2, Trophy, Flame, Coins, Award, Star, CheckCircle2, Sparkles } from 'lucide-react';
import { useAppStore } from '@/lib/store/useAppStore';
import { useProgress } from '@/lib/hooks/useProgress';
import ProgressRing from '@/components/shared/ProgressRing';

// Level calculation (same as Sidebar)
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
function getLevel(completed) {
  if (completed >= 11) return {
    level: 5,
    label: 'Master',
    color: '#f59e0b'
  };
  if (completed >= 8) return {
    level: 4,
    label: 'Expert',
    color: '#22c55e'
  };
  if (completed >= 5) return {
    level: 3,
    label: 'Pro',
    color: '#3b82f6'
  };
  if (completed >= 2) return {
    level: 2,
    label: 'Learner',
    color: '#a855f7'
  };
  return {
    level: 1,
    label: 'Beginner',
    color: '#8888a0'
  };
}
export function ShareProgress({
  open,
  onClose
}) {
  const {
    coins,
    streak,
    badges,
    userName,
    completedModules,
    quizScores
  } = useAppStore();
  const {
    modulesCompleted,
    completionPercentage
  } = useProgress();
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef(null);
  const level = getLevel(modulesCompleted);
  const displayName = userName || 'Seekho Beta';
  const quizAverage = Object.values(quizScores).length > 0 ? Math.round(Object.values(quizScores).reduce((a, b) => a + b, 0) / Object.values(quizScores).length) : 0;

  // Copy text summary to clipboard
  const handleCopy = useCallback(async () => {
    const text = `🏆 Money Matters — Meri Financial Journey

👤 ${displayName}
📊 Level ${level.level} — ${level.label}
📈 Progress: ${completionPercentage}%
💰 XP Earned: ${coins}
🔥 Streak: ${streak} din
📚 Modules Complete: ${modulesCompleted}/11
🏅 Badges: ${badges.length}
📝 Quiz Average: ${quizAverage}%

#MoneyMatters #FinancialLiteracy #SmartMoney`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [displayName, level, completionPercentage, coins, streak, modulesCompleted, badges.length, quizAverage]);

  // Download as image using Canvas API
  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      // Create a canvas and draw the share card
      const canvas = document.createElement('canvas');
      const scale = 2; // For retina quality
      const width = 600;
      const height = 800;
      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.scale(scale, scale);

      // Background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#FAFAF8');
      bgGrad.addColorStop(0.5, '#FFFFFF');
      bgGrad.addColorStop(1, '#F1F5F9');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Top accent bar
      const accentGrad = ctx.createLinearGradient(0, 0, width, 0);
      accentGrad.addColorStop(0, '#059669');
      accentGrad.addColorStop(0.5, '#10B981');
      accentGrad.addColorStop(1, '#F59E0B');
      ctx.fillStyle = accentGrad;
      ctx.fillRect(0, 0, width, 6);

      // Title area
      ctx.textAlign = 'center';
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 16px Inter, system-ui, sans-serif';
      ctx.fillText('🏆 Money Matters', width / 2, 50);
      ctx.fillStyle = '#64748B';
      ctx.font = '12px Inter, system-ui, sans-serif';
      ctx.fillText('Meri Financial Journey', width / 2, 72);

      // Progress ring (simplified)
      const ringX = width / 2;
      const ringY = 150;
      const ringR = 50;
      // Background circle
      ctx.beginPath();
      ctx.arc(ringX, ringY, ringR, 0, Math.PI * 2);
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 8;
      ctx.stroke();
      // Progress arc
      const progressAngle = completionPercentage / 100 * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(ringX, ringY, ringR, -Math.PI / 2, -Math.PI / 2 + progressAngle);
      ctx.strokeStyle = '#059669';
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Percentage text
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 24px Inter, system-ui, sans-serif';
      ctx.fillText(`${completionPercentage}%`, ringX, ringY + 8);

      // Level badge
      ctx.fillStyle = `${level.color}20`;
      const levelText = `Lvl ${level.level} — ${level.label}`;
      ctx.font = 'bold 12px Inter, system-ui, sans-serif';
      const levelWidth = ctx.measureText(levelText).width;
      const badgePad = 16;
      const badgeX = ringX - (levelWidth + badgePad) / 2;
      const badgeY = ringY + ringR + 20;
      ctx.fillStyle = `${level.color}15`;
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, levelWidth + badgePad, 28, 14);
      ctx.fill();
      ctx.fillStyle = level.color;
      ctx.fillText(levelText, ringX, badgeY + 18);

      // User name
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 22px Inter, system-ui, sans-serif';
      ctx.fillText(displayName, width / 2, badgeY + 60);

      // Stats grid
      const statsStartY = badgeY + 90;
      const stats = [{
        icon: '💰',
        label: 'XP Earned',
        value: coins.toString(),
        color: '#D97706'
      }, {
        icon: '🔥',
        label: 'Streak',
        value: `${streak} din`,
        color: '#EA580C'
      }, {
        icon: '📚',
        label: 'Modules',
        value: `${modulesCompleted}/11`,
        color: '#059669'
      }, {
        icon: '🏅',
        label: 'Badges',
        value: badges.length.toString(),
        color: '#7C3AED'
      }, {
        icon: '📝',
        label: 'Quiz Avg',
        value: `${quizAverage}%`,
        color: '#2563EB'
      }, {
        icon: '✅',
        label: 'Complete',
        value: `${completionPercentage}%`,
        color: '#0D9488'
      }];
      const cols = 3;
      const cellW = 160;
      const cellH = 70;
      const gridStartX = (width - cols * cellW) / 2;
      stats.forEach((stat, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = gridStartX + col * cellW + cellW / 2;
        const y = statsStartY + row * (cellH + 12);

        // Card background
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.roundRect(x - 65, y, 130, cellH, 12);
        ctx.fill();

        // Border
        ctx.strokeStyle = '#E2E8F0';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(x - 65, y, 130, cellH, 12);
        ctx.stroke();

        // Icon + Value
        ctx.fillStyle = stat.color;
        ctx.font = 'bold 18px Inter, system-ui, sans-serif';
        ctx.fillText(`${stat.icon} ${stat.value}`, x, y + 30);

        // Label
        ctx.fillStyle = '#64748B';
        ctx.font = '10px Inter, system-ui, sans-serif';
        ctx.fillText(stat.label, x, y + 50);
      });

      // Bottom branding
      ctx.fillStyle = '#059669';
      ctx.font = '10px Inter, system-ui, sans-serif';
      ctx.fillText('Financial Literacy for Indian Youth 🇮🇳', width / 2, height - 50);
      ctx.fillStyle = '#94A3B8';
      ctx.font = '9px Inter, system-ui, sans-serif';
      ctx.fillText('#MoneyMatters #SmartMoney #FinancialLiteracy', width / 2, height - 30);

      // Download
      const link = document.createElement('a');
      link.download = `rupaiya-101-progress-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch {
      // If canvas approach fails, fallback to copy
      await handleCopy();
    } finally {
      setDownloading(false);
    }
  }, [completionPercentage, coins, displayName, handleCopy, level, modulesCompleted, quizAverage, streak, badges.length]);
  return /*#__PURE__*/_jsx(AnimatePresence, {
    children: open && /*#__PURE__*/_jsxs(_Fragment, {
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
        className: "fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm",
        onClick: onClose
      }), /*#__PURE__*/_jsxs(motion.div, {
        initial: {
          opacity: 0,
          y: 40,
          scale: 0.97
        },
        animate: {
          opacity: 1,
          y: 0,
          scale: 1
        },
        exit: {
          opacity: 0,
          y: 40,
          scale: 0.97
        },
        transition: {
          type: 'spring',
          stiffness: 400,
          damping: 30
        },
        className: "fixed inset-x-4 top-[4vh] bottom-[4vh] z-50 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-md bg-white border border-slate-200/90 rounded-2xl shadow-2xl flex flex-col overflow-hidden",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "shrink-0 px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-2.5",
            children: [/*#__PURE__*/_jsx("div", {
              className: "w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center shadow-2xs",
              children: /*#__PURE__*/_jsx(Share2, {
                className: "w-4 h-4 text-amber-600"
              })
            }), /*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsx("h2", {
                className: "text-sm font-extrabold text-slate-900",
                children: "Apni Progress Share Karo"
              }), /*#__PURE__*/_jsx("p", {
                className: "text-[10px] text-slate-500",
                children: "Duniya ko batao kitna aage badh rahe ho!"
              })]
            })]
          }), /*#__PURE__*/_jsx("button", {
            onClick: onClose,
            className: "p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors",
            "aria-label": "Close share dialog",
            children: /*#__PURE__*/_jsx(X, {
              className: "w-4 h-4"
            })
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "flex-1 overflow-y-auto p-5 bg-slate-50/50",
          children: [/*#__PURE__*/_jsx("div", {
            ref: cardRef,
            className: "rounded-xl overflow-hidden border border-slate-200 shadow-sm",
            children: /*#__PURE__*/_jsxs("div", {
              className: "relative bg-white p-6",
              children: [/*#__PURE__*/_jsx("div", {
                className: "absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-600 via-amber-400 to-amber-500"
              }), /*#__PURE__*/_jsx("div", {
                className: "absolute top-4 right-6",
                children: /*#__PURE__*/_jsx(motion.div, {
                  animate: {
                    opacity: [0.3, 1, 0.3],
                    scale: [0.8, 1.2, 0.8]
                  },
                  transition: {
                    duration: 2,
                    repeat: Infinity
                  },
                  children: /*#__PURE__*/_jsx(Sparkles, {
                    size: 16,
                    className: "text-amber-500/60"
                  })
                })
              }), /*#__PURE__*/_jsxs("div", {
                className: "text-center mb-5",
                children: [/*#__PURE__*/_jsxs("div", {
                  className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 mb-3",
                  children: [/*#__PURE__*/_jsx(Trophy, {
                    size: 12,
                    className: "text-emerald-600"
                  }), /*#__PURE__*/_jsx("span", {
                    className: "text-[10px] font-black text-emerald-800 tracking-wider uppercase",
                    children: "Money Matters"
                  })]
                }), /*#__PURE__*/_jsx("p", {
                  className: "text-[10px] text-slate-500 font-bold",
                  children: "Meri Financial Journey"
                })]
              }), /*#__PURE__*/_jsxs("div", {
                className: "flex flex-col items-center mb-5",
                children: [/*#__PURE__*/_jsx(ProgressRing, {
                  progress: completionPercentage,
                  size: 90,
                  strokeWidth: 6
                }), /*#__PURE__*/_jsxs("div", {
                  className: "mt-3 flex items-center gap-2",
                  children: [/*#__PURE__*/_jsxs("span", {
                    className: "text-[10px] font-bold px-2 py-0.5 rounded-full",
                    style: {
                      backgroundColor: `${level.color}20`,
                      color: level.color
                    },
                    children: ["Lvl ", level.level]
                  }), /*#__PURE__*/_jsx("span", {
                    className: "text-[10px] text-slate-500 font-medium",
                    children: level.label
                  })]
                })]
              }), /*#__PURE__*/_jsx("div", {
                className: "text-center mb-5",
                children: /*#__PURE__*/_jsx("h3", {
                  className: "text-lg font-black text-slate-900",
                  children: displayName
                })
              }), /*#__PURE__*/_jsxs("div", {
                className: "grid grid-cols-3 gap-2.5 mb-5",
                children: [/*#__PURE__*/_jsxs("div", {
                  className: "bg-slate-50 rounded-xl p-3 text-center border border-slate-200/80 shadow-2xs",
                  children: [/*#__PURE__*/_jsx(Coins, {
                    className: "w-4 h-4 text-amber-500 mx-auto mb-1"
                  }), /*#__PURE__*/_jsx("div", {
                    className: "text-sm font-black text-amber-700",
                    children: coins
                  }), /*#__PURE__*/_jsx("div", {
                    className: "text-[9px] text-slate-500 font-bold",
                    children: "XP Earned"
                  })]
                }), /*#__PURE__*/_jsxs("div", {
                  className: "bg-slate-50 rounded-xl p-3 text-center border border-slate-200/80 shadow-2xs",
                  children: [/*#__PURE__*/_jsx(Flame, {
                    className: "w-4 h-4 text-orange-500 mx-auto mb-1"
                  }), /*#__PURE__*/_jsx("div", {
                    className: "text-sm font-black text-orange-600",
                    children: streak
                  }), /*#__PURE__*/_jsx("div", {
                    className: "text-[9px] text-slate-500 font-bold",
                    children: "Streak (din)"
                  })]
                }), /*#__PURE__*/_jsxs("div", {
                  className: "bg-slate-50 rounded-xl p-3 text-center border border-slate-200/80 shadow-2xs",
                  children: [/*#__PURE__*/_jsx(CheckCircle2, {
                    className: "w-4 h-4 text-emerald-600 mx-auto mb-1"
                  }), /*#__PURE__*/_jsxs("div", {
                    className: "text-sm font-black text-emerald-700",
                    children: [modulesCompleted, "/11"]
                  }), /*#__PURE__*/_jsx("div", {
                    className: "text-[9px] text-slate-500 font-bold",
                    children: "Modules"
                  })]
                }), /*#__PURE__*/_jsxs("div", {
                  className: "bg-slate-50 rounded-xl p-3 text-center border border-slate-200/80 shadow-2xs",
                  children: [/*#__PURE__*/_jsx(Award, {
                    className: "w-4 h-4 text-purple-500 mx-auto mb-1"
                  }), /*#__PURE__*/_jsx("div", {
                    className: "text-sm font-black text-purple-700",
                    children: badges.length
                  }), /*#__PURE__*/_jsx("div", {
                    className: "text-[9px] text-slate-500 font-bold",
                    children: "Badges"
                  })]
                }), /*#__PURE__*/_jsxs("div", {
                  className: "bg-slate-50 rounded-xl p-3 text-center border border-slate-200/80 shadow-2xs",
                  children: [/*#__PURE__*/_jsx(Star, {
                    className: "w-4 h-4 text-blue-500 mx-auto mb-1"
                  }), /*#__PURE__*/_jsxs("div", {
                    className: "text-sm font-black text-blue-700",
                    children: [quizAverage, "%"]
                  }), /*#__PURE__*/_jsx("div", {
                    className: "text-[9px] text-slate-500 font-bold",
                    children: "Quiz Avg"
                  })]
                }), /*#__PURE__*/_jsxs("div", {
                  className: "bg-slate-50 rounded-xl p-3 text-center border border-slate-200/80 shadow-2xs",
                  children: [/*#__PURE__*/_jsx(Trophy, {
                    className: "w-4 h-4 text-teal-600 mx-auto mb-1"
                  }), /*#__PURE__*/_jsxs("div", {
                    className: "text-sm font-black text-teal-700",
                    children: [completionPercentage, "%"]
                  }), /*#__PURE__*/_jsx("div", {
                    className: "text-[9px] text-slate-500 font-bold",
                    children: "Complete"
                  })]
                })]
              }), /*#__PURE__*/_jsxs("div", {
                className: "text-center",
                children: [/*#__PURE__*/_jsx("p", {
                  className: "text-[10px] font-semibold text-slate-500",
                  children: "Financial Literacy for Indian Youth 🇮🇳"
                }), /*#__PURE__*/_jsx("p", {
                  className: "text-[9px] text-slate-400 mt-0.5",
                  children: "#MoneyMatters #SmartMoney"
                })]
              })]
            })
          }), badges.length > 0 && /*#__PURE__*/_jsxs("div", {
            className: "mt-4",
            children: [/*#__PURE__*/_jsx("p", {
              className: "text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-2",
              children: "Badges Earned"
            }), /*#__PURE__*/_jsxs("div", {
              className: "flex flex-wrap gap-1.5",
              children: [badges.slice(0, 8).map(badge => /*#__PURE__*/_jsxs("span", {
                className: "text-[9px] font-bold px-2 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200",
                children: ["🏅 ", badge]
              }, badge)), badges.length > 8 && /*#__PURE__*/_jsxs("span", {
                className: "text-[9px] font-semibold px-2 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200",
                children: ["+", badges.length - 8, " more"]
              })]
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "shrink-0 border-t border-slate-100 p-4 space-y-2.5 bg-white",
          children: [/*#__PURE__*/_jsx("button", {
            onClick: handleCopy,
            className: "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-sm transition-all shadow-sm cursor-pointer",
            children: copied ? /*#__PURE__*/_jsxs(_Fragment, {
              children: [/*#__PURE__*/_jsx(CheckCircle2, {
                size: 16
              }), "Copied! 🎉"]
            }) : /*#__PURE__*/_jsxs(_Fragment, {
              children: [/*#__PURE__*/_jsx(Copy, {
                size: 16
              }), "Copy Text Summary"]
            })
          }), /*#__PURE__*/_jsxs("button", {
            onClick: handleDownload,
            disabled: downloading,
            className: "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all disabled:opacity-50 cursor-pointer shadow-2xs",
            children: [/*#__PURE__*/_jsx(Download, {
              size: 16
            }), downloading ? 'Generating...' : 'Download Image']
          })]
        })]
      })]
    })
  });
}
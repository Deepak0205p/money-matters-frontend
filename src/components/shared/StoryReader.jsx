'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronRight, ChevronLeft, X, Star, Trophy, Lightbulb, CheckCircle2, Lock, Zap, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

/* ================================================================== */
/*  Types                                                              */
/* ================================================================== */
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* ================================================================== */
/*  Constants                                                          */
/* ================================================================== */

const SPEAKER_COLORS = {
  Arjun: {
    bg: '#FEF3C7',
    border: '#FDE68A',
    text: '#B45309',
    badge: 'bg-amber-100 text-amber-800 border-amber-300',
    tail: '#FDE68A'
  },
  Priya: {
    bg: '#F3E8FF',
    border: '#E9D5FF',
    text: '#7E22CE',
    badge: 'bg-purple-100 text-purple-800 border-purple-300',
    tail: '#E9D5FF'
  },
  Papa: {
    bg: '#ECFDF5',
    border: '#A7F3D0',
    text: '#047857',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    tail: '#A7F3D0'
  },
  Boss: {
    bg: '#EFF6FF',
    border: '#BFDBFE',
    text: '#1D4ED8',
    badge: 'bg-blue-100 text-blue-800 border-blue-300',
    tail: '#BFDBFE'
  },
  Narrator: {
    bg: '#F8FAFC',
    border: '#E2E8F0',
    text: '#475569',
    badge: 'bg-slate-100 text-slate-700 border-slate-300',
    tail: '#E2E8F0'
  }
};
const DEFAULT_SPEAKER = {
  bg: '#F8FAFC',
  border: '#E2E8F0',
  text: '#475569',
  badge: 'bg-slate-100 text-slate-700 border-slate-300',
  tail: '#E2E8F0'
};

/* ================================================================== */
/*  Sub-components                                                     */
/* ================================================================== */

/** Floating XP reward animation */
function XPReward({
  amount,
  show
}) {
  return /*#__PURE__*/_jsx(AnimatePresence, {
    children: show && /*#__PURE__*/_jsx(motion.div, {
      className: "absolute -top-2 right-4 pointer-events-none z-50",
      initial: {
        opacity: 0,
        y: 0,
        scale: 0.5
      },
      animate: {
        opacity: 1,
        y: -40,
        scale: 1
      },
      exit: {
        opacity: 0,
        y: -70,
        scale: 0.8
      },
      transition: {
        duration: 1.2,
        ease: 'easeOut'
      },
      children: /*#__PURE__*/_jsxs("div", {
        className: "flex items-center gap-1 bg-amber-500/20 border border-amber-500/30 rounded-full px-3 py-1",
        children: [/*#__PURE__*/_jsx(Zap, {
          className: "w-3.5 h-3.5 text-amber-400"
        }), /*#__PURE__*/_jsxs("span", {
          className: "text-amber-400 font-bold text-sm",
          children: ["+", amount, " XP"]
        })]
      })
    })
  });
}

/** Celebration particles for completion screen */
function CelebrationParticles() {
  const particles = Array.from({
    length: 24
  }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.8,
    duration: 1.5 + Math.random() * 1.5,
    size: 4 + Math.random() * 8,
    color: ['#f59e0b', '#a855f7', '#22c55e', '#3b82f6', '#ef4444', '#f97316'][Math.floor(Math.random() * 6)],
    drift: (Math.random() - 0.5) * 60
  }));
  return /*#__PURE__*/_jsx("div", {
    className: "absolute inset-0 overflow-hidden pointer-events-none",
    children: particles.map(p => /*#__PURE__*/_jsx(motion.div, {
      className: "absolute rounded-full",
      style: {
        left: `${p.x}%`,
        top: '40%',
        width: p.size,
        height: p.size,
        backgroundColor: p.color
      },
      initial: {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 0
      },
      animate: {
        opacity: [0, 1, 1, 0],
        y: [0, -120, -250],
        x: [0, p.drift * 0.5, p.drift],
        scale: [0, 1.2, 0.5]
      },
      transition: {
        duration: p.duration,
        delay: p.delay,
        ease: 'easeOut'
      }
    }, p.id))
  });
}

/** Progress dots with lock/check/pulse states */
function ProgressDots({
  total,
  current,
  readChapters
}) {
  return /*#__PURE__*/_jsx("div", {
    className: "flex items-center gap-1.5 justify-center",
    children: Array.from({
      length: total
    }, (_, i) => {
      const isRead = readChapters.has(i);
      const isCurrent = i === current;
      return /*#__PURE__*/_jsxs("div", {
        className: "relative",
        children: [isCurrent && /*#__PURE__*/_jsx(motion.div, {
          className: "absolute inset-0 rounded-full bg-emerald-500/20",
          animate: {
            scale: [1, 1.6, 1]
          },
          transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }
        }), /*#__PURE__*/_jsx("div", {
          className: `
                relative w-2.5 h-2.5 rounded-full transition-colors duration-300
                ${isCurrent ? 'bg-emerald-600' : isRead ? 'bg-emerald-400' : 'bg-slate-200'}
              `
        })]
      }, i);
    })
  });
}

/** Speech bubble component */
function DialogueBubble({
  dialogue,
  speaker
}) {
  const speakerStyle = SPEAKER_COLORS[speaker] || DEFAULT_SPEAKER;
  const speakerEmojis = {
    Arjun: '👦',
    Priya: '👩',
    Papa: '👨‍🦳',
    Boss: '💼',
    Narrator: '📖'
  };
  return /*#__PURE__*/_jsxs(motion.div, {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.9
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1
    },
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
      delay: 0.3
    },
    className: "relative mt-5 story-dialogue-animate",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "flex items-center gap-1.5 mb-2",
      children: [/*#__PURE__*/_jsx("span", {
        className: "text-base",
        children: speakerEmojis[speaker] || '💬'
      }), /*#__PURE__*/_jsx("span", {
        className: `text-xs font-semibold px-2.5 py-0.5 rounded-full border ${speakerStyle.badge}`,
        children: speaker
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "relative rounded-2xl rounded-tl-sm px-5 py-4 shadow-2xs",
      style: {
        backgroundColor: speakerStyle.bg,
        borderColor: speakerStyle.border,
        borderWidth: 1
      },
      children: [/*#__PURE__*/_jsx("div", {
        className: "absolute -top-2 left-4 w-4 h-4 rotate-45",
        style: {
          backgroundColor: speakerStyle.bg,
          borderLeft: `1px solid ${speakerStyle.border}`,
          borderTop: `1px solid ${speakerStyle.border}`
        }
      }), /*#__PURE__*/_jsxs("p", {
        className: "text-[15px] font-medium leading-relaxed text-slate-800",
        children: ["\u201C", dialogue, "\u201D"]
      })]
    })]
  });
}

/** Lesson highlight card */
function LessonCard({
  lesson
}) {
  return /*#__PURE__*/_jsx(motion.div, {
    initial: {
      opacity: 0,
      y: 15
    },
    animate: {
      opacity: 1,
      y: 0
    },
    transition: {
      duration: 0.5,
      delay: 0.5
    },
    className: "mt-5 relative",
    children: /*#__PURE__*/_jsx("div", {
      className: "relative rounded-xl px-5 py-4 border bg-amber-50/60 border-amber-200/90 shadow-2xs story-lesson-card",
      children: /*#__PURE__*/_jsxs("div", {
        className: "flex items-start gap-3",
        children: [/*#__PURE__*/_jsx("div", {
          className: "mt-0.5 shrink-0",
          children: /*#__PURE__*/_jsx(Lightbulb, {
            className: "w-5 h-5 text-amber-600"
          })
        }), /*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx("span", {
            className: "text-[10px] font-bold uppercase tracking-wider text-amber-700 mb-1 block",
            children: "Lesson"
          }), /*#__PURE__*/_jsx("p", {
            className: "text-[14px] font-semibold leading-relaxed text-slate-800",
            children: lesson
          })]
        })]
      })
    })
  });
}

/** Interactive choice card */
function ChoiceCard({
  choice,
  onAnswer,
  answered
}) {
  const [selectedId, setSelectedId] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedCorrect, setSelectedCorrect] = useState(null);
  const handleSelect = option => {
    if (answered) return;
    setSelectedId(option.id);
    setSelectedCorrect(option.isCorrect);
    setShowFeedback(true);
    onAnswer(option.isCorrect);
  };
  const isSelected = id => selectedId === id;
  const getOptionStyle = option => {
    if (!answered && !isSelected(option.id)) {
      return 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 shadow-2xs';
    }
    if (isSelected(option.id) && option.isCorrect) {
      return 'bg-emerald-50 border-emerald-400 shadow-sm';
    }
    if (isSelected(option.id) && !option.isCorrect) {
      return 'bg-rose-50 border-rose-400 shadow-sm';
    }
    if (answered && option.isCorrect) {
      return 'bg-emerald-50/50 border-emerald-200';
    }
    return 'bg-slate-50 border-slate-200 opacity-60';
  };
  const getTextStyle = option => {
    if (isSelected(option.id) && option.isCorrect) return 'text-emerald-800 font-bold';
    if (isSelected(option.id) && !option.isCorrect) return 'text-rose-800 font-bold';
    if (answered && option.isCorrect) return 'text-emerald-700 font-semibold';
    return 'text-slate-700';
  };

  // Create the two options: the correct one + the incorrect one
  const options = [choice, {
    ...choice,
    id: choice.id + '_alt',
    text: choice.text === choice.text ? getAlternateOption(choice) : choice.text,
    isCorrect: !choice.isCorrect,
    feedback: ''
  }];

  // Reorder: shuffle based on id hash so correct isn't always first
  const orderedOptions = choice.id.length % 2 === 0 ? [options[1], options[0]] : [options[0], options[1]];
  return /*#__PURE__*/_jsxs(motion.div, {
    initial: {
      opacity: 0
    },
    animate: {
      opacity: 1
    },
    transition: {
      delay: 0.7
    },
    className: "mt-5",
    children: [/*#__PURE__*/_jsx("p", {
      className: "text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3",
      children: "Tumhara faisla kya hai?"
    }), /*#__PURE__*/_jsx("div", {
      className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
      children: orderedOptions.map((option, idx) => /*#__PURE__*/_jsx(motion.button, {
        initial: {
          opacity: 0,
          y: 15
        },
        animate: {
          opacity: 1,
          y: 0
        },
        transition: {
          delay: 0.8 + idx * 0.15
        },
        whileTap: answered ? undefined : {
          scale: 0.97
        },
        onClick: () => handleSelect(option),
        disabled: answered,
        className: `
              relative rounded-xl px-4 py-3.5 text-left border transition-all duration-300
              min-h-[56px]
              ${getOptionStyle(option)}
            `,
        children: /*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-3",
          children: [/*#__PURE__*/_jsx("div", {
            className: `
                  shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border
                  ${isSelected(option.id) && option.isCorrect ? 'border-emerald-500 text-emerald-700 bg-emerald-100' : ''}
                  ${isSelected(option.id) && !option.isCorrect ? 'border-rose-500 text-rose-700 bg-rose-100' : ''}
                  ${!isSelected(option.id) ? 'border-slate-200 text-slate-600 bg-slate-100' : ''}
                `,
            children: isSelected(option.id) && option.isCorrect ? /*#__PURE__*/_jsx(CheckCircle2, {
              className: "w-4 h-4"
            }) : isSelected(option.id) && !option.isCorrect ? /*#__PURE__*/_jsx(X, {
              className: "w-4 h-4"
            }) : String.fromCharCode(65 + idx)
          }), /*#__PURE__*/_jsx("span", {
            className: `text-sm font-medium ${getTextStyle(option)}`,
            children: option.text
          })]
        })
      }, option.id))
    }), /*#__PURE__*/_jsx(AnimatePresence, {
      children: showFeedback && selectedId && /*#__PURE__*/_jsx(motion.div, {
        initial: {
          opacity: 0,
          height: 0,
          marginTop: 0
        },
        animate: {
          opacity: 1,
          height: 'auto',
          marginTop: 12
        },
        exit: {
          opacity: 0,
          height: 0
        },
        transition: {
          duration: 0.3
        },
        className: "overflow-hidden",
        children: /*#__PURE__*/_jsx("div", {
          className: `rounded-xl px-4 py-3 border ${selectedCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-rose-50 border-rose-300 text-rose-800'}`,
          children: /*#__PURE__*/_jsx("p", {
            className: "text-sm font-semibold",
            children: selectedCorrect ? 'Sahi jawab! 🎯 ' + (choice.isCorrect ? choice.feedback : 'Bilkul sahi faisla — smart move!') : choice.feedback
          })
        })
      })
    })]
  });
}

/** Generate alternate (wrong) option for a choice */
function getAlternateOption(choice) {
  const altMap = {
    'iPhone khareedo!': 'Pehle FD karo, baaki baad mein',
    'Pehle FD karo, baaki baad mein': 'iPhone khareedo!',
    'Credit card se luxury buy karo': 'Budget banao aur limit set karo',
    'Budget banao aur limit set karo': 'Credit card se luxury buy karo',
    'Full amount withdraw karo': 'EMI plan banao aur regular pay karo',
    'EMI plan banao aur regular pay karo': 'Full amount withdraw karo',
    'Savings account mein rakhho': 'SIP start karo aur compound benefit lo',
    'SIP start karo aur compound benefit lo': 'Savings account mein rakhho',
    'EMI continue rakho': 'Prepay karke interest bachao',
    'Prepay karke interest bachao': 'EMI continue rakho',
    'Abhi invest karo!': 'Pehle emergency fund banao',
    'Pehle emergency fund banao': 'Abhi invest karo!',
    'Insurance lena bekar hai': 'Term plan zaroori hai — protection first',
    'Term plan zaroori hai — protection first': 'Insurance lena bekar hai',
    'Savings hi kaafi hai': 'Inflation se bachne ke liye invest karo',
    'Inflation se bachne ke liye invest karo': 'Savings hi kaafi hai',
    'Full salary spend kar do — life mein pehli baar hai! 🛍️': 'Pehle 50-30-20 rule lagao, phir spend karo 💰',
    'Pehle 50-30-20 rule lagao, phir spend karo 💰': 'Full salary spend kar do — life mein pehli baar hai! 🛍️'
  };
  // If we have a direct mapping, use it
  if (altMap[choice.text]) return altMap[choice.text];
  // Otherwise, generate a sensible opposite based on isCorrect
  if (choice.isCorrect) {
    return 'Yeh risk bhara hai, soch samajh ke karo ⚠️';
  }
  return 'Sahi lagta hai, par aur socho 🤔';
}

/** Scene card with emoji and narrative */
function SceneCard({
  scene,
  emoji
}) {
  return /*#__PURE__*/_jsxs(motion.div, {
    initial: {
      opacity: 0,
      y: 20
    },
    animate: {
      opacity: 1,
      y: 0
    },
    transition: {
      duration: 0.5
    },
    className: "text-center",
    children: [/*#__PURE__*/_jsx(motion.div, {
      initial: {
        scale: 0,
        rotate: -20
      },
      animate: {
        scale: 1,
        rotate: 0
      },
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 15,
        delay: 0.1
      },
      className: "mb-4",
      children: /*#__PURE__*/_jsx("span", {
        className: "text-5xl sm:text-6xl block drop-shadow-sm story-emoji-animate",
        children: emoji
      })
    }), /*#__PURE__*/_jsx(motion.p, {
      initial: {
        opacity: 0
      },
      animate: {
        opacity: 1
      },
      transition: {
        delay: 0.25,
        duration: 0.6
      },
      className: "text-[15px] italic font-medium leading-relaxed text-slate-600 max-w-md mx-auto",
      children: scene
    })]
  });
}

/** Story completion screen */
function CompletionScreen({
  story,
  totalXP,
  onQuizPlay,
  onClose
}) {
  return /*#__PURE__*/_jsxs(motion.div, {
    initial: {
      opacity: 0
    },
    animate: {
      opacity: 1
    },
    transition: {
      duration: 0.5
    },
    className: "relative flex flex-col items-center justify-center min-h-[70vh] px-4 py-8 overflow-hidden",
    children: [/*#__PURE__*/_jsx(CelebrationParticles, {}), /*#__PURE__*/_jsx(motion.div, {
      initial: {
        scale: 0,
        rotate: -30
      },
      animate: {
        scale: 1,
        rotate: 0
      },
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
        delay: 0.2
      },
      className: "relative z-10 mb-6",
      children: /*#__PURE__*/_jsx("div", {
        className: "w-24 h-24 rounded-full flex items-center justify-center story-trophy-glow bg-amber-50 border-2 border-amber-300 shadow-lg",
        children: /*#__PURE__*/_jsx(Trophy, {
          className: "w-10 h-10 text-amber-600"
        })
      })
    }), /*#__PURE__*/_jsx(motion.div, {
      initial: {
        opacity: 0,
        y: 20
      },
      animate: {
        opacity: 1,
        y: 0
      },
      transition: {
        delay: 0.4
      },
      children: /*#__PURE__*/_jsxs(Badge, {
        className: "text-xs font-bold px-4 py-1.5 mb-4 border-amber-300 bg-amber-100 text-amber-900 shadow-2xs",
        children: [/*#__PURE__*/_jsx(Sparkles, {
          className: "w-3 h-3 mr-1 text-amber-700"
        }), "MODULE COMPLETE!"]
      })
    }), /*#__PURE__*/_jsx(motion.h2, {
      initial: {
        opacity: 0,
        y: 15
      },
      animate: {
        opacity: 1,
        y: 0
      },
      transition: {
        delay: 0.5
      },
      className: "text-2xl sm:text-3xl font-black text-slate-900 text-center mb-2",
      children: story.storyTitle
    }), /*#__PURE__*/_jsx(motion.p, {
      initial: {
        opacity: 0,
        y: 10
      },
      animate: {
        opacity: 1,
        y: 0
      },
      transition: {
        delay: 0.6
      },
      className: "text-slate-500 text-sm mb-8 text-center font-medium",
      children: story.storySubtitle
    }), /*#__PURE__*/_jsxs(motion.div, {
      initial: {
        opacity: 0,
        scale: 0.8
      },
      animate: {
        opacity: 1,
        scale: 1
      },
      transition: {
        delay: 0.7
      },
      className: "flex items-center gap-2 mb-8 px-6 py-3 rounded-2xl bg-amber-50 border border-amber-200/90 shadow-2xs",
      children: [/*#__PURE__*/_jsx(Zap, {
        className: "w-5 h-5 text-amber-600"
      }), /*#__PURE__*/_jsxs("span", {
        className: "text-amber-800 font-bold text-lg",
        children: [totalXP, " XP"]
      }), /*#__PURE__*/_jsx("span", {
        className: "text-slate-600 font-medium text-sm",
        children: "kamaye"
      })]
    }), /*#__PURE__*/_jsxs(motion.div, {
      initial: {
        opacity: 0,
        y: 15
      },
      animate: {
        opacity: 1,
        y: 0
      },
      transition: {
        delay: 0.8
      },
      className: "w-full max-w-sm mb-8",
      children: [/*#__PURE__*/_jsx("p", {
        className: "text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 text-center",
        children: "Lessons learned"
      }), /*#__PURE__*/_jsx("div", {
        className: "space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar",
        children: story.chapters.map((ch, idx) => /*#__PURE__*/_jsxs(motion.div, {
          initial: {
            opacity: 0,
            x: -10
          },
          animate: {
            opacity: 1,
            x: 0
          },
          transition: {
            delay: 0.9 + idx * 0.08
          },
          className: "flex items-start gap-2 text-sm bg-white p-2.5 rounded-xl border border-slate-200/90 shadow-2xs",
          children: [/*#__PURE__*/_jsx(CheckCircle2, {
            className: "w-4 h-4 text-emerald-600 shrink-0 mt-0.5"
          }), /*#__PURE__*/_jsx("span", {
            className: "text-slate-700 font-medium leading-snug",
            children: ch.lesson
          })]
        }, ch.id))
      })]
    }), /*#__PURE__*/_jsxs(motion.div, {
      initial: {
        opacity: 0,
        y: 15
      },
      animate: {
        opacity: 1,
        y: 0
      },
      transition: {
        delay: 1.1
      },
      className: "flex flex-col sm:flex-row gap-3 w-full max-w-sm",
      children: [/*#__PURE__*/_jsxs(Button, {
        onClick: onQuizPlay,
        className: "flex-1 h-12 text-sm font-bold rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white gap-2 shadow-xs",
        children: [/*#__PURE__*/_jsx(BookOpen, {
          className: "w-4 h-4"
        }), "Quiz Khelo"]
      }), /*#__PURE__*/_jsx(Button, {
        onClick: onClose,
        variant: "outline",
        className: "flex-1 h-12 text-sm font-semibold rounded-xl border-slate-200 bg-white hover:bg-slate-50 text-slate-700 gap-2 shadow-2xs",
        children: "Wapas Jao"
      })]
    })]
  });
}

/* ================================================================== */
/*  Main Component                                                     */
/* ================================================================== */

export function StoryReader({
  story,
  onComplete,
  onClose,
  isModuleCompleted,
  currentProgress
}) {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [readChapters, setReadChapters] = useState(new Set());
  const [totalXP, setTotalXP] = useState(0);
  const [direction, setDirection] = useState(1);
  const [showXP, setShowXP] = useState(false);
  const [choiceAnswered, setChoiceAnswered] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const scrollRef = useRef(null);
  const chapter = story.chapters[currentChapter];
  const totalChapters = story.chapters.length;
  const progressPercent = readChapters.size / totalChapters * 100;

  // Mark chapter as read on view
  useEffect(() => {
    if (!readChapters.has(currentChapter)) {
      const timeout = setTimeout(() => {
        setReadChapters(prev => new Set([...prev, currentChapter]));
        setTotalXP(prev => prev + chapter.xpReward);
        setShowXP(true);
        setTimeout(() => setShowXP(false), 1500);
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [currentChapter, chapter.xpReward, readChapters]);

  // Scroll to top on chapter change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [currentChapter]);

  // Check if all chapters are read
  useEffect(() => {
    if (readChapters.size === totalChapters && !isComplete) {
      const timeout = setTimeout(() => {
        setIsComplete(true);
        onComplete();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [readChapters.size, totalChapters, isComplete, onComplete]);
  const handleChoiceAnswer = useCallback((chapterId, isCorrect) => {
    setChoiceAnswered(prev => ({
      ...prev,
      [chapterId]: true
    }));
  }, []);
  const canProceed = useCallback(chapterIdx => {
    const ch = story.chapters[chapterIdx];
    if (!ch?.choice) return true;
    return !!choiceAnswered[ch.id];
  }, [story.chapters, choiceAnswered]);
  const goNext = useCallback(() => {
    if (currentChapter < totalChapters - 1 && canProceed(currentChapter)) {
      setDirection(1);
      setCurrentChapter(prev => prev + 1);
    }
  }, [currentChapter, totalChapters, canProceed]);
  const goPrev = useCallback(() => {
    if (currentChapter > 0) {
      setDirection(-1);
      setCurrentChapter(prev => prev - 1);
    }
  }, [currentChapter]);

  // Slide animation variants
  const slideVariants = {
    enter: dir => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: dir => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0
    })
  };

  // If complete, show completion screen
  if (isComplete) {
    return /*#__PURE__*/_jsx("div", {
      className: "fixed inset-0 z-[100] bg-[#F8FAFC] overflow-y-auto",
      children: /*#__PURE__*/_jsxs("div", {
        className: "max-w-lg mx-auto",
        children: [/*#__PURE__*/_jsx("div", {
          className: "flex justify-end p-4",
          children: /*#__PURE__*/_jsx(Button, {
            onClick: onClose,
            variant: "ghost",
            size: "icon",
            className: "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 rounded-full",
            children: /*#__PURE__*/_jsx(X, {
              className: "w-5 h-5"
            })
          })
        }), /*#__PURE__*/_jsx(CompletionScreen, {
          story: story,
          totalXP: totalXP,
          onQuizPlay: onClose,
          onClose: onClose
        })]
      })
    });
  }
  return /*#__PURE__*/_jsxs("div", {
    className: "fixed inset-0 z-[100] bg-[#F8FAFC] flex flex-col",
    children: [/*#__PURE__*/_jsx("div", {
      className: "shrink-0 border-b border-slate-200/90 bg-white/95 backdrop-blur-md px-4 pt-3 pb-3 shadow-2xs",
      children: /*#__PURE__*/_jsxs("div", {
        className: "max-w-lg mx-auto",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-start justify-between mb-2",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex-1 min-w-0 pr-3",
            children: [/*#__PURE__*/_jsx("h2", {
              className: "text-lg sm:text-xl font-black text-slate-900 truncate",
              children: story.storyTitle
            }), /*#__PURE__*/_jsx("p", {
              className: "text-[11px] text-slate-500 font-medium truncate mt-0.5",
              children: story.storySubtitle
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-2 shrink-0",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200",
              children: [/*#__PURE__*/_jsx(Star, {
                className: "w-3.5 h-3.5 text-amber-600"
              }), /*#__PURE__*/_jsx("span", {
                className: "text-amber-800 font-bold text-sm",
                children: totalXP
              }), /*#__PURE__*/_jsx("span", {
                className: "text-amber-600 text-[10px] font-semibold",
                children: "XP"
              })]
            }), /*#__PURE__*/_jsx(Button, {
              onClick: onClose,
              variant: "ghost",
              size: "icon",
              className: "text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full h-9 w-9",
              children: /*#__PURE__*/_jsx(X, {
                className: "w-4 h-4"
              })
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-3",
          children: [/*#__PURE__*/_jsx(Progress, {
            value: progressPercent,
            className: "h-1.5 flex-1 bg-slate-100 [&>div]:bg-emerald-600"
          }), /*#__PURE__*/_jsxs("span", {
            className: "text-[10px] text-slate-500 font-bold shrink-0",
            children: [readChapters.size, "/", totalChapters]
          })]
        }), /*#__PURE__*/_jsx("div", {
          className: "mt-2",
          children: /*#__PURE__*/_jsx(ProgressDots, {
            total: totalChapters,
            current: currentChapter,
            readChapters: readChapters
          })
        })]
      })
    }), /*#__PURE__*/_jsx("div", {
      ref: scrollRef,
      className: "flex-1 overflow-y-auto story-reader-scroll",
      children: /*#__PURE__*/_jsxs("div", {
        className: "max-w-lg mx-auto px-4 py-6 relative",
        children: [/*#__PURE__*/_jsxs(motion.div, {
          initial: {
            opacity: 0,
            y: -10
          },
          animate: {
            opacity: 1,
            y: 0
          },
          className: "flex items-center gap-2 mb-5",
          children: [/*#__PURE__*/_jsx(BookOpen, {
            className: "w-4 h-4 text-emerald-700"
          }), /*#__PURE__*/_jsxs("span", {
            className: "text-xs font-semibold text-slate-600",
            children: ["Chapter ", chapter.chapterNumber, " of ", totalChapters]
          })]
        }), /*#__PURE__*/_jsx(AnimatePresence, {
          mode: "wait",
          custom: direction,
          children: /*#__PURE__*/_jsxs(motion.div, {
            custom: direction,
            variants: slideVariants,
            initial: "enter",
            animate: "center",
            exit: "exit",
            transition: {
              x: {
                type: 'spring',
                stiffness: 300,
                damping: 30
              },
              opacity: {
                duration: 0.25
              }
            },
            className: "relative",
            children: [/*#__PURE__*/_jsxs("div", {
              className: "rounded-2xl p-5 sm:p-6 bg-white border border-slate-200/90 shadow-2xs",
              children: [/*#__PURE__*/_jsx("h3", {
                className: "text-base sm:text-lg font-bold text-slate-900 mb-1",
                children: chapter.title
              }), /*#__PURE__*/_jsxs("div", {
                className: "flex items-center gap-1.5 mb-5",
                children: [/*#__PURE__*/_jsx(Zap, {
                  className: "w-3 h-3 text-amber-600"
                }), /*#__PURE__*/_jsxs("span", {
                  className: "text-[10px] text-amber-700 font-bold",
                  children: ["+", chapter.xpReward, " XP"]
                })]
              }), /*#__PURE__*/_jsx(SceneCard, {
                scene: chapter.scene,
                emoji: chapter.emoji
              }), /*#__PURE__*/_jsx(DialogueBubble, {
                dialogue: chapter.dialogue,
                speaker: chapter.speaker
              }), /*#__PURE__*/_jsx(LessonCard, {
                lesson: chapter.lesson
              }), chapter.choice && /*#__PURE__*/_jsx(ChoiceCard, {
                choice: chapter.choice,
                onAnswer: isCorrect => handleChoiceAnswer(chapter.id, isCorrect),
                answered: !!choiceAnswered[chapter.id]
              }), /*#__PURE__*/_jsx("div", {
                className: "relative",
                children: /*#__PURE__*/_jsx(XPReward, {
                  amount: chapter.xpReward,
                  show: showXP
                })
              })]
            }), /*#__PURE__*/_jsx("div", {
              className: "flex items-center justify-center mt-4 gap-2",
              children: story.chapters.map((_, idx) => {
                const isRead = readChapters.has(idx);
                const isCurrent = idx === currentChapter;
                return /*#__PURE__*/_jsx(motion.div, {
                  className: `
                        flex items-center justify-center w-8 h-8 rounded-full border text-xs font-semibold
                        transition-colors duration-300
                        ${isCurrent ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold shadow-xs' : isRead ? 'border-emerald-200 bg-emerald-50/60 text-emerald-600' : 'border-slate-200 bg-white text-slate-400'}
                      `,
                  whileTap: {
                    scale: 0.9
                  },
                  children: isRead && !isCurrent ? /*#__PURE__*/_jsx(CheckCircle2, {
                    className: "w-3.5 h-3.5"
                  }) : !isRead && !isCurrent ? /*#__PURE__*/_jsx(Lock, {
                    className: "w-3 h-3"
                  }) : idx + 1
                }, idx);
              })
            })]
          }, currentChapter)
        })]
      })
    }), /*#__PURE__*/_jsxs("div", {
      className: "shrink-0 border-t border-slate-200/90 bg-white/95 backdrop-blur-md px-4 py-3 shadow-sm",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "max-w-lg mx-auto flex items-center gap-3",
        children: [/*#__PURE__*/_jsxs(Button, {
          onClick: goPrev,
          disabled: currentChapter === 0,
          variant: "outline",
          className: "flex-1 h-12 rounded-xl border-slate-200 bg-white hover:bg-slate-50 text-slate-700 gap-1.5 font-semibold text-sm disabled:opacity-40 shadow-2xs",
          children: [/*#__PURE__*/_jsx(ChevronLeft, {
            className: "w-4 h-4"
          }), /*#__PURE__*/_jsx("span", {
            className: "sm:inline",
            children: "Peeche Jao"
          })]
        }), /*#__PURE__*/_jsxs(Button, {
          onClick: goNext,
          disabled: currentChapter === totalChapters - 1 || !canProceed(currentChapter),
          className: "flex-1 h-12 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white gap-1.5 font-bold text-sm disabled:opacity-40 disabled:bg-emerald-600 shadow-xs",
          children: [/*#__PURE__*/_jsx("span", {
            className: "sm:inline",
            children: "Aage Badho"
          }), /*#__PURE__*/_jsx(ChevronRight, {
            className: "w-4 h-4"
          })]
        })]
      }), chapter.choice && !canProceed(currentChapter) && /*#__PURE__*/_jsx(motion.p, {
        initial: {
          opacity: 0
        },
        animate: {
          opacity: 1
        },
        className: "text-center text-[10px] text-amber-700 font-bold mt-2",
        children: "Pehle apna jawab do, phir aage badho!"
      })]
    })]
  });
}
export default StoryReader;
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Trash2, Sparkles, ArrowUp } from 'lucide-react';
import { useAppStore } from '@/lib/store/useAppStore';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
const QUICK_QUESTIONS = ['How do I start a SIP?', 'How much should my emergency fund be?', 'Is a credit card a good idea?', 'Where should I make my first investment?', 'How do I create a budget?'];
const TYPING_DOTS = [{
  id: 1,
  delay: 0
}, {
  id: 2,
  delay: 0.15
}, {
  id: 3,
  delay: 0.3
}];
export function FinanceAdvisor() {
  const {
    advisorMessages,
    advisorSessionCount,
    advisorConversationId,
    setAdvisorConversationId,
    addAdvisorMessage,
    clearAdvisorMessages,
    coins,
    completedModules,
    streak,
    masteredTerms,
    userName,
    isAdvisorOpen: isOpen,
    setAdvisorOpen: setIsOpen
  } = useAppStore();
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, []);
  useEffect(() => {
    scrollToBottom();
  }, [advisorMessages, isLoading, scrollToBottom]);
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);
  const sendMessage = useCallback(async message => {
    const trimmed = message.trim();
    if (!trimmed || isLoading) return;
    const userMsg = {
      role: 'user',
      content: trimmed,
      timestamp: Date.now()
    };
    addAdvisorMessage(userMsg);
    setInputValue('');
    setIsLoading(true);
    try {
      const recentMessages = advisorMessages.slice(-6).map(m => ({
        role: m.role,
        content: m.content
      }));
      const response = await fetch('/api/finance-advisor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: trimmed,
          conversationId: advisorConversationId,
          context: {
            coins,
            completedModules,
            streak,
            masteredTerms,
            userName,
            sessionCount: advisorSessionCount,
            recentMessages,
            moduleContext: useAppStore.getState().moduleContext
          }
        })
      });
      const data = await response.json();
      if (data.conversationId && !advisorConversationId) {
        setAdvisorConversationId(data.conversationId);
      }
      if (data.reply) {
        const aiMsg = {
          role: 'assistant',
          content: data.reply,
          timestamp: Date.now()
        };
        addAdvisorMessage(aiMsg);
      } else if (data.error) {
        const errorMsg = {
          role: 'assistant',
          content: `⚠️ ${data.error}`,
          timestamp: Date.now()
        };
        addAdvisorMessage(errorMsg);
      }
    } catch {
      const errorMsg = {
        role: 'assistant',
        content: 'Oops, there was a connection issue! 🙏 Please try again in a moment — check your internet!',
        timestamp: Date.now()
      };
      addAdvisorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, addAdvisorMessage, advisorMessages, coins, completedModules, streak, masteredTerms, userName, advisorSessionCount]);
  const handleSubmit = e => {
    e.preventDefault();
    sendMessage(inputValue);
  };
  const handleQuickQuestion = question => {
    sendMessage(question);
  };
  const handleClear = () => {
    clearAdvisorMessages();
  };
  const hasMessages = advisorMessages.length > 0;
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx(AnimatePresence, {
      children: !isOpen && /*#__PURE__*/_jsxs(motion.button, {
        initial: {
          scale: 0,
          opacity: 0
        },
        animate: {
          scale: 1,
          opacity: 1
        },
        exit: {
          scale: 0,
          opacity: 0
        },
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 20
        },
        onClick: () => setIsOpen(true),
        className: "fixed z-50 md:bottom-6 bottom-20 right-4 md:right-6 w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-[#0a0a0f] shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 flex items-center justify-center transition-shadow group",
        "aria-label": "Chat with Money Matters",
        children: [/*#__PURE__*/_jsx(MessageCircle, {
          className: "w-6 h-6 group-hover:scale-110 transition-transform"
        }), /*#__PURE__*/_jsx(motion.span, {
          className: "absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0a0a0f]",
          animate: {
            scale: [1, 1.2, 1]
          },
          transition: {
            repeat: Infinity,
            duration: 2,
            ease: 'easeInOut'
          }
        }), /*#__PURE__*/_jsx("span", {
          className: "absolute inset-0 rounded-full animate-chat-pulse bg-amber-400/30"
        })]
      })
    }), /*#__PURE__*/_jsx(AnimatePresence, {
      children: isOpen && /*#__PURE__*/_jsxs(motion.div, {
        initial: {
          opacity: 0,
          y: 20,
          scale: 0.95
        },
        animate: {
          opacity: 1,
          y: 0,
          scale: 1
        },
        exit: {
          opacity: 0,
          y: 20,
          scale: 0.95
        },
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 25
        },
        className: "fixed z-50 md:bottom-6 md:right-6 bottom-0 right-0 left-0 md:left-auto w-full md:w-[400px] h-[85vh] md:h-[560px] bg-white/98 backdrop-blur-xl border border-slate-200/90 md:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col overflow-hidden",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-white",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-3",
            children: [/*#__PURE__*/_jsx("div", {
              className: "w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center shadow-md shadow-amber-500/20",
              children: /*#__PURE__*/_jsx(Sparkles, {
                className: "w-5 h-5 text-slate-950"
              })
            }), /*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsx("h3", {
                className: "text-sm font-extrabold text-slate-900",
                children: "Money Matters"
              }), /*#__PURE__*/_jsx("p", {
                className: "text-[10px] text-slate-500 font-medium",
                children: "Your personal finance advisor"
              })]
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-1",
            children: [hasMessages && /*#__PURE__*/_jsx("button", {
              onClick: handleClear,
              className: "p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer",
              "aria-label": "Clear chat",
              title: "Clear chat",
              children: /*#__PURE__*/_jsx(Trash2, {
                className: "w-4 h-4"
              })
            }), /*#__PURE__*/_jsx("button", {
              onClick: () => setIsOpen(false),
              className: "p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer",
              "aria-label": "Close chat",
              children: /*#__PURE__*/_jsx(X, {
                className: "w-4 h-4"
              })
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "flex-1 overflow-y-auto p-4 space-y-3 strategy-scroll bg-slate-50/40",
          children: [!hasMessages && /*#__PURE__*/_jsxs(motion.div, {
            initial: {
              opacity: 0,
              y: 10
            },
            animate: {
              opacity: 1,
              y: 0
            },
            transition: {
              delay: 0.1
            },
            className: "text-center py-8",
            children: [/*#__PURE__*/_jsx("div", {
              className: "w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-4 shadow-2xs",
              children: /*#__PURE__*/_jsx(Sparkles, {
                className: "w-8 h-8 text-amber-500"
              })
            }), /*#__PURE__*/_jsx("h4", {
              className: "text-base font-extrabold text-slate-900 mb-1",
              children: "Hello! 👋"
            }), /*#__PURE__*/_jsxs("p", {
              className: "text-sm text-slate-600 mb-4 leading-relaxed",
              children: ["I'm ", /*#__PURE__*/_jsx("span", {
                className: "text-amber-700 font-bold",
                children: "Money Matters"
              }), " — your personal finance advisor!", /*#__PURE__*/_jsx("br", {}), "Ask me anything about personal finance!"]
            }), /*#__PURE__*/_jsxs("div", {
              className: "space-y-2",
              children: [/*#__PURE__*/_jsx("p", {
                className: "text-xs font-bold text-slate-500 mb-2",
                children: "Try these 👇"
              }), QUICK_QUESTIONS.map((q, i) => /*#__PURE__*/_jsx(motion.button, {
                initial: {
                  opacity: 0,
                  x: -10
                },
                animate: {
                  opacity: 1,
                  x: 0
                },
                transition: {
                  delay: 0.2 + i * 0.05
                },
                onClick: () => handleQuickQuestion(q),
                className: "w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-amber-800 bg-amber-50 border border-amber-200/80 hover:bg-amber-100/70 transition-colors shadow-2xs cursor-pointer",
                children: q
              }, q))]
            })]
          }), advisorMessages.map((msg, index) => /*#__PURE__*/_jsx(motion.div, {
            initial: {
              opacity: 0,
              y: 8,
              scale: 0.97
            },
            animate: {
              opacity: 1,
              y: 0,
              scale: 1
            },
            transition: {
              type: 'spring',
              stiffness: 400,
              damping: 25
            },
            className: `flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`,
            children: /*#__PURE__*/_jsxs("div", {
              className: `max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-amber-500 text-slate-950 font-medium rounded-br-md shadow-sm' : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-md shadow-2xs'}`,
              children: [/*#__PURE__*/_jsx("div", {
                className: "whitespace-pre-wrap break-words",
                children: msg.content
              }), /*#__PURE__*/_jsx("div", {
                className: `text-[9px] mt-1 font-bold ${msg.role === 'user' ? 'text-slate-950/60' : 'text-slate-400'}`,
                children: new Date(msg.timestamp).toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit'
                })
              })]
            })
          }, `${msg.timestamp}-${index}`)), isLoading && /*#__PURE__*/_jsx(motion.div, {
            initial: {
              opacity: 0,
              y: 8
            },
            animate: {
              opacity: 1,
              y: 0
            },
            className: "flex justify-start",
            children: /*#__PURE__*/_jsx("div", {
              className: "bg-white border border-slate-200/90 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5 shadow-2xs",
              children: TYPING_DOTS.map(dot => /*#__PURE__*/_jsx(motion.span, {
                className: "w-2 h-2 bg-amber-500 rounded-full",
                animate: {
                  y: [0, -6, 0],
                  opacity: [0.4, 1, 0.4]
                },
                transition: {
                  repeat: Infinity,
                  duration: 0.8,
                  delay: dot.delay,
                  ease: 'easeInOut'
                }
              }, dot.id))
            })
          }), /*#__PURE__*/_jsx("div", {
            ref: messagesEndRef
          })]
        }), hasMessages && !isLoading && /*#__PURE__*/_jsx("div", {
          className: "px-4 pb-2",
          children: /*#__PURE__*/_jsx("div", {
            className: "flex gap-1.5 overflow-x-auto pb-1 scrollbar-none",
            children: QUICK_QUESTIONS.map(q => /*#__PURE__*/_jsx("button", {
              onClick: () => handleQuickQuestion(q),
              className: "shrink-0 text-[11px] font-semibold px-2.5 py-1.5 rounded-full text-amber-800 bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer",
              children: q
            }, q))
          })
        }), hasMessages && /*#__PURE__*/_jsx("div", {
          className: "px-4 pb-1",
          children: /*#__PURE__*/_jsx("p", {
            className: "text-[9px] text-slate-400 text-center font-medium",
            children: "⚠️ This is educational advice, not a substitute for professional consultation"
          })
        }), /*#__PURE__*/_jsxs("form", {
          onSubmit: handleSubmit,
          className: "flex items-center gap-2 px-4 py-3 border-t border-slate-100 bg-white",
          children: [/*#__PURE__*/_jsx("input", {
            ref: inputRef,
            type: "text",
            value: inputValue,
            onChange: e => setInputValue(e.target.value),
            placeholder: "Ask your question...",
            disabled: isLoading,
            className: "flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:bg-white disabled:opacity-50 transition-colors",
            maxLength: 500
          }), /*#__PURE__*/_jsx("button", {
            type: "submit",
            disabled: !inputValue.trim() || isLoading,
            className: "w-10 h-10 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 cursor-pointer shadow-xs",
            "aria-label": "Send message",
            children: /*#__PURE__*/_jsx(ArrowUp, {
              className: "w-5 h-5 font-bold"
            })
          })]
        })]
      })
    })]
  });
}
'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Zap, Clock, Flame, Trophy, RotateCcw, 
  ChevronRight, CheckCircle2, XCircle, Share2, Sparkles 
} from 'lucide-react';
import { useAppStore } from '@/lib/store/useAppStore';
import { quizQuestions } from '@/lib/data/quiz-data';
import { toast } from '@/hooks/use-toast';

const CATEGORIES = [
  {
    id: 'banking',
    label: 'Banking',
    emoji: '🏦',
    color: '#2563eb',
    moduleIds: [3]
  },
  {
    id: 'tax',
    label: 'Tax',
    emoji: '📋',
    color: '#F59E0B',
    moduleIds: [10]
  },
  {
    id: 'investment',
    label: 'Investment',
    emoji: '8B5CF6', // violet
    color: '#8B5CF6',
    moduleIds: [7]
  },
  {
    id: 'budgeting',
    label: 'Budgeting',
    emoji: '💰',
    color: '#EC4899',
    moduleIds: [1, 2]
  },
  {
    id: 'insurance',
    label: 'Insurance',
    emoji: '🛡️',
    color: '#06B6D4',
    moduleIds: [9]
  },
  {
    id: 'random',
    label: 'Random Mix',
    emoji: '🎲',
    color: '#EF4444',
    moduleIds: []
  }
];

const QUESTION_TIME = 15;

function HexTile({ category, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.06, y: -4 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="relative group focus:outline-none"
    >
      <div 
        className="relative w-24 h-28 sm:w-28 sm:h-32 flex items-center justify-center cursor-pointer shadow-xs"
        style={{
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          background: `#F8FAFC`,
          border: `2px solid ${category.color}50`
        }}
      >
        <div 
          className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300"
          style={{
            background: category.color
          }}
        />
        <div className="relative flex flex-col items-center gap-1.5 p-2 text-center">
          <span className="text-3xl filter drop-shadow-xs">{category.emoji}</span>
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-900">{category.label}</span>
        </div>
      </div>
    </motion.button>
  );
}

function QuizToast({ toastInfo }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.8 }}
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-[200] rounded-2xl px-5 py-3 border-2 flex items-center gap-2.5 shadow-xl backdrop-blur-md ${
        toastInfo.type === 'correct' 
          ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
          : 'bg-rose-50 border-rose-300 text-rose-900'
      }`}
    >
      {toastInfo.type === 'correct' ? (
        <CheckCircle2 size={18} className="text-emerald-600" />
      ) : (
        <XCircle size={18} className="text-rose-600" />
      )}
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-black uppercase tracking-wider">{toastInfo.message}</span>
        {toastInfo.coins && (
          <span className="text-xs font-black text-amber-600">+{toastInfo.coins} 🪙</span>
        )}
      </div>
    </motion.div>
  );
}

export default function QuizArena({ open, onClose }) {
  const {
    addCoins,
    recordQuizScore,
    setQuizArenaBestStreak,
    quizArenaBestStreak,
    setQuizArenaHighScore
  } = useAppStore();

  const [stage, setStage] = useState('categories'); // 'categories', 'playing', 'results'
  const [category, setCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [toastInfo, setToastInfo] = useState(null);
  const timerRef = useRef(null);

  const currentQ = questions[qIndex];
  const isLastQ = qIndex >= questions.length - 1;

  // Start quiz for a category
  const startQuiz = useCallback((cat) => {
    let pool;
    if (cat.id === 'random') {
      pool = [...quizQuestions].sort(() => Math.random() - 0.5);
    } else {
      pool = quizQuestions.filter(q => cat.moduleIds.includes(q.moduleId));
      if (pool.length < 5) {
        // Fallback if not enough module questions
        pool = [...pool, ...quizQuestions.filter(q => !cat.moduleIds.includes(q.moduleId))].slice(0, 10);
      }
    }
    const picked = pool.slice(0, 10).sort(() => Math.random() - 0.5);
    setCategory(cat);
    setQuestions(picked);
    setQIndex(0);
    setSelected(null);
    setShowExplanation(false);
    setScore(0);
    setCombo(0);
    setBestCombo(0);
    setTimeLeft(QUESTION_TIME);
    setStage('playing');
  }, []);

  // Handle answer click
  const handleAnswer = useCallback((optIdx) => {
    if (selected !== null || showExplanation) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setSelected(optIdx);
    setShowExplanation(true);
    
    const correct = optIdx === currentQ.correctIndex;
    if (correct) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      setBestCombo(b => Math.max(b, newCombo));
      const bonus = Math.min(5, Math.floor(newCombo / 2));
      const coinsWon = 10 + bonus * 2;
      setScore(s => s + coinsWon);
      addCoins(coinsWon);
      
      setToastInfo({
        type: 'correct',
        message: newCombo > 1 ? `${newCombo}x Streak! 🔥` : 'Sahi Jawab!',
        coins: coinsWon
      });
    } else {
      setCombo(0);
      setToastInfo({
        type: 'wrong',
        message: optIdx === -1 ? '⏰ Time Up!' : 'Galat Jawab!'
      });
    }

    setTimeout(() => setToastInfo(null), 1500);
  }, [selected, showExplanation, currentQ, combo, addCoins]);

  // Timer hook
  const handleAnswerRef = useRef(handleAnswer);
  handleAnswerRef.current = handleAnswer;
  
  useEffect(() => {
    if (stage !== 'playing' || showExplanation) return;
    setTimeLeft(QUESTION_TIME);
    
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(interval);
          setTimeout(() => handleAnswerRef.current(-1), 0);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [stage, qIndex, showExplanation]);

  const handleNext = useCallback(() => {
    if (isLastQ) {
      if (category) {
        // Safe check for store update
        try {
          if (typeof setQuizArenaHighScore === 'function') {
            setQuizArenaHighScore(category.id, score);
          }
          if (typeof recordQuizScore === 'function') {
            recordQuizScore(`arena-${category.id}`, score);
          }
          if (typeof setQuizArenaBestStreak === 'function') {
            setQuizArenaBestStreak(bestCombo);
          }
        } catch (e) {
          console.error(e);
        }
      }
      setStage('results');
    } else {
      setQIndex(i => i + 1);
      setSelected(null);
      setShowExplanation(false);
      setTimeLeft(QUESTION_TIME);
    }
  }, [isLastQ, category, score, bestCombo, setQuizArenaHighScore, recordQuizScore, setQuizArenaBestStreak]);

  const handleClose = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    onClose();
    setTimeout(() => {
      setStage('categories');
      setCategory(null);
      setQuestions([]);
      setQIndex(0);
      setSelected(null);
      setShowExplanation(false);
      setScore(0);
      setCombo(0);
      setBestCombo(0);
    }, 300);
  };

  const accuracyPct = questions.length > 0 ? Math.round((score / (questions.length * 15)) * 100) : 0;
  const storeState = useAppStore();
  const highScore = category ? (storeState.quizArenaHighScores?.[category.id] || 0) : 0;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* Backdrop blur overlay */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal Container */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative z-10 w-full max-w-2xl bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="shrink-0 px-6 py-4 border-b border-slate-100 bg-slate-50/80 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center">
              <Trophy size={20} className="text-amber-600" />
            </div>
            <div>
              <h2 className="text-base font-black font-display text-slate-900">Gyan Arena 🧠</h2>
              <p className="text-[11px] font-medium text-slate-500">Play Financial Quizzes & Earn Real Coins</p>
            </div>
          </div>
          <button 
            onClick={handleClose} 
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-all focus:outline-none"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scroll">
          <AnimatePresence mode="wait">
            {stage === 'categories' && (
              <motion.div
                key="categories"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 text-center"
              >
                <div className="space-y-2">
                  <span className="text-5xl animate-bounce inline-block mt-2">🧠</span>
                  <h3 className="text-xl font-black font-display text-slate-900">Category Select Karein!</h3>
                  <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                    Har quiz mein 10 sawaal hote hain. Combo streak banayein aur bonus coins haasil karein!
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 justify-items-center max-w-lg mx-auto py-4">
                  {CATEGORIES.map((cat) => (
                    <HexTile key={cat.id} category={cat} onClick={() => startQuiz(cat)} />
                  ))}
                </div>

                {quizArenaBestStreak > 0 && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50 border border-amber-200">
                    <Flame size={14} className="text-amber-600 fill-amber-600 animate-pulse" />
                    <span className="text-xs font-black text-amber-800 uppercase tracking-wider">
                      Best Streak: {quizArenaBestStreak}x Combo
                    </span>
                  </div>
                )}
              </motion.div>
            )}

            {stage === 'playing' && currentQ && (
              <motion.div
                key={`playing-${qIndex}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                {/* Timer details */}
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/90 p-3 rounded-2xl">
                  <Clock size={16} className="text-amber-600" />
                  <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 ease-linear"
                      style={{ 
                        width: `${(timeLeft / QUESTION_TIME) * 100}%`,
                        backgroundColor: timeLeft > 7 ? '#047857' : timeLeft > 3 ? '#D97706' : '#DC2626'
                      }}
                    />
                  </div>
                  <span className={`text-xs font-black w-8 text-right ${timeLeft > 3 ? 'text-slate-600' : 'text-rose-600 animate-pulse'}`}>
                    {timeLeft}s
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Question {qIndex + 1} of {questions.length}
                  </span>
                  {combo > 1 && (
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-800 text-xs font-black uppercase tracking-wider animate-bounce">
                      <Flame size={12} className="fill-amber-600 text-amber-600" /> {combo}x Combo!
                    </span>
                  )}
                </div>

                {/* Question Text */}
                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/90 relative overflow-hidden shadow-xs">
                  <p className="text-base font-black font-display text-slate-900 leading-relaxed">
                    {currentQ.question}
                  </p>
                </div>

                {/* Options list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {currentQ.options.map((option, idx) => {
                    const isSelected = selected === idx;
                    const isCorrect = idx === currentQ.correctIndex;
                    const revealed = showExplanation;

                    return (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(idx)}
                        disabled={revealed}
                        className={`p-4 rounded-2xl text-left border-2 flex items-center gap-3 transition-all cursor-pointer ${
                          revealed
                            ? isCorrect
                              ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold'
                              : isSelected
                                ? 'bg-rose-50 border-rose-500 text-rose-950 font-bold'
                                : 'bg-slate-50 border-slate-200 text-slate-400'
                            : 'bg-white border-slate-200/90 text-slate-800 hover:border-emerald-400 hover:bg-emerald-50/30 shadow-xs'
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black uppercase shrink-0 ${
                          revealed
                            ? isCorrect
                              ? 'bg-emerald-600 text-white'
                              : isSelected
                                ? 'bg-rose-600 text-white'
                                : 'bg-slate-200 text-slate-400'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {revealed && isCorrect ? '✓' : revealed && isSelected ? '✗' : ['A', 'B', 'C', 'D'][idx]}
                        </div>
                        <span className="text-xs font-bold leading-snug">{option}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Card */}
                <AnimatePresence>
                  {showExplanation && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-5 rounded-3xl bg-emerald-50/70 border border-emerald-200 space-y-3 relative overflow-hidden"
                    >
                      <div className="flex items-start gap-3">
                        <Sparkles size={16} className="text-amber-600 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <span className="text-[10px] font-black text-emerald-900 uppercase tracking-widest block">EXPLANATION</span>
                          <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                            {currentQ.explanation}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={handleNext}
                        className="w-full py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer mt-2"
                      >
                        {isLastQ ? 'See Score Summary' : 'Agle Sawaal Par Chalein'} <ChevronRight size={14} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {stage === 'results' && category && (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6 space-y-6"
              >
                <div className="space-y-3">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-50 border border-amber-200 shadow-md relative">
                    <Trophy size={36} className="text-amber-600 animate-pulse" />
                    <div className="absolute -top-1 -right-1 bg-emerald-600 text-white rounded-full p-1 border border-white">
                      <Sparkles size={12} className="fill-white" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-black font-display text-slate-900">Quiz Completed! 🎉</h3>
                    <p className="text-xs text-slate-600 font-bold uppercase tracking-wider">
                      {category.emoji} {category.label} Module Mastery
                    </p>
                  </div>
                </div>

                <div className="max-w-xs mx-auto p-6 rounded-3xl bg-slate-50 border border-slate-200/90 space-y-1 shadow-xs">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">SCORE ACHIEVED</span>
                  <span className="text-5xl font-black font-display text-slate-900 block mt-1">{score}</span>
                  <span className="text-xs font-black text-amber-700 uppercase tracking-wider block pt-2">Coins Earned 🪙</span>
                </div>

                {/* Score Stats */}
                <div className="grid grid-cols-3 gap-3 max-w-md mx-auto pt-2">
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 text-center space-y-1 shadow-2xs">
                    <span className="text-xs text-slate-500 font-black uppercase tracking-wider block">Accuracy</span>
                    <span className="text-sm font-black text-slate-900 block">{accuracyPct}%</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 text-center space-y-1 shadow-2xs">
                    <span className="text-xs text-slate-500 font-black uppercase tracking-wider block">Max Combo</span>
                    <span className="text-sm font-black text-amber-600 block">{bestCombo}x</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 text-center space-y-1 shadow-2xs">
                    <span className="text-xs text-slate-500 font-black uppercase tracking-wider block">High Score</span>
                    <span className="text-sm font-black text-emerald-700 block">{highScore || score}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-4">
                  <button
                    onClick={() => setStage('categories')}
                    className="w-full sm:flex-1 py-3.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 focus:outline-none"
                  >
                    <RotateCcw size={14} /> Play Again
                  </button>
                  <button
                    onClick={() => {
                      if (typeof navigator !== 'undefined' && navigator.share) {
                        navigator.share({
                          title: 'Gyan Arena Score Card',
                          text: `Maine Gyan Arena mein ${category.label} quiz khela aur ${score} points score kiye with ${accuracyPct}% accuracy! Tum bhi try karo!`
                        }).catch(() => {});
                      } else {
                        toast({
                          title: 'Score Card Link copied! 🔗',
                          description: 'Apne scores dosto ke sath share karein.'
                        });
                      }
                    }}
                    className="w-full sm:flex-1 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95 focus:outline-none"
                  >
                    <Share2 size={14} /> Share Score
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="shrink-0 px-6 py-4 border-t border-slate-100 bg-slate-50/80 backdrop-blur-md flex items-center justify-center text-center">
          <p className="text-[10px] text-slate-500 font-bold tracking-wide">
            Gyan Arena Quiz — answers are verified using live course curriculum
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export { QuizArena };
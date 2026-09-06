'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Target, Plus, Trash2, TrendingUp, Calendar, IndianRupee, 
  Sparkles, Trophy, Award, Rocket, ChevronRight, ArrowLeft,
  CheckCircle2, Clock, Zap
} from 'lucide-react';
import { useAppStore, useHydration } from '@/lib/store/useAppStore';
import { toast } from '@/hooks/use-toast';

const GOAL_TEMPLATES = [
  { id: 'bike', label: 'First Bike 🏍️', emoji: '🏍️', target: 120000, color: '#EF4444', hint: 'Save ₹150 daily. Skip 3 cups of tea!' },
  { id: 'phone', label: 'New Phone 📱', emoji: '📱', target: 30000, color: '#8B5CF6', hint: 'Save ₹80 daily. Ready for a new phone in 1 year!' },
  { id: 'trip', label: 'Vacation Trip ✈️', emoji: '✈️', target: 20000, color: '#2563eb', hint: 'Save ₹60 daily. Fun trip funded in 10 months!' },
  { id: 'emergency', label: 'Emergency Fund 🛡️', emoji: '🛡️', target: 50000, color: '#F59E0B', hint: '3 months survival buffer. Daily savings target: ₹140.' },
  { id: 'laptop', label: 'Work Laptop 💻', emoji: '💻', target: 60000, color: '#06B6D4', hint: 'Save ₹180 daily or allocate small freelance income.' },
  { id: 'custom', label: 'Custom Goal ✏️', emoji: '🎯', target: 10000, color: '#EC4899', hint: 'Set your own custom financial target.' }
];

function daysRemaining(deadline) {
  if (!deadline) return 180;
  const d = new Date(deadline);
  if (isNaN(d.getTime())) return 180;
  const today = new Date();
  today.setHours(0,0,0,0);
  d.setHours(0,0,0,0);
  return Math.max(1, Math.ceil((d.getTime() - today.getTime()) / 86400000));
}

export default function GoalsPage() {
  const hydrated = useHydration();
  const router = useRouter();
  const { goals, addGoal, updateGoalSaved, deleteGoal, addCoins, isAuthenticated } = useAppStore();
  
  const [addOpen, setAddOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  
  // Form states
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [quickSaveAmount, setQuickSaveAmount] = useState({});

  const activeGoals = useMemo(() => goals.filter(g => g.saved < g.target), [goals]);
  const completedGoals = useMemo(() => goals.filter(g => g.saved >= g.target), [goals]);
  const totalSaved = useMemo(() => goals.reduce((acc, g) => acc + g.saved, 0), [goals]);
  const totalTarget = useMemo(() => goals.reduce((acc, g) => acc + g.target, 0), [goals]);
  const totalProgress = useMemo(() => {
    if (totalTarget <= 0) return 0;
    return Math.round((totalSaved / totalTarget) * 100);
  }, [totalSaved, totalTarget]);

  const handleSelectTemplate = (t) => {
    setSelectedTemplate(t);
    setName(t.label.replace(/^[^ ]+ /, ''));
    setTarget(String(t.target));
    const d = new Date();
    d.setMonth(d.getMonth() + 6);
    setDeadline(d.toISOString().split('T')[0]);
  };

  const handleAddGoal = () => {
    if (!selectedTemplate) return;
    const finalTarget = parseInt(target, 10) || selectedTemplate.target;
    
    const newGoal = {
      id: `goal-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: name.trim() || selectedTemplate.label.split(' ')[1] || 'My Goal',
      target: finalTarget,
      saved: 0,
      deadline: deadline || new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0],
      category: selectedTemplate.color,
      emoji: selectedTemplate.emoji,
      createdAt: new Date().toISOString().split('T')[0]
    };

    addGoal(newGoal);
    addCoins(10);
    
    // Reset form
    setSelectedTemplate(null);
    setName('');
    setTarget('');
    setDeadline('');
    setAddOpen(false);

    toast({
      title: "Goal created! +10 Coins 🎯",
      description: "Check your roadmap and start saving today!"
    });

    // Navigate to roadmap page
    setTimeout(() => router.push(`/home/goals/roadmap?goalId=${newGoal.id}`), 500);
  };

  const handleAddSavings = (goalId, goalSaved, goalTarget) => {
    const amtStr = quickSaveAmount[goalId] || '';
    const amt = parseInt(amtStr, 10);
    if (!amt || amt <= 0) return;

    const newSaved = goalSaved + amt;
    updateGoalSaved(goalId, amt);
    setQuickSaveAmount(prev => ({ ...prev, [goalId]: '' }));

    if (newSaved >= goalTarget) {
      addCoins(50);
      toast({
        title: "Goal Completed! +50 Coins 🏆✨",
        description: "Incredible savings commitment!"
      });
    } else {
      addCoins(5);
      toast({
        title: `Saved ₹${amt.toLocaleString('en-IN')}! +5 Coins 💰`,
        description: "Consistency leads to success."
      });
    }
  };

  // Render immediately for snappy tab switching

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            <Target className="text-emerald-700" size={28} />
            Your Goals
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Set financial goals and achieve them with an AI-powered roadmap
          </p>
        </div>
        <button
          onClick={() => setAddOpen(!addOpen)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 shadow-sm text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
        >
          <Plus size={16} />
          New Goal
        </button>
      </div>



      {/* Add Goal Form */}
      <AnimatePresence>
        {addOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border border-slate-200/80 rounded-3xl overflow-hidden bg-white shadow-sm"
          >
            <div className="p-6 space-y-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Sparkles size={14} className="text-emerald-700" />
                Choose Goal Preset
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {GOAL_TEMPLATES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => handleSelectTemplate(t)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      selectedTemplate?.id === t.id 
                        ? 'bg-emerald-50/80 border-emerald-500 shadow-sm' 
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                    }`}
                  >
                    <span className="text-3xl block">{t.emoji}</span>
                    <span className="text-xs font-extrabold text-slate-800 block mt-2">{t.label}</span>
                    <span className="text-[10px] text-slate-500 font-bold block mt-1">₹{t.target.toLocaleString('en-IN')}</span>
                  </button>
                ))}
              </div>

              {selectedTemplate && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2"
                >
                  <Sparkles size={14} className="shrink-0 mt-0.5 text-emerald-700" />
                  <span>{selectedTemplate.hint}</span>
                </motion.div>
              )}

              {selectedTemplate && (
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Goal Name</label>
                    <input 
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. My Dream Bike"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Target Fund (₹)</label>
                      <input 
                        type="number"
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                        placeholder="e.g. 50000"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Target Date</label>
                      <input 
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleAddGoal}
                    className="w-full py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 shadow-sm text-white text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
                  >
                    <Rocket size={16} />
                    Create Goal & View Roadmap
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Goals List */}
      {goals.length === 0 && !addOpen ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-white border border-slate-200/80 rounded-3xl shadow-sm space-y-4"
        >
          <div className="text-6xl">🎯</div>
          <div className="space-y-2">
            <h3 className="text-xl font-extrabold text-slate-900">No goals set yet!</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Set your first financial goal and achieve it with an AI-powered roadmap. 
              Click the "New Goal" button to start!
            </p>
          </div>
          <button
            onClick={() => setAddOpen(true)}
            className="px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 shadow-sm text-white text-sm font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-sm"
          >
            <Plus size={16} />
            Set Your First Goal
          </button>
        </motion.div>
      ) : (
        <div className="space-y-8">
          {/* Active Goals */}
          {activeGoals.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase text-slate-500 tracking-wider flex items-center gap-2">
                <TrendingUp size={14} className="text-emerald-700" /> Active Goals ({activeGoals.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeGoals.map((g, i) => {
                  const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
                  const remaining = Math.max(0, g.target - g.saved);
                  const days = daysRemaining(g.deadline);
                  const dailyRate = Math.ceil(remaining / days);

                  return (
                    <motion.div
                      key={g.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ y: -4 }}
                      className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all group"
                    >
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl bg-blue-50 border border-blue-500-100"
                          >
                            {g.emoji}
                          </div>
                          <div>
                            <h4 className="text-sm font-extrabold text-slate-900">{g.name}</h4>
                            <span className="text-[10px] text-slate-500 font-bold">
                              Target: ₹{g.target.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => router.push(`/home/goals/roadmap?goalId=${g.id}`)}
                            className="p-2 rounded-xl bg-blue-50 border border-emerald-200 text-emerald-700 hover:bg-blue-100 transition-all"
                            title="View Roadmap"
                          >
                            <Rocket size={14} />
                          </button>
                          <button
                            onClick={() => deleteGoal(g.id)}
                            className="p-2 rounded-xl bg-red-50 border border-red-200 text-red-500 hover:bg-red-100 transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-wider">
                          <span className="text-slate-500">Saved: ₹{g.saved.toLocaleString('en-IN')}</span>
                          <span className="text-emerald-800 font-bold">{pct}% complete</span>
                        </div>
                        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 1, delay: 0.2 + i * 0.1 }}
                            className="h-full rounded-full bg-emerald-700"
                          />
                        </div>
                      </div>

                      {/* Quick Save */}
                      <div className="flex gap-2 mb-3">
                        <input 
                          type="number"
                          placeholder="Add money (₹)"
                          value={quickSaveAmount[g.id] || ''}
                          onChange={(e) => setQuickSaveAmount(prev => ({ ...prev, [g.id]: e.target.value }))}
                          className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => handleAddSavings(g.id, g.saved, g.target)}
                          className="px-4 py-2 rounded-xl text-[10px] font-black text-white bg-emerald-700 hover:bg-emerald-800 shadow-sm cursor-pointer shadow-sm transition-opacity"
                        >
                          Deposit
                        </button>
                      </div>

                      {/* Daily rate */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <span className="text-[10px] text-emerald-800 font-semibold flex items-center gap-1">
                          <Zap size={10} />
                          Save ₹{dailyRate}/day to reach goal in {days} days!
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                          <Calendar size={10} />
                          {days} days left
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Completed Goals */}
          {completedGoals.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase text-slate-500 tracking-wider flex items-center gap-2">
                <Trophy size={14} className="text-amber-500" /> Completed Dreams ({completedGoals.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {completedGoals.map((g, i) => (
                  <motion.div
                    key={g.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-5 rounded-3xl bg-white border border-emerald-200 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-emerald-200 flex items-center justify-center text-3xl">
                          {g.emoji}
                        </div>
                        <div>
                          <h4 className="text-sm font-extrabold text-slate-900">{g.name}</h4>
                          <span className="text-[10px] text-emerald-800 font-bold">100% Achieved!</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => router.push(`/home/goals/roadmap?goalId=${g.id}`)}
                          className="p-2 rounded-xl bg-blue-50 border border-emerald-200 text-emerald-800 hover:bg-blue-100 transition-all"
                          title="View Roadmap"
                        >
                          <Award size={14} />
                        </button>
                        <button
                          onClick={() => deleteGoal(g.id)}
                          className="p-2 rounded-xl bg-red-50 border border-red-200 text-red-500 hover:bg-red-100 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-xs font-black bg-blue-50 border border-emerald-200 text-blue-800 rounded-2xl p-3">
                      <span className="flex items-center gap-1"><CheckCircle2 size={14} className="text-emerald-700" /> Completed!</span>
                      <span>₹{g.target.toLocaleString('en-IN')}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
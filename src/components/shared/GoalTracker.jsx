'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Plus, Trash2, Target, TrendingUp, PartyPopper, 
  IndianRupee, Calendar, Sparkles, Trophy, Award, Rocket, ChevronRight
} from 'lucide-react';
import { useAppStore } from '@/lib/store/useAppStore';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const TEMPLATES = [
  { id: 'bike', label: 'Pehli Bike 🏍️', emoji: '🏍️', target: 120000, color: '#EF4444', hint: 'Daily ₹150 bachao. 3 cup chai skip karo!' },
  { id: 'phone', label: 'New Phone 📱', emoji: '📱', target: 30000, color: '#8B5CF6', hint: 'Daily ₹80 bachao. 1 saal mein naya phone ready!' },
  { id: 'trip', label: 'Goa Trip ✈️', emoji: '✈️', target: 20000, color: '#2563eb', hint: 'Daily ₹60 bachao. 10 mahine mein fun trip ready!' },
  { id: 'emergency', label: 'Emergency Fund 🛡️', emoji: '🛡️', target: 50000, color: '#F59E0B', hint: '3 months survival secure. Daily ₹140 savings target.' },
  { id: 'laptop', label: 'Work Laptop 💻', emoji: '💻', target: 60000, color: '#06B6D4', hint: 'Daily ₹180 savings or small freelance side income.' },
  { id: 'custom', label: 'Custom Goal ✏️', emoji: '🎯', target: 10000, color: '#EC4899', hint: 'Apna customized financial target set karein.' }
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

export default function GoalTracker({ open, onClose }) {
  const { goals, addGoal, updateGoalSaved, deleteGoal, addCoins } = useAppStore();
  const router = useRouter();
  const [addOpen, setAddOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  
  // New goal form states
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
    // Default deadline 6 months from now
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

    // Reset Form
    setSelectedTemplate(null);
    setName('');
    setTarget('');
    setDeadline('');
    setAddOpen(false);

    addCoins(10);
    toast({
      title: "Goal created! +10 Coins 🎯",
      description: "Ab apna roadmap dekho aur save shuru karo!"
    });

    // Navigate to roadmap page
    setTimeout(() => router.push(`/home/goals/${newGoal.id}/roadmap`), 500);
  };

  const handleAddSavings = (goalId, goalSaved, goalTarget) => {
    const amtStr = quickSaveAmount[goalId] || '';
    const amt = parseInt(amtStr, 10);
    if (!amt || amt <= 0) return;

    const newSaved = goalSaved + amt;
    updateGoalSaved(goalId, amt); // Zustand updates goal.saved += amt

    // Reset input
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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* Backdrop blur overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      {/* Modal Container */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative z-10 w-full max-w-2xl bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Effects */}
        <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-emerald-100/60 blur-[80px] pointer-events-none" />

        {/* Header */}
        <div className="shrink-0 px-6 py-4 border-b border-slate-100 bg-slate-50/70 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
              <Target size={20} className="text-emerald-700" />
            </div>
            <div>
              <h2 className="font-display text-base font-black text-slate-900">Sapne Se Sach 🎯</h2>
              <p className="text-[11px] text-slate-500 font-medium">Personal Financial Goal Planner</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-all cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scroll bg-white">
          {/* Total Progress Board */}
          {goals.length > 0 && (
            <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-5 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Total Goal Saved</span>
                <p className="text-lg font-black text-emerald-700">
                  ₹{totalSaved.toLocaleString('en-IN')}{' '}
                  <span className="text-xs text-slate-500 font-bold">/ ₹{totalTarget.toLocaleString('en-IN')}</span>
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Overall Success</span>
                <p className="text-lg font-black text-amber-600">{totalProgress}%</p>
              </div>
            </div>
          )}

          {/* Add Goal Toggle Form */}
          <div className="border border-slate-200/90 rounded-3xl overflow-hidden bg-white shadow-xs">
            <button
              onClick={() => setAddOpen(!addOpen)}
              className="w-full p-4 flex items-center justify-between text-xs font-black uppercase text-slate-800 bg-slate-50/70 border-b border-slate-100 cursor-pointer"
            >
              <span>➕ Set Naya Goal</span>
              <span className="text-emerald-700">{addOpen ? 'Hide Templates' : 'Show Templates'}</span>
            </button>

            {addOpen && (
              <div className="p-5 space-y-4 bg-white">
                {/* Template Chips */}
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Choose Goal Preset</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {TEMPLATES.map(t => (
                      <button
                        key={t.id}
                        onClick={() => handleSelectTemplate(t)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          selectedTemplate?.id === t.id 
                            ? 'bg-emerald-50 border-emerald-300 shadow-xs' 
                            : 'bg-slate-50 border-slate-200/80 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <span className="text-2xl block">{t.emoji}</span>
                        <span className="text-xs font-bold text-slate-900 block mt-1">{t.label}</span>
                        <span className="text-[10px] text-slate-500 font-bold block mt-0.5">₹{t.target.toLocaleString('en-IN')}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {selectedTemplate && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2"
                  >
                    <Sparkles size={14} className="shrink-0 mt-0.5 text-emerald-600" />
                    <span>{selectedTemplate.hint}</span>
                  </motion.div>
                )}

                {/* Form fields */}
                {selectedTemplate && (
                  <div className="space-y-3 pt-2">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Goal Name</span>
                      <input 
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. My Dream Bike"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Target Fund (₹)</span>
                        <input 
                          type="number"
                          value={target}
                          onChange={(e) => setTarget(e.target.value)}
                          placeholder="e.g. 50000"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Target Date</span>
                        <input 
                          type="date"
                          value={deadline}
                          onChange={(e) => setDeadline(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleAddGoal}
                      className="w-full py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer mt-2 shadow-xs transition-all active:scale-95"
                    >
                      Confirm Goal Target
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Goal cards grid */}
          {goals.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs bg-slate-50 border border-slate-200/80 rounded-3xl space-y-2">
              <div className="text-5xl">🎯</div>
              <p className="font-extrabold text-slate-900 text-sm">Koi goals set nahi hain!</p>
              <p className="px-6 text-slate-500">Preset templates use karke apna pehla target set karein aur safety path build karein.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Active Goals */}
              {activeGoals.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                    <TrendingUp size={13} className="text-emerald-600" /> Active Milestones ({activeGoals.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeGoals.map(g => {
                      const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
                      const remaining = Math.max(0, g.target - g.saved);
                      const days = daysRemaining(g.deadline);
                      const dailyRate = Math.ceil(remaining / days);

                      return (
                        <div key={g.id} className="p-4.5 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-3">
                              <span className="text-3xl bg-slate-50 border border-slate-200/80 p-2 rounded-2xl">{g.emoji}</span>
                              <div>
                                <span className="text-xs font-extrabold text-slate-900 block">{g.name}</span>
                                <span className="text-[10px] text-slate-500 font-bold block">Target: ₹{g.target.toLocaleString('en-IN')}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => router.push(`/home/goals/${g.id}/roadmap`)}
                                className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-all cursor-pointer"
                                title="View Roadmap"
                              >
                                <Rocket size={13} />
                              </button>
                              <button
                                onClick={() => deleteGoal(g.id)}
                                className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-all cursor-pointer"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>

                          {/* Progress Line */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-wider">
                              <span className="text-slate-500">Saved: ₹{g.saved.toLocaleString('en-IN')}</span>
                              <span className="text-emerald-700 font-extrabold">{pct}% complete</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full rounded-full transition-all duration-500 bg-emerald-600"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>

                          {/* Action saving adding form */}
                          <div className="flex gap-2">
                            <input 
                              type="number"
                              placeholder="Add money (₹)"
                              value={quickSaveAmount[g.id] || ''}
                              onChange={(e) => setQuickSaveAmount(prev => ({ ...prev, [g.id]: e.target.value }))}
                              className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                            <button
                              onClick={() => handleAddSavings(g.id, g.saved, g.target)}
                              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer transition-all active:scale-95"
                            >
                              Deposit
                            </button>
                          </div>

                          {dailyRate > 0 && (
                            <span className="text-[10px] text-emerald-700 font-semibold block leading-relaxed pt-1 border-t border-slate-100">
                              💡 Roz ₹{dailyRate} bachao toh {days} din mein done!
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Achieved Goals */}
              {completedGoals.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase text-emerald-700 tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 size={13} /> Completed Goals ({completedGoals.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {completedGoals.map(g => (
                      <div key={g.id} className="p-4 rounded-3xl bg-emerald-50/50 border border-emerald-200 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{g.emoji}</span>
                          <div>
                            <span className="text-xs font-bold text-slate-900 line-through block">{g.name}</span>
                            <span className="text-[10px] text-emerald-700 font-semibold block">₹{g.target.toLocaleString('en-IN')} Achieved! 🎉</span>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteGoal(g.id)}
                          className="p-1 rounded text-slate-400 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="shrink-0 px-6 py-4 border-t border-slate-100 bg-slate-50/70 backdrop-blur-md flex items-center justify-center">
          <button 
            onClick={onClose} 
            className="px-8 py-2.5 rounded-2xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 shadow-xs hover:bg-slate-50 transition-all cursor-pointer"
          >
            Done Planning
          </button>
        </div>
      </motion.div>
    </div>
  );
}
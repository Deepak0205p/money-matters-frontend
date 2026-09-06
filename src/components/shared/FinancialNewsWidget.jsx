'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Bookmark, Share2, Sparkles, ChevronDown, 
  Flame, Clock, ExternalLink, HelpCircle 
} from 'lucide-react';
import { useAppStore } from '@/lib/store/useAppStore';
import { toast } from '@/hooks/use-toast';

const CATEGORY_CONFIG = {
  markets: { label: 'Markets 📈', color: '#2563eb', bg: 'bg-blue-50', border: 'border-blue-200' },
  tips: { label: 'Tips 💡', color: '#F59E0B', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  banking: { label: 'Banking 🏦', color: '#8B5CF6', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
  tax: { label: 'Tax 📋', color: '#EF4444', bg: 'bg-rose-500/10', border: 'border-rose-500/20' }
};

const NEWS_DATA = [
  {
    id: 'n1',
    headline: 'SIP ₹1000/month se ₹50L banta hai! 🤯',
    summary: '12% expected returns ke according regular ₹1000 monthly contribution 20 saal mein ₹49.95L banta hai. Start karna hi sabse bada step hai.',
    source: 'Groww Insights',
    timestamp: '2 hours ago',
    category: 'markets',
    emoji: '📈'
  },
  {
    id: 'n2',
    headline: 'Aaj se bachat karne ke 5 asaan rule 💡',
    summary: 'Daily micro savings, swiggy control, 24-hour impulse rule, cash-only weekends, aur automated budgets — simple habits makes you rich.',
    source: 'Money Matters Tips',
    timestamp: 'Today Morning',
    category: 'tips',
    emoji: '💡'
  },
  {
    id: 'n3',
    headline: 'UPI monthly transactions cross 14 billion mark 🚀',
    summary: 'India beats the world! Digital transaction milestone has reached record levels under NPCI. Fast, simple, secure cashless economy.',
    source: 'NPCI Report',
    timestamp: '4 hours ago',
    category: 'banking',
    emoji: '🏦'
  },
  {
    id: 'n4',
    headline: 'Section 80C: ₹46,350 taxes annually save karein 📋',
    summary: 'PPF, ELSS, NPS and insurance investments offer huge tax reductions. Starting early makes you multiply wealth fast.',
    source: 'Income Tax Info',
    timestamp: 'Yesterday',
    category: 'tax',
    emoji: '📋'
  },
  {
    id: 'n5',
    headline: 'FD rates badhi! Safest 7.5% returns guarantee 💰',
    summary: 'Many prominent PSU banks and small finance registers are providing solid interest. Best option for immediate low-risk liquid parking.',
    source: 'BankBazaar Info',
    timestamp: 'Today Afternoon',
    category: 'banking',
    emoji: '🏦'
  },
  {
    id: 'n6',
    headline: 'Sovereign Gold Bonds offer double benefit 🥇',
    summary: 'Gold appreciation returns + extra 2.5% fixed interest every year. 0 maintenance fees, full government security guaranteed.',
    source: 'RBI Bulletin',
    timestamp: 'Yesterday',
    category: 'markets',
    emoji: '📈'
  }
];

const FOR_YOU_IDS = ['n1', 'n2', 'n3'];

export default function FinancialNewsWidget({ open, onClose }) {
  const { addCoins } = useAppStore();
  const [activeCategory, setActiveCategory] = useState('all');
  const [bookmarks, setBookmarks] = useState([]);
  const [activeId, setActiveId] = useState(null);

  const filteredNews = useMemo(() => {
    if (activeCategory === 'all') return NEWS_DATA;
    return NEWS_DATA.filter(n => n.category === activeCategory);
  }, [activeCategory]);

  const forYouCards = useMemo(() => {
    return NEWS_DATA.filter(n => FOR_YOU_IDS.includes(n.id));
  }, []);

  const toggleBookmark = useCallback((id) => {
    setBookmarks(prev => 
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
    toast({
      title: bookmarks.includes(id) ? 'Bookmark removed! ❌' : 'Article bookmarked! 🔖'
    });
  }, [bookmarks]);

  const handleShare = useCallback((card) => {
    const text = `📰 *${card.headline}*\n\n${card.summary}\n\nRead more on Money Matters! 💸`;
    navigator.clipboard.writeText(text);
    toast({ title: "Copied share text! 📋" });
  }, []);

  if (!open) return null;

  const activeCard = activeId ? NEWS_DATA.find(n => n.id === activeId) : null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Container */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative z-10 w-full max-w-lg bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="shrink-0 px-6 py-4 border-b border-slate-100 bg-slate-50/80 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center">
              <Flame size={20} className="text-amber-600" />
            </div>
            <div>
              <h2 className="text-base font-black font-display text-slate-900">Paisa Patrika 📰</h2>
              <p className="text-[11px] font-medium text-slate-500">Finance News & Compounding Insights</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-all"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scroll">
          
          {/* Curated section horizontally scrollable */}
          <div className="space-y-2.5">
            <span className="text-[10px] font-black uppercase text-slate-600 tracking-wider flex items-center gap-1.5">
              <Sparkles size={12} className="text-amber-600" /> Curated For You
            </span>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
              {forYouCards.map(card => {
                const config = CATEGORY_CONFIG[card.category];
                return (
                  <button
                    key={card.id}
                    onClick={() => setActiveId(card.id)}
                    className={`min-w-[150px] max-w-[170px] p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-400 hover:shadow-xs hover:scale-[1.02] transition-all text-left flex flex-col justify-between h-32 shrink-0 cursor-pointer`}
                  >
                    <span className="text-2xl">{card.emoji}</span>
                    <span className="text-[11px] font-extrabold text-slate-900 leading-snug line-clamp-2 mt-1">
                      {card.headline}
                    </span>
                    <span className="text-[9px] text-emerald-800 font-black uppercase tracking-wider block mt-1">
                      {config.label.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Categories Tab pills */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar border-t border-slate-100 pt-4">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all cursor-pointer ${
                activeCategory === 'all' 
                  ? 'bg-emerald-700 text-white shadow-xs' 
                  : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              All News
            </button>
            {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap cursor-pointer ${
                  activeCategory === key 
                    ? 'bg-emerald-700 text-white shadow-xs' 
                    : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                {config.label}
              </button>
            ))}
          </div>

          {/* List of articles */}
          <div className="space-y-4 pt-1">
            {filteredNews.map(card => {
              const config = CATEGORY_CONFIG[card.category];
              const isBookmarked = bookmarks.includes(card.id);

              return (
                <div key={card.id} className="p-4.5 rounded-3xl bg-slate-50 border border-slate-200/90 space-y-3 relative overflow-hidden shadow-xs">
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold relative">
                    <span className={`px-2 py-0.5 rounded border border-slate-200 bg-white font-black`} style={{ color: config.color }}>
                      {config.label}
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <Clock size={11} /> {card.timestamp}
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-slate-900 leading-snug relative">
                    {card.headline}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed relative">
                    {card.summary}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-200 relative">
                    <span>Source: {card.source}</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => toggleBookmark(card.id)}
                        className={`p-1 font-bold cursor-pointer hover:text-slate-900 ${isBookmarked ? 'text-amber-600' : 'text-slate-500'}`}
                      >
                        🔖 {isBookmarked ? 'Saved' : 'Save'}
                      </button>
                      <button 
                        onClick={() => handleShare(card)}
                        className="p-1 text-slate-500 font-bold hover:text-slate-900 cursor-pointer"
                      >
                        📤 Share
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Deep details Modal View Overlay */}
        <AnimatePresence>
          {activeCard && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-40 bg-slate-900/40 backdrop-blur-sm p-6 flex items-center justify-center"
              onClick={() => setActiveId(null)}
            >
              <div 
                className="w-full max-w-sm bg-white border border-slate-200/90 rounded-3xl p-6 relative space-y-4 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  onClick={() => setActiveId(null)}
                  className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
                <div className="text-5xl">{activeCard.emoji}</div>
                <h3 className="text-base font-black font-display text-slate-900 leading-snug">{activeCard.headline}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{activeCard.summary}</p>
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Source: {activeCard.source}</span>
                  <span>{activeCard.timestamp}</span>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => toggleBookmark(activeCard.id)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase transition-all cursor-pointer ${
                      bookmarks.includes(activeCard.id) 
                        ? 'bg-amber-50 text-amber-800 border border-amber-300' 
                        : 'bg-slate-100 border border-slate-200 text-slate-700'
                    }`}
                  >
                    🔖 {bookmarks.includes(activeCard.id) ? 'Saved' : 'Save'}
                  </button>
                  <button
                    onClick={() => handleShare(activeCard)}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1 shadow-xs active:scale-95 cursor-pointer"
                  >
                    Share Info
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="shrink-0 px-6 py-4 border-t border-slate-100 bg-slate-50/80 backdrop-blur-md flex items-center justify-center">
          <p className="text-[10px] text-slate-500 font-bold tracking-wide">
            Paisa Patrika — regular updates & insights
          </p>
        </div>
      </motion.div>
    </div>
  );
}
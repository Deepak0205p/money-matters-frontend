'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bookmark,
  BookmarkX,
  Search,
  SortAsc,
  SortDesc,
  Filter,
  X,
  Calendar,
  BookOpen,
  Layers,
  ArrowUpRight,
  Sparkles,
  Clock,
  Tag,
  ChevronDown,
  Grid3X3,
  List,
  Trash2,
  Eye,
} from 'lucide-react';
import { modules, getAllCardsForModule } from '@/data/modulesIndex';
import { RichContent, InteractiveQuizViewer, InteractiveCalculatorViewer, InteractiveChoiceViewer } from '@/components/shared/CardContent';

/* ─────────────────────────────────────────
   BUILD FULL CARD INDEX (all modules × all cards)
───────────────────────────────────────── */
const FULL_CARD_INDEX = (() => {
  const map = {};
  for (const mod of modules) {
    const cards = getAllCardsForModule(mod.id);
    for (const card of cards) {
      map[card.id] = { card, module: mod };
    }
  }
  return map;
})();

/* ─────────────────────────────────────────
   localStorage helpers with timestamp tracking
───────────────────────────────────────── */
const STORAGE_KEY = 'bookmarked_cards';
const META_KEY = 'bookmarked_cards_meta';

function getRawBookmarks() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}
function getMeta() {
  try { return JSON.parse(localStorage.getItem(META_KEY) || '{}'); } catch { return {}; }
}
function saveMeta(meta) {
  localStorage.setItem(META_KEY, JSON.stringify(meta));
}

function buildBookmarkItems(ids) {
  const meta = getMeta();
  const now = Date.now();
  let changed = false;
  const filled = { ...meta };
  ids.forEach((id, idx) => {
    if (!filled[id]) { filled[id] = { savedAt: new Date(now - idx * 1000).toISOString(), order: idx }; changed = true; }
  });
  if (changed) saveMeta(filled);

  return ids
    .map((id) => {
      const entry = FULL_CARD_INDEX[id];
      if (!entry) return null;
      return {
        id,
        card: entry.card,
        module: entry.module,
        savedAt: filled[id]?.savedAt || new Date().toISOString(),
        order: filled[id]?.order ?? 0,
      };
    })
    .filter(Boolean);
}

function removeBookmark(id) {
  const ids = getRawBookmarks().filter((b) => b !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  const meta = getMeta();
  delete meta[id];
  saveMeta(meta);
}

/* ─────────────────────────────────────────
   FULL-SCREEN CARD VIEWER MODAL
───────────────────────────────────────── */
function CardDetailModal({ items, startId, onClose }) {
  const startIdx = items.findIndex((i) => i.id === startId);
  const [idx, setIdx] = useState(startIdx < 0 ? 0 : startIdx);
  const item = items[idx];

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') setIdx((p) => Math.min(p + 1, items.length - 1));
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') setIdx((p) => Math.max(p - 1, 0));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [items.length, onClose]);

  if (!item) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 20, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl max-h-[88vh] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl flex flex-col"
      >
        {/* Color accent bar */}
        <div className="h-1.5 w-full shrink-0 bg-emerald-700" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0 bg-slate-50/50">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-2xl p-2 rounded-xl bg-white border border-slate-200/80 shadow-xs">{item.module.emoji}</span>
            <div className="min-w-0">
              <p className="text-[10px] font-extrabold font-display uppercase tracking-widest text-emerald-800 truncate">
                {item.module.title}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Saved {new Date(item.savedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="size-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all shrink-0 cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Card content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ scrollbarWidth: 'thin' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* Title */}
              <h2 className="font-display text-xl font-extrabold text-slate-900 leading-tight">{item.card.title}</h2>

              {/* Topic */}
              {item.card.topicTitle && (
                <div className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-800">
                  <Tag className="size-3" />
                  {item.card.topicTitle}
                </div>
              )}

              {/* Content */}
              <div className="w-full text-slate-800 text-sm leading-relaxed">
                {item.card.type === 'quiz' ? (
                  <InteractiveQuizViewer data={item.card.content} color={item.module.color} />
                ) : item.card.type === 'calculator' ? (
                  <InteractiveCalculatorViewer data={item.card.content} color={item.module.color} />
                ) : item.card.type === 'choice' ? (
                  <InteractiveChoiceViewer data={item.card.content} color={item.module.color} />
                ) : item.card.content && typeof item.card.content === 'string' ? (
                  <RichContent content={item.card.content} color={item.module.color} />
                ) : null}
              </div>

              {/* Bullets / key points */}
              {item.card.bullets && item.card.bullets.length > 0 && (
                <div className="space-y-2 pt-2">
                  {item.card.bullets.map((b, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <span className="size-2 rounded-full mt-2 shrink-0 bg-emerald-700" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Example */}
              {item.card.example && (
                <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 mb-1.5">Example</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{item.card.example}</p>
                </div>
              )}

              {/* Tip */}
              {item.card.tip && (
                <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-amber-800 mb-1.5">💡 Pro Tip</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{item.card.tip}</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/60">
          <button
            disabled={idx === 0}
            onClick={() => setIdx((p) => p - 1)}
            className="px-4 py-2 rounded-xl text-xs font-bold font-display bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
          >
            ← Prev
          </button>
          <span className="text-xs font-bold text-slate-500 tabular-nums">{idx + 1} / {items.length}</span>
          <button
            disabled={idx === items.length - 1}
            onClick={() => setIdx((p) => p + 1)}
            className="px-4 py-2 rounded-xl text-xs font-bold font-display bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
          >
            Next →
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   BOOKMARK CARD (grid tile & list)
───────────────────────────────────────── */
function BookmarkCard({ item, onOpen, onRemove, view }) {
  const dateStr = new Date(item.savedAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  if (view === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10, scale: 0.96 }}
        className="group flex items-center gap-4 bg-white border border-slate-200/90 hover:border-emerald-300 rounded-2xl px-5 py-4 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md transition-all cursor-pointer"
        onClick={() => onOpen(item.id)}
      >
        <div className="w-1 self-stretch rounded-full shrink-0 bg-emerald-700" />
        <span className="text-xl p-2 rounded-xl bg-slate-50 border border-slate-100 shrink-0">{item.module.emoji}</span>

        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-extrabold font-display uppercase tracking-widest text-emerald-800 truncate mb-0.5">
            {item.module.title}
          </p>
          <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-emerald-800 transition-colors truncate">
            {item.card.title}
          </h3>
          {item.card.topicTitle && (
            <p className="text-[11px] text-slate-500 truncate mt-0.5">{item.card.topicTitle}</p>
          )}
        </div>

        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1 tabular-nums">
            <Calendar className="size-3" />{dateStr}
          </span>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => { e.stopPropagation(); onOpen(item.id); }}
              className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-all"
              title="View Card"
            >
              <Eye className="size-3.5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onRemove(item.id); }}
              className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all"
              title="Remove Bookmark"
            >
              <BookmarkX className="size-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid view
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -3 }}
      className="group relative bg-white border border-slate-200/90 hover:border-emerald-300 rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer overflow-hidden"
      onClick={() => onOpen(item.id)}
    >
      <div>
        {/* Module badge */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl p-1.5 rounded-xl bg-slate-50 border border-slate-100">{item.module.emoji}</span>
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80">
              {item.module.title}
            </span>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => { e.stopPropagation(); onRemove(item.id); }}
              className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all"
              title="Remove Bookmark"
            >
              <BookmarkX className="size-3" />
            </button>
          </div>
        </div>

        {/* Card title */}
        <h3 className="text-base font-extrabold font-display text-slate-900 leading-snug group-hover:text-emerald-800 transition-colors line-clamp-2">
          {item.card.title}
        </h3>

        {/* Topic */}
        {item.card.topicTitle && (
          <p className="text-xs text-slate-500 flex items-center gap-1.5 truncate mt-1.5">
            <Tag className="size-3 text-slate-400 shrink-0" /> {item.card.topicTitle}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-4">
        <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1 tabular-nums">
          <Calendar className="size-3" />{dateStr}
        </span>
        <span className="inline-flex items-center gap-1 text-xs font-extrabold font-display text-emerald-800 group-hover:underline">
          Read Card
          <ArrowUpRight size={12} />
        </span>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   MAIN BOOKMARKS PAGE
═══════════════════════════════════════════ */
export default function BookmarksPage() {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // Filters & sort
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('date_desc');
  const [filterModule, setFilterModule] = useState('all');
  const [view, setView] = useState('grid');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Modal
  const [openCardId, setOpenCardId] = useState(null);

  const reload = useCallback(() => {
    const ids = getRawBookmarks();
    setItems(buildBookmarkItems(ids));
    setLoaded(true);
  }, []);

  useEffect(() => { reload(); }, [reload]);

  const handleRemove = useCallback((id) => {
    removeBookmark(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all saved bookmarks?')) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(META_KEY);
      setItems([]);
    }
  };

  const presentModuleIds = useMemo(() => [...new Set(items.map((i) => i.module.id))], [items]);

  const displayed = useMemo(() => {
    let result = [...items];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) =>
          i.card.title?.toLowerCase().includes(q) ||
          i.card.topicTitle?.toLowerCase().includes(q) ||
          i.module.title?.toLowerCase().includes(q) ||
          (typeof i.card.content === 'string' && i.card.content.toLowerCase().includes(q)),
      );
    }

    if (filterModule !== 'all') {
      result = result.filter((i) => String(i.module.id) === filterModule);
    }

    switch (sortBy) {
      case 'date_asc':  result.sort((a, b) => new Date(a.savedAt) - new Date(b.savedAt)); break;
      case 'date_desc': result.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt)); break;
      case 'module':    result.sort((a, b) => a.module.title.localeCompare(b.module.title)); break;
      case 'title':     result.sort((a, b) => a.card.title.localeCompare(b.card.title)); break;
    }

    return result;
  }, [items, search, sortBy, filterModule]);

  if (!loaded) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-200 border-t-emerald-700 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-8 py-2 text-left">
      {/* ── PAGE HEADER ── */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60">
              <Bookmark size={24} />
            </span>
            Saved Bookmarks
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl font-normal">
            {items.length === 0 
              ? 'No cards bookmarked yet.' 
              : `${items.length} card${items.length !== 1 ? 's' : ''} saved across ${presentModuleIds.length} topic${presentModuleIds.length !== 1 ? 's' : ''} — ready for quick review and revision.`
            }
          </p>
        </div>

        {items.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-all self-start sm:self-auto cursor-pointer shadow-xs"
          >
            <Trash2 className="size-3.5" />
            Clear All Bookmarks
          </button>
        )}
      </div>

      {items.length === 0 ? (
        /* ── EMPTY STATE ── */
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 text-center bg-white border border-slate-200/90 rounded-3xl p-8 shadow-[0_2px_10px_rgba(0,0,0,0.03)]"
        >
          <div className="size-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-4 text-amber-600">
            <Bookmark className="size-8" />
          </div>
          <h2 className="font-display text-lg font-extrabold text-slate-900 mb-1.5">No bookmarks yet</h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-sm leading-relaxed">
            Tap the <Bookmark className="inline size-3 text-amber-500" /> bookmark icon on any card while reading to save it here for fast revision.
          </p>
        </motion.div>
      ) : (
        <>
          {/* ── CONTROLS BAR ── */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search saved cards by topic, keyword..."
                className="w-full bg-white border border-slate-200/90 focus:border-emerald-600 focus:outline-none rounded-xl pl-10 pr-9 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 transition-all shadow-xs"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X className="size-4" />
                </button>
              )}
            </div>

            {/* Module filter */}
            <div className="relative">
              <button
                onClick={() => setShowFilterMenu((p) => !p)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200/90 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-xs cursor-pointer"
              >
                <Filter className="size-3.5 text-slate-500" />
                {filterModule === 'all' ? 'All Modules' : modules.find((m) => String(m.id) === filterModule)?.title.split(' ')[0]}
                <ChevronDown className={`size-3.5 text-slate-400 transition-transform ${showFilterMenu ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showFilterMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    className="absolute right-0 top-full mt-2 w-60 z-50 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 space-y-0.5"
                  >
                    {[{ id: 'all', title: 'All Modules', emoji: '📚' }, ...modules.filter((m) => presentModuleIds.includes(m.id))].map((m) => (
                      <button
                        key={m.id}
                        onClick={() => { setFilterModule(String(m.id)); setShowFilterMenu(false); }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                          filterModule === String(m.id)
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <span>{m.emoji}</span>
                        <span className="truncate font-medium">{m.title}</span>
                        {m.id !== 'all' && (
                          <span className="ml-auto text-[10px] text-slate-400 tabular-nums font-bold">
                            {items.filter((i) => i.module.id === m.id).length}
                          </span>
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-200/90 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-emerald-600 transition-all cursor-pointer shadow-xs"
            >
              <option value="date_desc">Newest first</option>
              <option value="date_asc">Oldest first</option>
              <option value="module">By module</option>
              <option value="title">Title A → Z</option>
            </select>

            {/* View toggle */}
            <div className="flex items-center bg-white border border-slate-200/90 rounded-xl p-1 shadow-xs">
              <button
                onClick={() => setView('grid')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${view === 'grid' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-400 hover:text-slate-700'}`}
              >
                <Grid3X3 className="size-3.5" />
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${view === 'list' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-400 hover:text-slate-700'}`}
              >
                <List className="size-3.5" />
              </button>
            </div>
          </div>

          {/* ── RESULTS COUNT ── */}
          {(search || filterModule !== 'all') && (
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-600">
                Showing <span className="text-emerald-800 font-extrabold tabular-nums">{displayed.length}</span> of {items.length} bookmarks
              </p>
              <button
                onClick={() => { setSearch(''); setFilterModule('all'); }}
                className="text-xs text-emerald-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <X className="size-3" /> Clear filters
              </button>
            </div>
          )}

          {/* ── FLAT GRID / LIST ── */}
          {displayed.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center bg-white border border-slate-200/90 rounded-3xl p-8">
              <Search className="size-8 text-slate-300 mb-2" />
              <p className="text-sm font-bold text-slate-700">No matching bookmarks found</p>
              <p className="text-xs text-slate-400 mt-1">Try different search keywords</p>
            </div>
          ) : (
            <div className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5' : 'flex flex-col gap-3'}>
              <AnimatePresence mode="popLayout">
                {displayed.map((item) => (
                  <BookmarkCard key={item.id} item={item} view={view} onOpen={setOpenCardId} onRemove={handleRemove} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </>
      )}

      {/* ── CARD DETAIL MODAL ── */}
      <AnimatePresence>
        {openCardId && (
          <CardDetailModal
            items={displayed.length > 0 ? displayed : items}
            startId={openCardId}
            onClose={() => setOpenCardId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

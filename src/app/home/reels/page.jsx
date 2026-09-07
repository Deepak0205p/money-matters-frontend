'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Coins,
  CheckCircle2,
  Flame,
  Film,
  Compass,
  Info
} from 'lucide-react';
import { useAppStore } from '@/lib/store/useAppStore';
import { FINANCIAL_REELS } from '@/lib/data/reels';

export default function ReelsPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [likedReels, setLikedReels] = useState({});
  const [bookmarkedReels, setBookmarkedReels] = useState({});
  const [watchedReels, setWatchedReels] = useState({});
  const [rewardNotice, setRewardNotice] = useState(null);
  const [showShareTooltip, setShowShareTooltip] = useState(false);

  const { addCoins, logActivity } = useAppStore();
  const containerRef = useRef(null);
  const touchStartY = useRef(0);

  const currentReel = FINANCIAL_REELS[currentIndex];

  // Handle reward for watching reel
  const handleRewardCoins = useCallback((reel) => {
    if (!watchedReels[reel.id]) {
      setWatchedReels(prev => ({ ...prev, [reel.id]: true }));
      addCoins(reel.coinsReward);
      logActivity('strategy', `Watched Reel: ${reel.title}`, reel.coinsReward);
      setRewardNotice(`+${reel.coinsReward} Coins Earned! 🎉`);
      setTimeout(() => setRewardNotice(null), 3000);
    }
  }, [watchedReels, addCoins, logActivity]);

  useEffect(() => {
    // Reward when staying on reel for 3 seconds
    const timer = setTimeout(() => {
      handleRewardCoins(currentReel);
    }, 3000);
    return () => clearTimeout(timer);
  }, [currentIndex, currentReel, handleRewardCoins]);

  const handleNext = useCallback(() => {
    if (currentIndex < FINANCIAL_REELS.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsPlaying(true);
    }
  }, [currentIndex]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsPlaying(true);
    }
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        setIsPlaying(p => !p);
      } else if (e.key === 'm') {
        e.preventDefault();
        setIsMuted(m => !m);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Touch swipe support
  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
  };

  const toggleLike = (id) => {
    setLikedReels(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleBookmark = (id) => {
    setBookmarkedReels(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: currentReel.title,
        text: currentReel.description,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShowShareTooltip(true);
      setTimeout(() => setShowShareTooltip(false), 2000);
    }
  };

  // Embed URL for YouTube Shorts
  // Using official YouTube embed with loop & autoplay controls
  const embedUrl = `https://www.youtube.com/embed/${currentReel.youtubeId}?autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&playlist=${currentReel.youtubeId}&controls=0&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1&enablejsapi=1`;

  return (
    <div 
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full h-[calc(100vh-4.5rem)] md:h-[calc(100vh-5rem)] flex items-center justify-center overflow-hidden select-none"
    >
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      {/* Floating Reward Toast */}
      <AnimatePresence>
        {rewardNotice && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="absolute top-4 z-50 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-xl border border-amber-300"
          >
            <Coins size={16} className="text-slate-950" />
            <span>{rewardNotice}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* REELS CONTAINER (Phone Frame Aspect Ratio 9:16) */}
      <div className="relative w-full max-w-[400px] h-full max-h-[720px] rounded-3xl bg-slate-950 shadow-2xl overflow-hidden flex flex-col justify-between border border-slate-800/80">
        
        {/* Top Header Bar inside Reel */}
        <div className="absolute top-0 inset-x-0 z-30 p-4 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[10px] font-black uppercase tracking-wider text-emerald-300">
              <Film size={11} className="text-emerald-400" />
              Paisa Shorts
            </span>
            <span className="text-[10px] font-extrabold text-slate-300 bg-white/10 px-2 py-0.5 rounded-full tabular-nums">
              {currentIndex + 1} / {FINANCIAL_REELS.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Toggle */}
            <button
              onClick={() => setIsMuted(m => !m)}
              className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-all cursor-pointer"
              title={isMuted ? "Unmute (M)" : "Mute (M)"}
            >
              {isMuted ? <VolumeX size={16} className="text-rose-400" /> : <Volume2 size={16} className="text-emerald-400" />}
            </button>
          </div>
        </div>

        {/* Video Player Embed Area */}
        <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
          <iframe
            key={currentReel.id + (isMuted ? '-muted' : '-unmuted')}
            src={embedUrl}
            title={currentReel.title}
            className="w-full h-full object-cover scale-[1.03] pointer-events-auto"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />

          {/* Click overlay for play/pause interaction */}
          <div 
            onClick={() => setIsPlaying(p => !p)}
            className="absolute inset-0 cursor-pointer pointer-events-none"
          />
        </div>

        {/* Bottom Metadata & Controls Overlay */}
        <div className="absolute bottom-0 inset-x-0 z-30 p-5 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex flex-col gap-2">
          {/* Creator Profile */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-500 to-indigo-500 p-0.5 shadow-md">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-xs font-black text-white">
                {currentReel.creator.charAt(0)}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-extrabold text-white tracking-wide">
                  {currentReel.creator}
                </span>
                {currentReel.verified && (
                  <CheckCircle2 size={13} className="text-emerald-400 fill-emerald-400/20" />
                )}
              </div>
              <span className="text-[10px] text-slate-400 font-medium">{currentReel.handle}</span>
            </div>
          </div>

          {/* Title & Description */}
          <h3 className="text-sm font-bold text-white leading-snug line-clamp-2 mt-1">
            {currentReel.title}
          </h3>
          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-normal">
            {currentReel.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-1">
            {currentReel.tags.map(tag => (
              <span key={tag} className="text-[10px] font-semibold text-emerald-300">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Right Floating Action Sidebar (Like, Comment, Save, Share) */}
        <div className="absolute right-3 bottom-24 z-40 flex flex-col items-center gap-4">
          {/* Like Button */}
          <button
            onClick={() => toggleLike(currentReel.id)}
            className="flex flex-col items-center gap-1 group cursor-pointer"
          >
            <div className={`p-2.5 rounded-full backdrop-blur-md transition-all ${
              likedReels[currentReel.id] 
                ? 'bg-rose-500/20 text-rose-500 scale-110' 
                : 'bg-black/50 text-white hover:bg-black/70 hover:scale-105'
            }`}>
              <Heart 
                size={22} 
                className={likedReels[currentReel.id] ? 'fill-rose-500 text-rose-500' : ''} 
              />
            </div>
            <span className="text-[10px] font-bold text-white shadow-xs">
              {likedReels[currentReel.id] ? 'Liked' : currentReel.likes}
            </span>
          </button>

          {/* Comment Count */}
          <div className="flex flex-col items-center gap-1">
            <div className="p-2.5 rounded-full bg-black/50 text-white backdrop-blur-md">
              <MessageCircle size={22} />
            </div>
            <span className="text-[10px] font-bold text-white">
              {currentReel.comments}
            </span>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={() => toggleBookmark(currentReel.id)}
            className="flex flex-col items-center gap-1 group cursor-pointer"
          >
            <div className={`p-2.5 rounded-full backdrop-blur-md transition-all ${
              bookmarkedReels[currentReel.id]
                ? 'bg-amber-500/20 text-amber-400 scale-110'
                : 'bg-black/50 text-white hover:bg-black/70 hover:scale-105'
            }`}>
              <Bookmark 
                size={22} 
                className={bookmarkedReels[currentReel.id] ? 'fill-amber-400 text-amber-400' : ''} 
              />
            </div>
            <span className="text-[10px] font-bold text-white">
              {bookmarkedReels[currentReel.id] ? 'Saved' : 'Save'}
            </span>
          </button>

          {/* Share Button */}
          <div className="relative">
            <button
              onClick={handleShare}
              className="flex flex-col items-center gap-1 group cursor-pointer"
            >
              <div className="p-2.5 rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-black/70 hover:scale-105 transition-all">
                <Share2 size={22} />
              </div>
              <span className="text-[10px] font-bold text-white">Share</span>
            </button>

            {showShareTooltip && (
              <div className="absolute right-12 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-emerald-700 text-white text-[10px] font-bold whitespace-nowrap shadow-lg">
                Link Copied!
              </div>
            )}
          </div>
        </div>

        {/* Progress indicator pills on right edge */}
        <div className="absolute top-1/2 -translate-y-1/2 left-2 z-30 flex flex-col gap-1.5">
          {FINANCIAL_REELS.map((reel, idx) => (
            <button
              key={reel.id}
              onClick={() => setCurrentIndex(idx)}
              className={`w-1.5 rounded-full transition-all cursor-pointer ${
                idx === currentIndex
                  ? 'h-6 bg-emerald-400'
                  : 'h-1.5 bg-white/40 hover:bg-white/70'
              }`}
              title={reel.title}
            />
          ))}
        </div>
      </div>

      {/* Floating Vertical Navigation Control Arrows on Desktop */}
      <div className="hidden lg:flex flex-col gap-3 ml-6">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="p-3.5 rounded-2xl bg-white border border-slate-200 text-slate-800 hover:text-emerald-700 hover:border-emerald-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-md transition-all cursor-pointer hover:scale-105 active:scale-95"
          title="Previous Reel (Up Arrow)"
        >
          <ChevronUp size={22} />
        </button>

        <button
          onClick={handleNext}
          disabled={currentIndex === FINANCIAL_REELS.length - 1}
          className="p-3.5 rounded-2xl bg-white border border-slate-200 text-slate-800 hover:text-emerald-700 hover:border-emerald-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-md transition-all cursor-pointer hover:scale-105 active:scale-95"
          title="Next Reel (Down Arrow)"
        >
          <ChevronDown size={22} />
        </button>
      </div>
    </div>
  );
}

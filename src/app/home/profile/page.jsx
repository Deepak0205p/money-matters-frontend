'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '@/lib/firebase';
import { updateProfile, signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAppStore } from '@/lib/store/useAppStore';
import { BADGES } from '@/lib/data/badges';
import { 
  Trophy, User, Edit3, LogOut, CheckCircle2, Shield, Camera, X, 
  MapPin, Briefcase, Mail, Sparkles, Flame, Coins, BookOpen, Award
} from 'lucide-react';

function getLevelLabel(lvl) {
  if (lvl >= 10) return { label: 'Grand Master', color: '#047857', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
  if (lvl >= 7) return { label: 'Expert Advisor', color: '#4F46E5', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
  if (lvl >= 4) return { label: 'Smart Investor', color: '#059669', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  return { label: 'Rookie Learner', color: '#64748B', bg: 'bg-slate-100 text-slate-700 border-slate-200' };
}

export default function ProfilePage() {
  const router = useRouter();
  const {
    user,
    setUser,
    logout,
    level,
    xp,
    coins,
    streak,
    completedModules,
    badges,
    earnedBadges
  } = useAppStore();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  // Edit Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    status: '',
    city: ''
  });

  // Load existing data from Firestore if available
  useEffect(() => {
    async function fetchProfile() {
      if (user?.uid && db) {
        const snap = await getDoc(doc(db, 'profiles', user.uid));
        const data = snap.exists() ? snap.data() : null;
        
        if (data) {
          setFormData({
            name: data.name || user.displayName || '',
            email: data.email || user.email || '',
            status: data.status || '',
            city: data.city || ''
          });
        } else {
          setFormData({
            name: user.displayName || '',
            email: user.email || '',
            status: '',
            city: ''
          });
        }
      } else if (user) {
         setFormData({
            name: user.displayName || 'Guest User',
            email: user.email || '',
            status: '',
            city: ''
          });
      }
    }
    fetchProfile();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      logout();
      router.push('/');
    } catch (err) {
      console.error('Error signing out', err);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!user?.uid) return;
    setLoading(true);

    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: formData.name
        });
      }

      if (db) {
        await updateDoc(doc(db, 'profiles', user.uid), {
          name: formData.name,
          status: formData.status,
          city: formData.city
        });
      }

      setUser({ ...user, displayName: formData.name });
      
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const levelInfo = getLevelLabel(level);

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-left pb-10 py-2">
      {/* Header section — Youth Fintech Theme */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[11px] font-extrabold uppercase tracking-wider mb-2">
            <Sparkles size={12} className="text-emerald-700" />
            Financial Identity
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-emerald-100/70 text-emerald-800">
              <User size={24} />
            </span>
            Your Profile & Milestones
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl font-normal">
            Manage your personal profile, streak consistency, and unlocked financial achievements.
          </p>
        </div>

        <button 
          onClick={handleSignOut}
          className="bg-rose-50 hover:bg-rose-100 text-rose-700 px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-colors border border-rose-200 self-start sm:self-auto cursor-pointer shadow-xs"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Avatar & Basic Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200/90 p-6 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] text-center relative overflow-hidden">
            <div className="flex flex-col items-center">
              <div className="relative group mb-3">
                <div className="w-24 h-24 rounded-2xl bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center text-4xl shadow-sm overflow-hidden">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    "🦊"
                  )}
                </div>
                <div 
                  className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold font-display uppercase tracking-widest border shadow-xs whitespace-nowrap ${levelInfo.bg}`}
                >
                  Lvl {level}
                </div>
              </div>

              <h2 className="text-xl font-extrabold font-display text-slate-900 mt-2 mb-1">
                {formData.name || 'Student Learner'}
              </h2>

              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mb-5">
                <Shield size={14} className="text-emerald-700" /> 
                {levelInfo.label}
              </div>

              {/* Edit Button */}
              <button 
                onClick={() => setIsEditing(true)}
                className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-extrabold text-xs py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Edit3 size={14} /> Edit Profile
              </button>
            </div>
          </div>

          {/* Quick Info Card */}
          <div className="bg-white border border-slate-200/90 p-5 rounded-3xl space-y-3 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
             <div className="flex justify-between items-center py-2 border-b border-slate-100 text-xs">
                <span className="text-slate-500 font-medium">Email</span>
                <span className="text-slate-800 font-bold truncate max-w-[150px]">{user?.email || 'guest@nexura.in'}</span>
             </div>
             <div className="flex justify-between items-center py-2 border-b border-slate-100 text-xs">
                <span className="text-slate-500 font-medium">Occupation</span>
                <span className="text-slate-800 font-bold capitalize">{formData.status || 'Student'}</span>
             </div>
             <div className="flex justify-between items-center py-2 text-xs">
                <span className="text-slate-500 font-medium">City</span>
                <span className="text-slate-800 font-bold">{formData.city || 'India'}</span>
             </div>
          </div>
        </div>

        {/* Right Column: Stats & Badges */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Stats Card */}
          <div className="bg-white border border-slate-200/90 p-6 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
            <h3 className="text-base font-extrabold font-display text-slate-900 mb-4 flex items-center gap-2">
              <Trophy className="text-amber-500" size={18} /> Financial Journey Stats
            </h3>

            {/* XP Progress bar */}
            <div className="mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div className="flex justify-between text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-2">
                <span>Next Level Progress</span>
                <span className="text-emerald-800 font-extrabold tabular-nums">{xp} / {level * 300} XP</span>
              </div>
              <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-700 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min((xp / (level * 300)) * 100, 100)}%` }} 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {[
                { label: 'Gold Coins', value: `₹${coins}`, accent: 'text-amber-600', bg: 'bg-amber-50 border-amber-200/80' },
                { label: 'Streak Days', value: `${streak}d`, accent: 'text-orange-600', bg: 'bg-orange-50 border-orange-200/80' },
                { label: 'Modules Done', value: `${completedModules.length}/11`, accent: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200/80' },
                { label: 'Badges Won', value: `${badges.length + earnedBadges.length}`, accent: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-200/80' }
              ].map(pill => (
                <div key={pill.label} className={`border rounded-2xl p-4 text-center shadow-xs ${pill.bg}`}>
                  <span className={`text-xl font-black font-display block tabular-nums ${pill.accent}`}>{pill.value}</span>
                  <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider mt-1 block">{pill.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements Gallery */}
          <div className="bg-white border border-slate-200/90 p-6 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
            <h3 className="text-base font-extrabold font-display text-slate-900 mb-4 flex items-center gap-2">
              <Award className="text-emerald-700" size={18} /> Badges & Certificates Gallery
            </h3>
            
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-center">
              {BADGES.map(badge => {
                const isUnlocked = badges.includes(badge.id) || earnedBadges.includes(badge.id);
                return (
                  <div
                    key={badge.id}
                    className={`p-3 rounded-2xl border transition-all ${
                      isUnlocked
                        ? 'bg-emerald-50/60 border-emerald-200 shadow-xs'
                        : 'bg-slate-50 border-slate-200/60 opacity-40 grayscale'
                    }`}
                    title={badge.description}
                  >
                    <div className="text-2xl mb-1.5">{badge.emoji}</div>
                    <span className="text-[10px] font-bold text-slate-800 block truncate w-full px-1">{badge.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
                <h3 className="text-lg font-extrabold font-display text-slate-900">Edit Profile</h3>
                <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl py-2.5 pl-10 pr-4 text-slate-900 text-sm outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email (Read-only)</label>
                  <div className="relative opacity-60">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <input 
                      type="email" 
                      value={formData.email}
                      disabled
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-slate-500 text-sm outline-none cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Current Status</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl py-2.5 pl-10 pr-4 text-slate-900 text-sm outline-none transition-all"
                    >
                      <option value="">Select status...</option>
                      <option value="student">School / College Student</option>
                      <option value="professional">Working Professional</option>
                      <option value="freelancer">Freelancer / Creator</option>
                      <option value="business">Startup / Business Owner</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">City</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <input 
                      type="text" 
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      placeholder="e.g. Mumbai, Delhi, Bengaluru"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl py-2.5 pl-10 pr-4 text-slate-900 text-sm outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold font-display py-2.5 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? 'Saving...' : 'Save Profile Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Toast */}
      <AnimatePresence>
        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-emerald-700 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5"
          >
            <CheckCircle2 size={18} />
            <span className="font-bold text-xs">{successMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

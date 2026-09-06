'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import { useAppStore } from '@/lib/store/useAppStore';
import { apiFetch } from '@/lib/apiClient';
import Link from 'next/link';
import { 
  Sparkles, AlertCircle, Loader2, ShieldCheck, CheckCircle2, Award, Zap, ArrowRight, ArrowLeft, Lock
} from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const { setUser } = useAppStore();

  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ── GOOGLE OAUTH ──
  const handleGoogleAuth = async () => {
    setError('');
    setLoading(true);

    try {
      if (!auth || !googleProvider) {
        throw new Error('Firebase configuration missing. Please check your environment variables.');
      }
      const cred = await signInWithPopup(auth, googleProvider);
      const authenticatedUser = {
        uid: cred.user.uid,
        displayName: cred.user.displayName || 'Learner',
        email: cred.user.email,
        photoURL: cred.user.photoURL,
        emailVerified: true
      };

      // Sync user with backend
      try {
        await apiFetch('/api/auth/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(authenticatedUser)
        });
      } catch (syncErr) {
        console.warn('Backend sync error:', syncErr);
      }

      setUser(authenticatedUser);
      router.push('/home/dashboard');
    } catch (err) {
      console.error('Google Auth error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Login cancelled. Please click again to sign in.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('This domain is not authorized in Firebase Console. Add your Render domain to Authorized Domains.');
      } else {
        setError(err.message || 'Google authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-center relative overflow-hidden px-4 py-10">
      
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/[0.05] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/[0.05] blur-[120px] pointer-events-none" />

      {/* Back to Home Link */}
      <div className="w-full max-w-md mb-4 flex justify-between items-center relative z-10 px-1">
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Home</span>
        </Link>
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          {mode === 'login' ? 'Welcome Back' : 'Get Started'}
        </span>
      </div>

      {/* Main Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
        className="w-full max-w-md bg-white border border-slate-200/90 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-7 sm:p-8 relative z-10"
      >
        {/* Brand Icon & Title */}
        <div className="text-center mb-6">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="size-14 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto mb-4 shadow-xs"
          >
            <Sparkles className="size-7 text-blue-600" />
          </motion.div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Money Matters
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {mode === 'login' 
              ? 'Log in to continue your financial learning journey' 
              : 'Create your account with 1-click Google OAuth'}
          </p>
        </div>

        {/* Tab Toggle (Login / Sign Up) */}
        <div className="grid grid-cols-2 p-1 bg-slate-100/90 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0, mb: 0 }}
              animate={{ opacity: 1, height: 'auto', mb: 20 }}
              exit={{ opacity: 0, height: 0, mb: 0 }}
              className="bg-rose-50 border border-rose-200 text-rose-700 text-xs px-4 py-3 rounded-xl flex items-start gap-2.5 overflow-hidden"
            >
              <AlertCircle className="size-4 shrink-0 mt-0.5 text-rose-600" />
              <p className="leading-tight font-semibold">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Perks / Benefits */}
        <div className="space-y-2.5 mb-6 bg-slate-50 border border-slate-100 rounded-2xl p-4">
          <div className="flex items-center gap-3 text-xs font-medium text-slate-700">
            <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
            <span>{mode === 'login' ? 'Sync your active progress across devices' : 'Instant access to all 11 modules'}</span>
          </div>
          <div className="flex items-center gap-3 text-xs font-medium text-slate-700">
            <Award className="size-4 text-amber-500 shrink-0" />
            <span>Save earned badges, coins, & streak rewards</span>
          </div>
          <div className="flex items-center gap-3 text-xs font-medium text-slate-700">
            <Lock className="size-4 text-blue-600 shrink-0" />
            <span>Secure 1-Click Google OAuth (No password needed)</span>
          </div>
        </div>

        {/* Exclusive Google OAuth Button */}
        <button 
          type="button"
          onClick={handleGoogleAuth}
          disabled={loading}
          className="w-full bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-blue-600 text-slate-800 font-extrabold text-sm py-3.5 px-4 rounded-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer shadow-sm hover:shadow-md"
        >
          {loading ? (
            <Loader2 className="size-5 animate-spin text-blue-600" />
          ) : (
            <>
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>{mode === 'login' ? 'Log in with Google' : 'Sign up with Google'}</span>
            </>
          )}
        </button>

        {/* Mode Toggle Footer */}
        <div className="mt-5 pt-4 border-t border-slate-100 text-center">
          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-xs text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
          >
            {mode === 'login' ? (
              <span>Don't have an account? <strong className="text-blue-600 font-bold">Sign Up</strong></span>
            ) : (
              <span>Already have an account? <strong className="text-blue-600 font-bold">Log In</strong></span>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

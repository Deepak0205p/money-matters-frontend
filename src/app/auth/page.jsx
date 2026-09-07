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
  Sparkles, 
  AlertCircle, 
  Loader2, 
  ArrowLeft, 
  Shield, 
  Lock, 
  CheckCircle2, 
  Zap,
  ArrowRight
} from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const { setUser } = useAppStore();

  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [error, setError] = useState('');

  // ── UNIFIED GOOGLE OAUTH (LOGIN / SIGNUP) ──
  const handleGoogleAuth = async () => {
    setError('');
    setLoading(true);

    try {
      if (!auth || !googleProvider) {
        throw new Error('Firebase configuration missing. Please check your environment variables.');
      }
      
      // signInWithPopup automatically logs in if user exists, or creates an account if new!
      const cred = await signInWithPopup(auth, googleProvider);
      const authenticatedUser = {
        uid: cred.user.uid,
        displayName: cred.user.displayName || 'Learner',
        email: cred.user.email,
        photoURL: cred.user.photoURL,
        emailVerified: true
      };

      // Sync with backend
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
        setError('Sign-in popup was closed. Please click again to continue.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('This domain is not authorized in Firebase. You can use Guest Access to test.');
      } else {
        setError(err.message || 'Authentication failed. Please try again or use Guest Access.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ── GUEST / DEMO ACCESS ──
  const handleGuestAccess = () => {
    setGuestLoading(true);
    setTimeout(() => {
      const guestUser = {
        uid: `guest_${Date.now()}`,
        displayName: 'Financial Champion',
        email: 'guest@moneymatters.app',
        photoURL: null,
        emailVerified: true
      };
      setUser(guestUser);
      router.push('/home/dashboard');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFC] text-slate-900 flex flex-col justify-between relative overflow-hidden selection:bg-emerald-500 selection:text-white">
      
      {/* Background Mesh & Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-b from-emerald-100/45 via-blue-50/30 to-transparent blur-[120px] rounded-full" />
        <div className="absolute top-[25%] right-[-10%] w-[450px] h-[450px] bg-emerald-100/20 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[450px] h-[450px] bg-indigo-50/30 blur-[100px] rounded-full" />
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #0f172a 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        />
      </div>

      {/* Top Header Navigation */}
      <header className="w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <Link 
          href="/" 
          className="flex items-center gap-2.5 group transition-transform active:scale-95"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:shadow-emerald-600/30 transition-all">
            <Sparkles size={20} className="group-hover:rotate-12 transition-transform duration-300" />
          </div>
          <div>
            <span className="font-display font-extrabold text-lg text-slate-900 tracking-tight block leading-none">
              Money Matters
            </span>
            <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">
              Youth Financial OS
            </span>
          </div>
        </Link>

        <Link 
          href="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-white/80 hover:bg-white border border-slate-200/80 shadow-xs backdrop-blur-sm transition-all"
        >
          <ArrowLeft size={14} />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Main Authentication Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        <div className="w-full max-w-md">
          
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-[2rem] p-7 sm:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.06)] relative overflow-hidden"
          >
            {/* Top Accent Gradient Border */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600" />

            {/* Header Icon & Intro */}
            <div className="text-center mb-8">
              <motion.div 
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="size-14 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/80 text-emerald-700 flex items-center justify-center mx-auto mb-4 shadow-xs"
              >
                <Sparkles className="size-7 text-emerald-600" />
              </motion.div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome to Money Matters
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 font-medium leading-relaxed max-w-xs mx-auto">
                One-click authentication. If you have an existing account you'll be logged in, otherwise a new account is automatically created.
              </p>
            </div>

            {/* Error Message Box */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, mb: 0 }}
                  animate={{ opacity: 1, height: 'auto', mb: 20 }}
                  exit={{ opacity: 0, height: 0, mb: 0 }}
                  className="bg-rose-50 border border-rose-200 text-rose-700 text-xs px-4 py-3 rounded-xl flex items-start gap-2.5 overflow-hidden"
                >
                  <AlertCircle className="size-4 shrink-0 mt-0.5 text-rose-600" />
                  <span className="leading-tight font-medium">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Primary Action: Google 1-Click Authentication */}
            <div className="space-y-4">
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={loading || guestLoading}
                className="w-full bg-slate-900 hover:bg-slate-800 active:bg-black text-white font-extrabold text-sm py-4 px-5 rounded-2xl transition-all duration-200 flex items-center justify-center gap-3.5 shadow-md hover:shadow-lg cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <Loader2 className="size-5 animate-spin text-emerald-400" />
                ) : (
                  <>
                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0 shadow-xs">
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                    </div>
                    <span>Continue with Google</span>
                    <ArrowRight size={15} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>

              {/* Instant Guest Mode Fallback */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleGuestAccess}
                  disabled={loading || guestLoading}
                  className="w-full py-3 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  {guestLoading ? (
                    <Loader2 className="size-4 animate-spin text-emerald-700" />
                  ) : (
                    <>
                      <Zap size={14} className="text-amber-500 fill-amber-500" />
                      <span>Instant Guest Access (No sign-in)</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Terms & Privacy */}
            <p className="text-[11px] text-slate-400 text-center mt-7 leading-relaxed">
              By continuing, you agree to our{' '}
              <span className="text-slate-600 hover:underline cursor-pointer">Terms of Service</span> and{' '}
              <span className="text-slate-600 hover:underline cursor-pointer">Privacy Policy</span>.
            </p>
          </motion.div>

          {/* Bottom Security Assurance */}
          <div className="flex items-center justify-center gap-6 mt-6 text-xs text-slate-400 font-medium">
            <div className="flex items-center gap-1.5">
              <Shield size={13} className="text-emerald-600" />
              <span>256-bit Encrypted</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Lock size={13} className="text-blue-600" />
              <span>Direct Google OAuth</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-teal-600" />
              <span>100% Free</span>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto px-6 py-4 text-center text-xs text-slate-400 relative z-10">
        © {new Date().getFullYear()} Money Matters. Empowering youth financial literacy.
      </footer>
    </div>
  );
}

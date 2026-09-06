"use client";

import { useEffect } from "react";
import { LanguageProvider } from '@/components/LanguageProvider';
import { Toaster } from "@/components/ui/toaster";
import BackendKeepAlive from "@/components/BackendKeepAlive";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useAppStore } from "@/lib/store/useAppStore";

export default function ClientProviders({ children }) {
  const { setUser, user } = useAppStore();

  useEffect(() => {
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Sync logged in user
        setUser({
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName || 'Learner',
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified
        });
      }
    });

    return () => unsubscribe();
  }, [setUser]);

  return (
    <LanguageProvider>
      <BackendKeepAlive />
      {children}
      <Toaster />
    </LanguageProvider>
  );
}

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAj-jZ-UxRM5q1hLzUZL1xJVO9LqfKLj7M",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "money-matters-207e8.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "money-matters-207e8",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "money-matters-207e8.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "894395406518",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:894395406518:web:7f0cb88221cf13ccaaee17",
};

let app = null;
let auth = null;
let db = null;
let googleProvider = null;
let isFirebaseConfigured = false;

if (firebaseConfig.apiKey && firebaseConfig.apiKey !== 'YOUR_API_KEY_HERE') {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
    isFirebaseConfigured = true;
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
} else {
  console.warn("Firebase configuration is missing. Local Demo Mode will be used.");
}

export { app, auth, db, googleProvider, isFirebaseConfigured };

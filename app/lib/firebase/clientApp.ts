'use client';

import { FirebaseApp, initializeApp, getApps } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { firebaseConfig } from '@/app/lib/firebase/config';
import { Database, getDatabase } from 'firebase/database';
import { getMessaging, isSupported, Messaging } from 'firebase/messaging';
import { getFunctions } from 'firebase/functions';
import {
  getAnalytics,
  isSupported as isAnalyticsSupported,
  logEvent,
} from 'firebase/analytics';

export const firebaseApp: FirebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth: Auth = getAuth(firebaseApp);
export const db: Firestore = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
export const realtimeDb: Database = getDatabase(
  firebaseApp,
  process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
);
export const firebaseFunctions = getFunctions(firebaseApp);
export let messaging: Messaging;
if (typeof window !== 'undefined') {
  isSupported()
    .then((supported) => {
      if (supported) {
        messaging = getMessaging(firebaseApp);
      } else {
        console.log('Firebase Messaging is not supported in this environment.');
      }
    })
    .catch((error) => {
      console.error('Error checking messaging support:', error);
    });
}

if (typeof window !== 'undefined') {
  isAnalyticsSupported()
    .then((supported) => {
      if (supported) {
        const analytics = getAnalytics(firebaseApp);
        logEvent(analytics, 'notification_received');
      } else {
        console.log('Firebase Analytics is not supported in this environment.');
      }
    })
    .catch((error) => {
      console.error('Error checking analytics support:', error);
    });
}

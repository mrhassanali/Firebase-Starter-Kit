'use client';
import {
  Messaging,
  deleteToken,
  getMessaging,
  getToken,
  isSupported,
} from 'firebase/messaging';
// import { UserController } from '../_modules/user/controller/UserController';
import { httpsCallable } from 'firebase/functions';
import { firebaseApp, firebaseFunctions, messaging } from './clientApp';
import { unregisterServiceWorker } from '@/app/lib/utils/serviceWorker';
import clearFirebaseIndexedDBFCMTokens from '@/app/lib/utils/deleteIndexedFirebaseDBToken';

// Initialize Firebase Cloud Messaging and get a reference to the service
export const getMessagingObj = async (): Promise<Messaging | null> => {
  const supported = await isSupported();
  console.log('is supported fcm? >>', supported);
  if (!supported || typeof window === 'undefined') return null;
  return getMessaging(firebaseApp);
};

export class NotificationClass {
  static instance: NotificationClass | null;

  public static getInstance() {
    if (!this.instance) {
      this.instance = new NotificationClass();
    }
    return this.instance;
  }

  public async deleteFcmTokenFromLocal(): Promise<void> {
    try {
      await deleteToken(messaging);
    } catch (err) {
      throw err;
    } finally {
      unregisterServiceWorker();
      clearFirebaseIndexedDBFCMTokens();
    }
  }

  public async fetchToken() {
    try {
      const _messaging = await getMessagingObj();
      if (_messaging) {
        const token = await getToken(_messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY ?? '',
        });
        return token;
      }
      return null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  public async getNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.info('This browser does not support desktop notification');
      return false;
    } else if (Notification.permission === 'granted') {
      return true;
    } else if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        return true;
      }
    }
    return false;
  }

  public async subscribeAndSaveFCMToken(currentToken: string): Promise<void> {
    try {
      const handleLogin = httpsCallable(
        firebaseFunctions,
        "FIREBASE_CALLABLE_FUNCTIONS.HANDLE_LOGIN",
      );
      const result = await handleLogin({ fcmToken: currentToken });
      if (result.data) {
        console.log('category subscribe successfully');
      }
    } catch (error: any) {
      throw error;
    }
    // saving fcm token into the firestore
    // await UserController.getInstance().saveFCMToken(currentToken);
  }

  public async unsubscribeAllTopic(currentToken: string): Promise<void> {
    try {
      // const handleLogout = httpsCallable(
      //   firebaseFunctions,
      //   FIREBASE_CALLABLE_FUNCTIONS.HANDLE_LOGOUT,
      // );

      // const result = await handleLogout({
      //   fcmToken: currentToken,
      // });
    } catch (error) {
      throw error;
    }
  }
}

// Import the functions you need from the SDKs you need
import { FirebaseOptions } from 'firebase/app';
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig: FirebaseOptions & { [key: string]: any } = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: '529546149461',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  applicationPubKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
  measurementId: 'G-66NWHCBTTW',
};

// When deployed, there are quotes that need to be stripped
Object.keys(firebaseConfig).forEach((key) => {
  const configValue = firebaseConfig[key] + '';
  if (configValue.charAt(0) === '"') {
    firebaseConfig[key] = configValue.substring(1, configValue.length - 1);
  }
});

export { firebaseConfig };

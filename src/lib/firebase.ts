import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAWzsjGBCaSNrtWfJy5p7vlqdpxiaxMC-M",
  authDomain: "sanguine-reporter-k5jvd.firebaseapp.com",
  projectId: "sanguine-reporter-k5jvd",
  storageBucket: "sanguine-reporter-k5jvd.firebasestorage.app",
  messagingSenderId: "916360566491",
  appId: "1:916360566491:web:6ac8cb59fcd65ff8181efe"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

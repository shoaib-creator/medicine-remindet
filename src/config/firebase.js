import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_TmJwhxBjvi5ovKNZLfYZv-0NrZ5wvgs",
  authDomain: "mdicine-reminder.firebaseapp.com",
  projectId: "mdicine-reminder",
  storageBucket: "mdicine-reminder.firebasestorage.app",
  messagingSenderId: "15279474585",
  appId: "1:15279474585:web:0d830ecfc797866c79b508",
  measurementId: "G-Z8X946PDQY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore
const db = getFirestore(app);

export { auth, db };
export default app;

import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD6iF1RTdEvYBsWSk9_4M6eAFBiBZD5GgA",
  authDomain: "grocery-ec950.firebaseapp.com",
  projectId: "grocery-ec950",
  storageBucket: "grocery-ec950.firebasestorage.app",
  messagingSenderId: "1046360071205",
  appId: "1:1046360071205:web:6058be39dd8f1c8024f3cc",
  measurementId: "G-8DZM8PEV64"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Enable persistent auth state
setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error('Error setting auth persistence:', error);
  });

export default app; 
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// ReelBunker Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCc02CXOxubvn2N8Pwl3A9iLzukS6gH1to",
  authDomain: "reelbunker.firebaseapp.com",
  projectId: "reelbunker",
  storageBucket: "reelbunker.firebasestorage.app",
  messagingSenderId: "25144889324",
  appId: "1:25144889324:web:c851377d9a18bfaf257ac9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

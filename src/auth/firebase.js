import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDbRw2YrnDyyTRwakXT_I2FnkvAGUWWqeM",
  authDomain: "movie-booking2.firebaseapp.com",
  projectId: "movie-booking2",
  storageBucket: "movie-booking2.firebasestorage.app",
  messagingSenderId: "698058786492",
  appId: "1:698058786492:web:d98cdcf756bbc66615f2b9",
  measurementId: "G-ZNJEZD1CYQ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const realtimeDb = getDatabase(app);


import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  // "AIzaSyDaU961EPjKq8Np7na_sj2xiFt0IVl6beM",
  authDomain: "estate-mern-3630e.firebaseapp.com",
  projectId: "estate-mern-3630e",
  storageBucket: "estate-mern-3630e.appspot.com",
  messagingSenderId: "650335145856",
  appId: "1:650335145856:web:279e6a8d834a83fb5fbb65",
  measurementId: "G-QFCJF894HV"
};

export const app = initializeApp(firebaseConfig);

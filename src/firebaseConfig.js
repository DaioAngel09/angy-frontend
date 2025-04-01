import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBGZRL00Cn60pjpSLYrX944rh1Ba2PmHDQ",
  authDomain: "angy-stock.firebaseapp.com",
  projectId: "angy-stock",
  storageBucket: "angy-stock.firebasestorage.app",
  messagingSenderId: "829220424685",
  appId: "1:829220424685:web:7e6cf1158096fd9f96b5e4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

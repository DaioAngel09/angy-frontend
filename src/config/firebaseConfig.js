// src/config/firebaseConfig.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔹 Configuração do Firebase usando variáveis de ambiente
const firebaseConfig = {
    apiKey: "AIzaSyBGZRL00Cn60pjpSLYrX944rh1Ba2PmHDQ",
    authDomain: "angy-stock.firebaseapp.com",
    projectId: "angy-stock",
    storageBucket: "angy-stock.firebasestorage.app",
    messagingSenderId: "829220424685",
    appId: "1:829220424685:web:7e6cf1158096fd9f96b5e4",
};

// 🔹 Inicializa o Firebase apenas se ainda não foi inicializado
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

// src/pages/firebase.ts

import { initializeApp } from "firebase/app";
import { getDatabase, Database } from "firebase/database";
import { getAuth } from "firebase/auth";
// Nouvelle configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAiJHtj1Y8fMhgXJ_fRBIuHBNwm2K-nOWE",
  authDomain: "bigdata-iise-dht22-sol.firebaseapp.com",
  databaseURL: "https://bigdata-iise-dht22-sol-default-rtdb.firebaseio.com",
  projectId: "bigdata-iise-dht22-sol",
  storageBucket: "bigdata-iise-dht22-sol.firebasestorage.app",
  messagingSenderId: "683238715723",
  appId: "1:683238715723:web:b34144ad71694044ec38ce",
};

// Initialisation Firebase
const app = initializeApp(firebaseConfig);

// Export Database (pour lire/écrire dans Firebase Realtime DB)
export const database: Database = getDatabase(app);

export const auth = getAuth(app);

// js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD5nAGiHNb98sCHMteLu-7RIYS6aZt0YzI",
  authDomain: "property-site-9dfc0.firebaseapp.com",
  projectId: "property-site-9dfc0",
  storageBucket: "property-site-9dfc0.firebasestorage.app",
  messagingSenderId: "1019585501643",
  appId: "1:1019585501643:web:12efacbd43b577a2457e4e",
  measurementId: "G-B5P80KD0T0"
};

// ─── Admin password (เปลี่ยนได้เลย) ──────────────────────────────────────────
const ADMIN_PASSWORD = "admin1234";

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

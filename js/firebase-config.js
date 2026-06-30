// js/firebase-config.js
// ⚠️ ไฟล์นี้เป็น "global script" ธรรมดา (ไม่ใช่ ES Module)
// ต้องโหลดผ่าน <script src="js/firebase-config.js"></script> (ไม่มี type="module")
// และต้องโหลด "หลัง" firebase-app-compat.js, firebase-firestore-compat.js, firebase-auth-compat.js

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyD5nAGiHNb98sCHMteLu-7RIYS6aZt0YzI",
  authDomain: "property-site-9dfc0.firebaseapp.com",
  projectId: "property-site-9dfc0",
  storageBucket: "property-site-9dfc0.firebasestorage.app",
  messagingSenderId: "1019585501643",
  appId: "1:1019585501643:web:12efacbd43b577a2457e4e",
  measurementId: "G-B5P80KD0T0"
};

// ─── เริ่มต้น Firebase (กันการ init ซ้ำ) ──────────────────────────────────────
if (!firebase.apps.length) {
  firebase.initializeApp(FIREBASE_CONFIG);
}

// ─── Auth instance ใช้งานทั่วทั้งเว็บผ่านตัวแปร global นี้ ─────────────────────
const firebaseAuth = firebase.auth();

// ─── ชื่อ Collection ใน Firestore (db.js เรียกใช้ตัวแปรเหล่านี้) ──────────────
const COL_LISTINGS = "listings";
const COL_CLIENTS  = "clients";
const COL_APPOINTMENTS = "appointments";

// ─── LINE แจ้งเตือน ───────────────────────────────────────────────────────────
// วางลิงก์ Web App ของ Google Apps Script (relay) ที่ deploy แล้วตรงนี้
// ถ้าเว้นว่าง "" = ปิดการแจ้งเตือน LINE (ระบบยังทำงานปกติ)
const LINE_RELAY_URL = "https://script.google.com/macros/s/AKfycbyjNi2QVWsZIIVZGe6jT7cKRJTPJHPDskujhG17CIO7Ox_jxxmZyTJi7wU5zgYWJbt3/exec";

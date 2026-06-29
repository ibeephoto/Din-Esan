// ════════════════════════════════════════════════════════════════════════════
//  firebase-config.js  —  กำหนดค่า Firebase (แก้ไขตรงนี้หลังสร้าง project)
// ════════════════════════════════════════════════════════════════════════════
//
//  วิธีตั้งค่า Firebase (ทำครั้งเดียว ~5 นาที):
//  1. ไป https://console.firebase.google.com
//  2. กด "Add project" → ตั้งชื่อ เช่น "property-site" → Create
//  3. เมนูซ้าย: Build → Firestore Database → Create database
//     เลือก "Start in test mode" → Next → Enable
//  4. Project settings (⚙ มุมซ้ายบน) → General → Your apps
//     กด </> (Web) → ตั้งชื่อ App → Register app
//  5. คัดลอก firebaseConfig แล้วแปะแทนค่าด้านล่างนี้
//
// ─────────────────────────────────────────────────────────────────────────────

const FIREBASE_CONFIG = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID"
};

// ─── Admin password (เปลี่ยนได้เลย) ──────────────────────────────────────────
const ADMIN_PASSWORD = "admin1234";

// ─── Collections ──────────────────────────────────────────────────────────────
const COL_LISTINGS = "listings";
const COL_CLIENTS  = "clients";

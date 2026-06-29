// js/auth.js
import { auth } from "./firebase-config.js";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// ==============================
// Login
// ==============================
export async function login(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    const messages = {
      "auth/user-not-found":    "ไม่พบบัญชีนี้ในระบบ",
      "auth/wrong-password":    "รหัสผ่านไม่ถูกต้อง",
      "auth/invalid-email":     "รูปแบบอีเมลไม่ถูกต้อง",
      "auth/too-many-requests": "ลองใหม่ภายหลัง (พยายามเข้าสู่ระบบบ่อยเกินไป)",
      "auth/invalid-credential":"อีเมลหรือรหัสผ่านไม่ถูกต้อง",
    };
    return { success: false, message: messages[error.code] || "เกิดข้อผิดพลาด กรุณาลองใหม่" };
  }
}

// ==============================
// Logout
// ==============================
export async function logout() {
  await signOut(auth);
}

// ==============================
// ติดตามสถานะ Login
// callback(user) — user = null หมายถึงยังไม่ได้ login
// ==============================
export function watchAuthState(callback) {
  onAuthStateChanged(auth, callback);
}

// ==============================
// ดึง user ปัจจุบัน
// ==============================
export function getCurrentUser() {
  return auth.currentUser;
}

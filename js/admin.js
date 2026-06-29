// js/admin.js
import { db } from "./firebase-config.js";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const COLLECTION = "listings";

// ==============================
// เพิ่มประกาศใหม่
// data: { title, type, price, location, description, imageUrl }
// ==============================
export async function addListing(data) {
  try {
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("addListing error:", error);
    return { success: false, message: error.message };
  }
}

// ==============================
// แก้ไขประกาศ
// ==============================
export async function updateListing(id, data) {
  try {
    const docRef = doc(db, COLLECTION, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error("updateListing error:", error);
    return { success: false, message: error.message };
  }
}

// ==============================
// ลบประกาศ
// ==============================
export async function deleteListing(id) {
  try {
    await deleteDoc(doc(db, COLLECTION, id));
    return { success: true };
  } catch (error) {
    console.error("deleteListing error:", error);
    return { success: false, message: error.message };
  }
}

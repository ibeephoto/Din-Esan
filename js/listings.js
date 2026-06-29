// js/listings.js
import { db } from "./firebase-config.js";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  limit
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const COLLECTION = "listings";

// ==============================
// ดึงประกาศทั้งหมด (เรียงตามวันที่ล่าสุด)
// ==============================
export async function getAllListings() {
  try {
    const q = query(
      collection(db, COLLECTION),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("getAllListings error:", error);
    return [];
  }
}

// ==============================
// กรองตามประเภท: "sale" | "rent"
// ==============================
export async function getListingsByType(type) {
  try {
    const q = query(
      collection(db, COLLECTION),
      where("type", "==", type),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("getListingsByType error:", error);
    return [];
  }
}

// ==============================
// ดึงประกาศล่าสุด N รายการ (สำหรับหน้าแรก)
// ==============================
export async function getRecentListings(count = 6) {
  try {
    const q = query(
      collection(db, COLLECTION),
      orderBy("createdAt", "desc"),
      limit(count)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("getRecentListings error:", error);
    return [];
  }
}

// ==============================
// ดึงประกาศชิ้นเดียวตาม ID
// ==============================
export async function getListingById(id) {
  try {
    const docRef = doc(db, COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error("getListingById error:", error);
    return null;
  }
}

// ==============================
// Render การ์ดประกาศลงใน container element
// ==============================
export function renderListingCards(listings, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (listings.length === 0) {
    container.innerHTML = `<p class="no-listings">ยังไม่มีประกาศในขณะนี้</p>`;
    return;
  }

  container.innerHTML = listings.map(listing => `
    <div class="listing-card" onclick="location.href='listing.html?id=${listing.id}'">
      <div class="listing-img">
        ${listing.imageUrl
          ? `<img src="${listing.imageUrl}" alt="${listing.title}">`
          : `<div class="listing-img-placeholder">🏠</div>`}
        <span class="listing-badge ${listing.type === 'sale' ? 'badge-sale' : 'badge-rent'}">
          ${listing.type === 'sale' ? 'ขาย' : 'เช่า'}
        </span>
      </div>
      <div class="listing-body">
        <h3 class="listing-title">${listing.title}</h3>
        <p class="listing-location">📍 ${listing.location || '-'}</p>
        <p class="listing-price">
          ${listing.type === 'sale'
            ? `฿${Number(listing.price).toLocaleString()}`
            : `฿${Number(listing.price).toLocaleString()} / เดือน`}
        </p>
        <p class="listing-desc">${(listing.description || '').substring(0, 80)}${listing.description?.length > 80 ? '...' : ''}</p>
      </div>
    </div>
  `).join('');
}

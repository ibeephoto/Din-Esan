// ════════════════════════════════════════════════════════════════════════════
//  db.js  —  Firebase Firestore wrapper  (real-time sync ทุกเครื่อง)
// ════════════════════════════════════════════════════════════════════════════

// Firebase SDK (compat version — ใช้งานได้โดยไม่ต้อง build tool)
// โหลดผ่าน CDN ใน HTML แล้ว ตัวนี้เป็น wrapper เท่านั้น

let _db = null;

function getDB() {
  if (_db) return _db;
  if (!firebase || !firebase.apps.length) {
    firebase.initializeApp(FIREBASE_CONFIG);
  }
  _db = firebase.firestore();
  return _db;
}

// ─── LISTINGS ─────────────────────────────────────────────────────────────────

const DB = {
  // Subscribe listings (real-time) — callback จะถูกเรียกทุกครั้งที่ข้อมูลเปลี่ยน
  onListings(callback) {
    return getDB()
      .collection(COL_LISTINGS)
      .orderBy("createdAt", "asc")
      .onSnapshot(snap => {
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        // seed sample data ถ้า collection ว่าง
        if (docs.length === 0) {
          DB.seedListings().then(() => {}); // will trigger onSnapshot again
          return;
        }
        callback(docs);
      }, err => {
        console.error("Firestore listings error:", err);
        // Fallback to localStorage ถ้า Firebase ไม่ได้ตั้งค่า
        callback(LSFallback.getListings());
      });
  },

  async saveListing(item) {
    const db = getDB();
    const { id, ...data } = item;
    data.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
    if (!data.createdAt) data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
    await db.collection(COL_LISTINGS).doc(id).set(data, { merge: true });
  },

  async deleteListing(id) {
    await getDB().collection(COL_LISTINGS).doc(id).delete();
  },

  async seedListings() {
    const batch = getDB().batch();
    SAMPLE_LISTINGS.forEach(l => {
      const { id, ...data } = l;
      data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
      batch.set(getDB().collection(COL_LISTINGS).doc(id), data);
    });
    await batch.commit();
  },

  // ─── CLIENTS ───────────────────────────────────────────────────────────────

  onClients(callback) {
    return getDB()
      .collection(COL_CLIENTS)
      .orderBy("createdAt", "asc")
      .onSnapshot(snap => {
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        callback(docs);
      }, err => {
        console.error("Firestore clients error:", err);
        callback(LSFallback.getClients());
      });
  },

  async saveClient(item) {
    const db = getDB();
    const { id, ...data } = item;
    data.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
    if (!data.createdAt) data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
    await db.collection(COL_CLIENTS).doc(id).set(data, { merge: true });
  },

  async deleteClient(id) {
    await getDB().collection(COL_CLIENTS).doc(id).delete();
  },
};

// ─── LocalStorage Fallback (ใช้เมื่อ Firebase ยังไม่ได้ตั้งค่า) ──────────────
const LSFallback = {
  getListings() {
    try { return JSON.parse(localStorage.getItem("prop_listings_v1")) || SAMPLE_LISTINGS; }
    catch { return SAMPLE_LISTINGS; }
  },
  saveListings(arr) { localStorage.setItem("prop_listings_v1", JSON.stringify(arr)); },
  getClients() {
    try { return JSON.parse(localStorage.getItem("prop_clients_v1")) || []; }
    catch { return []; }
  },
  saveClients(arr) { localStorage.setItem("prop_clients_v1", JSON.stringify(arr)); },
};

// ─── Check ว่า Firebase ตั้งค่าแล้วหรือยัง ────────────────────────────────────
function isFirebaseConfigured() {
  return FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.apiKey !== "YOUR_API_KEY";
}

// ─── Unified API (auto-select Firebase or Fallback) ───────────────────────────
const Storage = {
  _listingsUnsub: null,
  _clientsUnsub: null,

  onListings(cb) {
    if (!isFirebaseConfigured()) {
      cb(LSFallback.getListings()); return () => {};
    }
    if (this._listingsUnsub) this._listingsUnsub();
    this._listingsUnsub = DB.onListings(cb);
    return this._listingsUnsub;
  },

  async saveListing(item) {
    if (!isFirebaseConfigured()) {
      const arr = LSFallback.getListings();
      const idx = arr.findIndex(x => x.id === item.id);
      if (idx >= 0) arr[idx] = item; else arr.push(item);
      LSFallback.saveListings(arr);
      return;
    }
    await DB.saveListing(item);
  },

  async deleteListing(id) {
    if (!isFirebaseConfigured()) {
      LSFallback.saveListings(LSFallback.getListings().filter(x => x.id !== id));
      return;
    }
    await DB.deleteListing(id);
  },

  onClients(cb) {
    if (!isFirebaseConfigured()) {
      cb(LSFallback.getClients()); return () => {};
    }
    if (this._clientsUnsub) this._clientsUnsub();
    this._clientsUnsub = DB.onClients(cb);
    return this._clientsUnsub;
  },

  async saveClient(item) {
    if (!isFirebaseConfigured()) {
      const arr = LSFallback.getClients();
      const idx = arr.findIndex(x => x.id === item.id);
      if (idx >= 0) arr[idx] = item; else arr.push(item);
      LSFallback.saveClients(arr);
      return;
    }
    await DB.saveClient(item);
  },

  async deleteClient(id) {
    if (!isFirebaseConfigured()) {
      LSFallback.saveClients(LSFallback.getClients().filter(x => x.id !== id));
      return;
    }
    await DB.deleteClient(id);
  },
};

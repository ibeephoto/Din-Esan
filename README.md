# 🏡 ระบบฝากขายบ้าน & ที่ดิน — พร้อม Real-time Sync

ข้อมูลซิ้งค์แบบ **Real-time** ผ่าน Firebase Firestore  
ทุกเครื่อง ทุกเบราว์เซอร์ เห็นข้อมูลเดียวกันทันที

---

## 📁 โครงสร้างไฟล์

```
property-site/
├── index.html              ← หน้าหลัก (แสดงสินค้าสาธารณะ)
├── admin.html              ← หน้าจัดการลูกค้าฝากขาย
├── css/
│   └── style.css           ← สไตล์ชีตหลัก
├── js/
│   ├── firebase-config.js  ← ⚙️ ตั้งค่า Firebase ตรงนี้!
│   ├── db.js               ← Firebase Firestore wrapper
│   └── common.js           ← utility functions
└── README.md
```

---

## 🔥 ขั้นตอนที่ 1 — ตั้งค่า Firebase (ทำครั้งเดียว ~5 นาที)

### 1.1 สร้าง Firebase Project
1. ไป [console.firebase.google.com](https://console.firebase.google.com)
2. กด **Add project** → ตั้งชื่อ เช่น `property-site` → Create

### 1.2 สร้าง Firestore Database
1. เมนูซ้าย: **Build → Firestore Database**
2. กด **Create database**
3. เลือก **Start in test mode** → Next → เลือก Region (asia-southeast1) → Enable

### 1.3 ได้รับ Config
1. ⚙️ Project settings (มุมซ้ายบน) → **General** → **Your apps**
2. กด **</>** (Web) → ตั้งชื่อ App → Register app
3. คัดลอก `firebaseConfig` ที่แสดง

### 1.4 แก้ไขไฟล์ js/firebase-config.js
```javascript
const FIREBASE_CONFIG = {
  apiKey:            "AIzaSy...",        // ← ใส่ค่าจริง
  authDomain:        "my-project.firebaseapp.com",
  projectId:         "my-project",
  storageBucket:     "my-project.appspot.com",
  messagingSenderId: "123456789",
  appId:             "1:123456789:web:abc..."
};

const ADMIN_PASSWORD = "your-new-password"; // ← เปลี่ยนรหัสผ่านด้วย!
```

---

## 🚀 ขั้นตอนที่ 2 — อัปโหลดขึ้น GitHub Pages

### 2.1 สร้าง Repository
1. ไป [github.com](https://github.com) → **New repository**
2. ชื่อ: `property-site` → **Public** → **Create**

### 2.2 อัปโหลดไฟล์
1. กด **Add file → Upload files**
2. ลากทั้งโฟลเดอร์ `property-site/` หรือเลือกไฟล์ทีละตัว
3. กด **Commit changes**

### 2.3 เปิด GitHub Pages
1. **Settings → Pages**
2. Source: **Deploy from a branch** → Branch: **main** → **/ (root)** → Save
3. รอ 1-2 นาที เข้าได้ที่:
   `https://[username].github.io/property-site/`

### 2.4 แก้ Firebase Authorized Domains
1. Firebase Console → **Authentication** → **Settings → Authorized domains**
2. เพิ่ม: `[username].github.io`
3. (หรือไป Firestore → Rules แล้วตรวจว่า allow read, write ใน test mode)

---

## 🔄 การซิ้งค์ Real-time

| ก่อน (localStorage)           | หลัง (Firebase Firestore)         |
|-------------------------------|-----------------------------------|
| ❌ ข้อมูลแยกต่อเครื่อง        | ✅ ทุกเครื่องเห็นเหมือนกัน       |
| ❌ ต้อง export/import ด้วยมือ | ✅ อัปเดตอัตโนมัติ real-time     |
| ❌ ข้อมูลหายเมื่อ Clear cache | ✅ ข้อมูลอยู่บน Cloud ถาวร       |
| ❌ ไม่มี sync indicator       | ✅ แสดงสถานะ 🟢ซิ้งค์แล้ว        |

---

## ⚙️ การปรับแต่ง

### เปลี่ยนรหัสผ่านแอดมิน
แก้ใน `js/firebase-config.js`:
```javascript
const ADMIN_PASSWORD = "รหัสใหม่ของคุณ";
```

### เปลี่ยนสีธีม
แก้ใน `css/style.css`:
```css
:root {
  --green: #1a6b3c;
  --green-dark: #0d4f2b;
}
```

### เพิ่ม LINE Notify
แก้ฟังก์ชัน `notifyLine()` ใน `admin.html`:
```javascript
function notifyLine(action, client) {
  fetch("https://notify-api.line.me/api/notify", {
    method: "POST",
    headers: {
      "Authorization": "Bearer YOUR_LINE_TOKEN",
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: `message=${encodeURIComponent(action+': '+client.firstName+' '+client.lastName)}`
  });
}
```

---

## 📝 หมายเหตุ
- Firestore **test mode** อนุญาตอ่าน/เขียนได้ 30 วัน → ต่ออายุใน Firebase Console
- ฟรี Spark plan: 1GB storage, 50K reads/วัน เพียงพอสำหรับใช้งานทั่วไป
- รูปโฉนดเก็บเป็น Base64 ใน Firestore (จำกัด ~1MB ต่อ document)

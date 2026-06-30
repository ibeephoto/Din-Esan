// js/export.js
import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ==============================
// ดึงข้อมูลจาก Firestore
// ==============================
async function fetchCollection(name) {
  const snapshot = await getDocs(collection(db, name));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// ==============================
// แปลง Timestamp → string
// ==============================
function formatValue(val) {
  if (!val) return "";
  if (val?.seconds) {
    return new Date(val.seconds * 1000).toLocaleString("th-TH");
  }
  return String(val);
}

// ==============================
// Export เป็น CSV
// ==============================
export function exportCSV(data, filename) {
  if (!data.length) { alert("ไม่มีข้อมูล"); return; }

  const headers = Object.keys(data[0]);
  const rows = data.map(row =>
    headers.map(h => {
      const v = formatValue(row[h]);
      return `"${v.replace(/"/g, '""')}"`;
    }).join(",")
  );

  const csv = [headers.join(","), ...rows].join("\n");
  const bom  = "\uFEFF"; // UTF-8 BOM สำหรับ Excel ภาษาไทย
  const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8;" });
  downloadBlob(blob, filename + ".csv");
}

// ==============================
// Export เป็น XLSX (ใช้ SheetJS CDN)
// ==============================
export function exportXLSX(data, filename) {
  if (!data.length) { alert("ไม่มีข้อมูล"); return; }

  // แปลง Timestamp ก่อน
  const cleaned = data.map(row => {
    const obj = {};
    Object.keys(row).forEach(k => { obj[k] = formatValue(row[k]); });
    return obj;
  });

  const ws = XLSX.utils.json_to_sheet(cleaned);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, filename.substring(0, 31));
  XLSX.writeFile(wb, filename + ".xlsx");
}

// ==============================
// Download blob helper
// ==============================
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a   = document.createElement("a");
  a.href     = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ==============================
// Export listings
// ==============================
export async function exportListings(format) {
  try {
    const data = await fetchCollection("listings");
    const name = `listings_${dateStamp()}`;
    format === "xlsx" ? exportXLSX(data, name) : exportCSV(data, name);
  } catch (e) {
    alert("Export listings ล้มเหลว: " + e.message);
  }
}

// ==============================
// Export users/contacts
// ==============================
export async function exportUsers(format) {
  try {
    const data = await fetchCollection("users");
    const name = `users_${dateStamp()}`;
    format === "xlsx" ? exportXLSX(data, name) : exportCSV(data, name);
  } catch (e) {
    alert("Export users ล้มเหลว: " + e.message);
  }
}

// ==============================
// Export ทั้งสอง collection รวมใน XLSX หลาย sheet
// ==============================
export async function exportAll(format) {
  try {
    const [listings, users] = await Promise.all([
      fetchCollection("listings"),
      fetchCollection("users")
    ]);

    if (format === "xlsx") {
      const clean = arr => arr.map(row => {
        const obj = {};
        Object.keys(row).forEach(k => { obj[k] = formatValue(row[k]); });
        return obj;
      });

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(clean(listings)), "Listings");
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(clean(users)),    "Users");
      XLSX.writeFile(wb, `backup_all_${dateStamp()}.xlsx`);
    } else {
      // CSV → download ทีละไฟล์
      exportCSV(listings, `listings_${dateStamp()}`);
      setTimeout(() => exportCSV(users, `users_${dateStamp()}`), 500);
    }
  } catch (e) {
    alert("Export ล้มเหลว: " + e.message);
  }
}

function dateStamp() {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,"0")}${String(d.getDate()).padStart(2,"0")}`;
}

// ════════════════════════════════════════════════════════════════════════════
//  common.js  —  Shared utilities, sample data, uid
// ════════════════════════════════════════════════════════════════════════════

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// ─── Toast ────────────────────────────────────────────────────────────────────
let _toastTimer;
function showToast(msg, type = "success") {
  let el = document.getElementById("globalToast");
  if (!el) {
    el = document.createElement("div");
    el.id = "globalToast";
    el.style.cssText = `position:fixed;bottom:24px;right:24px;padding:12px 20px;
      border-radius:12px;font-size:14px;font-weight:600;z-index:9999;
      box-shadow:0 8px 24px rgba(0,0,0,.2);font-family:'Noto Sans Thai',sans-serif;
      transition:opacity .3s;display:none;`;
    document.body.appendChild(el);
  }
  el.style.background = type === "error" ? "#dc2626" : "#1a6b3c";
  el.style.color = "#fff";
  el.textContent = msg;
  el.style.display = "block";
  el.style.opacity = "1";
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => { el.style.opacity = "0"; setTimeout(() => el.style.display = "none", 300); }, 3200);
}

// ─── Modal helpers ────────────────────────────────────────────────────────────
function openModal(id)  { document.getElementById(id).style.display = "flex"; }
function closeModal(id) { document.getElementById(id).style.display = "none"; }

// ─── Commission calc ──────────────────────────────────────────────────────────
function calcCommission(priceStr) {
  const n = parseFloat((priceStr || "").replace(/,/g, ""));
  if (!n || n <= 0) return null;
  const comm = n * 0.03;
  return {
    c: comm.toLocaleString("th-TH", { maximumFractionDigits: 0 }),
    n: (n - comm).toLocaleString("th-TH", { maximumFractionDigits: 0 })
  };
}

// ─── Format area ─────────────────────────────────────────────────────────────
function formatArea(d) {
  return [d.rai && `${d.rai} ไร่`, d.ngan && `${d.ngan} งาน`, d.sqwa && `${d.sqwa} ตรว.`]
    .filter(Boolean).join(" ") || "—";
}

// ─── Sync indicator ──────────────────────────────────────────────────────────
function setSyncStatus(status) {
  // status: "synced" | "saving" | "offline"
  const el = document.getElementById("syncStatus");
  if (!el) return;
  const map = {
    synced:  { icon: "🟢", text: "ซิ้งค์แล้ว",    color: "#16a34a" },
    saving:  { icon: "🟡", text: "กำลังบันทึก...", color: "#d97706" },
    offline: { icon: "🔴", text: "Offline",         color: "#dc2626" },
  };
  const s = map[status] || map.offline;
  el.innerHTML = `<span style="color:${s.color};font-size:12px;">${s.icon} ${s.text}</span>`;
}

// ─── Google Calendar link ─────────────────────────────────────────────────────
function toGCalURL(date, time, note) {
  const dt  = new Date(`${date}T${time || "09:00"}:00`);
  const end = new Date(dt.getTime() + 60 * 60000);
  const fmt = d => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  return `https://www.google.com/calendar/render?action=TEMPLATE`
    + `&text=${encodeURIComponent("นัดดูพื้นที่")}`
    + `&dates=${fmt(dt)}/${fmt(end)}`
    + `&details=${encodeURIComponent(note || "")}`;
}

// ─── Sample listings ──────────────────────────────────────────────────────────
const SAMPLE_LISTINGS = [
  // ─── LINE Notify (ผ่าน Google Apps Script relay) ──────────────────────────────
async function notifyLine(message) {
  if (!LINE_RELAY_URL) return; // ไม่ได้ตั้งค่าไว้ = ปิดการแจ้งเตือน

  try {
    await fetch(LINE_RELAY_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ message })
    });
  } catch (err) {
    console.error("แจ้งเตือน LINE ล้มเหลว:", err);
  }
}
  {
    id: "sample3",
    title: "ที่ดินวิวภูเขา ใกล้แหล่งท่องเที่ยว",
    type: "ที่ดิน", price: "1,200,000",
    area: "1 ไร่ 2 งาน", district: "อ.แม่ริม", province: "เชียงใหม่",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
    fbLink: "https://facebook.com", titleDeedNo: "11111", status: "ขาย"
  },
];

// ─── LINE Notify (ผ่าน Google Apps Script relay) ──────────────────────────────
async function notifyLine(message) {
  if (!LINE_RELAY_URL) return; // ไม่ได้ตั้งค่าไว้ = ปิดการแจ้งเตือน

  try {
    await fetch(LINE_RELAY_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ message })
    });
  } catch (err) {
    console.error("แจ้งเตือน LINE ล้มเหลว:", err);
  }
}
];

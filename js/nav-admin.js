// js/nav-admin.js
// วางไว้ในทุกหน้าที่มีปุ่ม/ลิงก์ไป admin.html
// ใส่ id="admin-link" ในปุ่มหรือ <a> ที่ต้องการซ่อน

import { watchAuthState } from "./auth.js";

watchAuthState(user => {
  // หา element ทุกตัวที่มี class หรือ id เกี่ยวกับ admin
  const adminEls = document.querySelectorAll(
    "#admin-link, .admin-link, [data-admin-only]"
  );

  adminEls.forEach(el => {
    el.style.display = user ? "" : "none";
  });
});

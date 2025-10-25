const API_BASE = "http://localhost:8080/api/v1/auth";

// === ĐĂNG KÝ ===
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.getElementById("role").value;
    const msg = document.getElementById("registerMessage");

    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role }),
      });

      if (res.ok) {
        msg.style.color = "green";
        msg.innerText = "Đăng ký thành công! Chuyển sang đăng nhập...";
        setTimeout(() => (window.location.href = "login.html"), 1500);
      } else {
        const err = await res.json();
        msg.style.color = "red";
        msg.innerText = `Lỗi: ${err.message || err.error || "Không xác định"}`;
      }
    } catch (e) {
      msg.style.color = "red";
      msg.innerText = "Không thể kết nối đến server!";
    }
  });
}

// === ĐĂNG NHẬP ===
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const msg = document.getElementById("loginMessage");

    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.token);
        msg.style.color = "green";
        msg.innerText = "Đăng nhập thành công!";
        setTimeout(() => (window.location.href = "doctors.html"), 1000);
      } else {
        const err = await res.json();
        msg.style.color = "red";
        msg.innerText = `Đăng nhập thất bại: ${err.message || err.error}`;
      }
    } catch (e) {
      msg.style.color = "red";
      msg.innerText = "Không thể kết nối đến server!";
    }
  });
}

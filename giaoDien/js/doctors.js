const API_DOCTOR = "http://localhost:8080/api/v1/doctors";

async function loadDoctors() {
  const token = localStorage.getItem("token");
  const list = document.getElementById("doctorList");

  if (!token) {
    alert("Vui lòng đăng nhập lại!");
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch(API_DOCTOR, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      const doctors = await res.json();
      list.innerHTML = doctors
        .map(
          (d) => `
        <div class="col-md-4">
          <div class="card shadow-sm p-3">
            <h5>${d.name}</h5>
            <p>Chuyên khoa: ${d.specialty || "Không rõ"}</p>
            <p>Email: ${d.email || "N/A"}</p>
          </div>
        </div>`
        )
        .join("");
    } else if (res.status === 401) {
      alert("Phiên đăng nhập hết hạn. Đăng nhập lại nhé!");
      localStorage.removeItem("token");
      window.location.href = "login.html";
    } else {
      list.innerHTML = `<p class="text-danger">Không thể tải danh sách bác sĩ</p>`;
    }
  } catch (e) {
    list.innerHTML = `<p class="text-danger">Lỗi kết nối đến server</p>`;
  }
}

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "login.html";
});

loadDoctors();

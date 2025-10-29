const API_BASE = "http://localhost:8080/api/v1";
const token = localStorage.getItem("token");

if (!token) {
  alert("Phiên đăng nhập đã hết, vui lòng đăng nhập lại!");
  window.location.href = "login.html";
}

const appointmentTableBody = document.getElementById("appointmentTableBody");
const statusFilter = document.getElementById("statusFilter");

// ====== Hàm tải danh sách lịch hẹn ======
async function loadAppointments(status = "") {
  appointmentTableBody.innerHTML = `<tr><td colspan="7" class="text-center text-muted">Đang tải...</td></tr>`;
  try {
    const res = await fetch(`${API_BASE}/appointments/doctor${status ? `?status=${status}` : ""}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Không thể tải danh sách lịch hẹn!");
    const data = await res.json();

    if (data.length === 0) {
      appointmentTableBody.innerHTML = `<tr><td colspan="7" class="text-center text-muted">Không có lịch hẹn nào.</td></tr>`;
      return;
    }

    appointmentTableBody.innerHTML = data
      .map(
        (a) => `
        <tr>
          <td>${a.id}</td>
          <td>${a.patientName || "N/A"}</td>
          <td>${a.date}</td>
          <td>${a.time}</td>
          <td>${a.notes || ""}</td>
          <td>${renderStatus(a.status)}</td>
          <td>${renderActions(a)}</td>
        </tr>`
      )
      .join("");
  } catch (err) {
    appointmentTableBody.innerHTML = `<tr><td colspan="7" class="text-center text-danger">Lỗi khi tải dữ liệu.</td></tr>`;
  }
}

// ====== Hiển thị trạng thái ======
function renderStatus(status) {
  switch (status) {
    case "PENDING":
      return `<span class="status-badge status-pending">Chờ xác nhận</span>`;
    case "CONFIRMED":
      return `<span class="status-badge status-confirmed">Đã xác nhận</span>`;
    case "REJECTED":
      return `<span class="status-badge status-rejected">Đã từ chối</span>`;
    case "COMPLETED":
      return `<span class="status-badge status-completed">Hoàn thành</span>`;
    default:
      return `<span class="status-badge">${status}</span>`;
  }
}

// ====== Nút thao tác ======
function renderActions(a) {
  if (a.status === "PENDING") {
    return `
      <button class="btn btn-sm btn-success me-1" onclick="updateStatus(${a.id}, 'CONFIRMED')">Xác nhận</button>
      <button class="btn btn-sm btn-danger" onclick="updateStatus(${a.id}, 'REJECTED')">Từ chối</button>
    `;
  } else if (a.status === "CONFIRMED") {
    return `<button class="btn btn-sm btn-primary" onclick="updateStatus(${a.id}, 'COMPLETED')">Đánh dấu hoàn thành</button>`;
  } else {
    return `<span class="text-muted">-</span>`;
  }
}

// ====== Cập nhật trạng thái ======
async function updateStatus(id, status) {
  if (!confirm(`Bạn có chắc muốn chuyển lịch #${id} sang trạng thái ${status}?`)) return;
  try {
    const res = await fetch(`${API_BASE}/appointments/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      alert("Cập nhật thành công!");
      loadAppointments(statusFilter.value);
    } else {
      const err = await res.json();
      alert(err.message || "Không thể cập nhật trạng thái!");
    }
  } catch (err) {
    alert("Lỗi khi gửi yêu cầu!");
  }
}

// ====== Lọc theo trạng thái ======
statusFilter.addEventListener("change", (e) => {
  loadAppointments(e.target.value);
});

// ====== Đăng xuất ======
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "login.html";
});

// ====== Khởi chạy ======
loadAppointments();

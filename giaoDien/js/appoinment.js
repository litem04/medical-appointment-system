const API_BASE = "http://localhost:8080/api/v1";
const token = localStorage.getItem("token");

if (!token) {
  alert("Vui lòng đăng nhập lại!");
  window.location.href = "login.html";
}

const doctorSelect = document.getElementById("doctorSelect");
const appointmentForm = document.getElementById("appointmentForm");
const appointmentMessage = document.getElementById("appointmentMessage");
const appointmentTableBody = document.getElementById("appointmentTableBody");

// ======= Load danh sách bác sĩ =======
async function loadDoctors() {
  try {
    const res = await fetch(`${API_BASE}/doctors`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Không thể tải danh sách bác sĩ.");
    const doctors = await res.json();
    doctorSelect.innerHTML = doctors
      .map((d) => `<option value="${d.id}">${d.name} - ${d.specialty || "Chưa rõ"}</option>`)
      .join("");
  } catch (err) {
    doctorSelect.innerHTML = `<option disabled>Lỗi tải danh sách bác sĩ</option>`;
  }
}

// ======= Load danh sách lịch hẹn =======
async function loadAppointments() {
  try {
    const res = await fetch(`${API_BASE}/appointments`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Không thể tải danh sách lịch hẹn.");
    const appointments = await res.json();

    if (appointments.length === 0) {
      appointmentTableBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">Chưa có lịch hẹn nào.</td></tr>`;
      return;
    }

    appointmentTableBody.innerHTML = appointments
      .map(
        (a) => `
      <tr>
        <td>${a.doctorName || "N/A"}</td>
        <td>${a.date}</td>
        <td>${a.time}</td>
        <td>${a.notes || ""}</td>
        <td>
          <button class="btn btn-sm btn-danger" onclick="cancelAppointment(${a.id})">Hủy</button>
        </td>
      </tr>`
      )
      .join("");
  } catch (err) {
    appointmentTableBody.innerHTML = `<tr><td colspan="5" class="text-danger text-center">Lỗi tải dữ liệu</td></tr>`;
  }
}

// ======= Đặt lịch mới =======
appointmentForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  appointmentMessage.innerText = "";

  const doctorId = doctorSelect.value;
  const date = document.getElementById("appointmentDate").value;
  const time = document.getElementById("appointmentTime").value;
  const notes = document.getElementById("notes").value;

  try {
    const res = await fetch(`${API_BASE}/appointments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ doctorId, date, time, notes }),
    });

    if (res.ok) {
      appointmentMessage.style.color = "green";
      appointmentMessage.innerText = "Đặt lịch thành công!";
      appointmentForm.reset();
      await loadAppointments();
    } else {
      const err = await res.json();
      appointmentMessage.style.color = "red";
      appointmentMessage.innerText = err.message || "Lỗi không xác định!";
    }
  } catch (err) {
    appointmentMessage.style.color = "red";
    appointmentMessage.innerText = "Không thể kết nối server!";
  }
});

// ======= Hủy lịch hẹn =======
async function cancelAppointment(id) {
  if (!confirm("Bạn có chắc muốn hủy lịch hẹn này?")) return;
  try {
    const res = await fetch(`${API_BASE}/appointments/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      alert("Đã hủy lịch hẹn!");
      loadAppointments();
    } else {
      alert("Không thể hủy lịch hẹn!");
    }
  } catch (err) {
    alert("Lỗi khi kết nối server!");
  }
}

// ======= Đăng xuất =======
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "login.html";
});

// ======= Khởi chạy =======
loadDoctors();
loadAppointments();

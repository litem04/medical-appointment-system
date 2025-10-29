// === appointment.js – PHIÊN BẢN SIÊU SẠCH, KHÔNG LỖI TRÙNG ===


// === TOAST: CHỈ TẠO NẾU CHƯA CÓ ===
if (!window.toast) {
  window.toast = (message, type = 'info', duration = 3000) => {
    const toastEl = document.createElement('div');
    toastEl.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white font-medium z-50 transition-all animate-slide-up`;
    toastEl.style.backgroundColor = 
      type === 'success' ? '#10b981' :
      type === 'danger' ? '#ef4444' :
      type === 'warning' ? '#f59e0b' : '#3b82f6';
    toastEl.textContent = message;

    document.body.appendChild(toastEl);
    setTimeout(() => toastEl.remove(), duration);
  };

  // Animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slide-up {
      from { transform: translateY(100px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .animate-slide-up { animation: slide-up 0.4s ease-out; }
  `;
  document.head.appendChild(style);
}



// === API FETCH ===
async function apiFetch(url, options = {}) {
  const token = localStorage.getItem('token');
  if (!token) {
    toast('Phiên đăng nhập hết hạn!', 'warning');
    setTimeout(() => location.href = 'login.html', 1000);
    throw new Error('No token');
  }

  const headers = { 'Content-Type': 'application/json', ...options.headers };
  headers['Authorization'] = `Bearer ${token}`;

  try {
    const res = await fetch(`${API_BASE}${url}`, { ...options, headers });
    const contentType = res.headers.get('content-type');
    const data = contentType?.includes('json') ? await res.json() : { message: await res.text() };

    if (!res.ok) {
      if (res.status === 401) {
        localStorage.clear();
        toast('Phiên hết hạn!', 'warning');
        setTimeout(() => location.href = 'login.html', 1000);
      }
      throw new Error(data.message || `HTTP ${res.status}`);
    }
    return data;
  } catch (err) {
    console.error('API Error:', err);
    toast(err.message || 'Lỗi kết nối!', 'danger');
    throw err;
  }
}

// === VALIDATE NGÀY ===
function setupDateValidation() {
  const dateInput = document.getElementById('dateInput');
  if (!dateInput) return;

  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);

  dateInput.addEventListener('change', () => {
    if (dateInput.value && dateInput.value < today) {
      toast('Không thể chọn ngày trong quá khứ!', 'danger');
      dateInput.value = '';
    }
  });
}

// === ĐẶT LỊCH ===
// === appointment.js – SỬA CHỈ 1 HÀM ===

async function bookAppointment(e) {
    e.preventDefault(); // Ngăn reload

    const token = localStorage.getItem('token');
    if (!token) {
        toast('Vui lòng đăng nhập!', 'warning');
        setTimeout(() => location.href = 'login.html', 1000);
        return;
    }

    // 1. LẤY patientId TỪ TOKEN
    let patientId;
    try {
        const payload = parseJwt(token);
        patientId = payload.patientId || payload.sub;
    } catch (err) {
        toast('Token lỗi!', 'danger');
        return;
    }

    // 2. LẤY DỮ LIỆU TỪ FORM (THEO ID TRONG HTML)
    const doctorId = document.getElementById('doctorSelect').value;
    const date = document.getElementById('dateInput').value;
    const time = document.getElementById('timeInput').value;
    const durationMinutes = document.getElementById('durationSelect').value;
    const note = document.getElementById('noteInput').value.trim();

    // 3. KIỂM TRA ĐẦY ĐỦ
    if (!doctorId || !date || !time || !durationMinutes) {
        toast('Vui lòng điền đầy đủ!', 'danger');
        return;
    }

    // 4. NỐI NGÀY + GIỜ → appointmentTime
    const appointmentTime = `${date}T${time}:00`;

    // 5. DỮ LIỆU GỬI ĐI
    const data = {
        patientId: Number(patientId),
        doctorId: Number(doctorId),
        appointmentTime: appointmentTime,
        durationMinutes: Number(durationMinutes),
        note: note || null
    };

    console.log("Đặt lịch:", data);

    try {
        const res = await apiFetch('/appointments', {
            method: 'POST',
            body: JSON.stringify(data)
        });

        toast('Đặt lịch thành công!', 'success');
        document.getElementById('bookingForm').reset();
        document.getElementById('selectedDoctorImage')?.classList.add('hidden');

        // TẢI LẠI LỊCH NẾU CÓ TRÊN TRANG
        if (typeof loadMyAppointments === 'function') {
            setTimeout(loadMyAppointments, 1000);
        }
    } catch (err) {
        toast(err.message || 'Đặt lịch thất bại!', 'danger');
    }
}
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Lỗi giải mã token:", e);
        return null;
    }
}
// appointment.js
// my-appointments.html (đã có sẵn)
async function loadMyAppointments() {
    const token = localStorage.getItem('token');
    const payload = JSON.parse(atob(token.split('.')[1]));
    const patientId = payload.patientId;  // → 24

    const response = await fetch(`http://localhost:8080/api/v1/appointments/my?patientId=${patientId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
        const appointments = await response.json();
        renderAppointments(appointments);  // HIỆN DANH SÁCH
    }
}
function renderAppointments(appointments) {
    const container = document.getElementById('appointments-list');
    if (!container) {
        console.error("Không tìm thấy #appointments-list");
        return;
    }

    if (!appointments || appointments.length === 0) {
        container.innerHTML = '<p class="text-muted">Bạn chưa có lịch hẹn nào.</p>';
        return;
    }

    let html = '<div class="list-group">';
    appointments.forEach(appt => {
        const date = new Date(appt.appointmentTime).toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });

        html += `
            <div class="list-group-item">
                <div class="d-flex w-100 justify-content-between">
                    <h6 class="mb-1">Bệnh nhân: <strong>ID ${appt.patientId}</strong></h6>
                    <small class="text-muted">${date}</small>
                </div>
                <p class="mb-1">
                    Bác sĩ ID: <strong>${appt.doctorId}</strong><br>
                    Dịch vụ: <em>${appt.note || 'Không có ghi chú'}</em>
                </p>
                <span class="badge bg-primary">Thời lượng: ${appt.durationMinutes} phút</span>
            </div>`;
    });
    html += '</div>';

    container.innerHTML = html;
}
// === DANH SÁCH BÁC SĨ ===
async function populateDoctors() {
  const select = document.getElementById('doctorSelect');
  const img = document.getElementById('selectedDoctorImage');
  if (!select) return;

  try {
    const doctors = await apiFetch('/doctors');
    select.innerHTML = '<option value="">-- Chọn bác sĩ --</option>';

    doctors.forEach(doc => {
      const opt = new Option(`${doc.fullName} - ${doc.specialization}`, doc.id);
      opt.dataset.image = doc.imageUrl || 'https://placehold.co/128x128/blue/white?text=BS';
      select.appendChild(opt);
    });

    select.onchange = () => {
      const selected = select.options[select.selectedIndex];
      if (selected.value && img) {
        img.src = selected.dataset.image;
        img.classList.remove('hidden');
      } else if (img) {
        img.classList.add('hidden');
      }
    };
  } catch (err) {
    toast('Không tải được danh sách bác sĩ!', 'danger');
  }
}

function selectDoctorFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const doctorId = urlParams.get('doctorId');
  const select = document.getElementById('doctorSelect');
  const img = document.getElementById('selectedDoctorImage');

  if (doctorId && select) {
    apiFetch('/doctors').then(doctors => {
      const doctor = doctors.find(d => d.id == doctorId);
      if (doctor) {
        const opt = new Option(`${doctor.fullName} - ${doctor.specialization}`, doctor.id, true, true);
        opt.dataset.image = doctor.imageUrl || 'https://placehold.co/128x128/blue/white?text=BS';
        select.appendChild(opt);
        if (img) {
          img.src = opt.dataset.image;
          img.classList.remove('hidden');
        }
      }
    });
  }
}
function showError(message) {
    const container = document.getElementById('appointments-list');
    if (container) {
        container.innerHTML = `<p class="text-danger text-center">${message}</p>`;
    }
}
async function initDoctorsPage() {
  showLoading(true);
  try {
    const doctors = await apiFetch('/doctors');
    const list = document.getElementById('doctorsList');
    list.innerHTML = '';

    if (!doctors || doctors.length === 0) {
      list.innerHTML = `
        <div class="text-center py-16 bg-white rounded-xl shadow-md">
          <img src="https://placehold.co/120x120/lightgray/white?text=Error" class="mx-auto mb-4 opacity-50 w-20 h-20">
          <p class="text-red-600 text-lg font-bold mb-2">Không có bác sĩ nào!</p>
          <p class="text-gray-500 mb-4">Hệ thống đang bảo trì.</p>
          <button onclick="location.reload()" class="btn-primary px-6 py-3">
            Thử lại
          </button>
        </div>
      `;
      return;
    }

    doctors.forEach(doc => {
      const card = document.createElement('div');
      card.className = 'bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all';
      card.innerHTML = `
        <div class="flex items-center gap-4 mb-4">
          <img src="${doc.imageUrl || 'https://placehold.co/80x80/blue/white?text=BS'}" 
               alt="${doc.fullName}" 
               class="w-20 h-20 rounded-full object-cover border-2 border-blue-200">
          <div>
            <h3 class="text-xl font-bold text-gray-800">${doc.fullName}</h3>
            <p class="text-blue-600 font-medium">${doc.specialization}</p>
            <p class="text-sm text-gray-500">${doc.phone || ''}</p>
          </div>
        </div>
        <a href="book-appointment.html?doctorId=${doc.id}" 
           class="btn-primary w-full text-center block">Đặt lịch</a>
      `;
      list.appendChild(card);
    });

    const userNameEl = document.getElementById('userName');
    if (userNameEl) userNameEl.textContent = localStorage.getItem('userName') || 'Người dùng';
  } catch (err) {
    document.getElementById('doctorsList').innerHTML = `
      <div class="text-center py-16 bg-white rounded-xl shadow-md">
        <p class="text-red-600 font-bold mb-2">Lỗi kết nối!</p>
        <p class="text-gray-500">${err.message}</p>
        <button onclick="location.reload()" class="btn-primary mt-4 px-6 py-3">
          Thử lại
        </button>
      </div>
    `;
  } finally {
    showLoading(false);
  }
}

// === KHỞI TẠO TRANG ===
document.addEventListener('DOMContentLoaded', () => {
  const currentPage = window.location.href.split('/').pop().split('?')[0];

  const userNameEl = document.getElementById('userName');
  if (userNameEl) {
    userNameEl.textContent = localStorage.getItem('userName') || 'Người dùng';
  }

  if (currentPage === 'doctors.html') {
    initDoctorsPage();
  } else if (currentPage === 'book-appointment.html') {
    populateDoctors();
    selectDoctorFromUrl();
    setupDateValidation();
    const form = document.getElementById('bookingForm');
    if (form) form.onsubmit = bookAppointment;
  } else if (currentPage === 'my-appointments.html') {
    loadMyAppointments();
  }
});
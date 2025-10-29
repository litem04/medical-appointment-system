

// === API FETCH (GIỮ NGUYÊN) ===
async function apiFetch(url, options = {}) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const res = await fetch(`${API_BASE}${url}`, { ...options, headers });
    const data = res.headers.get('content-type')?.includes('json') ? await res.json() : { message: await res.text() };
    if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
    return data;
  } catch (err) {
    console.error('API Error:', err);
    toast(err.message || 'Lỗi kết nối!', 'danger');
    throw err;
  }
}

// === 1. DANH SÁCH BÁC SĨ ===
async function initDoctorsPage() {
  showLoading(true);
  try {
    const doctors = await apiFetch('/doctors');
    const list = document.getElementById('doctorsList');
    list.innerHTML = '';

    if (!doctors || doctors.length === 0) {
      list.innerHTML = `<p class="text-center text-gray-500">Không có bác sĩ nào.</p>`;
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

    document.getElementById('userName').textContent = localStorage.getItem('userName') || 'Người dùng';
  } catch (err) {
    // lỗi đã toast
  } finally {
    showLoading(false);
  }
}

// === 2. ĐẶT LỊCH: LOAD BÁC SĨ + CHỌN TỪ URL ===
async function populateDoctors() {
  const select = document.getElementById('doctorSelect');
  const img = document.getElementById('selectedDoctorImage');
  if (!select) return;

  try {
    const doctors = await apiFetch('/doctors');
    select.innerHTML = '<option value="">-- Chọn bác sĩ --</option>';

    doctors.forEach(doc => {
      const opt = document.createElement('option');
      opt.value = doc.id;
      opt.textContent = `${doc.fullName} - ${doc.specialization}`;
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

// === LỊCH CỦA TÔI – GỌI ĐÚNG API + HIỆN ĐẸP ===
async function loadMyAppointments() {
  const list = document.getElementById('myAppointmentsList');
  if (!list) return;

  showLoading(true);
  try {
    // GỌI ĐÚNG API: /appointments/my
    const appointments = await apiFetch('/appointments/my');

    list.innerHTML = '';
    if (!appointments || appointments.length === 0) {
      list.innerHTML = `
        <div class="text-center py-12">
          <img src="https://placehold.co/120x120/lightgray/white?text=📅" class="mx-auto mb-4 opacity-50">
          <p class="text-gray-500 text-lg">Chưa có lịch hẹn nào</p>
          <a href="book-appointment.html" class="btn-primary mt-4 inline-block">Đặt lịch ngay</a>
        </div>
      `;
      return;
    }

    appointments.forEach(app => {
      const date = new Date(app.appointmentTime);
      const card = document.createElement('div');
      card.className = 'bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100 mb-4';
      card.innerHTML = `
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <img src="https://placehold.co/60x60/blue/white?text=BS" class="w-12 h-12 rounded-full border-2 border-blue-200">
              <div>
                <h4 class="font-bold text-gray-800 text-lg">${app.doctorFullName || 'Bác sĩ'}</h4>
                <p class="text-blue-600 font-medium">${app.specialization || ''}</p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-3 text-sm mt-3">
              <p><i class="fas fa-calendar-alt mr-2 text-blue-600"></i> ${date.toLocaleDateString('vi-VN')}</p>
              <p><i class="fas fa-clock mr-2 text-blue-600"></i> ${date.toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'})}</p>
              <p class="col-span-2"><i class="fas fa-stethoscope mr-2 text-blue-600"></i> ${app.durationMinutes} phút</p>
              ${app.note ? `<p class="col-span-2 text-gray-700 mt-1"><strong>Lý do:</strong> ${app.note}</p>` : ''}
            </div>
          </div>
          <div class="text-right">
            <span class="px-4 py-2 rounded-full text-xs font-bold ${
              app.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
              app.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
              'bg-red-100 text-red-800'
            }">
              ${app.status === 'PENDING' ? 'Chờ xác nhận' :
                app.status === 'CONFIRMED' ? 'Đã xác nhận' : 'Đã hủy'}
            </span>
          </div>
        </div>
      `;
      list.appendChild(card);
    });
  } catch (err) {
    list.innerHTML = `<p class="text-center text-red-500 py-8">Lỗi tải lịch: ${err.message}</p>`;
  } finally {
    showLoading(false);
  }
}

// === 4. ĐẶT LỊCH – DÙNG HÀM ĐÃ TEST THÀNH CÔNG ===
async function bookAppointment(e) {
  e.preventDefault();

  const doctorId = document.getElementById('doctorSelect')?.value;
  const date = document.getElementById('dateInput')?.value;
  const time = document.getElementById('timeInput')?.value || '09:00';
  const duration = document.getElementById('durationSelect')?.value;
  const note = document.getElementById('noteInput')?.value.trim() || 'Không có ghi chú';

  if (!doctorId || !date) {
    toast('Vui lòng chọn bác sĩ và ngày!', 'warning');
    return;
  }

  const data = {
    patientId: parseInt(localStorage.getItem('userId') || '3'),
    doctorId: parseInt(doctorId),
    appointmentTime: `${date}T${time}:00`,
    durationMinutes: parseInt(duration),
    note: note
  };

  console.log('ĐẶT LỊCH GỬI:', data);

  try {
    const res = await fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || `HTTP ${res.status}`);
    }

    toast('Đặt lịch thành công!', 'success');
    document.getElementById('bookingForm').reset();
    document.getElementById('selectedDoctorImage')?.classList.add('hidden');
    
    // TỰ ĐỘNG CẬP NHẬT LỊCH
    if (typeof loadMyAppointments === 'function') {
      setTimeout(loadMyAppointments, 500);
    }
  } catch (err) {
    toast('Lỗi: ' + err.message, 'danger');
    console.error(err);
  }
}

// === 5. KHỞI TẠO TRANG ĐẶT LỊCH ===
async function initBookingPage() {
  await populateDoctors();
  selectDoctorFromUrl();

  const form = document.getElementById('bookingForm');
  if (form) {
    form.onsubmit = bookAppointment;
  }
}

// === CHẠY KHI LOAD TRANG ===
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;

  if (path.includes('doctors.html')) {
    initDoctorsPage();
  } else if (path.includes('book-appointment.html')) {
    initBookingPage();
  } else if (path.includes('my-appointments.html') || path.includes('appointments.html')) {
    loadMyAppointments();
  }
});
async function loadDoctors(containerId = 'doctors-list') {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '<div class="loading">Đang tải bác sĩ...</div>';

  try {
    const res = await api('/doctors');
    if (!res.ok) throw new Error('Lỗi tải dữ liệu');

    const data = await res.json();
    const doctors = data.doctors || data;

    if (!doctors || doctors.length === 0) {
      container.innerHTML = '<p class="text-center text-muted">Chưa có bác sĩ nào.</p>';
      return;
    }

    container.innerHTML = '';
    doctors.filter(d => d.active).forEach(doctor => {
      const img = doctor.imageUrl || 'https://placehold.co/128x128/blue/white?text=BS';
      container.innerHTML += `
        <div class="card doctor-card">
          <img src="${img}" alt="${doctor.fullName}" onerror="this.src='https://placehold.co/128x128/blue/white?text=BS'">
          <h3>${doctor.fullName}</h3>
          <p><strong>Chuyên khoa:</strong> ${doctor.specialization}</p>
          <p><strong>Điện thoại:</strong> ${doctor.phone}</p>
          <p><strong>Email:</strong> ${doctor.email}</p>
          <a href="appointments.html?doctorId=${doctor.id}" class="btn btn-primary btn-sm" style="margin-top:1rem;">Đặt lịch</a>
        </div>
      `;
    });
  } catch (err) {
    container.innerHTML = `<div class="alert alert-danger">Lỗi: ${err.message}</div>`;
  }
}
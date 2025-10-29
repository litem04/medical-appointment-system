// assets/js/auth.js


async function login(e) {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  if (!username || !password) {
    toast('Vui lòng nhập đầy đủ!', 'danger');
    return;
  }

  showLoading(true);
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const contentType = res.headers.get('content-type');
    let data = {};

    if (contentType && contentType.includes('application/json')) {
      data = await res.json();
    } else {
      data.message = await res.text();
    }

    if (res.ok) {
      const token = data.accessToken || data.token || data.jwt;
      const name = data.name || data.fullName || username;

      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('userName', name);
        toast('Đăng nhập thành công!', 'success');
        setTimeout(() => location.href = 'appointments.html', 1200);
      } else {
        toast('Không nhận được token!', 'danger');
      }
    } else {
      toast(data.message || 'Sai tài khoản/mật khẩu!', 'danger');
    }
  } catch (err) {
    toast('Không kết nối được server!', 'danger');
  } finally {
    showLoading(false);
  }
}

async function register(e) {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  if (!username || !password) {
    toast('Vui lòng nhập đầy đủ!', 'danger');
    return;
  }

  showLoading(true);
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const contentType = res.headers.get('content-type');
    let data = {};

    if (contentType && contentType.includes('application/json')) {
      data = await res.json();
    } else {
      data.message = await res.text();
    }

    if (res.ok) {
      toast(data.message || 'Đăng ký thành công!', 'success');
      setTimeout(() => location.href = 'login.html', 1500);
    } else if (res.status === 400 || res.status === 409) {
      toast(data.message || 'Tài khoản đã tồn tại!', 'danger');
    } else {
      toast('Lỗi server: ' + res.status, 'danger');
    }
  } catch (err) {
    toast('Không kết nối được server!', 'danger');
  } finally {
    showLoading(false);
  }
}
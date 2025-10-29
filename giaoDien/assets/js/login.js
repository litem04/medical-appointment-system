// login.js
async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const res = await fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (data.token) {
        localStorage.setItem('token', data.token);
        window.location.href = 'my-appointments.html';
    } else {
        alert('Đăng nhập thất bại');
    }
}
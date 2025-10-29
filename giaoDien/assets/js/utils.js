const API_BASE = 'http://localhost:8080/api/v1';

function showLoading(show = true) {
  let loader = document.getElementById('appLoading');
  if (!loader) {
    loader = document.createElement('div');
    loader.id = 'appLoading';
    loader.innerHTML = `<div style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:center;justify-content:center;"><div style="width:60px;height:60px;border:6px solid #f3f3f3;border-top:6px solid #1e90ff;border-radius:50%;animation:spin 1s linear infinite;"></div></div>`;
    document.body.appendChild(loader);
  }
  loader.style.display = show ? 'flex' : 'none';
}

function toast(msg, type = 'success') {
  const colors = { success: '#28a745', danger: '#dc3545', info: '#17a2b8' };
  const div = document.createElement('div');
  div.style.cssText = `position:fixed;top:20px;right:20px;z-index:10000;background:${colors[type]};color:white;padding:14px 24px;border-radius:8px;font-weight:bold;box-shadow:0 4px 12px rgba(0,0,0,0.3);animation:slideIn 0.4s,slideOut 0.4s 2.6s forwards;`;
  div.textContent = msg;
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 3000);
}

const style = document.createElement('style');
style.textContent = `@keyframes spin { to { transform: rotate(360deg); } } @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } } @keyframes slideOut { to { transform: translateX(100%); opacity: 0; } }`;
document.head.appendChild(style);
// assets/js/utils.js
function toast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="flex items-center">
      <span>${message}</span>
    </div>
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function showLoading(show = true) {
  let loader = document.getElementById('globalLoader');
  if (!loader) {
    loader = document.createElement('div');
    loader.id = 'globalLoader';
    loader.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    loader.innerHTML = `<div class="bg-white p-6 rounded-lg shadow-lg">Đang tải...</div>`;
    document.body.appendChild(loader);
  }
  loader.style.display = show ? 'flex' : 'none';
}
export function login(email) {
  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('userEmail', email);
  window.location.href = 'index.html';
}

export function logout() {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userEmail');
  window.location.href = 'login.html';
}

export function requireAuth() {
  const ok = localStorage.getItem('isLoggedIn') === 'true';
  if (!ok) window.location.href = 'login.html';
}
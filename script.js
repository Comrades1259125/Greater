function login() {
  const user = document.getElementById('username').value;
  const pass = document.getElementById('password').value;
  if (user === 'teacher' && pass === '1234') {
    localStorage.setItem('role', 'teacher');
    window.location.href = 'dashboard.html';
  } else if (user === 'student' && pass === '1234') {
    localStorage.setItem('role', 'student');
    window.location.href = 'dashboard.html';
  } else {
    alert('Invalid login');
  }
}

function logout() {
  localStorage.removeItem('role');
  window.location.href = 'index.html';
}

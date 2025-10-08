window.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const loginBtn = document.getElementById('loginBtn');
  const message = document.getElementById('loginMessage');
  const loading = document.getElementById('loading');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    message.textContent = '';
    message.style.color = '';

    if (!username || !password) {
      message.textContent = 'Username dan password tidak boleh kosong.';
      message.style.color = 'red';
      return;
    }

    loading.classList.remove('hidden');
    loginBtn.disabled = true;

    try {
      const res = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) throw new Error('Username atau password salah.');
      const data = await res.json();

      await new Promise(resolve => setTimeout(resolve, 700)); // animasi loading kecil

      localStorage.setItem('firstName', data.firstName);

      message.textContent = `Login berhasil! Selamat datang, ${data.firstName}.`;
      message.style.color = 'green';

      setTimeout(() => {
        window.location.href = 'recipes.html';
      }, 1000);

    } catch (err) {
      console.error(err);
      message.textContent = err.message || 'Terjadi kesalahan saat login.';
      message.style.color = 'red';
    } finally {
      loading.classList.add('hidden');
      loginBtn.disabled = false;
    }
  });
});

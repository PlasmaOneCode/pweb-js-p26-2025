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
      const res = await fetch('https://dummyjson.com/users');
      if (!res.ok) throw new Error('Gagal mengambil data user.');
      const data = await res.json();

      const user = data.users.find(u => u.username.toLowerCase() === username.toLowerCase());

      await new Promise(resolve => setTimeout(resolve, 700));

      if (!user) {
        throw new Error('Username tidak ditemukan.');
      }

      localStorage.setItem('firstName', user.firstName);

      message.textContent = `Login berhasil! Selamat datang, ${user.firstName}.`;
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

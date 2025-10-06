// ===============================
// login.js (Skeleton)
// ===============================

// Ambil elemen penting dari HTML
const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginMessage = document.getElementById("loginMessage");
const loading = document.getElementById("loading");

// Event saat submit form login
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // cegah reload halaman

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  // Validasi sederhana
  if (!username || !password) {
    loginMessage.textContent = "Username dan password tidak boleh kosong.";
    loginMessage.style.color = "red";
    return;
  }

  // Tampilkan loading
  loading.classList.remove("hidden");
  loginMessage.textContent = "";

  try {
    // Contoh fetch satu kali untuk memastikan API bisa diakses
    const response = await fetch("https://dummyjson.com/users");
    if (!response.ok) throw new Error("Gagal mengambil data user.");

    const data = await response.json();
    console.log("Example API Response:", data.users[0]); // contoh output

    // Placeholder login simulasi
    const user = data.users.find((u) => u.username === username);
    if (user && password !== "") {
      // Simpan ke localStorage (nama depan)
      localStorage.setItem("firstName", user.firstName);
      loginMessage.textContent = `Selamat datang, ${user.firstName}!`;
      loginMessage.style.color = "green";

      // Redirect ke recipes.html (nanti)
      setTimeout(() => {
        window.location.href = "recipes.html";
      }, 1500);
    } else {
      loginMessage.textContent = "Username atau password salah.";
      loginMessage.style.color = "red";
    }
  } catch (error) {
    console.error("Error:", error);
    loginMessage.textContent = "Terjadi kesalahan koneksi API.";
    loginMessage.style.color = "red";
  } finally {
    loading.classList.add("hidden");
  }
});

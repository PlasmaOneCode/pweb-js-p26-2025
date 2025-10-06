// ===============================
// recipes.js (Skeleton)
// ===============================

// Cek apakah user sudah login
const userName = localStorage.getItem("firstName");
if (!userName) {
  alert("Anda belum login! Silakan login terlebih dahulu.");
  window.location.href = "login.html";
}

// Tampilkan nama user di navbar
document.getElementById("userName").textContent = `👋 ${userName}`;

// Tombol logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "login.html";
});

// Container resep
const recipesContainer = document.getElementById("recipesContainer");

// Fetch contoh data dari API
async function fetchRecipes() {
  try {
    const response = await fetch("https://dummyjson.com/recipes");
    if (!response.ok) throw new Error("Gagal mengambil data resep.");

    const data = await response.json();
    console.log("Example Recipe:", data.recipes[0]); // contoh output

    // Tampilkan satu contoh card
    const recipe = data.recipes[0];
    const card = document.createElement("div");
    card.className = "recipe-card";
    card.innerHTML = `
      <img src="${recipe.image}" alt="${recipe.name}">
      <div class="card-body">
        <h3>${recipe.name}</h3>
        <p>⏱️ ${recipe.cookTimeMinutes} menit</p>
        <p>🔥 ${recipe.difficulty}</p>
        <p>🍽️ ${recipe.cuisine}</p>
        <p>⭐ ${recipe.rating}</p>
      </div>
    `;
    recipesContainer.appendChild(card);
  } catch (error) {
    console.error("Error:", error);
    recipesContainer.innerHTML = `<p style="color:red;">Gagal memuat data resep.</p>`;
  }
}

// Jalankan fetch contoh
fetchRecipes();

window.addEventListener('DOMContentLoaded', () => {
  const user = localStorage.getItem('firstName');
  if (!user) {
    alert('Silakan login terlebih dahulu!');
    window.location.href = 'login.html';
    return;
  }

  const userName = document.getElementById('userName');
  const logoutBtn = document.getElementById('logoutBtn');
  const searchInput = document.getElementById('searchInput');
  const cuisineFilter = document.getElementById('cuisineFilter');
  const recipesContainer = document.getElementById('recipesContainer');
  const showMoreBtn = document.getElementById('showMoreBtn');
  const modal = document.getElementById('recipeModal');
  const modalContent = document.getElementById('modalContent');
  const closeModal = document.getElementById('closeModal');
  const logoutModal = document.getElementById('logoutModal');
  const confirmLogout = document.getElementById('confirmLogout');
  const cancelLogout = document.getElementById('cancelLogout');

  let recipes = [];
  let filteredRecipes = [];
  const cardsPerRow = 4;
  let visibleCount = cardsPerRow * 2;
  let searchTimeout;

  userName.textContent = `Halo, ${user}!`;

  logoutBtn.addEventListener('click', () => {
    logoutModal.classList.remove('hidden');
  });

  confirmLogout.addEventListener('click', () => {
    localStorage.clear();
    logoutModal.classList.add('hidden');
    window.location.href = 'login.html';
  });

  cancelLogout.addEventListener('click', () => {
    logoutModal.classList.add('hidden');
  });


  async function loadRecipes() {
    recipesContainer.innerHTML = '<p class="loading">Memuat resep...</p>';

    try {
      const res = await fetch('https://dummyjson.com/recipes');
      if (!res.ok) throw new Error('Gagal memuat data dari server');
      const data = await res.json();
      recipes = data.recipes;
      filteredRecipes = recipes;

      const cuisines = [...new Set(recipes.map(r => r.cuisine))];
      cuisines.forEach(cuisine => {
        const option = document.createElement('option');
        option.value = cuisine;
        option.textContent = cuisine;
        cuisineFilter.appendChild(option);
      });

      renderRecipes(filteredRecipes.slice(0, visibleCount));
    } catch (err) {
      console.error(err);
      recipesContainer.innerHTML = `<p class="error">${err.message}</p>`;
    }
  }

  function renderRecipes(list) {
    recipesContainer.innerHTML = '';

    if (list.length === 0) {
      recipesContainer.innerHTML = '<p class="empty">Tidak ada resep ditemukan.</p>';
      return;
    }

    list.forEach(recipe => {
      const card = document.createElement('div');
      card.classList.add('recipe-card');
      card.innerHTML = `
        <img src="${recipe.image}" alt="${recipe.name}" class="recipe-img">
        <h3>${recipe.name}</h3>
        <p><strong>Cuisine:</strong> ${recipe.cuisine}</p>
        <p><strong>Waktu Masak:</strong> ${recipe.cookTimeMinutes} menit</p>
        <p><strong>Tingkat Kesulitan:</strong> ${recipe.difficulty}</p>
        <p><strong>Rating:</strong> ⭐ ${recipe.rating}</p>
        <button class="view-btn" data-id="${recipe.id}">Lihat Resep Lengkap</button>
      `;

      // Tambahkan tampilan ingredients sebagai tag kecil
      const ingredientsContainer = document.createElement('div');
      ingredientsContainer.classList.add('ingredients-tags');
      // Tambahkan ingredient tags (maks 4)
      recipe.ingredients.slice(0, 4).forEach(ing => {
        const tag = document.createElement('span');
        tag.classList.add('ingredient-tag');
        tag.textContent = ing;
        ingredientsContainer.appendChild(tag);
      });

      card.appendChild(ingredientsContainer);
      recipesContainer.appendChild(card);
    });
  }

  // Fungsi gabungan filter + search
  function updateFilteredRecipes() {
    const q = searchInput.value.toLowerCase();
    const selectedCuisine = cuisineFilter.value;

    filteredRecipes = recipes.filter(r => {
      const matchSearch =
        r.name.toLowerCase().includes(q) ||
        r.cuisine.toLowerCase().includes(q) ||
        r.ingredients.join(',').toLowerCase().includes(q) ||
        r.tags.join(',').toLowerCase().includes(q);

      const matchCuisine = selectedCuisine ? r.cuisine === selectedCuisine : true;

      return matchSearch && matchCuisine;
    });

    renderRecipes(filteredRecipes.slice(0, visibleCount));
  }

  searchInput.addEventListener('input', e => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      visibleCount = cardsPerRow * 2;
      updateFilteredRecipes();
    }, 300);
  });

  cuisineFilter.addEventListener('change', () => {
    visibleCount = cardsPerRow * 2;
    updateFilteredRecipes();
  });

  showMoreBtn.addEventListener('click', () => {
    visibleCount += cardsPerRow * 2;
    renderRecipes(filteredRecipes.slice(0, visibleCount));
  });

  recipesContainer.addEventListener('click', e => {
    if (e.target.classList.contains('view-btn')) {
      const id = Number(e.target.dataset.id);
      const recipe = recipes.find(r => r.id === id);
      if (recipe) openModal(recipe);
    }
  });

  function openModal(recipe) {
    modalContent.innerHTML = `
      <h2>${recipe.name}</h2>
      <img src="${recipe.image}" alt="${recipe.name}" class="modal-img">
      <p><strong>Cuisine:</strong> ${recipe.cuisine}</p>
      <p><strong>Cook Time:</strong> ${recipe.cookTimeMinutes} menit</p>
      <p><strong>Difficulty:</strong> ${recipe.difficulty}</p>
      <p><strong>Rating:</strong> ⭐ ${recipe.rating}</p>
      <h3>Ingredients:</h3>
      <ul>${recipe.ingredients.map(i => `<li>${i}</li>`).join('')}</ul>
      <h3>Instructions:</h3>
      <ol>${recipe.instructions.map(step => `<li>${step}</li>`).join('')}</ol>
    `;
    modal.classList.remove('hidden');
  }

  closeModal.addEventListener('click', () => modal.classList.add('hidden'));
  modal.addEventListener('click', e => {
    if (e.target === modal) modal.classList.add('hidden');
  });

  loadRecipes();
});

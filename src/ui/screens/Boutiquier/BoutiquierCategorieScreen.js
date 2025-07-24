export default class BoutiquierCategorieScreen {
  constructor(root) {
    this.root = root;
    this.user = JSON.parse(localStorage.getItem("user")); // Boutiquier connecté
  }

  async render() {
    if (!this.user || this.user.id_role !== "2") {
      this.root.innerHTML = `<p class="text-red-600">Accès non autorisé.</p>`;
      return;
    }

    this.root.innerHTML = `
      <h2 class="text-xl font-bold mb-4">Mes catégories</h2>
      <div id="categories-list" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <p class="text-gray-500 col-span-full">Chargement...</p>
      </div>
    `;

    try {
      const res = await fetch(`http://localhost:3000/categories?id_boutiquier=${this.user.id}&deleted=false`);
      const categories = await res.json();

      const container = document.getElementById("categories-list");

      if (categories.length === 0) {
        container.innerHTML = `<p class="text-gray-500 col-span-full">Aucune catégorie trouvée.</p>`;
        return;
      }

      container.innerHTML = categories.map(cat => `
        <div class="bg-white shadow p-4 rounded-lg">
          <h3 class="text-lg font-semibold text-gray-800">${cat.libelle}</h3>
          <p class="text-sm text-gray-500">ID: ${cat.id}</p>
        </div>
      `).join("");

    } catch (error) {
      console.error(error);
      document.getElementById("categories-list").innerHTML = `
        <p class="text-red-600 col-span-full">Erreur lors du chargement des catégories.</p>
      `;
    }
  }
}

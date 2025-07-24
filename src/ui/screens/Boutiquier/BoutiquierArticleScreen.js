import { BoutiquierArticleService } from "../../../services/BoutiquierArticle.service.js";

const ICONS = {
  add: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>`,
};

export default class BoutiquierArticleScreen {
  constructor(container, idBoutiquier) {
    this.container = container;
    this.idBoutiquier = idBoutiquier;
    this.articleService = new BoutiquierArticleService();
    this.view = "active"; // "active" ou "deleted"
  }

  async render() {
    try {
      // Récupère tous les articles du boutiquier
      const allArticles = await this.articleService.listByBoutiquier(this.idBoutiquier);

      // Filtrer selon la vue
      const articles = allArticles.filter((a) =>
        this.view === "active" ? !a.deleted : a.deleted
      );

      this.renderList(articles);

      // Après rendu, bind event listeners des boutons pour changer la vue
      this.bindViewToggle();
      this.bindAddButton();
    } catch (err) {
      this.container.innerHTML = `
        <div class="flex flex-col items-center justify-center p-10 text-center text-red-500 mt-20">
          <i class="fas fa-exclamation-circle text-5xl mb-4"></i>
          <p class="text-lg">Erreur : ${err.message}</p>
        </div>`;
    }
  }

  renderList(articles) {
    if (!articles.length) {
      this.container.innerHTML = `
        ${this.renderControls()} 
        <div class="flex flex-col items-center justify-center p-10 text-center text-gray-500">
          <i class="fas fa-box-open text-5xl mb-4"></i>
          <p class="text-lg">Aucun article trouvé</p>
        </div>`;
      return;
    }

    this.container.innerHTML = `
      ${this.renderControls()}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6 p-6 mt-6">
        ${articles
          .map(
            (a) => `
          <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 hover:-translate-y-1">
            <div class="h-48 overflow-hidden">
              <img 
                src="${a.image || 'https://via.placeholder.com/300x200?text=No+Image'}" 
                alt="${a.libelle}"
                class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              >
            </div>
            <div class="p-5">
              <h3 class="text-xl font-semibold text-gray-800 mb-2">${a.libelle}</h3>
              <p class="text-lg font-bold text-emerald-500 mb-3">${a.prix} FCFA</p>
              ${a.description ? `<p class="text-gray-600 text-sm mb-4">${a.description}</p>` : ''}
              <button class="w-full bg-red-500 text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity">
                Voir détails
              </button>
            </div>
          </div>`
          )
          .join("")}
      </div>`;
  }

  renderControls() {
    // Ajoute les boutons d’ajout + toggle Actifs / Corbeille
    return `
      <div class="flex justify-between items-center p-6 mt-10">
        <h1 class="text-2xl font-bold text-gray-800">Liste des articles</h1>
        <div class="flex items-center space-x-4">
            <button id="btn-add" class="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
            ${ICONS.add}
            <span>Ajouter</span>
            </button>
            <div class="inline-flex rounded-md shadow-sm ml-4" role="group">
                <button data-v="active" type="button" class="tab px-4 py-2 text-sm font-medium rounded-l-lg border ${this.view === "active" ? "bg-indigo-600 text-white" : ""}">
                    Actifs
                </button>
                <button data-v="deleted" type="button" class="tab px-4 py-2 text-sm font-medium rounded-r-lg border ${this.view === "deleted" ? "bg-indigo-600 text-white" : ""}">
                    Corbeille
                </button>
            </div>
        </div>
      </div>
    `;
  }

  bindViewToggle() {
    const buttons = this.container.querySelectorAll(".tab");
    buttons.forEach((btn) =>
      btn.addEventListener("click", () => {
        const v = btn.getAttribute("data-v");
        if (v !== this.view) {
          this.view = v;
          this.render(); // re-render avec nouvelle vue
        }
      })
    );
  }

  bindAddButton() {
    const btnAdd = this.container.querySelector("#btn-add");
    if (btnAdd) {
      btnAdd.addEventListener("click", () => {
        alert("Ajouter un nouvel article - à implémenter !");
        // Ici tu peux ouvrir un formulaire modal pour ajouter un article
      });
    }
  }
}

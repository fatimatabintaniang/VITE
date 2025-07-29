import { AuthService } from "../../../services/authService.js";
import { DetteService } from "../../../services/detteService.js";
import { ArticleService } from "../../../services/articleService.js";
import { Modal } from "../../components/Modal.js";
import { validate } from "../../../utils/validation.js";
import { Toast } from "../../components/Toast.js";

export default class ClientScreen {
  constructor(root) {
    this.root = root;
    this.authSvc = new AuthService();
    this.detteSvc = new DetteService();
    this.articleSvc = new ArticleService();
    this.state = {
      user: null,
      dettes: [],
      demandes: [],
      allArticles: []
    };
  }

  async render() {
    try {
      this.state.user = await this.authSvc.getCurrentUser();
      const [dettes, demandes] = await Promise.all([
        this.detteSvc.getByClientId(this.state.user.id),
        this.detteSvc.getDemandesByClient(this.state.user.id)
      ]);
      this.state.dettes = dettes;
      this.state.demandes = demandes;
    } catch (error) {
      console.error("Error:", error);
      this.state.dettes = [];
      this.state.demandes = [];
    }

    this.root.innerHTML = `
      <div class="container mx-auto p-6 max-w-6xl mt-20">
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-3xl font-light text-slate-700">Bonjour, ${this.state.user?.prenom || ''}</h1>
          <div class="flex gap-4">
            <button id="btn-articles" class="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-all">
              <i class="fas fa-store"></i> Voir les articles
            </button>
            <button id="btn-logout" class="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all">
              <i class="fas fa-sign-out-alt"></i> Déconnexion
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
            <h2 class="text-xl font-normal text-slate-700 mb-4">Demande de crédit</h2>
            
            <button id="btn-request-debt" class="w-full py-3 px-4 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-all mb-6 flex items-center justify-center gap-2">
              <i class="far fa-plus-circle"></i> Nouvelle demande
            </button>
            
            <h3 class="font-medium text-slate-600 mb-3">Vos demandes</h3>
            ${this._renderDemandesList()}
          </div>

          <div class="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-normal text-slate-700">Vos dettes</h2>
              <span class="text-lg font-medium text-slate-700">
                ${this._calculateTotalDettes()} €
              </span>
            </div>
            ${this._renderDettesList()}
          </div>
        </div>
      </div>
    `;

    this.setUpEventListeners();
  }

  _renderDemandesList() {
    if (!this.state.demandes || this.state.demandes.length === 0) {
      return `<p class="text-slate-400 italic">Aucune demande en cours</p>`;
    }

    return `
      <ul class="space-y-3">
        ${this.state.demandes.map(demande => `
          <li class="p-3 rounded-lg ${this._getStatusBgColor(demande.statut)}">
            <div class="flex justify-between items-center">
              <div>
                <p class="font-medium">${demande.montant} €</p>
                <p class="text-sm text-slate-500">${demande.raison || 'Sans motif'}</p>
                ${demande.articles?.length > 0 ? `
                  <div class="mt-1">
                    <p class="text-xs font-medium text-slate-500">Articles:</p>
                    <ul class="text-xs text-slate-400">
                      ${demande.articles.map(art => `<li>${art.libelle} - ${art.prix} €</li>`).join('')}
                    </ul>
                  </div>
                ` : ''}
              </div>
              ${this._getStatusBadge(demande.statut)}
            </div>
          </li>
        `).join('')}
      </ul>
    `;
  }

  _renderDettesList() {
    if (!this.state.dettes || this.state.dettes.length === 0) {
      return `<p class="text-slate-400 italic">Aucune dette active</p>`;
    }

    return `
      <ul class="space-y-3 max-h-96 overflow-y-auto pr-2">
        ${this.state.dettes.map(dette => `
          <li class="p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-all">
            <div class="flex justify-between">
              <div>
                <p class="font-medium">${dette.montant} €</p>
                <p class="text-sm text-slate-500">${dette.raison || 'Sans motif'}</p>
                ${dette.articles?.length > 0 ? `
                  <div class="mt-1">
                    <p class="text-xs font-medium text-slate-500">Articles:</p>
                    <ul class="text-xs text-slate-400">
                      ${dette.articles.map(art => `<li>${art.libelle} - ${art.prix} €</li>`).join('')}
                    </ul>
                  </div>
                ` : ''}
              </div>
              <div class="text-right">
                <p class="text-sm ${this._isOverdue(dette.dateEcheance) ? 'text-rose-500' : 'text-slate-500'}">
                  ${dette.createdAt ? new Date(dette.createdAt).toLocaleDateString() : 'N/A'}
                </p>
                ${this._getStatusBadge(dette.statut)}
              </div>
            </div>
          </li>
        `).join('')}
      </ul>
    `;
  }

  async _renderDebtRequestModal() {
    try {
      // Charger tous les articles une seule fois
      if (this.state.allArticles.length === 0) {
        const { data: articles } = await this.articleSvc.list(1, 1000);
        this.state.allArticles = articles;
      }

      const form = document.createElement('form');
      form.className = 'space-y-1';
      form.innerHTML = `
        <div>
          <label class="block text-sm font-medium text-slate-600 mb-1">Montant total (€)</label>
          <input type="number" name="montant" min="1" step="0.01" readonly
                 class="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-100">
          <p class="text-rose-500 text-sm mt-1 error-message hidden" data-for="montant"></p>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-600 mb-1">Motif</label>
          <textarea name="raison" rows="3"
                    class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-200 focus:border-rose-300"
                    placeholder="Décrivez l'utilisation prévue..."></textarea>
          <p class="text-rose-500 text-sm mt-1 error-message hidden" data-for="raison"></p>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-600 mb-1">Articles sélectionnés</label>
          <div id="selected-articles-list" class="space-y-2 mb-4 max-h-40 overflow-y-auto"></div>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-600 mb-1">Rechercher des articles</label>
          <input type="text" id="article-search" 
                 class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-200 focus:border-rose-300"
                 placeholder="Nom ou description de l'article...">
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-600 mb-1">Articles disponibles</label>
          <div id="articles-container" class="max-h-60 overflow-y-auto border border-slate-200 rounded-lg p-2">
            ${this._renderArticlesList(this.state.allArticles)}
          </div>
        </div>

        <div class="flex justify-end space-x-3 pt-2">
          <button type="button" id="btn-cancel" class="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600">
            Annuler
          </button>
          <button type="submit" class="px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 text-white">
            <i class="far fa-paper-plane mr-2"></i> Envoyer
          </button>
        </div>
      `;

      const modal = new Modal('Nouvelle demande avec articles', form);
      modal.open();

      // Configuration de la recherche
      const searchInput = form.querySelector('#article-search');
      const articlesContainer = form.querySelector('#articles-container');
      
      searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredArticles = this.state.allArticles.filter(article => 
          article.libelle.toLowerCase().includes(searchTerm) || 
          (article.description && article.description.toLowerCase().includes(searchTerm))
        );
        articlesContainer.innerHTML = this._renderArticlesList(filteredArticles);
        this._setupArticleCheckboxes(form);
      });

      this._setupArticleCheckboxes(form);

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        const rules = {
          montant: ['required', 'number', 'min:1'],
          raison: ['required']
        };

        const errors = validate(data, rules);

        document.querySelectorAll('.error-message').forEach(el => {
          el.classList.add('hidden');
        });

        let hasErrors = false;
        for (const field in errors) {
          const errorElement = form.querySelector(`.error-message[data-for="${field}"]`);
          if (errorElement) {
            errorElement.textContent = errors[field];
            errorElement.classList.remove('hidden');
            hasErrors = true;
          }
        }

        if (hasErrors) return;

        const selectedArticles = [];
        const checkboxes = form.querySelectorAll('.article-checkbox:checked');
        
        checkboxes.forEach(checkbox => {
          selectedArticles.push({
            id: checkbox.value,
            libelle: checkbox.dataset.name,
            prix: checkbox.dataset.price
          });
        });

        try {
          await this.detteSvc.createDemande({
            clientId: this.state.user.id,
            montant: data.montant,
            raison: data.raison,
            articles: selectedArticles
          });
          
          Toast.show('Demande créée avec succès!', 'success');
          modal.close();
          await this.render();
        } catch (error) {
          Toast.show(`Erreur: ${error.message}`, 'error');
        }
      });

      form.querySelector('#btn-cancel').addEventListener('click', () => modal.close());

    } catch (error) {
      console.error("Error loading articles:", error);
      Toast.show("Erreur lors du chargement des articles", "error");
    }
  }

  _renderArticlesList(articles) {
    if (articles.length === 0) {
      return `<div class="text-center py-4 text-slate-400">Aucun article trouvé</div>`;
    }

    return articles.map(article => `
      <div class="flex items-start p-2 hover:bg-slate-50 rounded group">
        <input type="checkbox" id="article-${article.id}" value="${article.id}" 
               data-price="${article.prix}" data-name="${article.libelle}"
               class="article-checkbox mr-2 mt-1">
        <label for="article-${article.id}" class="flex-1 cursor-pointer">
          <div class="font-medium text-slate-700 group-hover:text-rose-600">${article.libelle}</div>
          ${article.description ? `<div class="text-sm text-slate-500 truncate">${article.description}</div>` : ''}
          <div class="text-sm font-semibold text-rose-600">${article.prix} €</div>
        </label>
      </div>
    `).join('');
  }

  _setupArticleCheckboxes(form) {
    const checkboxes = form.querySelectorAll('.article-checkbox');
    const montantInput = form.querySelector('input[name="montant"]');
    const selectedArticlesList = form.querySelector('#selected-articles-list');

    const updateSelection = () => {
      let total = 0;
      selectedArticlesList.innerHTML = '';
      
      checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
          const articleId = checkbox.value;
          const articleName = checkbox.dataset.name;
          const articlePrice = parseFloat(checkbox.dataset.price);
          
          total += articlePrice;
          
          selectedArticlesList.innerHTML += `
            <div class="flex items-center justify-between bg-slate-50 p-2 rounded">
              <span class="truncate">${articleName}</span>
              <span class="font-medium">${articlePrice} €</span>
            </div>
          `;
        }
      });
      
      montantInput.value = total > 0 ? total.toFixed(2) : '';
    };

    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', updateSelection);
    });
  }

  _getStatusBgColor(status) {
    const colors = {
      pending: 'bg-amber-50',
      approved: 'bg-emerald-50',
      rejected: 'bg-rose-50',
      active: 'bg-blue-50'
    };
    return colors[status] || 'bg-slate-50';
  }

  _getStatusBadge(status) {
    const statusMap = {
      pending: { text: 'En attente', color: 'bg-amber-100 text-amber-800' },
      approved: { text: 'Validée', color: 'bg-emerald-100 text-emerald-800' },
      rejected: { text: 'Rejetée', color: 'bg-rose-100 text-rose-800' },
      active: { text: 'Active', color: 'bg-blue-100 text-blue-800' }
    };

    const statusInfo = statusMap[status] || { text: status, color: 'bg-slate-100 text-slate-800' };
    return `<span class="text-xs px-2.5 py-1 rounded-full ${statusInfo.color}">${statusInfo.text}</span>`;
  }

  _isOverdue(date) {
    if (!date) return false;
    return new Date(date) < new Date();
  }

  _calculateTotalDettes() {
    if (!this.state.dettes) return '0.00';
    return this.state.dettes
      .filter(d => d.statut === 'active')
      .reduce((total, d) => total + parseFloat(d.montant || 0), 0)
      .toFixed(2);
  }

  setUpEventListeners() {
    this.root.querySelector('#btn-logout')?.addEventListener('click', async () => {
      this.authSvc.logout();
      Toast.show('Déconnexion réussie', 'success');
      setTimeout(() => {
        window.location.hash = "#auth/login";
      }, 3000);
    });

    this.root.querySelector('#btn-request-debt')?.addEventListener('click', () => {
      this._renderDebtRequestModal();
    });

    this.root.querySelector('#btn-articles')?.addEventListener('click', () => {
      window.location.hash = "#client/articles";
    });
  }
}
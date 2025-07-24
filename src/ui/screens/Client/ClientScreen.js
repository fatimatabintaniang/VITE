import { AuthService } from "../../../services/authService.js";
import { DetteService } from "../../../services/detteService.js";
import { Modal } from "../../components/Modal.js";
import { validate } from "../../../utils/validation.js";

export default class ClientScreen {
  constructor(root) {
    this.root = root;
    this.authSvc = new AuthService();
    this.detteSvc = new DetteService();
    this.state = {
      user: null,
      dettes: [],
      demandes: []
    };
  }

  async render() {
  try {
    this.state.user = await this.authSvc.getCurrentUser();
    // console.log("User:", this.state.user); // Debug user
    
    // Debug each call separately
    const dettes = await this.detteSvc.getByClientId(this.state.user.id);
    // console.log("Raw dettes from API:", dettes);
    
    const demandes = await this.detteSvc.getDemandesByClient(this.state.user.id);
    // console.log("Raw demandes from API:", demandes);
    
    this.state.dettes = dettes;
    this.state.demandes = demandes;
    
    // console.log("After setting state:", this.state.dettes, this.state.demandes);
  } catch (error) {
    console.error("Full error:", error);
    this.state.dettes = [];
    this.state.demandes = [];
  }

    this.root.innerHTML = `
      <div class="container mx-auto p-6 max-w-6xl">
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
                ${demande.articleLibelle ? `<p class="text-xs text-slate-400">Article: ${demande.articleLibelle}</p>` : ''}
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
    // console.log(this.state.dettes);
    return `
      <ul class="space-y-3 max-h-96 overflow-y-auto pr-2">
        ${this.state.dettes.map(dette => `
          <li class="p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-all">
            <div class="flex justify-between">
              <div>
                <p class="font-medium">${dette.montant} €</p>
                <p class="text-sm text-slate-500">${dette.raison || 'Sans motif'}</p>
                ${dette.articleLibelle ? `<p class="text-xs text-slate-400">Article: ${dette.articleLibelle}</p>` : ''}
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

  _renderDebtRequestModal() {
    const form = document.createElement('form');
    form.className = 'space-y-4';
    form.innerHTML = `
      <div>
        <label class="block text-sm font-medium text-slate-600 mb-1">Montant (€)</label>
        <input type="number" name="montant" min="1" step="0.01"
               class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-200 focus:border-rose-300">
        <p class="text-rose-500 text-sm mt-1 error-message hidden" data-for="montant"></p>
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-600 mb-1">Motif</label>
        <textarea name="raison" rows="3"
                  class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-200 focus:border-rose-300"
                  placeholder="Décrivez l'utilisation prévue..."></textarea>
        <p class="text-rose-500 text-sm mt-1 error-message hidden" data-for="raison"></p>
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

    const modal = new Modal('Nouvelle demande', form);
    modal.open();

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      // Validation
      const rules = {
        montant: ['required', 'number'],
        raison: ['required']
      };

      const errors = validate(data, rules);

      // Afficher les erreurs
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

      try {
        await this.detteSvc.createDemande({
          clientId: this.state.user.id,
          montant: data.montant,
          raison: data.raison
        });
        
        modal.close();
        await this.render();
      } catch (error) {
        alert(`Erreur: ${error.message}`);
      }
    });

    form.querySelector('#btn-cancel').addEventListener('click', () => modal.close());
  }

  setUpEventListeners() {
    this.root.querySelector('#btn-logout')?.addEventListener('click', async () => {
      await this.authSvc.logout();
      window.location.hash = "#auth/login";
    });

    this.root.querySelector('#btn-request-debt')?.addEventListener('click', () => {
      this._renderDebtRequestModal();
    });

    this.root.querySelector('#btn-articles')?.addEventListener('click', () => {
      window.location.hash = "#client/articles";
    });
  }
}
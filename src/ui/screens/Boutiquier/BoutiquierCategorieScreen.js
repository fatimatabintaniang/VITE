import { Modal } from "../../components/Modal.js";
import { confirm } from "../../components/Confirm.js";
import { Category } from "../../../domain/category/Category.js";
import { CategoryService } from "../../../domain/category/category.service.js";
import { CategoryRepository } from "../../../data/api/categoryRepository.js";

// Icônes (à remplacer par vos imports réels ou utiliser un système d'icônes)
const ICONS = {
  add: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" /></svg>`,
  edit: `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>`,
  delete: `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>`,
  restore: `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>`,
  spinner: `<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`
};

export default class CategoryScreen {
  constructor(root) {
    this.root = root;
    this.catSvc = new CategoryService(new CategoryRepository());
    this.state = { 
      page: 1, 
      perPage: 10, 
      total: 0, 
      view: "active", 
      list: [],
      loading: false
    };
  }

  /* ----------- Helpers ----------- */
  _exists(libelle, excludeId = null) {
    const norm = libelle.trim().toLowerCase();
    return this.state.list.some(
      (c) => c.id !== excludeId && c.libelle.trim().toLowerCase() === norm
    );
  }

  async _setLoading(loading) {
    this.state.loading = loading;
    this.root.querySelectorAll('button').forEach(btn => {
      btn.disabled = loading;
    });
    if (loading) {
      document.body.style.cursor = 'wait';
    } else {
      document.body.style.cursor = '';
    }
  }

  /* ----------- Render ----------- */
  async render() {
    this.root.innerHTML = `
      <div class="space-y-6 mt-24">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 class="text-2xl font-bold text-gray-800">Gestion des catégories</h1>
          
          <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button id="btn-add" class="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors duration-200
              ${this.state.view === "deleted" ? "opacity-50 cursor-not-allowed" : ""}"
              ${this.state.view === "deleted" ? "disabled" : ""}>
              ${ICONS.add}
              <span>Ajouter</span>
            </button>
            
            <div class="inline-flex rounded-md shadow-sm" role="group">
              <button data-v="active" type="button" class="tab px-4 py-2 text-sm font-medium rounded-l-lg border">
                Actifs
              </button>
              <button data-v="deleted" type="button" class="tab px-4 py-2 text-sm font-medium rounded-r-lg border">
                Corbeille
              </button>
            </div>
          </div>
        </div>

        <div class="bg-white shadow-sm rounded-lg overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Libellé</th>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody id="tbody" class="bg-white divide-y divide-gray-200">
                ${this.state.loading ? `
                <tr>
                  <td colspan="3" class="px-6 py-4 text-center">
                    <div class="flex justify-center items-center gap-2 text-gray-500">
                      ${ICONS.spinner}
                      <span>Chargement...</span>
                    </div>
                  </td>
                </tr>` : ''}
              </tbody>
            </table>
          </div>
        </div>

        <div id="paginator" class="flex justify-center items-center gap-1"></div>
      </div>
    `;

    if (!this.state.loading) {
      await this._load();
      this._rows();
      this._pager();
      this._tabs();
    }
    this.setUpEventListeners();
    return this;
  }

  setUpEventListeners() {
    const btn = this.root.querySelector("#btn-add");
    if (btn) btn.onclick = () => this._form();
  }

  /* ----------- Data ----------- */
  async _load() {
    await this._setLoading(true);
   try {
  const user = JSON.parse(localStorage.getItem("user"));
  const id_boutiquier = user?.id;
  // console.log(id_boutiquier);
  

  const { data, headers } = await this.catSvc.list(
    this.state.page,
    this.state.perPage,
    id_boutiquier // 👈 On filtre par boutiquier ici
  );

  this.state.list = data.filter(
    (c) => c.deleted === (this.state.view === "deleted")
  );

  this.state.total = +headers.get("X-Total-Count") || this.state.list.length;
} finally {
  await this._setLoading(false);
}

  }

  /* ----------- Tabs ----------- */
  _tabs() {
    const view = this.state.view;
    this.root.querySelectorAll("[data-v]").forEach((btn) => {
      const active = btn.dataset.v === view;
      btn.classList.toggle("bg-indigo-600", active);
      btn.classList.toggle("text-white", active);
      btn.classList.toggle("border-indigo-600", active);
      btn.classList.toggle("border-gray-300", !active);
      
      if (!active) {
        btn.onclick = async () => {
          this.state.view = btn.dataset.v;
          this.state.page = 1; // Reset to first page when changing view
          await this.render();
        };
      }
    });
  }

  /* ----------- Rows ----------- */
  _rows() {
    const tbody = this.root.querySelector("#tbody");
    if (this.state.loading) return;
    
    tbody.innerHTML = "";
    const start = (this.state.page - 1) * this.state.perPage;

    if (this.state.list.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="3" class="px-6 py-4 text-center text-gray-500">
            Aucune catégorie ${this.state.view === "deleted" ? "dans la corbeille" : "disponible"}
          </td>
        </tr>`;
      return;
    }

    this.state.list.forEach((c, idx) => {
      const tr = document.createElement("tr");
      tr.className = `hover:bg-gray-50 transition-colors duration-150 ${
        c.deleted ? "bg-gray-50 text-gray-400" : ""
      }`;
      tr.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium ${c.deleted ? 'text-gray-400' : 'text-gray-900'}">
          ${start + idx + 1}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm ${c.deleted ? 'text-gray-400' : 'text-gray-500'}">
          ${c.libelle} ${c.deleted ? '<span class="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-600">archivé</span>' : ''}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        </td>`;
      
      const actionsCell = tr.lastElementChild;

      if (!c.deleted) {
        actionsCell.innerHTML = `
          <div class="flex justify-end gap-2">
            <button class="edit-btn inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              ${ICONS.edit}
              <span class="ml-1">Modifier</span>
            </button>
            <button class="delete-btn inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              ${ICONS.delete}
              <span class="ml-1">Supprimer</span>
            </button>
          </div>`;
        
        actionsCell.querySelector('.edit-btn').onclick = () => this._form(c);
        actionsCell.querySelector('.delete-btn').onclick = async () => {
          if (await confirm("Êtes-vous sûr de vouloir archiver cette catégorie ?")) {
            await this._setLoading(true);
            try {
              await this.catSvc.trash(c.id);
              await this.render();
            } finally {
              await this._setLoading(false);
            }
          }
        };
      } else {
        actionsCell.innerHTML = `
          <button class="restore-btn inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            ${ICONS.restore}
            <span class="ml-1">Restaurer</span>
          </button>`;
        
        actionsCell.querySelector('.restore-btn').onclick = async () => {
          await this._setLoading(true);
          try {
            await this.catSvc.restore(c.id);
            await this.render();
          } finally {
            await this._setLoading(false);
          }
        };
      }

      tbody.append(tr);
    });
  }

  /* ----------- Pagination ----------- */
  _pager() {
    const n = Math.ceil(this.state.total / this.state.perPage);
    const pag = this.root.querySelector("#paginator");
    if (n <= 1) {
      pag.innerHTML = '';
      return;
    }

    pag.innerHTML = `
      <nav class="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
        ${this._pagerButton('Précédent', this.state.page > 1, () => {
          this.state.page = Math.max(1, this.state.page - 1);
          this.render();
        })}
        
        ${Array.from({ length: n }, (_, i) => i + 1).map(page => `
          <button data-page="${page}" class="relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
            page === this.state.page 
              ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' 
              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
          }">
            ${page}
          </button>
        `).join('')}
        
        ${this._pagerButton('Suivant', this.state.page < n, () => {
          this.state.page = Math.min(n, this.state.page + 1);
          this.render();
        })}
      </nav>`;

    pag.querySelectorAll('[data-page]').forEach(btn => {
      const page = parseInt(btn.dataset.page);
      btn.onclick = () => {
        this.state.page = page;
        this.render();
      };
    });
  }

  _pagerButton(text, enabled, onClick) {
    return `
      <button ${enabled ? '' : 'disabled'} 
        class="relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-l-md ${
          enabled 
            ? 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50' 
            : 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
        }"
        ${enabled ? `onclick="(${onClick.toString()})()"` : ''}>
        ${text}
      </button>`;
  }

  /* ----------- Form Modal ----------- */
  _form(cat = new Category({ libelle: "" })) {
    const f = document.createElement("form");
    f.className = "space-y-4";
    f.innerHTML = `
      <div>
        <label for="libelle" class="block text-sm font-medium text-gray-700">Libellé</label>
        <input 
          id="libelle" 
          name="libelle" 
          type="text" 
          class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
          placeholder="Nom de la catégorie" 
          value="${cat.libelle}"
          autofocus
        >
        <p data-error class="mt-2 text-sm text-red-600 hidden"></p>
      </div>

      <div class="flex justify-end space-x-3 pt-4">
        <button type="button" data-cancel class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Annuler
        </button>
        <button type="submit" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Enregistrer
        </button>
      </div>`;

    const dlg = new Modal(
      cat.id ? "Modifier la catégorie" : "Nouvelle catégorie",
      f
    );
    dlg.open();

    const errorEl = f.querySelector("[data-error]");
    const cancelBtn = f.querySelector("[data-cancel]");
    
    cancelBtn.onclick = () => dlg.close();

    f.onsubmit = async (e) => {
      e.preventDefault();
      const user = JSON.parse(localStorage.getItem("user"));
  const id_boutiquier = user?.id;
      cat.libelle = e.target.libelle.value.trim();
      cat.boutiquier_id = id_boutiquier;

      /* Validation */
      if (!cat.isValid()) {
        errorEl.textContent = "Le libellé doit contenir au moins 2 caractères";
        errorEl.classList.remove("hidden");
        return;
      }

      if (this._exists(cat.libelle, cat.id)) {
        errorEl.textContent = "Ce libellé existe déjà";
        errorEl.classList.remove("hidden");
        return;
      }

      errorEl.classList.add("hidden");

      try {
        await this._setLoading(true);
        if (cat.id) {
          await this.catSvc.update(cat);
        } else {
          const created = await this.catSvc.create(cat);
          cat.id = created.id;
        }
        dlg.close();
        await this.render();
      } catch (error) {
        errorEl.textContent = "Une erreur est survenue lors de l'enregistrement";
        errorEl.classList.remove("hidden");
      } finally {
        await this._setLoading(false);
      }
    };
  }
}
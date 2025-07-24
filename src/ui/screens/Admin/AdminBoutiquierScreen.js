import { boutiquierService } from "../../../services/boutiquierService";
import { Modal } from "../../components/Modal.js";
import { validate } from "../../../utils/validation.js";
import { confirmModal } from "../../components/confirmModal.js";


export default class AdminBoutiquierScreen {
  constructor(root) {
    this.root = root;
    this.boutiquierSvc = new boutiquierService();
    this.state = {
      imagePreview: null
    };
  }

  async render() {
    const boutiquiers = await this.boutiquierSvc.getAllBoutiquiers();
    this.state.boutiquiers = boutiquiers;

    this.root.innerHTML = `
      <div class="p-4 w-[80%] justify-center mx-auto mt-[20vh]">
        <div class="flex justify-between items-center mb-4">
          <h1 class="text-2xl font-bold">Liste des Boutiquiers</h1>
          <div class="flex gap-4">
            <button id="openModalBtn" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Ajouter un Boutiquier
            </button>
            <button id="viewDeletedBtn" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
              Voir les archivés
            </button>
          </div>
        </div>
        <table class="table table-zebra w-full">
          <thead class="bg-red-500 text-white">
            <tr>
              <th>Image</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Téléphone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${boutiquiers.map(b => `
              <tr>
                <td><img src="${b.user.image}" alt="image" class="w-10 h-10 rounded-full" /></td>
                <td>${b.user.nom}</td>
                <td>${b.user.prenom}</td>
                <td>${b.user.telephone}</td>
                <td class="space-x-2">
                  <button data-id="${b.id_utilisateur}" class="btn btn-xs btn-info detailBtn" title="Détail">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </button>
                  <button data-id="${b.id_utilisateur}" class="btn btn-xs btn-warning editBtn" title="Modifier">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5h2m2 0h2m-6 6h6m2 0v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6m2 0v-2m6 2v-2m-6 0V7" /></svg>
                  </button>
                  <button data-id="${b.id_utilisateur}" class="btn btn-xs btn-error deleteBtn" title="Supprimer">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    this.setUpEventListeners();

  }

  _renderAddBoutiquierForm() {
    const form = document.createElement("form");
    form.className = "space-y-6";
    form.innerHTML = `
      <div class="space-y-6 overflow-y-auto max-h-[60vh]">

      <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">image de profil</label>
          <div class="flex items-center space-x-4">
            <div id="image-preview" class="w-20 h-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
              ${this.state.imagePreview ? `<img src="${this.state.imagePreview}" class="w-full h-full object-cover">` : `
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              `}
            </div>
            <div class="flex-1">
              <input type="file" name="image" accept="image/*" class="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-medium
                file:bg-gray-50 file:text-gray-700
                hover:file:bg-gray-100">
              <p id="image-error" class="mt-1 text-sm text-red-600 hidden"></p>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input name="nom" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500">
            <p id="nom-error" class="mt-1 text-sm text-red-600 hidden"></p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
            <input name="prenom" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500">
            <p id="prenom-error" class="mt-1 text-sm text-red-600 hidden"></p>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input name="email" type="email" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500">
          <p id="email-error" class="mt-1 text-sm text-red-600 hidden"></p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
          <input name="password" type="password" minlength="6" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500">
          <p id="password-error" class="mt-1 text-sm text-red-600 hidden"></p>
        </div>
        </div>
        
         <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Telephone</label>
          <input name="telephone" type="text" minlength="6" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500">
          <p id="telephone-error" class="mt-1 text-sm text-red-600 hidden"></p>
        </div>
        
        
        <div class="pt-4">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Localisation de la boutique</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
              <input name="latitude" type="number" step="0.000001" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500">
              <p id="latitude-error" class="mt-1 text-sm text-red-600 hidden"></p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
              <input name="longitude" type="number" step="0.000001" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500">
              <p id="longitude-error" class="mt-1 text-sm text-red-600 hidden"></p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button type="button" id="btn-cancel" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
          Annuler
        </button>
        <button type="submit" class="px-4 py-2 text-sm font-medium text-white  bg-yellow-500 to-yellow-600 rounded-lg hover:from-yellow-600 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
          Enregistrer
        </button>
      </div>
      
      <p id="form-error" class="mt-4 text-sm text-red-600 text-center hidden"></p>
    `;

    const modal = new Modal("Ajouter un boutiquier", form);
    modal.open();

    // Gestion de la image
    const imageInput = form.querySelector('[name="image"]');
    const imagePreview = form.querySelector("#image-preview");

    imageInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          this.state.imagePreview = event.target.result;
          imagePreview.innerHTML = `<img src="${this.state.imagePreview}" class="w-full h-full object-cover">`;
        };
        reader.readAsDataURL(file);
      }
    });

    // Annulation
    form.querySelector("#btn-cancel").onclick = () => {
      modal.close();
      this.state.imagePreview = null;
    };

    // Soumission
    form.onsubmit = async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const fileInput = form.querySelector('[name="image"]').files[0];

      // ✅ Objet à plat pour validation
      const dataToValidate = {
        nom: formData.get("nom"),
        prenom: formData.get("prenom"),
        email: formData.get("email"),
        password: formData.get("password"),
        telephone: formData.get("telephone"),
        latitude: formData.get("latitude"),
        longitude: formData.get("longitude"),
      };

      const rules = {
        nom: ["required"],
        prenom: ["required"],
        email: ["required", "email"],
        password: ["required", "min:6"],
        telephone: ["required", "phone"],
        latitude: ["required", "number"],
        longitude: ["required", "number"],
      };

      const errors = validate(dataToValidate, rules);

      // Réinitialise erreurs
      form.querySelectorAll("p[id$='-error']").forEach(el => {
        el.textContent = "";
        el.classList.add("hidden");
      });

      if (Object.keys(errors).length > 0) {
        for (const key in errors) {
          const errorEl = form.querySelector(`#${key}-error`);
          if (errorEl) {
            errorEl.textContent = errors[key];
            errorEl.classList.remove("hidden");
          }
        }
        return;
      }

      // ✅ Construire boutiquier final après validation
      const boutiquier = {
        nom: dataToValidate.nom,
        prenom: dataToValidate.prenom,
        email: dataToValidate.email,
        password: dataToValidate.password,
        telephone: dataToValidate.telephone,
        localisation: {
          latitude: parseFloat(dataToValidate.latitude),
          longitude: parseFloat(dataToValidate.longitude),
        },
      };

      let imageUrl = null;
      if (fileInput) {
        imageUrl = await this.boutiquierSvc.uploadImage(fileInput);
      }
      boutiquier.image = imageUrl;

      try {
        await this.boutiquierSvc.create(boutiquier);
        modal.close();
        this.state.imagePreview = null;
        this.render();
      } catch (error) {
        const errorEl = form.querySelector("#form-error");
        errorEl.textContent = error.message || "Erreur lors de la création";
        errorEl.classList.remove("hidden");
      }
    };

  }


  async _renderEditBoutiquierForm(boutiquier) {
    const form = document.createElement("form");
    form.className = "space-y-6";
    form.innerHTML = `
      <div class="space-y-6 overflow-y-auto max-h-[60vh]">

       
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">image de profil</label>
          <div class="flex items-center space-x-4">
            <div id="photo-preview" class="w-20 h-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
              ${boutiquier.image ? `<img src="${boutiquier.image}" class="w-full h-full object-cover">` : `
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              `}
            </div>
            <div class="flex-1">
              <input type="file" name="image" accept="image/*" class="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-medium
                file:bg-gray-50 file:text-gray-700
                hover:file:bg-gray-100">
              <p id="image-error" class="mt-1 text-sm text-red-600 hidden"></p>
            </div>
          </div>
        </div>


        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input name="nom" value="${boutiquier.nom || ''}" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500">
            <p id="nom-error" class="mt-1 text-sm text-red-600 hidden"></p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
            <input name="prenom" value="${boutiquier.prenom || ''}" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500">
            <p id="prenom-error" class="mt-1 text-sm text-red-600 hidden"></p>
          </div>
        </div>
        
         <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input name="email" type="email" value="${boutiquier.email || ''}" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500">
          <p id="email-error" class="mt-1 text-sm text-red-600 hidden"></p>
        </div>
        
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Nouveau mot de passe (laisser vide pour ne pas changer)</label>
          <input name="password" type="password" minlength="6" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500">
          <p id="password-error" class="mt-1 text-sm text-red-600 hidden"></p>
        </div>
       </div>

       <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Telephone</label>
          <input name="telephone" type="text" value="${boutiquier.telephone || ''}" minlength="6" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500">
          <p id="telephone-error" class="mt-1 text-sm text-red-600 hidden"></p>
        </div>
        
        <div class="pt-4">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Localisation de la boutique</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
              <input name="latitude" type="number" step="0.000001" value="${boutiquier.localisation?.latitude || ''}" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500">
              <p id="latitude-error" class="mt-1 text-sm text-red-600 hidden"></p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
              <input name="longitude" type="number" step="0.000001" value="${boutiquier.localisation?.longitude || ''}" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500">
              <p id="longitude-error" class="mt-1 text-sm text-red-600 hidden"></p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button type="button" id="btn-cancel" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
          Annuler
        </button>
        <button type="submit" class="px-4 py-2 text-sm font-medium text-white   bg-yellow-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
          Enregistrer
        </button>
      </div>
      
      <p id="form-error" class="mt-4 text-sm text-red-600 text-center hidden"></p>
    `;

    const modal = new Modal(`Modifier ${boutiquier.nom} ${boutiquier.prenom}`, form);
    modal.open();

    // Gestion de la image
    const imageInput = form.querySelector('[name="image"]');
    const imagePreview = form.querySelector("#image-preview");

    imageInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          this.state.imagePreview = event.target.result;
          imagePreview.innerHTML = `<img src="${this.state.imagePreview}" class="w-full h-full object-cover">`;
        };
        reader.readAsDataURL(file);
      }
    });

    // Annulation
    form.querySelector("#btn-cancel").onclick = () => {
      modal.close();
      this.state.imagePreview = null;
    };

    // Soumission
    form.onsubmit = async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const fileInput = form.querySelector('[name="image"]').files[0];

      // Construction de l'objet à mettre à jour
      const updatedData = {
        nom: formData.get("nom") || boutiquier.nom, // Fallback sur la valeur existante
        prenom: formData.get("prenom") || boutiquier.prenom,
        email: formData.get("email") || boutiquier.email,
        telephone: formData.get("telephone") || boutiquier.telephone,
        localisation: {
          latitude: parseFloat(formData.get("latitude")) || boutiquier.localisation.latitude,
          longitude: parseFloat(formData.get("longitude")) || boutiquier.localisation.longitude
        }
      };

      // Ajout conditionnel des champs
      if (formData.get("password")) {
        updatedData.password = formData.get("password");
      }

      try {
        if (fileInput) {
          updatedData.image = await this.boutiquierSvc.uploadImage(fileInput);
        } else {
          updatedData.image = boutiquier.image; // Conserve l'image existante si aucune nouvelle n'est fournie
        }

        console.log("Données envoyées:", updatedData); // Debug
        await this.boutiquierSvc.update(boutiquier.id, updatedData);

        modal.close();
        this.state.imagePreview = null;
        this.render();
      } catch (error) {
        console.error("Erreur complète:", error);
        const errorEl = form.querySelector("#form-error");
        errorEl.textContent = error.message || "Erreur lors de la modification";
        errorEl.classList.remove("hidden");
      }
    };
  }

   async renderDeletedBoutiquiers() {
    const deletedBoutiquiers = await this.boutiquierSvc.getDeletedBoutiquiers();
    
    this.root.innerHTML = `
      <div class="p-4 w-[80%] justify-center mx-auto mt-[20vh]">
        <div class="flex justify-between items-center mb-4">
          <h1 class="text-2xl font-bold">Boutiquiers Archivés</h1>
          <button id="backToListBtn" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Retour à la liste
          </button>
        </div>
        <table class="table table-zebra w-full">
          <thead class="bg-gray-500 text-white">
            <tr>
              <th>Image</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Téléphone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${deletedBoutiquiers.map(b => `
              <tr>
                <td><img src="${b.user.image}" alt="image" class="w-10 h-10 rounded-full" /></td>
                <td>${b.user.nom}</td>
                <td>${b.user.prenom}</td>
                <td>${b.user.telephone}</td>
                <td class="space-x-2">
                  <button data-id="${b.id_utilisateur}" class="btn btn-xs btn-success restoreBtn" title="Restaurer">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    // Bouton retour
    this.root.querySelector('#backToListBtn')?.addEventListener('click', () => {
      this.render();
    });

    // Boutons de restauration
    this.root.querySelectorAll('.restoreBtn').forEach(btn => {
      btn.addEventListener('click', async e => {
        const id = e.target.closest('button').dataset.id;
        const confirmed = await confirmModal(
          'Voulez-vous vraiment restaurer ce boutiquier ?',
          {
            title: 'Confirmer restauration',
            confirmText: 'Restaurer'
          }
        );
        
        if (confirmed) {
          try {
            await this.boutiquierSvc.restore(id);
            this.renderDeletedBoutiquiers();
          } catch (error) {
            alert('Erreur lors de la restauration');
            console.error(error);
          }
        }
      });
    });
  }

  setUpEventListeners() {
    // Bouton d'ouverture du modal
    this.root.querySelector('#openModalBtn')?.addEventListener('click', () => {
      this._renderAddBoutiquierForm();
    });

 // Bouton pour voir les archivés
    this.root.querySelector('#viewDeletedBtn')?.addEventListener('click', async () => {
      this.renderDeletedBoutiquiers();
    });


    // Boutons de détail
    this.root.querySelectorAll('.detailBtn').forEach(btn => {
      btn.addEventListener('click', e => {
        const id = e.target.closest('button').dataset.id;
        window.location.hash = `#admin-boutiquier-detail-${id}`;
      });
    });


    this.root.querySelectorAll('.editBtn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.closest('button').dataset.id;
        try {
          // Utilisez le service pour récupérer le boutiquier
          const boutiquier = await this.boutiquierSvc.getBoutiquierById(id);
          if (boutiquier) {
            this._renderEditBoutiquierForm(boutiquier);
          }
        } catch (error) {
          console.error("Erreur lors du chargement du boutiquier:", error);
          alert("Impossible de charger les données du boutiquier");
        }
      });
    });

    // Boutons de suppression
    // Boutons de suppression modifiés
    this.root.querySelectorAll('.deleteBtn').forEach(btn => {
      btn.addEventListener('click', async e => {
        const id = e.target.closest('button').dataset.id;
        const confirmed = await confirmModal(
          'Voulez-vous vraiment archiver ce boutiquier ?', 
          {
            title: 'Confirmer archivage',
            confirmText: 'Archiver'
          }
        );
        
        if (confirmed) {
          try {
            await this.boutiquierSvc.deleteBoutiquier(id);
            this.render();
          } catch (error) {
            alert('Erreur lors de l\'archivage');
            console.error(error);
          }
        }
      });
    });
  }
}
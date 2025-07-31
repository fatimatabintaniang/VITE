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
      <div class="p-6 max-w-7xl mx-auto mt-[20vh]">
        <div class="flex flex-col space-y-6">
          <!-- Header Section -->
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 class="text-3xl font-bold text-gray-800">Gestion des Boutiquiers</h1>
              <p class="text-gray-500 mt-1">Liste complète des boutiquiers enregistrés</p>
            </div>
            <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <button id="openModalBtn" class="px-6 py-3  bg-blue-500  hover:bg-blue-400  text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
                </svg>
                Ajouter un Boutiquier
              </button>
              <button id="viewDeletedBtn" class="px-6 py-3  bg-gray-500  hover:bg-gray-400  text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
                </svg>
                Voir les archivés
              </button>
            </div>
          </div>

          <!-- Table Section -->
          <div class="bg-white rounded-xl shadow-md overflow-hidden">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gradient-to-r from-red-500 to-red-600">
                  <tr>
                    <th scope="col" class="px-6 py-4 text-center text-xs font-medium text-black uppercase tracking-wider">Image</th>
                    <th scope="col" class="px-6 py-4 text-center text-xs font-medium text-black uppercase tracking-wider">Nom</th>
                    <th scope="col" class="px-6 py-4 text-center text-xs font-medium text-black uppercase tracking-wider">Prénom</th>
                    <th scope="col" class="px-6 py-4 text-center text-xs font-medium text-black uppercase tracking-wider">Téléphone</th>
                    <th scope="col" class="px-6 py-4 text-center text-xs font-medium text-black uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200 text-center">
                  ${boutiquiers.length > 0 ? 
                    boutiquiers.map(b => `
                      <tr class="hover:bg-gray-50 transition-colors duration-150">
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="flex items-center justify-center">
                            <div class="flex-shrink-0 h-10 w-10">
                              <img class="h-10 w-10 rounded-full object-cover" src="${b.user.image}" alt="Profil">
                            </div>
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${b.user.nom}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${b.user.prenom}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${b.user.telephone}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                          <button data-id="${b.id_utilisateur}" class="detailBtn text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors duration-200">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button data-id="${b.id_utilisateur}" class="editBtn text-yellow-600 hover:text-yellow-900 bg-yellow-50 hover:bg-yellow-100 px-3 py-1 rounded-md transition-colors duration-200">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button data-id="${b.id_utilisateur}" class="deleteBtn text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors duration-200">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    `).join('')
                    : 
                    `<tr>
                      <td colspan="5" class="px-6 py-12 text-center">
                        <div class="flex flex-col items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <h3 class="mt-4 text-lg font-medium text-gray-900">Aucun boutiquier trouvé</h3>
                          <p class="mt-1 text-sm text-gray-500">Commencez par ajouter un nouveau boutiquier</p>
                          <button id="openModalBtn" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200">
                            Ajouter un boutiquier
                          </button>
                        </div>
                      </td>
                    </tr>`
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;

    this.setUpEventListeners();
  }

  _renderAddBoutiquierForm() {
    const form = document.createElement("form");
    form.className = "space-y-6";
    form.innerHTML = `
      <div class="space-y-6 overflow-y-auto max-h-[60vh] px-1">
        <!-- Image Upload -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Image de profil</label>
          <div class="flex items-center space-x-6">
            <div id="image-preview" class="flex-shrink-0 h-24 w-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
              ${this.state.imagePreview ? `<img src="${this.state.imagePreview}" class="w-full h-full object-cover">` : `
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              `}
            </div>
            <div class="flex-1">
              <div class="flex items-center justify-center w-full">
                <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                  <div class="flex flex-col items-center justify-center pt-5 pb-6 px-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="mb-3 w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p class="mb-2 text-sm text-gray-500 text-center"><span class="font-semibold">Cliquez pour uploader</span> ou glissez-déposez</p>
                    <p class="text-xs text-gray-500">PNG, JPG (MAX. 5MB)</p>
                  </div>
                  <input id="dropzone-file" type="file" name="image" accept="image/*" class="hidden" />
                </label>
              </div>
              <p id="image-error" class="mt-2 text-sm text-red-600 hidden"></p>
            </div>
          </div>
        </div>

        <!-- Name Fields -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input name="nom" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200">
            <p id="nom-error" class="mt-1 text-sm text-red-600 hidden"></p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
            <input name="prenom" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200">
            <p id="prenom-error" class="mt-1 text-sm text-red-600 hidden"></p>
          </div>
        </div>
        
        <!-- Email and Password -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input name="email" type="email" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200">
            <p id="email-error" class="mt-1 text-sm text-red-600 hidden"></p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input name="password" type="password" minlength="6" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200">
            <p id="password-error" class="mt-1 text-sm text-red-600 hidden"></p>
          </div>
        </div>
        
        <!-- Phone -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
          <input name="telephone" type="text" minlength="6" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200">
          <p id="telephone-error" class="mt-1 text-sm text-red-600 hidden"></p>
        </div>
        
        <!-- Location Section -->
        <div class="pt-4">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Localisation de la boutique</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
              <input name="latitude" type="number" step="0.000001" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200">
              <p id="latitude-error" class="mt-1 text-sm text-red-600 hidden"></p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
              <input name="longitude" type="number" step="0.000001" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200">
              <p id="longitude-error" class="mt-1 text-sm text-red-600 hidden"></p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Form Footer -->
      <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button type="button" id="btn-cancel" class="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors duration-200">
          Annuler
        </button>
        <button type="submit" class="px-6 py-2 text-sm font-medium text-white  bg-yellow-600  rounded-lg hover:bg-yellow-500  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 shadow-md transition-all duration-200">
          Enregistrer
        </button>
      </div>
      
      <p id="form-error" class="mt-4 text-sm text-red-600 text-center hidden"></p>
    `;

    const modal = new Modal("Ajouter un boutiquier", form);
    modal.open();

    // Gestion de l'image
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

      // Validation
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

      // Construction du boutiquier
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
      <div class="space-y-6 overflow-y-auto max-h-[60vh] px-1">
        <!-- Image Upload -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Image de profil</label>
          <div class="flex items-center space-x-6">
            <div id="photo-preview" class="flex-shrink-0 h-24 w-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
              ${boutiquier.image ? `<img src="${boutiquier.image}" class="w-full h-full object-cover">` : `
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              `}
            </div>
            <div class="flex-1">
              <div class="flex items-center justify-center w-full">
                <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                  <div class="flex flex-col items-center justify-center pt-5 pb-6 px-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="mb-3 w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p class="mb-2 text-sm text-gray-500 text-center"><span class="font-semibold">Cliquez pour uploader</span> ou glissez-déposez</p>
                    <p class="text-xs text-gray-500">PNG, JPG (MAX. 5MB)</p>
                  </div>
                  <input id="dropzone-file" type="file" name="image" accept="image/*" class="hidden" />
                </label>
              </div>
              <p id="image-error" class="mt-2 text-sm text-red-600 hidden"></p>
            </div>
          </div>
        </div>

        <!-- Name Fields -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input name="nom" value="${boutiquier.nom || ''}" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200">
            <p id="nom-error" class="mt-1 text-sm text-red-600 hidden"></p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
            <input name="prenom" value="${boutiquier.prenom || ''}" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200">
            <p id="prenom-error" class="mt-1 text-sm text-red-600 hidden"></p>
          </div>
        </div>
        
        <!-- Email and Password -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input name="email" type="email" value="${boutiquier.email || ''}" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200">
            <p id="email-error" class="mt-1 text-sm text-red-600 hidden"></p>
          </div>
          
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Nouveau mot de passe (laisser vide pour ne pas changer)</label>
            <input name="password" type="password" minlength="6" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200">
            <p id="password-error" class="mt-1 text-sm text-red-600 hidden"></p>
          </div>
        </div>

        <!-- Phone -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
          <input name="telephone" type="text" value="${boutiquier.telephone || ''}" minlength="6" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200">
          <p id="telephone-error" class="mt-1 text-sm text-red-600 hidden"></p>
        </div>
        
        <!-- Location Section -->
        <div class="pt-4">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Localisation de la boutique</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
              <input name="latitude" type="number" step="0.000001" value="${boutiquier.localisation?.latitude || ''}" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200">
              <p id="latitude-error" class="mt-1 text-sm text-red-600 hidden"></p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
              <input name="longitude" type="number" step="0.000001" value="${boutiquier.localisation?.longitude || ''}" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200">
              <p id="longitude-error" class="mt-1 text-sm text-red-600 hidden"></p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Form Footer -->
      <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button type="button" id="btn-cancel" class="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors duration-200">
          Annuler
        </button>
        <button type="submit" class="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg hover:from-yellow-600 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 shadow-md transition-all duration-200">
          Enregistrer
        </button>
      </div>
      
      <p id="form-error" class="mt-4 text-sm text-red-600 text-center hidden"></p>
    `;

    const modal = new Modal(`Modifier ${boutiquier.nom} ${boutiquier.prenom}`, form);
    modal.open();

    // Gestion de l'image
    const imageInput = form.querySelector('[name="image"]');
    const imagePreview = form.querySelector("#photo-preview");

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
        nom: formData.get("nom") || boutiquier.nom,
        prenom: formData.get("prenom") || boutiquier.prenom,
        email: formData.get("email") || boutiquier.email,
        telephone: formData.get("telephone") || boutiquier.telephone,
        localisation: {
          latitude: parseFloat(formData.get("latitude")) || boutiquier.localisation.latitude,
          longitude: parseFloat(formData.get("longitude")) || boutiquier.localisation.longitude
        }
      };

      // Validation
      const dataToValidate = {
        nom: updatedData.nom,
        prenom: updatedData.prenom,
        email: updatedData.email,
        password: formData.get("password"),
        telephone: updatedData.telephone,
        latitude: updatedData.localisation.latitude,
        longitude: updatedData.localisation.longitude,
      };



      try {
        if (fileInput) {
          updatedData.image = await this.boutiquierSvc.uploadImage(fileInput);
        } else {
          updatedData.image = boutiquier.image;
        }

        await this.boutiquierSvc.update(boutiquier.id, updatedData);

        modal.close();
        this.state.imagePreview = null;
        this.render();
      } catch (error) {
        const errorEl = form.querySelector("#form-error");
        errorEl.textContent = error.message || "Erreur lors de la modification";
        errorEl.classList.remove("hidden");
      }
    };
  }

  async renderDeletedBoutiquiers() {
    const deletedBoutiquiers = await this.boutiquierSvc.getDeletedBoutiquiers();
    
    this.root.innerHTML = `
      <div class="p-6 max-w-7xl mx-auto mt-[20vh]">
        <div class="flex flex-col space-y-6">
          <!-- Header Section -->
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 class="text-3xl font-bold text-gray-800">Boutiquiers Archivés</h1>
              <p class="text-gray-500 mt-1">Liste des boutiquiers qui ont été archivés</p>
            </div>
            <button id="backToListBtn" class="px-6 py-3  bg-blue-500  hover:bg-blue-400  text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
              </svg>
              Retour à la liste
            </button>
          </div>

          <!-- Table Section -->
          <div class="bg-white rounded-xl shadow-md overflow-hidden">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class=" bg-gray-500 to-gray-600">
                  <tr>
                    <th scope="col" class="px-6 py-4 text-center text-xs font-medium text-white uppercase tracking-wider">Image</th>
                    <th scope="col" class="px-6 py-4 text-center text-xs font-medium text-white uppercase tracking-wider">Nom</th>
                    <th scope="col" class="px-6 py-4 text-center text-xs font-medium text-white uppercase tracking-wider">Prénom</th>
                    <th scope="col" class="px-6 py-4 text-center text-xs font-medium text-white uppercase tracking-wider">Téléphone</th>
                    <th scope="col" class="px-6 py-4 text-center text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  ${deletedBoutiquiers.length > 0 ? 
                    deletedBoutiquiers.map(b => `
                      <tr class="hover:bg-gray-50 transition-colors duration-150">
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="flex items-center">
                            <div class="flex-shrink-0 h-10 w-10">
                              <img class="h-10 w-10 rounded-full object-cover" src="${b.user.image}" alt="Profil">
                            </div>
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${b.user.nom}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${b.user.prenom}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${b.user.telephone}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button data-id="${b.id_utilisateur}" class="restoreBtn text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-md transition-colors duration-200">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Restaurer
                          </button>
                        </td>
                      </tr>
                    `).join('')
                    : 
                    `<tr>
                      <td colspan="5" class="px-6 py-12 text-center">
                        <div class="flex flex-col items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <h3 class="mt-4 text-lg font-medium text-gray-900">Aucun élément archivé</h3>
                          <p class="mt-1 text-sm text-gray-500">Aucun boutiquier n'a été archivé pour le moment</p>
                        </div>
                      </td>
                    </tr>`
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
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

    // Boutons d'édition
    this.root.querySelectorAll('.editBtn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.closest('button').dataset.id;
        try {
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
import { boutiquierService } from "../../../services/boutiquierService.js";

export default class AdminBoutiquierDetailScreen {
  constructor(root, boutiquierId) {
    this.root = root;
    this.boutiquierId = boutiquierId;
    this.boutiquierSvc = new boutiquierService();
  }

  async render() {
    const boutiquiers = await this.boutiquierSvc.getAllBoutiquiers();
    const b = boutiquiers.find(b => b.id_utilisateur == this.boutiquierId);

    if (!b) {
      this.root.innerHTML = `
        <div class="flex items-center justify-center h-screen">
          <div class="alert alert-error shadow-lg max-w-md">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Boutiquier non trouvé</span>
            </div>
          </div>
        </div>
      `;
      return;
    }

    const { longitude = '', latitude = '' } = b.localisation || {};

    this.root.innerHTML = `
      <div class="min-h-screen bg-gray-50 p-6 mt-[10vh]" >
        <div class="max-w-4xl mx-auto">
          <!-- Bouton retour -->
          <button id="backBtn" class="btn btn-ghost mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
            </svg>
            Retour à la liste
          </button>

          <!-- Carte principale -->
          <div class="bg-white shadow-md rounded-lg overflow-hidden">
            <!-- En-tête -->
            <div class="bg-primary text-primary-content p-6">
              <div class="flex items-center space-x-4">
                <div class="avatar">
                  <div class="w-16 rounded-full">
                    <img src="${b.user.image || 'https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg'}" alt="${b.user.nom}" />
                  </div>
                </div>
                <div>
                  <h1 class="text-2xl font-bold">${b.user.prenom} ${b.user.nom}</h1>
                  <p class="opacity-80">${b.user.telephone}</p>
                </div>
              </div>
            </div>

            <!-- Contenu -->
            <div class="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- Section informations -->
              <div>
                <h2 class="text-xl font-semibold mb-4 text-gray-700">Informations du boutiquier</h2>
                <div class="space-y-3">
                  <div class="flex justify-between border-b pb-2">
                    <span class="text-gray-500">Nom complet</span>
                    <span class="font-medium">${b.user.prenom} ${b.user.nom}</span>
                  </div>
                  <div class="flex justify-between border-b pb-2">
                    <span class="text-gray-500">Téléphone</span>
                    <span class="font-medium">${b.user.telephone}</span>
                  </div>
                  <div class="flex justify-between border-b pb-2">
                    <span class="text-gray-500">Statut</span>
                    <span class="badge badge-success">Actif</span>
                  </div>
                </div>
              </div>

              <!-- Section localisation -->
              <div>
                <h2 class="text-xl font-semibold mb-4 text-gray-700">Localisation</h2>
                <form id="localisationForm" class="space-y-4">
                  <div class="form-control">
                    <label class="label">
                      <span class="label-text">Longitude</span>
                    </label>
                    <input type="text" id="longitude" value="${longitude}" 
                           class="input input-bordered w-full" placeholder="Ex: -1.6784" />
                  </div>
                  <div class="form-control">
                    <label class="label">
                      <span class="label-text">Latitude</span>
                    </label>
                    <input type="text" id="latitude" value="${latitude}" 
                           class="input input-bordered w-full" placeholder="Ex: 48.1123" />
                  </div>
                  <div class="flex flex-wrap gap-2 pt-2">
                    <button type="submit" class="btn btn-primary flex-1">
                      Enregistrer la localisation
                    </button>
                    <button type="button" id="autoLocateBtn" class="btn btn-secondary">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                      </svg>
                      Localisation auto
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <!-- Carte géographique -->
            <div class="px-6 pb-6">
              <h2 class="text-xl font-semibold mb-4 text-gray-700">Position sur la carte</h2>
              <div class="rounded-lg overflow-hidden border border-gray-200 h-64 bg-gray-100 flex items-center justify-center">
                ${longitude && latitude ? `
                  <iframe
                    width="100%" height="100%" frameborder="0" style="border:0"
                    src="https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed&key=YOUR_API_KEY"
                    allowfullscreen>
                  </iframe>
                ` : `
                  <div class="text-center p-6">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p class="mt-2 text-gray-500">Aucune localisation définie</p>
                    <p class="text-sm text-gray-400">Utilisez le formulaire ci-dessus pour ajouter une position</p>
                  </div>
                `}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.setUpEventListeners(b.id);
  }

  setUpEventListeners(id) {
    // Vos écouteurs d'événements existants conservés sans modification
    this.root.querySelector("#backBtn").addEventListener("click", () => {
      window.location.hash = "#admin-boutiquier";
    });

    this.root.querySelector("#localisationForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const longitude = this.root.querySelector("#longitude").value.trim();
      const latitude = this.root.querySelector("#latitude").value.trim();

      await this.boutiquierSvc.updateBoutiquier(id, {
        localisation: { longitude, latitude }
      });

      alert("Localisation mise à jour !");
      this.render();
    });

    this.root.querySelector("#autoLocateBtn").addEventListener("click", () => {
      if (!navigator.geolocation) {
        alert("Géolocalisation non supportée par ce navigateur.");
        return;
      }

      navigator.geolocation.getCurrentPosition(position => {
        this.root.querySelector("#latitude").value = position.coords.latitude;
        this.root.querySelector("#longitude").value = position.coords.longitude;
      }, () => {
        alert("Impossible d'obtenir la position.");
      });
    });
  }
}
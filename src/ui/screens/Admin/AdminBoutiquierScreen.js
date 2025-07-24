import { boutiquierService } from "../../../services/boutiquierService";

export default class AdminBoutiquierScreen {
  constructor(root) {
    this.root = root;
    this.boutiquierSvc = new boutiquierService();
    
  }

async render() {
    const boutiquiers = await this.boutiquierSvc.getAllBoutiquiers();
console.log(boutiquiers);

    this.root.innerHTML = `
      <div class="p-4  w-[80%] justify-center mx-auto mt-[20vh]">
        <div class="flex justify-between items-center mb-4">
          <h1 class="text-2xl font-bold">Liste des Boutiquiers</h1>
          <a href="/boutiquier/new" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Ajouter un Boutiquier
          </a>
        </div>
        <table class="table table-zebra  bg-gray-400">
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

  setUpEventListeners() {
    this.root.querySelector("#backBtn")?.addEventListener("click", () => {
      window.location.hash = "#admin-boutiquier";
    });

    this.root.querySelectorAll(".detailBtn").forEach(btn => {
      btn.addEventListener("click", e => {
        const id = e.target.closest("button").dataset.id;
        window.location.hash = `#admin-boutiquier-detail-${id}`;
      });
    });

    this.root.querySelectorAll(".editBtn").forEach(btn => {
      btn.addEventListener("click", e => {
        const id = e.target.closest("button").dataset.id;
        alert(`Modifier boutiquier id: ${id} - formulaire à implémenter`);
      });
    });

    this.root.querySelectorAll(".deleteBtn").forEach(btn => {
      btn.addEventListener("click", async e => {
        const id = e.target.closest("button").dataset.id;
        if (confirm("Supprimer ce boutiquier ?")) {
          await this.boutiquierSvc.deleteBoutiquier(id);
          this.render();
        }
      });
    });
  }
}

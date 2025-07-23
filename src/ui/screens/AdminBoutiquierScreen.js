import { boutiquierService } from "../../services/boutiquierService.js";

export default class AdminBoutiquierScreen {
    constructor(root) {
        this.root = root;
        this.boutiquierSvc = new boutiquierService();
    }

    async render() {
        const boutiquiers = await this.boutiquierSvc.getAllBoutiquiers();

        this.root.innerHTML = `
      <div class="p-4">
        <h1 class="text-2xl font-bold mb-4">Gestion des Boutiquiers</h1>
        <button id="addBtn" class="bg-green-600 text-white px-4 py-2 rounded mb-4">Ajouter un boutiquier</button>
        <table class="min-w-full bg-white border">
          <thead>
            <tr>
            <th class="px-4 py-2 border">Image</th>
              <th class="px-4 py-2 border">Nom</th>
              <th class="px-4 py-2 border">Prénom</th>
              <th class="px-4 py-2 border">Téléphone</th>
              <th class="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${utilisateurs.map(u => `
              <tr>
                <td class="px-4 py-2 border">${u.image}</td>
                <td class="px-4 py-2 border">${u.nom}</td>
                <td class="px-4 py-2 border">${u.prenom}</td>
                <td class="px-4 py-2 border">${u.telephone}</td>
                <td class="px-4 py-2 border">
                  <button data-id="${u.id}" class="editBtn bg-blue-600 text-white px-2 py-1 rounded">Modifier</button>
                  <button data-id="${u.id}" class="deleteBtn bg-red-600 text-white px-2 py-1 rounded">Supprimer</button>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;

        this.setUpEventListeners();
    }

    setUpEventListeners() {
        // Bouton ajouter
        this.root.querySelector("#addBtn").addEventListener("click", () => {
            alert("Formulaire d'ajout à implémenter");
            // Ici tu pourras afficher un modal ou formulaire
        });

        // Boutons modifier
        this.root.querySelectorAll(".editBtn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = e.target.dataset.id;
                alert("Formulaire modification boutiquier id: " + id);
                // Appel modification à implémenter
            });
        });

        // Boutons supprimer
        this.root.querySelectorAll(".deleteBtn").forEach(btn => {
            btn.addEventListener("click", async (e) => {
                const id = e.target.dataset.id;
                if (confirm("Supprimer ce boutiquier ?")) {
                    await this.userSvc.deleteBoutiquier(id);
                    this.render(); // Refresh après suppression
                }
            });
        });
    }
}

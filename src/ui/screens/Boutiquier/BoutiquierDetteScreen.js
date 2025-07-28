import { DetteService } from "../../../services/detteService.js";
import { confirm } from "../../../ui/components/Confirm.js";

export default class BoutiquierDetteScreen {
  constructor(root, boutiquierId) {
    this.root = root;
    this.boutiquierId = boutiquierId;
    this.detteService = new DetteService();
  }

 async render() {
    const dettes = await this.detteService.getByBoutiquierId(this.boutiquierId);
    console.log("Demandes de dettes:", dettes);

    this.root.innerHTML = `
      <div class="max-w-6xl mx-auto px-4 mt-20 sm:px-6 lg:px-8 py-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Gestion des Demandes de Dettes</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${dettes.map(d => `
            <div class="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div class="p-6">
                <div class="flex items-center mb-4">
                  <div class="bg-${this.getStatusColor(d.statut)}-100 text-${this.getStatusColor(d.statut)}-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    ${d.statut === 'pending' ? 'En attente' : d.statut === 'approved' ? 'Approuvé' : 'Refusé'}
                  </div>
                  <span class="ml-auto text-lg font-bold text-gray-700">${d.montant} FCFA</span>
                </div>
                
                <div class="space-y-3">
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900">${d.client.utilisateur?.nom || "Inconnu"}</h3>
                    <p class="text-gray-500 flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      ${d.client?.telephone || "Non renseigné"}
                    </p>
                  </div>
                  
                  <p class="text-gray-700">
                    <span class="font-medium">Motif :</span> ${d.raison}
                  </p>
                  
                  ${d.statut === "pending" ? `
                    <div class="flex space-x-3 pt-2">
                      <button data-id="${d.id}" class="btn-approve flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Accepter
                      </button>
                      <button data-id="${d.id}" class="btn-refuse flex-1 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Refuser
                      </button>
                    </div>
                  ` : ""}
                </div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;

    this.root.querySelectorAll(".btn-approve").forEach(btn => {
      btn.addEventListener("click", () => this.handleApproval(btn.dataset.id, true));
    });

    this.root.querySelectorAll(".btn-refuse").forEach(btn => {
      btn.addEventListener("click", () => this.handleApproval(btn.dataset.id, false));
    });
  }

  getStatusColor(status) {
    const colors = {
      pending: 'amber',
      approved: 'emerald',
      refused: 'rose'
    };
    return colors[status] || 'gray';
  }

  async handleApproval(id, isApproved) {
  const action = isApproved ? "accepter" : "refuser";
  const confirmed = await confirm(`Voulez-vous vraiment ${action} cette demande de dette ?`);

  if (!confirmed) return;

  const statut = isApproved ? "approved" : "refused";
   if (isApproved) {
    await this.detteService.validerDemande(id); // Valide la demande
    console.log(`Demande ${id} approuvée.`);
  } else {
    await this.detteService.refuserDemande(id); // Refuse la demande
    console.log(`Demande ${id} refusée.`);
  }

  // Recharge la liste après validation
//   this.render();
}
}
